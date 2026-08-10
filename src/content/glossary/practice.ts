import type { GlossaryTerm } from '../schema/glossary'
import { ASHTANGA_SUTRA, CHARAKA_SUTRA, MODERN, SUSHRUTA_SUTRA } from '../sources'

export const practiceTerms: GlossaryTerm[] = [
  {
    id: 'dinacharya',
    term: 'Dinacharya',
    devanagari: 'दिनचर्या',
    aliases: ['dincharya', 'daily routine', 'dinacarya'],
    pronunciation: 'din-uh-CHAR-yuh',
    meaning:
      'Daily routine — a recommended shape for the day, built on the observation that bodies do better with regular timing than with improvised timing.',
    example:
      'Eating lunch at roughly the same hour each day, rather than whenever a gap appears, is dinacharya thinking in one sentence.',
    relatedTerms: ['ritucharya', 'samskara', 'agni'],
    taughtIn: ['dinacharya'],
    source: ASHTANGA_SUTRA('2'),
  },
  {
    id: 'ritucharya',
    term: 'Ritucharya',
    devanagari: 'ऋतुचर्या',
    aliases: ['rutucharya', 'seasonal routine', 'ritucarya'],
    pronunciation: 'rit-oo-CHAR-yuh',
    meaning:
      'Seasonal routine — adjusting food, activity, and timing as the seasons change, on the principle that the qualities outside you affect the qualities inside you.',
    example:
      'Wanting soup in January and salad in July is ritucharya arriving on its own, without being asked.',
    relatedTerms: ['dinacharya', 'guna', 'ritu'],
    taughtIn: ['ritucharya'],
    source: ASHTANGA_SUTRA('3'),
  },
  {
    id: 'ritu',
    term: 'Ritu',
    aliases: ['rutu', 'season'],
    pronunciation: 'RIT-oo',
    meaning:
      'A season. Classical Ayurveda describes six seasons across the Indian year; most modern practice maps these onto whatever four seasons the reader actually lives in.',
    example:
      'The classical late-winter-into-spring season has no clean equivalent in a tropical climate, which is precisely why the mapping is approximate.',
    relatedTerms: ['ritucharya'],
    taughtIn: ['ritucharya'],
    source: MODERN(
      'Modern Ayurvedic teaching practice',
      'The six-season classical scheme is Indian-subcontinent specific; four-season mapping is a modern adaptation'
    ),
  },
  {
    id: 'abhyanga',
    term: 'Abhyanga',
    devanagari: 'अभ्यङ्ग',
    aliases: ['abhyang', 'oil massage', 'self-massage'],
    pronunciation: 'ub-HYUN-guh',
    meaning:
      'Self-massage with oil, classically described as part of the daily routine rather than an occasional luxury.',
    example:
      'Warming a little oil and working it into your feet and shoulders before a shower — a few minutes, done regularly.',
    relatedTerms: ['dinacharya', 'snigdha', 'vata'],
    taughtIn: ['dinacharya'],
    source: ASHTANGA_SUTRA('2'),
  },
  {
    id: 'jihva-nirlekhana',
    term: 'Jihva Nirlekhana',
    aliases: ['tongue scraping', 'tongue cleaning'],
    pronunciation: 'JIH-vuh nir-LAY-kuh-nuh',
    meaning: 'Tongue scraping — clearing the coating from the tongue on waking.',
    example:
      'The film on your tongue after a late heavy meal, and the fact that it is not there after a light early one.',
    relatedTerms: ['dinacharya', 'ama'],
    taughtIn: ['dinacharya'],
    source: ASHTANGA_SUTRA('2'),
  },
  {
    id: 'vyayama',
    term: 'Vyayama',
    aliases: ['vyayam', 'exercise'],
    pronunciation: 'vyah-YAH-muh',
    meaning:
      'Physical exercise. Classically advised to be undertaken to about half of one\'s capacity rather than to exhaustion.',
    example:
      'Stopping a run while you could still hold a conversation, instead of at the point where you cannot.',
    relatedTerms: ['dinacharya', 'kapha'],
    taughtIn: ['dinacharya'],
    source: ASHTANGA_SUTRA('2'),
  },
  {
    id: 'nasya',
    term: 'Nasya',
    aliases: ['nasal application'],
    pronunciation: 'NUS-yuh',
    meaning:
      'Application of oil or preparations through the nose. Included here because it appears constantly in Ayurvedic writing; it is a practitioner-guided practice, not a self-care step.',
    example:
      'Frequently mentioned alongside daily routine in classical sources, but described there as requiring proper guidance.',
    relatedTerms: ['dinacharya'],
    taughtIn: ['dinacharya'],
    source: ASHTANGA_SUTRA('20'),
  },
  {
    id: 'panchakarma',
    term: 'Panchakarma',
    aliases: ['pancha karma', 'panchkarma'],
    pronunciation: 'PUN-chuh-KAR-muh',
    meaning:
      'A set of five intensive cleansing procedures carried out under the supervision of a qualified practitioner. Named here so you recognise the word — it is not something to attempt from an app.',
    example:
      'Often advertised as a spa package. In the classical sources it is a serious clinical undertaking with careful preparation.',
    relatedTerms: ['ama', 'dosha'],
    taughtIn: ['what-ayurveda-is'],
    source: SUSHRUTA_SUTRA('33'),
  },
  {
    id: 'brahma-muhurta',
    term: 'Brahma Muhurta',
    aliases: ['brahmamuhurta', 'brahma muhurat'],
    pronunciation: 'BRUH-muh moo-HOOR-tuh',
    meaning:
      'The period roughly an hour and a half before sunrise, described classically as the best time to wake.',
    example:
      'The particular quiet of very early morning, before traffic and before anyone needs anything from you.',
    relatedTerms: ['dinacharya', 'vata'],
    taughtIn: ['dinacharya'],
    source: ASHTANGA_SUTRA('2'),
  },
  {
    id: 'mala',
    term: 'Mala',
    aliases: ['malas', 'wastes'],
    pronunciation: 'MUH-luh',
    meaning:
      'The bodily wastes — classically stool, urine, and sweat. Ayurveda reads their regularity as an everyday signal of how digestion is going.',
    example:
      'Noticing that you sweat easily or barely at all is the kind of ordinary observation this category is for.',
    relatedTerms: ['dhatu', 'agni', 'srotas'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('15'),
  },
  {
    id: 'rasa-dhatu',
    term: 'Rasa (tissue)',
    aliases: ['rasa dhatu', 'plasma'],
    pronunciation: 'RUH-suh DHAH-too',
    meaning:
      'The first tissue — plasma or nutrient fluid, the immediate product of digestion. Note that "rasa" also means taste; context tells you which is meant.',
    example:
      'The word doing double duty is a genuine source of confusion for beginners, so it is worth flagging rather than glossing over.',
    relatedTerms: ['dhatu', 'shad-rasa'],
    taughtIn: ['seven-dhatus'],
    source: CHARAKA_SUTRA('28'),
  },
  {
    id: 'rakta',
    term: 'Rakta',
    aliases: ['blood'],
    pronunciation: 'RUCK-tuh',
    meaning: 'The second tissue — blood.',
    example: 'Formed, in this model, from the plasma that came before it.',
    relatedTerms: ['dhatu', 'pitta'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
  {
    id: 'mamsa',
    term: 'Mamsa',
    aliases: ['muscle', 'mansa'],
    pronunciation: 'MAHM-suh',
    meaning: 'The third tissue — muscle.',
    example: 'What gives a body its shape and its capacity to do work.',
    relatedTerms: ['dhatu', 'kapha'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
  {
    id: 'meda',
    term: 'Meda',
    aliases: ['fat', 'medas'],
    pronunciation: 'MAY-duh',
    meaning: 'The fourth tissue — fat, described as lubricating and insulating.',
    example: 'Reserve and cushioning, in the plainest sense.',
    relatedTerms: ['dhatu', 'kapha'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
  {
    id: 'asthi',
    term: 'Asthi',
    aliases: ['bone'],
    pronunciation: 'US-thee',
    meaning: 'The fifth tissue — bone, giving the frame its structure.',
    example: 'The part of you that determines whether you are broad or narrow across the shoulders.',
    relatedTerms: ['dhatu', 'vata'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
  {
    id: 'majja',
    term: 'Majja',
    aliases: ['marrow', 'nerve tissue'],
    pronunciation: 'MUJ-juh',
    meaning: 'The sixth tissue — marrow and nerve tissue, described as filling and connecting.',
    example: 'What sits inside the frame rather than forming it.',
    relatedTerms: ['dhatu'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
  {
    id: 'shukra',
    term: 'Shukra',
    aliases: ['reproductive tissue', 'shukra dhatu'],
    pronunciation: 'SHOOK-ruh',
    meaning:
      'The seventh and final tissue — reproductive tissue, described as the most refined product of the sequence and the immediate source of ojas.',
    example: 'The end of the production line, in the model where each tissue feeds the next.',
    relatedTerms: ['dhatu', 'ojas'],
    taughtIn: ['seven-dhatus'],
    source: SUSHRUTA_SUTRA('14'),
  },
]
