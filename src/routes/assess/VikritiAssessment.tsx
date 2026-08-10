import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { vikritiQuestions } from '../../content'
import { scoringConfig } from '../../content/config'
import { VIKRITI_SEVERITY_NOTICE } from '../../content/assessment'
import { contentVersion } from '../../content/version'
import { Callout, EmptyState } from '../../components/primitives'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { scoreAssessment } from '../../domain/scoring'
import { useProfile } from '../../hooks/useProfile'
import { useStore, useStoredDocument } from '../../hooks/useStore'
import { AssessmentRunner } from './AssessmentRunner'
import styles from './Assessment.module.css'

export function VikritiAssessment() {
  const navigate = useNavigate()
  const store = useStore()
  const doc = useStoredDocument()
  const { hasPrakriti } = useProfile()

  const [recordId] = useState(() => `vikriti-${new Date().toISOString()}`)
  const [severityAcknowledged, setSeverityAcknowledged] = useState(false)
  const [showSeverity, setShowSeverity] = useState(false)

  const record = doc.assessments.find((a) => a.id === recordId)
  const responses = record?.responses ?? {}

  // Gated on a baseline: a current-state reading is meaningless without one to
  // compare against (US6 acceptance scenario 3).
  if (!hasPrakriti) {
    return (
      <div className="page">
        <EmptyState title="You need a baseline first">
          <p>
            This assessment tells you how you are <em>right now</em> compared with your usual self —
            so it needs to know your usual self first.
          </p>
          <p className="muted">
            Take the constitution assessment, then come back. It is the longer of the two, and you
            only do it once.
          </p>
          <Link className="btn" to="/assess">
            Take the constitution assessment
          </Link>
        </EmptyState>
      </div>
    )
  }

  const ensureRecord = () => {
    store.update((draft) => {
      if (draft.assessments.some((a) => a.id === recordId)) return
      draft.assessments.push({
        id: recordId,
        assessmentType: 'vikriti',
        startedAt: new Date().toISOString(),
        completedAt: null,
        responses: {},
        redFlags: [],
        redFlagsAcknowledged: false,
        result: null,
        contentVersion,
      })
    })
  }

  const handleAnswer = (questionId: string, optionId: string) => {
    ensureRecord()
    store.update((draft) => {
      const target = draft.assessments.find((a) => a.id === recordId)
      if (target) target.responses[questionId] = optionId
    })
  }

  const complete = () => {
    const profile = scoreAssessment({
      assessmentType: 'vikriti',
      questions: vikritiQuestions,
      responses,
      config: scoringConfig,
    })

    store.update((draft) => {
      const target = draft.assessments.find((a) => a.id === recordId)
      if (!target) return
      target.completedAt = new Date().toISOString()
      target.result = profile
    })

    navigate('/results/compare')
  }

  if (showSeverity && !severityAcknowledged) {
    return (
      <div className="page">
        <Disclaimer variant="standing" />
        <div className="prose">
          <h1>One thing first</h1>
          <Callout tone="warning" title={VIKRITI_SEVERITY_NOTICE.title}>
            <p>{VIKRITI_SEVERITY_NOTICE.body}</p>
          </Callout>
        </div>
        <div className={styles.actions} style={{ marginTop: 'var(--s-5)' }}>
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/results')}>
            Leave this for now
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSeverityAcknowledged(true)
              complete()
            }}
          >
            I understand — show the comparison
          </button>
        </div>
      </div>
    )
  }

  return (
    <AssessmentRunner
      questions={vikritiQuestions}
      responses={responses}
      onAnswer={handleAnswer}
      onComplete={() => setShowSeverity(true)}
      onExit={() => navigate('/results')}
      title="How you are right now"
      intro="A shorter one. This is the changeable part — it is not your constitution, and a difficult month does not rewrite who you are."
    />
  )
}
