"use client"

import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const generations = [
  { name: "Gen Alpha", start: 2013, end: 2025 },
  { name: "Gen Z", start: 1997, end: 2012 },
  { name: "Millennial", start: 1981, end: 1996 },
  { name: "Gen X", start: 1965, end: 1980 },
  { name: "Baby Boomer", start: 1946, end: 1964 },
  { name: "Silent Generation", start: 1928, end: 1945 },
]

function getGeneration(birthYear: number): string {
  for (const g of generations) {
    if (birthYear >= g.start && birthYear <= g.end) return g.name
  }
  return "Unknown"
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function formatDate(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86400000)
}

const RELATED_TOOLS = [
  { emoji: "🌍", title: "Born In Your Year", desc: "Facts, events and history from when you arrived", href: "/born-in" },
  { emoji: "📅", title: "Life in Weeks", desc: "Visualize your entire life as a grid of squares", href: "/tools/life-in-weeks" },
  { emoji: "🧬", title: "What Generation Am I?", desc: "Find your true generational identity", href: "/tools/generation-quiz" },
  { emoji: "🎂", title: "Celebrity Birthday Twins", desc: "Famous people who share your birthday", href: "/birthday-twins" },
  { emoji: "🏆", title: "Where Do You Rank?", desc: "US income and wealth percentile calculator", href: "/tools/where-you-rank" },
  { emoji: "📊", title: "Year Progress", desc: "How much of the year is already gone", href: "/tools/this-year-progress" },
]

interface Result {
  name1display: string
  name2display: string
  olderName: string
  youngerName: string
  birth1Year: number
  birth2Year: number
  ageGapDays: number
  ageGapYears: string
  daysAliveTogether: number
  weeksAliveTogether: number
  person1AgeDays: number
  person2AgeDays: number
  combinedDaysAlive: number
  gen1: string
  gen2: string
  sameGeneration: boolean
  sharedWeekendsRemaining: number
  milestone1000: Date
  milestone5000: Date
  milestone10000: Date
  milestoneAge80: Date
  youngerBirth: Date
}

