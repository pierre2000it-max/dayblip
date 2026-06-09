"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const QUICK_TIPS = [15, 18, 20, 25]

export default function EmbedTipCalculator() {
  const [bill, setBill] = useState("85")
  const [tipPct, setTipPct] = useState(20)
  const [people, setPeople] = useState("4")

  const billNum = parseFloat(bill) || 0
  const peopleNum = Math.max(1, parseInt(people) || 1)
  const tipAmount = billNum * (tipPct / 100)
  const total = billNum + tipAmount
  const tipPerPerson = tipAmount / peopleNum
  const totalPerPerson = total / peopleNum

  const inputStyle = {
    padding: "9px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        🍽️ Tip Calculator
      </h2>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Bill amount ($)</span>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} style={inputStyle} />
        </label>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Tip percentage</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F9A825" }}>{tipPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={tipPct}
            onChange={e => setTipPct(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#e94560", marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            {QUICK_TIPS.map(t => (
              <button
                key={t}
                onClick={() => setTipPct(t)}
                style={{
                  flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: tipPct === t ? "#e94560" : "#16213e",
                  color: tipPct === t ? "#fff" : "#a8a8b3",
                  border: tipPct === t ? "none" : "1px solid #1e2d4a",
                }}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Number of people</span>
          <input type="number" min={1} value={people} onChange={e => setPeople(e.target.value)} style={inputStyle} />
        </label>
      </div>

      <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 12 }}>
        {[
          { label: "Tip amount", val: fmt(tipAmount) },
          { label: "Total with tip", val: fmt(total) },
          { label: `Per person (tip)`, val: fmt(tipPerPerson) },
          { label: `Per person (total)`, val: fmt(totalPerPerson) },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 14 }}>
            <span style={{ color: "#a8a8b3" }}>{r.label}</span>
            <span style={{ color: "#F9A825", fontWeight: 600 }}>{r.val}</span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: "#a8a8b3" }}>
        <a href="https://www.dayblip.com/tools/tip-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Tip tax info for 2026 → dayblip.com/tools/tip-calculator
        </a>
      </div>
    </div>
  )
}
