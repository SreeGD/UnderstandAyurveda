import { LIFE_AREAS, type Dosha, type LifeArea, type Season } from '../../content/schema/common'
import type { RecommendationRule } from '../../content/schema/recommendation'
import type { DoshaProfile } from '../scoring/types'

export interface PlanSection {
  area: LifeArea
  rules: RecommendationRule[]
}

export interface LifestylePlan {
  sections: PlanSection[]
  season: Season
  /** The dosha(s) the guidance is aimed at. */
  targeting: Dosha[] | 'balanced'
  /** Set when generated against a vikriti elevation rather than the baseline. */
  addressingElevation: Dosha | null
  generatedFrom: {
    percentages: DoshaProfile['percentages']
    shape: DoshaProfile['shape']
    dominant: Dosha[]
  }
}

export interface SelectOptions {
  /** When present, guidance targets reducing this elevation instead of the baseline. */
  elevatedDosha?: Dosha | null
}

/**
 * Turn a profile into guidance.
 *
 * The `balanced` branch exists so tri-doshic and evenly balanced profiles get
 * one coherent set of general guidance, rather than three dosha-specific sets
 * that contradict each other — "favour warm heavy food" next to "favour light
 * cool food" is worse than useless (FR-031, invariant P3).
 */
export function selectRecommendations(
  profile: DoshaProfile,
  season: Season,
  rules: RecommendationRule[],
  options: SelectOptions = {}
): LifestylePlan {
  const elevated = options.elevatedDosha ?? null

  // A tri-doshic profile has no single pattern to pacify, so it gets balanced
  // guidance. A dual profile does have a target: the leading dosha.
  const useBalanced = elevated === null && profile.shape === 'tridoshic'
  const targeting: Dosha[] | 'balanced' = useBalanced
    ? 'balanced'
    : elevated
      ? [elevated]
      : profile.dominant

  const sections: PlanSection[] = LIFE_AREAS.map((area) => ({
    area,
    rules: selectForArea(area, profile, season, rules, targeting, elevated),
  }))

  return {
    sections,
    season,
    targeting,
    addressingElevation: elevated,
    generatedFrom: {
      percentages: profile.percentages,
      shape: profile.shape,
      dominant: profile.dominant,
    },
  }
}

function selectForArea(
  area: LifeArea,
  profile: DoshaProfile,
  season: Season,
  rules: RecommendationRule[],
  targeting: Dosha[] | 'balanced',
  elevated: Dosha | null
): RecommendationRule[] {
  const inArea = rules.filter((r) => r.area === area && appliesToSeason(r, season))

  if (targeting === 'balanced') {
    const balanced = inArea.filter((r) => r.appliesWhen.dosha === 'balanced')
    return balanced.length > 0 ? balanced : fallback(inArea)
  }

  const matched = inArea.filter((r) => {
    const { dosha, mode, minPercent } = r.appliesWhen

    if (dosha === 'balanced') return false
    if (!targeting.includes(dosha)) return false

    if (minPercent !== undefined && profile.percentages[dosha] < minPercent) return false

    if (mode === 'elevated') return elevated === dosha
    if (mode === 'dominant') return elevated === null ? profile.dominant.includes(dosha) : elevated === dosha
    return true
  })

  // Every area must be non-empty for every profile shape (invariant P1). Falling
  // back to balanced guidance is better than showing the user an empty section.
  if (matched.length === 0) {
    const balanced = inArea.filter((r) => r.appliesWhen.dosha === 'balanced')
    return balanced.length > 0 ? balanced : fallback(inArea)
  }

  return matched
}

function appliesToSeason(rule: RecommendationRule, season: Season): boolean {
  return rule.seasons === undefined || rule.seasons.includes(season)
}

function fallback(inArea: RecommendationRule[]): RecommendationRule[] {
  return inArea.slice(0, 1)
}