export default function CoupleCompatibilityClient() {
  const [name1, setName1] = useState("")
  const [name2, setName2] = useState("")
  const [dob1, setDob1] = useState("")
  const [dob2, setDob2] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")

  const todayStr = new Date().toISOString().split("T")[0]

  function handleSubmit() {
    setError("")
    setResult(null)

    if (!dob1 || !dob2) {
      setError("Please enter both birthdates to calculate your numbers.")
      return
    }

    const today = new Date()
    const birth1 = new Date(dob1)
    const birth2 = new Date(dob2)

    if (birth1 > today || birth2 > today) {
      setError("Please enter a birthdate in the past.")
      return
    }

    if (dob1 === dob2) {
      setError("You entered the same birthday for both people. Try two different dates.")
      return
    }

    if (birth1.getFullYear() < 1900 || birth2.getFullYear() < 1900) {
      setError("Please enter a birth year after 1900.")
      return
    }

    const olderBirth = birth1 < birth2 ? birth1 : birth2
    const youngerBirth = birth1 < birth2 ? birth2 : birth1
    const name1display = name1.trim() || "Person 1"
    const name2display = name2.trim() || "Person 2"
    const olderName = birth1 < birth2 ? name1display : name2display
    const youngerName = birth1 < birth2 ? name2display : name1display

    const ageGapDays = Math.floor(Math.abs(birth1.getTime() - birth2.getTime()) / 86400000)
    const ageGapYears = (ageGapDays / 365.25).toFixed(1)
    const daysAliveTogether = Math.floor((today.getTime() - youngerBirth.getTime()) / 86400000)
    const weeksAliveTogether = Math.floor(daysAliveTogether / 7)
    const person1AgeDays = Math.floor((today.getTime() - birth1.getTime()) / 86400000)
    const person2AgeDays = Math.floor((today.getTime() - birth2.getTime()) / 86400000)
    const combinedDaysAlive = person1AgeDays + person2AgeDays
    const gen1 = getGeneration(birth1.getFullYear())
    const gen2 = getGeneration(birth2.getFullYear())
    const sameGeneration = gen1 === gen2
    const youngerAgeYears = Math.floor(daysAliveTogether / 365.25)
    const yearsTo80Younger = 80 - youngerAgeYears
    const sharedWeekendsRemaining = Math.max(0, Math.floor((yearsTo80Younger * 365.25) / 7) * 2)

    const milestone1000 = addDays(youngerBirth, 1000)
    const milestone5000 = addDays(youngerBirth, 5000)
    const milestone10000 = addDays(youngerBirth, 10000)
    const milestoneAge80 = addDays(youngerBirth, Math.round(80 * 365.25))

    // suppress unused olderBirth lint warning
    void olderBirth

    setResult({
      name1display,
      name2display,
      olderName,
      youngerName,
      birth1Year: birth1.getFullYear(),
      birth2Year: birth2.getFullYear(),
      ageGapDays,
      ageGapYears,
      daysAliveTogether,
      weeksAliveTogether,
      person1AgeDays,
      person2AgeDays,
      combinedDaysAlive,
      gen1,
      gen2,
      sameGeneration,
      sharedWeekendsRemaining,
      milestone1000,
      milestone5000,
      milestone10000,
      milestoneAge80,
      youngerBirth,
    })
  }

  const today = new Date()

  const shareText = result
    ? `${result.name1display} and ${result.name2display} have been alive together for ${result.daysAliveTogether.toLocaleString()} days and have ${result.sharedWeekendsRemaining.toLocaleString()} weekends left to share. Find your numbers at dayblip.com/tools/couple-compatibility`
    : ""

  return (
    <div>
      {/* Input form */}
      <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "32px", margin: "24px 0" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {/* Person 1 */}
          <div style={{ flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>
                Your Name (optional)
              </span>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="e.g. Alex"
                style={{
                  background: "#0d1b2a",
                  border: "1px solid #0f3460",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "16px",
                  padding: "12px 16px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>
                Your Birthday
              </span>
              <input
                type="date"
                value={dob1}
                onChange={(e) => setDob1(e.target.value)}
                max={todayStr}
                style={{
                  background: "#0d1b2a",
                  border: "1px solid #0f3460",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "16px",
                  padding: "12px 16px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          {/* Person 2 */}
          <div style={{ flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>
                Their Name (optional)
              </span>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="e.g. Jordan"
                style={{
                  background: "#0d1b2a",
                  border: "1px solid #0f3460",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "16px",
                  padding: "12px 16px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>
                Their Birthday
              </span>
              <input
                type="date"
                value={dob2}
                onChange={(e) => setDob2(e.target.value)}
                max={todayStr}
                style={{
                  background: "#0d1b2a",
                  border: "1px solid #0f3460",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "16px",
                  padding: "12px 16px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            background: "#e94560",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "14px 28px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            marginTop: "24px",
          }}
        >
          Calculate Our Numbers →
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            background: "#1e2d4a",
            borderLeft: "4px solid #ff9800",
            borderRadius: "8px",
            padding: "16px",
            margin: "16px 0",
            color: "#ffffff",
            fontSize: "15px",
          }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
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
            <p style={{ color: "#e2e8f0", margin: 0, fontSize: "16px", lineHeight: 1.7 }}>
              <strong style={{ color: "#ffffff" }}>{result.name1display}</strong> and{" "}
              <strong style={{ color: "#ffffff" }}>{result.name2display}</strong> have been alive
              together for{" "}
              <strong style={{ color: "#ffffff" }}>{result.daysAliveTogether.toLocaleString()}</strong>{" "}
              days.{" "}
              <strong style={{ color: "#ffffff" }}>{result.olderName}</strong> is{" "}
              <strong style={{ color: "#ffffff" }}>{result.ageGapYears}</strong> years older. You
              have approximately{" "}
              <strong style={{ color: "#ffffff" }}>{result.sharedWeekendsRemaining.toLocaleString()}</strong>{" "}
              weekends left to share if both live to 80.
            </p>
          </div>

          {/* 2. Share Card */}
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
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff" }}>
              {result.name1display} &amp; {result.name2display}
            </div>
            <div style={{ fontSize: "20px", color: "#e94560", fontWeight: 600, margin: "12px 0" }}>
              {result.daysAliveTogether.toLocaleString()} days alive together
            </div>
            <div style={{ fontSize: "16px", color: "#a8a8b3" }}>
              {result.sharedWeekendsRemaining.toLocaleString()} weekends left to share
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", margin: "16px 0", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#0d1b2a",
                  color: "#e94560",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {result.gen1}
              </span>
              <span
                style={{
                  background: "#0d1b2a",
                  color: "#e94560",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {result.gen2}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#a8a8b3", marginTop: "20px" }}>
              dayblip.com/tools/couple-compatibility
            </div>
          </div>

          {/* 3. ShareButtons */}
          <ShareButtons
            text={shareText}
            url="https://www.dayblip.com/tools/couple-compatibility"
            title="Couple Compatibility Calculator — Dayblip"
          />

          {/* 4. Stat Grid */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", margin: "24px 0" }}>
            {[
              { value: result.daysAliveTogether.toLocaleString(), label: "Days Alive Together" },
              { value: result.weeksAliveTogether.toLocaleString(), label: "Weeks Alive Together" },
              { value: result.sharedWeekendsRemaining.toLocaleString(), label: "Weekends Left (to age 80)" },
              { value: `${result.ageGapDays.toLocaleString()} days`, label: "Age Gap" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "#1e2d4a",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  flex: 1,
                  minWidth: "150px",
                }}
              >
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#e94560" }}>{stat.value}</div>
                <div style={{ fontSize: "13px", color: "#a8a8b3", marginTop: "8px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 5. Generation Match */}
          <div
            style={{
              background: "#1e2d4a",
              borderRadius: "12px",
              padding: "24px",
              margin: "24px 0",
            }}
          >
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, marginBottom: "16px", margin: "0 0 16px 0" }}>
              Generation Match
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ color: "#e2e8f0", fontSize: "15px" }}>
                <strong style={{ color: "#ffffff" }}>{result.name1display}:</strong>{" "}
                {result.gen1}{" "}
                <span style={{ color: "#a8a8b3", fontSize: "13px" }}>({result.birth1Year})</span>
              </div>
              <div style={{ color: "#e2e8f0", fontSize: "15px" }}>
                <strong style={{ color: "#ffffff" }}>{result.name2display}:</strong>{" "}
                {result.gen2}{" "}
                <span style={{ color: "#a8a8b3", fontSize: "13px" }}>({result.birth2Year})</span>
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              {result.sameGeneration ? (
                <span
                  style={{
                    background: "#1a3a1a",
                    color: "#4caf50",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontSize: "13px",
                  }}
                >
                  ✓ Same Generation
                </span>
              ) : (
                <span
                  style={{
                    background: "#1a2535",
                    color: "#a8a8b3",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontSize: "13px",
                  }}
                >
                  Different Generations
                </span>
              )}
            </div>
          </div>

          {/* 6. Combined Life Stats */}
          <div style={{ margin: "24px 0" }}>
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: "24px 0 16px 0" }}>
              Combined Life Stats
            </h2>
            {[
              {
                label: `${result.name1display} total days alive`,
                value: result.person1AgeDays.toLocaleString(),
              },
              {
                label: `${result.name2display} total days alive`,
                value: result.person2AgeDays.toLocaleString(),
              },
              {
                label: "Combined days lived",
                value: result.combinedDaysAlive.toLocaleString(),
              },
              {
                label: `${result.olderName} was born first by`,
                value: `${result.ageGapDays.toLocaleString()} days (${result.ageGapYears} years)`,
              },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #0d1b2a" : "none",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#a8a8b3", fontSize: "15px" }}>{row.label}</span>
                <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* 7. Milestone Dates */}
          <div style={{ margin: "24px 0" }}>
            <h2 style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700, margin: "24px 0 16px 0" }}>
              Shared Milestones
            </h2>
            {[
              { label: "1,000 days alive together", date: result.milestone1000 },
              { label: "5,000 days alive together", date: result.milestone5000 },
              { label: "10,000 days alive together", date: result.milestone10000 },
              { label: `${result.youngerName} turns 80`, date: result.milestoneAge80 },
            ].map((m, i, arr) => {
              const isPast = m.date <= today
              return (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid #0d1b2a" : "none",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#e2e8f0", fontSize: "15px" }}>{m.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#a8a8b3", fontSize: "14px" }}>{formatDate(m.date)}</span>
                    <span
                      style={{
                        background: isPast ? "#1a2a1a" : "#1a2d3a",
                        color: isPast ? "#a8a8b3" : "#e94560",
                        borderRadius: "12px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isPast ? "Past" : "Coming"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 8. Explore Your Story Block */}
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
              <a href="/tools/this-year-progress" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>📊 Year Progress</a>
              <a href="/tools/where-you-rank" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🏆 Where Do You Rank?</a>
            </div>
          </div>

          {/* 9. RelatedTools */}
          <RelatedTools tools={RELATED_TOOLS} />
        </>
      )}
    </div>
  )
}
