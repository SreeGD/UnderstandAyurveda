# Phase 1 Data Model

**Feature**: `001-ayurveda-dosha-learning` | **Date**: 2026-08-08

Two populations of data with different lifecycles:

- **Content** — authored, shipped in the bundle, immutable at runtime, reviewed by a domain expert,
  validated at build time. Lives in `src/content/`.
- **User state** — created by the person using the app, stored only on their device, versioned and
  migratable. Lives behind `src/storage/`.

Nothing crosses that line except by explicit reference: user state stores content **ids** and the
`contentVersion` under which it was produced, never copies of content.

---

## Content Entities

### GlossaryTerm

The unit that makes Principle I checkable.

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | kebab-case, unique across glossary; the target of `[[id]]` markup |
| `term` | `string` | Canonical Roman transliteration (e.g. `Vata`, `Agni`) |
| `devanagari` | `string?` | Optional original script |
| `aliases` | `string[]` | Alternate spellings/transliterations — feeds search (`dosa`, `doṣa`) |
| `pronunciation` | `string` | Plain-reader hint (e.g. `VAH-tuh`) — **required** |
| `meaning` | `string` | Plain-English meaning — **required** |
| `example` | `string` | Concrete everyday example — **required** |
| `relatedTerms` | `GlossaryTerm.id[]` | Must all resolve |
| `taughtIn` | `Lesson.id[]` | Lessons that introduce it |
| `source` | `SourceAttribution` | **Required** |

**Validation**: all three of `pronunciation`, `meaning`, `example` non-empty (FR-005); every
`relatedTerms`/`taughtIn` id resolves; `id` unique.

### Lesson

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | kebab-case, unique |
| `title` | `string` | |
| `topic` | `TopicId` | Links lesson → quiz items → mastery |
| `order` | `number` | Recommended sequence position |
| `estimatedMinutes` | `number` | 1–30 |
| `summary` | `string` | One-sentence "what you'll get" |
| `prerequisiteConcepts` | `{ termId, lessonId }[]` | Named, never enforced as a block (FR-010) |
| `body` | `ContentBlock[]` | Structured blocks, not markdown |
| `quizId` | `Quiz.id` | The end-of-lesson knowledge check |

### ContentBlock (discriminated union on `kind`)

| `kind` | Payload | Notes |
|---|---|---|
| `paragraph` | `text` | May contain `[[term-id\|display]]` markup |
| `list` | `ordered: boolean`, `items: string[]` | |
| `termIntro` | `termId`, `text` | Renders meaning + pronunciation + example inline; the first-use introduction Principle I requires |
| `callout` | `tone: 'note'\|'warning'\|'misconception'`, `text` | `misconception` is used to correct common wellness-industry errors |
| `example` | `scenario`, `text` | Everyday illustration |
| `table` | `headers: string[]`, `rows: string[][]` | e.g. the twenty gunas |
| `sourceNote` | `source: SourceAttribution`, `text?` | Explicit attribution anchor |

**Substantive-claim rule**: any `paragraph`, `list`, `table`, or `callout` block carrying a factual
claim about Ayurveda must have `source` set on the block, or be preceded within the same section by
a `sourceNote` block. Enforced by the content validator (FR-007, SC-005).

### SourceAttribution

| Field | Type | Rules |
|---|---|---|
| `authority` | `string` | `Charaka Samhita`, `Sushruta Samhita`, `Ashtanga Hridayam`, or a named modern authority |
| `reference` | `string` | Locatable — chapter/verse where classical |
| `claimType` | `'classical' \| 'contested' \| 'modern-interpretation'` | **Required** |
| `note` | `string?` | Required when `contested` — states how sources differ (FR-008) |

### QuizQuestion

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | unique |
| `topic` | `TopicId` | drives mastery aggregation |
| `lessonId` | `Lesson.id` | source lesson |
| `type` | `'multiple-choice' \| 'matching' \| 'scenario'` | FR-012 |
| `prompt` | `string` | |
| `options` | `QuizOption[]` | MCQ/scenario: 3–5; matching: left/right pairs |
| `correctAnswer` | `string \| string[]` | option id(s), or pair mapping for matching |
| `whyCorrect` | `string` | **Required** — explains the reasoning, not just the fact (FR-013) |
| `difficulty` | `1 \| 2 \| 3` | |

