import { Link } from 'react-router-dom'
import { DoshaBlend } from '../../components/DoshaBlend'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { EmptyState } from '../../components/primitives'
import { CONFIDENCE_LABELS } from '../../domain/scoring'
import { useProfile } from '../../hooks/useProfile'
import styles from './Results.module.css'

export function History() {
  const { allCompleted } = useProfile()

  if (allCompleted.length === 0) {
    return (
      <div className="page">
        <EmptyState title="No readings yet">
          <p>Assessments you complete will be listed here with their dates.</p>
          <Link className="btn" to="/assess">
            Take the constitution assessment
          </Link>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="page">
      <Disclaimer variant="standing" />

      <header className={styles.header}>
        <h1>Your readings</h1>
        <p className="muted">
          Every assessment you have completed, newest first. Stored on this device only.
        </p>
      </header>

      <ul className={styles.historyList}>
        {allCompleted.map((record) => {
          const result = record.result
          if (!result) return null
          return (
            <li key={record.id} className={styles.historyItem}>
              <div className={styles.historyMeta}>
                <span className={styles.historyType}>
                  {record.assessmentType === 'prakriti' ? 'Constitution' : 'Current state'}
                </span>
                <span>
                  {new Date(record.completedAt ?? '').toLocaleDateString()} ·{' '}
                  {CONFIDENCE_LABELS[result.confidence.level]} confidence · {result.answeredCount} of{' '}
                  {result.totalCount} answered
                </span>
              </div>
              <DoshaBlend percentages={result.percentages} dominant={result.dominant} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
