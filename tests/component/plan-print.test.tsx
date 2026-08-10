import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { recommendationRules } from '../../src/content/recommendations'
import { LIFE_AREAS } from '../../src/content/schema/common'
import { scanStrings } from '../../src/content/lint/medicalSafety'
import { Plan } from '../../src/routes/plan/Plan'
import { renderAt, resetStore, seedPrakriti } from './helpers'

/**
 * FR-032: the printed plan must contain the plan itself, the profile it derives
 * from, the generation date, and the disclaimer.
 *
 * A disclaimer that vanishes on paper fails Principle II exactly where the
 * artifact outlives the screen — someone pins the printout to a fridge and the
 * caveats are gone.
 */

beforeEach(() => resetStore())
afterEach(() => resetStore())

describe('the plan contains everything the print must carry', () => {
  it('renders all five life areas', () => {
    seedPrakriti()
    renderAt(<Plan />, '/plan')

    const headings = [
      /daily routine and sleep/i,
      /meals and food qualities/i,
      /movement and exercise/i,
      /seasonal adjustment/i,
      /self-care/i,
    ]
    for (const heading of headings) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    expect(LIFE_AREAS).toHaveLength(5)
  })

  it('shows the profile the guidance derives from', () => {
    seedPrakriti()
    const { container } = renderAt(<Plan />, '/plan')
    expect(screen.getByText(/the profile this comes from/i)).toBeInTheDocument()
    expect(container.textContent).toMatch(/Vata/)
    expect(container.textContent).toMatch(/\d+%/)
  })

  it('shows the generation date', () => {
    seedPrakriti()
    renderAt(<Plan />, '/plan')
    expect(screen.getByText(/^Generated /)).toBeInTheDocument()
  })

  it('shows the disclaimer', () => {
    seedPrakriti()
    renderAt(<Plan />, '/plan')
    expect(screen.getByTestId('disclaimer')).toHaveTextContent(/not medical advice/i)
  })

  it('states a reason for every recommendation (FR-028)', () => {
    seedPrakriti()
    const { container } = renderAt(<Plan />, '/plan')
    const whys = container.querySelectorAll('[data-testid="rule-because"]')
    expect(whys.length).toBeGreaterThan(10)
    for (const why of whys) {
      expect((why.textContent ?? '').replace(/^Why:\s*/, '').trim().length).toBeGreaterThan(10)
    }
  })
})

describe('the print stylesheet keeps the disclaimer and hides the chrome', () => {
  const printCss = readFileSync(join(__dirname, '../../src/styles/print.css'), 'utf8')
  const disclaimerCss = readFileSync(
    join(__dirname, '../../src/components/Disclaimer/Disclaimer.module.css'),
    'utf8'
  )

  it('the disclaimer has an explicit print block and is never hidden', () => {
    expect(disclaimerCss).toMatch(/@media print/)
    // The global print rule hides buttons and inputs; the disclaimer is neither,
    // and nothing may set display:none on it.
    expect(disclaimerCss).not.toMatch(/display:\s*none/)
  })

  it('interactive chrome is removed from the printed page', () => {
    expect(printCss).toMatch(/button[\s\S]*display:\s*none/)
  })

  it('recommendations are kept off page breaks', () => {
    expect(printCss).toMatch(/page-break-inside:\s*avoid/)
  })
})

describe('printing is client-side only', () => {
  it('the print control calls window.print and makes no request', async () => {
    seedPrakriti()
    const print = vi.fn()
    vi.stubGlobal('print', print)
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    renderAt(<Plan />, '/plan')
    await userEvent.setup().click(screen.getByRole('button', { name: /print or save as pdf/i }))

    expect(print).toHaveBeenCalled()
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})

describe('nothing in the rendered plan carries prohibited language', () => {
  it('the visible text is clean', () => {
    seedPrakriti()
    const { container } = renderAt(<Plan />, '/plan')
    const violations = scanStrings([container.textContent ?? ''], { location: 'rendered plan' })
    expect(violations.map((v) => v.matched)).toEqual([])
  })

  it('and so is every rule that could have been selected', () => {
    const violations = recommendationRules.flatMap((r) =>
      scanStrings([r.guidance, r.because], { location: r.id, allowLint: r.allowLint })
    )
    expect(violations).toEqual([])
  })
})
