"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const stateTaxRates: Record<string, number> = {
  "Alaska": 0, "Florida": 0, "Nevada": 0, "New Hampshire": 0, "South Dakota": 0, "Tennessee": 0,
  "Texas": 0, "Washington": 0, "Wyoming": 0, "Arizona": 0.025, "Colorado": 0.044, "Indiana": 0.0315,
  "Kentucky": 0.04, "Michigan": 0.0425, "Mississippi": 0.047, "North Carolina": 0.045,
  "Pennsylvania": 0.0307, "Utah": 0.0465, "Georgia": 0.0549, "Missouri": 0.0495, "Ohio": 0.0399,
  "Virginia": 0.0575, "Alabama": 0.05, "Louisiana": 0.0425, "New Mexico": 0.059, "Arkansas": 0.059,
  "Montana": 0.0675, "West Virginia": 0.065, "Maryland": 0.0575, "Illinois": 0.0495,
  "Massachusetts": 0.05, "Nebraska": 0.0664, "Delaware": 0.066, "Idaho": 0.058, "Kansas": 0.057,
  "Oklahoma": 0.0475, "South Carolina": 0.065, "Wisconsin": 0.0765, "Connecticut": 0.069,
  "Iowa": 0.06, "Maine": 0.0715, "Rhode Island": 0.0599, "Vermont": 0.0875, "Hawaii": 0.11,
  "New Jersey": 0.1075, "Minnesota": 0.0985, "Oregon": 0.099, "California": 0.133, "New York": 0.109,
}

const propertyTaxRates: Record<string, number> = {
  "Hawaii": 0.0028, "Alabama": 0.004, "Colorado": 0.0051, "Nevada": 0.0053, "South Carolina": 0.0057,
  "Wyoming": 0.0061, "Louisiana": 0.0055, "Delaware": 0.0061, "Utah": 0.0063, "Arizona": 0.0063,
  "Idaho": 0.0069, "Tennessee": 0.007, "California": 0.0073, "West Virginia": 0.0083, "Mississippi": 0.008,
  "Arkansas": 0.0065, "Georgia": 0.0092, "Montana": 0.0084, "Florida": 0.0089, "Virginia": 0.0082,
  "New Mexico": 0.0079, "North Carolina": 0.0084, "Oklahoma": 0.0099, "Missouri": 0.0099,
  "Washington": 0.0093, "Indiana": 0.0085, "Kentucky": 0.0086, "Alaska": 0.0101, "Massachusetts": 0.012,
  "Maryland": 0.0112, "Oregon": 0.0097, "South Dakota": 0.0124, "North Dakota": 0.0099, "Maine": 0.0136,
  "Iowa": 0.0153, "Minnesota": 0.0105, "Pennsylvania": 0.0153, "Ohio": 0.0163, "Rhode Island": 0.0163,
  "Nebraska": 0.0176, "Michigan": 0.0162, "Vermont": 0.0178, "Connecticut": 0.019, "Wisconsin": 0.0183,
  "Texas": 0.018, "New York": 0.017, "Kansas": 0.013, "New Hampshire": 0.0204, "Illinois": 0.0228,
  "New Jersey": 0.0247,
}

const STATES = Object.keys(stateTaxRates).sort()

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Tax estimates are educational approximations using flat rates.</strong> Actual taxes depend on deductions, filing status and other factors. Consult a tax professional.
  </div>
)

interface Result {
  from: string; to: string; income: number; home: number
  currentTax: number; targetTax: number; savings: number
  currentProp: number; targetProp: number; propSavings: number
  combined: number; fromRate: number; toRate: number
}

