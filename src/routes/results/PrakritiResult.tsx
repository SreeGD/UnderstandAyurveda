import { Link } from 'react-router-dom'
import { contradictions, prakritiQuestions } from '../../content'
import { scoringConfig } from '../../content/config'
import { contentVersion } from '../../content/version'
import { DoshaBlend } from '../../components/DoshaBlend'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { ScoreBreakdown } from '../../components/ScoreBreakdown'
import { Callout, EmptyState } from '../../components/primitives'
import {
  CATEGORY_LABELS,
  CONFIDENCE_BLURB,
  CONFIDENCE_LABELS,
  DOSHA_LABELS,
  describeShape,
  triggeredContradictions,
} from '../../domain/scoring'
import { useProfile } from '../../hooks/useProfile'
import styles from './Results.module.css'

export function PrakritiResult() {
  const { latestPrakriti, prakritiIsStale, latestVikriti } = useProfile()

  if (!latestPrakriti?.result) {
    return (
      <div className="page">
        <EmptyState title="No result yet">
          <p>Take the constitution assessment and your result will appear here.</p>
          <Link className="btn" to="/assess">
            Start the assessment
          </Link>
        </EmptyState>
      </div>
    )
  }

  const profile = latestPrakriti.result
  const triggered = triggeredContradictions({
    assessmentType: 'prakriti',
    questions: prakritiQuestions,
    responses: latestPrakriti.responses,
    config: scoringConfig,
    contradictions,
  })

  const subProfileEntries = Object.entries(profile.subProfiles)

  return (
    <div className="page">
      <Disclaimer variant="standing" />

      <header className={styles.header}>
        <h1>Your constitution</h1>
        <p className="muted">
          Taken {new Date(latestPrakriti.completedAt ?? '').toLocaleDateString()} · everyone has all
          three patterns; what differs is the proportion.
        </p>
      </header>

      {prakritiIsStale && (
        <Callout tone="note" title="Produced under an earlier version">
          <p>
            This result was calculated with content version {latestPrakriti.contentVersion}; the app
            is now on {contentVersion}. It is still shown as it was. Retake the assessment if you
            would like a result under the current questions.
          </p>
        </Callout>
      )}

      <section className={`card ${styles.blendCard}`}>
        <DoshaBlend percentages={profile.percentages} dominant={profile.dominant} />

        <p className={styles.shapeText}>
          {describeShape(profile.shape, profile.dominant, DOSHA_LABELS)}
        </p>

        <div className={`${styles.confidence} ${styles[profile.confidence.level]}`}>
          <p className={styles.confidenceHead}>
            Confidence: <strong>{CONFIDENCE_LABELS[profile.confidence.level]}</strong>
          </p>
          <p className={styles.confidenceBlurb}>{CONFIDENCE_BLURB[profile.confidence.level]}</p>
          {profile.confidence.reasons.length > 0 && (
            <ul className={styles.reasons}>
              {profile.confidence.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {subProfileEntries.length > 1 && (
        <section className={styles.section}>
          <h2>How the three areas read separately</h2>
          <p className="muted">
            Sometimes your body and your mind point in different directions. That is common, and
            often more interesting than the headline number.
          </p>
          <div className={styles.subGrid}>
            {subProfileEntries.map(([category, vector]) => (
              <div key={category} className="card">
                <DoshaBlend
                  percentages={vector}
                  dominant={[]}
                  label={CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <ScoreBreakdown profile={profile} contradictions={triggered} />
      </section>

      <Callout tone="misconception" title="What this is, and is not">
        <p>
          This is a self-assessment, not a diagnosis of your constitution. A trained practitioner
          assesses over time and in person, using observation, pulse, and history — none of which a
          questionnaire has. Treat this as a well-reasoned starting point and a vocabulary for
          noticing things about yourself.
        </p>
      </Callout>

      <div className={styles.nextSteps}>
        <Link className="btn" to="/plan">
          See what to actually do
        </Link>
        {latestVikriti ? (
          <Link className="btn btn--secondary" to="/results/compare">
            Compare with how you are now
          </Link>
        ) : (
          <Link className="btn btn--secondary" to="/assess/vikriti">
            Check how you are right now
          </Link>
        )}
        <Link className="btn btn--secondary" to="/learn/prakriti-vikriti">
          Learn what this means
        </Link>
      </div>
    </div>
  )
}
