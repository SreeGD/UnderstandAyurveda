import type { GlossaryTerm } from '../schema/glossary'
import { coreTerms } from './core'
import { elementTerms } from './elements'
import { practiceTerms } from './practice'
import { qualityTerms } from './qualities'

export const glossary: GlossaryTerm[] = [
  ...coreTerms,
  ...elementTerms,
  ...qualityTerms,
  ...practiceTerms,
]
