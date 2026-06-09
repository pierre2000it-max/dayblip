"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

function getRecommended(age: number): number {
  if (age <= 17) return 9
  if (age <= 25) return 8
  return 7
}

interface Result {
  age: number; sleep: number; years: number; recommended: number
  nightlyDeficit: number; weeklyDeficit: number; annualDeficit: number; totalDeficit: number
  daysLost: number; weeksLost: number
  recoveryDays: number
}

function compute(age: number, sleep: number, years: number): Result {
  const recommended = getRecommended(age)
  const nightlyDeficit = Math.max(0, recommended - sleep)
  const weeklyDeficit  = +(nightlyDeficit * 7).toFixed(1)
  const annualDeficit  = +(nightlyDeficit * 365).toFixed(0)
  const totalDeficit   = +(nightlyDeficit * 365 * years).toFixed(0)
  const daysLost       = +(totalDeficit / 24).toFixed(1)
  const weeksLost      = +(daysLost / 7).toFixed(1)
  const recoveryDays   = nightlyDeficit > 0 ? Math.ceil(totalDeficit / 1) : 0
  return { age, sleep, years, recommended, nightlyDeficit, weeklyDeficit, annualDeficit: +annualDeficit, totalDeficit: +totalDeficit, daysLost, weeksLost, recoveryDays }
}

