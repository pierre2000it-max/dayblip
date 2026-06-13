"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

type Filing = "single" | "married" | "hoh"

const BRACKETS: Record<Filing, [number, number][]> = {
  single: [
    [11925, 0.10], [48475, 0.12], [103350, 0.22],
    [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37],
  ],
  married: [
    [23850, 0.10], [96950, 0.12], [206700, 0.22],
    [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37],
  ],
  hoh: [
    [17000, 0.10], [64850, 0.12], [103350, 0.22],
    [197300, 0.24], [250500, 0.32], [626350, 0.35], [Infinity, 0.37],
  ],
}

function calcFederalTax(income: number, filing: Filing): number {
  const brackets = BRACKETS[filing]
  let tax = 0
  let prev = 0
  for (const [ceiling, rate] of brackets) {
    if (income <= prev) break
    const taxable = Math.min(income, ceiling) - prev
    tax += taxable * rate
    prev = ceiling
    if (ceiling === Infinity) break
  }
  return Math.max(0, tax)
}

interface Result {
  totalOvertimeHours: number
  totalOvertimePay: number
  totalOvertimePremium: number
  deductionCap: number
  deductibleAmount: number
  annualIncome: number
  taxWithout: number
  taxWith: number
  taxSavings: number
  effectiveSavingsRate: number
  overtimeRate: number
}

