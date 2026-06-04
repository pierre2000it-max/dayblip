"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

// ─── Pure helpers (module scope) ─────────────────────────────────────────────
function fvAnnuity(pv: number, pmt: number, annualRate: number, months: number): number {
  if (months <= 0) return pv
  const r = annualRate / 100 / 12
  if (r === 0) return pv + pmt * months
  return pv * Math.pow(1 + r, months) + pmt * ((Math.pow(1 + r, months) - 1) / r)
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational projection only.</strong> Past returns do not guarantee future results. Not financial advice.
  </div>
)

interface Result {
  earlyStart: number; earlyMonthly: number; earlyStop: number
  lateStart: number; lateMonthly: number; retireAge: number; rate: number
  earlyFV: number; earlyTotal: number; earlyYears: number
  lateFV: number; lateTotal: number; lateYears: number
  earlyWins: boolean; diff: number
}

function compute(
  earlyStart: number, earlyMonthly: number, earlyStop: number,
  lateStart: number, lateMonthly: number, retireAge: number, rate: number
): Result {
  const earlyYears = Math.max(0, earlyStop - earlyStart)
  const earlyPhase1 = fvAnnuity(0, earlyMonthly, rate, earlyYears * 12)
  const earlyCoastYears = Math.max(0, retireAge - earlyStop)
  const earlyFV = fvAnnuity(earlyPhase1, 0, rate, earlyCoastYears * 12)
  const earlyTotal = earlyMonthly * earlyYears * 12

  const lateYears = Math.max(0, retireAge - lateStart)
  const lateFV = fvAnnuity(0, lateMonthly, rate, lateYears * 12)
  const lateTotal = lateMonthly * lateYears * 12

  return {
    earlyStart, earlyMonthly, earlyStop, lateStart, lateMonthly, retireAge, rate,
    earlyFV: Math.round(earlyFV), earlyTotal: Math.round(earlyTotal), earlyYears,
    lateFV: Math.round(lateFV), lateTotal: Math.round(lateTotal), lateYears,
    earlyWins: earlyFV >= lateFV, diff: Math.round(Math.abs(earlyFV - lateFV)),
  }
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white">{label}</span>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
    </label>
  )
}

