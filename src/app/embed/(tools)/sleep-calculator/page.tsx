"use client"
import { useState } from "react"

type Mode = "sleep" | "wake"

const CYCLES = [
  { n: 3, hours: 4.5, label: "4.5 hours", icon: "😴", note: "Not recommended" },
  { n: 4, hours: 6.0, label: "6.0 hours", icon: "😴", note: "Minimum" },
  { n: 5, hours: 7.5, label: "7.5 hours", icon: "✅", note: "Recommended" },
  { n: 6, hours: 9.0, label: "9.0 hours", icon: "⭐", note: "Ideal" },
]

function parseTime(s: string): Date | null {
  const m = s.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const d = new Date()
  d.setHours(parseInt(m[1]), parseInt(m[2]), 0, 0)
  return d
}

function fmtTime(d: Date): string {
  let h = d.getHours()
  const min = d.getMinutes()
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${String(min).padStart(2, "0")} ${ampm}`
}

function addMinutes(d: Date, mins: number): Date {
  return new Date(d.getTime() + mins * 60000)
}

export default function EmbedSleepCalculator() {
  const [mode, setMode] = useState<Mode>("sleep")
  const [wakeTime, setWakeTime] = useState("06:00")
  const [bedTime, setBedTime] = useState("23:00")
  const [fallAsleep, setFallAsleep] = useState("14")
  const [results, setResults] = useState<{ label: string; time: string; icon: string; note: string }[] | null>(null)

  function calc() {
    const fa = parseInt(fallAsleep) || 14
    if (mode === "sleep") {
      const wake = parseTime(wakeTime)
      if (!wake) return
      const times = CYCLES.map(c => {
        const totalMinsBefore = fa + c.hours * 60
        const sleepAt = addMinutes(wake, -totalMinsBefore)
        return { label: c.label, time: fmtTime(sleepAt), icon: c.icon, note: c.note }
      })
      setResults(times)
    } else {
      const bed = parseTime(bedTime)
      if (!bed) return
      const times = CYCLES.map(c => {
        const totalMinsAfter = fa + c.hours * 60
        const wakeAt = addMinutes(bed, totalMinsAfter)
        return { label: c.label, time: fmtTime(wakeAt), icon: c.icon, note: c.note }
      })
      setResults(times)
    }
  }

  const inputStyle = {
    padding: "9px 10px", background: "#0f1923", border: "1px solid #1e2d4a",
    borderRadius: 6, color: "#fff", fontSize: 13, outline: "none",
    width: "100%", boxSizing: "border-box" as const,
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>
        😴 Sleep Calculator
      </h2>

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {(["sleep", "wake"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setResults(null) }}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: mode === m ? "#e94560" : "#16213e",
              color: mode === m ? "#fff" : "#a8a8b3",
              border: mode === m ? "none" : "1px solid #1e2d4a",
            }}
          >
            {m === "sleep" ? "When should I sleep?" : "When should I wake?"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {mode === "sleep" ? (
          <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Wake up time</span>
            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={inputStyle} />
          </label>
        ) : (
          <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#a8a8b3" }}>Bedtime</span>
            <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} style={inputStyle} />
          </label>
        )}
        <label style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 12, color: "#a8a8b3" }}>Minutes to fall asleep</span>
          <input type="number" min={0} max={60} value={fallAsleep} onChange={e => setFallAsleep(e.target.value)} style={inputStyle} />
        </label>
      </div>

      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 14 }}
      >
        {mode === "sleep" ? "Calculate Bedtimes" : "Calculate Wake Times"}
      </button>

      {results && (
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          {results.map(r => (
            <div
              key={r.label}
              style={{
                background: r.icon === "✅" ? "#0d2818" : r.icon === "⭐" ? "#1a1a0d" : "#16213e",
                border: r.icon === "✅" ? "1px solid #22c55e44" : r.icon === "⭐" ? "1px solid #F9A82544" : "1px solid #1e2d4a",
                borderRadius: 8, padding: "10px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: 14, marginRight: 8 }}>{r.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{r.label}</span>
                <span style={{ fontSize: 11, color: "#a8a8b3", marginLeft: 8 }}>{r.note}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: r.icon === "✅" ? "#22c55e" : r.icon === "⭐" ? "#F9A825" : "#4FC3F7" }}>
                {r.time}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 11 }}>
        <a href="https://www.dayblip.com/tools/sleep-debt" target="_blank" rel="noopener noreferrer" style={{ color: "#e94560", textDecoration: "none" }}>
          Sleep debt calculator → dayblip.com/tools/sleep-debt
        </a>
      </div>
    </div>
  )
}
