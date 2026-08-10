import { Link, useParams } from "react-router-dom";
import { glossaryById, lessonById, referenceEntryById } from "../../content";
import { BlockRenderer, SourceCitation } from "../../components/BlockRenderer";
import { Callout, EmptyState } from "../../components/primitives";
import styles from "./Reference.module.css";

export function EntryDetail() {
  const { entryId } = useParams<{ entryId: string }>();
  const entry = entryId ? referenceEntryById.get(entryId) : undefined;

  if (!entry) {
    return (
      <div className="page">
        <EmptyState title="Entry not found">
          <Link className="btn" to="/reference">
            Back to the reference
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className={styles.breadcrumb}>
        <Link to="/reference">Reference</Link>
        <span aria-hidden="true"> / </span>
        <span>{entry.category}</span>
      </nav>

      <header className={styles.entryHeader}>
        <h1>
          {entry.name}
          {entry.devanagari && (
            <span className={styles.devanagari} lang="sa">
              {entry.devanagari}
            </span>
          )}
        </h1>
        {entry.pronunciation && (
          <p className={styles.pronunciation}>{entry.pronunciation}</p>
        )}
        <p className={styles.summary}>{entry.summary}</p>
      </header>

      {entry.category === "herb" && (
        <div className={styles.herbNotice}>
          <Callout tone="warning" title="Description only">
            <p>
              Nothing in this app tells you how much of a plant to have, in what
              form, or for what. Those are questions for a qualified
              practitioner who knows your situation, and for your doctor if you
              take anything prescribed.
            </p>
          </Callout>
        </div>
      )}

      <BlockRenderer blocks={entry.body} />

      <footer className={styles.entryFooter}>
        <SourceCitation source={entry.source} />

        {entry.linkedLessons.length > 0 && (
          <div className={styles.linkedSection}>
            <h2>Where this is taught</h2>
            <ul>
              {entry.linkedLessons.map((id) => {
                const lesson = lessonById.get(id);
                if (!lesson) return null;
                return (
                  <li key={id}>
                    <Link to={`/learn/${id}`}>{lesson.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {entry.relatedEntries.length > 0 && (
          <div className={styles.linkedSection}>
            <h2>Related</h2>
            <ul className={styles.relatedList}>
              {entry.relatedEntries.map((id) => {
                const related = referenceEntryById.get(id);
                if (!related) return null;
                return (
                  <li key={id}>
                    <Link to={`/reference/${id}`}>{related.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </footer>
    </div>
  );
}

export function GlossaryDetail() {
  const { termId } = useParams<{ termId: string }>();
  const term = termId ? glossaryById.get(termId) : undefined;

  if (!term) {
    return (
      <div className="page">
        <EmptyState title="Term not found">
          <Link className="btn" to="/reference">
            Back to the reference
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="page">
      <nav className={styles.breadcrumb}>
        <Link to="/reference">Reference</Link>
        <span aria-hidden="true"> / </span>
        <span>Glossary</span>
      </nav>

      <header className={styles.entryHeader}>
        <h1>
          {term.term}
          {term.devanagari && (
            <span className={styles.devanagari} lang="sa">
              {term.devanagari}
            </span>
          )}
        </h1>
        <p className={styles.pronunciation}>{term.pronunciation}</p>
      </header>

      <div className="prose">
        <p>{term.meaning}</p>
        <p className="muted">
          <em>{term.example}</em>
        </p>
        {term.aliases.length > 0 && (
          <p className="text-sm muted">
            Also written: {term.aliases.join(", ")}
          </p>
        )}
      </div>

      <footer className={styles.entryFooter}>
        <SourceCitation source={term.source} />

        {term.taughtIn.length > 0 && (
          <div className={styles.linkedSection}>
            <h2>Where this is taught</h2>
            <ul>
              {term.taughtIn.map((id) => {
                const lesson = lessonById.get(id);
                if (!lesson) return null;
                return (
                  <li key={id}>
                    <Link to={`/learn/${id}`}>{lesson.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {term.relatedTerms.length > 0 && (
          <div className={styles.linkedSection}>
            <h2>Related terms</h2>
            <ul className={styles.relatedList}>
              {term.relatedTerms.map((id) => {
                const related = glossaryById.get(id);
                if (!related) return null;
                return (
                  <li key={id}>
                    <Link to={`/reference/glossary/${id}`}>{related.term}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </footer>
    </div>
  );
}
