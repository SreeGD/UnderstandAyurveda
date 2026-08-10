import type { Lesson } from '../schema/lesson'
import { ASHTANGA_SUTRA, CHARAKA_CHIKITSA, CHARAKA_SUTRA, EDITORIAL } from '../sources'

export const agniAma: Lesson = {
  id: 'agni-ama',
  title: 'Digestive fire and its residue',
  topic: 'agni-ama',
  order: 6,
  estimatedMinutes: 7,
  summary:
    'Agni and ama — why Ayurveda regards digestive capacity as the hinge that everything else turns on.',
  prerequisiteConcepts: [{ lessonId: 'six-tastes', label: 'The six tastes' }],
  quizId: 'quiz-agni-ama',
  body: [
    { kind: 'termIntro', termId: 'agni' },
    {
      kind: 'paragraph',
      text: 'If the doshas are the vocabulary, [[agni]] is the thing Ayurveda actually worries about. The classical position is blunt: it is not what you eat that determines how you fare, it is what you can process.',
      source: CHARAKA_CHIKITSA('15'),
    },
    {
      kind: 'example',
      scenario: 'The same meal, two people',
      text: 'Two people eat identical heavy dinners. One is comfortable an hour later; the other feels leaden until morning. Nothing about the food explains the difference. Ayurveda puts the difference in agni, and then asks what raises or lowers it.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Four states of digestive fire' },
    {
      kind: 'sourceNote',
      source: CHARAKA_CHIKITSA('15'),
      text: 'The four states of agni are set out in the Chikitsasthana discussion of digestion.',
    },
    {
      kind: 'table',
      caption: 'How agni is described as behaving',
      headers: ['State', 'Sanskrit', 'What it looks like', 'Associated with'],
      rows: [
        ['Balanced', 'sama', 'Regular appetite, comfortable digestion, steady energy', 'Balance'],
        ['Irregular', 'vishama', 'Appetite comes and goes; bloating and gas', 'Vata'],
        ['Sharp', 'tikshna', 'Ravenous, digests fast, burning, irritable when late', 'Pitta'],
        ['Slow', 'manda', 'Little appetite, heaviness after meals, sluggishness', 'Kapha'],
      ],
    },
    {
      kind: 'paragraph',
      text: 'Notice that three of the four map onto the three doshas. That is not a coincidence — it is the same qualities showing up in a specific function.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Ama — what is left when digestion falls short' },
    { kind: 'termIntro', termId: 'ama' },
    {
      kind: 'paragraph',
      text: '[[ama]] literally means unripe or uncooked. The classical model describes it as accumulating when agni is too weak for what it was given, and then travelling and lodging in the channels, producing heaviness and dullness wherever it settles.',
      source: CHARAKA_SUTRA('28'),
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        'A thick coating on the tongue in the morning',
        'Heaviness and fog rather than rest after sleep',
        'Loss of appetite without any obvious reason',
        'A sense of being clogged or slow-moving',
        'Food repeating on you long after a meal',
      ],
      source: CHARAKA_SUTRA('28'),
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'Ama is not "toxins", whatever the internet says',
      text: 'Ama gets translated as "toxins" and then sold alongside detox products. The classical concept is narrower and more specific: undigested residue arising from weak digestion. It is not a stand-in for pollution, heavy metals, or anything a modern lab measures — and no reputable reading of the texts supports a supplement aisle.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'What the sources actually recommend' },
    {
      kind: 'sourceNote',
      source: ASHTANGA_SUTRA('8'),
      text: 'Guidance on eating in the Ashtanga Hridayam Sutrasthana.',
    },
    {
      kind: 'paragraph',
      text: 'The classical guidance on protecting digestion is unglamorous and largely about timing and restraint rather than about substances.',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        'Eat when you are actually hungry, and not otherwise.',
        'Leave a real gap between meals rather than grazing.',
        'Eat the larger meal in the middle of the day, when digestion is described as strongest.',
        'Stop somewhat before you are full.',
        'Eat sitting down, without hurry, and without a screen.',
        'Favour warm, freshly cooked food over cold and long-stored food.',
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Your tongue, each morning',
      text: 'Look at your tongue before you brush your teeth. Thick coating after a late heavy dinner, clean after an early light one — that is the most direct daily feedback this framework offers, and it costs nothing.',
      source: ASHTANGA_SUTRA('2'),
    },
  ],
}
