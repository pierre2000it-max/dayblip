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

// Additional Medicare Tax: 0.9% on wages above a filing-status threshold. The
// employee pays it; the employer does not match it. The thresholds are set by
// statute and are not indexed for inflation (IRS Form 8959).
export const ADDL_MEDICARE_RATE = 0.009
export const ADDL_MEDICARE_THRESHOLD: Record<Filing, number> = {
  single: 200000,
  hoh: 200000,
  mfj: 250000,
  mfs: 125000,
}

export function additionalMedicareTax(wages: number, filing: Filing): number {
  return Math.max(0, wages - ADDL_MEDICARE_THRESHOLD[filing]) * ADDL_MEDICARE_RATE
}

// Long-term capital gains: top of the 0% and 15% zones, in taxable income.
// Source: IRS Rev. Proc. 2025-32 (tax year 2026). Above the 15% limit is 20%.
export const LTCG_LIMITS: Record<Filing, readonly [number, number]> = {
  single: [49450, 545500],
  mfj: [98900, 613700],
  mfs: [49450, 306850],
  hoh: [66200, 579600],
}

/**
 * Tax on long-term gains stacked on top of ordinary taxable income.
 * Pass taxable ordinary income (after the standard deduction), not gross income.
 */
export function ltcgTax(gain: number, ordinaryTaxable: number, filing: Filing): number {
  if (gain <= 0) return 0
  const [zeroTop, fifteenTop] = LTCG_LIMITS[filing]
  const base = Math.max(0, ordinaryTaxable)
  const at0 = Math.max(0, Math.min(gain, zeroTop - base))
  const room15 = Math.max(0, fifteenTop - Math.max(base, zeroTop))
  const at15 = Math.min(gain - at0, room15)
  const at20 = gain - at0 - at15
  return at15 * 0.15 + at20 * 0.20
}

export const SE_NET_FACTOR = 0.9235
export const SE_SS_RATE = 0.124
export const SE_MEDICARE_RATE = 0.029

/**
 * Self-employment tax. otherWages (W-2 pay) uses up the Social Security
 * wage base first. Excludes the 0.9% additional Medicare tax.
 */
export function selfEmploymentTax(netEarnings: number, otherWages = 0) {
  const base = Math.max(0, netEarnings) * SE_NET_FACTOR
  const ssRoom = Math.max(0, SS_WAGE_BASE - Math.max(0, otherWages))
  const ss = Math.min(base, ssRoom) * SE_SS_RATE
  const medicare = base * SE_MEDICARE_RATE
  const total = ss + medicare
  return { base, ss, medicare, total, deduction: total / 2 }
}

// Retirement and savings limits for 2026.
// Source: IRS Notice 2025-67 (IR-2025-111); HSA from Rev. Proc. 2025-19.
export const K401_LIMIT = 24500
export const K401_CATCHUP = 8000

/** Employee 401(k) deferral limit, with the catch-up added at age 50 and over. */
export function k401Limit(age?: number): number {
  return K401_LIMIT + (age !== undefined && age >= 50 ? K401_CATCHUP : 0)
}
export const IRA_LIMIT = 7500
export const IRA_CATCHUP = 1100
export const HSA_SELF = 4400
export const HSA_FAMILY = 8750
export const ROTH_PHASEOUT = { single: [153000, 168000], mfj: [242000, 252000] } as const
export const TRAD_IRA_DEDUCTION_PHASEOUT = { single: [81000, 91000], mfj: [129000, 149000] } as const
