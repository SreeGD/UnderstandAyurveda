import { describe, expect, it } from 'vitest'
import { scoringConfig } from '../../src/content/config'
import { compareProfiles, primaryElevation } from '../../src/domain/comparison/compare'
import type { DoshaProfile } from '../../src/domain/scoring/types'

function profile(vata: number, pitta: number, kapha: number): DoshaProfile {
  return {
    percentages: { vata, pitta, kapha },
    dominant: ['vata'],
    shape: 'single',
    confidence: { level: 'high', signals: { completeness: 1, separation: 1, consistency: 1 }, reasons: [] },
    breakdown: [],
    subProfiles: {},
    rawTotals: { vata, pitta, kapha },
    answeredCount: 10,
    totalCount: 10,
  }
}

const threshold = scoringConfig.elevationDeltaPoints // 10

describe('delta computation', () => {
  it('reports vikriti minus prakriti per dosha', () => {
    const c = compareProfiles(profile(50, 30, 20), profile(30, 50, 20), scoringConfig)
    const byDosha = Object.fromEntries(c.deltas.map((d) => [d.dosha, d.delta]))
    expect(byDosha).toEqual({ vata: -20, pitta: 20, kapha: 0 })
  })
})

describe('threshold boundaries', () => {
  it('exactly at the threshold counts as elevated', () => {
    const c = compareProfiles(profile(40, 30, 30), profile(30, 30, 40), scoringConfig)
    const kapha = c.deltas.find((d) => d.dosha === 'kapha')!
    expect(kapha.delta).toBe(threshold)
    expect(kapha.status).toBe('elevated')
  })

  it('one point below the threshold is stable', () => {
    const c = compareProfiles(profile(40, 30, 30), profile(31, 30, 39), scoringConfig)
    const kapha = c.deltas.find((d) => d.dosha === 'kapha')!
    expect(kapha.delta).toBe(threshold - 1)
    expect(kapha.status).toBe('stable')
  })

  it('a large negative delta is diminished, not elevated', () => {
    const c = compareProfiles(profile(60, 20, 20), profile(30, 40, 30), scoringConfig)
    expect(c.deltas.find((d) => d.dosha === 'vata')!.status).toBe('diminished')
  })
})

describe('hasNotableChange — the engine must not manufacture an imbalance', () => {
  it('is false when nothing crosses the threshold', () => {
    const c = compareProfiles(profile(40, 35, 25), profile(43, 32, 25), scoringConfig)
    expect(c.hasNotableChange).toBe(false)
    expect(c.elevated).toEqual([])
    expect(c.diminished).toEqual([])
  })

  it('is false for identical profiles', () => {
    const p = profile(45, 35, 20)
    const c = compareProfiles(p, p, scoringConfig)
    expect(c.hasNotableChange).toBe(false)
    expect(c.deltas.every((d) => d.status === 'stable')).toBe(true)
  })

  it('is true once a dosha crosses', () => {
    const c = compareProfiles(profile(50, 30, 20), profile(35, 30, 35), scoringConfig)
    expect(c.hasNotableChange).toBe(true)
    expect(c.elevated).toContain('kapha')
  })
})

describe('primaryElevation', () => {
  it('returns the largest elevation', () => {
    const c = compareProfiles(profile(60, 20, 20), profile(30, 35, 35), scoringConfig)
    expect(primaryElevation(c)).toBe('pitta')
  })

  it('returns null when nothing is elevated', () => {
    const p = profile(40, 30, 30)
    expect(primaryElevation(compareProfiles(p, p, scoringConfig))).toBeNull()
  })
})
