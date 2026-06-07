"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fv(monthly: number, r: number, years: number): number {
  if (monthly <= 0) return 0
  const mr = r / 12; const n = years * 12
  return mr === 0 ? monthly * n : monthly * ((Math.pow(1 + mr, n) - 1) / mr)
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational & entertainment purposes only.</strong> Not investment advice. Past S&P 500 returns do not guarantee future results. Consult a financial advisor.
  </div>
)

export default function LatteFactorPage() {
  const [costStr, setCostStr] = useState("5.50")
  const [daysPerWeek, setDaysPerWeek] = useState(5)
  const [years, setYears] = useState(30)
  const [rate, setRate] = useState(10.5)
  const cost = parseFloat(costStr) || 0
  const r    = rate / 100

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("cost")) setCostStr(p.get("cost")!)
    if (p.get("days")) setDaysPerWeek(Number(p.get("days")))
    if (p.get("years")) setYears(Number(p.get("years")))
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const calc = useMemo(() => {
    const perDay     = cost
    const perMonth   = (cost * daysPerWeek * 52) / 12
    const perYear    = cost * daysPerWeek * 52
    const totalSpent = perYear * years
    const invested   = fv(perMonth, r, years)
    const oppCost    = invested - totalSpent
    const multiplier = totalSpent > 0 ? invested / totalSpent : 0
    const retYears   = invested / 50000
    return { perDay, perMonth, perYear, totalSpent, invested, oppCost, multiplier, retYears }
  }, [cost, daysPerWeek, years, r])


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Latte Factor Calculator — Your Daily Coffee&apos;s Hidden Long-Term Cost</h1>
          <p className="text-[#a8a8b3]">What would your daily coffee be worth if invested instead?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Spending $5.50 on a daily coffee costs $2,007 per year. Over 30 years that same money invested at 7% annual return grows to $227,000. The latte factor concept shows how small daily spending habits compound dramatically over decades. Cutting one $5 daily habit and investing it from age 25 adds approximately $150,000 by retirement.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The latte factor is a personal finance concept popularized by David Bach that illustrates how small recurring daily expenses compound into significant sums over decades. This calculator shows the exact opportunity cost of any daily spending habit over your chosen time period.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Coffee cost per day</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {["3.00","5.50","7.00","10.00"].map(v => (
                  <button key={v} onClick={() => setCostStr(v)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${costStr === v ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    ${v}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#a8a8b3]">$</span>
                <input type="number" step="0.25" value={costStr} onChange={e => setCostStr(e.target.value)}
                  className="w-32 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
                <span className="text-[#a8a8b3]">per day</span>
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Days per week: {daysPerWeek}</span>
              <input type="range" min={1} max={7} value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years to invest: {years}</span>
              <input type="range" min={10} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Spend summary */}
          <div className="grid gap-3 md:grid-cols-4 text-center">
            {[
              { label: "Per day", value: `$${calc.perDay.toFixed(2)}` },
              { label: "Per month", value: fmt(calc.perMonth) },
              { label: "Per year", value: fmt(calc.perYear) },
              { label: `${years}yr total`, value: fmt(calc.totalSpent) },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                <div className="font-black text-white">{r.value}</div>
                <div className="text-xs text-[#a8a8b3]">{r.label}</div>
              </div>
            ))}
          </div>

          {/* BIG NUMBER */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">If that {fmt(calc.perMonth)}/month was invested instead for {years} years:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.invested)}</div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div><div className="font-bold text-[#e94560]">{fmt(calc.totalSpent)}</div><div className="text-[#a8a8b3]">Coffee spent</div></div>
              <div><div className="font-bold text-[#4ade80]">{fmt(calc.oppCost)}</div><div className="text-[#a8a8b3]">Opportunity cost</div></div>
              <div><div className="font-bold text-[#F9A825]">{calc.multiplier.toFixed(1)}x</div><div className="text-[#a8a8b3]">Multiplier</div></div>
            </div>
            <p className="text-[#a8a8b3] text-sm mt-3">{fmt(calc.invested)} could fund <span className="text-white font-bold">{calc.retYears.toFixed(1)} years</span> of retirement at $50,000/year</p>
          </div>

          {/* Balance view */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h3 className="font-bold text-white mb-2">☕ Keep the coffee</h3>
              <ul className="text-sm text-[#a8a8b3] space-y-1">
                <li>✅ Daily joy and ritual</li>
                <li>✅ Productivity and focus</li>
                <li>✅ Social connection</li>
                <li className="text-[#e94560]">Cost: {fmt(calc.totalSpent)} over {years} years</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h3 className="font-bold text-white mb-2">📈 Invest instead</h3>
              <ul className="text-sm text-[#a8a8b3] space-y-1">
                <li>✅ Financial freedom sooner</li>
                <li>✅ Compound growth</li>
                <li>✅ Future security</li>
                <li className="text-[#4ade80]">Gain: {fmt(calc.invested)} over {years} years</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5 text-sm text-[#a8a8b3]">
            <strong className="text-white">About the Latte Factor:</strong> This concept was popularized by David Bach in <em>The Automatic Millionaire</em>.
            The idea: small daily expenses add up to large lifetime opportunity costs. The choice is yours — this calculator just shows the math.
          </div>

          <ShareButtons
            text={`My daily $${cost.toFixed(2)} coffee habit could be worth ${fmt(calc.invested)} if invested for ${years} years! (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/latte-factor?cost=${costStr}&days=${daysPerWeek}&years=${years}&rate=${rate}`}
            title="Latte Factor Calculator"
          />
          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
