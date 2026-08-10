import { matching, mcq, scenario } from './helpers'

/** Quizzes for lessons 1-3: what Ayurveda is, five elements, three doshas. */
export const foundationQuestions = [
  // ---- what-ayurveda-is ----
  mcq('q-what-1', 'what-ayurveda-is', 'what-ayurveda-is',
    'What does the word "Ayurveda" literally mean?',
    [
      { text: 'The knowledge of life', correct: true },
      { text: 'The science of medicine', whyWrong: '"Veda" means knowledge, but "ayur" means life or lifespan rather than medicine. The scope is wider than treatment.' },
      { text: 'The path of balance', whyWrong: 'Balance is central to Ayurveda, but it is not what the name says. This is a description of the goal, not a translation.' },
      { text: 'The wisdom of the body', whyWrong: 'Close in spirit, but "ayur" refers to life and lifespan generally, not to the body specifically.' },
    ],
    '"Ayur" means life or lifespan and "veda" means knowledge. The name is broader than medicine — it covers daily living, food, sleep, and environment as much as illness.'),

  mcq('q-what-2', 'what-ayurveda-is', 'what-ayurveda-is',
    'Which principle sits underneath almost all Ayurvedic reasoning?',
    [
      { text: 'Like increases like, and opposites balance', correct: true },
      { text: 'Everything in moderation', whyWrong: 'Moderation is good general advice but it is not the operating principle. Ayurveda often recommends actively opposing a quality rather than moderating it.' },
      { text: 'The body knows best', whyWrong: 'Ayurveda is quite interventionist about routine and timing; it does not simply defer to appetite or impulse.' },
      { text: 'Cleanse first, build second', whyWrong: 'This describes one clinical sequence, not the general principle the whole framework runs on.' },
    ],
    'If you remember one thing, remember this. Dry weather dries out a dry person; warmth settles cold. Every recommendation in this app is an application of it.'),

  mcq('q-what-3', 'what-ayurveda-is', 'what-ayurveda-is',
    'A website describes a practice as "ancient Ayurvedic wisdom". What is the honest response?',
    [
      { text: 'Check whether it is classical or a modern synthesis — a great deal of it is 20th-century', correct: true },
      { text: 'Accept it; the tradition is thousands of years old', whyWrong: 'The tradition is old, but much of what circulates under its name is recent. Age of the tradition does not transfer automatically to every claim made in its name.' },
      { text: 'Dismiss it; nothing pre-modern is reliable', whyWrong: 'That is the opposite error. The classical corpus is a genuine body of careful observation; the issue is attribution, not worth.' },
      { text: 'It does not matter as long as it works', whyWrong: 'It may not matter for a low-risk habit, but false provenance is how unsupported claims acquire borrowed authority.' },
    ],
    'Distinguishing classical teaching from modern popularisation is a basic literacy skill in this subject. It is why every claim in this app is labelled with its type.',
    2),

  // ---- five-elements ----
  mcq('q-elem-1', 'five-elements', 'five-elements',
    'When Ayurveda says "fire" as an element, what does it mean?',
    [
      { text: 'The category of transformation — turning one thing into another', correct: true },
      { text: 'Literal combustion inside the body', whyWrong: 'The five elements are categories of behaviour, not substances. Reading them literally is the most common beginner error.' },
      { text: 'Body temperature specifically', whyWrong: 'Heat is one expression of the fire element, but the defining feature is conversion, not warmth alone.' },
      { text: 'Anger and strong emotion', whyWrong: 'Those are associated with Pitta, which contains fire — but the element itself is broader and not emotional.' },
    ],
    'Read the elements as verbs, not nouns. Fire is whatever converts; water is whatever binds and flows. Everything downstream follows from that reading.'),

  matching('q-elem-2', 'five-elements', 'five-elements',
    'Match each element to what it contributes.',
    [
      { left: 'Akasha (space)', right: 'Room for things to happen in' },
      { left: 'Vayu (air)', right: 'Movement and direction' },
      { left: 'Tejas (fire)', right: 'Heat and transformation' },
      { left: 'Jala (water)', right: 'Cohesion and flow' },
      { left: 'Prithvi (earth)', right: 'Solidity and mass' },
    ],
    'The five run from least dense to most dense. Space gives room, air moves, fire converts, water binds, earth holds shape.'),

  scenario('q-elem-3', 'five-elements', 'five-elements',
    'A dry cracker. Which two elements lead in it?',
    [
      { text: 'Earth and air', correct: true },
      { text: 'Water and earth', whyWrong: 'Earth is right, but a cracker is notably dry — water is the element that is most obviously absent.' },
      { text: 'Fire and air', whyWrong: 'A cracker is not warming or transformative. Fire is not its leading quality.' },
      { text: 'Space and water', whyWrong: 'Neither leads here. A cracker is solid and dry, which points to earth plus air.' },
    ],
    'Solid and dry. Earth gives the substance, air gives the dryness and lightness. This is exactly the pairing that increases Vata.'),

  // ---- three-doshas ----
  mcq('q-dosha-1', 'three-doshas', 'three-doshas',
    'Which elements combine to make Vata?',
    [
      { text: 'Space and air', correct: true },
      { text: 'Fire and water', whyWrong: 'That combination makes Pitta — the pattern of transformation rather than movement.' },
      { text: 'Water and earth', whyWrong: 'That combination makes Kapha — the pattern of structure and cohesion.' },
      { text: 'Air and fire', whyWrong: 'This pairing describes the pungent taste, not a dosha. Vata is space plus air.' },
    ],
    'Space gives room to move and air gives the movement itself, which is why Vata governs everything that travels — breath, circulation, nerve signals, and thought.'),

  mcq('q-dosha-2', 'three-doshas', 'three-doshas',
    'Someone says "I am a Vata." What is wrong with that?',
    [
      { text: 'Everyone has all three doshas; only the proportion differs', correct: true },
      { text: 'Nothing — that is the standard way to describe constitution', whyWrong: 'It is common shorthand, but it is genuinely misleading. It suggests doshas are types of person rather than proportions present in everyone.' },
      { text: 'Vata is not a constitution, only a state of imbalance', whyWrong: 'Vata can absolutely be someone\'s leading constitutional pattern. The problem is the "a Vata" framing, not the dosha.' },
      { text: 'You cannot know your dosha without a practitioner', whyWrong: 'A practitioner assesses more reliably, but the deeper error here is treating a dosha as an identity.' },
    ],
    'You could not digest without Pitta or hold together without Kapha. Everyone runs all three; constitution is about proportion, not membership of a category.'),

  matching('q-dosha-3', 'three-doshas', 'three-doshas',
    'Match each dosha to the job it does.',
    [
      { left: 'Vata', right: 'Movement — breath, circulation, thought' },
      { left: 'Pitta', right: 'Transformation — digestion, temperature, judgement' },
      { left: 'Kapha', right: 'Structure — bulk, lubrication, stability' },
    ],
    'Three jobs any living thing has to do. Naming them is most of what the dosha model is for.'),

  scenario('q-dosha-4', 'three-doshas', 'three-doshas',
    'A colleague runs warm, gets sharply irritable when lunch is late, and cuts straight to the decision in meetings. Which pattern is most visible?',
    [
      { text: 'Pitta', correct: true },
      { text: 'Vata', whyWrong: 'Vata would show as scattered and changeable rather than sharp and decisive, and would get lightheaded rather than irritable when a meal was late.' },
      { text: 'Kapha', whyWrong: 'Kapha would barely notice a late meal, and would be unhurried rather than incisive in a meeting.' },
      { text: 'Equal parts Vata and Kapha', whyWrong: 'Neither of those accounts for the heat, the sharpness, or the meal-timing sensitivity — all classic Pitta signals.' },
    ],
    'Heat, sharpness, and a strong reaction to delayed meals are the three most reliable Pitta signals. Decisiveness is the same quality showing up mentally.'),

  scenario('q-dosha-5', 'three-doshas', 'three-doshas',
    'Someone with a naturally solid, steady constitution feels heavy, unmotivated, and congested after a long inactive winter. What has happened?',
    [
      { text: 'Their own leading pattern has been increased by conditions that share its qualities', correct: true },
      { text: 'Their constitution has changed', whyWrong: 'Constitution is described as broadly stable across life. What changes is the current state, not the baseline.' },
      { text: 'They have become Vata-dominant', whyWrong: 'Heaviness and congestion are Kapha qualities, not Vata ones. Vata would present as dry, cold, and scattered.' },
      { text: 'Nothing — that is simply their constitution showing', whyWrong: 'Their constitution was always Kapha-forward, but "heavy and unmotivated" describes a shift beyond baseline, not the baseline itself.' },
    ],
    'Cold, damp, inactive conditions share Kapha\'s qualities, so they increase it. Like increases like — and a person is most easily tipped further into their own pattern.',
    3),
]
