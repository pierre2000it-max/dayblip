"use client"
import { useState } from "react"
import { STANDARD_DEDUCTION, federalTax, medicareTax, socialSecurityTax } from "@/lib/tax2026"
import { STATE_TAX, stateIncomeTax, stateLabel } from "@/lib/stateTax"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function EmbedTakeHomePay() {
  const [salary, setSalary] = useState("75000")
  const [state, setState] = useState("TX")
  const [married, setMarried] = useState(false)
  const [result, setResult] = useState<{
    takeHome: number; monthly: number; federal: number; stateTax: number; fica: number; effectiveRate: number
  } | null>(null)

  function calc() {
    const s = parseFloat(salary) || 0
    const filing = married ? "mfj" : "single"
    const federal = federalTax(Math.max(0, s - STANDARD_DEDUCTION[filing]), filing)
    const stateTax = stateIncomeTax(state, s, filing)
    const fica = socialSecurityTax(s) + medicareTax(s)
    const takeHome = s - federal - stateTax - fica
    const monthly = takeHome / 12
    const effectiveRate = s > 0 ? ((federal + stateTax + fica) / s) * 100 : 0
    setResult({ takeHome, monthly, federal, stateTax, fica, effectiveRate })
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box",
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        💼 Take-Home Pay Calculator
      </h2>
      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Annual salary ($)</span>
          <input type="number" value={salary} onChange={e => setSalary(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>State</span>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            style={{ ...inputStyle, appearance: "none" }}
          >
            {STATE_TAX.map(st => (
              <option key={st.code} value={st.code}>{stateLabel(st)}</option>
            ))}
          </select>
        </label>
        <div>
          <span style={{ fontSize: 12, color: "#a8a8b3", display: "block", marginBottom: 6 }}>Filing status</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ label: "Single", val: false }, { label: "Married", val: true }].map(opt => (
              <button
                key={opt.label}
                onClick={() => setMarried(opt.val)}
                style={{
                  flex: 1, padding: "8px", borderRadius: 6, border: "1px solid",
                  borderColor: married === opt.val ? "#e94560" : "#1e2d4a",
                  background: married === opt.val ? "#e94560" : "#0f1923",
                  color: "#fff", cursor: "pointer", fontSize: 13,
                  fontWeight: married === opt.val ? 600 : 400,
                }}
              >
                {opt.label}
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
            { label: "Annual take-home", val: fmt(result.takeHome) },
            { label: "Monthly take-home", val: fmt(result.monthly) },
            { label: "Federal tax", val: fmt(result.federal) },
            { label: "State tax", val: fmt(result.stateTax) },
            { label: "FICA (Social Security + Medicare)", val: fmt(result.fica) },
            { label: "Effective tax rate", val: result.effectiveRate.toFixed(1) + "%" },
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
