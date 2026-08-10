import { describe, expect, it } from 'vitest'
import { scoringConfig } from '../../src/content/config'
import { DOSHAS } from '../../src/content/schema/common'
import {
  InsufficientResponsesError,
  UnknownOptionError,
  scoreAssessment,
} from '../../src/domain/scoring'
import { allAnswered, bank, fixtures, input, question } from '../fixtures/scoring'

/**
 * Invariants S1-S10 from contracts/scoring-contract.md.
 *
 * These are the tests that matter most in this codebase. A defect here produces
 * a wrong answer that looks exactly like a right one — there is no stack trace,
 * no error, just a person being told something untrue about themselves.
 */

describe('S1 — percentages are integers summing to exactly 100', () => {
  const cases = Object.entries(fixtures).filter(
    ([name]) => name !== 'noneAnswered' && name !== 'unknownOption'
  )

  it.each(cases)('%s', (_name, makeInput) => {
    const profile = scoreAssessment(makeInput())
    const { vata, pitta, kapha } = profile.percentages

    for (const value of [vata, pitta, kapha]) {
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(0)
    }
    expect(vata + pitta + kapha).toBe(100)
  })

  it('holds when only one question of fifty is answered', () => {
    const profile = scoreAssessment(fixtures.singleAnswer())
    const { vata, pitta, kapha } = profile.percentages
    expect(vata + pitta + kapha).toBe(100)
  })

  it('holds for awkward thirds that would otherwise round to 99 or 102', () => {
    const profile = scoreAssessment(fixtures.threeWayTie())
    expect(
      profile.percentages.vata + profile.percentages.pitta + profile.percentages.kapha
    ).toBe(100)
  })
})

describe('S2 — zero answered questions throws rather than fabricating a blend', () => {
  it('throws InsufficientResponsesError', () => {
    expect(() => scoreAssessment(fixtures.noneAnswered())).toThrow(InsufficientResponsesError)
  })
})

describe('S3 — every question appears in the breakdown, answered or not', () => {
  it('breakdown length equals question count', () => {
    const scoringInput = fixtures.sparse()
    const profile = scoreAssessment(scoringInput)
    expect(profile.breakdown).toHaveLength(scoringInput.questions.length)
    expect(profile.breakdown).toHaveLength(50)
  })

  it('skipped questions are present with a null answer and zero points', () => {
    const profile = scoreAssessment(fixtures.sparse())
    const skipped = profile.breakdown.filter((b) => b.answerText === null)
    expect(skipped).toHaveLength(45)
    for (const entry of skipped) {
      expect(entry.points).toEqual({ vata: 0, pitta: 0, kapha: 0 })
    }
  })
})

describe('S4 — the breakdown IS the arithmetic, not a narration of it', () => {
  it.each(
    Object.entries(fixtures).filter(
      ([name]) => name !== 'noneAnswered' && name !== 'unknownOption'
    )
  )('recomputing from breakdown reproduces %s exactly', (_name, makeInput) => {
    const profile = scoreAssessment(makeInput())

    const recomputed = { vata: 0, pitta: 0, kapha: 0 }
    for (const entry of profile.breakdown) {
      for (const d of DOSHAS) recomputed[d] += entry.points[d]
    }

    expect(recomputed).toEqual(profile.rawTotals)

    const sum = recomputed.vata + recomputed.pitta + recomputed.kapha
    for (const d of DOSHAS) {
      // Within one point of the exact share — the gap is largest-remainder
      // rounding and nothing else.
      expect(Math.abs(profile.percentages[d] - (recomputed[d] / sum) * 100)).toBeLessThan(1)
    }
  })
})

describe('S5 — deterministic', () => {
  it('identical input yields identical output', () => {
    const scoringInput = fixtures.divergentSubProfiles()
    const a = scoreAssessment(scoringInput)
    const b = scoreAssessment(scoringInput)
    expect(a).toEqual(b)
  })

  it('is unaffected by question ordering in the response object', () => {
    const qs = bank()
    const forward = allAnswered(qs, 'p')
    const reversed = Object.fromEntries(Object.entries(forward).reverse())
    expect(scoreAssessment(input(qs, forward)).percentages).toEqual(
      scoreAssessment(input(qs, reversed)).percentages
    )
  })
})

describe('S6 — an exact three-way tie is reported as a tie', () => {
  it('yields tridoshic with all three dominant', () => {
    const profile = scoreAssessment(fixtures.threeWayTie())
    expect(profile.shape).toBe('tridoshic')
    expect(profile.dominant).toHaveLength(3)
    expect([...profile.dominant].sort()).toEqual([...DOSHAS].sort())
  })

  it('does not break the tie by picking a winner', () => {
    const profile = scoreAssessment(fixtures.threeWayTie())
    const values = new Set(Object.values(profile.percentages))
    // 100 does not divide by 3, so one dosha gets the extra point — but the
    // shape must still be tridoshic and dominant must still hold all three.
    expect(values.size).toBeLessThanOrEqual(2)
    expect(profile.dominant).toHaveLength(3)
  })

  it('reports an exact two-way tie as dual', () => {
    const profile = scoreAssessment(fixtures.twoWayTie())
    expect(profile.shape).toBe('dual')
    expect(profile.dominant).toHaveLength(2)
  })
})

