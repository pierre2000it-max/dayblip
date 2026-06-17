"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import AuthorByline from "@/components/AuthorByline"

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
  [12400, 0.10], [47150, 0.12], [100525, 0.22],
  [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37],
]
const BRACKETS_MFJ: [number, number][] = [
  [24800, 0.10], [94300, 0.12], [201050, 0.22],
  [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37],
]
const BRACKETS_HOH: [number, number][] = [
  [17300, 0.10], [63050, 0.12], [100500, 0.22],
  [191950, 0.24], [243700, 0.32], [609350, 0.35], [Infinity, 0.37],
]

const STD_DEDUCTION: Record<string, number> = {
  single: 16100, mfj: 32200, mfs: 16100, hoh: 24150,
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

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("salary")) setAmount(p.get("salary")!)
    if (p.get("state")) setStateIdx(Number(p.get("state")))
    if (p.get("filing")) setFiling(p.get("filing")!)
    if (p.get("type")) setWageType(p.get("type") as "salary" | "hourly")
    if (p.get("retirement")) setFourOhOneK(p.get("retirement")!)
  }, [])

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
    const ss = Math.min(annual, 176100) * 0.062
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
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Take-Home Pay Calculator",
          "Calculate your net paycheck after federal, state and FICA taxes.",
          "https://www.dayblip.com/finance/take-home-pay",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "What gets deducted from my paycheck?", answer: "The calculator subtracts federal income tax, state income tax, Social Security (6.2% up to the wage cap), Medicare (1.45%), and any pre-tax deductions like 401(k) contributions and health insurance to arrive at your net take-home pay." },
          { question: "How does my state affect take-home pay?", answer: "State income tax varies a lot. Nine states have no income tax while California tops out near 13.3%. Select your state and the tool applies its rate to your taxable income, changing your net paycheck accordingly." },
          { question: "How do 401(k) contributions change my paycheck?", answer: "Traditional 401(k) contributions come out before income tax, so they lower both your taxable income and your federal and state tax — your paycheck drops by less than the amount you contribute." },
          { question: "What is the difference between marginal and effective tax rate?", answer: "Your marginal rate is the rate on your last dollar of income (your top bracket). Your effective rate is total tax divided by income, which is always lower because earlier dollars are taxed at lower bracket rates." },
        ]),
        howToSchema(
          "Take-Home Pay Calculator — How To Use",
          "Calculate your net paycheck after taxes and deductions.",
          [
            "Choose annual salary or hourly rate and enter the amount (and hours per week if hourly).",
            "Select your pay frequency and filing status.",
            "Select your state and enter your 401(k) percentage, health insurance and any other pre-tax deductions.",
            "Review the per-paycheck breakdown, annual take-home, income breakdown chart and your marginal and effective tax rates.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Take-Home Pay Calculator", url: "https://www.dayblip.com/finance/take-home-pay" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Take Home Pay Calculator — What Is Your Actual Paycheck?</h1>
          <p className="text-[#a8a8b3]">Find out exactly how much you actually take home after all deductions</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A $100,000 salary in New York takes home approximately $64,650 after federal tax, state tax and FICA — 35% less than the stated salary. The same salary in Texas takes home $72,400 because Texas has no state income tax. State of residence can make a $7,750 annual difference on identical salaries.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Your take home pay is your salary after federal income tax, state income tax and FICA (Social Security and Medicare) deductions. Pre-tax contributions to 401k, health insurance and HSA further reduce your taxable income. This calculator shows your exact net pay for any salary in any US state.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Take Home Pay Calculator" }]} />
          <LastUpdated />

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

          {/* Embed this tool */}
          <div style={{
            textAlign: "center",
            marginTop: "32px",
            marginBottom: "16px",
            padding: "16px",
            background: "#1e2d4a",
            borderRadius: "8px",
            border: "1px solid #2a3a5a",
          }}>
            <p style={{ color: "#a8a8b3", fontSize: "14px", margin: "0 0 8px 0" }}>
              Want to add this tool to your website?
            </p>
            <a
              href="/embed"
              style={{ color: "#e94560", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
            >
              Get the free embed code →
            </a>
          </div>
          <ShareButtons
            text={`My salary take-home is ${fmtK(calc.annualTakeHome)}/year after taxes. Effective rate: ${calc.effectiveRate}% (Educational only)`}
            url={`https://www.dayblip.com/finance/take-home-pay?salary=${amount}&state=${stateIdx}&filing=${filing}&type=${wageType}&retirement=${fourOhOneK}`}
            title="Take Home Pay Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Tax calculations are estimates for educational purposes. Does not include all deductions or credits. Use IRS.gov or a tax professional for exact figures.</p>
          <MethodologyNote text="Based on 2026 IRS federal tax brackets, FICA rates (6.2% Social Security, 1.45% Medicare), and state income tax tables from each state's revenue department." />
          <RelatedTools tools={[
            { emoji: "🏛️", title: "No Tax on Overtime 2026", desc: "Calculate your overtime tax savings under new law", href: "/finance/overtime-tax" },
            { emoji: "🧾", title: "Paycheck Calculator", desc: "Exact net pay per period after all deductions", href: "/finance/paycheck-calculator" },
            { emoji: "📊", title: "Tax Bracket Calculator", desc: "Marginal vs effective tax rate", href: "/finance/tax-bracket" },
            { emoji: "⏱️", title: "Overtime Pay Calculator", desc: "How much do you earn working extra hours?", href: "/finance/overtime-calculator" },
          ]} />
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 20px 0 20px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0' }}>
              Frequently Asked Questions
            </h2>
            {[
              { q: "What is FICA tax?", a: "FICA stands for Federal Insurance Contributions Act. It covers Social Security tax at 6.2 percent on wages up to $176,100 in 2026 and Medicare tax at 1.45 percent on all wages plus an additional 0.9 percent on wages above $200,000. Employers match these contributions." },
              { q: "Why does my paycheck differ from salary divided by pay periods?", a: "Your gross pay equals salary divided by pay periods. Your net take-home is lower after federal income tax withholding, FICA taxes, state income tax, and any pre-tax deductions like 401k contributions or health insurance premiums." },
              { q: "How do pre-tax deductions affect take-home pay?", a: "Pre-tax deductions reduce your taxable income before taxes are calculated. Contributing $500 per month to a 401k does not reduce take-home pay by $500 — it reduces it by $500 minus the taxes you would have paid on that amount making the real cost lower." },
              { q: "What is the standard deduction for 2026?", a: "The 2026 standard deduction is approximately $15,000 for single filers and $30,000 for married filing jointly. This reduces your taxable income before the bracket calculation is applied." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  {item.q}
                </h3>
                <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.7', margin: '0' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
