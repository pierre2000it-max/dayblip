"use client"
import { useState } from "react"

function getLetterGrade(pct: number): string {
  if (pct >= 90) return "A"
  if (pct >= 80) return "B"
  if (pct >= 70) return "C"
  if (pct >= 60) return "D"
  return "F"
}

export default function EmbedGradeCalculator() {
  const [tab, setTab] = useState<"final" | "score">("final")

  // Tab 1
  const [currentGrade, setCurrentGrade] = useState("78")
  const [finalWeight, setFinalWeight] = useState("30")
  const [targetGrade, setTargetGrade] = useState("80")

  // Tab 2
  const [correct, setCorrect] = useState("42")
  const [total, setTotal] = useState("50")

  const inputStyle = {
    padding: "8px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  // Tab 1 calc
  const cg = parseFloat(currentGrade) || 0
  const fw = parseFloat(finalWeight) || 0
  const tg = parseFloat(targetGrade) || 0
  const currentWeight = 1 - fw / 100
  const neededFinal = fw > 0 ? (tg - cg * currentWeight) / (fw / 100) : 0

  // Max possible grade
  const maxPossible = cg * currentWeight + 100 * (fw / 100)

  // Tab 2 calc
  const corr = parseFloat(correct) || 0
  const tot = parseFloat(total) || 1
  const scorePct = (corr / tot) * 100
  const forA = Math.ceil(tot * 0.9)
  const forB = Math.ceil(tot * 0.8)
  const canMissA = Math.max(0, tot - forA)
  const canMissB = Math.max(0, tot - forB)

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        📝 Grade Calculator
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid #1e2d4a", paddingBottom: 10 }}>
        {[
          { key: "final" as const, label: "What do I need on my final?" },
          { key: "score" as const, label: "Calculate test score" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "7px 6px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
              background: "transparent", border: "none",
              color: tab === t.key ? "#fff" : "#a8a8b3",
              borderBottom: tab === t.key ? "2px solid #e94560" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "final" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Current grade (%)</span>
              <input type="number" min={0} max={100} value={currentGrade} onChange={e => setCurrentGrade(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Final exam weight (%)</span>
              <input type="number" min={1} max={100} value={finalWeight} onChange={e => setFinalWeight(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Target grade (%)</span>
              <input type="number" min={0} max={100} value={targetGrade} onChange={e => setTargetGrade(e.target.value)} style={inputStyle} />
            </label>
          </div>

          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 12 }}>
            {neededFinal > 100 ? (
              <>
                <div style={{ fontSize: 14, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Not mathematically possible.</div>
                <div style={{ fontSize: 13, color: "#a8a8b3" }}>Highest possible grade: <span style={{ color: "#F9A825", fontWeight: 600 }}>{maxPossible.toFixed(1)}%</span></div>
              </>
            ) : neededFinal < 0 ? (
              <>
                <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 700, marginBottom: 4 }}>
                  You have already secured {Math.floor(cg * currentWeight)}%+ even with a 0! 🎉
                </div>
                <div style={{ fontSize: 13, color: "#a8a8b3" }}>You need <span style={{ color: "#22c55e", fontWeight: 600 }}>0%</span> or higher on the final.</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, color: "#a8a8b3", marginBottom: 4 }}>You need</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: neededFinal >= 90 ? "#ef4444" : "#F9A825", marginBottom: 4 }}>
                  {neededFinal.toFixed(1)}%
                </div>
                <div style={{ fontSize: 13, color: "#a8a8b3" }}>on your final exam ({getLetterGrade(neededFinal)} or better)</div>
              </>
            )}
          </div>

          <div style={{ fontSize: 11, color: "#a8a8b3", textAlign: "center" }}>
            A = 90%+ · B = 80%+ · C = 70%+ · D = 60%+
          </div>
        </>
      )}

      {tab === "score" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Questions correct</span>
              <input type="number" min={0} value={correct} onChange={e => setCorrect(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Total questions</span>
              <input type="number" min={1} value={total} onChange={e => setTotal(e.target.value)} style={inputStyle} />
            </label>
          </div>

          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#F9A825" }}>{scorePct.toFixed(1)}%</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{getLetterGrade(scorePct)}</div>
            </div>
            <div style={{ fontSize: 13, color: "#a8a8b3", marginBottom: 2 }}>
              Questions you can miss for A: <span style={{ color: "#22c55e", fontWeight: 600 }}>{canMissA}</span>
            </div>
            <div style={{ fontSize: 13, color: "#a8a8b3" }}>
              Questions you can miss for B: <span style={{ color: "#F9A825", fontWeight: 600 }}>{canMissB}</span>
            </div>
          </div>
        </>
      )}

      <div style={{ textAlign: "center", fontSize: 11, marginTop: 8 }}>
        <a href="https://www.dayblip.com/education/gpa-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#a8a8b3", textDecoration: "none" }}>
          GPA calculator → dayblip.com/education/gpa-calculator
        </a>
      </div>
    </div>
  )
}
