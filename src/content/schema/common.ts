import { z } from 'zod'

/** The three doshas. Order is fixed everywhere for stable display. */
export const DOSHAS = ['vata', 'pitta', 'kapha'] as const
export const doshaSchema = z.enum(DOSHAS)
export type Dosha = z.infer<typeof doshaSchema>

/**
 * A weighting across the three doshas. Used for assessment option weights and
 * for accumulated scores alike.
 */
export const doshaVectorSchema = z.object({
  vata: z.number().min(0),
  pitta: z.number().min(0),
  kapha: z.number().min(0),
})
export type DoshaVector = z.infer<typeof doshaVectorSchema>

export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const
export const seasonSchema = z.enum(SEASONS)
export type Season = z.infer<typeof seasonSchema>

/**
 * Assessment question categories. These are also the sub-profile groupings that
 * power the consistency confidence signal — if the physical answers say Kapha
 * and the mental answers say Vata, the user deserves to be told.
 */
export const CATEGORIES = ['physical', 'physiological', 'mental-emotional'] as const
export const categorySchema = z.enum(CATEGORIES)
export type Category = z.infer<typeof categorySchema>

/** Topics tie lessons, quiz questions, and mastery tracking together. */
export const TOPICS = [
  'what-ayurveda-is',
  'five-elements',
  'three-doshas',
  'twenty-gunas',
  'six-tastes',
  'agni-ama',
  'seven-dhatus',
  'srotas',
  'dinacharya',
  'ritucharya',
  'prakriti-vikriti',
] as const
export const topicSchema = z.enum(TOPICS)
export type TopicId = z.infer<typeof topicSchema>

export const LIFE_AREAS = ['routine', 'meals', 'movement', 'seasonal', 'self-care'] as const
export const lifeAreaSchema = z.enum(LIFE_AREAS)
export type LifeArea = z.infer<typeof lifeAreaSchema>

/** kebab-case identifier, used for every content id and as a URL segment. */
export const idSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids must be kebab-case (lowercase, hyphen-separated)')

export const emptyVector = (): DoshaVector => ({ vata: 0, pitta: 0, kapha: 0 })
