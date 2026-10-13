"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"
import { federalTax as calcFederalTax, medicareTax, socialSecurityTax, taxableAfterStandardDeduction, type Filing as TaxFiling } from "@/lib/tax2026"
import { STATE_TAX, stateIncomeTax, stateLabel } from "@/lib/stateTax"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmt0(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

// ── Tax data ───────────────────────────────────────────────────────────────────

type Filing = Extract<TaxFiling, "single" | "mfj" | "hoh">

const PAY_PERIODS: Record<string, number> = {
  weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12,
}

const PAY_PERIOD_LABELS: Record<string, string> = {
  weekly: "Weekly (52/yr)", biweekly: "Biweekly (26/yr)", semimonthly: "Semi-monthly (24/yr)", monthly: "Monthly (12/yr)",
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Result {
  grossPerPaycheck: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  retirement401k: number
  healthInsurance: number
  hsaFsa: number
  otherPreTax: number
  otherPostTax: number
  netPaycheck: number
  annualGross: number
  annualNet: number
  annualTaxes: number
  effectiveTaxRate: number
  periods: number
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PaycheckCalculatorPage() {
  const [wageType, setWageType] = useState<"salary" | "hourly">("salary")
  const [annualSalary, setAnnualSalary] = useState("75000")
  const [hourlyRate, setHourlyRate] = useState("20")
  const [hoursPerWeek, setHoursPerWeek] = useState("40")
  const [payFrequency, setPayFrequency] = useState("biweekly")
  const [filing, setFiling] = useState<Filing>("single")
  const [stateCode, setStateCode] = useState("TX")

  const [k401, setK401] = useState("0")
  const [healthIns, setHealthIns] = useState("0")
  const [hsa, setHsa] = useState("0")
  const [fsa, setFsa] = useState("0")
  const [otherPre, setOtherPre] = useState("0")
  const [otherPost, setOtherPost] = useState("0")

  const [result, setResult] = useState<Result | null>(null)

  function calculate() {
    const periods = PAY_PERIODS[payFrequency] || 26
    const annual = wageType === "salary"
      ? (parseFloat(annualSalary) || 75000)
      : (parseFloat(hourlyRate) || 20) * (parseFloat(hoursPerWeek) || 40) * 52

    const grossPerPaycheck = annual / periods

    const preTaxPerPeriod =
      (parseFloat(k401) || 0) +
      (parseFloat(healthIns) || 0) +
      (parseFloat(hsa) || 0) +
      (parseFloat(fsa) || 0) +
      (parseFloat(otherPre) || 0)

    const annualPreTax = preTaxPerPeriod * periods
    const taxableAnnual = Math.max(0, annual - annualPreTax)

    // Federal tax is on income after the standard deduction (IRS Rev. Proc. 2025-32).
    const annualFederal = calcFederalTax(taxableAfterStandardDeduction(annual, filing, annualPreTax), filing)
    const federalTax = annualFederal / periods

    const annualState = stateIncomeTax(stateCode, taxableAnnual, filing)
    const stateTax = annualState / periods

    // FICA: Social Security is capped at the 2026 SSA wage base (see tax2026.ts)
    const annualSS = socialSecurityTax(annual)
    const annualMedicare = medicareTax(annual)
    const socialSecurity = annualSS / periods
    const medicare = annualMedicare / periods

    const retirement401k = parseFloat(k401) || 0
    const healthInsurance = parseFloat(healthIns) || 0
    const hsaFsa = (parseFloat(hsa) || 0) + (parseFloat(fsa) || 0)
    const otherPreTax = parseFloat(otherPre) || 0
    const otherPostTax = parseFloat(otherPost) || 0

    const totalDeductions = federalTax + stateTax + socialSecurity + medicare +
      retirement401k + healthInsurance + hsaFsa + otherPreTax + otherPostTax

    const netPaycheck = grossPerPaycheck - totalDeductions
    const annualNet = netPaycheck * periods
    const annualTaxes = (annualFederal + annualState + annualSS + annualMedicare)
    const effectiveTaxRate = annual > 0 ? (annualTaxes / annual) * 100 : 0

    setResult({
      grossPerPaycheck, federalTax, stateTax, socialSecurity, medicare,
      retirement401k, healthInsurance, hsaFsa, otherPreTax, otherPostTax,
      netPaycheck, annualGross: annual, annualNet, annualTaxes, effectiveTaxRate, periods,
    })
  }

  const shareText = result
    ? `My $${annualSalary} salary ${payFrequency} paycheck nets ${fmt(result.netPaycheck)} after all taxes and deductions. Calculate yours free: www.dayblip.com/finance/paycheck-calculator`
    : "Calculate your exact net paycheck: www.dayblip.com/finance/paycheck-calculator"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Paycheck Calculator 2026",
          "Calculate net paycheck after federal state FICA and pre-tax deductions",
          "https://www.dayblip.com/finance/paycheck-calculator",
          "FinanceApplication",
        ),
        faqSchema([
          { question: "How do I calculate my net paycheck?", answer: "Divide your annual salary by your number of pay periods to get gross pay. Then subtract federal income tax, state income tax, FICA (7.65%) and any pre-tax deductions like 401k and health insurance. A $75,000 salary paid biweekly has a gross paycheck of $2,884 and nets approximately $2,087 after taxes in an average state." },
          { question: "Does 401k reduce my paycheck taxes?", answer: "Yes. Traditional 401k contributions are pre-tax meaning they reduce your taxable income before federal and state taxes are calculated. A $200 biweekly 401k contribution reduces your gross paycheck by $200 but only reduces take-home by $156 because you save $44 in federal tax, plus any state tax savings." },
          { question: "What is FICA tax on my paycheck?", answer: "FICA is 7.65% of gross wages — 6.2% for Social Security and 1.45% for Medicare. Social Security only applies to the first $184,500 of annual earnings. Medicare applies to all earnings. On a $2,884 gross paycheck FICA is approximately $221." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Paycheck Calculator", url: "https://www.dayblip.com/finance/paycheck-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Paycheck Calculator 2026 — Your Exact Net Pay After All Deductions</h1>
          <p className="text-[#a8a8b3]">Federal tax, state tax, FICA, 401k, health insurance — all in one calculation</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Finance", href: "/finance" },
            { label: "Paycheck Calculator" },
          ]} />
          <LastUpdated />

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              A $75,000 annual salary paid biweekly gives a gross paycheck of $2,885 before deductions. After federal tax ($295) and FICA ($221), the net paycheck is approximately $2,369 in a state with no income tax, such as Texas. In California, state tax takes about $107 more, for a net of about $2,262. Adding a $200 401k contribution reduces take-home in Texas to $2,213 but saves $44 in federal tax because 401k is pre-tax.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>
            A paycheck calculator shows your net pay — what actually hits your bank account — after all federal and state income taxes, FICA contributions and pre-tax benefit deductions. Unlike a simple salary calculator a paycheck calculator accounts for pay frequency, 401k contributions, health insurance premiums and other deductions that affect your taxable income.
          </p>

          {/* Wage type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[#0f3460]">
            {(["salary", "hourly"] as const).map(t => (
              <button key={t} onClick={() => setWageType(t)}
                className="flex-1 py-2.5 text-sm font-semibold transition-colors"
                style={{ background: wageType === t ? "#e94560" : "#1a1a2e", color: wageType === t ? "#fff" : "#a8a8b3" }}>
                {t === "salary" ? "Annual Salary" : "Hourly Rate"}
              </button>
            ))}
          </div>

          {wageType === "salary" ? (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Annual gross salary ($)</span>
              <input type="number" value={annualSalary} onChange={e => setAnnualSalary(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Hourly rate ($)</span>
                <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Hours per week</span>
                <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Pay frequency</span>
              <select value={payFrequency} onChange={e => setPayFrequency(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
                {Object.entries(PAY_PERIOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Filing status</span>
              <select value={filing} onChange={e => setFiling(e.target.value as Filing)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
                <option value="single">Single</option>
                <option value="mfj">Married Filing Jointly</option>
                <option value="hoh">Head of Household</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">State</span>
            <select value={stateCode} onChange={e => setStateCode(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
              {STATE_TAX.map(st => <option key={st.code} value={st.code}>{stateLabel(st)}</option>)}
            </select>
          </label>

          {/* Pre-tax deductions */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
            <h2 className="font-bold text-white">Pre-Tax Deductions (per paycheck)</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["401k contribution ($)", k401, setK401],
                ["Health insurance ($)", healthIns, setHealthIns],
                ["HSA contribution ($)", hsa, setHsa],
                ["FSA contribution ($)", fsa, setFsa],
                ["Other pre-tax ($)", otherPre, setOtherPre],
              ].map(([label, val, setter]) => (
                <label key={label as string} className="block">
                  <span className="mb-1 block text-xs font-semibold text-[#a8a8b3]">{label as string}</span>
                  <input type="number" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)}
                    className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none text-sm" />
                </label>
              ))}
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[#a8a8b3]">Other post-tax ($)</span>
                <input type="number" value={otherPost} onChange={e => setOtherPost(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2 text-white focus:border-[#e94560] focus:outline-none text-sm" />
              </label>
            </div>
          </div>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Paycheck
          </button>

          {result && (
            <div className="space-y-5">
              {/* Net pay headline */}
              <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-6 text-center">
                <div className="text-sm text-[#a8a8b3] mb-1">Net pay this {payFrequency === "biweekly" ? "paycheck" : "period"}</div>
                <div className="text-5xl font-black text-green-400">{fmt(result.netPaycheck)}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">Gross: {fmt(result.grossPerPaycheck)}</div>
              </div>

              {/* Deduction breakdown */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-2 text-sm">
                <h2 className="font-bold text-white text-base mb-3">Deductions This Period</h2>
                {[
                  ["Federal income tax", result.federalTax, "#FF6B6B"],
                  ["State income tax", result.stateTax, "#FF6B6B"],
                  ["Social Security (6.2%)", result.socialSecurity, "#FF6B6B"],
                  ["Medicare (1.45%)", result.medicare, "#FF6B6B"],
                  ...(result.retirement401k > 0 ? [["401k contribution", result.retirement401k, "#4FC3F7"] as [string, number, string]] : []),
                  ...(result.healthInsurance > 0 ? [["Health insurance", result.healthInsurance, "#4FC3F7"] as [string, number, string]] : []),
                  ...(result.hsaFsa > 0 ? [["HSA / FSA", result.hsaFsa, "#4FC3F7"] as [string, number, string]] : []),
                  ...(result.otherPreTax > 0 ? [["Other pre-tax", result.otherPreTax, "#4FC3F7"] as [string, number, string]] : []),
                  ...(result.otherPostTax > 0 ? [["Other post-tax", result.otherPostTax, "#a8a8b3"] as [string, number, string]] : []),
                ].map(([l, v, c]) => (
                  <div key={l as string} className="flex justify-between border-b border-[#0f3460] pb-1.5 last:border-0">
                    <span className="text-[#a8a8b3]">{l as string}</span>
                    <span className="font-semibold" style={{ color: c as string }}>-{fmt(v as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-[#0f3460] font-bold">
                  <span className="text-white">NET PAY ✅</span>
                  <span className="text-green-400">{fmt(result.netPaycheck)}</span>
                </div>
              </div>

              {/* Annual projection */}
              <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5 space-y-3 text-sm">
                <h2 className="font-bold text-white text-base">Annual Projection</h2>
                {[
                  ["Annual gross", fmt0(result.annualGross), "#fff"],
                  ["Annual net", fmt0(result.annualNet), "#4ade80"],
                  ["Total taxes paid", fmt0(result.annualTaxes), "#FF6B6B"],
                  ["Effective tax rate", `${result.effectiveTaxRate.toFixed(1)}%`, "#F9A825"],
                ].map(([l, v, c]) => (
                  <div key={l as string} className="flex justify-between border-b border-[#0f3460] pb-1.5 last:border-0">
                    <span className="text-[#a8a8b3]">{l as string}</span>
                    <span className="font-bold" style={{ color: c as string }}>{v as string}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#a8a8b3]">Estimates for educational purposes only. Does not include all credits, AMT, or deductions. Consult a tax professional or use IRS.gov for exact figures.</p>

              <ShareButtons text={shareText} url="https://www.dayblip.com/finance/paycheck-calculator" title="Paycheck Calculator 2026" />
            </div>
          )}

          <MethodologyNote text="Uses 2026 FICA rates, 2026 federal brackets and standard deduction (IRS Rev. Proc. 2025-32), and 2026 state income tax brackets and standard deductions for a single filer from the Tax Foundation. Married filing jointly doubles the state thresholds. Local taxes and state payroll taxes such as SDI are not included." />
          <RelatedTools tools={[
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Annual take-home by state", href: "/finance/take-home-pay" },
            { emoji: "🏛️", title: "No Tax on Overtime 2026", desc: "Save on overtime under new law", href: "/finance/overtime-tax" },
            { emoji: "📊", title: "Tax Bracket Calculator", desc: "Marginal vs effective tax rate", href: "/finance/tax-bracket" },
            { emoji: "💼", title: "401k Calculator", desc: "Maximize your retirement contributions", href: "/finance/401k-calculator" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
