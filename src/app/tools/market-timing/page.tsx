"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

const PENALTY: Record<number, number> = { 0: 0, 10: 3.5, 20: 5.5, 30: 7.0, 40: 8.2, 50: 9.1 }
const DAYS_OPTIONS = [0, 10, 20, 30, 40, 50]

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

function calcFV(pv: number, annualRate: number, years: number) {
  return Math.round(pv * Math.pow(1 + annualRate / 100, years))
}

interface Result {
  initial: number; years: number; baseReturn: number; missed: number
  fullyFV: number; adjustedFV: number; cost: number
  adjustedReturn: number; pctSmaller: number
  allScenarios: { days: number; fv: number; cost: number; rate: number }[]
}

function compute(initial: number, years: number, baseReturn: number, missed: number): Result {
  const fullyFV = calcFV(initial, baseReturn, years)
  const adjustedReturn = Math.max(0, baseReturn - (PENALTY[missed] ?? 0))
  const adjustedFV = calcFV(initial, adjustedReturn, years)
  const cost = fullyFV - adjustedFV
  const pctSmaller = fullyFV > 0 ? ((cost / fullyFV) * 100) : 0
  const allScenarios = DAYS_OPTIONS.map(d => {
    const r = Math.max(0, baseReturn - (PENALTY[d] ?? 0))
    const fv = calcFV(initial, r, years)
    return { days: d, fv, cost: fullyFV - fv, rate: r }
  })
  return { initial, years, baseReturn, missed, fullyFV, adjustedFV, cost, adjustedReturn, pctSmaller, allScenarios }
}

