"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtK(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const STATES: [string, number][] = [
  ["No state tax (TX/FL/NV/WA/SD/WY/AK/NH/TN)", 0],
  ["CO – 4.4%", 0.044], ["AZ – 2.5%", 0.025], ["IN – 3.1%", 0.031], ["KY – 4.5%", 0.045],
  ["GA – 5.5%", 0.055], ["VA – 5.8%", 0.058], ["NC – 5.25%", 0.0525], ["MO – 5.4%", 0.054],
  ["OH – 4.0%", 0.04], ["PA – 3.07%", 0.0307], ["MI – 4.25%", 0.0425],
  ["WI – 7.65%", 0.0765], ["MN – 9.85%", 0.0985], ["IL – 4.95%", 0.0495],
  ["UT – 4.85%", 0.0485], ["MD – 5.75%", 0.0575], ["CT – 7.0%", 0.07],
  ["MA – 9.0%", 0.09], ["NY – 10.9%", 0.109], ["NJ – 10.75%", 0.1075],
  ["CA – 13.3%", 0.133], ["OR – 9.9%", 0.099], ["HI – 11.0%", 0.11],
]

const BRACKETS_SINGLE: [number, number][] = [
  [11925, 0.10], [48475, 0.12], [103350, 0.22],
  [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37],
]
const BRACKETS_MFJ: [number, number][] = [
  [23850, 0.10], [96950, 0.12], [206700, 0.22],
  [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37],
]
const BRACKETS_HOH: [number, number][] = [
  [17000, 0.10], [64850, 0.12], [103350, 0.22],
  [197300, 0.24], [250500, 0.32], [626350, 0.35], [Infinity, 0.37],
]

const STD_DEDUCTION: Record<string, number> = {
  single: 15000, mfj: 30000, mfs: 15000, hoh: 22500,
}

function calcFedTax(taxable: number, filing: string): number {
  const brackets = filing === "mfj" ? BRACKETS_MFJ : filing === "hoh" ? BRACKETS_HOH : BRACKETS_SINGLE
  let tax = 0; let prev = 0
  for (const [limit, rate] of brackets) {
    if (taxable <= prev) break
    tax += (Math.min(taxable, limit) - prev) * rate
    prev = limit
  }
  return tax
}

function marginalRate(taxable: number, filing: string): number {
  const brackets = filing === "mfj" ? BRACKETS_MFJ : filing === "hoh" ? BRACKETS_HOH : BRACKETS_SINGLE
  for (const [limit, rate] of brackets) {
    if (taxable <= limit) return rate
  }
  return 0.37
}

const PAY_FREQS: [string, string, number][] = [
  ["weekly", "Weekly", 52],
  ["biweekly", "Bi-weekly", 26],
  ["semimonthly", "Semi-monthly", 24],
  ["monthly", "Monthly", 12],
]

