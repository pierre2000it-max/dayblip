"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fvLump(pv: number, r: number, years: number): number {
  if (pv <= 0 || years <= 0) return 0
  return pv * Math.pow(1 + r, years)
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational & entertainment purposes only.</strong> Not investment advice. Past S&P 500 returns do not guarantee future results. Consult a financial advisor.
  </div>
)

const UPGRADE_OPTIONS = [
  { value: 1, label: "Every year" },
  { value: 2, label: "Every 2 years" },
  { value: 3, label: "Every 3 years" },
  { value: 4, label: "Every 4 years" },
]

export default function PhoneUpgradePage() {
  const [priceStr,  setPrice]    = useState("1099")
  const [upgradeFreq, setFreq]   = useState(1)
  const [tradeInStr, setTradeIn] = useState("300")
  const [calcYears, setCalcYrs]  = useState(30)
  const [rate,      setRate]     = useState(10.5)
  const r = rate / 100

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("price")) setPrice(p.get("price")!)
    if (p.get("tradein")) setTradeIn(p.get("tradein")!)
    if (p.get("freq")) setFreq(Number(p.get("freq")))
    if (p.get("years")) setCalcYrs(Number(p.get("years")))
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const calc = useMemo(() => {
    const price   = parseFloat(priceStr)   || 0
    const tradeIn = parseFloat(tradeInStr) || 0
    const netCost = Math.max(0, price - tradeIn)
    const freqLabel = UPGRADE_OPTIONS.find(o => o.value === upgradeFreq)?.label ?? ""

    // Frequent (every year) vs baseline (every 3 years)
    const baseline = 3
    const timesFrequent = Math.floor(calcYears / upgradeFreq)
    const timesBaseline = Math.floor(calcYears / baseline)
    const totalFrequent = netCost * timesFrequent
    const totalBaseline = netCost * timesBaseline

    // Invest the difference each time baseline user doesn't buy
    let investedValue = 0
    for (let i = 0; i < timesFrequent - timesBaseline; i++) {
      const yearOfSave = i * upgradeFreq + upgradeFreq
      investedValue += fvLump(netCost, r, Math.max(0, calcYears - yearOfSave))
    }

    return { netCost, timesFrequent, timesBaseline, totalFrequent, totalBaseline, investedValue, freqLabel, savings: totalFrequent - totalBaseline }
  }, [priceStr, upgradeFreq, tradeInStr, calcYears, r])


  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Phone Upgrade Calculator — True Cost of Your Annual Upgrade Habit</h1>
          <p className="text-[#a8a8b3]">How much does upgrading your phone every year actually cost you?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average iPhone costs $999. Upgrading every year costs $8,991 over 9 years after trade-in credits. Upgrading every 3 years costs $2,997 — saving $5,994. If that $666 annual savings was invested at 7% return over 20 years it would grow to $32,000. The average American upgrades their phone every 2.7 years.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Smartphone upgrade costs are calculated by comparing the actual out-of-pocket cost over time for different upgrade cycles after accounting for trade-in value. This calculator shows the real annual cost of your current upgrade habit and compares it to less frequent upgrade cycles and the investment alternative.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Phone price ($)</span>
              <input type="number" step="50" value={priceStr} onChange={e => setPrice(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Trade-in value ($)</span>
              <input type="number" step="50" value={tradeInStr} onChange={e => setTradeIn(e.target.value)} className={inp} /></label>
            <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Upgrade frequency</span>
              <div className="flex flex-wrap gap-2">
                {UPGRADE_OPTIONS.map(o => (
                  <button key={o.value} onClick={() => setFreq(o.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${upgradeFreq === o.value ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Calculate over {calcYears} years</span>
              <input type="range" min={20} max={40} value={calcYears} onChange={e => setCalcYrs(Number(e.target.value))} className="mt-2 accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Net cost */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💳 Net Upgrade Cost per Cycle</h2>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div><div className="font-black text-white">{fmt(parseFloat(priceStr)||0)}</div><div className="text-[#a8a8b3]">Phone price</div></div>
              <div><div className="font-black text-[#e94560]">−{fmt(parseFloat(tradeInStr)||0)}</div><div className="text-[#a8a8b3]">Trade-in</div></div>
              <div><div className="font-black text-[#F9A825]">{fmt(calc.netCost)}</div><div className="text-[#a8a8b3]">Net cost</div></div>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
              <h3 className="text-sm text-[#a8a8b3] mb-1">{calc.freqLabel}</h3>
              <div className="text-2xl font-black text-[#e94560]">{calc.timesFrequent} upgrades</div>
              <div className="text-white font-bold mt-1">{fmt(calc.totalFrequent)} total</div>
            </div>
            <div className="rounded-xl border border-[#4ade80]/20 bg-green-900/10 p-5 text-center">
              <h3 className="text-sm text-[#a8a8b3] mb-1">Every 3 years</h3>
              <div className="text-2xl font-black text-[#4ade80]">{calc.timesBaseline} upgrades</div>
              <div className="text-white font-bold mt-1">{fmt(calc.totalBaseline)} total</div>
            </div>
          </div>

          {/* BIG NUMBER */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">If you upgraded every 3 years instead of {calc.freqLabel.toLowerCase()} and invested the savings:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.investedValue)}</div>
          </div>

          {/* Phone reality */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📱 Phone Performance Reality</h2>
            <div className="space-y-2 text-sm">
              {[
                ["Year 1 phone", "100% speed", "#4ade80"],
                ["Year 2 phone", "98% as fast", "#86efac"],
                ["Year 3 phone", "95% as fast", "#F9A825"],
                ["Year 4 phone", "90% as fast", "#fb923c"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="flex justify-between py-1">
                  <span className="text-[#a8a8b3]">{String(label)}</span>
                  <span className="font-semibold" style={{ color: String(color) }}>{String(value)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#a8a8b3] mt-3">Most people cannot notice the difference between a 1-year-old and 3-year-old phone in daily use.</p>
          </div>

          <ShareButtons
            text={`Upgrading my phone ${calc.freqLabel.toLowerCase()} costs ${fmt(calc.investedValue)} in opportunity over ${calcYears} years! (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/phone-upgrade?price=${priceStr}&tradein=${tradeInStr}&freq=${upgradeFreq}&years=${calcYears}&rate=${rate}`}
            title="Phone Upgrade Cycle Calculator"
          />          <RelatedTools tools={[
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
            { emoji: "📊", title: "Budget Calculator", desc: "Build a monthly budget", href: "/finance/budget-calculator" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "💸", title: "Habit Cost Calculator", desc: "Total cost of habits", href: "/health/habit-cost" },
          ]} />

          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
