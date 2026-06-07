"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function EmbedMortgage() {
  const [price, setPrice] = useState("300000")
  const [down, setDown] = useState("20")
  const [rate, setRate] = useState("7.0")
  const [term, setTerm] = useState<15 | 30>(30)
  const [result, setResult] = useState<{ monthly: number; totalInterest: number; totalPaid: number; loanAmount: number } | null>(null)

  function calc() {
    const p = parseFloat(price) || 0
    const d = parseFloat(down) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const n = term * 12
    const loanAmount = p * (1 - d / 100)
    const monthly = r === 0
      ? loanAmount / n
      : loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPaid = monthly * n
    const totalInterest = totalPaid - loanAmount
    setResult({ monthly, totalInterest, totalPaid, loanAmount })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        🏠 Mortgage Calculator
      </h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Home price ($)", val: price, set: setPrice },
          { label: "Down payment (%)", val: down, set: setDown },
          { label: "Interest rate (%)", val: rate, set: setRate },
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
        <div>
          <span style={{ fontSize: 12, color: "#a8a8b3", display: "block", marginBottom: 6 }}>Loan term</span>
          <div style={{ display: "flex", gap: 8 }}>
            {([15, 30] as const).map(t => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid", borderColor: term === t ? "#e94560" : "#1e2d4a", background: term === t ? "#e94560" : "#0f1923", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: term === t ? 600 : 400 }}
              >
                {t} years
              </button>
            ))}
          </div>
        </div>
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
            { label: "Monthly payment", val: fmt(result.monthly) },
            { label: "Total interest", val: fmt(result.totalInterest) },
            { label: "Total amount paid", val: fmt(result.totalPaid) },
            { label: "Loan amount", val: fmt(result.loanAmount) },
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
