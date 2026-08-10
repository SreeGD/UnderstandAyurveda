import { z } from 'zod'
import { idSchema, topicSchema } from './common'

export const quizOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  /**
   * Required on every incorrect option (gate C6). "Why your answer was wrong"
   * is where the learning happens — an app that only says "incorrect" teaches
   * nothing. The validator cross-checks this against correctAnswer.
   */
  whyWrong: z.string().min(1).optional(),
})
export type QuizOption = z.infer<typeof quizOptionSchema>

/** Left/right pairs for matching questions. */
export const matchPairSchema = z.object({
  left: z.string().min(1),
  right: z.string().min(1),
})

export const quizQuestionSchema = z.object({
  id: idSchema,
  topic: topicSchema,
  lessonId: idSchema,
  type: z.enum(['multiple-choice', 'matching', 'scenario']),
  prompt: z.string().min(1),
  /** MCQ and scenario: 3-5 options. Empty for matching. */
  options: z.array(quizOptionSchema).default([]),
  /** Matching only: the correct pairing. */
  pairs: z.array(matchPairSchema).default([]),
  /** Option id, or list of option ids. Unused for matching. */
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  /** Required for every question (gate C6) — explains the reasoning, not just the fact. */
  whyCorrect: z.string().min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
})
export type QuizQuestion = z.infer<typeof quizQuestionSchema>

export const quizSchema = z.object({
  id: idSchema,
  lessonId: idSchema,
  title: z.string().min(1),
  questionIds: z.array(idSchema).min(1),
})
export type Quiz = z.infer<typeof quizSchema>
