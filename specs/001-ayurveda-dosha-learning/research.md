# Phase 0 Research: Ayurveda Fundamentals, Dosha Discovery & Lifestyle Guidance

**Feature**: `001-ayurveda-dosha-learning` | **Date**: 2026-08-08

The stack was fixed by the constitution's Technical Constraints and confirmed in planning input, so
no `NEEDS CLARIFICATION` markers survived into Technical Context. This document resolves the design
questions that the stack choice leaves open — the ones where a wrong call would be expensive to
reverse after content authoring begins.

---

## R1. Dosha scoring model

**Decision**: Weighted per-option scoring with normalization to percentages, plus a three-signal
confidence model.

Each assessment question offers options, each option carrying a weight vector over
`{vata, pitta, kapha}` (usually a single dosha at weight 1.0, occasionally split). Each *question*
carries a `reliability` multiplier: stable physical traits (frame, bone structure, hair, skin)
weigh more for prakriti than mood or preference items, which fluctuate. Score per dosha is the sum
of `optionWeight × questionReliability` over answered questions; percentages are that sum divided
by the total awarded, rounded with largest-remainder so the three always sum to exactly 100.

Confidence is derived from three independent signals rather than a single number:

| Signal | What it measures | Lowers confidence when |
|---|---|---|
| Completeness | answered ÷ total, reliability-weighted | user skipped many or high-reliability items |
| Separation | margin between top and second dosha | doshas are within a few points |
| Consistency | divergence between the physical, physiological, and mental sub-profiles, plus explicit contradicting-answer pairs declared in content | sub-profiles disagree, or the user reports mutually exclusive traits |

Confidence resolves to `high | moderate | low` **with the specific reasons listed**, not a bare
label — the reasons are what make FR-020 and the "answers were inconsistent" edge case honest.

Ambiguity classification runs off the percentages: top two within 8 points → dual-dosha; max−min
within 10 points → tri-doshic. These thresholds live in content config, not code.

**Rationale**: Principle IV demands the arithmetic be inspectable. A linear weighted sum is the
only model a novice can actually follow when we show them the breakdown; anything latent-variable
or ML-based would satisfy the letter of "show the scoring" while defeating its purpose. Splitting
confidence into named signals also gives the UI something truthful to say beyond "low confidence".

**Alternatives considered**:
- *Simple tally (one point per pick)* — rejected: treats "my bone structure" and "my mood today" as
  equally diagnostic of a lifelong constitution, which is the classic flaw of web dosha quizzes.
- *Likert 1–5 per dosha statement* — rejected: triples question count for marginal precision and
  makes the score breakdown much harder for a novice to read.
- *Normalizing by z-score against a population baseline* — rejected: we have no population data,
  and inventing one would be fabrication.

---

## R2. Prakriti vs vikriti comparison

**Decision**: Run both assessments through the same scoring engine, then compare percentage
deltas per dosha. A dosha is reported "elevated" when `vikriti% − prakriti% ≥ 10` points (config,
not code), "diminished" at `≤ −10`. Guidance shifts to pacifying the elevated dosha; if no delta
crosses the threshold, the app says so plainly rather than manufacturing an imbalance.

**Rationale**: Reusing one engine means one set of tests and one breakdown UI. Reporting "nothing
notable changed" is a real and common outcome — a system that always finds an imbalance is a system
that always finds an excuse to recommend something.

**Alternatives considered**: a separate symptom-severity model — rejected as it drifts toward
diagnosis, which Principle II forbids.

---

## R3. Content authoring format and validation

**Decision**: Content is TypeScript data modules typed by Zod schemas, under `src/content/`, split
by kind (`lessons/`, `glossary/`, `quiz/`, `assessment/`, `recommendations/`, `reference/`).
Lesson bodies are **structured block arrays**, not raw markdown strings:

```
{ kind: 'paragraph' | 'list' | 'callout' | 'example' | 'termIntro' | 'sourceNote', ... }
```

Inline term references use `[[term-id|display text]]` markup inside block text. A renderer resolves
them to glossary links; a validator resolves them to assert coverage.

Validation runs as a script (`npm run validate:content`) wired into CI and the test suite, checking:
1. every content file parses against its Zod schema;
2. every `[[term-id]]` resolves to a glossary entry (FR-006, SC-006);
3. every glossary entry has meaning + pronunciation + example (FR-005);
4. every substantive claim block carries a source attribution (FR-007, SC-005);
5. every referenced lesson id, quiz id, and cross-link target exists;
6. the medical-safety lint passes (R4).

**Rationale**: Principle III requires a domain expert to review content without touching React.
Structured blocks make claims and their attributions machine-checkable — a markdown blob would make
"every substantive claim carries a citation" unenforceable, which is exactly the requirement most
likely to rot. Zod gives one schema definition serving both compile-time types and runtime checks.

