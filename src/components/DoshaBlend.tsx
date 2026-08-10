import { DOSHAS, type Dosha } from '../content/schema/common'
import { DOSHA_LABELS } from '../domain/scoring/types'
import styles from './DoshaBlend.module.css'

interface Props {
  percentages: Record<Dosha, number>
  dominant: Dosha[]
  /** Optional comparison bars, used by the vikriti view. */
  compareTo?: Record<Dosha, number>
  compareLabel?: string
  label?: string
}

/**
 * All three doshas, always.
 *
 * There is deliberately no prop that renders a single dosha name on its own.
 * FR-019 forbids presenting a rigid label as the primary result, and the
 * simplest way to enforce that is to give the UI no way to express it.
 *
 * Percentages are shown as text next to each bar — never conveyed by bar length
 * or colour alone (FR-049).
 */
export function DoshaBlend({ percentages, dominant, compareTo, compareLabel, label }: Props) {
  return (
    <div className={styles.blend}>
      {label && <p className={styles.caption}>{label}</p>}
      <ul className={styles.list}>
        {DOSHAS.map((dosha) => {
          const value = percentages[dosha]
          const isDominant = dominant.includes(dosha)
          return (
            <li key={dosha} className={styles.row}>
              <span className={styles.name}>
                {DOSHA_LABELS[dosha]}
                {isDominant && <span className={styles.leadTag}>leading</span>}
              </span>

              <span className={styles.track}>
                <span
                  className={`${styles.bar} ${styles[dosha]}`}
                  style={{ width: `${value}%` }}
                  aria-hidden="true"
                />
                {compareTo && (
                  <span
                    className={styles.compareMark}
                    style={{ left: `${compareTo[dosha]}%` }}
                    aria-hidden="true"
                  />
                )}
              </span>

              <span className={styles.value}>{value}%</span>
            </li>
          )
        })}
      </ul>

      {compareTo && (
        <p className={styles.legend}>
          <span className={styles.legendMark} aria-hidden="true" /> marks {compareLabel ?? 'your baseline'}
        </p>
      )}
    </div>
  )
}
