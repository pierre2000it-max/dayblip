"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function LifeInsurancePage() {
  const [income, setIncome] = useState("75000")
  const [yearsReplace, setYearsReplace] = useState("10")
  const [mortgage, setMortgage] = useState("250000")
  const [otherDebts, setOtherDebts] = useState("20000")
  const [education, setEducation] = useState("50000")
  const [finalExpenses, setFinalExpenses] = useState("15000")
  const [existingCoverage, setExistingCoverage] = useState("0")
  const [savings, setSavings] = useState("10000")

  const calc = useMemo(() => {
    const inc = parseFloat(income) || 0
    const yrs = parseFloat(yearsReplace) || 0
    const mort = parseFloat(mortgage) || 0
    const debts = parseFloat(otherDebts) || 0
    const edu = parseFloat(education) || 0
    const final = parseFloat(finalExpenses) || 0
    const existing = parseFloat(existingCoverage) || 0
    const sav = parseFloat(savings) || 0
    const needed = Math.max(0, inc * yrs + mort + debts + edu + final - existing - sav)
    const gap = Math.max(0, needed - existing)
    const estMonthlyCost = (needed * 0.0003)
    return { needed, gap, estMonthlyCost, incomeComponent: inc * yrs, debtComponent: mort + debts, eduComponent: edu }
  }, [income, yearsReplace, mortgage, otherDebts, education, finalExpenses, existingCoverage, savings])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Life Insurance Needs Calculator</h1>
          <p className="text-[#a8a8b3]">Find out how much life insurance coverage you need</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Annual Income ($)", val: income, set: setIncome },
              { label: "Years of Income to Replace", val: yearsReplace, set: setYearsReplace },
              { label: "Mortgage Balance ($)", val: mortgage, set: setMortgage },
              { label: "Other Debts ($)", val: otherDebts, set: setOtherDebts },
              { label: "Children's Education Fund ($)", val: education, set: setEducation },
              { label: "Final Expenses ($)", val: finalExpenses, set: setFinalExpenses },
              { label: "Existing Coverage ($)", val: existingCoverage, set: setExistingCoverage },
              { label: "Existing Savings ($)", val: savings, set: setSavings },
            ].map(f => (
              <label key={f.label} className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{f.label}</span>
                <input type="number" value={f.val} onChange={e => f.set(e.target.value)} className={inp} />
              </label>
            ))}
          </div>

          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-sm text-[#a8a8b3] mb-1">Coverage Needed</div>
            <div className="text-5xl font-black text-[#F9A825]">{fmt(calc.needed)}</div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><div className="font-bold text-white">{fmt(calc.estMonthlyCost)}/mo</div><div className="text-[#a8a8b3]">Est. 20-yr term cost</div></div>
              <div><div className={`font-bold ${calc.gap > 0 ? "text-[#e94560]" : "text-green-400"}`}>{fmt(calc.gap)}</div><div className="text-[#a8a8b3]">Coverage gap</div></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Breakdown</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Income Replacement ({yearsReplace} yrs)</span><span className="text-white">{fmt(calc.incomeComponent)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Debts & Mortgage</span><span className="text-white">{fmt(calc.debtComponent)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Education</span><span className="text-white">{fmt(calc.eduComponent)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Final Expenses</span><span className="text-white">{fmt(parseFloat(finalExpenses) || 0)}</span></div>
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold"><span className="text-white">Total Needed</span><span className="text-[#F9A825]">{fmt(calc.needed)}</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📚 Types of Life Insurance</h2>
            <div className="space-y-3 text-sm text-[#a8a8b3]">
              <div><span className="text-white font-semibold">Term Life:</span> Pure death benefit for 10–30 years. Most affordable. Best for income replacement during working years.</div>
              <div><span className="text-white font-semibold">Whole Life:</span> Permanent coverage + cash value component. 5–15x more expensive than term.</div>
              <div><span className="text-white font-semibold">Universal Life:</span> Flexible premiums + permanent coverage + investment component. Complex.</div>
              <div><span className="text-[#F9A825] font-semibold">Rule of thumb:</span> 10–12x your annual income in coverage is a common starting point.</div>
            </div>
          </div>

          <p className="text-xs text-[#a8a8b3]">⚠️ This is a rough estimate. Consult a licensed insurance professional for accurate quotes and advice tailored to your situation. Not financial advice.</p>
        </div>
      </section>
    </div>
  )
}