export default function EarlyVsLatePage() {
  const [earlyStart,   setEarlyStart]   = useState("25")
  const [earlyMonthly, setEarlyMonthly] = useState("200")
  const [earlyStop,    setEarlyStop]    = useState("35")
  const [lateStart,    setLateStart]    = useState("35")
  const [lateMonthly,  setLateMonthly]  = useState("500")
  const [retireAge,    setRetireAge]    = useState("65")
  const [rate,         setRate]         = useState("7")
  const [result,       setResult]       = useState<Result | null>(null)

  function runCalc(push = true, es = earlyStart, em = earlyMonthly, ep = earlyStop, ls = lateStart, lm = lateMonthly, ra = retireAge, r = rate) {
    const res = compute(+es||25, +em||200, +ep||35, +ls||35, +lm||500, +ra||65, +r||7)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?earlystart=${es}&earlymonthly=${em}&earlystop=${ep}&latestart=${ls}&latemonthly=${lm}&retire=${ra}&return=${r}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const es = p.get("earlystart"), em = p.get("earlymonthly"), ep = p.get("earlystop")
    const ls = p.get("latestart"), lm = p.get("latemonthly"), ra = p.get("retire"), r = p.get("return")
    if (es && em) {
      if (es) setEarlyStart(es); if (em) setEarlyMonthly(em); if (ep) setEarlyStop(ep)
      if (ls) setLateStart(ls); if (lm) setLateMonthly(lm); if (ra) setRetireAge(ra); if (r) setRate(r)
      runCalc(false, es, em ?? earlyMonthly, ep ?? earlyStop, ls ?? lateStart, lm ?? lateMonthly, ra ?? retireAge, r ?? rate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl  = result ? `https://www.dayblip.com/tools/early-vs-late?earlystart=${earlyStart}&earlymonthly=${earlyMonthly}&earlystop=${earlyStop}&latestart=${lateStart}&latemonthly=${lateMonthly}` : ""
  const shareText = result
    ? `Mind blown. Starting to save ${fmt(result.earlyMonthly)}/month at age ${result.earlyStart} and stopping at ${result.earlyStop} ${result.earlyWins ? "BEATS" : "vs"} saving ${fmt(result.lateMonthly)}/month from ${result.lateStart} to retirement!\nEarly: ${fmt(result.earlyFV)} vs Late: ${fmt(result.lateFV)}\n(Educational only — not financial advice)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Early Saver vs Late Saver — Who Wins?</h1>
          <p className="text-[#a8a8b3]">See why starting earlier with less beats starting later with more</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          {DISCLAIMER}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-4 space-y-3">
              <div className="font-bold text-[#4FC3F7]">⏰ Early Saver</div>
              <NumField label="Start age" value={earlyStart} onChange={setEarlyStart} />
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Monthly contribution ($)</span>
                <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                  <input type="number" value={earlyMonthly} onChange={e => setEarlyMonthly(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </div>
              </label>
              <NumField label="Stop contributing age" value={earlyStop} onChange={setEarlyStop} />
            </div>

            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-4 space-y-3">
              <div className="font-bold text-[#e94560]">📅 Late Saver</div>
              <NumField label="Start age" value={lateStart} onChange={setLateStart} />
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Monthly contribution ($)</span>
                <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                  <input type="number" value={lateMonthly} onChange={e => setLateMonthly(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </div>
              </label>
              <NumField label="Retirement age" value={retireAge} onChange={setRetireAge} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Annual return (%)</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Compare Savers
          </button>

          {result && (
            <div className="space-y-6">
              {/* Winner banner */}
              <div className={`rounded-xl p-6 text-center border ${result.earlyWins ? "border-[#4FC3F7]/40 bg-[#4FC3F7]/10" : "border-[#e94560]/40 bg-[#e94560]/10"}`}>
                <div className="text-sm text-[#a8a8b3]">At retirement (age {result.retireAge})</div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className={`rounded-lg p-4 ${result.earlyWins ? "ring-2 ring-[#4FC3F7]" : ""}`} style={{ background: "#1a1a2e" }}>
                    <div className="text-xs text-[#a8a8b3] mb-1">⏰ Early Saver</div>
                    <div className="text-3xl font-black text-[#4FC3F7]">{fmt(result.earlyFV)}</div>
                    {result.earlyWins && <div className="mt-1 text-xs font-bold text-[#4ade80]">WINNER 🏆</div>}
                  </div>
                  <div className={`rounded-lg p-4 ${!result.earlyWins ? "ring-2 ring-[#e94560]" : ""}`} style={{ background: "#1a1a2e" }}>
                    <div className="text-xs text-[#a8a8b3] mb-1">📅 Late Saver</div>
                    <div className="text-3xl font-black text-[#e94560]">{fmt(result.lateFV)}</div>
                    {!result.earlyWins && <div className="mt-1 text-xs font-bold text-[#4ade80]">WINNER 🏆</div>}
                  </div>
                </div>
                <div className="mt-3 font-bold text-white">{result.earlyWins ? "Early" : "Late"} Saver wins by {fmt(result.diff)}</div>
              </div>

              {/* Detail cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
                {[{ label: "⏰ Early Saver", years: result.earlyYears, total: result.earlyTotal, fv: result.earlyFV, color: "#4FC3F7" },
                  { label: "📅 Late Saver",  years: result.lateYears,  total: result.lateTotal,  fv: result.lateFV,  color: "#e94560" }
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-1.5 text-white">
                    <div className="font-bold" style={{ color: s.color }}>{s.label}</div>
                    <div className="flex justify-between border-b border-[#0f3460] py-1"><span className="text-[#a8a8b3]">Contributed for</span><span>{s.years} years</span></div>
                    <div className="flex justify-between border-b border-[#0f3460] py-1"><span className="text-[#a8a8b3]">Total contributed</span><span>{fmt(s.total)}</span></div>
                    <div className="flex justify-between border-b border-[#0f3460] py-1"><span className="text-[#a8a8b3]">Final value</span><span className="font-bold" style={{ color: s.color }}>{fmt(s.fv)}</span></div>
                    <div className="flex justify-between border-b border-[#0f3460] py-1"><span className="text-[#a8a8b3]">Investment growth</span><span className="text-[#4ade80]">{fmt(s.fv - s.total)}</span></div>
                    <div className="flex justify-between py-1"><span className="text-[#a8a8b3]">Each $1 grew to</span><span className="font-bold">{s.total > 0 ? (s.fv / s.total).toFixed(1) : "—"}×</span></div>
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                <div className="font-bold text-[#F9A825] mb-1">💡 The insight</div>
                {result.earlyWins
                  ? <p>The early saver contributed {fmt(result.earlyTotal)} for just {result.earlyYears} years and walked away. The late saver contributed {fmt(result.lateTotal)} for {result.lateYears} years and still {result.diff > 0 ? "lost" : "tied"}. <strong>Time in market beats amount invested.</strong></p>
                  : <p>In this scenario the late saver wins — but notice the early saver contributed only {fmt(result.earlyTotal)} vs {fmt(result.lateTotal)} from the late saver. Time still does incredible work even when contributions stop.</p>
                }
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Early vs Late Saver Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
