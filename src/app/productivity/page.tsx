"use client"
import Link from "next/link"

const tools = [
  { emoji: "⏰", title: "Work Hours Calculator", desc: "How many hours have you worked in your career?", href: "/productivity/work-hours" },
  { emoji: "💸", title: "Meeting Cost Calculator", desc: "What do your meetings really cost?", href: "/productivity/meeting-cost" },
  { emoji: "💰", title: "Salary Calculator", desc: "Convert between hourly, monthly and annual pay", href: "/productivity/salary-calculator" },
]

export default function ProductivityPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⚡</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Productivity Calculators</h1>
          <p className="text-lg text-[#a8a8b3]">Understand the real value of your time and work</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[800px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
