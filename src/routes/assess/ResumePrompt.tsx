import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import styles from './Assessment.module.css'

interface Props {
  answered: number
  total: number
  startedAt: string
  onResume: () => void
  onRestart: () => void
}

/**
 * Resume-or-restart (FR-025). Restarting is offered explicitly rather than
 * silently forcing stale answers on someone who left weeks ago — but the
 * default action is resume, because losing work by accident is worse.
 */
export function ResumePrompt({ answered, total, startedAt, onResume, onRestart }: Props) {
  const started = new Date(startedAt)
  const daysAgo = Math.floor((Date.now() - started.getTime()) / 86_400_000)

  return (
    <div className="page">
      <Disclaimer variant="standing" />
      <div className="prose">
        <h1>You have an assessment in progress</h1>
        <p>
          You answered {answered} of {total} questions
          {daysAgo === 0 ? ' earlier today' : daysAgo === 1 ? ' yesterday' : ` ${daysAgo} days ago`}.
        </p>
        {daysAgo > 14 && (
          <p className="muted">
            That was a while ago. If a lot has changed since, starting again may give you a cleaner
            reading — though remember this assessment asks about your whole adult life, not about
            recent weeks.
          </p>
        )}
      </div>

      <div className={styles.actions} style={{ marginTop: 'var(--s-5)' }}>
        <button type="button" className="btn" onClick={onResume}>
          Carry on where I left off
        </button>
        <button type="button" className="btn btn--secondary" onClick={onRestart}>
          Start again
        </button>
      </div>
    </div>
  )
}
