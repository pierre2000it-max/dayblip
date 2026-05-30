"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function addMonths(months: number) {
  const d = new Date(2025, 4, 1)
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}
function simulate(balance: number, rate: number, payment: number) {
  let bal = balance
  let totalInterest = 0
  let months = 0
  const MAX = 600
  while (bal > 0 && months < MAX) {
    const interest = bal * rate / 12
    totalInterest += interest
    bal += interest - payment
    months++
    if (bal <= 0) { bal = 0 }
  }
  return { months, totalInterest }
}

export default function StudentLoanPage() {
  const [balance, setBalance] = useState("35000")
  const [rate, setRate] = useState("6.5")
  const [payment, setPayment] = useState("400")
  const [extra, setExtra] = useState("100")

  const calc = useMemo(() => {
    const b = parseFloat(balance) || 0
    const r = (parseFloat(rate) || 0) / 100
    const p = parseFloat(payment) || 0
    const e = parseFloat(extra) || 0
    const standard = simulate(b, r, p)
    const withExtra = simulate(b, r, p + e)
    return {
      standard,
      withExtra,
      monthsSaved: standard.months - withExtra.months,
      interestSaved: standard.totalInterest - withExtra.totalInterest,
    }
  }, [balance, rate, payment, extra])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Student Loan Payoff Calculator</h1>
          <p className="text-[#a8a8b3]">See how extra payments can save you thousands</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Total Balance ($)</span>
              <input type="number" value={balance} onChange={e => setBalance(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Interest Rate (%)</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly Payment ($)</span>
              <input type="number" value={payment} onChange={e => setPayment(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Extra Monthly Payment ($)</span>
              <input type="number" value={extra} onChange={e => setExtra(e.target.value)} className={inp} /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h3 className="font-bold text-[#a8a8b3] mb-3">Standard Payments</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Payoff Date</span><span className="text-white">{addMonths(calc.standard.months)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Total Interest</span><span className="text-[#e94560]">{fmt(calc.standard.totalInterest)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Months</span><span className="text-white">{calc.standard.months}</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-5">
              <h3 className="font-bold text-green-400 mb-3">With Extra Payment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Payoff Date</span><span className="text-white">{addMonths(calc.withExtra.months)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Total Interest</span><span className="text-green-400">{fmt(calc.withExtra.totalInterest)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Months</span><span className="text-white">{calc.withExtra.months}</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-5 text-center">
            <div className="text-3xl font-black text-[#F9A825]">You save {fmt(calc.interestSaved)}</div>
            <div className="text-[#a8a8b3] mt-1">and pay off {calc.monthsSaved} months sooner</div>
          </div>

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📚 Income-Driven Repayment Plans</h2>
            <ul className="text-sm text-[#a8a8b3] space-y-2">
              <li><span className="text-white font-semibold">SAVE Plan:</span> Caps payments at 5% of discretionary income for undergrad loans. Forgiveness after 10–20 years.</li>
              <li><span className="text-white font-semibold">PAYE:</span> 10% of discretionary income. Forgiveness after 20 years.</li>
              <li><span className="text-white font-semibold">IBR:</span> 10–15% of discretionary income depending on when you borrowed. 20–25 year forgiveness.</li>
              <li><span className="text-white font-semibold">ICR:</span> 20% of discretionary income or fixed 12-year payment. 25-year forgiveness.</li>
              <li>Visit <span className="text-[#4FC3F7]">studentaid.gov</span> to apply and get official estimates.</li>
            </ul>
          </div>

          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Loan terms vary. Visit studentaid.gov for official information.</p>
        </div>
      </section>
    </div>
  )
}
