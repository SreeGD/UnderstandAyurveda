import type { AssessmentQuestion } from '../schema/assessment'
import { q } from './helpers'

const RECENT_HELP = 'Answer for the last two to four weeks only — not for your life as a whole.'

/**
 * Current-state assessment. Phrased entirely about the recent past, because the
 * whole value of vikriti is that it is NOT your baseline.
 */
export const vikritiQuestionsData: AssessmentQuestion[] = [
  q('v-sleep', 'vikriti', 'physiological', 1.4,
    'How have you been sleeping lately?',
    {
      vata: 'Badly — waking in the night, or lying awake with a busy mind',
      pitta: 'Waking early and hot, or too wound up to drop off',
      kapha: 'Heavily and long, and still waking unrefreshed',
    },
    { helpText: RECENT_HELP }),

  q('v-digestion', 'vikriti', 'physiological', 1.4,
    'How has your digestion been lately?',
    {
      vata: 'Unpredictable — bloating, gas, or discomfort after eating',
      pitta: 'Over-active — burning, acidity, or loose and urgent',
      kapha: 'Sluggish — heavy after meals, slow to move',
    },
    { helpText: RECENT_HELP }),

  q('v-appetite', 'vikriti', 'physiological', 1.3,
    'How has your appetite been?',
    {
      vata: 'Erratic — forgetting meals, then suddenly starving',
      pitta: 'Sharp and urgent, and unpleasant when delayed',
      kapha: 'Dull — eating out of habit rather than hunger',
    },
    { helpText: RECENT_HELP }),

  q('v-energy', 'vikriti', 'physiological', 1.4,
    'How has your energy been?',
    {
      vata: 'Wired but depleted — running on empty',
      pitta: 'Driven and unable to stop, then crashing',
      kapha: 'Flat and heavy — hard to get moving at all',
    },
    { helpText: RECENT_HELP }),

  q('v-mood', 'vikriti', 'mental-emotional', 1.2,
    'What has your mood been like?',
    {
      vata: 'Anxious, unsettled, or worried about things I cannot pin down',
      pitta: 'Short-tempered, critical, or easily provoked',
      kapha: 'Flat, unmotivated, or reluctant to engage',
    },
    { helpText: RECENT_HELP }),

  q('v-mind', 'vikriti', 'mental-emotional', 1.2,
    'How has your mind been working?',
    {
      vata: 'Racing and scattered — hard to hold a thought',
      pitta: 'Intense and fixated — hard to let something go',
      kapha: 'Foggy and slow — hard to get started',
    },
    { helpText: RECENT_HELP }),

  q('v-skin', 'vikriti', 'physical', 1.2,
    'How has your skin been lately?',
    {
      vata: 'Drier or rougher than usual, or flaking',
      pitta: 'Redder, more reactive, or breaking out',
      kapha: 'Oilier, puffier, or more congested than usual',
    },
    { helpText: RECENT_HELP }),

  q('v-bowel', 'vikriti', 'physiological', 1.3,
    'How have your bowels been?',
    {
      vata: 'Irregular, dry, or hard',
      pitta: 'Loose, frequent, or urgent',
      kapha: 'Slow and heavy, though regular',
    },
    { helpText: RECENT_HELP }),

  q('v-temperature', 'vikriti', 'physiological', 1.2,
    'How have you been running temperature-wise?',
    {
      vata: 'Colder than usual — hands and feet especially',
      pitta: 'Hotter than usual — flushing, overheating at night',
      kapha: 'Cool and clammy, or heavy and damp-feeling',
    },
    { helpText: RECENT_HELP }),

  q('v-tongue', 'vikriti', 'physical', 1.1,
    'If you look at your tongue in the morning, what do you see?',
    {
      vata: 'Dry, with a thin greyish or brownish film',
      pitta: 'Red, with a yellowish film',
      kapha: 'Moist and swollen, with a thick white film',
    },
    { helpText: RECENT_HELP, optional: true }),

  q('v-joints', 'vikriti', 'physical', 1.1,
    'How have your joints and muscles felt?',
    {
      vata: 'Stiff, cracking, or achy in a moving-around way',
      pitta: 'Hot or inflamed-feeling in one place',
      kapha: 'Heavy, congested, or puffy',
    },
    { helpText: RECENT_HELP, optional: true }),

  q('v-thirst', 'vikriti', 'physiological', 1.0,
    'How has your thirst been?',
    {
      vata: 'Variable — dry mouth but not really thirsty',
      pitta: 'Very thirsty, wanting cold drinks',
      kapha: 'Little thirst, and drinks sit heavily',
    },
    { helpText: RECENT_HELP, optional: true }),

  q('v-cravings', 'vikriti', 'mental-emotional', 1.0,
    'What have you been reaching for?',
    {
      vata: 'Crunchy, dry, salty things — and coffee',
      pitta: 'Cold, sharp, spicy things — and something to take the edge off',
      kapha: 'Sweet, rich, heavy things — and second helpings',
    },
    { helpText: RECENT_HELP }),

  q('v-motivation', 'vikriti', 'mental-emotional', 1.1,
    'How has your motivation been?',
    {
      vata: 'Starting many things, finishing none',
      pitta: 'Pushing hard, unable to rest',
      kapha: 'Reluctant to start anything at all',
    },
    { helpText: RECENT_HELP }),

  q('v-social', 'vikriti', 'mental-emotional', 0.9,
    'How have you been with other people?',
    {
      vata: 'Overtalking, or avoiding contact because it feels like too much',
      pitta: 'Impatient, blunt, or picking arguments',
      kapha: 'Withdrawn, and not returning messages',
    },
    { helpText: RECENT_HELP, optional: true }),

  q('v-routine', 'vikriti', 'physiological', 1.3,
    'How regular has your daily timing been?',
    {
      vata: 'Very irregular — travel, late nights, meals whenever',
      pitta: 'Regular but relentless — long hours, skipped breaks',
      kapha: 'Regular but inert — little movement, long sitting',
    },
    { helpText: RECENT_HELP }),
]
