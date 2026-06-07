"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function EmbedCompoundInterest() {
  const [principal, setPrincipal] = useState("10000")
  const [monthly, setMonthly] = useState("500")
  const [rate, setRate] = useState("7")
  const [years, setYears] = useState("30")
  const [result, setResult] = useState<{ fv: number; contributed: number; growth: number } | null>(null)

  function calc() {
    const p = parseFloat(principal) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const n = (parseFloat(years) || 0) * 12
    const fv = r === 0
      ? p + m * n
      : p * Math.pow(1 + r, n) + m * ((Math.pow(1 + r, n) - 1) / r)
    const contributed = p + m * n
    const growth = fv - contributed
    setResult({ fv, contributed, growth })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        💹 Compound Interest Calculator
      </h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Starting amount ($)", val: principal, set: setPrincipal },
          { label: "Monthly addition ($)", val: monthly, set: setMonthly },
          { label: "Annual return (%)", val: rate, set: setRate },
          { label: "Years", val: years, set: setYears },
        ].map(f => (
          <label key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>{f.label}</span>
            <input
              type="number"
              value={f.val}
              onChange={e => f.set(e.target.value)}
              style={{ padding: "10px 12px", background: "#0f1923", border: "1px solid #1e2d4a", borderRadius: 6, color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </label>
        ))}
      </div>
      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 16 }}
      >
        Calculate
      </button>
      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 16 }}>
          {[
            { label: "Final value", val: fmt(result.fv) },
            { label: "Total contributed", val: fmt(result.contributed) },
            { label: "Total growth", val: fmt(result.growth) },
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
