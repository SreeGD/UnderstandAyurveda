# Implementation Plan: Ayurveda Fundamentals, Dosha Discovery & Lifestyle Guidance

**Branch**: `001-ayurveda-dosha-learning` | **Date**: 2026-08-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-ayurveda-dosha-learning/spec.md`

## Summary

Take a complete novice from zero knowledge of Ayurveda to a constitutional profile they understand
and concrete lifestyle adjustments they can act on — through onboarding, a guided fundamentals
course, quizzes with spaced review, a transparent prakriti/vikriti self-assessment, generated
lifestyle guidance, and a searchable reference.

Technically this is a single-project, client-only React + TypeScript SPA built with Vite, deployed
as static files. Content is the center of gravity: lessons, glossary, quiz items, assessment
questions, and recommendation rules all live as Zod-typed data modules under `src/content/`,
structurally separated from React so a domain expert can review them, and gated by an automated
validator that enforces source attribution, glossary coverage, and a medical-safety lint. A pure
scoring engine turns assessment responses into a three-dosha percentage blend with a reasoned
confidence signal and a fully inspectable breakdown; a pure rule engine turns that profile into
guidance. All persistence is `localStorage` behind a single audited module — no backend, no
accounts, no analytics, no network request carrying user data. Offline capability comes from a
precached service worker.

## Technical Context

**Language/Version**: TypeScript 5.x, ES2022 target

**Primary Dependencies**: React 19, React Router 7, Zod 4 (runtime — three packages).
Vite 7, Vitest 3, Testing Library, axe-core, vite-plugin-pwa, ESLint (build/dev only)

**Storage**: Browser `localStorage` — single namespaced, schema-versioned document with an ordered
migration chain, accessed exclusively through `src/storage/` (enforced by lint rule)

**Testing**: Vitest + jsdom + Testing Library for units and components; axe assertions for
accessibility; content schema validation, glossary-coverage, and medical-safety lint run as
test-suite gates and in CI

**Target Platform**: Modern evergreen browsers, desktop and mobile; static hosting (GitHub Pages /
Netlify); fully functional offline after first load

**Project Type**: Single-project client-only SPA (no backend, no API layer)

**Performance Goals**: Interaction response under 100ms; initial load under 3s on a mid-tier phone
over 3G; JS bundle budget 250KB gzipped excluding content data

**Constraints**: Zero network requests carrying user data; zero analytics or third-party trackers;
WCAG 2.1 AA; offline-capable after first load; no server-side runtime of any kind

**Scale/Scope**: ~10–14 lessons, ~150 quiz items, ~50 prakriti + ~20 vikriti assessment questions,
~200 reference/glossary entries, ~20 screens, single local user per browser profile

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

Gates derived from `.specify/memory/constitution.md` v1.0.0.

| # | Principle | Gate | Pre-Phase 0 | Post-Phase 1 | How the design satisfies it |
|---|---|---|---|---|---|
| I | Novice-First Clarity | Every technical term resolves to a glossary entry carrying meaning + pronunciation + example; unglossed terms fail the build | PASS | PASS | Lesson bodies are structured blocks with explicit `[[term-id]]` markup; `validate:content` resolves every reference and asserts required glossary fields (R3) |
| II | **Educational, Never Medical** (NON-NEGOTIABLE) | Non-dismissible disclaimer on assessment/results/plan; no dosing or treatment claims; red-flag screening routes to professional care | PASS | PASS | Two automated gates — a content lint over all strings for dosage/claim/alter-care patterns with auditable `allowLint` annotations, plus surface tests asserting disclaimer presence and red-flag routing (R4) |
| III | Traceable, Data-Separated Content | Citation is a required schema field; content reviewable without touching React | PASS | PASS | All content under `src/content/` as Zod-typed data modules; `SourceAttribution` required on every claim block, with `claimType ∈ {classical, contested, modern-interpretation}` so honest sourcing is a first-class option (R11) |
| IV | Transparent Assessment | Percentage blends not labels; scoring inspectable; ties honest; prakriti vs vikriti explained upfront | PASS | PASS | Linear weighted-sum engine chosen specifically so a novice can follow the breakdown; per-question contribution retained in the result; dual-dosha/tri-doshic thresholds in content config; confidence decomposed into completeness/separation/consistency with stated reasons (R1) |
| V | **Privacy by Default** (NON-NEGOTIABLE) | Zero network calls with user data, no analytics, one-click export and delete | PASS | PASS | No backend exists to send data to; `localStorage` access confined to `src/storage/` by ESLint rule; no analytics dependency; export/delete are first-class storage-module operations (R9) |
| VI | Accessible and Offline-Capable | WCAG 2.1 AA, keyboard-complete, offline after first load, mobile-first | PASS | PASS | A11y patterns fixed at design time (aria-live feedback, fieldset/legend question groups, focus management, never color-alone) with axe assertions in component tests; precache-everything service worker (R5, R10) |
| VII | Test the Logic That Matters | Scoring engine, rule engine, content schema and glossary coverage tested; no markup-assertion padding | PASS | PASS | Scoring and recommendation engines are pure functions with no React import — directly unit testable; validation and lint gates have their own tests; component tests limited to behavior that carries a constitutional obligation |

**Result**: PASS on all seven gates, both evaluations. **Complexity Tracking section is empty — no
deviations to justify.**

Two design choices deserve explicit note because they were made *to* satisfy a gate rather than
merely to avoid violating one:

- The scoring model is deliberately the simplest defensible one (weighted linear sum). A more
  sophisticated model would satisfy "show the scoring" literally while defeating Principle IV's
  purpose, which is a breakdown a novice can actually follow.
- Lesson content is structured blocks rather than markdown specifically so that "every substantive
  claim carries an attribution" is machine-checkable. With markdown bodies that requirement would
  degrade to regex and quietly rot — and Principle III is the one most likely to erode as content
  volume grows.

## Project Structure

### Documentation (this feature)

```text
specs/001-ayurveda-dosha-learning/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — design decisions R1–R11
├── data-model.md        # Phase 1 output — entities, fields, relationships, state
├── quickstart.md        # Phase 1 output — setup and end-to-end validation guide
├── contracts/           # Phase 1 output
│   ├── content-schema.md    # Author ↔ app contract for all content data
│   ├── scoring-contract.md  # Assessment responses → dosha profile
│   ├── storage-schema.md    # Versioned local document + migration rules
│   └── export-format.md     # User-facing data export contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── main.tsx                     # Entry, router mount, service worker registration
├── App.tsx                      # Shell: nav, skip link, disclaimer surface, routes
├── routes/                      # One directory per screen, colocated CSS module + test
│   ├── onboarding/              # US1 — what Ayurveda is, not-medical framing, prakriti vs vikriti
│   ├── learn/                   # US3 — course index, lesson reader
│   ├── quiz/                    # US4 — lesson quiz, cumulative review, progress/mastery
│   ├── assess/                  # US1/US6 — prakriti flow, vikriti flow, red-flag screen
│   ├── results/                 # US1/US6 — blend, confidence, score breakdown, comparison
│   ├── plan/                    # US2 — generated guidance, print view
│   ├── reference/               # US5 — search, browse, entry detail
│   └── data/                    # US7 — what's stored, export, delete-all
│
├── domain/                      # Pure logic — no React imports, exhaustively unit tested
│   ├── scoring/                 # Weighted sum, normalization, confidence, ambiguity (R1)
│   ├── comparison/              # Prakriti vs vikriti deltas and elevation (R2)
│   ├── recommendations/         # Profile + season → selected guidance (R? rule engine)
│   ├── review/                  # Leitner scheduling, due ordering, mastery (R8)
│   └── search/                  # Normalization, index build, ranking, did-you-mean (R7)
│
├── content/                     # Reviewable data — no JSX, no logic
│   ├── schema/                  # Zod schemas + inferred types (the contract)
│   ├── glossary/                # Terms: meaning, pronunciation, example, aliases
│   ├── lessons/                 # Structured block bodies with [[term-id]] markup
│   ├── quiz/                    # MCQ, matching, scenario items + why-explanations
│   ├── assessment/              # Prakriti + vikriti questions, option weights, reliability
│   ├── recommendations/         # Rules keyed by dosha condition, life area, season
│   ├── reference/               # Doshas, gunas, tastes, herbs, dhatus, srotas, seasons
│   └── config.ts                # Thresholds: ambiguity, elevation, confidence bands
│
├── storage/                     # Sole localStorage caller (lint-enforced)
│   ├── store.ts                 # Load/save, availability probe, in-memory fallback
│   ├── migrations.ts            # Ordered schemaVersion migration chain
│   └── portability.ts           # Export bundle, delete-all
│
├── components/                  # Shared presentational + a11y primitives
│   ├── Disclaimer/              # Non-dismissible educational-not-medical notice
│   ├── TermLink/                # Resolves [[term-id]] to glossary popover
│   ├── DoshaBlend/              # Three-bar percentage display, never a bare label
│   ├── ScoreBreakdown/          # Per-question contribution table
│   └── ...                      # ProgressBar, LiveRegion, Callout, SearchBox
│
├── hooks/                       # useProgress, useProfile, useStorageAvailability
└── styles/                      # tokens.css, global.css, print.css