export default function OvertimeTaxPage() {
  const [hourlyRate, setHourlyRate] = useState("20")
  const [hoursPerWeek, setHoursPerWeek] = useState("10")
  const [weeksPerYear, setWeeksPerYear] = useState("20")
  const [filing, setFiling] = useState<Filing>("single")
  const [regularIncome, setRegularIncome] = useState("50000")
  const [result, setResult] = useState<Result | null>(null)

  function calculate() {
    const rate = parseFloat(hourlyRate) || 20
    const hpw = parseFloat(hoursPerWeek) || 10
    const wpy = parseFloat(weeksPerYear) || 20
    const regIncome = parseFloat(regularIncome) || 50000

    const overtimeRate = rate * 1.5
    const overtimePremium = rate * 0.5
    const totalOvertimeHours = hpw * wpy
    const totalOvertimePay = overtimeRate * totalOvertimeHours
    const totalOvertimePremium = overtimePremium * totalOvertimeHours
    const annualIncome = regIncome + totalOvertimePay
    const taxWithout = calcFederalTax(annualIncome, filing)
    const deductionCap = filing === "married" ? 25000 : 12500
    const deductibleAmount = Math.min(totalOvertimePremium, deductionCap)
    const taxWith = calcFederalTax(annualIncome - deductibleAmount, filing)
    const taxSavings = taxWithout - taxWith
    const effectiveSavingsRate = totalOvertimePay > 0 ? (taxSavings / totalOvertimePay) * 100 : 0

    setResult({
      totalOvertimeHours, totalOvertimePay, totalOvertimePremium,
      deductionCap, deductibleAmount, annualIncome,
      taxWithout, taxWith, taxSavings, effectiveSavingsRate, overtimeRate: rate * 1.5,
    })
  }

  const shareText = result
    ? `Under the 2026 tax law I save ${fmt(result.taxSavings)} in federal taxes on my overtime pay. Calculate yours free: www.dayblip.com/finance/overtime-tax`
    : "Calculate your 2026 overtime tax savings: www.dayblip.com/finance/overtime-tax"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "No Tax on Overtime Calculator 2026",
          "Calculate federal tax savings on overtime pay under the 2026 One Big Beautiful Bill Act",
          "https://www.dayblip.com/finance/overtime-tax",
          "FinanceApplication",
        ),
        faqSchema([
          { question: "Is overtime tax free in 2026?", answer: "Not completely. Under the One Big Beautiful Bill Act eligible hourly workers can deduct overtime premium pay from federal taxable income — up to $12,500 per year for single filers. FICA taxes and state taxes still apply. The deduction applies to tax years 2025 through 2028 only." },
          { question: "What is the overtime tax deduction cap in 2026?", answer: "The deduction cap is $12,500 per year for single filers and $25,000 for married filing jointly. The deduction only covers the overtime premium — the extra 0.5x above your regular rate — not total overtime pay." },
          { question: "Who qualifies for the no tax on overtime deduction?", answer: "FLSA-covered hourly employees earning overtime qualify. Salaried exempt employees generally do not qualify. The income phase-out begins at $150,000 for single filers. Consult a tax professional to confirm your eligibility." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "No Tax on Overtime", url: "https://www.dayblip.com/finance/overtime-tax" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">No Tax on Overtime Calculator — How Much Do You Save in 2026?</h1>
          <p className="text-[#a8a8b3]">Estimate your federal tax savings under the One Big Beautiful Bill Act</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Finance", href: "/finance" },
            { label: "No Tax on Overtime" },
          ]} />
          <LastUpdated />

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              Under the 2026 One Big Beautiful Bill Act eligible hourly workers can deduct overtime premium pay from federal taxable income — up to $12,500 per year for single filers and $25,000 for joint filers. On $15,000 in overtime earnings at a 22% tax bracket this saves approximately $2,750 in federal taxes. FICA taxes still apply. Valid for tax years 2025–2028 only.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>
            The One Big Beautiful Bill Act signed July 4 2025 created a new above-the-line federal income tax deduction for overtime premium pay. This only covers the premium portion of overtime — the extra 0.5x above your regular rate. Regular wages and FICA taxes are unaffected. This calculator estimates your federal tax savings for tax years 2025 through 2028.
          </p>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
            ⚠️ <strong>Educational purposes only.</strong> Not tax advice. Consult a qualified tax professional for advice specific to your situation.
          </div>

          {/* Inputs */}
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Regular hourly rate ($)</span>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Overtime hours/week</span>
              <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Weeks of overtime/year</span>
              <input type="number" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Filing status</span>
            <select value={filing} onChange={e => setFiling(e.target.value as Filing)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="hoh">Head of Household</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Annual regular income ($)</span>
            <input type="number" value={regularIncome} onChange={e => setRegularIncome(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Tax Savings
          </button>

          {result && (
            <div className="space-y-5">
              {/* Headline savings */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center">
                <div className="text-sm text-[#a8a8b3] mb-1">Your estimated federal tax savings</div>
                <div className="text-5xl font-black text-[#F9A825]">{fmt(result.taxSavings)}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">per year on overtime pay</div>
              </div>

              {/* Breakdown */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3 text-sm">
                <h2 className="font-bold text-white text-base">Calculation Breakdown</h2>
                {[
                  ["Total overtime hours", `${result.totalOvertimeHours.toLocaleString()} hrs/year`],
                  ["Total overtime pay", fmt(result.totalOvertimePay)],
                  ["Overtime premium (deductible portion)", fmt(result.totalOvertimePremium)],
                  ["Deduction cap", fmt(result.deductionCap)],
                  ["Actual deduction used", fmt(result.deductibleAmount)],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between border-b border-[#0f3460] pb-2">
                    <span className="text-[#a8a8b3]">{l}</span>
                    <span className="font-semibold text-white">{v}</span>
                  </div>
                ))}
              </div>

              {/* Tax comparison */}
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4">
                  <div className="text-[#a8a8b3] mb-1">Tax WITHOUT deduction</div>
                  <div className="text-2xl font-black text-[#FF6B6B]">{fmt(result.taxWithout)}</div>
                </div>
                <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-4">
                  <div className="text-[#a8a8b3] mb-1">Tax WITH deduction</div>
                  <div className="text-2xl font-black text-green-400">{fmt(result.taxWith)}</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-5 text-center">
                <div className="text-sm text-[#a8a8b3]">Effective overtime take-home rate</div>
                <div className="text-3xl font-black text-[#F9A825]">{(100 - result.effectiveSavingsRate).toFixed(1)}%</div>
                <div className="text-xs text-[#a8a8b3] mt-1">of overtime pay you keep after federal tax (with deduction)</div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4 text-xs text-[#a8a8b3]">
                This calculator provides estimates for informational purposes only. Consult a qualified tax professional for advice specific to your situation. FICA taxes (Social Security and Medicare) still apply to all wages. State taxes not included.
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/finance/overtime-tax" title="No Tax on Overtime Calculator 2026" />
            </div>
          )}

          <MethodologyNote text="Based on 2026 IRS federal tax brackets and FLSA overtime rate definition (1.5× regular pay for hours exceeding 40 per week)." />
          <RelatedTools tools={[
            { emoji: "💵", title: "Overtime Pay Calculator", desc: "Calculate gross overtime earnings", href: "/finance/overtime-calculator" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Your actual paycheck after all taxes", href: "/finance/take-home-pay" },
            { emoji: "📊", title: "Tax Bracket Calculator", desc: "Marginal vs effective tax rate", href: "/finance/tax-bracket" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What your job really pays per hour", href: "/tools/true-hourly-wage" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
