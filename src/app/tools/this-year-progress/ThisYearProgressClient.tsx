"use client"

import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const TOTAL_DAYS = 365 // 2026 is not a leap year

interface YearStats {
  percentage: string
  daysRemaining: number
  weeksRemaining: number
  dayOfYear: number
}

function compute(): YearStats {
  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const elapsedMs = now.getTime() - startOfYear.getTime()
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))
  const percentage = ((elapsedDays / TOTAL_DAYS) * 100).toFixed(2)
  const daysRemaining = TOTAL_DAYS - elapsedDays
  const weeksRemaining = Math.floor(daysRemaining / 7)
  const dayOfYear = elapsedDays + 1
  return { percentage, daysRemaining, weeksRemaining, dayOfYear }
}

const MILESTONES = [
  { name: "Q1 Complete (25%)", dateLabel: "April 1, 2026", date: new Date(2026, 3, 1) },
  { name: "Halfway Point (50%)", dateLabel: "July 2, 2026", date: new Date(2026, 6, 2) },
  { name: "Q3 Complete (75%)", dateLabel: "October 1, 2026", date: new Date(2026, 9, 1) },
  { name: "Final Quarter (90%)", dateLabel: "November 30, 2026", date: new Date(2026, 10, 30) },
  { name: "Year End", dateLabel: "December 31, 2026", date: new Date(2026, 11, 31) },
]

const RELATED_TOOLS = [
  { emoji: "🌍", title: "Born In Your Year", desc: "Facts, events and history from when you arrived", href: "/born-in" },
  { emoji: "📅", title: "Life in Weeks", desc: "Visualize your entire life as a grid of squares", href: "/tools/life-in-weeks" },
  { emoji: "🧬", title: "What Generation Am I?", desc: "Find your true generational identity", href: "/tools/generation-quiz" },
  { emoji: "🎵", title: "#1 Song on Your Birthday", desc: "Discover the hit song from your birth year", href: "/number-one-song" },
  { emoji: "🎂", title: "Celebrity Birthday Twins", desc: "Famous people who share your birthday", href: "/birthday-twins" },
  { emoji: "🔤", title: "Name Popularity", desc: "See how popular your name has been over time", href: "/tools/name-popularity" },
]

export default function ThisYearProgressClient() {
  const [stats, setStats] = useState<YearStats>(() => compute())

  useEffect(() => {
    const id = setInterval(() => setStats(compute()), 1000)
    return () => clearInterval(id)
  }, [])

  const { percentage, daysRemaining, weeksRemaining, dayOfYear } = stats
  const now = new Date()

  const shareText = `2026 is ${percentage}% complete — only ${daysRemaining} days left in the year. How are you spending them? dayblip.com/tools/this-year-progress`
  const shareUrl = "https://www.dayblip.com/tools/this-year-progress"

  return (
    <div>
      {/* 1. Quick Answer Box */}
      <div
        style={{
          background: "#1e2d4a",
          borderLeft: "4px solid #e94560",
          borderRadius: "8px",
          padding: "20px",
          margin: "24px 0",
        }}
      >
        <p style={{ color: "#e2e8f0", margin: 0, fontSize: "16px", lineHeight: 1.6 }}>
          2026 is <strong style={{ color: "#ffffff" }}>{percentage}%</strong> complete. There are{" "}
          <strong style={{ color: "#ffffff" }}>{daysRemaining.toLocaleString()}</strong> days left in the year.
        </p>
      </div>

      {/* 2. Live Progress Bar */}
      <div
        style={{
          background: "#1e2d4a",
          borderRadius: "12px",
          padding: "32px",
          margin: "24px 0",
        }}
      >
        <p
          style={{
            color: "#a8a8b3",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 16px 0",
          }}
        >
          2026 Progress
        </p>
        <div
          style={{
            background: "#0d1b2a",
            borderRadius: "8px",
            height: "24px",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#e94560",
              borderRadius: "8px",
              height: "24px",
              width: `${percentage}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div style={{ fontSize: "48px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1 }}>
            {percentage}%
          </div>
          <div style={{ color: "#a8a8b3", fontSize: "16px", marginTop: "4px" }}>
            of 2026 complete
          </div>
        </div>
      </div>

      {/* 3. Stat Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          margin: "24px 0",
        }}
      >
        {[
          { value: daysRemaining.toLocaleString(), label: "Days Remaining" },
          { value: weeksRemaining.toLocaleString(), label: "Weeks Remaining" },
          { value: dayOfYear.toLocaleString(), label: "Day of the Year" },
          { value: `${daysRemaining.toLocaleString()} days`, label: "Until New Year's Eve" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#1e2d4a",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              minWidth: "140px",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#e94560" }}>{stat.value}</div>
            <div style={{ fontSize: "13px", color: "#a8a8b3", marginTop: "8px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 4. Share Card */}
      <div
        style={{
          background: "#1e2d4a",
          borderTop: "4px solid #e94560",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          margin: "32px 0",
        }}
      >
        <div style={{ fontSize: "24px", color: "#a8a8b3", fontWeight: 500 }}>2026</div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-3px",
            lineHeight: 1.1,
          }}
        >
          {percentage}%
        </div>
        <div style={{ fontSize: "20px", color: "#e94560", fontWeight: 600 }}>complete</div>
        <div style={{ fontSize: "16px", color: "#a8a8b3", margin: "12px 0" }}>
          {daysRemaining.toLocaleString()} days remaining in the year
        </div>
        <div style={{ fontSize: "13px", color: "#a8a8b3", marginTop: "20px" }}>
          dayblip.com/tools/this-year-progress
        </div>
      </div>

      {/* 5. ShareButtons */}
      <ShareButtons
        text={shareText}
        url={shareUrl}
        title="Year Progress 2026 — Dayblip"
      />

      {/* 6. Milestone Section */}
      <div style={{ margin: "32px 0" }}>
        <h2
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 700,
            margin: "32px 0 16px 0",
          }}
        >
          2026 Milestones
        </h2>
        {MILESTONES.map((m, i) => {
          const isPast = now >= m.date
          return (
            <div
              key={m.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: i < MILESTONES.length - 1 ? "1px solid #1e2d4a" : "none",
              }}
            >
              <span style={{ color: "#e2e8f0", fontSize: "15px" }}>{m.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#a8a8b3", fontSize: "14px" }}>{m.dateLabel}</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: isPast ? "rgba(168,168,179,0.15)" : "rgba(233,69,96,0.15)",
                    color: isPast ? "#a8a8b3" : "#e94560",
                  }}
                >
                  {isPast ? "Past" : "Upcoming"}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 7. Explore Your Story Block */}
      <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "24px", margin: "32px 0" }}>
        <p
          style={{
            color: "#a8a8b3",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 16px 0",
          }}
        >
          Explore Your Story
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <a href="/born-in" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🌍 Born In Your Year</a>
          <a href="/tools/life-in-weeks" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>📅 Life in Weeks</a>
          <a href="/tools/generation-quiz" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🧬 What Generation Am I?</a>
          <a href="/number-one-song" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🎵 #1 Song on Your Birthday</a>
          <a href="/birthday-twins" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🎂 Celebrity Birthday Twins</a>
          <a href="/tools/name-popularity" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🔤 Name Popularity</a>
        </div>
      </div>

      {/* 8. RelatedTools */}
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  )
}
