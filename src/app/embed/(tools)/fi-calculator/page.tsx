"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function EmbedFiCalculator() {
  const [expenses, setExpenses] = useState("50000")
  const [savings, setSavings] = useState("50000")
  const [monthly, setMonthly] = useState("1000")
  const [retRate, setRetRate] = useState("7")
  const [result, setResult] = useState<{ fiNumber: number; stillNeeded: number; years: number; monthlyPassive: number } | null>(null)

  function calc() {
    const e = parseFloat(expenses) || 0
    const s = parseFloat(savings) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(retRate) || 0) / 100 / 12
    const fiNumber = e / 0.04
    let portfolio = s
    let months = 0
    while (portfolio < fiNumber && months < 600) {
      portfolio = portfolio * (1 + r) + m
      months++
    }
    setResult({
      fiNumber,
      stillNeeded: Math.max(0, fiNumber - s),
      years: parseFloat((months / 12).toFixed(1)),
      monthlyPassive: fiNumber * 0.04 / 12,
    })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        🆓 Financial Independence Calculator
      </h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Annual expenses ($)", val: expenses, set: setExpenses },
          { label: "Current savings ($)", val: savings, set: setSavings },
          { label: "Monthly investment ($)", val: monthly, set: setMonthly },
          { label: "Annual return (%)", val: retRate, set: setRetRate },
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
            { label: "FI number needed", val: fmt(result.fiNumber) },
            { label: "Still needed", val: fmt(result.stillNeeded) },
            { label: "Years to FI", val: result.years.toFixed(1) + " years" },
            { label: "Monthly passive income at FI", val: fmt(result.monthlyPassive) },
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
