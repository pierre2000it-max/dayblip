"use client"
import { useState, useMemo } from "react"

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

const HUSTLE_IDEAS = [
  { range: "$15–25/hr", examples: "Delivery, retail, childcare, tutoring" },
  { range: "$25–50/hr", examples: "Freelance writing, virtual assistant, social media" },
  { range: "$50–100/hr", examples: "Web development, design, consulting" },
  { range: "$100+/hr",  examples: "Coaching, specialized consulting, speaking" },
]

export default function SideHustlePage() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [hourlyStr,    setHourly]       = useState("30")
  const [investPct,    setInvestPct]    = useState(100)
  const [years,        setYears]        = useState(20)
  const [rate,         setRate]         = useState(10.5)
  const [copied,       setCopied]       = useState(false)

  const hourly  = parseFloat(hourlyStr) || 0
  const r       = rate / 100

  const calc = useMemo(() => {
    const weeklyEarn  = hoursPerWeek * hourly
    const monthlyEarn = (weeklyEarn * 52) / 12
    const annualEarn  = weeklyEarn * 52
    const monthlyInv  = monthlyEarn * (investPct / 100)
    const totalEarned = annualEarn * years
    const totalInvested = monthlyInv * years * 12
    const bigNumber   = fv(monthlyInv, r, years)
    const growth      = bigNumber - totalInvested
    const multiplier  = totalInvested > 0 ? bigNumber / totalInvested : 0

    const milestones = [1, 5, 10, 20].filter(y => y <= years).map(y => ({
      year: y,
      value: fv(monthlyInv, r, y),
    }))

    return { weeklyEarn, monthlyEarn, annualEarn, monthlyInv, totalEarned, totalInvested, bigNumber, growth, multiplier, milestones }
  }, [hoursPerWeek, hourlyStr, investPct, years, r])

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`A ${hoursPerWeek}hr/week side hustle invested for ${years} years could build ${fmt(calc.bigNumber)}! 💪 dayblip.com/curiosity/side-hustle`)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Side Hustle Investment Calculator</h1>
          <p className="text-[#a8a8b3]">What could a side hustle build for your future if you invested everything?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Hours available per week: {hoursPerWeek}</span>
              <input type="range" min={5} max={40} value={hoursPerWeek} onChange={e => setHoursPerWeek(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Hourly rate ($)</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {["15","25","30","50","75","100"].map(v => (
                  <button key={v} onClick={() => setHourly(v)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${hourlyStr === v ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    ${v}
                  </button>
                ))}
              </div>
              <input type="number" value={hourlyStr} onChange={e => setHourly(e.target.value)}
                className="w-32 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">% to invest: {investPct}%</span>
              <input type="range" min={50} max={100} step={5} value={investPct} onChange={e => setInvestPct(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years: {years}</span>
              <input type="range" min={5} max={30} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Earnings */}
          <div className="grid gap-3 md:grid-cols-3 text-center">
            {[
              { label: "Weekly earnings", value: fmt(calc.weeklyEarn) },
              { label: "Monthly earnings", value: fmt(calc.monthlyEarn) },
              { label: "Amount to invest", value: fmt(calc.monthlyInv) + "/mo" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-xl font-black text-white">{r.value}</div>
                <div className="text-sm text-[#a8a8b3]">{r.label}</div>
              </div>
            ))}
          </div>

          {/* BIG NUMBER */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">In {years} years your side hustle could build:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.bigNumber)}</div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div><div className="font-bold text-white">{fmt(calc.totalEarned)}</div><div className="text-[#a8a8b3]">Total earned</div></div>
              <div><div className="font-bold text-[#4ade80]">{fmt(calc.growth)}</div><div className="text-[#a8a8b3]">Investment growth</div></div>
              <div><div className="font-bold text-[#F9A825]">{calc.multiplier.toFixed(1)}x</div><div className="text-[#a8a8b3]">Money multiplied</div></div>
            </div>
          </div>

          {/* Milestone timeline */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📅 Milestone Timeline</h2>
            <div className="flex flex-wrap gap-3">
              {calc.milestones.map(m => (
                <div key={m.year} className="rounded-lg bg-[#16213e] px-4 py-3 text-center min-w-[100px]">
                  <div className="font-black text-[#e94560]">Year {m.year}</div>
                  <div className="text-white font-bold text-sm">{fmt(m.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ideas by rate */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💡 Side Hustle Ideas by Rate</h2>
            <div className="space-y-2">
              {HUSTLE_IDEAS.map(h => (
                <div key={h.range} className="flex gap-3 text-sm py-1.5 border-b border-[#0f3460]/50 last:border-0">
                  <span className="text-[#e94560] font-bold w-24 shrink-0">{h.range}</span>
                  <span className="text-[#a8a8b3]">{h.examples}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={share} className="w-full rounded-xl bg-[#e94560] py-3 font-semibold text-white hover:opacity-90">
            {copied ? "Copied! ✓" : `💪 Share — ${hoursPerWeek}hrs/week could build ${fmt(calc.bigNumber)}`}
          </button>
          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
