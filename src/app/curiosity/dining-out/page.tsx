"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fv(monthly: number, r: number, years: number): number {
  if (monthly <= 0 || years <= 0) return 0
  const mr = r / 12; const n = years * 12
  return mr === 0 ? monthly * n : monthly * ((Math.pow(1 + mr, n) - 1) / mr)
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational & entertainment purposes only.</strong> Not investment advice. Past S&P 500 returns do not guarantee future results. Consult a financial advisor.
  </div>
)

export default function DiningOutPage() {
  const [timesPerWeek, setTimesPerWeek] = useState(4)
  const [mealCostStr, setMealCost]      = useState("25")
  const [homeCostStr, setHomeCost]      = useState("8")
  const [years, setYears]               = useState(25)
  const [rate, setRate]                 = useState(10.5)
  const r = rate / 100

  const calc = useMemo(() => {
    const meal = parseFloat(mealCostStr) || 0
    const home = parseFloat(homeCostStr) || 0
    const diff = Math.max(0, meal - home)
    const diningMonthly = (meal * timesPerWeek * 52) / 12
    const homeMonthly   = (home * timesPerWeek * 52) / 12
    const diffMonthly   = (diff * timesPerWeek * 52) / 12
    const diffAnnual    = diffMonthly * 12
    const invested      = fv(diffMonthly, r, years)
    return { diningMonthly, homeMonthly, diffMonthly, diffAnnual, invested }
  }, [timesPerWeek, mealCostStr, homeCostStr, years, r])


  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Dining Out Opportunity Cost</h1>
          <p className="text-[#a8a8b3]">What would you have if you cooked more and invested the difference?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Times dining out per week: {timesPerWeek}</span>
              <input type="range" min={1} max={14} value={timesPerWeek} onChange={e => setTimesPerWeek(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Average meal cost ($)</span>
                <input type="number" step="0.5" value={mealCostStr} onChange={e => setMealCost(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Home cooking equivalent ($)</span>
                <input type="number" step="0.5" value={homeCostStr} onChange={e => setHomeCost(e.target.value)} className={inp} /></label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years to invest: {years}</span>
              <input type="range" min={10} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Summary table */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Spending Breakdown</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460]">
                <th className="py-2 text-left text-[#a8a8b3]">Category</th>
                <th className="py-2 text-right text-[#a8a8b3]">Monthly</th>
                <th className="py-2 text-right text-[#a8a8b3]">Annual</th>
                <th className="py-2 text-right text-[#a8a8b3]">{years}yr Invested</th>
              </tr></thead>
              <tbody>
                {[
                  { label: "Dining out", mo: calc.diningMonthly, inv: fv(calc.diningMonthly, r, years) },
                  { label: "Home cooking equiv", mo: calc.homeMonthly, inv: null },
                  { label: "💡 Difference", mo: calc.diffMonthly, inv: calc.invested, bold: true },
                ].map(row => (
                  <tr key={row.label} className={`border-b border-[#0f3460]/50 ${row.bold ? "bg-[#e94560]/5" : ""}`}>
                    <td className={`py-2 ${row.bold ? "text-white font-bold" : "text-[#a8a8b3]"}`}>{row.label}</td>
                    <td className="py-2 text-right text-white">{fmt(row.mo)}</td>
                    <td className="py-2 text-right text-[#a8a8b3]">{fmt(row.mo * 12)}</td>
                    <td className="py-2 text-right text-[#e94560] font-bold">{row.inv !== null ? fmt(row.inv) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BIG NUMBER */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">If the difference ({fmt(calc.diffMonthly)}/mo) was invested for {years} years:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.invested)}</div>
          </div>

          {/* Balance view */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">⚖️ Dining Out Has Real Value</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-[#a8a8b3]">
              {["✅ Time saved","✅ Social experiences","✅ No cooking or cleanup","✅ Trying new cuisines"].map(v => (
                <div key={v}>{v}</div>
              ))}
            </div>
            <p className="text-xs text-[#a8a8b3] mt-3">The math just shows the tradeoff. There is nothing wrong with dining out — it is about awareness.</p>
          </div>

          <ShareButtons
            text={`Dining out is costing me ${fmt(calc.diffAnnual)}/year. Invested for ${years} years = ${fmt(calc.invested)}! (Educational purposes only)`}
            url="https://dayblip.com/curiosity/dining-out"
            title="Dining Out Opportunity Cost Calculator"
          />
          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
