import { Link } from 'react-router-dom'
import { lessonsInOrder } from '../../content'
import { useStoredDocument } from '../../hooks/useStore'
import styles from './Learn.module.css'

export function CourseIndex() {
  const doc = useStoredDocument()

  const completedCount = lessonsInOrder.filter(
    (l) => doc.lessonProgress[l.id]?.completedAt
  ).length

  return (
    <div className="page">
      <header className={styles.header}>
        <h1>The fundamentals</h1>
        <p className="muted">
          Eleven short lessons, in a recommended order. Every Sanskrit term is explained the first
          time it appears — you do not need to know any of it in advance.
        </p>
        <p className={styles.progressText}>
          {completedCount} of {lessonsInOrder.length} complete
        </p>
      </header>

      <ol className={styles.lessonList}>
        {lessonsInOrder.map((lesson) => {
          const progress = doc.lessonProgress[lesson.id]
          const complete = Boolean(progress?.completedAt)
          const started = Boolean(progress?.startedAt) && !complete

          return (
            <li key={lesson.id}>
              <Link to={`/learn/${lesson.id}`} className={styles.lessonCard}>
                <span className={styles.lessonNumber} aria-hidden="true">
                  {lesson.order}
                </span>
                <span className={styles.lessonMain}>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                  <span className={styles.lessonSummary}>{lesson.summary}</span>
                </span>
                <span className={styles.lessonMeta}>
                  {/* State is carried by text, not by colour alone (FR-049). */}
                  {complete && <span className={styles.statusDone}>✓ Complete</span>}
                  {started && <span className={styles.statusStarted}>In progress</span>}
                  <span className={styles.minutes}>{lesson.estimatedMinutes} min</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>

      <div className={styles.footer}>
        <Link className="btn btn--secondary" to="/quiz">
          Review what you have learned
        </Link>
        <Link className="btn btn--secondary" to="/reference">
          Look something up
        </Link>
      </div>
    </div>
  )
}
