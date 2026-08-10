import { matching, mcq, scenario } from './helpers'

/** Quizzes for agni/ama, the seven dhatus, and srotas. */
export const bodySystemQuestions = [
  // ---- agni-ama ----
  mcq('q-agni-1', 'agni-ama', 'agni-ama',
    'What is agni?',
    [
      { text: 'Digestive fire — the capacity to break down and absorb what you take in', correct: true },
      { text: 'Body temperature', whyWrong: 'Warmth is related, but agni specifically names the capacity to process, not how warm you are.' },
      { text: 'The fire element in food', whyWrong: 'That is tejas as an element. Agni is the functional capacity in you, not a property of the food.' },
      { text: 'Anger and mental heat', whyWrong: 'Those are associated with Pitta. Agni is the digestive and metabolic capacity itself.' },
    ],
    'The classical position is that what matters is not what you eat but what you can process. Agni is that capacity, and most practical guidance protects it.'),

  matching('q-agni-2', 'agni-ama', 'agni-ama',
    'Match each state of digestive fire to how it presents.',
    [
      { left: 'Sama (balanced)', right: 'Regular appetite, comfortable digestion' },
      { left: 'Vishama (irregular)', right: 'Appetite comes and goes; bloating and gas' },
      { left: 'Tikshna (sharp)', right: 'Ravenous, burning, irritable when a meal is late' },
      { left: 'Manda (slow)', right: 'Little appetite, heaviness after eating' },
    ],
    'Three of the four map onto the three doshas — irregular to Vata, sharp to Pitta, slow to Kapha. Same qualities, showing up in one specific function.'),

  mcq('q-agni-3', 'agni-ama', 'agni-ama',
    'A wellness site describes ama as "toxins" and sells a supplement to clear them. What is the problem?',
    [
      { text: 'Ama is specifically undigested residue from weak digestion, not a general term for toxins', correct: true },
      { text: 'Ama is not a real Ayurvedic concept', whyWrong: 'It is entirely genuine and appears throughout the classical corpus. The problem is the translation, not the concept.' },
      { text: 'Nothing — "toxins" is an accurate translation', whyWrong: 'It is a loose translation that has been stretched to cover pollution, heavy metals, and anything else a product wants to target.' },
      { text: 'Ama can only be assessed with laboratory testing', whyWrong: 'The classical signs are ordinary observations — a coated tongue, heaviness, poor appetite. No laboratory is involved either way.' },
    ],
    'The classical concept is narrow and specific. "Toxins" is a vague word that lets a product claim to address almost anything, which is precisely why it gets used.',
    3),

  scenario('q-agni-4', 'agni-ama', 'agni-ama',
    'You wake with a thick coating on your tongue, no appetite, and a foggy heaviness. What does the framework suggest happened?',
    [
      { text: 'Digestion did not fully process what it was given, leaving residue', correct: true },
      { text: 'Your constitution has shifted overnight', whyWrong: 'Constitution is described as stable across life. An overnight change is a current-state observation, not a constitutional one.' },
      { text: 'You need a heavier breakfast to restore strength', whyWrong: 'Adding more to a system that has not cleared what it already has is the opposite of what this reading suggests. Appetite is the signal to wait for.' },
      { text: 'Your Vata is elevated', whyWrong: 'Heaviness and coating are Kapha-like and ama-like. Vata would present as dry, light, and irregular rather than heavy and coated.' },
    ],
    'Coated tongue, absent appetite, and heaviness are the classic ama signs. The classical response is restraint and timing, not more food and not a supplement.',
    2),

  // ---- seven-dhatus ----
  mcq('q-dhatu-1', 'seven-dhatus', 'seven-dhatus',
    'What is the defining feature of the dhatu model?',
    [
      { text: 'Each tissue is formed from the one before it, in sequence', correct: true },
      { text: 'Each tissue corresponds to one dosha', whyWrong: 'The doshas influence the tissues, but the seven do not map one-to-one onto three doshas. The sequence is the model\'s distinctive claim.' },
      { text: 'The tissues are independent of one another', whyWrong: 'The opposite. Dependency between stages is the whole point, and it is what sends the reasoning back to digestion.' },
      { text: 'They correspond directly to modern tissue types', whyWrong: 'It is a functional model, not histology. "Rasa" is not plasma as a laboratory would define it.' },
    ],
    'The dependency is why a complaint about hair or nails sends this framework back up the line to digestion rather than to the tissue itself.'),

  mcq('q-dhatu-2', 'seven-dhatus', 'seven-dhatus',
    'Which is the first dhatu in the sequence?',
    [
      { text: 'Rasa — plasma or nutrient fluid', correct: true },
      { text: 'Rakta — blood', whyWrong: 'Blood is second, described as formed from the plasma that precedes it.' },
      { text: 'Mamsa — muscle', whyWrong: 'Muscle is third. Two stages come before it.' },
      { text: 'Ojas', whyWrong: 'Ojas is not one of the seven — it is described as the refined essence produced at the end of the whole sequence.' },
    ],
    'Rasa is the immediate product of digestion, which is why weak agni is described as affecting everything downstream.'),

  mcq('q-dhatu-3', 'seven-dhatus', 'seven-dhatus',
    'What is ojas described as?',
    [
      { text: 'The refined essence produced at the end of the tissue sequence, underlying stamina and resilience', correct: true },
      { text: 'The eighth tissue', whyWrong: 'There are seven dhatus. Ojas is described as their end-product rather than another member of the sequence.' },
      { text: 'The waste produced by tissue formation', whyWrong: 'That is mala. Ojas is the refined essence, the opposite end of the process.' },
      { text: 'Another name for immunity in the biomedical sense', whyWrong: 'It is sometimes loosely translated that way, but the concept is about resilience and vigour generally, not about immune function as biology describes it.' },
    ],
    'Ojas is the classical answer to why one person is flattened by a hard week and another is not.',
    2),

  // ---- srotas ----
  mcq('q-srotas-1', 'srotas', 'srotas',
    'What does Ayurveda care about most when it comes to srotas?',
    [
      { text: 'Whether the channel is flowing properly', correct: true },
      { text: 'What the channel is made of', whyWrong: 'Ayurveda is notably uninterested in this. Its questions are about flow, not composition.' },
      { text: 'Where the channel begins and ends anatomically', whyWrong: 'Srotas do not correspond to named anatomical vessels, and mapping them onto a modern diagram misses what the category is for.' },
      { text: 'How many channels there are in total', whyWrong: 'Different sources count differently, and the number is not what the framework reasons with.' },
    ],
    'Flow first. It is why so much practical guidance is about movement, warmth, and regularity — all things that keep matter moving rather than settling.'),

  matching('q-srotas-2', 'srotas', 'srotas',
    'Match each channel problem to its everyday analogy.',
    [
      { left: 'Too much flow (atipravritti)', right: 'A tap left running' },
      { left: 'Blocked flow (sanga)', right: 'A drain clogged with grease' },
      { left: 'Flow reversed (vimarga gamana)', right: 'Water backing up a pipe' },
    ],
    'Three quite different experiences from one channel. You can tell them apart from the outside, which is exactly the point of the classification.'),

  scenario('q-srotas-3', 'srotas', 'srotas',
    'How does the framework connect weak digestion to heaviness somewhere else in the body entirely?',
    [
      { text: 'Residue from incomplete digestion is described as travelling and lodging in channels', correct: true },
      { text: 'Through the bloodstream carrying inflammatory markers', whyWrong: 'That is a biomedical mechanism, not the Ayurvedic one. The framework reasons about channels and flow, not about markers.' },
      { text: 'It does not — digestion and other systems are treated separately', whyWrong: 'The opposite. Linking them is one of the framework\'s most characteristic moves.' },
      { text: 'Through a shared dosha governing both regions', whyWrong: 'Doshas are involved, but the specific mechanism described is ama travelling and blocking channels.' },
    ],
    'This is where ama earns its place in the model — it is the link that lets a digestive problem explain a symptom elsewhere.',
    3),
]
