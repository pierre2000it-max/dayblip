"use client"
import Link from "next/link"

const tools = [
  { emoji: "🧬", title: "Life Expectancy", desc: "Statistical estimate based on lifestyle", href: "/health/life-expectancy" },
  { emoji: "⚖️", title: "BMI Calculator", desc: "Calculate your body mass index", href: "/health/bmi-calculator" },
  { emoji: "🚬", title: "Habit Cost Calculator", desc: "How much has your habit cost you?", href: "/health/habit-cost" },
  { emoji: "🛡️", title: "Life Insurance Needs", desc: "Calculate your coverage needs", href: "/health/life-insurance" },
]

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">❤️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Health Calculators</h1>
          <p className="text-lg text-[#a8a8b3]">Understand your health numbers and make informed decisions</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[800px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {tools.map(t => (
              <Link key={t.href} href={t.href} className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center transition-all hover:border-[#e94560]">
                <span className="text-4xl">{t.emoji}</span>
                <span className="font-bold text-white">{t.title}</span>
                <span className="text-sm text-[#a8a8b3]">{t.desc}</span>
              </Link>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-5 text-center">
            <p className="text-yellow-300 font-semibold">⚠️ Medical Disclaimer</p>
            <p className="text-[#a8a8b3] text-sm mt-1">Health calculators are for educational purposes only and are not medical advice. Consult a qualified healthcare provider for medical guidance.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
