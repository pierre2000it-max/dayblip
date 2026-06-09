"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const ACTIVITY_OPTS = [
  { label: "Sedentary",         add: 0 },
  { label: "Lightly active",    add: 12 },
  { label: "Moderately active", add: 24 },
  { label: "Very active",       add: 36 },
]

const CLIMATE_OPTS = [
  { label: "Cool or temperate", add: 0 },
  { label: "Hot or humid",      add: 16 },
  { label: "Very hot or extreme", add: 32 },
]

const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
const sel = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

interface Result {
  base: number
  activityAdd: number
  climateAdd: number
  pregnancyAdd: number
  total: number
  cups: number
  liters: number
  fromBeverages: number
}

export default function WaterIntakePage() {
  const [weight,    setWeight]    = useState("160")
  const [activity,  setActivity]  = useState(0)
  const [climate,   setClimate]   = useState(0)
  const [pregnant,  setPregnant]  = useState("no")
  const [result,    setResult]    = useState<Result | null>(null)

  function calculate() {
    const w = parseFloat(weight) || 160
    const base = Math.round(w * 0.67)
    const activityAdd  = ACTIVITY_OPTS[activity].add
    const climateAdd   = CLIMATE_OPTS[climate].add
    const pregnancyAdd = pregnant === "pregnant" ? 24 : pregnant === "breastfeeding" ? 32 : 0
    const total        = base + activityAdd + climateAdd + pregnancyAdd
    setResult({
      base,
      activityAdd,
      climateAdd,
      pregnancyAdd,
      total,
      cups:          Math.round((total / 8) * 10) / 10,
      liters:        Math.round((total / 33.8) * 10) / 10,
      fromBeverages: Math.round(total * 0.8),
    })
  }

  const shareText = result
    ? `A 160-pound active person needs up to 160 oz of water daily — not just 8 glasses. Calculate yours: www.dayblip.com/health/water-intake`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Water Intake Calculator — How Much Water Should You Actually Drink Per Day?</h1>
          <p className="text-[#a8a8b3]">Personalised to your weight activity level and climate</p>
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
            <span className="text-white">Water Intake Calculator</span>
          </nav>

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              The standard recommendation of 8 glasses (64 oz) per day is a general guideline not a medical prescription. A more accurate formula is 0.5 to 1 oz of water per pound of body weight daily. A 160-pound adult needs 80 to 160 oz — 10 to 20 cups — per day. Active people and those in hot climates need significantly more.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
            Daily water needs vary significantly by body weight activity level climate and health status. The National Academies of Sciences recommends 3.7 liters (125 oz) per day for men and 2.7 liters (91 oz) per day for women from all beverages and food combined. About 20% of daily water intake comes from food.
          </p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[600px] space-y-6">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Weight (lbs)</span>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inp} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Activity level</span>
            <select value={activity} onChange={e => setActivity(Number(e.target.value))} className={sel}>
              {ACTIVITY_OPTS.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Climate</span>
            <select value={climate} onChange={e => setClimate(Number(e.target.value))} className={sel}>
              {CLIMATE_OPTS.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
            </select>
          </label>

          <div>
            <span className="block mb-2 text-sm font-semibold text-white">Pregnant or breastfeeding?</span>
            <div className="flex gap-2">
              {[["no", "No"], ["pregnant", "Pregnant"], ["breastfeeding", "Breastfeeding"]].map(([v, l]) => (
                <button key={v} onClick={() => setPregnant(v)}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${pregnant === v ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Water Intake
          </button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-center text-sm">
                {[
                  ["Daily oz",     `${result.total} oz`,          "#e94560"],
                  ["Cups per day", `${result.cups} cups`,         "#4FC3F7"],
                  ["Liters",       `${result.liters} L`,          "#F9A825"],
                  ["From beverages", `${result.fromBeverages} oz`, "#4ade80"],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                    <div className="font-black text-lg" style={{ color: String(color) }}>{value}</div>
                    <div className="mt-0.5 text-xs text-[#a8a8b3]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm space-y-2">
                <div className="font-bold text-white mb-2">Breakdown</div>
                {[
                  ["Base amount (weight × 0.67)",    `${result.base} oz`],
                  ["Activity addition",              `+${result.activityAdd} oz`],
                  ["Climate addition",               `+${result.climateAdd} oz`],
                  ...(result.pregnancyAdd > 0 ? [["Pregnancy / breastfeeding", `+${result.pregnancyAdd} oz`] as [string, string]] : []),
                  ["Total recommended",              `${result.total} oz`],
                  ["From beverages (80% of total)",  `${result.fromBeverages} oz`],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between">
                    <span className="text-[#a8a8b3]">{k}</span>
                    <span className="text-white font-semibold">{v}</span>
                  </div>
                ))}
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/health/water-intake" title="Water Intake Calculator" />
              <p className="text-xs text-[#a8a8b3]">⚠️ For educational purposes only. Not medical advice. Consult a healthcare professional for personalised guidance.</p>
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🥩", title: "Macro Calculator",      desc: "Daily protein carbs and fat targets",  href: "/health/macro-calculator" },
            { emoji: "🍎", title: "Calorie Calculator",    desc: "Daily calorie needs for your goals",   href: "/health/calorie-calculator" },
            { emoji: "⚖️", title: "BMI Calculator",        desc: "Calculate your body mass index",       href: "/health/bmi-calculator" },
            { emoji: "😴", title: "Sleep Debt Calculator", desc: "How much sleep have you missed?",      href: "/tools/sleep-debt" },
          ]} />
        </div>
      </section>
    </div>
  )
}
