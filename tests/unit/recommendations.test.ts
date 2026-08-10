import { describe, expect, it } from 'vitest'
import { scoringConfig } from '../../src/content/config'
import { planNotices, recommendationRules } from '../../src/content/recommendations'
import { LIFE_AREAS, SEASONS, type Dosha } from '../../src/content/schema/common'
import { scanStrings } from '../../src/content/lint/medicalSafety'
import { selectRecommendations } from '../../src/domain/recommendations/select'
import { scoreAssessment } from '../../src/domain/scoring'
import type { DoshaProfile } from '../../src/domain/scoring/types'
import { fixtures } from '../fixtures/scoring'

/** Invariants P1-P6 from contracts/scoring-contract.md. */

const profileFor = (name: 'pureVata' | 'pureP' | 'pureKapha' | 'threeWayTie'): DoshaProfile =>
  scoreAssessment(fixtures[name]())

const ALL_SHAPES = [
  ['vata-dominant', profileFor('pureVata')],
  ['pitta-dominant', profileFor('pureP')],
  ['kapha-dominant', profileFor('pureKapha')],
  ['tridoshic', profileFor('threeWayTie')],
] as const

describe('P1 — every life area is populated for every profile shape', () => {
  it.each(ALL_SHAPES)('%s', (_name, profile) => {
    for (const season of SEASONS) {
      const plan = selectRecommendations(profile, season, recommendationRules)
      expect(plan.sections).toHaveLength(LIFE_AREAS.length)
      for (const section of plan.sections) {
        expect(
          section.rules.length,
          `${section.area} was empty for this profile in ${season}`
        ).toBeGreaterThan(0)
      }
    }
  })
})

describe('P2 — every selected recommendation says what it follows from', () => {
  it.each(ALL_SHAPES)('%s', (_name, profile) => {
    const plan = selectRecommendations(profile, 'spring', recommendationRules)
    for (const section of plan.sections) {
      for (const rule of section.rules) {
        expect(rule.because.trim().length).toBeGreaterThan(10)
        expect(rule.guidance.trim().length).toBeGreaterThan(10)
      }
    }
  })
})

describe('P3 — balanced profiles get coherent guidance, not competing sets', () => {
  it('a tri-doshic profile targets balanced rules only', () => {
    const plan = selectRecommendations(profileFor('threeWayTie'), 'summer', recommendationRules)
    expect(plan.targeting).toBe('balanced')

    for (const section of plan.sections) {
      for (const rule of section.rules) {
        expect(
          rule.appliesWhen.dosha,
          `${rule.id} is dosha-specific but was selected for a tri-doshic profile`
        ).toBe('balanced')
      }
    }
  })

  it('never selects rules for two competing doshas in the same area', () => {
    for (const [, profile] of ALL_SHAPES) {
      const plan = selectRecommendations(profile, 'winter', recommendationRules)
      for (const section of plan.sections) {
        const doshas = new Set(
          section.rules.map((r) => r.appliesWhen.dosha).filter((d) => d !== 'balanced')
        )
        expect(
          doshas.size,
          `${section.area} mixed guidance for ${[...doshas].join(' and ')}`
        ).toBeLessThanOrEqual(profile.dominant.length)
      }
    }
  })
})

describe('P4 — changing season changes only the seasonal section', () => {
  it('all other sections are identical across seasons', () => {
    const profile = profileFor('pureVata')
    const winter = selectRecommendations(profile, 'winter', recommendationRules)
    const summer = selectRecommendations(profile, 'summer', recommendationRules)

    for (const area of LIFE_AREAS) {
      const w = winter.sections.find((s) => s.area === area)!
      const s = summer.sections.find((s) => s.area === area)!
      if (area === 'seasonal') {
        expect(w.rules.map((r) => r.id)).not.toEqual(s.rules.map((r) => r.id))
      } else {
        expect(w.rules.map((r) => r.id)).toEqual(s.rules.map((r) => r.id))
      }
    }
  })

  it('the seasonal section matches the requested season', () => {
    const profile = profileFor('pureP')
    for (const season of SEASONS) {
      const plan = selectRecommendations(profile, season, recommendationRules)
      const seasonal = plan.sections.find((s) => s.area === 'seasonal')!
      for (const rule of seasonal.rules) {
        if (rule.seasons) expect(rule.seasons).toContain(season)
      }
    }
  })
})

describe('P5 — medical safety over the ENTIRE rule set, not just what got selected', () => {
  it('no rule anywhere contains dosing, treatment claims, or alter-care language', () => {
    const violations = recommendationRules.flatMap((rule) =>
      scanStrings([rule.guidance, rule.because], {
        location: `recommendation "${rule.id}"`,
        allowLint: rule.allowLint,
      })
    )

    expect(
      violations.map((v) => `${v.location}: ${v.matched} (${v.patternId})`),
      'medical-safety violations found in the recommendation corpus'
    ).toEqual([])
  })

  it('no plan notice contains prohibited language', () => {
    // Notices are the text that qualifies every plan; they must be clean too.
    const violations = planNotices.flatMap((n) =>
      scanStrings([n.text], { location: `notice "${n.id}"` })
    )
    expect(violations).toEqual([])
  })
})

describe('P6 — deterministic', () => {
  it('same profile and season yields the same plan', () => {
    const profile = profileFor('pureKapha')
    const a = selectRecommendations(profile, 'autumn', recommendationRules)
    const b = selectRecommendations(profile, 'autumn', recommendationRules)
    expect(a).toEqual(b)
  })
})

describe('vikriti elevation targeting', () => {
  it('guidance shifts to the elevated dosha rather than the baseline', () => {
    const kaphaProfile = profileFor('pureKapha')
    const elevated: Dosha = 'vata'

    const plan = selectRecommendations(kaphaProfile, 'spring', recommendationRules, {
      elevatedDosha: elevated,
    })

    expect(plan.addressingElevation).toBe('vata')
    expect(plan.targeting).toEqual(['vata'])

    const meals = plan.sections.find((s) => s.area === 'meals')!
    const doshas = new Set(meals.rules.map((r) => r.appliesWhen.dosha))
    expect(doshas.has('kapha')).toBe(false)
  })

  it('still fills every area when targeting an elevation', () => {
    const plan = selectRecommendations(
      profileFor('threeWayTie'),
      'winter',
      recommendationRules,
      { elevatedDosha: 'pitta' }
    )
    for (const section of plan.sections) {
      expect(section.rules.length).toBeGreaterThan(0)
    }
  })
})

describe('plan provenance', () => {
  it('records the profile it was generated from', () => {
    const profile = profileFor('pureVata')
    const plan = selectRecommendations(profile, 'summer', recommendationRules)
    expect(plan.generatedFrom.percentages).toEqual(profile.percentages)
    expect(plan.generatedFrom.dominant).toEqual(profile.dominant)
    expect(plan.generatedFrom.shape).toBe(profile.shape)
    expect(scoringConfig.dualDoshaMarginPoints).toBeGreaterThan(0)
  })
})
