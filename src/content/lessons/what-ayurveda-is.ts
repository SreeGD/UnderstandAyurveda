import type { Lesson } from '../schema/lesson'
import { CHARAKA_SUTRA, CONTESTED, EDITORIAL, EIVS, MODERN, NCCIH } from '../sources'

export const whatAyurvedaIs: Lesson = {
  id: 'what-ayurveda-is',
  title: 'What Ayurveda is, and what it is not',
  topic: 'what-ayurveda-is',
  order: 1,
  estimatedMinutes: 6,
  summary:
    'Where Ayurveda came from, what kind of knowledge it is, and the honest limits of what a book or an app can tell you.',
  prerequisiteConcepts: [],
  quizId: 'quiz-what-ayurveda-is',
  body: [
    { kind: 'termIntro', termId: 'ayurveda' },
    {
      kind: 'paragraph',
      text: 'Ayurveda is a body of thought about living well that took shape on the Indian subcontinent over roughly two thousand years. Its major surviving texts — the Charaka Samhita, the Sushruta Samhita, and the later Ashtanga Hridayam — are compilations rather than single-author works, assembled and re-edited across centuries.',
      source: MODERN(
        'Standard scholarly account of the Ayurvedic corpus',
        'Dating and authorship of the Brihat Trayi are debated among historians'
      ),
    },
    {
      kind: 'paragraph',
      text: 'It is worth being clear about what kind of knowledge this is. Ayurveda is a systematic framework built on careful observation, organised around a small set of concepts that it applies consistently. It is not modern biomedical science, it did not develop through controlled trials, and its categories do not map onto anatomy or biochemistry.',
      source: EDITORIAL,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'What the evidence actually looks like',
      text: 'The US National Institutes of Health summarises the research position bluntly: most clinical trials of Ayurvedic approaches have been small, have had problems with research design, have lacked appropriate control groups, or have had other issues affecting how meaningful the results were. Evidence for effectiveness therefore varies, and more rigorous research is needed. That is worth knowing before you read anyone claiming otherwise — in either direction.',
      source: NCCIH('Side Effects and Risks — Scientific evidence'),
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'How old is it, really?',
      text: 'You will very often read that Ayurveda is 5,000 years old. Standard scholarly dating is considerably more modest: the Charaka Samhita was compiled somewhere between roughly 400 BCE and 200 CE, with older oral antecedents behind it. Two thousand years is still extraordinary. The larger number is repeated because it sounds better, and noticing that habit is a useful early skill in this subject.',
      source: CONTESTED(
        'Scholarly dating versus popular accounts',
        'Compilation dates of the Brihat Trayi',
        'Popular introductions — including public-health fact sheets — commonly state 5,000 years or more; historians of Indian medicine date the surviving compilations considerably later.'
      ),
    },

    { kind: 'heading', text: 'The one idea underneath everything' },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('1'),
      text: 'The like-increases-like principle appears throughout the classical corpus as an organising rule.',
    },
    {
      kind: 'paragraph',
      text: 'If you take away one thing from this whole course, take this: like increases like, and opposites balance.',
    },
    {
      kind: 'paragraph',
      text: 'Dry weather makes a dry person drier. Heat makes a hot-running person hotter. Heavy food makes a heavy person heavier. And the way back is always the opposite quality — warmth for cold, moisture for dryness, stimulation for sluggishness.',
    },
    {
      kind: 'example',
      scenario: 'You already do this',
      text: 'You reach for soup on a cold wet evening and a salad in a heatwave. Nobody taught you that. Ayurveda simply took that instinct, gave the qualities names, and applied them systematically to everything — food, weather, activity, sleep, even company.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'What this course covers' },
    {
      kind: 'paragraph',
      text: 'The next few lessons build up the vocabulary in order: the five elements, then the three doshas made from them, then the qualities that describe them, then the tastes, digestion, tissues, and channels. Once you have those, the daily and seasonal routines stop being lists of rules and start being obvious consequences.',
      framing: true,
    },

    { kind: 'heading', text: 'The limits, stated plainly' },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'This is not medical care',
      text: 'Ayurveda in its full clinical form is a profession, practised by people who train for years and assess patients in person over time. What you can get from an app is the conceptual vocabulary and some low-risk lifestyle guidance. That is genuinely useful. It is not the same thing.',
      source: EDITORIAL,
    },
    { kind: 'termIntro', termId: 'panchakarma' },
    {
      kind: 'paragraph',
      text: 'You will see [[panchakarma]] advertised as a spa package. A practitioner training curriculum for it runs to staged preparation, main procedures, and structured aftercare — and the main procedures are therapeutic vomiting, purgation, and enema. The gap between that and a massage retreat is a fair illustration of how much gets lost in translation.',
      source: EIVS('Contents — Purva Karma, Pradhana Karma, Paschata Karma'),
    },
    {
      kind: 'callout',
      tone: 'misconception',
      title: '"Ancient wisdom" is doing a lot of work in most marketing',
      text: 'A great deal of what circulates online as ancient Ayurvedic teaching is 20th-century synthesis, sometimes decades old rather than millennia. That does not make it worthless — but it is worth knowing which is which. Throughout this course, anything that is a modern reading rather than a classical teaching is labelled as one.',
      source: EDITORIAL,
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        'Ayurveda will not tell you a diagnosis, and neither will this app.',
        'No herb or supplement dosing appears anywhere here — that needs a practitioner who knows your situation.',
        'Nothing here should be used to change medicine a doctor has given you.',
        'If something is severe, sudden, or getting worse, that is a question for a clinician.',
      ],
      source: EDITORIAL,
    },
  ],
}
