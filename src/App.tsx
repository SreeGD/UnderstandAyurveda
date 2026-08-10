import { NavLink, Route, Routes } from 'react-router-dom'
import { Home } from './routes/Home'
import { Onboarding } from './routes/onboarding/Onboarding'
import { PrakritiAssessment } from './routes/assess/PrakritiAssessment'
import { VikritiAssessment } from './routes/assess/VikritiAssessment'
import { PrakritiResult } from './routes/results/PrakritiResult'
import { Comparison } from './routes/results/Comparison'
import { History } from './routes/results/History'
import { Plan } from './routes/plan/Plan'
import { CourseIndex } from './routes/learn/CourseIndex'
import { LessonReader } from './routes/learn/LessonReader'
import { LessonQuiz } from './routes/quiz/LessonQuiz'
import { QuizDone } from './routes/quiz/QuizDone'
import { Progress } from './routes/quiz/Progress'
import { ReviewSession } from './routes/quiz/ReviewSession'
import { ReferenceIndex } from './routes/reference/ReferenceIndex'
import { EntryDetail, GlossaryDetail } from './routes/reference/EntryDetail'
import { DataSettings } from './routes/data/DataSettings'
import { NotFound } from './routes/NotFound'
import { Offline, OfflineIndicator } from './routes/Offline'
import { useStorageAvailability } from './hooks/useStore'
import styles from './App.module.css'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/quiz', label: 'Practise' },
  { to: '/assess', label: 'Assess' },
  { to: '/plan', label: 'Plan' },
  { to: '/reference', label: 'Reference' },
  { to: '/data', label: 'Your data' },
]

export function App() {
  const { persistent } = useStorageAvailability()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <OfflineIndicator />

      {/* FR-044: the app stays usable, but says plainly that nothing is saved. */}
      {!persistent && (
        <div className={styles.storageBanner} role="status">
          Your browser is blocking storage, so nothing will be saved. Everything still works for this
          session.
        </div>
      )}

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <NavLink to="/" className={styles.brand}>
            Understand<span className={styles.brandAccent}>Ayurveda</span>
          </NavLink>

          <nav aria-label="Main">
            <ul className={styles.nav}>
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navActive : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/assess" element={<PrakritiAssessment />} />
          <Route path="/assess/vikriti" element={<VikritiAssessment />} />

          <Route path="/results" element={<PrakritiResult />} />
          <Route path="/results/compare" element={<Comparison />} />
          <Route path="/results/history" element={<History />} />

          <Route path="/plan" element={<Plan />} />

          <Route path="/learn" element={<CourseIndex />} />
          <Route path="/learn/:lessonId" element={<LessonReader />} />

          <Route path="/quiz" element={<Progress />} />
          <Route path="/quiz/:quizId" element={<LessonQuiz />} />
          <Route path="/quiz/:quizId/done" element={<QuizDone />} />
          <Route path="/review" element={<ReviewSession />} />

          <Route path="/reference" element={<ReferenceIndex />} />
          <Route path="/reference/glossary/:termId" element={<GlossaryDetail />} />
          <Route path="/reference/:entryId" element={<EntryDetail />} />

          <Route path="/data" element={<DataSettings />} />
          <Route path="/offline" element={<Offline />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>
            Educational content, not medical advice. Sourced and attributed, but not certified by a
            credentialed Ayurvedic practitioner.
          </p>
          <p className={styles.footerPrivacy}>
            No account · no server · no analytics · everything stays in your browser
          </p>
        </div>
      </footer>
    </>
  )
}
