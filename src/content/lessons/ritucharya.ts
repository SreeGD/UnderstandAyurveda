import type { Lesson } from '../schema/lesson'
import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'

export const ritucharyaLesson: Lesson = {
  id: 'ritucharya',
  title: 'The shape of a year',
  topic: 'ritucharya',
  order: 10,
  estimatedMinutes: 7,
  summary:
    'Ritucharya — seasonal adjustment, and an honest look at how a six-season Indian scheme maps onto wherever you live.',
  prerequisiteConcepts: [
    { lessonId: 'twenty-gunas', label: 'The twenty qualities' },
    { lessonId: 'dinacharya', label: 'The shape of a day' },
  ],
  quizId: 'quiz-ritucharya',
  body: [
    { kind: 'termIntro', termId: 'ritucharya' },
    {
      kind: 'paragraph',
      text: 'The reasoning is the like-increases-like principle applied to weather. A season has qualities; those qualities add to whatever you already have. A dry windy autumn dries out an already dry person. A humid August adds heat to someone who runs hot.',
      source: ASHTANGA_SUTRA('3'),
    },
    { kind: 'termIntro', termId: 'ritu' },

    { kind: 'heading', text: 'The classical six seasons' },
    {
      kind: 'sourceNote',
      source: ASHTANGA_SUTRA('3'),
      text: 'The six-season scheme and its regimens appear in chapter 3 of the Ashtanga Hridayam Sutrasthana.',
    },
    {
      kind: 'table',
      caption: 'The six ritus of the classical Indian year',
      headers: ['Season', 'Sanskrit', 'Roughly', 'Qualities', 'Dosha behaviour'],
      rows: [
        ['Late winter', 'Shishira', 'Jan – Mar', 'Cold, dry', 'Kapha accumulates'],
        ['Spring', 'Vasanta', 'Mar – May', 'Warming, damp', 'Kapha loosens'],
        ['Summer', 'Grishma', 'May – Jul', 'Hot, dry', 'Vata accumulates'],
        ['Monsoon', 'Varsha', 'Jul – Sep', 'Damp, cool, unstable', 'Vata surges; Pitta accumulates'],
        ['Autumn', 'Sharad', 'Sep – Nov', 'Warm, bright after rain', 'Pitta surges'],
        ['Early winter', 'Hemanta', 'Nov – Jan', 'Cold, stable', 'Strongest digestion of the year'],
      ],
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'This calendar is not universal, and saying otherwise is dishonest',
      text: 'These six seasons describe the Indian subcontinent. There is no monsoon in Manchester and no Hemanta in Melbourne. Any source that hands you these dates without mentioning that has stopped thinking. What transfers is the method — read the qualities of the weather you actually have — not the calendar.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Accumulate, surge, subside' },
    {
      kind: 'paragraph',
      text: 'The classical model describes each dosha moving through three stages across the year: quietly accumulating in one season, surging in the next, then subsiding. It is why the sources sometimes recommend acting in a season before the one where you would expect trouble.',
      source: CHARAKA_SUTRA('6'),
    },
    {
      kind: 'example',
      scenario: 'Why spring gets so much attention',
      text: 'Kapha is described as accumulating through the cold months and then loosening as spring warms — which is the classical explanation for spring heaviness and congestion. Hence the emphasis on lighter, drier, more active living precisely when the weather turns pleasant.',
      source: CHARAKA_SUTRA('6'),
    },

    { kind: 'heading', text: 'Mapping onto four seasons' },
    {
      kind: 'paragraph',
      text: 'Most modern practice compresses the six into whatever four seasons the reader has. This app does the same, and marks it as the adaptation it is rather than dressing it up as classical.',
      source: MODERN(
        'Modern Ayurvedic teaching practice',
        'Four-season mapping is a widespread modern adaptation, not a classical scheme'
      ),
    },
    {
      kind: 'table',
      caption: 'A working four-season mapping',
      headers: ['Season', 'Dominant qualities', 'General direction'],
      rows: [
        ['Winter', 'Cold, heavy, damp or dry', 'Warmer, more substantial food; keep moving'],
        ['Spring', 'Warming, damp, heavy', 'Lighter, drier, more active — the biggest shift of the year'],
        ['Summer', 'Hot, sharp, bright', 'Cooler, less spiced; avoid midday exertion'],
        ['Autumn', 'Dry, windy, changeable', 'Warmer, moister, more regular; guard your routine'],
      ],
      source: MODERN('Modern Ayurvedic teaching practice', 'Composite of classical seasonal principles adapted to a temperate four-season year'),
    },

    { kind: 'heading', text: 'The junctions' },
    {
      kind: 'paragraph',
      text: 'Classical sources single out the changeover between seasons as the least settled time and advise easing changes in gradually rather than switching overnight. If you notice you always feel off in early spring or late autumn, that observation is worth more than any table here.',
      source: CHARAKA_SUTRA('6'),
    },
  ],
}
