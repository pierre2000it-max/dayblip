"use client"
import Link from "next/link"

const tools = [
  { emoji: "💹", title: "Compound Interest", desc: "Watch your money grow over time", href: "/finance/compound-interest" },
  { emoji: "🏦", title: "Retirement Savings", desc: "Are you on track to retire?", href: "/finance/retirement-savings" },
  { emoji: "🏠", title: "Mortgage Calculator", desc: "Calculate your monthly payment", href: "/finance/mortgage-calculator" },
  { emoji: "💳", title: "Debt Payoff", desc: "Avalanche or snowball your debt", href: "/finance/debt-payoff" },
  { emoji: "📊", title: "Net Worth", desc: "Know where you stand financially", href: "/finance/net-worth" },
  { emoji: "📉", title: "Inflation Calculator", desc: "How much has money changed?", href: "/finance/inflation" },
  { emoji: "💼", title: "401(k) Calculator", desc: "Maximize your retirement account", href: "/finance/401k-calculator" },
  { emoji: "🛡️", title: "Emergency Fund", desc: "How much should you save?", href: "/finance/emergency-fund" },
  { emoji: "👴", title: "Social Security", desc: "When should you claim?", href: "/finance/social-security" },
  { emoji: "🎓", title: "Student Loans", desc: "Calculate your payoff timeline", href: "/finance/student-loan" },
  { emoji: "💼", title: "Freelancer Rate", desc: "What should you charge per hour?", href: "/finance/freelancer-rate" },
  { emoji: "💵", title: "Take Home Pay", desc: "Paycheck after all deductions", href: "/finance/take-home-pay" },
  { emoji: "📊", title: "Tax Bracket", desc: "Find your 2026 federal bracket", href: "/finance/tax-bracket" },
  { emoji: "🧾", title: "Self-Employment Tax", desc: "SE tax + quarterly estimates", href: "/finance/self-employment-tax" },
  { emoji: "💰", title: "Savings Goal", desc: "How long to reach your goal?", href: "/finance/savings-goal" },
  { emoji: "📋", title: "Budget Calculator", desc: "Build your 50/30/20 budget", href: "/finance/budget-calculator" },
  { emoji: "🚗", title: "Car Affordability", desc: "How much car can you afford?", href: "/finance/car-affordability" },
  { emoji: "🎓", title: "College Savings", desc: "529 plan calculator", href: "/finance/college-savings" },
  { emoji: "📈", title: "Break Even", desc: "When does your business profit?", href: "/finance/break-even" },
  { emoji: "📊", title: "Profit Margin", desc: "Gross, operating & net margins", href: "/finance/profit-margin" },
  { emoji: "💹", title: "Capital Gains Tax", desc: "Tax on investments & property", href: "/finance/capital-gains" },
  { emoji: "📈", title: "Stock Return", desc: "Calculate your investment return", href: "/finance/stock-return" },
  { emoji: "🏙️", title: "Cost of Living", desc: "Compare cities side by side", href: "/finance/cost-of-living" },
]

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Finance Calculators</h1>
          <p className="text-lg text-[#a8a8b3]">Free financial planning tools to help secure your future</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {tools.map(t => (
              <Link key={t.href} href={t.href} className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center transition-all hover:border-[#e94560]">
                <span className="text-4xl">{t.emoji}</span>
                <span className="font-bold text-white">{t.title}</span>
                <span className="text-sm text-[#a8a8b3]">{t.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
