"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const NEEDS_CATS = [
  { key: "housing", label: "Housing (rent/mortgage)", pct: 0.30 },
  { key: "food", label: "Food & Groceries", pct: 0.10 },
  { key: "utilities", label: "Utilities", pct: 0.05 },
  { key: "transport", label: "Transportation", pct: 0.08 },
  { key: "insurance", label: "Insurance", pct: 0.05 },
  { key: "debtMin", label: "Minimum Debt Payments", pct: 0.05 },
]
const WANTS_CATS = [
  { key: "dining", label: "Dining Out", pct: 0.08 },
  { key: "entertainment", label: "Entertainment", pct: 0.05 },
  { key: "shopping", label: "Shopping", pct: 0.07 },
  { key: "subscriptions", label: "Subscriptions", pct: 0.03 },
  { key: "hobbies", label: "Hobbies", pct: 0.07 },
]
const SAVINGS_CATS = [
  { key: "emergency", label: "Emergency Fund", pct: 0.05 },
  { key: "retirement", label: "Retirement / 401(k)", pct: 0.08 },
  { key: "debtExtra", label: "Extra Debt Payments", pct: 0.04 },
  { key: "investments", label: "Investments", pct: 0.03 },
]

export default function BudgetCalculatorPage() {
  const [income, setIncome] = useState("5000")
  const [actuals, setActuals] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("income")) setIncome(p.get("income")!)
  }, [])

  const setActual = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setActuals(a => ({ ...a, [k]: e.target.value }))

  const calc = useMemo(() => {
    const inc = parseFloat(income) || 0
    const needs = inc * 0.50
    const wants = inc * 0.30
    const savings = inc * 0.20

    const totalActualNeeds = NEEDS_CATS.reduce((s, c) => s + (parseFloat(actuals[c.key] || "") || 0), 0)
    const totalActualWants = WANTS_CATS.reduce((s, c) => s + (parseFloat(actuals[c.key] || "") || 0), 0)
    const totalActualSavings = SAVINGS_CATS.reduce((s, c) => s + (parseFloat(actuals[c.key] || "") || 0), 0)

    const needsPct = inc > 0 ? (totalActualNeeds / inc * 100).toFixed(0) : "0"
    const wantsPct = inc > 0 ? (totalActualWants / inc * 100).toFixed(0) : "0"
    const savingsPct = inc > 0 ? (totalActualSavings / inc * 100).toFixed(0) : "0"

    return { inc, needs, wants, savings, totalActualNeeds, totalActualWants, totalActualSavings, needsPct, wantsPct, savingsPct }
  }, [income, actuals])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none w-32"

  const Section = ({ title, emoji, target, actual, cats, color }: {
    title: string; emoji: string; target: number; actual: number; cats: typeof NEEDS_CATS; color: string
  }) => (
    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-white">{emoji} {title}</h2>
        <div className="text-right">
          <div className="font-black text-lg" style={{ color }}>{fmt(target)}/mo</div>
          <div className="text-xs text-[#a8a8b3]">recommended</div>
        </div>
      </div>
      <div className="space-y-2">
        {cats.map(c => {
          const rec = calc.inc * c.pct
          const act = parseFloat(actuals[c.key] || "") || 0
          const hasActual = actuals[c.key] !== undefined && actuals[c.key] !== ""
          const over = hasActual && act > rec
          return (
            <div key={c.key} className="flex items-center gap-3">
              <span className="text-sm text-[#a8a8b3] flex-1">{c.label}</span>
              <span className="text-xs text-[#a8a8b3] w-20 text-right">{fmt(rec)} rec</span>
              <input type="number" placeholder="Actual" value={actuals[c.key] || ""} onChange={setActual(c.key)}
                className={`${inp} ${hasActual ? (over ? "border-[#e94560]" : "border-green-500") : ""}`} />
              {hasActual && <span className={`text-xs w-4 ${over ? "text-[#e94560]" : "text-green-400"}`}>{over ? "↑" : "✓"}</span>}
            </div>
          )
        })}
      </div>
      {Object.keys(actuals).some(k => cats.map(c => c.key).includes(k) && actuals[k]) && (
        <div className={`mt-3 text-sm rounded-lg p-2 ${actual > target ? "bg-red-900/20 text-[#e94560]" : "bg-green-900/20 text-green-400"}`}>
          Actual: {fmt(actual)} {actual > target ? `⚠️ ${fmt(actual - target)} over budget` : `✅ ${fmt(target - actual)} under budget`}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Budget Calculator",
          "Build a monthly budget with the 50/30/20 rule and see where your money goes.",
          "https://www.dayblip.com/finance/budget-calculator",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "What is the 50/30/20 budget rule?", answer: "The 50/30/20 rule splits your monthly take-home pay into 50% for needs, 30% for wants, and 20% for savings and debt payoff. This calculator applies those percentages to your income and shows the recommended dollar amount for each category." },
          { question: "What counts as a need versus a want?", answer: "Needs are essential expenses like housing, food, utilities, transportation, insurance, and minimum debt payments. Wants are lifestyle spending like dining out, entertainment, shopping, subscriptions, and hobbies. The calculator groups your categories accordingly." },
          { question: "How do I know if I am overspending?", answer: "Enter your actual spending in each category and the calculator compares it to the recommended amount. It flags categories and groups that exceed the 50/30/20 targets and shows how many dollars you are over or under budget." },
          { question: "Should I use gross or take-home income?", answer: "Use your monthly take-home pay, which is the amount you receive after taxes and deductions. The 50/30/20 rule is designed around the money you actually have available to spend and save each month." },
        ]),
        howToSchema(
          "Budget Calculator — How To Use",
          "Build a 50/30/20 monthly budget and compare it to your actual spending.",
          [
            "Enter your monthly take-home pay.",
            "Review the recommended amounts for needs, wants, and savings.",
            "Enter your actual spending in each needs, wants, and savings category.",
            "Review the personalized insights to see where you are over or under the targets.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Budget Calculator", url: "https://www.dayblip.com/finance/budget-calculator" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Budget Calculator — The 50/30/20 Rule Breakdown</h1>
          <p className="text-[#a8a8b3]">Build your budget using the proven 50/30/20 rule</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The 50/30/20 budget rule allocates 50% of after-tax income to needs, 30% to wants and 20% to savings and debt repayment. On a $5,000 monthly take-home: $2,500 for needs, $1,500 for wants and $1,000 for savings. Most Americans spend 77% on needs alone — leaving little for savings or discretionary spending.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The 50/30/20 budget rule is a simple framework for allocating after-tax income. Needs include housing, utilities, food, insurance and minimum debt payments. Wants are everything non-essential. The 20% savings category includes emergency fund, retirement and extra debt payments.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Budget Calculator" }]} />
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Monthly Take-Home Pay ($)</span>
            <input type="number" value={income} onChange={e => setIncome(e.target.value)}
              className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none max-w-xs" />
          </label>

          {/* 50/30/20 summary */}
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "50% Needs", value: calc.needs, color: "#4FC3F7", actual: calc.totalActualNeeds, pct: calc.needsPct },
              { label: "30% Wants", value: calc.wants, color: "#F9A825", actual: calc.totalActualWants, pct: calc.wantsPct },
              { label: "20% Savings", value: calc.savings, color: "#4ade80", actual: calc.totalActualSavings, pct: calc.savingsPct },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                <div className="text-xl font-black" style={{ color: r.color }}>{fmt(r.value)}</div>
                <div className="text-sm text-[#a8a8b3]">{r.label}</div>
                {r.actual > 0 && <div className="text-xs text-[#a8a8b3] mt-1">Actual: {r.pct}% ({fmt(r.actual)})</div>}
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
            <div className="flex h-6 rounded-full overflow-hidden">
              <div className="transition-all" style={{ width: "50%", background: "#4FC3F7" }} />
              <div className="transition-all" style={{ width: "30%", background: "#F9A825" }} />
              <div className="transition-all" style={{ width: "20%", background: "#4ade80" }} />
            </div>
            <div className="flex text-xs text-[#a8a8b3] mt-1">
              <span style={{ width: "50%" }}>50% Needs</span>
              <span style={{ width: "30%" }}>30% Wants</span>
              <span style={{ width: "20%" }}>20% Savings</span>
            </div>
          </div>

          <p className="text-sm text-[#a8a8b3]">Enter your actual spending in each category below to see how you compare to the 50/30/20 target:</p>

          <Section title="Needs — Essential Expenses" emoji="🏠" target={calc.needs} actual={calc.totalActualNeeds} cats={NEEDS_CATS} color="#4FC3F7" />
          <Section title="Wants — Lifestyle Expenses" emoji="🎉" target={calc.wants} actual={calc.totalActualWants} cats={WANTS_CATS} color="#F9A825" />
          <Section title="Savings & Debt Payoff" emoji="💰" target={calc.savings} actual={calc.totalActualSavings} cats={SAVINGS_CATS} color="#4ade80" />

          {/* Advice */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">💡 Personalized Insights</h2>
            <div className="space-y-1 text-sm text-[#a8a8b3]">
              {parseInt(calc.needsPct) > 50 && <p>⚠️ You are spending {calc.needsPct}% on needs — above the 50% target. Look for ways to reduce fixed expenses.</p>}
              {parseInt(calc.wantsPct) > 30 && <p>⚠️ You are spending {calc.wantsPct}% on wants — above the 30% target. Consider cutting discretionary spending.</p>}
              {parseInt(calc.savingsPct) < 20 && parseInt(calc.savingsPct) > 0 && <p>⚠️ You are saving {calc.savingsPct}% — below the 20% target. Automate savings to close the gap.</p>}
              {parseInt(calc.needsPct) <= 50 && parseInt(calc.wantsPct) <= 30 && parseInt(calc.savingsPct) >= 20 && parseInt(calc.savingsPct) > 0 && <p className="text-green-400">✅ You are within the 50/30/20 guidelines. Great work!</p>}
            </div>
          </div>

          <ShareButtons
            text={`50/30/20 budget breakdown for $${income}/month income — free budget planner!`}
            url={`https://www.dayblip.com/finance/budget-calculator?income=${income}`}
            title="Budget Calculator"
          />
          <RelatedTools tools={[
            { emoji: "📈", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
            { emoji: "💳", title: "Debt Payoff Calculator", desc: "Pay off debt faster", href: "/finance/debt-payoff" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "💵", title: "Take-Home Pay", desc: "See your net paycheck", href: "/finance/take-home-pay" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">The 50/30/20 rule is a guideline, not a rigid rule. Adjust based on your income, debt, and goals. For educational purposes only.</p>
          <FAQAccordion items={[
            { q: "What is the 50/30/20 budgeting rule?", a: "The 50/30/20 rule allocates 50 percent of after-tax income to needs such as rent, food, utilities, and minimum debt payments; 30 percent to wants like dining out and entertainment; and 20 percent to savings and extra debt payments. It is a starting guideline not a rigid rule." },
            { q: "What counts as a need vs a want?", a: "Needs are expenses required for basic living — housing, utilities, groceries, transportation to work, minimum debt payments, and essential insurance. Wants are discretionary — restaurants, streaming services, clothing beyond basics, hobbies, and vacations." },
            { q: "How do I handle irregular income in a budget?", a: "Budget based on your lowest typical monthly income. In months where you earn more, direct the surplus to savings or debt. This prevents overspending in good months and shortfalls in lean ones." },
            { q: "Should I budget gross or net income?", a: "Budget using net take-home income — the amount that actually hits your bank account after taxes and deductions. Gross income includes money you never see so budgeting from it leads to overspending." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
