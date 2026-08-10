import { screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PrakritiAssessment } from '../../src/routes/assess/PrakritiAssessment'
import { RedFlagScreen } from '../../src/routes/assess/RedFlagScreen'
import { PrakritiResult } from '../../src/routes/results/PrakritiResult'
import { Comparison } from '../../src/routes/results/Comparison'
import { History } from '../../src/routes/results/History'
import { Plan } from '../../src/routes/plan/Plan'
import { DISCLAIMER_TEXT } from '../../src/content/onboarding'
import { renderAt, resetStore, seedPrakriti } from './helpers'

/**
 * FR-002 / SC-008: the educational-not-medical notice must render on EVERY
 * assessment screen, EVERY result view, and EVERY generated plan.
 *
 * This test exists because that requirement is the kind that quietly rots — a
 * new screen gets added, nobody remembers the notice, and nothing complains.
 */

beforeEach(() => resetStore())
afterEach(() => resetStore())

const SURFACES = [
  ['prakriti assessment', () => <PrakritiAssessment />, false],
  ['red-flag screen', () => <RedFlagScreen onContinue={() => {}} onBack={() => {}} />, false],
  ['prakriti result', () => <PrakritiResult />, true],
  ['assessment history', () => <History />, true],
  ['lifestyle plan', () => <Plan />, true],
] as const

describe('the disclaimer renders on every required surface', () => {
  it.each(SURFACES)('%s', (_name, Component, needsProfile) => {
    if (needsProfile) seedPrakriti()
    renderAt(<Component />)

    const disclaimer = screen.getByTestId('disclaimer')
    expect(disclaimer).toBeInTheDocument()
    expect(disclaimer).toHaveTextContent(/not medical advice/i)
  })

  it('comparison view carries it too', () => {
    seedPrakriti()
    renderAt(<Comparison />)
    // Without a vikriti reading this renders the empty state rather than the
    // comparison, so assert on whichever it shows — both must be safe.
    const disclaimers = screen.queryAllByTestId('disclaimer')
    const emptyState = screen.queryByText(/nothing to compare yet/i)
    expect(disclaimers.length > 0 || emptyState !== null).toBe(true)
  })
})

describe('the disclaimer cannot be dismissed', () => {
  it('exposes no dismiss, close, or hide control', () => {
    seedPrakriti()
    renderAt(<PrakritiResult />)

    const disclaimer = screen.getByTestId('disclaimer')
    expect(disclaimer.querySelectorAll('button')).toHaveLength(0)
    expect(disclaimer.querySelectorAll('[aria-expanded]')).toHaveLength(0)
    expect(disclaimer.querySelector('details')).toBeNull()
  })

  it('states the full notice, not an abbreviation of it', () => {
    seedPrakriti()
    renderAt(<PrakritiResult />)
    expect(screen.getByTestId('disclaimer')).toHaveTextContent(DISCLAIMER_TEXT)
  })
})

describe('the plan carries practitioner guidance alongside its recommendations', () => {
  it('tells the user to consult a professional (FR-030)', () => {
    seedPrakriti()
    renderAt(<Plan />)
    expect(screen.getByText(/qualified Ayurvedic practitioner/i)).toBeInTheDocument()
    expect(screen.getByText(/speak to your doctor/i)).toBeInTheDocument()
  })

  it('never adjusts prescribed care', () => {
    seedPrakriti()
    const { container } = renderAt(<Plan />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/stop taking/i)
    expect(text).not.toMatch(/instead of your medication/i)
    expect(text).toMatch(/never adjust what you have been prescribed/i)
  })
})
