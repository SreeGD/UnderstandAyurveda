import type { ReferenceEntry } from '../schema/reference'
import { CHARAKA_SUTRA } from '../sources'

interface TasteSpec {
  id: string
  name: string
  pronunciation: string
  aliases: string[]
  elements: string
  summary: string
  detail: string
  foods: string
  increases: string
  reduces: string
}

const TASTES: TasteSpec[] = [
  {
    id: 'ref-madhura',
    name: 'Madhura (sweet)',
    pronunciation: 'MUH-dhoo-ruh',
    aliases: ['sweet', 'madhur', 'madhura'],
    elements: 'Earth + Water',
    summary: 'Building and settling — the most nourishing of the six.',
    detail:
      'Sweet in Ayurveda means far more than sugar. Grains, milk, ripe fruit, and root vegetables all carry it, and it is the taste that builds tissue and calms the nervous system. It is also the easiest one to overdo.',
    foods: 'Rice, wheat, milk, ghee, ripe fruit, sweet potato, most nuts',
    increases: 'Kapha',
    reduces: 'Vata, Pitta',
  },
  {
    id: 'ref-amla-taste',
    name: 'Amla (sour)',
    pronunciation: 'UM-luh',
    aliases: ['sour', 'amla'],
    elements: 'Earth + Fire',
    summary: 'Warming and appetite-rousing.',
    detail:
      'Sour wakes up digestion, which is why a pickle alongside a plain meal makes you hungrier. Warming, so it settles a cold pattern and adds to a hot one.',
    foods: 'Citrus, yoghurt, fermented foods, tamarind, vinegar',
    increases: 'Pitta, Kapha',
    reduces: 'Vata',
  },
  {
    id: 'ref-lavana',
    name: 'Lavana (salty)',
    pronunciation: 'LUH-vuh-nuh',
    aliases: ['salty', 'lavan', 'lavana'],
    elements: 'Water + Fire',
    summary: 'Moistening and softening.',
    detail:
      'Salt draws water and softens what it touches — visible in what it does to a cucumber. In small amounts it aids digestion; in quantity it is described as heating and heavy.',
    foods: 'Sea salt, rock salt, seaweed, sea foods',
    increases: 'Pitta, Kapha',
    reduces: 'Vata',
  },
  {
    id: 'ref-katu',
    name: 'Katu (pungent)',
    pronunciation: 'KUH-too',
    aliases: ['pungent', 'spicy', 'katu'],
    elements: 'Fire + Air',
    summary: 'Heating and drying — the most reducing of the six.',
    detail:
      'Pungency makes you sweat and clears congestion. It is the most direct counter to heaviness and cold, and the most direct way to aggravate an already hot or dry pattern.',
    foods: 'Chilli, ginger, black pepper, mustard, garlic, onion',
    increases: 'Pitta, Vata',
    reduces: 'Kapha',
  },
  {
    id: 'ref-tikta',
    name: 'Tikta (bitter)',
    pronunciation: 'TIK-tuh',
    aliases: ['bitter', 'tikta'],
    elements: 'Air + Space',
    summary: 'Cooling and lightening.',
    detail:
      'The taste most missing from modern eating, and the one most recommended when things feel heavy or hot. A plate of bitter greens sits differently from a plate of buttered potatoes.',
    foods: 'Leafy greens, turmeric, fenugreek, bitter gourd, dandelion',
    increases: 'Vata',
    reduces: 'Pitta, Kapha',
  },
  {
    id: 'ref-kashaya',
    name: 'Kashaya (astringent)',
    pronunciation: 'kuh-SHAH-yuh',
    aliases: ['astringent', 'kashay', 'kashaya'],
    elements: 'Air + Earth',
    summary: 'Drying and contracting — the taste with no common English name.',
    detail:
      'The puckering, mouth-drying sensation of over-brewed tea or an unripe banana. Most people have felt it without having a category for it, which is why Ayurveda counting six tastes rather than five surprises people.',
    foods: 'Beans and lentils, pomegranate, unripe banana, strong tea, cranberry',
    increases: 'Vata',
    reduces: 'Pitta, Kapha',
  },
]

export const tasteEntries: ReferenceEntry[] = TASTES.map((t) => ({
  id: t.id,
  category: 'taste' as const,
  name: t.name,
  aliases: t.aliases,
  pronunciation: t.pronunciation,
  summary: t.summary,
  relatedEntries: TASTES.filter((o) => o.id !== t.id).map((o) => o.id),
  linkedLessons: ['six-tastes'],
  source: CHARAKA_SUTRA('26'),
  body: [
    { kind: 'paragraph' as const, text: t.detail, source: CHARAKA_SUTRA('26') },
    {
      kind: 'list' as const,
      ordered: false,
      items: [
        `Elements: ${t.elements}`,
        `Found in: ${t.foods}`,
        `Increases: ${t.increases}`,
        `Reduces: ${t.reduces}`,
      ],
      source: CHARAKA_SUTRA('26'),
    },
  ],
}))
