import { z } from 'zod'
import { contentBlockSchema } from './blocks'
import { idSchema, topicSchema } from './common'

export const lessonSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  topic: topicSchema,
  /** Recommended sequence position. Access is never blocked by it (FR-010). */
  order: z.number().int().min(1),
  estimatedMinutes: z.number().int().min(1).max(30),
  /** One sentence: what the reader gets out of this lesson. */
  summary: z.string().min(1),
  /**
   * Named, never enforced. A reader arriving mid-course is told what they need
   * and where to find it, and is then let through.
   */
  prerequisiteConcepts: z
    .array(z.object({ termId: idSchema.optional(), lessonId: idSchema.optional(), label: z.string() }))
    .default([]),
  body: z.array(contentBlockSchema).min(1),
  quizId: idSchema,
})

export type Lesson = z.infer<typeof lessonSchema>
