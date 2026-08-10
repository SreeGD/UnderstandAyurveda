import { computeConfidence } from './confidence'
import { accumulate, normalise } from './score'
import { classifyShape } from './shape'
import { computeSubProfiles } from './subProfiles'
import { InsufficientResponsesError, type DoshaProfile, type ScoringInput } from './types'

/**
 * Turn assessment responses into a dosha profile.
 *
 * Pure and deterministic: no clock, no randomness, no ambient state. Identical
 * input always produces identical output (invariant S5) — which is what makes
 * the score breakdown checkable rather than merely plausible.
 *
 * See contracts/scoring-contract.md for the full invariant list.
 */
export function scoreAssessment(input: ScoringInput): DoshaProfile {
  const accumulation = accumulate(input)

  if (accumulation.answeredCount === 0) {
    // Never fabricate a blend from nothing (invariant S2).
    throw new InsufficientResponsesError()
  }

  const percentages = normalise(accumulation.rawTotals)
  const { shape, dominant } = classifyShape(percentages, input.config)
  const subProfiles = computeSubProfiles(input)

  const confidence = computeConfidence({
    accumulation,
    percentages,
    subProfiles,
    scoringInput: input,
    config: input.config,
    shape,
  })

  return {
    percentages,
    dominant,
    shape,
    confidence,
    breakdown: accumulation.breakdown,
    subProfiles,
    rawTotals: accumulation.rawTotals,
    answeredCount: accumulation.answeredCount,
    totalCount: accumulation.totalCount,
  }
}

export { accumulate, normalise } from './score'
export { classifyShape, describeShape } from './shape'
export { computeSubProfiles, subProfileDivergence, CATEGORY_LABELS } from './subProfiles'
export {
  computeConfidence,
  countContradictions,
  triggeredContradictions,
  CONFIDENCE_LABELS,
  CONFIDENCE_BLURB,
} from './confidence'
export {
  DOSHA_LABELS,
  InsufficientResponsesError,
  UnknownOptionError,
  doshaProfileSchema,
  type Confidence,
  type DoshaProfile,
  type ScoreContribution,
  type ScoringInput,
} from './types'
