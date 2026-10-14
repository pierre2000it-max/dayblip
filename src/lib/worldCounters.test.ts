import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"
import { utcWallClock } from "@/lib/useNow"

const ROOT = join(process.cwd(), "src/app/world-counters")
const COUNTERS = [
  ".", "births-today", "co2-emissions", "money-printed-today", "plastic-in-ocean",
  "population", "trees-cut-today", "us-debt", "us-population",
]

describe("utcWallClock", () => {
  it("local getters read as the UTC clock, whatever the machine zone", () => {
    const ms = Date.UTC(2026, 9, 14, 3, 30, 15) // 03:30:15 UTC
    const d = utcWallClock(ms)
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(9)
    expect(d.getDate()).toBe(14)
    expect(d.getHours()).toBe(3)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(15)
  })
})

describe("world counter pages are SSR-safe", () => {
  for (const dir of COUNTERS) {
    it(`${dir}: server page passes initialNow, client reads useNow`, () => {
      const base = join(ROOT, dir)
      const page = readFileSync(join(base, "page.tsx"), "utf8")
      const counter = readFileSync(join(base, "Counter.tsx"), "utf8")
      expect(page).toContain("initialNow={Date.now()}")
      expect(page).toContain("export const revalidate")
      expect(page).not.toContain("use client")
      expect(counter).toContain("useNow(initialNow)")
      expect(counter).not.toMatch(/new Date\(\)/)
      expect(counter).not.toMatch(/toLocaleString\(\)/)
    })
  }
  it("every counter folder with a Counter.tsx is covered", () => {
    const found = readdirSync(ROOT, { withFileTypes: true })
      .filter(e => e.isDirectory() && existsSync(join(ROOT, e.name, "Counter.tsx")))
      .map(e => e.name)
    for (const f of found) expect(COUNTERS).toContain(f)
  })
})
