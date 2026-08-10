import type { TopicId } from '../schema/common'
import type { QuizQuestion } from '../schema/quiz'

interface OptionSpec {
  text: string
  correct?: boolean
  /** Required on every incorrect option — gate C6 enforces it. */
  whyWrong?: string
}

/**
 * Multiple choice. Every wrong option must carry a `whyWrong` that teaches
 * something rather than just saying "no" — that explanation is where most of the
 * learning in a quiz actually happens.
 */
export function mcq(
  id: string,
  topic: TopicId,
  lessonId: string,
  prompt: string,
  options: OptionSpec[],
  whyCorrect: string,
  difficulty: 1 | 2 | 3 = 1
): QuizQuestion {
  return build('multiple-choice', id, topic, lessonId, prompt, options, whyCorrect, difficulty)
}

/** Applied scenario — "a friend describes X; which pattern is showing?" */
export function scenario(
  id: string,
  topic: TopicId,
  lessonId: string,
  prompt: string,
  options: OptionSpec[],
  whyCorrect: string,
  difficulty: 1 | 2 | 3 = 2
): QuizQuestion {
  return build('scenario', id, topic, lessonId, prompt, options, whyCorrect, difficulty)
}

function build(
  type: 'multiple-choice' | 'scenario',
  id: string,
  topic: TopicId,
  lessonId: string,
  prompt: string,
  options: OptionSpec[],
  whyCorrect: string,
  difficulty: 1 | 2 | 3
): QuizQuestion {
  const built = options.map((o, i) => ({
    id: `${id}-${i}`,
    text: o.text,
    ...(o.correct ? {} : { whyWrong: o.whyWrong ?? '' }),
  }))

  const correctIndex = options.findIndex((o) => o.correct)

  return {
    id,
    topic,
    lessonId,
    type,
    prompt,
    options: built,
    pairs: [],
    correctAnswer: `${id}-${correctIndex}`,
    whyCorrect,
    difficulty,
  }
}

/** Matching. Keyboard-operable in the UI — never drag-only. */
export function matching(
  id: string,
  topic: TopicId,
  lessonId: string,
  prompt: string,
  pairs: Array<{ left: string; right: string }>,
  whyCorrect: string,
  difficulty: 1 | 2 | 3 = 2
): QuizQuestion {
  return {
    id,
    topic,
    lessonId,
    type: 'matching',
    prompt,
    options: [],
    pairs,
    whyCorrect,
    difficulty,
  }
}