export default function SleepDebtPage() {
  const [age,   setAge]   = useState("35")
  const [sleep, setSleep] = useState(6.5)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true, a = age, s = sleep, y = years) {
    const res = compute(parseFloat(a)||35, s, y)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?age=${a}&sleep=${s}&years=${y}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const a = p.get("age"), s = p.get("sleep"), y = p.get("years")
    if (a) {
      if (a) setAge(a)
      const sNum = s ? parseFloat(s) : 6.5
      const yNum = y ? parseInt(y) : 5
      setSleep(sNum); setYears(yNum)
      runCalc(false, a, sNum, yNum)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl  = result ? `https://www.dayblip.com/tools/sleep-debt?age=${age}&sleep=${sleep}&years=${years}` : ""
  const shareText = result
    ? `I have accumulated ${result.totalDeficit} hours of sleep debt over ${result.years} years!\nThat is ${result.weeksLost} weeks of lost sleep 😴\nCalculate yours:\n(Educational only — not medical advice)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Sleep Debt Calculator", "Calculate your accumulated sleep debt and find out how many hours of sleep you have missed. See the impact of chronic sleep deprivation.", "https://www.dayblip.com/tools/sleep-debt", "HealthApplication"),
        faqSchema([
          { question: "What is sleep debt?", answer: "Sleep debt is the accumulated deficit between the sleep you need and the sleep you get. Sleeping 6.5 hours when you need 7 creates 3.5 hours of sleep debt per week." },
          { question: "How much sleep do adults need?", answer: "Adults aged 26-64 need 7-9 hours of sleep per night according to the National Sleep Foundation. Consistently sleeping less creates cumulative sleep debt." },
          { question: "Can you recover sleep debt?", answer: "Short-term sleep debt can be partially recovered. Chronic long-term sleep deprivation is harder to fully recover from. Consistent adequate sleep is more effective than catch-up sleep." },
        ]),
        howToSchema("How to Calculate Your Sleep Debt", "Find your accumulated sleep deficit", [
          "Enter your current age",
          "Set your average nightly sleep hours using the slider",
          "Set how many years you have slept at this level",
          "Click Calculate My Sleep Debt for full breakdown",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Sleep Debt Calculator", url: "https://www.dayblip.com/tools/sleep-debt" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">How Much Sleep Debt Have You Accumulated?</h1>
          <p className="text-[#a8a8b3]">Calculate your lifetime sleep deficit and what it is costing you</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Sleep Debt Calculator" }
          ]} />
          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              The average American adult sleeps 6.8 hours per night — 1.2 hours less than the recommended 8 hours. That creates 8.4 hours of weekly sleep debt. Chronically sleeping under 7 hours is linked to increased risk of obesity heart disease and impaired cognitive function. The US loses an estimated $411 billion annually in productivity due to sleep deprivation.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>
            Sleep debt is the cumulative deficit between the sleep you need and the sleep you actually get. Unlike financial debt sleep debt cannot be fully repaid in a single weekend. The CDC recommends 7-9 hours for adults aged 18-64 and 7-8 hours for adults 65 and older. This calculator shows your personal sleep debt and its estimated impact on cognitive performance.
          </p>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
            ⚠️ <strong>Educational purposes only.</strong> Not medical advice. Consult a healthcare professional for sleep-related health concerns.
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Your age</span>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Hours of sleep per night: <span className="text-[#e94560]">{sleep}</span></span>
            <input type="range" min={4} max={10} step={0.5} value={sleep} onChange={e => setSleep(parseFloat(e.target.value))} className="accent-[#e94560]" />
            <div className="flex justify-between text-xs text-[#a8a8b3]"><span>4 hrs</span><span>7 hrs (recommended)</span><span>10 hrs</span></div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Years at this sleep level: <span className="text-[#e94560]">{years}</span></span>
            <input type="range" min={1} max={20} value={years} onChange={e => setYears(parseInt(e.target.value))} className="accent-[#e94560]" />
          </label>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Sleep Debt
          </button>

          {result && (
            <div className="space-y-6">
              {/* Headline */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">
                  {result.nightlyDeficit > 0
                    ? `You are sleeping ${result.nightlyDeficit} hours less than the recommended ${result.recommended} hrs/night for age ${result.age}`
                    : `You are meeting the recommended ${result.recommended} hrs/night for age ${result.age} — great!`}
                </div>
                {result.nightlyDeficit > 0 && (
                  <>
                    <div className="my-2 text-5xl font-black text-[#e94560]">{result.totalDeficit.toLocaleString()}</div>
                    <div className="text-sm text-[#a8a8b3]">total hours of sleep debt over {result.years} years</div>
                  </>
                )}
              </div>

              {result.nightlyDeficit > 0 && (
                <>
                  {/* Breakdown */}
                  <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-4">
                    {[["Nightly deficit", `${result.nightlyDeficit} hrs`, "#e94560"],
                      ["Weekly deficit", `${result.weeklyDeficit} hrs`, "#e94560"],
                      ["Annual deficit", `${result.annualDeficit.toLocaleString()} hrs`, "#F9A825"],
                      [`${result.years}-year total`, `${result.totalDeficit.toLocaleString()} hrs`, "#FF6B6B"]
                    ].map(([l, v, c]) => (
                      <div key={String(l)} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                        <div className="font-black" style={{ color: c }}>{v}</div>
                        <div className="mt-0.5 text-xs text-[#a8a8b3]">{l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Equivalents */}
                  <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-5 text-white text-sm">
                    <div className="font-bold text-[#e94560] mb-2">That is equivalent to…</div>
                    <p>📅 <span className="font-bold">{result.daysLost}</span> full days of lost sleep</p>
                    <p className="mt-1">📆 <span className="font-bold">{result.weeksLost} weeks</span> of your life missed</p>
                    <p className="mt-1">⏳ To recover at 1 extra hour/night: <span className="font-bold">{result.recoveryDays} days</span></p>
                    <p className="mt-2 text-xs text-[#a8a8b3]">Note: Research suggests chronic sleep debt cannot be fully recovered long-term.</p>
                  </div>
                </>
              )}

              {/* Health context */}
              <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-[#4FC3F7] mb-2">🔬 General health research context</div>
                <p className="text-[#a8a8b3]">Research suggests chronic sleep deprivation is associated with reduced cognitive performance, weakened immune function, increased stress hormones, and reduced reaction time.</p>
                <p className="mt-2 font-semibold">Consult a healthcare provider for personalized sleep advice.</p>
              </div>

              {/* Tips */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-white">
                <div className="font-bold text-white mb-2">💤 Improving sleep quality</div>
                {["Consistent sleep and wake times every day","Keep bedroom dark, quiet and cool","No screens 1 hour before bed","Limit caffeine after 2 PM","Regular exercise (not too close to bedtime)"].map(t => (
                  <p key={t} className="mt-1 text-[#a8a8b3]">✓ {t}</p>
                ))}
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Sleep Debt Calculator" />
            </div>
          )}
          {/* US Perspective Section */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <h2 className="text-white text-xl font-bold">Sleep Debt in America</h2>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              The United States is one of the most sleep-deprived nations in the developed world. The CDC reports that 1 in 3 American adults do not get sufficient sleep on a regular basis — defined as less than 7 hours per night.
            </p>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              Sleep deprivation costs the US economy an estimated $411 billion per year in lost productivity according to research from the RAND Corporation — more than any other developed nation.
            </p>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              States with the highest rates of sleep deprivation include Hawaii at 46.5% of adults sleeping under 7 hours and Kentucky at 46.3%. Colorado has the best sleep rates at 28.8% of adults reporting insufficient sleep.
            </p>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              Short sleepers — those consistently getting under 6 hours — are 4 times more likely to catch a cold when exposed to a virus compared to those sleeping 7 or more hours according to research published in the journal Sleep.
            </p>
          </div>

          <RelatedTools tools={[
            { emoji: "😴", title: "Sleep Calculator", desc: "Best bedtime based on 90-minute cycles", href: "/health/sleep-calculator" },
            { emoji: "📅", title: "Life in Weeks", desc: "See your whole life as a grid of weeks", href: "/tools/life-in-weeks" },
            { emoji: "❤️", title: "Life Expectancy Calculator", desc: "How lifestyle affects longevity", href: "/health/life-expectancy" },
            { emoji: "🔢", title: "Life in Numbers", desc: "Your heartbeats, breaths and more, live", href: "/tools/life-in-numbers" },
          ]} />
        </div>
      </section>
    </div>
  )
}
