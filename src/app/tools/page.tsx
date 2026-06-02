import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Life & Money Tools — Financial Insight Calculators | Dayblip",
  description: "Free life and money calculators including salary checker, true hourly wage, state tax migration, career timeline and more.",
  alternates: { canonical: "https://www.dayblip.com/tools" },
}

const tools = [
  { emoji: "💼", title: "Am I Underpaid?", desc: "Check market rate for your role", href: "/tools/salary-checker" },
  { emoji: "📈", title: "Historical Stock Calculator", desc: "What if you invested in Apple in 2001?", href: "/tools/stock-calculator" },
  { emoji: "🗺️", title: "State Tax Savings", desc: "How much would moving states save?", href: "/tools/tax-migration" },
  { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
  { emoji: "📊", title: "Career Timeline", desc: "Project your salary and savings over time", href: "/tools/career-timeline" },
  { emoji: "🏠", title: "Home Affordability History", desc: "Could you afford a home in 1990?", href: "/tools/mortgage-by-year" },
  { emoji: "🗓️", title: "Debt Freedom Date", desc: "When will you be completely debt free?", href: "/tools/debt-freedom" },
  { emoji: "👨‍👩‍👧", title: "Generational Wealth Gap", desc: "Compare finances to parents at your age", href: "/tools/generational-wealth" },
  { emoji: "🚗", title: "True Car Cost", desc: "The real total cost of owning your car", href: "/tools/car-true-cost" },
  { emoji: "😴", title: "Procrastination Cost", desc: "What is waiting really costing you?", href: "/tools/procrastination-cost" },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💡</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Life &amp; Money Tools</h1>
          <p className="text-lg text-[#a8a8b3]">Tools that reveal what you might not know about your finances, career and life</p>
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
