import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './primitives.module.css'

/**
 * Polite live region. Quiz correctness and assessment progress are announced
 * here rather than being conveyed by colour or position alone (FR-049).
 */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}

export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number
  max: number
  label: string
}) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className={styles.progressWrap}>
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.progressLabel}>{label}</p>
    </div>
  )
}

export function Callout({
  tone = 'note',
  title,
  children,
}: {
  tone?: 'note' | 'warning' | 'misconception'
  title?: string
  children: ReactNode
}) {
  const toneLabel =
    tone === 'misconception' ? 'Common misconception' : tone === 'warning' ? 'Important' : 'Note'

  return (
    <aside className={`${styles.callout} ${styles[tone]}`}>
      <p className={styles.calloutLabel}>{title ?? toneLabel}</p>
      <div className={styles.calloutBody}>{children}</div>
    </aside>
  )
}

/** Moves focus to its child on mount — used when advancing between questions. */
export function FocusOnMount({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heading = ref.current?.querySelector<HTMLElement>('[data-focus-target]')
    heading?.focus()
  }, [])

  return <div ref={ref}>{children}</div>
}

/** Disclosure with a real <button>, so it is keyboard-operable by default. */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={styles.disclosure}>
      <button
        type="button"
        className={styles.disclosureButton}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span aria-hidden="true" className={styles.chevron}>
          {open ? '▾' : '▸'}
        </span>
        {summary}
      </button>
      {open && <div className={styles.disclosureBody}>{children}</div>}
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.empty}>
      <h2>{title}</h2>
      <div className="stack">{children}</div>
    </div>
  )
}
