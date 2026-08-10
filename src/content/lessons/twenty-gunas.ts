import type { Lesson } from '../schema/lesson'
import { CHARAKA_SUTRA, EDITORIAL } from '../sources'

export const twentyGunas: Lesson = {
  id: 'twenty-gunas',
  title: 'The twenty qualities',
  topic: 'twenty-gunas',
  order: 4,
  estimatedMinutes: 8,
  summary:
    'Ten pairs of opposites that let you describe anything — a food, a season, a mood — in terms Ayurveda can act on.',
  prerequisiteConcepts: [{ lessonId: 'three-doshas', label: 'The three doshas' }],
  quizId: 'quiz-twenty-gunas',
  body: [
    { kind: 'termIntro', termId: 'guna' },
    {
      kind: 'paragraph',
      text: 'This is the most practical lesson in the course. The twenty [[guna|gunas]] are the working vocabulary — once you can read qualities, you can work out what to do without looking anything up.',
      framing: true,
    },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('1'),
      text: 'The twenty qualities are enumerated in the first chapter of the Charaka Samhita Sutrasthana.',
    },
    {
      kind: 'table',
      caption: 'The ten pairs',
      headers: ['Quality', 'Opposite', 'Everyday example'],
      rows: [
        ['Heavy (guru)', 'Light (laghu)', 'Cheese vs. clear soup'],
        ['Cold (sheeta)', 'Hot (ushna)', 'Iced water vs. ginger tea'],
        ['Oily (snigdha)', 'Dry (ruksha)', 'Buttered toast vs. a cracker'],
        ['Slow (manda)', 'Sharp (tikshna)', 'A long stew vs. hot mustard'],
        ['Stable (sthira)', 'Mobile (chala)', 'An oak table vs. a curtain in a draught'],
        ['Soft (mridu)', 'Hard (kathina)', 'A ripe peach vs. an unripe pear'],
        ['Clear (vishada)', 'Slimy (picchila)', 'Water vs. cut okra'],
        ['Smooth (shlakshna)', 'Rough (khara)', 'A polished stone vs. unfinished timber'],
        ['Subtle (sukshma)', 'Gross (sthula)', 'The smell of coffee vs. the sack of beans'],
        ['Dense (sandra)', 'Liquid (drava)', 'Cold honey vs. warmed honey'],
      ],
    },

    { kind: 'heading', text: 'How to actually use them' },
    {
      kind: 'paragraph',
      text: 'Each dosha is defined by a handful of these qualities. Anything sharing those qualities increases that dosha; anything with the opposite qualities settles it. That is the whole mechanism.',
      source: CHARAKA_SUTRA('1'),
    },
    {
      kind: 'table',
      caption: 'Which qualities belong to which dosha',
      headers: ['Dosha', 'Its qualities', 'So it is settled by'],
      rows: [
        ['Vata', 'Dry, light, cold, mobile, rough, subtle', 'Moist, heavy, warm, stable, smooth'],
        ['Pitta', 'Hot, sharp, light, spreading, slightly oily', 'Cool, slow, somewhat heavy, dry'],
        ['Kapha', 'Heavy, cold, oily, slow, stable, smooth, dense', 'Light, warm, dry, sharp, mobile'],
      ],
      source: CHARAKA_SUTRA('20'),
    },
    {
      kind: 'example',
      scenario: 'Working it out from first principles',
      text: 'It is January, windy, and you have been travelling. You feel dried out, cold, and scattered. Those are Vata qualities — dry, cold, mobile. So you want the opposites: something warm, moist, and heavy, eaten sitting still. That is soup, and you did not need a food list to get there.',
      source: EDITORIAL,
    },
    {
      kind: 'example',
      scenario: 'And the other direction',
      text: 'It is August, you are overheated and short-tempered after a long day. Hot and sharp. The opposites are cool and slow: a cold shower, a walk by water, something bland to eat rather than another coffee.',
      source: EDITORIAL,
    },

    { kind: 'heading', text: 'Qualities apply to everything, not just food' },
    {
      kind: 'list',
      ordered: false,
      items: [
        'Weather: a dry windy day is Vata-ish; a humid heatwave is Pitta-ish; a cold damp week is Kapha-ish.',
        'Activity: sprinting is sharp and mobile; weight training is heavy and stable; a slow walk is neither.',
        'Company: a loud crowded party is mobile and sharp; a quiet dinner with one friend is stable and slow.',
        'Media: rapid short video is mobile and sharp; a long novel is slow and stable.',
      ],
      source: EDITORIAL,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'This is the lesson worth re-reading',
      text: 'If the doshas ever feel abstract, come back here. The doshas are just names for bundles of these qualities, and the qualities are things you can directly perceive.',
      source: EDITORIAL,
    },
  ],
}
