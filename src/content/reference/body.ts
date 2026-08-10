import type { ReferenceEntry } from '../schema/reference'
import { CHARAKA_VIMANA, SUSHRUTA_SUTRA } from '../sources'

interface Spec {
  id: string
  name: string
  pronunciation: string
  aliases: string[]
  summary: string
  detail: string
}

const DHATUS: Spec[] = [
  { id: 'ref-rasa-dhatu', name: 'Rasa (plasma)', pronunciation: 'RUH-suh', aliases: ['plasma', 'rasa dhatu', 'nutrient fluid'], summary: 'The first tissue — the immediate product of digestion.', detail: 'Described as nourishing everything downstream and as providing contentment. Because it is first, weak digestion shows here before anywhere else. Note that "rasa" also means taste; context distinguishes them.' },
  { id: 'ref-rakta', name: 'Rakta (blood)', pronunciation: 'RUCK-tuh', aliases: ['blood', 'rakta'], summary: 'The second tissue, formed from plasma.', detail: 'Associated with vitality and colour, and closely linked to Pitta in classical descriptions.' },
  { id: 'ref-mamsa', name: 'Mamsa (muscle)', pronunciation: 'MAHM-suh', aliases: ['muscle', 'mansa', 'mamsa'], summary: 'The third tissue — covering and strength.', detail: 'Gives the body its shape and its capacity for work.' },
  { id: 'ref-meda', name: 'Meda (fat)', pronunciation: 'MAY-duh', aliases: ['fat', 'medas', 'adipose'], summary: 'The fourth tissue — lubrication and reserve.', detail: 'Described as providing cushioning and insulation, and closely linked to Kapha.' },
  { id: 'ref-asthi', name: 'Asthi (bone)', pronunciation: 'US-thee', aliases: ['bone', 'asthi'], summary: 'The fifth tissue — structure and support.', detail: 'Gives the frame. Classical sources link it to Vata, which is described as seated in the bones.' },
  { id: 'ref-majja', name: 'Majja (marrow)', pronunciation: 'MUJ-juh', aliases: ['marrow', 'nerve tissue', 'majja'], summary: 'The sixth tissue — filling and connection.', detail: 'Marrow and nerve tissue, described as occupying and connecting the structure.' },
  { id: 'ref-shukra', name: 'Shukra (reproductive tissue)', pronunciation: 'SHOOK-ruh', aliases: ['shukra', 'reproductive tissue'], summary: 'The seventh and most refined tissue.', detail: 'The end of the sequence, and described as the immediate source of ojas.' },
]

const SROTAS: Spec[] = [
  { id: 'ref-pranavaha', name: 'Pranavaha srotas', pronunciation: 'PRAH-nuh-VAH-huh', aliases: ['breath channel', 'pranavaha'], summary: 'The channel carrying breath.', detail: 'Disturbance is described as shallow, irregular, or obstructed breathing.' },
  { id: 'ref-annavaha', name: 'Annavaha srotas', pronunciation: 'UN-nuh-VAH-huh', aliases: ['food channel', 'annavaha'], summary: 'The channel carrying food.', detail: 'The one most directly affected by irregular eating. Blockage is associated with heaviness; excessive flow with things passing through too fast.' },
  { id: 'ref-udakavaha', name: 'Udakavaha srotas', pronunciation: 'oo-DUCK-uh-VAH-huh', aliases: ['water channel', 'udakavaha'], summary: 'The channel carrying water and fluid.', detail: 'Associated with thirst and with fluid balance.' },
  { id: 'ref-rasavaha', name: 'Rasavaha srotas', pronunciation: 'RUH-suh-VAH-huh', aliases: ['plasma channel', 'rasavaha'], summary: 'The channel carrying plasma.', detail: 'The first of the tissue channels, and the one most sensitive to weak digestion.' },
  { id: 'ref-mutravaha', name: 'Mutravaha srotas', pronunciation: 'MOO-truh-VAH-huh', aliases: ['urinary channel', 'mutravaha'], summary: 'The channel carrying urine.', detail: 'One of the waste channels whose regularity classical consultations ask about directly.' },
  { id: 'ref-purishavaha', name: 'Purishavaha srotas', pronunciation: 'poo-REE-shuh-VAH-huh', aliases: ['bowel channel', 'purishavaha'], summary: 'The channel carrying stool.', detail: 'Closely watched in classical assessment, and strongly associated with Vata.' },
  { id: 'ref-manovaha', name: 'Manovaha srotas', pronunciation: 'MUH-noh-VAH-huh', aliases: ['mind channel', 'manovaha'], summary: 'The channel of the mind.', detail: 'Included because Ayurveda does not treat mind and body as separate systems needing separate frameworks.' },
]

export const dhatuEntries: ReferenceEntry[] = DHATUS.map((d, i) => ({
  id: d.id,
  category: 'dhatu' as const,
  name: d.name,
  aliases: d.aliases,
  pronunciation: d.pronunciation,
  summary: d.summary,
  relatedEntries: DHATUS.filter((_, j) => Math.abs(i - j) === 1).map((o) => o.id),
  linkedLessons: ['seven-dhatus'],
  source: SUSHRUTA_SUTRA('14'),
  body: [{ kind: 'paragraph' as const, text: d.detail, source: SUSHRUTA_SUTRA('14') }],
}))

export const srotasEntries: ReferenceEntry[] = SROTAS.map((s) => ({
  id: s.id,
  category: 'srota' as const,
  name: s.name,
  aliases: s.aliases,
  pronunciation: s.pronunciation,
  summary: s.summary,
  relatedEntries: [],
  linkedLessons: ['srotas'],
  source: CHARAKA_VIMANA('5'),
  body: [{ kind: 'paragraph' as const, text: s.detail, source: CHARAKA_VIMANA('5') }],
}))
