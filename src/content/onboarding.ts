import type { ContentBlock } from './schema/blocks'
import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from './sources'

export interface OnboardingStep {
  id: string
  title: string
  body: ContentBlock[]
}

/**
 * Shown before any assessment question (FR-001). Three things must land here:
 * what Ayurveda is, what this app is and is not, and the prakriti/vikriti
 * distinction — because a result the reader cannot interpret is worse than no
 * result at all.
 */
export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'what-this-is',
    title: 'What this is',
    body: [
      {
        kind: 'paragraph',
        text: 'Ayurveda is a traditional system of thought from the Indian subcontinent, developed over roughly two thousand years, about health, daily living, and how a person relates to their surroundings. Its name means "the knowledge of life".',
        source: CHARAKA_SUTRA('1'),
      },
      {
        kind: 'paragraph',
        text: 'This app teaches you the fundamentals from zero, helps you estimate your own constitutional pattern, and turns that into ordinary lifestyle adjustments — when you sleep, how you eat, how you move.',
        framing: true,
      },
      {
        kind: 'paragraph',
        text: 'You do not need to know any Sanskrit. Every term is explained in plain English the first time it appears, with a pronunciation hint and an everyday example.',
        framing: true,
      },
    ],
  },
  {
    id: 'what-this-is-not',
    title: 'What this is not',
    body: [
      {
        kind: 'callout',
        tone: 'warning',
        title: 'This is education, not medical care',
        text: 'Nothing here diagnoses anything, and nothing here is a substitute for a doctor or a qualified Ayurvedic practitioner. This app will never tell you how much of a herb to take, and it will never suggest changing anything a clinician has prescribed you.',
        source: EDITORIAL,
      },
      {
        kind: 'paragraph',
        text: 'If you are pregnant, managing a diagnosed illness, taking prescribed medicines, or currently unwell in a way that worries you, please talk to a professional before changing anything. We will ask about this before showing you results, and we will say so again then.',
        source: EDITORIAL,
      },
      {
        kind: 'callout',
        tone: 'misconception',
        title: 'A questionnaire is a starting point, not a verdict',
        text: 'A trained practitioner assesses constitution over time, in person, using observation, pulse, and history. A self-assessment on a screen cannot do that. What it can do is give you a reasonable first sketch and a vocabulary for noticing things about yourself.',
        source: EDITORIAL,
      },
      {
        kind: 'paragraph',
        text: 'The content here has not been certified by a credentialed Ayurvedic practitioner. Every substantive claim carries a source, and where something is a modern popularisation rather than a classical teaching, we say so.',
        source: EDITORIAL,
      },
    ],
  },
  {
    id: 'prakriti-vikriti',
    title: 'Two different questions',
    body: [
      {
        kind: 'paragraph',
        text: 'Ayurveda asks two separate questions about you, and confusing them is the single most common beginner mistake.',
        framing: true,
      },
      { kind: 'termIntro', termId: 'prakriti' },
      {
        kind: 'paragraph',
        text: 'Your [[prakriti]] is your baseline — the proportion of the three patterns considered to be set early and to stay broadly stable. It is not something you fix or improve. It is the thing you work with.',
        source: CHARAKA_SUTRA('7'),
      },
      { kind: 'termIntro', termId: 'vikriti' },
      {
        kind: 'paragraph',
        text: 'Your [[vikriti]] is how you are right now, which may be some distance from your baseline. This is the changeable part — and the part lifestyle adjustment is actually aimed at.',
        source: CHARAKA_SUTRA('7'),
      },
      {
        kind: 'example',
        scenario: 'Why the difference matters',
        text: 'Someone with a naturally solid, steady constitution who has just had three weeks of travel and short nights may answer a questionnaire as though they were light and scattered. They are not — they are a steady person having an unsteady month. Answer the first assessment about your whole adult life, not about this month.',
        source: EDITORIAL,
      },
      {
        kind: 'paragraph',
        text: 'The main assessment in this app estimates your [[prakriti]]. There is a separate, shorter one for [[vikriti]] once you have a baseline to compare against.',
        framing: true,
      },
    ],
  },
  {
    id: 'how-results-work',
    title: 'How your result will be shown',
    body: [
      {
        kind: 'paragraph',
        text: 'You will not be handed a single label. Everyone has all three patterns; what differs is the proportion, so your result is a percentage across all three.',
        source: ASHTANGA_SUTRA('1'),
      },
      {
        kind: 'list',
        ordered: false,
        items: [
          'Every result shows all three percentages, never one word.',
          'Every result carries a confidence indicator, and tells you plainly why it is what it is.',
          'You can open the arithmetic and see exactly which of your answers produced the number.',
          'If two or three patterns come out close together, we say so rather than picking a winner.',
        ],
        source: EDITORIAL,
      },
      {
        kind: 'callout',
        tone: 'note',
        title: 'Your answers stay on this device',
        text: 'Everything you enter is stored in your own browser and is never sent anywhere. There is no account, no server, and no analytics. You can export everything or delete all of it at any time.',
        source: EDITORIAL,
      },
    ],
  },
]

export const onboarding = {
  steps: onboardingSteps,
  body: onboardingSteps.flatMap((s) => s.body),
}

/** Shown wherever the constitution requires the standing notice. */
export const DISCLAIMER_TEXT =
  'Educational content, not medical advice. This app does not diagnose or provide care. Consult a qualified practitioner or your doctor before making changes, especially if you are pregnant, unwell, or taking prescribed medicines.'

export const CONTENT_REVIEW_NOTICE = MODERN(
  'UnderstandAyurveda editorial',
  'Content is sourced and attributed but has not been certified by a credentialed Ayurvedic practitioner'
)
