"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const salaryData: Record<string, Record<string, [number, number]>> = {
  "Software Engineer": { "0-1": [75000, 95000], "2-4": [95000, 130000], "5-9": [130000, 170000], "10-14": [160000, 210000], "15+": [190000, 250000] },
  "Marketing Manager": { "0-1": [45000, 60000], "2-4": [60000, 85000], "5-9": [85000, 110000], "10-14": [100000, 135000], "15+": [120000, 160000] },
  "Teacher": { "0-1": [35000, 45000], "2-4": [40000, 55000], "5-9": [50000, 65000], "10-14": [58000, 75000], "15+": [65000, 85000] },
  "Nurse": { "0-1": [55000, 70000], "2-4": [65000, 80000], "5-9": [75000, 95000], "10-14": [85000, 108000], "15+": [95000, 125000] },
  "Accountant": { "0-1": [45000, 60000], "2-4": [58000, 78000], "5-9": [75000, 100000], "10-14": [92000, 125000], "15+": [110000, 150000] },
  "Project Manager": { "0-1": [55000, 70000], "2-4": [70000, 90000], "5-9": [90000, 120000], "10-14": [108000, 145000], "15+": [125000, 165000] },
  "Sales Representative": { "0-1": [40000, 65000], "2-4": [55000, 85000], "5-9": [75000, 115000], "10-14": [90000, 140000], "15+": [105000, 160000] },
  "Data Analyst": { "0-1": [55000, 75000], "2-4": [70000, 95000], "5-9": [90000, 120000], "10-14": [110000, 148000], "15+": [130000, 175000] },
  "Designer": { "0-1": [45000, 65000], "2-4": [60000, 85000], "5-9": [80000, 110000], "10-14": [98000, 135000], "15+": [115000, 155000] },
  "HR Manager": { "0-1": [45000, 60000], "2-4": [58000, 78000], "5-9": [75000, 100000], "10-14": [90000, 120000], "15+": [105000, 145000] },
  "Financial Analyst": { "0-1": [55000, 72000], "2-4": [68000, 90000], "5-9": [85000, 115000], "10-14": [105000, 145000], "15+": [125000, 170000] },
  "Operations Manager": { "0-1": [50000, 68000], "2-4": [65000, 88000], "5-9": [82000, 112000], "10-14": [98000, 138000], "15+": [115000, 158000] },
  "Customer Service": { "0-1": [30000, 42000], "2-4": [38000, 52000], "5-9": [46000, 62000], "10-14": [52000, 70000], "15+": [58000, 78000] },
  "Administrative": { "0-1": [32000, 45000], "2-4": [40000, 55000], "5-9": [48000, 65000], "10-14": [55000, 72000], "15+": [62000, 82000] },
  "Other": { "0-1": [35000, 52000], "2-4": [45000, 65000], "5-9": [58000, 82000], "10-14": [70000, 98000], "15+": [82000, 115000] },
}

const ROLES = Object.keys(salaryData)
const EXP_LEVELS = [
  { v: "0-1", label: "0-1 years" }, { v: "2-4", label: "2-4 years" }, { v: "5-9", label: "5-9 years" },
  { v: "10-14", label: "10-14 years" }, { v: "15+", label: "15+ years" },
]

const STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
}

const stateMultiplier: Record<string, number> = {
  CA: 1.28, NY: 1.25, WA: 1.22, MA: 1.20, CT: 1.18, NJ: 1.18, CO: 1.08, VA: 1.07, TX: 1.02,
  FL: 1.00, GA: 0.98, AZ: 0.97, NC: 0.95, TN: 0.93, OH: 0.92, MI: 0.91, PA: 0.96, IL: 1.04,
}
const mult = (s: string) => stateMultiplier[s] ?? 0.93

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Salary estimates are educational approximations based on national data.</strong> Actual salaries vary by company, industry and individual performance. Sources: BLS, Glassdoor, LinkedIn Salary.
  </div>
)

interface Result {
  role: string; exp: string; expLabel: string; state: string; stateName: string
  low: number; high: number; median: number; current: number
  diff: number; pct: number; cities: { name: string; value: number }[]
}

