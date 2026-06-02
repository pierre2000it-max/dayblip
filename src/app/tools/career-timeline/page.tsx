"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const fieldRaises: Record<string, number> = {
  "Technology": 4.5, "Healthcare": 3.8, "Finance": 3.5, "Legal": 3.2, "Engineering": 3.8,
  "Education": 2.5, "Government": 2.8, "Sales": 3.2, "Marketing": 3.0, "Other": 3.0,
}
const FIELDS = Object.keys(fieldRaises)

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational projection only.</strong> Actual results vary significantly. Consult a financial advisor.
  </div>
)

interface Row { age: number; salary: number; annualSavings: number; investmentValue: number }
interface Result {
  age: number; retire: number; rows: Row[]
  totalEarnings: number; totalContributed: number; growth: number; finalValue: number; monthlyIncome: number
  age100k: number | null; age500k: number | null; age1m: number | null
  conservative: number; optimistic: number; yourScenario: number
}

function simulate(startAge: number, startSalary: number, raise: number, savingsRate: number, ret: number, retire: number): { rows: Row[]; totalEarnings: number; totalContributed: number; finalValue: number; milestones: { k100: number | null; k500: number | null; m1: number | null } } {
  let salary = startSalary
  let investmentValue = 0
  let totalEarnings = 0
  let totalContributed = 0
  const rows: Row[] = []
  let k100: number | null = null, k500: number | null = null, m1: number | null = null
  for (let age = startAge; age <= retire; age++) {
    if (age > startAge) salary = salary * (1 + raise / 100)
    const annualSavings = salary * (savingsRate / 100)
    investmentValue = investmentValue * (1 + ret / 100) + annualSavings
    totalEarnings += salary
    totalContributed += annualSavings
    if (salary >= 100000 && k100 === null) k100 = age
    if (investmentValue >= 500000 && k500 === null) k500 = age
    if (investmentValue >= 1000000 && m1 === null) m1 = age
    if ((age - startAge) % 5 === 0 || age === retire) rows.push({ age, salary, annualSavings, investmentValue })
  }
  return { rows, totalEarnings, totalContributed, finalValue: investmentValue, milestones: { k100, k500, m1 } }
}

