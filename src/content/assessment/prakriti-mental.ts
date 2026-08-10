import type { AssessmentQuestion } from '../schema/assessment'
import { LIFETIME_HELP, q } from './helpers'

/**
 * Mental and emotional tendencies. Lowest reliability weights by design: these
 * are the answers most contaminated by how the last fortnight has gone, and a
 * questionnaire cannot separate a lifelong tendency from a current mood.
 */
export const prakritiMental: AssessmentQuestion[] = [
  q('speech-pace', 'prakriti', 'mental-emotional', 1.0,
    'How do you talk?',
    {
      vata: 'Fast, and I jump between topics',
      pitta: 'Precisely and persuasively, and I argue my case',
      kapha: 'Slowly and calmly, and I say less than others',
    },
    { helpText: LIFETIME_HELP }),

  q('learning-speed', 'prakriti', 'mental-emotional', 1.0,
    'How do you take in new information?',
    {
      vata: 'Very quickly, though it does not always stick',
      pitta: 'At a moderate pace, with sharp comprehension',
      kapha: 'Slowly, but once I have it I have it for good',
    }),

  q('memory', 'prakriti', 'mental-emotional', 1.0,
    'What is your memory like?',
    {
      vata: 'I learn fast and forget fast',
      pitta: 'Sharp and accurate for things that mattered',
      kapha: 'Slow to form, but long and reliable',
    }),

  q('decision-style', 'prakriti', 'mental-emotional', 0.9,
    'How do you make decisions?',
    {
      vata: 'I change my mind repeatedly and find it hard to settle',
      pitta: 'Quickly and firmly, and I rarely revisit them',
      kapha: 'Slowly and deliberately, and I stick with them',
    }),

  q('stress-response', 'prakriti', 'mental-emotional', 1.0,
    'When you are under real pressure, what happens?',
    {
      vata: 'I get anxious and scattered',
      pitta: 'I get irritable and sharp with people',
      kapha: 'I withdraw and go quiet',
    },
    { helpText: LIFETIME_HELP }),

  q('mood-stability', 'prakriti', 'mental-emotional', 0.9,
    'How does your mood behave?',
    {
      vata: 'It shifts quickly and often',
      pitta: 'It is fairly steady, with sharp flares',
      kapha: 'It is very steady and slow to shift',
    }),

  q('anger', 'prakriti', 'mental-emotional', 0.9,
    'How do you handle irritation?',
    {
      vata: 'It flares and passes almost immediately',
      pitta: 'It builds fast and I say something',
      kapha: 'It takes a great deal to rouse me, but it lasts',
    }),

  q('focus', 'prakriti', 'mental-emotional', 0.9,
    'What is your concentration like?',
    {
      vata: 'Intense but brief — I am easily pulled away',
      pitta: 'Sustained and directed at a goal',
      kapha: 'Slow to start, then very hard to interrupt',
    }),

  q('organisation', 'prakriti', 'mental-emotional', 0.8,
    'How organised are you?',
    {
      vata: 'My systems keep changing and rarely survive',
      pitta: 'Very — I like order and plans',
      kapha: 'Consistent, if a bit cluttered — I keep things',
    }),

  q('change-response', 'prakriti', 'mental-emotional', 1.0,
    'How do you feel about change and disruption?',
    {
      vata: 'I am drawn to it, but it unsettles me',
      pitta: 'Fine, as long as I am the one directing it',
      kapha: 'I resist it and prefer things as they are',
    }),

  q('social-style', 'prakriti', 'mental-emotional', 0.8,
    'How are you in company?',
    {
      vata: 'Enthusiastic and talkative, then suddenly drained',
      pitta: 'Engaged and opinionated, comfortable leading',
      kapha: 'Warm and steady, happy to listen',
    }),

  q('spending', 'prakriti', 'mental-emotional', 0.7,
    'How do you handle money?',
    {
      vata: 'Impulsively — it goes on small things without a plan',
      pitta: 'Deliberately — I spend on quality and on goals',
      kapha: 'Cautiously — I save and hold on to things',
    },
    { optional: true }),

  q('dreams', 'prakriti', 'mental-emotional', 0.6,
    'What are your dreams like, when you remember them?',
    {
      vata: 'Vivid, restless, full of movement or falling',
      pitta: 'Intense and often about conflict or achievement',
      kapha: 'Calm, watery, and infrequent',
    },
    { optional: true }),

  q('patience', 'prakriti', 'mental-emotional', 0.9,
    'How patient are you?',
    {
      vata: 'Not very — I get restless waiting',
      pitta: 'Only when things are progressing',
      kapha: 'Very — waiting does not bother me',
    }),

  q('work-style', 'prakriti', 'mental-emotional', 0.8,
    'How do you approach a long piece of work?',
    {
      vata: 'In bursts, starting many things and finishing few',
      pitta: 'With a plan and a deadline I intend to beat',
      kapha: 'Steadily, at my own pace, until it is done',
    }),
]
