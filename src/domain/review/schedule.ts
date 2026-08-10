import { LEITNER_INTERVALS_DAYS, MAX_LEITNER_BOX } from '../../content/config'

export interface ReviewItem {
  questionId: string
  box: number
  lastAnsweredAt: string
  dueAt: string
  consecutiveCorrect: number
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Leitner scheduling. Correct promotes one box; any incorrect answer resets to
 * box 0 regardless of history.
 *
 * Chosen over SM-2 or FSRS because it is the simplest scheme that measurably
 * prioritises missed items, and because it is explainable to the user — which
 * matters in an app whose whole posture is showing its working (research.md R8).
 */
export function scheduleNext(
  existing: ReviewItem | undefined,
  questionId: string,
  correct: boolean,
  now: Date
): ReviewItem {
  const currentBox = existing?.box ?? 0
  const box = correct ? Math.min(currentBox + 1, MAX_LEITNER_BOX) : 0

  const intervalDays = LEITNER_INTERVALS_DAYS[box] ?? 0
  const dueAt = new Date(now.getTime() + intervalDays * DAY_MS)

  return {
    questionId,
    box,
    lastAnsweredAt: now.toISOString(),
    dueAt: dueAt.toISOString(),
    consecutiveCorrect: correct ? (existing?.consecutiveCorrect ?? 0) + 1 : 0,
  }
}

export function isDue(item: ReviewItem, now: Date): boolean {
  return new Date(item.dueAt).getTime() <= now.getTime()
}

/** Never answered correctly since its last miss. */
export function isPreviouslyMissed(item: ReviewItem): boolean {
  return item.consecutiveCorrect === 0
}

export function daysOverdue(item: ReviewItem, now: Date): number {
  const diff = now.getTime() - new Date(item.dueAt).getTime()
  return diff <= 0 ? 0 : diff / DAY_MS
}
