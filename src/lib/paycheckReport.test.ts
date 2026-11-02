import { describe, expect, it } from "vitest"
import {
  BENCHMARK_SALARY, FEDERAL_INCOME_TAX, FICA_TAX, FEDERAL_TOTAL, AFTER_FEDERAL,
  FEDERAL_BRACKET_ROWS, STATE_ROWS, NO_TAX_STATES, HIGHEST, LOWEST, BOTTOM_FIVE,
  ANNUAL_GAP, MONTHLY_GAP, GAP_30_YEARS, ANNUITY_FACTOR_30, MIDDLE_STATES, HIGHLIGHT_LOW,
  REPORT_META_DESCRIPTION, BLOG_META_DESCRIPTION, BLOG_OG_DESCRIPTION, HEADLINE_SENTENCE,
  stateFacts, stateRow, usd, pct,
} from "./paycheckReport"
import { federalTax, socialSecurityTax, medicareTax, taxableAfterStandardDeduction } from "./tax2026"
import { stateIncomeTax, getState } from "./stateTax"

// These invariants are what a reader checks first. If any of them fails, the
// research report and the blog article are publishing a number the calculators
// would not produce.

describe("paycheck report: federal layer", () => {
  it("federal income tax equals the bracket rows summed", () => {
    const sum = FEDERAL_BRACKET_ROWS.reduce((t, r) => t + r.tax, 0)
    expect(sum).toBe(FEDERAL_INCOME_TAX)
    expect(FEDERAL_INCOME_TAX).toBe(Math.round(federalTax(taxableAfterStandardDeduction(BENCHMARK_SALARY, "single"), "single")))
  })

  it("FICA and the after-federal base reconcile to the dollar", () => {
    expect(FICA_TAX).toBe(Math.round(socialSecurityTax(BENCHMARK_SALARY) + medicareTax(BENCHMARK_SALARY)))
    expect(FEDERAL_TOTAL).toBe(FEDERAL_INCOME_TAX + FICA_TAX)
    expect(AFTER_FEDERAL).toBe(BENCHMARK_SALARY - FEDERAL_TOTAL)
  })
})

describe("paycheck report: state layer", () => {
  it("covers all 50 states, sorted highest to lowest take-home", () => {
    expect(STATE_ROWS).toHaveLength(50)
    for (let i = 1; i < STATE_ROWS.length; i++) {
      expect(STATE_ROWS[i - 1].takeHome).toBeGreaterThanOrEqual(STATE_ROWS[i].takeHome)
    }
  })

  it("every row equals benchmark minus federal minus the library's state tax", () => {
    for (const r of STATE_ROWS) {
      const st = Math.round(stateIncomeTax(r.code, BENCHMARK_SALARY, "single"))
      expect(r.stateTax).toBe(st)
      expect(r.takeHome).toBe(BENCHMARK_SALARY - FEDERAL_TOTAL - st)
      expect(r.effective).toBeCloseTo(((BENCHMARK_SALARY - r.takeHome) / BENCHMARK_SALARY) * 100, 1)
    }
  })

  it("no-income-tax states all keep the after-federal base", () => {
    expect(NO_TAX_STATES.length).toBeGreaterThanOrEqual(8)
    for (const r of NO_TAX_STATES) expect(r.takeHome).toBe(AFTER_FEDERAL)
    expect(HIGHEST.takeHome).toBe(AFTER_FEDERAL)
  })

  it("gap, monthly gap, bottom five and highlights derive from the rows", () => {
    expect(ANNUAL_GAP).toBe(HIGHEST.takeHome - LOWEST.takeHome)
    expect(ANNUAL_GAP).toBeGreaterThan(0)
    expect(MONTHLY_GAP).toBe(Math.round(ANNUAL_GAP / 12))
    expect(BOTTOM_FIVE[0]).toBe(LOWEST)
    expect(BOTTOM_FIVE).toHaveLength(5)
    expect(HIGHLIGHT_LOW.has(LOWEST.code)).toBe(true)
    expect(HIGHLIGHT_LOW.size).toBe(2)
    expect(MIDDLE_STATES.length).toBe(50 - NO_TAX_STATES.length - 2)
  })

  it("30-year compounding uses the standard annuity factor at 7%", () => {
    expect(ANNUITY_FACTOR_30).toBeCloseTo(94.46, 2)
    expect(GAP_30_YEARS).toBeCloseTo(ANNUAL_GAP * ANNUITY_FACTOR_30, 6)
  })

  it("prose facts about the lowest state match the library's bracket table", () => {
    const f = stateFacts(LOWEST.code)
    const info = getState(LOWEST.code)!
    expect(f.deduction).toBe(info.deduction)
    expect(f.topRate).toBe(info.brackets[info.brackets.length - 1][1])
    const taxable = BENCHMARK_SALARY - info.deduction
    expect(taxable).toBeGreaterThan(f.marginalStart)
    if (f.nextBracketStart !== null) expect(taxable).toBeLessThanOrEqual(f.nextBracketStart)
    expect(stateRow("CA").code).toBe("CA")
  })
})

describe("paycheck report: metadata", () => {
  it("meta descriptions stay inside the 120-155 character rule", () => {
    for (const d of [REPORT_META_DESCRIPTION, BLOG_META_DESCRIPTION, BLOG_OG_DESCRIPTION]) {
      expect(d.length).toBeGreaterThanOrEqual(120)
      expect(d.length).toBeLessThanOrEqual(155)
      expect(d.endsWith(".")).toBe(true)
    }
  })

  it("headline sentence carries the computed figures", () => {
    expect(HEADLINE_SENTENCE).toContain(usd(AFTER_FEDERAL))
    expect(HEADLINE_SENTENCE).toContain(usd(LOWEST.takeHome))
    expect(HEADLINE_SENTENCE).toContain(LOWEST.name)
  })

  it("formatters behave", () => {
    expect(usd(61592.4)).toBe("$61,592")
    expect(pct(0.0875, 2)).toBe("8.75%")
    expect(pct(0.22)).toBe("22%")
    expect(pct(0.062, 1)).toBe("6.2%")
  })
})
