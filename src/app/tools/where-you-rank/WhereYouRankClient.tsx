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

          {/* ── NOW WHAT? Interpretation Layer ── */}
          {(() => {
            const ip = result.incomePercentile
            const wp = result.netWorthPercentile
            const hasNetWorth = result.netWorth !== 0

            // Income tier
            let incomeTier: 'bottom' | 'middle' | 'upper-middle' | 'top10' | 'top1'
            let incomeMessage: string

            if (ip < 50) {
              incomeTier = 'bottom'
              incomeMessage = `Your income is in the bottom half of American earners. The median US household income is approximately $74,000 — closing that gap is the highest-leverage financial move available to you. Income growth compounds: every dollar of additional income invested at your current savings rate accelerates your entire financial timeline.`
            } else if (ip < 75) {
              incomeTier = 'middle'
              incomeMessage = `Your income is in the ${ordinal(ip)} percentile — above median but below the top quarter. At this income level the biggest financial lever is usually savings rate, not income itself. Most people in this range can reach financial independence in 20-30 years by maintaining a 25-35% savings rate.`
            } else if (ip < 90) {
              incomeTier = 'upper-middle'
              incomeMessage = `Your income is in the ${ordinal(ip)} percentile — top quarter of American earners. At this level lifestyle inflation is the primary risk. People who reach the 75th-90th percentile and maintain their pre-raise lifestyle accumulate wealth at dramatically higher rates than those who expand spending to match income.`
            } else if (ip < 99) {
              incomeTier = 'top10'
              incomeMessage = `Your income is in the top 10% of American earners. At this level tax optimization becomes one of the highest-ROI financial activities — maximizing 401k ($23,500 in 2026), HSA ($4,300 single), and backdoor Roth IRA contributions can reduce your effective tax rate meaningfully. The gap between gross and net income is large at your level.`
            } else {
              incomeTier = 'top1'
              incomeMessage = `Your income is in the top 1% of American earners. At this level the primary financial risks are lifestyle creep, tax drag, and concentration risk (over-reliance on a single income source). Diversification of income streams and aggressive tax-advantaged investing are the highest priorities.`
            }

            // Net worth assessment
            let wealthMessage: string
            if (!hasNetWorth) {
              wealthMessage = ''
            } else if (wp < 25) {
              wealthMessage = `Your net worth is in the bottom quarter — this is where most people in their 20s and early 30s start. The priority at this stage is eliminating high-interest debt (anything above 6-7% APR), building a 3-6 month emergency fund, and starting retirement contributions to capture any employer match.`
            } else if (wp < 50) {
              wealthMessage = `Your net worth is in the ${ordinal(wp)} percentile — below median but building. The US median net worth is approximately $97,000. Closing that gap requires consistent investing over time — the average American who reaches median net worth does so primarily through home equity and retirement accounts, not savings accounts.`
            } else if (wp < 75) {
              wealthMessage = `Your net worth is in the ${ordinal(wp)} percentile — above median. At this stage the power of compounding is beginning to work in your favor. Protecting your net worth from lifestyle inflation and maintaining a consistent investment rate matters more than optimizing individual investments.`
            } else if (wp < 90) {
              wealthMessage = `Your net worth is in the ${ordinal(wp)} percentile — top quarter of American households. At this level asset allocation and tax efficiency become more important than savings rate alone. Ensure you are not over-concentrated in a single asset class (common at this level: too much in employer stock or real estate).`
            } else {
              wealthMessage = `Your net worth is in the top 10% of American households. At this level estate planning, asset protection, and tax-efficient withdrawal strategies matter significantly. The biggest risk is not losing wealth through poor investment decisions but through taxes, liability, and failure to protect assets across generations.`
            }

            // Income vs wealth gap analysis
            let gapMessage: string
            if (!hasNetWorth) {
              gapMessage = ''
            } else {
              const gap = ip - wp
              if (gap > 20) {
                gapMessage = `Your income percentile (${ordinal(ip)}) is significantly higher than your wealth percentile (${ordinal(wp)}). This gap — common among high earners — typically means high spending relative to income. Closing it requires converting income into assets consistently. Every $1,000/month invested at 7% for 20 years becomes approximately $521,000.`
              } else if (gap < -20) {
                gapMessage = `Your wealth percentile (${ordinal(wp)}) is significantly higher than your income percentile (${ordinal(ip)}). This is a strong position — your assets are working hard relative to your income. This gap often reflects inheritance, a previous high-income period, real estate appreciation, or disciplined saving at a lower income level.`
              } else {
                gapMessage = `Your income and wealth percentiles are well-aligned — your assets reflect your earnings history. This balance suggests consistent saving behavior relative to your income level.`
              }
            }

            // Next actions by income tier
            let nextActions: string[]
            if (incomeTier === 'bottom') {
              nextActions = [
                'Focus on income growth first — skills, certifications, or job change with 20-30% raise have more impact than any expense cut at this level',
                'Eliminate all high-interest debt (credit cards, personal loans above 7%) before investing',
                'Contribute enough to your 401k to capture the full employer match — this is a 50-100% instant return',
                'Build a $1,000 starter emergency fund before anything else to avoid debt spiral from unexpected expenses',
              ]
            } else if (incomeTier === 'middle') {
              nextActions = [
                'Calculate your savings rate — target 25% or higher to reach FI within 30 years',
                'Max your HSA if you have a high-deductible health plan — triple tax advantage, best account available',
                'Automate a savings rate increase of 1% every 6 months — painless ratchet toward FI',
                'Use the Dayblip FI Date calculator to find your exact financial independence timeline',
              ]
            } else if (incomeTier === 'upper-middle') {
              nextActions = [
                'Max 401k ($23,500 in 2026) and HSA ($4,300 single) before taxable investing — significant tax drag reduction',
                'Calculate your true savings rate — income at your level often creates unconscious lifestyle inflation',
                'Model the FI date impact of keeping expenses flat for the next 3 years while income grows',
                'Consider backdoor Roth IRA if income exceeds direct contribution limits ($161,000 single in 2026)',
              ]
            } else if (incomeTier === 'top10') {
              nextActions = [
                'Max all tax-advantaged accounts first — 401k $23,500, HSA $4,300, backdoor Roth $7,000',
                'Review your effective tax rate — top 10% earners frequently overpay through poor timing of deductions',
                'Ensure investment portfolio is not concentrated — employer stock, single sector, or single geography',
                'Model sequence-of-returns risk if FI is within 10 years — bond tent or cash buffer strategy',
              ]
            } else {
              nextActions = [
                'Consult a fee-only fiduciary CFP for tax optimization at your income level — worth thousands annually',
                'Review income source diversification — high single-source income is concentration risk',
                'Ensure estate documents are current — will, trusts, beneficiary designations, power of attorney',
                'Model tax-efficient withdrawal sequence for retirement — Roth conversion ladder if applicable',
              ]
            }

            const borderColor = incomeTier === 'bottom' ? '#e94560'
              : incomeTier === 'middle' ? '#facc15'
              : incomeTier === 'upper-middle' ? '#4ade80'
              : incomeTier === 'top10' ? '#60a5fa'
              : '#a78bfa'

            const labelColor = borderColor

            return (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '16px',
                padding: '28px 28px 24px',
                margin: '32px 0 24px',
                borderLeft: `4px solid ${borderColor}`,
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '22px' }}>🧭</span>
                  <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                    Now What? Your Wealth Action Plan
                  </h3>
                </div>

                {/* Income assessment */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Income Assessment — {ordinal(ip)} Percentile
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {incomeMessage}
                  </p>
                </div>

                {/* Net worth assessment — only if entered */}
                {hasNetWorth && wealthMessage && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                      Wealth Assessment — {ordinal(wp)} Percentile
                    </p>
                    <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                      {wealthMessage}
                    </p>
                  </div>
                )}

                {/* Income vs wealth gap — only if net worth entered */}
                {hasNetWorth && gapMessage && (
                  <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                      ⚡ {gapMessage}
                    </p>
                  </div>
                )}

                {/* Next actions */}
                <div>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                    Your Next 4 Actions
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {nextActions.map((action, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: borderColor, fontSize: '14px', fontWeight: '800', minWidth: '20px', marginTop: '1px' }}>
                          {i + 1}.
                        </span>
                        <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                          {action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

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
