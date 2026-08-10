# Contract: Scoring Engine

**Module**: `src/domain/scoring/` | **Purity**: no React, no storage, no I/O — deterministic

The contract that Principle IV (Transparent Assessment) rests on. Every field in the output exists
because some user-facing honesty requirement needs it.

## Interface

```ts
scoreAssessment(input: ScoringInput): DoshaProfile
```

### Input

```ts
interface ScoringInput {
  assessmentType: 'prakriti' | 'vikriti'
  questions: AssessmentQuestion[]        // full bank for this type, from content
  responses: Record<QuestionId, OptionId> // may be partial
  config: ScoringConfig                   // thresholds from content/config.ts
}
```

Unanswered questions are simply absent from `responses` — there is no sentinel value.

### Output

```ts
interface DoshaProfile {
  percentages: { vata: number; pitta: number; kapha: number }  // integers, sum === 100
  dominant: Dosha[]                                            // 1–3 entries, ordered
  shape: 'single' | 'dual' | 'tridoshic'
  confidence: {
    level: 'high' | 'moderate' | 'low'
    signals: { completeness: number; separation: number; consistency: number }  // each 0..1
    reasons: string[]                    // user-facing sentences, empty when level === 'high'
  }
  breakdown: ScoreContribution[]
  subProfiles: Record<Category, DoshaVector>
  rawTotals: DoshaVector
  answeredCount: number
  totalCount: number
}

interface ScoreContribution {
  questionId: string
  questionPrompt: string
  answerText: string | null        // null when skipped
  reliability: number
  points: DoshaVector              // optionWeight × reliability, per dosha
}
```

## Algorithm

1. **Accumulate** — for each answered question, add `option.weights[d] × question.reliability` to
   `rawTotals[d]`, and record a `ScoreContribution`. Skipped questions produce a contribution with
   `answerText: null` and zero points, so the breakdown shows what was *not* answered too.
2. **Normalize** — percentages = `rawTotals[d] / sum(rawTotals) × 100`, rounded by
   **largest-remainder** so the three always total exactly 100 with no visible rounding drift.
3. **Classify shape** —
   - `tridoshic` when `max − min ≤ config.triDoshicSpreadPoints`;
   - else `dual` when `top1 − top2 ≤ config.dualDoshaMarginPoints`;
   - else `single`.
   `dominant` contains every dosha included by that classification, in descending order. Exact ties
   are reported as ties — never broken by ordering, index, or any arbitrary rule (FR-022).
4. **Sub-profiles** — repeat steps 1–2 per `category`, giving the physical / physiological /
   mental-emotional readings independently.
5. **Confidence signals**, each normalized to `0..1`:
   - `completeness` = reliability-weighted answered ÷ reliability-weighted total.
   - `separation` = `(top1 − top2) / config.dualDoshaMarginPoints`, clamped to 1.
   - `consistency` = `1 − (mean pairwise distance between sub-profile vectors / maxDistance)`,
     with an additional penalty per triggered `contradicts` pair.
6. **Level** — `high` requires all three signals above their band cutoff; `low` when any signal
   falls below its low cutoff; `moderate` otherwise. Each signal below its cutoff appends a plain
   sentence to `reasons` — for example *"You skipped 12 questions, so this result is less
   reliable."* or *"Your physical answers point to Kapha while your mental answers point to Vata."*

## Invariants (asserted in tests)

| # | Invariant |
|---|---|
| S1 | `percentages` are integers summing to exactly 100, for every input including all-skipped-but-one |
| S2 | Zero answered questions → throws `InsufficientResponsesError`; never a fabricated blend |
| S3 | `breakdown.length === questions.length` — every question accounted for, answered or not |
| S4 | Recomputing `percentages` from `breakdown` reproduces the result exactly (the breakdown *is* the arithmetic, not a plausible narration of it) |
| S5 | Identical input → identical output; no clock, no randomness, no ambient state |
| S6 | An exact three-way tie yields `shape: 'tridoshic'` and `dominant.length === 3` |
| S7 | `dominant` is never empty and never longer than 3 |
| S8 | `confidence.level === 'low'` implies `reasons.length > 0` — a low grade always says why |
| S9 | Adding a question the user skipped lowers `completeness` and never changes `percentages` |
| S10 | Uniform answers across one dosha yield 100/0/0 with `separation === 1` |

## Required test fixtures

`tests/fixtures/` provides: pure-vata, pure-pitta, pure-kapha, exact two-way tie, exact three-way
tie, near-tie inside the dual margin, sparse (5 of 50 answered), fully skipped optionals,
contradictory pairs triggered, sub-profiles in disagreement, single-answer minimum, and an
out-of-range/unknown option id (must throw, not silently score zero).

## Comparison sub-contract

```ts
compareProfiles(prakriti: DoshaProfile, vikriti: DoshaProfile, config): VikritiComparison
```

Returns per-dosha `delta` (percentage points), a status of `elevated | diminished | stable` using
`config.elevationDeltaPoints`, and `hasNotableChange: boolean`. When no dosha crosses the
threshold, `hasNotableChange` is `false` and the UI says nothing notable changed — the engine does
not manufacture an imbalance to have something to recommend (R2).

## Recommendation sub-contract

```ts
selectRecommendations(profile: DoshaProfile, season: Season, rules: RecommendationRule[]): LifestylePlan
```

| # | Invariant |
|---|---|
| P1 | All five `area` sections are non-empty for every profile shape, including tridoshic (FR-031) |
| P2 | Every selected recommendation carries a non-empty `because` traceable to the profile (FR-028) |
| P3 | A `tridoshic` or `balanced` profile selects `balanced`-condition rules and never emits mutually contradictory guidance from two competing doshas |
| P4 | Seasonal section reflects the `season` argument; changing season changes only that section |
| P5 | No selected guidance matches the medical-safety patterns — asserted over the entire rule set, not just the selected subset (SC-007) |
| P6 | Deterministic: same profile + season → same plan |
