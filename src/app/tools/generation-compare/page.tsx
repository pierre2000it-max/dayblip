"use client"

import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Historical data ───────────────────────────────────────────────────────────

interface DecadeData {
  decade: number
  medianIncome: number
  inflationToday: number
  medianHomePrice: number
  homeToIncomeRatio: number
  gasPriceNominal: number
  collegeCostNominal: number
}

const DECADE_DATA: DecadeData[] = [
  { decade: 1960, medianIncome: 6800,   inflationToday: 10.9, medianHomePrice: 11900,  homeToIncomeRatio: 1.75, gasPriceNominal: 0.31, collegeCostNominal: 200  },
  { decade: 1970, medianIncome: 11200,  inflationToday: 8.1,  medianHomePrice: 17000,  homeToIncomeRatio: 1.52, gasPriceNominal: 0.36, collegeCostNominal: 394  },
  { decade: 1980, medianIncome: 20100,  inflationToday: 3.9,  medianHomePrice: 47200,  homeToIncomeRatio: 2.35, gasPriceNominal: 1.22, collegeCostNominal: 804  },
  { decade: 1990, medianIncome: 28400,  inflationToday: 2.4,  medianHomePrice: 79100,  homeToIncomeRatio: 2.78, gasPriceNominal: 1.15, collegeCostNominal: 1908 },
  { decade: 2000, medianIncome: 37800,  inflationToday: 1.8,  medianHomePrice: 119600, homeToIncomeRatio: 3.16, gasPriceNominal: 1.51, collegeCostNominal: 3510 },
  { decade: 2010, medianIncome: 43200,  inflationToday: 1.4,  medianHomePrice: 221800, homeToIncomeRatio: 5.14, gasPriceNominal: 2.78, collegeCostNominal: 7605 },
  { decade: 2020, medianIncome: 51800,  inflationToday: 1.2,  medianHomePrice: 329000, homeToIncomeRatio: 6.35, gasPriceNominal: 2.17, collegeCostNominal: 10560},
  { decade: 2026, medianIncome: 55000,  inflationToday: 1.0,  medianHomePrice: 420000, homeToIncomeRatio: 7.64, gasPriceNominal: 3.41, collegeCostNominal: 11600},
]

const CURRENT_HOME_PRICE = 420000
const CURRENT_GAS        = 3.41
const CURRENT_COLLEGE    = 11600
const CURRENT_INCOME_MED = 55000

function getDecadeData(year: number): DecadeData {
  const decade = Math.floor(year / 10) * 10
  return DECADE_DATA.find(d => d.decade === decade) ?? DECADE_DATA[3]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number, prefix = "$"): string {
  return `${prefix}${Math.round(n).toLocaleString("en-US")}`
}

