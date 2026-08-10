---

description: "Task list for Ayurveda Fundamentals, Dosha Discovery & Lifestyle Guidance"
---

# Tasks: Ayurveda Fundamentals, Dosha Discovery & Lifestyle Guidance

**Input**: Design documents from `/specs/001-ayurveda-dosha-learning/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included. Constitution Principle VII requires the scoring engine,
recommendation rules, and content-schema validation to be tested, and success criteria SC-005,
SC-006, SC-007, SC-010, and SC-016 are defined as automated gates. Presentational components are
deliberately *not* padded with markup-assertion tests.

**Organization**: Grouped by user story so each is independently implementable, testable, and
shippable. Content-authoring tasks are separated from engine and UI tasks throughout — they need a
different reviewer and a different bar (accuracy and sourcing, not correctness).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story the task belongs to (US1–US7)
- **[CONTENT]**: Content authoring — reviewed for accuracy, attribution, and novice
  comprehensibility rather than code correctness

## Path Conventions

Single project, repository root: `src/`, `tests/`, `scripts/`, `public/` per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and the lint rules that make constitutional
principles enforceable.

- [X] T001 Initialize Vite + React + TypeScript project at repo root — `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`
- [X] T002 Install runtime dependencies (react, react-dom, react-router-dom, zod) — exactly these four; record any addition in review per constitution Technical Constraints
- [X] T003 [P] Install dev dependencies (vitest, jsdom, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, axe-core, vitest-axe, vite-plugin-pwa, eslint, typescript-eslint) in `package.json`
- [X] T004 [P] Configure Vitest with jsdom environment and setup file in `vitest.config.ts` and `tests/setup.ts`
- [X] T005 [P] Configure ESLint in `eslint.config.js` including the `no-restricted-properties` rule forbidding `localStorage`/`sessionStorage` outside `src/storage/` (storage-schema.md invariant T1)
- [X] T006 [P] Create design tokens in `src/styles/tokens.css` — color, spacing, type scale, with light/dark via `prefers-color-scheme` defined once
- [X] T007 [P] Create `src/styles/global.css` — reset, visible `:focus-visible` rings, skip-link styles, mobile-first base
- [X] T008 Create directory skeleton per plan.md — `src/{domain,content,storage,components,routes,hooks,styles}`, `tests/{unit,content,component,fixtures}`, `scripts/`, `public/`
- [X] T009 [P] Add npm scripts to `package.json` — `dev`, `build`, `preview`, `test`, `test:watch`, `typecheck`, `lint`, `validate:content`
- [X] T010 [P] Create `.gitignore` including `node_modules/`, `dist/`, and `.claude/` (per Spec Kit agent-folder security notice)
- [X] T011 [P] Add static-host fallback emission to `vite.config.ts` — copy `index.html` to `dist/404.html` and create `public/_redirects` with `/* /index.html 200` (research.md R6)
- [X] T012 [P] Create CI workflow in `.github/workflows/ci.yml` running `typecheck → lint → validate:content → test → build`, all blocking

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The content schema, the content validator, the storage module, and the app shell.
Every user story depends on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Content schema (contracts/content-schema.md)

- [X] T013 [P] Define `SourceAttribution` and the `ContentBlock` discriminated union Zod schemas in `src/content/schema/blocks.ts`
- [X] T014 [P] Define `GlossaryTerm` Zod schema in `src/content/schema/glossary.ts` — `pronunciation`, `meaning`, `example` all required non-empty
- [X] T015 [P] Define `Lesson` Zod schema in `src/content/schema/lesson.ts`
- [X] T016 [P] Define `QuizQuestion` and `QuizOption` Zod schemas in `src/content/schema/quiz.ts` — `whyCorrect` required, `whyWrong` required on incorrect options
- [X] T017 [P] Define `AssessmentQuestion`, `AssessmentOption`, `DoshaVector` Zod schemas in `src/content/schema/assessment.ts` — `reliability` constrained to 0.5–2.0
- [X] T018 [P] Define `RecommendationRule` and `RuleCondition` Zod schemas in `src/content/schema/recommendation.ts` — `because` required
- [X] T019 [P] Define `ReferenceEntry` Zod schema in `src/content/schema/reference.ts` — `practitionerNotice` required when `category === 'herb'`
- [X] T020 [P] Create `src/content/config.ts` (dualDoshaMarginPoints 8, triDoshicSpreadPoints 10, elevationDeltaPoints 10, confidence bands, Leitner intervals) and `src/content/version.ts` exporting `contentVersion`
- [X] T021 Create the typed content registry in `src/content/index.ts` aggregating all content modules (depends on T013–T020)

### Content validation gates (the enforcement Principles I, II, III rest on)

- [X] T022 Implement gates C1 (schema parse), C2 (term coverage), C3 (term completeness), C7 (referential integrity), C10 (weight sanity) in `scripts/validate-content.ts`
- [X] T023 Implement the medical-safety lint (gate C8) in `src/content/lint/medicalSafety.ts` — dosage, therapeutic-claim, alter-care, and diagnostic patterns; `allowLint` annotation support; **no escape hatch permitted for `category: 'herb'`**
- [X] T024 Implement gates C4 (attribution, with `sourceNote` section inheritance and explicit `framing: true` exemption), C5 (contested requires `note`), C6 (quiz explanations) in `scripts/validate-content.ts` (depends on T022)
- [X] T025 Implement gate C9 (recommendation coverage across five areas × four canonical profile shapes) in `scripts/validate-content.ts`
- [X] T026 [P] Write gate tests in `tests/content/gates.test.ts` — for **each** of C1–C10, assert it fails on a crafted bad fixture and passes on a good one (a gate never observed failing is a gate you cannot trust; quickstart.md says so explicitly)
- [X] T027 [P] Create bad-content fixtures in `tests/fixtures/content/` — unresolvable `[[term]]`, missing pronunciation, missing attribution, contested-without-note, incorrect option missing `whyWrong`, dosage string in a recommendation, dosage string in a herb entry

### Storage (contracts/storage-schema.md)

- [X] T028 Define `StoredDocument` types and Zod schemas in `src/storage/schema.ts`
- [X] T029 Implement `src/storage/store.ts` — availability probe, in-memory fallback with identical interface, **per-record** `safeParse`, `_corrupt` quarantine, `read`/`update`/`clearAll`/`clearRecord`/`getCorruptRecords` (depends on T028)
- [X] T030 [P] Implement the ordered migration chain in `src/storage/migrations.ts` — forward-only, future-version documents preserved read-only, never discarded
- [X] T031 [P] Create storage fixture `tests/fixtures/storage/v1.json`
- [X] T032 [P] Write storage tests in `tests/unit/storage.test.ts` covering invariants T1–T7 — especially T4 (a corrupt quiz history must not cost the user their assessment results)
- [X] T033 [P] Write the network-guard test in `tests/unit/no-network.test.ts` — fails on any `fetch`/`XMLHttpRequest`/`sendBeacon` during a simulated full journey (invariant T8, SC-010)

### App shell and shared primitives

- [X] T034 [P] Build the non-dismissible `Disclaimer` component in `src/components/Disclaimer/` — cannot be collapsed into invisibility, renders in print
- [X] T035 [P] Build `LiveRegion` (polite `aria-live`) in `src/components/LiveRegion/`
- [X] T036 [P] Build `ProgressBar` (labelled `role="progressbar"`) in `src/components/ProgressBar/`
- [X] T037 Build the app shell in `src/App.tsx` and mount the router in `src/main.tsx` — skip link, nav landmarks, storage-unavailable banner (depends on T029, T034)
- [X] T038 [P] Implement `useStorageAvailability` and `useProgress` hooks in `src/hooks/`

**Checkpoint**: Schema, validator, storage, and shell ready — user stories can begin.

---

## Phase 3: User Story 1 — Discover my constitutional type (Priority: P1) 🎯 MVP

**Goal**: Onboarding → prakriti assessment → a three-dosha percentage blend with reasoned
confidence and a fully inspectable score breakdown.

**Independent Test**: Complete onboarding and the assessment end-to-end with no other feature
present; verify a three-dosha result, a confidence indicator, and an expandable breakdown that
survives reload (quickstart.md V1).

### Tests for User Story 1

> Write these first. The scoring engine is pure, so its tests are cheap and its invariants are
> where the honesty of the whole app lives.

- [X] T039 [P] [US1] Create scoring fixtures in `tests/fixtures/scoring/` — pure-vata, pure-pitta, pure-kapha, exact two-way tie, exact three-way tie, near-tie inside the dual margin, sparse (5 of 50), all-optionals-skipped, contradictory pairs triggered, sub-profiles in disagreement, single-answer minimum, unknown option id
- [X] T040 [P] [US1] Write scoring invariant tests S1–S10 in `tests/unit/scoring.test.ts` — including S4 (recomputing percentages from `breakdown` reproduces the result exactly) and S6 (exact three-way tie → `tridoshic`, `dominant.length === 3`)
- [X] T041 [P] [US1] Write the disclaimer-surface test in `tests/component/disclaimer-surfaces.test.tsx` — asserts the notice renders on every assessment screen and every result view (FR-002, SC-008)
- [X] T042 [P] [US1] Write the red-flag routing test in `tests/component/red-flag.test.tsx` — asserts results cannot render until the professional-care prompt is acknowledged, for **every** flag type (FR-023, SC-009)

### Content for User Story 1

- [X] T043 [P] [US1] [CONTENT] Author onboarding content in `src/content/onboarding.ts` — what Ayurveda is, the educational-not-medical framing, and the prakriti vs vikriti distinction, each with attribution
- [X] T044 [P] [US1] [CONTENT] Author core glossary terms in `src/content/glossary/core.ts` — dosha, vata, pitta, kapha, prakriti, vikriti, guna — each with pronunciation, plain-English meaning, and an everyday example
- [X] T045 [US1] [CONTENT] Author ~20 physical-trait prakriti questions in `src/content/assessment/prakriti-physical.ts` with per-option dosha weights and `reliability` 1.5–2.0 (stable traits read constitution most reliably — research.md R1)
- [X] T046 [US1] [CONTENT] Author ~15 physiological prakriti questions in `src/content/assessment/prakriti-physiological.ts`, `reliability` 1.0–1.5
- [X] T047 [US1] [CONTENT] Author ~15 mental-emotional prakriti questions in `src/content/assessment/prakriti-mental.ts`, `reliability` 0.5–1.0
- [X] T048 [US1] [CONTENT] Declare `contradicts` pairs across the prakriti bank (e.g. consistently-oily vs consistently-dry skin) to power the consistency signal
- [X] T049 [P] [US1] [CONTENT] Author red-flag screening questions in `src/content/assessment/red-flags.ts` — pregnancy, acute/severe symptoms, diagnosed condition, current medication — plus the professional-care message text

### Engine for User Story 1

- [X] T050 [US1] Implement accumulation, largest-remainder normalization, and `ScoreContribution` capture in `src/domain/scoring/score.ts` (depends on T039, T040)
- [X] T051 [US1] Implement shape classification (single/dual/tridoshic) and the `dominant` array in `src/domain/scoring/shape.ts` — ties reported as ties, never broken by ordering or index
- [X] T052 [US1] Implement sub-profile computation per category in `src/domain/scoring/subProfiles.ts`
- [X] T053 [US1] Implement the three confidence signals and band resolution in `src/domain/scoring/confidence.ts` — emitting user-facing `reasons` sentences whenever a signal falls below its cutoff (invariant S8)
- [X] T054 [US1] Compose the public `scoreAssessment` entry point in `src/domain/scoring/index.ts`, throwing `InsufficientResponsesError` on zero responses (invariant S2)

### UI for User Story 1

- [X] T055 [P] [US1] Build the onboarding route in `src/routes/onboarding/` — presented before any assessment question, skippable for returning users but always reachable (FR-001, FR-003)
- [X] T056 [P] [US1] Build the `DoshaBlend` component in `src/components/DoshaBlend/` — three-bar percentage display; the API accepts no "single label" mode
- [X] T057 [P] [US1] Build the `ScoreBreakdown` component in `src/components/ScoreBreakdown/` — per-question table showing answer given and points to each dosha, with skipped questions shown as skipped
- [X] T058 [US1] Build the assessment flow in `src/routes/assess/PrakritiAssessment.tsx` — `fieldset`/`legend` radio groups, labelled progress bar, focus moved to the question heading on advance, per-answer persistence for resume (FR-025)
- [X] T059 [US1] Build the red-flag screening step and acknowledgement gate in `src/routes/assess/RedFlagScreen.tsx` (depends on T049)
- [X] T060 [US1] Build the results route in `src/routes/results/PrakritiResult.tsx` — blend, confidence level with its reasons, plain-English interpretation, and the expandable breakdown (depends on T054, T056, T057)
- [X] T061 [US1] Wire assessment persistence through `src/storage/store.ts` — in-progress records, resume-or-restart, `contentVersion` stamping (FR-046)
- [X] T062 [US1] Add the "produced under an earlier content version" notice to stored results whose `contentVersion` differs from current

**Checkpoint**: US1 fully functional and independently shippable — the MVP.

---

## Phase 4: User Story 2 — Turn my profile into lifestyle changes (Priority: P2)

**Goal**: Generated guidance across five life areas, each traceable to the profile, exportable and
printable.

**Independent Test**: Given a stored profile, all five areas render with traceable reasons, and
export/print produce the complete plan (quickstart.md V2).

### Tests for User Story 2

- [X] T063 [P] [US2] Write rule-engine invariant tests P1–P6 in `tests/unit/recommendations.test.ts` — P1 (all five areas non-empty for every profile shape including tridoshic), P3 (balanced profiles never emit contradictory guidance from two competing doshas), P5 (medical-safety asserted over the **entire** rule set, not just the selected subset)
- [X] T064 [P] [US2] Write the print-content test in `tests/component/plan-print.test.tsx` — the printed document includes plan, profile, date, and disclaimer (a disclaimer that vanishes on paper fails Principle II exactly where the artifact outlives the screen)

### Content for User Story 2

- [X] T065 [P] [US2] [CONTENT] Author daily-routine and sleep-timing rules in `src/content/recommendations/routine.ts` for all four profile shapes, each with `because` and attribution
- [X] T066 [P] [US2] [CONTENT] Author meal-timing and food-quality rules in `src/content/recommendations/meals.ts` — qualities and tastes to favour or reduce, **never a prescriptive diet**
- [X] T067 [P] [US2] [CONTENT] Author movement and exercise-style rules in `src/content/recommendations/movement.ts`
- [X] T068 [P] [US2] [CONTENT] Author seasonal-adjustment rules in `src/content/recommendations/seasonal.ts`, keyed by `seasons`
- [X] T069 [P] [US2] [CONTENT] Author self-care practice rules in `src/content/recommendations/self-care.ts`
- [X] T070 [US2] [CONTENT] Author `balanced`-condition rules across all five areas so tri-doshic and evenly balanced profiles receive coherent general guidance (FR-031)
- [X] T071 [P] [US2] [CONTENT] Author the standing practitioner-consultation text accompanying every plan in `src/content/recommendations/notices.ts` (FR-030)

### Engine and UI for User Story 2

- [X] T072 [US2] Implement `selectRecommendations(profile, season, rules)` in `src/domain/recommendations/select.ts` (depends on T063)
- [X] T073 [US2] Build the plan route in `src/routes/plan/` — five sections, each recommendation showing its `because`, plus the practitioner notice and disclaimer
- [X] T074 [US2] Add the season selector wired to preferences in `src/routes/plan/SeasonSelector.tsx` — changing season changes only the seasonal section (invariant P4)
- [X] T075 [P] [US2] Create the print stylesheet `src/styles/print.css` and the print action — plan, profile, generation date, and disclaimer all included
- [X] T076 [US2] Confirm `LifestylePlan` is derived on view and never persisted (data-model.md) — only the profile is stored

**Checkpoint**: US1 + US2 both work independently. The user's stated goal — know your type, change your life — is met.

---

## Phase 5: User Story 3 — Learn the fundamentals from zero (Priority: P3)

**Goal**: A guided course where every Sanskrit term is glossed on first use and every claim is
attributed.

**Independent Test**: Open the course with no assessment data present; complete a lesson and its
knowledge check; completion persists (quickstart.md V3).

**Note**: Depends only on the content schema (Phase 2), not on US1/US2 — can be built in parallel
with the assessment path.

### Content for User Story 3

- [X] T077 [P] [US3] [CONTENT] Author the full glossary in `src/content/glossary/` — every term used anywhere in content, each with pronunciation, meaning, example, aliases, and attribution (gate C2 will fail the build otherwise)
- [X] T078 [P] [US3] [CONTENT] Author lesson: the five elements (pancha mahabhuta) in `src/content/lessons/five-elements.ts`
- [X] T079 [P] [US3] [CONTENT] Author lesson: the three doshas and their qualities in `src/content/lessons/three-doshas.ts`
- [X] T080 [P] [US3] [CONTENT] Author lesson: the twenty gunas (paired qualities) in `src/content/lessons/twenty-gunas.ts`
- [X] T081 [P] [US3] [CONTENT] Author lesson: the six tastes (shad rasa) in `src/content/lessons/six-tastes.ts`
- [X] T082 [P] [US3] [CONTENT] Author lesson: digestive fire (agni) and toxins (ama) in `src/content/lessons/agni-ama.ts`
- [X] T083 [P] [US3] [CONTENT] Author lesson: the seven tissues (dhatus) in `src/content/lessons/seven-dhatus.ts`
- [X] T084 [P] [US3] [CONTENT] Author lesson: the channels (srotas) in `src/content/lessons/srotas.ts`
- [X] T085 [P] [US3] [CONTENT] Author lesson: daily routine (dinacharya) in `src/content/lessons/dinacharya.ts`
- [X] T086 [P] [US3] [CONTENT] Author lesson: seasonal routine (ritucharya) in `src/content/lessons/ritucharya.ts`
- [X] T087 [P] [US3] [CONTENT] Author lesson: prakriti and vikriti in depth in `src/content/lessons/prakriti-vikriti.ts`
- [X] T088 [P] [US3] [CONTENT] Author lesson: what Ayurveda is and is not — history, scope, and the limits of self-assessment — in `src/content/lessons/what-ayurveda-is.ts`, using `callout: misconception` blocks to correct common wellness-industry errors
- [X] T089 [US3] [CONTENT] Set `prerequisiteConcepts` and `order` across all lessons so direct access names prerequisites without blocking (FR-010)

### UI for User Story 3

- [X] T090 [P] [US3] Build the `ContentBlock` renderer in `src/components/BlockRenderer/` — one renderer per block kind, including `termIntro` rendering meaning + pronunciation + example inline
- [X] T091 [P] [US3] Build `TermLink` in `src/components/TermLink/` — parses `[[term-id|display]]` markup and opens a glossary popover without losing place in the lesson (US3 AS3)
- [X] T092 [P] [US3] Build the `SourceCitation` component in `src/components/SourceCitation/` — displays authority, reference, and `claimType`, making `modern-interpretation` and `contested` visible to the reader rather than hidden
- [X] T093 [US3] Build the course index route in `src/routes/learn/CourseIndex.tsx` — recommended order, completion state, estimated reading time
- [X] T094 [US3] Build the lesson reader route in `src/routes/learn/LessonReader.tsx` (depends on T090, T091, T092)
- [X] T095 [US3] Wire lesson progress persistence and next-lesson flow in `src/routes/learn/` (depends on T029)

**Checkpoint**: The course stands alone as an educational product.

---

## Phase 6: User Story 4 — Cement knowledge with quizzes and review (Priority: P4)

**Goal**: Three question types, why-feedback on every answer, Leitner-scheduled review of missed
items, per-topic mastery.

**Independent Test**: Take a quiz with all three question types, answer some wrong, verify
explanations, confirm missed items reappear in review and mastery reflects performance
(quickstart.md V4).

### Tests for User Story 4

- [X] T096 [P] [US4] Write Leitner scheduling tests in `tests/unit/review.test.ts` — promotion on correct, reset to box 0 on incorrect, due-ordering (overdue-and-missed → overdue → due → unseen), and that missed items are measurably prioritized over mastered ones (SC-014)
- [X] T097 [P] [US4] Write mastery-derivation tests in `tests/unit/mastery.test.ts` — including that mastery is computed from attempts and never stored (data-model.md)

### Content for User Story 4

- [X] T098 [P] [US4] [CONTENT] Author multiple-choice quiz items for each lesson in `src/content/quiz/` — every incorrect option carries a `whyWrong` that teaches, not merely negates
- [X] T099 [P] [US4] [CONTENT] Author matching quiz items (element↔dosha, guna pairs, taste↔effect) in `src/content/quiz/matching.ts`
- [X] T100 [P] [US4] [CONTENT] Author applied-scenario quiz items in `src/content/quiz/scenarios.ts` — "a friend describes X; which quality is dominant?"
- [X] T101 [US4] [CONTENT] Assign `topic` and `difficulty` across the full quiz bank so mastery aggregates correctly

### Engine and UI for User Story 4

- [X] T102 [US4] Implement Leitner scheduling in `src/domain/review/schedule.ts` using intervals from `src/content/config.ts` (depends on T096)
- [X] T103 [US4] Implement review-session ordering in `src/domain/review/session.ts`
- [X] T104 [US4] Implement per-topic mastery derivation in `src/domain/review/mastery.ts` (depends on T097)
- [X] T105 [P] [US4] Build the `MultipleChoiceQuestion` component in `src/routes/quiz/MultipleChoice.tsx`
- [X] T106 [P] [US4] Build the `MatchingQuestion` component in `src/routes/quiz/Matching.tsx` — keyboard-operable pairing, no drag-only interaction
- [X] T107 [P] [US4] Build the `ScenarioQuestion` component in `src/routes/quiz/Scenario.tsx`
- [X] T108 [US4] Build the `AnswerFeedback` component in `src/routes/quiz/AnswerFeedback.tsx` — announces via `LiveRegion`, conveys correctness by icon **and** text never colour alone, shows `whyCorrect` and the chosen option's `whyWrong` (FR-013, FR-049)
- [X] T109 [US4] Build the lesson-quiz route in `src/routes/quiz/LessonQuiz.tsx` with resume-or-restart on interruption (FR-016)
- [X] T110 [US4] Build the cumulative review route in `src/routes/quiz/ReviewSession.tsx` drawing across completed lessons
- [X] T111 [US4] Build the progress and mastery view in `src/routes/quiz/Progress.tsx` — four-step indicator per topic plus items due
- [X] T112 [US4] Persist `QuizAttempt` (append-only) and `ReviewItem` state through `src/storage/store.ts`

**Checkpoint**: The learning loop is closed — read, test, review, master.

---

## Phase 7: User Story 5 — Look things up (Priority: P5)

**Goal**: Searchable, browsable reference tolerant of transliteration variants, cross-linked to
lessons.

**Independent Test**: Find an entry by Sanskrit name, English meaning, and alternate spelling;
follow its cross-links (quickstart.md V5).

**Note**: Depends only on the content schema — parallelizable with US3/US4.

### Tests for User Story 5

- [X] T113 [P] [US5] Write search tests in `tests/unit/search.test.ts` — `dosa`/`doṣa`/`dosha` all match the same entry, English-meaning search finds `Agni`, ranking order holds, and zero-match input yields did-you-mean suggestions rather than an empty result

### Content for User Story 5

- [X] T114 [P] [US5] [CONTENT] Author dosha reference entries in `src/content/reference/doshas.ts`
- [X] T115 [P] [US5] [CONTENT] Author the twenty guna entries in `src/content/reference/gunas.ts`
- [X] T116 [P] [US5] [CONTENT] Author the six taste entries in `src/content/reference/tastes.ts`
- [X] T117 [P] [US5] [CONTENT] Author dhatu and srota entries in `src/content/reference/dhatus.ts` and `src/content/reference/srotas.ts`
- [X] T118 [P] [US5] [CONTENT] Author seasonal guide entries in `src/content/reference/seasons.ts`
- [X] T119 [US5] [CONTENT] Author herb entries in `src/content/reference/herbs.ts` — educational description and traditional context **only**, `practitionerNotice: true`, no dosing and no preparation-for-treatment; gate C8 admits no `allowLint` here (FR-036)
- [X] T120 [US5] [CONTENT] Populate `aliases` across all entries with common alternate transliterations — this, not fuzzy matching, is what makes search work (research.md R7)

### Engine and UI for User Story 5

- [X] T121 [US5] Implement normalization (lowercase → NFD → strip combining marks → collapse punctuation) and index construction in `src/domain/search/index.ts` (depends on T113)
- [X] T122 [US5] Implement ranked matching and Levenshtein-based did-you-mean in `src/domain/search/rank.ts`
- [X] T123 [P] [US5] Build the `SearchBox` component in `src/components/SearchBox/` with accessible results announcement
- [X] T124 [US5] Build the reference browse route in `src/routes/reference/ReferenceIndex.tsx` — category browsing as the zero-match fallback (FR-038)
- [X] T125 [US5] Build the reference detail route in `src/routes/reference/EntryDetail.tsx` with lesson cross-links and the practitioner notice on herb entries

**Checkpoint**: Reference stands alone and raises the value of every other surface.

---

## Phase 8: User Story 6 — Current state versus baseline (Priority: P6)

**Goal**: Optional vikriti assessment compared against the stored prakriti, with honest reporting
when nothing notable has changed.

**Independent Test**: With a stored prakriti, complete the vikriti assessment and verify the
comparison identifies elevation and shifts guidance (quickstart.md V6).

### Tests for User Story 6

- [X] T126 [P] [US6] Write comparison tests in `tests/unit/comparison.test.ts` — delta computation, elevation/diminished/stable classification at the threshold boundary, and that `hasNotableChange` is `false` when nothing crosses it (the engine must not manufacture an imbalance to justify a recommendation — research.md R2)

### Content for User Story 6

- [X] T127 [US6] [CONTENT] Author ~20 vikriti questions in `src/content/assessment/vikriti.ts` — recent sleep, digestion, energy, mood, skin, appetite, phrased about the recent past rather than lifelong tendency
- [X] T128 [P] [US6] [CONTENT] Author elevation-explanation text per dosha in `src/content/assessment/vikriti-explanations.ts`, framing elevation as temporary and changeable
- [X] T129 [P] [US6] [CONTENT] Author severity red-flag text for vikriti responses reporting severe or persistent symptoms (US6 AS5)

### Engine and UI for User Story 6

- [X] T130 [US6] Implement `compareProfiles(prakriti, vikriti, config)` in `src/domain/comparison/compare.ts` (depends on T126)
- [X] T131 [US6] Build the vikriti assessment route in `src/routes/assess/VikritiAssessment.tsx`, gated on a stored prakriti with an offer to take it first (US6 AS3)
- [X] T132 [US6] Build the comparison view in `src/routes/results/Comparison.tsx` — both profiles side by side with the difference explicit
- [X] T133 [US6] Extend `selectRecommendations` to prefer `mode: 'elevated'` rules when a vikriti elevation exists in `src/domain/recommendations/select.ts`
- [X] T134 [US6] Build the dated assessment history view in `src/routes/results/History.tsx` (FR-026)

**Checkpoint**: Ayurveda becomes actionable over time rather than a one-off label.

---

## Phase 9: User Story 7 — Control my own data (Priority: P7)

**Goal**: See what is stored, export all of it, delete all of it.

**Independent Test**: Generate data, export it, verify completeness, delete, verify first-run state
(quickstart.md V7).

### Tests for User Story 7

- [X] T135 [P] [US7] Write export/delete tests in `tests/unit/portability.test.ts` — export contains every stored record including quarantined ones, and `clearAll()` leaves zero keys under the namespace (SC-016, invariants T2, T3)

### Implementation for User Story 7

- [X] T136 [US7] Implement `src/storage/portability.ts` — export bundle per contracts/export-format.md, with question prompts and answer texts embedded so the file is meaningful without the app, plus the honest `notice` field
- [X] T137 [US7] Implement client-side file download via `Blob` + object URL in `src/storage/portability.ts` — no network request
- [X] T138 [US7] Build the data settings route in `src/routes/data/` — what categories are stored, the statement that nothing leaves the device, export action, delete-all with a confirmation step (FR-042, FR-043)
- [X] T139 [US7] Add the targeted-reset UI for quarantined corrupt records in `src/routes/data/CorruptRecords.tsx` (FR-045)

**Checkpoint**: All seven stories independently functional.

---

## Phase 10: Polish & Cross-Cutting Concerns

- [X] T140 Configure `vite-plugin-pwa` in `vite.config.ts` — `generateSW`, `registerType: 'autoUpdate'`, precache the whole build, zero runtime-caching rules
- [X] T141 Build the offline-first-visit explanatory page in `src/routes/Offline.tsx` — a clear message, never a blank page
- [X] T142 [P] Run the full accessibility pass — axe assertions across all routes in `tests/component/a11y.test.tsx`, plus a manual keyboard-only and screen-reader pass per user story (SC-011)
- [X] T143 [P] Verify the 375px mobile pass — assessment completable with no horizontal scroll and no obscured controls (SC-017)
- [X] T144 [P] Verify the bundle budget — JS ≤ 250KB gzipped excluding content data; add a build-time size check
- [X] T145 [P] Write `README.md` — what the app is, the educational-not-medical framing, the privacy stance, setup and deploy instructions
- [X] T146 [P] Add the standing notice that content is educational and has not been reviewed by a credentialed practitioner (research.md R11), rendered in onboarding and the about surface
- [X] T147 Verify gate enforcement end-to-end by deliberately breaking content — add a `[[nonsense]]` reference (C2 must fail) and `take 500mg twice daily` to a recommendation (C8 must fail), then revert
- [X] T148 Execute the full quickstart.md validation — all seven scenarios plus every cross-cutting check
- [X] T149 Verify zero network requests carrying user data across the complete journey with DevTools open (SC-010)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks all user stories**
- **User Stories (Phases 3–9)**: all depend on Foundational
- **Polish (Phase 10)**: depends on the desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: after Foundational. No dependencies on other stories. **This is the MVP.**
- **US2 (P2)**: needs a `DoshaProfile` from US1's scoring engine (T054)
- **US3 (P3)**: after Foundational only — **parallel with US1/US2**
- **US4 (P4)**: needs lesson content and topics from US3
- **US5 (P5)**: after Foundational only — **parallel with US1–US4**
- **US6 (P6)**: needs a stored prakriti baseline (US1) and the rule engine (US2 T072)
- **US7 (P7)**: after Foundational only — **parallel with everything**

### Within Each User Story

Tests → content authoring → engine → UI → persistence wiring. Content authoring is deliberately
independent of engine work in every phase: the schema is the contract between them, so both can
proceed once Phase 2 lands.

### Parallel Opportunities

- Phase 1: T003–T012 all parallel after T001/T002
- Phase 2: all schema tasks T013–T020 parallel; storage tasks T030–T033 parallel with shell tasks T034–T036
- Phase 3: T039–T042 (tests) parallel; T043, T044, T049 parallel; T045–T047 sequential only because they share reviewer attention
- Phase 5: T078–T088 — **all eleven lessons parallel**, the largest parallel block in the project
- Phase 7: T114–T118 all parallel
- Across phases: US1, US3, US5, and US7 can run concurrently with enough people

---

## Parallel Example: User Story 3 content authoring

```bash
# All eleven lessons are independent files against a fixed schema:
Task: "Author lesson: the five elements in src/content/lessons/five-elements.ts"
Task: "Author lesson: the three doshas in src/content/lessons/three-doshas.ts"
Task: "Author lesson: the twenty gunas in src/content/lessons/twenty-gunas.ts"
Task: "Author lesson: the six tastes in src/content/lessons/six-tastes.ts"
Task: "Author lesson: agni and ama in src/content/lessons/agni-ama.ts"
Task: "Author lesson: the seven dhatus in src/content/lessons/seven-dhatus.ts"
Task: "Author lesson: srotas in src/content/lessons/srotas.ts"
Task: "Author lesson: dinacharya in src/content/lessons/dinacharya.ts"
Task: "Author lesson: ritucharya in src/content/lessons/ritucharya.ts"
Task: "Author lesson: prakriti and vikriti in src/content/lessons/prakriti-vikriti.ts"
Task: "Author lesson: what Ayurveda is and is not in src/content/lessons/what-ayurveda-is.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup
2. Phase 2: Foundational — **critical, blocks everything**
3. Phase 3: User Story 1
4. **STOP and VALIDATE** against quickstart.md V1, including the red-flag, ambiguity, and sparse paths
5. Deploy — a working, honest dosha assessment is a complete product on its own

### Incremental Delivery

Setup + Foundational → US1 (MVP, deploy) → US2 (the user's full stated goal, deploy) → US3 → US4 →
US5 → US6 → US7 → Polish. Each story adds value without breaking earlier ones.

### Parallel Team Strategy

After Foundational: one track on US1 → US2 → US6 (the assessment spine), one on US3 → US4 (the
learning spine), one on US5 + US7 (reference and data). Content authoring can run as its own track
throughout, since the schema is fixed at Phase 2 and gates catch drift.

---

## Notes

- `[P]` = different files, no dependencies on incomplete tasks
- `[CONTENT]` tasks need accuracy and sourcing review, not code review — per the constitution's
  Development Workflow section they are held to a different bar
- Content authoring is the critical path in practice: 41 of the 149 tasks are authoring, and gates
  C1–C10 will block the build until they are right
- Any change touching the assessment flow, results presentation, or recommendation output requires
  explicit review against Principles II and IV before merge
- Commit after each task or logical group; stop at any checkpoint to validate independently
