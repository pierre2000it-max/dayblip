"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const QUESTIONS = [
  "Clean drinking water access?",
  "Reliable electricity?",
  "Can read and write?",
  "Have a smartphone?",
  "Completed high school?",
  "Have health insurance?",
  "Own or have access to a car?",
  "Have internet at home?",
  "Eaten today?",
  "Feel safe where you live?",
]

const WORLD_STATS = [
  { label: "Clean water", value: 91 },
  { label: "Electricity", value: 90 },
  { label: "Internet", value: 67 },
  { label: "High school education", value: 65 },
  { label: "Enough food daily", value: 88 },
  { label: "Basic healthcare", value: 56 },
]

function getPercentile(income: number): string {
  if (income >= 109000) return "top 1%"
  if (income >= 65000) return "top 5%"
  if (income >= 45000) return "top 10%"
  if (income >= 25000) return "top 20%"
  if (income >= 15000) return "top 50%"
  return "bottom 50%"
}

function percentBar(income: number): number {
  if (income >= 109000) return 99
  if (income >= 65000) return 95
  if (income >= 45000) return 90
  if (income >= 25000) return 80
  if (income >= 15000) return 60
  return 30
}

export default function PrivilegeCalculatorPage() {
  const [income, setIncome] = useState("50000")
  const [answers, setAnswers] = useState<boolean[]>(Array(10).fill(false))
  const [result, setResult] = useState<{ income: number; percentile: string; bar: number; privileges: number } | null>(null)

  function runCalc(push = true, inc = income, ans = answers) {
    const incomeNum = +inc || 0
    const privileges = ans.filter(Boolean).length
    setResult({ income: incomeNum, percentile: getPercentile(incomeNum), bar: percentBar(incomeNum), privileges })
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?income=${incomeNum}&privileges=${privileges}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const inc = p.get("income")
    if (inc) {
      setIncome(inc)
      const incomeNum = +inc || 0
      const priv = p.get("privileges") ? Number(p.get("privileges")) : 0
      const ans = Array(10).fill(false).map((_, i) => i < priv)
      setAnswers(ans)
      setResult({ income: incomeNum, percentile: getPercentile(incomeNum), bar: percentBar(incomeNum), privileges: priv })
    }
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/privilege-calculator?income=${result.income}` : ""
  const shareText = result
    ? `Eye-opening perspective on where I stand globally.\nBy income I am in the ${result.percentile} worldwide.\nCheck yours:`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Global Perspective Calculator — Where Do You Stand Worldwide?</h1>
          <p className="text-[#a8a8b3]">See where you stand among the 8.2 billion people on Earth</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">If you earn $34,000 per year you are in the top 1% of global income earners. The global median income is approximately $2,920 per year. Over 700 million people live on under $2.15 per day. An American earning minimum wage of $7.25 per hour earns more per hour than the daily income of 85% of the world&apos;s population.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The global perspective calculator places your income, living standards and circumstances in the context of all 8 billion people on Earth. It shows your global income percentile, how your access to clean water, education, healthcare and internet compares globally, and puts everyday American experiences into worldwide context using World Bank and UN data.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">Annual income (USD)</span>
            <div className="flex items-center gap-2">
              <span className="text-[#a8a8b3]">$</span>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
          </label>

          <div className="space-y-2">
            {QUESTIONS.map((q, i) => (
              <label key={i} className="flex cursor-pointer items-center justify-between rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3">
                <span className="text-sm text-white">{q}</span>
                <input type="checkbox" checked={answers[i]} onChange={e => { const n = [...answers]; n[i] = e.target.checked; setAnswers(n) }} className="h-5 w-5 accent-[#e94560]" />
              </label>
            ))}
          </div>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Show My Global Perspective
          </button>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">By income you are in the</div>
                <div className="my-1 text-3xl font-black text-[#F9A825]">{result.percentile}</div>
                <div className="text-sm text-[#a8a8b3]">globally</div>
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#0f3460]">
                  <div className="h-full rounded-full bg-[#e94560]" style={{ width: `${result.bar}%` }} />
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 font-bold text-white">If the world were 100 people…</h3>
                <div className="space-y-3">
                  {WORLD_STATS.map(s => (
                    <div key={s.label}>
                      <div className="mb-1 flex justify-between text-sm text-white"><span>{s.label}</span><span>{s.value} of 100</span></div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#0f3460]">
                        <div className="h-full rounded-full bg-[#4FC3F7]" style={{ width: `${s.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center text-white">
                <div className="text-3xl font-black text-[#e94560]">{result.privileges}/10</div>
                <div className="mt-1 text-sm text-[#a8a8b3]">basic privileges measured that you have access to</div>
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-6 text-sm text-white">
                You have access to resources that billions of people do not have. This is not about guilt — it is about perspective and gratitude. With internet access you have more information at your fingertips than any human before the year 2000.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Your Global Perspective" />
            </div>
          )}          <RelatedTools tools={[
            { emoji: "👥", title: "Generation Compare", desc: "Compare generations", href: "/tools/generation-compare" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
            { emoji: "💵", title: "Salary Checker", desc: "Is your salary fair?", href: "/tools/salary-checker" },
            { emoji: "📅", title: "Life in Weeks", desc: "Visualize your life", href: "/tools/life-in-weeks" },
          ]} />

        </div>
      </section>
    </div>
  )
}
