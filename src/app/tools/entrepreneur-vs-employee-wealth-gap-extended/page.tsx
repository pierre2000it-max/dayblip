"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── constants ──────────────────────────────────────────────────────────────────

const EMP_TAX        = 0.28
const ENT_TAX        = 0.25
const CONTRIB_RATE   = 0.10
const EMP_RETURN     = 0.07
const BIZ_RETURN     = 0.09

// ── math ──────────────────────────────────────────────────────────────────────

function totalIncome(annual: number, years: number): number {
  return annual * years
}

function project401k(salary: number, years: number): number {
  const annual = salary * CONTRIB_RATE
  return annual * ((Math.pow(1 + EMP_RETURN, years) - 1) / EMP_RETURN)
}

function projectBizEquity(
  bizIncome: number,
  marginPct: number,
  reinvestPct: number,
  taxRate: number,
  years: number,
): number {
  const profit      = bizIncome * (marginPct / 100)
  const afterTax    = profit * (1 - taxRate)
  const reinvested  = afterTax * (reinvestPct / 100)
  // compound reinvestment annually at 9%
  return reinvested * ((Math.pow(1 + BIZ_RETURN, years) - 1) / BIZ_RETURN)
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n).toLocaleString()}`
}

function verdict(gap: number): string {
  if (gap < 500_000)   return "The gap is real but the paths are closer than most people think. Execution is the differentiator."
  if (gap < 1_000_000) return "The entrepreneur path builds significantly more wealth over this timeline. The difference is not luck — it is structure."
  if (gap < 2_000_000) return "You are looking at a life-changing gap. One path builds income. The other builds an asset."
  return "The wealth gap between these two paths over your working years is not a rounding error. It is a different financial life."
}

type Results = {
  years: number
  // employee
  empGross:    number
  empTaxes:    number
  empTakeHome: number
  emp401k:     number
  empTotal:    number
  // entrepreneur
  entGross:    number
  entTaxes:    number
  entTakeHome: number
  entEquity:   number
  entTotal:    number
  // gap
  fullGap:     number
  verdict:     string
}

const TOOL_URL = "https://www.dayblip.com/tools/entrepreneur-vs-employee-wealth-gap-extended"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Entrepreneur vs Employee Wealth Gap Extended",
      url: TOOL_URL,
      description: "The advanced model. Compare lifetime wealth across the employee and entrepreneur paths including tax drag, reinvestment, and business equity growth.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author:    { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
      publisher: { "@type": "Person",       name: "Pierre Herve, MBA" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Why do business owners pay a lower effective tax rate than employees?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Business owners can deduct a wide range of expenses that employees cannot — home office, vehicle use, equipment, professional development, health insurance premiums, and retirement contributions above the standard 401k limit. This typically reduces their effective tax rate by 3–8 percentage points compared to a salaried employee at the same gross income level.",
          },
        },
        {
          "@type": "Question",
          name: "What is business reinvestment and why does it compound at a higher rate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Business reinvestment is profit put back into the business — hiring, marketing, systems, or new revenue streams — rather than taken as personal income. Unlike passive index fund investing, reinvested business capital is often deployed into high-return activities where the business owner has an information advantage. A 9% assumed return reflects this premium over the long-run market average of ~7%.",
          },
        },
        {
          "@type": "Question",
          name: "How is business equity calculated in this tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Business equity here represents the compounded value of consistently reinvested after-tax profits. Each year, the specified percentage of after-tax profit is treated as a reinvestment contribution, compounded at 9% annually. This models the equity value built through retained earnings and growth capital — not a formal business valuation.",
          },
        },
      ],
    },
  ],
}

// ── input style ───────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#0d1b2a",
  border: "2px solid #0f3460",
  borderRadius: 10,
  color: "#ffffff",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
}

function PathCard({
  title, border, rows, total, totalLabel,
}: {
  title: string
  border: string
  rows: { label: string; value: string; sub?: boolean; dim?: boolean }[]
  total: string
  totalLabel: string
}) {
  return (
    <div style={{
      background: "#1e2d4a",
      borderRadius: 14,
      border: `2px solid ${border}`,
      padding: "22px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      <p style={{
        color: border === "#f97316" ? "#f97316" : "#a8a8b3",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 18,
      }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 10,
            borderBottom: i < rows.length - 1 ? "1px solid #0f3460" : "none",
            paddingLeft: r.sub ? 12 : 0,
          }}>
            <span style={{ color: r.dim ? "#6b7280" : "#a8a8b3", fontSize: r.sub ? 12 : 13 }}>
              {r.label}
            </span>
            <span style={{ color: "#e2e8f0", fontSize: r.sub ? 12 : 14, fontWeight: r.sub ? 400 : 600 }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        background: "#0d1b2a",
        borderRadius: 10,
        padding: "14px 16px",
        textAlign: "center",
      }}>
        <p style={{ color: "#a8a8b3", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          {totalLabel}
        </p>
        <p style={{
          color: border === "#f97316" ? "#f97316" : "#e2e8f0",
          fontSize: "clamp(18px,4vw,24px)",
          fontWeight: 900,
          lineHeight: 1,
        }}>
          {total}
        </p>
      </div>
    </div>
  )
}

// ── component ─────────────────────────────────────────────────────────────────

export default function EntrepreneurVsEmployeeExtendedPage() {
  const [salary,    setSalary]    = useState("")
  const [bizIncome, setBizIncome] = useState("")
  const [age,       setAge]       = useState("")
  const [fiAge,     setFiAge]     = useState("")
  const [margin,    setMargin]    = useState("30")
  const [reinvest,  setReinvest]  = useState("40")
  const [results,   setResults]   = useState<Results | null>(null)

  useEffect(() => {
    const sal  = parseFloat(salary.replace(/,/g, ""))
    const biz  = parseFloat(bizIncome.replace(/,/g, ""))
    const a    = parseInt(age,   10)
    const fi   = parseInt(fiAge, 10)
    const marg = parseFloat(margin)  || 30
    const rei  = parseFloat(reinvest) || 40

    if (isNaN(sal) || sal <= 0) { setResults(null); return }
    if (isNaN(biz) || biz <= 0) { setResults(null); return }
    if (isNaN(a)   || a < 18  ) { setResults(null); return }
    if (isNaN(fi)  || fi <= a  ) { setResults(null); return }

    const years = fi - a

    // Employee
    const empGross    = totalIncome(sal, years)
    const empTaxes    = empGross * EMP_TAX
    const empTakeHome = empGross - empTaxes
    const emp401k     = project401k(sal, years)
    const empTotal    = empTakeHome + emp401k

    // Entrepreneur
    const entGross    = totalIncome(biz, years)
    const entTaxes    = entGross * ENT_TAX
    const entTakeHome = entGross - entTaxes
    const entEquity   = projectBizEquity(biz, marg, rei, ENT_TAX, years)
    const entTotal    = entTakeHome + entEquity

    const fullGap = Math.max(0, entTotal - empTotal)

    setResults({
      years,
      empGross, empTaxes, empTakeHome, emp401k, empTotal,
      entGross, entTaxes, entTakeHome, entEquity, entTotal,
      fullGap,
      verdict: verdict(fullGap),
    })
  }, [salary, bizIncome, age, fiAge, margin, reinvest])

  const shareText = `I ran the full entrepreneur vs employee wealth gap model. The extended math is eye-opening: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .ext-input:focus { border-color: #f97316 !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section style={{
          padding: "56px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)",
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{
              display: "inline-block",
              background: "#1e2d4a",
              border: "1px solid #f97316",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              color: "#f97316",
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              Extended Edition
            </div>
            <h1 style={{
              fontSize: "clamp(20px,4.5vw,34px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 12,
            }}>
              Entrepreneur vs Employee Wealth Gap
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              The full financial picture — tax drag, reinvestment modeling, and business
              equity side by side with the employee path. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Entrepreneur vs Employee Wealth Gap Extended" },
            ]} />

            <div style={{
              background: "#1e2d4a",
              borderLeft: "4px solid #e94560",
              borderRadius: 8,
              padding: "16px 20px",
            }}>
              <div style={{
                color: "#e94560",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 8,
              }}>
                Quick Answer
              </div>
              <p style={{ color: "#e2e8f0", margin: 0, lineHeight: 1.6 }}>
                The standard wealth comparison shows take-home earnings. This model adds what
                the standard one misses: business owners pay lower effective tax rates due to
                deductions, and profits reinvested into a business compound at higher rates
                than index fund contributions. Both factors widen the gap significantly over
                a 15–25 year working horizon.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              All projections are illustrative only. This is not financial advice.
            </p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>

            {/* Inputs */}
            <div style={{
              background: "#1e2d4a",
              borderRadius: 14,
              border: "1px solid #0f3460",
              padding: "28px 24px",
              marginBottom: 28,
            }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
                Your numbers
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 18,
              }}>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Current annual salary ($)
                  </label>
                  <input className="ext-input" style={inputStyle} type="text" inputMode="numeric"
                    placeholder="e.g. 120,000" value={salary} onChange={e => setSalary(e.target.value)} />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Estimated annual business income ($)
                  </label>
                  <input className="ext-input" style={inputStyle} type="text" inputMode="numeric"
                    placeholder="e.g. 180,000" value={bizIncome} onChange={e => setBizIncome(e.target.value)} />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Current age
                  </label>
                  <input className="ext-input" style={inputStyle} type="number" min="18" max="70"
                    placeholder="e.g. 38" value={age} onChange={e => setAge(e.target.value)} />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Target financial independence age
                  </label>
                  <input className="ext-input" style={inputStyle} type="number" min="18" max="80"
                    placeholder="e.g. 55" value={fiAge} onChange={e => setFiAge(e.target.value)} />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Estimated business profit margin (%)
                    <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>default 30%</span>
                  </label>
                  <input className="ext-input" style={inputStyle} type="number" min="1" max="100" step="1"
                    placeholder="30" value={margin} onChange={e => setMargin(e.target.value)} />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    % of profits reinvested into the business
                    <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>default 40%</span>
                  </label>
                  <input className="ext-input" style={inputStyle} type="number" min="0" max="100" step="1"
                    placeholder="40" value={reinvest} onChange={e => setReinvest(e.target.value)} />
                </div>

              </div>
            </div>

            {/* Results */}
            {results ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Two-path columns */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}>
                  <PathCard
                    title="Employee Path"
                    border="#0f3460"
                    rows={[
                      { label: "Gross salary earnings",    value: fmt(results.empGross) },
                      { label: "Estimated taxes (28%)",    value: `−${fmt(results.empTaxes)}` },
                      { label: "Take-home after taxes",    value: fmt(results.empTakeHome) },
                      { label: "401k projection",          value: `+${fmt(results.emp401k)}` },
                      { label: "  10% contrib · 7% return", value: `${results.years} yrs`, sub: true, dim: true },
                    ]}
                    total={fmt(results.empTotal)}
                    totalLabel="Total employee wealth"
                  />

                  <PathCard
                    title="Entrepreneur Path"
                    border="#f97316"
                    rows={[
                      { label: "Gross business income",      value: fmt(results.entGross) },
                      { label: "Estimated taxes (25%)",      value: `−${fmt(results.entTaxes)}` },
                      { label: "Take-home after taxes",      value: fmt(results.entTakeHome) },
                      { label: "Business equity (reinvested)", value: `+${fmt(results.entEquity)}` },
                      { label: `  ${margin}% margin · ${reinvest}% reinvested · 9% return`, value: "", sub: true, dim: true },
                    ]}
                    total={fmt(results.entTotal)}
                    totalLabel="Total entrepreneur wealth"
                  />
                </div>

                {/* Full Wealth Gap hero card */}
                <div style={{
                  background: "#431407",
                  borderRadius: 14,
                  border: "2px solid #f97316",
                  padding: "28px 24px",
                  textAlign: "center",
                }}>
                  <p style={{
                    color: "#fed7aa",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    marginBottom: 14,
                  }}>
                    The Full Wealth Gap
                  </p>
                  <p style={{
                    color: "#fff",
                    fontSize: "clamp(30px,9vw,56px)",
                    fontWeight: 900,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}>
                    {fmt(results.fullGap)}
                  </p>
                  <p style={{ color: "#fed7aa", fontSize: 14, lineHeight: 1.5 }}>
                    entrepreneur total wealth minus employee total wealth
                    · over {results.years} years
                  </p>
                </div>

                {/* Verdict */}
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 12,
                  border: "1px solid #0f3460",
                  padding: "16px 20px",
                  textAlign: "center",
                }}>
                  <p style={{
                    color: "#e2e8f0",
                    fontSize: 15,
                    fontStyle: "italic",
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {results.verdict}
                  </p>
                </div>

                {/* Assumptions table */}
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 12,
                  border: "1px solid #0f3460",
                  padding: "18px 20px",
                }}>
                  <p style={{
                    color: "#a8a8b3",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 14,
                  }}>
                    Model assumptions
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Employee tax rate",            value: "28% effective" },
                      { label: "Entrepreneur tax rate",        value: "25% effective (more deductions)" },
                      { label: "Employee 401k contribution",   value: "10% of salary annually" },
                      { label: "Employee investment return",   value: "7% annual" },
                      { label: "Business profit margin",       value: `${margin}%` },
                      { label: "Profit reinvestment rate",     value: `${reinvest}%` },
                      { label: "Business reinvestment return", value: "9% annual" },
                      { label: "Time horizon",                 value: `${results.years} years` },
                    ].map((row, i) => (
                      <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: 8,
                        borderBottom: i < 7 ? "1px solid #0f3460" : "none",
                      }}>
                        <span style={{ color: "#a8a8b3", fontSize: 13 }}>{row.label}</span>
                        <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ShareButtons
                  text={shareText}
                  url={TOOL_URL}
                  title="Entrepreneur vs Employee Wealth Gap Extended — The Full Financial Picture"
                />

              </div>
            ) : (
              <div style={{
                background: "#1e2d4a",
                borderRadius: 14,
                border: "1px dashed #0f3460",
                padding: "40px 24px",
                textAlign: "center",
              }}>
                <p style={{ color: "#a8a8b3", fontSize: 15 }}>
                  Enter your salary, estimated business income, and ages above to see the full wealth comparison.
                </p>
              </div>
            )}

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Employee path assumes 28% effective tax rate and 10% 401k contribution at 7% annual return. Entrepreneur path assumes 25% effective tax rate reflecting additional deductions available to business owners. Reinvestment compounds at 9% annually reflecting typical business reinvestment returns. All figures are illustrative projections only. This is not financial advice." />
              <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 12, lineHeight: 1.7, fontStyle: "italic" }}>
                I ran the numbers. A salary wasn&apos;t going to get me to retirement by 50.
                This calculator is why I left. — Pierre, MBA, Business Strategist &amp; AI Consultant,
                Founder of Dayblip
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* Related Tools */}
            {results && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "🏢", title: "Entrepreneur vs Employee Wealth Gap",       desc: "The original side-by-side wealth comparison",                   href: "/tools/entrepreneur-vs-employee-wealth-gap" },
                  { emoji: "💼", title: "Corporate Salary Ceiling Calculator",       desc: "What your corporate career is actually building",               href: "/tools/corporate-salary-ceiling-calculator" },
                  { emoji: "💰", title: "Salary Ceiling Calculator",                 desc: "See the lifetime limit a salary puts on your wealth",           href: "/tools/salary-ceiling-calculator" },
                  { emoji: "📅", title: "Wealth Transfer Timeline",                  desc: "Project your wealth at 65 and 75 and generational impact",      href: "/tools/wealth-transfer-timeline" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
