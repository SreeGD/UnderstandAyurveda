import { z } from 'zod'
import { contentBlockSchema, sourceAttributionSchema } from './blocks'
import { idSchema } from './common'

export const referenceCategorySchema = z.enum([
  'dosha',
  'guna',
  'taste',
  'herb',
  'dhatu',
  'srota',
  'season',
])
export type ReferenceCategory = z.infer<typeof referenceCategorySchema>

export const referenceEntrySchema = z
  .object({
    id: idSchema,
    category: referenceCategorySchema,
    name: z.string().min(1),
    devanagari: z.string().optional(),
    aliases: z.array(z.string().min(1)).default([]),
    pronunciation: z.string().optional(),
    /** One line of plain English. */
    summary: z.string().min(1),
    body: z.array(contentBlockSchema).min(1),
    relatedEntries: z.array(idSchema).default([]),
    linkedLessons: z.array(idSchema).default([]),
    source: sourceAttributionSchema,
    /**
     * Required on herb entries. Herb entries are also the one place the
     * medical-safety lint admits no allowLint escape — dosing guidance for herbs
     * is the single most likely way this app could cause real harm (FR-036).
     */
    practitionerNotice: z.boolean().optional(),
  })
  .refine((e) => e.category !== 'herb' || e.practitionerNotice === true, {
    message: 'herb entries must set practitionerNotice: true (FR-036)',
    path: ['practitionerNotice'],
  })

export type ReferenceEntry = z.infer<typeof referenceEntrySchema>
