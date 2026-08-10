import { describe, expect, it } from 'vitest'
import type { QuizQuestion } from '../../src/content/schema/quiz'
import { computeTopicMastery } from '../../src/domain/review/mastery'
import type { ReviewItem } from '../../src/domain/review/schedule'

const NOW = new Date('2026-06-01T09:00:00.000Z')

function question(id: string): QuizQuestion {
  return {
    id,
    topic: 'six-tastes',
    lessonId: 'six-tastes',
    type: 'multiple-choice',
    prompt: id,
    options: [{ id: 'a', text: 'A' }],
    pairs: [],
    correctAnswer: 'a',
    whyCorrect: 'because',
    difficulty: 1,
  }
}

function item(id: string, box: number): ReviewItem {
  return {
    questionId: id,
    box,
    lastAnsweredAt: NOW.toISOString(),
    dueAt: NOW.toISOString(),
    consecutiveCorrect: box,
  }
}

const questions = Array.from({ length: 4 }, (_, i) => question(`q${i}`))

describe('mastery derivation', () => {
  it('is not-started when nothing has been attempted', () => {
    const mastery = computeTopicMastery('six-tastes', questions, {}, [], NOW)
    expect(mastery.level).toBe('not-started')
    expect(mastery.attempted).toBe(0)
    expect(mastery.fraction).toBe(0)
  })

  it('rises as boxes rise across the whole topic', () => {
    const low = computeTopicMastery(
      'six-tastes',
      questions,
      Object.fromEntries(questions.map((q) => [q.id, item(q.id, 1)])),
      [],
      NOW
    )
    const high = computeTopicMastery(
      'six-tastes',
      questions,
      Object.fromEntries(questions.map((q) => [q.id, item(q.id, 4)])),
      [],
      NOW
    )
    expect(high.fraction).toBeGreaterThan(low.fraction)
  })

  it('does not award mastery for a high box on a small slice of the topic', () => {
    // One question of four, at the top box. Coverage must hold this back.
    const partial = computeTopicMastery('six-tastes', questions, { q0: item('q0', 4) }, [], NOW)
    const full = computeTopicMastery(
      'six-tastes',
      questions,
      Object.fromEntries(questions.map((q) => [q.id, item(q.id, 4)])),
      [],
      NOW
    )
    expect(partial.fraction).toBeLessThan(full.fraction)
    expect(full.level).toBe('mastered')
    expect(partial.level).not.toBe('mastered')
  })

  it('reports how many items are due', () => {
    const state = {
      q0: { ...item('q0', 1), dueAt: new Date(NOW.getTime() - 1000).toISOString() },
      q1: { ...item('q1', 3), dueAt: new Date(NOW.getTime() + 86_400_000).toISOString() },
    }
    const mastery = computeTopicMastery('six-tastes', questions, state, [], NOW)
    expect(mastery.dueForReview).toBe(1)
  })

  it('computes correct rate from attempts', () => {
    const attempts = [
      { questionId: 'q0', correct: true },
      { questionId: 'q1', correct: false },
      { questionId: 'q2', correct: true },
      { questionId: 'q3', correct: true },
    ]
    const mastery = computeTopicMastery(
      'six-tastes',
      questions,
      { q0: item('q0', 1) },
      attempts,
      NOW
    )
    expect(mastery.correctRate).toBeCloseTo(0.75)
  })

  it('ignores attempts belonging to other topics', () => {
    const attempts = [{ questionId: 'unrelated-question', correct: false }]
    const mastery = computeTopicMastery(
      'six-tastes',
      questions,
      { q0: item('q0', 2) },
      attempts,
      NOW
    )
    expect(mastery.correctRate).toBeNull()
  })

  it('is a pure function of its inputs — nothing is stored', () => {
    const state = Object.fromEntries(questions.map((q) => [q.id, item(q.id, 2)]))
    const a = computeTopicMastery('six-tastes', questions, state, [], NOW)
    const b = computeTopicMastery('six-tastes', questions, state, [], NOW)
    expect(a).toEqual(b)
  })
})
