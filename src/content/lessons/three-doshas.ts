import type { Lesson } from '../schema/lesson'
import { ASHTANGA_SUTRA, CHARAKA_SUTRA, EDITORIAL, SUSHRUTA_SUTRA } from '../sources'

export const threeDoshas: Lesson = {
  id: 'three-doshas',
  title: 'The three doshas',
  topic: 'three-doshas',
  order: 3,
  estimatedMinutes: 9,
  summary:
    'Vata, Pitta, and Kapha — the three working patterns Ayurveda uses to describe how a body and mind actually behave.',
  prerequisiteConcepts: [
    { lessonId: 'five-elements', label: 'The five elements' },
    { termId: 'pancha-mahabhuta', label: 'Pancha Mahabhuta' },
  ],
  quizId: 'quiz-three-doshas',
  body: [
    { kind: 'termIntro', termId: 'dosha' },
    {
      kind: 'paragraph',
      text: 'The five elements pair up into three patterns. Each pattern describes a job that has to get done in any living thing: things must move, things must be transformed, and things must hold together.',
      source: CHARAKA_SUTRA('1'),
    },
    {
      kind: 'table',
      caption: 'The three doshas and their elements',
      headers: ['Dosha', 'Elements', 'The job it does', 'Feels like'],
      rows: [
        ['Vata', 'Space + Air', 'Movement', 'Dry, light, cold, mobile, rough'],
        ['Pitta', 'Fire + Water', 'Transformation', 'Hot, sharp, light, slightly oily, spreading'],
        ['Kapha', 'Water + Earth', 'Structure', 'Heavy, cold, oily, smooth, stable'],
      ],
      source: ASHTANGA_SUTRA('1'),
    },

    { kind: 'heading', text: 'Vata — the pattern of movement' },
    { kind: 'termIntro', termId: 'vata' },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('12'),
      text: 'Chapter 12 of the Sutrasthana is largely given over to the functions attributed to Vata.',
    },
    {
      kind: 'paragraph',
      text: '[[vata]] governs everything that moves: breath, circulation, the passage of food, nerve signals, and thought itself. Because it is the only one of the three that actually moves things, the classical texts treat it as the one that pushes the other two around — which is why irregularity in Vata tends to unsettle everything else.',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        'Going well: quick thinking, creativity, enthusiasm, adaptability, light easy movement',
        'Under strain: restlessness, anxiety, broken sleep, dryness, irregular digestion, feeling scattered',
        'Aggravated by: irregularity, travel, cold, wind, too much stimulation, skipped meals',
      ],
    },

    { kind: 'heading', text: 'Pitta — the pattern of transformation' },
    { kind: 'termIntro', termId: 'pitta' },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('12'),
    },
    {
      kind: 'paragraph',
      text: '[[pitta]] governs conversion — food into tissue, light into sight, experience into judgement. Its physical face is digestion and body heat; its mental face is discernment, decisiveness, and the sharpness that comes with them.',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        'Going well: sharp focus, strong digestion, clear judgement, courage, warmth',
        'Under strain: irritability, impatience, running hot, acidity, criticism, burning out',
        'Aggravated by: heat, pushing through without breaks, delayed meals, sour and pungent food in quantity, competition',
      ],
    },

    { kind: 'heading', text: 'Kapha — the pattern of structure' },
    { kind: 'termIntro', termId: 'kapha' },
    {
      kind: 'sourceNote',
      source: CHARAKA_SUTRA('12'),
    },
    {
      kind: 'paragraph',
      text: '[[kapha]] governs everything that holds together and endures: tissue bulk, lubrication, immunity in the sense of resilience, and steadiness of mood. It is the pattern that gives a body substance and a person patience.',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        'Going well: stamina, calm, loyalty, steady strength, deep sleep',
        'Under strain: heaviness, sluggishness, congestion, flatness, difficulty starting, holding on too long',
        'Aggravated by: too little movement, heavy or very sweet food, damp cold, daytime sleeping, sameness',
      ],
    },

    { kind: 'heading', text: 'Everyone has all three' },
    { kind: 'termIntro', termId: 'tridosha' },
    {
      kind: 'callout',
      tone: 'misconception',
      title: 'You are not "a Vata"',
      text: 'This is the most common beginner error, and most online quizzes encourage it. Every person has all three doshas doing all three jobs — you could not digest without Pitta or hold together without Kapha. What differs between people is the proportion. Saying "I am Vata" is like saying "I am tall" as though height were a species.',
      source: EDITORIAL,
    },
    { kind: 'termIntro', termId: 'samadosha' },
    {
      kind: 'paragraph',
      text: 'Balance, in Ayurveda, does not mean equal thirds. [[samadosha]] means the doshas sitting in their own natural proportion for that person. A naturally solid, steady person is in balance when they are their own usual solid, steady self — not when they have been reduced to an average.',
      source: SUSHRUTA_SUTRA('15'),
    },

    { kind: 'heading', text: 'The doshas of the mind' },
    { kind: 'termIntro', termId: 'sattva' },
    { kind: 'termIntro', termId: 'rajas' },
    { kind: 'termIntro', termId: 'tamas' },
    {
      kind: 'paragraph',
      text: 'Alongside the three doshas, the classical texts describe three qualities of mind: [[sattva]] (clarity), [[rajas]] (activity), and [[tamas]] (inertia). These are a separate axis from the doshas and are worth knowing about, though this course keeps its focus on the physical three.',
      source: CHARAKA_SUTRA('1'),
    },
  ],
}
