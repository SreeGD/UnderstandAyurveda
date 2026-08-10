import type { DoshaVector, Dosha } from '../../content/schema/common'
import { DOSHAS } from '../../content/schema/common'
import type { ScoreContribution, ScoringInput } from './types'
import { UnknownOptionError } from './types'

export interface Accumulation {
  rawTotals: DoshaVector
  breakdown: ScoreContribution[]
  answeredCount: number
  totalCount: number
  /** Reliability-weighted answered / total, for the completeness signal. */
  weightedAnswered: number
  weightedTotal: number
}

/**
 * Step 1: accumulate weighted points per dosha, recording a contribution for
 * EVERY question — answered or not. Skipped questions appear in the breakdown
 * with a null answer and zero points, so the user can see what they left out
 * (invariant S3).
 */
export function accumulate(input: ScoringInput): Accumulation {
  const rawTotals: DoshaVector = { vata: 0, pitta: 0, kapha: 0 }
  const breakdown: ScoreContribution[] = []
  let answeredCount = 0
  let weightedAnswered = 0
  let weightedTotal = 0

  for (const question of input.questions) {
    weightedTotal += question.reliability
    const optionId = input.responses[question.id]

    if (optionId === undefined) {
      breakdown.push({
        questionId: question.id,
        questionPrompt: question.prompt,
        answerText: null,
        reliability: question.reliability,
        points: { vata: 0, pitta: 0, kapha: 0 },
      })
      continue
    }

    const option = question.options.find((o) => o.id === optionId)
    if (!option) {
      // A response referencing an option that does not exist is a bug or
      // tampered storage. Throwing beats silently scoring it as zero.
      throw new UnknownOptionError(question.id, optionId)
    }

    const points: DoshaVector = {
      vata: option.weights.vata * question.reliability,
      pitta: option.weights.pitta * question.reliability,
      kapha: option.weights.kapha * question.reliability,
    }

    for (const d of DOSHAS) rawTotals[d] += points[d]

    answeredCount += 1
    weightedAnswered += question.reliability

    breakdown.push({
      questionId: question.id,
      questionPrompt: question.prompt,
      answerText: option.text,
      reliability: question.reliability,
      points,
    })
  }

  return {
    rawTotals,
    breakdown,
    answeredCount,
    totalCount: input.questions.length,
    weightedAnswered,
    weightedTotal,
  }
}

/**
 * Step 2: normalise to integer percentages that sum to exactly 100, using
 * largest-remainder. Plain rounding produces visible drift ("your result adds up
 * to 101%"), which undermines the one thing this screen has to be: trustworthy.
 */
export function normalise(totals: DoshaVector): Record<Dosha, number> {
  const sum = totals.vata + totals.pitta + totals.kapha
  if (sum === 0) return { vata: 0, pitta: 0, kapha: 0 }

  const exact = DOSHAS.map((d) => ({ dosha: d, value: (totals[d] / sum) * 100 }))
  const floors = exact.map((e) => ({ ...e, floor: Math.floor(e.value), rem: e.value - Math.floor(e.value) }))

  let assigned = floors.reduce((acc, f) => acc + f.floor, 0)
  const result: Record<Dosha, number> = {
    vata: floors[0]!.floor,
    pitta: floors[1]!.floor,
    kapha: floors[2]!.floor,
  }

  // Distribute the remaining points to the largest remainders. Ties broken by
  // the fixed dosha order, which is stable and therefore reproducible.
  const order = [...floors].sort((a, b) => b.rem - a.rem)
  let i = 0
  while (assigned < 100) {
    const target = order[i % order.length]!
    result[target.dosha] += 1
    assigned += 1
    i += 1
  }

  return result
}