export default function SalaryCheckerPage() {
  const [role, setRole] = useState("Software Engineer")
  const [exp, setExp] = useState("5-9")
  const [state, setState] = useState("CA")
  const [current, setCurrent] = useState("")
  const [result, setResult] = useState<Result | null>(null)

  function compute(r: string, e: string, s: string, cur: string): Result {
    const m = mult(s)
    const base = salaryData[r][e]
    const low = Math.round(base[0] * m)
    const high = Math.round(base[1] * m)
    const median = Math.round((low + high) / 2)
    const baseMedian = (base[0] + base[1]) / 2
    const cities = [
      { name: "New York", value: Math.round(baseMedian * 1.25) },
      { name: "San Francisco", value: Math.round(baseMedian * 1.28) },
      { name: "Austin", value: Math.round(baseMedian * 1.02) },
      { name: "Chicago", value: Math.round(baseMedian * 1.04) },
      { name: "Remote (national avg)", value: Math.round(baseMedian * 0.93) },
    ]
    const curNum = parseFloat(cur) || 0
    const diff = curNum > 0 ? curNum - median : 0
    const pct = curNum > 0 ? ((curNum - median) / median) * 100 : 0
    return {
      role: r, exp: e, expLabel: EXP_LEVELS.find(x => x.v === e)?.label ?? e,
      state: s, stateName: STATES[s], low, high, median, current: curNum, diff, pct, cities,
    }
  }

  function runCalc(r = role, e = exp, s = state, cur = current, push = true) {
    const res = compute(r, e, s, cur)
    setResult(res)
    if (push && typeof window !== "undefined") {
      const params = new URLSearchParams({ role: r, exp: e, state: s })
      if (cur) params.set("current", cur)
      window.history.pushState({}, "", `?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const r = p.get("role"); const e = p.get("exp"); const s = p.get("state"); const cur = p.get("current")
    if (r && salaryData[r] && e && s) {
      setRole(r); setExp(e); setState(s); if (cur) setCurrent(cur)
      runCalc(r, e, s, cur ?? "", false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result
    ? `https://www.dayblip.com/tools/salary-checker?role=${encodeURIComponent(result.role)}&exp=${result.exp}&state=${result.state}${result.current ? `&current=${result.current}` : ""}`
    : ""
  const shareText = result
    ? `The market rate for a ${result.role} with ${result.expLabel} experience in ${result.stateName} is ${fmt(result.low)}-${fmt(result.high)}/year! Am I being paid fairly? (Educational estimate only)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Am I Being Paid Fairly?</h1>
          <p className="text-[#a8a8b3]">Check if your salary matches market rates for your role and experience</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Job title</span>
              <select value={role} onChange={e => setRole(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Years of experience</span>
              <select value={exp} onChange={e => setExp(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {EXP_LEVELS.map(x => <option key={x.v} value={x.v}>{x.label}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">State</span>
              <select value={state} onChange={e => setState(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {Object.entries(STATES).map(([abbr, name]) => <option key={abbr} value={abbr}>{name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Current salary (optional)</span>
              <div className="flex items-center gap-2">
                <span className="text-[#a8a8b3]">$</span>
                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. 120000"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>

            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Check My Market Rate
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <p className="mb-2 text-[#a8a8b3]">Market rate for {result.role} with {result.expLabel} in {result.stateName}:</p>
                <div className="text-4xl font-black text-[#e94560]">{fmt(result.low)} — {fmt(result.high)}</div>
                <p className="mt-3 text-white">Median: <span className="font-bold text-[#F9A825]">{fmt(result.median)}</span></p>
              </div>

              {result.current > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                  <div className="mb-3 flex justify-between text-xs text-[#a8a8b3]">
                    <span>← Underpaid</span><span>Market Rate</span><span>Overpaid →</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#F9A825] to-[#4ade80]">
                    <div className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded bg-white"
                      style={{ left: `${Math.min(100, Math.max(0, 50 + result.pct * 1.5))}%` }} />
                  </div>
                  <p className="mt-4 text-center text-lg font-bold" style={{ color: result.diff >= 0 ? "#4ade80" : "#FF6B6B" }}>
                    You are earning {fmt(Math.abs(result.diff))} {result.diff >= 0 ? "above" : "below"} the median market rate
                  </p>
                  <p className="mt-1 text-center text-sm" style={{ color: result.diff >= 0 ? "#4ade80" : "#FF6B6B" }}>
                    You are earning {Math.abs(result.pct).toFixed(1)}% {result.pct >= 0 ? "above" : "below"} market
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-3 font-bold text-white">Same role in 5 cities (median)</h3>
                <ul className="space-y-2 text-sm">
                  {result.cities.map(c => (
                    <li key={c.name} className="flex justify-between border-b border-[#0f3460] pb-1.5">
                      <span className="text-[#a8a8b3]">{c.name}</span>
                      <span className="font-bold text-white">{fmt(c.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.current > 0 && result.diff < 0 && (
                <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-6">
                  <h3 className="mb-2 font-bold text-[#F9A825]">💡 Negotiation tip</h3>
                  <p className="text-sm text-white">You may have room to negotiate. The market supports {fmt(result.low)}-{fmt(result.high)} for your role and experience level.</p>
                </div>
              )}

              <ShareButtons text={shareText} url={shareUrl} title="Salary Checker — Am I Being Paid Fairly?" />

              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
