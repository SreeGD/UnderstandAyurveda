import { Link } from 'react-router-dom'
import { EmptyState } from '../components/primitives'

export function NotFound() {
  return (
    <div className="page">
      <EmptyState title="That page does not exist">
        <p>The link may be out of date, or the address may have a typo in it.</p>
        <div style={{ display: 'flex', gap: 'var(--s-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn" to="/">
            Go home
          </Link>
          <Link className="btn btn--secondary" to="/reference">
            Search the reference
          </Link>
        </div>
      </EmptyState>
    </div>
  )
}
