"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const PRESETS = [
  { label: "Emergency Fund", amount: 10000 },
  { label: "Down Payment", amount: 50000 },
  { label: "Dream Vacation", amount: 5000 },
  { label: "New Car", amount: 30000 },
  { label: "Wedding", amount: 25000 },
  { label: "College Fund", amount: 100000 },
]

function addMonthsLabel(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export default function SavingsGoalPage() {
  const [goal, setGoal] = useState("10000")
  const [current, setCurrent] = useState("0")
  const [monthly, setMonthly] = useState("500")
  const [rate, setRate] = useState("4")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("goal")) setGoal(p.get("goal")!)
    if (p.get("current")) setCurrent(p.get("current")!)
    if (p.get("monthly")) setMonthly(p.get("monthly")!)
    if (p.get("rate")) setRate(p.get("rate")!)
  }, [])

  const calc = useMemo(() => {
    const g = parseFloat(goal) || 0
    const c = parseFloat(current) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const needed = Math.max(0, g - c)

    let months = 0
    let balance = c
    const rows: { month: number; contribution: number; interest: number; balance: number }[] = []
    const MAX = 1200
    while (balance < g && months < MAX) {
      months++
      const interest = balance * r
      balance += m + interest
      if (months % 6 === 0 || months === 1) {
        rows.push({ month: months, contribution: m, interest, balance: Math.min(balance, g) })
      }
    }

    const totalContributions = m * months
    const interestEarned = Math.max(0, g - c - totalContributions)
    const halfMonthly = needed > 0 && m > 0 ? Math.ceil(needed / (months / 2) + c * r * (months / 2)) : m * 2

    const years = Math.floor(months / 12)
    const remMonths = months % 12

    return { months, years, remMonths, totalContributions, interestEarned, targetDate: addMonthsLabel(months), halfMonthly, rows }
  }, [goal, current, monthly, rate])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Savings Goal Calculator",
          "Calculate how much to save each month to reach your savings goal by your target date.",
          "https://www.dayblip.com/finance/savings-goal",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How long will it take to reach my savings goal?", answer: "The calculator simulates month by month: it adds your monthly contribution plus interest on the balance until you hit your goal, then reports the time in years and months and the calendar target date." },
          { question: "Does it account for interest earned?", answer: "Yes. Enter an annual interest rate and the tool compounds it monthly on your growing balance, so interest shortens the time to your goal and is shown separately from your contributions." },
          { question: "How can I reach my goal faster?", answer: "The Speed Up panel estimates the monthly amount needed to hit your goal in roughly half the time. Increasing your monthly contribution or starting with a larger current balance both shorten the timeline." },
          { question: "Can I use it for specific goals like a down payment or emergency fund?", answer: "Yes. Preset buttons load common targets such as an emergency fund, down payment, new car, wedding or college fund, and you can edit any amount to match your own goal." },
        ]),
        howToSchema(
          "Savings Goal Calculator — How To Use",
          "Work out how long it takes to reach a savings goal.",
          [
            "Choose a preset goal or type your own savings goal amount.",
            "Enter how much you have already saved.",
            "Enter your planned monthly contribution and the annual interest rate.",
            "Read the time to reach your goal, the target date and total interest earned, then check the Speed Up tip to finish faster.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Savings Goal Calculator", url: "https://www.dayblip.com/finance/savings-goal" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Savings Goal Calculator — How Long Until You Reach Your Target?</h1>
          <p className="text-[#a8a8b3]">Calculate how long it takes to reach any savings goal</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">To save $20,000 in 2 years you need to save $833 per month. At 5% annual interest in a high-yield savings account you need $792 per month. For a $50,000 emergency fund saving $1,000 per month takes 4.2 years without interest or 3.9 years at 5% yield.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A savings goal calculator shows how long it takes to reach a target amount at different monthly savings rates and interest yields. It accounts for compound interest on existing savings and regular contributions. Use it to plan emergency funds, down payments, vacations, home renovations or any other specific savings target.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Savings Goal Calculator" }]} />

          {/* Presets */}
          <div>
            <p className="text-sm font-semibold text-white mb-2">🎯 Popular Goals</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => setGoal(String(p.amount))}
                  className="rounded-full border border-[#0f3460] px-4 py-1.5 text-sm text-[#a8a8b3] hover:border-[#e94560] hover:text-white transition-colors">
                  {p.label} ({fmt(p.amount)})
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Savings Goal ($)</span>
              <input type="number" value={goal} onChange={e => setGoal(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current Savings ($)</span>
              <input type="number" value={current} onChange={e => setCurrent(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly Contribution ($)</span>
              <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Interest Rate (%)</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className={inp} /></label>
          </div>

          {/* Main result */}
          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-5xl font-black text-[#F9A825]">
              {calc.years > 0 ? `${calc.years}y ` : ""}{calc.remMonths}mo
            </div>
            <div className="text-[#a8a8b3] mt-1">to reach your goal</div>
            <div className="text-white font-semibold mt-1">Target: {calc.targetDate}</div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><div className="font-bold text-white">{fmt(calc.totalContributions)}</div><div className="text-[#a8a8b3]">Total contributions</div></div>
              <div><div className="font-bold text-[#4ade80]">{fmt(calc.interestEarned)}</div><div className="text-[#a8a8b3]">Interest earned</div></div>
            </div>
          </div>

          {/* Speed up */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-4 text-sm">
            <span className="text-[#4FC3F7] font-semibold">⚡ Speed Up: </span>
            <span className="text-[#a8a8b3]">To reach your goal in half the time, save approximately </span>
            <span className="text-white font-bold">{fmt(calc.halfMonthly)}/month</span>
          </div>

          <ShareButtons
            text={`I'll reach my $${goal} savings goal in ${calc.years > 0 ? calc.years + "y " : ""}${calc.remMonths} months! (Educational only)`}
            url={`https://www.dayblip.com/finance/savings-goal?goal=${goal}&current=${current}&monthly=${monthly}&rate=${rate}`}
            title="Savings Goal Calculator"
          />

          {/* Month by month */}
          {calc.rows.length > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h2 className="mb-3 font-bold text-white">📅 Progress Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#0f3460]">
                    <th className="py-2 text-left text-[#a8a8b3]">Month</th>
                    <th className="py-2 text-right text-[#a8a8b3]">Contribution</th>
                    <th className="py-2 text-right text-[#a8a8b3]">Interest</th>
                    <th className="py-2 text-right text-[#a8a8b3]">Balance</th>
                  </tr></thead>
                  <tbody>{calc.rows.map(r => (
                    <tr key={r.month} className="border-b border-[#0f3460]/50">
                      <td className="py-2 text-white">{r.month}</td>
                      <td className="py-2 text-right text-[#a8a8b3]">{fmt(r.contribution)}</td>
                      <td className="py-2 text-right text-[#4ade80]">{fmt(r.interest)}</td>
                      <td className="py-2 text-right text-[#F9A825] font-bold">{fmt(r.balance)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}          <RelatedTools tools={[
            { emoji: "📈", title: "Compound Interest", desc: "Grow wealth over time", href: "/finance/compound-interest" },
            { emoji: "🚨", title: "Emergency Fund", desc: "Build your safety net", href: "/finance/emergency-fund" },
            { emoji: "📊", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
            { emoji: "🏖️", title: "FI Date Calculator", desc: "When can you stop working?", href: "/tools/fi-date" },
          ]} />
          <FAQAccordion items={[
            { q: "How long does it take to save a specific amount?", a: "Time to reach a savings goal depends on starting balance, monthly contribution, and interest rate. At 4.5 percent APY saving $500 per month from zero, reaching $50,000 takes approximately 7.5 years." },
            { q: "What savings rate should I target?", a: "A common guideline is saving at least 20 percent of gross income — 10 percent for retirement and 10 percent for other goals. The earlier you start the less you need to save each month to reach the same goal due to compound interest." },
            { q: "What interest rate should I assume?", a: "High-yield savings accounts as of 2024 to 2026 have offered 4 to 5.5 percent APY. Standard bank savings accounts typically offer 0.01 to 0.5 percent. Using a conservative 3 to 4 percent rate is reasonable for long-term planning." },
            { q: "Does this calculator account for inflation?", a: "This calculator shows nominal growth — the actual dollar amount you will have. To estimate real purchasing power, subtract the expected inflation rate of around 3 percent from your interest rate." },
          ].map(item => ({ question: item.q, answer: item.a }))} />

        </div>
      </section>
    </div>
  )
}
