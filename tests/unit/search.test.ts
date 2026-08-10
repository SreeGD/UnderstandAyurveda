import { describe, expect, it } from 'vitest'
import { buildIndex, normalise, search, type Searchable } from '../../src/domain/search'

const entries: Searchable[] = [
  {
    id: 'dosha',
    kind: 'glossary',
    category: 'core',
    name: 'Dosha',
    aliases: ['dosa', 'doṣa', 'dosham'],
    meaning: 'One of three functional patterns describing how a body and mind behave.',
  },
  {
    id: 'agni',
    kind: 'glossary',
    category: 'core',
    name: 'Agni',
    aliases: ['agnee', 'digestive fire'],
    meaning: 'Digestive fire — the capacity to break down and absorb what you take in.',
  },
  {
    id: 'vata',
    kind: 'reference',
    category: 'dosha',
    name: 'Vata',
    aliases: ['vatha'],
    meaning: 'The dosha of movement.',
    body: 'Associated with air and space, dryness and mobility.',
  },
  {
    id: 'vata-pacifying-routine',
    kind: 'reference',
    category: 'season',
    name: 'Vata-pacifying routine',
    aliases: [],
    meaning: 'A daily shape suited to a Vata-forward pattern.',
  },
]

const index = buildIndex(entries)

describe('normalisation', () => {
  it('strips diacritics so transliterations collapse together', () => {
    expect(normalise('doṣa')).toBe('dosa')
    expect(normalise('Ṛtucharyā')).toBe('rtucharya')
    expect(normalise('Pañcha')).toBe('pancha')
  })

  it('collapses punctuation and whitespace', () => {
    expect(normalise('  Vata-pacifying   routine! ')).toBe('vata pacifying routine')
  })
})

describe('transliteration tolerance — the point of the whole index', () => {
  it.each(['dosha', 'dosa', 'doṣa', 'Dosha', 'DOSHA', 'dosham'])(
    '"%s" finds the same entry',
    (query) => {
      const { results } = search(index, query)
      expect(results[0]?.entry.id).toBe('dosha')
    }
  )
})

describe('ranking', () => {
  it('finds an entry by its English meaning', () => {
    const { results } = search(index, 'digestive fire')
    expect(results[0]?.entry.id).toBe('agni')
  })

  it('ranks the exact name above a longer name containing it', () => {
    const { results } = search(index, 'vata')
    expect(results[0]?.entry.id).toBe('vata')
    expect(results.map((r) => r.entry.id)).toContain('vata-pacifying-routine')
  })

  it('matches body text at lowest priority', () => {
    const { results } = search(index, 'mobility')
    expect(results[0]?.entry.id).toBe('vata')
    expect(results[0]?.matchedOn).toBe('body')
  })

  it('returns nothing for an empty query', () => {
    expect(search(index, '   ').results).toEqual([])
  })
})

describe('zero results offer a way forward, never a dead end (FR-038)', () => {
  it('suggests close matches for a near-miss', () => {
    const { results, suggestions } = search(index, 'agnee')
    // 'agnee' is an alias, so it should actually match.
    expect(results.length).toBeGreaterThan(0)

    const typo = search(index, 'agno')
    expect(typo.results).toEqual([])
    expect(typo.suggestions.map((s) => s.id)).toContain('agni')
    expect(suggestions).toEqual([])
  })

  it('returns no suggestions for genuinely unrelated input', () => {
    const { results, suggestions } = search(index, 'qqqqzzzz')
    expect(results).toEqual([])
    expect(suggestions).toEqual([])
  })

  it('handles a typo in a diacritic term', () => {
    const { suggestions } = search(index, 'dosk')
    expect(suggestions.map((s) => s.id)).toContain('dosha')
  })
})
