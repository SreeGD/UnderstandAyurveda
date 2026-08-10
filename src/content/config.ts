/**
 * Thresholds live in content, not code, so they are inspectable and tunable
 * without a code review — and so the results UI can quote the actual numbers it
 * used rather than hardcoding a description of them (Principle IV).
 */
export interface ScoringConfig {
  /** Top two doshas within this many points → dual-dosha. */
  dualDoshaMarginPoints: number
  /** Max minus min within this many points → tri-doshic. */
  triDoshicSpreadPoints: number
  /** Vikriti minus prakriti at or beyond this → elevated / diminished. */
  elevationDeltaPoints: number
  confidence: {
    /** A signal at or above this counts as strong. */
    highCutoff: number
    /** A signal below this counts as weak and produces a stated reason. */
    lowCutoff: number
  }
  /** Penalty applied to the consistency signal per triggered contradiction. */
  contradictionPenalty: number
}

export const scoringConfig: ScoringConfig = {
  dualDoshaMarginPoints: 8,
  triDoshicSpreadPoints: 10,
  elevationDeltaPoints: 10,
  confidence: {
    highCutoff: 0.75,
    lowCutoff: 0.45,
  },
  contradictionPenalty: 0.15,
}

/**
 * Leitner intervals in days, indexed by box. Box 0 repeats within the same
 * session; box 4 is the longest spacing. Simple enough to explain to the user,
 * which matters in an app whose whole posture is "we show you how it works"
 * (research.md R8).
 */
export const LEITNER_INTERVALS_DAYS = [0, 1, 3, 7, 21] as const
export const MAX_LEITNER_BOX = LEITNER_INTERVALS_DAYS.length - 1

/** Mastery bands derived from the reliability-weighted mean box level. */
export const MASTERY_BANDS = [
  { level: 'not-started', label: 'Not started', min: -1 },
  { level: 'learning', label: 'Learning', min: 0 },
  { level: 'familiar', label: 'Familiar', min: 1.5 },
  { level: 'confident', label: 'Confident', min: 2.5 },
  { level: 'mastered', label: 'Mastered', min: 3.5 },
] as const

export type MasteryLevel = (typeof MASTERY_BANDS)[number]['level']
