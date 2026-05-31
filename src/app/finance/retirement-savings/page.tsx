"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

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
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Retirement Savings Calculator</h1>
          <p className="text-[#a8a8b3]">Find out if you are on track to retire comfortably</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
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
