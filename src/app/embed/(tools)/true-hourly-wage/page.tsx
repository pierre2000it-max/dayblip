"use client"
import { useState } from "react"

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function EmbedTrueHourlyWage() {
  const [salary, setSalary] = useState("75000")
  const [miles, setMiles] = useState("15")
  const [lunchDays, setLunchDays] = useState("3")
  const [lunchCost, setLunchCost] = useState("15")
  const [homeLunch, setHomeLunch] = useState("5")
  const [result, setResult] = useState<{
    officialHourly: number; trueHourly: number; difference: number; pctLess: number
  } | null>(null)

  function calc() {
    const s = parseFloat(salary) || 0
    const m = parseFloat(miles) || 0
    const ld = parseFloat(lunchDays) || 0
    const lc = parseFloat(lunchCost) || 0
    const hl = parseFloat(homeLunch) || 0

    const officialHourly = s / 2080
    const commuteHoursPerYear = (m * 2 / 30) * 250
    const lunchExtraCost = (lc - hl) * ld * 52
    const commuteCost = (m * 2 / 28 * 3.50) * 250
    const totalExtraCost = lunchExtraCost + commuteCost
    const trueHourly = (s - totalExtraCost) / (2080 + commuteHoursPerYear)
    const difference = officialHourly - trueHourly
    const pctLess = difference / officialHourly * 100

    setResult({ officialHourly, trueHourly, difference, pctLess })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        ⏰ True Hourly Wage Calculator
      </h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Annual salary ($)", val: salary, set: setSalary },
          { label: "Daily commute miles (each way)", val: miles, set: setMiles },
          { label: "Work lunches per week", val: lunchDays, set: setLunchDays },
          { label: "Average lunch cost ($)", val: lunchCost, set: setLunchCost },
          { label: "Home lunch cost ($)", val: homeLunch, set: setHomeLunch },
        ].map(f => (
          <label key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>{f.label}</span>
            <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
              style={{ padding: "10px 12px", background: "#0f1923", border: "1px solid #1e2d4a", borderRadius: 6, color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" as const }} />
          </label>
        ))}
      </div>
      <button onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 16 }}>
        Calculate
      </button>
      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 16 }}>
          {[
            { label: "Official hourly rate", val: fmt(result.officialHourly) },
            { label: "True hourly rate", val: fmt(result.trueHourly) },
            { label: "You earn less per hour", val: fmt(result.difference) },
            { label: "That is less than stated", val: result.pctLess.toFixed(1) + "%" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 14 }}>
              <span style={{ color: "#a8a8b3" }}>{r.label}</span>
              <span style={{ color: "#F9A825", fontWeight: 600 }}>{r.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
