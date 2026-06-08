"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const GOALS = [
  { label: "Fat loss",              zone: 1 },
  { label: "General fitness",       zone: 2 },
  { label: "Cardio endurance",      zone: 2 },
  { label: "Athletic performance",  zone: 3 },
]

const ZONE_DEFS = [
  { name: "Warm Up",  desc: "Light activity, recovery",        color: "#4FC3F7", pctLow: 0.5,  pctHigh: 0.6 },
  { name: "Fat Burn", desc: "Optimal fat burning zone",        color: "#4ade80", pctLow: 0.6,  pctHigh: 0.7 },
  { name: "Cardio",   desc: "Improves cardiovascular fitness", color: "#F9A825", pctLow: 0.7,  pctHigh: 0.8 },
  { name: "Hard",     desc: "Increases speed and performance", color: "#fb923c", pctLow: 0.8,  pctHigh: 0.9 },
  { name: "Max",      desc: "Peak effort, short bursts only",  color: "#e94560", pctLow: 0.9,  pctHigh: 1.0 },
]

const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
const sel = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

interface Zone { name: string; desc: string; color: string; low: number; high: number }
interface Result { maxHR: number; hrr: number; resting: number; zones: Zone[]; recommendedZone: number }

export default function HeartRatePage() {
  const [age,     setAge]     = useState("35")
  const [resting, setResting] = useState("70")
  const [goalIdx, setGoalIdx] = useState(0)
  const [result,  setResult]  = useState<Result | null>(null)

  function calculate() {
    const ageN    = parseFloat(age) || 35
    const restN   = parseFloat(resting) || 70
    const maxHR   = Math.round(220 - ageN)
    const hrr     = maxHR - restN
    const zones: Zone[] = ZONE_DEFS.map(z => ({
      name:  z.name,
      desc:  z.desc,
      color: z.color,
      low:   Math.round(restN + hrr * z.pctLow),
      high:  Math.round(restN + hrr * z.pctHigh),
    }))
    setResult({ maxHR, hrr, resting: restN, zones, recommendedZone: GOALS[goalIdx].zone })
  }

  const shareText = result
    ? `My target fat burning heart rate zone is ${result.zones[1].low}-${result.zones[1].high} bpm. Calculate your zones free: www.dayblip.com/health/heart-rate`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Heart Rate Calculator — Target Heart Rate Zones by Age</h1>
          <p className="text-[#a8a8b3]">Find your training zones using the Karvonen formula</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-[#a8a8b3]">
            <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/health" className="hover:text-[#e94560] transition-colors">Health</Link>
            <span>/</span>
            <span className="text-white">Heart Rate Calculator</span>
          </nav>

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              The simple formula for maximum heart rate is 220 minus your age. A 35-year-old has a maximum heart rate of approximately 185 beats per minute. The fat burning zone is 50-70% of max heart rate (93-130 bpm for a 35-year-old). The cardio zone is 70-85% (130-157 bpm). Resting heart rate below 60 bpm indicates strong cardiovascular fitness.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
            Heart rate zones divide exercise intensity into ranges based on percentage of maximum heart rate. Each zone produces different physiological benefits — lower zones burn a higher percentage of fat while higher zones build cardiovascular endurance and aerobic capacity. Training in the right zone for your goal makes exercise significantly more effective.
          </p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[600px] space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Age (years)</span>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Resting heart rate (bpm)</span>
              <input type="number" value={resting} onChange={e => setResting(e.target.value)} placeholder="Check pulse for 60 seconds at rest" className={inp} />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Fitness goal</span>
            <select value={goalIdx} onChange={e => setGoalIdx(Number(e.target.value))} className={sel}>
              {GOALS.map((g, i) => <option key={i} value={i}>{g.label}</option>)}
            </select>
          </label>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Heart Rate Zones
          </button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                {[
                  ["Max heart rate",     `${result.maxHR} bpm`, "#e94560"],
                  ["Heart rate reserve", `${result.hrr} bpm`,   "#F9A825"],
                  ["Resting HR",         `${result.resting} bpm`, "#4FC3F7"],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                    <div className="font-black text-lg" style={{ color: String(color) }}>{value}</div>
                    <div className="mt-0.5 text-xs text-[#a8a8b3]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {result.zones.map((z, i) => {
                  const isRecommended = i === result.recommendedZone
                  return (
                    <div key={z.name}
                      className={`rounded-xl border p-4 ${isRecommended ? "border-[#e94560]/60 bg-[#e94560]/10" : "border-[#0f3460] bg-[#1a1a2e]"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm" style={{ color: z.color }}>Zone {i + 1} — {z.name}</span>
                          {isRecommended && <span className="ml-2 text-xs bg-[#e94560] text-white rounded px-1.5 py-0.5">Recommended for your goal</span>}
                          <div className="text-xs text-[#a8a8b3] mt-0.5">{z.desc}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-white">{z.low}–{z.high}</span>
                          <div className="text-xs text-[#a8a8b3]">bpm</div>
                        </div>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#0f3460] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(i + 1) * 20}%`, background: z.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/health/heart-rate" title="Heart Rate Calculator" />
              <p className="text-xs text-[#a8a8b3]">⚠️ For educational purposes only. Not medical advice. Consult a healthcare provider before starting a new exercise programme.</p>
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🍎", title: "Calorie Calculator",    desc: "Daily calorie needs for your goals",  href: "/health/calorie-calculator" },
            { emoji: "💧", title: "Water Intake Calculator", desc: "How much water you need per day",   href: "/health/water-intake" },
            { emoji: "⚖️", title: "BMI Calculator",        desc: "Calculate your body mass index",      href: "/health/bmi-calculator" },
            { emoji: "🧬", title: "Life Expectancy",        desc: "Statistical estimate by lifestyle",  href: "/health/life-expectancy" },
          ]} />
        </div>
      </section>
    </div>
  )
}
