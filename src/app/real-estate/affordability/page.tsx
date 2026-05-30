"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function AffordabilityPage() {
  const [income, setIncome] = useState("80000")
  const [monthlyDebts, setMonthlyDebts] = useState("300")
  const [downPayment, setDownPayment] = useState("40000")
  const [creditScore, setCreditScore] = useState("760+")
  const [mortgageRate, setMortgageRate] = useState("7")

  const calc = useMemo(() => {
    const annInc = parseFloat(income) || 0
    const monthly = annInc / 12
    const debts = parseFloat(monthlyDebts) || 0
    const dp = parseFloat(downPayment) || 0
    const rate = (parseFloat(mortgageRate) || 0) / 100 / 12

    const maxHousingByFront = monthly * 0.28
    const maxTotalDebt = monthly * 0.36
    const maxHousingByBack = Math.max(0, maxTotalDebt - debts)
    const effectiveMaxHousing = Math.min(maxHousingByFront, maxHousingByBack)

    // Estimate max loan from max housing payment (30yr mortgage, minus est tax+ins)
    // effectiveMaxHousing ≈ PI + tax(~0.1%/mo) + ins(~0.04%/mo)
    // PI ≈ effectiveMaxHousing * 0.86 (rough)
    const maxPI = effectiveMaxHousing * 0.86
    const n = 360
    const maxLoan = rate > 0
      ? maxPI * ((1 - Math.pow(1 + rate, -n)) / rate)
      : maxPI * n
    const maxHome = maxLoan + dp

    const estMonthlyTax = maxHome * 0.01 / 12
    const estMonthlyIns = maxHome * 0.005 / 12
    const estPI = rate > 0 ? maxLoan * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1) : maxLoan / n

    return {
      maxHome: Math.max(0, maxHome),
      maxHousingByFront,
      maxHousingByBack,
      effectiveMaxHousing,
      estPI,
      estMonthlyTax,
      estMonthlyIns,
      totalMonthly: estPI + estMonthlyTax + estMonthlyIns,
      dpPct: maxHome > 0 ? (dp / maxHome * 100).toFixed(1) : "0",
    }
  }, [income, monthlyDebts, downPayment, mortgageRate])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const sel = inp

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Home Affordability Calculator</h1>
          <p className="text-[#a8a8b3]">Find out how much home you can afford using the 28/36 rule</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Income ($)</span>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly Debt Payments ($)</span>
              <input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Down Payment ($)</span>
              <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Credit Score Range</span>
              <select value={creditScore} onChange={e => setCreditScore(e.target.value)} className={sel}>
                {["760+", "740–759", "720–739", "700–719", "680–699", "Below 680"].map(s => <option key={s}>{s}</option>)}
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Mortgage Rate (%)</span>
              <input type="number" step="0.1" value={mortgageRate} onChange={e => setMortgageRate(e.target.value)} className={inp} /></label>
          </div>

          <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-sm text-[#a8a8b3] mb-1">Maximum Home Price</div>
            <div className="text-5xl font-black text-[#F9A825]">{fmt(calc.maxHome)}</div>
            <div className="text-[#a8a8b3] text-sm mt-1">Down payment: {calc.dpPct}%</div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💸 Monthly Payment Breakdown</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Principal & Interest</span><span className="text-white">{fmt(calc.estPI)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Property Tax (est. 1%)</span><span className="text-white">{fmt(calc.estMonthlyTax)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Insurance (est. 0.5%)</span><span className="text-white">{fmt(calc.estMonthlyIns)}</span></div>
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">Total Monthly</span><span className="text-[#e94560]">{fmt(calc.totalMonthly)}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-[#a8a8b3] space-y-1">
              <div>Front-end limit (28%): {fmt(calc.maxHousingByFront)}/mo</div>
              <div>Back-end limit (36%): {fmt(calc.maxHousingByBack)}/mo</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">📊 Historical Context</h2>
            <p className="text-sm text-[#a8a8b3]">In 1990, the median home was <span className="text-white">$149,800</span> and median income was <span className="text-white">$29,943</span> — a ratio of <span className="text-[#F9A825]">5x</span>. Today the median home is <span className="text-white">$420,000</span> with median income ~<span className="text-white">$58,000</span> — a ratio of <span className="text-[#e94560]">7.2x</span>. Affordability has declined significantly.</p>
          </div>

          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. The 28/36 rule is a guideline; lenders use various criteria. Consult a mortgage professional.</p>
        </div>
      </section>
    </div>
  )
}
