"use client"
import { useState } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

interface BFCategory {
  label: string
  mMin: number
  mMax: number
  fMin: number
  fMax: number
  color: string
}

const CATEGORIES: BFCategory[] = [
  { label: "Essential Fat", mMin: 2,  mMax: 5,  fMin: 10, fMax: 13, color: "#4FC3F7" },
  { label: "Athletic",      mMin: 6,  mMax: 13, fMin: 14, fMax: 20, color: "#4ade80" },
  { label: "Fitness",       mMin: 14, mMax: 17, fMin: 21, fMax: 24, color: "#F9A825" },
  { label: "Average",       mMin: 18, mMax: 24, fMin: 25, fMax: 31, color: "#fb923c" },
  { label: "Obese",         mMin: 25, mMax: 99, fMin: 32, fMax: 99, color: "#e94560" },
]

function getCategory(bf: number, gender: "male" | "female"): BFCategory {
  for (const c of CATEGORIES) {
    const min = gender === "male" ? c.mMin : c.fMin
    const max = gender === "male" ? c.mMax : c.fMax
    if (bf >= min && bf <= max) return c
  }
  return CATEGORIES[CATEGORIES.length - 1]
}

function inToCm(i: number) { return i * 2.54 }
function ftInToCm(ft: number, inches: number) { return (ft * 12 + inches) * 2.54 }
function lbsToKg(lbs: number) { return lbs * 0.453592 }
function kgToLbs(kg: number) { return kg * 2.20462 }

