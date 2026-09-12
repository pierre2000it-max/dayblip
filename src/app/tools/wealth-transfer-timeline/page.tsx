"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── math ──────────────────────────────────────────────────────────────────────

function projectWealth(currentSavings: number, monthlyContrib: number, years: number): number {
  const r = 0.07 / 12
  const n = years * 12
  const fvSavings = currentSavings * Math.pow(1 + r, n)
  const fvContrib = monthlyContrib > 0 ? monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) : 0
  return fvSavings + fvContrib
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n).toLocaleString()}`
  return `$${Math.round(n)}`
}

function impactStatement(at65: number): string {
  if (at65 < 100_000)   return "You are building. Every dollar you add now compounds in your favor over time."
  if (at65 < 500_000)   return "You are on track to leave something meaningful behind. Consistency is the strategy."
  if (at65 < 1_000_000) return "You are building real generational impact. This is what financial legacy looks like in motion."
  return "You are on track to change your family's financial trajectory permanently."
}

const TOOL_URL = "https://www.dayblip.com/tools/wealth-transfer-timeline"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Wealth Transfer Timeline",
      url: TOOL_URL,
      description: "See your projected wealth at 65 and 75 based on what you are building today. Free educational tool from Generational Wealth 360.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author:    { "@type": "Organization", name: "Dayblip",              url: "https://www.dayblip.com" },
      publisher: { "@type": "Organization", name: "Generational Wealth 360", url: "https://generationalwealth360.com" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What interest rate does the Wealth Transfer Timeline use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool assumes a 7% average annual return compounded monthly, consistent with long-term historical averages for diversified equity portfolios. This is for educational illustration only — actual returns will vary and past performance does not guarantee future results.",
          },
        },
        {
          "@type": "Question",
          name: "What is a wealth transfer timeline?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A wealth transfer timeline maps when and how much accumulated wealth could pass to the next generation. It helps families understand the long-term impact of consistent saving and investing — not just on their own retirement, but on the financial starting point they create for their children or beneficiaries.",
          },
        },
        {
          "@type": "Question",
          name: "How much do I need to save to create generational wealth?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There is no single threshold — generational wealth is more about consistency than a specific dollar target. Starting early, contributing regularly, and allowing compounding to work over decades creates impact regardless of starting amount. This tool shows the math behind your specific situation.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function WealthTransferTimelinePage() {
  const [age,        setAge]        = useState("")
  const [savings,    setSavings]    = useState("")
  const [monthly,    setMonthly]    = useState("")
  const [childAge,   setChildAge]   = useState("")

  type Results = {
    at65: number
    at75: number
    childAt65: number | null
    childAt75: number | null
    yearsTo65: number
    yearsTo75: number
    statement: string
    hasChild: boolean
  }

  const [results, setResults] = useState<Results | null>(null)

  useEffect(() => {
    const a  = parseInt(age,     10)
    const s  = parseFloat(savings.replace(/,/g, ""))
    const m  = parseFloat(monthly.replace(/,/g, ""))
    const ca = parseInt(childAge, 10)

    if (!age || isNaN(a) || a < 1 || a >= 65) { setResults(null); return }

    const savingsVal = isNaN(s) ? 0 : Math.max(0, s)
    const monthlyVal = isNaN(m) ? 0 : Math.max(0, m)

    const y65 = Math.max(0, 65 - a)
    const y75 = Math.max(0, 75 - a)

    const at65 = projectWealth(savingsVal, monthlyVal, y65)
    const at75 = projectWealth(savingsVal, monthlyVal, y75)

    const hasChild    = !isNaN(ca) && ca > 0 && childAge.trim() !== ""
    const childAt65   = hasChild ? ca + y65 : null
    const childAt75   = hasChild ? ca + y75 : null

    setResults({
      at65, at75,
      childAt65, childAt75,
      yearsTo65: y65, yearsTo75: y75,
      statement: impactStatement(at65),
      hasChild,
    })
  }, [age, savings, monthly, childAge])

  const shareText = `I projected my wealth transfer timeline. Here is what the math shows: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .input-field {
          width: 100%;
          padding: 13px 16px;
          background: #0d1b2a;
          border: 2px solid #0f3460;
          border-radius: 10px;
          color: #ffffff;
          font-size: 16px;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #f97316;
        }
        .input-field::placeholder {
          color: #4a5568;
        }
        .result-card {
          background: #1e2d4a;
          border: 1px solid #0f3460;
          border-radius: 14px;
          padding: 22px 20px;
          flex: 1;
          min-width: 0;
        }
        .result-card.highlight {
          border-color: #f97316;
        }
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
              fontSize: "clamp(22px,5vw,36px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 12,
            }}>
              Wealth Transfer Timeline
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              What will you leave behind at 65 and 75? Enter four numbers and see
              the math behind your generational impact. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Wealth Transfer Timeline" },
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
                Generational wealth is not built by high earners — it is built by consistent
                savers who start early and let compounding do the heavy lifting. A 35-year-old
                saving $500 a month at 7% annual return will have over $1.2 million by 65.
                The most powerful input is not the amount — it is the time you give it to grow.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              This tool uses a 7% annual return compounded monthly — consistent with long-term
              historical market averages. It is for educational illustration only and is not
              financial advice. Results will vary based on actual market conditions.
            </p>
          </div>
        </section>

        {/* ── Calculator ────────────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* Inputs */}
            <div style={{
              background: "#1e2d4a",
              borderRadius: 14,
              border: "1px solid #0f3460",
              padding: "28px 24px",
              marginBottom: 28,
            }}>
              <h2 style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 24,
              }}>
                Enter your numbers
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Your current age
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    max="64"
                    placeholder="e.g. 34"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Current savings and investments total ($)
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 45,000"
                    value={savings}
                    onChange={e => setSavings(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Monthly contribution to savings or investments ($)
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 500"
                    value={monthly}
                    onChange={e => setMonthly(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                    Age of oldest child or beneficiary{" "}
                    <span style={{ color: "#6b7280", fontWeight: 400 }}>(enter 0 if none)</span>
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    placeholder="e.g. 5 or 0"
                    value={childAge}
                    onChange={e => setChildAge(e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* Results */}
            {results ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* 3 cards */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                }}>

                  {/* Card 1 — at 65 */}
                  <div className="result-card highlight">
                    <p style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                      Projected at age 65
                    </p>
                    <p style={{ color: "#f97316", fontSize: "clamp(24px,6vw,36px)", fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>
                      {fmt(results.at65)}
                    </p>
                    <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                      {results.yearsTo65 === 0 ? "You are already 65" : `In ${results.yearsTo65} year${results.yearsTo65 === 1 ? "" : "s"}`}
                    </p>
                  </div>

                  {/* Card 2 — at 75 */}
                  <div className="result-card">
                    <p style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                      Extended view — age 75
                    </p>
                    <p style={{ color: "#fff", fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>
                      {fmt(results.at75)}
                    </p>
                    <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                      {results.yearsTo75 === 0 ? "You are already 75" : `In ${results.yearsTo75} year${results.yearsTo75 === 1 ? "" : "s"}`}
                    </p>
                  </div>

                  {/* Card 3 — generational snapshot */}
                  <div className="result-card">
                    <p style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                      Generational snapshot
                    </p>
                    {results.hasChild ? (
                      <div>
                        <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, marginBottom: 6 }}>
                          When you are <strong style={{ color: "#f97316" }}>65</strong>, your beneficiary will be{" "}
                          <strong style={{ color: "#fff" }}>{results.childAt65} years old</strong>.
                        </p>
                        <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.6 }}>
                          When you are <strong style={{ color: "#f97316" }}>75</strong>, they will be{" "}
                          <strong style={{ color: "#fff" }}>{results.childAt75} years old</strong>.
                        </p>
                      </div>
                    ) : (
                      <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7 }}>
                        Start building now — time is the most powerful asset you have.
                      </p>
                    )}
                  </div>

                </div>

                {/* Impact statement */}
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 12,
                  border: "1px solid #0f3460",
                  padding: "18px 20px",
                  textAlign: "center",
                }}>
                  <p style={{
                    color: "#f97316",
                    fontSize: 16,
                    fontStyle: "italic",
                    fontWeight: 600,
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {results.statement}
                  </p>
                </div>

                {/* Contribution breakdown */}
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 14,
                  border: "1px solid #0f3460",
                  padding: "20px 24px",
                }}>
                  <p style={{
                    color: "#a8a8b3",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}>
                    Projection breakdown — age 65
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Time horizon",         value: `${results.yearsTo65} years` },
                      { label: "Starting savings",      value: `$${(parseFloat(savings.replace(/,/g, "")) || 0).toLocaleString()}` },
                      { label: "Monthly contribution",  value: `$${(parseFloat(monthly.replace(/,/g, "")) || 0).toLocaleString()}` },
                      { label: "Assumed annual return", value: "7% (compounded monthly)" },
                      { label: "Projected total",       value: fmt(results.at65), highlight: true },
                    ].map((row, i) => (
                      <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: 10,
                        borderBottom: i < 4 ? "1px solid #0f3460" : "none",
                      }}>
                        <span style={{ color: "#a8a8b3", fontSize: 14 }}>{row.label}</span>
                        <span style={{
                          color: row.highlight ? "#f97316" : "#fff",
                          fontWeight: row.highlight ? 700 : 500,
                          fontSize: 14,
                        }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{
                  background: "#431407",
                  border: "1px solid #f97316",
                  borderRadius: 14,
                  padding: "24px",
                  textAlign: "center",
                }}>
                  <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                    Generational Wealth 360 publishes free financial education for families
                    building long-term wealth — covering investment fundamentals, estate basics,
                    and the strategies that compound over generations.
                  </p>
                  <a
                    href="https://generationalwealth360.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#f97316",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "13px 32px",
                      fontWeight: 700,
                      fontSize: 15,
                      textDecoration: "none",
                    }}
                  >
                    Learn More at GW360 →
                  </a>
                </div>

                <ShareButtons
                  text={shareText}
                  url={TOOL_URL}
                  title="Wealth Transfer Timeline — What Will You Leave Behind at 65 and 75?"
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
                  Enter your current age above to see your projected wealth timeline.
                </p>
              </div>
            )}

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Projections assume 7% average annual return compounded monthly, consistent with long-term market averages. Contributions are assumed consistent. This is for educational purposes only and is not financial advice. Past market performance does not guarantee future results." />
              <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                Powered by Generational Wealth 360 — financial education for families building legacy.
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* Related Tools */}
            {results && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "💰", title: "Salary Ceiling Calculator",                  desc: "See the lifetime limit a salary puts on your wealth",         href: "/tools/salary-ceiling-calculator" },
                  { emoji: "🏢", title: "Entrepreneur vs Employee Wealth Gap",         desc: "The financial difference between a salary and a business",   href: "/tools/entrepreneur-vs-employee-wealth-gap" },
                  { emoji: "📈", title: "Procrastination Cost Calculator",             desc: "The financial cost of putting decisions off",                href: "/tools/procrastination-cost" },
                  { emoji: "🏠", title: "Family Mental Load Score",                    desc: "How much of your household are you carrying alone?",         href: "/tools/family-mental-load-score" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
