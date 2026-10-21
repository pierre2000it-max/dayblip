import { describe, it, expect } from "vitest"
import {
  saltDeduction, charityItemized, medicalDeduction, taxWithBest, seniorDeduction, breakEvenOtherItems,
} from "./itemizing"

describe("itemizing rules (tax year 2026)", () => {
  it("caps SALT at $40,400 below the phase-down", () => {
    expect(saltDeduction(50000, 300000)).toBe(40400)
    expect(saltDeduction(9000, 300000)).toBe(9000)
  })
  it("phases the SALT cap down 30 cents per dollar over $505,000, never below $10,000", () => {
    expect(saltDeduction(50000, 605000)).toBe(10400)
    expect(saltDeduction(50000, 800000)).toBe(10000)
  })
  it("applies the 0.5% AGI floor to itemized charity", () => {
    expect(charityItemized(5000, 90000)).toBe(4550)
    expect(charityItemized(100, 90000)).toBe(0)
  })
  it("applies the 7.5% AGI floor to medical expenses", () => {
    expect(medicalDeduction(9000, 80000)).toBe(3000)
    expect(medicalDeduction(5000, 80000)).toBe(0)
  })
  it("uses the standard deduction unless itemizing is larger", () => {
    const low = taxWithBest(85000, 8075, "single")
    expect(low.itemizes).toBe(false)
    expect(low.deduction).toBe(16100)
    const high = taxWithBest(160000, 41000, "mfj")
    expect(high.itemizes).toBe(true)
    expect(high.deduction).toBe(41000)
  })
  it("finds the gap to the standard deduction", () => {
    expect(breakEvenOtherItems("mfj", 16000)).toBe(16200)
    expect(breakEvenOtherItems("single", 20000)).toBe(0)
  })
  it("phases out the senior deduction at 6% of MAGI over the threshold", () => {
    expect(seniorDeduction(1, 75000, "single")).toBe(6000)
    expect(seniorDeduction(1, 100000, "single")).toBe(4500)
    expect(seniorDeduction(2, 150000, "mfj")).toBe(12000)
    expect(seniorDeduction(1, 175000, "single")).toBe(0)
  })
})
