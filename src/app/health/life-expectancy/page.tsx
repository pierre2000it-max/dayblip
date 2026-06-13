"use client"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

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
  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("gender")) setGender(p.get("gender") as "male" | "female")
    if (p.get("age")) setCurrentAge(p.get("age")!)
  }, [])

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"WebApplication","name":"Life Expectancy Calculator","url":"https://www.dayblip.com/health/life-expectancy","description":"Estimate your statistical life expectancy based on age, gender, lifestyle factors, and health habits.","applicationCategory":"HealthApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the average US life expectancy?","acceptedAnswer":{"@type":"Answer","text":"According to CDC data, US life expectancy at birth is approximately 77 years as of the most recent data. Women live an average of 80 years and men approximately 74 years."}},{"@type":"Question","name":"What factors affect life expectancy most?","acceptedAnswer":{"@type":"Answer","text":"The strongest predictors are smoking status, body weight, physical activity level, diet quality, alcohol consumption, healthcare access, education level, and socioeconomic status. Genetics accounts for roughly 20 to 30 percent of longevity variation."}},{"@type":"Question","name":"How is statistical life expectancy calculated?","acceptedAnswer":{"@type":"Answer","text":"Life expectancy is calculated from actuarial life tables — statistical models based on age-specific mortality rates across large populations. The CDC and Social Security Administration publish these tables annually."}},{"@type":"Question","name":"Does this tool predict when I will die?","acceptedAnswer":{"@type":"Answer","text":"No. This tool provides a statistical estimate based on population averages and known risk factors. Individual outcomes vary enormously. The number is useful for financial planning — estimating retirement length, Social Security timing, and long-term care needs."}}]}) }} />
      <div className="bg-red-900/30 border-b border-red-500/30 px-6 py-4 text-center">
        <p className="text-red-300 font-semibold text-sm">⚠️ Statistical estimate for educational purposes only. NOT medical advice and cannot predict your actual lifespan. Consult your healthcare provider.</p>
      </div>
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Life Expectancy Calculator — Your Statistical Life Estimate</h1>
          <p className="text-[#a8a8b3]">A statistical estimate based on lifestyle factors</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Average US life expectancy is 76.4 years (74.0 for men, 79.3 for women). A 40-year-old American today has a life expectancy of approximately 79 years. Non-smokers live 10 years longer on average than smokers. Regular exercise adds 3-7 years. Maintaining a healthy weight adds 2-4 years compared to obesity.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Life expectancy calculators use actuarial data and health factors to estimate statistical lifespan. Factors including current age, gender, smoking status, weight, exercise habits and family history all influence the estimate. This tool provides a statistical estimate for educational purposes only — not a medical prediction. Consult a doctor for personalized health guidance.</p>
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
            text={`My estimated life expectancy is ${calc.estimate} years — ${calc.yearsRemaining} years remaining! (Educational estimate only — not medical advice)`}
            url={`https://www.dayblip.com/health/life-expectancy?gender=${gender}&age=${currentAge}`}
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
          <RelatedTools tools={[
            { emoji: "🤰", title: "Pregnancy Due Date Calculator", desc: "Calculate your baby's due date", href: "/health/due-date-calculator" },
            { emoji: "😴", title: "Sleep Calculator", desc: "Best bedtime based on 90-min cycles", href: "/health/sleep-calculator" },
            { emoji: "⚖️", title: "BMI Calculator", desc: "Calculate your body mass index", href: "/health/bmi-calculator" },
            { emoji: "🚬", title: "Habit Cost Calculator", desc: "Financial cost of daily habits", href: "/health/habit-cost" },
          ]} />
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 20px 0 20px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0' }}>
              Frequently Asked Questions
            </h2>
            {[
              { q: "What is the average US life expectancy?", a: "According to CDC data, US life expectancy at birth is approximately 77 years as of the most recent data. Women live an average of 80 years and men approximately 74 years." },
              { q: "What factors affect life expectancy most?", a: "The strongest predictors are smoking status, body weight, physical activity level, diet quality, alcohol consumption, healthcare access, education level, and socioeconomic status. Genetics accounts for roughly 20 to 30 percent of longevity variation." },
              { q: "How is statistical life expectancy calculated?", a: "Life expectancy is calculated from actuarial life tables — statistical models based on age-specific mortality rates across large populations. The CDC and Social Security Administration publish these tables annually." },
              { q: "Does this tool predict when I will die?", a: "No. This tool provides a statistical estimate based on population averages and known risk factors. Individual outcomes vary enormously. The number is useful for financial planning — estimating retirement length, Social Security timing, and long-term care needs." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  {item.q}
                </h3>
                <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.7', margin: '0' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
