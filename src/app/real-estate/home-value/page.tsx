"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const HOME_PRICES: Record<number, number> = {
  1950: 7354, 1960: 11900, 1970: 23450, 1980: 76400,
  1990: 149800, 2000: 244900, 2010: 272900, 2020: 407700, 2026: 420000,
}
const YEARS = Object.keys(HOME_PRICES).map(Number).sort((a, b) => a - b)
const CURRENT = HOME_PRICES[2026]

export default function HomeValuePage() {
  const [mode, setMode] = useState<"past" | "future">("past")
  const [pricePaid, setPricePaid] = useState("200000")
  const [purchaseYear, setPurchaseYear] = useState(2000)
  const [currentValue, setCurrentValue] = useState("420000")
  const [annualRate, setAnnualRate] = useState("3")
  const [futureYears, setFutureYears] = useState("10")
  const [copied, setCopied] = useState(false)

  const calc = useMemo(() => {
    if (mode === "past") {
      const paid = parseFloat(pricePaid) || 0
      const histMedian = HOME_PRICES[purchaseYear] || CURRENT
      const estimatedValue = (paid * CURRENT) / histMedian
      const gain = estimatedValue - paid
      const gainPct = paid > 0 ? (gain / paid * 100).toFixed(1) : "0"
      return { result: estimatedValue, label: `Estimated value today`, gain, gainPct: `+${gainPct}%` }
    } else {
      const cv = parseFloat(currentValue) || 0
      const rate = (parseFloat(annualRate) || 0) / 100
      const yrs = parseFloat(futureYears) || 0
      const fv = cv * Math.pow(1 + rate, yrs)
      const gain = fv - cv
      const gainPct = cv > 0 ? (gain / cv * 100).toFixed(1) : "0"
      return { result: fv, label: `Estimated value in ${futureYears} years`, gain, gainPct: `+${gainPct}%` }
    }
  }, [mode, pricePaid, purchaseYear, currentValue, annualRate, futureYears])

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const inp = sel

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Historical Home Value Calculator</h1>
          <p className="text-[#a8a8b3]">See how home values have changed over the decades</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="flex gap-2">
            {([["past", "🏠 Past Purchase"], ["future", "📈 Future Value"]] as const).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-3 font-semibold text-sm transition-colors ${mode === m ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "past" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Price You Paid ($)</span>
                <input type="number" value={pricePaid} onChange={e => setPricePaid(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Year Purchased</span>
                <select value={purchaseYear} onChange={e => setPurchaseYear(Number(e.target.value))} className={sel}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select></label>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current Value ($)</span>
                <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Appreciation (%)</span>
                <input type="number" step="0.1" value={annualRate} onChange={e => setAnnualRate(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Years</span>
                <input type="number" value={futureYears} onChange={e => setFutureYears(e.target.value)} className={inp} /></label>
            </div>
          )}

          <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-4xl font-black text-[#F9A825]">{fmt(calc.result)}</div>
            <div className="text-[#a8a8b3] mt-1">{calc.label}</div>
            <div className="text-green-400 font-semibold mt-1">{calc.gainPct} gain ({fmt(calc.gain)})</div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 US Median Home Prices</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Year</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Median Price</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Change</th>
                </tr></thead>
                <tbody>{YEARS.map((yr, i) => {
                  const prev = i > 0 ? HOME_PRICES[YEARS[i - 1]] : null
                  const chg = prev ? (((HOME_PRICES[yr] - prev) / prev) * 100).toFixed(0) + "%" : "—"
                  return (
                    <tr key={yr} className="border-b border-[#0f3460]/50">
                      <td className="py-2 text-white">{yr}</td>
                      <td className="py-2 text-right text-[#F9A825]">{fmt(HOME_PRICES[yr])}</td>
                      <td className="py-2 text-right text-[#4ade80]">{chg}</td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </div>

          <button onClick={share} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white hover:opacity-90">
            {copied ? "Copied! ✓" : "Share →"}
          </button>
          <p className="text-xs text-[#a8a8b3]">Estimates based on US median home price trends. Individual property values vary significantly. Not real estate advice.</p>
        </div>
      </section>
    </div>
  )
}
