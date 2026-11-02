/**
 * The worked example behind blog/how-to-set-freelance-rate: single filer in a
 * state with no income tax (TX), $75,000 target take-home, 4 weeks off,
 * 30 billable hours a week, $200/month business expenses, $400/month health
 * insurance, $500/month retirement saving. Shared with the blog listing card
 * and the article's layout metadata so the teaser figures can never drift.
 */
import { freelanceRate, type FreelanceInputs } from "../freelanceRate"

export const FREELANCE_BASE: FreelanceInputs = {
  income: 75000, vacationWeeks: 4, billablePerWeek: 30,
  bizMonthly: 200, healthMonthly: 400, retirementMonthly: 500, state: "TX",
}
export const FREELANCE_RESULT = freelanceRate(FREELANCE_BASE)
/** Salary divided by 2,080 hours: the naive rate the article argues against. */
export const FREELANCE_NAIVE_RATE = FREELANCE_BASE.income / 2080
export const FREELANCE_RATE_ROUNDED = Math.round(FREELANCE_RESULT.baseRate)
export const FREELANCE_NAIVE_ROUNDED = Math.round(FREELANCE_NAIVE_RATE)

export const FREELANCE_TEASER = `To take home $${FREELANCE_BASE.income.toLocaleString("en-US")} billing ${FREELANCE_BASE.billablePerWeek} hours a week you need about $${FREELANCE_RATE_ROUNDED} an hour, not $${FREELANCE_NAIVE_ROUNDED}.`
export const FREELANCE_META_DESCRIPTION = `${FREELANCE_TEASER} See the full cost breakdown and how billable hours change it. Free.`
export const FREELANCE_CARD_EXCERPT = `${FREELANCE_TEASER} The full cost breakdown and how billable hours move the rate.`
