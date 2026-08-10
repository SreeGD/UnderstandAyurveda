<!--
SYNC IMPACT REPORT
==================
Version change: TEMPLATE (unversioned) → 1.0.0
Bump rationale: Initial ratification. Template placeholders replaced with concrete,
project-specific governance. MAJOR baseline established at 1.0.0.

Modified principles: N/A (initial adoption)
Added principles:
  - I. Novice-First Clarity
  - II. Educational, Never Medical (NON-NEGOTIABLE)
  - III. Traceable, Data-Separated Content
  - IV. Transparent Assessment
  - V. Privacy by Default (NON-NEGOTIABLE)
  - VI. Accessible and Offline-Capable
  - VII. Test the Logic That Matters
Added sections:
  - Technical Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate is generic
     ("based on constitution file"); no hardcoded principle names to correct.
  ✅ .specify/templates/spec-template.md — generic scope/requirements structure;
     compatible with Principles I–VII. No mandatory-section conflicts.
  ✅ .specify/templates/tasks-template.md — task categories are generic
     (setup/tests/core/integration/polish); principle-driven task types
     (content-schema validation, a11y, disclaimer surfaces) fit existing buckets.
  ✅ .specify/templates/commands/*.md — no agent-specific hardcoding requiring change.
  ⚠ README.md — does not yet exist; create during implementation and reference
     Principles II and V in the project description.

Deferred TODOs: none
-->

# UnderstandAyurveda Constitution

UnderstandAyurveda is a static, client-only web application that teaches the fundamentals of
Ayurveda to complete novices through structured lessons, knowledge quizzes, a prakriti
(constitutional type) self-assessment, a searchable reference, and personalized lifestyle
guidance. It stores everything locally in the user's browser and has no accounts, no backend,
and no server-side data collection.

## Core Principles

### I. Novice-First Clarity

The target reader knows nothing about Ayurveda and may never have seen a Sanskrit word.

- Every Sanskrit or technical term MUST be introduced, on first use in any given lesson or
  reference entry, with three things together: a plain-English meaning, a pronunciation hint,
  and one concrete everyday example.
- Terms MUST resolve to a glossary entry. Any term used in content but absent from the
  glossary is a build failure, not a style nit.
- Prose MUST avoid unexplained jargon, untranslated quotations, and appeals to authority that
  the reader cannot evaluate ("the ancients knew" is not an explanation).
- Lessons MUST be self-contained enough that a reader arriving mid-course is told what prior
  concept they need and where to find it.

**Rationale**: A novice who hits three untranslated words in a paragraph stops reading. Every
term that is introduced properly is a term the reader can then reason with; every term dropped
raw is a reader lost.

### II. Educational, Never Medical (NON-NEGOTIABLE)

This application is wellness education. It does not diagnose, treat, or prescribe.

- A disclaimer stating that the content is educational and not medical advice MUST be present
  and non-dismissible on the assessment flow, on every results view, and on every generated
  lifestyle plan. It MUST NOT be collapsible into invisibility or hidden behind a scroll.
- The application MUST NOT provide dosing instructions for herbs, supplements, or medicines,
  MUST NOT recommend discontinuing or altering prescribed treatment, and MUST NOT claim to
  treat or cure any named disease.
- Guidance to consult a qualified Ayurvedic practitioner and, where relevant, a licensed
  physician MUST accompany every personalized recommendation set.
- The assessment MUST screen for red-flag inputs (for example: pregnancy, acute or severe
  symptoms, existing diagnosed conditions, current medication) and, when present, surface a
  prominent prompt to seek professional care instead of, not merely alongside, self-directed
  action.
- Recommendations MUST be limited to low-risk lifestyle domains: daily routine, sleep timing,
  movement, meal timing, food qualities, and self-care practices.

**Rationale**: Health-adjacent software carries real risk of harm when a user substitutes it
for care. The cost of an over-cautious disclaimer is a mild annoyance; the cost of an omitted
one can be a delayed diagnosis.

### III. Traceable, Data-Separated Content

Content is reviewable data, not text embedded in components.

- All lesson text, reference entries, quiz items, and recommendation rules MUST live in
  structured content files (JSON/TS data modules) under a dedicated content directory,
  separate from React components. A domain expert MUST be able to review and correct content
  without reading or editing UI code.
- Every substantive claim in lessons and reference entries MUST carry a source attribution: a
  classical text with locatable citation (Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam)
  or a named modern authority. Attribution is a required field in the content schema.
- Where classical sources disagree, or where a claim is a modern popularization rather than a
  classical teaching, the content MUST say so rather than flattening it into false consensus.
- All content files MUST validate against a published schema. Schema validation MUST run in CI
  and MUST fail the build on violation.

**Rationale**: Traditional-knowledge content invites drift into invention. Requiring a citation
field on every claim makes fabrication visible at review time, and keeping content out of JSX
makes expert review possible at all.

### IV. Transparent Assessment

The user MUST be able to understand and audit how they were assessed.

- Results MUST be presented as a percentage blend across all three doshas. Assigning a single
  rigid label ("You are Pitta") as the primary result is prohibited; a dominant dosha may be
  named only alongside the full distribution.
- The scoring logic MUST be inspectable from the results view: which questions contributed,
  what each answer scored, and how the totals were derived.
- Results MUST carry a confidence indicator, and MUST state plainly when responses were
  inconsistent, sparse, or too close to differentiate.
- The distinction between prakriti (constitution at birth, stable) and vikriti (current state
  of imbalance, changeable) MUST be explained before the user sees a result, and the
  application MUST state clearly which of the two the assessment estimates.
- Self-assessment limitations MUST be stated: a questionnaire is a starting point, not a
  substitute for evaluation by a trained practitioner.

**Rationale**: An opaque quiz that hands down an identity produces false certainty. Showing the
arithmetic converts a verdict into a learning object the user can question.

### V. Privacy by Default (NON-NEGOTIABLE)

The user's answers never leave their device.

- All user responses, results, and progress MUST be stored client-side only (localStorage or
  equivalent). No user data may be transmitted to any server, ever.
- The application MUST NOT include analytics, telemetry, advertising, session recording, or
  any third-party tracking script.
- No runtime network requests carrying user-derived data are permitted. Any network request at
  all MUST be justified in review; the steady state is zero.
- Users MUST be able to export their complete stored data in a portable format and delete all
  of it from within the application, in one clearly labeled action each.

**Rationale**: Health-adjacent self-reports are sensitive. The only architecture that cannot
leak them is one that never collects them; keeping this absolute removes an entire category of
future compromise.

### VI. Accessible and Offline-Capable

- The application MUST meet WCAG 2.1 Level AA: contrast ratios, focus indicators, semantic
  landmarks, form labels, and error identification.
- Every interactive flow — lessons, quizzes, assessment, reference search — MUST be completable
  by keyboard alone and MUST be usable with a screen reader.
- Quiz and assessment state changes MUST be announced to assistive technology, not conveyed by
  color or position alone.
- The application MUST function without a network connection after first load.
- Layout MUST be mobile-first and responsive; the assessment MUST be comfortably completable on
  a phone.

**Rationale**: A learning tool that excludes readers is not a learning tool. Offline capability
follows naturally from a client-only architecture and should not be surrendered by accident.

### VII. Test the Logic That Matters

Testing effort concentrates where a defect changes what the user is told.

- The dosha scoring engine MUST have unit tests covering: known-input/known-output cases per
  dosha, balanced and tri-doshic blends, ties, incomplete submissions, and out-of-range input.
- The recommendation rule engine MUST have unit tests asserting that generated guidance matches
  the resulting dosha profile and that no rule can emit prohibited medical content
  (Principle II).
- Content schema validation MUST have tests, and the full content corpus MUST be validated in
  CI.
- Glossary coverage MUST be enforced by an automated check: every term marked as technical in
  content resolves to a glossary entry.
- Presentational components do not require exhaustive unit tests. Do not pad coverage with
  tests that assert markup.

**Rationale**: Bugs in scoring and recommendation logic are invisible — they produce a wrong
answer that looks exactly like a right one. That is precisely where tests earn their cost.

## Technical Constraints

- **Stack**: React with Vite, TypeScript. Static build output only.
- **Architecture**: Client-only single-page application. No backend service, no API layer, no
  database, no authentication.
- **Deployment**: Deployable as static files to any static host (GitHub Pages, Netlify, or
  equivalent) with no server-side runtime.
- **Persistence**: Browser localStorage, accessed through a single storage module so that
  Principle V can be audited in one place. Schema-versioned to survive content updates.
- **Dependencies**: Prefer few. Any dependency that makes network calls, injects tracking, or
  requires a server is disallowed. New runtime dependencies MUST be justified in review.
- **Content location**: All content data under a dedicated content directory, importable as
  typed modules, validated against schema.

## Development Workflow & Quality Gates

- Every feature follows the Spec Kit flow: specify → clarify (when ambiguous) → plan → tasks →
  implement.
- Plans MUST pass a Constitution Check before implementation begins. Any deviation MUST be
  recorded in the plan's Complexity Tracking section with an explicit justification and the
  simpler alternative that was rejected.
- CI MUST run, and MUST block on: type checking, unit tests, content schema validation, and
  glossary coverage.
- Content changes and code changes are reviewed against different bars. Content review checks
  accuracy, attribution, and novice comprehensibility. Code review checks correctness,
  accessibility, and the privacy constraint.
- Any change touching the assessment flow, results presentation, or recommendation output MUST
  be reviewed explicitly against Principles II and IV before merge.

## Governance

This constitution supersedes other practices and conventions in this project. Where a
convenience conflicts with a principle, the principle wins.

- **Amendment procedure**: Amendments MUST be proposed as a written change to this file,
  including the rationale and the migration impact on existing specs, plans, and content. An
  amendment takes effect when merged.
- **Versioning policy**: Semantic versioning applies to this document.
  - MAJOR — a principle is removed or redefined in a backward-incompatible way.
  - MINOR — a principle or section is added, or existing guidance is materially expanded.
  - PATCH — clarification, wording, or typo fixes that do not change obligations.
- **Compliance review**: Every plan records a Constitution Check. Reviewers MUST verify
  compliance before approving implementation work. Principles marked NON-NEGOTIABLE
  (II and V) admit no justified deviation; a change that violates them is rejected, not
  documented as a tradeoff.
- **Runtime guidance**: Agent-specific and day-to-day development guidance belongs in the
  repository's agent guidance file (for example `CLAUDE.md`), which MUST NOT contradict this
  constitution.

**Version**: 1.0.0 | **Ratified**: 2026-08-08 | **Last Amended**: 2026-08-08
