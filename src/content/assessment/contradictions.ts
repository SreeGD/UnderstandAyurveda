import type { Contradiction } from '../schema/assessment'

/**
 * Declared mutually exclusive answers. Triggering a pair lowers the consistency
 * confidence signal and surfaces the inconsistency to the user, rather than
 * silently averaging it into a confident-looking number.
 *
 * These are not "wrong answers". People genuinely are inconsistent about
 * themselves, and saying so is more useful than pretending the arithmetic
 * resolved it.
 */
export const contradictions: Contradiction[] = [
  {
    questionId: 'skin-texture',
    optionId: 'skin-texture-v',
    withQuestionId: 'skin-oiliness',
    withOptionId: 'skin-oiliness-k',
    explanation:
      'You described your skin as dry and inclined to roughness, but also as staying moist or oily when left alone. Both can be true in different places or seasons — but it makes the reading less certain.',
  },
  {
    questionId: 'body-frame',
    optionId: 'body-frame-v',
    withQuestionId: 'weight-history',
    withOptionId: 'weight-history-k',
    explanation:
      'You described a slight frame but also a tendency to put weight on easily and struggle to shift it. These usually go in opposite directions.',
  },
  {
    questionId: 'body-frame',
    optionId: 'body-frame-k',
    withQuestionId: 'veins-tendons',
    withOptionId: 'veins-tendons-v',
    explanation:
      'You described a broad, solid frame but very prominent veins and tendons. Prominent surface vessels usually accompany a lighter covering.',
  },
  {
    questionId: 'cold-tolerance',
    optionId: 'cold-tolerance-v',
    withQuestionId: 'heat-tolerance',
    withOptionId: 'heat-tolerance-p',
    explanation:
      'You said you cope badly with both cold and heat. That is possible, but it means temperature is not helping to distinguish your pattern.',
  },
  {
    questionId: 'sleep-depth',
    optionId: 'sleep-depth-k',
    withQuestionId: 'sleep-need',
    withOptionId: 'sleep-need-v',
    explanation:
      'You described sleeping deeply and being hard to wake, but also needing less sleep than most people. These usually go together in the other direction.',
  },
  {
    questionId: 'appetite',
    optionId: 'appetite-k',
    withQuestionId: 'missed-meal',
    withOptionId: 'missed-meal-p',
    explanation:
      'You described a steady appetite you can comfortably skip a meal with, but also getting sharply irritable when a meal is missed.',
  },
  {
    questionId: 'speech-pace',
    optionId: 'speech-pace-k',
    withQuestionId: 'social-style',
    withOptionId: 'social-style-v',
    explanation:
      'You described speaking slowly and saying less than others, but also being enthusiastic and talkative in company.',
  },
  {
    questionId: 'sweating',
    optionId: 'sweating-v',
    withQuestionId: 'hands-feet-temp',
    withOptionId: 'hands-feet-temp-p',
    explanation:
      'You described sweating very little even when working hard, but also having warm hands and feet. These usually accompany each other in the other direction.',
  },
]
