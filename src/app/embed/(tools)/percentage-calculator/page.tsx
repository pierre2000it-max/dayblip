"use client"
import { useState } from "react"

type Tab = 0 | 1 | 2

const TABS = ["X% of Y", "X is what % of Y", "% Change"]

function fmtN(n: number): string {
  if (!isFinite(n)) return "—"
  const abs = Math.abs(n)
  return abs >= 1000
    ? n.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : String(parseFloat(n.toFixed(4)))
}

export default function EmbedPercentageCalculator() {
  const [tab, setTab] = useState<Tab>(0)

  // Tab 0
  const [pct, setPct] = useState("20")
  const [ofNum, setOfNum] = useState("85")
  // Tab 1
  const [val, setVal] = useState("45")
  const [total, setTotal] = useState("200")
  // Tab 2
  const [fromVal, setFromVal] = useState("80")
  const [toVal, setToVal] = useState("100")

  const p0 = parseFloat(pct), n0 = parseFloat(ofNum)
  const res0 = isFinite(p0) && isFinite(n0) ? (p0 / 100) * n0 : null

  const v1 = parseFloat(val), t1 = parseFloat(total)
  const res1 = isFinite(v1) && isFinite(t1) && t1 !== 0 ? (v1 / t1) * 100 : null

  const f2 = parseFloat(fromVal), to2 = parseFloat(toVal)
  const res2 = isFinite(f2) && isFinite(to2) && f2 !== 0 ? ((to2 - f2) / f2) * 100 : null

  const inputStyle = {
    padding: "9px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        📊 Percentage Calculator
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1e2d4a", marginBottom: 16 }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i as Tab)}
            style={{
              flex: 1, padding: "8px 4px", background: "none", border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              color: tab === i ? "#e94560" : "#a8a8b3",
              borderBottom: tab === i ? "2px solid #e94560" : "2px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Percentage (%)</span>
              <input type="number" value={pct} onChange={e => setPct(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Of number</span>
              <input type="number" value={ofNum} onChange={e => setOfNum(e.target.value)} style={inputStyle} />
            </label>
          </div>
          {res0 !== null && (
            <div style={{ background: "#16213e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F9A825", marginBottom: 6 }}>
                {fmtN(p0)}% of {fmtN(n0)} = {fmtN(res0)}
              </div>
              <div style={{ fontSize: 13, color: "#a8a8b3" }}>
                {fmtN(res0)} is {fmtN(p0)}% of {fmtN(n0)}
              </div>
              <div style={{ fontSize: 11, color: "#a8a8b3", marginTop: 8 }}>
                Formula: {fmtN(n0)} × {fmtN(p0)} ÷ 100
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 1 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Value</span>
              <input type="number" value={val} onChange={e => setVal(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Of total</span>
              <input type="number" value={total} onChange={e => setTotal(e.target.value)} style={inputStyle} />
            </label>
          </div>
          {res1 !== null && (
            <div style={{ background: "#16213e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#F9A825", marginBottom: 6 }}>
                {fmtN(v1)} is {fmtN(res1)}% of {fmtN(t1)}
              </div>
              <div style={{ fontSize: 11, color: "#a8a8b3", marginTop: 8 }}>
                Formula: {fmtN(v1)} ÷ {fmtN(t1)} × 100
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 2 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>From value</span>
              <input type="number" value={fromVal} onChange={e => setFromVal(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>To value</span>
              <input type="number" value={toVal} onChange={e => setToVal(e.target.value)} style={inputStyle} />
            </label>
          </div>
          {res2 !== null && (
            <div style={{ background: "#16213e", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: res2 >= 0 ? "#4FC3F7" : "#FF6B6B" }}>
                {fmtN(f2)} to {fmtN(to2)} is a {fmtN(Math.abs(res2))}% {res2 >= 0 ? "INCREASE ↑" : "DECREASE ↓"}
              </div>
              <div style={{ fontSize: 11, color: "#a8a8b3", marginTop: 8 }}>
                Formula: ({fmtN(to2)} − {fmtN(f2)}) ÷ {fmtN(f2)} × 100
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11, marginTop: 14 }}>
        <a href="https://www.dayblip.com/tools/percentage-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          More percentage tools → dayblip.com/tools/percentage-calculator
        </a>
      </div>
    </div>
  )
}
