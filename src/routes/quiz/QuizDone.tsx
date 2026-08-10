import { Link, useLocation, useParams } from 'react-router-dom'
import { quizById, lessonById, lessonsInOrder } from '../../content'
import styles from '../learn/Learn.module.css'

export function QuizDone() {
  const { quizId } = useParams<{ quizId: string }>()
  const location = useLocation()
  const state = location.state as { correct?: number; total?: number } | null

  const quiz = quizId ? quizById.get(quizId) : undefined
  const lesson = quiz ? lessonById.get(quiz.lessonId) : undefined
  const index = lesson ? lessonsInOrder.findIndex((l) => l.id === lesson.id) : -1
  const next = index >= 0 ? lessonsInOrder[index + 1] : undefined

  const correct = state?.correct ?? 0
  const total = state?.total ?? 0

  return (
    <div className="page">
      <div className="prose">
        <h1>Check complete</h1>
        {total > 0 && (
          <p>
            You got <strong>{correct} of {total}</strong>.
          </p>
        )}
        <p className="muted">
          Anything you missed will come back in a review session — sooner than the ones you got
          right. That is the point of spacing them out.
        </p>
      </div>

      <div className={styles.footer}>
        {next && (
          <Link className="btn" to={`/learn/${next.id}`}>
            Next lesson: {next.title}
          </Link>
        )}
        <Link className="btn btn--secondary" to="/quiz">
          See your progress
        </Link>
        {lesson && (
          <Link className="btn btn--secondary" to={`/learn/${lesson.id}`}>
            Re-read the lesson
          </Link>
        )}
      </div>
    </div>
  )
}
