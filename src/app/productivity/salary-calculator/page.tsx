"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

function calcFederalTax(annual: number, filing: string): number {
  const brackets = filing === "married"
    ? [[23200, 0.10], [89450, 0.12], [190750, 0.22], [364200, 0.24], [Infinity, 0.32]]
    : [[11600, 0.10], [44725, 0.12], [95375, 0.22], [182050, 0.24], [Infinity, 0.32]]
  let tax = 0
  let prev = 0
  for (const [limit, rate] of brackets as [number, number][]) {
    if (annual <= prev) break
    const taxable = Math.min(annual, limit) - prev
    tax += taxable * rate
    prev = limit
  }
  return tax
}

const PERIODS = [
  { key: "hour", label: "Per Hour" },
  { key: "day", label: "Per Day" },
  { key: "week", label: "Per Week" },
  { key: "biweek", label: "Bi-Weekly" },
  { key: "month", label: "Per Month" },
  { key: "year", label: "Per Year" },
]

export default function SalaryCalculatorPage() {
  const [amount, setAmount] = useState("25")
  const [per, setPer] = useState("hour")
  const [hoursPerDay, setHoursPerDay] = useState("8")
  const [daysPerWeek, setDaysPerWeek] = useState("5")
  const [weeksPerYear, setWeeksPerYear] = useState("52")
  const [filing, setFiling] = useState("single")
  const [raisePct, setRaisePct] = useState("5")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("amount")) setAmount(p.get("amount")!)
    if (p.get("per")) setPer(p.get("per")!)
    if (p.get("filing")) setFiling(p.get("filing")!)
  }, [])

  const calc = useMemo(() => {
    const a = parseFloat(amount) || 0
    const hd = parseFloat(hoursPerDay) || 8
    const dw = parseFloat(daysPerWeek) || 5
    const wy = parseFloat(weeksPerYear) || 52
    let annual = 0
    switch (per) {
      case "hour": annual = a * hd * dw * wy; break
      case "day": annual = a * dw * wy; break
      case "week": annual = a * wy; break
      case "biweek": annual = a * 26; break
      case "month": annual = a * 12; break
      case "year": annual = a; break
    }
    const tax = calcFederalTax(annual, filing)
    const effectiveRate = annual > 0 ? (tax / annual * 100).toFixed(1) : "0"
    const afterTaxAnnual = annual - tax
    const hoursPerYear = hd * dw * wy
    return {
      hourly: annual / hoursPerYear,
      daily: annual / (dw * wy),
      weekly: annual / wy,
      biweekly: annual / 26,
      monthly: annual / 12,
      annual,
      tax,
      effectiveRate,
      afterTaxAnnual,
      afterTaxMonthly: afterTaxAnnual / 12,
      raiseAnnual: annual * (1 + (parseFloat(raisePct) || 0) / 100),
      raiseDollar: annual * (parseFloat(raisePct) || 0) / 100,
    }
  }, [amount, per, hoursPerDay, daysPerWeek, weeksPerYear, filing, raisePct])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const sel = inp

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Salary Calculator — Convert Between Hourly Annual and Monthly Pay</h1>
          <p className="text-[#a8a8b3]">Convert your salary between any pay period</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A $75,000 annual salary equals $6,250 per month, $1,442 per week, $288 per day and $36.06 per hour based on a standard 40-hour work week and 52 weeks per year. A $20 hourly wage equals $41,600 per year. A $5,000 monthly salary equals $60,000 per year. These conversions assume full-time employment with no unpaid time off.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Salary conversion calculators help compare job offers expressed in different pay formats — hourly, weekly, biweekly, monthly or annually. They also help freelancers and contractors compare their rates to equivalent salaried positions. All conversions are gross figures before tax deductions.</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Amount ($)</span>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Per</span>
              <select value={per} onChange={e => setPer(e.target.value)} className={sel}>
                {PERIODS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Hours per Day</span>
              <input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Days per Week</span>
              <input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Weeks per Year</span>
              <input type="number" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Filing Status</span>
              <select value={filing} onChange={e => setFiling(e.target.value)} className={sel}>
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
              </select></label>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💰 All Pay Periods (Before Tax)</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460]">
                <th className="py-2 text-left text-[#a8a8b3]">Period</th>
                <th className="py-2 text-right text-[#a8a8b3]">Gross</th>
                <th className="py-2 text-right text-[#a8a8b3]">Est. After Tax</th>
              </tr></thead>
              <tbody>
                {[
                  { label: "Hourly", gross: calc.hourly, net: calc.afterTaxAnnual / (parseFloat(hoursPerDay) * parseFloat(daysPerWeek) * parseFloat(weeksPerYear)) },
                  { label: "Daily", gross: calc.daily, net: calc.afterTaxAnnual / (parseFloat(daysPerWeek) * parseFloat(weeksPerYear)) },
                  { label: "Weekly", gross: calc.weekly, net: calc.afterTaxAnnual / parseFloat(weeksPerYear) },
                  { label: "Bi-Weekly", gross: calc.biweekly, net: calc.afterTaxAnnual / 26 },
                  { label: "Monthly", gross: calc.monthly, net: calc.afterTaxMonthly },
                  { label: "Annual", gross: calc.annual, net: calc.afterTaxAnnual },
                ].map(r => (
                  <tr key={r.label} className={`border-b border-[#0f3460]/50 ${r.label === PERIODS.find(p => p.key === per)?.label ? "bg-[#e94560]/10" : ""}`}>
                    <td className="py-2 text-white">{r.label}</td>
                    <td className="py-2 text-right text-[#F9A825]">{fmt(r.gross)}</td>
                    <td className="py-2 text-right text-[#4ade80]">{fmt(r.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs text-[#a8a8b3]">Est. federal tax: {fmt(calc.tax)} ({calc.effectiveRate}% effective rate)</div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📈 Raise Calculator</h2>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-[#a8a8b3]">Raise percentage (%)</span>
              <input type="number" step="0.1" value={raisePct} onChange={e => setRaisePct(e.target.value)} className={inp} />
            </label>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-center">
              <div><div className="font-bold text-[#F9A825]">{fmt(calc.raiseAnnual)}</div><div className="text-[#a8a8b3]">New Annual</div></div>
              <div><div className="font-bold text-[#4ade80]">+{fmt(calc.raiseDollar)}</div><div className="text-[#a8a8b3]">Yearly Increase</div></div>
              <div><div className="font-bold text-white">+{fmt(calc.raiseDollar / 12)}</div><div className="text-[#a8a8b3]">Monthly Increase</div></div>
            </div>
          </div>

          <ShareButtons
            text={`My ${per}-based ${amount} salary = ${fmt(calc.hourly)}/hour or ${fmt(calc.monthly)}/month. Take-home: ${fmt(calc.afterTaxAnnual)}/year. (Educational only)`}
            url={`https://www.dayblip.com/productivity/salary-calculator?amount=${amount}&per=${per}&filing=${filing}`}
            title="Salary Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Tax estimates are approximate federal only and do not include state taxes, FICA, deductions or credits. Consult a tax professional for your actual tax liability.</p>
        </div>
      </section>
    </div>
  )
}
