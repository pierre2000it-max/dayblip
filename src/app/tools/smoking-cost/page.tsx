"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fvAnnuity(monthly: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12
  if (r === 0) return monthly * months
  return monthly * ((Math.pow(1 + r, months) - 1) / r)
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmt2(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimates only.</strong> Health information is general in nature. Consult a healthcare provider for personalized guidance. Not financial advice.
  </div>
)

interface Result {
  perDay: number; packPrice: number; started: number; currentAge: number; rate: number
  packsPerDay: number; dailyCost: number; monthlyCost: number; annualCost: number
  yearsSmoking: number; totalSpent: number; investmentValue: number
  totalCigarettes: number; totalDays: number
  futureAnnual: number; futureYears: number
  futureInv5: number; futureInv10: number; futureInv20: number
}

function compute(perDay: number, packPrice: number, started: number, currentAge: number, rate: number): Result {
  const yearsSmoking  = Math.max(0, currentAge - started)
  const packsPerDay   = perDay / 20
  const dailyCost     = packsPerDay * packPrice
  const monthlyCost   = dailyCost * 30.5
  const annualCost    = dailyCost * 365
  const totalSpent    = Math.round(annualCost * yearsSmoking)
  const investmentValue = Math.round(fvAnnuity(monthlyCost, rate, yearsSmoking * 12))
  const totalCigarettes = Math.round(perDay * 365 * yearsSmoking)
  const totalMinutes  = totalCigarettes * 7
  const totalDays     = +(totalMinutes / 60 / 24).toFixed(1)
  const futureAnnual  = annualCost
  const futureYears   = Math.max(0, 65 - currentAge)
  const futureInv5    = Math.round(fvAnnuity(monthlyCost, rate, 60))
  const futureInv10   = Math.round(fvAnnuity(monthlyCost, rate, 120))
  const futureInv20   = Math.round(fvAnnuity(monthlyCost, rate, 240))
  return { perDay, packPrice, started, currentAge, rate, packsPerDay, dailyCost, monthlyCost, annualCost, yearsSmoking, totalSpent, investmentValue, totalCigarettes, totalDays, futureAnnual, futureYears, futureInv5, futureInv10, futureInv20 }
}

export default function SmokingCostPage() {
  const [perDay,      setPerDay]      = useState("10")
  const [packPrice,   setPackPrice]   = useState("9.50")
  const [started,     setStarted]     = useState("20")
  const [currentAge,  setCurrentAge]  = useState("40")
  const [rate,        setRate]        = useState("7")
  const [result,      setResult]      = useState<Result | null>(null)

  function runCalc(push = true, pd = perDay, pp = packPrice, st = started, ca = currentAge, r = rate) {
    const res = compute(parseFloat(pd)||0, parseFloat(pp)||0, parseFloat(st)||0, parseFloat(ca)||0, parseFloat(r)||7)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?perday=${pd}&price=${pp}&started=${st}&age=${ca}&rate=${r}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const pd = p.get("perday"), pp = p.get("price"), st = p.get("started"), ca = p.get("age"), r = p.get("rate")
    if (pd && ca) {
      if (pd) setPerDay(pd); if (pp) setPackPrice(pp); if (st) setStarted(st)
      if (ca) setCurrentAge(ca); if (r) setRate(r)
      runCalc(false, pd, pp ?? packPrice, st ?? started, ca, r ?? rate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl  = result ? `https://www.dayblip.com/tools/smoking-cost?perday=${perDay}&price=${packPrice}&started=${started}&age=${currentAge}&rate=${rate}` : ""
  const shareText = result
    ? `I have spent ${fmt(result.totalSpent)} on cigarettes since age ${result.started}.\nIf invested instead: ${fmt(result.investmentValue)}!\nPlus ${result.totalDays} full days of my life spent smoking.\n(Educational only)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">The True Cost of Smoking</h1>
          <p className="text-[#a8a8b3]">Calculate the full financial and health cost of your smoking habit</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          {DISCLAIMER}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { label: "Cigarettes per day", val: perDay, set: setPerDay, prefix: undefined },
              { label: "Price per pack ($)", val: packPrice, set: setPackPrice, prefix: "$" },
              { label: "Age started smoking", val: started, set: setStarted, prefix: undefined },
              { label: "Current age", val: currentAge, set: setCurrentAge, prefix: undefined },
              { label: "Investment return (%)", val: rate, set: setRate, prefix: undefined },
            ].map(({ label, val, set, prefix }) => (
              <label key={label} className="block">
                <span className="mb-1 block text-sm font-semibold text-white">{label}</span>
                <div className="flex items-center gap-2">
                  {prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
                  <input type="number" step="0.01" value={val} onChange={e => set(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </div>
              </label>
            ))}
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My True Cost
          </button>

          {result && (
            <div className="space-y-6">
              {/* Financial cost */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">Total spent on cigarettes in {result.yearsSmoking} years of smoking</div>
                <div className="my-1 text-5xl font-black text-[#e94560]">{fmt(result.totalSpent)}</div>
                <div className="text-sm text-[#a8a8b3]">{fmt2(result.dailyCost)}/day · {fmt(result.monthlyCost)}/month · {fmt(result.annualCost)}/year</div>
              </div>

              {/* Investment comparison */}
              <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-6 text-white">
                <div className="font-bold text-[#4ade80] mb-2">📈 If invested at {result.rate}% instead since age {result.started}</div>
                <div className="text-3xl font-black text-[#4ade80]">{fmt(result.investmentValue)}</div>
                <p className="mt-2 text-sm text-[#a8a8b3]">You have the cigarettes. You could have had <span className="font-bold text-white">{fmt(result.investmentValue)}</span>.</p>
              </div>

              {/* Time cost */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-white mb-2">⏱️ Time cost of smoking</div>
                <p>Total cigarettes smoked: <span className="font-bold text-[#F9A825]">{result.totalCigarettes.toLocaleString()}</span></p>
                <p className="mt-1">Time spent smoking: <span className="font-bold text-[#F9A825]">{result.totalDays} full days</span> of your life just smoking</p>
              </div>

              {/* Quit calculation */}
              {result.futureYears > 0 && (
                <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                  <div className="font-bold text-[#4ade80] mb-2">💚 If you quit today and invested the savings at {result.rate}%</div>
                  {[["5 years", result.futureInv5], ["10 years", result.futureInv10], ["20 years", result.futureInv20]].map(([yr, v]) => (
                    <p key={String(yr)} className="mt-1 text-[#a8a8b3]">
                      In <span className="font-bold text-white">{yr}</span>: <span className="font-bold text-[#4ade80]">{fmt(+v)}</span>
                    </p>
                  ))}
                  <p className="mt-2 text-xs text-[#a8a8b3]">Based on investing {fmt(result.monthlyCost)}/month</p>
                </div>
              )}

              {/* Health context */}
              <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-[#4FC3F7] mb-1">🔬 General health research context</div>
                <p className="text-[#a8a8b3]">According to CDC data, smoking is associated with significant health risks. The financial cost above does not include potential healthcare costs associated with smoking-related conditions.</p>
                <div className="mt-3 p-3 rounded-lg bg-[#16213e]">
                  <div className="font-bold text-white">For help quitting (free US resources):</div>
                  <p className="mt-1 text-[#4ade80] font-bold">1-800-QUIT-NOW</p>
                  <p className="text-[#a8a8b3]">smokefree.gov — free quit plans and support</p>
                </div>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="True Cost of Smoking Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
