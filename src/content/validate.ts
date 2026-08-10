/**
 * Content gates C1–C10. See contracts/content-schema.md.
 *
 * These are what turn three constitutional principles from aspirations into
 * build failures:
 *   - Principle I  → C2, C3 (every term glossed, completely)
 *   - Principle II → C8     (no dosing, no treatment claims, no altering care)
 *   - Principle III→ C4, C5 (every claim attributed, honestly)
 *
 * Exported as a library so both `npm run validate:content` and the test suite
 * run exactly the same checks.
 */

import { content as realContent } from './index'
import { scanStrings, scanText, type SafetyViolation } from './lint/medicalSafety'
import {
  CLAIM_BEARING_KINDS,
  extractStrings,
  extractTermRefs,
  type ContentBlock,
} from './schema/blocks'
import { assessmentQuestionSchema, contradictionSchema, redFlagQuestionSchema } from './schema/assessment'
import { glossaryTermSchema } from './schema/glossary'
import { lessonSchema } from './schema/lesson'
import { quizQuestionSchema, quizSchema } from './schema/quiz'
import { recommendationRuleSchema } from './schema/recommendation'
import { referenceEntrySchema } from './schema/reference'
import { LIFE_AREAS } from './schema/common'

export interface GateFailure {
  gate: string
  message: string
}

export interface ValidationReport {
  failures: GateFailure[]
  /** Declared lint exceptions, surfaced so they stay visible in review. */
  declaredExceptions: string[]
  counts: Record<string, number>
}

const fail = (gate: string, message: string): GateFailure => ({ gate, message })

// ---------------------------------------------------------------------------
// C1 — every content module parses against its schema
// ---------------------------------------------------------------------------

function gateC1(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []

  const check = <T>(label: string, items: T[], schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } }) => {
    items.forEach((item, i) => {
      const result = schema.safeParse(item)
      if (!result.success) {
        const id = (item as { id?: string }).id ?? `index ${i}`
        failures.push(fail('C1', `${label} "${id}" failed schema validation: ${formatZodError(result.error)}`))
      }
    })
  }

  check('glossary term', content.glossary, glossaryTermSchema)
  check('lesson', content.lessons, lessonSchema)
  check('quiz', content.quizzes, quizSchema)
  check('quiz question', content.quizQuestions, quizQuestionSchema)
  check('assessment question', content.assessmentQuestions, assessmentQuestionSchema)
  check('contradiction', content.contradictions, contradictionSchema)
  check('red flag question', content.redFlagQuestions, redFlagQuestionSchema)
  check('recommendation rule', content.recommendationRules, recommendationRuleSchema)
  check('reference entry', content.referenceEntries, referenceEntrySchema)

  return failures
}

