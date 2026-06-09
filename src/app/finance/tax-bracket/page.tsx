"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

type Filing = "single" | "mfj" | "mfs" | "hoh"

const STD_DEDUCTION: Record<Filing, number> = { single: 15000, mfj: 30000, mfs: 15000, hoh: 22500 }

const BRACKET_DEFS: Record<Filing, [number, number, string][]> = {
  single: [
    [11925, 0.10, "#4ade80"],
    [48475, 0.12, "#86efac"],
    [103350, 0.22, "#F9A825"],
    [197300, 0.24, "#fb923c"],
    [250525, 0.32, "#f97316"],
    [626350, 0.35, "#ef4444"],
    [Infinity, 0.37, "#dc2626"],
  ],
  mfj: [
    [23850, 0.10, "#4ade80"],
    [96950, 0.12, "#86efac"],
    [206700, 0.22, "#F9A825"],
    [394600, 0.24, "#fb923c"],
    [501050, 0.32, "#f97316"],
    [751600, 0.35, "#ef4444"],
    [Infinity, 0.37, "#dc2626"],
  ],
  mfs: [
    [11925, 0.10, "#4ade80"],
    [48475, 0.12, "#86efac"],
    [103350, 0.22, "#F9A825"],
    [197300, 0.24, "#fb923c"],
    [250525, 0.32, "#f97316"],
    [375800, 0.35, "#ef4444"],
    [Infinity, 0.37, "#dc2626"],
  ],
  hoh: [
    [17000, 0.10, "#4ade80"],
    [64850, 0.12, "#86efac"],
    [103350, 0.22, "#F9A825"],
    [197300, 0.24, "#fb923c"],
    [250500, 0.32, "#f97316"],
    [626350, 0.35, "#ef4444"],
    [Infinity, 0.37, "#dc2626"],
  ],
}

