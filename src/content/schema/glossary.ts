import { z } from 'zod'
import { sourceAttributionSchema } from './blocks'
import { idSchema } from './common'

/**
 * The unit that makes Principle I (Novice-First Clarity) checkable. All three
 * of pronunciation, meaning, and example are required and non-empty — gate C3
 * fails the build otherwise, so a term cannot quietly ship half-explained.
 */
export const glossaryTermSchema = z.object({
  id: idSchema,
  /** Canonical Roman transliteration, e.g. "Vata". */
  term: z.string().min(1),
  devanagari: z.string().optional(),
  /**
   * Alternate spellings and transliterations. This list, not fuzzy matching, is
   * what makes search work across "dosa" / "doṣa" / "dosha" (research.md R7).
   */
  aliases: z.array(z.string().min(1)).default([]),
  /** Plain-reader hint like "VAH-tuh" — not IAST, which a novice cannot read. */
  pronunciation: z.string().min(1, 'pronunciation is required (gate C3)'),
  meaning: z.string().min(1, 'plain-English meaning is required (gate C3)'),
  example: z.string().min(1, 'a concrete everyday example is required (gate C3)'),
  relatedTerms: z.array(idSchema).default([]),
  taughtIn: z.array(idSchema).default([]),
  source: sourceAttributionSchema,
})

export type GlossaryTerm = z.infer<typeof glossaryTermSchema>
