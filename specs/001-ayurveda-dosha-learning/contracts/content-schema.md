# Contract: Content Schema

**Module**: `src/content/schema/` | **Consumers**: content authors (human), app renderers, validator

This is the contract between whoever writes the Ayurveda content and the application. Principle III
requires a domain expert to review and correct content without reading React — so this document,
not the component tree, is the authority on what content must contain.

## Enforcement

```bash
npm run validate:content    # standalone, CI-blocking
npm test                    # same gates run inside the suite
```

Validation failure is a **build failure**, not a warning. Ten gates:

| # | Gate | Requirement | Spec ref |
|---|---|---|---|
| C1 | Schema parse | Every content module satisfies its Zod schema | — |
| C2 | Term coverage | Every `[[term-id]]` resolves to a `GlossaryTerm` | FR-006, SC-006 |
| C3 | Term completeness | Every term has non-empty `pronunciation`, `meaning`, `example` | FR-005 |
| C4 | Attribution | Every substantive claim block carries or inherits `SourceAttribution` | FR-007, SC-005 |
| C5 | Contested honesty | `claimType: 'contested'` requires a `note` explaining the disagreement | FR-008 |
| C6 | Quiz explanations | Every question has `whyCorrect`; every incorrect option has `whyWrong` | FR-013 |
| C7 | Referential integrity | Every lesson/quiz/term/entry id referenced anywhere resolves | — |
| C8 | Medical safety | No dosage, therapeutic claim, or alter-care language | FR-029, FR-036, SC-007 |
| C9 | Rule coverage | All five life areas populated for all four canonical profile shapes | FR-031 |
| C10 | Weight sanity | `weights` non-negative with ≥1 positive; `reliability` ∈ [0.5, 2.0] | — |

## Inline term markup

Within any block `text` field:

```
[[vata]]                    → renders the term's canonical name, links to glossary
[[vata|the Vata dosha]]     → renders custom display text, same link
```

Unresolvable ids fail C2. Authors introducing a term for the first time in a lesson use a
`termIntro` block instead of bare markup — the block that satisfies Principle I's
meaning + pronunciation + example requirement.

## Substantive claim rule (C4)

A block makes a *substantive claim* when it asserts something about Ayurveda as a system — what a
dosha governs, what a quality does, what a practice is for. It does not apply to navigational or
framing prose ("In this lesson you'll see…", "Next we'll look at…").

Authors satisfy C4 either by setting `source` on the block, or by placing a `sourceNote` block that
covers the section. The validator treats a `sourceNote` as covering subsequent blocks until the
next heading-level boundary. Blocks flagged `framing: true` are exempt — an explicit, reviewable
opt-out rather than a silent heuristic.

## Medical-safety lint (C8)

Patterns that fail, applied to every content string:

| Category | Examples of what fails |
|---|---|
| Dosage | `500mg`, `2 tsp daily`, `three capsules`, `10 drops`, `twice a day with` |
| Therapeutic claim | `cures`, `treats <condition>`, `heals`, `prevents <disease>`, `remedy for` |
| Alter-care | `stop taking`, `instead of your medication`, `replace your prescription`, `no need to see a doctor` |
| Diagnostic | `you have <condition>`, `this means you are suffering from` |

**Escape hatch**: a block may carry
`allowLint: { pattern: string, justification: string, reviewedBy: string }`. It is visible in the
content file, appears in the validator's report, and is reviewable. **Herb entries
(`category: 'herb'`) admit no escape hatch at all** — the lint is absolute there, because dosing
guidance for herbs is the single most likely way this app could cause real harm.

Authors writing about a classical *concept* that includes a flagged word (e.g. describing what a
classical text says a preparation was traditionally used for) phrase it as historical description
with `claimType: 'classical'` — not as instruction to the reader.

## Authoring checklist

Before submitting content:

- [ ] Every Sanskrit term used has a glossary entry, and its first appearance in the lesson is a
      `termIntro` block
- [ ] Pronunciation hints readable by someone who has never seen Sanskrit (`VAH-tuh`, not IAST)
- [ ] Every factual claim has a source with the honest `claimType` — if it cannot be traced to a
      classical text, it is `modern-interpretation`, not a guess at a citation
- [ ] Where Charaka and Sushruta differ, `contested` with a `note` saying how
- [ ] Every wrong quiz option explains *why* it is wrong, in a way that teaches
- [ ] No dosing, no treatment claims, no advice touching prescribed care
- [ ] Herb entries: description and traditional context only, `practitionerNotice: true`
- [ ] `npm run validate:content` passes

## Content versioning

`src/content/version.ts` exports a `contentVersion` string, bumped whenever assessment questions,
option weights, or scoring thresholds change. Stored results record the version they were produced
under, so a result computed under older content still renders, with a note (FR-046). Lesson prose
and reference edits do not require a bump — they cannot invalidate a stored result.
