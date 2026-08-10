import { useState } from 'react'
import type { QuizQuestion } from '../../content/schema/quiz'
import { FocusOnMount, LiveRegion, ProgressBar } from '../../components/primitives'
import { ChoiceQuestion, MatchingQuestion, useMatchingAnswers } from './QuestionTypes'
import styles from './Quiz.module.css'

export interface QuizResult {
  questionId: string
  correct: boolean
  answerGiven: string | string[]
}

interface Props {
  title: string
  questions: QuizQuestion[]
  onFinish: (results: QuizResult[]) => void
  onExit: () => void
}

export function QuizRunner({ title, questions, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [announcement, setAnnouncement] = useState('')
  const matching = useMatchingAnswers()

  const question = questions[index]
  if (!question) return null

  const isLast = index === questions.length - 1
  const correctAnswer = typeof question.correctAnswer === 'string' ? question.correctAnswer : null

  const evaluate = (): { correct: boolean; answerGiven: string | string[] } => {
    if (question.type === 'matching') {
      const allRight = question.pairs.every((p) => matching.answers[p.left] === p.right)
      return { correct: allRight, answerGiven: Object.values(matching.answers) }
    }
    return { correct: selected === correctAnswer, answerGiven: selected ?? '' }
  }

  const check = () => {
    const { correct, answerGiven } = evaluate()
    setChecked(true)
    setResults((prev) => [...prev, { questionId: question.id, correct, answerGiven }])
    setAnnouncement(
      correct
        ? 'Correct. Explanation shown below.'
        : 'Not quite. Explanation shown below.'
    )
  }

  const advance = () => {
    if (isLast) {
      onFinish(results)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setChecked(false)
    matching.reset()
    setAnnouncement(`Question ${index + 2} of ${questions.length}`)
  }

  const canCheck =
    question.type === 'matching'
      ? question.pairs.every((p) => matching.answers[p.left])
      : selected !== null

  const lastResult = results[results.length - 1]
  const wasCorrect = checked && lastResult?.correct === true

  const chosenOption = question.options.find((o) => o.id === selected)

  return (
    <div className="page">
      <header className={styles.header}>
        <h1>{title}</h1>
      </header>

      <ProgressBar
        value={index + (checked ? 1 : 0)}
        max={questions.length}
        label={`Question ${index + 1} of ${questions.length}`}
      />

      <LiveRegion message={announcement} />

      <FocusOnMount key={question.id}>
        <div className={styles.questionCard}>
          <p className={styles.typeTag}>
            {question.type === 'scenario'
              ? 'Applied scenario'
              : question.type === 'matching'
                ? 'Matching'
                : 'Multiple choice'}
          </p>
          <h2 className={styles.prompt} tabIndex={-1} data-focus-target>
            {question.prompt}
          </h2>

          {question.type === 'matching' ? (
            <MatchingQuestion
              question={question}
              answers={matching.answers}
              onChange={matching.set}
              disabled={checked}
            />
          ) : (
            <ChoiceQuestion
              question={question}
              selected={selected}
              onSelect={setSelected}
              disabled={checked}
              correctAnswer={correctAnswer}
            />
          )}
        </div>
      </FocusOnMount>

      {checked && (
        <div
          className={`${styles.feedback} ${wasCorrect ? styles.feedbackRight : styles.feedbackWrong}`}
          data-testid="answer-feedback"
        >
          <p className={styles.feedbackHead}>
            <span aria-hidden="true">{wasCorrect ? '✓' : '✕'}</span>{' '}
            {wasCorrect ? 'Correct' : 'Not quite'}
          </p>

          {/* Why the WRONG answer was wrong — this is where the learning is. */}
          {!wasCorrect && chosenOption?.whyWrong && (
            <p className={styles.whyWrong}>
              <strong>Why your answer does not work: </strong>
              {chosenOption.whyWrong}
            </p>
          )}

          <p className={styles.whyCorrect}>
            <strong>Why the answer is what it is: </strong>
            {question.whyCorrect}
          </p>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className="btn btn--secondary" onClick={onExit}>
          Leave
        </button>
        {checked ? (
          <button type="button" className="btn" onClick={advance}>
            {isLast ? 'Finish' : 'Next question'}
          </button>
        ) : (
          <button type="button" className="btn" onClick={check} disabled={!canCheck}>
            Check answer
          </button>
        )}
      </div>
    </div>
  )
}
