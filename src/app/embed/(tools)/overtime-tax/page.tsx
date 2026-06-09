"use client"
import { useState } from "react"

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

// 2026 federal tax brackets (single). Married doubles thresholds.
const BRACKETS_SINGLE = [
  { max: 11925,  rate: 0.10 },
  { max: 48475,  rate: 0.12 },
  { max: 103350, rate: 0.22 },
  { max: 197300, rate: 0.24 },
  { max: Infinity, rate: 0.32 },
]

function federalTax(taxableIncome: number, married: boolean): number {
  const multiplier = married ? 2 : 1
  let tax = 0
  let prev = 0
  for (const { max, rate } of BRACKETS_SINGLE) {
    const bracketMax = max * multiplier
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, bracketMax) - prev
    tax += taxable * rate
    prev = bracketMax
  }
  return tax
}

export default function EmbedOvertimeTax() {
  const [hourlyRate, setHourlyRate] = useState("20")
  const [hoursPerWeek, setHoursPerWeek] = useState("10")
  const [weeksPerYear, setWeeksPerYear] = useState("20")
  const [filingStatus, setFilingStatus] = useState("Single")
  const [regularIncome, setRegularIncome] = useState("50000")
  const [result, setResult] = useState<{
    overtimePremium: number
    deductibleAmount: number
    taxSavings: number
    effectiveRate: number
  } | null>(null)

  function calc() {
    const rate = parseFloat(hourlyRate) || 0
    const hours = parseFloat(hoursPerWeek) || 0
    const weeks = parseFloat(weeksPerYear) || 0
    const baseIncome = parseFloat(regularIncome) || 0
    const married = filingStatus === "Married Joint"

    const overtimeGross = rate * 1.5 * hours * weeks
    const overtimePremium = rate * 0.5 * hours * weeks

    const totalIncome = baseIncome + overtimeGross
    const deductionCap = married ? 25000 : 12500
    const deductibleAmount = Math.min(overtimePremium, deductionCap)

    const taxWithout = federalTax(totalIncome, married)
    const taxWith = federalTax(totalIncome - deductibleAmount, married)
    const taxSavings = taxWithout - taxWith

    const effectiveRate = overtimeGross > 0 ? ((taxWithout - taxSavings) / overtimeGross) * 100 : 0

    setResult({ overtimePremium, deductibleAmount, taxSavings, effectiveRate })
  }

  const inputStyle = {
    padding: "9px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        🏛️ No Tax on Overtime 2026
      </h2>

      <div style={{ display: "grid", gap: 9, marginBottom: 12 }}>
        {[
          { label: "Regular hourly rate ($)", val: hourlyRate, set: setHourlyRate },
          { label: "Overtime hours per week", val: hoursPerWeek, set: setHoursPerWeek },
          { label: "Weeks of overtime per year", val: weeksPerYear, set: setWeeksPerYear },
          { label: "Annual regular income ($)", val: regularIncome, set: setRegularIncome },
        ].map(f => (
          <label key={f.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>{f.label}</span>
            <input type="number" value={f.val} onChange={e => f.set(e.target.value)} style={inputStyle} />
          </label>
        ))}

        <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Filing status</span>
          <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} style={inputStyle}>
            <option>Single</option>
            <option>Married Joint</option>
          </select>
        </label>
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate Tax Savings
      </button>

      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 12 }}>
          {[
            { label: "Overtime premium earned", val: fmt(result.overtimePremium), color: "#fff" },
            { label: "Deductible amount", val: fmt(result.deductibleAmount), color: "#4FC3F7" },
            { label: "Federal tax savings 🎉", val: fmt(result.taxSavings), color: "#F9A825" },
            { label: "Effective tax rate on overtime", val: `${result.effectiveRate.toFixed(1)}%`, color: "#a8a8b3" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 13 }}>
              <span style={{ color: "#a8a8b3" }}>{r.label}</span>
              <span style={{ color: r.color, fontWeight: 600 }}>{r.val}</span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: "#a8a8b3", marginBottom: 10, lineHeight: 1.5 }}>
        Estimate only. FICA taxes still apply. Consult a tax professional.
      </p>

      <div style={{ textAlign: "center", fontSize: 11, color: "#a8a8b3" }}>
        <a href="https://www.dayblip.com/finance/overtime-tax" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Full calculator → dayblip.com/finance/overtime-tax
        </a>
      </div>
    </div>
  )
}
