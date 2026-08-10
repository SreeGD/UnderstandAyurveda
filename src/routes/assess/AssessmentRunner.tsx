import { useMemo, useState } from 'react'
import type { AssessmentQuestion } from '../../content/schema/assessment'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { FocusOnMount, LiveRegion, ProgressBar } from '../../components/primitives'
import styles from './Assessment.module.css'

interface Props {
  questions: AssessmentQuestion[]
  responses: Record<string, string>
  onAnswer: (questionId: string, optionId: string) => void
  onComplete: () => void
  onExit: () => void
  title: string
  intro: string
}

/**
 * Shared by both assessments.
 *
 * Accessibility decisions made here rather than retrofitted: each question is a
 * fieldset with its prompt as the legend, options are a real radio group,
 * progress is a labelled progressbar, and focus moves to the question heading on
 * advance so a screen-reader user is not stranded at the top of the page
 * (FR-048, FR-049).
 */
export function AssessmentRunner({
  questions,
  responses,
  onAnswer,
  onComplete,
  onExit,
  title,
  intro,
}: Props) {
  // Resume at the first unanswered question (FR-025).
  const firstUnanswered = useMemo(() => {
    const index = questions.findIndex((q) => responses[q.id] === undefined)
    return index === -1 ? questions.length - 1 : index
  }, [questions, responses])

  const [index, setIndex] = useState(firstUnanswered)
  const [announcement, setAnnouncement] = useState('')

  const question = questions[index]
  if (!question) return null

  const answeredCount = Object.keys(responses).length
  const isLast = index === questions.length - 1
  const currentAnswer = responses[question.id]

  const advance = () => {
    if (isLast) {
      onComplete()
      return
    }
    setIndex((i) => i + 1)
    setAnnouncement(`Question ${index + 2} of ${questions.length}`)
  }

  const goBack = () => {
    if (index === 0) {
      onExit()
      return
    }
    setIndex((i) => i - 1)
    setAnnouncement(`Question ${index} of ${questions.length}`)
  }

  return (
    <div className="page">
      <Disclaimer variant="standing" />

      <header className={styles.header}>
        <h1>{title}</h1>
        <p className="muted">{intro}</p>
      </header>

      <ProgressBar
        value={answeredCount}
        max={questions.length}
        label={`Question ${index + 1} of ${questions.length} · ${answeredCount} answered`}
      />

      <LiveRegion message={announcement} />

      <FocusOnMount key={question.id}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <h2 className={styles.prompt} tabIndex={-1} data-focus-target>
              {question.prompt}
            </h2>
            {question.helpText && <p className={styles.help}>{question.helpText}</p>}
            {question.optional && <p className={styles.optional}>This one is optional.</p>}
          </legend>

          <div className={styles.options}>
            {question.options.map((option) => (
              <label
                key={option.id}
                className={`${styles.option} ${currentAnswer === option.id ? styles.selected : ''}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={currentAnswer === option.id}
                  onChange={() => onAnswer(question.id, option.id)}
                  className={styles.radio}
                />
                <span className={styles.optionText}>{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </FocusOnMount>

      <div className={styles.actions}>
        <button type="button" className="btn btn--secondary" onClick={goBack}>
          {index === 0 ? 'Leave' : 'Back'}
        </button>

        <div className={styles.actionsRight}>
          {question.optional && currentAnswer === undefined && (
            <button type="button" className="btn btn--secondary" onClick={advance}>
              Skip
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={advance}
            disabled={currentAnswer === undefined && !question.optional}
          >
            {isLast ? 'See my result' : 'Next'}
          </button>
        </div>
      </div>

      <p className={styles.saveNote}>
        Your answers save as you go, on this device only. You can close this and come back.
      </p>
    </div>
  )
}
