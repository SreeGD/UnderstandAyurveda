import { Fragment, useState, type ReactNode } from 'react'
import { glossaryById } from '../content'
import { TERM_MARKUP, type ContentBlock, type SourceAttribution } from '../content/schema/blocks'
import { Callout } from './primitives'
import styles from './BlockRenderer.module.css'

/* ---------------------------------------------------------------- TermLink */

/**
 * Resolves [[term-id|display]] markup to a glossary popover.
 *
 * Opens in place rather than navigating away, so the reader does not lose their
 * position in the lesson (US3 acceptance scenario 3).
 */
export function TermLink({ termId, display }: { termId: string; display?: string }) {
  const [open, setOpen] = useState(false)
  const term = glossaryById.get(termId)

  if (!term) {
    // Gate C2 makes this unreachable in shipped content; render plain text
    // rather than crashing if content is ever loaded another way.
    return <>{display ?? termId}</>
  }

  return (
    <span className={styles.termWrap}>
      <button
        type="button"
        className={styles.termButton}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {display ?? term.term}
      </button>
      {open && (
        <span className={styles.popover} role="note">
          <span className={styles.popTerm}>
            {term.term}
            <span className={styles.popPron}>{term.pronunciation}</span>
          </span>
          <span className={styles.popMeaning}>{term.meaning}</span>
          <span className={styles.popExample}>{term.example}</span>
          <button type="button" className={styles.popClose} onClick={() => setOpen(false)}>
            Close
          </button>
        </span>
      )}
    </span>
  )
}

/** Splits a string on term markup and renders the pieces. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(TERM_MARKUP)) {
    const [full, id, display] = match
    const index = match.index ?? 0

    if (index > lastIndex) parts.push(text.slice(lastIndex, index))
    parts.push(<TermLink key={`${id}-${index}`} termId={id!} display={display} />)
    lastIndex = index + full.length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  )
}

/* ---------------------------------------------------------- SourceCitation */

const CLAIM_LABELS: Record<SourceAttribution['claimType'], string> = {
  classical: 'Classical',
  contested: 'Sources differ',
  'modern-interpretation': 'Modern reading',
}

/**
 * Makes `modern-interpretation` and `contested` visible to the reader rather
 * than hidden in the data. A citation the reader cannot see does not help them
 * judge what they are being told (Principle III).
 */
export function SourceCitation({ source }: { source: SourceAttribution }) {
  return (
    <p className={styles.citation}>
      <span className={`${styles.claimTag} ${styles[source.claimType]}`}>
        {CLAIM_LABELS[source.claimType]}
      </span>
      <cite className={styles.citeText}>
        {source.authority}
        {source.reference ? `, ${source.reference}` : ''}
      </cite>
      {source.note && <span className={styles.citeNote}>{source.note}</span>}
    </p>
  )
}

/* ------------------------------------------------------------ BlockRenderer */

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className={styles.blocks}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case 'heading':
      return <h2 className={styles.heading}>{block.text}</h2>

    case 'paragraph':
      return (
        <div className={styles.claim}>
          <p>
            <RichText text={block.text} />
          </p>
          {block.source && <SourceCitation source={block.source} />}
        </div>
      )

    case 'list':
      return (
        <div className={styles.claim}>
          {block.ordered ? (
            <ol className={styles.list}>
              {block.items.map((item, i) => (
                <li key={i}>
                  <RichText text={item} />
                </li>
              ))}
            </ol>
          ) : (
            <ul className={styles.list}>
              {block.items.map((item, i) => (
                <li key={i}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          )}
          {block.source && <SourceCitation source={block.source} />}
        </div>
      )

    case 'termIntro': {
      const term = glossaryById.get(block.termId)
      if (!term) return null
      return (
        <aside className={styles.termIntro} aria-label={`Term: ${term.term}`}>
          <p className={styles.termIntroHead}>
            <strong>{term.term}</strong>
            <span className={styles.termIntroPron}>{term.pronunciation}</span>
          </p>
          <p className={styles.termIntroMeaning}>{term.meaning}</p>
          <p className={styles.termIntroExample}>{term.example}</p>
          {block.text && (
            <p>
              <RichText text={block.text} />
            </p>
          )}
        </aside>
      )
    }

    case 'callout':
      return (
        <Callout tone={block.tone} title={block.title}>
          <p>
            <RichText text={block.text} />
          </p>
          {block.source && <SourceCitation source={block.source} />}
        </Callout>
      )

    case 'example':
      return (
        <aside className={styles.example}>
          <p className={styles.exampleScenario}>{block.scenario}</p>
          <p>
            <RichText text={block.text} />
          </p>
          {block.source && <SourceCitation source={block.source} />}
        </aside>
      )

    case 'table':
      return (
        <div className={styles.claim}>
          <div className="scroll-x">
            <table className={styles.table}>
              {block.caption && <caption>{block.caption}</caption>}
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) =>
                      j === 0 ? (
                        <th key={j} scope="row">
                          <RichText text={cell} />
                        </th>
                      ) : (
                        <td key={j}>
                          <RichText text={cell} />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.source && <SourceCitation source={block.source} />}
        </div>
      )

    case 'sourceNote':
      return (
        <div className={styles.sourceNote}>
          {block.text && <p>{block.text}</p>}
          <SourceCitation source={block.source} />
        </div>
      )
  }
}
