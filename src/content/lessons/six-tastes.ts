import type { Lesson } from '../schema/lesson'
import { CHARAKA_SUTRA, EDITORIAL } from '../sources'

export const sixTastes: Lesson = {
  id: 'six-tastes',
  title: 'The six tastes',
  topic: 'six-tastes',
  order: 5,
  estimatedMinutes: 8,
  summary:
    'Sweet, sour, salty, pungent, bitter, astringent — and why Ayurveda reads taste as information rather than preference.',
  prerequisiteConcepts: [{ lessonId: 'twenty-gunas', label: 'The twenty qualities' }],
  quizId: 'quiz-six-tastes',
  body: [
    { kind: 'termIntro', termId: 'shad-rasa' },
    {
      kind: 'paragraph',
      text: 'Ayurveda counts six tastes, not the four or five you may have learned. Astringent — the puckering dryness of strong tea or an unripe banana — is treated as its own category, and it is the one Western palates tend not to have a word for.',
      source: CHARAKA_SUTRA('26'),
    },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('26'),
      text: 'Chapter 26 of the Charaka Samhita Sutrasthana sets out the six tastes and their effects in detail.',
    },
    {
      kind: 'table',
      caption: 'The six tastes and what they do',
      headers: ['Taste', 'Elements', 'Effect', 'Found in', 'Increases', 'Settles'],
      rows: [
        ['Sweet (madhura)', 'Earth + Water', 'Building, settling', 'Grains, milk, ripe fruit, roots', 'Kapha', 'Vata, Pitta'],
        ['Sour (amla)', 'Earth + Fire', 'Warming, appetite-rousing', 'Citrus, yoghurt, ferments', 'Pitta, Kapha', 'Vata'],
        ['Salty (lavana)', 'Water + Fire', 'Moistening, softening', 'Salt, sea foods', 'Pitta, Kapha', 'Vata'],
        ['Pungent (katu)', 'Fire + Air', 'Heating, drying', 'Chilli, ginger, pepper, mustard', 'Vata, Pitta', 'Kapha'],
        ['Bitter (tikta)', 'Air + Space', 'Cooling, lightening', 'Leafy greens, turmeric', 'Vata', 'Pitta, Kapha'],
        ['Astringent (kashaya)', 'Air + Earth', 'Drying, contracting', 'Beans, pomegranate, strong tea', 'Vata', 'Pitta, Kapha'],
      ],
    },

    { kind: 'heading', text: 'Reading the table instead of memorising it' },
    {
      kind: 'paragraph',
      text: 'You do not need to learn that column. Each taste carries the qualities of its elements, and the effects follow from those. Pungent is fire plus air, so of course it is heating and drying — and of course that settles a heavy cold pattern and aggravates an already hot one.',
      source: EDITORIAL,
    },
    { kind: 'termIntro', termId: 'madhura' },
    { kind: 'termIntro', termId: 'amla' },
    { kind: 'termIntro', termId: 'lavana' },
    { kind: 'termIntro', termId: 'katu' },
    { kind: 'termIntro', termId: 'tikta' },
    { kind: 'termIntro', termId: 'kashaya' },

    { kind: 'heading', text: 'Taste is only the first of three effects' },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('26'),
    },
    { kind: 'termIntro', termId: 'virya' },
    {
      kind: 'paragraph',
      text: '[[virya]] is what a food does to your temperature once it is inside you, which is not always what the tongue reports. Lemon tastes sharp and sour but is classically described as warming. Mint feels cold in the mouth and is described as cooling — those two happen to agree, but they need not.',
    },
    { kind: 'termIntro', termId: 'vipaka' },
    {
      kind: 'paragraph',
      text: '[[vipaka]] is the effect after digestion is finished — the longer tail. It is why the useful question about a meal is not only how it tasted, but how you felt the next morning.',
    },

    { kind: 'heading', text: 'What to do with this' },
    {
      kind: 'paragraph',
      text: 'The classical general advice is to include all six tastes across the day rather than living on two of them. Most modern eating is heavy on sweet, sour, and salty, and light on bitter and astringent — which is a large part of why greens and beans show up in almost every recommendation set.',
      source: CHARAKA_SUTRA('26'),
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Favour and reduce, not allowed and forbidden',
      text: 'Ayurveda talks about favouring and reducing tastes, not banning foods. A Pitta-forward person eating a chilli is not making a mistake; a Pitta-forward person eating chilli at every meal through August might notice something.',
      source: EDITORIAL,
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'Two different "rasa"s',
      text: 'Rasa means taste — and it also names the first body tissue, plasma. The word does double duty and the sources rely on context to tell them apart. If a passage about rasa suddenly seems to be discussing anatomy, that is why.',
      source: EDITORIAL,
    },
  ],
}
