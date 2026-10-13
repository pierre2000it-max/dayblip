import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  BRACKETS, STANDARD_DEDUCTION, SS_WAGE_BASE, federalTax, marginalRate,
  medicareTax, socialSecurityTax, taxableAfterStandardDeduction, toFiling,
} from "./tax2026"

// Anchor values computed from IRS Rev. Proc. 2025-32 bracket tables.
const ANCHORS: Record<string, [number, number][]> = {
  single: [[12400, 1240], [50400, 5800], [105700, 17966], [201775, 41024], [256225, 58448], [640600, 192979.25]],
  mfj: [[24800, 2480], [100800, 11600], [211400, 35932], [403550, 82048], [512450, 116896], [768700, 206583.5]],
  hoh: [[17700, 1770], [67450, 7740], [105700, 16155], [201750, 39207], [256200, 56631], [640600, 191171]],
  mfs: [[12400, 1240], [50400, 5800], [105700, 17966], [201775, 41024], [256225, 58448], [384350, 103291.75]],
}

describe("2026 federal tax", () => {
  for (const [filing, rows] of Object.entries(ANCHORS)) {
    for (const [income, expected] of rows) {
      it(`${filing} at ${income}`, () => {
        expect(federalTax(income, filing as keyof typeof BRACKETS)).toBeCloseTo(expected, 2)
      })
    }
  }

  it("standard deductions match the IRS", () => {
    expect(STANDARD_DEDUCTION).toEqual({ single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 })
  })

  it("applies the standard deduction", () => {
    expect(taxableAfterStandardDeduction(75000, "single")).toBe(58900)
    expect(taxableAfterStandardDeduction(10000, "single")).toBe(0)
    expect(taxableAfterStandardDeduction(75000, "single", 5000)).toBe(53900)
  })

  it("returns zero tax on zero or negative income", () => {
    expect(federalTax(0, "single")).toBe(0)
    expect(federalTax(-5, "single")).toBe(0)
  })

  it("finds the marginal rate", () => {
    expect(marginalRate(12400, "single")).toBe(0.10)
    expect(marginalRate(12401, "single")).toBe(0.12)
    expect(marginalRate(1_000_000, "mfj")).toBe(0.37)
  })

  it("maps unknown filing strings to single", () => {
    expect(toFiling("bogus")).toBe("single")
    expect(toFiling("hoh")).toBe("hoh")
  })
})

describe("FICA", () => {
  it("uses the 2026 wage base of $184,500", () => {
    expect(SS_WAGE_BASE).toBe(184500)
    expect(socialSecurityTax(184500)).toBeCloseTo(11439, 2)
    expect(socialSecurityTax(500000)).toBeCloseTo(11439, 2)
  })
  it("has uncapped Medicare", () => {
    expect(medicareTax(100000)).toBeCloseTo(1450, 2)
  })
})

describe("no copies of tax constants in calculator pages", () => {
  const pages = [
    "src/app/finance/tax-bracket/page.tsx",
    "src/app/finance/take-home-pay/page.tsx",
    "src/app/finance/paycheck-calculator/page.tsx",
    "src/app/embed/(tools)/take-home-pay/page.tsx",
  ]
  for (const page of pages) {
    it(page, () => {
      const src = readFileSync(page, "utf8")
      expect(src).not.toMatch(/\b184500\b|\b176100\b|\b168600\b/)
      expect(src).not.toMatch(/\b16100\b[^%]*:/)
      expect(src).not.toMatch(/\[\s*12400\s*,/)
    })
  }
})
