"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"WebApplication","name":"BMI Calculator","url":"https://www.dayblip.com/health/bmi-calculator","description":"Calculate your Body Mass Index using height and weight in imperial or metric units with WHO category classification.","applicationCategory":"HealthApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How is BMI calculated?","acceptedAnswer":{"@type":"Answer","text":"BMI is calculated by dividing weight in kilograms by height in meters squared. In imperial units the formula is weight in pounds multiplied by 703 divided by height in inches squared. This calculator handles both unit systems."}},{"@type":"Question","name":"What are the BMI categories?","acceptedAnswer":{"@type":"Answer","text":"Standard BMI categories are: Underweight below 18.5, Normal weight 18.5 to 24.9, Overweight 25 to 29.9, Obese Class I 30 to 34.9, Obese Class II 35 to 39.9, Obese Class III 40 and above. These categories are defined by the World Health Organization."}},{"@type":"Question","name":"What are the limitations of BMI?","acceptedAnswer":{"@type":"Answer","text":"BMI does not distinguish between muscle and fat mass. Athletes and muscular individuals often have high BMIs despite low body fat. BMI also does not account for fat distribution — visceral fat around organs carries higher health risk than subcutaneous fat. It is a screening tool not a diagnostic measure."}},{"@type":"Question","name":"Is BMI accurate for all populations?","acceptedAnswer":{"@type":"Answer","text":"BMI was developed using data from European populations and may not accurately reflect health risks for all ethnic groups. Some research suggests Asian populations face higher health risks at lower BMI thresholds. Always discuss BMI with a healthcare provider for personal health decisions."}}]}) }} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">BMI Calculator — Body Mass Index and What It Means</h1>
          <p className="text-[#a8a8b3]">Calculate your Body Mass Index</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">BMI is calculated by dividing weight in kilograms by height in meters squared. BMI ranges: under 18.5 is underweight, 18.5-24.9 is normal, 25-29.9 is overweight, 30 and above is obese. BMI does not measure body fat directly and does not account for muscle mass — athletes often show high BMI despite low body fat.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Body Mass Index (BMI) is a screening tool that uses height and weight to categorize weight status. While widely used in medical settings BMI has significant limitations — it does not distinguish between muscle and fat, does not account for age, sex or ethnicity differences, and is not a direct measure of health. A doctor can provide proper health assessment.</p>
          <LastUpdated />
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[600px] space-y-8">
          <AuthorByline variant="tool" />
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
          <MethodologyNote text="Uses the standard BMI formula (weight in kg ÷ height in meters²) with CDC weight classification thresholds." />
          <RelatedTools tools={[
            { emoji: "💪", title: "Body Fat Calculator", desc: "More accurate than BMI — uses measurements", href: "/health/body-fat" },
            { emoji: "🍎", title: "Calorie Calculator", desc: "Daily calorie needs for your goals", href: "/health/calorie-calculator" },
            { emoji: "🥩", title: "Macro Calculator", desc: "Optimal protein carbs and fat targets", href: "/health/macro-calculator" },
            { emoji: "❤️", title: "Life Expectancy Calculator", desc: "Statistical life expectancy estimate", href: "/health/life-expectancy" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
          <FAQAccordion items={[
            { q: "How is BMI calculated?", a: "BMI is calculated by dividing weight in kilograms by height in meters squared. In imperial units the formula is weight in pounds multiplied by 703 divided by height in inches squared. This calculator handles both unit systems." },
            { q: "What are the BMI categories?", a: "Standard BMI categories are: Underweight below 18.5, Normal weight 18.5 to 24.9, Overweight 25 to 29.9, Obese Class I 30 to 34.9, Obese Class II 35 to 39.9, Obese Class III 40 and above. These categories are defined by the World Health Organization." },
            { q: "What are the limitations of BMI?", a: "BMI does not distinguish between muscle and fat mass. Athletes and muscular individuals often have high BMIs despite low body fat. BMI also does not account for fat distribution — visceral fat around organs carries higher health risk than subcutaneous fat. It is a screening tool not a diagnostic measure." },
            { q: "Is BMI accurate for all populations?", a: "BMI was developed using data from European populations and may not accurately reflect health risks for all ethnic groups. Some research suggests Asian populations face higher health risks at lower BMI thresholds. Always discuss BMI with a healthcare provider for personal health decisions." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