function formatZodError(error: unknown): string {
  if (error && typeof error === 'object' && 'issues' in error) {
    const issues = (error as { issues: Array<{ path: unknown[]; message: string }> }).issues
    return issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`).join('; ')
  }
  return String(error)
}

// ---------------------------------------------------------------------------
// C2 — every [[term-id]] resolves to a glossary entry
// ---------------------------------------------------------------------------

function gateC2(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []
  const known = new Set(content.glossary.map((t) => t.id))

  const checkBlocks = (label: string, blocks: ContentBlock[]) => {
    for (const block of blocks) {
      for (const ref of extractTermRefs(block)) {
        if (!known.has(ref)) {
          failures.push(
            fail('C2', `${label} references unknown glossary term "${ref}" — add it or fix the id`)
          )
        }
      }
    }
  }

  for (const lesson of content.lessons) checkBlocks(`lesson "${lesson.id}"`, lesson.body)
  for (const entry of content.referenceEntries) checkBlocks(`reference "${entry.id}"`, entry.body)
  checkBlocks('onboarding', content.onboarding.body)

  return failures
}

// ---------------------------------------------------------------------------
// C3 — every glossary term is completely explained
// ---------------------------------------------------------------------------

function gateC3(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []
  for (const term of content.glossary) {
    if (!term.pronunciation?.trim())
      failures.push(fail('C3', `glossary term "${term.id}" has no pronunciation`))
    if (!term.meaning?.trim())
      failures.push(fail('C3', `glossary term "${term.id}" has no plain-English meaning`))
    if (!term.example?.trim())
      failures.push(fail('C3', `glossary term "${term.id}" has no everyday example`))
  }
  return failures
}

// ---------------------------------------------------------------------------
// C4 — every substantive claim carries or inherits an attribution
// C5 — contested claims explain the disagreement
// ---------------------------------------------------------------------------

function gateC4andC5(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []

  const checkBlocks = (label: string, blocks: ContentBlock[]) => {
    // A sourceNote covers subsequent blocks until the next heading.
    let sectionSource = false

    blocks.forEach((block, i) => {
      if (block.kind === 'heading') {
        sectionSource = false
        return
      }
      if (block.kind === 'sourceNote') {
        sectionSource = true
        checkAttribution(label, `block ${i}`, block.source, failures)
        return
      }
      if (block.kind === 'termIntro') return

      if (!(CLAIM_BEARING_KINDS as readonly string[]).includes(block.kind)) return

      const hasOwn = 'source' in block && block.source !== undefined
      const isFraming = 'framing' in block && block.framing === true

      if (!hasOwn && !isFraming && !sectionSource) {
        failures.push(
          fail(
            'C4',
            `${label} block ${i} (${block.kind}) makes an unattributed claim. ` +
              `Add a source, place a sourceNote in the section, or mark framing: true if it makes no claim.`
          )
        )
      }

      if (hasOwn && block.source) checkAttribution(label, `block ${i}`, block.source, failures)
    })
  }

  for (const lesson of content.lessons) checkBlocks(`lesson "${lesson.id}"`, lesson.body)
  for (const entry of content.referenceEntries) {
    checkBlocks(`reference "${entry.id}"`, entry.body)
    checkAttribution(`reference "${entry.id}"`, 'entry source', entry.source, failures)
  }
  checkBlocks('onboarding', content.onboarding.body)

  for (const term of content.glossary)
    checkAttribution(`glossary "${term.id}"`, 'source', term.source, failures)
  for (const rule of content.recommendationRules)
    checkAttribution(`recommendation "${rule.id}"`, 'source', rule.source, failures)

  return failures
}

function checkAttribution(
  label: string,
  where: string,
  source: { authority: string; reference: string; claimType: string; note?: string },
  failures: GateFailure[]
) {
  if (!source.authority?.trim() || !source.reference?.trim()) {
    failures.push(fail('C4', `${label} ${where}: attribution needs both an authority and a locatable reference`))
  }
  if (source.claimType === 'contested' && !source.note?.trim()) {
    failures.push(
      fail('C5', `${label} ${where}: claimType "contested" requires a note saying how the sources differ`)
    )
  }
}

// ---------------------------------------------------------------------------
// C6 — every question explains itself
// ---------------------------------------------------------------------------

function gateC6(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []

  for (const q of content.quizQuestions) {
    if (!q.whyCorrect?.trim()) {
      failures.push(fail('C6', `quiz question "${q.id}" has no whyCorrect explanation`))
    }

    if (q.type === 'matching') continue

    const correct = new Set(
      Array.isArray(q.correctAnswer) ? q.correctAnswer : q.correctAnswer ? [q.correctAnswer] : []
    )

    if (correct.size === 0) {
      failures.push(fail('C6', `quiz question "${q.id}" has no correctAnswer`))
      continue
    }

    for (const id of correct) {
      if (!q.options.some((o) => o.id === id)) {
        failures.push(fail('C6', `quiz question "${q.id}" correctAnswer "${id}" is not one of its options`))
      }
    }

    for (const option of q.options) {
      if (correct.has(option.id)) continue
      if (!option.whyWrong?.trim()) {
        failures.push(
          fail(
            'C6',
            `quiz question "${q.id}" option "${option.id}" is incorrect but has no whyWrong. ` +
              `Explaining why a wrong answer is wrong is where the learning happens.`
          )
        )
      }
    }
  }

  return failures
}

// ---------------------------------------------------------------------------
// C7 — every cross-reference resolves
// ---------------------------------------------------------------------------

function gateC7(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []

  const lessonIds = new Set(content.lessons.map((l) => l.id))
  const quizIds = new Set(content.quizzes.map((q) => q.id))
  const questionIds = new Set(content.quizQuestions.map((q) => q.id))
  const termIds = new Set(content.glossary.map((t) => t.id))
  const entryIds = new Set(content.referenceEntries.map((e) => e.id))
  const assessmentIds = new Set(content.assessmentQuestions.map((q) => q.id))

  const need = (ok: boolean, msg: string) => {
    if (!ok) failures.push(fail('C7', msg))
  }

  for (const lesson of content.lessons) {
    need(quizIds.has(lesson.quizId), `lesson "${lesson.id}" points at unknown quiz "${lesson.quizId}"`)
    for (const p of lesson.prerequisiteConcepts) {
      if (p.lessonId) need(lessonIds.has(p.lessonId), `lesson "${lesson.id}" prerequisite lesson "${p.lessonId}" not found`)
      if (p.termId) need(termIds.has(p.termId), `lesson "${lesson.id}" prerequisite term "${p.termId}" not found`)
    }
  }

  for (const quiz of content.quizzes) {
    need(lessonIds.has(quiz.lessonId), `quiz "${quiz.id}" points at unknown lesson "${quiz.lessonId}"`)
    for (const qid of quiz.questionIds) {
      need(questionIds.has(qid), `quiz "${quiz.id}" lists unknown question "${qid}"`)
    }
  }

  for (const q of content.quizQuestions) {
    need(lessonIds.has(q.lessonId), `quiz question "${q.id}" points at unknown lesson "${q.lessonId}"`)
  }

  for (const term of content.glossary) {
    for (const r of term.relatedTerms) need(termIds.has(r), `glossary "${term.id}" relates to unknown term "${r}"`)
    for (const l of term.taughtIn) need(lessonIds.has(l), `glossary "${term.id}" taughtIn unknown lesson "${l}"`)
  }

  for (const entry of content.referenceEntries) {
    for (const r of entry.relatedEntries)
      need(entryIds.has(r), `reference "${entry.id}" relates to unknown entry "${r}"`)
    for (const l of entry.linkedLessons)
      need(lessonIds.has(l), `reference "${entry.id}" links unknown lesson "${l}"`)
  }

  for (const c of content.contradictions) {
    need(assessmentIds.has(c.questionId), `contradiction references unknown question "${c.questionId}"`)
    need(
      assessmentIds.has(c.withQuestionId),
      `contradiction references unknown question "${c.withQuestionId}"`
    )
  }

  return failures
}

// ---------------------------------------------------------------------------
// C8 — medical safety (Principle II, NON-NEGOTIABLE)
// ---------------------------------------------------------------------------

function gateC8(content: ContentBundle): { failures: GateFailure[]; exceptions: string[] } {
  const failures: GateFailure[] = []
  const exceptions: string[] = []
  const violations: SafetyViolation[] = []

  const record = (v: SafetyViolation[]) => violations.push(...v)

  for (const rule of content.recommendationRules) {
    if (rule.allowLint) {
      exceptions.push(
        `recommendation "${rule.id}" allows "${rule.allowLint.pattern}" — ${rule.allowLint.justification} (reviewed by ${rule.allowLint.reviewedBy})`
      )
    }
    record(
      scanStrings([rule.guidance, rule.because], {
        location: `recommendation "${rule.id}"`,
        allowLint: rule.allowLint,
      })
    )
  }

  for (const entry of content.referenceEntries) {
    // Herb entries: the lint is absolute. No allowLint escape (FR-036).
    const noEscapeHatch = entry.category === 'herb'
    record(
      scanStrings([entry.name, entry.summary], {
        location: `reference "${entry.id}"`,
        noEscapeHatch,
      })
    )
    for (const block of entry.body) {
      record(
        scanStrings(extractStrings(block), {
          location: `reference "${entry.id}" body`,
          allowLint: 'allowLint' in block ? block.allowLint : undefined,
          noEscapeHatch,
        })
      )
    }
  }

  for (const lesson of content.lessons) {
    // Title and summary are user-facing too — scanning only block bodies left a
    // gap that a lesson summary could walk straight through.
    record(scanStrings([lesson.title, lesson.summary], { location: `lesson "${lesson.id}"` }))
    for (const block of lesson.body) {
      record(
        scanStrings(extractStrings(block), {
          location: `lesson "${lesson.id}"`,
          allowLint: 'allowLint' in block ? block.allowLint : undefined,
        })
      )
    }
  }

  for (const block of content.onboarding.body) {
    record(
      scanStrings(extractStrings(block), {
        location: 'onboarding',
        allowLint: 'allowLint' in block ? block.allowLint : undefined,
      })
    )
  }

  for (const term of content.glossary) {
    record(scanStrings([term.meaning, term.example], { location: `glossary "${term.id}"` }))
  }

  for (const q of content.quizQuestions) {
    record(
      scanStrings(
        [q.prompt, q.whyCorrect, ...q.options.flatMap((o) => [o.text, o.whyWrong ?? ''])],
        { location: `quiz question "${q.id}"` }
      )
    )
  }

  for (const q of content.assessmentQuestions) {
    record(
      scanStrings([q.prompt, q.helpText ?? '', ...q.options.map((o) => o.text)], {
        location: `assessment question "${q.id}"`,
      })
    )
  }

  for (const notice of content.planNotices) {
    record(scanText(notice.text, { location: `plan notice "${notice.id}"` }))
  }

  for (const v of violations) {
    failures.push(
      fail(
        'C8',
        `${v.location}: [${v.category}/${v.patternId}] matched "${v.matched}" — ${v.explanation}\n      in: "${v.text}"`
      )
    )
  }

  return { failures, exceptions }
}

// ---------------------------------------------------------------------------
// C9 — recommendation coverage across every profile shape
// ---------------------------------------------------------------------------

const CANONICAL_SHAPES = ['vata', 'pitta', 'kapha', 'balanced'] as const

function gateC9(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []

  for (const shape of CANONICAL_SHAPES) {
    for (const area of LIFE_AREAS) {
      const matching = content.recommendationRules.filter((r) => {
        if (r.area !== area) return false
        if (shape === 'balanced') return r.appliesWhen.dosha === 'balanced'
        return r.appliesWhen.dosha === shape || r.appliesWhen.dosha === 'balanced'
      })
      if (matching.length === 0) {
        failures.push(
          fail(
            'C9',
            `no "${area}" guidance exists for a ${shape}-dominant profile — every profile shape must get all five areas (FR-031)`
          )
        )
      }
    }
  }

  return failures
}

// ---------------------------------------------------------------------------
// C10 — weight and reliability sanity
// ---------------------------------------------------------------------------

function gateC10(content: ContentBundle): GateFailure[] {
  const failures: GateFailure[] = []

  for (const q of content.assessmentQuestions) {
    if (q.reliability < 0.5 || q.reliability > 2.0) {
      failures.push(fail('C10', `assessment question "${q.id}" reliability ${q.reliability} is outside 0.5–2.0`))
    }
    for (const option of q.options) {
      const { vata, pitta, kapha } = option.weights
      if (vata < 0 || pitta < 0 || kapha < 0) {
        failures.push(fail('C10', `assessment question "${q.id}" option "${option.id}" has a negative weight`))
      }
      if (vata + pitta + kapha === 0) {
        failures.push(
          fail('C10', `assessment question "${q.id}" option "${option.id}" has no positive weight — it can never score`)
        )
      }
    }
    const ids = q.options.map((o) => o.id)
    if (new Set(ids).size !== ids.length) {
      failures.push(fail('C10', `assessment question "${q.id}" has duplicate option ids`))
    }
  }

  const allIds = [
    ...content.glossary.map((t) => `glossary:${t.id}`),
    ...content.lessons.map((l) => `lesson:${l.id}`),
    ...content.quizQuestions.map((q) => `question:${q.id}`),
    ...content.assessmentQuestions.map((q) => `assessment:${q.id}`),
    ...content.referenceEntries.map((e) => `reference:${e.id}`),
    ...content.recommendationRules.map((r) => `rule:${r.id}`),
  ]
  const seen = new Set<string>()
  for (const id of allIds) {
    if (seen.has(id)) failures.push(fail('C10', `duplicate content id: ${id}`))
    seen.add(id)
  }

  return failures
}

// ---------------------------------------------------------------------------

export type ContentBundle = typeof realContent

/**
 * Content is injectable so the gate tests can prove each gate FAILS on a crafted
 * bad fixture. A gate that has only ever been seen to pass is a gate nobody has
 * tested (quickstart.md says this out loud).
 */
export function validateContent(content: ContentBundle = realContent): ValidationReport {
  const c8 = gateC8(content)

  const failures = [
    ...gateC1(content),
    ...gateC2(content),
    ...gateC3(content),
    ...gateC4andC5(content),
    ...gateC6(content),
    ...gateC7(content),
    ...c8.failures,
    ...gateC9(content),
    ...gateC10(content),
  ]

  return {
    failures,
    declaredExceptions: c8.exceptions,
    counts: {
      glossaryTerms: content.glossary.length,
      lessons: content.lessons.length,
      quizQuestions: content.quizQuestions.length,
      assessmentQuestions: content.assessmentQuestions.length,
      recommendationRules: content.recommendationRules.length,
      referenceEntries: content.referenceEntries.length,
    },
  }
}