describe('S7 — dominant is never empty and never longer than three', () => {
  it.each(
    Object.entries(fixtures).filter(
      ([name]) => name !== 'noneAnswered' && name !== 'unknownOption'
    )
  )('%s', (_name, makeInput) => {
    const profile = scoreAssessment(makeInput())
    expect(profile.dominant.length).toBeGreaterThanOrEqual(1)
    expect(profile.dominant.length).toBeLessThanOrEqual(3)
  })
})

describe('S8 — a low confidence verdict always says why', () => {
  it.each(
    Object.entries(fixtures).filter(
      ([name]) => name !== 'noneAnswered' && name !== 'unknownOption'
    )
  )('%s', (_name, makeInput) => {
    const profile = scoreAssessment(makeInput())
    if (profile.confidence.level === 'low') {
      expect(profile.confidence.reasons.length).toBeGreaterThan(0)
      for (const reason of profile.confidence.reasons) {
        expect(reason.trim().length).toBeGreaterThan(10)
      }
    }
  })

  it('sparse answers produce a low grade naming the skipping', () => {
    const profile = scoreAssessment(fixtures.sparse())
    expect(profile.confidence.level).toBe('low')
    expect(profile.confidence.reasons.join(' ')).toMatch(/answered 5 of 50/i)
  })

  it('divergent sub-profiles are named in the reasons', () => {
    const profile = scoreAssessment(fixtures.divergentSubProfiles())
    expect(profile.confidence.reasons.join(' ')).toMatch(/physical/i)
  })

  it('triggered contradictions are counted and reported', () => {
    const profile = scoreAssessment(fixtures.contradictory())
    expect(profile.confidence.reasons.join(' ')).toMatch(/do not usually go together/i)
  })
})

describe('S9 — adding a skipped question lowers completeness without moving percentages', () => {
  it('percentages are unchanged, completeness falls', () => {
    const qs = bank(4)
    const responses = allAnswered(qs, 'v')

    const before = scoreAssessment(input(qs, responses))
    const after = scoreAssessment(input([...qs, question('extra', 'physical')], responses))

    expect(after.percentages).toEqual(before.percentages)
    expect(after.confidence.signals.completeness).toBeLessThan(
      before.confidence.signals.completeness
    )
    expect(after.totalCount).toBe(before.totalCount + 1)
    expect(after.answeredCount).toBe(before.answeredCount)
  })
})

describe('S10 — uniform answers yield a clean single-dosha result', () => {
  it.each([
    ['pureVata', 'vata'],
    ['pureP', 'pitta'],
    ['pureKapha', 'kapha'],
  ] as const)('%s → 100%% and full separation', (name, dosha) => {
    const profile = scoreAssessment(fixtures[name]())
    expect(profile.percentages[dosha]).toBe(100)
    expect(profile.shape).toBe('single')
    expect(profile.dominant).toEqual([dosha])
    expect(profile.confidence.signals.separation).toBe(1)
  })
})

describe('input validation', () => {
  it('throws on a response naming an option that does not exist', () => {
    expect(() => scoreAssessment(fixtures.unknownOption())).toThrow(UnknownOptionError)
  })
})

describe('reliability weighting', () => {
  it('high-reliability physical answers outweigh low-reliability mental ones', () => {
    const profile = scoreAssessment(fixtures.reliabilityWeighted())
    // 3 questions × 2.0 Kapha vs 3 × 0.5 Vata → 6 vs 1.5 → 80/20.
    expect(profile.percentages.kapha).toBe(80)
    expect(profile.percentages.vata).toBe(20)
    expect(profile.dominant).toEqual(['kapha'])
  })
})

describe('near-tie handling', () => {
  it('classifies a within-margin gap as dual, not single', () => {
    const profile = scoreAssessment(fixtures.nearTie())
    expect(profile.shape).toBe('dual')
    const margin = profile.percentages.vata - profile.percentages.pitta
    expect(margin).toBeLessThanOrEqual(scoringConfig.dualDoshaMarginPoints)
  })

  it('says plainly that the two are too close to call', () => {
    const profile = scoreAssessment(fixtures.nearTie())
    expect(profile.confidence.reasons.join(' ')).toMatch(/too close to call|close together/i)
  })
})

describe('sub-profiles', () => {
  it('are computed per category and each sum to 100', () => {
    const profile = scoreAssessment(fixtures.divergentSubProfiles())
    const entries = Object.entries(profile.subProfiles)
    expect(entries).toHaveLength(3)
    for (const [, vector] of entries) {
      expect(vector.vata + vector.pitta + vector.kapha).toBe(100)
    }
  })

  it('reflect the disagreement rather than averaging it away', () => {
    const profile = scoreAssessment(fixtures.divergentSubProfiles())
    expect(profile.subProfiles.physical?.kapha).toBe(100)
    expect(profile.subProfiles['mental-emotional']?.vata).toBe(100)
  })
})
