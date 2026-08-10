import { z } from 'zod'
import type { AssessmentQuestion, AssessmentType } from '../../content/schema/assessment'
import type { ScoringConfig } from '../../content/config'
import { doshaSchema, doshaVectorSchema, type Category, type Dosha } from '../../content/schema/common'

export interface ScoringInput {
  assessmentType: AssessmentType
  /** Full question bank for this assessment type. */
  questions: AssessmentQuestion[]
  /** May be partial — unanswered questions are simply absent. */
  responses: Record<string, string>
  config: ScoringConfig
  /** Declared mutually exclusive answers, for the consistency signal. */
  contradictions?: Array<{
    questionId: string
    optionId: string
    withQuestionId: string
    withOptionId: string
    explanation: string
  }>
}

export const scoreContributionSchema = z.object({
  questionId: z.string(),
  questionPrompt: z.string(),
  /** null when skipped — the breakdown shows what was NOT answered too. */
  answerText: z.string().nullable(),
  reliability: z.number(),
  points: doshaVectorSchema,
})
export type ScoreContribution = z.infer<typeof scoreContributionSchema>

export const confidenceSchema = z.object({
  level: z.enum(['high', 'moderate', 'low']),
  signals: z.object({
    completeness: z.number(),
    separation: z.number(),
    consistency: z.number(),
  }),
  /** User-facing sentences. Never empty when level is 'low' (invariant S8). */
  reasons: z.array(z.string()),
})
export type Confidence = z.infer<typeof confidenceSchema>

export const doshaProfileSchema = z.object({
  percentages: z.object({
    vata: z.number(),
    pitta: z.number(),
    kapha: z.number(),
  }),
  /**
   * An array by design. There is no representation in this type for "the user's
   * single dosha", which is what stops a rigid label leaking into the UI
   * (FR-019, FR-022).
   */
  dominant: z.array(doshaSchema).min(1).max(3),
  shape: z.enum(['single', 'dual', 'tridoshic']),
  confidence: confidenceSchema,
  breakdown: z.array(scoreContributionSchema),
  subProfiles: z.record(z.string(), doshaVectorSchema),
  rawTotals: doshaVectorSchema,
  answeredCount: z.number(),
  totalCount: z.number(),
})
export type DoshaProfile = z.infer<typeof doshaProfileSchema>

export type SubProfiles = Partial<Record<Category, { vata: number; pitta: number; kapha: number }>>

export class InsufficientResponsesError extends Error {
  constructor() {
    super('Cannot produce a dosha profile from zero answered questions.')
    this.name = 'InsufficientResponsesError'
  }
}

export class UnknownOptionError extends Error {
  constructor(questionId: string, optionId: string) {
    super(`Question "${questionId}" has no option "${optionId}".`)
    this.name = 'UnknownOptionError'
  }
}

export const DOSHA_LABELS: Record<Dosha, string> = {
  vata: 'Vata',
  pitta: 'Pitta',
  kapha: 'Kapha',
}
