import { ASHTANGA_SUTRA, CHARAKA_SUTRA, CHARAKA_VIMANA, EDITORIAL } from '../sources'
import { rule } from './helpers'

const CHARAKA_VIMANA_1 = CHARAKA_VIMANA('1')

/**
 * Food guidance is expressed as QUALITIES and TASTES to favour or reduce, never
 * as a prescriptive diet and never as a list of forbidden foods. That is partly
 * Principle II and partly that qualities are what Ayurveda actually reasons with
 * — "warm, moist, grounding" transfers to whatever is in your kitchen, and a
 * meal plan does not.
 */
export const mealRules = [
  // ---- Vata ----
  rule('meals-vata-warm', 'meals', 'vata',
    'Favour warm, moist, and grounding food: soups, stews, porridge, cooked grains, root vegetables. Reduce raw salads, crackers, and cold drinks.',
    'Vata is dry, light, cold, and mobile. The qualities that settle it are the opposite ones.',
    ASHTANGA_SUTRA('13')),

  rule('meals-vata-tastes', 'meals', 'vata',
    'Lean on sweet, sour, and salty tastes. Go easy on bitter, pungent, and astringent, which are drying and light.',
    'These three tastes are classically described as building and moistening, which is what a dry, light pattern lacks.',
    CHARAKA_SUTRA('26')),

  rule('meals-vata-regular', 'meals', 'vata',
    'Eat at consistent times and do not skip meals. An erratic eating pattern unsettles this constitution faster than any single food.',
    'Irregular appetite is a Vata hallmark, and irregular eating reinforces it.',
    ASHTANGA_SUTRA('8')),

  rule('meals-vata-calm', 'meals', 'vata',
    'Eat sitting down, without a screen, and slowly. Eating on the move is a Vata habit that costs more than it saves.',
    'Hurried eating aggravates the same restlessness the food is meant to settle.',
    CHARAKA_VIMANA_1),

  rule('meals-vata-oil', 'meals', 'vata',
    'Include some good fat in most meals — olive oil, ghee, nuts, seeds, avocado.',
    'Oiliness is the direct counter to the dryness that defines this pattern.',
    ASHTANGA_SUTRA('13')),

  // ---- Pitta ----
  rule('meals-pitta-cooling', 'meals', 'pitta',
    'Favour cooling, moderately heavy, dryish food: grains, sweet fruit, most vegetables, dairy if it suits you. Reduce very hot, oily, and heavily spiced dishes.',
    'Pitta is hot, sharp, and somewhat oily; cooling and settling qualities balance it.',
    ASHTANGA_SUTRA('13')),

  rule('meals-pitta-tastes', 'meals', 'pitta',
    'Lean on sweet, bitter, and astringent tastes. Go easy on pungent, sour, and salty.',
    'Pungent, sour, and salty are classically described as heating, which adds to what this pattern already has plenty of.',
    CHARAKA_SUTRA('26')),

  rule('meals-pitta-ontime', 'meals', 'pitta',
    'Do not let lunch slide. Eating at a regular midday hour matters more for this pattern than what is on the plate.',
    'Sharp hunger and the irritability that comes with a delayed meal is the most reliable Pitta signal there is.',
    ASHTANGA_SUTRA('8')),

  rule('meals-pitta-alcohol', 'meals', 'pitta',
    'Go easy on alcohol, strong coffee, and very sour or fermented things — especially in hot weather.',
    'All of these are classically described as heating, and this pattern is already warm.',
    ASHTANGA_SUTRA('13')),

  rule('meals-pitta-notangry', 'meals', 'pitta',
    'Try not to eat while angry or mid-argument. Come back to it in ten minutes.',
    'Classical sources are unusually direct about the state of mind at mealtimes, and this pattern is the one it applies to most.',
    CHARAKA_VIMANA_1),

  // ---- Kapha ----
  rule('meals-kapha-light', 'meals', 'kapha',
    'Favour light, warm, and dry food: steamed vegetables, legumes, lighter grains, plenty of spice. Reduce heavy, oily, cold, and very sweet dishes.',
    'Kapha is heavy, cold, oily, and dense. Light, warm, and dry are the qualities that move it.',
    ASHTANGA_SUTRA('13')),

  rule('meals-kapha-tastes', 'meals', 'kapha',
    'Lean on pungent, bitter, and astringent tastes. Go easy on sweet, sour, and salty.',
    'Sweet, sour, and salty are described as building — which a pattern already inclined to accumulate does not need.',
    CHARAKA_SUTRA('26')),

  rule('meals-kapha-breakfast', 'meals', 'kapha',
    'Keep breakfast light or skip it if you are genuinely not hungry. Make lunch your main meal and keep dinner early and small.',
    'Digestion is slowest in the morning for this pattern, and a heavy start sets the tone for the whole day.',
    ASHTANGA_SUTRA('8')),

  rule('meals-kapha-spice', 'meals', 'kapha',
    'Use warming spices generously — ginger, black pepper, mustard, cumin, chilli if you like it.',
    'Pungency is the taste most directly opposed to heaviness and cold.',
    CHARAKA_SUTRA('27')),

  rule('meals-kapha-nograze', 'meals', 'kapha',
    'Leave real gaps between meals and stop grazing. Wait until you are actually hungry.',
    'This pattern eats comfortably without hunger, which is exactly how accumulation happens.',
    ASHTANGA_SUTRA('8')),

  // ---- Balanced ----
  rule('meals-balanced-sixtastes', 'meals', 'balanced',
    'Include all six tastes across the day rather than favouring any one group.',
    'With no pattern clearly leading, the classical general advice applies: variety across all six tastes.',
    CHARAKA_SUTRA('26')),

  rule('meals-balanced-warm', 'meals', 'balanced',
    'Eat freshly cooked warm food where you can, at regular times, and stop before you are completely full.',
    'These are the general recommendations that apply regardless of constitution.',
    ASHTANGA_SUTRA('8')),

  rule('meals-balanced-season', 'meals', 'balanced',
    'Let the season lead: lighter and cooler in summer, warmer and more substantial in winter.',
    'When the constitution is even, seasonal qualities are the more useful guide.',
    ASHTANGA_SUTRA('3')),

  rule('meals-balanced-hunger', 'meals', 'balanced',
    'Eat when you are hungry and not otherwise. It sounds obvious and it is the whole of the practice.',
    'Ayurveda reads appetite as the most direct everyday reading of digestive strength.',
    EDITORIAL),
]
