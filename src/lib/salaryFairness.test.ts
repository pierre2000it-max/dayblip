import { describe, it, expect } from "vitest"
import { adjustForArea, fairRange, verdict, gapCost } from "@/lib/salaryFairness"
import { cities } from "@/data/cost-of-living"

describe("salaryFairness", () => {
  it("adjusts a salary between cities by index ratio", () => {
    expect(adjustForArea(100000, 100, 150)).toBe(150000)
    expect(adjustForArea(100000, 200, 100)).toBe(50000)
    expect(adjustForArea(50000, 95, 95)).toBe(50000)
  })
  it("builds a +/-10% band", () => {
    const r = fairRange(80000)
    expect(r.low).toBeCloseTo(72000, 6)
    expect(r.high).toBeCloseTo(88000, 6)
  })
  it("classifies pay against the band", () => {
    expect(verdict(71000, 80000)).toBe("below")
    expect(verdict(72000, 80000)).toBe("within")
    expect(verdict(88000, 80000)).toBe("within")
    expect(verdict(90000, 80000)).toBe("above")
  })
  it("sums a growing gap", () => {
    expect(gapCost(1000, 0, 5)).toBe(5000)
    expect(gapCost(1000, 0.03, 1)).toBeCloseTo(1000, 6)
    expect(gapCost(1000, 0.03, 2)).toBeCloseTo(2030, 6)
    let manual = 0
    for (let t = 0; t < 10; t++) manual += 1000 * Math.pow(1.03, t)
    expect(gapCost(1000, 0.03, 10)).toBeCloseTo(manual, 6)
  })
  it("article cities exist in the cost-of-living data", () => {
    for (const slug of ["milwaukee", "chicago", "austin", "denver", "seattle", "new-york-city", "san-francisco"]) {
      expect(cities.find(c => c.slug === slug)).toBeTruthy()
    }
  })
})
