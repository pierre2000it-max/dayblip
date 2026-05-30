"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmtDec(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

const STATES: [string, number][] = [
  ["TX – No income tax", 0], ["FL – No income tax", 0], ["NV – No income tax", 0],
  ["WA – No income tax", 0], ["SD – No income tax", 0], ["WY – No income tax", 0],
  ["AK – No income tax", 0], ["NH – No income tax", 0], ["TN – No income tax", 0],
  ["CO", 0.044], ["AZ", 0.025], ["IN", 0.031], ["KY", 0.045],
  ["GA", 0.055], ["VA", 0.058], ["NC", 0.0525], ["MO", 0.054],
  ["OH", 0.04], ["PA", 0.0307], ["MI", 0.0425], ["AL", 0.05],
  ["WI", 0.0765], ["MN", 0.0985], ["IL", 0.0495], ["UT", 0.0485],
  ["IA", 0.06], ["AR", 0.055], ["LA", 0.0425], ["MS", 0.05],
  ["SC", 0.07], ["MD", 0.0575], ["CT", 0.07], ["DE", 0.066],
  ["MA", 0.09], ["NY", 0.109], ["NJ", 0.1075], ["CA", 0.133],
  ["OR", 0.099], ["HI", 0.11], ["ME", 0.0715], ["VT", 0.0875],
]

function federalTax(income: number): number {
  const brackets: [number, number][] = [
    [11925, 0.10], [48475, 0.12], [103350, 0.22],
    [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37],
  ]
  let tax = 0; let prev = 0
  for (const [limit, rate] of brackets) {
    if (income <= prev) break
    tax += (Math.min(income, limit) - prev) * rate
    prev = limit
  }
  return tax
}

const BENCHMARKS = [
  { title: "Web Developer", range: "$75–150/hr" },
  { title: "Graphic Designer", range: "$50–100/hr" },
  { title: "Copywriter", range: "$50–120/hr" },
  { title: "Marketing Consultant", range: "$75–200/hr" },
  { title: "Accountant / Bookkeeper", range: "$50–150/hr" },
  { title: "Business Consultant", range: "$100–300/hr" },
]