export default function TakeHomePayPage() {
  const [wageType, setWageType] = useState<"salary" | "hourly">("salary")
  const [amount, setAmount] = useState("65000")
  const [hoursPerWeek, setHoursPerWeek] = useState("40")
  const [payFreq, setPayFreq] = useState("biweekly")
  const [filing, setFiling] = useState("single")
  const [stateIdx, setStateIdx] = useState(0)
  const [fourOhOneK, setFourOhOneK] = useState("6")
  const [healthIns, setHealthIns] = useState("0")
  const [otherDeductions, setOtherDeductions] = useState("0")

  const calc = useMemo(() => {
    const freq = PAY_FREQS.find(f => f[0] === payFreq)![2]
    const a = parseFloat(amount) || 0
    const annual = wageType === "salary" ? a : a * (parseFloat(hoursPerWeek) || 40) * 52
    const grossPerCheck = annual / freq

    const stdDed = STD_DEDUCTION[filing] || 15000
    const k401AnnualPct = (parseFloat(fourOhOneK) || 0) / 100
    const k401Annual = annual * k401AnnualPct
    const hiAnnual = (parseFloat(healthIns) || 0) * freq
    const otherAnnual = (parseFloat(otherDeductions) || 0) * freq

    const preTaxDeductions = k401Annual + hiAnnual + otherAnnual
    const taxableIncome = Math.max(0, annual - preTaxDeductions - stdDed)
    const fedTax = calcFedTax(taxableIncome, filing)
    const stateRate = STATES[stateIdx][1]
    const stateTax = taxableIncome * stateRate
    const ss = Math.min(annual, 168600) * 0.062
    const medicare = annual * 0.0145

    const totalTax = fedTax + stateTax + ss + medicare
    const totalDeductions = k401Annual + hiAnnual + otherAnnual
    const annualTakeHome = annual - totalTax - totalDeductions
    const perCheckTakeHome = annualTakeHome / freq
    const effectiveRate = annual > 0 ? (totalTax / annual * 100).toFixed(1) : "0"
    const marginal = marginalRate(taxableIncome, filing)

    const perCheckBreakdown = {
      gross: grossPerCheck,
      fedTax: fedTax / freq,
      stateTax: stateTax / freq,
      ss: ss / freq,
      medicare: medicare / freq,
      k401: k401Annual / freq,
      health: (parseFloat(healthIns) || 0),
      other: (parseFloat(otherDeductions) || 0),
      net: perCheckTakeHome,
    }

    const hoursPerYear = wageType === "hourly" ? (parseFloat(hoursPerWeek) || 40) * 52 : 2080
    const hourlyTakeHome = annualTakeHome / hoursPerYear

    return { perCheckBreakdown, annualTakeHome, totalTax, totalDeductions, effectiveRate, marginal, hourlyTakeHome, annual, freq }
  }, [wageType, amount, hoursPerWeek, payFreq, filing, stateIdx, fourOhOneK, healthIns, otherDeductions])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const sel = inp

  // Simple donut segments as inline SVG
  const total = calc.annual || 1
  const segments = [
    { label: "Take Home", value: calc.annualTakeHome, color: "#4ade80" },
    { label: "Federal Tax", value: calc.perCheckBreakdown.fedTax * calc.freq, color: "#e94560" },
    { label: "State Tax", value: calc.perCheckBreakdown.stateTax * calc.freq, color: "#fb923c" },
    { label: "FICA", value: (calc.perCheckBreakdown.ss + calc.perCheckBreakdown.medicare) * calc.freq, color: "#F9A825" },
    { label: "Deductions", value: calc.totalDeductions, color: "#4FC3F7" },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Take Home Pay Calculator</h1>
          <p className="text-[#a8a8b3]">Find out exactly how much you actually take home after all deductions</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">

          <div className="flex gap-2">
            {(["salary", "hourly"] as const).map(t => (
              <button key={t} onClick={() => setWageType(t)}
                className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${wageType === t ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {t === "salary" ? "Annual Salary" : "Hourly Rate"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">{wageType === "salary" ? "Annual Salary ($)" : "Hourly Rate ($)"}</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inp} />
            </label>
            {wageType === "hourly" && (
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Hours per Week</span>
                <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className={inp} /></label>
            )}
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Pay Frequency</span>
              <select value={payFreq} onChange={e => setPayFreq(e.target.value)} className={sel}>
                {PAY_FREQS.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Filing Status</span>
              <select value={filing} onChange={e => setFiling(e.target.value)} className={sel}>
                <option value="single">Single</option>
                <option value="mfj">Married Filing Jointly</option>
                <option value="mfs">Married Filing Separately</option>
                <option value="hoh">Head of Household</option>
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">State</span>
              <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))} className={sel}>
                {STATES.map(([name], i) => <option key={i} value={i}>{name}</option>)}
              </select></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">401(k) Contribution (%)</span>
              <input type="number" step="0.5" value={fourOhOneK} onChange={e => setFourOhOneK(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Health Insurance ($/paycheck)</span>
              <input type="number" value={healthIns} onChange={e => setHealthIns(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Other Pre-tax Deductions ($/paycheck)</span>
              <input type="number" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} className={inp} /></label>
          </div>

          {/* Per-paycheck breakdown */}
          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
            <h2 className="mb-4 font-bold text-white">💵 Per Paycheck Breakdown</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Gross Pay", value: calc.perCheckBreakdown.gross, color: "text-white", sign: "" },
                { label: "Federal Income Tax", value: calc.perCheckBreakdown.fedTax, color: "text-[#e94560]", sign: "−" },
                { label: "State Income Tax", value: calc.perCheckBreakdown.stateTax, color: "text-[#e94560]", sign: "−" },
                { label: "Social Security (6.2%)", value: calc.perCheckBreakdown.ss, color: "text-[#fb923c]", sign: "−" },
                { label: "Medicare (1.45%)", value: calc.perCheckBreakdown.medicare, color: "text-[#fb923c]", sign: "−" },
                { label: "401(k) Contribution", value: calc.perCheckBreakdown.k401, color: "text-[#4FC3F7]", sign: "−" },
                { label: "Health Insurance", value: calc.perCheckBreakdown.health, color: "text-[#4FC3F7]", sign: "−" },
                { label: "Other Deductions", value: calc.perCheckBreakdown.other, color: "text-[#4FC3F7]", sign: "−" },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[#a8a8b3]">{r.sign} {r.label}</span>
                  <span className={r.color}>{fmt(r.value)}</span>
                </div>
              ))}
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold text-base">
                <span className="text-white">NET TAKE HOME</span>
                <span className="text-[#4ade80] text-xl">{fmt(calc.perCheckBreakdown.net)}</span>
              </div>
            </div>
          </div>

          {/* Annual summary */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Gross Annual", value: fmtK(calc.annual), color: "text-white" },
              { label: "Total Taxes", value: fmtK(calc.totalTax), color: "text-[#e94560]" },
              { label: "Deductions", value: fmtK(calc.totalDeductions), color: "text-[#4FC3F7]" },
              { label: "Annual Take Home", value: fmtK(calc.annualTakeHome), color: "text-[#4ade80]" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                <div className={`text-xl font-black ${r.color}`}>{r.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Visual breakdown */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-4 font-bold text-white">📊 Income Breakdown</h2>
            <div className="space-y-2">
              {segments.map(s => {
                const pct = Math.max(0, (s.value / total) * 100)
                return (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs text-[#a8a8b3] mb-1">
                      <span>{s.label}</span><span>{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 rounded-full bg-[#16213e] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hourly breakdown */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">⏰ Your Take Home Breaks Down To</h2>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {[
                { label: "Per hour", value: fmtK(calc.hourlyTakeHome) },
                { label: "Per day", value: fmtK(calc.hourlyTakeHome * 8) },
                { label: "Per week", value: fmtK(calc.annualTakeHome / 52) },
              ].map(r => (
                <div key={r.label} className="rounded-lg bg-[#16213e] p-3">
                  <div className="font-black text-[#F9A825]">{r.value}</div>
                  <div className="text-[#a8a8b3]">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bracket info */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">📐 Tax Bracket Info</h2>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <div><span className="text-[#a8a8b3]">Marginal tax bracket: </span><span className="text-white font-bold">{(calc.marginal * 100).toFixed(0)}%</span></div>
              <div><span className="text-[#a8a8b3]">Effective tax rate: </span><span className="text-white font-bold">{calc.effectiveRate}%</span></div>
            </div>
            <p className="text-xs text-[#a8a8b3] mt-2">Your marginal rate is your highest bracket. Your effective rate is what you actually pay on average — always lower than marginal.</p>
          </div>

          <p className="text-xs text-[#a8a8b3]">Tax calculations are estimates for educational purposes. Does not include all deductions or credits. Use IRS.gov or a tax professional for exact figures.</p>
        </div>
      </section>
    </div>
  )
}
