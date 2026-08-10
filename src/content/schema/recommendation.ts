import { z } from 'zod'
import { allowLintSchema, sourceAttributionSchema } from './blocks'
import { idSchema, lifeAreaSchema, seasonSchema } from './common'

/**
 * `balanced` rules exist specifically so tri-doshic and evenly balanced profiles
 * receive coherent general guidance instead of three competing dosha-specific
 * sets (FR-031).
 */
export const ruleConditionSchema = z.object({
  dosha: z.enum(['vata', 'pitta', 'kapha', 'balanced']),
  /**
   * `dominant`  — applies when this dosha leads the prakriti profile
   * `elevated`  — applies when vikriti shows this dosha raised above baseline
   * `any`       — applies whenever the dosha appears at all above minPercent
   */
  mode: z.enum(['dominant', 'elevated', 'any']),
  minPercent: z.number().min(0).max(100).optional(),
})
export type RuleCondition = z.infer<typeof ruleConditionSchema>

export const recommendationRuleSchema = z.object({
  id: idSchema,
  area: lifeAreaSchema,
  appliesWhen: ruleConditionSchema,
  /** The actionable guidance itself. */
  guidance: z.string().min(1),
  /** Required: which profile characteristic this addresses (FR-028). */
  because: z.string().min(1, 'every recommendation must say what it follows from (FR-028)'),
  /** Omitted means all seasons. */
  seasons: z.array(seasonSchema).optional(),
  source: sourceAttributionSchema,
  allowLint: allowLintSchema.optional(),
})
export type RecommendationRule = z.infer<typeof recommendationRuleSchema>
