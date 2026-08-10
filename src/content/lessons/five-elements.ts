import type { Lesson } from '../schema/lesson'
import { CHARAKA_SUTRA, EDITORIAL, SUSHRUTA_SUTRA } from '../sources'

export const fiveElements: Lesson = {
  id: 'five-elements',
  title: 'The five elements',
  topic: 'five-elements',
  order: 2,
  estimatedMinutes: 6,
  summary:
    'Space, air, fire, water, earth — five categories of behaviour that everything else in Ayurveda is built from.',
  prerequisiteConcepts: [{ lessonId: 'what-ayurveda-is', label: 'What Ayurveda is' }],
  quizId: 'quiz-five-elements',
  body: [
    { kind: 'termIntro', termId: 'pancha-mahabhuta' },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'These are not chemistry',
      text: 'When Ayurveda says "fire", it does not mean combustion, and "water" does not mean H₂O. The five elements are categories of behaviour — ways things can act. Fire is the category of "turns one thing into another". Water is the category of "holds things together and flows". Read them as verbs, not substances, and everything downstream makes sense.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'The five, in order of density' },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('1'),
      text: 'The five-element scheme and its ordering are foundational to the classical corpus.',
    },
    { kind: 'termIntro', termId: 'akasha' },
    {
      kind: 'paragraph',
      text: '[[akasha]] is space — the least dense of the five. It is not nothing; it is the room in which anything else can happen. A house is useful because of its empty parts.',
    },
    { kind: 'termIntro', termId: 'vayu' },
    {
      kind: 'paragraph',
      text: '[[vayu]] is air — movement and direction. Anything that travels, circulates, or blows through is expressing this element.',
    },
    { kind: 'termIntro', termId: 'tejas' },
    {
      kind: 'paragraph',
      text: '[[tejas]] is fire — heat, light, and transformation. Its signature is conversion: something goes in and something different comes out.',
    },
    { kind: 'termIntro', termId: 'jala' },
    {
      kind: 'paragraph',
      text: '[[jala]] is water — cohesion and flow. It binds separate things into one thing and lets them move as a body.',
    },
    { kind: 'termIntro', termId: 'prithvi' },
    {
      kind: 'paragraph',
      text: '[[prithvi]] is earth — solidity and mass. It resists change and holds a shape.',
    },

    { kind: 'heading', text: 'Everything has all five' },
    {
      kind: 'paragraph',
      text: 'The elements are never found alone. Anything you can point at is a mixture, and what makes things different is which elements lead.',
      source: SUSHRUTA_SUTRA('41'),
    },
    {
      kind: 'table',
      caption: 'The same object, read as a mixture',
      headers: ['Thing', 'Leading elements', 'Why'],
      rows: [
        ['A cracker', 'Earth, air', 'Solid and dry, with almost no moisture'],
        ['A bowl of soup', 'Water, fire', 'Liquid and warm, holding things together'],
        ['A gust of wind', 'Air, space', 'Movement through openness, nothing solid'],
        ['A stone', 'Earth', 'Mass and resistance, very little else'],
        ['A chilli', 'Fire, air', 'Heat plus the sharpness that makes it travel'],
      ],
      source: EDITORIAL,
    },
    {
      kind: 'example',
      scenario: 'Try it on your own lunch',
      text: 'Take whatever you last ate and ask: was it heavy or light, wet or dry, warm or cold, dense or airy? You have just described its elemental mixture without needing a single Sanskrit word. That is the skill this whole system runs on.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Where this is going' },
    {
      kind: 'paragraph',
      text: 'The next lesson pairs these five into three working patterns — the doshas. Space and air make the pattern of movement. Fire and water make the pattern of transformation. Water and earth make the pattern of structure. That is the entire jump, and the rest of Ayurveda hangs off it.',
      framing: true,
    },
  ],
}
