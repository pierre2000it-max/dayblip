"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

const CYCLE_INFO = [
  { cycles: 3, hours: 4.5, label: "4.5 hours", badge: "Not recommended", badgeColor: "#FF6B6B", icon: "😴", note: "Sleep debt risk" },
  { cycles: 4, hours: 6,   label: "6 hours",   badge: "Minimum",         badgeColor: "#F9A825", icon: "😴", note: "Only if necessary" },
  { cycles: 5, hours: 7.5, label: "7.5 hours", badge: "Recommended ✅",   badgeColor: "#4ade80", icon: "✅", note: "Optimal for most adults" },
  { cycles: 6, hours: 9,   label: "9 hours",   badge: "Ideal ⭐",          badgeColor: "#4FC3F7", icon: "⭐", note: "Perfect night of sleep" },
]

function fmtTime(totalMinutes: number): string {
  const norm = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(norm / 60)
  const m = norm % 60
  const ampm = h < 12 ? "AM" : "PM"
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number)
  return h * 60 + (m || 0)
}

export default function SleepCalculatorPage() {
  const [mode, setMode] = useState<"wakeup" | "bedtime">("wakeup")
  const [wakeTime, setWakeTime] = useState("06:00")
  const [bedTime, setBedTime] = useState("23:00")
  const [fallAsleep, setFallAsleep] = useState(14)
  const [calculated, setCalculated] = useState(false)

  function calculate() { setCalculated(true) }

  function getWakeupResults() {
    const wakeMin = timeToMinutes(wakeTime)
    return CYCLE_INFO.map(c => {
      const bedMin = wakeMin - c.cycles * 90 - fallAsleep
      return { ...c, time: fmtTime(bedMin) }
    })
  }

  function getBedtimeResults() {
    const bedMin = timeToMinutes(bedTime)
    return CYCLE_INFO.map(c => {
      const wakeMin = bedMin + fallAsleep + c.cycles * 90
      return { ...c, time: fmtTime(wakeMin) }
    })
  }

  const results = mode === "wakeup" ? getWakeupResults() : getBedtimeResults()
  const recommended = results.find(r => r.cycles === 5)

  const shareText = recommended
    ? `To wake up refreshed at ${wakeTime} go to sleep at ${recommended.time} (5 complete sleep cycles). Calculate your sleep times free: www.dayblip.com/health/sleep-calculator`
    : "Calculate your best sleep and wake times free: www.dayblip.com/health/sleep-calculator"

  const TIPS = [
    "Keep the same sleep schedule on weekdays and weekends",
    "Avoid screens 1 hour before bed",
    "Keep bedroom cool (65–68°F / 18–20°C)",
    "Avoid caffeine after 2 PM",
    "Expose yourself to bright light in the morning to set your circadian rhythm",
  ]

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Sleep Calculator", "Calculate best bedtime and wake up times based on 90-minute sleep cycles", "https://www.dayblip.com/health/sleep-calculator", "HealthApplication"),
        faqSchema([
          { question: "What time should I go to sleep to wake up at 6 AM?", answer: "To wake at 6 AM feeling refreshed go to sleep at 10:30 PM (4.5 hours — 3 cycles) 12:00 AM (6 hours — 4 cycles) 1:30 AM (7.5 hours — 5 cycles recommended) or 3:00 AM (9 hours — 6 cycles ideal). Add 14 minutes to fall asleep. Most adults need 5 complete cycles — 7.5 hours — for optimal rest." },
          { question: "How long is a sleep cycle?", answer: "A complete sleep cycle lasts approximately 90 minutes and includes four stages: stage 1 light sleep (5-10 minutes) stage 2 light sleep (20 minutes) stage 3 deep sleep (20-40 minutes) and REM sleep (10-60 minutes). The proportion of REM sleep increases in later cycles making the final cycles before waking especially important for memory and mood." },
          { question: "Why do I wake up tired even after 8 hours of sleep?", answer: "Waking mid-cycle during deep sleep or REM causes sleep inertia — the grogginess and confusion felt when jarred awake. Timing your alarm to the end of a 90-minute cycle means waking during the lightest sleep stage. 7.5 hours (5 complete cycles) often feels more refreshing than 8 hours that ends mid-cycle." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Health", url: "https://www.dayblip.com/health" },
          { name: "Sleep Calculator", url: "https://www.dayblip.com/health/sleep-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">😴</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Sleep Calculator — The Best Time to Wake Up or Go to Sleep</h1>
          <p className="text-[#a8a8b3]">Based on 90-minute sleep cycles — wake up refreshed every morning</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Health", href: "/health" }, { label: "Sleep Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>Sleep occurs in 90-minute cycles. Waking between cycles feels more refreshing than waking mid-cycle. To wake at 6:00 AM feeling refreshed go to sleep at 10:30 PM (3 cycles) 12:00 AM (4 cycles) 1:30 AM (5 cycles) or 3:00 AM (6 cycles). Most adults need 5 to 6 complete cycles — 7.5 to 9 hours — per night.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Sleep cycles last approximately 90 minutes each and consist of four stages: light sleep deep sleep and REM (rapid eye movement) sleep. Waking during deep sleep or REM causes grogginess and fatigue. Timing your alarm to coincide with the end of a cycle — when you are in lightest sleep — makes waking up significantly easier and leaves you feeling more refreshed.</p>

          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[#0f3460]">
            <button onClick={() => { setMode("wakeup"); setCalculated(false) }}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: mode === "wakeup" ? "#e94560" : "#1a1a2e", color: mode === "wakeup" ? "#fff" : "#a8a8b3" }}>
              What time should I sleep?
            </button>
            <button onClick={() => { setMode("bedtime"); setCalculated(false) }}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: mode === "bedtime" ? "#e94560" : "#1a1a2e", color: mode === "bedtime" ? "#fff" : "#a8a8b3" }}>
              What time should I wake up?
            </button>
          </div>

          <div className="space-y-4">
            {mode === "wakeup" ? (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">I want to wake up at</span>
                <input type="time" value={wakeTime} onChange={e => { setWakeTime(e.target.value); setCalculated(false) }}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white text-lg focus:border-[#e94560] focus:outline-none" />
              </label>
            ) : (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">I plan to go to sleep at</span>
                <input type="time" value={bedTime} onChange={e => { setBedTime(e.target.value); setCalculated(false) }}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white text-lg focus:border-[#e94560] focus:outline-none" />
              </label>
            )}

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Average time to fall asleep — {fallAsleep} minutes</span>
              <input type="range" min={5} max={45} value={fallAsleep} onChange={e => { setFallAsleep(parseInt(e.target.value)); setCalculated(false) }}
                className="w-full accent-[#e94560]" />
              <div className="flex justify-between text-xs text-[#a8a8b3] mt-1"><span>5 min</span><span>45 min</span></div>
            </label>
          </div>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            {mode === "wakeup" ? "Calculate Bedtimes" : "Calculate Wake Up Times"}
          </button>

          {calculated && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white">
                {mode === "wakeup"
                  ? `Bedtimes to wake refreshed at ${fmtTime(timeToMinutes(wakeTime))}`
                  : `Wake up times after sleeping at ${fmtTime(timeToMinutes(bedTime))}`}
              </div>
              {results.map(r => (
                <div key={r.cycles} className="rounded-xl border p-4 flex items-center justify-between"
                  style={{ borderColor: r.badgeColor + "40", background: r.badgeColor + "10" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <div className="font-bold" style={{ color: r.badgeColor }}>{r.cycles} cycles — {r.label}</div>
                      <div className="text-xs text-[#a8a8b3]">{r.note}</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-white">{r.time}</div>
                </div>
              ))}

              <ShareButtons text={shareText} url="https://www.dayblip.com/health/sleep-calculator" title="Sleep Calculator" />
            </div>
          )}

          {/* Sleep tips */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="font-bold text-white mb-3">Tips for Better Sleep</h2>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#a8a8b3]">
                  <span className="text-[#4FC3F7] mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <RelatedTools tools={[
            { emoji: "😴", title: "Sleep Debt Calculator", desc: "How much sleep have you lost?", href: "/tools/sleep-debt" },
            { emoji: "❤️", title: "Life Expectancy Calculator", desc: "How lifestyle affects longevity", href: "/health/life-expectancy" },
            { emoji: "🔥", title: "Calorie Calculator", desc: "Sleep affects metabolism and weight", href: "/health/calorie-calculator" },
            { emoji: "💊", title: "Habit Cost Calculator", desc: "Financial cost of unhealthy habits", href: "/health/habit-cost" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
