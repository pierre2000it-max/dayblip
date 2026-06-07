"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const GOALS = ["Side hustle", "Investing", "Starting a business", "Career change", "Paying off debt", "Learning a skill", "Exercise", "Other goal"]
const ACTIONS = ["Invest it", "Pay off debt", "Save it"]

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimate.</strong> Results are projections not guarantees.
  </div>
)

function fv(monthly: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12
  return r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r)
}

interface Result {
  goal: string; monthly: number; months: number; rate: number
  directLost: number; growthMissed: number; total: number; days: number
  delay6: number; delay12: number
  today5yr: number; in6mo5yr: number; in1yr5yr: number; in2yr5yr: number
}

export default function ProcrastinationCostPage() {
  const [goal, setGoal] = useState("Side hustle")
  const [monthly, setMonthly] = useState("500")
  const [months, setMonths] = useState(12)
  const [action, setAction] = useState("Invest it")
  const [rate, setRate] = useState("7")
  const [result, setResult] = useState<Result | null>(null)

  function compute(g = goal, mv = parseFloat(monthly) || 0, mo = months, rt = parseFloat(rate) || 0): Result {
    const directLost = mv * mo
    const growth = fv(mv, rt, mo)
    const total = growth
    const futureFV = (m: number) => fv(mv, rt, m)
    return {
      goal: g, monthly: mv, months: mo, rate: rt,
      directLost, growthMissed: growth - directLost, total, days: Math.round(mo * 30.44),
      delay6: futureFV(mo + 6) - futureFV(mo), delay12: futureFV(mo + 12) - futureFV(mo),
      today5yr: fv(mv, rt, 60), in6mo5yr: fv(mv, rt, 54), in1yr5yr: fv(mv, rt, 48), in2yr5yr: fv(mv, rt, 36),
    }
  }

  function runCalc(push = true) {
    const res = compute()
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?goal=${encodeURIComponent(goal)}&monthly=${parseFloat(monthly) || 0}&months=${months}&rate=${parseFloat(rate) || 0}&action=${encodeURIComponent(action)}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("monthly") || p.get("months")) {
      const g = p.get("goal"); const mv = p.get("monthly"); const mo = p.get("months"); const rt = p.get("rate"); const ac = p.get("action")
      if (g) setGoal(g); if (mv) setMonthly(mv); if (mo) setMonths(Number(mo)); if (rt) setRate(rt); if (ac) setAction(ac)
      setResult(compute(g ?? "Side hustle", Number(mv ?? 500), Number(mo ?? 12), Number(rt ?? 7)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/procrastination-cost?months=${result.months}&monthly=${result.monthly}` : ""
  const shareText = result ? `Procrastinating my ${result.goal} for ${result.months} months has cost me ${fmt(result.total)} in opportunity! The second best time to start is today. (Educational only)` : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Procrastination Cost Calculator — What Waiting Is Really Costing You</h1>
          <p className="text-[#a8a8b3]">Calculate the real financial cost of putting things off</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Waiting 10 years to start investing $500 per month costs approximately $380,000 in lost retirement wealth at 7% annual return. Procrastinating on salary negotiation for 5 years on a $10,000 gap costs $50,000 in direct income plus compounding raises. The financial cost of procrastination compounds exactly like investment returns — but in reverse.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Procrastination has a measurable financial cost in compound terms. Every year of delay in starting to invest, negotiating salary, paying off debt or making a financial decision has a quantifiable cost that grows over time. This calculator shows the exact dollar cost of waiting different lengths of time on common financial decisions.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white">What have you been procrastinating?</span>
              <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select></label>
            <label className="block"><span className="mb-1 block text-sm font-semibold text-white">Monthly value if you had started</span>
              <span className="mb-2 block text-xs text-[#a8a8b3]">Estimated monthly income, savings or value if you had started</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></div></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">How long procrastinating: {months} months</span>
              <input type="range" min={1} max={60} value={months} onChange={e => setMonths(Number(e.target.value))} className="accent-[#e94560]" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white">What you would do with the money</span>
              <select value={action} onChange={e => setAction(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white">Investment / savings rate %</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></label>
            <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate My Cost
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-black text-white">{fmt(result.directLost)}</div><div className="text-[#a8a8b3]">Direct value missed</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-black text-[#4ade80]">{fmt(result.growthMissed)}</div><div className="text-[#a8a8b3]">Investment growth missed</div></div>
                <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-4"><div className="font-black text-[#e94560]">{fmt(result.total)}</div><div className="text-[#a8a8b3]">Total opportunity cost</div></div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <p>You have been procrastinating for {result.months} months — that is {result.days.toLocaleString()} days.</p>
                <p className="mt-1">Every month of further delay costs approximately <span className="font-bold text-[#FF6B6B]">{fmt(result.monthly)}</span> more.</p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-white">Future cost comparison</h3>
                <p>Starting today vs 6 more months: 6 month delay costs additional <span className="font-bold text-[#FF6B6B]">{fmt(result.delay6)}</span>.</p>
                <p className="mt-1">Starting today vs 1 year delay: 1 year delay costs additional <span className="font-bold text-[#FF6B6B]">{fmt(result.delay12)}</span>.</p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm">
                <h3 className="mb-3 font-bold text-white">Compound delay (5-year value)</h3>
                <ul className="space-y-2 text-[#a8a8b3]">
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span>Start today</span><span className="font-bold text-[#4ade80]">{fmt(result.today5yr)}</span></li>
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span>Start in 6 months</span><span className="font-bold text-white">{fmt(result.in6mo5yr)}</span></li>
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span>Start in 1 year</span><span className="font-bold text-white">{fmt(result.in1yr5yr)}</span></li>
                  <li className="flex justify-between"><span>Start in 2 years</span><span className="font-bold text-white">{fmt(result.in2yr5yr)}</span></li>
                </ul>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <p className="text-lg font-bold">&ldquo;The best time to start was {result.months} months ago. The second best time is today.&rdquo;</p>
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-5 text-sm text-white">
                What is one small step you could take TODAY toward {result.goal.toLowerCase()}?
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Procrastination Cost Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
