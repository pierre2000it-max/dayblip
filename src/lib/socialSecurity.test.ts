import { describe, it, expect } from "vitest"
import { fraMonths, fraLabel, claimFactor, claimFactorAtAge } from "./socialSecurity"

// Reference values: SSA "Reduction for age" table (benefit at 62 as a share of FRA benefit).
describe("Social Security claiming rules", () => {
  it("matches the SSA full retirement age table", () => {
    expect(fraMonths(1954)).toBe(66 * 12)
    expect(fraMonths(1955)).toBe(66 * 12 + 2)
    expect(fraMonths(1957)).toBe(66 * 12 + 6)
    expect(fraMonths(1959)).toBe(66 * 12 + 10)
    expect(fraMonths(1960)).toBe(67 * 12)
    expect(fraMonths(1990)).toBe(67 * 12)
  })

  it("matches the SSA reduction at 62 for every birth-year group", () => {
    const expected: [number, number][] = [
      [1954, 0.75], [1955, 0.7417], [1956, 0.7333], [1957, 0.725],
      [1958, 0.7167], [1959, 0.7083], [1960, 0.7],
    ]
    for (const [by, share] of expected) {
      expect(claimFactorAtAge(62, by)).toBeCloseTo(share, 3)
    }
  })

  it("uses 5/9 of 1% a month for the first 36 months, then 5/12 of 1%", () => {
    // FRA 67: age 64 = 36 months early = 20% off; age 63 = 48 months = 25% off
    expect(claimFactorAtAge(64, 1965)).toBeCloseTo(0.8, 4)
    expect(claimFactorAtAge(63, 1965)).toBeCloseTo(0.75, 4)
    expect(claimFactorAtAge(66, 1965)).toBeCloseTo(1 - 12 * (5 / 9) / 100, 4)
  })

  it("adds 8% a year after FRA and stops at 70", () => {
    expect(claimFactorAtAge(68, 1965)).toBeCloseTo(1.08, 4)
    expect(claimFactorAtAge(70, 1965)).toBeCloseTo(1.24, 4)
    expect(claimFactorAtAge(75, 1965)).toBeCloseTo(1.24, 4)
    // FRA 66: four years of credits at 70
    expect(claimFactorAtAge(70, 1954)).toBeCloseTo(1.32, 4)
    // FRA 66 and 8 months: 40 months of credits
    expect(claimFactorAtAge(70, 1958)).toBeCloseTo(1 + 40 * (2 / 3) / 100, 4)
  })

  it("never pays less than the age 62 reduction and is 1 at FRA", () => {
    expect(claimFactor(50 * 12, 1965)).toBeCloseTo(0.7, 4)
    expect(claimFactor(fraMonths(1956), 1956)).toBe(1)
  })

  it("labels fractional ages", () => {
    expect(fraLabel(1960)).toBe("67 years")
    expect(fraLabel(1955)).toBe("66 years, 2 months")
  })
})
