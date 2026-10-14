import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Headline numbers hard-coded in calculator prose must match the math. When a
// figure here changes, fix the page text, not the test.

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8")
const money = (n: number) => Math.round(n).toLocaleString("en-US")

function payment(loan: number, annualRate: number, years: number) {
  const i = annualRate / 12
  const n = years * 12
  return (loan * i) / (1 - Math.pow(1 + i, -n))
}

function futureValue(monthly: number, annualRate: number, years: number) {
  const i = annualRate / 12
  const n = years * 12
  return monthly * ((Math.pow(1 + i, n) - 1) / i)
}

describe("hard-coded calculator claims", () => {
  it("$500 a month at 7% for 40 years is about $1.31 million", () => {
    const fv = futureValue(500, 0.07, 40)
    expect(fv).toBeGreaterThan(1_305_000)
    expect(fv).toBeLessThan(1_315_000)
    for (const f of ["src/app/finance/401k-calculator/page.tsx", "src/app/finance/retirement-savings/page.tsx"]) {
      expect(read(f)).toContain("$1.31 million")
    }
  })

  it("the $300,000 7% 30-year mortgage figures on the mortgage page", () => {
    const pmt = payment(300000, 0.07, 30)
    const interest = pmt * 360 - 300000
    const page = read("src/app/finance/mortgage-calculator/page.tsx")
    expect(page).toContain("$" + money(pmt))
    expect(page).toContain("$" + money(interest))
    expect(page).toContain("$" + money(pmt * 360))
  })

  it("one extra payment a year on that loan saves about $98,500 and about 6 years", () => {
    const i = 0.07 / 12
    const pmt = payment(300000, 0.07, 30)
    let bal = 300000
    let months = 0
    let paidInterest = 0
    while (bal > 0.005 && months < 400) {
      months++
      const interest = bal * i
      let principal = pmt - interest
      if (months % 12 === 0) principal += pmt
      if (principal > bal) principal = bal
      bal -= principal
      paidInterest += interest
    }
    const saved = pmt * 360 - 300000 - paidInterest
    expect(Math.round(saved / 500) * 500).toBe(98500)
    expect(Math.round((360 - months) / 12)).toBe(6)
    expect(read("src/app/finance/mortgage-calculator/page.tsx")).toContain("$98,500")
  })
})