function fmtSign(pct: number): string {
  return pct >= 0 ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GenerationComparePage() {
  const [age,        setAge]        = useState("32")
  const [income,     setIncome]     = useState("65000")
  const [birthYear,  setBirthYear]  = useState("1994")
  const [hasResult,  setHasResult]  = useState(false)

  function calculate() { setHasResult(true) }

  const incomeNum     = parseInt(income)     || 65000
  const birthYearNum  = parseInt(birthYear)  || 1994

  // Parents were roughly 28-32 when user was born → they reached user's current age ~28-32 years before
  const parentAgeYear = birthYearNum - 2  // approx year parents were at user's current age when user was young
  const parentsDecadeData = getDecadeData(parentAgeYear)

  const parentIncomeNominal = parentsDecadeData.medianIncome
  const parentIncomeToday   = parentIncomeNominal * parentsDecadeData.inflationToday

  const incomeDiffPct = ((incomeNum / parentIncomeToday) - 1) * 100

  const yourHomeRatio   = CURRENT_HOME_PRICE / incomeNum
  const parentHomeRatio = parentsDecadeData.homeToIncomeRatio
  const homeHarderRatio = yourHomeRatio / parentHomeRatio

  const parentGasToday    = parentsDecadeData.gasPriceNominal * parentsDecadeData.inflationToday
  const gasPctChange      = ((CURRENT_GAS / parentGasToday) - 1) * 100

  const parentCollegeToday  = parentsDecadeData.collegeCostNominal * parentsDecadeData.inflationToday
  const collegePctChange    = ((CURRENT_COLLEGE / parentCollegeToday) - 1) * 100

  const parentHomePriceToday = parentsDecadeData.medianHomePrice * parentsDecadeData.inflationToday
  const homePricePctChange   = ((CURRENT_HOME_PRICE / parentHomePriceToday) - 1) * 100

  const incomeEarnsMore = incomeDiffPct >= 0
  const homesHarder     = homeHarderRatio > 1.1

  let contextMsg = ""
  if (incomeEarnsMore && !homesHarder) {
    contextMsg = "Your generation is genuinely ahead financially compared to your parents at the same age. This is relatively rare — congratulations."
  } else if (incomeEarnsMore && homesHarder) {
    contextMsg = "You out-earn your parents generation in real terms but housing costs have risen faster than wages making homeownership harder despite higher nominal income."
  } else {
    contextMsg = "Your generation faces a genuine earnings gap compared to your parents generation adjusted for inflation. This is the reality for many people born after 1980 particularly in high-cost areas."
  }

  const shareMore = incomeEarnsMore
    ? `My generation earns ${Math.abs(incomeDiffPct).toFixed(0)}% MORE than my parents did at my age adjusted for inflation.`
    : `My generation earns ${Math.abs(incomeDiffPct).toFixed(0)}% LESS than my parents did at my age adjusted for inflation.`
  const shareText = `${shareMore} But homes cost ${yourHomeRatio.toFixed(1)}x our annual income vs ${parentHomeRatio.toFixed(1)}x for their generation. Compare your generation free:`

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#1a1a2e",
    border: "1px solid #0f3460",
    borderRadius: 6,
    padding: "10px 12px",
    color: "#ffffff",
    fontSize: 15,
    boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#a8a8b3",
    marginBottom: 6,
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Generation Salary Comparison",
          "Compare your income and home affordability to your parents generation at the same age",
          "https://www.dayblip.com/tools/generation-compare",
          "FinanceApplication"
        ),
        faqSchema([
          {
            question: "Are millennials earning more than their parents?",
            answer: "Millennials earn higher nominal wages than their parents did at the same age but lower wages in real inflation-adjusted terms in many cases. A 32-year-old in 2026 earning $65,000 earns about 18% less in real purchasing power than a 32-year-old in 1990 earned. Meanwhile median home prices have risen from 2.78 times annual income in 1990 to 7.64 times in 2026 — making homeownership significantly harder despite higher nominal wages.",
          },
          {
            question: "Is it harder to buy a house today than it was for previous generations?",
            answer: "Yes, significantly harder by most measures. In 1970 the median US home cost 1.52 times the median annual income. By 2026 that ratio has risen to 7.64 times median income. In high-cost states like California the ratio exceeds 12 times median income. This means a family today needs to save for many more years to afford a down payment than families did in the 1970s or 1980s.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Generation Comparison", url: "https://www.dayblip.com/tools/generation-compare" },
        ]),
      ]} />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧬</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, lineHeight: 1.2, maxWidth: 760, margin: "0 auto 16px" }}>
          Generation Salary Comparison — Are You Doing Better Than Your Parents at the Same Age?
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
          Inflation-adjusted · Real purchasing power · Housing affordability ratio · Free
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 0" }}>
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Generation Comparison" },
        ]} />

        {/* Quick Answer */}
        <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ color: "#e94560", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            QUICK ANSWER
          </div>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            A median-income 30-year-old in 2026 earns $55,000 per year. In 1990 the median 30-year-old earned $28,400 —
            which equals $68,160 in 2026 dollars. Today&apos;s 30-year-old earns 19% less in real purchasing power than their
            parents did at the same age. Meanwhile the median home now costs 7.64 times the median annual income versus
            2.78 times in 1990. Homes are 2.7 times harder to afford.
          </p>
        </div>

        <p style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
          This calculator compares your current financial situation to the typical situation of your parents generation
          at the same age, adjusted for inflation and purchasing power. It uses Bureau of Labor Statistics historical
          wage data, US Census median income figures, and Federal Reserve housing cost data to make the comparison as
          accurate as possible.
        </p>
      </div>

      {/* Calculator */}
      <div style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            Compare My Generation
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle} htmlFor="gc-age">Your current age</label>
              <input id="gc-age" type="number" min={18} max={70} value={age} onChange={e => setAge(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="gc-income">Your annual income ($)</label>
              <input id="gc-income" type="number" min={0} value={income} onChange={e => setIncome(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="gc-birth">Year you were born</label>
              <input id="gc-birth" type="number" min={1940} max={2005} value={birthYear} onChange={e => setBirthYear(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#a8a8b3", fontSize: 13 }}>
            Parents generation reference year: <strong style={{ color: "#4FC3F7" }}>{parentsDecadeData.decade}s</strong> — when they were approximately your age
          </div>

          <button
            onClick={calculate}
            style={{
              background: "#e94560", color: "#fff", border: "none",
              borderRadius: 8, padding: "14px 32px", fontSize: 16, fontWeight: 700,
              cursor: "pointer", width: "100%", marginBottom: 32,
            }}
          >
            Compare My Generation
          </button>

          {hasResult && (
            <div>
              {/* Income comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div style={{
                  background: incomeEarnsMore ? "#0d2a1a" : "#2a0d0d",
                  border: `2px solid ${incomeEarnsMore ? "#22c55e" : "#e94560"}`,
                  borderRadius: 12, padding: 20,
                }}>
                  <div style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 4 }}>Income comparison</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Your income: {fmt(incomeNum)}</div>
                  <div style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 8 }}>
                    Parents at same age: {fmt(parentIncomeToday)} <span style={{ fontSize: 11 }}>(in today&apos;s dollars)</span>
                  </div>
                  <div style={{ color: incomeEarnsMore ? "#22c55e" : "#e94560", fontWeight: 800, fontSize: 18 }}>
                    {incomeEarnsMore ? "✅" : "⚠️"} You earn {Math.abs(incomeDiffPct).toFixed(1)}% {incomeEarnsMore ? "MORE" : "LESS"}
                  </div>
                  <div style={{ color: "#a8a8b3", fontSize: 12, marginTop: 4 }}>
                    than your parents did at your age in today&apos;s dollars
                  </div>
                </div>

                <div style={{
                  background: homesHarder ? "#2a0d0d" : "#0d2a1a",
                  border: `2px solid ${homesHarder ? "#e94560" : "#22c55e"}`,
                  borderRadius: 12, padding: 20,
                }}>
                  <div style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 4 }}>Home affordability</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                    Today: {yourHomeRatio.toFixed(1)}x your income
                  </div>
                  <div style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 8 }}>
                    Parents&apos; era: {parentHomeRatio.toFixed(2)}x their income
                  </div>
                  <div style={{ color: homesHarder ? "#e94560" : "#22c55e", fontWeight: 800, fontSize: 18 }}>
                    {homesHarder ? "🏠 Homes are " : "🏠 Homes are "}
                    {homeHarderRatio.toFixed(1)}x {homesHarder ? "HARDER" : "easier"}
                  </div>
                  <div style={{ color: "#a8a8b3", fontSize: 12, marginTop: 4 }}>
                    to afford than when your parents were your age
                  </div>
                </div>
              </div>

              {/* Context */}
              <div style={{ background: "#1e2d4a", borderRadius: 12, padding: 16, marginBottom: 20, borderLeft: "4px solid #4FC3F7" }}>
                <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {contextMsg}
                </p>
              </div>

              {/* Comparison table */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ background: "#0f3460", padding: "10px 16px" }}>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>
                    Side-by-Side Comparison: {parentsDecadeData.decade}s vs 2026
                  </h3>
                </div>

                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr", gap: 0, padding: "8px 16px", borderBottom: "1px solid #0f3460" }}>
                  {["Category", `${parentsDecadeData.decade}s (in today's $)`, "2026", "Change"].map(h => (
                    <div key={h} style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 700 }}>{h}</div>
                  ))}
                </div>

                {[
                  {
                    label:   "Median income at ~30",
                    parentNominal: fmt(parentIncomeNominal),
                    parentToday:   fmt(parentIncomeToday),
                    current:       fmt(CURRENT_INCOME_MED),
                    pct:           ((CURRENT_INCOME_MED / parentIncomeToday) - 1) * 100,
                  },
                  {
                    label:   "Median home price",
                    parentNominal: fmt(parentsDecadeData.medianHomePrice),
                    parentToday:   fmt(parentHomePriceToday),
                    current:       fmt(CURRENT_HOME_PRICE),
                    pct:           homePricePctChange,
                  },
                  {
                    label:   "Home / income ratio",
                    parentNominal: `${parentHomeRatio.toFixed(2)}x`,
                    parentToday:   `${parentHomeRatio.toFixed(2)}x`,
                    current:       `${(CURRENT_HOME_PRICE / CURRENT_INCOME_MED).toFixed(2)}x`,
                    pct:           ((CURRENT_HOME_PRICE / CURRENT_INCOME_MED) / parentHomeRatio - 1) * 100,
                  },
                  {
                    label:   "College (4yr public/yr)",
                    parentNominal: fmt(parentsDecadeData.collegeCostNominal),
                    parentToday:   fmt(parentCollegeToday),
                    current:       fmt(CURRENT_COLLEGE),
                    pct:           collegePctChange,
                  },
                  {
                    label:   "Gas price per gallon",
                    parentNominal: `$${parentsDecadeData.gasPriceNominal.toFixed(2)}`,
                    parentToday:   `$${parentGasToday.toFixed(2)}`,
                    current:       `$${CURRENT_GAS.toFixed(2)}`,
                    pct:           gasPctChange,
                  },
                ].map(row => (
                  <div key={row.label} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr", gap: 0, padding: "10px 16px", borderBottom: "1px solid #0f3460" }}>
                    <div style={{ color: "#e8e8e8", fontSize: 13 }}>{row.label}</div>
                    <div style={{ color: "#a8a8b3", fontSize: 13 }}>
                      {row.parentToday}
                      <div style={{ color: "#666", fontSize: 11 }}>nominal: {row.parentNominal}</div>
                    </div>
                    <div style={{ color: "#e8e8e8", fontSize: 13, fontWeight: 600 }}>{row.current}</div>
                    <div style={{ color: row.pct >= 0 ? "#e94560" : "#22c55e", fontSize: 13, fontWeight: 700 }}>
                      {fmtSign(row.pct)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#16213e", borderRadius: 10, padding: "12px 16px", color: "#a8a8b3", fontSize: 12, lineHeight: 1.6 }}>
                Sources: US Census Bureau median income data · Bureau of Labor Statistics CPI · Federal Reserve housing price index ·
                US Department of Education college cost data · EIA gasoline price data. Historical figures adjusted to 2026 dollars using BLS inflation multipliers.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share + Related */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 48px" }}>
        <ShareButtons
          text={hasResult ? shareText : "Are you doing better or worse than your parents at the same age? Compare adjusted for inflation free:"}
          url="https://www.dayblip.com/tools/generation-compare"
          title="Generation Salary Comparison"
        />
        <div style={{ marginTop: 40 }}>
          <RelatedTools tools={[
            { emoji: "🇺🇸", title: "American Dream Calculator", desc: "How long to achieve the American Dream?",     href: "/tools/american-dream-calculator" },
            { emoji: "🏙️", title: "Cost of Living Comparison", desc: "Compare costs between any two cities",         href: "/finance/cost-of-living" },
            { emoji: "🧬", title: "Generation Quiz",            desc: "Which generation do you really belong to?",   href: "/tools/generation-quiz" },
            { emoji: "💰", title: "True Hourly Wage",           desc: "What your job really pays per hour",          href: "/tools/true-hourly-wage" },
          ]} />
        </div>
      </div>
    </div>
  )
}
