import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  BRACKETS, STANDARD_DEDUCTION, SS_WAGE_BASE, federalTax, marginalRate,
  medicareTax, socialSecurityTax, taxableAfterStandardDeduction, toFiling,
  LTCG_LIMITS, ltcgTax, selfEmploymentTax,
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

describe("long-term capital gains", () => {
  it("is 0% when gain fits under the 0% limit", () => {
    expect(ltcgTax(10000, 30000, "single")).toBe(0)
  })
  it("splits a gain across the 0% and 15% zones", () => {
    // 49,450 limit, 40,000 ordinary: 9,450 at 0%, 10,550 at 15%
    expect(ltcgTax(20000, 40000, "single")).toBeCloseTo(10550 * 0.15, 2)
  })
  it("reaches 20% above the 15% limit", () => {
    expect(ltcgTax(100000, 545500, "single")).toBeCloseTo(20000, 2)
  })
  it("matches the IRS limits", () => {
    expect(LTCG_LIMITS.mfj).toEqual([98900, 613700])
  })
})

describe("self-employment tax", () => {
  it("is 15.3% of 92.35% below the wage base", () => {
    const r = selfEmploymentTax(80000)
    expect(r.total).toBeCloseTo(80000 * 0.9235 * 0.153, 2)
    expect(r.deduction).toBeCloseTo(r.total / 2, 2)
  })
  it("caps Social Security at the wage base", () => {
    const r = selfEmploymentTax(400000)
    expect(r.ss).toBeCloseTo(184500 * 0.124, 2)
  })
  it("uses up the base with W-2 wages first", () => {
    expect(selfEmploymentTax(50000, 184500).ss).toBe(0)
  })
})

describe("no copies of tax constants anywhere else in src", () => {
  const banned = /\b(11925|48475|103350|197300|23850|96950|206700|394600|50400|105700|201775|256225|640600|184500|176100|168600)\b/
  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) return walk(full)
      return /\.(ts|tsx)$/.test(name) ? [full] : []
    })
  }
  const files = walk("src").filter((f) => !/tax2026(\.test)?\.ts$/.test(f))
  it("scans files", () => expect(files.length).toBeGreaterThan(100))
  it("finds no bracket or wage-base literals", () => {
    const offenders = files.filter((f) => banned.test(readFileSync(f, "utf8")))
    expect(offenders).toEqual([])
  })
})
