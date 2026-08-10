import type { GlossaryTerm } from '../schema/glossary'
import {
  ASHTANGA_SUTRA,
  LAD,
  CHARAKA_CHIKITSA,
  CHARAKA_SUTRA,
  CHARAKA_VIMANA,
  MODERN,
  SUSHRUTA_SUTRA,
} from '../sources'

export const coreTerms: GlossaryTerm[] = [
  {
    id: 'ayurveda',
    term: 'Ayurveda',
    devanagari: 'आयुर्वेद',
    aliases: ['ayurved', 'ayurvedic'],
    pronunciation: 'ah-yur-VAY-duh',
    meaning:
      'Literally "the knowledge of life" — a traditional Indian system of thought about health, daily living, and the relationship between a person and their environment.',
    example:
      'When someone says "eat warm food in winter and light food in summer," they are using an idea Ayurveda made explicit thousands of years ago: match what you take in to the conditions around you.',
    relatedTerms: ['dosha', 'prakriti', 'agni'],
    taughtIn: ['what-ayurveda-is'],
    source: CHARAKA_SUTRA('1'),
  },
  {
    id: 'dosha',
    term: 'Dosha',
    devanagari: 'दोष',
    aliases: ['dosa', 'dosham', 'doshas'],
    pronunciation: 'DOH-shuh',
    meaning:
      'One of three functional patterns Ayurveda uses to describe how a body and mind behave — movement, transformation, and structure. Not substances you could find under a microscope, but categories for tendencies you can actually observe.',
    example:
      'Think of how you might describe a car as "quick and twitchy," "hot-running," or "heavy and solid." Those are patterns of behaviour, not parts. Doshas work the same way.',
    relatedTerms: ['vata', 'pitta', 'kapha', 'tridosha'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('1'),
  },
  {
    id: 'tridosha',
    term: 'Tridosha',
    aliases: ['tri-dosha', 'three doshas'],
    pronunciation: 'tree-DOH-shuh',
    meaning:
      'The three doshas taken together — Vata, Pitta, and Kapha. Everyone has all three; what differs is the proportion.',
    example:
      'Nobody is "just Vata," in the same way nobody is only tall or only left-handed. You are a mix, and the mix is the point.',
    relatedTerms: ['dosha', 'vata', 'pitta', 'kapha'],
    taughtIn: ['three-doshas'],
    source: ASHTANGA_SUTRA('1'),
  },
  {
    id: 'vata',
    term: 'Vata',
    devanagari: 'वात',
    aliases: ['vatha', 'vayu dosha'],
    pronunciation: 'VAH-tuh',
    meaning:
      'The dosha of movement. Associated with air and space, and with everything in the body that moves: breath, circulation, nerve signals, thoughts, elimination.',
    example:
      'The friend who talks fast, has a dozen ideas at once, gets cold hands in a mild room, and cannot sit still — that is a recognisably Vata-forward pattern.',
    relatedTerms: ['dosha', 'vayu', 'akasha', 'guna'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('12'),
  },
  {
    id: 'pitta',
    term: 'Pitta',
    devanagari: 'पित्त',
    aliases: ['pita', 'pittha'],
    pronunciation: 'PIT-tuh',
    meaning:
      'The dosha of transformation. Associated with fire and water, and with everything that converts one thing into another: digestion, metabolism, body temperature, and the mental work of judging and deciding.',
    example:
      'The colleague who runs warm, gets genuinely irritable when lunch is late, and cuts straight to the decision in a meeting — that is a Pitta-forward pattern.',
    relatedTerms: ['dosha', 'tejas', 'agni'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('12'),
  },
  {
    id: 'kapha',
    term: 'Kapha',
    devanagari: 'कफ',
    aliases: ['kapa', 'kaph', 'slesma', 'shleshma'],
    pronunciation: 'KUH-fuh',
    meaning:
      'The dosha of structure and cohesion. Associated with earth and water, and with everything that holds things together: tissue bulk, lubrication, stamina, steadiness of mood.',
    example:
      'The person with an unhurried manner, a solid frame, deep unbroken sleep, and enormous patience with a task everyone else abandoned — that is a Kapha-forward pattern.',
    relatedTerms: ['dosha', 'prithvi', 'jala'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('12'),
  },
  {
    id: 'prakriti',
    term: 'Prakriti',
    devanagari: 'प्रकृति',
    aliases: ['prakruti', 'prakrti'],
    pronunciation: 'pruh-KRIT-ee',
    meaning:
      'Your constitution — the proportion of the three doshas considered to be set early and to stay broadly stable across your life. The baseline you compare everything else against.',
    example:
      'Like your natural build or the fact that you have always been a light sleeper: not something you chose, and not something that flips week to week.',
    relatedTerms: ['vikriti', 'dosha', 'tridosha'],
    taughtIn: ['prakriti-vikriti'],
    // Both modern sources state this independently: Lad has it "determined at
    // conception ... remains the same throughout one's life"; NCCIH has prakriti
    // "believed to be unchanged over a person's lifetime".
    source: LAD('Your Constitution and Its Inner Balance'),
  },
  {
    id: 'vikriti',
    term: 'Vikriti',
    devanagari: 'विकृति',
    aliases: ['vikruti', 'vikrti'],
    pronunciation: 'vih-KRIT-ee',
    meaning:
      'Your current state — how the doshas are sitting right now, which may differ from your constitution. Temporary and changeable, unlike prakriti.',
    example:
      'You have always been steady and solid, but after three weeks of travel and short nights you feel scattered and dried out. Your prakriti did not change; your vikriti did.',
    relatedTerms: ['prakriti', 'dosha', 'ama'],
    taughtIn: ['prakriti-vikriti'],
    source: CHARAKA_SUTRA('7'),
  },
  {
    id: 'guna',
    term: 'Guna',
    devanagari: 'गुण',
    aliases: ['gunas', 'quality'],
    pronunciation: 'GOO-nuh',
    meaning:
      'A quality — one of twenty descriptive properties, arranged in ten opposite pairs, that Ayurveda uses to describe anything at all: a food, a season, a mood, a person.',
    example:
      'Ice cream is cold, heavy, and oily. A brisk walk on a dry autumn morning is light, mobile, and dry. Those are gunas, and they are the vocabulary everything else is built from.',
    relatedTerms: ['dosha', 'shad-rasa'],
    taughtIn: ['twenty-gunas'],
    source: CHARAKA_SUTRA('1'),
  },
  {
    id: 'agni',
    term: 'Agni',
    devanagari: 'अग्नि',
    aliases: ['agnee', 'digestive fire', 'jatharagni'],
    pronunciation: 'UG-nee',
    meaning:
      'Digestive fire — the capacity to break down and absorb what you take in, whether food or experience. Ayurveda regards the strength of this capacity as central to how you feel.',
    example:
      'Two people eat the same heavy meal. One feels fine an hour later; the other feels like they swallowed a brick. Ayurveda would describe that difference as a difference in agni.',
    relatedTerms: ['ama', 'pitta', 'dhatu'],
    taughtIn: ['agni-ama'],
    source: CHARAKA_CHIKITSA('15'),
  },
  {
    id: 'ama',
    term: 'Ama',
    devanagari: 'आम',
    aliases: ['aama'],
    pronunciation: 'AH-muh',
    meaning:
      'Literally "unripe" or "uncooked" — the residue Ayurveda describes as accumulating when digestion is weak and food is not fully processed. Classically associated with heaviness, dullness, and a coated tongue.',
    example:
      'That thick, foggy, unrested feeling the morning after a very late heavy dinner is the everyday experience the concept points at.',
    relatedTerms: ['agni', 'srotas'],
    taughtIn: ['agni-ama'],
    source: CHARAKA_SUTRA('28'),
  },
  {
    id: 'dhatu',
    term: 'Dhatu',
    devanagari: 'धातु',
    aliases: ['dhatus', 'dhaatu', 'tissue'],
    pronunciation: 'DHAH-too',
    meaning:
      'One of seven body tissues, described as forming in sequence, each nourished by the one before it: plasma, blood, muscle, fat, bone, marrow and nerve, and reproductive tissue.',
    example:
      'Think of a production line where each stage feeds the next. If the first stage runs poorly, everything downstream is thinner — which is exactly the reasoning the dhatu model uses.',
    relatedTerms: ['agni', 'ojas', 'srotas'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
  {
    id: 'srotas',
    term: 'Srotas',
    devanagari: 'स्रोतस्',
    aliases: ['srota', 'srotamsi', 'channels'],
    pronunciation: 'SROH-tas',
    meaning:
      'Channels — the pathways through which anything in the body moves, from breath and blood to food, waste, and thought. Ayurveda is more interested in whether a channel flows freely than in its anatomy.',
    example:
      'A blocked drain and a slow drain cause different problems, and neither is about the pipe itself. Srotas thinking works the same way: flow first.',
    relatedTerms: ['dhatu', 'ama', 'vata'],
    taughtIn: ['srotas'],
    source: CHARAKA_VIMANA('5'),
  },
  {
    id: 'ojas',
    term: 'Ojas',
    devanagari: 'ओजस्',
    aliases: ['ojus'],
    pronunciation: 'OH-jus',
    meaning:
      'The refined end-product of good digestion and sound tissue formation — described classically as the basis of stamina, steadiness, and resilience.',
    example:
      'The difference between someone who bounces back from a hard week and someone who is flattened by it is roughly what the word is reaching for.',
    relatedTerms: ['dhatu', 'agni'],
    taughtIn: ['seven-dhatus'],
    source: CHARAKA_SUTRA('17'),
  },
  {
    id: 'samadosha',
    term: 'Samadosha',
    aliases: ['sama dosha', 'balance'],
    pronunciation: 'SUM-uh-DOH-shuh',
    meaning:
      'The state in which the doshas sit in their own natural proportion for that person — Ayurveda\'s word for balance. Note that it means balanced *for you*, not equal thirds.',
    example:
      'A naturally solid, steady person is not "out of balance" for having more Kapha. They are in balance when they are their own usual solid, steady self.',
    relatedTerms: ['prakriti', 'vikriti', 'dosha'],
    taughtIn: ['prakriti-vikriti'],
    source: SUSHRUTA_SUTRA('15'),
  },
  {
    id: 'sattva',
    term: 'Sattva',
    devanagari: 'सत्त्व',
    aliases: ['satva'],
    pronunciation: 'SUT-vuh',
    meaning:
      'A quality of mind associated with clarity, steadiness, and unclouded attention — one of three mental qualities alongside rajas and tamas.',
    example:
      'The state of mind you have on a quiet morning after a good night of sleep, before the day has made any demands.',
    relatedTerms: ['rajas', 'tamas', 'guna'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('1'),
  },
  {
    id: 'rajas',
    term: 'Rajas',
    devanagari: 'रजस्',
    aliases: ['rajasic'],
    pronunciation: 'RUH-jus',
    meaning: 'A quality of mind associated with activity, drive, restlessness, and agitation.',
    example: 'The keyed-up state at the end of a day of back-to-back meetings.',
    relatedTerms: ['sattva', 'tamas'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('1'),
  },
  {
    id: 'tamas',
    term: 'Tamas',
    devanagari: 'तमस्',
    aliases: ['tamasic'],
    pronunciation: 'TUH-mus',
    meaning: 'A quality of mind associated with heaviness, inertia, and dullness.',
    example: 'The flat, foggy hour after a very large lunch when nothing seems worth starting.',
    relatedTerms: ['sattva', 'rajas'],
    taughtIn: ['three-doshas'],
    source: CHARAKA_SUTRA('1'),
  },
  {
    id: 'samskara',
    term: 'Samskara',
    aliases: ['sanskara'],
    pronunciation: 'sum-SKAR-uh',
    meaning:
      'A habit or impression laid down by repetition. Ayurveda takes the view that what you do daily shapes you more than what you do occasionally.',
    example:
      'Going to bed at the same hour every night for a month changes how you sleep far more than one perfect night ever could.',
    relatedTerms: ['dinacharya'],
    taughtIn: ['dinacharya'],
    source: MODERN('Common modern usage in Ayurvedic teaching', 'Widely taught; not a technical term of the classical dosha model'),
  },
]
