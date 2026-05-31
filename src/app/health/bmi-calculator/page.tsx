"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

interface Category { label: string; min: number; max: number; color: string; bg: string }

const CATEGORIES: Category[] = [
  { label: "Underweight", min: 0, max: 18.5, color: "#4FC3F7", bg: "#1a3a5c" },
  { label: "Normal weight", min: 18.5, max: 25, color: "#4ade80", bg: "#1a3c2a" },
  { label: "Overweight", min: 25, max: 30, color: "#F9A825", bg: "#3c2f1a" },
  { label: "Obese Class I", min: 30, max: 35, color: "#fb923c", bg: "#3c251a" },
  { label: "Obese Class II+", min: 35, max: 99, color: "#e94560", bg: "#3c1a1a" },
]

function getCategory(bmi: number): Category {
  return CATEGORIES.find(c => bmi >= c.min && bmi < c.max) ?? CATEGORIES[CATEGORIES.length - 1]
}

export default function BMIPage() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial")
  const [ft, setFt] = useState("5")
  const [inches, setInches] = useState("9")
  const [cm, setCm] = useState("175")
  const [lbs, setLbs] = useState("170")
  const [kg, setKg] = useState("77")
  const [age, setAge] = useState("35")
  const [gender, setGender] = useState("male")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("unit")) setUnit(p.get("unit") as "imperial" | "metric")
    if (p.get("age")) setAge(p.get("age")!)
    if (p.get("gender")) setGender(p.get("gender")!)
    const u = p.get("unit") || "imperial"
    if (u === "imperial") {
      if (p.get("height")) setFt(p.get("height")!)
      if (p.get("inches")) setInches(p.get("inches")!)
      if (p.get("weight")) setLbs(p.get("weight")!)
    } else {
      if (p.get("height")) setCm(p.get("height")!)
      if (p.get("weight")) setKg(p.get("weight")!)
    }
  }, [])

  const calc = useMemo(() => {
    let heightM: number
    let weightKg: number
    if (unit === "imperial") {
      const totalIn = parseFloat(ft) * 12 + parseFloat(inches)
      heightM = totalIn * 0.0254
      weightKg = parseFloat(lbs) * 0.453592
    } else {
      heightM = (parseFloat(cm) || 0) / 100
      weightKg = parseFloat(kg) || 0
    }
    if (heightM <= 0) return null
    const bmi = weightKg / (heightM * heightM)
    const cat = getCategory(bmi)
    const minHealthyKg = 18.5 * heightM * heightM
    const maxHealthyKg = 24.9 * heightM * heightM
    const minHealthy = unit === "imperial" ? (minHealthyKg / 0.453592).toFixed(0) + " lbs" : minHealthyKg.toFixed(0) + " kg"
    const maxHealthy = unit === "imperial" ? (maxHealthyKg / 0.453592).toFixed(0) + " lbs" : maxHealthyKg.toFixed(0) + " kg"
    const scalePos = Math.min(95, Math.max(2, ((Math.min(bmi, 40) - 15) / 25) * 100))
    return { bmi: bmi.toFixed(1), cat, minHealthy, maxHealthy, scalePos }
  }, [unit, ft, inches, cm, lbs, kg])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">BMI Calculator</h1>
          <p className="text-[#a8a8b3]">Calculate your Body Mass Index</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[600px] space-y-8">
          <div className="flex gap-2">
            {(["imperial", "metric"] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${unit === u ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {u === "imperial" ? "Imperial (ft, lbs)" : "Metric (cm, kg)"}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {unit === "imperial" ? (
              <>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Height (feet)</span>
                  <input type="number" value={ft} onChange={e => setFt(e.target.value)} className={inp} /></label>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Height (inches)</span>
                  <input type="number" value={inches} onChange={e => setInches(e.target.value)} className={inp} /></label>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Weight (lbs)</span>
                  <input type="number" value={lbs} onChange={e => setLbs(e.target.value)} className={inp} /></label>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Height (cm)</span>
                  <input type="number" value={cm} onChange={e => setCm(e.target.value)} className={inp} /></label>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Weight (kg)</span>
                  <input type="number" value={kg} onChange={e => setKg(e.target.value)} className={inp} /></label>
              </>
            )}
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Age</span>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inp} /></label>
            <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Gender</span>
              <div className="flex gap-2">
                {["male", "female"].map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${gender === g ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {calc && (
            <div className="space-y-4">
              <div className="rounded-xl p-6 text-center" style={{ background: calc.cat.bg, borderColor: calc.cat.color, border: "1px solid" }}>
                <div className="text-6xl font-black" style={{ color: calc.cat.color }}>{calc.bmi}</div>
                <div className="text-xl font-bold text-white mt-1">{calc.cat.label}</div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-xs text-[#a8a8b3] mb-2 flex justify-between">
                  <span>15</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span>
                </div>
                <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #4FC3F7, #4ade80, #F9A825, #fb923c, #e94560)" }}>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${calc.scalePos}%` }} />
                </div>
                <div className="text-xs text-[#a8a8b3] mt-1 text-center">Your BMI: {calc.bmi}</div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-sm">
                <span className="text-[#a8a8b3]">Healthy weight range for your height: </span>
                <span className="text-white font-semibold">{calc.minHealthy} – {calc.maxHealthy}</span>
              </div>
            </div>
          )}

          {calc && (
            <ShareButtons
              text={`My BMI is ${calc.bmi} — ${calc.cat.label}. Healthy range for my height: ${calc.minHealthy}–${calc.maxHealthy}. (Not medical advice)`}
              url={`https://www.dayblip.com/health/bmi-calculator?height=${unit === "imperial" ? ft : cm}&inches=${inches}&weight=${unit === "imperial" ? lbs : kg}&unit=${unit}&age=${age}&gender=${gender}`}
              title="BMI Calculator"
            />
          )}
          <p className="text-xs text-[#a8a8b3]">⚠️ BMI is a screening tool only and does not directly measure body fat or account for muscle mass. Not medical advice. Consult a healthcare provider for personalized guidance.</p>
        </div>
      </section>
    </div>
  )
}
