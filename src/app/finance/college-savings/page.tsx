"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const COLLEGE_TYPES: [string, number][] = [
  ["Public in-state ($27,000/yr avg)", 27000],
  ["Public out-of-state ($45,000/yr avg)", 45000],
  ["Private university ($58,000/yr avg)", 58000],
  ["Community college ($12,000/yr avg)", 12000],
]

export default function CollegeSavingsPage() {
  const [childAge, setChildAge] = useState(5)
  const [collegeAge, setCollegeAge] = useState("18")
  const [currentSavings, setCurrentSavings] = useState("0")
  const [monthly, setMonthly] = useState("200")
  const [returnPct, setReturnPct] = useState("6")
  const [collegeTypeIdx, setCollegeTypeIdx] = useState(0)
  const [years, setYears] = useState("4")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("childage")) setChildAge(Number(p.get("childage")))
    if (p.get("current")) setCurrentSavings(p.get("current")!)
    if (p.get("monthly")) setMonthly(p.get("monthly")!)
    if (p.get("return")) setReturnPct(p.get("return")!)
    if (p.get("type")) setCollegeTypeIdx(Number(p.get("type")))
  }, [])

  const calc = useMemo(() => {
    const startAge = parseInt(String(collegeAge)) || 18
    const yearsToSave = Math.max(0, startAge - childAge)
    const months = yearsToSave * 12
    const r = (parseFloat(returnPct) || 0) / 100 / 12
    const cs = parseFloat(currentSavings) || 0
    const m = parseFloat(monthly) || 0
    const baseAnnualCost = COLLEGE_TYPES[collegeTypeIdx][1]
    const numYears = parseInt(years) || 4

    // Project tuition with 5% annual inflation
    const startYear = 2025 + yearsToSave
    let projectedTotalCost = 0
    for (let i = 0; i < numYears; i++) {
      projectedTotalCost += baseAnnualCost * Math.pow(1.05, yearsToSave + i)
    }

    // Project savings
    const projectedSavings = r === 0
      ? cs + m * months
      : cs * Math.pow(1 + r, months) + m * ((Math.pow(1 + r, months) - 1) / r)

    const gap = projectedTotalCost - projectedSavings
    const funded = projectedSavings >= projectedTotalCost

    // Monthly needed to fully fund
    const needed = projectedTotalCost
    const fromCurrent = r === 0 ? cs : cs * Math.pow(1 + r, months)
    const remainingNeeded = Math.max(0, needed - fromCurrent)
    const monthlyNeeded = months > 0 && r === 0
      ? remainingNeeded / months
      : months > 0 ? remainingNeeded * r / (Math.pow(1 + r, months) - 1) : 0

    return { projectedTotalCost, projectedSavings, gap, funded, monthlyNeeded, startYear, yearsToSave }
  }, [childAge, collegeAge, currentSavings, monthly, returnPct, collegeTypeIdx, years])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "College Savings Calculator",
          "Calculate how much to save now to cover future college costs with a 529 plan.",
          "https://www.dayblip.com/finance/college-savings",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How much should I save for my child's college?", answer: "It depends on your child's age, the type of school, and your expected investment return. This calculator projects the future cost using 5% annual tuition inflation and shows the monthly contribution needed to fully fund the years of college you choose." },
          { question: "What is a 529 plan?", answer: "A 529 plan is a tax-advantaged investment account for education. Earnings grow free of federal tax and withdrawals for qualified education expenses such as tuition, room and board, and books are also tax-free. Many states offer a deduction for contributions." },
          { question: "How much does college cost in the future?", answer: "This calculator starts from average annual costs by school type, ranging from about $12,000 for community college to $58,000 for private universities, and inflates them by 5% per year until your child starts college to estimate the total projected cost." },
          { question: "Can unused 529 funds be moved to a Roth IRA?", answer: "Yes. Under a rule that took effect in 2024, up to $35,000 of unused 529 funds can be rolled into the beneficiary's Roth IRA, subject to conditions. Unused funds can also be transferred to a sibling." },
        ]),
        howToSchema(
          "College Savings Calculator — How To Use",
          "Estimate how much to save monthly to cover future college costs with a 529 plan.",
          [
            "Set your child's current age and expected college start age.",
            "Enter your current 529 savings and monthly contribution.",
            "Enter your expected annual return and number of college years.",
            "Select the college type.",
            "Review the projected cost, funding gap, and monthly amount needed.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "College Savings Calculator", url: "https://www.dayblip.com/finance/college-savings" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">College Savings Calculator — How Much Do You Need to Save?</h1>
          <p className="text-[#a8a8b3]">Calculate how much to save for your child&apos;s college education</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Average annual college cost in 2025 is $38,000 at private universities and $11,000 at in-state public universities. To fully fund 4 years at a private university starting from a newborn requires saving approximately $650 per month for 18 years at 7% return. 529 plan contributions grow tax-free when used for qualified education expenses.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">College savings calculators project how much a 529 plan or other college savings account will be worth at the time of enrollment based on monthly contributions and investment returns. They account for estimated college cost inflation of 4-5% per year to show whether your savings rate is on track to meet actual future college costs.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "College Savings Calculator" }]} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Child&apos;s Current Age: {childAge}</span>
              <input type="range" min={0} max={17} value={childAge} onChange={e => setChildAge(Number(e.target.value))} className="mt-2 accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Expected College Start Age</span>
              <input type="number" value={collegeAge} onChange={e => setCollegeAge(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current 529 Savings ($)</span>
              <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly Contribution ($)</span>
              <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Expected Annual Return (%)</span>
              <input type="number" step="0.1" value={returnPct} onChange={e => setReturnPct(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Years of College</span>
              <input type="number" value={years} onChange={e => setYears(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1 md:col-span-2"><span className="text-sm font-semibold text-white">College Type</span>
              <select value={collegeTypeIdx} onChange={e => setCollegeTypeIdx(Number(e.target.value))}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {COLLEGE_TYPES.map(([label], i) => <option key={i} value={i}>{label}</option>)}
              </select></label>
          </div>

          {/* Cost projection */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
            <p className="text-[#a8a8b3] text-sm mb-1">Projected total cost by {calc.startYear} (with 5% annual tuition inflation)</p>
            <div className="text-4xl font-black text-[#e94560]">{fmt(calc.projectedTotalCost)}</div>
          </div>

          {/* Gap analysis */}
          <div className={`rounded-xl p-6 text-center ${calc.funded ? "border border-green-500/30 bg-green-900/20" : "border border-yellow-500/30 bg-yellow-900/20"}`}>
            <div className="text-3xl font-black" style={{ color: calc.funded ? "#4ade80" : "#F9A825" }}>
              {calc.funded ? "✅ Fully Funded" : "⚠️ Gap"}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div><div className="font-bold text-white">{fmt(calc.projectedSavings)}</div><div className="text-[#a8a8b3]">Projected savings</div></div>
              <div><div className={`font-bold ${calc.funded ? "text-green-400" : "text-[#e94560]"}`}>{calc.funded ? "Surplus: " : "Gap: "}{fmt(Math.abs(calc.projectedTotalCost - calc.projectedSavings))}</div><div className="text-[#a8a8b3]">vs cost</div></div>
            </div>
          </div>

          {!calc.funded && (
            <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-4 text-center">
              <p className="text-[#a8a8b3] text-sm">To fully fund {years} years of college, save:</p>
              <div className="text-3xl font-black text-[#4FC3F7]">{fmt(calc.monthlyNeeded)}/month</div>
            </div>
          )}

          {/* 529 benefits */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🏦 529 Plan Benefits</h2>
            <ul className="text-sm text-[#a8a8b3] space-y-1.5">
              <li>✅ <span className="text-white">Tax-free growth</span> — investments grow without federal taxes</li>
              <li>✅ <span className="text-white">Tax-free withdrawals</span> for qualified education expenses</li>
              <li>✅ <span className="text-white">State tax deduction</span> in many states for contributions</li>
              <li>✅ <span className="text-white">Transfer to siblings</span> if one child doesn&apos;t need it</li>
              <li>✅ <span className="text-white">Roth IRA rollover</span> — up to $35,000 unused funds can roll to Roth IRA (new 2024 rule)</li>
              <li>✅ Covers tuition, room & board, books, and other qualified expenses</li>
            </ul>
          </div>

          <ShareButtons
            text={`Saving $${monthly}/month in a 529 plan — ${calc.funded ? "✅ on track" : "⚠️ gap of " + fmt(Math.abs(calc.projectedTotalCost - calc.projectedSavings))} for college. (Educational only)`}
            url={`https://www.dayblip.com/finance/college-savings?childage=${childAge}&current=${currentSavings}&monthly=${monthly}&return=${returnPct}&type=${collegeTypeIdx}`}
            title="College Savings Calculator"
          />
          <RelatedTools tools={[
            { emoji: "🎓", title: "Student Loan Calculator", desc: "Plan for student debt", href: "/finance/student-loan" },
            { emoji: "🏫", title: "College ROI Calculator", desc: "Is college worth it?", href: "/tools/college-roi" },
            { emoji: "📈", title: "Compound Interest", desc: "Grow savings over time", href: "/finance/compound-interest" },
            { emoji: "📚", title: "GPA Calculator", desc: "Track your GPA", href: "/education/gpa-calculator" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">Educational estimate only. Tuition projections are estimates using 5% annual inflation. Actual costs vary by institution. Consult a financial advisor. 529 rules vary by state.</p>
        </div>
      </section>
    </div>
  )
}
