import type { Dosha } from '../schema/common'

export interface ElevationExplanation {
  title: string
  whatItLooksLike: string
  whatItUsuallyFollows: string
  temporary: string
}

/**
 * Shown when a dosha reads notably higher than the user's baseline. Every one of
 * these frames the state as temporary and changeable — that framing is the whole
 * difference between "here is a pattern you can work with" and "here is what is
 * wrong with you".
 */
export const ELEVATION_EXPLANATIONS: Record<Dosha, ElevationExplanation> = {
  vata: {
    title: 'Vata is reading higher than your baseline',
    whatItLooksLike:
      'Broken sleep, a busy mind that will not settle, irregular digestion with bloating or gas, dry skin, cold hands, and a feeling of being scattered or wired-but-tired.',
    whatItUsuallyFollows:
      'Classically associated with irregularity: travel, late nights, meals at unpredictable times, too much stimulation, cold and dry weather, and long stretches without rest.',
    temporary:
      'This is a state, not a verdict. Vata responds quickly to regularity — often within days of eating and sleeping at consistent times.',
  },
  pitta: {
    title: 'Pitta is reading higher than your baseline',
    whatItLooksLike:
      'Running hot, waking early and unable to drop back off, sharp hunger and irritation when meals are late, acidity, skin reactivity, impatience, and difficulty stopping once you have started something.',
    whatItUsuallyFollows:
      'Classically associated with intensity and heat: long hours without breaks, hot weather, sour and pungent food in quantity, competitive pressure, and pushing through when you are already depleted.',
    temporary:
      'This is a state, not a verdict. It tends to settle when the pace comes down and meals become regular and less sharp.',
  },
  kapha: {
    title: 'Kapha is reading higher than your baseline',
    whatItLooksLike:
      'Heaviness, sleeping long and waking unrefreshed, sluggish digestion, congestion, reluctance to start things, and a flat or unmotivated mood.',
    whatItUsuallyFollows:
      'Classically associated with accumulation: too little movement, long sitting, rich or heavy food, damp and cold weather, daytime sleeping, and long stretches of sameness.',
    temporary:
      'This is a state, not a verdict. Kapha usually shifts with stimulation — movement, warmth, variety, and lighter meals.',
  },
}

export const NO_NOTABLE_CHANGE = {
  title: 'Nothing is reading notably out of your usual range',
  body: 'Your current answers sit close to your baseline. That is a perfectly good result — it does not mean you answered wrongly, and it does not mean there is nothing to work on. It means this assessment has not found a clear shift worth naming, and inventing one would not help you.',
}

export const VIKRITI_SEVERITY_NOTICE = {
  title: 'Some of what you described deserves a professional eye',
  body: 'You reported symptoms that have been persistent or severe. A self-assessment cannot tell you what is behind them, and reading this as a "dosha imbalance" could delay finding out. Please speak to a doctor or a qualified Ayurvedic practitioner about these specifically.',
}