tests/
├── unit/                        # domain/* — scoring, comparison, rules, review, search
├── content/                     # Schema validation, glossary coverage, medical-safety lint
├── component/                   # Behavior with a constitutional obligation + axe assertions
└── fixtures/                    # Synthetic response sets: pure-dosha, dual, tri, sparse, contradictory

scripts/
└── validate-content.ts          # CI entry point for all content gates

public/                          # Static assets; build emits 404.html + _redirects fallbacks
```

**Structure Decision**: Single-project client-only SPA — the constitution forbids a backend, so the
frontend/backend split does not apply. The organizing principle is a hard three-way separation:
`domain/` holds pure logic with no React import (Principle VII — the logic that matters is directly
testable), `content/` holds reviewable data with no JSX (Principle III — expert review without
touching code), and `storage/` is the only module that touches `localStorage` (Principle V — the
privacy guarantee is auditable in one place). `routes/` composes the three. Each boundary exists to
make a specific constitutional principle mechanically checkable rather than aspirational.

## Implementation Sequencing

User stories ship in priority order, each independently deployable:

| Phase | Delivers | Depends on |
|---|---|---|
| Setup | Vite/TS/Vitest/ESLint scaffold, tokens, shell, storage module, content schema | — |
| US1 (P1) | Onboarding, prakriti assessment, red-flag screening, blended results with breakdown | Setup |
| US2 (P2) | Recommendation rules, plan view, export/print | US1 profile |
| US3 (P3) | Lesson content, course index, reader, term resolution | Setup (content schema) |
| US4 (P4) | Quiz engine, three question types, why-feedback, Leitner review, mastery | US3 content |
| US5 (P5) | Search index, reference browse and detail, cross-links | Setup (content schema) |
| US6 (P6) | Vikriti assessment, comparison view, dated history | US1 baseline |
| US7 (P7) | Data settings, export bundle, delete-all | Setup (storage) |
| Polish | Service worker, print stylesheet, full a11y pass, host fallbacks, perf budget | All |

US3 and US5 depend only on the content schema, not on US1/US2 — so they can be built in parallel
with the assessment path once Setup lands.

## Complexity Tracking

> No Constitution Check violations. No deviations require justification.
