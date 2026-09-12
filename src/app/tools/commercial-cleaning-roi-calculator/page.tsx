"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── constants ──────────────────────────────────────────────────────────────────

const HOURS_LOST: Record<string, number> = {
  "lt30":  0.4,
  "30to1": 0.75,
  "1to2":  1.5,
  "gt2":   2.5,
}

// cleanings per month by frequency
const CLEANINGS_PER_MONTH: Record<string, number> = {
  "never":     1,   // show cost of monthly when "never"
  "monthly":   1,
  "biweekly":  2,
  "weekly":    4,
}

const SQFT_RATE_LOW  = 0.10
const SQFT_RATE_HIGH = 0.15

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString()}`
}

function fmtRange(lo: number, hi: number): string {
  return `${fmt(lo)} – ${fmt(hi)}`
}

function roiVerdict(productivityCost: number, cleaningLow: number, cleaningHigh: number): string {
  const cleaningMid = (cleaningLow + cleaningHigh) / 2
  if (cleaningMid === 0) return ""
  const ratio = productivityCost / cleaningMid
  const returnX = ratio.toFixed(1)
  if (ratio >= 3)   return `Every dollar spent on professional cleaning returns $${returnX} in recovered productivity. The math is clear.`
  if (ratio >= 1.5) return "Professional cleaning pays for itself and then some. A clean workspace is a business decision, not an expense."
  if (ratio >= 1)   return "Cleaning costs are roughly offset by recovered productivity. Factor in employee morale and client impression for the full picture."
  return "The direct productivity ROI is modest — but employee satisfaction, reduced sick days, and client impressions add value that this calculator does not capture."
}

type Results = {
  productivityMonthly: number
  productivityAnnual:  number
  cleaningMonthlyLow:  number
  cleaningMonthlyHigh: number
  roiMonthlyLow:       number
  roiMonthlyHigh:      number
  verdict:             string
  isNeverCleaned:      boolean
}

const TOOL_URL = "https://www.dayblip.com/tools/commercial-cleaning-roi-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Commercial Cleaning ROI Calculator",
      url: TOOL_URL,
      description: "Calculate the real cost of a dirty workspace. Enter your team size, wages, and space to see what professional cleaning returns in recovered productivity.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author:    { "@type": "Organization", name: "Dayblip",  url: "https://www.dayblip.com" },
      publisher: { "@type": "Organization", name: "EcoClean", url: "https://ecocleanwis.com" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much productivity does a dirty workspace cost a business?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Research on workplace environment and productivity consistently shows that cluttered or unclean workspaces reduce cognitive performance and increase distraction. Estimates vary, but even 30 minutes of lost productivity per employee per month translates to meaningful annual costs at scale — particularly in higher-wage environments.",
          },
        },
        {
          "@type": "Question",
          name: "How much does commercial cleaning cost per square foot?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Commercial cleaning typically ranges from $0.10 to $0.15 per square foot per cleaning for standard office environments. Total monthly cost depends on frequency — weekly cleaning costs four times more per month than monthly but keeps the space consistently clean. Specialty cleaning (medical, industrial, post-construction) carries higher rates.",
          },
        },
        {
          "@type": "Question",
          name: "What is the ROI of professional commercial cleaning?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The direct ROI of commercial cleaning depends on team size, wages, and how much productivity is lost to a dirty environment. For many businesses, even a conservative estimate of 30 minutes of lost productivity per employee per month produces a cleaning ROI greater than 1x — meaning cleaning pays for itself before factoring in employee morale, sick day reduction, or client impression.",
          },
        },
      ],
    },
  ],
}

// ── select style ──────────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "#0d1b2a",
  border: "2px solid #0f3460",
  borderRadius: 10,
  color: "#ffffff",
  fontSize: 15,
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a8a8b3' strokeWidth='2' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  paddingRight: 40,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "#0d1b2a",
  border: "2px solid #0f3460",
  borderRadius: 10,
  color: "#ffffff",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
}

// ── component ─────────────────────────────────────────────────────────────────

export default function CommercialCleaningROICalculatorPage() {
  const [employees,  setEmployees]  = useState("")
  const [wage,       setWage]       = useState("")
  const [hoursKey,   setHoursKey]   = useState("lt30")
  const [freqKey,    setFreqKey]    = useState("never")
  const [sqft,       setSqft]       = useState("")
  const [results,    setResults]    = useState<Results | null>(null)

  useEffect(() => {
    const emp  = parseInt(employees.replace(/,/g, ""), 10)
    const w    = parseFloat(wage.replace(/,/g, ""))
    const sq   = parseFloat(sqft.replace(/,/g, ""))
    const hrs  = HOURS_LOST[hoursKey] ?? 0.4
    const clnPerMonth = CLEANINGS_PER_MONTH[freqKey] ?? 1

    if (isNaN(emp) || emp <= 0 || isNaN(w) || w <= 0) { setResults(null); return }

    // Productivity cost
    const productivityMonthly = emp * w * hrs
    const productivityAnnual  = productivityMonthly * 12

    // Cleaning cost — use sqft=0 if not entered, show $0 range
    const sqVal = isNaN(sq) || sq <= 0 ? 0 : sq
    const cleaningPerCleanLow  = sqVal * SQFT_RATE_LOW
    const cleaningPerCleanHigh = sqVal * SQFT_RATE_HIGH
    const cleaningMonthlyLow   = cleaningPerCleanLow  * clnPerMonth
    const cleaningMonthlyHigh  = cleaningPerCleanHigh * clnPerMonth

    // ROI = productivity saved minus cleaning cost
    const roiMonthlyLow  = productivityMonthly - cleaningMonthlyHigh
    const roiMonthlyHigh = productivityMonthly - cleaningMonthlyLow

    setResults({
      productivityMonthly,
      productivityAnnual,
      cleaningMonthlyLow,
      cleaningMonthlyHigh,
      roiMonthlyLow,
      roiMonthlyHigh,
      verdict: sqVal > 0 ? roiVerdict(productivityMonthly, cleaningMonthlyLow, cleaningMonthlyHigh) : "",
      isNeverCleaned: freqKey === "never",
    })
  }, [employees, wage, hoursKey, freqKey, sqft])

  const shareText = `I calculated the ROI of professional cleaning for my business. Here is what I found: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .calc-input:focus { border-color: #f97316 !important; }
        .calc-select:focus { border-color: #f97316 !important; }
        .calc-select option { background: #0d1b2a; color: #ffffff; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section style={{
          padding: "56px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h1 style={{
              fontSize: "clamp(20px,4.5vw,34px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 12,
            }}>
              Commercial Cleaning ROI Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              What is a dirty workspace actually costing your business? Enter five
              numbers and see the productivity math instantly. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Commercial Cleaning ROI Calculator" },
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
                A team of 20 employees earning $25/hour, each losing just 30 minutes a month
                to a cluttered or dirty workspace, represents $250 in lost productivity per
                month. Professional cleaning for a 2,000 sq ft office costs roughly $200–$300
                per month — meaning cleaning can pay for itself before the first client walks
                through the door.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Productivity estimates are based on user inputs. Cleaning cost estimates reflect
              typical US commercial cleaning market rates of $0.10–$0.15 per square foot per
              cleaning session.
            </p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              alignItems: "start",
            }}>

              {/* ── Inputs ──────────────────────────────────────────────── */}
              <div style={{
                background: "#1e2d4a",
                borderRadius: 14,
                border: "1px solid #0f3460",
                padding: "28px 24px",
              }}>
                <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
                  About your business
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Number of employees in the building
                    </label>
                    <input
                      className="calc-input"
                      style={inputStyle}
                      type="number"
                      min="1"
                      placeholder="e.g. 20"
                      value={employees}
                      onChange={e => setEmployees(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Average hourly wage of employees ($)
                    </label>
                    <input
                      className="calc-input"
                      style={inputStyle}
                      type="number"
                      min="1"
                      placeholder="e.g. 25"
                      value={wage}
                      onChange={e => setWage(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Estimated hours lost per employee per month due to dirty workspace
                    </label>
                    <select
                      className="calc-select"
                      style={selectStyle}
                      value={hoursKey}
                      onChange={e => setHoursKey(e.target.value)}
                    >
                      <option value="lt30">Less than 30 minutes</option>
                      <option value="30to1">30 minutes to 1 hour</option>
                      <option value="1to2">1 to 2 hours</option>
                      <option value="gt2">More than 2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      How often is the space professionally cleaned?
                    </label>
                    <select
                      className="calc-select"
                      style={selectStyle}
                      value={freqKey}
                      onChange={e => setFreqKey(e.target.value)}
                    >
                      <option value="never">Never</option>
                      <option value="monthly">Monthly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Estimated square footage of the space
                    </label>
                    <input
                      className="calc-input"
                      style={inputStyle}
                      type="number"
                      min="1"
                      placeholder="e.g. 2500"
                      value={sqft}
                      onChange={e => setSqft(e.target.value)}
                    />
                  </div>

                </div>
              </div>

              {/* ── Results ─────────────────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {results ? (
                  <>
                    {/* 3 cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                      {/* Card 1 — productivity cost */}
                      <div style={{
                        background: "#1e2d4a",
                        borderRadius: 14,
                        border: "1px solid #7f1d1d",
                        padding: "22px 20px",
                      }}>
                        <p style={{
                          color: "#fca5a5",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 8,
                        }}>
                          Monthly productivity cost (lost)
                        </p>
                        <p style={{
                          color: "#ff6b6b",
                          fontSize: "clamp(22px,6vw,34px)",
                          fontWeight: 900,
                          lineHeight: 1,
                          marginBottom: 4,
                        }}>
                          {fmt(results.productivityMonthly)}
                        </p>
                        <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                          {fmt(results.productivityAnnual)} per year
                        </p>
                      </div>

                      {/* Card 2 — cleaning cost */}
                      <div style={{
                        background: "#1e2d4a",
                        borderRadius: 14,
                        border: "1px solid #0f3460",
                        padding: "22px 20px",
                      }}>
                        <p style={{
                          color: "#a8a8b3",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 8,
                        }}>
                          {results.isNeverCleaned
                            ? "Estimated monthly cleaning cost (if you started)"
                            : "Estimated monthly cleaning cost"}
                        </p>
                        {sqft && parseFloat(sqft) > 0 ? (
                          <>
                            <p style={{
                              color: "#e2e8f0",
                              fontSize: "clamp(20px,5vw,28px)",
                              fontWeight: 900,
                              lineHeight: 1,
                              marginBottom: 4,
                            }}>
                              {fmtRange(results.cleaningMonthlyLow, results.cleaningMonthlyHigh)}
                            </p>
                            <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                              at $0.10–$0.15 per sq ft ×{" "}
                              {CLEANINGS_PER_MONTH[freqKey]} cleaning{CLEANINGS_PER_MONTH[freqKey] === 1 ? "" : "s"}/month
                            </p>
                          </>
                        ) : (
                          <p style={{ color: "#6b7280", fontSize: 15 }}>
                            Enter square footage above
                          </p>
                        )}
                      </div>

                      {/* Card 3 — ROI */}
                      <div style={{
                        background: "#1e2d4a",
                        borderRadius: 14,
                        border: "2px solid #f97316",
                        padding: "22px 20px",
                      }}>
                        <p style={{
                          color: "#a8a8b3",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 8,
                        }}>
                          Estimated monthly value recovered
                        </p>
                        {sqft && parseFloat(sqft) > 0 ? (
                          <>
                            <p style={{
                              color: "#f97316",
                              fontSize: "clamp(22px,6vw,34px)",
                              fontWeight: 900,
                              lineHeight: 1,
                              marginBottom: 4,
                            }}>
                              {results.roiMonthlyLow >= 0 && results.roiMonthlyHigh >= 0
                                ? fmtRange(results.roiMonthlyLow, results.roiMonthlyHigh)
                                : fmtRange(Math.max(0, results.roiMonthlyLow), Math.max(0, results.roiMonthlyHigh))}
                            </p>
                            <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                              productivity recovered minus cleaning cost
                            </p>
                          </>
                        ) : (
                          <p style={{ color: "#6b7280", fontSize: 15 }}>
                            Enter square footage to see ROI
                          </p>
                        )}
                      </div>

                    </div>

                    {/* ROI verdict */}
                    {results.verdict && (
                      <div style={{
                        background: "#1e2d4a",
                        borderRadius: 12,
                        border: "1px solid #0f3460",
                        padding: "16px 20px",
                        textAlign: "center",
                      }}>
                        <p style={{
                          color: "#f97316",
                          fontSize: 15,
                          fontStyle: "italic",
                          fontWeight: 600,
                          lineHeight: 1.6,
                          margin: 0,
                        }}>
                          {results.verdict}
                        </p>
                      </div>
                    )}

                    {/* Inputs summary */}
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
                        Calculation inputs
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { label: "Employees",          value: employees || "—" },
                          { label: "Avg hourly wage",    value: wage ? `$${wage}/hr` : "—" },
                          { label: "Hours lost/employee", value: { lt30: "< 0.5 hrs", "30to1": "0.75 hrs", "1to2": "1.5 hrs", gt2: "2.5 hrs" }[hoursKey] ?? "—" },
                          { label: "Cleaning frequency", value: { never: "Never", monthly: "Monthly", biweekly: "Bi-weekly", weekly: "Weekly" }[freqKey] ?? "—" },
                          { label: "Square footage",     value: sqft ? `${parseInt(sqft).toLocaleString()} sq ft` : "—" },
                        ].map((row, i) => (
                          <div key={i} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: 8,
                            borderBottom: i < 4 ? "1px solid #0f3460" : "none",
                          }}>
                            <span style={{ color: "#a8a8b3", fontSize: 13 }}>{row.label}</span>
                            <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{
                      background: "#431407",
                      border: "1px solid #f97316",
                      borderRadius: 14,
                      padding: "22px",
                      textAlign: "center",
                    }}>
                      <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
                        EcoClean provides professional commercial cleaning services in
                        Wisconsin. Get an accurate quote based on your specific facility,
                        frequency, and cleaning needs.
                      </p>
                      <a
                        href="https://ecocleanwis.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          background: "#f97316",
                          color: "#fff",
                          borderRadius: 10,
                          padding: "13px 24px",
                          fontWeight: 700,
                          fontSize: 15,
                          textDecoration: "none",
                        }}
                      >
                        Get a Free Commercial Quote from EcoClean →
                      </a>
                    </div>

                    <ShareButtons
                      text={shareText}
                      url={TOOL_URL}
                      title="Commercial Cleaning ROI Calculator — What Is a Dirty Workspace Actually Costing You?"
                    />
                  </>
                ) : (
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "1px dashed #0f3460",
                    padding: "40px 24px",
                    textAlign: "center",
                  }}>
                    <p style={{ color: "#a8a8b3", fontSize: 15 }}>
                      Enter your number of employees and their average wage above to see the productivity math.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Productivity estimates are based on user-supplied inputs and research on workspace cleanliness and employee output. Cleaning cost estimates reflect typical US commercial cleaning market rates. Actual costs vary by provider, location, and facility type. This calculator is for informational purposes only. Contact EcoClean for an accurate commercial quote." />
              <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                Powered by EcoClean — professional cleaning services in Wisconsin.
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* Related Tools */}
            <div style={{ marginTop: 40 }}>
              <RelatedTools tools={[
                { emoji: "🏠", title: "Home Cleaning Cost Calculator",    desc: "Estimate residential cleaning costs by size and type",           href: "/tools/home-cleaning-cost-calculator" },
                { emoji: "⏱️", title: "Lead Response Time Cost Calculator", desc: "The cost of slow follow-up on inbound leads",                  href: "/tools/lead-response-cost-calculator" },
                { emoji: "💰", title: "Salary Ceiling Calculator",          desc: "See the lifetime limit a salary puts on your wealth",           href: "/tools/salary-ceiling-calculator" },
                { emoji: "📦", title: "Moving Stress Calculator",           desc: "How much is your move actually weighing on you?",              href: "/tools/moving-stress-calculator" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
