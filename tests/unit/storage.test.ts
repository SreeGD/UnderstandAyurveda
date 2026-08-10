import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { migrate } from '../../src/storage/migrations'
import { buildExport } from '../../src/storage/portability'
import { CURRENT_SCHEMA_VERSION, STORAGE_KEY, emptyDocument } from '../../src/storage/schema'
import { Store } from '../../src/storage/store'

/** Invariants T1-T8 from contracts/storage-schema.md. */

const readRaw = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')

beforeEach(() => {
  window.localStorage.clear()
})

describe('T2 — clearAll returns the app to first-run state', () => {
  it('removes every key in the namespace', () => {
    const store = new Store()
    store.update((d) => {
      d.preferences.hasSeenOnboarding = true
      d.quizAttempts.push({
        questionId: 'q1',
        quizId: 'quiz1',
        answerGiven: 'a',
        correct: true,
        answeredAt: new Date().toISOString(),
        sessionId: 's1',
      })
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()

    store.clearAll()

    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith('understandayurveda:'))
    expect(keys).toEqual([])
    expect(store.read().quizAttempts).toEqual([])
    expect(store.read().preferences.hasSeenOnboarding).toBe(false)
  })
})

describe('T3 — export contains every stored record', () => {
  it('every top-level record appears in the bundle', () => {
    const store = new Store()
    store.update((d) => {
      d.preferences.season = 'summer'
      d.lessonProgress['five-elements'] = {
        startedAt: new Date().toISOString(),
        completedAt: null,
        knowledgeCheckPassed: false,
      }
      d.quizAttempts.push({
        questionId: 'q1',
        quizId: 'quiz1',
        answerGiven: 'a',
        correct: false,
        answeredAt: new Date().toISOString(),
        sessionId: 's1',
      })
      d.reviewState.q1 = {
        questionId: 'q1',
        box: 0,
        lastAnsweredAt: new Date().toISOString(),
        dueAt: new Date().toISOString(),
        consecutiveCorrect: 0,
      }
    })

    const bundle = buildExport(store)
    const doc = store.read()

    expect(bundle.preferences).toEqual(doc.preferences)
    expect(bundle.lessonProgress).toEqual(doc.lessonProgress)
    expect(bundle.quizAttempts).toEqual(doc.quizAttempts)
    expect(bundle.reviewState).toEqual(doc.reviewState)
    expect(bundle.assessments).toEqual(doc.assessments)
    expect(bundle.notice).toMatch(/never sent anywhere/i)
    expect(bundle.notice).toMatch(/not medical advice/i)
  })

  it('carries quarantined records rather than quietly withholding them', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...emptyDocument(new Date().toISOString(), '1'), quizAttempts: 'garbage' })
    )
    const store = new Store()
    const bundle = buildExport(store)
    expect(Object.keys(bundle.corruptRecords)).toContain('quizAttempts')
  })
})

describe('T4 — a corrupt record never costs the user the others', () => {
  it('keeps assessments when quiz history is unreadable', () => {
    const now = new Date().toISOString()
    const doc = emptyDocument(now, '2026.08.01')
    doc.assessments = [
      {
        id: 'a1',
        assessmentType: 'prakriti',
        startedAt: now,
        completedAt: now,
        responses: { q1: 'q1-v' },
        redFlags: [],
        redFlagsAcknowledged: false,
        result: null,
        contentVersion: '2026.08.01',
      },
    ]

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...doc, quizAttempts: { not: 'an array' } })
    )

    const store = new Store()
    expect(store.read().assessments).toHaveLength(1)
    expect(store.read().assessments[0]!.id).toBe('a1')
    expect(store.getCorruptRecords()).toContain('quizAttempts')
    expect(store.read().quizAttempts).toEqual([])
  })

  it('survives entirely unparseable JSON without throwing', () => {
    window.localStorage.setItem(STORAGE_KEY, '{"quizAttempts":')
    const store = new Store()
    expect(store.getCorruptRecords()).toContain('root')
    expect(store.read().assessments).toEqual([])
  })

  it('offers the raw payload back before a reset', () => {
    window.localStorage.setItem(STORAGE_KEY, '{"broken"')
    const store = new Store()
    expect(store.rawPayload()).toBe('{"broken"')
  })

  it('clearRecord resets one record and leaves the rest', () => {
    const store = new Store()
    store.update((d) => {
      d.preferences.season = 'winter'
      d.quizAttempts.push({
        questionId: 'q1',
        quizId: 'quiz1',
        answerGiven: 'a',
        correct: true,
        answeredAt: new Date().toISOString(),
        sessionId: 's1',
      })
    })

    store.clearRecord('quizAttempts')

    expect(store.read().quizAttempts).toEqual([])
    expect(store.read().preferences.season).toBe('winter')
  })
})

