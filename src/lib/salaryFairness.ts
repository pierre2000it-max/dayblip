// Salary fairness math used by blog/is-my-salary-fair.
// Cost-of-living indexes come from src/data/cost-of-living.ts (national average = 100).

export const FAIR_BAND = 0.1

/** Pay needed in a city with index `toIndex` to match `salary` earned in a city with index `fromIndex`. */
export function adjustForArea(salary: number, fromIndex: number, toIndex: number): number {
  return (salary * toIndex) / fromIndex
}

/** Range around a market figure. Default band is +/-10%. */
export function fairRange(market: number, band: number = FAIR_BAND): { low: number; high: number } {
  return { low: market * (1 - band), high: market * (1 + band) }
}

export type Verdict = "below" | "within" | "above"

export function verdict(pay: number, market: number, band: number = FAIR_BAND): Verdict {
  const { low, high } = fairRange(market, band)
  if (pay < low) return "below"
  if (pay > high) return "above"
  return "within"
}

/**
 * Pay lost over `years` if a yearly gap of `gap` stays the same share of pay,
 * so it grows with each raise (raises are a % of base). Year 1 loses `gap`.
 */
export function gapCost(gap: number, raiseRate: number, years: number): number {
  if (raiseRate === 0) return gap * years
  return (gap * (Math.pow(1 + raiseRate, years) - 1)) / raiseRate
}
