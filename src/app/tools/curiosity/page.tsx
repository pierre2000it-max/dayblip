import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Curiosity Tools — Life Calculators That Make You Think | Dayblip",
  description: "Visualize your life in weeks, calculate your sleep debt, discover what your birthday says about you, see your life in real-time numbers and more.",
  alternates: { canonical: "https://www.dayblip.com/tools/curiosity" },
}

const tools = [
  { emoji: "📅", title: "Life in Weeks", desc: "See your whole life as a grid of weeks", href: "/tools/life-in-weeks" },
  { emoji: "🔢", title: "Life in Numbers", desc: "Your heartbeats, breaths and more, live", href: "/tools/life-in-numbers" },
  { emoji: "😴", title: "Sleep Debt Calculator", desc: "How much sleep have you really lost?", href: "/tools/sleep-debt" },
  { emoji: "🎂", title: "Birthday Personality", desc: "Everything your birthday says about you", href: "/tools/birthday-personality" },
  { emoji: "🧬", title: "Generation Quiz", desc: "What generation are you really?", href: "/tools/generation-quiz" },
  { emoji: "🤔", title: "Regret Minimization", desc: "Will you regret this decision?", href: "/tools/regret-minimization" },
  { emoji: "📱", title: "Screen Time Cost", desc: "What could you learn with that time?", href: "/tools/time-wasted" },
  { emoji: "🌍", title: "Global Perspective", desc: "Where do you stand worldwide?", href: "/tools/privilege-calculator" },
  { emoji: "💝", title: "Compound Kindness", desc: "The ripple effect of daily kindness", href: "/tools/compound-kindness" },
  { emoji: "🎵", title: "Music of Your Year", desc: "The songs that defined your birth year", href: "/tools/music-of-your-year" },
  { emoji: "📚", title: "Learning Calculator", desc: "What could you achieve with your time?", href: "/tools/learning-calculator" },
  { emoji: "😴", title: "Procrastination Cost", desc: "What is waiting really costing you?", href: "/tools/procrastination-cost" },
]

export default function ToolsCuriosityPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌟</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Curiosity Tools</h1>
          <p className="text-lg text-[#a8a8b3]">Life calculators designed to make you think — about time, purpose and what matters</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[1100px]">
          <nav className="mb-8 flex items-center gap-1 text-sm text-[#a8a8b3]">
            <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
            <span className="text-[#0f3460]">/</span>
            <Link href="/tools" className="hover:text-[#e94560] transition-colors">Tools</Link>
            <span className="text-[#0f3460]">/</span>
            <span className="text-white font-medium">Curiosity</span>
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