describe('T5 — storage unavailable degrades instead of failing', () => {
  it('falls back to memory and reports non-persistence', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    const store = new Store()
    expect(store.isPersistent()).toBe(false)

    // The app must still work for the session.
    expect(() => store.update((d) => void (d.preferences.hasSeenOnboarding = true))).not.toThrow()
    expect(store.read().preferences.hasSeenOnboarding).toBe(true)

    setItem.mockRestore()
  })

  it('degrades mid-session when a write starts failing', () => {
    const store = new Store()
    expect(store.isPersistent()).toBe(true)

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    store.update((d) => void (d.preferences.season = 'autumn'))
    expect(store.isPersistent()).toBe(false)
    expect(store.read().preferences.season).toBe('autumn')

    setItem.mockRestore()
  })
})

describe('a real v1 payload loads intact', () => {
  it('every record survives a round trip from the stored fixture', () => {
    const raw = readFileSync(join(__dirname, '../fixtures/storage/v1.json'), 'utf8')
    window.localStorage.setItem(STORAGE_KEY, raw)

    const store = new Store()
    const doc = store.read()

    expect(store.getCorruptRecords()).toEqual([])
    expect(doc.preferences.season).toBe('summer')
    expect(doc.preferences.hasSeenOnboarding).toBe(true)
    expect(Object.keys(doc.lessonProgress)).toHaveLength(2)
    expect(doc.quizAttempts).toHaveLength(2)
    expect(Object.keys(doc.reviewState)).toHaveLength(2)
    expect(doc.assessments).toHaveLength(1)

    // The stored profile keeps its breakdown and its stated reasons.
    const result = doc.assessments[0]!.result!
    expect(result.percentages.vata).toBe(100)
    expect(result.confidence.level).toBe('low')
    expect(result.confidence.reasons[0]).toMatch(/answered 3 of 50/)
    expect(result.breakdown[0]!.answerText).toMatch(/Slight and narrow/)
  })

  it('a v1 payload with one damaged record keeps the rest', () => {
    const parsed = JSON.parse(
      readFileSync(join(__dirname, '../fixtures/storage/v1.json'), 'utf8')
    )
    parsed.reviewState = 'not an object'
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))

    const store = new Store()
    expect(store.getCorruptRecords()).toEqual(['reviewState'])
    expect(store.read().assessments).toHaveLength(1)
    expect(store.read().quizAttempts).toHaveLength(2)
  })
})

describe('T6/T7 — migrations', () => {
  it('a current-version document passes through unchanged', () => {
    const doc = emptyDocument(new Date().toISOString(), '2026.08.01')
    const result = migrate(doc as unknown as Record<string, unknown>)
    expect(result.isFutureVersion).toBe(false)
    expect(result.applied).toEqual([])
  })

  it('a document from a NEWER version is preserved, never downgraded', () => {
    const future = { schemaVersion: CURRENT_SCHEMA_VERSION + 5, somethingNew: true }
    const result = migrate(future)
    expect(result.isFutureVersion).toBe(true)
    expect(result.document).toEqual(future)
  })

  it('the store refuses to overwrite a future-version document', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION + 1, preferences: { hasSeenOnboarding: true } })
    )
    const store = new Store()
    expect(store.isFutureVersion()).toBe(true)

    const before = window.localStorage.getItem(STORAGE_KEY)
    store.update((d) => void (d.preferences.hasSeenOnboarding = false))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(before)
  })
})

describe('round-tripping', () => {
  it('data written survives a reload', () => {
    const store = new Store()
    store.update((d) => {
      d.preferences.season = 'spring'
      d.lessonProgress.agni = {
        startedAt: '2026-06-01T00:00:00.000Z',
        completedAt: '2026-06-01T00:10:00.000Z',
        knowledgeCheckPassed: true,
      }
    })

    const reloaded = new Store()
    expect(reloaded.read().preferences.season).toBe('spring')
    expect(reloaded.read().lessonProgress.agni?.knowledgeCheckPassed).toBe(true)
  })

  it('stamps schemaVersion and updatedAt on write', () => {
    const store = new Store()
    store.update((d) => void (d.preferences.hasSeenOnboarding = true))
    const raw = readRaw()
    expect(raw.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    expect(typeof raw.updatedAt).toBe('string')
  })

  it('notifies subscribers on change', () => {
    const store = new Store()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.update((d) => void (d.preferences.season = 'summer'))
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    store.update((d) => void (d.preferences.season = 'winter'))
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
