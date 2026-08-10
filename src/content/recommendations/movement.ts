import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, MODERN } from '../sources'
import { rule } from './helpers'

export const movementRules = [
  // ---- Vata ----
  rule('movement-vata-gentle', 'movement', 'vata',
    'Favour steady, grounding movement: walking, swimming, slow strength work, gentle yoga. Go easy on high-intensity intervals and long endurance sessions.',
    'Vata is already mobile and light; movement that adds more of both leaves this pattern depleted rather than worked.',
    ASHTANGA_SUTRA('2')),

  rule('movement-vata-warm', 'movement', 'vata',
    'Warm up properly and keep warm afterwards. Exercising cold, in a draught, or straight from bed does not suit this pattern.',
    'Cold and dryness are the qualities Vata is most sensitive to.',
    MODERN('Common modern Ayurvedic practice', 'A modern application of classical Vata-reducing principles to exercise')),

  rule('movement-vata-half', 'movement', 'vata',
    'Stop while you could still comfortably do more. Training to exhaustion costs this pattern several days.',
    'Classical sources advise exercising to about half of capacity, and this is the constitution it matters most for.',
    ASHTANGA_SUTRA('2')),

  // ---- Pitta ----
  rule('movement-pitta-moderate', 'movement', 'pitta',
    'Favour moderate, cooling movement: swimming, cycling, hiking, team sports played for fun. Go easy on midday training in hot weather.',
    'Pitta generates heat readily, and adding more of it is what turns a good session into three bad days.',
    ASHTANGA_SUTRA('2')),

  rule('movement-pitta-noncompetitive', 'movement', 'pitta',
    'Do at least some movement with no metric attached — no watch, no target, no personal best.',
    'This pattern turns training into competition, which is where the heat comes from as much as the exertion.',
    MODERN('Common modern Ayurvedic practice', 'Modern framing; classical sources address exertion but not competition directly')),

  rule('movement-pitta-timing', 'movement', 'pitta',
    'Train early morning or evening rather than the middle of the day.',
    'Midday is when this pattern is warmest, and heat on heat is the combination to avoid.',
    ASHTANGA_SUTRA('3')),

  // ---- Kapha ----
  rule('movement-kapha-vigorous', 'movement', 'kapha',
    'Favour vigorous, warming, varied movement: running, circuits, dancing, hill walking, anything that raises a sweat. This is the constitution that benefits most from real intensity.',
    'Kapha is heavy, cold, and stable; movement is the most direct counter to all three.',
    ASHTANGA_SUTRA('2')),

  rule('movement-kapha-daily', 'movement', 'kapha',
    'Move every day, even briefly, rather than doing one big session a week.',
    'Consistency matters more than volume for a pattern whose difficulty is starting rather than sustaining.',
    CHARAKA_SUTRA('21')),

  rule('movement-kapha-morning', 'movement', 'kapha',
    'Move in the morning if you possibly can. It is the hardest time and the one that changes the day.',
    'The early morning is classically the Kapha part of the day, when heaviness accumulates.',
    ASHTANGA_SUTRA('2')),

  // ---- Balanced ----
  rule('movement-balanced-mixed', 'movement', 'balanced',
    'Mix it: something steady, something vigorous, something flexible, across the week.',
    'With no pattern clearly leading, variety covers what a single approach would miss.',
    ASHTANGA_SUTRA('2')),

  rule('movement-balanced-half', 'movement', 'balanced',
    'Work to about half your capacity as a default, and go harder only when you have the reserves for it.',
    'The classical general instruction on exertion, which applies regardless of constitution.',
    ASHTANGA_SUTRA('2')),

  rule('movement-balanced-enjoy', 'movement', 'balanced',
    'Pick something you will still be doing in six months. Adherence beats optimality.',
    'The best regimen is the one that survives contact with an ordinary week.',
    EDITORIAL),
]
