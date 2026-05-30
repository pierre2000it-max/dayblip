"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmtDec(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function BreakEvenPage() {
  const [fixedCosts, setFixedCosts] = useState("5000")
  const [variableCost, setVariableCost] = useState("25")
  const [sellingPrice, setSellingPrice] = useState("75")

  const calc = useMemo(() => {
    const fc = parseFloat(fixedCosts) || 0
    const vc = parseFloat(variableCost) || 0
    const sp = parseFloat(sellingPrice) || 1
    const cm = sp - vc  // contribution margin per unit
    if (cm <= 0) return null
    const beUnits = Math.ceil(fc / cm)
    const beRevenue = beUnits * sp
    const grossMarginPct = (cm / sp * 100).toFixed(1)

    const scenarios = [0.5, 1, 1.5, 2].map(mult => {
      const units = Math.round(beUnits * mult)
      const revenue = units * sp
      const costs = fc + units * vc
      const profit = revenue - costs
      return { units, revenue, costs, profit, mult }
    })

    const daysToBreakEven = (unitsPerDay: number) => unitsPerDay > 0 ? Math.ceil(beUnits / unitsPerDay) : null

    // Price sensitivity: +10%
    const newPrice = sp * 1.10
    const newCM = newPrice - vc
    const newBE = newCM > 0 ? Math.ceil(fc / newCM) : 0

    return { beUnits, beRevenue, cm, grossMarginPct, scenarios, daysToBreakEven, newBE, newPrice, fc, vc, sp }
  }, [fixedCosts, variableCost, sellingPrice])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Break Even Calculator</h1>
          <p className="text-[#a8a8b3]">Find out when your business or product becomes profitable</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Fixed Costs/Month ($)</span>
              <input type="number" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} className={inp} />
              <span className="text-xs text-[#a8a8b3]">Rent, salaries, subscriptions</span></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Variable Cost/Unit ($)</span>
              <input type="number" step="0.01" value={variableCost} onChange={e => setVariableCost(e.target.value)} className={inp} />
              <span className="text-xs text-[#a8a8b3]">Materials, shipping, processing</span></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Selling Price/Unit ($)</span>
              <input type="number" step="0.01" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} className={inp} /></label>
          </div>

          {!calc && (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
              <p className="text-[#e94560]">⚠️ Selling price must be higher than variable cost to reach break even.</p>
            </div>
          )}

          {calc && (
            <>
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] mb-1">You break even at</p>
                <div className="text-5xl font-black text-[#F9A825]">{calc.beUnits.toLocaleString()} units</div>
                <div className="text-[#a8a8b3] mt-1">= {fmt(calc.beRevenue)} in monthly revenue</div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div><div className="font-bold text-white">{fmtDec(calc.cm)}</div><div className="text-[#a8a8b3]">Gross margin/unit</div></div>
                  <div><div className="font-bold text-white">{calc.grossMarginPct}%</div><div className="text-[#a8a8b3]">Gross margin %</div></div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="mb-3 font-bold text-white">📊 Profit Scenarios</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-[#0f3460]">
                      <th className="py-2 text-left text-[#a8a8b3]">Units Sold</th>
                      <th className="py-2 text-right text-[#a8a8b3]">Revenue</th>
                      <th className="py-2 text-right text-[#a8a8b3]">Total Costs</th>
                      <th className="py-2 text-right text-[#a8a8b3]">Profit/Loss</th>
                    </tr></thead>
                    <tbody>{calc.scenarios.map(s => (
                      <tr key={s.mult} className={`border-b border-[#0f3460]/50 ${s.mult === 1 ? "bg-[#F9A825]/10" : ""}`}>
                        <td className="py-2 text-white">{s.units.toLocaleString()}</td>
                        <td className="py-2 text-right text-[#a8a8b3]">{fmt(s.revenue)}</td>
                        <td className="py-2 text-right text-[#a8a8b3]">{fmt(s.costs)}</td>
                        <td className={`py-2 text-right font-bold ${s.profit > 0 ? "text-[#4ade80]" : s.profit === 0 ? "text-[#F9A825]" : "text-[#e94560]"}`}>
                          {s.profit > 0 ? "+" : ""}{fmt(s.profit)} {s.profit > 0 ? "✅" : s.profit === 0 ? "⚖️" : "❌"}
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="mb-3 font-bold text-white">📅 Days to Break Even</h2>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  {[1, 5, 10].map(upd => (
                    <div key={upd} className="rounded-lg bg-[#16213e] p-3">
                      <div className="font-black text-[#4FC3F7]">{calc.daysToBreakEven(upd)} days</div>
                      <div className="text-[#a8a8b3]">{upd} unit{upd > 1 ? "s" : ""}/day</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-4 text-sm">
                <span className="text-[#4FC3F7] font-semibold">📈 Price Sensitivity: </span>
                <span className="text-[#a8a8b3]">If you raise price 10% to </span>
                <span className="text-white font-bold">{fmtDec(calc.newPrice)}</span>
                <span className="text-[#a8a8b3]">, new break even: </span>
                <span className="text-white font-bold">{calc.newBE.toLocaleString()} units</span>
                <span className="text-[#a8a8b3]"> (saves {(calc.beUnits - calc.newBE).toLocaleString()} units)</span>
              </div>
            </>
          )}

          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Break-even analysis is a simplification. Actual business results vary based on many factors.</p>
        </div>
      </section>
    </div>
  )
}
