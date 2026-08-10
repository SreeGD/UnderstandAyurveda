import type { SourceAttribution } from './schema/blocks'

/**
 * Shared attributions, gathered here so sourcing is reviewable in one place.
 *
 * References are deliberately given at CHAPTER level rather than verse level.
 * A precise verse number that turns out to be wrong is worse than an honest
 * chapter reference — it manufactures false authority and is exactly the
 * failure mode gate C4 exists to expose (research.md R11).
 *
 * `claimType: 'modern-interpretation'` is used freely and without apology.
 * Much of what circulates as "ancient Ayurvedic wisdom" is 20th-century
 * synthesis, and saying so is more useful to a learner than pretending
 * otherwise.
 */

export const CHARAKA_SUTRA = (chapter: string, note?: string): SourceAttribution => ({
  authority: 'Charaka Samhita',
  reference: `Sutrasthana, chapter ${chapter}`,
  claimType: 'classical',
  ...(note ? { note } : {}),
})

export const CHARAKA_VIMANA = (chapter: string): SourceAttribution => ({
  authority: 'Charaka Samhita',
  reference: `Vimanasthana, chapter ${chapter}`,
  claimType: 'classical',
})

export const CHARAKA_CHIKITSA = (chapter: string): SourceAttribution => ({
  authority: 'Charaka Samhita',
  reference: `Chikitsasthana, chapter ${chapter}`,
  claimType: 'classical',
})

export const CHARAKA_SHARIRA = (chapter: string): SourceAttribution => ({
  authority: 'Charaka Samhita',
  reference: `Sharirasthana, chapter ${chapter}`,
  claimType: 'classical',
})

export const SUSHRUTA_SUTRA = (chapter: string): SourceAttribution => ({
  authority: 'Sushruta Samhita',
  reference: `Sutrasthana, chapter ${chapter}`,
  claimType: 'classical',
})

export const SUSHRUTA_SHARIRA = (chapter: string): SourceAttribution => ({
  authority: 'Sushruta Samhita',
  reference: `Sharirasthana, chapter ${chapter}`,
  claimType: 'classical',
})

export const ASHTANGA_SUTRA = (chapter: string): SourceAttribution => ({
  authority: 'Ashtanga Hridayam',
  reference: `Sutrasthana, chapter ${chapter}`,
  claimType: 'classical',
})

/** Where the classical texts genuinely differ. Requires a note (gate C5). */
export const CONTESTED = (
  authority: string,
  reference: string,
  note: string
): SourceAttribution => ({
  authority,
  reference,
  claimType: 'contested',
  note,
})

/**
 * A claim that is widely repeated in modern Ayurveda writing but is a modern
 * synthesis or simplification rather than a classical teaching. Marking it so is
 * the honest option, and it is always available.
 */
export const MODERN = (authority: string, reference: string): SourceAttribution => ({
  authority,
  reference,
  claimType: 'modern-interpretation',
})

/** Editorial framing by this app — used for scope, safety, and navigation text. */
export const EDITORIAL: SourceAttribution = {
  authority: 'UnderstandAyurveda editorial',
  reference: 'App framing and safety guidance',
  claimType: 'modern-interpretation',
}

// ---------------------------------------------------------------------------
// Named modern sources. See SOURCES.md for provenance and for why other
// documents in the source set were excluded.
//
// Discipline: cite these ONLY for claims the document actually makes. A
// citation to a real document that does not support the sentence attached to it
// is worse than no citation — it manufactures authority that a reader cannot
// easily check.
// ---------------------------------------------------------------------------

/**
 * US National Center for Complementary and Integrative Health (NIH).
 * A government health body — the strongest source available for safety and
 * evidence-quality framing, and notably careful in its own hedging ("are
 * thought to be", "Ayurvedic medicine holds the following beliefs").
 */
export const NCCIH = (section: string): SourceAttribution => ({
  authority: 'NCCIH, US National Institutes of Health',
  reference: `"Ayurvedic Medicine: An Introduction" — ${section}`,
  claimType: 'modern-interpretation',
})

/**
 * Vasant Lad, B.A.M.S., M.A.Sc. — Ayurvedic Institute. A named modern authority
 * widely used as an introductory reference in English.
 */
export const LAD = (section: string): SourceAttribution => ({
  authority: 'Vasant Lad, Ayurvedic Institute',
  reference: `"Ayurveda: A Brief Introduction and Guide" — ${section}`,
  claimType: 'modern-interpretation',
})

/** European Institute of Vedic Studies — practitioner training curriculum. */
export const EIVS = (section: string): SourceAttribution => ({
  authority: 'European Institute of Vedic Studies',
  reference: `Pancha Karma practitioner course manual — ${section}`,
  claimType: 'modern-interpretation',
})

/** Better Health Channel, Victoria State Government (Australia). */
export const BETTER_HEALTH = (section: string): SourceAttribution => ({
  authority: 'Better Health Channel, Victoria State Government',
  reference: `"Ayurveda" fact sheet — ${section}`,
  claimType: 'modern-interpretation',
})
