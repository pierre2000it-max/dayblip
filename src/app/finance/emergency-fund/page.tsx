"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const SECURITY_OPTIONS = [
  { label: "Very Secure (government/tenured)", months: 3 },
  { label: "Somewhat Secure", months: 4 },
  { label: "Uncertain / At-Risk", months: 6 },
  { label: "Self-Employed / Freelance", months: 12 },
]

export default function EmergencyFundPage() {
  const [expenses, setExpenses] = useState({ rent: "", utilities: "", groceries: "", transportation: "", insurance: "", other: "" })
  const [security, setSecurity] = useState(0)
  const [currentSavings, setCurrentSavings] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("rent")) setExpenses(ex => ({ ...ex, rent: p.get("rent")! }))
    if (p.get("security")) setSecurity(Number(p.get("security")))
  }, [])

  const setE = (k: keyof typeof expenses) => (e: React.ChangeEvent<HTMLInputElement>) => setExpenses(ex => ({ ...ex, [k]: e.target.value }))

  const calc = useMemo(() => {
    const monthly = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0)
    const multiplier = SECURITY_OPTIONS[security].months
    const goal = monthly * multiplier
    const saved = parseFloat(currentSavings) || 0
    const pct = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0
    const status = pct >= 100 ? "Fully Funded ✅" : pct >= 50 ? "Partially Funded 🟡" : "Just Starting 🔴"
    const plans = [200, 300, 500, 1000].map(mo => ({
      monthly: mo,
      months: goal > saved ? Math.ceil((goal - saved) / mo) : 0,
    }))
    return { monthly, goal, saved, pct, status, multiplier, plans }
  }, [expenses, security, currentSavings])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Emergency Fund Calculator",
          "Calculate how big your emergency fund should be based on your monthly expenses.",
          "https://www.dayblip.com/finance/emergency-fund",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How many months of expenses should I keep in an emergency fund?", answer: "A common guideline is three to six months of essential expenses, but the right amount depends on job security. This calculator recommends three months for very secure jobs, four to six for less secure ones, and up to twelve months for the self-employed." },
          { question: "What expenses should an emergency fund cover?", answer: "Focus on essential monthly costs: rent or mortgage, utilities, groceries, transportation, insurance, and other necessities. The calculator totals these to set your monthly expense baseline and multiplies it by your recommended number of months." },
          { question: "How is my emergency fund goal calculated?", answer: "The calculator multiplies your total monthly essential expenses by a months-of-coverage factor based on your job security. It then compares your current savings to that goal and shows your funding progress as a percentage." },
          { question: "How long will it take to build my emergency fund?", answer: "Based on the gap between your goal and current savings, the calculator shows how many months it takes to get there at several monthly savings amounts, so you can pick a contribution pace that fits your budget." },
        ]),
        howToSchema(
          "Emergency Fund Calculator — How To Use",
          "Estimate the right size for your emergency fund based on expenses and job security.",
          [
            "Enter your essential monthly expenses in each category.",
            "Select your job security level.",
            "Enter your current emergency savings.",
            "Review your recommended fund size, funding progress, and savings timeline.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Emergency Fund Calculator", url: "https://www.dayblip.com/finance/emergency-fund" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Emergency Fund Calculator — How Much Do You Really Need?</h1>
          <p className="text-[#a8a8b3]">Find out exactly how much you need in your emergency fund</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Financial experts recommend 3-6 months of essential living expenses in a liquid emergency fund. The average American household spends $4,800 per month on essentials — meaning a 6-month emergency fund requires $28,800. Only 44% of Americans could cover a $1,000 emergency without going into debt.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">An emergency fund is liquid savings kept separate from investment accounts to cover unexpected expenses or income loss without taking on debt. Essential expenses include rent or mortgage, utilities, food, insurance and minimum debt payments. This calculator shows your target emergency fund and how long it takes to build at different monthly savings rates.</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Emergency Fund Calculator" }]} />
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h2 className="mb-4 font-bold text-white">💸 Monthly Essential Expenses</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Rent / Mortgage", k: "rent" as const },
                { label: "Utilities", k: "utilities" as const },
                { label: "Groceries", k: "groceries" as const },
                { label: "Transportation", k: "transportation" as const },
                { label: "Insurance", k: "insurance" as const },
                { label: "Other Essentials", k: "other" as const },
              ].map(f => (
                <label key={f.k} className="flex flex-col gap-1">
                  <span className="text-sm text-[#a8a8b3]">{f.label} ($/mo)</span>
                  <input type="number" value={expenses[f.k]} onChange={setE(f.k)} placeholder="0" className={inp} />
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">Job Security</label>
            <select value={security} onChange={e => setSecurity(Number(e.target.value))}
              className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {SECURITY_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
            </select>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Current Emergency Savings ($)</span>
            <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} placeholder="0" className={inp} />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-white">{fmt(calc.monthly)}</div>
              <div className="text-sm text-[#a8a8b3]">Monthly Expenses</div>
            </div>
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-[#F9A825]">{fmt(calc.goal)}</div>
              <div className="text-sm text-[#a8a8b3]">Recommended Fund ({calc.multiplier} months)</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
              <div className="text-2xl font-black text-[#4ade80]">{calc.status}</div>
              <div className="text-sm text-[#a8a8b3]">Status</div>
            </div>
          </div>

          {calc.goal > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Progress: {fmt(calc.saved)} of {fmt(calc.goal)}</span>
                <span className="text-[#F9A825]">{calc.pct.toFixed(0)}%</span>
              </div>
              <div className="h-4 rounded-full bg-[#16213e] overflow-hidden">
                <div className="h-full rounded-full bg-[#e94560] transition-all" style={{ width: `${calc.pct}%` }} />
              </div>
            </div>
          )}

          {calc.goal > calc.saved && calc.monthly > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h2 className="mb-3 font-bold text-white">📅 Savings Plan — Time to Goal</h2>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Save per Month</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Months to Goal</th>
                </tr></thead>
                <tbody>{calc.plans.map(p => (
                  <tr key={p.monthly} className="border-b border-[#0f3460]/50">
                    <td className="py-2 text-white">{fmt(p.monthly)}</td>
                    <td className="py-2 text-right text-[#4ade80]">{p.months} months</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <ShareButtons
            text={`I need ${fmt(calc.goal)} in my emergency fund — ${calc.multiplier} months of expenses. (Educational only)`}
            url="https://www.dayblip.com/finance/emergency-fund"
            title="Emergency Fund Calculator"
          />
          <RelatedTools tools={[
            { emoji: "💳", title: "Debt Payoff Calculator", desc: "Pay off debt faster", href: "/finance/debt-payoff" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "📊", title: "Budget Calculator", desc: "Build a monthly budget", href: "/finance/budget-calculator" },
            { emoji: "📈", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Emergency fund needs vary by individual circumstances.</p>
        </div>
      </section>
    </div>
  )
}