export default function CareerTimelinePage() {
  const [age, setAge] = useState(30)
  const [salary, setSalary] = useState("65000")
  const [field, setField] = useState("Technology")
  const [raise, setRaise] = useState("4.5")
  const [savings, setSavings] = useState("15")
  const [ret, setRet] = useState("7")
  const [retire, setRetire] = useState(65)
  const [result, setResult] = useState<Result | null>(null)

  function compute(a = age, sal = parseFloat(salary) || 0, rz = parseFloat(raise) || 0, sv = parseFloat(savings) || 0, rt = parseFloat(ret) || 0, rtr = retire): Result {
    const main = simulate(a, sal, rz, sv, rt, rtr)
    const cons = simulate(a, sal, 2, 10, rt, rtr)
    const opt = simulate(a, sal, 5, 20, rt, rtr)
    return {
      age: a, retire: rtr, rows: main.rows,
      totalEarnings: main.totalEarnings, totalContributed: main.totalContributed,
      growth: main.finalValue - main.totalContributed, finalValue: main.finalValue,
      monthlyIncome: (main.finalValue * 0.04) / 12,
      age100k: main.milestones.k100, age500k: main.milestones.k500, age1m: main.milestones.m1,
      conservative: cons.finalValue, optimistic: opt.finalValue, yourScenario: main.finalValue,
    }
  }

  function runCalc(push = true) {
    const res = compute()
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?age=${age}&salary=${parseFloat(salary) || 0}&field=${encodeURIComponent(field)}&raise=${parseFloat(raise) || 0}&savings=${parseFloat(savings) || 0}&return=${parseFloat(ret) || 0}&retire=${retire}`)
    }
  }

  function onFieldChange(f: string) { setField(f); setRaise(String(fieldRaises[f])) }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("age") && p.get("salary")) {
      const a = Number(p.get("age")); const sal = p.get("salary")!
      const f = p.get("field"); const rz = p.get("raise"); const sv = p.get("savings"); const rt = p.get("return"); const rtr = p.get("retire")
      setAge(a); setSalary(sal)
      if (f && fieldRaises[f]) setField(f)
      if (rz) setRaise(rz); if (sv) setSavings(sv); if (rt) setRet(rt); if (rtr) setRetire(Number(rtr))
      setResult(compute(a, Number(sal), Number(rz ?? fieldRaises[f ?? "Other"] ?? 3), Number(sv ?? 15), Number(rt ?? 7), Number(rtr ?? 65)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/career-timeline?age=${result.age}&salary=${parseFloat(salary) || 0}` : ""
  const shareText = result ? `At my current trajectory I will have ${fmt(result.finalValue)} saved when I retire at ${result.retire}! See your career timeline: (Educational only)` : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Your Career Financial Timeline</h1>
          <p className="text-[#a8a8b3]">Project your earnings, savings and net worth over your entire career</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-5">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Current age: {age}</span>
              <input type="range" min={18} max={60} value={age} onChange={e => setAge(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Current salary</span>
                <div className="flex items-center gap-1"><span className="text-[#a8a8b3]">$</span>
                  <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
                    className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none" /></div>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Career field</span>
                <select value={field} onChange={e => onFieldChange(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none">
                  {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <label className="block"><span className="mb-1 block text-xs font-semibold text-white">Annual raise %</span>
                <input type="number" step="0.1" value={raise} onChange={e => setRaise(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-white">Savings rate %</span>
                <input type="number" value={savings} onChange={e => setSavings(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-white">Return %</span>
                <input type="number" step="0.1" value={ret} onChange={e => setRet(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
              <label className="block"><span className="mb-1 block text-xs font-semibold text-white">Retirement age</span>
                <input type="number" value={retire} onChange={e => setRetire(Number(e.target.value))} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
            </div>
            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Project My Career
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <table className="w-full text-sm">
                  <thead><tr className="text-[#a8a8b3]">
                    <th className="px-2 py-2 text-left">Age</th><th className="px-2 py-2 text-right">Salary</th>
                    <th className="px-2 py-2 text-right">Annual Savings</th><th className="px-2 py-2 text-right">Investment Value</th>
                  </tr></thead>
                  <tbody>
                    {result.rows.map(r => (
                      <tr key={r.age} className="border-t border-[#0f3460] text-white">
                        <td className="px-2 py-1.5">{r.age}</td>
                        <td className="px-2 py-1.5 text-right">{fmt(r.salary)}</td>
                        <td className="px-2 py-1.5 text-right">{fmt(r.annualSavings)}</td>
                        <td className="px-2 py-1.5 text-right font-bold text-[#F9A825]">{fmt(r.investmentValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-sm text-white space-y-1">
                {result.age100k && <p>You will earn {fmt(100000)}/year at age <span className="font-bold text-[#F9A825]">{result.age100k}</span></p>}
                {result.age500k && <p>You will have {fmt(500000)} saved at age <span className="font-bold text-[#F9A825]">{result.age500k}</span></p>}
                {result.age1m && <p>You will have {fmt(1000000)} saved at age <span className="font-bold text-[#F9A825]">{result.age1m}</span></p>}
                <p>You can retire at <span className="font-bold text-[#e94560]">{result.retire}</span> with <span className="font-bold text-[#e94560]">{fmt(result.finalValue)}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-white">{fmt(result.totalEarnings)}</div><div className="text-[#a8a8b3]">Total career earnings</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-white">{fmt(result.totalContributed)}</div><div className="text-[#a8a8b3]">Total contributed</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#4ade80]">{fmt(result.growth)}</div><div className="text-[#a8a8b3]">Investment growth</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#e94560]">{fmt(result.finalValue)}</div><div className="text-[#a8a8b3]">Final portfolio</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#F9A825]">{fmt(result.monthlyIncome)}</div><div className="text-[#a8a8b3]">Monthly income (4% rule)</div></div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center"><div className="text-xs text-[#a8a8b3]">Conservative (2% raises, 10% savings)</div><div className="mt-1 text-xl font-black text-white">{fmt(result.conservative)}</div></div>
                <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-5 text-center"><div className="text-xs text-[#a8a8b3]">Your scenario</div><div className="mt-1 text-xl font-black text-[#e94560]">{fmt(result.yourScenario)}</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center"><div className="text-xs text-[#a8a8b3]">Optimistic (5% raises, 20% savings)</div><div className="mt-1 text-xl font-black text-[#4ade80]">{fmt(result.optimistic)}</div></div>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Career Timeline Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
