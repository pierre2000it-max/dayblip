"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const ACTIVITY = [
  { label: "Sedentary (desk job, little exercise)",        multiplier: 1.2 },
  { label: "Lightly active (light exercise 1-3 days)",    multiplier: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days)", multiplier: 1.55 },
  { label: "Very active (hard exercise 6-7 days)",        multiplier: 1.725 },
  { label: "Extra active (very hard exercise)",           multiplier: 1.9 },
]

const GOALS = [
  { label: "Lose weight (500 cal deficit)", adjustment: -500 },
  { label: "Maintain weight",               adjustment: 0 },
  { label: "Gain muscle (300 cal surplus)", adjustment: 300 },
]

const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
const sel = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

interface Result {
  bmr: number
  tdee: number
  goal: number
  weekly: number
  activityLabel: string
  goalLabel: string
}

export default function CalorieCalculatorPage() {
  const [age,      setAge]      = useState("30")
  const [gender,   setGender]   = useState("male")
  const [feet,     setFeet]     = useState("5")
  const [inches,   setInches]   = useState("9")
  const [weight,   setWeight]   = useState("160")
  const [activity, setActivity] = useState(0)
  const [goalIdx,  setGoalIdx]  = useState(1)
  const [result,   setResult]   = useState<Result | null>(null)

  function calculate() {
    const ageN    = parseFloat(age) || 30
    const feetN   = parseFloat(feet) || 5
    const inchesN = parseFloat(inches) || 9
    const weightN = parseFloat(weight) || 160

    const totalInches = feetN * 12 + inchesN
    const heightCm    = totalInches * 2.54
    const weightKg    = weightN / 2.205

    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * ageN + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * ageN - 161

    const tdee = bmr * ACTIVITY[activity].multiplier
    const goal = tdee + GOALS[goalIdx].adjustment

    setResult({
      bmr:           Math.round(bmr),
      tdee:          Math.round(tdee),
      goal:          Math.round(goal),
      weekly:        Math.round(goal * 7),
      activityLabel: ACTIVITY[activity].label,
      goalLabel:     GOALS[goalIdx].label,
    })
  }

  const shareText = result
    ? `I need ${result.goal.toLocaleString()} calories per day to reach my goal. Calculate yours free — no signup: www.dayblip.com/health/calorie-calculator`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Calorie Calculator — How Many Calories Do You Need Per Day?</h1>
          <p className="text-[#a8a8b3]">Based on the Mifflin-St Jeor equation used by registered dietitians</p>
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
            <span className="text-white">Calorie Calculator</span>
          </nav>

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              The average adult woman needs approximately 1,600-2,400 calories per day and the average adult man needs 2,000-3,000 calories depending on age height weight and activity level. To lose 1 pound per week create a deficit of 500 calories per day. To gain 1 pound per week add 500 calories per day above your maintenance level.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
            Daily calorie needs are calculated using the Mifflin-St Jeor equation — the formula most widely used by registered dietitians and considered the most accurate for estimating basal metabolic rate. Your BMR is then multiplied by an activity factor to give your total daily energy expenditure.
          </p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[600px] space-y-6">

          {/* Gender */}
          <div>
            <span className="block mb-2 text-sm font-semibold text-white">Gender</span>
            <div className="flex gap-2">
              {["male", "female"].map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${gender === g ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                  {g === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Age (years)</span>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Weight (lbs)</span>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Height (feet)</span>
              <input type="number" value={feet} onChange={e => setFeet(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Height (inches)</span>
              <input type="number" value={inches} onChange={e => setInches(e.target.value)} className={inp} />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Activity level</span>
            <select value={activity} onChange={e => setActivity(Number(e.target.value))} className={sel}>
              {ACTIVITY.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Goal</span>
            <select value={goalIdx} onChange={e => setGoalIdx(Number(e.target.value))} className={sel}>
              {GOALS.map((g, i) => <option key={i} value={i}>{g.label}</option>)}
            </select>
          </label>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Calories
          </button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-center text-sm">
                {[
                  ["Maintenance",        `${result.tdee.toLocaleString()} cal/day`, "#4FC3F7"],
                  ["Your goal",          `${result.goal.toLocaleString()} cal/day`, "#e94560"],
                  ["Basal metabolic rate", `${result.bmr.toLocaleString()} cal/day`, "#F9A825"],
                  ["Weekly target",      `${result.weekly.toLocaleString()} cal`,   "#4ade80"],
                ].map(([label, value, color]) => (
                  <div key={String(label)} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                    <div className="font-black text-lg" style={{ color: String(color) }}>{value}</div>
                    <div className="mt-0.5 text-xs text-[#a8a8b3]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm space-y-2">
                <div className="font-bold text-white mb-2">Your numbers</div>
                {[
                  ["Basal metabolic rate (BMR)", `${result.bmr.toLocaleString()} calories/day`],
                  ["Maintenance calories (TDEE)", `${result.tdee.toLocaleString()} calories/day`],
                  ["Goal calories", `${result.goal.toLocaleString()} calories/day`],
                  ["Weekly calorie target", `${result.weekly.toLocaleString()} calories`],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between">
                    <span className="text-[#a8a8b3]">{k}</span>
                    <span className="text-white font-semibold">{v}</span>
                  </div>
                ))}
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/health/calorie-calculator" title="Calorie Calculator" />
              <p className="text-xs text-[#a8a8b3]">⚠️ For educational purposes only. Not medical or dietary advice. Consult a registered dietitian for personalized guidance.</p>
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "⚖️", title: "BMI Calculator",       desc: "Calculate your body mass index",        href: "/health/bmi-calculator" },
            { emoji: "🧬", title: "Life Expectancy",       desc: "Statistical estimate based on lifestyle", href: "/health/life-expectancy" },
            { emoji: "🚬", title: "Habit Cost Calculator", desc: "Financial cost of daily habits",         href: "/health/habit-cost" },
            { emoji: "😴", title: "Sleep Debt Calculator", desc: "How much sleep have you missed?",        href: "/tools/sleep-debt" },
          ]} />
        </div>
      </section>
    </div>
  )
}
