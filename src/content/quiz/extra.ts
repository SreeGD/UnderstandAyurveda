import { matching, mcq, scenario } from './helpers'

/**
 * Second pass over every lesson, bringing each quiz to roughly eight items.
 *
 * Weighted towards scenarios, because recognising a pattern in a description of
 * a real person is the skill this course is actually trying to build — reciting
 * that Vata is "dry, light, cold" is not.
 */
export const extraQuestions = [
  // ---- what-ayurveda-is ----
  mcq('q-what-4', 'what-ayurveda-is', 'what-ayurveda-is',
    'What kind of knowledge is Ayurveda, stated fairly?',
    [
      { text: 'A systematic framework built on careful observation, organised around a small set of consistently applied concepts', correct: true },
      { text: 'Modern biomedical science, discovered earlier', whyWrong: 'It did not develop through controlled trials, and its categories do not map onto anatomy or biochemistry. Claiming otherwise oversells it.' },
      { text: 'A religion', whyWrong: 'It developed alongside Indian philosophical traditions, but it is a body of thought about health and daily living, not a faith.' },
      { text: 'Folklore with no internal structure', whyWrong: 'This undersells it. The framework is highly systematic — the elements, doshas, qualities, and tastes all interlock consistently.' },
    ],
    'Both overselling and dismissing it get in the way of understanding it. It is a coherent observational framework, and it is not modern science.',
    2),

  scenario('q-what-5', 'what-ayurveda-is', 'what-ayurveda-is',
    'A friend has a symptom that came on suddenly and is getting worse. They ask what Ayurveda says. What is the right answer?',
    [
      { text: 'That is a question for a doctor, not for a framework or an app', correct: true },
      { text: 'Look up which dosha the symptom belongs to', whyWrong: 'Reading a rapidly worsening symptom as a "dosha imbalance" is exactly how someone delays getting care they need.' },
      { text: 'Suggest a cleansing routine', whyWrong: 'Intensive procedures are practitioner-supervised even in the classical sources, and none of this addresses an acute problem.' },
      { text: 'Recommend a herb traditionally associated with it', whyWrong: 'No app should suggest a substance for a symptom, and a worsening acute problem needs a clinician regardless.' },
    ],
    'This is the single most important boundary in the whole subject. Educational frameworks are for understanding; acute symptoms are for clinicians.'),

  // ---- what-ayurveda-is: sourcing and evidence literacy ----
  mcq('q-what-6', 'what-ayurveda-is', 'what-ayurveda-is',
    'How does the US National Institutes of Health summarise the research evidence on Ayurvedic approaches?',
    [
      { text: 'Most trials have been small, with design problems and inadequate controls; more rigorous research is needed', correct: true },
      { text: 'The evidence is strong across most applications', whyWrong: 'No mainstream health body claims this. Overstating the evidence is as misleading as dismissing the tradition outright.' },
      { text: 'It has been thoroughly disproven', whyWrong: 'Also wrong. "Not well studied" and "shown not to work" are different findings, and conflating them is its own kind of sloppiness.' },
      { text: 'No research has ever been done', whyWrong: 'Trials exist; the issue is their size and design quality rather than their absence.' },
    ],
    'Knowing what the evidence does and does not show lets you read both enthusiastic and dismissive sources critically.',
    2),

  scenario('q-what-7', 'what-ayurveda-is', 'what-ayurveda-is',
    'A shop sells an Ayurvedic supplement over the counter. What is the documented risk worth knowing?',
    [
      { text: 'Testing has found heavy metals — lead, mercury, arsenic — in a meaningful share of over-the-counter products', correct: true },
      { text: 'None; traditional products are inherently safe', whyWrong: 'Traditional origin is not a safety guarantee. A study of 70 over-the-counter remedies found 14 containing lead, mercury, or arsenic at potentially harmful levels.' },
      { text: 'Only that they may be ineffective', whyWrong: 'Ineffectiveness is the lesser concern. Contamination with heavy metals is a documented and serious one.' },
      { text: 'Only that they are expensive', whyWrong: 'Cost is not the safety issue that testing has actually turned up.' },
    ],
    'This is the concrete reason this app carries no dosing guidance anywhere. What you swallow is a decision for a qualified practitioner and your doctor.',
    2),

  mcq('q-what-8', 'what-ayurveda-is', 'what-ayurveda-is',
    'A source tells you Ayurveda is 5,000 years old. What is the careful response?',
    [
      { text: 'Note that standard scholarly dating is considerably later, and treat the claim as a signal about the source', correct: true },
      { text: 'Accept it — it appears in many reputable introductions', whyWrong: 'It does appear widely, including in public-health fact sheets, which is exactly why it is a useful test case. Repetition is not verification.' },
      { text: 'Reject the whole source as unreliable', whyWrong: 'Too strong. A source can get a date wrong and still be useful — but you now know to check its other claims.' },
      { text: 'It does not matter either way', whyWrong: 'The specific date matters little; the habit of preferring the more impressive number matters a great deal.' },
    ],
    'Historians date the surviving compilations roughly between 400 BCE and 200 CE. Two thousand years is remarkable enough without inflating it.',
    3),

  // ---- prakriti-vikriti: what an in-person assessment actually involves ----
  mcq('q-pv-7', 'prakriti-vikriti', 'prakriti-vikriti',
    'What does a trained practitioner do that a questionnaire cannot?',
    [
      { text: 'Observe tongue, skin, eyes and appearance, and check pulse, voice, and wastes in person', correct: true },
      { text: 'Ask more questions', whyWrong: 'Question count is not the difference. Direct physical observation is, and no questionnaire can do it.' },
      { text: 'Use a more sophisticated scoring formula', whyWrong: 'The difference is the evidence available, not the arithmetic applied to it.' },
      { text: 'Nothing — a good questionnaire is equivalent', whyWrong: 'This is the claim most online dosha quizzes implicitly make, and it is the reason to be sceptical of them.' },
    ],
    'The US National Institutes of Health describes the method: asking about diet, lifestyle and resilience; observing teeth, tongue, skin, eyes and weight; and checking urine, stool, speech, voice, and pulse.',
    2),

  // ---- five-elements ----
  scenario('q-elem-4', 'five-elements', 'five-elements',
    'Which two elements lead in a bowl of hot soup?',
    [
      { text: 'Water and fire', correct: true },
      { text: 'Earth and water', whyWrong: 'Water is right, but soup is warm — heat is a defining feature here, and heat is fire.' },
      { text: 'Air and space', whyWrong: 'Soup is neither light nor mobile. These lead in something like a breeze, not a liquid.' },
      { text: 'Earth and fire', whyWrong: 'Fire is right, but soup is liquid rather than solid — water, not earth.' },
    ],
    'Liquid and warm. This is why soup is the standard recommendation for a cold, dry, scattered state: it supplies exactly the opposite qualities.'),

  mcq('q-elem-5', 'five-elements', 'five-elements',
    'Why does Ayurveda treat space as an element at all?',
    [
      { text: 'Because room for things to happen in is itself a condition for anything happening', correct: true },
      { text: 'Because the ancients did not know about vacuum', whyWrong: 'This misreads the category. Space is not a mistaken guess about physics; it is a functional category about openness.' },
      { text: 'Because it fills the gaps between the other four', whyWrong: 'Close, but passive. The point is that openness is an active condition, not leftover space.' },
      { text: 'It is symbolic only, with no practical use', whyWrong: 'It has direct practical consequence — space plus air makes Vata, the pattern of movement.' },
    ],
    'The empty part of a house is what makes it usable. Ayurveda treats that emptiness as something in its own right, not an absence.',
    2),

  // ---- three-doshas ----
  scenario('q-dosha-6', 'three-doshas', 'three-doshas',
    'Someone talks fast, has six projects on the go, gets cold hands in a mild room, and sleeps lightly. Which pattern leads?',
    [
      { text: 'Vata', correct: true },
      { text: 'Pitta', whyWrong: 'Pitta runs warm and focuses intensely on one thing. Cold hands and six unfinished projects point the other way.' },
      { text: 'Kapha', whyWrong: 'Kapha is steady, slow, and sleeps deeply. Almost every detail here is its opposite.' },
      { text: 'Cannot tell without a questionnaire', whyWrong: 'A description this consistent — fast, scattered, cold, light-sleeping — is a recognisable pattern. Recognising it is the skill being built.' },
    ],
    'Movement, coldness, dryness, and changeability. Four independent signals all pointing the same way is about as clear as this gets.'),

  mcq('q-dosha-7', 'three-doshas', 'three-doshas',
    'What does "balance" mean in Ayurveda?',
    [
      { text: 'The doshas sitting in their own natural proportion for that person', correct: true },
      { text: 'All three doshas at roughly equal thirds', whyWrong: 'This is the most common misreading. A naturally solid, steady person is not out of balance for having more Kapha — they are in balance when they are their usual self.' },
      { text: 'Having no dosha in excess of the population average', whyWrong: 'There is no population average in this framework. The comparison is always with your own baseline.' },
      { text: 'Reducing whichever dosha is highest', whyWrong: 'Reducing your leading dosha would move you away from your constitution, not towards balance.' },
    ],
    'Balance is relative to you. It is not a target state everyone shares, which is why the app compares against your own baseline rather than an ideal.',
    2),

  mcq('q-dosha-8', 'three-doshas', 'three-doshas',
    'Why do classical sources treat Vata as the dosha that disturbs the other two?',
    [
      { text: 'Because it is the only one that moves things — the other two are moved by it', correct: true },
      { text: 'Because it is the most common constitution', whyWrong: 'Constitution frequency is not the reasoning, and the sources do not claim one is most common.' },
      { text: 'Because it is the strongest', whyWrong: 'The sources do not rank them by strength. The claim is specifically about movement.' },
      { text: 'Because it is associated with older age', whyWrong: 'Vata is associated with later life, but that is a separate point from why it disturbs the others.' },
    ],
    'Pitta transforms and Kapha holds together, but neither travels. Anything that moves in the body is Vata doing it — including moving the other two out of place.',
    3),

  // ---- twenty-gunas ----
  scenario('q-guna-5', 'twenty-gunas', 'twenty-gunas',
    'Someone feels heavy, congested, and unmotivated after a damp, inactive fortnight. Working from qualities alone, what direction helps?',
    [
      { text: 'Light, warm, dry, and stimulating', correct: true },
      { text: 'Heavy, warm, and grounding', whyWrong: 'Warmth would help, but heaviness and grounding add to what is already in excess. This is the direction for a dry, scattered state.' },
      { text: 'Cool, slow, and settling', whyWrong: 'This is the direction for heat and intensity. It would deepen heaviness and inertia.' },
      { text: 'Whatever feels most comfortable', whyWrong: 'Comfort tends to mean more of the same, and more of the same is what produced the state. This is the one pattern where the appealing option is usually wrong.' },
    ],
    'Heavy, damp, cold, and static are Kapha qualities. The opposites are light, dry, warm, and mobile — which is also why the advice feels unappealing from inside that state.'),

  matching('q-guna-6', 'twenty-gunas', 'twenty-gunas',
    'Match the remaining pairs of opposites.',
    [
      { left: 'Soft (mridu)', right: 'Hard (kathina)' },
      { left: 'Clear (vishada)', right: 'Slimy (picchila)' },
      { left: 'Smooth (shlakshna)', right: 'Rough (khara)' },
      { left: 'Subtle (sukshma)', right: 'Gross (sthula)' },
      { left: 'Dense (sandra)', right: 'Liquid (drava)' },
    ],
    'The second five pairs. Together with the first five, these twenty qualities are the vocabulary everything else in Ayurveda is built from.'),

  mcq('q-guna-7', 'twenty-gunas', 'twenty-gunas',
    'Which qualities settle Pitta?',
    [
      { text: 'Cool, slow, and somewhat heavy', correct: true },
      { text: 'Warm, moist, and heavy', whyWrong: 'That settles Vata. Warmth is the wrong direction for a pattern that already runs hot.' },
      { text: 'Light, dry, and sharp', whyWrong: 'That settles Kapha. Sharpness in particular is a Pitta quality and would add to it.' },
      { text: 'Hot, oily, and stable', whyWrong: 'Heat and oiliness are both Pitta qualities, so this would increase it rather than settle it.' },
    ],
    'Pitta is hot, sharp, and light. Cool counters the heat, slow counters the sharpness, and a little heaviness counters the lightness.',
    2),

  // ---- six-tastes ----
  scenario('q-taste-6', 'six-tastes', 'six-tastes',
    'A friend eats mostly bread, pasta, dairy, and sweet things, and feels heavy and sluggish. Which tastes are missing?',
    [
      { text: 'Bitter and astringent', correct: true },
      { text: 'Sweet and salty', whyWrong: 'They are getting plenty of sweet already — grains and dairy are the sweet taste in Ayurvedic terms, not just sugar.' },
      { text: 'Sour and salty', whyWrong: 'Both are building tastes. Adding them would increase the heaviness rather than lighten it.' },
      { text: 'None — taste variety does not affect this', whyWrong: 'Taste variety is central to the classical advice, and the sweet-heavy modern diet is exactly the pattern this addresses.' },
    ],
    'Bitter and astringent are the lightening, drying tastes, and they are the two most absent from modern eating. Hence greens and beans in almost every recommendation set.'),

  mcq('q-taste-7', 'six-tastes', 'six-tastes',
    'In Ayurveda, which of these is the sweet taste?',
    [
      { text: 'Rice', correct: true },
      { text: 'Lemon', whyWrong: 'Lemon is the sour taste. Sourness is warming and appetite-rousing rather than building.' },
      { text: 'Rocket and chicory', whyWrong: 'These are the bitter taste — cooling and lightening, close to the opposite of sweet.' },
      { text: 'Black pepper', whyWrong: 'Pepper is pungent: heating and drying, the most reducing of the six tastes.' },
    ],
    'Sweet in Ayurveda means building and settling, which covers grains, milk, ripe fruit, and root vegetables — far more than sugar. It is the most commonly misread of the six.'),

  mcq('q-taste-8', 'six-tastes', 'six-tastes',
    'Why does the classical advice recommend including all six tastes across a day?',
    [
      { text: 'Because each carries different qualities, and living on two of them skews you in one direction', correct: true },
      { text: 'Because it guarantees nutritional completeness', whyWrong: 'That is a modern nutritional idea. The classical reasoning is about qualities and their effects, not about nutrients.' },
      { text: 'Because the tastes cancel each other out', whyWrong: 'They are not neutralising each other; each is doing something, and variety keeps any one effect from dominating.' },
      { text: 'It is a ritual requirement rather than a practical one', whyWrong: 'The reasoning given in the sources is practical and follows directly from the qualities each taste carries.' },
    ],
    'Most modern eating is heavy on sweet, sour, and salty and light on bitter and astringent — a consistent skew in one direction, which is what the advice is guarding against.',
    2),

  // ---- agni-ama ----
  mcq('q-agni-5', 'agni-ama', 'agni-ama',
    'Which state of digestive fire is associated with Vata?',
    [
      { text: 'Irregular — appetite comes and goes, with bloating', correct: true },
      { text: 'Sharp — ravenous and burning', whyWrong: 'That is the Pitta pattern. Sharpness and heat go together; Vata is variability.' },
      { text: 'Slow — heaviness after meals', whyWrong: 'That is the Kapha pattern. Slowness and heaviness go together.' },
      { text: 'Balanced', whyWrong: 'Balanced digestion is not associated with any single dosha — it is the state where none is in excess.' },
    ],
    'Three of the four states map onto the three doshas. Vata is irregularity, so its digestive expression is an appetite that cannot be relied on.'),

  scenario('q-agni-6', 'agni-ama', 'agni-ama',
    'What does the classical guidance say to do about weak digestion?',
    [
      { text: 'Adjust timing and restraint — eat when hungry, leave gaps, keep the main meal at midday', correct: true },
      { text: 'Add a supplement designed to support digestion', whyWrong: 'The classical guidance is almost entirely about timing and restraint, not about adding substances. And no app should be recommending you take anything.' },
      { text: 'Eat more, to give digestion something to work with', whyWrong: 'Adding more to a system that has not cleared what it already has is the opposite of what the framework suggests.' },
      { text: 'Fast completely until appetite returns', whyWrong: 'Waiting for genuine hunger is part of it, but a complete fast is a bigger intervention than the general guidance calls for and is not something to attempt from an app.' },
    ],
    'It is unglamorous and it is almost entirely about when and how much rather than what — which is a large part of why it gets skipped over in favour of products.',
    2),

  // ---- seven-dhatus ----
  scenario('q-dhatu-4', 'seven-dhatus', 'seven-dhatus',
    'Someone reports brittle nails and thinning hair. How does the dhatu model reason about it?',
    [
      { text: 'It asks what is arriving at that stage, which sends the question back up the line towards digestion', correct: true },
      { text: 'It targets the affected tissue directly', whyWrong: 'That is a tissue-first reading. The dhatu model is distinctive precisely because dependency between stages sends it upstream instead.' },
      { text: 'It treats the two as unrelated', whyWrong: 'In this model they share a position in the sequence, so it would look for a common upstream cause rather than two separate ones.' },
      { text: 'It looks for a channel blockage in the scalp', whyWrong: 'Channels are a different part of the framework. The dhatu model reasons through the formation sequence.' },
    ],
    'Whether or not you accept the physiology, the reasoning is internally consistent: if each stage is built from the one before, a downstream problem points upstream.',
    3),

  mcq('q-dhatu-5', 'seven-dhatus', 'seven-dhatus',
    'What are the malas?',
    [
      { text: 'The bodily wastes — classically stool, urine, and sweat', correct: true },
      { text: 'The seven tissues', whyWrong: 'Those are the dhatus. Malas are the wastes produced alongside them.' },
      { text: 'The channels', whyWrong: 'Those are srotas. Malas are what moves through some of them.' },
      { text: 'The refined essence at the end of the sequence', whyWrong: 'That is ojas — the opposite end of the process from the wastes.' },
    ],
    'Ayurveda reads their regularity as everyday evidence about how the whole system is running, which is why classical consultations ask about them so directly.'),

  // ---- srotas ----
  scenario('q-srotas-4', 'srotas', 'srotas',
    'Food passing through too quickly, and food sitting and stagnating. In srotas terms, what are these?',
    [
      { text: 'Two different failures of the same channel — excess flow and blockage', correct: true },
      { text: 'The same problem at different severities', whyWrong: 'They are opposite failures, not points on one scale, and the framework would address them in opposite directions.' },
      { text: 'Problems in two unrelated channels', whyWrong: 'Both concern the channel carrying food. What differs is how its flow has gone wrong.' },
      { text: 'Neither — srotas do not cover digestion', whyWrong: 'The channel carrying food is one of the named srotas, and digestion is central to the framework.' },
    ],
    'One channel, three named ways to fail: too much flow, blocked flow, and flow going the wrong way. Naming which one you have is most of the diagnosis in this model.'),

  mcq('q-srotas-5', 'srotas', 'srotas',
    'Why is so much practical Ayurvedic guidance about movement, warmth, and regularity?',
    [
      { text: 'All three keep matter moving along a pathway rather than settling in it', correct: true },
      { text: 'Because they are easy to recommend safely', whyWrong: 'They are safe, which is convenient — but the reason they are recommended is that they follow directly from the srotas model.' },
      { text: 'Because they raise body temperature', whyWrong: 'Only warmth does, and heat is not the mechanism the srotas model is reasoning about.' },
      { text: 'They are modern additions, not classical', whyWrong: 'All three appear throughout the classical daily-routine and seasonal guidance.' },
    ],
    'Once you read the body as a set of channels whose main failure mode is stagnation, "keep things moving" stops being a platitude and becomes the obvious conclusion.',
    2),

  // ---- dinacharya ----
  scenario('q-dina-5', 'dinacharya', 'dinacharya',
    'Someone is exhausted every morning, goes to bed at 1am, and cannot understand why. Which single change would the framework put first?',
    [
      { text: 'Getting to bed before the late-evening second wind arrives', correct: true },
      { text: 'A more substantial breakfast', whyWrong: 'Breakfast does not address the cause. The framework would look at the timing that produced the exhaustion first.' },
      { text: 'More vigorous morning exercise', whyWrong: 'Exercise may help eventually, but adding demand to someone already short of sleep is not the first move.' },
      { text: 'An earlier alarm to reset the rhythm', whyWrong: 'Waking earlier without sleeping earlier just deepens the deficit. The bedtime is the lever.' },
    ],
    'The 10pm–2am stretch is described as Pitta-dominant, which is the second wind. Beat it and you sleep; ride it and you are up until one — which is precisely what is happening here.'),

  mcq('q-dina-6', 'dinacharya', 'dinacharya',
    'Which three daily habits does this course single out as worth doing above the rest?',
    [
      { text: 'Consistent sleep and wake times, the main meal at midday, and scraping your tongue each morning', correct: true },
      { text: 'Oil massage, nasal application, and intensive cleansing', whyWrong: 'Oil massage is genuinely useful, but nasal application and cleansing procedures are practitioner-guided rather than everyday self-care.' },
      { text: 'Fasting, cold showers, and early rising', whyWrong: 'Only early rising is part of the classical routine here, and fasting is a bigger intervention than the general guidance recommends.' },
      { text: 'Herbs, supplements, and a strict diet', whyWrong: 'None of these appear in this app at all. Substances need a practitioner, and Ayurveda does not prescribe strict diets.' },
    ],
    'Nobody outside a residential setting does the full classical routine. Regular timing does more than everything else combined, and tongue scraping costs nothing and tells you something.'),

  // ---- ritucharya ----
  mcq('q-ritu-4', 'ritucharya', 'ritucharya',
    'What is the "accumulate, surge, subside" pattern?',
    [
      { text: 'Each dosha builds quietly in one season, surges in the next, then settles', correct: true },
      { text: 'The three stages of any illness', whyWrong: 'It describes seasonal dosha behaviour, not the course of an illness.' },
      { text: 'The daily cycle of the doshas', whyWrong: 'The daily cycle is a separate scheme — six four-hour stretches cycling twice.' },
      { text: 'How the tissues form in sequence', whyWrong: 'That is the dhatu model. This one is about seasons.' },
    ],
    'It is why the sources sometimes recommend acting in the season before the one where you would expect trouble — the build-up happens earlier than the symptoms.',
    2),

  scenario('q-ritu-5', 'ritucharya', 'ritucharya',
    'Someone finds late autumn consistently the hardest time of year — dry skin, broken sleep, scattered attention. What does that suggest?',
    [
      { text: 'A Vata-forward pattern, since autumn shares Vata qualities', correct: true },
      { text: 'A Kapha-forward pattern', whyWrong: 'Kapha finds damp cold hardest, typically late winter into spring, and presents as heaviness rather than dryness.' },
      { text: 'A Pitta-forward pattern', whyWrong: 'Pitta finds summer heat hardest, and presents as irritability and overheating rather than dryness and broken sleep.' },
      { text: 'Nothing — seasonal preference is unrelated to constitution', whyWrong: 'Lived seasonal response is direct evidence and arguably a clearer signal than any questionnaire.' },
    ],
    'Dry, windy, changeable weather shares Vata qualities, so it amplifies a Vata-forward pattern. Which season you feel worst in is often the most useful clue you have.'),

  // ---- prakriti-vikriti ----
  scenario('q-pv-5', 'prakriti-vikriti', 'prakriti-vikriti',
    'Your constitution reads Kapha-forward, and your current reading shows Vata clearly raised. What does that mean?',
    [
      { text: 'Something has unsettled you — the Vata elevation is what to address, not your Kapha baseline', correct: true },
      { text: 'Your constitution has shifted towards Vata', whyWrong: 'Constitution is described as stable across life. A gap between the two readings is a current-state change, not a baseline change.' },
      { text: 'The assessment contradicted itself and should be retaken', whyWrong: 'A gap between baseline and current state is exactly what the two assessments exist to reveal. It is the signal, not an error.' },
      { text: 'You should follow Kapha guidance, since that is your real constitution', whyWrong: 'This gets it backwards. The elevated dosha is the changeable part and the thing guidance should address.' },
    ],
    'The useful information lives in the gap between the two readings. A high baseline is not a problem; a dosha higher than your own baseline is what to work with.',
    3),

  mcq('q-pv-6', 'prakriti-vikriti', 'prakriti-vikriti',
    'What should you conclude if your current reading is close to your baseline?',
    [
      { text: 'Nothing notable has shifted — which is a real result, not a failure', correct: true },
      { text: 'The assessment was not sensitive enough', whyWrong: 'A tool that always finds something is a tool that always has a reason to recommend something. Finding nothing is a legitimate outcome.' },
      { text: 'You should answer again more carefully', whyWrong: 'Re-answering until a result appears is how you manufacture one that is not there.' },
      { text: 'You have no imbalance of any kind', whyWrong: 'A questionnaire has not established that either. It has found no clear shift, which is a narrower claim.' },
    ],
    'A system that always finds an imbalance is a system that always has an excuse to sell you something. Reporting "nothing notable changed" honestly is what makes the rest credible.',
    2),
]
