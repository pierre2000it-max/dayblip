"use client"
import { useState } from "react"

const ACTIVITY_OPTIONS = [
  { label: "Sedentary (+0 oz)", add: 0 },
  { label: "Lightly active (+12 oz)", add: 12 },
  { label: "Moderately active (+24 oz)", add: 24 },
  { label: "Very active (+36 oz)", add: 36 },
]

const CLIMATE_OPTIONS = [
  { label: "Cool or temperate (+0 oz)", add: 0 },
  { label: "Hot or humid (+16 oz)", add: 16 },
  { label: "Very hot (+32 oz)", add: 32 },
]

export default function EmbedWaterIntake() {
  const [weight, setWeight] = useState("160")
  const [activityLabel, setActivityLabel] = useState("Sedentary (+0 oz)")
  const [climateLabel, setClimateLabel] = useState("Cool or temperate (+0 oz)")
  const [pregnant, setPregnant] = useState(false)
  const [breastfeeding, setBreastfeeding] = useState(false)
  const [result, setResult] = useState<{
    total: number; cups: number; liters: number; fromBeverages: number;
    base: number; activityAdd: number; climateAdd: number;
    pregnancyAdd: number; breastfeedingAdd: number;
  } | null>(null)

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  function calc() {
    const w = parseFloat(weight) || 0
    const base = w * 0.67
    const activityAdd = ACTIVITY_OPTIONS.find(a => a.label === activityLabel)?.add ?? 0
    const climateAdd = CLIMATE_OPTIONS.find(c => c.label === climateLabel)?.add ?? 0
    const pregnancyAdd = pregnant ? 24 : 0
    const breastfeedingAdd = breastfeeding ? 32 : 0
    const total = base + activityAdd + climateAdd + pregnancyAdd + breastfeedingAdd
    const cups = total / 8
    const liters = total / 33.8
    const fromBeverages = total * 0.8
    setResult({ total, cups, liters, fromBeverages, base, activityAdd, climateAdd, pregnancyAdd, breastfeedingAdd })
  }

  const fillPct = result ? Math.min(100, (result.total / 128) * 100) : 0

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        💧 Daily Water Intake Calculator
      </h2>

      <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Weight (lbs)</span>
          <input type="number" min={50} max={400} value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Activity level</span>
          <select value={activityLabel} onChange={e => setActivityLabel(e.target.value)} style={inputStyle}>
            {ACTIVITY_OPTIONS.map(a => <option key={a.label}>{a.label}</option>)}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Climate</span>
          <select value={climateLabel} onChange={e => setClimateLabel(e.target.value)} style={inputStyle}>
            {CLIMATE_OPTIONS.map(c => <option key={c.label}>{c.label}</option>)}
          </select>
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3", display: "block", marginBottom: 6 }}>Pregnant</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["No", "Yes"].map(v => (
                <button
                  key={v}
                  onClick={() => setPregnant(v === "Yes")}
                  style={{
                    flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: (pregnant ? "Yes" : "No") === v ? "#e94560" : "#0f1923",
                    color: (pregnant ? "Yes" : "No") === v ? "#fff" : "#a8a8b3",
                    border: (pregnant ? "Yes" : "No") === v ? "none" : "1px solid #1e2d4a",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3", display: "block", marginBottom: 6 }}>Breastfeeding</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["No", "Yes"].map(v => (
                <button
                  key={v}
                  onClick={() => setBreastfeeding(v === "Yes")}
                  style={{
                    flex: 1, padding: "7px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: (breastfeeding ? "Yes" : "No") === v ? "#e94560" : "#0f1923",
                    color: (breastfeeding ? "Yes" : "No") === v ? "#fff" : "#a8a8b3",
                    border: (breastfeeding ? "Yes" : "No") === v ? "none" : "1px solid #1e2d4a",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate
      </button>

      {result && (
        <>
          {/* Water glass visual */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <div style={{ position: "relative", width: 48, height: 64, border: "2px solid #4FC3F7", borderRadius: "0 0 6px 6px", overflow: "hidden", flexShrink: 0 }}>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: `${fillPct}%`,
                background: "linear-gradient(to top, #1a6fa8, #4FC3F7)",
                transition: "height 0.3s ease"
              }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#4FC3F7" }}>{Math.round(result.total)} oz</div>
              <div style={{ fontSize: 13, color: "#a8a8b3" }}>{result.cups.toFixed(1)} cups · {result.liters.toFixed(1)} liters</div>
              <div style={{ fontSize: 12, color: "#a8a8b3" }}>From beverages: {Math.round(result.fromBeverages)} oz</div>
            </div>
          </div>

          <div style={{ background: "#16213e", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#a8a8b3", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Breakdown</div>
            {[
              { label: "Base amount", val: Math.round(result.base) },
              { label: "Activity", val: result.activityAdd, prefix: "+" },
              { label: "Climate", val: result.climateAdd, prefix: "+" },
              ...(result.pregnancyAdd ? [{ label: "Pregnancy", val: result.pregnancyAdd, prefix: "+" }] : []),
              ...(result.breastfeedingAdd ? [{ label: "Breastfeeding", val: result.breastfeedingAdd, prefix: "+" }] : []),
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ color: "#a8a8b3" }}>{r.label}</span>
                <span style={{ color: "#fff" }}>{r.prefix || ""}{r.val} oz</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px solid #1e2d4a", paddingTop: 6, marginTop: 4 }}>
              <span style={{ color: "#fff", fontWeight: 600 }}>Total</span>
              <span style={{ color: "#4FC3F7", fontWeight: 700 }}>{Math.round(result.total)} oz</span>
            </div>
          </div>
        </>
      )}

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/health/calorie-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#a8a8b3", textDecoration: "none" }}>
          Calorie calculator → dayblip.com/health/calorie-calculator
        </a>
      </div>
    </div>
  )
}
