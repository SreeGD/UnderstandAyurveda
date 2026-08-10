import { useMemo } from 'react'
import { contentVersion } from '../content/version'
import type { AssessmentRecord } from '../storage/schema'
import { useStoredDocument } from './useStore'

export interface ProfileState {
  latestPrakriti: AssessmentRecord | null
  latestVikriti: AssessmentRecord | null
  inProgress: AssessmentRecord | null
  allCompleted: AssessmentRecord[]
  hasPrakriti: boolean
  /** True when the stored result predates the current content version (FR-046). */
  prakritiIsStale: boolean
}

export function useProfile(): ProfileState {
  const doc = useStoredDocument()

  return useMemo(() => {
    const completed = doc.assessments.filter((a) => a.completedAt !== null && a.result !== null)
    const byNewest = [...completed].sort((a, b) =>
      (b.completedAt ?? '').localeCompare(a.completedAt ?? '')
    )

    const latestPrakriti = byNewest.find((a) => a.assessmentType === 'prakriti') ?? null
    const latestVikriti = byNewest.find((a) => a.assessmentType === 'vikriti') ?? null
    const inProgress = doc.assessments.find((a) => a.completedAt === null) ?? null

    return {
      latestPrakriti,
      latestVikriti,
      inProgress,
      allCompleted: byNewest,
      hasPrakriti: latestPrakriti !== null,
      prakritiIsStale:
        latestPrakriti !== null && latestPrakriti.contentVersion !== contentVersion,
    }
  }, [doc])
}
