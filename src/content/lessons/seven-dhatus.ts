import type { Lesson } from '../schema/lesson'
import { CHARAKA_SUTRA, EDITORIAL, SUSHRUTA_SUTRA } from '../sources'

export const sevenDhatus: Lesson = {
  id: 'seven-dhatus',
  title: 'The seven tissues',
  topic: 'seven-dhatus',
  order: 7,
  estimatedMinutes: 6,
  summary:
    'A production line where each tissue feeds the next — and why that model puts so much weight on the first stage.',
  prerequisiteConcepts: [{ lessonId: 'agni-ama', label: 'Digestive fire' }],
  quizId: 'quiz-seven-dhatus',
  body: [
    { kind: 'termIntro', termId: 'dhatu' },
    {
      kind: 'paragraph',
      text: 'Ayurveda describes seven tissues forming in a fixed sequence, each one made from the one before it. Think of a production line: whatever the first stage produces is the raw material for the second, and so on down.',
      source: SUSHRUTA_SUTRA('14'),
    },
    {
      kind: 'sourceNote',
      source: SUSHRUTA_SUTRA('14'),
      text: 'The dhatu sequence is set out in the Sushruta Samhita Sutrasthana.',
    },
    {
      kind: 'table',
      caption: 'The seven, in order',
      headers: ['#', 'Sanskrit', 'Tissue', 'Described as providing'],
      rows: [
        ['1', 'Rasa', 'Plasma / nutrient fluid', 'Nourishment and contentment'],
        ['2', 'Rakta', 'Blood', 'Vitality and colour'],
        ['3', 'Mamsa', 'Muscle', 'Covering and strength'],
        ['4', 'Meda', 'Fat', 'Lubrication and reserve'],
        ['5', 'Asthi', 'Bone', 'Structure and support'],
        ['6', 'Majja', 'Marrow and nerve tissue', 'Filling and connection'],
        ['7', 'Shukra', 'Reproductive tissue', 'Continuation, and the source of ojas'],
      ],
    },
    { kind: 'termIntro', termId: 'rasa-dhatu' },
    { kind: 'termIntro', termId: 'rakta' },
    { kind: 'termIntro', termId: 'mamsa' },
    { kind: 'termIntro', termId: 'meda' },
    { kind: 'termIntro', termId: 'asthi' },
    { kind: 'termIntro', termId: 'majja' },
    { kind: 'termIntro', termId: 'shukra' },

    { kind: 'heading', text: 'Why the sequence matters' },
    {
      kind: 'paragraph',
      text: 'The interesting claim in this model is the dependency. If digestion is weak, the first tissue is poorly formed — and everything downstream is built from that. It gives the framework a reason to keep returning to digestion rather than to the tissue that seems to be complaining.',
      source: EDITORIAL,
    },
    {
      kind: 'example',
      scenario: 'Reading the model',
      text: 'Someone reports brittle nails and thinning hair. A tissue-first reading would look at bone and its by-products. The dhatu model asks instead what is arriving at that stage — which sends you back up the line to digestion. Whether or not you accept the physiology, the reasoning is consistent.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Ojas and the wastes' },
    { kind: 'termIntro', termId: 'ojas' },
    {
      kind: 'paragraph',
      text: '[[ojas]] is described as the refined essence produced at the end of the sequence — the basis of stamina and resilience. It is the classical answer to why one person is flattened by a hard week and another is not.',
      source: CHARAKA_SUTRA('17'),
    },
    { kind: 'termIntro', termId: 'mala' },
    {
      kind: 'paragraph',
      text: 'Alongside the tissues, each stage produces waste — [[mala]]. Ayurveda takes the regularity of the wastes as everyday evidence about how the whole line is running, which is why classical consultations ask about them so directly.',
      source: SUSHRUTA_SUTRA('15'),
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'These are not modern histology',
      text: 'The seven dhatus are a functional model, not a description of tissue types as biology understands them. "Rasa" is not plasma in the laboratory sense. Read the model for its reasoning about dependency and sequence, not as an anatomy chart.',
      source: EDITORIAL,
    },
  ],
}
