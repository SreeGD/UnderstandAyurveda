import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../src/App'
import { prakritiQuestions } from '../../src/content'
import { renderAt, resetStore } from './helpers'

/**
 * End-to-end journeys through the real App, driven the way a person would.
 *
 * This covers quickstart.md V1 and V2 — onboarding → assessment → red-flag
 * screening → result → plan — and the resume path, which is the one most likely
 * to break silently.
 */

beforeEach(() => resetStore())
afterEach(() => resetStore())

/** Answers every question by clicking the first option, then advancing. */
async function answerAll(user: ReturnType<typeof userEvent.setup>, count: number) {
  for (let i = 0; i < count; i++) {
    const radios = screen.getAllByRole('radio')
    await user.click(radios[0]!)
    const next = screen.getByRole('button', { name: /next|see my result/i })
    await user.click(next)
  }
}

describe('V1 — a first-time visitor reaches a result they can inspect', () => {
  it('home → onboarding → assessment → screening → result', async () => {
    const user = userEvent.setup()
    renderAt(<App />, '/')

    // Home
    expect(screen.getByRole('heading', { name: /understand ayurveda/i })).toBeInTheDocument()
    expect(screen.getByTestId('disclaimer')).toBeInTheDocument()

    // Onboarding is offered before any question (FR-001)
    await user.click(screen.getByRole('link', { name: /^start$/i }))
    expect(await screen.findByRole('heading', { name: /what this is/i })).toBeInTheDocument()

    // Step through onboarding — the not-medical framing and prakriti/vikriti
    // distinction must both appear before the assessment.
    await user.click(screen.getByRole('button', { name: /^next$/i }))
    expect(screen.getByText(/education, not medical care/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^next$/i }))
    expect(screen.getByRole('heading', { name: /two different questions/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^next$/i }))
    await user.click(screen.getByRole('button', { name: /start the assessment/i }))

    // Assessment
    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
    await answerAll(user, prakritiQuestions.length)

    // Red-flag screening comes BEFORE the result (FR-023)
    expect(
      await screen.findByRole('heading', { name: /before we show your result/i })
    ).toBeInTheDocument()
    await user.click(screen.getByTestId('red-flag-continue'))

    // Result
    expect(await screen.findByRole('heading', { name: /your constitution/i })).toBeInTheDocument()

    // All three doshas present with percentages — never a single label
    const main = screen.getByRole('main')
    expect(within(main).getAllByText(/Vata/).length).toBeGreaterThan(0)
    expect(within(main).getAllByText(/Pitta/).length).toBeGreaterThan(0)
    expect(within(main).getAllByText(/Kapha/).length).toBeGreaterThan(0)
    expect(main.textContent).toMatch(/\d+%/)

    // Confidence is stated
    expect(main.textContent).toMatch(/Confidence:/i)

    // The breakdown is openable and shows the arithmetic (FR-021)
    await user.click(screen.getByRole('button', { name: /how was this calculated/i }))
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText(/each answer adds points/i)).toBeInTheDocument()
  }, 60_000)
})

describe('V1 red-flag path — results are gated', () => {
  it('a flagged user must acknowledge before the result appears', async () => {
    const user = userEvent.setup()
    renderAt(<App />, '/assess')

    await answerAll(user, prakritiQuestions.length)
    expect(
      await screen.findByRole('heading', { name: /before we show your result/i })
    ).toBeInTheDocument()

    await user.click(screen.getByLabelText(/are you pregnant/i))
    expect(screen.getByTestId('red-flag-messages')).toBeInTheDocument()
    expect(screen.getByTestId('red-flag-continue')).toBeDisabled()

    await user.click(screen.getByTestId('red-flag-acknowledge'))
    await user.click(screen.getByTestId('red-flag-continue'))

    expect(await screen.findByRole('heading', { name: /your constitution/i })).toBeInTheDocument()
  }, 60_000)
})

