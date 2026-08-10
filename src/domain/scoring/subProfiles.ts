import { CATEGORIES, DOSHAS, type Category, type Dosha, type DoshaVector } from '../../content/schema/common'
import { normalise } from './score'
import type { ScoringInput } from './types'

export type SubProfileMap = Record<string, DoshaVector>

/**
 * Step 4: score each category independently.
 *
 * This is what lets the app say something genuinely useful and slightly
 * uncomfortable: "your physical answers point one way and your mental answers
 * point another." A single blended number hides that; showing it gives the
 * reader something real to think about, and it drives the consistency signal.
 */
export function computeSubProfiles(input: ScoringInput): SubProfileMap {
  const out: SubProfileMap = {}

  for (const category of CATEGORIES) {
    const questions = input.questions.filter((q) => q.category === category)
    if (questions.length === 0) continue

    const totals: DoshaVector = { vata: 0, pitta: 0, kapha: 0 }
    let answered = 0

    for (const question of questions) {
      const optionId = input.responses[question.id]
      if (optionId === undefined) continue
      const option = question.options.find((o) => o.id === optionId)
      if (!option) continue
      for (const d of DOSHAS) totals[d] += option.weights[d] * question.reliability
      answered += 1
    }

    if (answered === 0) continue
    const pct = normalise(totals)
    out[category] = { vata: pct.vata, pitta: pct.pitta, kapha: pct.kapha }
  }

  return out
}

/**
 * Mean pairwise distance between the sub-profile vectors, normalised to 0..1.
 * 0 means every category agrees; 1 means maximum possible disagreement.
 */
export function subProfileDivergence(subProfiles: SubProfileMap): number {
  const vectors = Object.values(subProfiles)
  if (vectors.length < 2) return 0

  // Two 100-point vectors can differ by at most 200 across three components
  // (e.g. 100/0/0 vs 0/100/0), so that is the normalising constant.
  const MAX_DISTANCE = 200

  let total = 0
  let pairs = 0

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      const a = vectors[i]!
      const b = vectors[j]!
      const distance = DOSHAS.reduce((acc, d) => acc + Math.abs(a[d] - b[d]), 0)
      total += distance
      pairs += 1
    }
  }

  return pairs === 0 ? 0 : Math.min(1, total / pairs / MAX_DISTANCE)
}

/** Names the two categories that disagree most, for a user-facing sentence. */
export function mostDivergentPair(
  subProfiles: SubProfileMap
): { a: Category; b: Category; aTop: Dosha; bTop: Dosha } | null {
  const entries = Object.entries(subProfiles) as Array<[Category, DoshaVector]>
  if (entries.length < 2) return null

  let best: { a: Category; b: Category; distance: number } | null = null

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [ca, va] = entries[i]!
      const [cb, vb] = entries[j]!
      const distance = DOSHAS.reduce((acc, d) => acc + Math.abs(va[d] - vb[d]), 0)
      if (!best || distance > best.distance) best = { a: ca, b: cb, distance }
    }
  }

  if (!best) return null

  const topOf = (v: DoshaVector): Dosha =>
    [...DOSHAS].sort((x, y) => v[y] - v[x])[0]!

  return {
    a: best.a,
    b: best.b,
    aTop: topOf(subProfiles[best.a]!),
    bTop: topOf(subProfiles[best.b]!),
  }
}

export const CATEGORY_LABELS: Record<Category, string> = {
  physical: 'physical',
  physiological: 'physiological',
  'mental-emotional': 'mental and emotional',
}
