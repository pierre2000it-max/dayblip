"use client"
import { useState, useEffect } from "react"

export default function EmbedChristmasCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, year: new Date().getFullYear() })

  useEffect(() => {
    function update() {
      const now = new Date()
      const year = (now.getMonth() === 11 && now.getDate() > 25) ? now.getFullYear() + 1 : now.getFullYear()
      const christmas = new Date(year, 11, 25)
      const diff = christmas.getTime() - now.getTime()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, year })
        return
      }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        year,
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const box = (val: number, label: string) => (
    <div key={label} style={{ flex: 1, textAlign: "center", background: "#16213e", borderRadius: 8, padding: "12px 8px" }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: "#e94560", lineHeight: 1 }}>{String(val).padStart(2, "0")}</div>
      <div style={{ fontSize: 11, color: "#a8a8b3", marginTop: 4 }}>{label}</div>
    </div>
  )

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8, marginTop: 0 }}>
        🎄 Days Until Christmas
      </h2>
      <p style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 20 }}>Until Christmas {time.year}</p>
      <div style={{ display: "flex", gap: 8 }}>
        {box(time.days, "DAYS")}
        {box(time.hours, "HOURS")}
        {box(time.minutes, "MINS")}
        {box(time.seconds, "SECS")}
      </div>
    </div>
  )
}
