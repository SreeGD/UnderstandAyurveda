import { useState } from 'react'
import { Callout } from '../../components/primitives'
import {
  STORED_CATEGORIES,
  buildExport,
  downloadExport,
  downloadRawPayload,
} from '../../storage/portability'
import { useStore, useStoredDocument, useStorageAvailability } from '../../hooks/useStore'
import type { RecordName } from '../../storage/schema'
import styles from './Data.module.css'

export function DataSettings() {
  const store = useStore()
  const doc = useStoredDocument()
  const { persistent } = useStorageAvailability()
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const corrupt = store.getCorruptRecords()

  const counts: Record<string, number> = {
    assessments: doc.assessments.length,
    lessonProgress: Object.keys(doc.lessonProgress).length,
    quizAttempts: doc.quizAttempts.length,
    reviewState: Object.keys(doc.reviewState).length,
    preferences: Object.keys(doc.preferences).length,
  }

  const handleExport = () => {
    downloadExport(buildExport(store))
    setMessage('Export downloaded. Nothing was sent anywhere — the file was built in your browser.')
  }

  const handleDeleteAll = () => {
    store.clearAll()
    setConfirming(false)
    setMessage('Everything has been deleted. This app is now exactly as it was on your first visit.')
  }

  return (
    <div className="page">
      <header className={styles.header}>
        <h1>Your data</h1>
        <p className="muted">
          Everything this app knows about you is stored in this browser and has never left this
          device. There is no account, no server, and no analytics of any kind.
        </p>
      </header>

      {!persistent && (
        <Callout tone="warning" title="Progress is not being saved">
          <p>
            Your browser is blocking storage — this often happens in private browsing, or when
            storage is full. The app works normally for this session, but nothing will be here when
            you come back.
          </p>
        </Callout>
      )}

      {message && (
        <div className={styles.message} role="status">
          {message}
        </div>
      )}

      <section className={styles.section}>
        <h2>What is stored</h2>
        <ul className={styles.categoryList}>
          {STORED_CATEGORIES.map((category) => (
            <li key={category.key} className={styles.category}>
              <div className={styles.categoryHead}>
                <span className={styles.categoryLabel}>{category.label}</span>
                <span className={styles.categoryCount}>
                  {counts[category.key] ?? 0} record{counts[category.key] === 1 ? '' : 's'}
                </span>
              </div>
              <p className={styles.categoryDesc}>{category.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {corrupt.length > 0 && (
        <section className={styles.section}>
          <Callout tone="warning" title="Some stored data could not be read">
            <p>
              These records were saved in a format this version of the app does not understand. They
              have been set aside rather than deleted, and everything else has loaded normally.
            </p>
            <ul>
              {corrupt.map((name) => (
                <li key={name}>
                  <code>{name}</code>{' '}
                  <button
                    type="button"
                    className={styles.inlineButton}
                    onClick={() => {
                      if (name === 'root') {
                        store.clearAll()
                        setMessage('The unreadable data was cleared.')
                        return
                      }
                      store.clearRecord(name as RecordName)
                      setMessage(`Reset "${name}". Everything else was left alone.`)
                    }}
                  >
                    reset just this
                  </button>
                </li>
              ))}
            </ul>
            <p>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  const ok = downloadRawPayload(store)
                  setMessage(
                    ok
                      ? 'Downloaded the raw stored data, exactly as it is.'
                      : 'There was nothing stored to download.'
                  )
                }}
              >
                Download the raw data first
              </button>
            </p>
          </Callout>
        </section>
      )}

      <section className={styles.section}>
        <h2>Take it with you</h2>
        <p className="muted">
          A readable JSON file containing everything above — including the actual question wording
          and your answers, so it means something without this app.
        </p>
        <button type="button" className="btn" onClick={handleExport}>
          Export everything
        </button>
      </section>

      <section className={styles.section}>
        <h2>Delete everything</h2>
        <p className="muted">
          Removes all of it from this browser, permanently. There is no copy anywhere else, so this
          cannot be undone.
        </p>

        {confirming ? (
          <div className={styles.confirmBox}>
            <p>
              <strong>Delete all your data?</strong> Your assessment results, lesson progress, and
              quiz history will be gone.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={handleDeleteAll}>
                Yes, delete everything
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn btn--secondary" onClick={() => setConfirming(true)}>
            Delete all my data
          </button>
        )}
      </section>
    </div>
  )
}
