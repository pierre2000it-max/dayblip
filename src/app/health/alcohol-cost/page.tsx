"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

interface Result {
  weeklyTotal: number
  monthlyTotal: number
  annualTotal: number
  lifetimeTotal: number
  investedValue: number
  opportunityCost: number
  years: number
}

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString()
}

export default function AlcoholCostPage() {
  const [barDrinks,  setBarDrinks]  = useState("3")
  const [barCost,    setBarCost]    = useState("12")
  const [homeDrinks, setHomeDrinks] = useState("4")
  const [homeCost,   setHomeCost]   = useState("3")
  const [years,      setYears]      = useState("20")
  const [returnPct,  setReturnPct]  = useState("7")
  const [result,     setResult]     = useState<Result | null>(null)

  function calculate() {
    const bd = parseFloat(barDrinks)  || 0
    const bc = parseFloat(barCost)    || 0
    const hd = parseFloat(homeDrinks) || 0
    const hc = parseFloat(homeCost)   || 0
    const yr = parseFloat(years)      || 20
    const rt = parseFloat(returnPct)  || 7

    const weeklyTotal    = bd * bc + hd * hc
    const monthlyTotal   = weeklyTotal * 4.33
    const annualTotal    = weeklyTotal * 52
    const lifetimeTotal  = annualTotal * yr

    const monthlyRate    = rt / 100 / 12
    const months         = yr * 12
    const monthlyInvest  = annualTotal / 12
    const investedValue  = monthlyRate > 0
      ? monthlyInvest * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : monthlyInvest * months

    setResult({
      weeklyTotal,
      monthlyTotal,
      annualTotal,
      lifetimeTotal,
      investedValue,
      opportunityCost: investedValue - lifetimeTotal,
      years: yr,
    })
  }

  const shareText = result
    ? `Spending $${Math.round(result.weeklyTotal)}/week on alcohol costs $${Math.round(result.annualTotal).toLocaleString()}/year. Invested at 7% over ${result.years} years that is ${fmt(result.investedValue)}. Calculate your alcohol cost: www.dayblip.com/health/alcohol-cost`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Alcohol Cost Calculator — The True Financial Cost of Your Drinking Habits</h1>
          <p className="text-[#a8a8b3]">Weekly spending and what it would be worth invested instead</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-[#a8a8b3]">
            <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/health" className="hover:text-[#e94560] transition-colors">Health</Link>
            <span>/</span>
            <span className="text-white">Alcohol Cost Calculator</span>
          </nav>

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              The average American spends $579 per year on alcohol at home and significantly more when dining out. Someone spending $50 per week on alcohol — about 5 bar drinks plus a six-pack — spends $2,600 per year directly. Invested at 7% annual return over 20 years that $2,600 per year grows to approximately $136,000.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
            Alcohol cost calculators show both the direct annual spending on alcohol and the opportunity cost — what that money would be worth if invested instead. Like the smoking cost calculator the numbers are often more striking than people expect before they run them. This tool is for information only and does not constitute health or financial advice.
          </p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[600px] space-y-6">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
            <div className="font-bold text-white">🍺 Bar / Restaurant Drinks</div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Drinks per week at bars</span>
                <input type="number" value={barDrinks} onChange={e => setBarDrinks(e.target.value)} className={inp} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Average cost per drink ($)</span>
                <input type="number" value={barCost} onChange={e => setBarCost(e.target.value)} className={inp} />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
            <div className="font-bold text-white">🏠 At Home Drinks</div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Drinks per week at home</span>
                <input type="number" value={homeDrinks} onChange={e => setHomeDrinks(e.target.value)} className={inp} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Average cost per drink ($)</span>
                <input type="number" value={homeCost} onChange={e => setHomeCost(e.target.value)} className={inp} />
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years to calculate</span>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual investment return (%)</span>
              <input type="number" value={returnPct} onChange={e => setReturnPct(e.target.value)} className={inp} />
            </label>
          </div>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Alcohol Cost
          </button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 text-center text-sm">
                {[
                  ["Weekly spending",   fmt(result.weeklyTotal),  "#4FC3F7"],
                  ["Monthly spending",  fmt(result.monthlyTotal), "#F9A825"],
                  ["Annual spending",   fmt(result.annualTotal),  "#e94560"],
                  [`${result.years}-year total`, fmt(result.lifetimeTotal), "#fb923c"],
                  ["If invested instead", fmt(result.investedValue), "#4ade80"],
                  ["Opportunity cost",    fmt(result.opportunityCost), "#e94560"],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                    <div className="font-black text-lg" style={{ color: String(color) }}>{value}</div>
                    <div className="mt-0.5 text-xs text-[#a8a8b3]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-5 text-sm">
                <div className="font-bold text-[#4ade80] mb-2">💰 If invested at {returnPct}% over {result.years} years</div>
                <p className="text-[#a8a8b3]">Instead of spending {fmt(result.annualTotal)} per year on alcohol, investing that amount monthly in a broadly diversified fund earning {returnPct}% average annual return would grow to <span className="text-white font-bold">{fmt(result.investedValue)}</span>.</p>
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/health/alcohol-cost" title="Alcohol Cost Calculator" />
              <p className="text-xs text-[#a8a8b3]">⚠️ For educational and informational purposes only. Not financial or health advice. Investment returns are hypothetical and not guaranteed.</p>
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🚬", title: "True Cost of Smoking",    desc: "Smoking habit invested over 40 years",  href: "/tools/smoking-cost" },
            { emoji: "🏃", title: "Habit Cost Calculator",   desc: "Financial cost of any daily habit",     href: "/health/habit-cost" },
            { emoji: "☕", title: "Latte Factor Calculator",  desc: "Any daily spend invested instead",      href: "/curiosity/latte-factor" },
            { emoji: "📈", title: "Compound Interest",        desc: "Watch money grow over decades",         href: "/finance/compound-interest" },
          ]} />
        </div>
      </section>
    </div>
  )
}
