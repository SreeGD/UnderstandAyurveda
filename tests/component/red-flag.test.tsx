import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RED_FLAG_MESSAGES, redFlagQuestions } from '../../src/content/assessment'
import { RedFlagScreen } from '../../src/routes/assess/RedFlagScreen'
import { renderAt, resetStore } from './helpers'

/**
 * FR-023 / SC-009: every red-flag path must surface professional-care guidance
 * BEFORE results, and must require acknowledgement to proceed.
 *
 * Tested for every flag individually, because "we handle pregnancy" and "we
 * handle all four" are different claims.
 */

beforeEach(() => resetStore())
afterEach(() => resetStore())

describe('every red flag surfaces professional-care guidance before results', () => {
  it.each(redFlagQuestions.map((q) => [q.id, q.prompt] as const))(
    '%s',
    async (flagId, prompt) => {
      const onContinue = vi.fn()
      renderAt(<RedFlagScreen onContinue={onContinue} onBack={() => {}} />)

      const user = userEvent.setup()
      await user.click(screen.getByLabelText(new RegExp(escapeRegex(prompt), 'i')))

      const messages = screen.getByTestId('red-flag-messages')
      expect(messages).toBeInTheDocument()

      const expected = RED_FLAG_MESSAGES[flagId]!
      expect(messages).toHaveTextContent(expected.title)
    }
  )
})

describe('results are gated behind acknowledgement', () => {
  it('the continue button is disabled until the notice is acknowledged', async () => {
    const onContinue = vi.fn()
    renderAt(<RedFlagScreen onContinue={onContinue} onBack={() => {}} />)
    const user = userEvent.setup()

    const first = redFlagQuestions[0]!
    await user.click(screen.getByLabelText(new RegExp(escapeRegex(first.prompt), 'i')))

    const continueButton = screen.getByTestId('red-flag-continue')
    expect(continueButton).toBeDisabled()

    await user.click(continueButton)
    expect(onContinue).not.toHaveBeenCalled()

    await user.click(screen.getByTestId('red-flag-acknowledge'))
    expect(continueButton).toBeEnabled()

    await user.click(continueButton)
    expect(onContinue).toHaveBeenCalledWith([first.id])
  })

  it('un-ticking a flag resets the acknowledgement', async () => {
    renderAt(<RedFlagScreen onContinue={() => {}} onBack={() => {}} />)
    const user = userEvent.setup()

    const first = redFlagQuestions[0]!
    const flagBox = screen.getByLabelText(new RegExp(escapeRegex(first.prompt), 'i'))

    await user.click(flagBox)
    await user.click(screen.getByTestId('red-flag-acknowledge'))
    expect(screen.getByTestId('red-flag-continue')).toBeEnabled()

    // Tick a second flag: new guidance appears, so the acknowledgement must be
    // re-given rather than carried over from the previous set.
    const second = redFlagQuestions[1]!
    await user.click(screen.getByLabelText(new RegExp(escapeRegex(second.prompt), 'i')))
    expect(screen.getByTestId('red-flag-continue')).toBeDisabled()
  })

  it('passes straight through when nothing is flagged', async () => {
    const onContinue = vi.fn()
    renderAt(<RedFlagScreen onContinue={onContinue} onBack={() => {}} />)
    const user = userEvent.setup()

    expect(screen.queryByTestId('red-flag-messages')).toBeNull()
    const continueButton = screen.getByTestId('red-flag-continue')
    expect(continueButton).toBeEnabled()

    await user.click(continueButton)
    expect(onContinue).toHaveBeenCalledWith([])
  })

  it('shows guidance for every flag when several are set', async () => {
    renderAt(<RedFlagScreen onContinue={() => {}} onBack={() => {}} />)
    const user = userEvent.setup()

    for (const question of redFlagQuestions) {
      await user.click(screen.getByLabelText(new RegExp(escapeRegex(question.prompt), 'i')))
    }

    const messages = screen.getByTestId('red-flag-messages')
    for (const question of redFlagQuestions) {
      expect(messages).toHaveTextContent(RED_FLAG_MESSAGES[question.id]!.title)
    }
  })
})

describe('the screening screen itself carries the standing notice', () => {
  it('renders the disclaimer', () => {
    renderAt(<RedFlagScreen onContinue={() => {}} onBack={() => {}} />)
    expect(screen.getByTestId('disclaimer')).toHaveTextContent(/not medical advice/i)
  })
})

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
