# UnderstandAyurveda

A static, client-only web app that takes someone from knowing nothing about Ayurveda to
understanding their own constitutional pattern and making concrete lifestyle adjustments.

Eleven lessons, a quiz system with spaced review, a transparent dosha self-assessment, generated
lifestyle guidance, and a searchable reference. No account, no server, no analytics.

## What this is, and is not

**This is educational software, not medical care.** It does not diagnose anything. It contains no
dosing guidance for herbs or supplements anywhere, and it will never suggest changing something a
doctor has prescribed. The assessment screens for pregnancy, acute symptoms, diagnosed conditions,
and current medication, and routes anyone who reports them to professional-care guidance *before*
showing a result.

The content is sourced and attributed throughout, but it **has not been reviewed by a credentialed
Ayurvedic practitioner**. That review is a pre-launch gate and has not happened. The app says so on
its face, in onboarding and in the footer.

Where a claim cannot be traced to a classical text, it is marked `modern-interpretation` rather
than dressed up as ancient — a great deal of what circulates as "ancient Ayurvedic wisdom" is
twentieth-century synthesis, and the app labels which is which.

## Privacy

Everything you enter stays in your browser. There is no backend to send it to, no analytics, no
telemetry, and no third-party scripts. You can export all of it as readable JSON or delete all of it
in one action.

This is enforced rather than promised:

- An ESLint rule forbids `localStorage` outside `src/storage/`, so the privacy-critical surface is
  one directory.
- A test fails the build on any `fetch` / `XMLHttpRequest` / `sendBeacon` during a full user
  journey, and statically scans the source tree for network and tracking APIs.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

Requires Node 20+.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the build — **required** to test offline behaviour |
| `npm test` | Full suite: domain units, content gates, component + axe |
| `npm run validate:content` | Content gates C1–C10 alone (fast feedback while authoring) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, including the storage restriction |

CI runs `typecheck → lint → validate:content → test → build`, all blocking.

## How it is organised

Three hard boundaries, each making one project principle mechanically checkable rather than
aspirational:

| Directory | Rule | Why |
|---|---|---|
| `src/domain/` | Pure logic. No React, no storage, no I/O, no clock, no randomness. | The logic that matters is directly unit testable |
| `src/content/` | Reviewable data. No JSX, no logic. | A domain expert can review content without reading code |
| `src/storage/` | The only code that touches `localStorage`. | The privacy guarantee is auditable in one place |

`src/routes/` composes the three. See `CLAUDE.md` for day-to-day guidance and
`.specify/memory/constitution.md` for the governing principles.

## Content gates

Content is data, validated at build time. Ten gates block the build:

| Gate | Enforces |
|---|---|
| C1 | Every content module parses against its schema |
| C2 | Every `[[term]]` reference resolves to a glossary entry |
| C3 | Every glossary term has a meaning, pronunciation, and everyday example |
| C4 | Every substantive claim carries a source attribution |
| C5 | Contested claims explain how the sources differ |
| C6 | Every quiz question explains itself — including why each wrong option is wrong |
| C7 | Every cross-reference resolves |
| C8 | No dosing, therapeutic claims, or advice touching prescribed care |
| C9 | All five life areas are populated for all four profile shapes |
| C10 | Weights and ids are sane |

Gate C8 has an `allowLint` escape hatch that is visible in the content file, carries a
justification, and appears in the validator's report. **Herb entries admit no escape hatch at all** —
dosing guidance for herbs is the single most likely way this app could cause real harm.

Every gate is tested in both directions: it passes on the real corpus and fails on a crafted bad
fixture. A gate only ever observed to pass is a gate nobody has tested.

## Deploying

The build is static files with no server-side runtime. It emits both SPA fallbacks, so the same
`dist/` works on either host with no configuration:

- `dist/404.html` — a copy of `index.html`, for GitHub Pages
- `dist/_redirects` — `/* /index.html 200`, for Netlify

## Offline

A service worker precaches the entire build, so after one successful load the app works with no
network — there is nothing it needs to fetch. Before that first load nothing is cached and the
browser's own offline page appears; no application code can change that, and the app does not
pretend otherwise.

## Known limits

- **Content is not practitioner-certified.** Stated above and in the app.
- **Colour contrast is not covered by the automated suite.** jsdom has no canvas, so axe skips
  contrast checks; it needs a real browser. Every other WCAG 2.1 A/AA check runs per route.
- **Self-assessment is a starting point.** A trained practitioner assesses in person over time using
  observation, pulse, and history. A questionnaire has none of that, and the app says so on the
  results screen rather than in the small print.
- **The seasonal scheme is an adaptation.** The classical six seasons are specific to the Indian
  subcontinent; the four used here are a modern mapping, labelled as such.
- **English only**, single local user per browser profile, no import of exported data (export exists
  so you can leave with your data; import is out of scope for v1).
