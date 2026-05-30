"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const CITY_INDEX: Record<string, number> = {
  "New York, NY": 187,
  "San Francisco, CA": 194,
  "Los Angeles, CA": 173,
  "Seattle, WA": 158,
  "Boston, MA": 162,
  "Washington DC": 152,
  "Chicago, IL": 107,
  "Austin, TX": 125,
  "Denver, CO": 128,
  "Miami, FL": 123,
  "Atlanta, GA": 107,
  "Dallas, TX": 105,
  "Phoenix, AZ": 103,
  "Portland, OR": 130,
  "Nashville, TN": 113,
  "Charlotte, NC": 97,
  "Columbus, OH": 91,
  "Indianapolis, IN": 88,
  "Kansas City, MO": 87,
  "Oklahoma City, OK": 83,
  "Memphis, TN": 80,
  "Detroit, MI": 84,
  "Pittsburgh, PA": 90,
  "Milwaukee, WI": 92,
  "Minneapolis, MN": 105,
  "St. Louis, MO": 86,
  "Salt Lake City, UT": 108,
  "San Diego, CA": 160,
  "Tampa, FL": 104,
  "Orlando, FL": 101,
}

const CITIES = Object.keys(CITY_INDEX).sort()

const CATEGORY_WEIGHTS: Record<string, number> = {
  Housing: 0.35,
  Groceries: 0.12,
  Transportation: 0.15,
  Healthcare: 0.10,
  Utilities: 0.08,
}

export default function CostOfLivingPage() {
  const [city1, setCity1] = useState("New York, NY")
  const [city2, setCity2] = useState("Austin, TX")
  const [salary, setSalary] = useState("100000")
  const [copied, setCopied] = useState(false)

  const calc = useMemo(() => {
    const idx1 = CITY_INDEX[city1] || 100
    const idx2 = CITY_INDEX[city2] || 100
    const sal = parseFloat(salary) || 0
    const equivalentSalary = sal * (idx2 / idx1)
    const diff = ((idx2 - idx1) / idx1) * 100
    const pctMore = diff > 0 ? diff.toFixed(1) : Math.abs(diff).toFixed(1)
    const moreOrLess = diff > 0 ? "more expensive" : diff < 0 ? "less expensive" : "same cost"

    const categories = Object.entries(CATEGORY_WEIGHTS).map(([cat, weight]) => {
      const city1Cost = sal * weight
      const city2Cost = sal * weight * (idx2 / idx1)
      const catDiff = ((city2Cost - city1Cost) / city1Cost * 100).toFixed(0)
      return { cat, city1Cost, city2Cost, catDiff: parseFloat(catDiff) }
    })

    const annualSavings = sal - equivalentSalary

    return { equivalentSalary, diff, pctMore, moreOrLess, categories, annualSavings, idx1, idx2 }
  }, [city1, city2, salary])

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Moving from ${city1} to ${city2} ${calc.annualSavings > 0 ? "saves" : "costs"} me ${fmt(Math.abs(calc.annualSavings))}/year! dayblip.com/finance/cost-of-living`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const sel = inp

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Cost of Living Comparison</h1>
          <p className="text-[#a8a8b3]">Compare the cost of living between two US cities</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">City 1 (current)</span>
              <select value={city1} onChange={e => setCity1(e.target.value)} className={sel}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">City 2 (destination)</span>
              <select value={city2} onChange={e => setCity2(e.target.value)} className={sel}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select></label>
            <label className="flex flex-col gap-1 md:col-span-2"><span className="text-sm font-semibold text-white">Current Salary in {city1} ($)</span>
              <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className={inp} /></label>
          </div>

          {/* Main result */}
          <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-6 text-center">
            <p className="text-[#a8a8b3] mb-1">To maintain your lifestyle in {city2} you need</p>
            <div className="text-5xl font-black text-[#F9A825]">{fmt(calc.equivalentSalary)}</div>
            <div className={`mt-2 font-semibold ${calc.diff > 0 ? "text-[#e94560]" : calc.diff < 0 ? "text-green-400" : "text-white"}`}>
              {city2} is {calc.pctMore}% {calc.moreOrLess} than {city1}
            </div>
            {calc.annualSavings !== 0 && (
              <div className={`mt-1 text-sm ${calc.annualSavings > 0 ? "text-green-400" : "text-[#e94560]"}`}>
                {calc.annualSavings > 0 ? `Save ${fmt(calc.annualSavings)}/year` : `Costs ${fmt(Math.abs(calc.annualSavings))}/year more`}
              </div>
            )}
          </div>

          {/* Category comparison */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Category Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Category</th>
                  <th className="py-2 text-right text-[#a8a8b3]">{city1.split(",")[0]}</th>
                  <th className="py-2 text-right text-[#a8a8b3]">{city2.split(",")[0]}</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Difference</th>
                </tr></thead>
                <tbody>
                  <tr className="border-b border-[#0f3460]/50 font-semibold">
                    <td className="py-2 text-white">Overall CoL Index</td>
                    <td className="py-2 text-right text-white">{calc.idx1}</td>
                    <td className="py-2 text-right text-white">{calc.idx2}</td>
                    <td className={`py-2 text-right font-bold ${calc.diff > 0 ? "text-[#e94560]" : "text-green-400"}`}>
                      {calc.diff > 0 ? "+" : ""}{calc.diff.toFixed(1)}%
                    </td>
                  </tr>
                  {calc.categories.map(r => (
                    <tr key={r.cat} className="border-b border-[#0f3460]/50">
                      <td className="py-2 text-[#a8a8b3]">{r.cat}</td>
                      <td className="py-2 text-right text-[#a8a8b3]">{fmt(r.city1Cost)}</td>
                      <td className="py-2 text-right text-white">{fmt(r.city2Cost)}</td>
                      <td className={`py-2 text-right ${r.catDiff > 0 ? "text-[#e94560]" : "text-green-400"}`}>
                        {r.catDiff > 0 ? "+" : ""}{r.catDiff}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#a8a8b3] mt-2">Estimates based on proportional CoL index (national avg = 100). Actual category costs vary.</p>
          </div>

          <button onClick={share} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white hover:opacity-90">
            {copied ? "Copied! ✓" : "Share Comparison →"}
          </button>
          <p className="text-xs text-[#a8a8b3]">Cost of living index data is approximate. Actual costs vary significantly by neighborhood, lifestyle and personal choices. For educational purposes only.</p>
        </div>
      </section>
    </div>
  )
}
