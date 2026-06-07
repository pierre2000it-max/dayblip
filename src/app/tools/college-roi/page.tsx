"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

// ─── Data ─────────────────────────────────────────────────────────────────────
const avgTotalCost: Record<string, number> = {
  "Community College": 18000,
  "State University": 45000,
  "Private University": 130000,
  "Ivy League": 240000,
  "Trade or Vocational School": 16000,
}

const degreeBonus: Record<string, number> = {
  "STEM": 1.82, "Law": 2.10, "Healthcare": 1.95, "Business": 1.55,
  "Education": 1.28, "Liberal Arts": 1.22, "Arts and Humanities": 1.15,
  "Trade School": 1.60, "Other": 1.30,
}

const FIELDS = Object.keys(degreeBonus)
const SCHOOLS = Object.keys(avgTotalCost)
const NO_DEGREE_SALARY = 38500

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fv(pv: number, r: number, n: number) { return pv * Math.pow(1 + r, n) }

interface Result {
  field: string; school: string; debt: number; years: number; salary: number
  expectedSalary: number; extraAnnual: number; lifetimeExtra: number
  totalCost: number; totalDebt: number; opportunityCost: number
  netGain: number; roiPercent: number; breakEven: number; breakEvenAge: number
  investedValue: number; monthlyPayment: number
}

function compute(field: string, school: string, debt: number, years: number, salary: number): Result {
  const expectedSalary = Math.round(NO_DEGREE_SALARY * degreeBonus[field])
  const extraAnnual = Math.max(0, salary - NO_DEGREE_SALARY)
  const lifetimeExtra = extraAnnual * 40
  const totalCost = avgTotalCost[school]
  const totalDebt = Math.round(debt * 1.35)
  const opportunityCost = Math.round(debt * (Math.pow(1.07, years) - 1))
  const netGain = lifetimeExtra - totalDebt - opportunityCost
  const roiPercent = totalCost > 0 ? Math.round((netGain / totalCost) * 100) : 0
  const breakEven = extraAnnual > 0 ? +(totalDebt / extraAnnual).toFixed(1) : 0
  const breakEvenAge = Math.round(22 + breakEven)
  const investedValue = Math.round(fv(debt, 0.10, years))
  const monthlyPayment = Math.round(totalDebt / (10 * 12))
  return {
    field, school, debt, years, salary, expectedSalary, extraAnnual, lifetimeExtra,
    totalCost, totalDebt, opportunityCost, netGain, roiPercent, breakEven, breakEvenAge,
    investedValue, monthlyPayment,
  }
}

function verdictConfig(roi: number) {
  if (roi > 300) return { emoji: "✅", label: "Excellent Investment", text: "Your degree is paying off strongly.", color: "#15803d", border: "border-[#15803d]/40", bg: "bg-[#15803d]/10" }
  if (roi >= 100) return { emoji: "✅", label: "Worth It", text: "Your degree is a solid investment.", color: "#16a34a", border: "border-[#16a34a]/40", bg: "bg-[#16a34a]/10" }
  if (roi >= 0)  return { emoji: "⚠️", label: "Marginal Return", text: "Your degree is barely breaking even.", color: "#d97706", border: "border-[#d97706]/40", bg: "bg-[#d97706]/10" }
  return { emoji: "❌", label: "Financially Underwater", text: "Your debt may outweigh your earnings premium.", color: "#dc2626", border: "border-[#dc2626]/40", bg: "bg-[#dc2626]/10" }
}

