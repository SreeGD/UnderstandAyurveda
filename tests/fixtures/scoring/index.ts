import type { AssessmentQuestion } from '../../../src/content/schema/assessment'
import type { Category } from '../../../src/content/schema/common'
import { scoringConfig } from '../../../src/content/config'
import type { ScoringInput } from '../../../src/domain/scoring/types'

/** Builds a synthetic three-option question with an explicit reliability. */
export function question(
  id: string,
  category: Category,
  reliability = 1
): AssessmentQuestion {
  return {
    id,
    assessmentType: 'prakriti',
    category,
    prompt: `Prompt for ${id}`,
    reliability,
    optional: false,
    options: [
      { id: `${id}-v`, text: `${id} vata answer`, weights: { vata: 1, pitta: 0, kapha: 0 } },
      { id: `${id}-p`, text: `${id} pitta answer`, weights: { vata: 0, pitta: 1, kapha: 0 } },
      { id: `${id}-k`, text: `${id} kapha answer`, weights: { vata: 0, pitta: 0, kapha: 1 } },
    ],
  }
}

/** A bank of `n` questions per category, all reliability 1 unless overridden. */
export function bank(perCategory = 4, reliability = 1): AssessmentQuestion[] {
  const categories: Category[] = ['physical', 'physiological', 'mental-emotional']
  return categories.flatMap((c) =>
    Array.from({ length: perCategory }, (_, i) => question(`${c}-${i}`, c, reliability))
  )
}

export function input(
  questions: AssessmentQuestion[],
  responses: Record<string, string>,
  contradictions?: ScoringInput['contradictions']
): ScoringInput {
  return {
    assessmentType: 'prakriti',
    questions,
    responses,
    config: scoringConfig,
    ...(contradictions ? { contradictions } : {}),
  }
}

/** Answers every question with the given dosha suffix. */
export function allAnswered(questions: AssessmentQuestion[], suffix: 'v' | 'p' | 'k') {
  return Object.fromEntries(questions.map((q) => [q.id, `${q.id}-${suffix}`]))
}

/** Cycles through the three doshas, producing an even three-way split. */
export function cycled(questions: AssessmentQuestion[]) {
  const suffixes = ['v', 'p', 'k'] as const
  return Object.fromEntries(
    questions.map((q, i) => [q.id, `${q.id}-${suffixes[i % 3]}`])
  )
}

// ---------------------------------------------------------------------------
// Named fixtures matching contracts/scoring-contract.md
// ---------------------------------------------------------------------------

export const fixtures = {
  /** 12 questions, all answered Vata. Expect 100/0/0. */
  pureVata: () => {
    const qs = bank()
    return input(qs, allAnswered(qs, 'v'))
  },

  pureP: () => {
    const qs = bank()
    return input(qs, allAnswered(qs, 'p'))
  },

  pureKapha: () => {
    const qs = bank()
    return input(qs, allAnswered(qs, 'k'))
  },

  /** Exact two-way tie: 6 Vata, 6 Pitta, 0 Kapha. */
  twoWayTie: () => {
    const qs = bank(4)
    const responses: Record<string, string> = {}
    qs.forEach((q, i) => {
      responses[q.id] = `${q.id}-${i % 2 === 0 ? 'v' : 'p'}`
    })
    return input(qs, responses)
  },

  /** Exact three-way tie: 4/4/4. */
  threeWayTie: () => {
    const qs = bank(4)
    return input(qs, cycled(qs))
  },

  /**
   * Near-tie inside the dual margin: 12 Vata, 11 Pitta, 2 Kapha out of 25
   * → roughly 48/44/8, an 4-point gap, inside the 8-point dual margin.
   */
  nearTie: () => {
    const qs = Array.from({ length: 25 }, (_, i) => question(`q-${i}`, 'physical'))
    const responses: Record<string, string> = {}
    qs.forEach((q, i) => {
      const suffix = i < 12 ? 'v' : i < 23 ? 'p' : 'k'
      responses[q.id] = `${q.id}-${suffix}`
    })
    return input(qs, responses)
  },

  /** Sparse: 5 of 50 answered. */
  sparse: () => {
    const qs = Array.from({ length: 50 }, (_, i) => question(`q-${i}`, 'physical'))
    const responses: Record<string, string> = {}
    for (let i = 0; i < 5; i++) responses[qs[i]!.id] = `${qs[i]!.id}-v`
    return input(qs, responses)
  },

  /** Exactly one question answered — the minimum that can produce a result. */
  singleAnswer: () => {
    const qs = bank()
    return input(qs, { [qs[0]!.id]: `${qs[0]!.id}-p` })
  },

  /** Nothing answered at all. Must throw. */
  noneAnswered: () => {
    const qs = bank()
    return input(qs, {})
  },

  /**
   * Sub-profiles in disagreement: physical answers all Kapha, mental answers
   * all Vata.
   */
  divergentSubProfiles: () => {
    const qs = bank(4)
    const responses: Record<string, string> = {}
    for (const q of qs) {
      const suffix =
        q.category === 'physical' ? 'k' : q.category === 'mental-emotional' ? 'v' : 'p'
      responses[q.id] = `${q.id}-${suffix}`
    }
    return input(qs, responses)
  },

  /** Two declared contradictions, both triggered. */
  contradictory: () => {
    const qs = bank(4)
    const [a, b, c, d] = qs
    const responses = allAnswered(qs, 'v')
    return input(qs, responses, [
      {
        questionId: a!.id,
        optionId: `${a!.id}-v`,
        withQuestionId: b!.id,
        withOptionId: `${b!.id}-v`,
        explanation: 'These two do not usually go together.',
      },
      {
        questionId: c!.id,
        optionId: `${c!.id}-v`,
        withQuestionId: d!.id,
        withOptionId: `${d!.id}-v`,
        explanation: 'Nor do these.',
      },
    ])
  },

  /** A response naming an option that does not exist. Must throw. */
  unknownOption: () => {
    const qs = bank()
    return input(qs, { [qs[0]!.id]: 'no-such-option' })
  },

  /** Weighted: high-reliability physical questions outvote low-reliability mental ones. */
  reliabilityWeighted: () => {
    const physical = Array.from({ length: 3 }, (_, i) => question(`phys-${i}`, 'physical', 2.0))
    const mental = Array.from({ length: 3 }, (_, i) =>
      question(`ment-${i}`, 'mental-emotional', 0.5)
    )
    const qs = [...physical, ...mental]
    const responses: Record<string, string> = {}
    for (const q of physical) responses[q.id] = `${q.id}-k`
    for (const q of mental) responses[q.id] = `${q.id}-v`
    return input(qs, responses)
  },
}
