import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { contradictions, prakritiQuestions } from '../../content'
import { scoringConfig } from '../../content/config'
import type { RedFlag } from '../../content/schema/assessment'
import { contentVersion } from '../../content/version'
import { scoreAssessment } from '../../domain/scoring'
import { useProfile } from '../../hooks/useProfile'
import { useStore, useStoredDocument } from '../../hooks/useStore'
import { AssessmentRunner } from './AssessmentRunner'
import { RedFlagScreen } from './RedFlagScreen'
import { ResumePrompt } from './ResumePrompt'

type Stage = 'resume' | 'questions' | 'red-flags'

export function PrakritiAssessment() {
  const navigate = useNavigate()
  const store = useStore()
  const doc = useStoredDocument()
  const { inProgress } = useProfile()

  const existing = inProgress?.assessmentType === 'prakriti' ? inProgress : null
  const hasProgress = existing !== null && Object.keys(existing.responses).length > 0

  const [stage, setStage] = useState<Stage>(hasProgress ? 'resume' : 'questions')
  const [recordId, setRecordId] = useState<string>(existing?.id ?? `prakriti-${doc.createdAt}`)

  const record = doc.assessments.find((a) => a.id === recordId)
  const responses = record?.responses ?? {}

  const ensureRecord = () => {
    store.update((draft) => {
      if (draft.assessments.some((a) => a.id === recordId)) return
      draft.assessments.push({
        id: recordId,
        assessmentType: 'prakriti',
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

  const restart = () => {
    const freshId = `prakriti-${new Date().toISOString()}`
    store.update((draft) => {
      draft.assessments = draft.assessments.filter((a) => a.id !== recordId)
    })
    setRecordId(freshId)
    setStage('questions')
  }

  const finish = (flags: RedFlag[]) => {
    const profile = scoreAssessment({
      assessmentType: 'prakriti',
      questions: prakritiQuestions,
      responses,
      config: scoringConfig,
      contradictions,
    })

    store.update((draft) => {
      const target = draft.assessments.find((a) => a.id === recordId)
      if (!target) return
      target.completedAt = new Date().toISOString()
      target.redFlags = flags
      target.redFlagsAcknowledged = true
      target.result = profile
      target.contentVersion = contentVersion
    })

    navigate('/results')
  }

  if (stage === 'resume' && existing) {
    return (
      <ResumePrompt
        answered={Object.keys(existing.responses).length}
        total={prakritiQuestions.length}
        startedAt={existing.startedAt}
        onResume={() => setStage('questions')}
        onRestart={restart}
      />
    )
  }

  if (stage === 'red-flags') {
    return <RedFlagScreen onContinue={finish} onBack={() => setStage('questions')} />
  }

  return (
    <AssessmentRunner
      questions={prakritiQuestions}
      responses={responses}
      onAnswer={handleAnswer}
      onComplete={() => setStage('red-flags')}
      onExit={() => navigate('/')}
      title="Your constitution"
      // Deliberately NOT the same sentence as the per-question help text —
      // stacked on a phone, the repetition reads as a rendering fault.
      intro="About fifty questions. Nothing is stored anywhere but this device, and you can stop and come back at any point."
    />
  )
}