**Alternatives considered**:
- *Markdown + frontmatter* — friendlier to write, but claim-level attribution and term coverage
  degrade to fragile regex. Rejected.
- *Plain JSON* — loses type inference and inline comments explaining sourcing decisions. Rejected.
- *A headless CMS* — violates the no-backend constraint outright.

---

## R4. Enforcing "educational, never medical" automatically

**Decision**: Two automated gates, both run in CI.

1. **Content lint** over all content strings — particularly the recommendation rule set and herb
   entries — flagging: dosage patterns (`\d+\s?(mg|g|ml|tsp|tbsp|capsules?|drops?)`), therapeutic
   claim verbs (`cures?`, `treats?`, `heals?`, `prevents?` + condition), and instructions to alter
   care (`stop taking`, `instead of (your )?medication`, `replace .* prescription`). A match fails
   the build. Content that legitimately needs a flagged word carries an explicit reviewed
   `allowLint` annotation with a justification string — visible, auditable, never silent.
2. **Surface test** asserting the disclaimer component renders on every assessment screen, every
   result view, and every generated plan (FR-002, SC-008), and that red-flag inputs produce the
   professional-care prompt before results (FR-023, SC-009).

**Rationale**: Principle II is NON-NEGOTIABLE, and prose-based rules erode as content grows. A
regex gate is crude but catches the realistic failure — an author writing "take 500mg twice daily"
because it felt helpful. The `allowLint` escape hatch keeps the gate from being disabled wholesale
the first time it produces a false positive.

**Alternatives considered**: review-by-convention only — rejected; the constitution requires the
gate to block, not to advise.

---

## R5. Offline capability

**Decision**: `vite-plugin-pwa` (dev dependency) in `generateSW` mode with `registerType:
'autoUpdate'`, precaching the entire build output. Zero runtime-caching rules, because there are no
external requests to cache. A first-visit-offline state shows an explanatory page rather than a
blank screen.

**Rationale**: The whole app is static assets with no network dependency, so precache-everything is
both simplest and complete. Workbox's generated service worker handles cache versioning and cleanup
— the part a hand-rolled worker reliably gets wrong, producing users stuck on stale builds.

**Alternatives considered**: hand-written service worker — fewer dependencies but a known source of
stale-cache bugs; the dependency is build-time only and ships no runtime code we didn't ask for.

---

## R6. Routing and static hosting

**Decision**: React Router in `BrowserRouter` mode. The build emits a `404.html` copy of
`index.html` (GitHub Pages SPA fallback) and a `_redirects` file (`/* /index.html 200`, for
Netlify), so the same artifact deploys to either host with no server configuration.

**Rationale**: Clean shareable URLs (`/learn/doshas`, `/reference/agni`) matter for a reference-heavy
app. Emitting both fallback files is a few lines in the build and removes the usual reason people
retreat to hash routing.

**Alternatives considered**:
- *HashRouter* — zero host configuration, but `/#/reference/agni` URLs undercut a reference tool.
- *Hand-rolled router* — saves one dependency; nested lesson/reference routes with deep linking
  make it a false economy.

---

## R7. Client-side search

**Decision**: Purpose-built in-memory index, no search dependency. At module load, build entries of
`{id, category, normalizedName, normalizedAliases[], normalizedMeaning, tokens[]}` where normalize =
lowercase → NFD → strip combining marks → collapse punctuation. This makes `dosa`, `doṣa`, and
`dosha` all match. Ranking: exact name > alias/alternate spelling > name prefix > token prefix in
meaning > substring in body. On zero matches, Levenshtein distance ≤ 2 against entry names produces
"did you mean" suggestions, with browsable categories as the fallback (FR-038).

**Rationale**: The corpus is a few hundred entries — small enough that a hand-rolled index is
instant and fully controllable. The hard part here is transliteration tolerance, which is a
normalization problem rather than a fuzzy-matching problem, and generic libraries do not handle
Sanskrit diacritics better than an explicit alias list.

**Alternatives considered**: Fuse.js / MiniSearch — capable, but adds a runtime dependency for a
problem that is mostly solved by normalization plus curated aliases.

---

## R8. Spaced review

**Decision**: Leitner box scheme, 5 boxes, intervals `[same session, 1d, 3d, 7d, 21d]`. Correct
answer promotes one box; incorrect resets to box 0. A review session orders items: overdue-and-
previously-missed → overdue → due today → never seen. Per-topic mastery = the reliability-weighted
mean box level of that topic's attempted items, surfaced as a four-step indicator with the count of
items still due.

**Rationale**: Leitner is the simplest scheme that measurably prioritizes missed items (SC-014),
takes a handful of lines, and is explainable to the user — which matters in an app whose whole
posture is "we show you how it works". SM-2 and friends tune retention curves we have no data to
tune against.

**Alternatives considered**: SM-2/FSRS — over-engineered for a ~150-item corpus with no
longitudinal data; a plain "retry wrong answers" queue — fails the "spaced" part of the requirement.

