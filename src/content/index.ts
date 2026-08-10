/**
 * The typed content registry. Everything the app knows about Ayurveda enters
 * here and nowhere else.
 *
 * Content is data, not code (constitution Principle III): a domain expert can
 * review and correct any of these modules without reading a line of React.
 */

import { assessmentQuestions, contradictions, redFlagQuestions } from './assessment'
import { scoringConfig } from './config'
import { glossary } from './glossary'
import { lessons } from './lessons'
import { onboarding } from './onboarding'
import { quizQuestions, quizzes } from './quiz'
import { recommendationRules, planNotices } from './recommendations'
import { referenceEntries } from './reference'
import { contentVersion } from './version'

export const content = {
  version: contentVersion,
  config: scoringConfig,
  onboarding,
  glossary,
  lessons,
  quizzes,
  quizQuestions,
  assessmentQuestions,
  contradictions,
  redFlagQuestions,
  recommendationRules,
  planNotices,
  referenceEntries,
}

export type Content = typeof content

// Raw collections, for components that need the whole list rather than a lookup.
export {
  glossary,
  lessons,
  quizzes,
  quizQuestions,
  assessmentQuestions,
  contradictions,
  redFlagQuestions,
  recommendationRules,
  referenceEntries,
  onboarding,
}

// ---- Lookup helpers. Content ids are validated by gate C7, so these are
// ---- safe to use without defensive checks at every call site.

export const glossaryById = new Map(glossary.map((t) => [t.id, t]))
export const lessonById = new Map(lessons.map((l) => [l.id, l]))
export const quizById = new Map(quizzes.map((q) => [q.id, q]))
export const quizQuestionById = new Map(quizQuestions.map((q) => [q.id, q]))
export const assessmentQuestionById = new Map(assessmentQuestions.map((q) => [q.id, q]))
export const referenceEntryById = new Map(referenceEntries.map((e) => [e.id, e]))

export const lessonsInOrder = [...lessons].sort((a, b) => a.order - b.order)

export const prakritiQuestions = assessmentQuestions.filter(
  (q) => q.assessmentType === 'prakriti'
)
export const vikritiQuestions = assessmentQuestions.filter((q) => q.assessmentType === 'vikriti')

export function questionsForQuiz(quizId: string) {
  const quiz = quizById.get(quizId)
  if (!quiz) return []
  return quiz.questionIds
    .map((id) => quizQuestionById.get(id))
    .filter((q): q is NonNullable<typeof q> => q !== undefined)
}

export { contentVersion, scoringConfig }
