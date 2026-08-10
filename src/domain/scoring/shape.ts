import type { ScoringConfig } from '../../content/config'
import { DOSHAS, type Dosha } from '../../content/schema/common'

export type ProfileShape = 'single' | 'dual' | 'tridoshic'

export interface ShapeResult {
  shape: ProfileShape
  /** Ordered descending. Never empty, never longer than 3 (invariants S6, S7). */
  dominant: Dosha[]
}

/**
 * Step 3: decide whether this is one pattern, two, or all three.
 *
 * The rule that matters: exact ties are reported as ties. Nothing here breaks a
 * tie to produce a tidier answer — not by array index, not by a canonical
 * ordering, not by "whichever the user picked more of first". A questionnaire
 * that manufactures a single winner from a genuine 33/33/34 is lying to make the
 * output look confident (FR-022).
 */
export function classifyShape(
  percentages: Record<Dosha, number>,
  config: ScoringConfig
): ShapeResult {
  const ranked = [...DOSHAS].sort((a, b) => percentages[b] - percentages[a])

  const top = ranked[0]!
  const second = ranked[1]!
  const third = ranked[2]!

  const max = percentages[top]
  const min = percentages[third]

  if (max - min <= config.triDoshicSpreadPoints) {
    return { shape: 'tridoshic', dominant: ranked }
  }

  if (percentages[top] - percentages[second] <= config.dualDoshaMarginPoints) {
    return { shape: 'dual', dominant: [top, second] }
  }

  return { shape: 'single', dominant: [top] }
}

/** Plain-language description of the shape, for the results screen. */
export function describeShape(
  shape: ProfileShape,
  dominant: Dosha[],
  labels: Record<Dosha, string>
): string {
  const names = dominant.map((d) => labels[d])

  if (shape === 'tridoshic') {
    return 'All three patterns are close together in your answers. This is usually called tri-doshic — no single pattern is clearly leading.'
  }
  if (shape === 'dual') {
    return `Two patterns are running close together: ${names[0]} and ${names[1]}. Neither is clearly ahead, so it makes sense to read both.`
  }
  return `${names[0]} is leading clearly in your answers — but you have all three, and the other two still shape how you are.`
}
