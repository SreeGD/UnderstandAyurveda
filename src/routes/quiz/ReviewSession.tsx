import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizQuestions } from '../../content'
import { EmptyState } from '../../components/primitives'
import { scheduleNext } from '../../domain/review/schedule'
import { buildReviewSession } from '../../domain/review/session'
import { useStore, useStoredDocument } from '../../hooks/useStore'
import { QuizRunner, type QuizResult } from './QuizRunner'

/**
 * Cumulative review. Draws only from lessons the user has completed (FR-015),
 * ordered so previously-missed items come first (SC-014).
 */
export function ReviewSession() {
  const navigate = useNavigate()
  const store = useStore()
  const doc = useStoredDocument()

  const questions = useMemo(() => {
    const completedLessons = new Set(
      Object.entries(doc.lessonProgress)
        .filter(([, p]) => p.completedAt || p.knowledgeCheckPassed)
        .map(([id]) => id)
    )

    const pool = quizQuestions.filter(
      (q) => completedLessons.has(q.lessonId) || doc.reviewState[q.id] !== undefined
    )

    return buildReviewSession(pool, doc.reviewState, new Date(), 12).map((c) => c.question)
  }, [doc])

  if (questions.length === 0) {
    return (
      <div className="page">
        <EmptyState title="Nothing to review yet">
          <p>
            Review sessions draw from lessons you have completed. Finish a lesson and its check, and
            questions will start appearing here.
          </p>
          <button type="button" className="btn" onClick={() => navigate('/learn')}>
            Go to the course
          </button>
        </EmptyState>
      </div>
    )
  }

  const finish = (results: QuizResult[]) => {
    const now = new Date()
    const sessionId = now.toISOString()

    store.update((draft) => {
      for (const result of results) {
        draft.quizAttempts.push({
          questionId: result.questionId,
          quizId: 'review',
          answerGiven: result.answerGiven,
          correct: result.correct,
          answeredAt: now.toISOString(),
          sessionId,
        })
        draft.reviewState[result.questionId] = scheduleNext(
          draft.reviewState[result.questionId],
          result.questionId,
          result.correct,
          now
        )
      }
    })

    navigate('/quiz')
  }

  return (
    <QuizRunner
      title="Review session"
      questions={questions}
      onFinish={finish}
      onExit={() => navigate('/quiz')}
    />
  )
}
