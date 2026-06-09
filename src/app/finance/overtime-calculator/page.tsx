"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmt0(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

interface Result {
  regularHours: number
  overtimeHours: number
  overtimeRate: number
  weeklyRegularPay: number
  weeklyOvertimePay: number
  weeklyTotalPay: number
  monthlyOvertimePay: number
  annualOvertimePay: number
}

export default function OvertimeCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState("20")
  const [hoursWorked, setHoursWorked] = useState("50")
  const [multiplier, setMultiplier] = useState("1.5")
  const [weeks, setWeeks] = useState("52")
  const [result, setResult] = useState<Result | null>(null)

  function calculate() {
    const rate = parseFloat(hourlyRate) || 20
    const hw = parseFloat(hoursWorked) || 50
    const mult = parseFloat(multiplier) || 1.5
    const w = parseFloat(weeks) || 52

    const regularHours = Math.min(hw, 40)
    const overtimeHours = Math.max(0, hw - 40)
    const overtimeRate = rate * mult
    const weeklyRegularPay = regularHours * rate
    const weeklyOvertimePay = overtimeHours * overtimeRate
    const weeklyTotalPay = weeklyRegularPay + weeklyOvertimePay
    const monthlyOvertimePay = weeklyOvertimePay * 4.33
    const annualOvertimePay = weeklyOvertimePay * w

    setResult({ regularHours, overtimeHours, overtimeRate, weeklyRegularPay, weeklyOvertimePay, weeklyTotalPay, monthlyOvertimePay, annualOvertimePay })
  }

  const shareText = result
    ? `Working ${result.overtimeHours} hours of overtime at $${hourlyRate}/hour earns an extra ${fmt(result.weeklyOvertimePay)} this week. Calculate yours: www.dayblip.com/finance/overtime-calculator`
    : "Calculate your overtime pay: www.dayblip.com/finance/overtime-calculator"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Overtime Pay Calculator",
          "Calculate gross overtime pay for any hourly rate and hours worked",
          "https://www.dayblip.com/finance/overtime-calculator",
          "FinanceApplication",
        ),
        faqSchema([
          { question: "How is overtime pay calculated?", answer: "Overtime is calculated at 1.5 times your regular hourly rate for all hours over 40 per week. At $20 per hour your overtime rate is $30. Some states require double time (2x) after 12 hours in a single day. California additionally requires double time for all hours over 12 in a workday or on the 7th consecutive day of a workweek." },
          { question: "Is overtime taxed differently?", answer: "Overtime is taxed at the same rate as regular income — there is no special overtime tax rate. However under the 2026 One Big Beautiful Bill Act eligible hourly workers can deduct overtime premium pay reducing their federal taxable income by up to $12,500 per year." },
          { question: "Who qualifies for overtime pay?", answer: "Non-exempt employees under the FLSA qualify for overtime. Most hourly workers qualify. Salaried employees earning above $58,656 per year (2026 threshold) are generally classified as exempt and do not receive overtime pay." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Overtime Pay Calculator", url: "https://www.dayblip.com/finance/overtime-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Overtime Pay Calculator — How Much Is Your Overtime Worth?</h1>
          <p className="text-[#a8a8b3]">Calculate gross overtime earnings for any hourly rate and hours worked</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Finance", href: "/finance" },
            { label: "Overtime Pay Calculator" },
          ]} />

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              Overtime pay under the FLSA is 1.5 times your regular hourly rate for all hours worked over 40 per week. At $20 per hour your overtime rate is $30 per hour. Working 50 hours in a week means 10 hours of overtime pay — an extra $300 gross before taxes. Some states require double time (2x) after 12 hours in a single workday.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>
            The Fair Labor Standards Act requires employers to pay non-exempt employees at least 1.5 times their regular rate for hours worked over 40 in a workweek. Salaried employees classified as exempt under FLSA do not qualify for overtime pay. This calculator shows your gross overtime earnings before taxes.
          </p>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Regular hourly rate ($)</span>
              <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Total hours this week</span>
              <input type="number" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Overtime rate multiplier</span>
            <select value={multiplier} onChange={e => setMultiplier(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
              <option value="1.5">1.5x — Time and a half (federal standard)</option>
              <option value="2.0">2.0x — Double time (some states / contracts)</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Weeks to calculate (for annual projection)</span>
            <input type="number" value={weeks} onChange={e => setWeeks(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Overtime Pay
          </button>

          {result && (
            <div className="space-y-5">
              {/* Rate banner */}
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                  <div className="text-[#a8a8b3]">Regular rate</div>
                  <div className="text-2xl font-black text-white">{fmt(parseFloat(hourlyRate) || 20)}<span className="text-sm font-normal">/hr</span></div>
                </div>
                <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-4">
                  <div className="text-[#a8a8b3]">Overtime rate ({multiplier}x)</div>
                  <div className="text-2xl font-black text-[#F9A825]">{fmt(result.overtimeRate)}<span className="text-sm font-normal">/hr</span></div>
                </div>
              </div>

              {/* This week */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3 text-sm">
                <h2 className="font-bold text-white text-base">This Week</h2>
                {[
                  [`Regular pay (${result.regularHours} hrs)`, fmt(result.weeklyRegularPay), "#a8a8b3"],
                  [`Overtime pay (${result.overtimeHours} hrs)`, fmt(result.weeklyOvertimePay), "#F9A825"],
                  ["Total this week", fmt(result.weeklyTotalPay), "#e94560"],
                ].map(([l, v, c]) => (
                  <div key={l} className="flex justify-between border-b border-[#0f3460] pb-2 last:border-0 last:pb-0">
                    <span className="text-[#a8a8b3]">{l}</span>
                    <span className="font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Projections */}
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4">
                  <div className="text-[#a8a8b3]">Monthly overtime pay</div>
                  <div className="text-xl font-black text-white">{fmt0(result.monthlyOvertimePay)}</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4">
                  <div className="text-[#a8a8b3]">Annual overtime pay</div>
                  <div className="text-xl font-black text-[#F9A825]">{fmt0(result.annualOvertimePay)}</div>
                </div>
              </div>

              {/* Cross-link to overtime tax */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/10 p-4 text-sm text-center">
                <Link href="/finance/overtime-tax" style={{ color: "#e94560", fontWeight: 600 }}>
                  See how much tax you save on overtime under the 2026 tax law →
                </Link>
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/finance/overtime-calculator" title="Overtime Pay Calculator" />
              <p className="text-xs text-[#a8a8b3]">Gross earnings before taxes. FLSA rules apply to most hourly workers. Consult your employer for your specific overtime policy.</p>
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🏛️", title: "No Tax on Overtime 2026", desc: "How much do you save under new law?", href: "/finance/overtime-tax" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Full paycheck after all taxes", href: "/finance/take-home-pay" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What your job really pays per hour", href: "/tools/true-hourly-wage" },
            { emoji: "📊", title: "Tax Bracket Calculator", desc: "How overtime affects your tax bracket", href: "/finance/tax-bracket" },
          ]} />
        </div>
      </section>
    </div>
  )
}
