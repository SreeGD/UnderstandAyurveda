#!/usr/bin/env tsx
/**
 * CI entry point for content gates C1–C10.
 *
 * A failure here is a build failure, not a warning. See
 * contracts/content-schema.md for what each gate enforces and why.
 */

import { validateContent } from '../src/content/validate'

const report = validateContent()

console.log('\n  UnderstandAyurveda — content validation\n')

const counts = Object.entries(report.counts)
  .map(([k, v]) => `${v} ${k.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  .join(' · ')
console.log(`  ${counts}\n`)

if (report.declaredExceptions.length > 0) {
  console.log('  Declared lint exceptions (visible on purpose — review these):')
  for (const e of report.declaredExceptions) console.log(`    · ${e}`)
  console.log('')
}

if (report.failures.length === 0) {
  console.log('  ✓ All gates pass (C1–C10)\n')
  process.exit(0)
}

const byGate = new Map<string, string[]>()
for (const f of report.failures) {
  const list = byGate.get(f.gate) ?? []
  list.push(f.message)
  byGate.set(f.gate, list)
}

const GATE_NAMES: Record<string, string> = {
  C1: 'schema parse',
  C2: 'glossary term coverage',
  C3: 'glossary term completeness',
  C4: 'source attribution',
  C5: 'contested claims explained',
  C6: 'question explanations',
  C7: 'referential integrity',
  C8: 'medical safety',
  C9: 'recommendation coverage',
  C10: 'weight sanity',
}

for (const gate of Object.keys(GATE_NAMES)) {
  const messages = byGate.get(gate)
  if (!messages) continue
  console.error(`  ✗ ${gate} — ${GATE_NAMES[gate]} (${messages.length})`)
  for (const m of messages) console.error(`      ${m}`)
  console.error('')
}

console.error(`  ${report.failures.length} content gate failure(s).\n`)
process.exit(1)
