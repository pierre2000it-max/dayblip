"use client"
import { useState } from "react"

export default function EmbedAgeCalculator() {
  const [dob, setDob] = useState("")
  const [result, setResult] = useState<{
    years: number; months: number; days: number
    totalDays: number; totalHours: number; heartbeats: number
  } | null>(null)
  const [error, setError] = useState("")

  function calc() {
    setError("")
    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) { setError("Please enter a valid date."); return }
    const today = new Date()
    if (birthDate > today) { setError("Date cannot be in the future."); return }

    const diff = today.getTime() - birthDate.getTime()
    const totalDays = Math.floor(diff / 86400000)
    const totalHours = totalDays * 24
    const heartbeats = totalHours * 60 * 70

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()
    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }

    setResult({ years, months, days, totalDays, totalHours, heartbeats })
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        🎂 Age Calculator
      </h2>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#a8a8b3" }}>Date of birth</span>
        <input
          type="date"
          value={dob}
          onChange={e => setDob(e.target.value)}
          style={{ padding: "10px 12px", background: "#0f1923", border: "1px solid #1e2d4a", borderRadius: 6, color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" }}
        />
      </label>
      {error && <p style={{ color: "#e94560", fontSize: 13, marginBottom: 8 }}>{error}</p>}
      <button
        onClick={calc}
        style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", marginBottom: 16 }}
      >
        Calculate My Age
      </button>
      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 16 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#F9A825" }}>
              {result.years} years, {result.months} months, {result.days} days
            </div>
          </div>
          {[
            { label: "Total days", val: result.totalDays.toLocaleString() },
            { label: "Total hours", val: result.totalHours.toLocaleString() },
            { label: "Estimated heartbeats", val: result.heartbeats.toLocaleString() + " (at 70 bpm)" },
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