describe('V1 resume path — leaving mid-assessment loses nothing', () => {
  it('answers persist and the flow resumes where it left off (FR-025)', async () => {
    const user = userEvent.setup()
    const { unmount } = renderAt(<App />, '/assess')

    await answerAll(user, 5)

    const progressBefore = screen.getByRole('progressbar').getAttribute('aria-valuenow')
    expect(Number(progressBefore)).toBe(5)

    unmount()

    // "Reopening" the app
    renderAt(<App />, '/assess')
    expect(
      await screen.findByRole('heading', { name: /you have an assessment in progress/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/answered 5 of/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /carry on where i left off/i }))
    await waitFor(() =>
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5')
    )
  }, 60_000)
})

describe('V2 — the result turns into a plan', () => {
  it('all five life areas appear, each with a reason', async () => {
    const user = userEvent.setup()
    renderAt(<App />, '/assess')

    await answerAll(user, prakritiQuestions.length)
    await user.click(await screen.findByTestId('red-flag-continue'))
    await screen.findByRole('heading', { name: /your constitution/i })

    await user.click(screen.getByRole('link', { name: /see what to actually do/i }))

    expect(await screen.findByRole('heading', { name: /what to actually do/i })).toBeInTheDocument()

    for (const area of [
      /daily routine and sleep/i,
      /meals and food qualities/i,
      /movement and exercise/i,
      /seasonal adjustment/i,
      /self-care/i,
    ]) {
      expect(screen.getByRole('heading', { name: area })).toBeInTheDocument()
    }

    const reasons = document.querySelectorAll('[data-testid="rule-because"]')
    expect(reasons.length).toBeGreaterThan(10)

    // Disclaimer and practitioner guidance travel with the plan
    expect(screen.getByTestId('disclaimer')).toBeInTheDocument()
    expect(screen.getByText(/qualified Ayurvedic practitioner/i)).toBeInTheDocument()
  }, 60_000)

  it('changing season changes only the seasonal section', async () => {
    const user = userEvent.setup()
    renderAt(<App />, '/assess')
    await answerAll(user, prakritiQuestions.length)
    await user.click(await screen.findByTestId('red-flag-continue'))
    await screen.findByRole('heading', { name: /your constitution/i })
    await user.click(screen.getByRole('link', { name: /see what to actually do/i }))
    await screen.findByRole('heading', { name: /what to actually do/i })

    const routineBefore = document
      .querySelector('section:has(h2)')
      ?.textContent?.slice(0, 200)

    await user.selectOptions(screen.getByLabelText(/current season/i), 'summer')

    await waitFor(() => {
      expect(screen.getByLabelText(/current season/i)).toHaveValue('summer')
    })

    const routineAfter = document
      .querySelector('section:has(h2)')
      ?.textContent?.slice(0, 200)
    expect(routineAfter).toBe(routineBefore)
  }, 60_000)
})

describe('the learn and reference paths work standalone', () => {
  it('the course lists every lesson and a lesson opens', async () => {
    const user = userEvent.setup()
    renderAt(<App />, '/learn')

    expect(await screen.findByRole('heading', { name: /the fundamentals/i })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /the three doshas/i }))

    expect(await screen.findByRole('heading', { name: /the three doshas/i })).toBeInTheDocument()
    // Terms are introduced with meaning, pronunciation, and an example (FR-005).
    // The pronunciation appears in every termIntro for that term, so there may
    // legitimately be more than one.
    expect(screen.getAllByText(/DOH-shuh/).length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText(/^Term: /).length).toBeGreaterThan(0)
  }, 30_000)

  it('reference search finds an entry by an alternate spelling', async () => {
    const user = userEvent.setup()
    renderAt(<App />, '/reference')

    await user.type(screen.getByLabelText(/search the reference/i), 'dosa')
    const results = await screen.findAllByText(/Dosha/i)
    expect(results.length).toBeGreaterThan(0)
  }, 30_000)
})
