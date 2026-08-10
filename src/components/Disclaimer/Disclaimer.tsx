import { DISCLAIMER_TEXT } from '../../content/onboarding'
import styles from './Disclaimer.module.css'

interface Props {
  /** `standing` for persistent placement; `inline` within a flow. */
  variant?: 'standing' | 'inline'
}

/**
 * Non-dismissible by construction. There is no `onDismiss`, no `collapsible`
 * prop, and no way to render this as an icon — constitution Principle II
 * requires it present on every assessment screen, every result view, and every
 * generated plan, including in print (FR-002, SC-008).
 *
 * If you are here to make it smaller, that is the requirement you are editing.
 */
export function Disclaimer({ variant = 'inline' }: Props) {
  return (
    <aside
      className={`${styles.disclaimer} ${variant === 'standing' ? styles.standing : ''}`}
      aria-label="Important notice"
      data-testid="disclaimer"
    >
      <span className={styles.icon} aria-hidden="true">
        ⚕
      </span>
      <p className={styles.text}>{DISCLAIMER_TEXT}</p>
    </aside>
  )
}
