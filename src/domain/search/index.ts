import { levenshtein, normalise, tokens } from './normalise'

export type SearchKind = 'glossary' | 'reference'

export interface Searchable {
  id: string
  kind: SearchKind
  category: string
  name: string
  aliases: string[]
  meaning: string
  body?: string
}

interface IndexedEntry {
  entry: Searchable
  nName: string
  nAliases: string[]
  nMeaning: string
  nBody: string
  meaningTokens: string[]
}

export interface SearchResult {
  entry: Searchable
  score: number
  matchedOn: 'name' | 'alias' | 'name-prefix' | 'meaning' | 'body'
}

export interface SearchOutcome {
  results: SearchResult[]
  /** Populated only when `results` is empty (FR-038). */
  suggestions: Searchable[]
}

export function buildIndex(entries: Searchable[]): IndexedEntry[] {
  return entries.map((entry) => ({
    entry,
    nName: normalise(entry.name),
    nAliases: entry.aliases.map(normalise),
    nMeaning: normalise(entry.meaning),
    nBody: normalise(entry.body ?? ''),
    meaningTokens: tokens(entry.meaning),
  }))
}

const SCORE = {
  exactName: 1000,
  exactAlias: 900,
  namePrefix: 700,
  aliasPrefix: 600,
  nameContains: 500,
  meaningTokenPrefix: 300,
  meaningContains: 200,
  bodyContains: 100,
} as const

export function search(index: IndexedEntry[], rawQuery: string, limit = 25): SearchOutcome {
  const query = normalise(rawQuery)
  if (query.length === 0) return { results: [], suggestions: [] }

  const results: SearchResult[] = []

  for (const item of index) {
    let score = 0
    let matchedOn: SearchResult['matchedOn'] = 'body'

    if (item.nName === query) {
      score = SCORE.exactName
      matchedOn = 'name'
    } else if (item.nAliases.includes(query)) {
      score = SCORE.exactAlias
      matchedOn = 'alias'
    } else if (item.nName.startsWith(query)) {
      score = SCORE.namePrefix
      matchedOn = 'name-prefix'
    } else if (item.nAliases.some((a) => a.startsWith(query))) {
      score = SCORE.aliasPrefix
      matchedOn = 'alias'
    } else if (item.nName.includes(query)) {
      score = SCORE.nameContains
      matchedOn = 'name-prefix'
    } else if (item.meaningTokens.some((t) => t.startsWith(query))) {
      score = SCORE.meaningTokenPrefix
      matchedOn = 'meaning'
    } else if (item.nMeaning.includes(query)) {
      score = SCORE.meaningContains
      matchedOn = 'meaning'
    } else if (item.nBody.includes(query)) {
      score = SCORE.bodyContains
      matchedOn = 'body'
    }

    if (score > 0) {
      // Shorter names rank slightly higher for equal match quality, so "Vata"
      // beats "Vata-pacifying routine" on the query "vata".
      results.push({ entry: item.entry, score: score - item.nName.length * 0.1, matchedOn })
    }
  }

  results.sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))

  if (results.length > 0) {
    return { results: results.slice(0, limit), suggestions: [] }
  }

  // Nothing matched. Offer close names rather than an empty screen (FR-038).
  const suggestions = index
    .map((item) => ({
      entry: item.entry,
      distance: Math.min(
        levenshtein(query, item.nName),
        ...item.nAliases.map((a) => levenshtein(query, a))
      ),
    }))
    .filter((s) => s.distance <= 2)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .map((s) => s.entry)

  return { results: [], suggestions }
}

export { normalise, tokens, levenshtein } from './normalise'
