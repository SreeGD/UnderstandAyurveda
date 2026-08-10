import type { SourceAttribution } from '../schema/blocks'
import type { LifeArea, Season } from '../schema/common'
import type { RecommendationRule } from '../schema/recommendation'

type Target = 'vata' | 'pitta' | 'kapha' | 'balanced'

/**
 * `mode: 'any'` means the rule applies whether this dosha is the user's
 * baseline pattern or is currently elevated. Most lifestyle guidance is like
 * that — steadying a Vata pattern looks much the same whether it is your nature
 * or your current state.
 */
export function rule(
  id: string,
  area: LifeArea,
  target: Target,
  guidance: string,
  because: string,
  source: SourceAttribution,
  options: { seasons?: Season[]; mode?: 'dominant' | 'elevated' | 'any' } = {}
): RecommendationRule {
  return {
    id,
    area,
    appliesWhen: { dosha: target, mode: options.mode ?? 'any' },
    guidance,
    because,
    ...(options.seasons ? { seasons: options.seasons } : {}),
    source,
  }
}
