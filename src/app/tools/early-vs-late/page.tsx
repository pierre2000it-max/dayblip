"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

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

// ─── Input validation ─────────────────────────────────────────────────────────
function validateInputs(
  earlyStart: number, earlyStop: number,
  lateStart: number, retireAge: number
): string | null {
  if (isNaN(earlyStart) || isNaN(earlyStop) || isNaN(lateStart) || isNaN(retireAge)) return "Please fill in all fields."
  if (earlyStart >= earlyStop)    return "Early saver must contribute for at least 1 year (start age < stop age)."
  if (earlyStop >= retireAge)     return "Early saver stop age must be before retirement age."
  if (lateStart >= retireAge)     return "Late saver start age must be before retirement age."
  if (earlyStart < 10 || earlyStart > 70)   return "Start ages must be between 10 and 70."
  if (retireAge > 80)             return "Retirement age must be 80 or under."
  return null
}

interface Result {
  earlyStart: number; earlyMonthly: number; earlyStop: number
  lateStart: number; lateMonthly: number; retireAge: number; rate: number
  earlyFV: number; earlyTotal: number; earlyYears: number; earlyCoastYears: number
  lateFV: number; lateTotal: number; lateYears: number
  earlyWins: boolean; diff: number
  contribRatio: number; outcomeRatio: number
}

