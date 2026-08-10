import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/primitives'
import styles from './Home.module.css'

/**
 * Honest note about offline behaviour.
 *
 * After a first successful load the service worker has precached everything, so
 * the app is fully functional with no network — there is nothing it needs to
 * fetch. Before that first load, however, nothing is cached and no amount of
 * application code can help; the browser's own offline page is what appears.
 * This route exists to explain the situation rather than to pretend otherwise.
 */
export function Offline() {
  return (
    <div className="page">
      <EmptyState title="You are offline">
        <p>
          That is fine — this app does not need a network connection. Everything you have already
          loaded works exactly as normal, and your data is on this device anyway.
        </p>
        <p className="muted">
          If a page looks wrong, it is because it had not been visited before the connection
          dropped. It will load next time you are online, and then be available offline too.
        </p>
        <Link className="btn" to="/">
          Go home
        </Link>
      </EmptyState>
    </div>
  )
}

/** Small persistent indicator, so going offline never looks like a fault. */
export function OfflineIndicator() {
  const [offline, setOffline] = useState(() => !navigator.onLine)

  useEffect(() => {
    const goOffline = () => setOffline(true)
    const goOnline = () => setOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (!offline) return null

  return (
    <div className={styles.offlineBanner} role="status">
      You are offline — everything still works. Nothing here needs a connection.
    </div>
  )
}
