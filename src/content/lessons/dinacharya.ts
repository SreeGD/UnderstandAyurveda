import type { Lesson } from '../schema/lesson'
import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'

export const dinacharyaLesson: Lesson = {
  id: 'dinacharya',
  title: 'The shape of a day',
  topic: 'dinacharya',
  order: 9,
  estimatedMinutes: 8,
  summary:
    'Dinacharya — the daily routine, and the dosha clock that explains why the timing is what it is.',
  prerequisiteConcepts: [{ lessonId: 'three-doshas', label: 'The three doshas' }],
  quizId: 'quiz-dinacharya',
  body: [
    { kind: 'termIntro', termId: 'dinacharya' },
    {
      kind: 'paragraph',
      text: 'Ayurveda has a strong view that regular timing does more for you than any single intervention. Once you know the reasoning, the classical daily routine stops reading as a list of rules and starts reading as a set of consequences.',
      framing: true,
    },

    { kind: 'heading', text: 'The dosha clock' },
    {
      kind: 'paragraph',
      text: 'The day is described as divided into six four-hour stretches, each dominated by one dosha, cycling twice.',
      source: ASHTANGA_SUTRA('2'),
    },
    {
      kind: 'table',
      caption: 'The classical daily cycle',
      headers: ['Roughly', 'Dominant', 'What that suggests'],
      rows: [
        ['6am – 10am', 'Kapha', 'Heavy and slow. A hard time to start, and the best time to move.'],
        ['10am – 2pm', 'Pitta', 'Digestion strongest. Eat the main meal here.'],
        ['2pm – 6pm', 'Vata', 'Mobile and light. Good for thinking, poor for heavy food.'],
        ['6pm – 10pm', 'Kapha', 'Settling again. Wind down; a heavy late meal sits badly.'],
        ['10pm – 2am', 'Pitta', 'A second wind if you are still up — and why late nights escalate.'],
        ['2am – 6am', 'Vata', 'Light and mobile. Waking is easiest towards the end of it.'],
      ],
      source: ASHTANGA_SUTRA('2'),
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'The 10pm rule, explained',
      text: 'Almost every Ayurvedic source says get to bed by around 10pm. The reason is the clock: the Pitta stretch beginning around then is exactly the second wind you feel if you are still awake. Ride it and you are up until one. Beat it and you sleep.',
      source: ASHTANGA_SUTRA('2'),
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'The clock assumes a place and a latitude',
      text: 'These times come from a subtropical setting where daylight varies far less than it does at high latitudes. A Scandinavian December does not have this day. Read the clock as relative to sunrise and sunset where you actually are, not as fixed hours.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'The classical morning' },
    {
      kind: 'sourceNote',
      source: ASHTANGA_SUTRA('2'),
      text: 'The daily routine is set out in chapter 2 of the Ashtanga Hridayam Sutrasthana.',
    },
    { kind: 'termIntro', termId: 'brahma-muhurta' },
    {
      kind: 'paragraph',
      text: 'Rise in [[brahma-muhurta]], the quiet period before sunrise. Then, in order: relieve yourself, clean the mouth and scrape the tongue, rinse the eyes and face, and only then start the day proper.',
    },
    { kind: 'termIntro', termId: 'jihva-nirlekhana' },
    { kind: 'termIntro', termId: 'abhyanga' },
    {
      kind: 'paragraph',
      text: '[[abhyanga]] — warm oil self-massage — is described as a daily practice rather than an occasional treat, done before bathing. Even a few minutes on feet and shoulders is closer to the classical intent than an elaborate monthly session.',
    },
    { kind: 'termIntro', termId: 'vyayama' },
    {
      kind: 'paragraph',
      text: '[[vyayama]] — exercise — comes with an unusual instruction: work to about half your capacity, not to exhaustion. The classical sources are consistent on this and it is one of the places where the advice cuts against modern fitness culture.',
    },
    { kind: 'termIntro', termId: 'nasya' },

    { kind: 'heading', text: 'What is genuinely worth doing' },
    {
      kind: 'paragraph',
      text: 'Nobody outside a residential setting is going to do the full classical routine, and pretending otherwise helps nobody. If you take three things:',
      framing: true,
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Wake and sleep at consistent times, including at weekends. This does more than everything else combined.',
        'Eat your main meal in the middle of the day, and keep the evening one earlier and lighter.',
        'Scrape your tongue each morning and notice what is there.',
      ],
      source: ASHTANGA_SUTRA('2'),
    },
    { kind: 'termIntro', termId: 'samskara' },
    {
      kind: 'paragraph',
      text: 'The underlying claim is about [[samskara]] — the grooves that repetition cuts. What you do daily shapes you far more than what you do occasionally, which is why the framework is so insistent about ordinary timing and so uninterested in heroics.',
      source: MODERN(
        'Common modern Ayurvedic teaching',
        'The framing of samskara as habit is a modern emphasis; the classical term is broader'
      ),
    },
    {
      kind: 'paragraph',
      text: 'Which of the three matters most depends on your pattern. Regularity is the highest-leverage change for a Vata-forward person, the midday meal for a Pitta-forward one, and the early start for a Kapha-forward one.',
      source: CHARAKA_SUTRA('21'),
    },
  ],
}
