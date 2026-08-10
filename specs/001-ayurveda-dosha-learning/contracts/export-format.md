# Contract: Data Export

**Module**: `src/storage/portability.ts` | **Consumer**: the user (FR-041, SC-016)

The export is a promise kept to the user: *everything we hold about you, in a form you can read
without us*. It is therefore human-readable JSON, not an opaque blob.

## Format

Filename: `understandayurveda-export-YYYY-MM-DD.json`

```jsonc
{
  "exportedAt": "2026-08-08T14:22:31.000Z",
  "appVersion": "1.0.0",
  "schemaVersion": 1,
  "contentVersion": "2026.08.01",
  "notice": "This file contains everything UnderstandAyurveda stored on your device. It was never sent anywhere. This is educational content, not medical advice.",

  "preferences": { "season": "summer", "hasSeenOnboarding": true },

  "assessments": [
    {
      "id": "…", "assessmentType": "prakriti",
      "startedAt": "…", "completedAt": "…",
      "redFlags": [],
      "responses": { "q-frame": "opt-slender", "…": "…" },
      "result": {
        "percentages": { "vata": 48, "pitta": 32, "kapha": 20 },
        "dominant": ["vata"], "shape": "single",
        "confidence": { "level": "moderate", "signals": {…}, "reasons": ["…"] },
        "breakdown": [ { "questionId": "…", "questionPrompt": "…", "answerText": "…", "points": {…} } ],
        "subProfiles": {…}
      },
      "contentVersion": "2026.08.01"
    }
  ],

  "lessonProgress": { "five-elements": { "startedAt": "…", "completedAt": "…", "knowledgeCheckPassed": true } },
  "quizAttempts": [ { "questionId": "…", "answerGiven": "…", "correct": false, "answeredAt": "…" } ],
  "reviewState": { "q-guna-01": { "box": 2, "lastAnsweredAt": "…", "dueAt": "…" } },

  "corruptRecords": {}
}
```

## Rules

- **Completeness** — every record in the stored document appears, including quarantined
  `corruptRecords`. A test compares export keys against the stored document (T3, SC-016).
- **Self-describing** — question *prompts* and *answer texts* are embedded in `breakdown`, not just
  ids, so the file is meaningful without the app. This is the difference between an export and a
  hostage.
- **Honest notice** — the `notice` field restates both the privacy fact and the
  not-medical-advice framing (Principle II travels with the data).
- **No enrichment** — export adds nothing the app did not already store. No derived analytics, no
  identifiers, no fingerprints.
- **Client-side generation** — produced via `Blob` + object URL. No network request. Not negotiable.

## Import

**Out of scope for v1.** Accepting arbitrary JSON into a health-adjacent local store adds a
validation and trust surface disproportionate to the benefit at this stage. Export exists so the
user can leave and keep their data; the format above is stable enough to import later without
migration pain.

## Print / plan export (FR-032)

Distinct from the JSON export: the lifestyle plan prints via `window.print()` against
`styles/print.css`. The printed document must contain the full plan, the dosha profile it derives
from, the generation date, and the educational-not-medical disclaimer — asserted by a component
test against the print stylesheet's included regions, since a disclaimer that vanishes on paper
fails Principle II exactly where the artifact outlives the screen.
