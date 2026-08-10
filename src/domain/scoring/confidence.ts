import type { ScoringConfig } from '../../content/config'
import { DOSHAS, type Dosha } from '../../content/schema/common'
import type { Accumulation } from './score'
import type { ProfileShape } from './shape'
import {
  CATEGORY_LABELS,
  mostDivergentPair,
  subProfileDivergence,
  type SubProfileMap,
} from './subProfiles'
import { DOSHA_LABELS, type Confidence, type ScoringInput } from './types'

export interface ConfidenceInput {
  accumulation: Accumulation
  percentages: Record<Dosha, number>
  subProfiles: SubProfileMap
  scoringInput: ScoringInput
  config: ScoringConfig
  /**
   * The classified shape drives the closeness explanation directly.
   *
   * Deriving it from the separation signal instead let the two disagree: a
   * profile could be classified `dual` — which means "too close to call a clear
   * leader" — while confidence said nothing, because the numeric signal happened
   * to sit above its cutoff. Telling someone two patterns are running close
   * together and then not explaining why is exactly the opacity Principle IV
   * exists to prevent.
   */
  shape: ProfileShape
}

/**
 * Confidence is decomposed into three named signals rather than collapsed into
 * one number, because "low confidence" on its own tells the reader nothing they
 * can act on. Each weak signal produces a specific, plain sentence — and a `low`
 * verdict always carries at least one (invariant S8).
 */
export function computeConfidence(input: ConfidenceInput): Confidence {
  const { accumulation, percentages, subProfiles, scoringInput, config, shape } = input
  const reasons: string[] = []

  // --- Completeness: did we get enough to work with? ---
  const completeness =
    accumulation.weightedTotal === 0
      ? 0
      : accumulation.weightedAnswered / accumulation.weightedTotal

  const skipped = accumulation.totalCount - accumulation.answeredCount
  if (completeness < config.confidence.lowCutoff) {
    reasons.push(
      `You answered ${accumulation.answeredCount} of ${accumulation.totalCount} questions. With this many left out, the result is a rough sketch rather than a reading.`
    )
  } else if (completeness < config.confidence.highCutoff && skipped > 0) {
    reasons.push(
      `You skipped ${skipped} question${skipped === 1 ? '' : 's'}, which makes this result less reliable than it could be.`
    )
  }

  // --- Separation: is anything actually leading? ---
  const ranked = [...DOSHAS].sort((a, b) => percentages[b] - percentages[a])
  const margin = percentages[ranked[0]!] - percentages[ranked[1]!]
  const separation = Math.min(1, margin / config.dualDoshaMarginPoints)

  // Driven by the classified shape, not by the numeric cutoff, so the
  // explanation can never contradict the headline (see ConfidenceInput.shape).
  if (shape === 'tridoshic') {
    reasons.push(
      'All three patterns came out close together, so no single one is clearly leading. That is a real result, not an error — but it means the numbers should be read loosely.'
    )
  } else if (shape === 'dual') {
    reasons.push(
      `${DOSHA_LABELS[ranked[0]!]} and ${DOSHA_LABELS[ranked[1]!]} are only ${margin} point${margin === 1 ? '' : 's'} apart, which is too close to call a clear leader.`
    )
  }

  // --- Consistency: do your answers agree with each other? ---
  const divergence = subProfileDivergence(subProfiles)
  let consistency = 1 - divergence

  const triggered = countContradictions(scoringInput)
  consistency = Math.max(0, consistency - triggered * config.contradictionPenalty)

  if (divergence > 0.5) {
    const pair = mostDivergentPair(subProfiles)
    if (pair) {
      reasons.push(
        `Your ${CATEGORY_LABELS[pair.a]} answers point towards ${DOSHA_LABELS[pair.aTop]} while your ${CATEGORY_LABELS[pair.b]} answers point towards ${DOSHA_LABELS[pair.bTop]}. That is common, and often worth more attention than the headline number.`
      )
    }
  }

  if (triggered > 0) {
    reasons.push(
      `${triggered} pair${triggered === 1 ? '' : 's'} of your answers describe things that do not usually go together. You can review them in the breakdown below.`
    )
  }

  // --- Band ---
  const signals = { completeness, separation, consistency }
  const values = [completeness, separation, consistency]
  const { highCutoff, lowCutoff } = config.confidence

  let level: Confidence['level']
  if (values.some((v) => v < lowCutoff)) {
    level = 'low'
  } else if (values.every((v) => v >= highCutoff)) {
    level = 'high'
  } else {
    level = 'moderate'
  }

  // A low grade must always say why. If the numeric signals dipped without
  // producing a sentence, add a general one rather than leaving the user with
  // an unexplained verdict.
  if (level === 'low' && reasons.length === 0) {
    reasons.push(
      'Your answers did not give this assessment enough to distinguish the three patterns clearly.'
    )
  }

  return { level, signals, reasons }
}

/** Counts declared contradiction pairs that the user actually triggered. */
export function countContradictions(input: ScoringInput): number {
  if (!input.contradictions) return 0
  let count = 0
  for (const c of input.contradictions) {
    if (
      input.responses[c.questionId] === c.optionId &&
      input.responses[c.withQuestionId] === c.withOptionId
    ) {
      count += 1
    }
  }
  return count
}

/** The triggered contradictions themselves, for display in the breakdown. */
export function triggeredContradictions(input: ScoringInput) {
  if (!input.contradictions) return []
  return input.contradictions.filter(
    (c) =>
      input.responses[c.questionId] === c.optionId &&
      input.responses[c.withQuestionId] === c.withOptionId
  )
}

export const CONFIDENCE_LABELS: Record<Confidence['level'], string> = {
  high: 'Strong',
  moderate: 'Moderate',
  low: 'Weak',
}

export const CONFIDENCE_BLURB: Record<Confidence['level'], string> = {
  high: 'Your answers were complete, consistent, and clearly differentiated.',
  moderate: 'This is a usable reading, with some caveats worth knowing.',
  low: 'Treat this as a first sketch. The notes below explain what held it back.',
}
