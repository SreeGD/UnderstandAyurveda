/**
 * Search normalisation.
 *
 * The hard part of searching this corpus is not fuzzy matching, it is
 * transliteration: "dosa", "doṣa", and "dosha" are the same word. That is a
 * normalisation problem, and a generic search library does not solve it any
 * better than stripping diacritics and curating an alias list (research.md R7).
 */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    // Strip combining marks: ṣ → s, ā → a, ṛ → r.
    .replace(/[̀-ͯ]/g, '')
    // Common transliteration variants that survive mark-stripping.
    .replace(/ṃ|ṁ/g, 'm')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function tokens(text: string): string[] {
  return normalise(text).split(' ').filter(Boolean)
}

/** Bounded Levenshtein — returns `max + 1` as soon as it is certain to exceed. */
export function levenshtein(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  if (a === b) return 0

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    let rowMin = i

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const value = Math.min(
        (curr[j - 1] ?? Infinity) + 1,
        (prev[j] ?? Infinity) + 1,
        (prev[j - 1] ?? Infinity) + cost
      )
      curr[j] = value
      if (value < rowMin) rowMin = value
    }

    if (rowMin > max) return max + 1
    prev = curr
  }

  return prev[b.length] ?? max + 1
}
