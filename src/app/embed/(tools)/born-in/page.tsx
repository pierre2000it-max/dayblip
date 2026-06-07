"use client"
import { useState } from "react"
import bornInData from "@/data/bornIn.json"

type BornInEntry = {
  year: number
  number1Song: string
  number1Movie: string
  gasPrice: string
  population: string
  worldEvent: string
  president: string
}

const data = bornInData as BornInEntry[]

export default function EmbedBornIn() {
  const [yearInput, setYearInput] = useState("")
  const [result, setResult] = useState<BornInEntry | null>(null)
  const [error, setError] = useState("")

  function lookup() {
    setError("")
    setResult(null)
    const y = parseInt(yearInput, 10)
    if (isNaN(y) || y < 1970 || y > 2020) {
      setError("Please enter a year between 1970 and 2020.")
      return
    }
    const found = data.find(d => d.year === y)
    if (!found) {
      setError("No data found for that year.")
      return
    }
    setResult(found)
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, marginTop: 0 }}>
        🗓️ Born In Year Facts
      </h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="number"
          min={1970}
          max={2020}
          value={yearInput}
          onChange={e => setYearInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="Enter year e.g. 1985"
          style={{ flex: 1, padding: "10px 12px", background: "#0f1923", border: "1px solid #1e2d4a", borderRadius: 6, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" as const }}
        />
        <button
          onClick={lookup}
          style={{ background: "#e94560", color: "#fff", border: "none", borderRadius: 6, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
        >
          Show My Year
        </button>
      </div>
      {error && <p style={{ color: "#e94560", fontSize: 13, marginBottom: 8 }}>{error}</p>}
      {result && (
        <div style={{ background: "#16213e", borderRadius: 8, padding: 16 }}>
          <div style={{ textAlign: "center", fontSize: 20, fontWeight: 700, color: "#F9A825", marginBottom: 12 }}>
            Born in {result.year}
          </div>
          {[
            { label: "🎵 #1 Song", val: result.number1Song },
            { label: "🎬 #1 Movie", val: result.number1Movie },
            { label: "⛽ Gas Price", val: result.gasPrice },
            { label: "🌍 Population", val: result.population },
            { label: "📰 Big Event", val: result.worldEvent },
          ].map(r => (
            <div key={r.label} style={{ padding: "8px 0", borderBottom: "1px solid #1e2d4a", fontSize: 13 }}>
              <div style={{ color: "#a8a8b3", marginBottom: 2 }}>{r.label}</div>
              <div style={{ color: "#fff" }}>{r.val}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <a
              href={`https://www.dayblip.com/born-in/${result.year}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#e94560", fontSize: 13, textDecoration: "none" }}
            >
              See full details → dayblip.com/born-in/{result.year}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
