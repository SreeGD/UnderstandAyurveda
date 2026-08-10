import type { Lesson } from '../schema/lesson'
import { CHARAKA_VIMANA, EDITORIAL } from '../sources'

export const srotasLesson: Lesson = {
  id: 'srotas',
  title: 'The channels',
  topic: 'srotas',
  order: 8,
  estimatedMinutes: 5,
  summary:
    'Srotas — why Ayurveda cares more about whether something flows freely than about what it is made of.',
  prerequisiteConcepts: [{ lessonId: 'seven-dhatus', label: 'The seven tissues' }],
  quizId: 'quiz-srotas',
  body: [
    { kind: 'termIntro', termId: 'srotas' },
    {
      kind: 'paragraph',
      text: '[[srotas]] are channels — the pathways along which anything in the body travels. Ayurveda names channels for breath, food, water, blood, each of the seven tissues, and the wastes, along with channels for thought and for the mind.',
      source: CHARAKA_VIMANA('5'),
    },
    {
      kind: 'paragraph',
      text: 'The distinctive move here is one of emphasis. The framework is far less interested in what a channel is made of than in whether it is flowing — and if not, in which of three ways it has gone wrong.',
      source: CHARAKA_VIMANA('5'),
    },

    { kind: 'heading', text: 'Three ways a channel misbehaves' },
    {
      kind: 'sourceNote',
      source: CHARAKA_VIMANA('5'),
      text: 'The classification of channel disturbance appears in the Vimanasthana discussion of srotas.',
    },
    {
      kind: 'table',
      caption: 'How flow goes wrong',
      headers: ['Problem', 'Sanskrit', 'Everyday analogy', 'Usually linked to'],
      rows: [
        ['Too much flow', 'atipravritti', 'A tap left running', 'Pitta, or Vata'],
        ['Blocked flow', 'sanga', 'A drain clogged with grease', 'Kapha, or ama'],
        ['Flow going the wrong way', 'vimarga gamana', 'Water backing up a pipe', 'Vata'],
      ],
    },
    {
      kind: 'example',
      scenario: 'Same channel, three failures',
      text: 'Think of the channel that carries food onward. Running too fast, it empties before much is taken from it. Blocked, things sit and stagnate. Reversed, what should go down comes back up. Three quite different experiences, one framework, and no need for a microscope to tell them apart.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Why this connects to everything else' },
    {
      kind: 'paragraph',
      text: 'This is where ama earns its place in the model. Residue from weak digestion is described as travelling and lodging in channels, producing blockage wherever it settles — which is how a digestive problem in this framework ends up explaining heaviness somewhere else entirely.',
      source: CHARAKA_VIMANA('5'),
    },
    {
      kind: 'paragraph',
      text: 'It also explains why so much practical guidance is about movement, warmth, and regularity. All three are things that keep matter moving along a pathway rather than settling in it.',
      source: EDITORIAL,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'A framework, not a map',
      text: 'Srotas do not correspond to named anatomical vessels, and trying to line them up with a modern diagram misses what the category is for. It is a way of asking "is this moving as it should?" — a question that turns out to be surprisingly productive.',
      source: EDITORIAL,
    },
  ],
}
