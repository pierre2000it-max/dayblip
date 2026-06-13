"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fvLump(pv: number, r: number, years: number): number {
  return pv * Math.pow(1 + r, years)
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational & entertainment purposes only.</strong> Not investment advice. Past S&P 500 returns do not guarantee future results. Consult a financial advisor.
  </div>
)

export default function CarUpgradePage() {
  const [wantStr,   setWant]    = useState("45000")
  const [practStr,  setPract]   = useState("25000")
  const [buyEvery,  setBuyEvery] = useState(5)
  const [calcYears, setCalcYrs] = useState(30)
  const [rate,      setRate]    = useState(10.5)
  const r = rate / 100

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("expensive")) setWant(p.get("expensive")!)
    if (p.get("practical")) setPract(p.get("practical")!)
    if (p.get("buyevery")) setBuyEvery(Number(p.get("buyevery")))
    if (p.get("years")) setCalcYrs(Number(p.get("years")))
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const calc = useMemo(() => {
    const want  = parseFloat(wantStr)  || 0
    const pract = parseFloat(practStr) || 0
    const diff  = Math.max(0, want - pract)
    const numCars  = Math.floor(calcYears / buyEvery)
    const totalExtra = diff * numCars

    // Each purchase: lump sum grows for remaining years
    let totalInvestValue = 0
    const purchases: { num: number; yearsGrows: number; value: number }[] = []
    for (let i = 0; i < numCars; i++) {
      const yearOfPurchase = i * buyEvery
      const yearsGrows     = calcYears - yearOfPurchase
      const value          = fvLump(diff, r, yearsGrows)
      totalInvestValue    += value
      purchases.push({ num: i + 1, yearsGrows, value })
    }

    return { diff, numCars, totalExtra, totalInvestValue, trueCost: totalExtra + totalInvestValue, purchases }
  }, [wantStr, practStr, buyEvery, calcYears, r])


  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Car Upgrade Calculator — True Cost of a Nicer Car</h1>
          <p className="text-[#a8a8b3]">What does driving a nicer car actually cost you in the long run?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Upgrading from a $25,000 car to a $45,000 car costs $20,000 more upfront. With financing at 7% over 5 years the total extra cost is $23,760. If that $20,000 was invested instead at 7% annual return it would be worth $55,676 in 15 years. The true cost of a car upgrade is almost always 2-3 times the price difference.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Car upgrade cost calculators show the true financial impact of choosing a more expensive vehicle by including higher loan payments, increased insurance premiums, higher fuel costs and the opportunity cost of the additional down payment. The real cost of upgrading cars is typically far higher than buyers realize.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Car you want ($)</span>
              <input type="number" step="1000" value={wantStr} onChange={e => setWant(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Practical alternative ($)</span>
              <input type="number" step="1000" value={practStr} onChange={e => setPract(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Buy new car every {buyEvery} years</span>
              <input type="range" min={2} max={10} value={buyEvery} onChange={e => setBuyEvery(Number(e.target.value))} className="mt-2 accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Calculate over {calcYears} years</span>
              <input type="range" min={20} max={40} value={calcYears} onChange={e => setCalcYrs(Number(e.target.value))} className="mt-2 accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Summary */}
          <div className="grid gap-3 md:grid-cols-3 text-center">
            {[
              { label: "Extra per car", value: fmt(calc.diff) },
              { label: `Cars in ${calcYears} years`, value: calc.numCars.toString() },
              { label: "Total extra spent", value: fmt(calc.totalExtra) },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-xl font-black text-white">{r.value}</div>
                <div className="text-sm text-[#a8a8b3]">{r.label}</div>
              </div>
            ))}
          </div>

          {/* BIG NUMBER */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">If the upgrade difference was invested each time:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.totalInvestValue)}</div>
            <p className="text-[#a8a8b3] mt-1">opportunity cost over {calcYears} years</p>
          </div>

          {/* Per purchase breakdown */}
          {calc.purchases.length > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h2 className="mb-3 font-bold text-white">📊 Investment Growth per Purchase</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#0f3460]">
                    <th className="py-2 text-left text-[#a8a8b3]">Purchase #</th>
                    <th className="py-2 text-right text-[#a8a8b3]">Invested</th>
                    <th className="py-2 text-right text-[#a8a8b3]">Years grows</th>
                    <th className="py-2 text-right text-[#a8a8b3]">Final value</th>
                  </tr></thead>
                  <tbody>{calc.purchases.map(p => (
                    <tr key={p.num} className="border-b border-[#0f3460]/50">
                      <td className="py-2 text-white">Car #{p.num}</td>
                      <td className="py-2 text-right text-[#a8a8b3]">{fmt(calc.diff)}</td>
                      <td className="py-2 text-right text-[#a8a8b3]">{p.yearsGrows}yr</td>
                      <td className="py-2 text-right text-[#e94560] font-bold">{fmt(p.value)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* True cost */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💸 True Total Cost of Upgrades</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Extra spent on upgrades</span><span className="text-white">{fmt(calc.totalExtra)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Opportunity cost (investment value)</span><span className="text-[#e94560]">{fmt(calc.totalInvestValue)}</span></div>
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">True total cost</span><span className="text-[#e94560]">{fmt(calc.trueCost)}</span>
              </div>
            </div>
          </div>

          <ShareButtons
            text={`Car upgrades over ${calcYears} years cost ${fmt(calc.totalInvestValue)} in opportunity cost! (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/car-upgrade?expensive=${wantStr}&practical=${practStr}&buyevery=${buyEvery}&years=${calcYears}&rate=${rate}`}
            title="Car Upgrade Opportunity Cost Calculator"
          />          <RelatedTools tools={[
            { emoji: "🚗", title: "Car Affordability", desc: "Can you afford it?", href: "/finance/car-affordability" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
            { emoji: "📊", title: "Budget Calculator", desc: "Build a monthly budget", href: "/finance/budget-calculator" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
          ]} />

          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
