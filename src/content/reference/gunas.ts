import type { ReferenceEntry } from '../schema/reference'
import { CHARAKA_SUTRA } from '../sources'

interface GunaSpec {
  id: string
  name: string
  pronunciation: string
  aliases: string[]
  summary: string
  detail: string
  increases: string
  reduces: string
  partner: string
}

const GUNAS: GunaSpec[] = [
  { id: 'ref-guru', name: 'Guru (heavy)', pronunciation: 'GOO-roo', aliases: ['heavy', 'guru'], summary: 'Heavy — sits and stays with you.', detail: 'Grounding and building. Heavy food, heavy weather, and heavy company all slow things down.', increases: 'Kapha', reduces: 'Vata', partner: 'ref-laghu' },
  { id: 'ref-laghu', name: 'Laghu (light)', pronunciation: 'LUH-ghoo', aliases: ['light', 'laghu'], summary: 'Light — easy to move and easy to process.', detail: 'Lightening and mobilising. Useful when something is stuck; unhelpful when someone is already ungrounded.', increases: 'Vata, Pitta', reduces: 'Kapha', partner: 'ref-guru' },
  { id: 'ref-sheeta', name: 'Sheeta (cold)', pronunciation: 'SHEE-tuh', aliases: ['cold', 'cooling', 'shita'], summary: 'Cold — cooling, slowing, contracting.', detail: 'Draws things inward and slows them. Settles heat; deepens an existing chill.', increases: 'Vata, Kapha', reduces: 'Pitta', partner: 'ref-ushna' },
  { id: 'ref-ushna', name: 'Ushna (hot)', pronunciation: 'OOSH-nuh', aliases: ['hot', 'heating'], summary: 'Hot — warming, expanding, speeding up.', detail: 'Opens and accelerates. Warms a cold pattern; inflames an already hot one.', increases: 'Pitta', reduces: 'Vata, Kapha', partner: 'ref-sheeta' },
  { id: 'ref-snigdha', name: 'Snigdha (oily)', pronunciation: 'SNIG-dhuh', aliases: ['oily', 'unctuous', 'moist'], summary: 'Oily — lubricating, smoothing, softening.', detail: 'The direct counter to dryness. Oil in food, oil on skin, and moisture in the air all count.', increases: 'Pitta, Kapha', reduces: 'Vata', partner: 'ref-ruksha' },
  { id: 'ref-ruksha', name: 'Ruksha (dry)', pronunciation: 'ROOK-shuh', aliases: ['dry', 'rough', 'rooksha'], summary: 'Dry — absorbing, roughening, separating.', detail: 'Reduces excess moisture and heaviness. The dominant quality of crackers, wind, and autumn.', increases: 'Vata', reduces: 'Kapha', partner: 'ref-snigdha' },
  { id: 'ref-manda', name: 'Manda (slow)', pronunciation: 'MUN-duh', aliases: ['slow', 'dull'], summary: 'Slow — unhurried and gradual.', detail: 'Steadies a racing pattern; deepens an already sluggish one.', increases: 'Kapha', reduces: 'Pitta', partner: 'ref-tikshna' },
  { id: 'ref-tikshna', name: 'Tikshna (sharp)', pronunciation: 'TEEK-shnuh', aliases: ['sharp', 'penetrating', 'teekshna'], summary: 'Sharp — penetrating and quick-acting.', detail: 'Cuts through stagnation. Hot mustard, strong coffee, and sudden bad news all share it.', increases: 'Pitta, Vata', reduces: 'Kapha', partner: 'ref-manda' },
  { id: 'ref-sthira', name: 'Sthira (stable)', pronunciation: 'STHIR-uh', aliases: ['stable', 'static'], summary: 'Stable — steady and unmoving.', detail: 'Anchoring. Regular timing is this quality applied to a day.', increases: 'Kapha', reduces: 'Vata', partner: 'ref-chala' },
  { id: 'ref-chala', name: 'Chala (mobile)', pronunciation: 'CHUH-luh', aliases: ['mobile', 'moving'], summary: 'Mobile — moving, shifting, changeable.', detail: 'Travel, variety, and interruption all carry it. The defining quality of Vata.', increases: 'Vata', reduces: 'Kapha', partner: 'ref-sthira' },
  { id: 'ref-mridu', name: 'Mridu (soft)', pronunciation: 'MRI-doo', aliases: ['soft', 'mrudu'], summary: 'Soft — yielding and tender.', detail: 'Gentle on tissue and on mood.', increases: 'Kapha, Pitta', reduces: 'Vata', partner: 'ref-kathina' },
  { id: 'ref-kathina', name: 'Kathina (hard)', pronunciation: 'KUH-thin-uh', aliases: ['hard'], summary: 'Hard — firm and resistant.', detail: 'Gives structure; too much makes things brittle.', increases: 'Vata, Kapha', reduces: 'Pitta', partner: 'ref-mridu' },
  { id: 'ref-vishada', name: 'Vishada (clear)', pronunciation: 'vih-SHAH-duh', aliases: ['clear', 'non-slimy'], summary: 'Clear — clean and leaving no residue.', detail: 'Clarifying. Water rinses away and leaves nothing behind.', increases: 'Vata', reduces: 'Kapha, Pitta', partner: 'ref-picchila' },
  { id: 'ref-picchila', name: 'Picchila (slimy)', pronunciation: 'pih-CHEE-luh', aliases: ['slimy', 'sticky', 'cloudy'], summary: 'Slimy — sticky and coating.', detail: 'Binds and protects; in excess it clogs.', increases: 'Kapha', reduces: 'Vata, Pitta', partner: 'ref-vishada' },
  { id: 'ref-shlakshna', name: 'Shlakshna (smooth)', pronunciation: 'SHLUCK-shnuh', aliases: ['smooth'], summary: 'Smooth — even and frictionless.', detail: 'Reduces irritation. The opposite of the roughness that accompanies dryness.', increases: 'Kapha, Pitta', reduces: 'Vata', partner: 'ref-khara' },
  { id: 'ref-khara', name: 'Khara (rough)', pronunciation: 'KUH-ruh', aliases: ['rough'], summary: 'Rough — uneven and abrasive.', detail: 'Shows up as cracked skin, chapped lips, and a rasping voice.', increases: 'Vata', reduces: 'Kapha', partner: 'ref-shlakshna' },
  { id: 'ref-sukshma', name: 'Sukshma (subtle)', pronunciation: 'SOOK-shmuh', aliases: ['subtle', 'fine'], summary: 'Subtle — fine enough to reach into small spaces.', detail: 'Penetrating in a quiet way. Aroma has it; so does an idea that will not leave you alone.', increases: 'Vata, Pitta', reduces: 'Kapha', partner: 'ref-sthula' },
  { id: 'ref-sthula', name: 'Sthula (gross)', pronunciation: 'STHOO-luh', aliases: ['gross', 'bulky'], summary: 'Gross — bulky and obvious.', detail: 'Occupies space and is hard to miss.', increases: 'Kapha', reduces: 'Vata', partner: 'ref-sukshma' },
  { id: 'ref-sandra', name: 'Sandra (dense)', pronunciation: 'SUN-druh', aliases: ['dense', 'solid'], summary: 'Dense — thick and compact.', detail: 'Concentrated. Cold honey, packed earth, a crowded room.', increases: 'Kapha', reduces: 'Vata, Pitta', partner: 'ref-drava' },
  { id: 'ref-drava', name: 'Drava (liquid)', pronunciation: 'DRUH-vuh', aliases: ['liquid', 'flowing'], summary: 'Liquid — flowing and spreading.', detail: 'Takes the shape of whatever holds it. Warm honey, soup, a diffuse mood.', increases: 'Pitta, Kapha', reduces: 'Vata', partner: 'ref-sandra' },
]

export const gunaEntries: ReferenceEntry[] = GUNAS.map((g) => ({
  id: g.id,
  category: 'guna' as const,
  name: g.name,
  aliases: g.aliases,
  pronunciation: g.pronunciation,
  summary: g.summary,
  relatedEntries: [g.partner],
  linkedLessons: ['twenty-gunas'],
  source: CHARAKA_SUTRA('1'),
  body: [
    { kind: 'paragraph' as const, text: g.detail, source: CHARAKA_SUTRA('1') },
    {
      kind: 'list' as const,
      ordered: false,
      items: [`Increases: ${g.increases}`, `Reduces: ${g.reduces}`],
      source: CHARAKA_SUTRA('20'),
    },
  ],
}))
