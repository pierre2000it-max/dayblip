"use client"
import { useState } from "react"

const MALE_CATEGORIES = [
  { label: "Essential fat", min: 2,  max: 5,  color: "#4FC3F7" },
  { label: "Athletic",      min: 6,  max: 13, color: "#22c55e" },
  { label: "Fitness",       min: 14, max: 17, color: "#F9A825" },
  { label: "Average",       min: 18, max: 24, color: "#fb923c" },
  { label: "Obese",         min: 25, max: 100, color: "#FF6B6B" },
]

const FEMALE_CATEGORIES = [
  { label: "Essential fat", min: 10, max: 13, color: "#4FC3F7" },
  { label: "Athletic",      min: 14, max: 20, color: "#22c55e" },
  { label: "Fitness",       min: 21, max: 24, color: "#F9A825" },
  { label: "Average",       min: 25, max: 31, color: "#fb923c" },
  { label: "Obese",         min: 32, max: 100, color: "#FF6B6B" },
]

function getCategory(bf: number, male: boolean) {
  const cats = male ? MALE_CATEGORIES : FEMALE_CATEGORIES
  return cats.find(c => bf >= c.min && bf <= c.max) ?? cats[cats.length - 1]
}

export default function EmbedBodyFat() {
  const [gender, setGender] = useState("Male")
  const [unit, setUnit] = useState("Inches")
  const [feet, setFeet] = useState("5")
  const [inches, setInches] = useState("9")
  const [weight, setWeight] = useState("170")
  const [neck, setNeck] = useState("15")
  const [waist, setWaist] = useState("34")
  const [hip, setHip] = useState("40")
  const [result, setResult] = useState<{
    bf: number; fatMass: number; leanMass: number; category: typeof MALE_CATEGORIES[0]
  } | null>(null)

  function toInch(v: string) {
    const n = parseFloat(v) || 0
    return unit === "Centimeters" ? n / 2.54 : n
  }

  function calc() {
    const totalIn = (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0)
    const heightCm = totalIn * 2.54
    const weightLbs = parseFloat(weight) || 0
    const neckIn = toInch(neck)
    const waistIn = toInch(waist)
    const hipIn = toInch(hip)

    const neckCm = neckIn * 2.54
    const waistCm = waistIn * 2.54
    const hipCm = hipIn * 2.54
    const male = gender === "Male"

    let bf: number
    if (male) {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450
    }

    bf = Math.max(0, Math.min(60, bf))
    const fatMass = (bf / 100) * weightLbs
    const leanMass = weightLbs - fatMass
    const category = getCategory(bf, male)

    setResult({ bf, fatMass, leanMass, category })
  }

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        💪 Body Fat Calculator
      </h2>

      {/* Gender + Unit toggles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Gender</span>
          <div style={{ display: "flex", gap: 5 }}>
            {["Male", "Female"].map(g => (
              <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: gender === g ? "#e94560" : "#0f1923", color: gender === g ? "#fff" : "#a8a8b3", border: gender === g ? "none" : "1px solid #1e2d4a" }}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Units</span>
          <div style={{ display: "flex", gap: 5 }}>
            {["Inches", "Centimeters"].map(u => (
              <button key={u} onClick={() => setUnit(u)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: unit === u ? "#e94560" : "#0f1923", color: unit === u ? "#fff" : "#a8a8b3", border: unit === u ? "none" : "1px solid #1e2d4a" }}>
                {u === "Inches" ? "in" : "cm"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Height (ft)</span>
          <input type="number" min={3} max={8} value={feet} onChange={e => setFeet(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Height (in)</span>
          <input type="number" min={0} max={11} value={inches} onChange={e => setInches(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Weight (lbs)</span>
          <input type="number" min={50} value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Neck ({unit === "Inches" ? "in" : "cm"})</span>
          <input type="number" value={neck} onChange={e => setNeck(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Waist at navel ({unit === "Inches" ? "in" : "cm"})</span>
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)} style={inputStyle} />
        </label>
        {gender === "Female" && (
          <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Hip ({unit === "Inches" ? "in" : "cm"})</span>
            <input type="number" value={hip} onChange={e => setHip(e.target.value)} style={inputStyle} />
          </label>
        )}
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate Body Fat %
      </button>

      {result && (
        <>
          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: result.category.color }}>{result.bf.toFixed(1)}%</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: result.category.color }}>{result.category.label}</div>
            </div>
            {[
              { label: "Fat mass", val: `${result.fatMass.toFixed(1)} lbs` },
              { label: "Lean mass", val: `${result.leanMass.toFixed(1)} lbs` },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid #1e2d4a", fontSize: 13 }}>
                <span style={{ color: "#a8a8b3" }}>{r.label}</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Category bar */}
          <div style={{ display: "flex", gap: 3, marginBottom: 10, borderRadius: 4, overflow: "hidden" }}>
            {(gender === "Male" ? MALE_CATEGORIES : FEMALE_CATEGORIES).map(c => (
              <div
                key={c.label}
                title={c.label}
                style={{
                  flex: 1, height: 8,
                  background: c.label === result.category.label ? c.color : c.color + "44",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
        </>
      )}

      <p style={{ fontSize: 11, color: "#a8a8b3", marginBottom: 10, lineHeight: 1.5 }}>
        US Navy method estimate. Accurate to within 3-4%.
      </p>

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/health/bmi-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          BMI calculator → dayblip.com/health/bmi-calculator
        </a>
      </div>
    </div>
  )
}
