"use client"
import { useState, useMemo, useEffect } from "react"
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

export default function GymMembershipPage() {
  const [monthlyCostStr, setMonthlyCost] = useState("50")
  const [visitsPerMonth, setVisits]      = useState(4)
  const [yearsHad,       setYearsHad]    = useState(3)
  const [investYears,    setInvestYears] = useState(20)
  const [rate,           setRate]        = useState(10.5)
  const monthly = parseFloat(monthlyCostStr) || 0
  const r       = rate / 100

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("monthly")) setMonthlyCost(p.get("monthly")!)
    if (p.get("visits")) setVisits(Number(p.get("visits")))
    if (p.get("had")) setYearsHad(Number(p.get("had")))
    if (p.get("investyears")) setInvestYears(Number(p.get("investyears")))
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const calc = useMemo(() => {
    const costPerVisit = visitsPerMonth > 0 ? monthly / visitsPerMonth : monthly
    const totalSpent   = monthly * 12 * yearsHad
    const totalVisits  = visitsPerMonth * 12 * yearsHad
    const trueCostPerVisit = totalVisits > 0 ? totalSpent / totalVisits : 0
    const invested     = fv(monthly, r, investYears)

    const goMoreCostPerVisit = monthly / 12  // 3x per week ≈ 12/mo
    const runningShoesCost   = 130
    const shoesWorkouts      = 500

    return { costPerVisit, totalSpent, totalVisits, trueCostPerVisit, invested, goMoreCostPerVisit, runningShoesCost, shoesWorkouts }
  }, [monthlyCostStr, visitsPerMonth, yearsHad, investYears, r])


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Gym Membership Calculator — Your Real Cost Per Visit</h1>
          <p className="text-[#a8a8b3]">How much does your gym membership actually cost per visit?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average gym membership costs $58 per month. The average member visits only 2 times per week — making the real cost $7.25 per visit. Members who go once a week pay $14.50 per visit. 67% of gym memberships are never or rarely used. People who cancel unused memberships and invest the savings often save $500-700 per year.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Gym membership cost per visit depends on how frequently you actually attend. This calculator divides your real monthly membership cost by your honest weekly visit frequency to show the true price per workout. It also shows what cancelling an unused membership and investing the savings would be worth over time.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-4">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly gym cost ($)</span>
              <input type="number" step="5" value={monthlyCostStr} onChange={e => setMonthlyCost(e.target.value)}
                className="w-40 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Times you actually go per month: {visitsPerMonth} <span className="text-[#a8a8b3] font-normal">(Be honest 😄)</span></span>
              <input type="range" min={0} max={30} value={visitsPerMonth} onChange={e => setVisits(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years you have had this membership: {yearsHad}</span>
              <input type="range" min={1} max={20} value={yearsHad} onChange={e => setYearsHad(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years to invest instead: {investYears}</span>
              <input type="range" min={10} max={30} value={investYears} onChange={e => setInvestYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* BIG COST PER VISIT */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-1">Your cost per gym visit</p>
            <div className="text-6xl font-black text-[#e94560]">${calc.costPerVisit.toFixed(2)}</div>
            <p className="text-[#a8a8b3] text-sm mt-2">based on {visitsPerMonth} visits/month at ${monthlyCostStr}/month</p>
          </div>

          {/* Comparison */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💰 Cost Per Visit Comparison</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Your cost/visit", value: `$${calc.costPerVisit.toFixed(2)}`, highlight: true },
                { label: "Boutique fitness class", value: "$25–35" },
                { label: "Day spa treatment", value: "$50–100" },
                { label: "Personal trainer", value: "$60–100" },
              ].map(r => (
                <div key={r.label} className={`flex justify-between py-1.5 border-b border-[#0f3460]/50 ${r.highlight ? "text-[#e94560] font-bold" : ""}`}>
                  <span className={r.highlight ? "" : "text-[#a8a8b3]"}>{r.label}</span>
                  <span className={r.highlight ? "" : "text-white"}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total spent */}
          <div className="grid gap-3 md:grid-cols-3 text-center text-sm">
            {[
              { label: `Total spent (${yearsHad} years)`, value: fmt(calc.totalSpent) },
              { label: "Effective visits", value: calc.totalVisits.toLocaleString() },
              { label: "True $/visit", value: `$${calc.trueCostPerVisit.toFixed(2)}` },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="font-black text-white">{r.value}</div>
                <div className="text-xs text-[#a8a8b3]">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Investment value */}
          <div className="rounded-xl border border-[#4ade80]/20 bg-green-900/10 p-5 text-center">
            <p className="text-[#a8a8b3] mb-1">If invested instead for {investYears} years:</p>
            <div className="text-4xl font-black text-[#4ade80]">{fmt(calc.invested)}</div>
          </div>

          {/* Go more */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">💡 The Math Flips if You Go More</h2>
            <p className="text-sm text-[#a8a8b3]">
              If you went 3x per week (~12 visits/month) your cost per visit drops to
              <span className="text-white font-bold"> ${(monthly/12).toFixed(2)}</span> — competitive with any alternative.
              <br /><br />
              <strong className="text-white">The cheapest gym membership is the one you actually use.</strong>
            </p>
          </div>

          {/* Humor */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-[#a8a8b3] italic text-center">
            &ldquo;The most popular gym equipment in America is the unused membership card.&rdquo;
            <br /><br />
            A pair of running shoes costs ~${calc.runningShoesCost} and lasts {calc.shoesWorkouts}+ workouts — that is ${(calc.runningShoesCost / calc.shoesWorkouts).toFixed(2)}/workout.
          </div>

          <ShareButtons
            text={`My gym membership costs $${calc.costPerVisit.toFixed(2)} per actual visit! Invested instead = ${fmt(calc.invested)} in ${investYears} years. (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/gym-membership?monthly=${monthlyCostStr}&visits=${visitsPerMonth}&had=${yearsHad}&investyears=${investYears}&rate=${rate}`}
            title="Gym Membership Cost Calculator"
          />
          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