export default function CollegeROIPage() {
  const [field, setField] = useState("STEM")
  const [school, setSchool] = useState("State University")
  const [debt, setDebt] = useState("35000")
  const [years, setYears] = useState(5)
  const [salary, setSalary] = useState("55000")
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true, f = field, sc = school, d = debt, y = years, sal = salary) {
    const res = compute(f, sc, +(d) || 0, y, +(sal) || 0)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?field=${encodeURIComponent(f)}&school=${encodeURIComponent(sc)}&debt=${+d || 0}&years=${y}&salary=${+sal || 0}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const f = p.get("field"), sc = p.get("school"), d = p.get("debt"), y = p.get("years"), sal = p.get("salary")
    if (f && sc && d && y && sal) {
      setField(f); setSchool(sc); setDebt(d); setYears(+y); setSalary(sal)
      runCalc(false, f, sc, d, +y, sal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/college-roi?field=${encodeURIComponent(field)}&school=${encodeURIComponent(school)}&debt=${+debt||0}&years=${years}&salary=${+salary||0}` : ""
  const shareText = result
    ? `Calculated my college degree ROI: ${result.roiPercent}%\n${verdictConfig(result.roiPercent).label}\nDebt: ${fmt(result.debt)} | Current salary: ${fmt(result.salary)}\nWas yours worth it?\n(Educational only — not financial advice)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("College Degree ROI Calculator", "Calculate the true return on investment of your college degree. Compare degree earnings vs student debt costs and opportunity cost.", "https://www.dayblip.com/tools/college-roi", "FinanceApplication"),
        faqSchema([
          { question: "Is college worth the cost?", answer: "It depends on your field, school type and career. STEM and healthcare degrees typically show strong ROI while some liberal arts degrees may take decades to break even financially." },
          { question: "How do I calculate college ROI?", answer: "College ROI compares extra lifetime earnings from your degree against total education costs, student loan interest, and the opportunity cost of investing that money instead." },
          { question: "What is the average student loan debt?", answer: "The average US student loan debt is approximately $37,000. With interest over a standard 10-year repayment, borrowers typically pay back 30-40% more than the original loan amount." },
        ]),
        howToSchema("How to Calculate Your College Degree ROI", "Find the true return on your degree", [
          "Select your degree field",
          "Select your school type",
          "Enter total student loan debt",
          "Enter years since graduation",
          "Enter your current annual salary",
          "Click Calculate My ROI for full breakdown",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "College Degree ROI", url: "https://www.dayblip.com/tools/college-roi" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Was Your College Degree Worth It?</h1>
          <p className="text-[#a8a8b3]">Calculate the true financial return on your college investment</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">College ROI varies dramatically by field and school type. STEM degrees from state universities typically show 200–400% ROI over a career. Liberal arts degrees from private universities can take 20+ years to break even financially. The average student loan debt of $37,000 costs approximately $50,000 total with interest over a standard 10-year repayment.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">College degree ROI compares your extra lifetime earnings above a high school diploma against total education costs, student loan interest, and the opportunity cost of investing that money in the stock market instead. This calculator uses national median salary data by degree field and school type to estimate your personal degree return on investment.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "College Degree ROI" }
          ]} />
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
            ⚠️ <strong>Educational estimates.</strong> Based on national median data. Individual results vary by career, employer, location and economic conditions. Not financial advice.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Degree field</span>
              <select value={field} onChange={e => setField(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">School type</span>
              <select value={school} onChange={e => setSchool(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Total student debt ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={debt} onChange={e => setDebt(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Current annual salary ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Years since graduation: {years}</span>
            <input type="range" min={1} max={30} value={years} onChange={e => setYears(+e.target.value)} className="accent-[#e94560]" />
          </label>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My ROI
          </button>

          {result && (() => {
            const vc = verdictConfig(result.roiPercent)
            const roiColor = result.roiPercent > 100 ? "#4ade80" : result.roiPercent >= 0 ? "#F9A825" : "#e94560"
            return (
              <div className="space-y-6">
                {/* ROI headline */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                  <div className="text-sm text-[#a8a8b3]">Your Degree ROI</div>
                  <div className="my-2 text-6xl font-black" style={{ color: roiColor }}>{result.roiPercent}%</div>
                  <div className="text-sm text-[#a8a8b3]">{result.field} degree from a {result.school}</div>
                </div>

                {/* Verdict */}
                <div className={`rounded-xl border ${vc.border} ${vc.bg} p-5 text-center`}>
                  <div className="text-xl font-black" style={{ color: vc.color }}>{vc.emoji} {vc.label}</div>
                  <div className="mt-1 text-sm text-white">{vc.text}</div>
                </div>

                {/* Breakdown cards */}
                <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-3">
                  {[
                    { label: "Extra earnings vs no degree", val: fmt(result.extraAnnual) + "/yr", color: "#4ade80" },
                    { label: "Lifetime earnings premium", val: fmt(result.lifetimeExtra), color: "#F9A825" },
                    { label: "Degree investment cost", val: fmt(result.totalCost), color: "#ffffff" },
                    { label: "Total debt with interest", val: fmt(result.totalDebt), color: "#e94560" },
                    { label: "Opportunity cost of debt", val: fmt(result.opportunityCost), color: "#e94560" },
                    { label: "Net financial gain", val: fmt(result.netGain), color: result.netGain >= 0 ? "#4ade80" : "#e94560" },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                      <div className="font-black" style={{ color: c.color }}>{c.val}</div>
                      <div className="mt-0.5 text-xs text-[#a8a8b3]">{c.label}</div>
                    </div>
                  ))}
                </div>

                {/* Break-even */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-white">
                  <div className="font-bold text-white mb-1">🎯 Break-even point</div>
                  <p>You break even on your degree at <span className="font-bold text-[#e94560]">age {result.breakEvenAge}</span> ({result.breakEven} years after graduation).</p>
                  <p className="mt-1 text-[#a8a8b3]">Estimated monthly loan payment: <span className="font-bold text-white">{fmt(result.monthlyPayment)}/month</span></p>
                </div>

                {/* VS investing */}
                <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                  <div className="font-bold text-white mb-1">📈 If debt was invested instead</div>
                  <p>If your <span className="font-bold">{fmt(result.debt)}</span> in debt was invested in the S&P 500 when you graduated:</p>
                  <p className="mt-1 font-bold text-[#4FC3F7]">It would be worth {fmt(result.investedValue)} today</p>
                  <p className="mt-1 text-xs text-[#a8a8b3]">Using 10% average S&P 500 historical return over {result.years} years</p>
                </div>

                {/* Context */}
                <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                  <div className="font-bold text-[#F9A825] mb-1">💡 College value beyond money</div>
                  Career flexibility, earning potential, networking, personal growth and credentials that open doors. ROI is only one measure of value.
                </div>

                <ShareButtons text={shareText} url={shareUrl} title="College Degree ROI Calculator" />
                <RelatedTools tools={[
                  { emoji: "🎓", title: "Student Loans", desc: "Calculate your payoff timeline", href: "/finance/student-loan" },
                  { emoji: "💼", title: "Am I Underpaid?", desc: "Check market rate for your role", href: "/tools/salary-checker" },
                  { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
                  { emoji: "🤖", title: "Will AI Replace My Job?", desc: "Get your personalized AI risk score", href: "/tools/ai-job-score" },
                  { emoji: "📊", title: "Career Timeline", desc: "Project your salary and savings over time", href: "/tools/career-timeline" },
                ]} />
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
