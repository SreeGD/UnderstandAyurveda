import { DOSHAS } from '../content/schema/common'
import { DOSHA_LABELS, type DoshaProfile } from '../domain/scoring/types'
import { Disclosure } from './primitives'
import styles from './ScoreBreakdown.module.css'

interface Props {
  profile: DoshaProfile
  contradictions?: Array<{ explanation: string }>
}

/**
 * The arithmetic itself, not a summary of it.
 *
 * Every question appears — including the ones the user skipped, shown as
 * skipped. Summing the `points` columns reproduces the result exactly; that is
 * asserted by invariant S4, so what is displayed here is the actual calculation
 * rather than a plausible-looking reconstruction of it (FR-021).
 */
export function ScoreBreakdown({ profile, contradictions = [] }: Props) {
  const answered = profile.breakdown.filter((b) => b.answerText !== null)
  const skipped = profile.breakdown.filter((b) => b.answerText === null)

  return (
    <Disclosure summary="How was this calculated?">
      <div className="stack">
        <p className={styles.intro}>
          Each answer adds points to one or more doshas. Some questions count for more than others —
          stable physical traits are more telling about a lifelong constitution than mood is, so they
          carry a higher weight. Your percentages are these totals, divided by the total awarded.
        </p>

        <div className={styles.totals}>
          {DOSHAS.map((d) => (
            <div key={d} className={styles.total}>
              <span className={styles.totalLabel}>{DOSHA_LABELS[d]}</span>
              <span className={styles.totalValue}>{profile.rawTotals[d].toFixed(1)} pts</span>
              <span className={styles.totalPercent}>{profile.percentages[d]}%</span>
            </div>
          ))}
        </div>

        {contradictions.length > 0 && (
          <div className={styles.contradictions}>
            <h4>Answers that do not usually go together</h4>
            <ul>
              {contradictions.map((c, i) => (
                <li key={i}>{c.explanation}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="scroll-x">
          <table className={styles.table}>
            <caption className="visually-hidden">
              Every assessment question, the answer you gave, and the points it contributed to each
              dosha
            </caption>
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Your answer</th>
                <th scope="col">Weight</th>
                <th scope="col">Vata</th>
                <th scope="col">Pitta</th>
                <th scope="col">Kapha</th>
              </tr>
            </thead>
            <tbody>
              {answered.map((row) => (
                <tr key={row.questionId}>
                  <th scope="row" className={styles.prompt}>
                    {row.questionPrompt}
                  </th>
                  <td>{row.answerText}</td>
                  <td className={styles.num}>×{row.reliability}</td>
                  {DOSHAS.map((d) => (
                    <td key={d} className={styles.num}>
                      {row.points[d] > 0 ? row.points[d].toFixed(1) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {skipped.length > 0 && (
          <details className={styles.skipped}>
            <summary>{skipped.length} question(s) you skipped</summary>
            <ul>
              {skipped.map((row) => (
                <li key={row.questionId}>{row.questionPrompt}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </Disclosure>
  )
}
