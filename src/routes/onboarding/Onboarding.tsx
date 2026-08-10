import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onboardingSteps } from '../../content/onboarding'
import { BlockRenderer } from '../../components/BlockRenderer'
import { FocusOnMount, ProgressBar } from '../../components/primitives'
import { useStore } from '../../hooks/useStore'
import styles from './Onboarding.module.css'

/**
 * Shown before any assessment question (FR-001). Covers what Ayurveda is, the
 * educational-not-medical framing, and the prakriti/vikriti distinction — a
 * result the reader cannot interpret is worse than no result at all.
 */
export function Onboarding() {
  const navigate = useNavigate()
  const store = useStore()
  const [index, setIndex] = useState(0)

  const step = onboardingSteps[index]
  if (!step) return null

  const isLast = index === onboardingSteps.length - 1

  const finish = () => {
    store.update((draft) => {
      draft.preferences.hasSeenOnboarding = true
    })
    navigate('/assess')
  }

  return (
    <div className="page">
      <ProgressBar
        value={index + 1}
        max={onboardingSteps.length}
        label={`Step ${index + 1} of ${onboardingSteps.length}`}
      />

      <FocusOnMount key={step.id}>
        <h1 className={styles.title} tabIndex={-1} data-focus-target>
          {step.title}
        </h1>
        <BlockRenderer blocks={step.body} />
      </FocusOnMount>

      <div className={styles.actions}>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => (index === 0 ? navigate('/') : setIndex((i) => i - 1))}
        >
          {index === 0 ? 'Back to start' : 'Back'}
        </button>

        {isLast ? (
          <button type="button" className="btn" onClick={finish}>
            Start the assessment
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setIndex((i) => i + 1)}>
            Next
          </button>
        )}
      </div>

      <p className={styles.skip}>
        <Link to="/learn">Or read the full course first</Link> — the assessment will still be here.
      </p>
    </div>
  )
}