export default function FreelancerRatePage() {
  const [targetIncome, setTargetIncome] = useState("75000")
  const [vacationWeeks, setVacationWeeks] = useState("4")
  const [billableHours, setBillableHours] = useState("30")
  const [bizExpenses, setBizExpenses] = useState("200")
  const [healthIns, setHealthIns] = useState("400")
  const [retirement, setRetirement] = useState("500")
  const [stateIdx, setStateIdx] = useState(0)

  const calc = useMemo(() => {
    const income = parseFloat(targetIncome) || 0
    const vw = parseFloat(vacationWeeks) || 0
    const bh = parseFloat(billableHours) || 1
    const biz = parseFloat(bizExpenses) || 0
    const hi = parseFloat(healthIns) || 0
    const ret = parseFloat(retirement) || 0
    const stateRate = STATES[stateIdx][1]

    const workWeeks = 52 - vw
    const totalBillableHours = bh * workWeeks
    const annualBiz = biz * 12
    const annualHI = hi * 12
    const annualRet = ret * 12
    const grossNeeded = income + annualBiz + annualHI + annualRet

    // SE tax on 92.35% of net earnings
    const seTaxRate = 0.153
    const seAdj = 0.9235
    const seDeduct = grossNeeded * seAdj * (seTaxRate / 2)
    const taxableIncome = grossNeeded - seDeduct
    const fedTax = federalTax(taxableIncome)
    const stateTax = taxableIncome * stateRate
    const seTax = grossNeeded * seAdj * seTaxRate

    const totalNeeded = grossNeeded + fedTax + stateTax + seTax
    const baseRate = totalBillableHours > 0 ? totalNeeded / totalBillableHours : 0

    const breakdown = {
      incomeHr: income / totalBillableHours,
      bizHr: annualBiz / totalBillableHours,
      hiHr: annualHI / totalBillableHours,
      retHr: annualRet / totalBillableHours,
      seHr: seTax / totalBillableHours,
      taxHr: (fedTax + stateTax) / totalBillableHours,
    }

    const scenarios = [-20, 0, 20, 40].map(delta => {
      const r = Math.max(1, baseRate + delta)
      const annualRevenue = r * totalBillableHours
      const se = annualRevenue * seAdj * seTaxRate
      const fed = federalTax(annualRevenue - se / 2)
      const st = (annualRevenue - se / 2) * stateRate
      const afterTax = annualRevenue - se - fed - st - annualBiz - annualHI - annualRet
      return { rate: r, annualRevenue, afterTax, delta }
    })

    return { baseRate, totalBillableHours, workWeeks, breakdown, scenarios }
  }, [targetIncome, vacationWeeks, billableHours, bizExpenses, healthIns, retirement, stateIdx])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Freelancer Rate Calculator</h1>
          <p className="text-[#a8a8b3]">Calculate exactly what hourly rate you need to charge as a freelancer</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">

          {/* Income */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <h2 className="font-bold text-white text-lg">💰 Income Goals</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Desired annual income ($)</span>
                <input type="number" value={targetIncome} onChange={e => setTargetIncome(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Vacation weeks/year</span>
                <input type="number" value={vacationWeeks} onChange={e => setVacationWeeks(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Billable hours/week</span>
                <input type="number" value={billableHours} onChange={e => setBillableHours(e.target.value)} className={inp} /></label>
            </div>
          </div>

          {/* Expenses */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <h2 className="font-bold text-white text-lg">📋 Annual Expenses</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Business expenses ($/mo)</span>
                <input type="number" value={bizExpenses} onChange={e => setBizExpenses(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Health insurance ($/mo)</span>
                <input type="number" value={healthIns} onChange={e => setHealthIns(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">Retirement savings ($/mo)</span>
                <input type="number" value={retirement} onChange={e => setRetirement(e.target.value)} className={inp} /></label>
            </div>
          </div>

          {/* Tax */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <h2 className="font-bold text-white text-lg">🧾 Tax</h2>
            <label className="flex flex-col gap-1"><span className="text-sm text-[#a8a8b3]">State</span>
              <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {STATES.map(([name], i) => <option key={i} value={i}>{name}</option>)}
              </select></label>
            <p className="text-xs text-[#a8a8b3]">Self-employment tax (15.3%) and federal income tax are calculated automatically.</p>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">You need to charge at least:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmtDec(calc.baseRate)}</div>
            <div className="text-2xl text-[#a8a8b3]">per hour</div>
            <p className="text-sm text-[#a8a8b3] mt-3">{calc.totalBillableHours} billable hours/year × {fmtDec(calc.baseRate)}/hr</p>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Rate Breakdown</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Desired take-home", value: calc.breakdown.incomeHr },
                { label: "Business expenses", value: calc.breakdown.bizHr },
                { label: "Health insurance", value: calc.breakdown.hiHr },
                { label: "Retirement savings", value: calc.breakdown.retHr },
                { label: "Self-employment tax (15.3%)", value: calc.breakdown.seHr },
                { label: "Federal + state income tax", value: calc.breakdown.taxHr },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[#a8a8b3]">+ {r.label}</span>
                  <span className="text-white">{fmtDec(r.value)}/hr</span>
                </div>
              ))}
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">TOTAL NEEDED</span>
                <span className="text-[#e94560]">{fmtDec(calc.baseRate)}/hr</span>
              </div>
            </div>
          </div>

          {/* Scenarios */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📈 Rate Scenarios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Rate</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Annual Revenue</th>
                  <th className="py-2 text-right text-[#a8a8b3]">After-Tax Income</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Status</th>
                </tr></thead>
                <tbody>{calc.scenarios.map(s => (
                  <tr key={s.delta} className={`border-b border-[#0f3460]/50 ${s.delta === 0 ? "bg-[#e94560]/10" : ""}`}>
                    <td className="py-2 font-bold text-white">{fmtDec(s.rate)}/hr</td>
                    <td className="py-2 text-right text-[#a8a8b3]">{fmt(s.annualRevenue)}</td>
                    <td className="py-2 text-right text-[#F9A825]">{fmt(s.afterTax)}</td>
                    <td className="py-2 text-right">
                      {s.delta < 0 ? "⚠️ Too low" : s.delta === 0 ? "✅ Target" : s.delta === 20 ? "🚀 Comfortable" : "💰 Great"}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          {/* Reality check */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">⏰ Billable Hours Reality Check</h2>
            <p className="text-sm text-[#a8a8b3]">
              At <span className="text-white font-semibold">{billableHours} billable hours/week</span> you work ~40+ hours total but only bill {billableHours}.
              The rest goes to admin, marketing, networking, and business development.
              That is why freelancers must charge more than employees earning the same take-home.
            </p>
          </div>

          {/* Project rates */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📁 Project Rate Converter</h2>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {[
                { label: "1 Day (8 hrs)", hrs: 8 },
                { label: "1 Week (40 hrs)", hrs: 40 },
                { label: "1 Month (160 hrs)", hrs: 160 },
              ].map(p => (
                <div key={p.label} className="rounded-lg bg-[#16213e] p-3">
                  <div className="font-black text-[#F9A825] text-lg">{fmt(calc.baseRate * p.hrs)}</div>
                  <div className="text-[#a8a8b3]">{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmarks */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🏭 Industry Benchmarks</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {BENCHMARKS.map(b => (
                <div key={b.title} className="flex justify-between text-sm border-b border-[#0f3460]/50 py-2">
                  <span className="text-[#a8a8b3]">{b.title}</span>
                  <span className="text-white font-semibold">{b.range}</span>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Freelancers need to charge at least $${calc.baseRate.toFixed(2)}/hr to hit their income goals! Calculate yours. (Educational only)`}
            url="https://dayblip.com/finance/freelancer-rate"
            title="Freelancer Rate Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Educational estimate only. Tax calculations are approximate and do not account for all deductions. Consult a CPA for accurate figures.</p>
        </div>
      </section>
    </div>
  )
}
