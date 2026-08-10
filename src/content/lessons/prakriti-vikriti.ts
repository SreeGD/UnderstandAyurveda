import type { Lesson } from '../schema/lesson'
import { CHARAKA_SUTRA, CHARAKA_VIMANA, EDITORIAL, LAD, NCCIH } from '../sources'

export const prakritiVikritiLesson: Lesson = {
  id: 'prakriti-vikriti',
  title: 'Your baseline and your current state',
  topic: 'prakriti-vikriti',
  order: 11,
  estimatedMinutes: 8,
  summary:
    'The distinction that makes the whole system usable — and the one most self-assessments quietly get wrong.',
  prerequisiteConcepts: [{ lessonId: 'three-doshas', label: 'The three doshas' }],
  quizId: 'quiz-prakriti-vikriti',
  body: [
    {
      kind: 'paragraph',
      text: 'Ayurveda asks two different questions about you, and running them together is the single most common mistake beginners make. It is also, unfortunately, what most online dosha quizzes do.',
      framing: true,
    },

    { kind: 'heading', text: 'Prakriti — what you are' },
    { kind: 'termIntro', termId: 'prakriti' },
    {
      kind: 'paragraph',
      text: '[[prakriti]] is your constitution: the proportion of the three doshas described as established very early and staying broadly stable across your life. Classical sources attribute it to conditions at conception and during gestation, and modern introductions agree — Vasant Lad puts it as determined at conception and remaining the same throughout one\'s life.',
      source: LAD('Your Constitution and Its Inner Balance'),
    },
    {
      kind: 'paragraph',
      text: 'Crucially, prakriti is not a problem to be solved. It is not better to be one thing rather than another, and it is not something to correct. It is the baseline you work with, in the same way your height is.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Vikriti — how you are' },
    { kind: 'termIntro', termId: 'vikriti' },
    {
      kind: 'paragraph',
      text: '[[vikriti]] is your current state: how the doshas are actually sitting right now, which may be some way from your baseline. This is the changeable part, and it is what lifestyle adjustment is aimed at.',
      source: CHARAKA_SUTRA('7'),
    },
    {
      kind: 'example',
      scenario: 'Why the difference is not academic',
      text: 'A naturally solid, steady, slow-moving person has three weeks of travel, short nights, and meals at odd hours. They now feel dried out, wired, and scattered. If they take a dosha quiz that week, they will answer like a Vata-forward person and be told that is what they are. It is not. Their prakriti is unchanged; their vikriti has shifted. And the guidance they need is the opposite of what a mistaken prakriti reading would give them.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Reading them together' },
    {
      kind: 'paragraph',
      text: 'The useful information is in the gap between the two. A dosha that reads higher now than at baseline is the one to address; a baseline that is simply high in something is not a problem at all.',
      source: CHARAKA_VIMANA('8'),
    },
    {
      kind: 'table',
      caption: 'What each combination means',
      headers: ['Baseline', 'Currently', 'Reading'],
      rows: [
        ['Kapha-forward', 'Kapha-forward', 'You are yourself. No shift to address.'],
        ['Kapha-forward', 'Vata elevated', 'Something has unsettled you. Address the Vata.'],
        ['Vata-forward', 'Vata elevated', 'Your own pattern has been amplified — often the hardest to notice from inside.'],
        ['Pitta-forward', 'Kapha elevated', 'Unusual. Often follows a long stretch of inactivity or rich food.'],
      ],
      source: EDITORIAL,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'How to answer each assessment',
      text: 'For prakriti, answer about your whole adult life — what has been true for years, not what is true this month. For vikriti, answer only about the last two to four weeks. If you catch yourself thinking "well, lately…" during the prakriti assessment, that is the signal you have slipped into the wrong question.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'What a questionnaire can and cannot do' },
    {
      kind: 'paragraph',
      text: 'A trained practitioner assesses constitution in person. The US National Institutes of Health describes the method: asking about diet, behaviour, lifestyle, recent illnesses and resilience; observing teeth, tongue, skin, eyes, weight and overall appearance; and checking urine, stool, speech, voice, and pulse. A questionnaire has none of that. What it can give you is a reasonable first sketch and, more usefully, a vocabulary for noticing things about yourself.',
      source: NCCIH('Treatment — The patient\'s dosha balance'),
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'Beware of results that sound too certain',
      text: 'Any tool that hands you a single confident label from twenty questions is overselling. Real readings come out mixed, sometimes close, and sometimes inconsistent between the physical and the mental. This app shows you all three percentages and tells you when it is uncertain — not out of modesty, but because the alternative is misleading you.',
      source: EDITORIAL,
    },
  ],
}
