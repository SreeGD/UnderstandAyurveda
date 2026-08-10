import { Link } from 'react-router-dom'
import { ELEVATION_EXPLANATIONS, NO_NOTABLE_CHANGE } from '../../content/assessment'
import { scoringConfig } from '../../content/config'
import { DoshaBlend } from '../../components/DoshaBlend'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { ScoreBreakdown } from '../../components/ScoreBreakdown'
import { Callout, EmptyState } from '../../components/primitives'
import { compareProfiles } from '../../domain/comparison/compare'
import { DOSHA_LABELS } from '../../domain/scoring'
import { useProfile } from '../../hooks/useProfile'
import styles from './Results.module.css'

export function Comparison() {
  const { latestPrakriti, latestVikriti } = useProfile()

  if (!latestPrakriti?.result || !latestVikriti?.result) {
    return (
      <div className="page">
        <EmptyState title="Nothing to compare yet">
          <p>You need both a constitution reading and a current-state reading.</p>
          <Link className="btn" to={latestPrakriti ? '/assess/vikriti' : '/assess'}>
            {latestPrakriti ? 'Check how you are now' : 'Take the constitution assessment'}
          </Link>
        </EmptyState>
      </div>
    )
  }

  const prakriti = latestPrakriti.result
  const vikriti = latestVikriti.result
  const comparison = compareProfiles(prakriti, vikriti, scoringConfig)

  return (
    <div className="page">
      <Disclaimer variant="standing" />

      <header className={styles.header}>
        <h1>Now, compared with your baseline</h1>
        <p className="muted">
          Current reading from {new Date(latestVikriti.completedAt ?? '').toLocaleDateString()},
          against your constitution.
        </p>
      </header>

      <section className={`card ${styles.blendCard}`}>
        <DoshaBlend
          percentages={vikriti.percentages}
          dominant={vikriti.dominant}
          compareTo={prakriti.percentages}
          compareLabel="your baseline"
          label="How you are now"
        />
      </section>

      <div className={styles.deltaGrid}>
        {comparison.deltas.map((delta) => (
          <div key={delta.dosha} className={styles.deltaCard}>
            <p className={styles.deltaDosha}>{DOSHA_LABELS[delta.dosha]}</p>
            <p className={styles.deltaValue}>
              {delta.delta > 0 ? '+' : ''}
              {delta.delta}
            </p>
            <p className={`${styles.deltaStatus} ${styles[delta.status]}`}>
              {delta.status === 'stable' ? 'about the same' : delta.status}
            </p>
          </div>
        ))}
      </div>

      {comparison.hasNotableChange ? (
        <>
          {comparison.elevated.map((dosha) => {
            const explanation = ELEVATION_EXPLANATIONS[dosha]
            return (
              <section key={dosha} className={styles.section}>
                <Callout tone="warning" title={explanation.title}>
                  <p>
                    <strong>What this usually looks like: </strong>
                    {explanation.whatItLooksLike}
                  </p>
                  <p>
                    <strong>What it tends to follow: </strong>
                    {explanation.whatItUsuallyFollows}
                  </p>
                  <p>{explanation.temporary}</p>
                </Callout>
              </section>
            )
          })}
          <div className={styles.nextSteps}>
            <Link className="btn" to="/plan">
              See guidance for this
            </Link>
          </div>
        </>
      ) : (
        <Callout tone="note" title={NO_NOTABLE_CHANGE.title}>
          <p>{NO_NOTABLE_CHANGE.body}</p>
          <p className="text-sm muted">
            Nothing moved by {comparison.thresholdPoints} points or more, which is the threshold this
            app uses before it will name a shift.
          </p>
        </Callout>
      )}

      <section className={styles.section}>
        <ScoreBreakdown profile={vikriti} />
      </section>

      <div className={styles.nextSteps}>
        <Link className="btn btn--secondary" to="/results">
          Back to your constitution
        </Link>
        <Link className="btn btn--secondary" to="/results/history">
          See all your readings
        </Link>
      </div>
    </div>
  )
}
