import { useState } from 'react'
import { RED_FLAG_ACKNOWLEDGEMENT, RED_FLAG_MESSAGES, redFlagQuestions } from '../../content/assessment'
import type { RedFlag } from '../../content/schema/assessment'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { Callout } from '../../components/primitives'
import styles from './Assessment.module.css'

interface Props {
  onContinue: (flags: RedFlag[]) => void
  onBack: () => void
}

/**
 * Screening gate (FR-023, SC-009).
 *
 * When any flag is set, professional-care guidance appears BEFORE the result and
 * must be acknowledged to proceed — not alongside the result, and not after it.
 * Someone managing something real deserves to hear "talk to a professional"
 * before they hear a questionnaire's opinion about their constitution.
 */
export function RedFlagScreen({ onContinue, onBack }: Props) {
  const [flags, setFlags] = useState<Set<RedFlag>>(new Set())
  const [acknowledged, setAcknowledged] = useState(false)

  const hasFlags = flags.size > 0

  const toggle = (id: RedFlag) => {
    setFlags((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setAcknowledged(false)
  }

  return (
    <div className="page">
      <Disclaimer variant="standing" />

      <header className={styles.header}>
        <h1>Before we show your result</h1>
        <p className="muted">
          A few questions about your situation. Nothing here is stored anywhere but this device, and
          none of it changes your dosha result — it only changes what we say alongside it.
        </p>
      </header>

      <fieldset className={styles.fieldset}>
        <legend className="visually-hidden">Health screening questions</legend>
        <div className={styles.flagList}>
          {redFlagQuestions.map((q) => (
            <label
              key={q.id}
              className={`${styles.flagItem} ${flags.has(q.id) ? styles.flagChecked : ''}`}
            >
              <input
                type="checkbox"
                className={styles.flagCheckbox}
                checked={flags.has(q.id)}
                onChange={() => toggle(q.id)}
              />
              <span>
                {q.prompt}
                {q.helpText && <span className={styles.flagHelp}>{q.helpText}</span>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {hasFlags && (
        <div className={styles.flagMessages} data-testid="red-flag-messages">
          {[...flags].map((flag) => {
            const message = RED_FLAG_MESSAGES[flag]
            if (!message) return null
            return (
              <Callout key={flag} tone="warning" title={message.title}>
                <p>{message.body}</p>
              </Callout>
            )
          })}
        </div>
      )}

      {hasFlags && (
        <label className={styles.ackBox}>
          <input
            type="checkbox"
            className={styles.flagCheckbox}
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            data-testid="red-flag-acknowledge"
          />
          <span>{RED_FLAG_ACKNOWLEDGEMENT}</span>
        </label>
      )}

      <div className={styles.actions}>
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn"
          disabled={hasFlags && !acknowledged}
          onClick={() => onContinue([...flags])}
          data-testid="red-flag-continue"
        >
          {hasFlags ? 'I understand — show my result' : 'None of these — show my result'}
        </button>
      </div>
    </div>
  )
}
