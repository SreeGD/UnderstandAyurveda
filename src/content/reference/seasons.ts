import type { ReferenceEntry } from '../schema/reference'
import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'

interface SeasonSpec {
  id: string
  name: string
  aliases: string[]
  summary: string
  qualities: string
  watch: string
  direction: string
}

const SEASONS: SeasonSpec[] = [
  {
    id: 'ref-season-winter',
    name: 'Winter',
    aliases: ['hemanta', 'shishira', 'cold season'],
    summary: 'Cold and either dry or damp — and those two are quite different seasons.',
    qualities: 'Cold, heavy, stable; dry or damp depending on where you are',
    watch: 'Dry cold points towards Vata; damp cold towards Kapha. Read which one you actually have.',
    direction: 'Warmer and more substantial food, longer sleep, and enough movement to stop things settling.',
  },
  {
    id: 'ref-season-spring',
    name: 'Spring',
    aliases: ['vasanta', 'spring season'],
    summary: 'The season classical sources single out most — what accumulated over winter loosens.',
    qualities: 'Warming, damp, heavy',
    watch: 'Heaviness, congestion, and reluctance to start. Spring winds also unsettle a Vata-forward pattern.',
    direction: 'Lighter, drier, more active. The biggest shift of the year, made precisely when the weather turns pleasant.',
  },
  {
    id: 'ref-season-summer',
    name: 'Summer',
    aliases: ['grishma', 'summer season'],
    summary: 'Hot and bright — the season to be careful in if you run warm.',
    qualities: 'Hot, sharp, light',
    watch: 'Overheating, irritability, and skin reactivity in a Pitta-forward pattern. Dryness for a Vata-forward one.',
    direction: 'Cooler and less spiced food, more fluids, and activity moved to the cooler ends of the day.',
  },
  {
    id: 'ref-season-autumn',
    name: 'Autumn',
    aliases: ['sharad', 'fall', 'autumn season'],
    summary: 'Dry, windy, and changeable — classically the Vata season.',
    qualities: 'Dry, light, cold, mobile',
    watch: 'Dryness, broken sleep, and scattered attention. Classical sources also describe summer heat surfacing now.',
    direction: 'Warmer, moister, more settling food, and unusual care with regular timing.',
  },
]

export const seasonEntries: ReferenceEntry[] = SEASONS.map((s) => ({
  id: s.id,
  category: 'season' as const,
  name: s.name,
  aliases: s.aliases,
  summary: s.summary,
  relatedEntries: SEASONS.filter((o) => o.id !== s.id).map((o) => o.id),
  linkedLessons: ['ritucharya'],
  source: ASHTANGA_SUTRA('3'),
  body: [
    {
      kind: 'list' as const,
      ordered: false,
      items: [`Qualities: ${s.qualities}`, `Watch for: ${s.watch}`, `General direction: ${s.direction}`],
      source: ASHTANGA_SUTRA('3'),
    },
    {
      kind: 'paragraph' as const,
      text: 'Read this against the weather you actually have rather than the calendar. The classical scheme has six seasons specific to the Indian subcontinent; the four used here are a modern adaptation.',
      source: MODERN(
        'Modern Ayurvedic teaching practice',
        'The four-season mapping is an adaptation of the classical six-season scheme'
      ),
    },
    {
      kind: 'paragraph' as const,
      text: 'Classical sources single out the junctions between seasons as the least settled times, and advise easing changes in over a week or two rather than switching overnight.',
      source: CHARAKA_SUTRA('6'),
    },
    {
      kind: 'callout' as const,
      tone: 'note' as const,
      text: 'Which season you feel worst in is usually a clearer signal about your pattern than any questionnaire. It is direct evidence where a questionnaire is inference.',
      source: EDITORIAL,
    },
  ],
}))
