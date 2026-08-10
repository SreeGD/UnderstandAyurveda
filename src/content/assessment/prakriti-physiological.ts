import type { AssessmentQuestion } from '../schema/assessment'
import { LIFETIME_HELP, q } from './helpers'

/**
 * Physiological patterns. Middle reliability: more stable than mood, less stable
 * than a skeleton.
 */
export const prakritiPhysiological: AssessmentQuestion[] = [
  q('appetite', 'prakriti', 'physiological', 1.5,
    'What is your appetite normally like?',
    {
      vata: 'Variable — ravenous one day, uninterested the next',
      pitta: 'Strong and punctual — I notice sharply when a meal is late',
      kapha: 'Steady and moderate — I can comfortably skip a meal',
    },
    { helpText: LIFETIME_HELP }),

  q('missed-meal', 'prakriti', 'physiological', 1.4,
    'What happens when you miss a meal?',
    {
      vata: 'I get lightheaded and jittery',
      pitta: 'I get irritable and short-tempered, quickly',
      kapha: 'I barely notice',
    }),

  q('digestion-speed', 'prakriti', 'physiological', 1.5,
    'How does food normally sit with you?',
    {
      vata: 'Unpredictably — I get bloated or gassy fairly easily',
      pitta: 'Quickly — I digest fast and get hungry again soon',
      kapha: 'Slowly — meals sit heavily for a while',
    }),

  q('bowel-habit', 'prakriti', 'physiological', 1.5,
    'What is your normal bowel pattern?',
    {
      vata: 'Irregular, and inclined to be dry or hard',
      pitta: 'Frequent, soft, and reliable',
      kapha: 'Regular but slow, and well formed',
    }),

  q('thirst', 'prakriti', 'physiological', 1.3,
    'How thirsty are you, typically?',
    {
      vata: 'Variable — I often forget to drink',
      pitta: 'Frequently thirsty, and I drink a lot',
      kapha: 'Rarely thirsty',
    }),

  q('sleep-depth', 'prakriti', 'physiological', 1.5,
    'How do you sleep?',
    {
      vata: 'Lightly and brokenly — I wake at small noises',
      pitta: 'Moderately — I sleep well but wake if something is on my mind',
      kapha: 'Deeply and long — I am hard to wake',
    },
    { helpText: LIFETIME_HELP }),

  q('sleep-need', 'prakriti', 'physiological', 1.4,
    'How much sleep do you actually need to feel right?',
    {
      vata: 'Less than most people, though I do not always feel rested',
      pitta: 'A reliable seven or so hours',
      kapha: 'More than most people, and I could always have more',
    }),

  q('waking', 'prakriti', 'physiological', 1.3,
    'What are you like on waking?',
    {
      vata: 'Awake quickly, but not necessarily refreshed',
      pitta: 'Alert and ready fairly promptly',
      kapha: 'Slow and groggy — it takes me a while to get going',
    }),

  q('energy-pattern', 'prakriti', 'physiological', 1.4,
    'How does your energy behave across a day?',
    {
      vata: 'In bursts — high then suddenly flat',
      pitta: 'Strong and focused, especially in the middle of the day',
      kapha: 'Steady and durable once I have started',
    }),

  q('stamina', 'prakriti', 'physiological', 1.4,
    'What is your physical stamina like?',
    {
      vata: 'I start fast and run out',
      pitta: 'Good, but I push myself past sensible limits',
      kapha: 'Excellent once warmed up — I can keep going a long time',
    }),

  q('cold-tolerance', 'prakriti', 'physiological', 1.5,
    'How do you cope with cold weather?',
    {
      vata: 'Badly — I feel it before anyone else does',
      pitta: 'Well — I often welcome it',
      kapha: 'Poorly if it is also damp, but I tolerate dry cold',
    }),

  q('heat-tolerance', 'prakriti', 'physiological', 1.5,
    'How do you cope with hot weather?',
    {
      vata: 'Reasonably well, as long as it is not dry and windy',
      pitta: 'Badly — I overheat and get irritable',
      kapha: 'Well — I rather like the warmth',
    }),

  q('circulation', 'prakriti', 'physiological', 1.2,
    'How is your circulation?',
    {
      vata: 'Poor — cold extremities, and I go numb easily',
      pitta: 'Strong — I run warm and flush readily',
      kapha: 'Steady and unremarkable',
    },
    { optional: true }),

  q('resilience', 'prakriti', 'physiological', 1.3,
    'How does your body respond to a run of late nights and irregular meals?',
    {
      vata: 'It knocks me sideways quickly',
      pitta: 'I cope for a while, then get sharp and inflamed-feeling',
      kapha: 'I absorb it fairly well, though I get sluggish',
    }),

  q('recovery', 'prakriti', 'physiological', 1.2,
    'When you are run down, how do you recover?',
    {
      vata: 'Slowly, and I need real rest',
      pitta: 'Quickly, once I stop pushing',
      kapha: 'Slowly but steadily, given time',
    },
    { optional: true }),
]
