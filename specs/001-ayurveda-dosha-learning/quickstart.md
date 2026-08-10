# Quickstart & Validation Guide

**Feature**: `001-ayurveda-dosha-learning` | **Date**: 2026-08-08

How to run the app and prove each user story actually works. Written to be executable by someone
who has not read the plan.

## Prerequisites

- Node.js 20+ and npm 10+
- A modern browser (Chrome, Firefox, Safari, or Edge — current version)

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` (emits `404.html` + `_redirects` fallbacks) |
| `npm run preview` | Serve the production build — **required** for service-worker/offline testing |
| `npm test` | Full Vitest suite: domain units, content gates, component + axe |
| `npm run test:watch` | Watch mode |
| `npm run validate:content` | Content gates C1–C10 alone (fast feedback while authoring) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, including the storage-access restriction |

CI runs `typecheck → lint → validate:content → test → build`, all blocking.

---

## Validation Scenarios

Each maps to a user story and its acceptance scenarios in [spec.md](./spec.md).

### V1 — Discover constitutional type (US1, P1)

1. Open the app in a **fresh profile** (or run "Delete all my data" first).
2. **Expect**: onboarding covering what Ayurveda is, the educational-not-medical framing, and the
   prakriti vs vikriti distinction — before any question. *(FR-001)*
3. Start the prakriti assessment. Answer ~10 questions, then close the tab. Reopen.
4. **Expect**: answers preserved, resumed at the question you left. *(FR-025)*
5. Complete the assessment.
6. **Expect**: three percentages summing to 100, a confidence indicator, and no single type label
   presented as the sole result. *(FR-019, FR-020)*
7. Open "How was this calculated?".
8. **Expect**: every question listed with your answer and the points it contributed to each dosha;
   skipped questions shown as skipped. *(FR-021, invariant S3)*
9. **Expect**: the non-dismissible educational-not-medical notice on both the assessment and result
   screens. *(FR-002)*

**Red-flag path**: restart, and on the screening step indicate pregnancy (or a diagnosed
condition / current medication / acute symptoms). **Expect** a prominent prompt to consult a
practitioner or physician *before* results render. *(FR-023, SC-009)*

**Ambiguity path**: use the seeded fixture profile "near-tie" (dev-only route `/dev/fixtures`, or
answer to produce a close split). **Expect** a dual-dosha or tri-doshic presentation with an
explanation that the result is not clearly differentiated — never an arbitrary winner. *(FR-022)*

**Sparse path**: skip most optional questions. **Expect** a result with reduced confidence and a
stated reason naming the skipping. *(FR-020, invariant S8)*

### V2 — Lifestyle guidance (US2, P2)

1. With a completed assessment, open the plan.
2. **Expect**: non-empty guidance in all five areas — routine, meals, movement, seasonal,
   self-care. *(FR-027, invariant P1)*
3. Inspect any recommendation. **Expect**: a stated reason tying it to a profile characteristic.
   *(FR-028)*
4. Change the season setting. **Expect**: only the seasonal section changes. *(FR-033, P4)*
5. Print (Cmd/Ctrl-P). **Expect**: the printed document contains the full plan, the profile, the
   date, and the disclaimer. *(FR-032)*
6. Scan the plan for dosing or treatment language. **Expect**: none — and `npm test` proves it over
   the whole rule set, not just what rendered. *(FR-029, SC-007)*
7. With a tri-doshic profile, reopen the plan. **Expect**: coherent balanced guidance, not three
   competing dosha-specific sets. *(FR-031, P3)*

### V3 — Learn the fundamentals (US3, P3)

1. Open the course with no assessment data present.
2. **Expect**: lessons in recommended order with completion state and estimated reading time.
3. Open any lesson. **Expect**: each Sanskrit term's first appearance shows meaning, pronunciation,
   and an everyday example. *(FR-005)*
4. Select a term inline. **Expect**: its glossary entry opens without losing your place. *(US3 AS3)*
5. **Expect**: source attributions visible or reachable for substantive claims. *(FR-007)*
6. Complete the knowledge check. **Expect**: lesson marked complete, next lesson offered; state
   survives reload. *(FR-009)*
7. Jump directly to a late lesson. **Expect**: prerequisites named with links, access not blocked.
   *(FR-010)*

### V4 — Quizzes and spaced review (US4, P4)

1. Take a lesson quiz containing multiple-choice, matching, and scenario questions. *(FR-012)*
2. Answer some correctly and some incorrectly.
3. **Expect**: for correct answers, why the answer is right; for incorrect, why *your* choice was
   wrong as well. *(FR-013)*
4. Leave mid-quiz and return. **Expect**: resume or restart offered, no silent loss. *(FR-016)*
5. Start a review session. **Expect**: previously missed items appear before mastered ones.
   *(FR-014, SC-014)*
6. Answer a topic correctly across separate sessions. **Expect**: that topic's mastery indicator
   rises. *(FR-015)*

### V5 — Reference (US5, P5)

1. Search `dosa`, then `doṣa`, then `dosha`. **Expect**: all three find the same entry. *(FR-035)*
2. Search by English meaning ("digestive fire"). **Expect**: `Agni` returned. *(FR-035)*
3. Open a herb entry. **Expect**: description and traditional context only — no dosage, no
   preparation-for-treatment, plus a practitioner notice. *(FR-036)*
4. Open an entry taught by a lesson. **Expect**: a link to that lesson. *(FR-037)*
5. Search nonsense (`qqqq`). **Expect**: close matches or browsable categories, not an empty
   screen. *(FR-038)*

### V6 — Current state vs baseline (US6, P6)

1. Without a prakriti result, open the vikriti assessment. **Expect**: told a baseline is needed,
   offered the prakriti assessment. *(US6 AS3)*
2. With a baseline, complete the vikriti assessment. **Expect**: both shown side by side with the
   difference explicit. *(FR-018)*
3. **Expect**: an elevated dosha described as a temporary, changeable state, with guidance shifted
   accordingly. *(US6 AS2)*
4. Answer so no dosha crosses the elevation threshold. **Expect**: the app says nothing notable
   changed rather than inventing an imbalance. *(R2)*
5. Report severe or persistent symptoms. **Expect**: prominent professional-care prompt.
6. Complete a second vikriti assessment. **Expect**: dated history listing both. *(FR-026)*

### V7 — Data control (US7, P7)

1. Generate data across assessment, lessons, and quizzes.
2. Open data settings. **Expect**: what is stored, and a statement that nothing leaves the device.
   *(FR-043)*
3. Export. **Expect**: one JSON file containing assessment results, quiz history, lesson progress —
   with question prompts and answer texts readable without the app.
   *(FR-041, [export-format.md](./contracts/export-format.md))*
4. Choose delete-all, then cancel. **Expect**: nothing removed. *(US7 AS4)*
5. Choose delete-all and confirm. **Expect**: app returns to verified first-run state. *(FR-042)*

---

## Cross-Cutting Checks

### Privacy (Principle V, SC-010)

With DevTools → Network open, complete the full journey. **Expect**: zero requests beyond initial
static assets and the service worker. Zero requests carrying user data, ever. `npm test` asserts
this by failing on any `fetch`/`XMLHttpRequest`/`sendBeacon` during a simulated journey.

### Offline (FR-050, SC-012)

```bash
npm run build && npm run preview
```

Load once, then go offline (DevTools → Network → Offline, or disable Wi-Fi). **Expect**: lessons,
quizzes, assessment, plan, and reference all continue to work. Then clear site data, go offline,
and load fresh — **expect** a clear explanatory message, not a blank page.

### Accessibility (Principle VI, SC-011)

- Complete every flow using **keyboard only**: Tab, Shift-Tab, Enter, Space, arrows in radio
  groups. Focus must always be visible and never trapped. *(FR-048)*
- With a screen reader (VoiceOver / NVDA), take a quiz: answer selection, correctness, and
  progression must all be **announced**. Correctness must be conveyed by icon and text, not colour
  alone. *(FR-049)*
- Run the axe assertions: `npm test` — zero Level A or AA violations.
- Resize to 375px wide: complete the assessment with no horizontal scrolling and no obscured
  controls. *(FR-051, SC-017)*

### Storage failure (FR-044)

Open in a private/incognito window with storage blocked. **Expect**: the app works for the session
and shows a persistent "progress won't be saved" banner. It must not crash or fail silently.

### Corrupt data (FR-045)

In DevTools → Application → Local Storage, set `understandayurveda:userdata` to `{"quizAttempts":`
(truncated JSON) and reload. **Expect**: no crash; the damaged record is quarantined and a targeted
reset is offered; other records — especially assessment results — still load.

### Content gates (Principles I, II, III)

```bash
npm run validate:content
```

**Expect**: all ten gates pass. To confirm the gates actually bite, temporarily add a `[[nonsense]]`
term reference to a lesson (C2 must fail) and `take 500mg twice daily` to a recommendation (C8 must
fail). Revert both. A gate that has never been seen to fail is a gate you cannot trust.

---

## Definition of Done

- [ ] All seven validation scenarios pass end-to-end
- [ ] All cross-cutting checks pass
- [ ] `npm run typecheck && npm run lint && npm run validate:content && npm test && npm run build`
      all succeed
- [ ] Zero WCAG 2.1 A/AA violations, automated and manual
- [ ] Zero network requests carrying user data across the full journey
- [ ] Bundle within budget: JS ≤ 250KB gzipped excluding content data

**Not covered by this feature** — practitioner certification of content accuracy is a pre-launch
gate tracked separately. Until it completes, the app states that content is educational and has not
been reviewed by a credentialed practitioner.
