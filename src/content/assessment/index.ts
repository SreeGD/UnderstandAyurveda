import type { AssessmentQuestion } from '../schema/assessment'
import { contradictions } from './contradictions'
import { prakritiMental } from './prakriti-mental'
import { prakritiPhysical } from './prakriti-physical'
import { prakritiPhysiological } from './prakriti-physiological'
import { redFlagQuestions } from './red-flags'
import { vikritiQuestionsData } from './vikriti'

export const assessmentQuestions: AssessmentQuestion[] = [
  ...prakritiPhysical,
  ...prakritiPhysiological,
  ...prakritiMental,
  ...vikritiQuestionsData,
]

export { contradictions, redFlagQuestions }
export { RED_FLAG_MESSAGES, RED_FLAG_ACKNOWLEDGEMENT } from './red-flags'
export {
  ELEVATION_EXPLANATIONS,
  NO_NOTABLE_CHANGE,
  VIKRITI_SEVERITY_NOTICE,
} from './vikriti-explanations'
