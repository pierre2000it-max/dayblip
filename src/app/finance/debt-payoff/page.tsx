"use client"
import { useState, useMemo, useCallback } from "react"

interface Debt { id: number; name: string; balance: string; rate: string; minPayment: string }

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function addMonths(months: number) {
  const d = new Date(2025, 4, 1) // fixed reference date for determinism
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

let _nextId = 2

export default function DebtPayoffPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 0, name: "Credit Card", balance: "5000", rate: "22", minPayment: "100" },
    { id: 1, name: "Car Loan", balance: "12000", rate: "6", minPayment: "250" },
  ])
  const [extra, setExtra] = useState("200")
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche")

  const update = useCallback((id: number, field: keyof Debt, value: string) =>
    setDebts(ds => ds.map(d => d.id === id ? { ...d, [field]: value } : d)), [])

  const addDebt = () => {
    if (debts.length < 5) {
      const newId = _nextId++
      setDebts(ds => [...ds, { id: newId, name: "New Debt", balance: "0", rate: "0", minPayment: "0" }])
    }
  }

  const calc = useMemo(() => {
    const parsed = debts.map(d => ({
      name: d.name,
      balance: parseFloat(d.balance) || 0,
      rate: (parseFloat(d.rate) || 0) / 100 / 12,
      min: parseFloat(d.minPayment) || 0,
    })).filter(d => d.balance > 0)
    if (!parsed.length) return null
    const extraPmt = parseFloat(extra) || 0
    const sorted = [...parsed].sort((a, b) =>
      strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance
    )
    const bals = sorted.map(d => d.balance)
    let month = 0
    let totalInterest = 0
    const payoffMonths: number[] = new Array(sorted.length).fill(0)
    const MAX = 600
    while (bals.some(b => b > 0) && month < MAX) {
      month++
      let extraLeft = extraPmt
      for (let i = 0; i < sorted.length; i++) {
        if (bals[i] <= 0) continue
        const interest = bals[i] * sorted[i].rate
        totalInterest += interest
        bals[i] += interest
        const pmt = Math.min(bals[i], sorted[i].min)
        bals[i] -= pmt
        if (bals[i] < 0) bals[i] = 0
      }
      for (let i = 0; i < sorted.length; i++) {
        if (bals[i] <= 0) continue
        const pay = Math.min(bals[i], extraLeft)
        bals[i] -= pay
        extraLeft -= pay
        if (bals[i] <= 0) { bals[i] = 0; if (!payoffMonths[i]) payoffMonths[i] = month }
        if (extraLeft <= 0) break
      }
    }
    const minOnlyInterest = parsed.reduce((acc, d) => {
      let bal = d.balance; let mo = 0; let int = 0
      while (bal > 0 && mo < MAX) {
        const i = bal * d.rate; int += i; bal += i - d.min; mo++
        if (bal < 0) bal = 0
      }
      return acc + int
    }, 0)
    return {
      months: month,
      debtFreeDate: addMonths(month),
      totalInterest,
      interestSaved: Math.max(0, minOnlyInterest - totalInterest),
      order: sorted.map((d, i) => ({ name: d.name, months: payoffMonths[i] || month })),
    }
  }, [debts, extra, strategy])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none w-full"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Debt Payoff Calculator</h1>
          <p className="text-[#a8a8b3]">Choose your strategy and become debt free faster</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          <div className="space-y-3">
            {debts.map(d => (
              <div key={d.id} className="grid grid-cols-2 gap-2 md:grid-cols-5 items-end rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <label className="flex flex-col gap-1 col-span-2 md:col-span-1">
                  <span className="text-xs text-[#a8a8b3]">Debt Name</span>
                  <input value={d.name} onChange={e => update(d.id, "name", e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#a8a8b3]">Balance ($)</span>
                  <input type="number" value={d.balance} onChange={e => update(d.id, "balance", e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#a8a8b3]">Rate (%)</span>
                  <input type="number" step="0.1" value={d.rate} onChange={e => update(d.id, "rate", e.target.value)} className={inp} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#a8a8b3]">Min Payment ($)</span>
                  <input type="number" value={d.minPayment} onChange={e => update(d.id, "minPayment", e.target.value)} className={inp} />
                </label>
                <button onClick={() => setDebts(ds => ds.filter(x => x.id !== d.id))} className="text-[#e94560] text-sm hover:opacity-70 text-left md:text-center">Remove</button>
              </div>
            ))}
            {debts.length < 5 && (
              <button onClick={addDebt} className="rounded-lg border border-[#e94560]/50 px-4 py-2 text-[#e94560] hover:bg-[#e94560]/10 text-sm">+ Add Debt</button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Extra Monthly Payment ($)</span>
              <input type="number" value={extra} onChange={e => setExtra(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Strategy</span>
              <div className="flex gap-2">
                {(["avalanche", "snowball"] as const).map(s => (
                  <button key={s} onClick={() => setStrategy(s)}
                    className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${strategy === s ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {s === "avalanche" ? "🏔️ Avalanche" : "⛄ Snowball"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {calc && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-5 text-center">
                  <div className="text-2xl font-black text-green-400">{calc.months} months</div>
                  <div className="text-sm text-[#a8a8b3]">Debt Free In</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">{calc.debtFreeDate}</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-[#e94560]">{fmt(calc.totalInterest)}</div>
                  <div className="text-sm text-[#a8a8b3]">Total Interest</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-[#F9A825]">{fmt(calc.interestSaved)}</div>
                  <div className="text-sm text-[#a8a8b3]">Interest Saved</div>
                </div>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <p className="font-bold text-white mb-3">📋 Payoff Order ({strategy})</p>
                {calc.order.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-3 py-2 border-b border-[#0f3460]/50 last:border-0">
                    <span className="text-[#e94560] font-black w-8">#{i + 1}</span>
                    <span className="text-white flex-1">{d.name}</span>
                    <span className="text-[#a8a8b3] text-sm">{d.months} months</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Results are estimates.</p>
        </div>
      </section>
    </div>
  )
}
