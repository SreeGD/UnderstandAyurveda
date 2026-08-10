import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'
import { rule } from './helpers'

export const selfCareRules = [
  // ---- Vata ----
  rule('selfcare-vata-oil', 'self-care', 'vata',
    'Warm oil self-massage before a shower, a few times a week — sesame oil suits this pattern. Feet and shoulders alone are worth it if time is short.',
    'Oiliness and warmth directly counter the dryness and cold that define Vata.',
    ASHTANGA_SUTRA('2')),

  rule('selfcare-vata-warmth', 'self-care', 'vata',
    'Keep your head, ears, and feet warm in wind and cold. This pattern feels weather before anyone else does.',
    'Vata is aggravated by cold and by wind specifically.',
    CHARAKA_SUTRA('20')),

  rule('selfcare-vata-quiet', 'self-care', 'vata',
    'Protect some genuinely quiet time daily — no input, no podcast, no scrolling. Ten minutes counts.',
    'Overstimulation is the modern form of the irregularity this pattern is most sensitive to.',
    MODERN('Common modern Ayurvedic practice', 'A modern application of classical guidance on sensory moderation')),

  rule('selfcare-vata-touch', 'self-care', 'vata',
    'Warmth, weight, and contact settle this pattern — a hot bath, a heavy blanket, being outdoors in still sunshine.',
    'Grounding qualities are the direct opposite of light and mobile.',
    MODERN('Common modern Ayurvedic practice', 'Widely taught; a modern synthesis rather than a classical instruction')),

  // ---- Pitta ----
  rule('selfcare-pitta-cool', 'self-care', 'pitta',
    'Cooling self-massage with coconut oil, especially in summer, and a cool rather than hot shower after exertion.',
    'Coconut oil is classically described as cooling, which suits a pattern that runs warm.',
    ASHTANGA_SUTRA('2')),

  rule('selfcare-pitta-nature', 'self-care', 'pitta',
    'Get near water and greenery — a river walk, a swim, an evening outdoors. This is not decoration; it is the most reliable cooling this pattern has.',
    'Cooling and open environments settle heat and intensity.',
    MODERN('Common modern Ayurvedic practice', 'A modern framing of classical seasonal and environmental guidance')),

  rule('selfcare-pitta-moonlight', 'self-care', 'pitta',
    'Wind down in the evening rather than working late. Cool air, low light, nothing that needs a decision.',
    'Evening is when accumulated heat most disrupts sleep in this pattern.',
    ASHTANGA_SUTRA('3')),

  rule('selfcare-pitta-letgo', 'self-care', 'pitta',
    'Notice the urge to correct, win, or finish, and let one of them go each day on purpose.',
    'The mental face of this pattern is sharpness, and it responds to deliberate practice rather than to rest alone.',
    EDITORIAL),

  // ---- Kapha ----
  rule('selfcare-kapha-dry', 'self-care', 'kapha',
    'Dry brushing before a shower rather than oil massage, working towards the heart.',
    'Dryness and stimulation counter the heavy, oily qualities of this pattern — the opposite of what suits Vata.',
    MODERN('Common modern Ayurvedic practice', 'Garshana; widely taught in modern practice, described in classical sources as udvartana')),

  rule('selfcare-kapha-stimulate', 'self-care', 'kapha',
    'Seek out stimulation deliberately: new places, new people, music that moves you, cold fresh air.',
    'Kapha needs rousing rather than soothing, which is the opposite of most self-care advice.',
    CHARAKA_SUTRA('21')),

  rule('selfcare-kapha-declutter', 'self-care', 'kapha',
    'Clear something out regularly — a drawer, a shelf, a folder. This pattern accumulates possessions the way it accumulates everything else.',
    'The tendency to hold on to things is the same tendency expressed outside the body.',
    EDITORIAL),

  rule('selfcare-kapha-warmth', 'self-care', 'kapha',
    'Stay warm and dry. Damp cold is the combination this pattern likes least.',
    'Kapha is cold and moist, so damp cold weather adds to what is already there.',
    ASHTANGA_SUTRA('3')),

  // ---- Balanced ----
  rule('selfcare-balanced-tongue', 'self-care', 'balanced',
    'Scrape your tongue each morning and notice what is there. It is the cheapest daily reading of your digestion you will get.',
    'Classical daily routine includes it for everyone, and it gives you a real observation to work from.',
    ASHTANGA_SUTRA('2')),

  rule('selfcare-balanced-oil', 'self-care', 'balanced',
    'Some oil self-massage most weeks, adjusted to the season — sesame when cold, coconut when hot.',
    'General daily-routine guidance, tuned by season rather than by constitution.',
    ASHTANGA_SUTRA('2')),

  rule('selfcare-balanced-senses', 'self-care', 'balanced',
    'Watch the volume of input — noise, screens, news. Moderation of the senses is classical advice and it has aged well.',
    'Sensory moderation is recommended generally, not for one constitution.',
    CHARAKA_SUTRA('8')),
]
