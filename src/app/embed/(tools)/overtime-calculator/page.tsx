"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function EmbedOvertimeCalculator() {
  const [rate, setRate] = useState("20")
  const [hours, setHours] = useState("50")
  const [multiplier, setMultiplier] = useState(1.5)
  const [result, setResult] = useState<{ regularHours: number; overtimeHours: number; overtimeRate: number; weeklyRegular: number; weeklyOvertime: number; weeklyTotal: number; annualOvertime: number } | null>(null)

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  function calc() {
    const hourlyRate = parseFloat(rate) || 0
    const hoursWorked = parseFloat(hours) || 0
    const regularHours = Math.min(hoursWorked, 40)
    const overtimeHours = Math.max(0, hoursWorked - 40)
    const overtimeRate = hourlyRate * multiplier
    const weeklyRegular = regularHours * hourlyRate
    const weeklyOvertime = overtimeHours * overtimeRate
    const weeklyTotal = weeklyRegular + weeklyOvertime
    const annualOvertime = weeklyOvertime * 52
    setResult({ regularHours, overtimeHours, overtimeRate, weeklyRegular, weeklyOvertime, weeklyTotal, annualOvertime })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        ⏱️ Overtime Pay Calculator
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Regular hourly rate ($)</span>
          <input type="number" min={0} step={0.01} value={rate} onChange={e => setRate(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Hours worked this week</span>
          <input type="number" min={0} max={168} value={hours} onChange={e => setHours(e.target.value)} style={inputStyle} />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#a8a8b3", display: "block", marginBottom: 6 }}>Overtime multiplier</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ label: "1.5x Time and a half", value: 1.5 }, { label: "2.0x Double time", value: 2.0 }].map(opt => (
            <button
              key={opt.value}
              onClick={() => setMultiplier(opt.value)}
              style={{
                flex: 1, padding: "8px 6px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: multiplier === opt.value ? "#e94560" : "#0f1923",
                color: multiplier === opt.value ? "#fff" : "#a8a8b3",
                border: multiplier === opt.value ? "none" : "1px solid #1e2d4a",
              }}
            >
              {opt.label}
            </button>
          ))}
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
          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: "#a8a8b3" }}>Regular rate</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{fmt(parseFloat(rate))}/hr</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12 }}>
              <span style={{ color: "#a8a8b3" }}>Overtime rate</span>
              <span style={{ color: "#F9A825", fontWeight: 600 }}>{fmt(result.overtimeRate)}/hr</span>
            </div>
            <div style={{ borderTop: "1px solid #1e2d4a", paddingTop: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: "#a8a8b3", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>This week</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: "#a8a8b3" }}>Regular ({result.regularHours} hrs)</span>
                <span style={{ color: "#fff" }}>{fmt(result.weeklyRegular)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "#a8a8b3" }}>Overtime ({result.overtimeHours} hrs)</span>
                <span style={{ color: "#F9A825", fontWeight: 600 }}>{fmt(result.weeklyOvertime)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, borderTop: "1px solid #1e2d4a", paddingTop: 8 }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>Total this week</span>
                <span style={{ color: "#F9A825", fontWeight: 700 }}>{fmt(result.weeklyTotal)}</span>
              </div>
            </div>
          </div>
          <div style={{ background: "#16213e", borderRadius: 8, padding: 12, marginBottom: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#a8a8b3", marginBottom: 2 }}>Annual overtime (52 weeks)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F9A825" }}>{fmt(result.annualOvertime)}</div>
          </div>
        </>
      )}

      <div style={{ marginBottom: 10, textAlign: "center" }}>
        <a href="https://www.dayblip.com/finance/overtime-tax" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
          See 2026 overtime tax savings → dayblip.com/finance/overtime-tax
        </a>
      </div>

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/finance/overtime-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#a8a8b3", textDecoration: "none" }}>
          Full calculator → dayblip.com/finance/overtime-calculator
        </a>
      </div>
    </div>
  )
}
