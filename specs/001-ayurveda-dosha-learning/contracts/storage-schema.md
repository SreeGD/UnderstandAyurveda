# Contract: Local Storage

**Module**: `src/storage/` | **Scope**: the *only* code permitted to touch `localStorage`

Principle V is NON-NEGOTIABLE, so it is made auditable rather than promised: an ESLint
`no-restricted-globals`/`no-restricted-properties` rule forbids `localStorage` and `sessionStorage`
outside `src/storage/`, and a test asserts the rule is configured. Reviewing the privacy guarantee
means reviewing one directory.

## Key and shape

Single key: `understandayurveda:userdata`

```ts
interface StoredDocument {
  schemaVersion: number          // current: 1
  contentVersion: string
  createdAt: string              // ISO8601
  updatedAt: string
  preferences: Preferences
  lessonProgress: Record<LessonId, LessonProgress>
  quizAttempts: QuizAttempt[]
  reviewState: Record<QuestionId, ReviewItem>
  assessments: AssessmentRecord[]
  _corrupt?: Record<string, unknown>
}
```

## Interface

```ts
interface Store {
  isAvailable(): boolean
  isPersistent(): boolean               // false when running on the in-memory fallback
  read(): StoredDocument
  update(mutator: (draft: StoredDocument) => void): void
  export(): ExportBundle                // see export-format.md
  clearAll(): void
  clearRecord(key: keyof StoredDocument): void
  getCorruptRecords(): string[]
}
```

No other module constructs a `StoredDocument` directly.

## Availability probe

At startup, attempt a write/read/delete of a throwaway key.

- **Success** → real `localStorage` backend.
- **Throws** (private browsing, quota, blocked, disabled) → in-memory backend with an identical
  interface, `isPersistent()` returns `false`, and the app renders a persistent banner stating
  progress cannot be saved (FR-044). The app remains fully usable for the session.

Quota exhaustion mid-session is handled the same way: the write fails, the app degrades to
in-memory and tells the user — it never silently drops data.

## Corruption handling (FR-045)

Records parse **independently**, not as one document:

1. Read raw string; if the outer JSON is unparseable, quarantine the whole payload under
   `_corrupt.root` and start fresh, telling the user their data could not be read and offering the
   raw payload for download before reset.
2. Otherwise `safeParse` each top-level record separately. Valid records load; invalid ones move to
   `_corrupt[recordName]` and the app offers a targeted reset for that record only.

A corrupt quiz history must never cost the user their assessment results.

## Migrations

```ts
const migrations: Record<number, (doc: unknown) => unknown> = { /* 1 → 2, 2 → 3, … */ }
```

Applied in ascending order from the document's `schemaVersion` to current. Rules:

- Migrations are **pure and forward-only**; each is unit tested against a stored fixture of the
  prior version.
- A document from a **newer** schema version than the running app is not downgraded and not
  discarded — it is preserved read-only, with a message to update the app. Users who load an old
  cached build must not lose data.
- Every migration ships with a fixture in `tests/fixtures/storage/v<N>.json`.

## Invariants (asserted in tests)

| # | Invariant |
|---|---|
| T1 | No module outside `src/storage/` references `localStorage` — enforced by lint and asserted by test |
| T2 | `clearAll()` leaves zero keys under the `understandayurveda:` namespace and returns the app to verified first-run state (SC-016) |
| T3 | `export()` contains every record present in the document (SC-016) |
| T4 | A corrupt single record never prevents other records from loading |
| T5 | Storage unavailable → app functions for the session, `isPersistent()` is `false`, banner shown |
| T6 | Migration chain applied to a v1 fixture yields a document valid against the current schema |
| T7 | A future-version document is preserved unmodified |
| T8 | No write path transmits data anywhere — asserted by a test that fails on any `fetch`/`XMLHttpRequest`/`sendBeacon` call during a full user journey (SC-010) |
