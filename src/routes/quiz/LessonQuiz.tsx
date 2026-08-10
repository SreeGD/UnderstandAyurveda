import { useNavigate, useParams } from 'react-router-dom'
import { quizById, questionsForQuiz } from '../../content'
import { EmptyState } from '../../components/primitives'
import { scheduleNext } from '../../domain/review/schedule'
import { useStore } from '../../hooks/useStore'
import { QuizRunner, type QuizResult } from './QuizRunner'

export function LessonQuiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const store = useStore()

  const quiz = quizId ? quizById.get(quizId) : undefined
  const questions = quizId ? questionsForQuiz(quizId) : []

  if (!quiz || questions.length === 0) {
    return (
      <div className="page">
        <EmptyState title="Quiz not found">
          <button className="btn" type="button" onClick={() => navigate('/learn')}>
            Back to the course
          </button>
        </EmptyState>
      </div>
    )
  }

  const finish = (results: QuizResult[]) => {
    const now = new Date()
    const sessionId = now.toISOString()
    const passed = results.filter((r) => r.correct).length >= Math.ceil(results.length * 0.6)

    store.update((draft) => {
      for (const result of results) {
        draft.quizAttempts.push({
          questionId: result.questionId,
          quizId: quiz.id,
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

      const progress = draft.lessonProgress[quiz.lessonId] ?? {
        startedAt: now.toISOString(),
        completedAt: null,
        knowledgeCheckPassed: false,
      }
      progress.knowledgeCheckPassed = progress.knowledgeCheckPassed || passed
      if (passed && !progress.completedAt) progress.completedAt = now.toISOString()
      draft.lessonProgress[quiz.lessonId] = progress
    })

    navigate(`/quiz/${quiz.id}/done`, {
      state: { correct: results.filter((r) => r.correct).length, total: results.length },
    })
  }

  return (
    <QuizRunner
      title={quiz.title}
      questions={questions}
      onFinish={finish}
      onExit={() => navigate(`/learn/${quiz.lessonId}`)}
    />
  )
}
