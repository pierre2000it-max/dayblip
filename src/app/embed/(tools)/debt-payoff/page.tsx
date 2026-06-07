"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function EmbedDebtPayoff() {
  const [debt, setDebt] = useState("15000")
  const [rate, setRate] = useState("19.99")
  const [payment, setPayment] = useState("300")
  const [result, setResult] = useState<{ months: number; years: number; rem: number; totalInterest: number; totalPaid: number } | null>(null)
  const [error, setError] = useState("")

  function calc() {
    setError("")
    const d = parseFloat(debt) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const p = parseFloat(payment) || 0
    if (p <= d * r) { setError("Monthly payment is too low to cover interest. Increase your payment."); return }
    let balance = d
    let months = 0
    let totalInterest = 0
    while (balance > 0 && months < 600) {
      const interest = balance * r
      totalInterest += interest
      balance = balance + interest - p
      if (balance < 0) balance = 0
      months++
    }
    setResult({ months, years: Math.floor(months / 12), rem: months % 12, totalInterest, totalPaid: d + totalInterest })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        💳 Debt Payoff Calculator
      </h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Total debt ($)", val: debt, set: setDebt },
          { label: "Interest rate (%)", val: rate, set: setRate },
          { label: "Monthly payment ($)", val: payment, set: setPayment },
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
      {error && <p style={{ color: "#e94560", fontSize: 13, marginBottom: 8 }}>{error}</p>}
      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 16 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#e94560" }}>
              {result.years}y {result.rem}m payoff
            </div>
          </div>
          {[
            { label: "Total interest paid", val: fmt(result.totalInterest) },
            { label: "Total amount paid", val: fmt(result.totalPaid) },
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
