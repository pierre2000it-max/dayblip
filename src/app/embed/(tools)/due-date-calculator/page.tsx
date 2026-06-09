"use client"
import { useState } from "react"

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function fmtDay(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long" })
}

function starSign(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "♈ Aries"
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "♉ Taurus"
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "♊ Gemini"
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "♋ Cancer"
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "♌ Leo"
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "♍ Virgo"
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "♎ Libra"
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "♏ Scorpio"
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "♐ Sagittarius"
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "♑ Capricorn"
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "♒ Aquarius"
  return "♓ Pisces"
}

export default function EmbedDueDateCalculator() {
  const [method, setMethod] = useState<"lmp" | "conception">("lmp")
  const [lmpDate, setLmpDate] = useState("")
  const [cycleLength, setCycleLength] = useState(28)
  const [conceptionDate, setConceptionDate] = useState("")
  const [result, setResult] = useState<{
    dueDate: Date; weeksRemaining: number; daysRemaining: number
    t1End: Date; t2End: Date
  } | null>(null)

  function calc() {
    let dueDate: Date
    if (method === "lmp") {
      if (!lmpDate) return
      const base = new Date(lmpDate + "T12:00:00")
      const adjustment = cycleLength - 28
      dueDate = addDays(base, 280 + adjustment)
    } else {
      if (!conceptionDate) return
      dueDate = addDays(new Date(conceptionDate + "T12:00:00"), 266)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueCopy = new Date(dueDate)
    dueCopy.setHours(0, 0, 0, 0)
    const daysRemaining = Math.max(0, Math.round((dueCopy.getTime() - today.getTime()) / 86400000))
    const weeksRemaining = Math.floor(daysRemaining / 7)

    const conceptionApprox = method === "lmp"
      ? addDays(new Date(lmpDate + "T12:00:00"), 14 + cycleLength - 28)
      : new Date(conceptionDate + "T12:00:00")
    const t1End = addDays(conceptionApprox, 13 * 7)
    const t2End = addDays(conceptionApprox, 26 * 7)

    setResult({ dueDate, weeksRemaining, daysRemaining, t1End, t2End })
  }

  const inputStyle = {
    padding: "9px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        🍼 Pregnancy Due Date Calculator
      </h2>

      {/* Method toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {(["lmp", "conception"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: method === m ? "#e94560" : "#16213e",
              color: method === m ? "#fff" : "#a8a8b3",
              border: method === m ? "none" : "1px solid #1e2d4a",
            }}
          >
            {m === "lmp" ? "Last Menstrual Period" : "Conception Date"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 9, marginBottom: 12 }}>
        {method === "lmp" ? (
          <>
            <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 12, color: "#a8a8b3" }}>Last period date</span>
              <input type="date" value={lmpDate} onChange={e => setLmpDate(e.target.value)} style={inputStyle} />
            </label>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#a8a8b3" }}>Cycle length</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#F9A825" }}>{cycleLength} days</span>
              </div>
              <input
                type="range" min={20} max={45} value={cycleLength}
                onChange={e => setCycleLength(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#e94560" }}
              />
            </div>
          </>
        ) : (
          <label style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Conception date</span>
            <input type="date" value={conceptionDate} onChange={e => setConceptionDate(e.target.value)} style={inputStyle} />
          </label>
        )}
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        Calculate Due Date
      </button>

      {result && (
        <>
          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#a8a8b3", marginBottom: 4 }}>Estimated due date</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F9A825", marginBottom: 2 }}>{fmtDate(result.dueDate)} 🍼</div>
            <div style={{ fontSize: 13, color: "#a8a8b3" }}>{fmtDay(result.dueDate)}</div>
          </div>

          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            {[
              { label: "Weeks remaining", val: `${result.weeksRemaining} weeks` },
              { label: "Days remaining", val: `${result.daysRemaining} days` },
              { label: "Baby's star sign", val: starSign(result.dueDate) },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e2d4a", fontSize: 13 }}>
                <span style={{ color: "#a8a8b3" }}>{r.label}</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#16213e", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "#a8a8b3", marginBottom: 8 }}>Trimester timeline</div>
            {[
              { label: "1st trimester ends", val: fmtDate(result.t1End) },
              { label: "2nd trimester ends", val: fmtDate(result.t2End) },
              { label: "Due date", val: fmtDate(result.dueDate) },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1e2d4a", fontSize: 12 }}>
                <span style={{ color: "#a8a8b3" }}>{r.label}</span>
                <span style={{ color: "#4FC3F7", fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p style={{ fontSize: 11, color: "#a8a8b3", marginBottom: 10, lineHeight: 1.5 }}>
        Estimate only. Consult your healthcare provider.
      </p>

      <div style={{ textAlign: "center", fontSize: 11, color: "#a8a8b3" }}>
        <a href="https://www.dayblip.com/health/due-date-calculator" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Full calculator with milestones → dayblip.com/health/due-date-calculator
        </a>
      </div>
    </div>
  )
}
