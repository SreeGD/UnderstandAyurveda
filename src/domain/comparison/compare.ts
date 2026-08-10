import type { ScoringConfig } from '../../content/config'
import { DOSHAS, type Dosha } from '../../content/schema/common'
import type { DoshaProfile } from '../scoring/types'

export type ChangeStatus = 'elevated' | 'diminished' | 'stable'

export interface DoshaDelta {
  dosha: Dosha
  prakritiPercent: number
  vikritiPercent: number
  /** Percentage points, vikriti minus prakriti. */
  delta: number
  status: ChangeStatus
}

export interface VikritiComparison {
  deltas: DoshaDelta[]
  elevated: Dosha[]
  diminished: Dosha[]
  /**
   * False when nothing crossed the threshold. The UI then says so plainly.
   *
   * A system that always finds an imbalance is a system that always has a reason
   * to recommend something. "Nothing notable has changed" is a real and common
   * outcome, and reporting it honestly is what keeps the rest credible.
   */
  hasNotableChange: boolean
  thresholdPoints: number
}

export function compareProfiles(
  prakriti: DoshaProfile,
  vikriti: DoshaProfile,
  config: ScoringConfig
): VikritiComparison {
  const threshold = config.elevationDeltaPoints

  const deltas: DoshaDelta[] = DOSHAS.map((dosha) => {
    const prakritiPercent = prakriti.percentages[dosha]
    const vikritiPercent = vikriti.percentages[dosha]
    const delta = vikritiPercent - prakritiPercent

    const status: ChangeStatus =
      delta >= threshold ? 'elevated' : delta <= -threshold ? 'diminished' : 'stable'

    return { dosha, prakritiPercent, vikritiPercent, delta, status }
  })

  const elevated = deltas.filter((d) => d.status === 'elevated').map((d) => d.dosha)
  const diminished = deltas.filter((d) => d.status === 'diminished').map((d) => d.dosha)

  return {
    deltas,
    elevated,
    diminished,
    hasNotableChange: elevated.length > 0 || diminished.length > 0,
    thresholdPoints: threshold,
  }
}

/** The single most elevated dosha, when there is one. Drives guidance shifts. */
export function primaryElevation(comparison: VikritiComparison): Dosha | null {
  const elevated = comparison.deltas
    .filter((d) => d.status === 'elevated')
    .sort((a, b) => b.delta - a.delta)
  return elevated[0]?.dosha ?? null
}