export default function BodyFatPage() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial")

  const [heightFt, setHeightFt] = useState("5")
  const [heightIn, setHeightIn] = useState("10")
  const [heightCm, setHeightCm] = useState("177")
  const [weightLbs, setWeightLbs] = useState("185")
  const [weightKg, setWeightKg] = useState("84")
  const [neck, setNeck] = useState("15")
  const [waist, setWaist] = useState("34")
  const [hip, setHip] = useState("40")

  const [result, setResult] = useState<{ bf: number; fatMassLbs: number; leanMassLbs: number; fatMassKg: number; leanMassKg: number; category: BFCategory } | null>(null)
  const [error, setError] = useState("")

  function calculate() {
    setError("")

    let heightCmVal: number, weightKgVal: number
    let neckCm: number, waistCm: number, hipCm: number = 0

    if (unitSystem === "imperial") {
      heightCmVal = ftInToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0)
      weightKgVal = lbsToKg(parseFloat(weightLbs) || 0)
      neckCm = inToCm(parseFloat(neck) || 0)
      waistCm = inToCm(parseFloat(waist) || 0)
      if (gender === "female") hipCm = inToCm(parseFloat(hip) || 0)
    } else {
      heightCmVal = parseFloat(heightCm) || 0
      weightKgVal = parseFloat(weightKg) || 0
      neckCm = parseFloat(neck) || 0
      waistCm = parseFloat(waist) || 0
      if (gender === "female") hipCm = parseFloat(hip) || 0
    }

    if (heightCmVal <= 0 || weightKgVal <= 0 || neckCm <= 0 || waistCm <= 0) {
      setError("Please fill in all measurements.")
      return
    }
    if (gender === "female" && hipCm <= 0) {
      setError("Hip measurement is required for women.")
      return
    }
    if (waistCm <= neckCm) {
      setError("Waist must be larger than neck measurement.")
      return
    }

    let bf: number
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCmVal)) - 450
    } else {
      const sum = waistCm + hipCm - neckCm
      if (sum <= 0) { setError("Invalid measurements — please check values."); return }
      bf = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(heightCmVal)) - 450
    }

    bf = Math.max(2, Math.min(60, bf))
    const weightLbsVal = kgToLbs(weightKgVal)
    const fatMassLbs = (bf / 100) * weightLbsVal
    const leanMassLbs = weightLbsVal - fatMassLbs
    const fatMassKg = (bf / 100) * weightKgVal
    const leanMassKg = weightKgVal - fatMassKg

    setResult({ bf, fatMassLbs, leanMassLbs, fatMassKg, leanMassKg, category: getCategory(bf, gender) })
  }

  const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none text-sm"

  const shareText = result
    ? `My body fat is ${result.bf.toFixed(1)}% — ${result.category.label}. Calculate yours free with just a measuring tape: www.dayblip.com/health/body-fat`
    : "Calculate your body fat % free: www.dayblip.com/health/body-fat"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Body Fat Calculator", "Calculate body fat percentage using the US Navy circumference method", "https://www.dayblip.com/health/body-fat", "HealthApplication"),
        faqSchema([
          { question: "How accurate is the US Navy body fat calculator?", answer: "The US Navy circumference method is accurate to within 3-4 percentage points for most people. It is less accurate for very lean individuals (under 10% body fat) or very obese individuals. DEXA scans are the gold standard for body fat measurement but require medical equipment. The Navy method is the most accurate no-equipment method available." },
          { question: "What is a healthy body fat percentage for women?", answer: "For women: essential fat is 10-13% (minimum for basic body functions) athletic is 14-20% fitness is 21-24% acceptable average is 25-31% and obese is 32% and above. Most health organizations consider 21-24% to be the ideal fitness range for women who are not competitive athletes." },
          { question: "What is a healthy body fat percentage for men?", answer: "For men: essential fat is 2-5% athletic is 6-13% fitness is 14-17% acceptable average is 18-24% and obese is 25% and above. The American Council on Exercise considers 14-17% to be the fitness range for men and 6-13% for athletes." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Health", url: "https://www.dayblip.com/health" },
          { name: "Body Fat Calculator", url: "https://www.dayblip.com/health/body-fat" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">💪</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Body Fat Calculator — Your Body Fat Percentage</h1>
          <p className="text-[#a8a8b3]">US Navy method — just a measuring tape, no calipers needed</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Health", href: "/health" }, { label: "Body Fat Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>Healthy body fat ranges: Women — essential fat 10–13%, athletes 14–20%, fitness 21–24%, average 25–31%, obese 32% and above. Men — essential fat 2–5%, athletes 6–13%, fitness 14–17%, average 18–24%, obese 25% and above. The US Navy method calculates body fat from neck waist and hip measurements without calipers and is accurate to within 3–4%.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Body fat percentage is a more meaningful health metric than BMI because it distinguishes between fat mass and lean muscle mass. A muscular athlete may have a high BMI but low body fat percentage. This calculator uses the US Navy circumference method — the standard used by the US military — which requires only a measuring tape and is accurate to within 3–4%.</p>

          {/* Gender + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-sm font-semibold text-white">Gender</div>
              <div className="flex rounded-lg overflow-hidden border border-[#0f3460]">
                {(["male", "female"] as const).map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className="flex-1 py-2 text-sm font-semibold capitalize transition-colors"
                    style={{ background: gender === g ? "#e94560" : "#1a1a2e", color: gender === g ? "#fff" : "#a8a8b3" }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm font-semibold text-white">Units</div>
              <div className="flex rounded-lg overflow-hidden border border-[#0f3460]">
                {(["imperial", "metric"] as const).map(u => (
                  <button key={u} onClick={() => setUnitSystem(u)}
                    className="flex-1 py-2 text-sm font-semibold capitalize transition-colors"
                    style={{ background: unitSystem === u ? "#e94560" : "#1a1a2e", color: unitSystem === u ? "#fff" : "#a8a8b3" }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {unitSystem === "imperial" ? (
              <>
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-white">Height (feet)</span>
                    <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className={inp} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-white">Height (inches)</span>
                    <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className={inp} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Weight (lbs)</span>
                  <input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Neck (inches)</span>
                  <input type="number" step="0.5" value={neck} onChange={e => setNeck(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Waist at navel (inches)</span>
                  <input type="number" step="0.5" value={waist} onChange={e => setWaist(e.target.value)} className={inp} />
                </label>
                {gender === "female" && (
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-white">Hip at widest (inches)</span>
                    <input type="number" step="0.5" value={hip} onChange={e => setHip(e.target.value)} className={inp} />
                  </label>
                )}
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Height (cm)</span>
                  <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Weight (kg)</span>
                  <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Neck (cm)</span>
                  <input type="number" step="0.5" value={neck} onChange={e => setNeck(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Waist at navel (cm)</span>
                  <input type="number" step="0.5" value={waist} onChange={e => setWaist(e.target.value)} className={inp} />
                </label>
                {gender === "female" && (
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold text-white">Hip at widest (cm)</span>
                    <input type="number" step="0.5" value={hip} onChange={e => setHip(e.target.value)} className={inp} />
                  </label>
                )}
              </>
            )}
          </div>

          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate Body Fat %
          </button>

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border p-6 text-center" style={{ borderColor: result.category.color + "50", background: result.category.color + "15" }}>
                <div className="text-sm text-[#a8a8b3] mb-1">Body Fat Percentage</div>
                <div className="text-5xl font-black" style={{ color: result.category.color }}>{result.bf.toFixed(1)}%</div>
                <div className="text-lg font-bold text-white mt-1">{result.category.label}</div>
              </div>

              {/* Category bar */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="mb-2 text-sm font-semibold text-white">Category Ranges ({gender === "male" ? "Men" : "Women"})</div>
                <div className="space-y-1.5">
                  {CATEGORIES.map(c => {
                    const min = gender === "male" ? c.mMin : c.fMin
                    const max = gender === "male" ? c.mMax : c.fMax
                    const isActive = c.label === result.category.label
                    return (
                      <div key={c.label} className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${isActive ? "ring-2 ring-current" : ""}`}
                        style={{ background: isActive ? c.color + "25" : "#16213e", color: isActive ? c.color : undefined } as React.CSSProperties}>
                        <span style={{ color: isActive ? c.color : "#a8a8b3", fontWeight: isActive ? 700 : 400 }}>
                          {isActive ? "→ " : ""}{c.label}
                        </span>
                        <span className="text-white">{min}–{max === 99 ? "∞" : max}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                  <div className="font-black text-[#FF6B6B] text-xl">{result.fatMassLbs.toFixed(1)} lbs</div>
                  <div className="text-[#a8a8b3] text-xs">Fat mass ({result.fatMassKg.toFixed(1)} kg)</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                  <div className="font-black text-[#4ade80] text-xl">{result.leanMassLbs.toFixed(1)} lbs</div>
                  <div className="text-[#a8a8b3] text-xs">Lean mass ({result.leanMassKg.toFixed(1)} kg)</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-sm text-[#a8a8b3]">
                BMI alone does not tell the full story.{" "}
                <Link href="/health/bmi-calculator" className="text-[#4FC3F7] hover:underline">See your BMI →</Link>
              </div>

              <p className="text-xs text-[#a8a8b3]">⚠️ This calculator provides an estimate for informational purposes. Consult a healthcare professional for accurate body composition assessment.</p>
              <ShareButtons text={shareText} url="https://www.dayblip.com/health/body-fat" title="Body Fat Calculator" />
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "⚖️", title: "BMI Calculator", desc: "Body mass index and what it means", href: "/health/bmi-calculator" },
            { emoji: "🍎", title: "Calorie Calculator", desc: "Daily calorie needs for your goals", href: "/health/calorie-calculator" },
            { emoji: "💪", title: "Macro Calculator", desc: "Optimal protein carbs and fat split", href: "/health/macro-calculator" },
            { emoji: "💧", title: "Water Intake Calculator", desc: "How much water you should drink", href: "/health/water-intake" },
          ]} />
        </div>
      </section>
    </div>
  )
}