function compute(
  earlyStart: number, earlyMonthly: number, earlyStop: number,
  lateStart: number, lateMonthly: number, retireAge: number, rate: number
): Result {
  // Phase 1: early saver contributes
  const earlyYears    = Math.max(0, earlyStop - earlyStart)
  const earlyPhase1   = fvAnnuity(0, earlyMonthly, rate, earlyYears * 12)
  // Phase 2: early saver coasts (no new money, just compounding)
  const earlyCoastYears = Math.max(0, retireAge - earlyStop)
  const earlyFV       = fvAnnuity(earlyPhase1, 0, rate, earlyCoastYears * 12)
  const earlyTotal    = earlyMonthly * earlyYears * 12

  // Late saver contributes straight through to retirement
  const lateYears = Math.max(0, retireAge - lateStart)
  const lateFV    = fvAnnuity(0, lateMonthly, rate, lateYears * 12)
  const lateTotal = lateMonthly * lateYears * 12

  // How much MORE did the winner contribute vs loser, and by what % did they win
  const winnerTotal = earlyFV >= lateFV ? earlyTotal : lateTotal
  const loserTotal  = earlyFV >= lateFV ? lateTotal  : earlyTotal
  const winnerFV    = Math.max(earlyFV, lateFV)
  const loserFV     = Math.min(earlyFV, lateFV)
  const contribRatio = loserTotal > 0 ? winnerTotal / loserTotal : 1
  const outcomeRatio = loserFV    > 0 ? winnerFV    / loserFV    : 1

  return {
    earlyStart, earlyMonthly, earlyStop, lateStart, lateMonthly, retireAge, rate,
    earlyFV: Math.round(earlyFV), earlyTotal: Math.round(earlyTotal),
    earlyYears, earlyCoastYears,
    lateFV: Math.round(lateFV), lateTotal: Math.round(lateTotal), lateYears,
    earlyWins: earlyFV >= lateFV, diff: Math.round(Math.abs(earlyFV - lateFV)),
    contribRatio, outcomeRatio,
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
  const [result,         setResult]         = useState<Result | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  function runCalc(push = true, es = earlyStart, em = earlyMonthly, ep = earlyStop, ls = lateStart, lm = lateMonthly, ra = retireAge, r = rate) {
    const err = validateInputs(+es, +ep, +ls, +ra)
    if (err) { setValidationError(err); setResult(null); return }
    setValidationError(null)
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
    ? result.earlyWins
      ? `Mind blown 🤯 Saving ${fmt(result.earlyMonthly)}/month for just ${result.earlyYears} years (age ${result.earlyStart}–${result.earlyStop}) BEATS saving ${fmt(result.lateMonthly)}/month for ${result.lateYears} years!\nEarly: ${fmt(result.earlyFV)} vs Late: ${fmt(result.lateFV)} — Early wins by ${fmt(result.diff)}!\nContributed ${((1 - result.earlyTotal / result.lateTotal) * 100).toFixed(0)}% less, ended up with ${((result.earlyFV / result.lateFV - 1) * 100).toFixed(0)}% more. That's compound interest.\n(Educational only — not financial advice)`
      : `Comparing early vs late saving: ${fmt(result.earlyMonthly)}/month age ${result.earlyStart}–${result.earlyStop} vs ${fmt(result.lateMonthly)}/month age ${result.lateStart}–${result.retireAge}.\nEarly: ${fmt(result.earlyFV)} vs Late: ${fmt(result.lateFV)} — ${result.earlyWins ? "Early" : "Late"} wins by ${fmt(result.diff)}.\nTry equal contributions to see the power of starting early!\n(Educational only — not financial advice)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Early vs Late Saver Calculator", "See why starting to save earlier with less money beats starting later with more. Visualize the power of compound interest over time.", "https://www.dayblip.com/tools/early-vs-late", "FinanceApplication"),
        faqSchema([
          { question: "Is it better to save early or save more later?", answer: "Saving earlier almost always wins. Saving $200 per month from age 25 to 35 then stopping typically outperforms saving $500 per month from age 35 to 65, despite contributing far less money." },
          { question: "Why does starting to save early matter so much?", answer: "Compound interest grows exponentially over time. Money invested at 25 has 40 years to compound versus money invested at 35 which only has 30 years — that 10-year difference is enormous." },
          { question: "What is compound interest?", answer: "Compound interest means earning returns on your returns. $10,000 at 7% annual return becomes $76,123 after 30 years without adding a single dollar — the growth accelerates over time." },
        ]),
        howToSchema("How to Compare Early vs Late Saver Results", "Compare two saving strategies side by side", [
          "Enter early saver start age and monthly contribution",
          "Enter the age the early saver stops contributing",
          "Enter late saver start age and monthly contribution",
          "Set retirement age and expected annual return",
          "Click Compare Savers to see who wins",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Early vs Late Saver", url: "https://www.dayblip.com/tools/early-vs-late" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Early Saver vs Late Saver — Who Wins?</h1>
          <p className="text-[#a8a8b3]">See why starting earlier with less beats starting later with more</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Starting to invest earlier almost always wins. Saving $200 per month from age 25 to 35 then stopping completely typically outperforms saving $500 per month from age 35 to 65. The early saver contributes $24,000 total. The late saver contributes $180,000 total. Time in the market outperforms amount invested.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Compound interest grows exponentially over time — not linearly. Money invested at 25 has 40 years to compound versus money invested at 35 which only has 30 years. That 10-year head start creates a gap that often cannot be overcome by investing larger amounts later. This calculator shows the exact comparison for any input values.</p>
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

          {validationError && (
            <div className="rounded-xl border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 px-4 py-3 text-sm text-[#FF6B6B]">
              ⚠️ {validationError}
            </div>
          )}

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

              {/* Timeline */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                <div className="font-bold text-white mb-3">📅 Timeline</div>
                <div className="space-y-2 text-[#a8a8b3]">
                  <p>Age {result.earlyStart}: ⏰ Early Saver starts {fmt(result.earlyMonthly)}/mo</p>
                  <p>Age {result.earlyStop}: ⏰ Early Saver <strong className="text-white">stops</strong> contributing — {fmt(result.earlyMonthly)}/mo for {result.earlyYears} yrs</p>
                  {result.lateStart !== result.earlyStop && <p>Age {result.lateStart}: 📅 Late Saver starts {fmt(result.lateMonthly)}/mo</p>}
                  {result.lateStart === result.earlyStop && <p>Age {result.lateStart}: 📅 Late Saver starts {fmt(result.lateMonthly)}/mo (same month early saver stops)</p>}
                  <p>Age {result.retireAge}: 🏁 Both retire — early saver&apos;s money coasted for <strong className="text-white">{result.earlyCoastYears} years</strong></p>
                </div>
              </div>

              {/* Key insight */}
              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                <div className="font-bold text-[#F9A825] mb-2">💡 What this tells us</div>
                {result.earlyWins ? (
                  <>
                    <p>The early saver contributed <strong>{fmt(result.earlyTotal)}</strong> — that is <strong>{((1 - result.earlyTotal / result.lateTotal) * 100).toFixed(0)}% less</strong> than the late saver&apos;s {fmt(result.lateTotal)}.</p>
                    <p className="mt-1">Yet the early saver ends up with <strong className="text-[#4ade80]">{((result.earlyFV / result.lateFV - 1) * 100).toFixed(0)}% more money</strong> at retirement.</p>
                    <p className="mt-2 font-bold text-[#F9A825]">Time in market beats amount invested.</p>
                    <p className="mt-1 text-[#a8a8b3]">The early saver&apos;s {fmt(result.earlyTotal)} had {result.earlyCoastYears} extra years of compounding. Those {result.earlyCoastYears} years of growth are worth more than all of the late saver&apos;s extra contributions.</p>
                  </>
                ) : (
                  <>
                    <p>The late saver wins here because they contributed <strong>{fmt(result.lateTotal)}</strong> vs the early saver&apos;s <strong>{fmt(result.earlyTotal)}</strong> — that is <strong className="text-[#e94560]">{result.lateTotal > 0 ? ((result.lateTotal / result.earlyTotal)).toFixed(1) : "—"}× more money</strong> invested.</p>
                    <p className="mt-1">Even so, the early saver&apos;s {fmt(result.earlyTotal)} grew to {fmt(result.earlyFV)} — <strong>{result.earlyTotal > 0 ? (result.earlyFV / result.earlyTotal).toFixed(1) : "—"}×</strong> their investment thanks to {result.earlyCoastYears} years of compounding.</p>
                    <p className="mt-2 p-3 rounded-lg bg-[#16213e] text-[#4FC3F7]">
                      💡 <strong>Try the classic scenario:</strong> Set both monthly contributions to the same amount (e.g. {fmt(result.earlyMonthly)}) to see the early saver win despite contributing for only {result.earlyYears} years vs {result.lateYears} years.
                    </p>
                  </>
                )}
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
