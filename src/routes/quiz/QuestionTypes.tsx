import { useMemo, useState } from 'react'
import type { QuizQuestion } from '../../content/schema/quiz'
import styles from './Quiz.module.css'

interface ChoiceProps {
  question: QuizQuestion
  selected: string | null
  onSelect: (optionId: string) => void
  disabled: boolean
  correctAnswer: string | null
}

/** Multiple choice and applied scenario share a presentation. */
export function ChoiceQuestion({
  question,
  selected,
  onSelect,
  disabled,
  correctAnswer,
}: ChoiceProps) {
  return (
    <fieldset className={styles.fieldset} disabled={disabled}>
      <legend className="visually-hidden">{question.prompt}</legend>
      <div className={styles.options}>
        {question.options.map((option) => {
          const isSelected = selected === option.id
          const isCorrect = correctAnswer === option.id
          const showAsWrong = disabled && isSelected && !isCorrect
          const showAsRight = disabled && isCorrect

          return (
            <label
              key={option.id}
              className={[
                styles.option,
                isSelected ? styles.selected : '',
                showAsRight ? styles.right : '',
                showAsWrong ? styles.wrong : '',
              ].join(' ')}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className={styles.radio}
              />
              <span className={styles.optionText}>{option.text}</span>
              {/* Correctness is carried by an icon AND a word, never colour
                  alone (FR-049). */}
              {showAsRight && (
                <span className={styles.mark}>
                  <span aria-hidden="true">✓</span> Correct
                </span>
              )}
              {showAsWrong && (
                <span className={styles.mark}>
                  <span aria-hidden="true">✕</span> Your answer
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

interface MatchingProps {
  question: QuizQuestion
  answers: Record<string, string>
  onChange: (left: string, right: string) => void
  disabled: boolean
}

/**
 * Matching, built on <select> elements.
 *
 * Deliberately not drag-and-drop: a keyboard user must be able to complete every
 * flow (FR-048), and a native select gets that for free rather than through a
 * pile of ARIA that would need its own tests.
 */
export function MatchingQuestion({ question, answers, onChange, disabled }: MatchingProps) {
  const rights = useMemo(
    () => [...question.pairs.map((p) => p.right)].sort((a, b) => a.localeCompare(b)),
    [question.pairs]
  )

  return (
    <div className={styles.matching}>
      {question.pairs.map((pair) => {
        const chosen = answers[pair.left] ?? ''
        const isRight = disabled && chosen === pair.right
        const isWrong = disabled && chosen !== '' && chosen !== pair.right

        return (
          <div key={pair.left} className={styles.matchRow}>
            <label className={styles.matchLabel} htmlFor={`${question.id}-${pair.left}`}>
              {pair.left}
            </label>
            <select
              id={`${question.id}-${pair.left}`}
              className={[
                styles.matchSelect,
                isRight ? styles.right : '',
                isWrong ? styles.wrong : '',
              ].join(' ')}
              value={chosen}
              disabled={disabled}
              onChange={(e) => onChange(pair.left, e.target.value)}
            >
              <option value="">Choose…</option>
              {rights.map((right) => (
                <option key={right} value={right}>
                  {right}
                </option>
              ))}
            </select>
            {disabled && (
              <span className={styles.matchResult}>
                {isRight ? (
                  <>
                    <span aria-hidden="true">✓</span> Correct
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✕</span> Should be: {pair.right}
                  </>
                )}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Local state helper for a matching question. */
export function useMatchingAnswers() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const set = (left: string, right: string) =>
    setAnswers((prev) => ({ ...prev, [left]: right }))
  const reset = () => setAnswers({})
  return { answers, set, reset }
}