`QuizOption` = `{ id, text, whyWrong?: string }` — `whyWrong` **required on every incorrect
option** (FR-013, second clause). Validator asserts this.

### AssessmentQuestion

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | unique |
| `assessmentType` | `'prakriti' \| 'vikriti'` | |
| `category` | `'physical' \| 'physiological' \| 'mental-emotional'` | Sub-profile grouping for the consistency signal |
| `prompt` | `string` | Plain English — no Sanskrit required to answer |
| `helpText` | `string?` | Disambiguates ("think of your whole adult life, not this month") |
| `reliability` | `number` | 0.5–2.0. Stable physical traits weigh more for prakriti (R1) |
| `optional` | `boolean` | Skippable questions reduce completeness, not validity |
| `options` | `AssessmentOption[]` | Typically 3, one per dosha |
| `contradicts` | `{ questionId, optionId, withOptionId }[]?` | Declares mutually exclusive answer pairs — feeds the consistency signal |

`AssessmentOption` = `{ id, text, weights: DoshaVector }` where
`DoshaVector = { vata: number, pitta: number, kapha: number }`, values ≥ 0, at least one > 0.

### RecommendationRule

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | unique |
| `area` | `'routine' \| 'meals' \| 'movement' \| 'seasonal' \| 'self-care'` | FR-027 — all five must be covered for every profile shape |
| `appliesWhen` | `RuleCondition` | see below |
| `guidance` | `string` | The actionable text |
| `because` | `string` | **Required** — the profile characteristic it addresses (FR-028) |
| `seasons` | `Season[]?` | Omitted = all seasons |
| `source` | `SourceAttribution` | **Required** |

`RuleCondition` = `{ dosha: 'vata'|'pitta'|'kapha'|'balanced', mode: 'dominant'|'elevated'|'any', minPercent?: number }`.
`balanced` rules exist specifically so tri-doshic and evenly-balanced profiles receive coherent
general guidance instead of three contradictory dosha-specific sets (FR-031).

**Validation**: every rule passes the medical-safety lint (R4); for each of the four canonical
profile shapes (vata-dominant, pitta-dominant, kapha-dominant, balanced) every `area` yields ≥1
rule — a coverage test, so no profile can produce an empty section.

### ReferenceEntry

| Field | Type | Rules |
|---|---|---|
| `id` | `string` | unique |
| `category` | `'dosha' \| 'guna' \| 'taste' \| 'herb' \| 'dhatu' \| 'srota' \| 'season'` | FR-034 |
| `name`, `aliases`, `pronunciation` | | as GlossaryTerm |
| `summary` | `string` | One-line plain English |
| `body` | `ContentBlock[]` | |
| `relatedEntries` | `ReferenceEntry.id[]` | must resolve |
| `linkedLessons` | `Lesson.id[]` | FR-037 |
| `source` | `SourceAttribution` | **Required** |

**Herb-specific rule** (FR-036): entries with `category: 'herb'` must carry
`practitionerNotice: true`, and the medical-safety lint runs against them with no `allowLint`
escape permitted — description and traditional context only, never dosing or preparation-for-
treatment.

### ContentConfig

Thresholds live in content, not code, so they are inspectable and tunable without a code review:
`dualDoshaMarginPoints` (8), `triDoshicSpreadPoints` (10), `elevationDeltaPoints` (10), confidence
band cutoffs, Leitner intervals `[0, 1, 3, 7, 21]` days.

---

## User State Entities

Root document, stored under one namespaced key:

```
UserData {
  schemaVersion: number
  contentVersion: string
  createdAt, updatedAt: ISO8601
  preferences: { season, reducedMotion?, hasSeenOnboarding }
  lessonProgress: Record<Lesson.id, LessonProgress>
  quizAttempts: QuizAttempt[]
  reviewState: Record<QuizQuestion.id, ReviewItem>
  assessments: AssessmentRecord[]
  _corrupt?: Record<string, unknown>   // quarantined unparseable records (R9)
}
```

### AssessmentRecord

