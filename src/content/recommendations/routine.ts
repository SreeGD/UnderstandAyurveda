import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'
import { rule } from './helpers'

export const routineRules = [
  // ---- Vata ----
  rule('routine-vata-regularity', 'routine', 'vata',
    'Keep your timings boringly regular. Same wake time, same meal times, same bedtime — including at weekends.',
    'Vata is the pattern of movement and irregularity, so it settles under routine more than under any single change you could make.',
    ASHTANGA_SUTRA('2')),

  rule('routine-vata-sleep', 'routine', 'vata',
    'Aim to be in bed by around 10pm. Vata patterns tend to get a second wind late in the evening, and riding it costs more than it gives.',
    'Light, broken sleep is the most common Vata complaint, and a late bedtime makes it worse the following night.',
    ASHTANGA_SUTRA('2')),

  rule('routine-vata-winddown', 'routine', 'vata',
    'Give yourself a slow half hour before bed with screens off — reading, a warm shower, quiet.',
    'A busy mind at bedtime is the mental face of the same restlessness, and it responds to a deliberate wind-down.',
    MODERN('Common modern Ayurvedic practice', 'Widely taught as Vata-settling; not a specific classical instruction')),

  rule('routine-vata-pace', 'routine', 'vata',
    'Build gaps into your day. Back-to-back commitments with no margin are what tip this pattern from lively into frayed.',
    'Vata is aggravated by hurry and by too many things at once.',
    CHARAKA_SUTRA('20')),

  // ---- Pitta ----
  rule('routine-pitta-breaks', 'routine', 'pitta',
    'Stop for lunch properly, away from your desk. Working through the middle of the day is the single habit most at odds with this pattern.',
    'Pitta runs hottest around midday and gets sharp when a meal is delayed.',
    ASHTANGA_SUTRA('2')),

  rule('routine-pitta-sleep', 'routine', 'pitta',
    'Get to bed before 11pm rather than pushing on to finish one more thing.',
    'Pitta patterns tend to wake in the small hours when they go to bed keyed up, and then run short the next day.',
    ASHTANGA_SUTRA('2')),

  rule('routine-pitta-cooldown', 'routine', 'pitta',
    'Put something genuinely non-competitive in your week — a walk without a target, cooking, time outdoors.',
    'Pitta turns almost anything into a contest, and the pattern settles when something in the week has no scoreboard.',
    MODERN('Common modern Ayurvedic practice', 'Widely taught as Pitta-settling; a modern framing of classical guidance on exertion')),

  rule('routine-pitta-heat', 'routine', 'pitta',
    'Keep your bedroom on the cool side and avoid heavy work in the hottest part of the day.',
    'Heat accumulates in this pattern, and sleep suffers first.',
    ASHTANGA_SUTRA('3')),

  // ---- Kapha ----
  rule('routine-kapha-earlyrise', 'routine', 'kapha',
    'Get up before 6am if you can, and do not go back to bed. The morning hours are the hardest and the most worth winning.',
    'Kapha accumulates in the early morning, so a late start compounds the heaviness rather than resting it off.',
    ASHTANGA_SUTRA('2')),

  rule('routine-kapha-nodaysleep', 'routine', 'kapha',
    'Skip daytime naps. If you are flagging, move instead — a short walk does more than twenty minutes lying down.',
    'Daytime sleep is classically singled out as the habit that most increases Kapha.',
    CHARAKA_SUTRA('21')),

  rule('routine-kapha-variety', 'routine', 'kapha',
    'Change something regularly — your route, your music, the order you do things. Sameness is comfortable here and it is also the problem.',
    'Kapha is the pattern of stability, so it needs stimulation rather than more of the steadiness it already has.',
    MODERN('Common modern Ayurvedic practice', 'A modern framing of classical guidance on Kapha-reducing regimen')),

  rule('routine-kapha-start', 'routine', 'kapha',
    'Start the hard thing first, before the day settles. Waiting for motivation to arrive is how the day goes.',
    'Slow to start and hard to interrupt is the Kapha working pattern; the leverage is entirely at the start.',
    EDITORIAL),

  // ---- Balanced / tri-doshic ----
  rule('routine-balanced-anchor', 'routine', 'balanced',
    'Anchor three things at the same time each day: waking, your main meal, and sleeping. Let the rest float.',
    'With no single pattern clearly leading, the general principle applies: regular timing supports all three.',
    ASHTANGA_SUTRA('2')),

  rule('routine-balanced-season', 'routine', 'balanced',
    'Adjust with the season rather than by pattern — lighter and more active as it warms, warmer and more settled as it cools.',
    'A tri-doshic reading means the season is a better guide than your constitution.',
    ASHTANGA_SUTRA('3')),

  rule('routine-balanced-notice', 'routine', 'balanced',
    'Notice which pattern shows up when you are stressed or unwell, and use that as your working guide.',
    'When the baseline is even, the useful signal is what tips first under pressure.',
    EDITORIAL),
]
