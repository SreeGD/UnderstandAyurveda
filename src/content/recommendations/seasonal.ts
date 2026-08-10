import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'
import { rule } from './helpers'

/**
 * Seasonal rules carry a `seasons` array, so changing the season setting changes
 * only this section of the plan (invariant P4).
 *
 * The classical scheme has six Indian-subcontinent seasons. Mapping them onto
 * four is a modern adaptation and is marked as such — pretending otherwise would
 * be exactly the false-classical framing gate C4 exists to catch.
 */
export const seasonalRules = [
  // ---- Winter ----
  rule('season-winter-vata', 'seasonal', 'vata',
    'Winter is the hardest season for this pattern. Go heavier and warmer than feels necessary, keep well covered, and protect your sleep.',
    'Cold, dry, and windy weather shares Vata qualities, so the season adds to what is already there.',
    ASHTANGA_SUTRA('3'), { seasons: ['winter'] }),

  rule('season-winter-pitta', 'seasonal', 'pitta',
    'Winter suits this pattern well. It is a good season for heavier food and harder training than you would attempt in summer.',
    'Cold weather offsets the heat this pattern carries.',
    ASHTANGA_SUTRA('3'), { seasons: ['winter'] }),

  rule('season-winter-kapha', 'seasonal', 'kapha',
    'Cold and damp is the combination to watch. Keep moving, keep warm and dry, and resist the pull towards heavy food and long mornings in bed.',
    'Winter shares the cold and heavy qualities of Kapha, so accumulation is easiest now.',
    ASHTANGA_SUTRA('3'), { seasons: ['winter'] }),

  rule('season-winter-balanced', 'seasonal', 'balanced',
    'Eat warmer and more substantially, sleep a little longer, and keep some movement going through the dark months.',
    'General cold-season guidance, which applies when no single pattern is leading.',
    ASHTANGA_SUTRA('3'), { seasons: ['winter'] }),

  // ---- Spring ----
  rule('season-spring-vata', 'seasonal', 'vata',
    'Spring winds are unsettling for this pattern. Keep routines steady even as everything else changes, and stay warm on cold bright days.',
    'Wind and variable temperature are the specific aggravators for Vata.',
    ASHTANGA_SUTRA('3'), { seasons: ['spring'] }),

  rule('season-spring-pitta', 'seasonal', 'pitta',
    'A comfortable season. Ease into lighter food and more activity as it warms, before summer arrives properly.',
    'Spring is temperate enough that this pattern is rarely stressed by it.',
    ASHTANGA_SUTRA('3'), { seasons: ['spring'] }),

  rule('season-spring-kapha', 'seasonal', 'kapha',
    'Spring is the classical Kapha season and the most important one for this pattern. Go lighter, drier, and more active — this is the time it pays off most.',
    'What accumulated over winter is described as loosening in spring, which is why the season gets specific attention.',
    ASHTANGA_SUTRA('3'), { seasons: ['spring'] }),

  rule('season-spring-balanced', 'seasonal', 'balanced',
    'Lighten up as it warms: less heavy food, more movement, earlier mornings.',
    'General spring guidance regardless of constitution.',
    ASHTANGA_SUTRA('3'), { seasons: ['spring'] }),

  // ---- Summer ----
  rule('season-summer-vata', 'seasonal', 'vata',
    'Summer is often the easiest season for this pattern, as long as it is not dry and windy. Keep fluids up and avoid getting parched.',
    'Warmth suits Vata; dryness does not.',
    ASHTANGA_SUTRA('3'), { seasons: ['summer'] }),

  rule('season-summer-pitta', 'seasonal', 'pitta',
    'Summer is the season to be careful in. Stay out of midday heat, keep food cooling and less spiced, and do not train through the hottest hours.',
    'Heat accumulates in this pattern, and summer is when it compounds.',
    ASHTANGA_SUTRA('3'), { seasons: ['summer'] }),

  rule('season-summer-kapha', 'seasonal', 'kapha',
    'A good season for this pattern. Warmth and light naturally counter the heaviness — make the most of it with plenty of outdoor activity.',
    'Summer qualities are opposite to Kapha qualities.',
    ASHTANGA_SUTRA('3'), { seasons: ['summer'] }),

  rule('season-summer-balanced', 'seasonal', 'balanced',
    'Lighter, cooler food, more fluids, and activity moved to the cooler ends of the day.',
    'General hot-weather guidance regardless of constitution.',
    ASHTANGA_SUTRA('3'), { seasons: ['summer'] }),

  // ---- Autumn ----
  rule('season-autumn-vata', 'seasonal', 'vata',
    'Autumn is the classical Vata season — dry, windy, and changeable. This is the time to be most deliberate about warmth, oil, and regular timing.',
    'The season shares Vata qualities, which is why classical sources single it out.',
    ASHTANGA_SUTRA('3'), { seasons: ['autumn'] }),

  rule('season-autumn-pitta', 'seasonal', 'pitta',
    'Heat built up over summer is described as surfacing now. Keep food on the cooler and less sour side into early autumn.',
    'Classical sources associate autumn with the release of accumulated summer heat.',
    CHARAKA_SUTRA('6'), { seasons: ['autumn'] }),

  rule('season-autumn-kapha', 'seasonal', 'kapha',
    'A reasonable season. Keep activity up as the days shorten, before winter makes it harder.',
    'Autumn is dry and light, which suits this pattern; the risk is the drop in activity.',
    ASHTANGA_SUTRA('3'), { seasons: ['autumn'] }),

  rule('season-autumn-balanced', 'seasonal', 'balanced',
    'Move towards warmer, moister, more settling food as the air dries out, and keep your timings regular as the light changes.',
    'General autumn guidance regardless of constitution.',
    ASHTANGA_SUTRA('3'), { seasons: ['autumn'] }),

  // ---- Any season ----
  rule('season-any-transition', 'seasonal', 'balanced',
    'The changeover between seasons is classically the least settled time. Ease changes in over a week or two rather than switching overnight.',
    'Ayurveda pays particular attention to the junctions between seasons.',
    CHARAKA_SUTRA('6')),

  rule('season-any-local', 'seasonal', 'balanced',
    'Read these against the weather you actually have, not the calendar. A mild damp winter and a hard dry one are different seasons in this framework.',
    'The classical six-season scheme is specific to the Indian subcontinent; what matters is the qualities where you live.',
    MODERN('Modern Ayurvedic teaching practice', 'Four-season mapping is a modern adaptation of the classical six-season scheme')),

  rule('season-any-notice', 'seasonal', 'balanced',
    'Notice which season you feel worst in. That is usually a clearer signal about your pattern than any questionnaire.',
    'Lived seasonal response is direct evidence, where a questionnaire is inference.',
    EDITORIAL),
]
