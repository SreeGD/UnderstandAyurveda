import type { QuizQuestion } from '../../content/schema/quiz'
import { daysOverdue, isDue, isPreviouslyMissed, type ReviewItem } from './schedule'

export type ReviewPriority = 'overdue-missed' | 'overdue' | 'due' | 'unseen' | 'not-due'

export interface ReviewCandidate {
  question: QuizQuestion
  item: ReviewItem | undefined
  priority: ReviewPriority
  overdueDays: number
}

const PRIORITY_ORDER: Record<ReviewPriority, number> = {
  'overdue-missed': 0,
  overdue: 1,
  due: 2,
  unseen: 3,
  'not-due': 4,
}

export function classify(
  question: QuizQuestion,
  item: ReviewItem | undefined,
  now: Date
): ReviewCandidate {
  if (!item) {
    return { question, item, priority: 'unseen', overdueDays: 0 }
  }

  const overdueDays = daysOverdue(item, now)

  if (!isDue(item, now)) {
    return { question, item, priority: 'not-due', overdueDays: 0 }
  }
  if (overdueDays > 0 && isPreviouslyMissed(item)) {
    return { question, item, priority: 'overdue-missed', overdueDays }
  }
  if (overdueDays > 0) {
    return { question, item, priority: 'overdue', overdueDays }
  }
  return { question, item, priority: 'due', overdueDays: 0 }
}

/**
 * Orders a review session: previously-missed overdue items first, then overdue,
 * then due today, then never-seen. Within a tier, longer-overdue comes first.
 *
 * This ordering is the whole of SC-014 — missed items must be measurably
 * prioritised over mastered ones.
 */
export function buildReviewSession(
  questions: QuizQuestion[],
  reviewState: Record<string, ReviewItem>,
  now: Date,
  limit = 15
): ReviewCandidate[] {
  const candidates = questions.map((q) => classify(q, reviewState[q.id], now))

  const eligible = candidates.filter((c) => c.priority !== 'not-due')

  const sorted = eligible.sort((a, b) => {
    const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (byPriority !== 0) return byPriority
    if (a.overdueDays !== b.overdueDays) return b.overdueDays - a.overdueDays
    // Stable, deterministic fallback so sessions are reproducible.
    return a.question.id.localeCompare(b.question.id)
  })

  // If everything is scheduled ahead, fall back to the nearest-due items rather
  // than showing an empty session.
  if (sorted.length === 0) {
    return candidates
      .sort((a, b) => {
        const aDue = a.item ? new Date(a.item.dueAt).getTime() : 0
        const bDue = b.item ? new Date(b.item.dueAt).getTime() : 0
        return aDue - bDue
      })
      .slice(0, limit)
  }

  return sorted.slice(0, limit)
}

export function countDue(
  questions: QuizQuestion[],
  reviewState: Record<string, ReviewItem>,
  now: Date
): number {
  return questions.filter((q) => {
    const item = reviewState[q.id]
    if (!item) return false
    return isDue(item, now)
  }).length
}
