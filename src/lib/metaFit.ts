export const META_MIN = 120
export const META_MAX = 155

export function fitsMeta(s: string): boolean {
  return s.length >= META_MIN && s.length <= META_MAX && /[.?!]$/.test(s)
}

/**
 * Returns the first candidate that satisfies the meta description rules.
 * Candidates are full hand-written sentences ordered richest first.
 * Nothing is sliced or truncated. If none fit, the last candidate is
 * returned so the problem is visible in the test guard instead of hidden.
 */
export function pickMeta(candidates: string[]): string {
  return candidates.find(fitsMeta) ?? candidates[candidates.length - 1]
}
