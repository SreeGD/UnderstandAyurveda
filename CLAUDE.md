# UnderstandAyurveda — Agent Guidance

A static, client-only React + TypeScript SPA that teaches Ayurveda fundamentals to complete
novices, estimates their dosha profile through a transparent self-assessment, and generates
lifestyle guidance. No backend, no accounts, no analytics.

**Authority**: `.specify/memory/constitution.md` (v1.0.0). This file must never contradict it.
Feature spec, plan, and contracts live in `specs/001-ayurveda-dosha-learning/`.

## Stack

TypeScript 5 · React 19 · React Router 7 · Zod 4 · Vite 7 · Vitest 3 + Testing Library + axe-core ·
vite-plugin-pwa · CSS Modules. Runtime dependencies are deliberately three — adding a fourth needs
justification in review.

## The three boundaries that matter

Each exists to make a constitutional principle mechanically checkable, not aspirational. Do not
blur them.

| Directory | Rule | Enforces |
|---|---|---|
| `src/domain/` | Pure logic. No React import, no storage, no I/O, no clock, no randomness. | VII — the logic that matters is directly unit testable |
| `src/content/` | Reviewable data. No JSX, no logic. Zod-typed modules. | III — a domain expert reviews content without reading code |
| `src/storage/` | The **only** code that may touch `localStorage`. Lint-enforced. | V — the privacy guarantee is auditable in one file |

`src/routes/` composes the three.

## Non-negotiables

**Principle II — Educational, never medical.** No dosing, no treatment claims, no advice touching
prescribed care. The disclaimer renders on every assessment screen, every result view, and every
generated plan — including in print. Red-flag inputs (pregnancy, acute symptoms, diagnosed
condition, current medication) gate results behind a professional-care prompt. The content lint
(gate C8) blocks the build; herb entries admit no `allowLint` escape.

**Principle V — Privacy by default.** Zero network requests carrying user data. No analytics, no
telemetry, no third-party scripts. Export and delete-all are first-class.

## Things that are easy to get wrong here

- **Never present a single dosha label as the result.** `dominant` is an array by design.
  Ties are reported as ties — never broken by ordering or index (FR-022, invariant S6).
- **The score breakdown is the arithmetic, not a narration of it.** Recomputing percentages from
  `breakdown` must reproduce the result exactly (invariant S4).
- **Confidence is decomposed** into completeness / separation / consistency with user-facing
  reasons. A `low` level always says why (invariant S8).
- **Citations must be honest.** If a claim cannot be traced to a classical text, mark it
  `modern-interpretation`. Never invent a chapter reference to satisfy the schema — that failure
  mode is exactly what gate C4 exists to expose, and a fabricated citation defeats it.
- **`LifestylePlan` and `TopicMastery` are derived, never stored.** Only the profile persists.
- **Corrupt storage quarantines one record**, never the whole document.

## Commands

```bash
npm run dev              # dev server
npm test                 # domain units + content gates + component/axe
npm run validate:content # content gates C1–C10 alone
npm run typecheck        # tsc --noEmit
npm run lint             # includes the storage-access restriction
npm run build            # → dist/ with 404.html + _redirects fallbacks
npm run preview          # required for service-worker/offline testing
```

CI: `typecheck → lint → validate:content → test → build`, all blocking.

## Workflow

Spec Kit: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
User stories ship in priority order P1→P7, each independently deployable. Any change touching the
assessment flow, results presentation, or recommendation output gets an explicit review against
Principles II and IV.
