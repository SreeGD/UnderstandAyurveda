import { matching, mcq, scenario } from './helpers'

/** Quizzes for the twenty gunas and the six tastes. */
export const qualitiesTastesQuestions = [
  // ---- twenty-gunas ----
  mcq('q-guna-1', 'twenty-gunas', 'twenty-gunas',
    'How many qualities (gunas) does Ayurveda use, and how are they arranged?',
    [
      { text: 'Twenty, in ten pairs of opposites', correct: true },
      { text: 'Ten, each independent', whyWrong: 'There are ten pairs, so twenty qualities. The pairing is the important part — each quality has a defined opposite you can use to balance it.' },
      { text: 'Twenty, grouped by dosha', whyWrong: 'They are grouped as opposing pairs, not by dosha. Each dosha is then described using a selection of them.' },
      { text: 'Six, matching the six tastes', whyWrong: 'The six tastes are a separate scheme. The qualities are a different and more general vocabulary.' },
    ],
    'The pairing is what makes them useful: whatever quality is in excess, its opposite is the direction you move in.'),

  matching('q-guna-2', 'twenty-gunas', 'twenty-gunas',
    'Match each quality to its opposite.',
    [
      { left: 'Heavy (guru)', right: 'Light (laghu)' },
      { left: 'Cold (sheeta)', right: 'Hot (ushna)' },
      { left: 'Oily (snigdha)', right: 'Dry (ruksha)' },
      { left: 'Slow (manda)', right: 'Sharp (tikshna)' },
      { left: 'Stable (sthira)', right: 'Mobile (chala)' },
    ],
    'Five of the ten pairs. If you know a quality\'s opposite, you know which direction to move when it is in excess.'),

  mcq('q-guna-3', 'twenty-gunas', 'twenty-gunas',
    'Which set of qualities describes Vata?',
    [
      { text: 'Dry, light, cold, mobile, rough', correct: true },
      { text: 'Hot, sharp, light, spreading', whyWrong: 'Those are Pitta\'s qualities. Both share lightness, which is why the two can look similar from outside — but Vata is cold and Pitta is hot.' },
      { text: 'Heavy, cold, oily, stable', whyWrong: 'Those are Kapha\'s qualities — the near-opposite of Vata on almost every axis except cold.' },
      { text: 'Warm, moist, heavy, smooth', whyWrong: 'These are the qualities that settle Vata, not the ones that describe it.' },
    ],
    'Notice that the last option lists what balances Vata. Confusing "what it is" with "what settles it" is a very common slip.',
    2),

  scenario('q-guna-4', 'twenty-gunas', 'twenty-gunas',
    'It is a dry windy January, you have been travelling, and you feel cold, scattered, and dried out. Working purely from qualities, what should the next meal be like?',
    [
      { text: 'Warm, moist, and heavy — something like soup, eaten sitting still', correct: true },
      { text: 'Light, dry, and cool — a salad', whyWrong: 'That adds more of exactly the qualities already in excess. Light, dry, and cool is what you would want for a heavy, damp, sluggish state.' },
      { text: 'Hot, sharp, and spicy — a strong curry', whyWrong: 'Warmth would help, but sharp and dry would not. Pungency is drying, and dryness is part of the problem here.' },
      { text: 'Cold and sweet — ice cream', whyWrong: 'Sweet and heavy would help; cold would not. Cold is one of the qualities already in excess.' },
    ],
    'Cold, dry, and mobile are Vata qualities. The opposites are warm, moist, and heavy — which is soup. You did not need a food list, only the pairs.',
    2),

  // ---- six-tastes ----
  mcq('q-taste-1', 'six-tastes', 'six-tastes',
    'Which taste does Ayurveda include that most Western schemes leave out?',
    [
      { text: 'Astringent', correct: true },
      { text: 'Umami', whyWrong: 'Umami is a modern addition to Western taste science, not part of the Ayurvedic six. The one Ayurveda has and the West generally lacks is astringent.' },
      { text: 'Pungent', whyWrong: 'Pungent is widely recognised, though sometimes treated as a sensation rather than a taste. Astringent is the one with no common English category.' },
      { text: 'Bitter', whyWrong: 'Bitter is one of the standard Western tastes too. Astringent is the outlier.' },
    ],
    'Astringent is the puckering dryness of strong tea or an unripe banana. Most people have felt it and never had a name for it.'),

  matching('q-taste-2', 'six-tastes', 'six-tastes',
    'Match each taste to a food that carries it.',
    [
      { left: 'Sweet (madhura)', right: 'Rice' },
      { left: 'Sour (amla)', right: 'Yoghurt' },
      { left: 'Salty (lavana)', right: 'Sea salt' },
      { left: 'Pungent (katu)', right: 'Ginger' },
      { left: 'Bitter (tikta)', right: 'Leafy greens' },
      { left: 'Astringent (kashaya)', right: 'Pomegranate' },
    ],
    'Sweet in Ayurveda means building and settling — grains and roots, not just sugar. That is the one most often misread.'),

  mcq('q-taste-3', 'six-tastes', 'six-tastes',
    'Which three tastes are described as settling Vata?',
    [
      { text: 'Sweet, sour, and salty', correct: true },
      { text: 'Bitter, pungent, and astringent', whyWrong: 'These three are light and drying, which increases Vata rather than settling it. They are the ones to go easy on.' },
      { text: 'Sweet, bitter, and astringent', whyWrong: 'That set settles Pitta. Bitter and astringent are cooling and drying — wrong direction for a dry, cold pattern.' },
      { text: 'Pungent, bitter, and astringent', whyWrong: 'That set settles Kapha. All three are light and reducing, which a Vata pattern does not need.' },
      { text: 'Sour, salty, and pungent', whyWrong: 'Sour and salty do settle Vata, but pungent is drying and increases it.' },
    ],
    'Sweet, sour, and salty are the building, moistening tastes — which is exactly what a dry, light, cold pattern is short of.',
    2),

  mcq('q-taste-4', 'six-tastes', 'six-tastes',
    'What does "virya" refer to?',
    [
      { text: 'Whether a food is heating or cooling once inside you', correct: true },
      { text: 'The taste on the tongue', whyWrong: 'That is rasa. Virya is the next stage — what the food does to your temperature after you have eaten it.' },
      { text: 'The effect after digestion is complete', whyWrong: 'That is vipaka, the third stage. Virya is the heating or cooling action in between.' },
      { text: 'How heavy a food is to digest', whyWrong: 'Heaviness is a guna. Virya is specifically about the thermal effect.' },
    ],
    'Three stages: rasa on the tongue, virya once inside, vipaka after digestion. They do not always agree — lemon tastes sour but is described as warming.',
    2),

  scenario('q-taste-5', 'six-tastes', 'six-tastes',
    'Someone runs hot, gets irritable easily, and eats a lot of pickles, chilli, and strong coffee. What would Ayurveda notice?',
    [
      { text: 'Their food is largely heating tastes, which adds to an already hot pattern', correct: true },
      { text: 'They need more sour taste to strengthen digestion', whyWrong: 'Sour is one of the heating tastes, and they are already having plenty. This would add to the problem.' },
      { text: 'Nothing — taste preference is independent of constitution', whyWrong: 'Ayurveda reads taste as an active influence, not a neutral preference. What you favour and what settles you can diverge sharply.' },
      { text: 'They should reduce sweet and increase pungent', whyWrong: 'The opposite. Pungent is heating and this pattern already runs hot; sweet is one of the tastes that would cool it.' },
    ],
    'Pungent, sour, and salty are the heating tastes. Someone already running hot who favours all three is a textbook case of like increasing like.',
    2),
]
