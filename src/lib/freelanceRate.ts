// Freelance hourly rate model, shared by the Freelancer Rate Calculator and the
// blog article that explains it.
//
// Question answered: what revenue (and hourly rate) leaves you the take-home
// income you want after business expenses, health insurance, retirement saving
// and every tax?
//
// Model (single filer, standard deduction, all revenue is self-employment profit):
//   profit        = revenue - business expenses
//   SE tax        = selfEmploymentTax(profit)           (lib/tax2026)
//   adjusted inc. = profit - half of SE tax - health insurance
//                   (the self-employed health insurance deduction)
//   federal tax   = federalTax(adjusted income - standard deduction)
//   state tax     = stateIncomeTax(state, adjusted income)  (lib/stateTax)
//   take-home     = revenue - expenses - health insurance - retirement
//                   - SE tax - federal tax - state tax
// Retirement saving is treated as after-tax (like a Roth). Deductible
// contributions (SEP-IRA, Solo 401(k)) would lower the rate you need.
// The required revenue is found by solving take-home = target, so the tax is
// computed on the revenue you actually bill, not on the target.

import { STANDARD_DEDUCTION, federalTax, selfEmploymentTax } from "./tax2026"
import { stateIncomeTax } from "./stateTax"

export interface FreelanceInputs {
  /** Desired annual take-home income after all taxes and the items below. */
  income: number
  vacationWeeks: number
  billablePerWeek: number
  bizMonthly: number
  healthMonthly: number
  retirementMonthly: number
  state: string
}

export interface RevenueBreakdown {
  se: number
  fed: number
  state: number
  takeHome: number
}

/** Taxes and take-home for a given annual revenue. */
export function revenueOutcome(revenue: number, inp: FreelanceInputs): RevenueBreakdown {
  const biz = inp.bizMonthly * 12
  const hi = inp.healthMonthly * 12
  const ret = inp.retirementMonthly * 12
  const profit = Math.max(0, revenue - biz)
  const se = selfEmploymentTax(profit)
  const agi = Math.max(0, profit - se.deduction - hi)
  const fed = federalTax(Math.max(0, agi - STANDARD_DEDUCTION.single), "single")
  const st = stateIncomeTax(inp.state, agi)
  return { se: se.total, fed, state: st, takeHome: revenue - biz - hi - ret - se.total - fed - st }
}

/** Smallest annual revenue whose take-home meets the target. */
export function requiredRevenue(inp: FreelanceInputs): number {
  const floor = (inp.bizMonthly + inp.healthMonthly + inp.retirementMonthly) * 12
  let lo = 0
  let hi = Math.max(1_000_000, (inp.income + floor) * 4)
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    if (revenueOutcome(mid, inp).takeHome < inp.income) lo = mid
    else hi = mid
  }
  return hi
}

export function freelanceRate(inp: FreelanceInputs) {
  const workWeeks = Math.max(0, 52 - inp.vacationWeeks)
  const hours = Math.max(1, inp.billablePerWeek * workWeeks)
  const revenue = requiredRevenue(inp)
  const out = revenueOutcome(revenue, inp)
  const baseRate = revenue / hours
  const biz = inp.bizMonthly * 12
  const hi = inp.healthMonthly * 12
  const ret = inp.retirementMonthly * 12

  const breakdown = {
    incomeHr: inp.income / hours,
    bizHr: biz / hours,
    hiHr: hi / hours,
    retHr: ret / hours,
    seHr: out.se / hours,
    taxHr: (out.fed + out.state) / hours,
  }

  const scenarios = [-20, 0, 20, 40].map((delta) => {
    const rate = Math.max(1, baseRate + delta)
    const annualRevenue = rate * hours
    return { rate, annualRevenue, afterTax: revenueOutcome(annualRevenue, inp).takeHome, delta }
  })

  return { baseRate, revenue, totalBillableHours: hours, workWeeks, breakdown, scenarios }
}
