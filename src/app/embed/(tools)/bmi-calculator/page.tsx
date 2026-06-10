"use client"
import { useState } from "react"

function calcBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100
  return weightKg / (h * h)
}

function getCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "#4FC3F7" }
  if (bmi < 25)   return { label: "Normal weight", color: "#22c55e" }
  if (bmi < 30)   return { label: "Overweight", color: "#F9A825" }
  if (bmi < 35)   return { label: "Obese Class I", color: "#f97316" }
  if (bmi < 40)   return { label: "Obese Class II", color: "#ef4444" }
  return { label: "Obese Class III", color: "#dc2626" }
}

export default function EmbedBMICalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial")
  const [feet, setFeet] = useState("5")
  const [inches, setInches] = useState("9")
  const [lbs, setLbs] = useState("170")
  const [heightCm, setHeightCm] = useState("175")
  const [weightKg, setWeightKg] = useState("77")
  const [result, setResult] = useState<{ bmi: number; category: { label: string; color: string }; minLbs: number; maxLbs: number; heightCm: number } | null>(null)

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  function calc() {
    let wKg: number, hCm: number
    if (unit === "imperial") {
      hCm = ((parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0)) * 2.54
      wKg = (parseFloat(lbs) || 0) / 2.205
    } else {
      hCm = parseFloat(heightCm) || 0
      wKg = parseFloat(weightKg) || 0
    }
    const bmi = calcBMI(wKg, hCm)
    const h = hCm / 100
    const minKg = 18.5 * h * h
    const maxKg = 24.9 * h * h
    const minLbs = Math.round(minKg * 2.205)
    const maxLbs = Math.round(maxKg * 2.205)
    setResult({ bmi, category: getCategory(bmi), minLbs, maxLbs, heightCm: hCm })
  }

  // BMI scale bar — range 15 to 45
  const BMI_MIN = 15, BMI_MAX = 45
  const markerPct = result ? Math.min(100, Math.max(0, ((result.bmi - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100)) : null

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        ⚖️ BMI Calculator
      </h2>

      {/* Unit toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {(["imperial", "metric"] as const).map(u => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: unit === u ? "#e94560" : "#0f1923",
              color: unit === u ? "#fff" : "#a8a8b3",
              border: unit === u ? "none" : "1px solid #1e2d4a",
              textTransform: "capitalize",
            }}
          >
            {u}
          </button>
        ))}
      </div>

      {unit === "imperial" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Height (ft)</span>
            <input type="number" min={3} max={8} value={feet} onChange={e => setFeet(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Height (in)</span>
            <input type="number" min={0} max={11} value={inches} onChange={e => setInches(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Weight (lbs)</span>
            <input type="number" min={50} value={lbs} onChange={e => setLbs(e.target.value)} style={inputStyle} />
          </label>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Height (cm)</span>
            <input type="number" min={100} max={250} value={heightCm} onChange={e => setHeightCm(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Weight (kg)</span>
            <input type="number" min={20} value={weightKg} onChange={e => setWeightKg(e.target.value)} style={inputStyle} />
          </label>
        </div>
      )}

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate BMI
      </button>

      {result && (
        <>
          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: result.category.color }}>{result.bmi.toFixed(1)}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: result.category.color, alignSelf: "center" }}>{result.category.label}</span>
            </div>

            {/* BMI scale bar */}
            <div style={{ position: "relative", height: 12, borderRadius: 6, overflow: "visible", marginBottom: 16, marginTop: 8 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: "linear-gradient(to right, #4FC3F7 0%, #22c55e 20%, #F9A825 45%, #f97316 65%, #ef4444 80%, #dc2626 100%)" }} />
              {markerPct !== null && (
                <div style={{
                  position: "absolute", top: -3, width: 18, height: 18, borderRadius: "50%",
                  background: "#fff", border: `3px solid ${result.category.color}`,
                  left: `calc(${markerPct}% - 9px)`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
                }} />
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#a8a8b3", marginBottom: 12 }}>
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40+</span>
            </div>

            <div style={{ fontSize: 13, color: "#a8a8b3", borderTop: "1px solid #1e2d4a", paddingTop: 10 }}>
              Healthy weight for your height:{" "}
              <span style={{ color: "#22c55e", fontWeight: 600 }}>{result.minLbs}–{result.maxLbs} lbs</span>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "#a8a8b3", marginBottom: 10, lineHeight: 1.5 }}>
            BMI does not account for muscle mass. Consult a healthcare provider for a complete assessment.
          </div>
        </>
      )}

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/health/body-fat" target="_blank" rel="noopener noreferrer" style={{ color: "#a8a8b3", textDecoration: "none" }}>
          Body fat calculator → dayblip.com/health/body-fat
        </a>
      </div>
    </div>
  )
}
