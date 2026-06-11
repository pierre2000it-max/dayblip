"use client"

import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Styles ────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function getTermRecommendation(age: number): string {
  if (age < 35) return "30-year term recommended"
  if (age < 45) return "20-year term recommended"
  if (age < 55) return "15-year term recommended"
  return "10-year term or whole life"
}

interface PremiumEstimate {
  low: number
  high: number
}

function getPremiumEstimate(age: number, coverage: number): { range: PremiumEstimate; bracket: string } {
  const bracket = age < 35 ? "25–34" : age < 45 ? "35–44" : age < 55 ? "45–54" : "55+"
  const table: Record<string, Record<string, PremiumEstimate>> = {
    "25–34": { "250k": { low: 13, high: 18 }, "500k": { low: 20, high: 28 }, "1m": { low: 35, high: 50 } },
    "35–44": { "250k": { low: 18, high: 25 }, "500k": { low: 30, high: 40 }, "1m": { low: 55, high: 75 } },
    "45–54": { "250k": { low: 40, high: 60 }, "500k": { low: 70, high: 100 }, "1m": { low: 130, high: 185 } },
    "55+":   { "250k": { low: 80, high: 130 }, "500k": { low: 150, high: 220 }, "1m": { low: 280, high: 400 } },
  }
  const tier = coverage <= 300000 ? "250k" : coverage <= 750000 ? "500k" : "1m"
  const row = table[bracket]?.[tier] ?? { low: 0, high: 0 }
  // scale if coverage differs significantly from tier midpoint
  const tierMid = tier === "250k" ? 250000 : tier === "500k" ? 500000 : 1000000
  const scale = coverage / tierMid
  return {
    bracket,
    range: {
      low: Math.round(row.low * scale),
      high: Math.round(row.high * scale),
    },
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LifeInsuranceCalculatorPage() {
  const [tab, setTab]                   = useState<"quick" | "dime">("quick")

  // Quick tab
  const [qIncome, setQIncome]           = useState("75000")
  const [qMultiple, setQMultiple]       = useState(10)
  const [qDependents, setQDependents]   = useState("2")

  // DIME tab
  const [debt, setDebt]                 = useState("25000")
  const [dIncome, setDIncome]           = useState("75000")
  const [years, setYears]               = useState("15")
  const [existingCoverage, setExistingCoverage] = useState("0")
  const [mortgage, setMortgage]         = useState("280000")
  const [children, setChildren]         = useState("2")
  const [collegeGoal, setCollegeGoal]   = useState("60000")
  const [savings, setSavings]           = useState("30000")
  const [spouseIncome, setSpouseIncome] = useState("0")
  const [age, setAge]                   = useState("35")
  const [showDimeResult, setShowDimeResult] = useState(false)

  // ── Quick calc ──────────────────────────────────────────────────────────────
  const quickCoverage = (parseFloat(qIncome) || 0) * qMultiple

  // ── DIME calc ───────────────────────────────────────────────────────────────
  const D = parseFloat(debt) || 0
  const annIncome = parseFloat(dIncome) || 0
  const yrs = parseFloat(years) || 15
  const spouseInc = parseFloat(spouseIncome) || 0
  const I = Math.max(0, annIncome * yrs * 0.7 - spouseInc * yrs * 0.5)
  const M = parseFloat(mortgage) || 0
  const E = (parseFloat(children) || 0) * (parseFloat(collegeGoal) || 0)
  const grossNeed = D + I + M + E
  const existSavings = parseFloat(savings) || 0
  const existCoverage = parseFloat(existingCoverage) || 0
  const netNeed = Math.max(0, grossNeed - existSavings - existCoverage)

  const ageNum = parseFloat(age) || 35
  const termRec = getTermRecommendation(ageNum)
  const premEst = getPremiumEstimate(ageNum, netNeed)

  const shareText = showDimeResult
    ? `I calculated I need ${fmt(netNeed)} in life insurance coverage using the DIME method. Most Americans are underinsured by $200,000. Calculate yours free:`
    : `The standard rule is 10-12x your income in life insurance. Calculate exactly how much you need free:`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Life Insurance Need Calculator",
          "Calculate exactly how much life insurance coverage you need using the DIME method",
          "https://www.dayblip.com/tools/life-insurance-calculator",
          "FinanceApplication"
        ),
        faqSchema([
          {
            question: "How much life insurance do I need?",
            answer: "The standard rule is 10-12 times your annual income. A more precise calculation uses the DIME method: add up Debt payoff plus Income replacement for 10-20 years at 70% of salary plus Mortgage balance plus Education costs for children then subtract existing savings and current coverage. A person earning $75,000 with a $280,000 mortgage two children and $25,000 in debt typically needs $800,000 to $1,200,000 in coverage.",
          },
          {
            question: "What is term life insurance?",
            answer: "Term life insurance provides coverage for a specific period — typically 10, 20, or 30 years. It pays a death benefit if you die during the term. It does not build cash value. Term life is the most affordable type and is recommended for most families needing income replacement during working years. A healthy 35-year-old can get $500,000 in 20-year term coverage for approximately $25-35 per month.",
          },
          {
            question: "What is the DIME method for life insurance?",
            answer: "DIME stands for Debt, Income, Mortgage, and Education. Add total non-mortgage debt plus 10-15 years of income replacement at 70% plus your remaining mortgage balance plus college education costs for each child. Subtract existing savings and current life insurance. The result is your coverage gap — how much additional life insurance you need.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Life Insurance Calculator", url: "https://www.dayblip.com/tools/life-insurance-calculator" },
        ]),
      ]} />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, lineHeight: 1.2, maxWidth: 760, margin: "0 auto 16px" }}>
          Life Insurance Calculator — How Much Life Insurance Do You Actually Need?
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 16, maxWidth: 580, margin: "0 auto" }}>
          DIME method + quick estimate · Free · No signup · No sales pitch
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 0" }}>
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Life Insurance Calculator" },
        ]} />

        {/* Quick Answer */}
        <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ color: "#e94560", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            QUICK ANSWER
          </div>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            The standard rule of thumb is 10–12 times your annual income in life insurance coverage. A person earning
            $75,000 per year needs $750,000 to $900,000 in coverage. However a more precise calculation adds up income
            replacement for 10–20 years plus mortgage payoff plus education costs for children minus existing savings.
            The average American is underinsured by $200,000 according to LIMRA research.
          </p>
        </div>

        <p style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
          Life insurance need is calculated by estimating the financial gap your death would create for dependents.
          The DIME method covers four factors: Debt payoff, Income replacement, Mortgage payoff, and Education costs
          for children. A term life policy covering this full amount ensures your family maintains their lifestyle
          and meets major financial goals without your income.
        </p>
      </div>

      {/* Calculator */}
      <div style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            Calculate Your Coverage Need
          </h2>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            {(["quick", "dime"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  background: tab === t ? "#e94560" : "#1a1a2e",
                  color: tab === t ? "#fff" : "#a8a8b3",
                  transition: "all 0.15s",
                }}
              >
                {t === "quick" ? "Simple 10x Rule" : "Precise DIME Method"}
              </button>
            ))}
          </div>

          {/* Quick Tab */}
          {tab === "quick" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle} htmlFor="lic-income">Annual income ($)</label>
                  <input id="lic-income" type="number" value={qIncome} onChange={e => setQIncome(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="lic-deps">Number of dependents</label>
                  <input id="lic-deps" type="number" min={0} value={qDependents} onChange={e => setQDependents(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ ...labelStyle, marginBottom: 12 }}>
                  Coverage multiple: <span style={{ color: "#F9A825", fontWeight: 800 }}>{qMultiple}x</span>
                </label>
                <input
                  type="range" min={5} max={20} step={1} value={qMultiple}
                  onChange={e => setQMultiple(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#e94560" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", color: "#a8a8b3", fontSize: 12, marginTop: 4 }}>
                  <span>5x (minimum)</span>
                  <span>10x (standard)</span>
                  <span>20x (maximum)</span>
                </div>
              </div>

              <div style={{ background: "#1a1a2e", border: "1px solid #22c55e", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                <div style={{ color: "#a8a8b3", fontSize: 14, marginBottom: 8 }}>Recommended coverage</div>
                <div style={{ color: "#22c55e", fontSize: 36, fontWeight: 800 }}>
                  {fmt(quickCoverage)}
                </div>
                <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
                  At {qMultiple}x income your family is covered for approximately {qMultiple} years of income replacement.
                  {parseInt(qDependents) > 0 && ` For ${qDependents} dependent${parseInt(qDependents) > 1 ? "s" : ""}, consider the full DIME method for a more precise number.`}
                </p>
                <p style={{ color: "#F9A825", fontSize: 14, marginTop: 8 }}>
                  For a more precise calculation, use the DIME Method tab above.
                </p>
              </div>
            </div>
          )}

          {/* DIME Tab */}
          {tab === "dime" && (
            <div>
              {/* Age */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle} htmlFor="lic-age">Your current age</label>
                <input id="lic-age" type="number" min={18} max={80} value={age} onChange={e => setAge(e.target.value)} style={{ ...inputStyle, maxWidth: 200 }} />
              </div>

              {/* D — Debt */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: "#4FC3F7", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  D — Debt
                </div>
                <div>
                  <label style={labelStyle} htmlFor="lic-debt">Total non-mortgage debt ($) <span style={{ color: "#a8a8b3", fontWeight: 400 }}>(credit cards, car loans, etc.)</span></label>
                  <input id="lic-debt" type="number" min={0} value={debt} onChange={e => setDebt(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* I — Income */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: "#4FC3F7", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  I — Income Replacement
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  <div>
                    <label style={labelStyle} htmlFor="lic-dinc">Annual income ($)</label>
                    <input id="lic-dinc" type="number" min={0} value={dIncome} onChange={e => setDIncome(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="lic-yrs">Years of income to replace</label>
                    <input id="lic-yrs" type="number" min={1} max={30} value={years} onChange={e => setYears(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="lic-spouse">Spouse income ($) <span style={{ color: "#a8a8b3", fontWeight: 400 }}>(if applicable)</span></label>
                    <input id="lic-spouse" type="number" min={0} value={spouseIncome} onChange={e => setSpouseIncome(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="lic-excov">Existing life insurance ($)</label>
                    <input id="lic-excov" type="number" min={0} value={existingCoverage} onChange={e => setExistingCoverage(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* M — Mortgage */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: "#4FC3F7", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  M — Mortgage
                </div>
                <div>
                  <label style={labelStyle} htmlFor="lic-mort">Mortgage balance remaining ($)</label>
                  <input id="lic-mort" type="number" min={0} value={mortgage} onChange={e => setMortgage(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* E — Education */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ color: "#4FC3F7", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  E — Education
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  <div>
                    <label style={labelStyle} htmlFor="lic-kids">Number of children</label>
                    <input id="lic-kids" type="number" min={0} max={10} value={children} onChange={e => setChildren(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="lic-college">College savings goal per child ($)</label>
                    <input id="lic-college" type="number" min={0} value={collegeGoal} onChange={e => setCollegeGoal(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Existing Assets */}
              <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 10, padding: 16, marginBottom: 24 }}>
                <div style={{ color: "#4FC3F7", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  Existing Assets (reduces need)
                </div>
                <div>
                  <label style={labelStyle} htmlFor="lic-sav">Current savings and investments ($)</label>
                  <input id="lic-sav" type="number" min={0} value={savings} onChange={e => setSavings(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <button
                onClick={() => setShowDimeResult(true)}
                style={{
                  background: "#e94560",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 32px",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  width: "100%",
                  marginBottom: 24,
                }}
              >
                Calculate My Coverage Need
              </button>

              {showDimeResult && (
                <div>
                  {/* Main result */}
                  <div style={{ background: "#1a1a2e", border: `2px solid ${netNeed > 0 ? "#e94560" : "#22c55e"}`, borderRadius: 12, padding: 24, marginBottom: 16, textAlign: "center" }}>
                    <div style={{ color: "#a8a8b3", fontSize: 14, marginBottom: 8 }}>Net Coverage Needed</div>
                    <div style={{ color: netNeed > 0 ? "#e94560" : "#22c55e", fontSize: 40, fontWeight: 800 }}>
                      {fmt(netNeed)}
                    </div>
                    {netNeed === 0 && (
                      <p style={{ color: "#22c55e", fontSize: 14, marginTop: 8 }}>
                        Your existing savings and coverage appear sufficient based on these inputs.
                      </p>
                    )}
                  </div>

                  {/* Breakdown */}
                  <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Coverage Breakdown</h3>
                    {[
                      { label: "D — Debt payoff", value: D, positive: true },
                      { label: `I — Income replacement (${Math.round(yrs)} years at 70%)`, value: I, positive: true },
                      { label: "M — Mortgage payoff", value: M, positive: true },
                      { label: `E — Education fund (${children} children × ${fmt(parseFloat(collegeGoal)||0)})`, value: E, positive: true },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #0f3460" }}>
                        <span style={{ color: "#a8a8b3", fontSize: 14 }}>{row.label}</span>
                        <span style={{ color: "#e8e8e8", fontWeight: 700 }}>{fmt(row.value)}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #0f3460" }}>
                      <span style={{ color: "#e8e8e8", fontWeight: 700 }}>Gross need</span>
                      <span style={{ color: "#e8e8e8", fontWeight: 700 }}>{fmt(grossNeed)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0f3460" }}>
                      <span style={{ color: "#a8a8b3", fontSize: 14 }}>Minus existing savings</span>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>−{fmt(existSavings)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "2px solid #e94560" }}>
                      <span style={{ color: "#a8a8b3", fontSize: 14 }}>Minus existing coverage</span>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>−{fmt(existCoverage)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0" }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Net coverage needed</span>
                      <span style={{ color: "#e94560", fontWeight: 800, fontSize: 18 }}>{fmt(netNeed)}</span>
                    </div>
                  </div>

                  {/* Term recommendation */}
                  <div style={{ background: "#1e2d4a", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <div style={{ color: "#4FC3F7", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                      Term Length Recommendation
                    </div>
                    <div style={{ color: "#fff", fontWeight: 700 }}>
                      Age {ageNum}: {termRec}
                    </div>
                    <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                      Choose a term that covers your {Math.round(yrs)}-year income replacement window plus any mortgage years remaining.
                    </p>
                  </div>

                  {/* Premium estimate */}
                  {netNeed > 0 && (
                    <div style={{ background: "#1a1a2e", border: "1px solid #F9A825", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ color: "#F9A825", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                        Estimated Monthly Premium (Ages {premEst.bracket}, healthy nonsmoker)
                      </div>
                      <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>
                        ~${premEst.range.low}–${premEst.range.high}/month
                      </div>
                      <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
                        for approximately {fmt(netNeed)} in term life coverage.
                      </p>
                      <div style={{ background: "#16213e", borderRadius: 8, padding: "10px 12px", marginTop: 12, color: "#a8a8b3", fontSize: 12, lineHeight: 1.6 }}>
                        <strong style={{ color: "#e94560" }}>Disclaimer:</strong> These are educational estimates for planning purposes only.
                        Actual premiums vary based on health history, lifestyle, occupation, and insurer.
                        Consult a licensed insurance professional for personalized advice.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share + Related */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 48px" }}>
        <ShareButtons
          text={shareText}
          url="https://www.dayblip.com/tools/life-insurance-calculator"
          title="Life Insurance Calculator"
        />
        <div style={{ marginTop: 40 }}>
          <RelatedTools tools={[
            { emoji: "📊", title: "Net Worth Calculator",  desc: "Your complete financial picture",      href: "/finance/net-worth" },
            { emoji: "💯", title: "Financial Life Score",  desc: "Rate your overall financial health",   href: "/tools/financial-life-score" },
            { emoji: "🏖️", title: "FI Date Calculator",    desc: "When can you stop working?",           href: "/tools/fi-date" },
            { emoji: "💸", title: "Debt Freedom Date",     desc: "When will you be completely debt free?", href: "/tools/debt-freedom" },
          ]} />
        </div>
      </div>
    </div>
  )
}
