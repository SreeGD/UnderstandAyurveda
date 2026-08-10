import { Link } from 'react-router-dom'
import { lessonsInOrder } from '../content'
import { DoshaBlend } from '../components/DoshaBlend'
import { Disclaimer } from '../components/Disclaimer/Disclaimer'
import { useProfile } from '../hooks/useProfile'
import { useStoredDocument } from '../hooks/useStore'
import styles from './Home.module.css'

export function Home() {
  const doc = useStoredDocument()
  const { latestPrakriti, inProgress } = useProfile()

  const completedLessons = lessonsInOrder.filter((l) => doc.lessonProgress[l.id]?.completedAt).length
  const result = latestPrakriti?.result

  return (
    <div className="page">
      <section className={styles.hero}>
        <h1 className={styles.title}>Understand Ayurveda</h1>
        <p className={styles.lede}>
          Start from nothing. Learn the fundamentals, work out your own constitutional pattern, and
          turn it into ordinary changes to how you sleep, eat, and move.
        </p>
        <p className={styles.subLede}>
          No account, no server, no tracking. Everything stays in this browser.
        </p>
      </section>

      <Disclaimer variant="standing" />

      {result ? (
        <section className={`card ${styles.resultCard}`}>
          <h2>Your constitution</h2>
          <DoshaBlend percentages={result.percentages} dominant={result.dominant} />
          <div className={styles.cardActions}>
            <Link className="btn" to="/plan">
              See your plan
            </Link>
            <Link className="btn btn--secondary" to="/results">
              Full result
            </Link>
          </div>
        </section>
      ) : (
        <section className={`card ${styles.resultCard}`}>
          <h2>{inProgress ? 'You have an assessment in progress' : 'Find your pattern'}</h2>
          <p className="muted">
            {inProgress
              ? 'Pick up where you left off — your answers were saved on this device.'
              : 'About fifty questions, roughly ten minutes. You get all three percentages, a confidence rating, and the full arithmetic behind them.'}
          </p>
          <div className={styles.cardActions}>
            <Link className="btn" to={doc.preferences.hasSeenOnboarding ? '/assess' : '/onboarding'}>
              {inProgress ? 'Carry on' : 'Start'}
            </Link>
            <Link className="btn btn--secondary" to="/learn">
              Read the course first
            </Link>
          </div>
        </section>
      )}

      <section className={styles.paths}>
        <Link to="/learn" className={styles.pathCard}>
          <h3>Learn the fundamentals</h3>
          <p>
            Eleven short lessons — the elements, the doshas, the qualities, tastes, digestion, and
            the daily and seasonal routines.
          </p>
          <p className={styles.pathMeta}>
            {completedLessons} of {lessonsInOrder.length} complete
          </p>
        </Link>

        <Link to="/quiz" className={styles.pathCard}>
          <h3>Test yourself</h3>
          <p>
            Multiple choice, matching, and applied scenarios. Every answer explains why — including
            why the one you picked was wrong.
          </p>
          <p className={styles.pathMeta}>{doc.quizAttempts.length} questions answered</p>
        </Link>

        <Link to="/reference" className={styles.pathCard}>
          <h3>Look something up</h3>
          <p>
            A searchable reference of doshas, qualities, tastes, tissues, channels, seasons, and
            plants — spelled however you spell it.
          </p>
          <p className={styles.pathMeta}>Glossary and reference</p>
        </Link>

        <Link to="/data" className={styles.pathCard}>
          <h3>Your data</h3>
          <p>
            See exactly what is stored, export all of it as a readable file, or delete everything in
            one action.
          </p>
          <p className={styles.pathMeta}>Stored in this browser only</p>
        </Link>
      </section>
    </div>
  )
}