| Field | Type | Notes |
|---|---|---|
| `id`, `assessmentType`, `startedAt`, `completedAt?` | | `completedAt` null = in progress, drives resume (FR-025) |
| `responses` | `Record<AssessmentQuestion.id, optionId>` | |
| `redFlags` | `RedFlag[]` | `pregnancy \| acute-symptoms \| diagnosed-condition \| current-medication` |
| `result` | `DoshaProfile?` | Computed on completion, stored so history survives content drift |
| `contentVersion` | `string` | Enables the "produced under an earlier version" notice (FR-046) |

### DoshaProfile

| Field | Type | Notes |
|---|---|---|
| `percentages` | `{ vata, pitta, kapha }` | Integers summing to exactly 100 (largest-remainder rounding) |
| `dominant` | `Dosha[]` | 1–3 entries — an array, structurally preventing a single rigid label (FR-019, FR-022) |
| `shape` | `'single' \| 'dual' \| 'tridoshic'` | |
| `confidence` | `{ level: 'high'\|'moderate'\|'low', signals: {...}, reasons: string[] }` | Reasons are user-facing sentences (FR-020) |
| `breakdown` | `ScoreContribution[]` | Per question: answer given, points to each dosha (FR-021) |
| `subProfiles` | `Record<category, DoshaVector>` | Physical / physiological / mental-emotional — powers the consistency signal and an honest "your body and mind read differently" explanation |

### LessonProgress / QuizAttempt / ReviewItem

- `LessonProgress` — `{ startedAt, completedAt?, knowledgeCheckPassed }` (FR-009).
- `QuizAttempt` — `{ questionId, quizId, answerGiven, correct, answeredAt, sessionId }`; append-only,
  the raw record from which mastery and scheduling derive (FR-014).
- `ReviewItem` — `{ questionId, box: 0..4, lastAnsweredAt, dueAt, consecutiveCorrect }`; Leitner
  state (R8).

**TopicMastery is derived, never stored** — computed from `quizAttempts` + `reviewState` on demand.
Storing it would create a second source of truth that drifts.

---

## Relationships

```
GlossaryTerm ──taughtIn──> Lesson ──quizId──> Quiz ──contains──> QuizQuestion
     ^                        |                                       |
     └──[[term-id]] in────────┘                                 topic │
                                                                      v
ReferenceEntry ──linkedLessons──> Lesson                        TopicMastery (derived)
                                                                      ^
AssessmentQuestion ──scored by──> ScoringEngine ──> DoshaProfile      │
                                                        |             │
                                                        v        QuizAttempt + ReviewItem
                                          RecommendationRule ──> LifestylePlan (derived)
```

**LifestylePlan is derived, not stored** — recomputed from the profile plus current season on each
view, so a content update improves existing users' guidance rather than leaving it frozen. Only the
*profile* is persisted.

---

## State Transitions

**Assessment**: `not-started → in-progress → (red-flag-acknowledged) → completed`. In-progress
records persist every answer, enabling resume (FR-025). Red-flag acknowledgement is a required gate
between the last question and results whenever any flag is set (FR-023) — results cannot render
without it.

**Review item**: `unseen → box 0 → box 1..4` on correct; any incorrect answer resets to box 0.
`dueAt = lastAnsweredAt + interval[box]`.

**Storage**: `probing → available | unavailable(in-memory fallback)`. On load, each top-level record
parses independently: `valid → in use`, `invalid → quarantined in _corrupt`, offering targeted reset
(FR-045).

---

## Validation Summary

Content gates (build + CI, all blocking):

1. Every content module parses against its Zod schema.
2. Every `[[term-id]]` resolves to a `GlossaryTerm` (FR-006, SC-006).
3. Every `GlossaryTerm` has non-empty pronunciation, meaning, example (FR-005).
4. Every substantive claim block carries or inherits a `SourceAttribution` (FR-007, SC-005).
5. `claimType: 'contested'` requires an explanatory `note` (FR-008).
6. Every `QuizQuestion` has `whyCorrect`, and every incorrect option has `whyWrong` (FR-013).
7. Every cross-reference id resolves (lessons, quizzes, terms, entries).
8. Medical-safety lint passes over all content strings; herb entries admit no `allowLint` (FR-029,
   FR-036, SC-007).
9. Recommendation coverage: all five areas populated for all four canonical profile shapes (FR-031).
10. `AssessmentOption.weights` non-negative with at least one positive; `reliability` within 0.5–2.0.
