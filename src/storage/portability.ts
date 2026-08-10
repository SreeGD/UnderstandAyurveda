import { contentVersion } from '../content/version'
import type { Store } from './store'
import { CURRENT_SCHEMA_VERSION } from './schema'

export const EXPORT_NOTICE =
  'This file contains everything UnderstandAyurveda stored on your device. It was never sent anywhere. This is educational content, not medical advice.'

export interface ExportBundle {
  exportedAt: string
  appVersion: string
  schemaVersion: number
  contentVersion: string
  notice: string
  preferences: unknown
  assessments: unknown
  lessonProgress: unknown
  quizAttempts: unknown
  reviewState: unknown
  corruptRecords: Record<string, unknown>
}

/**
 * Everything the app holds about you, in a form you can read without us.
 *
 * Two properties make this an export rather than a hostage: question prompts and
 * answer texts are embedded in the score breakdown (not just ids), so the file
 * means something on its own; and quarantined corrupt records travel too, so
 * nothing is quietly withheld.
 */
export function buildExport(store: Store, appVersion = '1.0.0'): ExportBundle {
  const doc = store.read()

  return {
    exportedAt: new Date().toISOString(),
    appVersion,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    contentVersion,
    notice: EXPORT_NOTICE,
    preferences: doc.preferences,
    assessments: doc.assessments,
    lessonProgress: doc.lessonProgress,
    quizAttempts: doc.quizAttempts,
    reviewState: doc.reviewState,
    corruptRecords: doc._corrupt ?? {},
  }
}

export function exportFilename(now = new Date()): string {
  const date = now.toISOString().slice(0, 10)
  return `understandayurveda-export-${date}.json`
}

/**
 * Client-side download via Blob + object URL. No network request — not as an
 * optimisation, but because Principle V does not permit one.
 */
export function downloadExport(bundle: ExportBundle, filename = exportFilename()): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  URL.revokeObjectURL(url)
}

/** Offered before a destructive reset, so unreadable data is never simply lost. */
export function downloadRawPayload(store: Store): boolean {
  const raw = store.rawPayload()
  if (raw === null) return false

  const blob = new Blob([raw], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `understandayurveda-raw-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
  return true
}

/** Categories shown on the data screen, so the user knows what is held (FR-043). */
export const STORED_CATEGORIES = [
  {
    key: 'assessments',
    label: 'Assessment results',
    description: 'Your answers, your dosha percentages, and the full score breakdown for each assessment you have taken.',
  },
  {
    key: 'lessonProgress',
    label: 'Lesson progress',
    description: 'Which lessons you have started and finished.',
  },
  {
    key: 'quizAttempts',
    label: 'Quiz history',
    description: 'Every question you have answered and whether you got it right.',
  },
  {
    key: 'reviewState',
    label: 'Review schedule',
    description: 'When each question is next due for review.',
  },
  {
    key: 'preferences',
    label: 'Preferences',
    description: 'Your season setting and whether you have seen the introduction.',
  },
] as const