export default function MarketTimingPage() {
  const [initial, setInitial] = useState("10000")
  const [years,   setYears]   = useState("20")
  const [retRate, setRetRate] = useState("10")
  const [missed,  setMissed]  = useState(10)
  const [result,  setResult]  = useState<Result | null>(null)

  function runCalc(push = true, inv = initial, yr = years, r = retRate, m = missed) {
    const res = compute(parseFloat(inv)||0, parseFloat(yr)||20, parseFloat(r)||10, m)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?initial=${inv}&years=${yr}&return=${r}&missed=${m}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const inv = p.get("initial"), yr = p.get("years"), r = p.get("return"), m = p.get("missed")
    if (inv && yr) {
      if (inv) setInitial(inv); if (yr) setYears(yr); if (r) setRetRate(r)
      const mNum = m ? Number(m) : 10
      if (DAYS_OPTIONS.includes(mNum)) setMissed(mNum)
      runCalc(false, inv, yr, r ?? retRate, mNum)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl  = result ? `https://www.dayblip.com/tools/market-timing?initial=${initial}&years=${years}&return=${retRate}&missed=${missed}` : ""
  const shareText = result
    ? `Missing just ${result.missed} of the market's best days over ${result.years} years costs ${fmt(result.cost)} — that is ${result.pctSmaller.toFixed(0)}% of your portfolio gone from bad timing!\n(Educational only — not investment advice)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Market Timing Cost Calculator", "Calculate the true cost of missing the stock market's best days. See why time in the market beats timing the market.", "https://www.dayblip.com/tools/market-timing", "FinanceApplication"),
        faqSchema([
          { question: "What happens if you miss the best days in the stock market?", answer: "Missing just 10 of the market's best trading days over 20 years can reduce your portfolio value by 35% or more. The best days often immediately follow the worst days." },
          { question: "Is timing the stock market possible?", answer: "Research consistently shows that timing the market is nearly impossible even for professionals. Missing the 10 best days out of 5,000+ trading days dramatically reduces long-term returns." },
          { question: "What is time in the market vs timing the market?", answer: "Time in the market means staying invested through ups and downs. Timing the market means trying to buy low and sell high. Research shows time in the market almost always wins." },
        ]),
        howToSchema("How to Calculate Market Timing Cost", "See the cost of missing the market's best days", [
          "Enter your initial investment amount",
          "Enter your investment time period in years",
          "Set expected annual market return",
          "Select how many best days you might miss",
          "Click Calculate Cost of Timing to see full impact",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Market Timing Calculator", url: "https://www.dayblip.com/tools/market-timing" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">What Does Missing the Market&apos;s Best Days Cost You?</h1>
          <p className="text-[#a8a8b3]">See why trying to time the market is so dangerous</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Missing just 10 of the stock market&apos;s best trading days over 20 years reduces portfolio returns by approximately 35%. The S&amp;P 500 averaged 10% annually from 1993–2023. Missing the 10 best days drops that to 6.5%. Missing the 30 best days drops it to 1.5%. The best days often immediately follow the worst days.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Market timing — attempting to sell before market drops and buy before recoveries — is nearly impossible even for professional investors. Research consistently shows that investors who stay fully invested through volatility outperform those who move in and out of the market. This calculator shows the exact cost of missing the market&apos;s best trading days.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
            ⚠️ <strong>Educational only.</strong> Based on S&P 500 historical patterns. Past performance does not guarantee future results. Not investment advice.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Initial investment ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={initial} onChange={e => setInitial(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Investment period (years)</span>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Annual return (%)</span>
              <input type="number" step="0.1" value={retRate} onChange={e => setRetRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-white">Best days missed</div>
            <div className="flex flex-wrap gap-2">
              {DAYS_OPTIONS.map(d => (
                <button key={d} type="button" onClick={() => setMissed(d)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${missed === d ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"}`}>
                  {d === 0 ? "Stay invested" : `Miss ${d} days`}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate Cost of Timing
          </button>

          {result && (
            <div className="space-y-6">
              {/* Headline comparison */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xs text-[#a8a8b3] mb-1">Staying fully invested {result.years} yrs</div>
                    <div className="text-3xl font-black text-[#4ade80]">{fmt(result.fullyFV)}</div>
                    <div className="text-xs text-[#a8a8b3]">{result.baseReturn}% annual</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#a8a8b3] mb-1">Missing {result.missed} best days</div>
                    <div className="text-3xl font-black text-[#e94560]">{fmt(result.adjustedFV)}</div>
                    <div className="text-xs text-[#a8a8b3]">{result.adjustedReturn.toFixed(1)}% effective annual</div>
                  </div>
                </div>
                {result.missed > 0 && (
                  <div className="mt-4 rounded-lg border border-[#e94560]/40 bg-[#e94560]/10 p-3 text-center">
                    <div className="text-lg font-black text-[#e94560]">Cost of timing: {fmt(result.cost)} less</div>
                    <div className="text-sm text-[#a8a8b3]">Your portfolio is {result.pctSmaller.toFixed(1)}% smaller from missing {result.missed} days</div>
                  </div>
                )}
              </div>

              {/* Context */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-white mb-2">📊 Context</div>
                <p className="text-[#a8a8b3]">{result.years} years ≈ {result.years * 252} trading days. You missed {result.missed} out of ~{result.years * 252} — just {((result.missed / (result.years * 252)) * 100).toFixed(2)}% of all trading days.</p>
                {result.missed > 0 && <p className="mt-1 text-[#a8a8b3]">Yet it cost <span className="font-bold text-white">{fmt(result.cost)}</span> — a {result.pctSmaller.toFixed(1)}% reduction in your final portfolio.</p>}
              </div>

              {/* All scenarios table */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm overflow-x-auto">
                <div className="font-bold text-white mb-3">All scenarios on {fmt(result.initial)} over {result.years} years</div>
                <table className="w-full min-w-[400px]">
                  <thead><tr className="border-b border-[#0f3460] text-xs text-[#a8a8b3]">
                    <th className="py-1.5 text-left">Days missed</th>
                    <th className="py-1.5 text-right">Final value</th>
                    <th className="py-1.5 text-right">Cost</th>
                    <th className="py-1.5 text-right">Annual return</th>
                  </tr></thead>
                  <tbody className="text-white">
                    {result.allScenarios.map(s => (
                      <tr key={s.days} className={`border-b border-[#0f3460] ${s.days === result.missed ? "bg-[#e94560]/10" : ""}`}>
                        <td className="py-1.5">{s.days === 0 ? "0 — stay invested" : `${s.days} best days`}</td>
                        <td className="py-1.5 text-right font-bold" style={{ color: s.days === 0 ? "#4ade80" : "#ffffff" }}>{fmt(s.fv)}</td>
                        <td className="py-1.5 text-right text-[#e94560]">{s.cost > 0 ? `−${fmt(s.cost)}` : "—"}</td>
                        <td className="py-1.5 text-right text-[#a8a8b3]">{s.rate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                <div className="font-bold text-[#F9A825] mb-1">💡 Reality check</div>
                The best market days often follow the worst days immediately. Investors who sell during crashes typically miss the recovery. Missing just 10 best days over 20 years can cut returns by 35%+.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Market Timing Cost Calculator" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