export default function TaxBracketPage() {
  const [income, setIncome] = useState("75000")
  const [filing, setFiling] = useState<Filing>("single")
  const [otherDeductions, setOtherDeductions] = useState("0")
  const [useStandard, setUseStandard] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("income")) setIncome(p.get("income")!)
    if (p.get("filing")) setFiling(p.get("filing") as Filing)
  }, [])

  const calc = useMemo(() => {
    const gross = parseFloat(income) || 0
    const ded = useStandard ? STD_DEDUCTION[filing] : (parseFloat(otherDeductions) || 0)
    const taxable = Math.max(0, gross - ded)
    const brackets = BRACKET_DEFS[filing]

    let tax = 0
    let prev = 0
    const breakdown: { pct: number; from: number; to: number; taxable: number; tax: number; color: string }[] = []
    for (const [limit, rate, color] of brackets) {
      if (taxable <= prev) break
      const taxableInBracket = Math.min(taxable, limit === Infinity ? taxable : limit) - prev
      const taxInBracket = taxableInBracket * rate
      tax += taxInBracket
      breakdown.push({ pct: rate * 100, from: prev, to: Math.min(taxable, limit === Infinity ? taxable : limit), taxable: taxableInBracket, tax: taxInBracket, color })
      prev = limit === Infinity ? taxable : limit
    }

    const effectiveRate = taxable > 0 ? (tax / taxable * 100).toFixed(1) : "0"
    const marginalPct = breakdown.length > 0 ? breakdown[breakdown.length - 1].pct : 0

    // Married comparison
    const mfjDed = STD_DEDUCTION["mfj"]
    const mfjTaxable = Math.max(0, gross - mfjDed)
    let mfjTax = 0; let mp = 0
    for (const [limit, rate] of BRACKET_DEFS["mfj"]) {
      if (mfjTaxable <= mp) break
      mfjTax += (Math.min(mfjTaxable, limit === Infinity ? mfjTaxable : limit) - mp) * rate
      mp = limit === Infinity ? mfjTaxable : limit
    }
    const marriedSavings = tax - mfjTax

    return { taxable, tax, effectiveRate, marginalPct, breakdown, ded, marriedSavings }
  }, [income, filing, otherDeductions, useStandard])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Tax Bracket Calculator",
          "Find your marginal and effective federal income tax rate based on your taxable income.",
          "https://www.dayblip.com/finance/tax-bracket",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How do federal tax brackets work?", answer: "Brackets are marginal: only the income within each bracket is taxed at that bracket's rate. You do not pay your top rate on all your income, so the calculator breaks your tax down bracket by bracket to show what each layer contributes." },
          { question: "What is the difference between marginal and effective tax rate?", answer: "Your marginal rate is the rate on your highest dollar of taxable income. Your effective rate is your total tax divided by taxable income, which is lower because lower brackets tax your earlier dollars at 10%, 12% and so on." },
          { question: "How does the standard deduction affect my tax?", answer: "The standard deduction is subtracted from your income before tax is calculated, lowering your taxable income. The calculator applies the amount for your filing status, or you can switch to itemized deductions and enter your own total." },
          { question: "How does filing status change my taxes?", answer: "Each filing status — single, married filing jointly, married filing separately, head of household — has its own bracket thresholds and standard deduction. The tool also estimates how much a single filer might save by filing jointly at the same income." },
        ]),
        howToSchema(
          "Tax Bracket Calculator — How To Use",
          "Find your federal marginal and effective tax rate.",
          [
            "Enter your annual income.",
            "Select your filing status.",
            "Choose the standard deduction or switch to itemized and enter your total deductions.",
            "Read your estimated federal tax, marginal bracket, effective rate and the bracket-by-bracket breakdown.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Tax Bracket Calculator", url: "https://www.dayblip.com/finance/tax-bracket" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Tax Bracket Calculator — Marginal vs Effective Tax Rate</h1>
          <p className="text-[#a8a8b3]">Find your federal tax bracket and see exactly how much you owe</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The US uses a progressive tax system where different portions of income are taxed at different rates. A $100,000 earner in the 22% bracket does NOT pay 22% on all income. They pay 10% on the first $11,600, 12% on the next $35,550 and 22% only on the remainder. Their effective rate is approximately 15.7% — not 22%.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Your marginal tax rate is the rate on your last dollar of income and determines which bracket you are in. Your effective tax rate is the actual percentage of total income paid in federal taxes — always lower than the marginal rate. Understanding the difference is the most common tax misconception in the US.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Tax Bracket Calculator" }]} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Income ($)</span>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Filing Status</span>
              <select value={filing} onChange={e => setFiling(e.target.value as Filing)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                <option value="single">Single</option>
                <option value="mfj">Married Filing Jointly</option>
                <option value="mfs">Married Filing Separately</option>
                <option value="hoh">Head of Household</option>
              </select></label>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
            <div className="flex gap-2 mb-3">
              {([true, false] as const).map(s => (
                <button key={String(s)} onClick={() => setUseStandard(s)}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${useStandard === s ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                  {s ? `Standard Deduction (${fmt(STD_DEDUCTION[filing])})` : "Itemize Deductions"}
                </button>
              ))}
            </div>
            {!useStandard && (
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Total Itemized Deductions ($)</span>
                <input type="number" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} className={inp} /></label>
            )}
          </div>

          {/* Top result */}
          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-sm text-[#a8a8b3] mb-1">Estimated Federal Tax</div>
            <div className="text-5xl font-black text-[#e94560]">{fmt(calc.tax)}</div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div><div className="font-bold text-white">{calc.marginalPct.toFixed(0)}%</div><div className="text-[#a8a8b3]">Marginal bracket</div></div>
              <div><div className="font-bold text-white">{calc.effectiveRate}%</div><div className="text-[#a8a8b3]">Effective rate</div></div>
            </div>
          </div>

          {/* Bracket visual bar */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 How Each Bracket Applies to You</h2>
            {calc.breakdown.map((b, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a8a8b3]">{b.pct.toFixed(0)}% on {fmt(b.from)} – {fmt(b.to)}</span>
                  <span className="font-bold" style={{ color: b.color }}>{fmt(b.tax)}</span>
                </div>
                <div className="h-3 rounded-full bg-[#16213e] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (b.taxable / (parseFloat(income) || 1)) * 100)}%`, background: b.color }} />
                </div>
              </div>
            ))}
            <div className="mt-3 text-sm">
              <div className="flex justify-between border-t border-[#0f3460] pt-2">
                <span className="text-[#a8a8b3]">Taxable income (after {fmt(calc.ded)} deduction)</span>
                <span className="text-white">{fmt(calc.taxable)}</span>
              </div>
              <div className="flex justify-between mt-1 font-bold">
                <span className="text-white">Total Federal Tax</span>
                <span className="text-[#e94560]">{fmt(calc.tax)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📅 Your Tax Timeline</h2>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {[
                { label: "Per day", value: calc.tax / 365 },
                { label: "Per paycheck (bi-wk)", value: calc.tax / 26 },
                { label: "Per month", value: calc.tax / 12 },
              ].map(r => (
                <div key={r.label} className="rounded-lg bg-[#16213e] p-3">
                  <div className="font-black text-[#e94560]">{fmt(r.value)}</div>
                  <div className="text-[#a8a8b3]">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Married comparison */}
          {filing === "single" && calc.marriedSavings > 0 && (
            <div className="rounded-xl border border-green-500/20 bg-green-900/10 p-4 text-sm">
              <span className="text-green-400 font-semibold">💍 If married filing jointly </span>
              <span className="text-[#a8a8b3]">you would save approximately </span>
              <span className="text-white font-bold">{fmt(calc.marriedSavings)}</span>
              <span className="text-[#a8a8b3]"> in federal taxes at this income level.</span>
            </div>
          )}

          <ShareButtons
            text={`My marginal bracket is ${calc.marginalPct.toFixed(0)}% but effective rate is only ${calc.effectiveRate}%! (Educational only)`}
            url={`https://www.dayblip.com/finance/tax-bracket?income=${income}&filing=${filing}`}
            title="Tax Bracket Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Educational estimate only. Does not include credits, AMT, or other adjustments. Consult a tax professional or use IRS.gov for accurate calculations.</p>
          <RelatedTools tools={[
            { emoji: "🏛️", title: "No Tax on Overtime 2026", desc: "Calculate your overtime tax savings under new law", href: "/finance/overtime-tax" },
            { emoji: "🧾", title: "Paycheck Calculator", desc: "Exact net pay per period after all deductions", href: "/finance/paycheck-calculator" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Annual take-home salary after all taxes", href: "/finance/take-home-pay" },
            { emoji: "⏱️", title: "Overtime Pay Calculator", desc: "How much do you earn working extra hours?", href: "/finance/overtime-calculator" },
          ]} />
        </div>
      </section>
    </div>
  )
}
