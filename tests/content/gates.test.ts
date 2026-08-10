import { describe, expect, it } from 'vitest'
import { content as realContent } from '../../src/content'
import { validateContent, type ContentBundle } from '../../src/content/validate'
import { scanText } from '../../src/content/lint/medicalSafety'

/**
 * Every gate is tested in BOTH directions: it passes on the real corpus, and it
 * fails on a crafted bad fixture.
 *
 * A gate that has only ever been observed to pass is a gate nobody has actually
 * tested — it could be a no-op and the build would look just as green.
 */

const bundle = (overrides: Partial<ContentBundle>): ContentBundle => ({
  ...realContent,
  ...overrides,
})

const gatesFired = (report: ReturnType<typeof validateContent>) =>
  new Set(report.failures.map((f) => f.gate))

describe('the real corpus passes every gate', () => {
  it('C1–C10 all clean', () => {
    const report = validateContent()
    expect(
      report.failures.map((f) => `${f.gate}: ${f.message}`),
      'the shipped content violates a gate'
    ).toEqual([])
  })

  it('reports non-trivial content counts', () => {
    const { counts } = validateContent()
    expect(counts.glossaryTerms).toBeGreaterThan(50)
    expect(counts.lessons).toBeGreaterThanOrEqual(11)
    expect(counts.quizQuestions).toBeGreaterThan(30)
    expect(counts.assessmentQuestions).toBeGreaterThan(50)
    expect(counts.recommendationRules).toBeGreaterThan(50)
    expect(counts.referenceEntries).toBeGreaterThan(40)
  })
})

describe('C1 — schema parse', () => {
  it('fails when a glossary term is missing a required field', () => {
    const broken = bundle({
      glossary: [{ ...realContent.glossary[0]!, term: '' }],
    })
    expect(gatesFired(validateContent(broken))).toContain('C1')
  })

  it('fails when an assessment option has a negative weight', () => {
    const question = realContent.assessmentQuestions[0]!
    const broken = bundle({
      assessmentQuestions: [
        {
          ...question,
          options: [{ ...question.options[0]!, weights: { vata: -1, pitta: 0, kapha: 0 } }],
        },
      ],
    })
    expect(gatesFired(validateContent(broken))).toContain('C1')
  })
})

describe('C2 — glossary term coverage (Principle I)', () => {
  it('fails on an unresolvable [[term]] reference', () => {
    const lesson = realContent.lessons[0]!
    const broken = bundle({
      lessons: [
        {
          ...lesson,
          body: [
            ...lesson.body,
            { kind: 'paragraph', text: 'This mentions [[nonsense-term]].', framing: true },
          ],
        },
      ],
    })
    const report = validateContent(broken)
    expect(gatesFired(report)).toContain('C2')
    expect(report.failures.some((f) => f.message.includes('nonsense-term'))).toBe(true)
  })

  it('fails on an unresolvable termIntro', () => {
    const lesson = realContent.lessons[0]!
    const broken = bundle({
      lessons: [{ ...lesson, body: [{ kind: 'termIntro', termId: 'not-a-real-term' }] }],
    })
    expect(gatesFired(validateContent(broken))).toContain('C2')
  })
})

describe('C3 — glossary term completeness (Principle I)', () => {
  it.each(['pronunciation', 'meaning', 'example'] as const)(
    'fails when %s is empty',
    (field) => {
      const broken = bundle({
        glossary: [{ ...realContent.glossary[0]!, [field]: '   ' }],
      })
      const report = validateContent(broken)
      // Empty strings also trip the schema, so accept either gate firing —
      // what matters is that it does not slip through.
      const gates = gatesFired(report)
      expect(gates.has('C3') || gates.has('C1')).toBe(true)
    }
  )
})

