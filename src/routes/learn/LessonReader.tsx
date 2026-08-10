import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { lessonById, lessonsInOrder } from '../../content'
import { BlockRenderer } from '../../components/BlockRenderer'
import { Callout, EmptyState } from '../../components/primitives'
import { useStore, useStoredDocument } from '../../hooks/useStore'
import styles from './Learn.module.css'

export function LessonReader() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const store = useStore()
  const doc = useStoredDocument()

  const lesson = lessonId ? lessonById.get(lessonId) : undefined

  // Mark started on open. Deliberately not gated on scroll depth — a reader who
  // opens a lesson and leaves has still started it.
  useEffect(() => {
    if (!lesson) return
    if (doc.lessonProgress[lesson.id]) return
    store.update((draft) => {
      draft.lessonProgress[lesson.id] = {
        startedAt: new Date().toISOString(),
        completedAt: null,
        knowledgeCheckPassed: false,
      }
    })
  }, [lesson, doc.lessonProgress, store])

  if (!lesson) {
    return (
      <div className="page">
        <EmptyState title="Lesson not found">
          <Link className="btn" to="/learn">
            Back to the course
          </Link>
        </EmptyState>
      </div>
    )
  }

  const index = lessonsInOrder.findIndex((l) => l.id === lesson.id)
  const next = lessonsInOrder[index + 1]
  const progress = doc.lessonProgress[lesson.id]
  const unmetPrerequisites = lesson.prerequisiteConcepts.filter(
    (p) => p.lessonId && !doc.lessonProgress[p.lessonId]?.completedAt
  )

  return (
    <div className="page">
      <nav className={styles.breadcrumb}>
        <Link to="/learn">The fundamentals</Link>
        <span aria-hidden="true"> / </span>
        <span>
          Lesson {lesson.order} of {lessonsInOrder.length}
        </span>
      </nav>

      <header className={styles.lessonHeader}>
        <h1>{lesson.title}</h1>
        <p className="muted">{lesson.summary}</p>
        <p className={styles.readTime}>{lesson.estimatedMinutes} minute read</p>
      </header>

      {/* Prerequisites are named, never enforced (FR-010). */}
      {unmetPrerequisites.length > 0 && (
        <Callout tone="note" title="This builds on earlier lessons">
          <p>You can read this now — but these come first in the recommended order:</p>
          <ul>
            {unmetPrerequisites.map((p, i) => (
              <li key={i}>
                {p.lessonId ? <Link to={`/learn/${p.lessonId}`}>{p.label}</Link> : p.label}
              </li>
            ))}
          </ul>
        </Callout>
      )}

      <article className={styles.article}>
        <BlockRenderer blocks={lesson.body} />
      </article>

      <section className={styles.checkSection}>
        <h2>Check yourself</h2>
        {progress?.completedAt ? (
          <>
            <p className="muted">
              You completed this on {new Date(progress.completedAt).toLocaleDateString()}.
            </p>
            <div className={styles.footer}>
              <Link className="btn btn--secondary" to={`/quiz/${lesson.quizId}`}>
                Take the check again
              </Link>
              {next && (
                <Link className="btn" to={`/learn/${next.id}`}>
                  Next: {next.title}
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="muted">
              A few questions to see what stuck. Every answer comes with an explanation of why.
            </p>
            <div className={styles.footer}>
              <Link className="btn" to={`/quiz/${lesson.quizId}`}>
                Start the check
              </Link>
              {next && (
                <Link className="btn btn--secondary" to={`/learn/${next.id}`}>
                  Skip to the next lesson
                </Link>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