export default function TaxMigrationPage() {
  const [from, setFrom] = useState("California")
  const [to, setTo] = useState("Texas")
  const [income, setIncome] = useState("150000")
  const [home, setHome] = useState("")
  const [result, setResult] = useState<Result | null>(null)

  function compute(f: string, t: string, inc: number, hv: number): Result {
    const currentTax = inc * stateTaxRates[f]
    const targetTax = inc * stateTaxRates[t]
    const savings = currentTax - targetTax
    const currentProp = hv * (propertyTaxRates[f] ?? 0)
    const targetProp = hv * (propertyTaxRates[t] ?? 0)
    const propSavings = currentProp - targetProp
    return {
      from: f, to: t, income: inc, home: hv, currentTax, targetTax, savings,
      currentProp, targetProp, propSavings, combined: savings + propSavings,
      fromRate: stateTaxRates[f] * 100, toRate: stateTaxRates[t] * 100,
    }
  }

  function runCalc(f = from, t = to, inc = parseFloat(income) || 0, hv = parseFloat(home) || 0, push = true) {
    const res = compute(f, t, inc, hv)
    setResult(res)
    if (push && typeof window !== "undefined") {
      const params = new URLSearchParams({ from: f, to: t, income: String(inc) })
      if (hv) params.set("home", String(hv))
      window.history.pushState({}, "", `?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const f = p.get("from"); const t = p.get("to"); const inc = p.get("income"); const hv = p.get("home")
    if (f && stateTaxRates[f] !== undefined && t && stateTaxRates[t] !== undefined && inc) {
      setFrom(f); setTo(t); setIncome(inc); if (hv) setHome(hv)
      runCalc(f, t, Number(inc), hv ? Number(hv) : 0, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const invested = result ? result.combined * (Math.pow(1.07, 30) - 1) / 0.07 : 0

  const shareUrl = result ? `https://www.dayblip.com/tools/tax-migration?from=${encodeURIComponent(result.from)}&to=${encodeURIComponent(result.to)}&income=${result.income}` : ""
  const shareText = result ? `Moving from ${result.from} to ${result.to} could save me ${fmt(result.savings)}/year in state taxes! Over 10 years that is ${fmt(result.savings * 10)}! (Educational estimate — not tax advice)` : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">State Tax Savings Calculator — How Much Would Moving States Save You?</h1>
          <p className="text-[#a8a8b3]">Calculate your annual tax savings from moving to a lower tax state</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Moving from California to Texas on a $150,000 salary saves approximately $11,565 per year in state income tax. California taxes at 9.3% while Texas has zero state income tax. Over 10 years that difference is $115,650 before investment growth. Nine US states have no income tax including Texas, Florida, Nevada and Washington.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">State income tax varies from 0% in nine states to over 13% in California. For high earners the state of residence can make a six-figure difference in lifetime tax burden. This calculator shows the exact annual and lifetime tax savings from relocating to a lower-tax state based on your income and current state.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Current state</span>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Target state</span>
              <select value={to} onChange={e => setTo(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Annual income</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={income} onChange={e => setIncome(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Home value (optional)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={home} onChange={e => setHome(e.target.value)} placeholder="e.g. 500000"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></div>
            </label>
            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate Savings
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <p className="text-sm text-[#a8a8b3]">In {result.from} you pay approximately:</p>
                  <p className="text-2xl font-black text-[#FF6B6B]">{fmt(result.currentTax)}/yr</p>
                  <p className="text-xs text-[#a8a8b3]">{result.fromRate.toFixed(2)}% effective rate</p>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <p className="text-sm text-[#a8a8b3]">In {result.to} you would pay:</p>
                  <p className="text-2xl font-black text-[#4ade80]">{fmt(result.targetTax)}/yr</p>
                  <p className="text-xs text-[#a8a8b3]">{result.toRate.toFixed(2)}% effective rate</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <p className="mb-2 text-[#a8a8b3]">Annual income tax savings</p>
                <div className="text-5xl font-black" style={{ color: result.savings >= 0 ? "#4ade80" : "#FF6B6B" }}>{fmt(result.savings)}</div>
              </div>

              {result.home > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm">
                  <h3 className="mb-2 font-bold text-white">Property tax</h3>
                  <p className="text-[#a8a8b3]">In {result.from}: <span className="text-white">{fmt(result.currentProp)}/yr</span></p>
                  <p className="text-[#a8a8b3]">In {result.to}: <span className="text-white">{fmt(result.targetProp)}/yr</span></p>
                  <p className="mt-1 font-bold" style={{ color: result.propSavings >= 0 ? "#4ade80" : "#FF6B6B" }}>Difference: {fmt(result.propSavings)}/yr</p>
                </div>
              )}

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3]">Total annual tax savings</p>
                <div className="text-3xl font-black text-[#F9A825]">{fmt(result.combined)}</div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-3 font-bold text-white">Savings over time</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span className="text-[#a8a8b3]">5 years</span><span className="font-bold text-white">{fmt(result.combined * 5)}</span></li>
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span className="text-[#a8a8b3]">10 years</span><span className="font-bold text-white">{fmt(result.combined * 10)}</span></li>
                  <li className="flex justify-between border-b border-[#0f3460] pb-1.5"><span className="text-[#a8a8b3]">20 years</span><span className="font-bold text-white">{fmt(result.combined * 20)}</span></li>
                  <li className="flex justify-between"><span className="text-[#a8a8b3]">Invested at 7% (30 yrs)</span><span className="font-bold text-[#4ade80]">{fmt(invested)}</span></li>
                </ul>
              </div>

              {stateTaxRates[result.to] === 0 && (
                <div className="rounded-xl border border-[#4ade80]/40 bg-[#4ade80]/10 p-5 text-sm text-white">
                  <strong className="text-[#4ade80]">{result.to} has NO state income tax!</strong> You save 100% of your state income tax.
                </div>
              )}

              <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5 text-sm text-[#a8a8b3]">
                <strong className="text-white">Note:</strong> Cost of living also varies between states which may offset or amplify these tax savings.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="State Tax Migration Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
