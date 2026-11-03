import { describe, it, expect } from "vitest"
import { federalHolidays, weekdaysInYear, workingDaysInYear, workingDaysInMonth, weekdaysInMonth } from "@/lib/workingDays"

describe("working days", () => {
  it("matches hand-counted years", () => {
    // 2025: 261 weekdays, 11 holidays all on weekdays
    expect(weekdaysInYear(2025)).toBe(261)
    expect(workingDaysInYear(2025)).toBe(250)
    // 2026: 261 weekdays, Jul 4 is a Saturday (observed Fri Jul 3), 11 holidays
    expect(weekdaysInYear(2026)).toBe(261)
    expect(workingDaysInYear(2026)).toBe(250)
    // 2027: 261 weekdays, 12 observed (Jan 1 2028 is a Saturday, observed Fri Dec 31 2027)
    expect(workingDaysInYear(2027)).toBe(249)
    // 2028: leap year starting Saturday, 260 weekdays, 10 holidays (Jan 1 observed in 2027)
    expect(weekdaysInYear(2028)).toBe(260)
    expect(workingDaysInYear(2028)).toBe(250)
  })

  it("applies the weekend observance rule", () => {
    const h2026 = federalHolidays(2026)
    expect(h2026.find(h => h.name === "Independence Day")?.observed).toBe("2026-07-03")
    const h2027 = federalHolidays(2027)
    expect(h2027.find(h => h.name === "Independence Day")?.observed).toBe("2027-07-05")
    expect(h2027.some(h => h.observed === "2027-12-31")).toBe(true)
  })

  it("places floating holidays correctly in 2026", () => {
    const by = Object.fromEntries(federalHolidays(2026).map(h => [h.name, h.observed]))
    expect(by["Martin Luther King Jr. Day"]).toBe("2026-01-19")
    expect(by["Presidents' Day"]).toBe("2026-02-16")
    expect(by["Memorial Day"]).toBe("2026-05-25")
    expect(by["Labor Day"]).toBe("2026-09-07")
    expect(by["Columbus Day"]).toBe("2026-10-12")
    expect(by["Thanksgiving Day"]).toBe("2026-11-26")
  })

  it("month counts add up to the year", () => {
    for (const y of [2025, 2026, 2027, 2028]) {
      let w = 0, k = 0
      for (let m = 1; m <= 12; m++) { w += workingDaysInMonth(y, m); k += weekdaysInMonth(y, m) }
      expect(w).toBe(workingDaysInYear(y))
      expect(k).toBe(weekdaysInYear(y))
    }
  })
})
