import type { Metadata } from "next"
import Link from "next/link"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import AuthorByline from "@/components/AuthorByline"
import LastUpdated from "@/components/LastUpdated"

export const metadata: Metadata = {
  title: "Money Misconceptions — Tools That Reveal the Truth | Dayblip",
  description: "Tools that challenge common money myths. See the true cost of minimum payments, why timing the market fails, what your hourly wage really is, and more.",
  alternates: { canonical: "https://www.dayblip.com/tools/misconceptions" },
}

const tools = [
  { emoji: "💳", title: "Minimum Payment True Cost", desc: "A $3,000 balance paying minimums can take 14+ years to clear", href: "/tools/minimum-payment" },
  { emoji: "⏰", title: "Early vs Late Saver", desc: "Starting at 22 beats saving twice as much starting at 32", href: "/tools/early-vs-late" },
  { emoji: "📈", title: "Market Timing Cost", desc: "Missing just the 10 best days cuts returns nearly in half", href: "/tools/market-timing" },
  { emoji: "🏠", title: "WFH Savings Calculator", desc: "Remote work often adds $5,000–$15,000 of hidden annual value", href: "/tools/wfh-calculator" },
  { emoji: "🎓", title: "College Degree ROI", desc: "Many degrees take 10+ years just to break even on tuition", href: "/tools/college-roi" },
  { emoji: "🚬", title: "True Cost of Smoking", desc: "A pack-a-day habit can cost $1M+ over a lifetime with investment", href: "/tools/smoking-cost" },
  { emoji: "⏰", title: "True Hourly Wage", desc: "Your real hourly rate is lower than your salary implies", href: "/tools/true-hourly-wage" },
  { emoji: "😴", title: "Procrastination Cost", desc: "Waiting one year to invest $5,000 costs thousands in returns", href: "/tools/procrastination-cost" },
]

export default function ToolsMisconceptionsPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🔍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Money Misconceptions</h1>
          <p className="text-lg text-[#a8a8b3]">Tools that expose what most people get wrong about money — with real numbers</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[900px]">
          <Breadcrumb crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Tools', href: '/tools' },
            { label: 'Money Misconceptions' }
          ]} />
          <AuthorByline variant="tool" />
          <LastUpdated date="June 2026" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {tools.map(t => (
              <Link key={t.href} href={t.href} className="flex items-start gap-4 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 transition-all hover:border-[#e94560]">
                <span className="text-3xl leading-none mt-0.5">{t.emoji}</span>
                <div>
                  <div className="font-semibold text-white mb-1">{t.title}</div>
                  <div className="text-sm text-[#a8a8b3]">{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tools" className="text-sm text-[#a8a8b3] hover:text-[#e94560] transition-colors">← Back to all tools</Link>
          </div>          <RelatedTools tools={[
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "👥", title: "Generation Compare", desc: "Compare generations", href: "/tools/generation-compare" },
            { emoji: "📊", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
            { emoji: "🏖️", title: "FI Date Calculator", desc: "When can you stop working?", href: "/tools/fi-date" },
          ]} />

        </div>
      </section>
    </div>
  )
}
