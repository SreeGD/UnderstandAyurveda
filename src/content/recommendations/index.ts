import type { RecommendationRule } from '../schema/recommendation'
import { mealRules } from './meals'
import { movementRules } from './movement'
import { planNotices } from './notices'
import { routineRules } from './routine'
import { seasonalRules } from './seasonal'
import { selfCareRules } from './self-care'

export const recommendationRules: RecommendationRule[] = [
  ...routineRules,
  ...mealRules,
  ...movementRules,
  ...seasonalRules,
  ...selfCareRules,
]

export { planNotices }
