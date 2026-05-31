"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function FourOhOneKPage() {
  const [currentAge, setCurrentAge] = useState("35")
  const [retirementAge, setRetirementAge] = useState("65")
  const [balance, setBalance] = useState("50000")
  const [salary, setSalary] = useState("75000")
  const [yourPct, setYourPct] = useState("6")
  const [matchPct, setMatchPct] = useState("3")
  const [returnPct, setReturnPct] = useState("7")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("age")) setCurrentAge(p.get("age")!)
    if (p.get("retireage")) setRetirementAge(p.get("retireage")!)
    if (p.get("balance")) setBalance(p.get("balance")!)
    if (p.get("salary")) setSalary(p.get("salary")!)
    if (p.get("contrib")) setYourPct(p.get("contrib")!)
    if (p.get("match")) setMatchPct(p.get("match")!)
    if (p.get("return")) setReturnPct(p.get("return")!)
  }, [])

  const calc = useMemo(() => {
    const ca = parseFloat(currentAge) || 0
    const ra = parseFloat(retirementAge) || 0
    const bal = parseFloat(balance) || 0
    const sal = parseFloat(salary) || 0
    const yp = parseFloat(yourPct) || 0
    const mp = parseFloat(matchPct) || 0
    const ret = (parseFloat(returnPct) || 0) / 100 / 12
    const years = Math.max(0, ra - ca)
    const months = years * 12
    const yourAnnual = sal * yp / 100
    const matchAnnual = sal * Math.min(yp, mp) / 100
    const totalMonthly = (yourAnnual + matchAnnual) / 12
    const projected = ret === 0
      ? bal + totalMonthly * months
      : bal * Math.pow(1 + ret, months) + totalMonthly * ((Math.pow(1 + ret, months) - 1) / ret)
    const monthlyIncome = projected * 0.04 / 12
    const leavingMoney = yp < mp
    const scenarios = [3, 6, 10, 15].map(pct => {
      const m = (sal * (pct + Math.min(pct, mp)) / 100) / 12
      const b = ret === 0 ? bal + m * months : bal * Math.pow(1 + ret, months) + m * ((Math.pow(1 + ret, months) - 1) / ret)
      return { pct, balance: b, monthly: b * 0.04 / 12 }
    })
    return { yourAnnual, matchAnnual, projected, monthlyIncome, leavingMoney, scenarios }
  }, [currentAge, retirementAge, balance, salary, yourPct, matchPct, returnPct])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">401(k) Calculator</h1>
          <p className="text-[#a8a8b3]">Maximize your retirement savings with employer matching</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Current Age", val: currentAge, set: setCurrentAge },
              { label: "Retirement Age", val: retirementAge, set: setRetirementAge },
              { label: "Current 401(k) Balance ($)", val: balance, set: setBalance },
              { label: "Annual Salary ($)", val: salary, set: setSalary },
              { label: "Your Contribution (%)", val: yourPct, set: setYourPct },
              { label: "Employer Match (%)", val: matchPct, set: setMatchPct },
              { label: "Expected Annual Return (%)", val: returnPct, set: setReturnPct },
            ].map(f => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{f.label}</span>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)} className={inp} />
              </label>
            ))}
          </div>

          {calc.leavingMoney && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4">
              <p className="text-yellow-300 font-semibold">⚠️ You are leaving free money on the table!</p>
              <p className="text-[#a8a8b3] text-sm mt-1">Increase your contribution to {matchPct}% to get the full employer match.</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Your Annual Contribution", value: fmt(calc.yourAnnual), color: "#4FC3F7" },
              { label: "Employer Annual Match", value: fmt(calc.matchAnnual), color: "#4ade80" },
              { label: "Projected Balance", value: fmt(calc.projected), color: "#F9A825" },
              { label: "Monthly Income (4% Rule)", value: fmt(calc.monthlyIncome), color: "#e94560" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                <div className="text-2xl font-black" style={{ color: r.color }}>{r.value}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Contribution Scenarios</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460]">
                <th className="py-2 text-left text-[#a8a8b3]">Your %</th>
                <th className="py-2 text-right text-[#a8a8b3]">Balance at Retirement</th>
                <th className="py-2 text-right text-[#a8a8b3]">Monthly Income</th>
              </tr></thead>
              <tbody>{calc.scenarios.map(s => (
                <tr key={s.pct} className={`border-b border-[#0f3460]/50 ${s.pct === parseFloat(yourPct) ? "bg-[#e94560]/10" : ""}`}>
                  <td className="py-2 text-white">{s.pct}%</td>
                  <td className="py-2 text-right text-[#F9A825]">{fmt(s.balance)}</td>
                  <td className="py-2 text-right text-[#4ade80]">{fmt(s.monthly)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <ShareButtons
            text={`Investing ${yourPct}% of my $${salary} salary in 401k = ${fmt(calc.projected)} at retirement! (Educational only)`}
            url={`https://www.dayblip.com/finance/401k-calculator?age=${currentAge}&retireage=${retirementAge}&balance=${balance}&salary=${salary}&contrib=${yourPct}&match=${matchPct}&return=${returnPct}`}
            title="401(k) Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">401(k) contribution limits and employer match rules vary. Consult your plan documents and a financial advisor. For educational purposes only.</p>
        </div>
      </section>
    </div>
  )
}
