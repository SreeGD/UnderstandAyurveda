import { matching, mcq, scenario } from './helpers'

/** Quizzes for dinacharya, ritucharya, and prakriti vs vikriti. */
export const routineQuestions = [
  // ---- dinacharya ----
  mcq('q-dina-1', 'dinacharya', 'dinacharya',
    'Why do Ayurvedic sources recommend being in bed by around 10pm?',
    [
      { text: 'The stretch beginning around then is Pitta-dominant, producing a second wind if you are still awake', correct: true },
      { text: 'Because eight hours of sleep is needed and most people rise at 6am', whyWrong: 'The reasoning is not arithmetic about total hours. It is about which dosha dominates which part of the night.' },
      { text: 'Because darkness increases Kapha and makes sleep heavier', whyWrong: 'The early evening is described as Kapha-dominant, which is why it is easy to settle then — but the 10pm advice is about what comes after.' },
      { text: 'It is a modern recommendation with no classical basis', whyWrong: 'The dosha clock appears in the classical daily-routine chapters. The reasoning is genuinely there.' },
    ],
    'That second wind at 10:30pm is the point. Ride it and you are up until one; beat it and you sleep. Most people have felt this without knowing why.'),

  matching('q-dina-2', 'dinacharya', 'dinacharya',
    'Match each part of the day to its dominant dosha.',
    [
      { left: '6am – 10am', right: 'Kapha — heavy and slow' },
      { left: '10am – 2pm', right: 'Pitta — digestion strongest' },
      { left: '2pm – 6pm', right: 'Vata — mobile and light' },
      { left: '10pm – 2am', right: 'Pitta — the second wind' },
    ],
    'Six four-hour stretches cycling twice. Once you know the clock, most of the daily-routine advice becomes obvious rather than arbitrary.'),

  mcq('q-dina-3', 'dinacharya', 'dinacharya',
    'What is the classical instruction about how hard to exercise?',
    [
      { text: 'To about half of your capacity, not to exhaustion', correct: true },
      { text: 'As hard as possible, to build strength', whyWrong: 'This is one of the places where classical advice cuts directly against modern fitness culture. Exhaustion is specifically discouraged.' },
      { text: 'Only gentle movement is recommended', whyWrong: 'Vigorous exercise is recommended, particularly for Kapha-forward people. The limit is about stopping short of exhaustion, not about intensity being wrong.' },
      { text: 'It depends entirely on your constitution', whyWrong: 'Constitution affects what kind of movement suits you, but the half-capacity instruction is given generally.' },
    ],
    'Stop while you could still comfortably do more. It matters most for Vata-forward people, for whom training to exhaustion can cost several days.',
    2),

  mcq('q-dina-4', 'dinacharya', 'dinacharya',
    'You live somewhere with four hours of winter daylight. How should you read the dosha clock?',
    [
      { text: 'Relative to sunrise and sunset where you are, not as fixed hours', correct: true },
      { text: 'Follow the fixed hours exactly — they are the classical times', whyWrong: 'The classical times assume a subtropical latitude where daylight varies far less. Applying them rigidly at high latitude ignores the reasoning behind them.' },
      { text: 'Ignore the clock entirely outside India', whyWrong: 'The underlying logic — regular timing, main meal at midday, early nights — transfers fine. It is the specific hours that need adjusting.' },
      { text: 'Add two hours to every listed time in winter', whyWrong: 'There is no such rule, and a fixed offset would not track how much daylight actually varies by latitude and date.' },
    ],
    'The clock is a claim about the rhythm of a day, not about numbers on a watch. Read it relative to your own light.',
    3),

  // ---- ritucharya ----
  mcq('q-ritu-1', 'ritucharya', 'ritucharya',
    'How many seasons does the classical Ayurvedic year have?',
    [
      { text: 'Six', correct: true },
      { text: 'Four', whyWrong: 'Four is the modern adaptation used in most temperate teaching, including this app. The classical scheme has six.' },
      { text: 'Three, one per dosha', whyWrong: 'The doshas each have seasons where they accumulate and surge, but the seasonal scheme itself is not three.' },
      { text: 'Twelve, one per month', whyWrong: 'The scheme is seasonal rather than monthly.' },
    ],
    'Six, and specific to the Indian subcontinent — including a monsoon that most of the world does not have. That is why the four-season mapping is honest to label as an adaptation.'),

  mcq('q-ritu-2', 'ritucharya', 'ritucharya',
    'Why does spring get particular attention in Ayurvedic seasonal guidance?',
    [
      { text: 'Kapha is described as accumulating over winter and loosening as spring warms', correct: true },
      { text: 'Because it is the start of the classical year', whyWrong: 'The reasoning is about dosha behaviour, not about calendars.' },
      { text: 'Because Pitta surges in spring', whyWrong: 'Pitta is described as surging in autumn, after accumulating through the monsoon. Spring is Kapha\'s season.' },
      { text: 'Because digestion is strongest in spring', whyWrong: 'Early winter is described as having the strongest digestion of the year.' },
    ],
    'Accumulate, then surge, then subside. Kapha builds through the cold and loosens as it warms, which is the classical explanation for spring heaviness.',
    2),

  scenario('q-ritu-3', 'ritucharya', 'ritucharya',
    'You live in a place with a mild damp winter rather than a hard dry one. How should you adjust?',
    [
      { text: 'Read the qualities of the weather you actually have — damp and cold points towards Kapha guidance', correct: true },
      { text: 'Follow the standard winter advice regardless', whyWrong: 'Standard winter advice often assumes dry cold, which points towards Vata. Damp cold is a different combination entirely.' },
      { text: 'Treat it as autumn instead, since the calendar does not apply', whyWrong: 'Relabelling the season is not the method. Reading its actual qualities is.' },
      { text: 'Seasonal guidance does not apply outside the Indian subcontinent', whyWrong: 'The method transfers perfectly; only the calendar does not. Qualities are qualities wherever you are.' },
    ],
    'What transfers is the method, not the calendar. Damp and cold share Kapha qualities; dry and cold share Vata qualities. Read what you have.',
    3),

  // ---- prakriti-vikriti ----
  mcq('q-pv-1', 'prakriti-vikriti', 'prakriti-vikriti',
    'What is the difference between prakriti and vikriti?',
    [
      { text: 'Prakriti is your stable baseline; vikriti is your changeable current state', correct: true },
      { text: 'Prakriti is physical, vikriti is mental', whyWrong: 'Both cover physical and mental ground. The distinction is baseline versus current state, not body versus mind.' },
      { text: 'Prakriti is what you want to become; vikriti is what you are now', whyWrong: 'Prakriti is not a goal. It is not better to be any particular constitution, and it is not something you move towards.' },
      { text: 'They are two words for the same thing', whyWrong: 'Confusing them is the most common beginner error, and it leads directly to the wrong guidance.' },
    ],
    'Prakriti is what you are; vikriti is how you are. The useful information is in the gap between them.'),

  scenario('q-pv-2', 'prakriti-vikriti', 'prakriti-vikriti',
    'A naturally solid, steady person takes a dosha quiz after three weeks of travel and short nights, and is told they are Vata-dominant. What has gone wrong?',
    [
      { text: 'They answered about their current state, so the quiz measured vikriti and reported it as prakriti', correct: true },
      { text: 'Nothing — travel genuinely changes your constitution', whyWrong: 'Constitution is described as broadly stable across a lifetime. Three weeks of disruption changes the current state, not the baseline.' },
      { text: 'The quiz was too short to be accurate', whyWrong: 'Length is a real issue, but the specific error here is which question was answered, not how many times.' },
      { text: 'They should have answered as their calmest self', whyWrong: 'Not quite — the instruction is to answer about your whole adult life, which is different from picking your best day.' },
    ],
    'And the consequence is practical: guidance built on a mistaken prakriti reading points in the opposite direction from what this person actually needs.',
    2),

  mcq('q-pv-3', 'prakriti-vikriti', 'prakriti-vikriti',
    'How should you answer a prakriti assessment?',
    [
      { text: 'About your whole adult life — what has been true for years', correct: true },
      { text: 'About the last month', whyWrong: 'That is how to answer a vikriti assessment. Using recent weeks for prakriti is exactly the error that produces a wrong baseline.' },
      { text: 'About how you feel today', whyWrong: 'A single day is even less representative than a month. Prakriti is a lifetime pattern.' },
      { text: 'About how you would like to be', whyWrong: 'Prakriti is descriptive, not aspirational. There is no better or worse constitution to aim at.' },
    ],
    'If you catch yourself thinking "well, lately…" during a prakriti assessment, that is the signal you have drifted into the wrong question.'),

  mcq('q-pv-4', 'prakriti-vikriti', 'prakriti-vikriti',
    'A dosha quiz gives you one confident word as your result. What should you conclude?',
    [
      { text: 'It is overselling — real readings come out mixed, and often close', correct: true },
      { text: 'It is a well-designed quiz with a clear algorithm', whyWrong: 'Confidence is not accuracy. A clean single label from a short questionnaire hides genuine uncertainty rather than resolving it.' },
      { text: 'You have an unusually clear constitution', whyWrong: 'Possible, but the quiz has given you no way to tell that from an overconfident method — which is the problem.' },
      { text: 'You should retake it to confirm', whyWrong: 'Retaking an overconfident instrument produces an equally overconfident answer. The issue is the presentation, not the sample.' },
    ],
    'Everyone has all three doshas. A result that hides two of them, and hides its own uncertainty, has thrown away most of the information.',
    2),
]
