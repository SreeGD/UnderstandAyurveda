import { describe, expect, it } from 'vitest'
import { LEITNER_INTERVALS_DAYS, MAX_LEITNER_BOX } from '../../src/content/config'
import type { QuizQuestion } from '../../src/content/schema/quiz'
import { isDue, scheduleNext, type ReviewItem } from '../../src/domain/review/schedule'
import { buildReviewSession, countDue } from '../../src/domain/review/session'

const NOW = new Date('2026-06-01T09:00:00.000Z')
const daysLater = (d: number) => new Date(NOW.getTime() + d * 86_400_000)

function question(id: string): QuizQuestion {
  return {
    id,
    topic: 'three-doshas',
    lessonId: 'three-doshas',
    type: 'multiple-choice',
    prompt: `Prompt ${id}`,
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B', whyWrong: 'no' },
    ],
    pairs: [],
    correctAnswer: 'a',
    whyCorrect: 'because',
    difficulty: 1,
  }
}

describe('Leitner promotion and reset', () => {
  it('a correct answer promotes one box', () => {
    const first = scheduleNext(undefined, 'q1', true, NOW)
    expect(first.box).toBe(1)
    const second = scheduleNext(first, 'q1', true, NOW)
    expect(second.box).toBe(2)
  })

  it('caps at the highest box', () => {
    let item = scheduleNext(undefined, 'q1', true, NOW)
    for (let i = 0; i < 10; i++) item = scheduleNext(item, 'q1', true, NOW)
    expect(item.box).toBe(MAX_LEITNER_BOX)
  })

  it('any incorrect answer resets to box 0, however long the streak', () => {
    let item = scheduleNext(undefined, 'q1', true, NOW)
    for (let i = 0; i < 5; i++) item = scheduleNext(item, 'q1', true, NOW)
    expect(item.box).toBe(MAX_LEITNER_BOX)

    const missed = scheduleNext(item, 'q1', false, NOW)
    expect(missed.box).toBe(0)
    expect(missed.consecutiveCorrect).toBe(0)
  })

  it('schedules the next review by the box interval', () => {
    const item = scheduleNext(undefined, 'q1', true, NOW)
    const expected = new Date(NOW.getTime() + LEITNER_INTERVALS_DAYS[1]! * 86_400_000)
    expect(item.dueAt).toBe(expected.toISOString())
  })

  it('box 0 is due immediately — same session', () => {
    const item = scheduleNext(undefined, 'q1', false, NOW)
    expect(item.box).toBe(0)
    expect(isDue(item, NOW)).toBe(true)
  })
})

describe('session ordering — SC-014', () => {
  const questions = ['missed', 'overdue', 'due', 'unseen', 'future'].map(question)

  const reviewState: Record<string, ReviewItem> = {
    // Missed and overdue by 5 days
    missed: {
      questionId: 'missed',
      box: 0,
      lastAnsweredAt: daysLater(-5).toISOString(),
      dueAt: daysLater(-5).toISOString(),
      consecutiveCorrect: 0,
    },
    // Answered correctly but overdue by 2 days
    overdue: {
      questionId: 'overdue',
      box: 2,
      lastAnsweredAt: daysLater(-5).toISOString(),
      dueAt: daysLater(-2).toISOString(),
      consecutiveCorrect: 2,
    },
    // Due exactly now
    due: {
      questionId: 'due',
      box: 1,
      lastAnsweredAt: daysLater(-1).toISOString(),
      dueAt: NOW.toISOString(),
      consecutiveCorrect: 1,
    },
    // Mastered, not due for weeks
    future: {
      questionId: 'future',
      box: 4,
      lastAnsweredAt: NOW.toISOString(),
      dueAt: daysLater(21).toISOString(),
      consecutiveCorrect: 4,
    },
  }

  it('prioritises previously-missed overdue items first', () => {
    const session = buildReviewSession(questions, reviewState, NOW)
    expect(session[0]!.question.id).toBe('missed')
    expect(session[0]!.priority).toBe('overdue-missed')
  })

  it('orders overdue → due → unseen after that', () => {
    const session = buildReviewSession(questions, reviewState, NOW)
    expect(session.map((c) => c.question.id)).toEqual(['missed', 'overdue', 'due', 'unseen'])
  })

  it('excludes items scheduled for the future', () => {
    const session = buildReviewSession(questions, reviewState, NOW)
    expect(session.map((c) => c.question.id)).not.toContain('future')
  })

  it('ranks missed items above mastered ones — the core of SC-014', () => {
    const session = buildReviewSession(questions, reviewState, NOW)
    const missedIndex = session.findIndex((c) => c.question.id === 'missed')
    const futureIndex = session.findIndex((c) => c.question.id === 'future')
    expect(missedIndex).toBeGreaterThanOrEqual(0)
    expect(futureIndex).toBe(-1) // not even present
  })

  it('falls back to nearest-due rather than showing an empty session', () => {
    const allFuture = { future: reviewState.future! }
    const session = buildReviewSession([question('future')], allFuture, NOW)
    expect(session.length).toBeGreaterThan(0)
  })

  it('is deterministic for equal-priority items', () => {
    const a = buildReviewSession(questions, reviewState, NOW)
    const b = buildReviewSession(questions, reviewState, NOW)
    expect(a.map((c) => c.question.id)).toEqual(b.map((c) => c.question.id))
  })

  it('respects the session limit', () => {
    const many = Array.from({ length: 40 }, (_, i) => question(`q${i}`))
    expect(buildReviewSession(many, {}, NOW, 15)).toHaveLength(15)
  })
})

describe('countDue', () => {
  it('counts only items whose due date has arrived', () => {
    const questions = [question('a'), question('b')]
    const state: Record<string, ReviewItem> = {
      a: { questionId: 'a', box: 1, lastAnsweredAt: NOW.toISOString(), dueAt: daysLater(-1).toISOString(), consecutiveCorrect: 1 },
      b: { questionId: 'b', box: 3, lastAnsweredAt: NOW.toISOString(), dueAt: daysLater(7).toISOString(), consecutiveCorrect: 3 },
    }
    expect(countDue(questions, state, NOW)).toBe(1)
  })
})
