"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const cpiAdjustment: Record<number, number> = {
  1970: 7.8, 1975: 5.8, 1980: 3.7, 1985: 2.9, 1990: 2.4, 1995: 2.0,
  2000: 1.75, 2005: 1.54, 2010: 1.37, 2015: 1.19, 2020: 1.06, 2024: 1.0,
}
const CPI_YEARS = Object.keys(cpiAdjustment).map(Number).sort((a, b) => a - b)
function cpiFor(year: number): number {
  let closest = CPI_YEARS[0]
  for (const y of CPI_YEARS) if (Math.abs(y - year) < Math.abs(closest - year)) closest = y
  return cpiAdjustment[closest]
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimates.</strong> Individual circumstances vary significantly.
  </div>
)

interface Result {
  netWorth: number; income: number
  adjustedNetWorth: number; adjustedIncome: number
  nwGap: number; nwPct: number; incomeGap: number
  parentsYear: number
}

export default function GenerationalWealthPage() {
  const [age, setAge] = useState("35")
  const [netWorth, setNetWorth] = useState("80000")
  const [income, setIncome] = useState("75000")
  const [parentsNW, setParentsNW] = useState("60000")
  const [parentsIncome, setParentsIncome] = useState("32000")
  const [parentsYear, setParentsYear] = useState("1995")
  const [result, setResult] = useState<Result | null>(null)

  function compute(push = true): Result {
    const nw = parseFloat(netWorth) || 0
    const inc = parseFloat(income) || 0
    const pnw = parseFloat(parentsNW) || 0
    const pinc = parseFloat(parentsIncome) || 0
    const py = parseInt(parentsYear) || 1995
    const cpi = cpiFor(py)
    const adjustedNetWorth = pnw * cpi
    const adjustedIncome = pinc * cpi
    const res: Result = {
      netWorth: nw, income: inc, adjustedNetWorth, adjustedIncome,
      nwGap: nw - adjustedNetWorth,
      nwPct: adjustedNetWorth > 0 ? ((nw - adjustedNetWorth) / adjustedNetWorth) * 100 : 0,
      incomeGap: inc - adjustedIncome, parentsYear: py,
    }
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?age=${age}&nw=${nw}&income=${inc}&pnw=${pnw}&pincome=${pinc}&pyear=${py}`)
    }
    return res
  }

  function runCalc() { setResult(compute()) }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("nw") || p.get("pnw")) {
      if (p.get("age")) setAge(p.get("age")!)
      if (p.get("nw")) setNetWorth(p.get("nw")!)
      if (p.get("income")) setIncome(p.get("income")!)
      if (p.get("pnw")) setParentsNW(p.get("pnw")!)
      if (p.get("pincome")) setParentsIncome(p.get("pincome")!)
      if (p.get("pyear")) setParentsYear(p.get("pyear")!)
      setTimeout(() => setResult(compute(false)), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generations = [
    { name: "Silent Gen", share: "21%" },
    { name: "Baby Boomers", share: "21%" },
    { name: "Gen X", share: "16%" },
    { name: "Millennials", share: "5%" },
  ]

  const shareUrl = result && typeof window !== "undefined" ? (window.location.origin + window.location.pathname + window.location.search) : "https://www.dayblip.com/tools/generational-wealth"
  const shareText = "The generational wealth gap is real. I compared my finances to where my parents were at my age. Eye-opening results: (Educational only)"

  const field = (label: string, value: string, set: (v: string) => void, prefix = "$") => (
    <label className="block"><span className="mb-1 block text-sm font-semibold text-white">{label}</span>
      <div className="flex items-center gap-1">{prefix && <span className="text-[#a8a8b3]">{prefix}</span>}
        <input type="number" value={value} onChange={e => set(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none" /></div>
    </label>
  )

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Generational Wealth Gap Calculator — How Do You Compare to Your Parents at Your Age?</h1>
          <p className="text-[#a8a8b3]">Compare your finances to where your parents were at your exact age</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Baby Boomers at age 35 had a median net worth of $82,000 in today&apos;s dollars. Millennials at age 35 have a median net worth of $51,000 — 38% lower than their parents at the same age. Adjusted for inflation Boomers accumulated wealth 70% faster than Millennials due to lower housing costs, cheaper education and stronger wage growth relative to living expenses.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The generational wealth gap measures the difference in wealth accumulation between generations at the same life stages. Factors including rising housing costs, student loan debt, wage stagnation and the 2008 financial crisis have significantly impacted Millennial and Gen Z wealth building compared to previous generations at equivalent ages.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-4">
            <h3 className="font-bold text-white">Your information</h3>
            <div className="grid grid-cols-3 gap-3">
              {field("Your age", age, setAge, "")}
              {field("Your net worth", netWorth, setNetWorth)}
              {field("Your income", income, setIncome)}
            </div>
            <h3 className="font-bold text-white">Your parents (estimated, when they were your age)</h3>
            <div className="grid grid-cols-3 gap-3">
              {field("Their net worth", parentsNW, setParentsNW)}
              {field("Their income", parentsIncome, setParentsIncome)}
              {field("Year", parentsYear, setParentsYear, "")}
            </div>
            <button onClick={runCalc} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Compare Generations
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-white">Net worth comparison</h3>
                <p>Your net worth: <span className="font-bold">{fmt(result.netWorth)}</span></p>
                <p>Parents at your age (inflation adjusted): <span className="font-bold">{fmt(result.adjustedNetWorth)}</span></p>
                <p className="mt-1 text-lg font-black" style={{ color: result.nwGap >= 0 ? "#4ade80" : "#FF6B6B" }}>
                  You are {fmt(Math.abs(result.nwGap))} {result.nwGap >= 0 ? "ahead" : "behind"} ({Math.abs(result.nwPct).toFixed(0)}% {result.nwPct >= 0 ? "ahead of" : "behind"} where your parents were)
                </p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-white">Income comparison</h3>
                <p>Your income: <span className="font-bold">{fmt(result.income)}</span></p>
                <p>Parents at your age (adjusted): <span className="font-bold">{fmt(result.adjustedIncome)}</span></p>
                <p className="mt-1 font-bold" style={{ color: result.incomeGap >= 0 ? "#4ade80" : "#FF6B6B" }}>Real income gap: {fmt(result.incomeGap)}</p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-white">Home affordability index</h3>
                <p>When your parents were {age}: median home ≈ 3.5x annual income.</p>
                <p>Today: median home ≈ 5.4x annual income.</p>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-3 font-bold text-white">Wealth share by generation (age 35-40)</h3>
                <ul className="space-y-2">
                  {generations.map(g => (
                    <li key={g.name} className="flex justify-between border-b border-[#0f3460] pb-1.5"><span className="text-[#a8a8b3]">{g.name}</span><span className="font-bold text-white">owned {g.share} of US wealth</span></li>
                  ))}
                </ul>
                <p className="mt-3 text-[#a8a8b3]">This is not about blame — housing costs, education debt and economic conditions have made wealth building harder for younger generations.</p>
              </div>

              <div className="rounded-xl border border-[#4ade80]/40 bg-[#4ade80]/10 p-5 text-sm text-white">
                <strong className="text-[#4ade80]">Despite these challenges, you are building wealth.</strong> Every dollar saved today compounds for decades.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Generational Wealth Gap Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
