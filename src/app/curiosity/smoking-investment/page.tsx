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

export default function SmokingInvestmentPage() {
  const [packsDay, setPacksDay]   = useState(1)
  const [priceStr, setPriceStr]   = useState("9.50")
  const [ageStarted, setAgeStart] = useState("20")
  const [currentAge, setCurrentAge] = useState("35")
  const [rate, setRate]           = useState(10.5)
  const price = parseFloat(priceStr) || 0
  const r     = rate / 100

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("packs")) setPacksDay(Number(p.get("packs")))
    if (p.get("price")) setPriceStr(p.get("price")!)
    if (p.get("started")) setAgeStart(p.get("started")!)
    if (p.get("current")) setCurrentAge(p.get("current")!)
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const calc = useMemo(() => {
    const as  = parseInt(ageStarted) || 0
    const ca  = parseInt(currentAge) || 0
    const yrs = Math.max(0, ca - as)
    const perDay     = packsDay * price
    const perMonth   = perDay * 365 / 12
    const perYear    = perDay * 365
    const totalSpent = perYear * yrs
    const totalPacks = packsDay * 365 * yrs
    const totalCigs  = totalPacks * 20
    const pastInvested = fv(perMonth, r, yrs)
    const futureToAge65 = fv(perMonth, r, Math.max(0, 65 - ca))
    const lifetimeCost  = perYear * 65  // rough
    return { perDay, perMonth, perYear, totalSpent, totalPacks, totalCigs, pastInvested, futureToAge65, yrs, lifetimeCost }
  }, [packsDay, priceStr, ageStarted, currentAge, r])


  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Smoking Investment Calculator — Financial Cost of Smoking Over Time</h1>
          <p className="text-[#a8a8b3]">See what smoking costs you financially and what investing instead could build</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A pack-a-day smoker spending $9.50 per pack spends $3,468 per year on cigarettes. Over 20 years that is $69,360 spent. If invested at 7% annual return instead that same money grows to $179,000 over 20 years and $468,000 over 30 years. Quitting and investing the savings is one of the highest-return financial decisions a smoker can make.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The smoking investment calculator shows the opportunity cost of tobacco spending by projecting what the same money would be worth if invested in a stock market index fund over time. It also calculates total lifetime spending on cigarettes from your starting age to any target age.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Packs per day: {packsDay}</span>
              <input type="range" min={0.5} max={3} step={0.5} value={packsDay} onChange={e => setPacksDay(Number(e.target.value))} className="mt-2 accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Price per pack ($) <span className="text-[#a8a8b3] font-normal">(varies by state)</span></span>
              <input type="number" step="0.25" value={priceStr} onChange={e => setPriceStr(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Age started smoking</span>
              <input type="number" value={ageStarted} onChange={e => setAgeStart(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current age</span>
              <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 avg: 10.5%)</span></span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Costs */}
          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🚬 Smoking Costs</h2>
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              {[
                { label: "Per day", value: `$${calc.perDay.toFixed(2)}` },
                { label: "Per month", value: fmt(calc.perMonth) },
                { label: "Per year", value: fmt(calc.perYear) },
                { label: `Total spent (${calc.yrs} years)`, value: fmt(calc.totalSpent) },
                { label: "Total packs smoked", value: Math.round(calc.totalPacks).toLocaleString() },
                { label: "Total cigarettes", value: Math.round(calc.totalCigs).toLocaleString() },
              ].map(r => (
                <div key={r.label} className="flex justify-between border-b border-[#0f3460]/50 py-1.5">
                  <span className="text-[#a8a8b3]">{r.label}</span>
                  <span className="text-white font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BIG NUMBER — past */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">If invested from age {ageStarted} to {currentAge}:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.pastInvested)}</div>
            <p className="text-[#a8a8b3] mt-1">your smoking money could have been worth</p>
          </div>

          {/* Future value */}
          <div className="rounded-xl border border-[#4ade80]/20 bg-green-900/10 p-6 text-center">
            <p className="text-[#a8a8b3] mb-2">If you quit now and invest {fmt(calc.perMonth)}/month until age 65:</p>
            <div className="text-4xl font-black text-[#4ade80]">{fmt(calc.futureToAge65)}</div>
          </div>

          {/* Health note */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-sm text-[#a8a8b3]">
            <strong className="text-white">📋 Note:</strong> According to the CDC, smoking-related illness costs the US $300 billion annually in healthcare and lost productivity.
            This calculator addresses only the financial impact and is for educational purposes only.
          </div>

          <ShareButtons
            text={`Smoking has cost me ${fmt(calc.totalSpent)} so far. Invested instead it would be ${fmt(calc.pastInvested)}! (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/smoking-investment?packs=${packsDay}&price=${priceStr}&started=${ageStarted}&current=${currentAge}&rate=${rate}`}
            title="Smoking Investment Calculator"
          />
          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