describe('C4 — source attribution (Principle III)', () => {
  it('fails on an unattributed claim block', () => {
    const lesson = realContent.lessons[0]!
    const broken = bundle({
      lessons: [
        {
          ...lesson,
          body: [
            { kind: 'heading', text: 'A new section' },
            { kind: 'paragraph', text: 'Ayurveda says something substantive here.' },
          ],
        },
      ],
    })
    const report = validateContent(broken)
    expect(gatesFired(report)).toContain('C4')
    expect(report.failures.some((f) => f.message.includes('unattributed'))).toBe(true)
  })

  it('passes when the block is marked as framing', () => {
    const lesson = realContent.lessons[0]!
    const ok = bundle({
      lessons: [
        {
          ...lesson,
          body: [
            { kind: 'heading', text: 'A new section' },
            { kind: 'paragraph', text: 'In this lesson you will see three things.', framing: true },
          ],
        },
      ],
    })
    expect(gatesFired(validateContent(ok))).not.toContain('C4')
  })

  it('passes when a sourceNote covers the section', () => {
    const lesson = realContent.lessons[0]!
    const ok = bundle({
      lessons: [
        {
          ...lesson,
          body: [
            { kind: 'heading', text: 'A new section' },
            {
              kind: 'sourceNote',
              source: { authority: 'Charaka Samhita', reference: 'Sutrasthana 1', claimType: 'classical' },
            },
            { kind: 'paragraph', text: 'A claim covered by the note above.' },
          ],
        },
      ],
    })
    expect(gatesFired(validateContent(ok))).not.toContain('C4')
  })

  it('stops inheriting a sourceNote at the next heading', () => {
    const lesson = realContent.lessons[0]!
    const broken = bundle({
      lessons: [
        {
          ...lesson,
          body: [
            { kind: 'heading', text: 'First section' },
            {
              kind: 'sourceNote',
              source: { authority: 'Charaka Samhita', reference: 'Sutrasthana 1', claimType: 'classical' },
            },
            { kind: 'paragraph', text: 'Covered.' },
            { kind: 'heading', text: 'Second section' },
            { kind: 'paragraph', text: 'Not covered — the note did not travel across the heading.' },
          ],
        },
      ],
    })
    expect(gatesFired(validateContent(broken))).toContain('C4')
  })
})

describe('C5 — contested claims must explain the disagreement', () => {
  it('fails when claimType is contested but no note is given', () => {
    const term = realContent.glossary[0]!
    const broken = bundle({
      glossary: [
        {
          ...term,
          source: { authority: 'Charaka Samhita', reference: 'Sutrasthana 1', claimType: 'contested' },
        },
      ],
    })
    const gates = gatesFired(validateContent(broken))
    expect(gates.has('C5') || gates.has('C1')).toBe(true)
  })
})

describe('C6 — every question explains itself', () => {
  it('fails when an incorrect option has no whyWrong', () => {
    const question = realContent.quizQuestions.find((q) => q.type === 'multiple-choice')!
    const broken = bundle({
      quizQuestions: [
        {
          ...question,
          options: question.options.map((o) =>
            o.id === question.correctAnswer ? o : { id: o.id, text: o.text }
          ),
        },
      ],
      quizzes: realContent.quizzes.filter((q) => q.questionIds.includes(question.id)).map((q) => ({
        ...q,
        questionIds: [question.id],
      })),
    })
    const report = validateContent(broken)
    expect(gatesFired(report)).toContain('C6')
    expect(report.failures.some((f) => f.message.includes('whyWrong'))).toBe(true)
  })

  it('fails when correctAnswer names an option that does not exist', () => {
    const question = realContent.quizQuestions.find((q) => q.type === 'multiple-choice')!
    const broken = bundle({
      quizQuestions: [{ ...question, correctAnswer: 'does-not-exist' }],
      quizzes: [],
    })
    expect(gatesFired(validateContent(broken))).toContain('C6')
  })
})

describe('C7 — referential integrity', () => {
  it('fails when a lesson points at a quiz that does not exist', () => {
    const lesson = realContent.lessons[0]!
    const broken = bundle({ lessons: [{ ...lesson, quizId: 'quiz-does-not-exist' }] })
    expect(gatesFired(validateContent(broken))).toContain('C7')
  })

  it('fails when a reference entry links a lesson that does not exist', () => {
    const entry = realContent.referenceEntries[0]!
    const broken = bundle({
      referenceEntries: [{ ...entry, linkedLessons: ['no-such-lesson'] }],
    })
    expect(gatesFired(validateContent(broken))).toContain('C7')
  })
})

