import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import { scoringConfig } from '../../src/content/config'
import { contradictions, prakritiQuestions, vikritiQuestions } from '../../src/content'
import { scoreAssessment } from '../../src/domain/scoring'
import { contentVersion } from '../../src/content/version'
import { getStore, resetStoreForTests } from '../../src/storage/store'
import type { DoshaProfile } from '../../src/domain/scoring/types'

export function renderAt(ui: ReactElement, route = '/') {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
}

/** Answers every prakriti question with the given dosha suffix. */
export function makeProfile(suffix: 'v' | 'p' | 'k' = 'v'): {
  profile: DoshaProfile
  responses: Record<string, string>
} {
  const responses = Object.fromEntries(
    prakritiQuestions.map((q) => {
      const option = q.options.find((o) => o.id.endsWith(`-${suffix}`)) ?? q.options[0]!
      return [q.id, option.id]
    })
  )
  const profile = scoreAssessment({
    assessmentType: 'prakriti',
    questions: prakritiQuestions,
    responses,
    config: scoringConfig,
    contradictions,
  })
  return { profile, responses }
}

export function makeVikritiProfile(suffix: 'v' | 'p' | 'k' = 'p'): DoshaProfile {
  const responses = Object.fromEntries(
    vikritiQuestions.map((q) => {
      const option = q.options.find((o) => o.id.endsWith(`-${suffix}`)) ?? q.options[0]!
      return [q.id, option.id]
    })
  )
  return scoreAssessment({
    assessmentType: 'vikriti',
    questions: vikritiQuestions,
    responses,
    config: scoringConfig,
  })
}

/** Seeds a completed prakriti assessment into the store. */
export function seedPrakriti(suffix: 'v' | 'p' | 'k' = 'v') {
  resetStoreForTests()
  const store = getStore()
  const { profile, responses } = makeProfile(suffix)

  store.update((draft) => {
    draft.assessments.push({
      id: 'seed-prakriti',
      assessmentType: 'prakriti',
      startedAt: '2026-06-01T09:00:00.000Z',
      completedAt: '2026-06-01T09:20:00.000Z',
      responses,
      redFlags: [],
      redFlagsAcknowledged: true,
      result: profile,
      contentVersion,
    })
  })

  return { store, profile }
}

export function resetStore() {
  resetStoreForTests()
  getStore().clearAll()
}
