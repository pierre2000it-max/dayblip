"use client"

import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

// Federal Reserve Survey of Consumer Finances 2022 + Census Bureau CPS data
const incomePercentiles = [
  { percentile: 10, income: 15000 },
  { percentile: 20, income: 22000 },
  { percentile: 25, income: 26000 },
  { percentile: 30, income: 30000 },
  { percentile: 40, income: 38000 },
  { percentile: 50, income: 46000 },
  { percentile: 60, income: 57000 },
  { percentile: 70, income: 72000 },
  { percentile: 75, income: 82000 },
  { percentile: 80, income: 96000 },
  { percentile: 90, income: 140000 },
  { percentile: 95, income: 200000 },
  { percentile: 99, income: 400000 },
  { percentile: 99.9, income: 1500000 },
]

const netWorthPercentiles = [
  { percentile: 10, netWorth: -5000 },
  { percentile: 20, netWorth: 2000 },
  { percentile: 25, netWorth: 10000 },
  { percentile: 30, netWorth: 20000 },
  { percentile: 40, netWorth: 48000 },
  { percentile: 50, netWorth: 97000 },
  { percentile: 60, netWorth: 175000 },
  { percentile: 70, netWorth: 310000 },
  { percentile: 75, netWorth: 420000 },
  { percentile: 80, netWorth: 608000 },
  { percentile: 90, netWorth: 1300000 },
  { percentile: 95, netWorth: 2500000 },
  { percentile: 99, netWorth: 11000000 },
  { percentile: 99.9, netWorth: 43000000 },
]

type PercentileRow = { percentile: number; income?: number; netWorth?: number }

function getPercentile(value: number, data: PercentileRow[]): number {
  const key = "income" in data[0] ? "income" : "netWorth"

  // Below the lowest data point
  if (value <= (data[0][key as keyof PercentileRow] as number)) {
    return Math.max(0, data[0].percentile - 10)
  }

  // Above the highest data point
  if (value >= (data[data.length - 1][key as keyof PercentileRow] as number)) {
    return 99.9
  }

  for (let i = 0; i < data.length - 1; i++) {
    const lo = data[i][key as keyof PercentileRow] as number
    const hi = data[i + 1][key as keyof PercentileRow] as number
    if (value >= lo && value <= hi) {
      const fraction = (value - lo) / (hi - lo)
      const result = data[i].percentile + fraction * (data[i + 1].percentile - data[i].percentile)
      return Math.round(result * 10) / 10
    }
  }

  return 0
}

function fmt(n: number): string {
  return Math.abs(n) >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : `$${Math.round(n).toLocaleString()}`
}

function ordinal(n: number): string {
  const t = Math.round(n * 10) / 10
  const str = t % 1 === 0 ? t.toFixed(0) : t.toFixed(1)
  const last = Math.floor(t) % 10
  const sec = Math.floor(t) % 100
  if (sec >= 11 && sec <= 13) return `${str}th`
  if (last === 1) return `${str}st`
  if (last === 2) return `${str}nd`
  if (last === 3) return `${str}rd`
  return `${str}th`
}

const RELATED_TOOLS = [
  { emoji: "🌍", title: "Born In Your Year", desc: "Facts, events and history from when you arrived", href: "/born-in" },
  { emoji: "📅", title: "Life in Weeks", desc: "Visualize your entire life as a grid of squares", href: "/tools/life-in-weeks" },
  { emoji: "📊", title: "Net Worth Calculator", desc: "Calculate your true net worth in minutes", href: "/finance/net-worth" },
  { emoji: "⏰", title: "True Hourly Wage", desc: "What you actually earn per hour after hidden costs", href: "/tools/true-hourly-wage" },
  { emoji: "🆓", title: "Financial Independence Date", desc: "When could you afford to stop working?", href: "/tools/fi-date" },
  { emoji: "📊", title: "Year Progress", desc: "How much of the year is already gone", href: "/tools/this-year-progress" },
]

