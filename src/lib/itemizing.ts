// Itemized deduction rules for tax year 2026, used by blog/standard-deduction-vs-itemizing-2026.
//
// Standard deduction amounts come from tax2026.ts (IRS Rev. Proc. 2025-32).
// The rules below come from the 2025 reconciliation law (P.L. 119-21) as it
// applies to tax year 2026. Re-check each January:
//   SALT cap: $40,400 for 2026, phased down by 30% of MAGI over $505,000, floor $10,000
//   Charity floor: itemized gifts count only above 0.5% of AGI (new in 2026)
//   Non-itemizer charity deduction: $1,000 single, $2,000 married filing jointly, cash only (new in 2026)
//   Medical: only the part above 7.5% of AGI
//   Mortgage interest: debt up to $750,000
//   Age 65+: extra standard deduction ($2,050 unmarried, $1,650 per married person, Rev. Proc. 2025-32)
//   Senior deduction: $6,000 per person 65+, phases out at 6% of MAGI over $75,000 / $150,000, 2025-2028

import { STANDARD_DEDUCTION, federalTax, type Filing } from "@/lib/tax2026"

export const SALT_CAP_2026 = 40400
export const SALT_FLOOR = 10000
export const SALT_PHASEDOWN_START = 505000
export const SALT_PHASEDOWN_RATE = 0.3
export const CHARITY_AGI_FLOOR = 0.005
export const CHARITY_NON_ITEMIZER = { single: 1000, mfj: 2000 } as const
export const MEDICAL_AGI_FLOOR = 0.075
export const MORTGAGE_DEBT_LIMIT = 750000
export const AGED_EXTRA_UNMARRIED = 2050
export const AGED_EXTRA_MARRIED = 1650
export const SENIOR_DEDUCTION = 6000
export const SENIOR_PHASEOUT_START = { single: 75000, mfj: 150000 } as const
export const SENIOR_PHASEOUT_RATE = 0.06

/** State and local tax deduction allowed after the cap and the high-income phase-down. */
export function saltDeduction(paid: number, magi: number): number {
  const cap = Math.max(
    SALT_FLOOR,
    SALT_CAP_2026 - SALT_PHASEDOWN_RATE * Math.max(0, magi - SALT_PHASEDOWN_START)
  )
  return Math.max(0, Math.min(paid, cap))
}

/** Itemized charitable gifts count only above 0.5% of AGI. */
export function charityItemized(gifts: number, agi: number): number {
  return Math.max(0, gifts - CHARITY_AGI_FLOOR * agi)
}

/** Medical expenses count only above 7.5% of AGI. */
export function medicalDeduction(expenses: number, agi: number): number {
  return Math.max(0, expenses - MEDICAL_AGI_FLOOR * agi)
}

/** Federal tax with the better of the standard deduction or the itemized total. */
export function taxWithBest(agi: number, itemized: number, filing: Filing) {
  const std = STANDARD_DEDUCTION[filing]
  const deduction = Math.max(std, itemized)
  return {
    deduction,
    itemizes: itemized > std,
    tax: federalTax(Math.max(0, agi - deduction), filing),
  }
}

/** Itemized total needed before itemizing beats the standard deduction. */
export function breakEvenOtherItems(filing: Filing, knownItemized: number): number {
  return Math.max(0, STANDARD_DEDUCTION[filing] - knownItemized)
}

/** Senior deduction after the 6% phase-out. */
export function seniorDeduction(people: number, magi: number, filing: "single" | "mfj"): number {
  const over = Math.max(0, magi - SENIOR_PHASEOUT_START[filing])
  return Math.max(0, SENIOR_DEDUCTION * people - SENIOR_PHASEOUT_RATE * over)
}
