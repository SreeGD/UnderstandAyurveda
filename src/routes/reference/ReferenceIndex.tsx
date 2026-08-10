import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { glossary, referenceEntries } from '../../content'
import { REFERENCE_CATEGORIES } from '../../content/reference'
import { LiveRegion } from '../../components/primitives'
import { buildIndex, search, type Searchable } from '../../domain/search'
import styles from './Reference.module.css'

/**
 * One index over both the glossary and the reference corpus, built once at
 * module load. A few hundred entries is small enough that a hand-rolled index is
 * instant and fully controllable — and the hard part here is transliteration,
 * which is normalisation rather than fuzzy matching (research.md R7).
 */
const searchables: Searchable[] = [
  ...referenceEntries.map((e) => ({
    id: e.id,
    kind: 'reference' as const,
    category: e.category,
    name: e.name,
    aliases: e.aliases,
    meaning: e.summary,
    body: e.body
      .map((b) => ('text' in b && typeof b.text === 'string' ? b.text : ''))
      .join(' '),
  })),
  ...glossary.map((t) => ({
    id: t.id,
    kind: 'glossary' as const,
    category: 'glossary',
    name: t.term,
    aliases: t.aliases,
    meaning: t.meaning,
    body: t.example,
  })),
]

const index = buildIndex(searchables)

export function ReferenceIndex() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const outcome = useMemo(() => (query.trim() ? search(index, query) : null), [query])

  const browsing = useMemo(() => {
    if (!category) return []
    if (category === 'glossary') {
      return glossary.map((t) => ({ id: t.id, name: t.term, summary: t.meaning, kind: 'glossary' }))
    }
    return referenceEntries
      .filter((e) => e.category === category)
      .map((e) => ({ id: e.id, name: e.name, summary: e.summary, kind: 'reference' }))
  }, [category])

  const linkFor = (kind: string, id: string) =>
    kind === 'glossary' ? `/reference/glossary/${id}` : `/reference/${id}`

  return (
    <div className="page">
      <header className={styles.header}>
        <h1>Look it up</h1>
        <p className="muted">
          Search by Sanskrit name, English meaning, or however you happen to spell it — doṣa, dosa,
          and dosha all find the same entry.
        </p>
      </header>

      <div className={styles.searchRow}>
        <label htmlFor="reference-search" className="visually-hidden">
          Search the reference
        </label>
        <input
          id="reference-search"
          type="search"
          className={styles.search}
          placeholder="Try: agni, digestive fire, vata…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCategory(null)
          }}
        />
      </div>

      <LiveRegion
        message={
          outcome
            ? outcome.results.length > 0
              ? `${outcome.results.length} result${outcome.results.length === 1 ? '' : 's'}`
              : 'No matches'
            : ''
        }
      />

      {outcome && (
        <section className={styles.results}>
          {outcome.results.length > 0 ? (
            <ul className={styles.entryList}>
              {outcome.results.map(({ entry }) => (
                <li key={`${entry.kind}-${entry.id}`}>
                  <Link className={styles.entryCard} to={linkFor(entry.kind, entry.id)}>
                    <span className={styles.entryName}>{entry.name}</span>
                    <span className={styles.entryCategory}>{entry.category}</span>
                    <span className={styles.entrySummary}>{entry.meaning}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noResults}>
              <p>
                Nothing matched <strong>{query}</strong>.
              </p>
              {outcome.suggestions.length > 0 && (
                <p>
                  Did you mean{' '}
                  {outcome.suggestions.map((s, i) => (
                    <span key={s.id}>
                      {i > 0 && ', '}
                      <Link to={linkFor(s.kind, s.id)}>{s.name}</Link>
                    </span>
                  ))}
                  ?
                </p>
              )}
              <p className="muted">Or browse by category below.</p>
            </div>
          )}
        </section>
      )}

      <section className={styles.browse}>
        <h2>Browse</h2>
        <div className={styles.categoryRow}>
          {REFERENCE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.categoryButton} ${category === c.id ? styles.categoryActive : ''}`}
              onClick={() => setCategory(category === c.id ? null : c.id)}
              aria-pressed={category === c.id}
            >
              <span className={styles.categoryLabel}>{c.label}</span>
              <span className={styles.categoryDesc}>{c.description}</span>
            </button>
          ))}
          <button
            type="button"
            className={`${styles.categoryButton} ${category === 'glossary' ? styles.categoryActive : ''}`}
            onClick={() => setCategory(category === 'glossary' ? null : 'glossary')}
            aria-pressed={category === 'glossary'}
          >
            <span className={styles.categoryLabel}>Glossary</span>
            <span className={styles.categoryDesc}>Every term, with pronunciation</span>
          </button>
        </div>

        {browsing.length > 0 && (
          <ul className={styles.entryList}>
            {browsing.map((entry) => (
              <li key={entry.id}>
                <Link className={styles.entryCard} to={linkFor(entry.kind, entry.id)}>
                  <span className={styles.entryName}>{entry.name}</span>
                  <span className={styles.entrySummary}>{entry.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
