import type { ReferenceEntry } from '../schema/reference'
import { dhatuEntries, srotasEntries } from './body'
import { doshaEntries } from './doshas'
import { gunaEntries } from './gunas'
import { herbEntries } from './herbs'
import { seasonEntries } from './seasons'
import { tasteEntries } from './tastes'

export const referenceEntries: ReferenceEntry[] = [
  ...doshaEntries,
  ...gunaEntries,
  ...tasteEntries,
  ...herbEntries,
  ...dhatuEntries,
  ...srotasEntries,
  ...seasonEntries,
]

export const REFERENCE_CATEGORIES = [
  { id: 'dosha', label: 'Doshas', description: 'The three functional patterns' },
  { id: 'guna', label: 'Qualities', description: 'The twenty gunas, in ten opposing pairs' },
  { id: 'taste', label: 'Tastes', description: 'The six tastes and what they do' },
  { id: 'herb', label: 'Plants', description: 'Described only — no dosing anywhere' },
  { id: 'dhatu', label: 'Tissues', description: 'The seven dhatus, in sequence' },
  { id: 'srota', label: 'Channels', description: 'The srotas and how flow goes wrong' },
  { id: 'season', label: 'Seasons', description: 'Seasonal qualities and direction' },
] as const