interface Result {
  income: number
  netWorth: number
  incomePercentile: number
  netWorthPercentile: number
  peopleBelow: number
}

export default function WhereYouRankClient() {
  const [incomeInput, setIncomeInput] = useState("")
  const [netWorthInput, setNetWorthInput] = useState("")
  const [ageRange, setAgeRange] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")

  function handleSubmit() {
    setError("")
    setResult(null)

    const income = parseFloat(incomeInput.replace(/,/g, ""))
    if (!incomeInput.trim() || isNaN(income)) {
      setError("Please enter your annual income to see your rank.")
      return
    }
    if (income < 0) {
      setError("Please enter a positive income value.")
      return
    }
    if (income > 100_000_000) {
      setError("Please enter a realistic income value.")
      return
    }

    const netWorth = netWorthInput.trim() ? parseFloat(netWorthInput.replace(/,/g, "")) : 0
    const incomePercentile = getPercentile(income, incomePercentiles as PercentileRow[])
    const netWorthPercentile = getPercentile(netWorth, netWorthPercentiles as PercentileRow[])
    const peopleBelow = Math.round((incomePercentile / 100) * 258_000_000)

    setResult({ income, netWorth, incomePercentile, netWorthPercentile, peopleBelow })
  }

  const shareText = result
    ? `I just found out I'm in the ${ordinal(result.incomePercentile)} income percentile in the US. Find out where you rank at dayblip.com/tools/where-you-rank`
    : ""

  return (
    <div>
      {/* Input form */}
      <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "32px", margin: "24px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>Your Annual Income</span>
            <input
              type="number"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              placeholder="e.g. 75000"
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
              Your Net Worth (assets minus debts)
            </span>
            <input
              type="number"
              value={netWorthInput}
              onChange={(e) => setNetWorthInput(e.target.value)}
              placeholder="e.g. 150000"
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
            <span style={{ color: "#a8a8b3", fontSize: "13px" }}>
              Net worth = savings + investments + home equity − all debts. Can be negative.
            </span>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>Your Age Range</span>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              style={{
                background: "#0d1b2a",
                border: "1px solid #0f3460",
                borderRadius: "8px",
                color: ageRange ? "#ffffff" : "#a8a8b3",
                fontSize: "16px",
                padding: "12px 16px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <option value="" disabled>Select age range</option>
              <option value="under30">Under 30</option>
              <option value="30-39">30–39</option>
              <option value="40-49">40–49</option>
              <option value="50-59">50–59</option>
              <option value="60-69">60–69</option>
              <option value="70+">70+</option>
            </select>
          </label>

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
              alignSelf: "flex-start",
            }}
          >
            Find My Rank →
          </button>
        </div>
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
              Your income of{" "}
              <strong style={{ color: "#ffffff" }}>{fmt(result.income)}</strong> puts you in the{" "}
              <strong style={{ color: "#ffffff" }}>{ordinal(result.incomePercentile)}</strong> percentile
              — you earn more than{" "}
              <strong style={{ color: "#ffffff" }}>{result.incomePercentile.toFixed(1)}%</strong> of
              Americans. Your net worth of{" "}
              <strong style={{ color: "#ffffff" }}>{fmt(result.netWorth)}</strong> puts you in the{" "}
              <strong style={{ color: "#ffffff" }}>{ordinal(result.netWorthPercentile)}</strong> percentile.
            </p>
          </div>

          {/* 2. Rank Cards */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", margin: "24px 0" }}>
            <div
              style={{
                background: "#1e2d4a",
                borderRadius: "12px",
                padding: "28px",
                flex: 1,
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#a8a8b3", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Income Rank
              </div>
              <div style={{ fontSize: "52px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1, margin: "12px 0 4px 0" }}>
                {ordinal(result.incomePercentile)}
              </div>
              <div style={{ color: "#e94560", fontSize: "16px" }}>percentile</div>
              <div style={{ color: "#a8a8b3", fontSize: "14px", marginTop: "12px" }}>
                You earn more than {result.incomePercentile.toFixed(1)}% of Americans
              </div>
            </div>

            <div
              style={{
                background: "#1e2d4a",
                borderRadius: "12px",
                padding: "28px",
                flex: 1,
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              <div style={{ color: "#a8a8b3", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Wealth Rank
              </div>
              <div style={{ fontSize: "52px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1, margin: "12px 0 4px 0" }}>
                {ordinal(result.netWorthPercentile)}
              </div>
              <div style={{ color: "#e94560", fontSize: "16px" }}>percentile</div>
              <div style={{ color: "#a8a8b3", fontSize: "14px", marginTop: "12px" }}>
                You are wealthier than {result.netWorthPercentile.toFixed(1)}% of Americans
              </div>
            </div>
          </div>

          {/* 3. Shock Stat */}
          <div
            style={{
              background: "#0d1b2a",
              borderRadius: "12px",
              padding: "24px",
              margin: "24px 0",
              textAlign: "center",
            }}
          >
            <div style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600 }}>
              Your income is higher than approximately{" "}
              <span style={{ color: "#e94560" }}>{result.peopleBelow.toLocaleString()}</span> Americans.
            </div>
            <div style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "8px" }}>
              Based on US Census Bureau income distribution data.
            </div>
          </div>

          {/* 4. Context Section */}
          <div style={{ margin: "32px 0" }}>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "32px 0 16px 0" }}>
              What This Means
            </h2>
            {[
              { label: "Median US income", value: "$46,000" },
              {
                label: "Your income vs median",
                value: (() => {
                  const diff = ((result.income - 46000) / 46000) * 100
                  return `${Math.abs(diff).toFixed(0)}% ${diff >= 0 ? "above" : "below"} median`
                })(),
              },
              { label: "Top 10% income threshold", value: "$140,000" },
              { label: "Top 1% income threshold", value: "$400,000" },
              { label: "Median US net worth", value: "$97,000" },
              {
                label: "Your net worth vs median",
                value: (() => {
                  const diff = ((result.netWorth - 97000) / 97000) * 100
                  return `${Math.abs(diff).toFixed(0)}% ${diff >= 0 ? "above" : "below"} median`
                })(),
              },
              { label: "Top 10% wealth threshold", value: "$1,300,000" },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #0d1b2a" : "none",
                }}
              >
                <span style={{ color: "#a8a8b3", fontSize: "15px" }}>{row.label}</span>
                <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* 5. Share Card */}
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
            <div
              style={{
                fontSize: "13px",
                color: "#a8a8b3",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Income Percentile
            </div>
            <div
              style={{
                fontSize: "64px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-3px",
                lineHeight: 1.1,
                margin: "8px 0 4px 0",
              }}
            >
              {ordinal(result.incomePercentile)}
            </div>
            <div style={{ fontSize: "20px", color: "#e94560" }}>percentile</div>
            <div style={{ fontSize: "16px", color: "#a8a8b3", margin: "12px 0" }}>
              Wealthier than {result.netWorthPercentile.toFixed(1)}% of Americans by net worth
            </div>
            <div style={{ fontSize: "13px", color: "#a8a8b3", marginTop: "20px" }}>
              dayblip.com/tools/where-you-rank
            </div>
          </div>

          {/* 6. ShareButtons */}
          <ShareButtons
            text={shareText}
            url="https://www.dayblip.com/tools/where-you-rank"
            title="Where Do You Rank? — Dayblip"
          />
        </>
      )}

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
          <a href="/tools/this-year-progress" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>📊 Year Progress</a>
        </div>
      </div>

      {/* 8. RelatedTools */}
      <RelatedTools tools={RELATED_TOOLS} />
    </div>
  )
}
