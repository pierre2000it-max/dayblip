"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const HOME_PRICES: Record<number, number> = {
  1950: 7354, 1960: 11900, 1970: 23450, 1980: 76400,
  1990: 149800, 2000: 244900, 2010: 272900, 2020: 407700, 2026: 420000,
}
const YEARS = Object.keys(HOME_PRICES).map(Number).sort((a, b) => a - b)
const CURRENT = HOME_PRICES[2026]

export default function HomeValuePage() {
  const [mode, setMode] = useState<"past" | "future">("past")
  const [pricePaid, setPricePaid] = useState("200000")
  const [purchaseYear, setPurchaseYear] = useState(2000)
  const [currentValue, setCurrentValue] = useState("420000")
  const [annualRate, setAnnualRate] = useState("3")
  const [futureYears, setFutureYears] = useState("10")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("paid")) { setMode("past"); setPricePaid(p.get("paid")!) }
    if (p.get("year")) setPurchaseYear(Number(p.get("year")))
    if (p.get("current")) { setMode("future"); setCurrentValue(p.get("current")!) }
    if (p.get("rate")) setAnnualRate(p.get("rate")!)
    if (p.get("futureYears")) setFutureYears(p.get("futureYears")!)
  }, [])

  const calc = useMemo(() => {
    if (mode === "past") {
      const paid = parseFloat(pricePaid) || 0
      const histMedian = HOME_PRICES[purchaseYear] || CURRENT
      const estimatedValue = (paid * CURRENT) / histMedian
      const gain = estimatedValue - paid
      const gainPct = paid > 0 ? (gain / paid * 100).toFixed(1) : "0"
      return { result: estimatedValue, label: `Estimated value today`, gain, gainPct: `+${gainPct}%` }
    } else {
      const cv = parseFloat(currentValue) || 0
      const rate = (parseFloat(annualRate) || 0) / 100
      const yrs = parseFloat(futureYears) || 0
      const fv = cv * Math.pow(1 + rate, yrs)
      const gain = fv - cv
      const gainPct = cv > 0 ? (gain / cv * 100).toFixed(1) : "0"
      return { result: fv, label: `Estimated value in ${futureYears} years`, gain, gainPct: `+${gainPct}%` }
    }
  }, [mode, pricePaid, purchaseYear, currentValue, annualRate, futureYears])

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const inp = sel

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Home Value Calculator — How Much Has Your Home Appreciated?</h1>
          <p className="text-[#a8a8b3]">See how home values have changed over the decades</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">US home values have appreciated an average of 4.3% annually since 1991. A $200,000 home purchased in 2010 would be worth approximately $390,000 today at the national average appreciation rate. However real estate appreciation varies dramatically by location — some markets have tripled while others have barely kept pace with inflation.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Home value appreciation calculators project how much a property has grown in value based on historical appreciation rates for the purchase year and location. Home price growth varies significantly by city, neighborhood and economic conditions. Past appreciation rates do not guarantee future returns and individual property values depend on local market conditions.</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="flex gap-2">
            {([["past", "🏠 Past Purchase"], ["future", "📈 Future Value"]] as const).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-3 font-semibold text-sm transition-colors ${mode === m ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "past" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Price You Paid ($)</span>
                <input type="number" value={pricePaid} onChange={e => setPricePaid(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Year Purchased</span>
                <select value={purchaseYear} onChange={e => setPurchaseYear(Number(e.target.value))} className={sel}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select></label>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current Value ($)</span>
                <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Appreciation (%)</span>
                <input type="number" step="0.1" value={annualRate} onChange={e => setAnnualRate(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Years</span>
                <input type="number" value={futureYears} onChange={e => setFutureYears(e.target.value)} className={inp} /></label>
            </div>
          )}

          <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-4xl font-black text-[#F9A825]">{fmt(calc.result)}</div>
            <div className="text-[#a8a8b3] mt-1">{calc.label}</div>
            <div className="text-green-400 font-semibold mt-1">{calc.gainPct} gain ({fmt(calc.gain)})</div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 US Median Home Prices</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Year</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Median Price</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Change</th>
                </tr></thead>
                <tbody>{YEARS.map((yr, i) => {
                  const prev = i > 0 ? HOME_PRICES[YEARS[i - 1]] : null
                  const chg = prev ? (((HOME_PRICES[yr] - prev) / prev) * 100).toFixed(0) + "%" : "—"
                  return (
                    <tr key={yr} className="border-b border-[#0f3460]/50">
                      <td className="py-2 text-white">{yr}</td>
                      <td className="py-2 text-right text-[#F9A825]">{fmt(HOME_PRICES[yr])}</td>
                      <td className="py-2 text-right text-[#4ade80]">{chg}</td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </div>

          <ShareButtons
            text={`${mode === 'past' ? `A home bought in ${purchaseYear} for $${pricePaid} is worth approximately ${fmt(calc.result)} today!` : `A home worth $${currentValue} today at ${annualRate}% growth will be worth ${fmt(calc.result)} in ${futureYears} years!`} See yours at dayblip.com/real-estate/home-value`}
            url="https://dayblip.com/real-estate/home-value"
            title="Historical Home Value Calculator"
          />
          <RelatedTools tools={[
            { emoji: "📊", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
            { emoji: "🏡", title: "Rent vs Buy", desc: "Should you rent or buy?", href: "/real-estate/rent-vs-buy" },
            { emoji: "🏠", title: "Mortgage Calculator", desc: "Calculate payments", href: "/finance/mortgage-calculator" },
            { emoji: "🏡", title: "American Dream Calculator", desc: "Can you afford it?", href: "/tools/american-dream-calculator" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">Estimates based on US median home price trends. Individual property values vary significantly. Not real estate advice.</p>
        </div>
      </section>
    </div>
  )
}
