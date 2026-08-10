import type { ReferenceEntry } from '../schema/reference'
import { CHARAKA_SUTRA, MODERN, NCCIH, SUSHRUTA_SUTRA } from '../sources'

/**
 * HERB ENTRIES ARE DESCRIPTION ONLY.
 *
 * No dosing, no preparation-for-treatment, no therapeutic claims — and unlike
 * everywhere else in the content, gate C8 admits NO `allowLint` escape here
 * (FR-036). Dosing guidance for herbs is the single most likely way this app
 * could cause real harm, so the rule is absolute rather than reviewable.
 *
 * Every entry carries `practitionerNotice: true`, which the schema requires.
 */

interface HerbSpec {
  id: string
  name: string
  pronunciation: string
  aliases: string[]
  botanical: string
  summary: string
  traditional: string
  tastes: string
  qualities: string
}

const HERBS: HerbSpec[] = [
  {
    id: 'ref-ashwagandha',
    name: 'Ashwagandha',
    pronunciation: 'ush-wuh-GUN-dhuh',
    aliases: ['aswagandha', 'winter cherry', 'withania'],
    botanical: 'Withania somnifera',
    summary: 'A root described in classical sources as strengthening and grounding.',
    traditional:
      'Classically grouped among the rasayana — substances described as restoring vigour. Traditionally associated with steadiness and stamina, and with settling a Vata-forward pattern.',
    tastes: 'Bitter, astringent, sweet',
    qualities: 'Warming, oily, heavy',
  },
  {
    id: 'ref-triphala',
    name: 'Triphala',
    pronunciation: 'TRI-fuh-luh',
    aliases: ['triphla', 'three fruits'],
    botanical: 'Combination of Amalaki, Bibhitaki, and Haritaki',
    summary: 'A classical combination of three fruits, described as suiting all three doshas.',
    traditional:
      'One of the best-known formulations in the classical corpus, notable because it is described as appropriate across constitutions rather than for one. Traditionally associated with digestion and elimination.',
    tastes: 'Five of the six — all but salty',
    qualities: 'Balancing; neither strongly heating nor strongly cooling',
  },
  {
    id: 'ref-amalaki',
    name: 'Amalaki',
    pronunciation: 'uh-MUH-luh-kee',
    aliases: ['amla fruit', 'indian gooseberry', 'amalki'],
    botanical: 'Phyllanthus emblica',
    summary: 'A sour fruit described as cooling despite its taste.',
    traditional:
      'A standard illustration of virya differing from taste: strongly sour on the tongue, yet described as cooling once inside. Traditionally associated with Pitta-forward patterns.',
    tastes: 'Sour, plus five of the six overall',
    qualities: 'Cooling, light, dry',
  },
  {
    id: 'ref-turmeric',
    name: 'Haridra (turmeric)',
    pronunciation: 'huh-RID-ruh',
    aliases: ['turmeric', 'haldi', 'curcuma'],
    botanical: 'Curcuma longa',
    summary: 'A warming, bitter root used throughout classical and everyday cooking.',
    traditional:
      'Appears widely across the classical corpus and in ordinary kitchen use. Described as bitter and pungent, warming, and drying.',
    tastes: 'Bitter, pungent, astringent',
    qualities: 'Warming, dry, light',
  },
  {
    id: 'ref-ginger',
    name: 'Shunthi / Ardraka (ginger)',
    pronunciation: 'SHOON-tee',
    aliases: ['ginger', 'adrak', 'shunthi', 'ardraka'],
    botanical: 'Zingiber officinale',
    summary: 'Warming and pungent — distinguished as fresh (ardraka) and dried (shunthi).',
    traditional:
      'Classical sources distinguish the fresh root from the dried, describing the dried as more heating and more drying. Traditionally associated with digestion and with Kapha-forward patterns.',
    tastes: 'Pungent',
    qualities: 'Warming, light; dried is drier than fresh',
  },
  {
    id: 'ref-brahmi',
    name: 'Brahmi',
    pronunciation: 'BRAH-mee',
    aliases: ['bacopa', 'gotu kola', 'brahmi booti'],
    botanical: 'Bacopa monnieri (sometimes Centella asiatica)',
    summary: 'A cooling herb traditionally associated with the mind.',
    traditional:
      'Classically grouped among substances described as supporting clarity and memory. Note that the name is applied to two different plants depending on region and source, which is a common source of confusion.',
    tastes: 'Bitter, astringent, sweet',
    qualities: 'Cooling, light',
  },
  {
    id: 'ref-tulsi',
    name: 'Tulsi',
    pronunciation: 'TOOL-see',
    aliases: ['holy basil', 'tulasi'],
    botanical: 'Ocimum tenuiflorum',
    summary: 'An aromatic warming leaf, both a household plant and a classical ingredient.',
    traditional:
      'Widely grown at Indian homes and used in daily life as much as in formal preparations. Described as warming, light, and drying.',
    tastes: 'Pungent, bitter',
    qualities: 'Warming, light, dry',
  },
  {
    id: 'ref-cumin',
    name: 'Jiraka (cumin)',
    pronunciation: 'JEE-ruh-kuh',
    aliases: ['cumin', 'jeera', 'jiraka'],
    botanical: 'Cuminum cyminum',
    summary: 'A common kitchen spice, described as supporting digestion.',
    traditional:
      'Among the most everyday of the classical substances — present in ordinary cooking across the subcontinent rather than reserved for formal use.',
    tastes: 'Pungent, bitter',
    qualities: 'Warming, light, dry',
  },
]

export const herbEntries: ReferenceEntry[] = HERBS.map((h) => ({
  id: h.id,
  category: 'herb' as const,
  name: h.name,
  aliases: h.aliases,
  pronunciation: h.pronunciation,
  summary: h.summary,
  relatedEntries: [],
  linkedLessons: ['six-tastes', 'twenty-gunas'],
  practitionerNotice: true,
  source: h.id === 'ref-triphala' ? SUSHRUTA_SUTRA('38') : CHARAKA_SUTRA('4'),
  body: [
    // The "description only" notice is rendered once by the herb route itself,
    // driven by `practitionerNotice`, so every herb entry is guaranteed to carry
    // it whether or not an author remembers. Repeating it here as a block said
    // the same thing twice in a row.
    {
      kind: 'callout' as const,
      tone: 'warning' as const,
      title: 'Over-the-counter Ayurvedic products carry a documented contamination risk',
      text: 'A study funded by the US National Institutes of Health tested 70 Ayurvedic remedies bought over the counter and found that 14 of them contained lead, mercury, or arsenic at levels that could be harmful. In the same year the US Centers for Disease Control linked 12 cases of lead poisoning over a three-year period to Ayurvedic products. This is not a reason to dismiss the tradition — it is a reason to treat anything you swallow as a decision for a qualified practitioner and your doctor, not for an app or a shop shelf.',
      source: NCCIH('Side Effects and Risks'),
    },
    { kind: 'paragraph' as const, text: h.traditional, source: CHARAKA_SUTRA('4') },
    {
      kind: 'list' as const,
      ordered: false,
      items: [`Botanical name: ${h.botanical}`, `Tastes: ${h.tastes}`, `Qualities: ${h.qualities}`],
      source: MODERN(
        'Standard modern Ayurvedic materia medica',
        'Botanical identifications are modern; classical texts describe plants by regional name and characteristic'
      ),
    },
  ],
}))
