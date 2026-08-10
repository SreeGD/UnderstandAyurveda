import { MASTERY_BANDS, MAX_LEITNER_BOX, type MasteryLevel } from '../../content/config'
import type { QuizQuestion } from '../../content/schema/quiz'
import type { TopicId } from '../../content/schema/common'
import { isDue, type ReviewItem } from './schedule'

export interface TopicMastery {
  topic: TopicId
  level: MasteryLevel
  label: string
  /** 0..1, for the progress indicator. */
  fraction: number
  attempted: number
  total: number
  dueForReview: number
  correctRate: number | null
}

export interface Attempt {
  questionId: string
  correct: boolean
}

/**
 * Mastery is DERIVED, never stored. Storing it would create a second source of
 * truth that drifts from the attempts it is supposed to summarise
 * (data-model.md).
 */
export function computeTopicMastery(
  topic: TopicId,
  questions: QuizQuestion[],
  reviewState: Record<string, ReviewItem>,
  attempts: Attempt[],
  now: Date
): TopicMastery {
  const topicQuestions = questions.filter((q) => q.topic === topic)
  const total = topicQuestions.length

  const items = topicQuestions
    .map((q) => reviewState[q.id])
    .filter((i): i is ReviewItem => i !== undefined)

  const attempted = items.length
  const dueForReview = items.filter((i) => isDue(i, now)).length

  const topicQuestionIds = new Set(topicQuestions.map((q) => q.id))
  const topicAttempts = attempts.filter((a) => topicQuestionIds.has(a.questionId))
  const correctRate =
    topicAttempts.length === 0
      ? null
      : topicAttempts.filter((a) => a.correct).length / topicAttempts.length

  if (attempted === 0) {
    return {
      topic,
      level: 'not-started',
      label: 'Not started',
      fraction: 0,
      attempted: 0,
      total,
      dueForReview: 0,
      correctRate: null,
    }
  }

  // Mean box level across attempted items, scaled by how much of the topic has
  // been attempted at all — answering three of twenty questions correctly is not
  // mastery of the topic.
  const meanBox = items.reduce((acc, i) => acc + i.box, 0) / attempted
  const coverage = total === 0 ? 0 : attempted / total
  const effective = meanBox * coverage

  const band = [...MASTERY_BANDS].reverse().find((b) => effective >= b.min) ?? MASTERY_BANDS[0]

  return {
    topic,
    level: band.level,
    label: band.label,
    fraction: Math.min(1, effective / MAX_LEITNER_BOX),
    attempted,
    total,
    dueForReview,
    correctRate,
  }
}

export function computeAllMastery(
  topics: readonly TopicId[],
  questions: QuizQuestion[],
  reviewState: Record<string, ReviewItem>,
  attempts: Attempt[],
  now: Date
): TopicMastery[] {
  return topics.map((t) => computeTopicMastery(t, questions, reviewState, attempts, now))
}
