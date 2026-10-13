// Single source of truth for 2026 US federal tax constants.
//
// Source: IRS Rev. Proc. 2025-32 (income tax brackets and standard deduction)
// and SSA contribution and benefit base (https://www.ssa.gov/oact/cola/cbb.html).
//
// Every calculator that needs brackets, the standard deduction, or the Social
// Security cap imports from here. Do not copy these numbers into a page.
// Annual update: edit this file only, then run `npm test`.

export type Filing = "single" | "mfj" | "mfs" | "hoh"

export const TAX_YEAR = 2026

export const STANDARD_DEDUCTION: Record<Filing, number> = {
  single: 16100,
  mfj: 32200,
  mfs: 16100,
  hoh: 24150,
}

// [upper limit of taxable income for the bracket, marginal rate]
export type Bracket = readonly [number, number]

export const BRACKETS: Record<Filing, readonly Bracket[]> = {
  single: [
    [12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24],
    [256225, 0.32], [640600, 0.35], [Infinity, 0.37],
  ],
  mfj: [
    [24800, 0.10], [100800, 0.12], [211400, 0.22], [403550, 0.24],
    [512450, 0.32], [768700, 0.35], [Infinity, 0.37],
  ],
  mfs: [
    [12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24],
    [256225, 0.32], [384350, 0.35], [Infinity, 0.37],
  ],
  hoh: [
    [17700, 0.10], [67450, 0.12], [105700, 0.22], [201750, 0.24],
    [256200, 0.32], [640600, 0.35], [Infinity, 0.37],
  ],
}

// FICA
export const SS_WAGE_BASE = 184500
export const SS_RATE = 0.062
export const MEDICARE_RATE = 0.0145

/** Accepts any string from a form field and falls back to single. */
export function toFiling(value: string): Filing {
  return value === "mfj" || value === "mfs" || value === "hoh" ? value : "single"
}

/** Federal income tax on taxable income (after deductions). */
export function federalTax(taxable: number, filing: Filing): number {
  let tax = 0
  let prev = 0
  for (const [limit, rate] of BRACKETS[filing]) {
    if (taxable <= prev) break
    tax += (Math.min(taxable, limit) - prev) * rate
    prev = limit
  }
  return Math.max(0, tax)
}

/** Marginal rate that applies to the last dollar of taxable income. */
export function marginalRate(taxable: number, filing: Filing): number {
  for (const [limit, rate] of BRACKETS[filing]) {
    if (taxable <= limit) return rate
  }
  return 0.37
}

/** Taxable income after the standard deduction and any pre-tax deductions. */
export function taxableAfterStandardDeduction(
  gross: number,
  filing: Filing,
  preTaxDeductions = 0,
): number {
  return Math.max(0, gross - preTaxDeductions - STANDARD_DEDUCTION[filing])
}

/** Employee share of Social Security tax, capped at the wage base. */
export function socialSecurityTax(wages: number): number {
  return Math.min(Math.max(0, wages), SS_WAGE_BASE) * SS_RATE
}

/** Employee share of regular Medicare tax (no cap). */
export function medicareTax(wages: number): number {
  return Math.max(0, wages) * MEDICARE_RATE
}
