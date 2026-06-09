"use client"
import { useState } from "react"

const ACTIVITY_LEVELS = [
  { label: "Sedentary (desk job)", multiplier: 1.2 },
  { label: "Lightly active (1-3 days/week)", multiplier: 1.375 },
  { label: "Moderately active (3-5 days)", multiplier: 1.55 },
  { label: "Very active (6-7 days)", multiplier: 1.725 },
  { label: "Extra active (physical job)", multiplier: 1.9 },
]

const GOALS = [
  { label: "Lose weight (-500 cal)", adjustment: -500 },
  { label: "Maintain weight", adjustment: 0 },
  { label: "Gain muscle (+300 cal)", adjustment: 300 },
]

export default function EmbedCalorieCalculator() {
  const [age, setAge] = useState("30")
  const [gender, setGender] = useState("Male")
  const [feet, setFeet] = useState("5")
  const [inches, setInches] = useState("9")
  const [weight, setWeight] = useState("170")
  const [activityLabel, setActivityLabel] = useState("Moderately active (3-5 days)")
  const [goalLabel, setGoalLabel] = useState("Maintain weight")
  const [result, setResult] = useState<{ bmr: number; tdee: number; goal: number } | null>(null)

  function calc() {
    const ageNum = parseFloat(age) || 0
    const totalInches = (parseFloat(feet) || 0) * 12 + (parseFloat(inches) || 0)
    const heightCm = totalInches * 2.54
    const weightKg = (parseFloat(weight) || 0) / 2.205

    let bmr: number
    if (gender === "Male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161
    }

    const activity = ACTIVITY_LEVELS.find(a => a.label === activityLabel) ?? ACTIVITY_LEVELS[2]
    const goal = GOALS.find(g => g.label === goalLabel) ?? GOALS[1]

    const tdee = bmr * activity.multiplier
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), goal: Math.round(tdee + goal.adjustment) })
  }

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        🔥 Calorie Calculator
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Age (years)</span>
          <input type="number" min={15} max={80} value={age} onChange={e => setAge(e.target.value)} style={inputStyle} />
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Gender</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["Male", "Female"].map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: gender === g ? "#e94560" : "#0f1923",
                  color: gender === g ? "#fff" : "#a8a8b3",
                  border: gender === g ? "none" : "1px solid #1e2d4a",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

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

        <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Activity level</span>
          <select value={activityLabel} onChange={e => setActivityLabel(e.target.value)} style={inputStyle}>
            {ACTIVITY_LEVELS.map(a => <option key={a.label}>{a.label}</option>)}
          </select>
        </label>

        <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Goal</span>
          <select value={goalLabel} onChange={e => setGoalLabel(e.target.value)} style={inputStyle}>
            {GOALS.map(g => <option key={g.label}>{g.label}</option>)}
          </select>
        </label>
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate Calories
      </button>

      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 14 }}>
            <span style={{ color: "#a8a8b3" }}>Goal calories</span>
            <span style={{ color: "#F9A825", fontWeight: 700, fontSize: 18 }}>{result.goal.toLocaleString()} cal/day</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 13 }}>
            <span style={{ color: "#a8a8b3" }}>Maintenance calories</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>{result.tdee.toLocaleString()} cal/day</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
            <span style={{ color: "#a8a8b3" }}>Basal metabolic rate</span>
            <span style={{ color: "#a8a8b3", fontWeight: 600 }}>{result.bmr.toLocaleString()} cal/day</span>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/health/macro-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Macro calculator → dayblip.com/health/macro-calculator
        </a>
      </div>
    </div>
  )
}
