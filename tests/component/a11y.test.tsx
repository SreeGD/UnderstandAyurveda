import axe from 'axe-core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from '../../src/routes/Home'
import { Onboarding } from '../../src/routes/onboarding/Onboarding'
import { PrakritiAssessment } from '../../src/routes/assess/PrakritiAssessment'
import { RedFlagScreen } from '../../src/routes/assess/RedFlagScreen'
import { PrakritiResult } from '../../src/routes/results/PrakritiResult'
import { History } from '../../src/routes/results/History'
import { Plan } from '../../src/routes/plan/Plan'
import { CourseIndex } from '../../src/routes/learn/CourseIndex'
import { LessonReader } from '../../src/routes/learn/LessonReader'
import { Progress } from '../../src/routes/quiz/Progress'
import { ReferenceIndex } from '../../src/routes/reference/ReferenceIndex'
import { DataSettings } from '../../src/routes/data/DataSettings'
import { renderAt, resetStore, seedPrakriti } from './helpers'

/**
 * WCAG 2.1 AA, asserted per route (SC-011).
 *
 * axe catches roughly a third of real accessibility problems — the machine-
 * checkable third. The keyboard and screen-reader passes in quickstart.md cover
 * what it cannot see, and the behavioural assertions below cover the specific
 * obligations FR-048 and FR-049 impose.
 *
 * IMPORTANT LIMIT: jsdom has no canvas, so axe SKIPS colour-contrast checks
 * here. Contrast is therefore NOT covered by this suite and must be verified in
 * a real browser — see the accessibility section of quickstart.md. Treating a
 * green run here as full WCAG coverage would be a mistake.
 */

beforeEach(() => resetStore())
afterEach(() => resetStore())

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  })

  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`
  )
  expect(summary, 'axe found WCAG A/AA violations').toEqual([])
}

const ROUTES = [
  ['home', () => <Home />, false, '/'],
  ['onboarding', () => <Onboarding />, false, '/onboarding'],
  ['prakriti assessment', () => <PrakritiAssessment />, false, '/assess'],
  ['red-flag screen', () => <RedFlagScreen onContinue={() => {}} onBack={() => {}} />, false, '/assess'],
  ['prakriti result', () => <PrakritiResult />, true, '/results'],
  ['history', () => <History />, true, '/results/history'],
  ['plan', () => <Plan />, true, '/plan'],
  ['course index', () => <CourseIndex />, false, '/learn'],
  ['quiz progress', () => <Progress />, false, '/quiz'],
  ['reference', () => <ReferenceIndex />, false, '/reference'],
  ['data settings', () => <DataSettings />, false, '/data'],
] as const

describe('WCAG 2.1 A/AA — no automated violations', () => {
  it.each(ROUTES)('%s', async (_name, Component, needsProfile, route) => {
    if (needsProfile) seedPrakriti()
    const { container } = renderAt(<Component />, route)
    await expectNoViolations(container)
  })

  it('lesson reader', async () => {
    const { container } = renderAt(<LessonReader />, '/learn/three-doshas')
    await expectNoViolations(container)
  })
})

describe('assessment accessibility obligations', () => {
  it('groups each question as a fieldset with its prompt as the legend', () => {
    renderAt(<PrakritiAssessment />)
    const group = screen.getByRole('group')
    expect(group.tagName).toBe('FIELDSET')
    expect(group).toHaveTextContent(/how would you describe/i)
  })

  it('presents options as a labelled radio group', () => {
    renderAt(<PrakritiAssessment />)
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBeGreaterThanOrEqual(3)
    for (const radio of radios) expect(radio).toHaveAccessibleName()
  })

  it('exposes progress as a labelled progressbar', () => {
    renderAt(<PrakritiAssessment />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAccessibleName()
    expect(bar).toHaveAttribute('aria-valuemax')
  })

  it('is operable by keyboard alone', async () => {
    renderAt(<PrakritiAssessment />)
    const user = userEvent.setup()

    const next = screen.getByRole('button', { name: /next/i })
    expect(next).toBeDisabled()

    // Select via keyboard only, then advance.
    const radios = screen.getAllByRole('radio')
    radios[0]!.focus()
    await user.keyboard('{ }')

    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  })

  it('moves focus to the question heading so a screen reader lands in the right place', () => {
    renderAt(<PrakritiAssessment />)
    const heading = document.querySelector('[data-focus-target]')
    expect(heading).not.toBeNull()
    expect(document.activeElement).toBe(heading)
  })
})

describe('state is never carried by colour alone (FR-049)', () => {
  it('the course index labels completion in words', () => {
    const { store } = seedPrakriti()
    store.update((draft) => {
      draft.lessonProgress['five-elements'] = {
        startedAt: '2026-06-01T00:00:00.000Z',
        completedAt: '2026-06-01T00:10:00.000Z',
        knowledgeCheckPassed: true,
      }
    })

    renderAt(<CourseIndex />, '/learn')
    // The status is spelled out next to the lesson, not signalled by colour.
    expect(screen.getByText('✓ Complete')).toBeInTheDocument()
  })

  it('the dosha blend prints numeric percentages beside every bar', () => {
    seedPrakriti()
    const { container } = renderAt(<PrakritiResult />, '/results')
    const text = container.textContent ?? ''
    // All three doshas named with a percentage — not bars alone.
    expect(text).toMatch(/Vata/)
    expect(text).toMatch(/Pitta/)
    expect(text).toMatch(/Kapha/)
    expect(text).toMatch(/\d+%/)
  })
})

describe('live regions exist for dynamic announcements', () => {
  it('the assessment has a polite status region', () => {
    const { container } = renderAt(<PrakritiAssessment />)
    const live = container.querySelector('[aria-live="polite"]')
    expect(live).not.toBeNull()
    expect(live).toHaveAttribute('role', 'status')
  })
})
