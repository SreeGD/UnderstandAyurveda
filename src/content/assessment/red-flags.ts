import type { RedFlagQuestion } from '../schema/assessment'

/**
 * Screening before results are shown (FR-023). Answering yes to any of these
 * routes the user to professional-care guidance BEFORE their result — not
 * alongside it, and not after.
 *
 * The point is not to exclude anyone. It is that a person managing something
 * real deserves to hear "talk to someone qualified" before they hear a
 * questionnaire's opinion about their constitution.
 */
export const redFlagQuestions: RedFlagQuestion[] = [
  {
    id: 'pregnancy',
    prompt: 'Are you pregnant, or have you given birth in the last six months?',
    helpText:
      'Routine advice about food, fasting, and vigorous activity often needs adjusting during pregnancy and afterwards.',
  },
  {
    id: 'acute-symptoms',
    prompt: 'Are you currently unwell in a way that concerns you, or dealing with severe or sudden symptoms?',
    helpText:
      'For example: severe pain, a high fever, unexplained weight loss, or anything that has come on quickly and is getting worse.',
  },
  {
    id: 'diagnosed-condition',
    prompt: 'Are you living with a condition that a doctor has diagnosed?',
    helpText: 'Ongoing conditions of any kind, whether or not you currently take anything for them.',
  },
  {
    id: 'current-medication',
    prompt: 'Are you currently taking medicines prescribed by a doctor?',
    helpText: 'Including anything you take regularly, even if it feels routine.',
  },
]

export const RED_FLAG_MESSAGES: Record<string, { title: string; body: string }> = {
  pregnancy: {
    title: 'Please check with a professional first',
    body: 'General lifestyle guidance is not written with pregnancy or the months after birth in mind. The US National Institutes of Health advises that people who are pregnant or nursing should be especially sure to consult their health care provider before using Ayurvedic therapy. Before changing your food, your fasting patterns, or your activity, talk it through with your midwife, doctor, or a qualified Ayurvedic practitioner who knows your situation.',
  },
  'acute-symptoms': {
    title: 'Please speak to a doctor',
    body: 'Something that has come on quickly, is severe, or is getting worse needs a clinician looking at it — not a questionnaire. Please seek care. You are welcome to come back to this afterwards.',
  },
  'diagnosed-condition': {
    title: 'Bring a professional into this',
    body: 'A general lifestyle app cannot account for a diagnosed condition. The US National Institutes of Health is explicit that any diagnosis should come from a provider with substantial conventional medical training and experience managing that condition. Please discuss any changes with the clinician who looks after you, and consider seeing a qualified Ayurvedic practitioner who can work alongside them.',
  },
  'current-medication': {
    title: 'Do not change anything you have been prescribed',
    body: 'Nothing in this app is a substitute for what your doctor has given you, and nothing here should be used to adjust it. If you want to add lifestyle changes alongside your care, please raise them with your doctor first.',
  },
}

export const RED_FLAG_ACKNOWLEDGEMENT =
  'I understand this is educational content, not medical advice, and that I should speak to a qualified professional about my situation.'
