import type { AssessmentQuestion, AssessmentType } from '../schema/assessment'
import type { Category } from '../schema/common'

/**
 * Compact constructor for the common shape: three options, one per dosha,
 * each weighted 1.0 for its own dosha.
 *
 * `reliability` is the important argument. Stable physical traits carry 1.5-2.0;
 * physiological patterns 1.0-1.5; mood and preference 0.5-1.0. Treating "my bone
 * structure" and "my mood today" as equally diagnostic of a lifelong
 * constitution is the classic flaw of web dosha quizzes (research.md R1).
 */
export function q(
  id: string,
  assessmentType: AssessmentType,
  category: Category,
  reliability: number,
  prompt: string,
  options: { vata: string; pitta: string; kapha: string },
  extra: { helpText?: string; optional?: boolean } = {}
): AssessmentQuestion {
  return {
    id,
    assessmentType,
    category,
    prompt,
    reliability,
    optional: extra.optional ?? false,
    ...(extra.helpText ? { helpText: extra.helpText } : {}),
    options: [
      { id: `${id}-v`, text: options.vata, weights: { vata: 1, pitta: 0, kapha: 0 } },
      { id: `${id}-p`, text: options.pitta, weights: { vata: 0, pitta: 1, kapha: 0 } },
      { id: `${id}-k`, text: options.kapha, weights: { vata: 0, pitta: 0, kapha: 1 } },
    ],
  }
}

export const LIFETIME_HELP =
  'Answer for your whole adult life, not for the last few weeks. If two answers both feel true, pick the one that has been true for longer.'
