"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

interface GoalPreset {
  label: string
  protein: number
  carbs: number
  fat: number
}

const PRESETS: GoalPreset[] = [
  { label: "Weight loss",                  protein: 40, carbs: 30, fat: 30 },
  { label: "Maintenance",                  protein: 30, carbs: 40, fat: 30 },
  { label: "Muscle building (lean bulk)",  protein: 30, carbs: 50, fat: 20 },
  { label: "Athletic performance",         protein: 25, carbs: 55, fat: 20 },
  { label: "Keto (low carb)",              protein: 30, carbs: 5,  fat: 65 },
  { label: "Custom split",                 protein: 33, carbs: 34, fat: 33 },
]

interface MacroResult {
  proteinG: number; proteinCal: number; proteinPct: number
  carbsG: number;   carbsCal: number;   carbsPct: number
  fatG: number;     fatCal: number;     fatPct: number
  total: number
  minProtein: number
  proteinWarning: boolean
  goal: string
}

export default function MacroCalculatorPage() {
  const [calories, setCalories] = useState("2000")
  const [goalIdx, setGoalIdx] = useState(0)
  const [weight, setWeight] = useState("170")
  const [customP, setCustomP] = useState(33)
  const [customC, setCustomC] = useState(34)
  const [customF, setCustomF] = useState(33)
  const [result, setResult] = useState<MacroResult | null>(null)

  const isCustom = goalIdx === PRESETS.length - 1

  function adjustCustom(field: "p" | "c" | "f", value: number) {
    const v = Math.max(0, Math.min(100, value))
    if (field === "p") {
      const remaining = 100 - v
      const ratio = customC + customF > 0 ? customC / (customC + customF) : 0.5
      setCustomP(v)
      setCustomC(Math.round(remaining * ratio))
      setCustomF(100 - v - Math.round(remaining * ratio))
    } else if (field === "c") {
      const remaining = 100 - v
      const ratio = customP + customF > 0 ? customP / (customP + customF) : 0.5
      setCustomC(v)
      setCustomP(Math.round(remaining * ratio))
      setCustomF(100 - v - Math.round(remaining * ratio))
    } else {
      const remaining = 100 - v
      const ratio = customP + customC > 0 ? customP / (customP + customC) : 0.5
      setCustomF(v)
      setCustomP(Math.round(remaining * ratio))
      setCustomC(100 - v - Math.round(remaining * ratio))
    }
  }

  function calculate() {
    const cal = parseFloat(calories) || 2000
    const bw = parseFloat(weight) || 170
    const preset = PRESETS[goalIdx]
    const pPct = isCustom ? customP : preset.protein
    const cPct = isCustom ? customC : preset.carbs
    const fPct = isCustom ? customF : preset.fat

    const proteinCal = cal * pPct / 100
    const carbsCal   = cal * cPct / 100
    const fatCal     = cal * fPct / 100

    const proteinG = proteinCal / 4
    const carbsG   = carbsCal / 4
    const fatG     = fatCal / 9

    const minProtein = bw * 0.7

    setResult({
      proteinG, proteinCal, proteinPct: pPct,
      carbsG,   carbsCal,   carbsPct: cPct,
      fatG,     fatCal,     fatPct: fPct,
      total: cal,
      minProtein,
      proteinWarning: proteinG < minProtein,
      goal: preset.label,
    })
  }

  const shareText = result
    ? `My daily macro targets: ${Math.round(result.proteinG)}g protein ${Math.round(result.carbsG)}g carbs ${Math.round(result.fatG)}g fat for ${result.goal}. Calculate yours free: www.dayblip.com/health/macro-calculator`
    : "Calculate your macro targets free: www.dayblip.com/health/macro-calculator"

  const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none text-sm"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Macro Calculator", "Calculate daily protein carbohydrate and fat targets for any fitness goal", "https://www.dayblip.com/health/macro-calculator", "HealthApplication"),
        faqSchema([
          { question: "How many grams of protein do I need per day?", answer: "General recommendations: sedentary adults need 0.36 grams per pound of body weight. Active individuals need 0.6-0.9 grams per pound. Those building muscle need 0.8-1.2 grams per pound. A 170-pound active person needs approximately 102-153 grams of protein per day." },
          { question: "What is the best macro split for weight loss?", answer: "A common effective split for weight loss is 40% protein 30% carbohydrates and 30% fat. Higher protein preserves muscle during a calorie deficit. On a 1,800 calorie diet this means 180g protein 135g carbs and 60g fat daily. Always maintain a calorie deficit of 300-500 calories below maintenance for sustainable weight loss." },
          { question: "What is the difference between macros and calories?", answer: "Calories measure total energy in food. Macros (macronutrients) are the three nutrient categories that provide those calories: protein and carbohydrates provide 4 calories per gram and fat provides 9 calories per gram. Tracking macros gives more information than tracking calories alone — two diets can have identical calories but very different macros and very different effects on body composition." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Health", url: "https://www.dayblip.com/health" },
          { name: "Macro Calculator", url: "https://www.dayblip.com/health/macro-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🥩</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Macro Calculator — Your Daily Protein Carbs and Fat Targets</h1>
          <p className="text-[#a8a8b3]">Optimal macros for weight loss, muscle building, keto or any goal</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Health", href: "/health" }, { label: "Macro Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>For a 2000 calorie weight loss diet a standard macro split is 40% protein (200g) 30% carbohydrates (150g) and 30% fat (67g). For muscle building a typical split is 30% protein (150g) 50% carbohydrates (250g) and 20% fat (44g). Protein provides 4 calories per gram carbohydrates 4 calories per gram and fat 9 calories per gram.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Macronutrients — protein carbohydrates and fat — are the three main energy sources in food. Each macro serves different functions: protein builds and repairs muscle carbohydrates provide immediate energy and fat supports hormone production and nutrient absorption. Your optimal macro split depends on your calorie target activity level and specific fitness goal.</p>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">
                Daily calorie target{" "}
                <Link href="/health/calorie-calculator" className="text-xs text-[#4FC3F7] hover:underline">(calculate yours →)</Link>
              </span>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className={inp} />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Fitness goal</span>
              <select value={goalIdx} onChange={e => setGoalIdx(parseInt(e.target.value))}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none text-sm">
                {PRESETS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Body weight (lbs) — for minimum protein check</span>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inp} />
            </label>

            {isCustom && (
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
                <div className="text-sm font-semibold text-white">Custom split (must total 100%)</div>
                {[
                  { label: "Protein", val: customP, setter: (v: number) => adjustCustom("p", v), color: "#4FC3F7" },
                  { label: "Carbs",   val: customC, setter: (v: number) => adjustCustom("c", v), color: "#fb923c" },
                  { label: "Fat",     val: customF, setter: (v: number) => adjustCustom("f", v), color: "#F9A825" },
                ].map(({ label, val, setter, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-white">{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>{val}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={val}
                      onChange={e => setter(parseInt(e.target.value))}
                      className="w-full" style={{ accentColor: color }} />
                  </div>
                ))}
                <div className="text-xs text-center" style={{ color: customP + customC + customF === 100 ? "#4ade80" : "#FF6B6B" }}>
                  Total: {customP + customC + customF}% {customP + customC + customF === 100 ? "✓" : "(must equal 100%)"}
                </div>
              </div>
            )}

            {!isCustom && (
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3 grid grid-cols-3 gap-2 text-center text-sm">
                {[
                  ["Protein", PRESETS[goalIdx].protein, "#4FC3F7"],
                  ["Carbs",   PRESETS[goalIdx].carbs,   "#fb923c"],
                  ["Fat",     PRESETS[goalIdx].fat,     "#F9A825"],
                ].map(([label, pct, color]) => (
                  <div key={String(label)}>
                    <div className="font-black text-lg" style={{ color: String(color) }}>{pct}%</div>
                    <div className="text-[#a8a8b3] text-xs">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Macros
          </button>

          {result && (
            <div className="space-y-4">
              {/* Visual bar */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-sm font-semibold text-white mb-3">Macro Split — {result.total.toLocaleString()} calories</div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div style={{ width: `${result.proteinPct}%`, background: "#4FC3F7" }} className="flex items-center justify-center text-xs font-bold text-[#1a1a2e]">
                    {result.proteinPct >= 10 ? `${result.proteinPct}%` : ""}
                  </div>
                  <div style={{ width: `${result.carbsPct}%`, background: "#fb923c" }} className="flex items-center justify-center text-xs font-bold text-[#1a1a2e]">
                    {result.carbsPct >= 10 ? `${result.carbsPct}%` : ""}
                  </div>
                  <div style={{ width: `${result.fatPct}%`, background: "#F9A825" }} className="flex items-center justify-center text-xs font-bold text-[#1a1a2e]">
                    {result.fatPct >= 10 ? `${result.fatPct}%` : ""}
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#a8a8b3]">
                  <span style={{ color: "#4FC3F7" }}>■ Protein</span>
                  <span style={{ color: "#fb923c" }}>■ Carbs</span>
                  <span style={{ color: "#F9A825" }}>■ Fat</span>
                </div>
              </div>

              {/* Main results */}
              <div className="space-y-2">
                {[
                  { label: "Protein", g: result.proteinG, cal: result.proteinCal, pct: result.proteinPct, color: "#4FC3F7" },
                  { label: "Carbohydrates", g: result.carbsG, cal: result.carbsCal, pct: result.carbsPct, color: "#fb923c" },
                  { label: "Fat", g: result.fatG, cal: result.fatCal, pct: result.fatPct, color: "#F9A825" },
                ].map(({ label, g, cal, pct, color }) => (
                  <div key={label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold" style={{ color }}>{label}</div>
                      <div className="text-xs text-[#a8a8b3]">{Math.round(cal)} calories · {pct}%</div>
                    </div>
                    <div className="text-2xl font-black text-white">{Math.round(g)}g</div>
                  </div>
                ))}
              </div>

              {result.proteinWarning && (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-4 text-sm text-yellow-300">
                  ⚠️ Note: For your body weight the minimum recommended protein is {Math.round(result.minProtein)}g per day to preserve muscle mass.
                </div>
              )}

              {/* Per meal */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-sm font-semibold text-white mb-2">Per meal (÷ 3 meals)</div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  {[
                    ["Protein", Math.round(result.proteinG / 3), "#4FC3F7"],
                    ["Carbs",   Math.round(result.carbsG / 3),   "#fb923c"],
                    ["Fat",     Math.round(result.fatG / 3),     "#F9A825"],
                  ].map(([label, val, color]) => (
                    <div key={String(label)} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-2">
                      <div className="font-black text-lg" style={{ color: String(color) }}>{val}g</div>
                      <div className="text-[#a8a8b3] text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#a8a8b3]">⚠️ For educational purposes only. Not medical or dietary advice. Consult a registered dietitian for personalized guidance.</p>
              <ShareButtons text={shareText} url="https://www.dayblip.com/health/macro-calculator" title="Macro Calculator" />
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🔥", title: "Calorie Calculator", desc: "Find your daily calorie needs first", href: "/health/calorie-calculator" },
            { emoji: "💪", title: "Body Fat Calculator", desc: "Calculate your body fat percentage", href: "/health/body-fat" },
            { emoji: "💧", title: "Water Intake Calculator", desc: "How much water you need daily", href: "/health/water-intake" },
            { emoji: "❤️", title: "Heart Rate Zones", desc: "Target heart rate for your workouts", href: "/health/heart-rate" },
          ]} />
        </div>
      </section>
    </div>
  )
}
