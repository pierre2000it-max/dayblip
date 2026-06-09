"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const PERIODS: { label: string; n: number }[] = [
  { label: "Weekly (52)", n: 52 },
  { label: "Biweekly (26)", n: 26 },
  { label: "Semi-monthly (24)", n: 24 },
  { label: "Monthly (12)", n: 12 },
]

const NO_TAX_STATES = new Set(["AK","FL","NH","NV","SD","TN","TX","WA","WY"])
const STATE_RATES: Record<string, number> = {
  CA: 0.093, NY: 0.0685, IL: 0.0495,
}

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
]

const BRACKETS_SINGLE = [
  { max: 11925,    rate: 0.10 },
  { max: 48475,    rate: 0.12 },
  { max: 103350,   rate: 0.22 },
  { max: 197300,   rate: 0.24 },
  { max: Infinity, rate: 0.32 },
]

function annualFederalTax(taxable: number, married: boolean): number {
  const m = married ? 2 : 1
  let tax = 0
  let prev = 0
  for (const { max, rate } of BRACKETS_SINGLE) {
    const bracketMax = max * m
    if (taxable <= prev) break
    tax += (Math.min(taxable, bracketMax) - prev) * rate
    prev = bracketMax
  }
  return tax
}

export default function EmbedPaycheckCalculator() {
  const [salary, setSalary] = useState("75000")
  const [periodLabel, setPeriodLabel] = useState("Biweekly (26)")
  const [filingStatus, setFilingStatus] = useState("Single")
  const [state, setState] = useState("TX")
  const [k401, setK401] = useState("0")
  const [health, setHealth] = useState("0")
  const [result, setResult] = useState<{
    gross: number; federal: number; state: number; fica: number
    k401: number; health: number; net: number; annualNet: number
  } | null>(null)

  function calc() {
    const annualSalary = parseFloat(salary) || 0
    const period = PERIODS.find(p => p.label === periodLabel) ?? PERIODS[1]
    const perK401 = parseFloat(k401) || 0
    const perHealth = parseFloat(health) || 0
    const married = filingStatus === "Married"

    const grossPerCheck = annualSalary / period.n
    const annualK401 = perK401 * period.n
    const annualHealth = perHealth * period.n
    const federalTaxable = Math.max(0, annualSalary - annualK401 - annualHealth)

    const annualFederal = annualFederalTax(federalTaxable, married)
    const federalPerCheck = annualFederal / period.n

    const stateRate = NO_TAX_STATES.has(state) ? 0 : (STATE_RATES[state] ?? 0.05)
    const statePerCheck = (federalTaxable / period.n) * stateRate

    const ficaPerCheck = grossPerCheck * 0.0765
    const netPerCheck = grossPerCheck - federalPerCheck - statePerCheck - ficaPerCheck - perK401 - perHealth

    setResult({
      gross: grossPerCheck,
      federal: federalPerCheck,
      state: statePerCheck,
      fica: ficaPerCheck,
      k401: perK401,
      health: perHealth,
      net: netPerCheck,
      annualNet: netPerCheck * period.n,
    })
  }

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        💵 Paycheck Calculator 2026
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Annual salary ($)</span>
          <input type="number" value={salary} onChange={e => setSalary(e.target.value)} style={inputStyle} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Pay frequency</span>
          <select value={periodLabel} onChange={e => setPeriodLabel(e.target.value)} style={inputStyle}>
            {PERIODS.map(p => <option key={p.label}>{p.label}</option>)}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Filing status</span>
          <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={inputStyle}>
            <option>Single</option>
            <option>Married</option>
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>State</span>
          <select value={state} onChange={e => setState(e.target.value)} style={inputStyle}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>401k per check ($)</span>
          <input type="number" min={0} value={k401} onChange={e => setK401(e.target.value)} style={inputStyle} />
        </label>

        <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Health insurance per check ($)</span>
          <input type="number" min={0} value={health} onChange={e => setHealth(e.target.value)} style={inputStyle} />
        </label>
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate Net Pay
      </button>

      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 12 }}>
          {[
            { label: "Gross per paycheck", val: fmt(result.gross), color: "#fff" },
            { label: "Federal tax", val: `−${fmt(result.federal)}`, color: "#FF6B6B" },
            { label: "State tax", val: `−${fmt(result.state)}`, color: "#FF6B6B" },
            { label: "FICA (SS + Medicare)", val: `−${fmt(result.fica)}`, color: "#FF6B6B" },
            ...(result.k401 > 0 ? [{ label: "401k", val: `−${fmt(result.k401)}`, color: "#4FC3F7" }] : []),
            ...(result.health > 0 ? [{ label: "Health insurance", val: `−${fmt(result.health)}`, color: "#4FC3F7" }] : []),
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e2d4a", fontSize: 13 }}>
              <span style={{ color: "#a8a8b3" }}>{r.label}</span>
              <span style={{ color: r.color, fontWeight: 600 }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", fontSize: 15 }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>Net paycheck ✅</span>
            <span style={{ color: "#F9A825", fontWeight: 700 }}>{fmt(result.net)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 0", fontSize: 12 }}>
            <span style={{ color: "#a8a8b3" }}>Annual net</span>
            <span style={{ color: "#a8a8b3", fontWeight: 600 }}>{fmt(result.annualNet)}</span>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11, color: "#a8a8b3" }}>
        <a href="https://www.dayblip.com/finance/paycheck-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Full paycheck calculator → dayblip.com/finance/paycheck-calculator
        </a>
      </div>
    </div>
  )
}
