import { describe, it, expect } from "vitest"
import { minutesToDecimal, hoursMinutesToDecimal, decimalToHoursMinutes } from "@/lib/timeDecimal"

describe("time decimal", () => {
  it("converts common minutes", () => {
    expect(minutesToDecimal(15)).toBe(0.25)
    expect(minutesToDecimal(30)).toBe(0.5)
    expect(minutesToDecimal(45)).toBe(0.75)
    expect(minutesToDecimal(20)).toBe(0.33)
    expect(minutesToDecimal(50)).toBe(0.83)
    expect(minutesToDecimal(7)).toBe(0.12)
  })
  it("converts hours and minutes", () => {
    expect(hoursMinutesToDecimal(8, 20)).toBe(8.33)
    expect(hoursMinutesToDecimal(7, 45)).toBe(7.75)
  })
  it("converts back", () => {
    expect(decimalToHoursMinutes(8.33)).toEqual({ hours: 8, minutes: 20 })
    expect(decimalToHoursMinutes(1.5)).toEqual({ hours: 1, minutes: 30 })
  })
})
