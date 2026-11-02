import { describe, expect, it } from "vitest"
import {
  BLS_MEDIAN_WEEKLY_EARNINGS, RETIREMENT_AGE, WORK_WEEKS_PER_YEAR, EXAMPLE_RAISE, RAISE_PER_WEEK,
  MONDAY_ROWS, mondaysLeft, careerValue, raiseLifetimeValue,
  PLANNING_AGE, WEEKENDS_PER_YEAR, FREE_HOURS_PER_WEEKEND, FREE_HOURS_RANGE, WEEKEND_ROWS, weekendsLeft,
  RETIRE_AT, LIVE_TO, WEEKEND_SPEND, RETIREMENT_WEEKENDS, RETIREMENT_WEEKEND_SPEND,
  MONDAYS_META_DESCRIPTION, MONDAYS_OG_DESCRIPTION, WEEKENDS_META_DESCRIPTION, WEEKENDS_OG_DESCRIPTION,
  n, usd, usdM,
} from "./finiteTime"

describe("career Mondays", () => {
  it("every table row follows the stated formula", () => {
    for (const r of MONDAY_ROWS) {
      expect(r.years).toBe(RETIREMENT_AGE - r.age)
      expect(r.mondays).toBe((RETIREMENT_AGE - r.age) * WORK_WEEKS_PER_YEAR)
      expect(r.valuePerMonday).toBe(BLS_MEDIAN_WEEKLY_EARNINGS)
      expect(r.totalValue).toBe(r.mondays * BLS_MEDIAN_WEEKLY_EARNINGS)
    }
    expect(MONDAY_ROWS.length).toBeGreaterThanOrEqual(10)
  })

  it("the headline ages are what the metadata promises", () => {
    expect(mondaysLeft(35)).toBe(1500)
    expect(mondaysLeft(45)).toBe(1000)
    expect(mondaysLeft(55)).toBe(500)
    expect(careerValue(55)).toBe(500 * BLS_MEDIAN_WEEKLY_EARNINGS)
  })

  it("a raise is worth the same per Monday at any age; only the lifetime total changes", () => {
    expect(RAISE_PER_WEEK).toBe(EXAMPLE_RAISE / WORK_WEEKS_PER_YEAR)
    expect(raiseLifetimeValue(35)).toBe(EXAMPLE_RAISE * 30)
    expect(raiseLifetimeValue(55)).toBe(EXAMPLE_RAISE * 10)
    expect(raiseLifetimeValue(35) / raiseLifetimeValue(55)).toBe(3)
  })
})

describe("weekends", () => {
  it("every table row follows the stated formula", () => {
    for (const r of WEEKEND_ROWS) {
      expect(r.years).toBe(PLANNING_AGE - r.age)
      expect(r.weekends).toBe((PLANNING_AGE - r.age) * WEEKENDS_PER_YEAR)
      expect(r.freeHours).toBe(FREE_HOURS_PER_WEEKEND)
      expect(r.totalFreeHours).toBe(r.weekends * FREE_HOURS_PER_WEEKEND)
    }
    expect(FREE_HOURS_PER_WEEKEND).toBeGreaterThanOrEqual(FREE_HOURS_RANGE[0])
    expect(FREE_HOURS_PER_WEEKEND).toBeLessThanOrEqual(FREE_HOURS_RANGE[1])
  })

  it("headline ages and the retirement example reconcile", () => {
    expect(weekendsLeft(40)).toBe(2080)
    expect(weekendsLeft(50)).toBe(1560)
    expect(RETIREMENT_WEEKENDS).toBe((LIVE_TO - RETIRE_AT) * WEEKENDS_PER_YEAR)
    expect(RETIREMENT_WEEKEND_SPEND).toBe(RETIREMENT_WEEKENDS * WEEKEND_SPEND)
  })
})

describe("metadata and formatting", () => {
  it("meta descriptions stay inside the 120-155 character rule", () => {
    for (const d of [MONDAYS_META_DESCRIPTION, MONDAYS_OG_DESCRIPTION, WEEKENDS_META_DESCRIPTION, WEEKENDS_OG_DESCRIPTION]) {
      expect(d.length).toBeGreaterThanOrEqual(120)
      expect(d.length).toBeLessThanOrEqual(155)
      expect(d.endsWith(".")).toBe(true)
    }
  })

  it("formatters", () => {
    expect(n(1500)).toBe("1,500")
    expect(usd(625500)).toBe("$625,500")
    expect(usdM(1876500)).toBe("$1.88 million")
  })
})
