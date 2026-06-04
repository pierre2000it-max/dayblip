import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Life & Money Tools — Financial Insight Calculators | Dayblip",
  description: "Free life and money calculators including salary checker, true hourly wage, state tax migration, career timeline and more.",
  alternates: { canonical: "https://www.dayblip.com/tools" },
}

const tools = [
  { emoji: "💳", title: "Minimum Payment True Cost", desc: "See the shocking cost of paying minimums", href: "/tools/minimum-payment" },
  { emoji: "⏰", title: "Early vs Late Saver", desc: "Why starting earlier beats saving more", href: "/tools/early-vs-late" },
  { emoji: "📈", title: "Market Timing Cost", desc: "What missing 10 best days costs you", href: "/tools/market-timing" },
  { emoji: "😴", title: "Sleep Debt Calculator", desc: "How much sleep have you really lost?", href: "/tools/sleep-debt" },
  { emoji: "🚬", title: "True Cost of Smoking", desc: "Full financial and health cost revealed", href: "/tools/smoking-cost" },
  { emoji: "🎓", title: "College Degree ROI", desc: "Was your college investment worth it?", href: "/tools/college-roi" },
  { emoji: "🏠", title: "WFH Savings Calculator", desc: "What is remote work really worth?", href: "/tools/wfh-calculator" },
  { emoji: "📉", title: "Recession Readiness Score", desc: "How prepared are you for a downturn?", href: "/tools/recession-score" },
  { emoji: "🤖", title: "Will AI Replace My Job?", desc: "Get your personalized AI risk score", href: "/tools/ai-job-score" },
  { emoji: "🆓", title: "Financial Independence Date", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
  { emoji: "💰", title: "Salary Negotiation Guide", desc: "How much to ask for + ready-to-use script", href: "/tools/salary-negotiation" },
  { emoji: "💼", title: "Side Hustle Potential", desc: "What could you earn with your skills?", href: "/tools/side-hustle" },
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
  { emoji: "📅", title: "Life in Weeks", desc: "See your whole life as a grid of weeks", href: "/tools/life-in-weeks" },
  { emoji: "🔢", title: "Life in Numbers", desc: "Your heartbeats, breaths and more, live", href: "/tools/life-in-numbers" },
  { emoji: "🎂", title: "Birthday Personality", desc: "Everything your birthday says about you", href: "/tools/birthday-personality" },
  { emoji: "🧬", title: "Generation Quiz", desc: "What generation are you really?", href: "/tools/generation-quiz" },
  { emoji: "🤔", title: "Regret Minimization", desc: "Will you regret this decision?", href: "/tools/regret-minimization" },
  { emoji: "📱", title: "Screen Time Cost", desc: "What could you learn with that time?", href: "/tools/time-wasted" },
  { emoji: "🌍", title: "Global Perspective", desc: "Where do you stand worldwide?", href: "/tools/privilege-calculator" },
  { emoji: "💝", title: "Compound Kindness", desc: "The ripple effect of daily kindness", href: "/tools/compound-kindness" },
  { emoji: "🎵", title: "Music of Your Year", desc: "The songs that defined your birth year", href: "/tools/music-of-your-year" },
  { emoji: "📚", title: "Learning Calculator", desc: "What could you achieve with your time?", href: "/tools/learning-calculator" },
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
