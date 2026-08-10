/**
 * Medical-safety lint — gate C8.
 *
 * Constitution Principle II (Educational, Never Medical) is NON-NEGOTIABLE, and
 * prose-based rules erode as content grows. This gate is crude on purpose: it
 * catches the realistic failure, which is an author writing "take 500mg twice
 * daily" because it felt helpful.
 *
 * The `allowLint` escape hatch keeps the gate from being switched off wholesale
 * the first time it produces a false positive — an exception is declared in the
 * content file, carries a justification, and shows up in the validator report.
 *
 * Herb entries admit NO escape hatch. Dosing guidance for herbs is the single
 * most likely way this app could cause real harm.
 */

import type { AllowLint } from '../schema/blocks'

export interface SafetyPattern {
  id: string
  category: 'dosage' | 'therapeutic-claim' | 'alter-care' | 'diagnostic'
  pattern: RegExp
  explanation: string
}

export const SAFETY_PATTERNS: SafetyPattern[] = [
  // ---- Dosage ----
  {
    id: 'dosage-units',
    category: 'dosage',
    pattern: /\b\d+(\.\d+)?\s*(mg|milligrams?|g|grams?|ml|millilitres?|milliliters?|mcg)\b/i,
    explanation: 'Numeric dosage. The app must never tell a user how much of anything to take.',
  },
  {
    id: 'dosage-spoons',
    category: 'dosage',
    pattern:
      /\b(\d+|one|two|three|four|half|quarter)\s*(-|\s)?\s*(tsp|tbsp|teaspoons?|tablespoons?|capsules?|tablets?|pills?|drops?|pinch(es)?)\b/i,
    explanation: 'Measured quantity of a substance to consume.',
  },
  {
    id: 'dosage-frequency',
    category: 'dosage',
    pattern:
      /\b(take|ingest|consume|swallow|administer)\b[^.]{0,60}\b(daily|twice a day|three times|before bed|on an empty stomach|after meals)\b/i,
    explanation: 'A dosing schedule for a substance.',
  },

  // ---- Therapeutic claims ----
  {
    id: 'claim-cure',
    category: 'therapeutic-claim',
    pattern: /\b(cures?|curing|cured)\b/i,
    explanation: 'Claims to cure. Use descriptive, non-therapeutic language.',
  },
  {
    // Requires a clinical object. A bare /\btreats?\b/ also fires on "an
    // occasional treat" and "treating a dosha as an identity", neither of which
    // is a therapeutic claim — and a gate that cries wolf gets switched off.
    id: 'claim-treat',
    category: 'therapeutic-claim',
    pattern:
      /\b(treats?|treating|treated)\b(?:\s+\w+){0,3}\s+\b(condition|conditions|disease|diseases|illness|ailment|ailments|complaint|complaints|symptom|symptoms|disorder|disorders|infection|inflammation|pain)\b/i,
    explanation: 'Claims to treat a condition.',
  },
  {
    id: 'claim-treatment-for',
    category: 'therapeutic-claim',
    pattern: /\b(treatment|therapy|remedy|remedies)\s+for\b/i,
    explanation: 'Positions something as a treatment or remedy for something.',
  },
  {
    id: 'claim-used-to-treat',
    category: 'therapeutic-claim',
    pattern: /\b(used|helps?|works?|good)\s+to\s+(treat|cure|heal)\b/i,
    explanation: 'Claims a therapeutic use.',
  },
  {
    id: 'claim-heal-prevent',
    category: 'therapeutic-claim',
    pattern: /\b(heals?|healed|prevents?|prevented|preventing)\b/i,
    explanation: 'Claims to heal or prevent. Describe traditional context instead.',
  },
  {
    id: 'claim-diagnose-disease',
    category: 'therapeutic-claim',
    pattern:
      /\b(diabetes|cancer|arthritis|hypertension|depression|anxiety disorder|asthma|infection|ulcer|thyroid)\b/i,
    explanation:
      'Named medical condition. Discussing specific diseases moves from education toward diagnosis.',
  },

  // ---- Altering care ----
  {
    id: 'alter-stop-medication',
    category: 'alter-care',
    pattern: /\b(stop|discontinue|quit|come off)\b[^.]{0,40}\b(taking|medication|medicine|drugs?|prescription)\b/i,
    explanation: 'Advises altering prescribed treatment. Absolutely prohibited.',
  },
  {
    id: 'alter-instead-of',
    category: 'alter-care',
    pattern: /\binstead of\b[^.]{0,40}\b(medication|medicine|your doctor|treatment|prescription)\b/i,
    explanation: 'Positions the app as a substitute for medical care.',
  },
  {
    id: 'alter-no-doctor',
    category: 'alter-care',
    pattern: /\b(no need|don'?t need|needn'?t|avoid)\b[^.]{0,30}\b(see|seeing|consult|visit)\b[^.]{0,20}\b(doctor|physician|practitioner)\b/i,
    explanation: 'Discourages seeking care.',
  },

  // ---- Diagnostic framing ----
  {
    id: 'diagnostic-you-have',
    category: 'diagnostic',
    pattern: /\byou (have|are suffering from|are diagnosed with)\b[^.]{0,30}\b(condition|disorder|disease|syndrome|deficiency)\b/i,
    explanation: 'Diagnostic assertion about the user.',
  },
]

export interface SafetyViolation {
  patternId: string
  category: SafetyPattern['category']
  explanation: string
  matched: string
  text: string
  location: string
}

export interface SafetyScanOptions {
  /** Where this text came from, for the error report. */
  location: string
  /** Declared exception, if any. Ignored entirely when `noEscapeHatch` is set. */
  allowLint?: AllowLint | undefined
  /**
   * Set for herb reference entries. The lint becomes absolute: an `allowLint`
   * annotation cannot suppress a finding (FR-036).
   */
  noEscapeHatch?: boolean
}

/** Scans one string. Returns every violation found. */
export function scanText(text: string, options: SafetyScanOptions): SafetyViolation[] {
  const violations: SafetyViolation[] = []

  for (const pattern of SAFETY_PATTERNS) {
    const match = pattern.pattern.exec(text)
    if (!match) continue

    const suppressed =
      !options.noEscapeHatch &&
      options.allowLint !== undefined &&
      options.allowLint.pattern === pattern.id

    if (suppressed) continue

    violations.push({
      patternId: pattern.id,
      category: pattern.category,
      explanation: pattern.explanation,
      matched: match[0],
      text: text.length > 160 ? `${text.slice(0, 157)}…` : text,
      location: options.location,
    })
  }

  return violations
}

/** Scans many strings sharing the same options. */
export function scanStrings(texts: string[], options: SafetyScanOptions): SafetyViolation[] {
  return texts.flatMap((text) => scanText(text, options))
}

export function formatViolation(v: SafetyViolation): string {
  return `${v.location}: [${v.category}/${v.patternId}] matched "${v.matched}" — ${v.explanation}\n    in: "${v.text}"`
}
