import { z } from 'zod'
import { redFlagSchema, assessmentTypeSchema } from '../content/schema/assessment'
import { seasonSchema } from '../content/schema/common'
// The profile shape is defined by the scoring engine, not by persistence — one
// definition, so the stored form cannot drift from the computed form.
import { doshaProfileSchema } from '../domain/scoring/types'

export const CURRENT_SCHEMA_VERSION = 1
export const STORAGE_KEY = 'understandayurveda:userdata'
export const STORAGE_NAMESPACE = 'understandayurveda:'

export const preferencesSchema = z.object({
  season: seasonSchema.optional(),
  hasSeenOnboarding: z.boolean().default(false),
})
export type Preferences = z.infer<typeof preferencesSchema>

export { doshaProfileSchema }
export type { Confidence, DoshaProfile, ScoreContribution } from '../domain/scoring/types'

export const assessmentRecordSchema = z.object({
  id: z.string(),
  assessmentType: assessmentTypeSchema,
  startedAt: z.string(),
  /** null while in progress — drives resume-or-restart (FR-025). */
  completedAt: z.string().nullable(),
  responses: z.record(z.string(), z.string()),
  redFlags: z.array(redFlagSchema).default([]),
  redFlagsAcknowledged: z.boolean().default(false),
  result: doshaProfileSchema.nullable(),
  /** Enables the "produced under an earlier content version" notice (FR-046). */
  contentVersion: z.string(),
})
export type AssessmentRecord = z.infer<typeof assessmentRecordSchema>

export const lessonProgressSchema = z.object({
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  knowledgeCheckPassed: z.boolean().default(false),
})
export type LessonProgress = z.infer<typeof lessonProgressSchema>

export const quizAttemptSchema = z.object({
  questionId: z.string(),
  quizId: z.string(),
  answerGiven: z.union([z.string(), z.array(z.string())]),
  correct: z.boolean(),
  answeredAt: z.string(),
  sessionId: z.string(),
})
export type QuizAttempt = z.infer<typeof quizAttemptSchema>

export const reviewItemSchema = z.object({
  questionId: z.string(),
  box: z.number().int().min(0).max(4),
  lastAnsweredAt: z.string(),
  dueAt: z.string(),
  consecutiveCorrect: z.number().int().min(0),
})
export type ReviewItem = z.infer<typeof reviewItemSchema>

export const storedDocumentSchema = z.object({
  schemaVersion: z.number().int(),
  contentVersion: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  preferences: preferencesSchema,
  lessonProgress: z.record(z.string(), lessonProgressSchema),
  quizAttempts: z.array(quizAttemptSchema),
  reviewState: z.record(z.string(), reviewItemSchema),
  assessments: z.array(assessmentRecordSchema),
  /** Quarantined records that failed to parse. Never silently discarded. */
  _corrupt: z.record(z.string(), z.unknown()).optional(),
})
export type StoredDocument = z.infer<typeof storedDocumentSchema>

/** Top-level records parsed independently, so one bad record cannot cost the others. */
export const RECORD_SCHEMAS = {
  preferences: preferencesSchema,
  lessonProgress: z.record(z.string(), lessonProgressSchema),
  quizAttempts: z.array(quizAttemptSchema),
  reviewState: z.record(z.string(), reviewItemSchema),
  assessments: z.array(assessmentRecordSchema),
} as const

export type RecordName = keyof typeof RECORD_SCHEMAS

export function emptyDocument(now: string, contentVersion: string): StoredDocument {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    contentVersion,
    createdAt: now,
    updatedAt: now,
    preferences: { hasSeenOnboarding: false },
    lessonProgress: {},
    quizAttempts: [],
    reviewState: {},
    assessments: [],
  }
}
