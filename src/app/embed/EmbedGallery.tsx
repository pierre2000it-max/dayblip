"use client"
import { useState } from "react"
import Link from "next/link"

const tools = [
  {
    emoji: "💹", name: "Compound Interest Calculator", desc: "Show how money grows with compound interest over time", height: 480,
    slug: "compound-interest",
  },
  {
    emoji: "🏠", name: "Mortgage Calculator", desc: "Monthly payment, total interest, and loan breakdown", height: 460,
    slug: "mortgage",
  },
  {
    emoji: "💵", name: "Take Home Pay Calculator", desc: "Paycheck after federal tax, state tax, and FICA", height: 460,
    slug: "take-home-pay",
  },
  {
    emoji: "🎂", name: "Age Calculator", desc: "Exact age in years, months, days — plus total heartbeats", height: 400,
    slug: "age-calculator",
  },
  {
    emoji: "🎄", name: "Days Until Christmas", desc: "Live countdown to Christmas — updates every second", height: 360,
    slug: "christmas-countdown",
  },
  {
    emoji: "🗓️", name: "Born In Year Facts", desc: "#1 song, movie, gas price and events for any birth year", height: 440,
    slug: "born-in",
  },
  {
    emoji: "⏰", name: "True Hourly Wage Calculator", desc: "What your job actually pays per hour after commute and work costs", height: 440,
    slug: "true-hourly-wage",
  },
  {
    emoji: "💳", name: "Debt Payoff Calculator", desc: "How long to pay off debt and total interest paid", height: 420,
    slug: "debt-payoff",
  },
  {
    emoji: "🆓", name: "Financial Independence Calculator", desc: "How many years until you reach financial independence", height: 440,
    slug: "fi-calculator",
  },
  {
    emoji: "💼", name: "Salary Market Check", desc: "Market salary range for any job title and state", height: 440,
    slug: "salary-check",
  },
  {
    emoji: "🎓", name: "GPA Calculator", desc: "Free GPA calculator for students — weighted and unweighted. No signup.", height: 520,
    slug: "gpa-calculator",
  },
  {
    emoji: "🏛️", name: "No Tax on Overtime 2026", desc: "Calculate 2026 overtime tax savings under the One Big Beautiful Bill Act.", height: 480,
    slug: "overtime-tax",
  },
  {
    emoji: "🍽️", name: "Tip Calculator", desc: "Split any restaurant bill and calculate tips instantly.", height: 400,
    slug: "tip-calculator",
  },
  {
    emoji: "💵", name: "Paycheck Calculator", desc: "Calculate exact net pay after all taxes and deductions for any US state.", height: 520,
    slug: "paycheck-calculator",
  },
  {
    emoji: "🍼", name: "Pregnancy Due Date Calculator", desc: "Calculate pregnancy due date with trimester timeline and weekly milestones.", height: 460,
    slug: "due-date-calculator",
  },
  {
    emoji: "💱", name: "Currency Converter", desc: "Live exchange rates for 16 currencies. Updates daily. Perfect for travel and finance blogs.", height: 420,
    slug: "currency-converter",
  },
  {
    emoji: "📊", name: "Percentage Calculator", desc: "Three percentage calculators in one — find percentage of number, change and difference.", height: 440,
    slug: "percentage-calculator",
  },
  {
    emoji: "😴", name: "Sleep Calculator", desc: "Calculate the best bedtime or wake time based on 90-minute sleep cycles.", height: 460,
    slug: "sleep-calculator",
  },
  {
    emoji: "🔥", name: "Calorie Calculator", desc: "Daily calorie needs using Mifflin-St Jeor formula. Great for health and fitness blogs.", height: 500,
    slug: "calorie-calculator",
  },
  {
    emoji: "💪", name: "Body Fat Calculator", desc: "US Navy method body fat percentage. No calipers needed — just a measuring tape.", height: 480,
    slug: "body-fat",
  },
]

function EmbedCard({ tool }: { tool: typeof tools[0] }) {
  const [copied, setCopied] = useState(false)
  const code = `<iframe src="https://www.dayblip.com/embed/${tool.slug}" width="100%" height="${tool.height}" frameborder="0" style="border-radius:12px;border:1px solid #1e2d4a;" title="${tool.name} — Dayblip" loading="lazy"></iframe>`

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-2xl mb-1">{tool.emoji}</div>
          <h3 className="font-bold text-white text-base">{tool.name}</h3>
          <p className="text-sm text-[#a8a8b3] mt-1">{tool.desc}</p>
          <p className="text-xs text-[#a8a8b3] mt-1">Recommended height: {tool.height}px</p>
        </div>
        <button
          onClick={copy}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          style={{ background: copied ? "#22c55e" : "#e94560", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {copied ? "Copied! ✓" : "Copy Code"}
        </button>
      </div>
      <pre
        className="rounded-lg text-xs overflow-x-auto"
        style={{ background: "#0d1b2a", border: "1px solid #1e2d4a", padding: "12px", color: "#a8a8b3", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}
      >
        {code}
      </pre>
    </div>
  )
}

export default function EmbedGallery() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Hero */}
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🔗</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Free Embeddable Tools for Your Website or Blog</h1>
          <p className="text-lg text-[#a8a8b3]">Add any Dayblip calculator to your website with one line of HTML. Free forever. No API key required. No account needed.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-12 bg-[#16213e]">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-6 text-xl font-bold text-white text-center">How It Works</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { step: "1", text: "Choose a tool below" },
              { step: "2", text: "Copy the embed code" },
              { step: "3", text: "Paste into your website HTML" },
            ].map(s => (
              <div key={s.step} className="text-center rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <div className="text-3xl font-black text-[#e94560] mb-2">{s.step}</div>
                <div className="text-white text-sm">{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool cards */}
      <section className="px-6 py-12 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[900px]">
          <div className="space-y-6">
            {tools.map(tool => <EmbedCard key={tool.slug} tool={tool} />)}
          </div>
        </div>
      </section>

      {/* Terms of use */}
      <section className="px-6 py-12 bg-[#16213e]">
        <div className="mx-auto max-w-[700px] text-center">
          <h2 className="mb-4 text-xl font-bold text-white">Terms of Use</h2>
          <p className="text-[#a8a8b3] text-sm leading-relaxed">
            Free to embed on any website. Please keep the Dayblip attribution link in the embed footer. Tools update automatically. No maintenance required.
          </p>
          <div className="mt-6">
            <Link href="/embed/for-educators" className="text-[#e94560] text-sm font-semibold hover:underline">
              Using tools in a classroom? See our educator guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
