/**
 * The 2 worked examples behind blog/standard-deduction-vs-itemizing-2026,
 * shared with the blog listing card so the teaser figures can never drift.
 * A: single, $85,000, renter. B: married filing jointly, $160,000, $400,000
 * mortgage at 6.5%.
 */
import { STANDARD_DEDUCTION } from "../tax2026"
import { charityItemized, saltDeduction, taxWithBest } from "../itemizing"

/** First-year interest on a 30-year fixed loan. */
export function firstYearInterest(loan: number, rate: number): number {
  const r = rate / 12
  const pay = (loan * r) / (1 - Math.pow(1 + r, -360))
  let bal = loan
  let interest = 0
  for (let i = 0; i < 12; i++) {
    const int = bal * r
    interest += int
    bal -= pay - int
  }
  return interest
}

export const EXAMPLE_A = (() => {
  const agi = 85000, saltPaid = 6500, gifts = 2000
  const salt = saltDeduction(saltPaid, agi)
  const charity = charityItemized(gifts, agi)
  const itemized = salt + charity
  return { agi, saltPaid, gifts, salt, charity, itemized, ...taxWithBest(agi, itemized, "single") }
})()

export const EXAMPLE_B = (() => {
  const agi = 160000, loan = 400000, rate = 0.065, prop = 6000, stateInc = 7000, gifts = 3000
  const interest = firstYearInterest(loan, rate)
  const salt = saltDeduction(prop + stateInc, agi)
  const charity = charityItemized(gifts, agi)
  const itemized = interest + salt + charity
  const std = taxWithBest(agi, 0, "mfj")
  const item = taxWithBest(agi, itemized, "mfj")
  return { agi, loan, rate, prop, stateInc, gifts, interest, salt, charity, itemized, std, item, saved: std.tax - item.tax }
})()

/** How far short of the standard deduction the single renter's itemized total falls. */
export const EXAMPLE_A_SHORTFALL = STANDARD_DEDUCTION.single - EXAMPLE_A.itemized

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
export const ITEMIZING_CARD_EXCERPT = `Itemize only when deductions top ${usd(STANDARD_DEDUCTION.single)} (single) or ${usd(STANDARD_DEDUCTION.mfj)} (married). A ${usd(EXAMPLE_B.loan)} mortgage saves one couple ${usd(EXAMPLE_B.saved)}. A renter loses by ${usd(EXAMPLE_A_SHORTFALL)}.`
