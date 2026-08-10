import { z } from 'zod'

/**
 * How a claim relates to its source.
 *
 * `modern-interpretation` exists as a first-class option on purpose. Traditional
 * knowledge content invites confident invention, and a citation field that is
 * merely *present* invites fabricated citations. Making the honest answer
 * available — "this is a popular modern reading, not a classical teaching" —
 * is what stops an author reaching for a plausible-sounding chapter number.
 * See research.md R11.
 */
export const claimTypeSchema = z.enum(['classical', 'contested', 'modern-interpretation'])
export type ClaimType = z.infer<typeof claimTypeSchema>

export const sourceAttributionSchema = z
  .object({
    /** Classical text or named modern authority. */
    authority: z.string().min(1),
    /** Locatable — chapter/verse where classical. */
    reference: z.string().min(1),
    claimType: claimTypeSchema,
    /** Required when contested: states how the sources differ (gate C5). */
    note: z.string().min(1).optional(),
  })
  .refine((s) => s.claimType !== 'contested' || Boolean(s.note), {
    message: 'claimType "contested" requires a note explaining how the sources differ (gate C5)',
    path: ['note'],
  })
export type SourceAttribution = z.infer<typeof sourceAttributionSchema>

/**
 * Escape hatch for the medical-safety lint (gate C8). Visible in the content
 * file, reported by the validator, and reviewable. Herb entries admit no escape
 * hatch at all — see the lint implementation.
 */
export const allowLintSchema = z.object({
  pattern: z.string().min(1),
  justification: z.string().min(20, 'justify the exception in a sentence, not a word'),
  reviewedBy: z.string().min(1),
})
export type AllowLint = z.infer<typeof allowLintSchema>

const claimFields = {
  /** Attribution for this block's claim (gate C4). */
  source: sourceAttributionSchema.optional(),
  /**
   * Marks navigational or framing prose ("In this lesson you'll see…") that
   * makes no claim about Ayurveda and therefore needs no citation. An explicit,
   * reviewable opt-out rather than a silent heuristic.
   */
  framing: z.boolean().optional(),
  allowLint: allowLintSchema.optional(),
}

export const headingBlockSchema = z.object({
  kind: z.literal('heading'),
  text: z.string().min(1),
})

export const paragraphBlockSchema = z.object({
  kind: z.literal('paragraph'),
  /** May contain [[term-id]] or [[term-id|display text]] markup. */
  text: z.string().min(1),
  ...claimFields,
})

export const listBlockSchema = z.object({
  kind: z.literal('list'),
  ordered: z.boolean().default(false),
  items: z.array(z.string().min(1)).min(1),
  ...claimFields,
})

/**
 * The block that satisfies Principle I. Renders the term's plain-English
 * meaning, pronunciation, and everyday example inline, on first use.
 */
export const termIntroBlockSchema = z.object({
  kind: z.literal('termIntro'),
  termId: z.string().min(1),
  /** Optional extra framing beyond the glossary entry itself. */
  text: z.string().optional(),
})

export const calloutBlockSchema = z.object({
  kind: z.literal('callout'),
  tone: z.enum(['note', 'warning', 'misconception']),
  title: z.string().optional(),
  text: z.string().min(1),
  ...claimFields,
})

export const exampleBlockSchema = z.object({
  kind: z.literal('example'),
  scenario: z.string().min(1),
  text: z.string().min(1),
  ...claimFields,
})

export const tableBlockSchema = z.object({
  kind: z.literal('table'),
  caption: z.string().optional(),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())).min(1),
  ...claimFields,
})

/**
 * Explicit attribution anchor. Covers subsequent blocks in the same section
 * until the next heading (gate C4 section inheritance).
 */
export const sourceNoteBlockSchema = z.object({
  kind: z.literal('sourceNote'),
  source: sourceAttributionSchema,
  text: z.string().optional(),
})

export const contentBlockSchema = z.discriminatedUnion('kind', [
  headingBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  termIntroBlockSchema,
  calloutBlockSchema,
  exampleBlockSchema,
  tableBlockSchema,
  sourceNoteBlockSchema,
])
export type ContentBlock = z.infer<typeof contentBlockSchema>

/** Block kinds that can carry a substantive claim and therefore need attribution. */
export const CLAIM_BEARING_KINDS = ['paragraph', 'list', 'callout', 'example', 'table'] as const

/** Matches [[term-id]] and [[term-id|display text]]. */
export const TERM_MARKUP = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g

/** Every term id referenced by inline markup in a block. */
export function extractTermRefs(block: ContentBlock): string[] {
  const texts: string[] = []
  if ('text' in block && typeof block.text === 'string') texts.push(block.text)
  if (block.kind === 'list') texts.push(...block.items)
  if (block.kind === 'example') texts.push(block.scenario)
  if (block.kind === 'table') texts.push(...block.headers, ...block.rows.flat())
  if (block.kind === 'termIntro') return [block.termId]

  const found: string[] = []
  for (const text of texts) {
    for (const match of text.matchAll(TERM_MARKUP)) {
      if (match[1]) found.push(match[1])
    }
  }
  return found
}

/** Every user-visible string in a block — the surface the safety lint scans. */
export function extractStrings(block: ContentBlock): string[] {
  const out: string[] = []
  if ('text' in block && typeof block.text === 'string') out.push(block.text)
  if ('title' in block && typeof block.title === 'string') out.push(block.title)
  if ('caption' in block && typeof block.caption === 'string') out.push(block.caption)
  if (block.kind === 'list') out.push(...block.items)
  if (block.kind === 'example') out.push(block.scenario)
  if (block.kind === 'table') out.push(...block.headers, ...block.rows.flat())
  return out
}
