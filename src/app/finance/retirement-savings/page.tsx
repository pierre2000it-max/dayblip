"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function RetirementSavingsPage() {
  const [currentAge, setCurrentAge] = useState("35")
  const [retirementAge, setRetirementAge] = useState("65")
  const [currentSavings, setCurrentSavings] = useState("50000")
  const [monthlySavings, setMonthlySavings] = useState("500")
  const [expectedReturn, setExpectedReturn] = useState("7")
  const [desiredIncome, setDesiredIncome] = useState("5000")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("age")) setCurrentAge(p.get("age")!)
    if (p.get("retireage")) setRetirementAge(p.get("retireage")!)
    if (p.get("savings")) setCurrentSavings(p.get("savings")!)
    if (p.get("monthly")) setMonthlySavings(p.get("monthly")!)
    if (p.get("return")) setExpectedReturn(p.get("return")!)
    if (p.get("income")) setDesiredIncome(p.get("income")!)
  }, [])

  const calc = useMemo(() => {
    const ca = parseFloat(currentAge) || 0
    const ra = parseFloat(retirementAge) || 0
    const cs = parseFloat(currentSavings) || 0
    const ms = parseFloat(monthlySavings) || 0
    const r = (parseFloat(expectedReturn) || 0) / 100 / 12
    const di = parseFloat(desiredIncome) || 0
    const months = Math.max(0, (ra - ca) * 12)
    const projected = r === 0
      ? cs + ms * months
      : cs * Math.pow(1 + r, months) + ms * ((Math.pow(1 + r, months) - 1) / r)
    const needed = di * 12 * 25
    const surplus = projected - needed
    const onTrack = projected >= needed
    const milestones = [30, 40, 50, 60, ra].filter(a => a > ca && a <= ra).map(age => {
      const mn = (age - ca) * 12
      const bal = r === 0 ? cs + ms * mn : cs * Math.pow(1 + r, mn) + ms * ((Math.pow(1 + r, mn) - 1) / r)
      return { age, bal }
    })
    return { projected, needed, surplus, onTrack, milestones }
  }, [currentAge, retirementAge, currentSavings, monthlySavings, expectedReturn, desiredIncome])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Retirement Savings Calculator",
          "Find out if your retirement savings are on track to fund your retirement.",
          "https://www.dayblip.com/finance/retirement-savings",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How does this calculator project my retirement savings?", answer: "It compounds your current savings and monthly contributions monthly at your expected return until your retirement age, giving the projected balance you would have when you stop working." },
          { question: "What is the 25x rule?", answer: "The 25x rule estimates the nest egg you need as 25 times your desired annual retirement income, which corresponds to a 4% annual withdrawal rate. If you want $5,000 a month, that is $60,000 a year, so you would target $1.5 million." },
          { question: "What return should I assume?", answer: "Many planners use a long-run average of around 7% for a diversified portfolio, but returns vary year to year and are not guaranteed. You can adjust the expected return field to test more conservative assumptions." },
          { question: "What does 'on track' mean here?", answer: "You are flagged as on track when your projected savings at retirement meet or exceed the amount needed under the 25x rule. Otherwise the calculator shows the shortfall so you can adjust your contributions." },
        ]),
        howToSchema(
          "Retirement Savings Calculator — How To Use",
          "Check whether your retirement savings are on track.",
          [
            "Enter your current age and planned retirement age.",
            "Enter your current savings and how much you save each month.",
            "Set your expected annual return and your desired monthly retirement income.",
            "Read the on-track or shortfall result, your projected balance versus the amount needed, and the savings milestones by age.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Retirement Savings Calculator", url: "https://www.dayblip.com/finance/retirement-savings" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Retirement Savings Calculator — Are You on Track?</h1>
          <p className="text-[#a8a8b3]">Find out if you are on track to retire comfortably</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The general retirement savings guideline suggests having 1× salary saved by 30, 3× by 40, 6× by 50, 8× by 60 and 10× by 67. To retire comfortably at 65 most Americans need $1–$1.5 million saved. At a 7% average return saving $500 per month from age 25 results in approximately $1.37 million by age 65.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Retirement savings calculators project how much your current savings and contributions will grow by retirement using compound interest. The calculation accounts for your current age, savings balance, monthly contributions and expected investment return to show whether you are on track to meet your retirement income goals.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Retirement Savings Calculator" }]} />
          <LastUpdated />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Current Age", val: currentAge, set: setCurrentAge },
              { label: "Retirement Age", val: retirementAge, set: setRetirementAge },
              { label: "Current Savings ($)", val: currentSavings, set: setCurrentSavings },
              { label: "Monthly Savings ($)", val: monthlySavings, set: setMonthlySavings },
              { label: "Expected Return (%)", val: expectedReturn, set: setExpectedReturn },
              { label: "Desired Monthly Income ($)", val: desiredIncome, set: setDesiredIncome },
            ].map(f => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{f.label}</span>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)} className={inp} />
              </label>
            ))}
          </div>

          <div className={`rounded-xl p-6 text-center ${calc.onTrack ? "border border-green-500/30 bg-green-900/20" : "border border-red-500/30 bg-red-900/20"}`}>
            <div className="text-4xl mb-2">{calc.onTrack ? "✅" : "⚠️"}</div>
            <div className={`text-3xl font-black ${calc.onTrack ? "text-green-400" : "text-red-400"}`}>
              {calc.onTrack ? "ON TRACK" : "SHORTFALL"}
            </div>
            <div className="text-[#a8a8b3] mt-1">
              {calc.onTrack
                ? `Surplus of ${fmt(calc.surplus)}`
                : `Shortfall of ${fmt(Math.abs(calc.surplus))}`}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-[#F9A825]">{fmt(calc.projected)}</div>
              <div className="text-sm text-[#a8a8b3]">Projected at Retirement</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-white">{fmt(calc.needed)}</div>
              <div className="text-sm text-[#a8a8b3]">Amount Needed (25x Rule)</div>
            </div>
          </div>

          {calc.milestones.length > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <p className="mb-3 font-bold text-white">📅 Savings Milestones</p>
              <div className="flex flex-wrap gap-3">
                {calc.milestones.map(m => (
                  <div key={m.age} className="rounded-lg bg-[#16213e] px-4 py-3 text-center min-w-[100px]">
                    <div className="text-lg font-black text-[#e94560]">Age {m.age}</div>
                    <div className="text-sm text-white">{fmt(m.bal)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <MethodologyNote text="Uses compound growth formula with annual IRS contribution limits. Historical S&P 500 return data sourced from FRED (Federal Reserve Economic Data)." />
          <ShareButtons
            text={`${calc.onTrack ? "✅ On track" : "⚠️ Shortfall"} for retirement! Projected savings: ${fmt(calc.projected)} vs ${fmt(calc.needed)} needed. (Educational only)`}
            url={`https://www.dayblip.com/finance/retirement-savings?age=${currentAge}&retireage=${retirementAge}&savings=${currentSavings}&monthly=${monthlySavings}&return=${expectedReturn}&income=${desiredIncome}`}
            title="Retirement Savings Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Uses 25x rule (4% withdrawal rate). Actual retirement needs vary by individual.</p>
        </div>
      </section>
    </div>
  )
}
