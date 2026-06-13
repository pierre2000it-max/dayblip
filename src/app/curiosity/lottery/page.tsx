"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

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

export default function LotteryPage() {
  const [weeklyStr, setWeekly] = useState("20")
  const [years, setYears]      = useState(20)
  const [rate, setRate]        = useState(10.5)
  const weekly  = parseFloat(weeklyStr) || 0
  const monthly = (weekly * 52) / 12
  const r       = rate / 100

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("weekly")) setWeekly(p.get("weekly")!)
    if (p.get("years")) setYears(Number(p.get("years")))
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const calc = useMemo(() => {
    const perYear    = weekly * 52
    const totalSpent = perYear * years
    const lotteryReturn = totalSpent * 0.52  // ~52 cents per dollar
    const invested   = fv(monthly, r, years)
    return { perYear, totalSpent, lotteryReturn, invested }
  }, [weekly, monthly, years, r])


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Lottery Calculator — What $20 Per Week Could Build Instead</h1>
          <p className="text-[#a8a8b3]">What if you invested your lottery money in the S&amp;P 500 instead?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The odds of winning the Powerball jackpot are 1 in 292 million. You are 10 times more likely to be struck by lightning twice than win Powerball. Spending $20 per week on lottery tickets costs $1,040 per year. Invested at 7% annual return for 30 years that same $20 per week grows to $104,000.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Lottery calculators show the true expected value of lottery spending versus the opportunity cost of investing the same amount. The expected return on a lottery ticket is approximately 50 cents for every dollar spent — the worst investment available. This calculator compares your lottery spending to what the same money would build as an investment over time.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-4">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Lottery spend per week ($)</span>
              <input type="number" step="1" value={weeklyStr} onChange={e => setWeekly(e.target.value)}
                className="w-40 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years playing: {years}</span>
              <input type="range" min={10} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Spending summary */}
          <div className="grid gap-3 md:grid-cols-4 text-center text-sm">
            {[
              { label: "Per week", value: `$${weekly.toFixed(2)}` },
              { label: "Per month", value: fmt(monthly) },
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
            <p className="text-[#a8a8b3] mb-2">If {fmt(monthly)}/month was invested in S&P 500 for {years} years:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.invested)}</div>
            <p className="text-[#a8a8b3] mt-2 text-sm">The real lottery is compound interest 🎰</p>
          </div>

          {/* Reality check */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🎰 Lottery Reality Check</h2>
            <div className="space-y-2 text-sm text-[#a8a8b3]">
              <div className="flex justify-between py-1.5 border-b border-[#0f3460]/50">
                <span>Odds of winning Powerball jackpot</span>
                <span className="text-[#e94560] font-bold">1 in 292 million</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#0f3460]/50">
                <span>Odds of being struck by lightning</span>
                <span className="text-white font-bold">1 in 500,000</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#0f3460]/50">
                <span>Expected return per $1 lottery ticket</span>
                <span className="text-[#e94560] font-bold">~$0.52</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Your expected lottery return over {years} years</span>
                <span className="text-[#e94560] font-bold">{fmt(calc.lotteryReturn)}</span>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
              <h3 className="font-bold text-[#a8a8b3] mb-2">🎰 Lottery after {years} years</h3>
              <div className="text-2xl font-black text-[#e94560]">{fmt(calc.lotteryReturn)}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Statistical expected return (~52¢/$)</div>
              <div className="text-xs text-[#a8a8b3]">1 in 292M chance of jackpot</div>
            </div>
            <div className="rounded-xl border border-[#4ade80]/20 bg-green-900/10 p-5 text-center">
              <h3 className="font-bold text-[#a8a8b3] mb-2">📈 S&P 500 after {years} years</h3>
              <div className="text-2xl font-black text-[#4ade80]">{fmt(calc.invested)}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">Historical avg {rate}% return</div>
              <div className="text-xs text-[#a8a8b3]">97% of 20yr periods were positive</div>
            </div>
          </div>

          <ShareButtons
            text={`My $${weekly.toFixed(2)}/week lottery habit could be ${fmt(calc.invested)} if invested instead! (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/lottery?weekly=${weeklyStr}&years=${years}&rate=${rate}`}
            title="Lottery vs Investing Calculator"
          />          <RelatedTools tools={[
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "📈", title: "Compound Interest", desc: "Grow wealth over time", href: "/finance/compound-interest" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
            { emoji: "📊", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
          ]} />

          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
