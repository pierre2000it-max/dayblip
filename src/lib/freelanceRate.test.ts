import { describe, it, expect } from "vitest"
import { freelanceRate, requiredRevenue, revenueOutcome, type FreelanceInputs } from "./freelanceRate"

const base: FreelanceInputs = {
  income: 75000, vacationWeeks: 4, billablePerWeek: 30,
  bizMonthly: 200, healthMonthly: 400, retirementMonthly: 500, state: "TX",
}

describe("freelance rate model", () => {
  it("leaves exactly the target take-home at the required revenue", () => {
    for (const state of ["TX", "CA", "WI", "NY"]) {
      const inp = { ...base, state }
      const r = requiredRevenue(inp)
      expect(revenueOutcome(r, inp).takeHome).toBeCloseTo(inp.income, 0)
    }
  })

  it("the scenario at the base rate returns the target", () => {
    const f = freelanceRate(base)
    const mid = f.scenarios.find((s) => s.delta === 0)!
    expect(mid.afterTax).toBeCloseTo(base.income, 0)
  })

  it("per-hour breakdown adds up to the rate", () => {
    const f = freelanceRate({ ...base, state: "CA" })
    const b = f.breakdown
    expect(b.incomeHr + b.bizHr + b.hiHr + b.retHr + b.seHr + b.taxHr).toBeCloseTo(f.baseRate, 6)
  })

  it("fewer billable hours or higher expenses raise the rate", () => {
    const r = freelanceRate(base).baseRate
    expect(freelanceRate({ ...base, billablePerWeek: 20 }).baseRate).toBeGreaterThan(r)
    expect(freelanceRate({ ...base, bizMonthly: 800 }).baseRate).toBeGreaterThan(r)
  })

  it("the rate is above a naive salary divided by 2,080 hours", () => {
    expect(freelanceRate(base).baseRate).toBeGreaterThan(base.income / 2080)
  })
})
