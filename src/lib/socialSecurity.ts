// Single source of truth for Social Security retirement claiming rules.
//
// Source: SSA, "Retirement Benefits: Full retirement age" and "Delayed
// Retirement Credits" (ssa.gov/benefits/retirement/planner). Verified Oct 2026.
//   - Full retirement age (FRA) is 66 for 1954 and earlier, rises 2 months a
//     year for 1955-1959, and is 67 for 1960 and later.
//   - Claiming before FRA cuts the benefit 5/9 of 1% per month for the first 36
//     months and 5/12 of 1% per month beyond that.
//   - Claiming after FRA adds 2/3 of 1% per month (8% a year) up to age 70,
//     for anyone born 1943 or later.

/** Full retirement age in months. */
export function fraMonths(birthYear: number): number {
  if (birthYear <= 1954) return 66 * 12
  if (birthYear >= 1960) return 67 * 12
  return 66 * 12 + (birthYear - 1954) * 2
}

/** Full retirement age in years (can be fractional, e.g. 66.1667). */
export function fraYears(birthYear: number): number {
  return fraMonths(birthYear) / 12
}

/** "66 years" or "66 years, 2 months". */
export function fraLabel(birthYear: number): string {
  const m = fraMonths(birthYear)
  const years = Math.floor(m / 12)
  const rem = m % 12
  return rem === 0 ? `${years} years` : `${years} years, ${rem} months`
}

/**
 * Share of the full-retirement-age benefit paid when claiming at a given age
 * (in months). Claims before 62 are not allowed and are treated as 62. Credits
 * stop at 70.
 */
export function claimFactor(claimMonths: number, birthYear: number): number {
  const fra = fraMonths(birthYear)
  const claim = Math.min(Math.max(claimMonths, 62 * 12), 70 * 12)
  if (claim >= fra) return 1 + ((claim - fra) * (2 / 3)) / 100
  const early = fra - claim
  const first = Math.min(early, 36)
  const rest = Math.max(0, early - 36)
  return 1 - (first * (5 / 9) + rest * (5 / 12)) / 100
}

/** Same as claimFactor, for a whole-year claiming age. */
export function claimFactorAtAge(age: number, birthYear: number): number {
  return claimFactor(age * 12, birthYear)
}
