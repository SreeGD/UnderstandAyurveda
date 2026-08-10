import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { scoringConfig } from '../../src/content/config'
import { assessmentQuestions, contradictions } from '../../src/content/assessment'
import { recommendationRules } from '../../src/content/recommendations'
import { selectRecommendations } from '../../src/domain/recommendations/select'
import { scoreAssessment } from '../../src/domain/scoring'
import { buildExport } from '../../src/storage/portability'
import { Store } from '../../src/storage/store'

/**
 * Invariant T8 / SC-010 — no user data ever leaves the device.
 *
 * Two complementary checks: a runtime one that fails if any network API is
 * touched during a full journey, and a static one over the source tree. The
 * static check is the one that catches a future contributor adding an
 * innocent-looking analytics snippet.
 */

const SRC = join(__dirname, '../../src')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return full.endsWith('.ts') || full.endsWith('.tsx') ? [full] : []
  })
}

describe('runtime — a complete user journey touches no network API', () => {
  let fetchSpy: ReturnType<typeof vi.fn>
  let beaconSpy: ReturnType<typeof vi.fn>
  let xhrOpenSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchSpy = vi.fn(() => Promise.reject(new Error('network call attempted')))
    beaconSpy = vi.fn(() => false)
    xhrOpenSpy = vi.fn()

    vi.stubGlobal('fetch', fetchSpy)
    vi.stubGlobal('navigator', { ...navigator, sendBeacon: beaconSpy })
    vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(
      xhrOpenSpy as unknown as XMLHttpRequest['open']
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('assessment → scoring → plan → storage → export makes zero requests', () => {
    const store = new Store()

    // Onboarding
    store.update((d) => void (d.preferences.hasSeenOnboarding = true))

    // Take the full prakriti assessment
    const prakriti = assessmentQuestions.filter((q) => q.assessmentType === 'prakriti')
    const responses = Object.fromEntries(prakriti.map((q) => [q.id, q.options[0]!.id]))

    const profile = scoreAssessment({
      assessmentType: 'prakriti',
      questions: prakriti,
      responses,
      config: scoringConfig,
      contradictions,
    })

    // Persist the result
    store.update((d) => {
      d.assessments.push({
        id: 'a1',
        assessmentType: 'prakriti',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        responses,
        redFlags: [],
        redFlagsAcknowledged: true,
        result: profile,
        contentVersion: '2026.08.01',
      })
    })

    // Generate a plan
    const plan = selectRecommendations(profile, 'summer', recommendationRules)
    expect(plan.sections.length).toBeGreaterThan(0)

    // Export everything
    const bundle = buildExport(store)
    expect(bundle.assessments).toBeDefined()

    // Delete everything
    store.clearAll()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(beaconSpy).not.toHaveBeenCalled()
    expect(xhrOpenSpy).not.toHaveBeenCalled()
  })
})

describe('static — the source tree contains no network or tracking code', () => {
  const files = sourceFiles(SRC)

  it('finds source files to check', () => {
    expect(files.length).toBeGreaterThan(20)
  })

  it.each([
    ['fetch(', /\bfetch\s*\(/],
    ['XMLHttpRequest', /\bnew\s+XMLHttpRequest\b/],
    ['sendBeacon', /\bsendBeacon\b/],
    ['WebSocket', /\bnew\s+WebSocket\b/],
    ['EventSource', /\bnew\s+EventSource\b/],
    ['analytics/tracking', /\b(gtag|dataLayer|_paq|mixpanel|amplitude|posthog|segment\.)\b/],
  ])('no %s anywhere in src/', (_label, pattern) => {
    const offenders = files.filter((file) => {
      const contents = readFileSync(file, 'utf8')
      // The ESLint rule message and this test's own documentation mention these
      // names in prose; only flag actual code usage.
      const withoutComments = contents.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
      return pattern.test(withoutComments)
    })

    expect(offenders.map((f) => f.replace(SRC, 'src'))).toEqual([])
  })

  it('localStorage is touched only inside src/storage/', () => {
    const offenders = files.filter((file) => {
      if (file.includes('/storage/')) return false
      const contents = readFileSync(file, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
      return /\blocalStorage\b|\bsessionStorage\b/.test(contents)
    })

    expect(
      offenders.map((f) => f.replace(SRC, 'src')),
      'storage access outside src/storage/ breaks the audit boundary (Principle V)'
    ).toEqual([])
  })
})