describe('C8 — medical safety (Principle II, NON-NEGOTIABLE)', () => {
  it('fails on a dosage in a recommendation', () => {
    const rule = realContent.recommendationRules[0]!
    const broken = bundle({
      recommendationRules: [
        { ...rule, guidance: 'Have 500mg of this each morning with warm water.' },
      ],
    })
    const report = validateContent(broken)
    expect(gatesFired(report)).toContain('C8')
    expect(report.failures.some((f) => f.message.includes('dosage'))).toBe(true)
  })

  it.each([
    ['spoon measures', 'Add two teaspoons to hot water in the morning.'],
    ['a cure claim', 'This cures the underlying problem entirely.'],
    ['a treatment claim', 'A reliable treatment for digestive complaints.'],
    ['altering care', 'You can stop taking your medication once this settles.'],
    ['discouraging care', 'There is no need to see a doctor about this.'],
  ])('fails on %s', (_label, guidance) => {
    const rule = realContent.recommendationRules[0]!
    const broken = bundle({ recommendationRules: [{ ...rule, guidance }] })
    expect(gatesFired(validateContent(broken))).toContain('C8')
  })

  it('an allowLint annotation suppresses a specific pattern, visibly', () => {
    const rule = realContent.recommendationRules[0]!
    const broken = bundle({
      recommendationRules: [
        {
          ...rule,
          guidance: 'Classical sources describe this as a remedy for dryness in historical usage.',
          allowLint: {
            pattern: 'claim-treatment-for',
            justification: 'Historical description of what a classical source claimed, not guidance to the reader.',
            reviewedBy: 'test',
          },
        },
      ],
    })
    const report = validateContent(broken)
    expect(gatesFired(report)).not.toContain('C8')
    // The exception must remain visible in the report rather than disappearing.
    expect(report.declaredExceptions.join(' ')).toMatch(/claim-treatment-for/)
  })

  it('herb entries admit NO allowLint escape — the rule is absolute there', () => {
    const herb = realContent.referenceEntries.find((e) => e.category === 'herb')!
    const broken = bundle({
      referenceEntries: [
        {
          ...herb,
          body: [
            {
              kind: 'paragraph',
              text: 'Take 500mg twice daily with warm water.',
              source: { authority: 'x', reference: 'y', claimType: 'classical' },
              allowLint: {
                pattern: 'dosage-units',
                justification: 'An attempt to suppress a dosing finding on a herb entry.',
                reviewedBy: 'test',
              },
            },
          ],
        },
      ],
    })
    const report = validateContent(broken)
    expect(
      gatesFired(report),
      'an allowLint annotation must NOT be able to suppress dosing on a herb entry'
    ).toContain('C8')
  })

  it('the tightened treat pattern still catches real claims', () => {
    expect(scanText('A reliable treatment for skin complaints.', { location: 't' })).not.toEqual([])
    expect(scanText('This treats the condition at its root.', { location: 't' })).not.toEqual([])
    expect(scanText('Traditionally used to treat fatigue.', { location: 't' })).not.toEqual([])
  })

  it('and does not fire on innocent senses of the word', () => {
    expect(scanText('an occasional treat rather than a daily habit', { location: 't' })).toEqual([])
    expect(scanText('the error is treating a dosha as an identity', { location: 't' })).toEqual([])
    expect(scanText('Treat it as autumn instead.', { location: 't' })).toEqual([])
  })
})

describe('C9 — recommendation coverage', () => {
  it('fails when a life area has no guidance for a profile shape', () => {
    const broken = bundle({
      recommendationRules: realContent.recommendationRules.filter((r) => r.area !== 'movement'),
    })
    const report = validateContent(broken)
    expect(gatesFired(report)).toContain('C9')
    expect(report.failures.some((f) => f.message.includes('movement'))).toBe(true)
  })

  it('fails when balanced profiles are left with nothing', () => {
    const broken = bundle({
      recommendationRules: realContent.recommendationRules.filter(
        (r) => r.appliesWhen.dosha !== 'balanced'
      ),
    })
    expect(gatesFired(validateContent(broken))).toContain('C9')
  })
})

describe('C10 — weight and id sanity', () => {
  it('fails on an out-of-range reliability', () => {
    const question = realContent.assessmentQuestions[0]!
    const broken = bundle({ assessmentQuestions: [{ ...question, reliability: 9 }] })
    const gates = gatesFired(validateContent(broken))
    expect(gates.has('C10') || gates.has('C1')).toBe(true)
  })

  it('fails on duplicate content ids', () => {
    const term = realContent.glossary[0]!
    const broken = bundle({ glossary: [term, { ...term }] })
    expect(gatesFired(validateContent(broken))).toContain('C10')
  })

  it('fails on duplicate option ids within a question', () => {
    const question = realContent.assessmentQuestions[0]!
    const broken = bundle({
      assessmentQuestions: [
        { ...question, options: [question.options[0]!, { ...question.options[0]! }] },
      ],
    })
    expect(gatesFired(validateContent(broken))).toContain('C10')
  })
})
