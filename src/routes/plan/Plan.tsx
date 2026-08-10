import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { planNotices, recommendationRules } from '../../content/recommendations'
import { scoringConfig } from '../../content/config'
import { SEASONS, type Season } from '../../content/schema/common'
import { ELEVATION_EXPLANATIONS } from '../../content/assessment'
import { DoshaBlend } from '../../components/DoshaBlend'
import { Disclaimer } from '../../components/Disclaimer/Disclaimer'
import { SourceCitation } from '../../components/BlockRenderer'
import { Callout, EmptyState } from '../../components/primitives'
import { compareProfiles, primaryElevation } from '../../domain/comparison/compare'
import { selectRecommendations } from '../../domain/recommendations/select'
import { DOSHA_LABELS } from '../../domain/scoring'
import { useProfile } from '../../hooks/useProfile'
import { useStore, useStoredDocument } from '../../hooks/useStore'
import styles from './Plan.module.css'

const AREA_LABELS = {
  routine: 'Daily routine and sleep',
  meals: 'Meals and food qualities',
  movement: 'Movement and exercise',
  seasonal: 'Seasonal adjustment',
  'self-care': 'Self-care',
} as const

const AREA_INTRO = {
  routine: 'When you wake, when you eat, when you sleep.',
  meals: 'Qualities and tastes to favour or reduce — not a diet, and nothing is forbidden.',
  movement: 'What kind of movement suits this pattern, and how hard.',
  seasonal: 'What to change as the weather does.',
  'self-care': 'Small practices, done regularly.',
} as const

function defaultSeason(): Season {
  const month = new Date().getMonth()
  if (month <= 1 || month === 11) return 'winter'
  if (month <= 4) return 'spring'
  if (month <= 7) return 'summer'
  return 'autumn'
}

export function Plan() {
  const { latestPrakriti, latestVikriti } = useProfile()
  const doc = useStoredDocument()
  const store = useStore()

  const season = doc.preferences.season ?? defaultSeason()

  const comparison = useMemo(() => {
    if (!latestPrakriti?.result || !latestVikriti?.result) return null
    return compareProfiles(latestPrakriti.result, latestVikriti.result, scoringConfig)
  }, [latestPrakriti, latestVikriti])

  const elevated = comparison ? primaryElevation(comparison) : null

  const plan = useMemo(() => {
    if (!latestPrakriti?.result) return null
    return selectRecommendations(latestPrakriti.result, season, recommendationRules, {
      elevatedDosha: elevated,
    })
  }, [latestPrakriti, season, elevated])

  if (!latestPrakriti?.result || !plan) {
    return (
      <div className="page">
        <EmptyState title="Nothing to plan from yet">
          <p>
            Your plan is built from your constitution, so the assessment comes first. It takes about
            ten minutes.
          </p>
          <Link className="btn" to="/assess">
            Start the assessment
          </Link>
        </EmptyState>
      </div>
    )
  }

  const profile = latestPrakriti.result

  return (
    <div className={`page ${styles.plan}`}>
      <Disclaimer variant="standing" />

      <header className={styles.header}>
        <h1>What to actually do</h1>
        <p className="muted">
          Generated {new Date().toLocaleDateString()} from your constitution
          {elevated ? `, adjusted for your current state` : ''}.
        </p>
      </header>

      <section className={`card ${styles.provenance}`}>
        <DoshaBlend
          percentages={profile.percentages}
          dominant={profile.dominant}
          label="The profile this comes from"
        />
        {elevated && (
          <div className={styles.elevationNote}>
            <p>
              <strong>{ELEVATION_EXPLANATIONS[elevated].title}</strong>
            </p>
            <p>{ELEVATION_EXPLANATIONS[elevated].temporary}</p>
            <p className="text-sm muted">
              Guidance below is aimed at settling {DOSHA_LABELS[elevated]} rather than at your
              baseline pattern.
            </p>
          </div>
        )}
      </section>

      <div className={styles.controls}>
        <label className={styles.seasonLabel} htmlFor="season">
          Current season where you are
        </label>
        <select
          id="season"
          className={styles.select}
          value={season}
          onChange={(e) =>
            store.update((draft) => {
              draft.preferences.season = e.target.value as Season
            })
          }
        >
          {SEASONS.map((s) => (
            <option key={s} value={s}>
              {s[0]!.toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <button type="button" className="btn btn--secondary" onClick={() => window.print()}>
          Print or save as PDF
        </button>
      </div>

      <Callout tone="note" title="Pick one or two, not all of them">
        <p>
          There is more here than anyone should attempt at once. Ayurveda is a system of habits, and
          habits change slowly or not at all. Choose the one that looks most doable and leave the
          rest for later.
        </p>
      </Callout>

      {plan.sections.map((section) => (
        <section key={section.area} className={styles.section}>
          <h2>{AREA_LABELS[section.area]}</h2>
          <p className={styles.areaIntro}>{AREA_INTRO[section.area]}</p>

          <ul className={styles.rules}>
            {section.rules.map((rule) => (
              <li key={rule.id} className={styles.rule}>
                <p className={styles.guidance}>{rule.guidance}</p>
                <p className={styles.because} data-testid="rule-because">
                  <span className={styles.becauseLabel}>Why:</span> {rule.because}
                </p>
                <SourceCitation source={rule.source} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className={styles.notices}>
        <h2>Before you change anything</h2>
        <ul>
          {planNotices.map((notice) => (
            <li key={notice.id}>{notice.text}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
