import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { lessons, quizQuestions } from '../../content'
import { TOPICS } from '../../content/schema/common'
import { computeAllMastery } from '../../domain/review/mastery'
import { countDue } from '../../domain/review/session'
import { useStoredDocument } from '../../hooks/useStore'
import styles from './Quiz.module.css'

const TOPIC_TITLES = Object.fromEntries(lessons.map((l) => [l.topic, l.title]))

export function Progress() {
  const doc = useStoredDocument()

  const { mastery, due } = useMemo(() => {
    const now = new Date()
    const attempts = doc.quizAttempts.map((a) => ({
      questionId: a.questionId,
      correct: a.correct,
    }))
    return {
      mastery: computeAllMastery(TOPICS, quizQuestions, doc.reviewState, attempts, now),
      due: countDue(quizQuestions, doc.reviewState, now),
    }
  }, [doc])

  const started = mastery.filter((m) => m.attempted > 0)

  return (
    <div className="page">
      <header className={styles.header}>
        <h1>What you have absorbed</h1>
        <p className="muted">
          Mastery is worked out from how you have answered over time, not from a single quiz. It
          takes both how well you did and how much of the topic you have attempted.
        </p>
      </header>

      <div className={styles.actions} style={{ marginBottom: 'var(--s-6)' }}>
        <Link className="btn" to="/review">
          {due > 0 ? `Review ${due} item${due === 1 ? '' : 's'} due` : 'Start a review session'}
        </Link>
        <Link className="btn btn--secondary" to="/learn">
          Back to the course
        </Link>
      </div>

      {started.length === 0 ? (
        <p className="muted">
          Nothing yet. Finish a lesson and take its check, and your progress will show up here.
        </p>
      ) : (
        <ul className={styles.masteryList}>
          {mastery.map((topic) => (
            <li key={topic.topic} className={styles.masteryRow}>
              <span className={styles.masteryTopic}>
                {TOPIC_TITLES[topic.topic] ?? topic.topic}
                {topic.dueForReview > 0 && (
                  <span className={styles.dueTag}>{topic.dueForReview} due</span>
                )}
              </span>

              <span className={styles.masteryTrack}>
                <span
                  className={styles.masteryFill}
                  style={{ width: `${Math.round(topic.fraction * 100)}%` }}
                  aria-hidden="true"
                />
              </span>

              <span className={styles.masteryLabel}>
                {topic.label}
                {topic.attempted > 0 && ` · ${topic.attempted}/${topic.total}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