---

## R9. Local persistence, versioning, and failure

**Decision**: One storage module (`src/storage/`) is the sole `localStorage` caller in the codebase
— enforced by an ESLint restriction on `window.localStorage` outside that directory, so Principle V
is auditable in one file. State lives under a single namespaced key holding a versioned document
with a `schemaVersion` and an ordered migration chain.

Failure handling:
- **Unavailable storage** (private mode, quota, blocked): detected by a probe write at startup;
  the app falls back to an in-memory store with identical interface and shows a persistent
  "progress won't be saved" banner (FR-044).
- **Corrupt or unknown-version records**: `safeParse` per top-level record, not per document — a
  bad quiz history does not destroy assessment results. Damaged records are quarantined under a
  `_corrupt` key and the user is offered a targeted reset (FR-045).
- **Content drift**: every stored result records the `contentVersion` it was produced under; when
  that differs from current, the result still renders with a note (FR-046). Score breakdowns
  degrade gracefully when a question id no longer exists.

**Rationale**: Health-adjacent self-reports deserve a storage layer that never throws away more
than it must. Concentrating access in one module turns "no user data leaves the device" from a
promise into a reviewable property.

**Alternatives considered**: IndexedDB — unnecessary for kilobytes of data; a state library with a
persistence plugin — adds a dependency and scatters the privacy-critical surface.

---

## R10. Styling, accessibility, and print

**Decision**: CSS Modules with a design-token stylesheet (custom properties for color, spacing,
type scale) — no UI framework, no CSS-in-JS. Light/dark via `prefers-color-scheme` with tokens
defined once. A dedicated print stylesheet renders the lifestyle plan as a clean document
(`window.print()`), which satisfies "printable" with no PDF dependency.

Accessibility patterns settled up front, since retrofitting them is what usually fails WCAG:
- Quiz correctness feedback announced through a polite `aria-live` region; correctness conveyed by
  icon + text, never color alone (FR-049).
- Assessment progress as a labelled `progressbar`; each question a `fieldset`/`legend` with a radio
  group.
- Focus moves to the question heading on advance; visible focus rings never suppressed.
- `axe-core` assertions in component tests, plus a manual keyboard pass per user story.

**Rationale**: CSS Modules ship zero runtime and are native to Vite, honoring the low-dependency
constraint. Print-to-PDF via the browser is universally available and adds nothing to the bundle.

**Alternatives considered**: Tailwind (build dependency plus config for a small surface — rejected
on the dependency-count constraint); a component library such as MUI (large runtime, and its
theming would fight the print stylesheet); `react-to-pdf`/jsPDF (bundle cost for what the browser
already does well).

---

## R11. Content sourcing and the accuracy boundary

**Decision**: Every substantive claim carries a `SourceAttribution` with `{ authority, reference,
claimType }` where `claimType ∈ {classical, contested, modern-interpretation}`. Where a commonly
repeated wellness claim cannot be traced to a classical text, it is marked `modern-interpretation`
rather than dressed up as ancient. Where Charaka and Sushruta differ, the entry says so and is
marked `contested`. The app carries a standing notice that content is educational and has not been
certified by a credentialed practitioner; practitioner review is a pre-launch gate tracked outside
this feature.

**Rationale**: Traditional-knowledge content invites confident invention, and a citation field that
is merely *present* invites fabricated citations. Forcing an explicit `claimType` makes the honest
answer ("this is a modern popularization") available as a first-class option instead of a
confession, which is what keeps authors from reaching for a false classical citation.

**Alternatives considered**: citing only classical texts — would push genuinely modern lifestyle
guidance into false attribution; omitting attribution for "common knowledge" — the ambiguity this
creates is precisely what Principle III exists to prevent.

---

## Resolved Technical Context

| Field | Value |
|---|---|
| Language/Version | TypeScript 5.x, ES2022 target |
| Primary Dependencies | React 19, React Router 7, Zod 4 (runtime, ~3 packages); Vite 7, Vitest 3, Testing Library, axe-core, vite-plugin-pwa, ESLint (build/dev only) |
| Storage | Browser `localStorage`, single namespaced versioned document, accessed only through `src/storage/` |
| Testing | Vitest + jsdom + Testing Library; content validation and medical-safety lint as test-suite gates |
| Target Platform | Modern evergreen browsers, desktop and mobile; static hosting; offline after first load |
| Project Type | Single-project client-only SPA |
| Performance Goals | Interaction response under 100ms; initial load under 3s on a mid-tier phone over 3G; bundle budget 250KB gzipped excluding content |
| Constraints | Zero network requests carrying user data; zero analytics; WCAG 2.1 AA; offline-capable; no backend |
| Scale/Scope | ~10–14 lessons, ~150 quiz items, ~50 prakriti + ~20 vikriti assessment questions, ~200 reference/glossary entries, ~20 screens, single local user |
