import type { Quiz, QuizQuestion } from '../schema/quiz'
import { bodySystemQuestions } from './body-systems'
import { extraQuestions } from './extra'
import { foundationQuestions } from './foundations'
import { qualitiesTastesQuestions } from './qualities-tastes'
import { routineQuestions } from './routines'

export const quizQuestions: QuizQuestion[] = [
  ...foundationQuestions,
  ...qualitiesTastesQuestions,
  ...bodySystemQuestions,
  ...routineQuestions,
  ...extraQuestions,
]

/** One knowledge check per lesson, built from the questions tagged to it. */
const LESSON_QUIZZES: Array<{ lessonId: string; title: string }> = [
  { lessonId: 'what-ayurveda-is', title: 'Check: what Ayurveda is' },
  { lessonId: 'five-elements', title: 'Check: the five elements' },
  { lessonId: 'three-doshas', title: 'Check: the three doshas' },
  { lessonId: 'twenty-gunas', title: 'Check: the twenty qualities' },
  { lessonId: 'six-tastes', title: 'Check: the six tastes' },
  { lessonId: 'agni-ama', title: 'Check: digestive fire' },
  { lessonId: 'seven-dhatus', title: 'Check: the seven tissues' },
  { lessonId: 'srotas', title: 'Check: the channels' },
  { lessonId: 'dinacharya', title: 'Check: the shape of a day' },
  { lessonId: 'ritucharya', title: 'Check: the shape of a year' },
  { lessonId: 'prakriti-vikriti', title: 'Check: baseline and current state' },
]

export const quizzes: Quiz[] = LESSON_QUIZZES.map(({ lessonId, title }) => ({
  id: `quiz-${lessonId}`,
  lessonId,
  title,
  questionIds: quizQuestions.filter((q) => q.lessonId === lessonId).map((q) => q.id),
}))
