import type { AssessmentQuestion } from '../schema/assessment'
import { LIFETIME_HELP, q } from './helpers'

/**
 * Physical traits. These carry the highest reliability weights because they are
 * the most stable signal available to a questionnaire — a frame does not change
 * because you had a hard week.
 */
export const prakritiPhysical: AssessmentQuestion[] = [
  q('body-frame', 'prakriti', 'physical', 2.0,
    'How would you describe your natural body frame?',
    {
      vata: 'Slight and narrow — I have always been on the thin or lanky side',
      pitta: 'Medium and proportionate — neither notably slim nor notably solid',
      kapha: 'Broad and solid — I have always been sturdily built',
    },
    { helpText: LIFETIME_HELP }),

  q('bone-structure', 'prakriti', 'physical', 2.0,
    'What are your joints and bones like?',
    {
      vata: 'Prominent — my knuckles, wrists and collarbones show clearly',
      pitta: 'Moderate — visible but not prominent',
      kapha: 'Well covered — my joints are not easy to make out',
    },
    { helpText: LIFETIME_HELP }),

  q('weight-history', 'prakriti', 'physical', 1.8,
    'Across your adult life, how has your weight behaved?',
    {
      vata: 'I find it hard to put weight on and lose it easily',
      pitta: 'It has stayed fairly steady, and shifts predictably with what I do',
      kapha: 'I put weight on easily and find it hard to shift',
    },
    { helpText: LIFETIME_HELP }),

  q('height-build', 'prakriti', 'physical', 1.5,
    'How would you describe your height relative to your family and peers?',
    {
      vata: 'Notably tall or notably short — at one end of the range',
      pitta: 'Average — squarely in the middle',
      kapha: 'Average to tall, with noticeable breadth as well as height',
    }),

  q('skin-texture', 'prakriti', 'physical', 1.8,
    'What is your skin normally like to the touch?',
    {
      vata: 'Dry, thin, and inclined to roughness',
      pitta: 'Warm, fine, and inclined to redden or flush',
      kapha: 'Thick, cool, and smooth',
    },
    { helpText: LIFETIME_HELP }),

  q('skin-oiliness', 'prakriti', 'physical', 1.7,
    'Left alone without moisturiser, how does your skin behave?',
    {
      vata: 'It gets dry and tight, especially hands and lips',
      pitta: 'It stays comfortable but is sensitive and reacts visibly',
      kapha: 'It stays moist, sometimes oily',
    }),

  q('complexion', 'prakriti', 'physical', 1.5,
    'How does your skin tone respond to sun and cold?',
    {
      vata: 'It goes dull or greyish, and I look tired quickly',
      pitta: 'It reddens or burns readily',
      kapha: 'It tans evenly and rarely reacts much',
    }),

  q('hair-texture', 'prakriti', 'physical', 1.7,
    'What is your hair like?',
    {
      vata: 'Dry, fine, and inclined to frizz or split',
      pitta: 'Fine and soft, and it greyed or thinned early',
      kapha: 'Thick, heavy, and abundant',
    },
    { helpText: LIFETIME_HELP }),

  q('eyes', 'prakriti', 'physical', 1.6,
    'How would you describe your eyes?',
    {
      vata: 'Small or narrow, often dry, and quick-moving',
      pitta: 'Medium and sharp, sensitive to bright light',
      kapha: 'Large and steady, with thick lashes',
    }),

  q('teeth', 'prakriti', 'physical', 1.5,
    'What are your teeth like?',
    {
      vata: 'Irregular or crowded, and sensitive',
      pitta: 'Medium sized, and my gums are inclined to be tender',
      kapha: 'Large, strong, and evenly set',
    }),

  q('lips', 'prakriti', 'physical', 1.5,
    'What are your lips normally like?',
    {
      vata: 'Thin, and they chap easily',
      pitta: 'Medium, and noticeably red',
      kapha: 'Full and smooth',
    }),

  q('nails', 'prakriti', 'physical', 1.5,
    'What are your fingernails like?',
    {
      vata: 'Brittle, ridged, or inclined to break',
      pitta: 'Soft, pink, and flexible',
      kapha: 'Thick, strong, and pale',
    }),

  q('veins-tendons', 'prakriti', 'physical', 1.7,
    'How visible are the veins and tendons on the back of your hands?',
    {
      vata: 'Very visible — clearly raised',
      pitta: 'Somewhat visible',
      kapha: 'Barely visible',
    }),

  q('chest-shoulders', 'prakriti', 'physical', 1.6,
    'How would you describe your chest and shoulders?',
    {
      vata: 'Narrow and flat',
      pitta: 'Medium and even',
      kapha: 'Broad and full',
    }),

  q('muscle', 'prakriti', 'physical', 1.5,
    'How does your body respond to physical training?',
    {
      vata: 'I build muscle slowly and lose it quickly',
      pitta: 'I build muscle readily and hold it well',
      kapha: 'I build bulk and strength easily, though it is well covered',
    }),

  q('hands-feet-temp', 'prakriti', 'physical', 1.6,
    'What temperature are your hands and feet, most of the time?',
    {
      vata: 'Cold — often noticeably colder than the room',
      pitta: 'Warm, sometimes uncomfortably so',
      kapha: 'Cool but not cold, and steady',
    }),

  q('body-hair', 'prakriti', 'physical', 1.3,
    'What is your body hair like?',
    {
      vata: 'Sparse and fine',
      pitta: 'Moderate, often fair or reddish',
      kapha: 'Plentiful, thick, and dark',
    },
    { optional: true }),

  q('voice', 'prakriti', 'physical', 1.4,
    'What is your natural speaking voice like?',
    {
      vata: 'Light, fast, and it tires or goes hoarse easily',
      pitta: 'Clear, sharp, and carrying',
      kapha: 'Deep, slow, and resonant',
    }),

  q('gait', 'prakriti', 'physical', 1.4,
    'How do you walk?',
    {
      vata: 'Quickly and lightly, often changing pace',
      pitta: 'At a purposeful, determined pace',
      kapha: 'Steadily and unhurriedly',
    }),

  q('sweating', 'prakriti', 'physical', 1.6,
    'How readily do you sweat?',
    {
      vata: 'Very little, even when working hard',
      pitta: 'Easily and heavily, and I notice the smell',
      kapha: 'Moderately, and only after sustained effort',
    }),
]
