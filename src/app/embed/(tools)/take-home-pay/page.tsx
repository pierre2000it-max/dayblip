"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

const STATE_TAX: Record<string, number> = {
  TX: 0, FL: 0, NV: 0, WA: 0, SD: 0, WY: 0, AK: 0, NH: 0, TN: 0,
  CA: 0.093, NY: 0.0685, IL: 0.0495, MA: 0.05, NJ: 0.0637,
  OH: 0.0399, PA: 0.0307, GA: 0.0549, NC: 0.0475, VA: 0.0575,
  MI: 0.0425, MN: 0.0785, CO: 0.044, OR: 0.0875, WI: 0.0765,
}

const STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"],
  ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
  ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
  ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
  ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"],
]

const BRACKETS_SINGLE = [
  { limit: 11600, rate: 0.10 },
  { limit: 47150, rate: 0.12 },
  { limit: 100525, rate: 0.22 },
  { limit: 191950, rate: 0.24 },
  { limit: 243725, rate: 0.32 },
  { limit: 609350, rate: 0.35 },
  { limit: Infinity, rate: 0.37 },
]

function calcFederalTax(income: number, married: boolean): number {
  const multiplier = married ? 2 : 1
  const brackets = BRACKETS_SINGLE.map(b => ({ limit: b.limit * multiplier, rate: b.rate }))
  let tax = 0
  let prev = 0
  for (const bracket of brackets) {
    if (income <= prev) break
    const taxable = Math.min(income, bracket.limit) - prev
    tax += taxable * bracket.rate
    prev = bracket.limit
  }
  return tax
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
    const federal = calcFederalTax(s, married)
    const stateRate = STATE_TAX[state] ?? 0.05
    const stateTax = s * stateRate
    const fica = Math.min(s, 160200) * 0.0765 + Math.max(0, s - 160200) * 0.0145
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
            {STATES.map(([abbr, name]) => (
              <option key={abbr} value={abbr}>{name}</option>
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
