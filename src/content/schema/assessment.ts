import { z } from 'zod'
import { categorySchema, doshaVectorSchema, idSchema } from './common'

export const assessmentTypeSchema = z.enum(['prakriti', 'vikriti'])
export type AssessmentType = z.infer<typeof assessmentTypeSchema>

export const assessmentOptionSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    weights: doshaVectorSchema,
  })
  .refine((o) => o.weights.vata + o.weights.pitta + o.weights.kapha > 0, {
    message: 'at least one dosha weight must be positive (gate C10)',
    path: ['weights'],
  })
export type AssessmentOption = z.infer<typeof assessmentOptionSchema>

export const assessmentQuestionSchema = z.object({
  id: idSchema,
  assessmentType: assessmentTypeSchema,
  category: categorySchema,
  /** Plain English — answering must never require knowing any Sanskrit. */
  prompt: z.string().min(1),
  /** Disambiguates, e.g. "think of your whole adult life, not this month". */
  helpText: z.string().optional(),
  /**
   * How diagnostic this question is, 0.5–2.0. Stable physical traits weigh most
   * for prakriti; mood and preference weigh least. Treating "my bone structure"
   * and "my mood today" as equally diagnostic of a lifelong constitution is the
   * classic flaw of web dosha quizzes (research.md R1).
   */
  reliability: z.number().min(0.5).max(2.0),
  optional: z.boolean().default(false),
  options: z.array(assessmentOptionSchema).min(2),
})
export type AssessmentQuestion = z.infer<typeof assessmentQuestionSchema>

/**
 * Declares mutually exclusive answers, e.g. consistently-oily skin and
 * consistently-dry skin. Triggering a pair lowers the consistency signal and
 * surfaces the inconsistency to the user rather than silently averaging it away.
 */
export const contradictionSchema = z.object({
  questionId: idSchema,
  optionId: z.string().min(1),
  withQuestionId: idSchema,
  withOptionId: z.string().min(1),
  explanation: z.string().min(1),
})
export type Contradiction = z.infer<typeof contradictionSchema>

export const RED_FLAGS = [
  'pregnancy',
  'acute-symptoms',
  'diagnosed-condition',
  'current-medication',
] as const
export const redFlagSchema = z.enum(RED_FLAGS)
export type RedFlag = z.infer<typeof redFlagSchema>

export const redFlagQuestionSchema = z.object({
  id: redFlagSchema,
  prompt: z.string().min(1),
  helpText: z.string().optional(),
})
export type RedFlagQuestion = z.infer<typeof redFlagQuestionSchema>
