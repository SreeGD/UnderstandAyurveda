/**
 * The only module in this codebase permitted to touch localStorage.
 *
 * Constitution Principle V (Privacy by Default) is NON-NEGOTIABLE, so it is made
 * auditable rather than promised: an ESLint rule forbids storage globals
 * everywhere else, which means reviewing the privacy guarantee is reviewing this
 * one file. Nothing here transmits anything anywhere — there is no network code
 * in this module and there never will be.
 *
 * See contracts/storage-schema.md for the invariants under test.
 */

import { contentVersion } from '../content/version'
import { migrate } from './migrations'
import {
  CURRENT_SCHEMA_VERSION,
  RECORD_SCHEMAS,
  STORAGE_KEY,
  STORAGE_NAMESPACE,
  emptyDocument,
  type RecordName,
  type StoredDocument,
} from './schema'

interface Backend {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  keys(): string[]
}

function localStorageBackend(): Backend {
  return {
    getItem: (k) => window.localStorage.getItem(k),
    setItem: (k, v) => window.localStorage.setItem(k, v),
    removeItem: (k) => window.localStorage.removeItem(k),
    keys: () => Object.keys(window.localStorage),
  }
}

/** Identical interface, no persistence. Used when the browser blocks storage. */
function memoryBackend(): Backend {
  const map = new Map<string, string>()
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    keys: () => [...map.keys()],
  }
}

function probeLocalStorage(): boolean {
  try {
    const probe = `${STORAGE_NAMESPACE}probe`
    window.localStorage.setItem(probe, '1')
    const read = window.localStorage.getItem(probe)
    window.localStorage.removeItem(probe)
    return read === '1'
  } catch {
    // Private browsing, quota exhausted, storage disabled by policy.
    return false
  }
}

const nowIso = () => new Date().toISOString()

export class Store {
  private backend: Backend
  private persistent: boolean
  private doc: StoredDocument
  private futureVersion = false
  private listeners = new Set<() => void>()

  constructor(backend?: Backend) {
    if (backend) {
      this.backend = backend
      this.persistent = true
    } else if (probeLocalStorage()) {
      this.backend = localStorageBackend()
      this.persistent = true
    } else {
      this.backend = memoryBackend()
      this.persistent = false
    }
    this.doc = this.load()
  }

  /** False when running on the in-memory fallback — the UI warns the user (FR-044). */
  isPersistent(): boolean {
    return this.persistent
  }

  /** True when the stored document came from a newer build; it is preserved read-only. */
  isFutureVersion(): boolean {
    return this.futureVersion
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => void this.listeners.delete(listener)
  }

  read(): StoredDocument {
    return this.doc
  }

  update(mutator: (draft: StoredDocument) => void): void {
    if (this.futureVersion) return // never overwrite a newer schema
    const draft = structuredClone(this.doc)
    mutator(draft)
    draft.updatedAt = nowIso()
    this.doc = draft
    this.persist()
    for (const l of this.listeners) l()
  }

  clearAll(): void {
    for (const key of this.backend.keys()) {
      if (key.startsWith(STORAGE_NAMESPACE)) this.backend.removeItem(key)
    }
    this.doc = emptyDocument(nowIso(), contentVersion)
    this.futureVersion = false
    for (const l of this.listeners) l()
  }

  /** Resets one record, leaving everything else intact. */
  clearRecord(name: RecordName): void {
    this.update((draft) => {
      const fresh = emptyDocument(draft.createdAt, contentVersion)
      ;(draft as Record<string, unknown>)[name] = (fresh as Record<string, unknown>)[name]
      if (draft._corrupt) delete draft._corrupt[name]
    })
  }

  getCorruptRecords(): string[] {
    return Object.keys(this.doc._corrupt ?? {})
  }

  /** The raw stored payload, offered for download before a destructive reset. */
  rawPayload(): string | null {
    return this.backend.getItem(STORAGE_KEY)
  }

  // -------------------------------------------------------------------------

  private load(): StoredDocument {
    const raw = this.backend.getItem(STORAGE_KEY)
    if (!raw) return emptyDocument(nowIso(), contentVersion)

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      // Outer JSON unreadable. Quarantine the whole payload rather than
      // silently discarding it — rawPayload() can still hand it to the user.
      const fresh = emptyDocument(nowIso(), contentVersion)
      fresh._corrupt = { root: raw }
      return fresh
    }

    if (typeof parsed !== 'object' || parsed === null) {
      const fresh = emptyDocument(nowIso(), contentVersion)
      fresh._corrupt = { root: raw }
      return fresh
    }

    const { document, isFutureVersion } = migrate(parsed as Record<string, unknown>)
    this.futureVersion = isFutureVersion

    const base = emptyDocument(
      typeof document.createdAt === 'string' ? document.createdAt : nowIso(),
      typeof document.contentVersion === 'string' ? document.contentVersion : contentVersion
    )
    const corrupt: Record<string, unknown> = {}

    // Records parse INDEPENDENTLY. A corrupt quiz history must never cost the
    // user their assessment results (invariant T4).
    for (const name of Object.keys(RECORD_SCHEMAS) as RecordName[]) {
      const value = document[name]
      if (value === undefined) continue
      const result = RECORD_SCHEMAS[name].safeParse(value)
      if (result.success) {
        ;(base as Record<string, unknown>)[name] = result.data
      } else {
        corrupt[name] = value
      }
    }

    if (typeof document.updatedAt === 'string') base.updatedAt = document.updatedAt
    if (document._corrupt && typeof document._corrupt === 'object') {
      Object.assign(corrupt, document._corrupt)
    }
    if (Object.keys(corrupt).length > 0) base._corrupt = corrupt

    base.schemaVersion = CURRENT_SCHEMA_VERSION
    return base
  }

  private persist(): void {
    try {
      this.backend.setItem(STORAGE_KEY, JSON.stringify(this.doc))
    } catch {
      // Quota exhausted mid-session: degrade to memory and tell the user
      // rather than silently dropping writes.
      this.backend = memoryBackend()
      this.persistent = false
      try {
        this.backend.setItem(STORAGE_KEY, JSON.stringify(this.doc))
      } catch {
        /* memory backend cannot fail; nothing further to do */
      }
    }
  }
}

let singleton: Store | null = null

export function getStore(): Store {
  if (!singleton) singleton = new Store()
  return singleton
}

/** Test hook. Not used by application code. */
export function resetStoreForTests(): void {
  singleton = null
}
