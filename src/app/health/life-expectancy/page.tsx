"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"

interface Factor { key: string; label: string; options: { label: string; value: number }[] }

const FACTORS: Factor[] = [
  { key: "smoking", label: "Smoking", options: [{ label: "Never", value: 0 }, { label: "Former smoker", value: -3 }, { label: "Current smoker", value: -10 }] },
  { key: "exercise", label: "Exercise frequency", options: [{ label: "Daily", value: 3 }, { label: "3–4x/week", value: 2 }, { label: "1–2x/week", value: 1 }, { label: "Rarely", value: -2 }] },
  { key: "diet", label: "Diet quality", options: [{ label: "Excellent", value: 2 }, { label: "Good", value: 1 }, { label: "Fair", value: 0 }, { label: "Poor", value: -2 }] },
  { key: "bmi", label: "BMI range", options: [{ label: "Under 18.5 (Underweight)", value: -1 }, { label: "18.5–24.9 (Healthy)", value: 0 }, { label: "25–29.9 (Overweight)", value: -1 }, { label: "30+ (Obese)", value: -3 }] },
  { key: "alcohol", label: "Alcohol consumption", options: [{ label: "None", value: 1 }, { label: "Moderate (1–2/day)", value: 0 }, { label: "Heavy", value: -3 }, { label: "Very heavy", value: -5 }] },
  { key: "stress", label: "Stress level", options: [{ label: "Low", value: 1 }, { label: "Moderate", value: 0 }, { label: "High", value: -2 }] },
  { key: "sleep", label: "Sleep (hours/night)", options: [{ label: "7–9 hours", value: 1 }, { label: "Other", value: 0 }] },
  { key: "checkups", label: "Regular health checkups", options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
  { key: "family", label: "Family history (heart disease/cancer)", options: [{ label: "No", value: 0 }, { label: "Yes", value: -2 }] },
  { key: "education", label: "Education level", options: [{ label: "College or higher", value: 2 }, { label: "Some college", value: 1 }, { label: "High school", value: 0 }] },
  { key: "social", label: "Social connections", options: [{ label: "Strong", value: 2 }, { label: "Average", value: 0 }, { label: "Isolated", value: -2 }] },
]

export default function LifeExpectancyPage() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [currentAge, setCurrentAge] = useState("40")
  const [selections, setSelections] = useState<Record<string, number>>({
    smoking: 0, exercise: 2, diet: 1, bmi: 0, alcohol: 0, stress: 0,
    sleep: 1, checkups: 1, family: 0, education: 2, social: 0,
  })

  const calc = useMemo(() => {
    const base = gender === "male" ? 76 : 81
    const adj = Object.values(selections).reduce((s, v) => s + v, 0)
    const estimate = base + adj
    const age = parseFloat(currentAge) || 0
    const yearsRemaining = Math.max(0, estimate - age)
    const daysRemaining = Math.round(yearsRemaining * 365.25)
    const improvements = FACTORS
      .map(f => {
        const cur = selections[f.key]
        const best = Math.max(...f.options.map(o => o.value))
        return { label: f.label, gain: best - cur }
      })
      .filter(i => i.gain > 0)
      .sort((a, b) => b.gain - a.gain)
      .slice(0, 3)
    return { estimate, yearsRemaining, daysRemaining, improvements }
  }, [gender, currentAge, selections])

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <div className="bg-red-900/30 border-b border-red-500/30 px-6 py-4 text-center">
        <p className="text-red-300 font-semibold text-sm">⚠️ Statistical estimate for educational purposes only. NOT medical advice and cannot predict your actual lifespan. Consult your healthcare provider.</p>
      </div>
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Life Expectancy Calculator</h1>
          <p className="text-[#a8a8b3]">A statistical estimate based on lifestyle factors</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Gender</span>
              <div className="flex gap-2">
                {(["male", "female"] as const).map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${gender === g ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {g === "male" ? "Male (base 76)" : "Female (base 81)"}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Your Current Age</span>
              <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          {FACTORS.map(f => (
            <label key={f.key} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">{f.label}</span>
              <select value={selections[f.key]} onChange={e => setSelections(s => ({ ...s, [f.key]: Number(e.target.value) }))} className={sel}>
                {f.options.map(o => <option key={o.label} value={o.value}>{o.label} ({o.value >= 0 ? "+" : ""}{o.value})</option>)}
              </select>
            </label>
          ))}

          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
            <div className="text-6xl font-black text-[#F9A825]">{calc.estimate}</div>
            <div className="text-[#a8a8b3] mt-1">Estimated Life Expectancy</div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-2xl font-black text-white">{calc.yearsRemaining}</div><div className="text-[#a8a8b3]">Years Remaining</div></div>
              <div><div className="text-2xl font-black text-white">{calc.daysRemaining.toLocaleString()}</div><div className="text-[#a8a8b3]">Days Remaining</div></div>
            </div>
          </div>

          <ShareButtons
            text="I just calculated my estimated life expectancy! See yours at dayblip.com/health/life-expectancy (Educational only — not medical advice)"
            url="https://dayblip.com/health/life-expectancy"
            title="Life Expectancy Calculator"
          />

          {calc.improvements.length > 0 && (
            <div className="rounded-xl border border-green-500/20 bg-green-900/10 p-5">
              <h2 className="mb-3 font-bold text-white">🌱 Top Improvements</h2>
              {calc.improvements.map((imp, i) => (
                <div key={imp.label} className="flex items-center gap-3 py-2 border-b border-[#0f3460]/50 last:border-0">
                  <span className="text-green-400 font-black w-6">#{i + 1}</span>
                  <span className="text-white flex-1">{imp.label}</span>
                  <span className="text-green-400 font-semibold">+{imp.gain} years</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
            <Link href="/weekends-left" className="text-[#4FC3F7] hover:underline text-sm">
              → Calculate your Weekends Left based on this estimate
            </Link>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-5">
            <p className="text-red-300 font-semibold text-sm">⚠️ Strong Disclaimer</p>
            <p className="text-[#a8a8b3] text-xs mt-1">This calculator provides a rough statistical estimate for educational purposes only. It is not medical advice, a diagnosis, or a prediction of your actual lifespan. Genetics, environment, medical history and many other factors affect longevity in ways this calculator cannot capture. Always consult a qualified healthcare provider for health guidance.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
