"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

// ─── module-scope simulation (no stale closures) ─────────────────────────────
function simulateDebt(balance: number, annualRate: number, minPct: number, extra: number) {
  let bal = balance
  let months = 0
  let totalInterest = 0
  let totalPaid = 0
  while (bal > 0.01 && months < 600) {
    const interest = bal * (annualRate / 100 / 12)
    totalInterest += interest
    bal += interest
    const minPay = Math.max(bal * (minPct / 100), 25)
    const payment = Math.min(bal, minPay + extra)
    bal -= payment
    totalPaid += payment
    months++
  }
  return { months, totalInterest: Math.round(totalInterest), totalPaid: Math.round(totalPaid) }
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmtMonths(m: number) {
  const y = Math.floor(m / 12)
  const mo = m % 12
  if (y === 0) return `${mo} months`
  if (mo === 0) return `${y} year${y !== 1 ? "s" : ""}`
  return `${y} yr ${mo} mo`
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimate.</strong> Actual payments vary. Contact your card issuer for exact payoff calculations. Not financial advice.
  </div>
)

interface Result {
  balance: number; rate: number; minPct: number; extra: number
  minOnly: { months: number; totalInterest: number; totalPaid: number }
  withExtra: { months: number; totalInterest: number; totalPaid: number }
  scenarios: { extra: number; months: number; totalInterest: number; totalPaid: number }[]
}

function compute(balance: number, rate: number, minPct: number, extra: number): Result {
  const minOnly   = simulateDebt(balance, rate, minPct, 0)
  const withExtra = extra > 0 ? simulateDebt(balance, rate, minPct, extra) : minOnly
  const scenarios = [0, 50, 100, 200].map(e => ({ extra: e, ...simulateDebt(balance, rate, minPct, e) }))
  return { balance, rate, minPct, extra, minOnly, withExtra, scenarios }
}

export default function MinimumPaymentPage() {
  const [balance, setBalance] = useState("8000")
  const [rate,    setRate]    = useState("19.99")
  const [minPct,  setMinPct]  = useState("2")
  const [extra,   setExtra]   = useState("0")
  const [result,  setResult]  = useState<Result | null>(null)

  function runCalc(push = true, b = balance, r = rate, mp = minPct, ex = extra) {
    const res = compute(parseFloat(b) || 0, parseFloat(r) || 0, parseFloat(mp) || 2, parseFloat(ex) || 0)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?balance=${b}&rate=${r}&minpct=${mp}&extra=${ex}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const b = p.get("balance"), r = p.get("rate"), mp = p.get("minpct"), ex = p.get("extra")
    if (b && r) {
      if (b) setBalance(b); if (r) setRate(r); if (mp) setMinPct(mp); if (ex) setExtra(ex)
      runCalc(false, b ?? balance, r ?? rate, mp ?? minPct, ex ?? extra)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl  = result ? `https://www.dayblip.com/tools/minimum-payment?balance=${balance}&rate=${rate}&minpct=${minPct}&extra=${extra}` : ""
  const shareText = result
    ? `Paying only minimums on ${fmt(result.balance)} at ${result.rate}% takes ${fmtMonths(result.minOnly.months)} and costs ${fmt(result.minOnly.totalInterest)} in interest!\nYou pay back ${fmt(result.minOnly.totalPaid)} on a ${fmt(result.balance)} debt!\nCalculate yours:\n(Educational only)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Minimum Payment True Cost Calculator", "See the shocking true cost of only paying credit card minimums. Calculate exactly how long it takes and how much interest you pay.", "https://www.dayblip.com/tools/minimum-payment", "FinanceApplication"),
        faqSchema([
          { question: "How long does it take to pay off credit card debt paying minimums only?", answer: "On $8,000 of credit card debt at 19.99% interest paying minimums only, it takes approximately 27 years and costs over $16,000 in interest — more than double the original debt." },
          { question: "How much interest do I pay on minimum payments?", answer: "On a typical credit card balance paying minimums only, total interest often exceeds the original balance. You can end up paying 200-300% of what you originally borrowed." },
          { question: "How can I pay off credit card debt faster?", answer: "Adding even $50-100 extra per month to your payment dramatically reduces payoff time and total interest. Adding $100/month to an $8,000 balance at 19.99% saves over $13,000 in interest." },
        ]),
        howToSchema("How to Calculate True Cost of Minimum Payments", "See the full cost of paying only the minimum", [
          "Enter your credit card balance",
          "Enter your interest rate",
          "Select minimum payment type — percentage or fixed",
          "Optionally enter extra monthly payment amount",
          "Click Calculate True Cost to see full breakdown",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Minimum Payment Calculator", url: "https://www.dayblip.com/tools/minimum-payment" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">What Is Your Minimum Payment Really Costing You?</h1>
          <p className="text-[#a8a8b3]">See the shocking true cost of only paying minimums on your debt</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          {DISCLAIMER}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Credit card balance ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={balance} onChange={e => setBalance(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Interest rate (%)</span>
              <input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Minimum payment (% of balance)</span>
              <input type="number" step="0.5" value={minPct} onChange={e => setMinPct(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Extra monthly payment ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={extra} onChange={e => setExtra(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate True Cost
          </button>

          {result && (
            <div className="space-y-6">
              {/* Shocking fact */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">You borrowed {fmt(result.balance)}. Paying minimums only…</div>
                <div className="my-1 text-4xl font-black text-[#e94560]">{fmt(result.minOnly.totalPaid)}</div>
                <div className="text-sm text-[#a8a8b3]">total paid back — including <span className="font-bold text-white">{fmt(result.minOnly.totalInterest)}</span> in pure interest</div>
                <div className="mt-2 font-bold text-[#FF6B6B]">That is {((result.minOnly.totalInterest / result.balance) * 100).toFixed(0)}% more than you borrowed</div>
              </div>

              {/* Minimum only stats */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                <div className="font-bold text-white mb-3">💳 Paying minimums only on {fmt(result.balance)} at {result.rate}%</div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[["Time to pay off", fmtMonths(result.minOnly.months), "#e94560"],
                    ["Total interest", fmt(result.minOnly.totalInterest), "#FF6B6B"],
                    ["Total paid back", fmt(result.minOnly.totalPaid), "#ffffff"],
                    ["Interest ratio", `${((result.minOnly.totalInterest / result.balance) * 100).toFixed(0)}%`, "#FF6B6B"]
                  ].map(([l, v, c]) => (
                    <div key={String(l)} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-3 text-center">
                      <div className="font-black" style={{ color: c }}>{v}</div>
                      <div className="mt-0.5 text-xs text-[#a8a8b3]">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* With extra payment */}
              {result.extra > 0 && (
                <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-3">✅ With an extra ${result.extra}/month</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["Time to pay off", fmtMonths(result.withExtra.months)],
                      ["Total interest", fmt(result.withExtra.totalInterest)],
                      ["Interest saved", fmt(result.minOnly.totalInterest - result.withExtra.totalInterest)],
                      ["Months saved", `${result.minOnly.months - result.withExtra.months} months`]
                    ].map(([l, v]) => (
                      <div key={String(l)} className="flex justify-between border-b border-[#0f3460] py-1.5">
                        <span className="text-[#a8a8b3]">{l}</span>
                        <span className="font-bold text-[#4ade80]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison table */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm overflow-x-auto">
                <div className="font-bold text-white mb-3">What extra payments do</div>
                <table className="w-full min-w-[400px]">
                  <thead><tr className="border-b border-[#0f3460] text-xs text-[#a8a8b3]">
                    <th className="py-1.5 text-left">Strategy</th>
                    <th className="py-1.5 text-right">Payoff time</th>
                    <th className="py-1.5 text-right">Total interest</th>
                    <th className="py-1.5 text-right">Total paid</th>
                  </tr></thead>
                  <tbody className="text-white">
                    {result.scenarios.map(s => (
                      <tr key={s.extra} className="border-b border-[#0f3460]">
                        <td className="py-1.5">{s.extra === 0 ? "Minimum only" : `+${fmt(s.extra)}/mo`}</td>
                        <td className="py-1.5 text-right">{fmtMonths(s.months)}</td>
                        <td className="py-1.5 text-right text-[#FF6B6B]">{fmt(s.totalInterest)}</td>
                        <td className="py-1.5 text-right">{fmt(s.totalPaid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reality box */}
              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                <div className="font-bold text-[#F9A825] mb-1">💡 Reality check</div>
                <p>On {fmt(result.balance)} at {result.rate}% paying minimum only: takes {fmtMonths(result.minOnly.months)} to pay off and costs {fmt(result.minOnly.totalInterest)} in interest. You pay back more than {((result.minOnly.totalPaid / result.balance)).toFixed(1)}× what you borrowed.</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Minimum Payment True Cost Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
