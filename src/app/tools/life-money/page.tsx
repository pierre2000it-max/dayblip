import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Life & Money Tools — Career, Income and Wealth Calculators | Dayblip",
  description: "Free calculators for salary negotiation, financial independence, AI job risk, true hourly wage, WFH savings, recession readiness and more. No signup needed.",
  alternates: { canonical: "https://www.dayblip.com/tools/life-money" },
}

const tools = [
  { emoji: "🤖", title: "Will AI Replace My Job?", desc: "Get your personalized AI risk score", href: "/tools/ai-job-score" },
  { emoji: "🆓", title: "Financial Independence Date", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
  { emoji: "💰", title: "Salary Negotiation Guide", desc: "How much to ask for + ready-to-use script", href: "/tools/salary-negotiation" },
  { emoji: "💼", title: "Side Hustle Potential", desc: "What could you earn with your skills?", href: "/tools/side-hustle" },
  { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
  { emoji: "💳", title: "Minimum Payment True Cost", desc: "See the shocking cost of paying minimums", href: "/tools/minimum-payment" },
  { emoji: "⏰", title: "Early vs Late Saver", desc: "Why starting earlier beats saving more", href: "/tools/early-vs-late" },
  { emoji: "📈", title: "Market Timing Cost", desc: "What missing 10 best days costs you", href: "/tools/market-timing" },
  { emoji: "🏠", title: "WFH Savings Calculator", desc: "What is remote work really worth?", href: "/tools/wfh-calculator" },
  { emoji: "🎓", title: "College Degree ROI", desc: "Was your college investment worth it?", href: "/tools/college-roi" },
  { emoji: "📉", title: "Recession Readiness Score", desc: "How prepared are you for a downturn?", href: "/tools/recession-score" },
  { emoji: "💼", title: "Am I Underpaid?", desc: "Check market rate for your role", href: "/tools/salary-checker" },
  { emoji: "📈", title: "Historical Stock Calculator", desc: "What if you invested in Apple in 2001?", href: "/tools/stock-calculator" },
  { emoji: "🗺️", title: "State Tax Savings", desc: "How much would moving states save?", href: "/tools/tax-migration" },
  { emoji: "📊", title: "Career Timeline", desc: "Project your salary and savings over time", href: "/tools/career-timeline" },
  { emoji: "🏠", title: "Home Affordability History", desc: "Could you afford a home in 1990?", href: "/tools/mortgage-by-year" },
  { emoji: "🗓️", title: "Debt Freedom Date", desc: "When will you be completely debt free?", href: "/tools/debt-freedom" },
  { emoji: "👨‍👩‍👧", title: "Generational Wealth Gap", desc: "Compare finances to parents at your age", href: "/tools/generational-wealth" },
  { emoji: "🚗", title: "True Car Cost", desc: "The real total cost of owning your car", href: "/tools/car-true-cost" },
]

export default function ToolsLifeMoneyPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💡</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Life &amp; Money Tools</h1>
          <p className="text-lg text-[#a8a8b3]">Career, income and wealth calculators that reveal what your paycheck is really worth</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[1100px]">
          <nav className="mb-8 flex items-center gap-1 text-sm text-[#a8a8b3]">
            <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
            <span className="text-[#0f3460]">/</span>
            <Link href="/tools" className="hover:text-[#e94560] transition-colors">Tools</Link>
            <span className="text-[#0f3460]">/</span>
            <span className="text-white font-medium">Life &amp; Money</span>
          </nav>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {tools.map(t => (
              <Link key={t.href} href={t.href} className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center transition-all hover:border-[#e94560]">
                <span className="text-4xl">{t.emoji}</span>
                <div className="font-semibold text-white text-sm">{t.title}</div>
                <div className="text-xs text-[#a8a8b3]">{t.desc}</div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tools" className="text-sm text-[#a8a8b3] hover:text-[#e94560] transition-colors">← Back to all tools</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
