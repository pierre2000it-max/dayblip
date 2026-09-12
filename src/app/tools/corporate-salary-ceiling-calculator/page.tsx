"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── math ──────────────────────────────────────────────────────────────────────

const TAX_RATE      = 0.28
const CONTRIB_RATE  = 0.10
const INV_RETURN    = 0.07

function projectSalaryTotal(salary: number, raiseRate: number, years: number): number {
  // Sum of geometric series: salary * ((1+r)^n - 1) / r, or salary * n if r=0
  if (raiseRate === 0) return salary * years
  return salary * ((Math.pow(1 + raiseRate, years) - 1) / raiseRate)
}

function project401k(currentBalance: number, salary: number, raiseRate: number, years: number): number {
  // Each year: contribute 10% of that year's salary, compound existing balance at 7%
  let balance = currentBalance
  let currentSalary = salary
  for (let i = 0; i < years; i++) {
    balance = (balance + currentSalary * CONTRIB_RATE) * (1 + INV_RETURN)
    currentSalary = currentSalary * (1 + raiseRate)
  }
  return balance
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n).toLocaleString()}`
}

function verdict(gap: number): string {
  if (gap < 300_000)   return "Your corporate path is building something. The gap is manageable."
  if (gap < 700_000)   return "You are earning well. But the gap between income and wealth is widening every year."
  if (gap < 1_500_000) return "Your salary is someone else's return on investment. The wealth gap tells the real story."
  return "You have spent your highest-earning years building predictable income. The wealth gap is the cost of that certainty."
}

type Results = {
  grossTotal:    number
  takeHome:      number
  taxes:         number
  balance401k:   number
  wealthGap:     number
  years:         number
  verdict:       string
}

const TOOL_URL = "https://www.dayblip.com/tools/corporate-salary-ceiling-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Corporate Salary Ceiling Calculator — Corporate Edition",
      url: TOOL_URL,
      description: "See the real math behind a corporate salary. Project your lifetime earnings, tax drag, and 401k growth to find the wealth gap hiding in plain sight.",
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
          name: "What is the salary ceiling concept?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The salary ceiling is the maximum wealth a corporate professional can accumulate solely through earned income — after taxes, spending, and the limits of annual salary growth. Unlike business ownership or investments, a salary stops growing with effort and stops entirely when employment ends. The gap between what you earn and what you actually build is the ceiling made visible.",
          },
        },
        {
          "@type": "Question",
          name: "How much of a salary goes to taxes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This calculator uses a flat 28% effective federal tax rate for illustrative purposes. Actual effective rates vary significantly based on income level, filing status, deductions, state taxes, and year. Higher earners in high-tax states can see combined effective rates of 35–45%. A tax professional can give you an accurate picture for your specific situation.",
          },
        },
        {
          "@type": "Question",
          name: "How is the 401k projection calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The projection assumes 10% of each year's salary is contributed to a 401k, compounded annually at 7% average return, added to the current 401k balance. Salary is compounded each year by the specified raise rate. This is an educational illustration — actual returns and contribution rates vary.",
          },
        },
      ],
    },
  ],
}

// ── input style ───────────────────────────────────────────────────────────────

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

export default function CorporateSalaryCeilingCalculatorPage() {
  const [salary,   setSalary]   = useState("")
  const [raise,    setRaise]    = useState("3")
  const [age,      setAge]      = useState("")
  const [fiAge,    setFiAge]    = useState("")
  const [balance,  setBalance]  = useState("")
  const [results,  setResults]  = useState<Results | null>(null)

  useEffect(() => {
    const sal = parseFloat(salary.replace(/,/g, ""))
    const r   = parseFloat(raise) / 100
    const a   = parseInt(age,   10)
    const fi  = parseInt(fiAge, 10)
    const bal = parseFloat(balance.replace(/,/g, "")) || 0

    if (isNaN(sal) || sal <= 0) { setResults(null); return }
    if (isNaN(a)  || a  < 18 ) { setResults(null); return }
    if (isNaN(fi) || fi <= a  ) { setResults(null); return }

    const raiseRate  = isNaN(r) || r < 0 ? 0 : r
    const years      = fi - a

    const grossTotal = projectSalaryTotal(sal, raiseRate, years)
    const taxes      = grossTotal * TAX_RATE
    const takeHome   = grossTotal - taxes
    const balance401k = project401k(isNaN(bal) ? 0 : bal, sal, raiseRate, years)
    const wealthGap  = takeHome - balance401k

    setResults({
      grossTotal,
      takeHome,
      taxes,
      balance401k,
      wealthGap:  Math.max(0, wealthGap),
      years,
      verdict:    verdict(Math.max(0, wealthGap)),
    })
  }, [salary, raise, age, fiAge, balance])

  const shareText = `I calculated what my corporate salary is really building. The gap surprised me: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .corp-input:focus { border-color: #f97316 !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section style={{
          padding: "56px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
              Corporate Edition
            </div>
            <h1 style={{
              fontSize: "clamp(20px,4.5vw,34px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 12,
            }}>
              Corporate Salary Ceiling Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              What is your career actually building? Project your lifetime salary earnings,
              tax drag, and 401k growth — and see the wealth gap in plain numbers.
              Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Corporate Salary Ceiling Calculator" },
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
                A $120,000 salary with 3% annual raises over 25 years generates roughly
                $4.2M in gross income — but after a 28% effective tax rate, take-home
                is closer to $3M. Contributing 10% to a 401k at 7% return over the same
                period builds roughly $700K–$900K. The gap between what you earned and
                what you built is the salary ceiling made visible.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              This calculator is for educational illustration only. Tax and investment
              figures are estimates. This is not financial advice.
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
                  Your numbers
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Current annual salary ($)
                    </label>
                    <input
                      className="corp-input"
                      style={inputStyle}
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 120,000"
                      value={salary}
                      onChange={e => setSalary(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Expected annual raise (%)
                      <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>default 3%</span>
                    </label>
                    <input
                      className="corp-input"
                      style={inputStyle}
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      placeholder="3"
                      value={raise}
                      onChange={e => setRaise(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Your current age
                    </label>
                    <input
                      className="corp-input"
                      style={inputStyle}
                      type="number"
                      min="18"
                      max="70"
                      placeholder="e.g. 38"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Target financial independence age
                    </label>
                    <input
                      className="corp-input"
                      style={inputStyle}
                      type="number"
                      min="18"
                      max="80"
                      placeholder="e.g. 55"
                      value={fiAge}
                      onChange={e => setFiAge(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Current 401k or investment balance ($)
                    </label>
                    <input
                      className="corp-input"
                      style={inputStyle}
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 85,000"
                      value={balance}
                      onChange={e => setBalance(e.target.value)}
                    />
                  </div>

                </div>
              </div>

              {/* ── Results ─────────────────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {results ? (
                  <>
                    {/* Cards grid */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                      {/* Card 1 — gross */}
                      <div style={{
                        background: "#1e2d4a",
                        borderRadius: 12,
                        border: "1px solid #0f3460",
                        padding: "20px",
                      }}>
                        <p style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                          Total projected salary earnings (gross)
                        </p>
                        <p style={{ color: "#e2e8f0", fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
                          {fmt(results.grossTotal)}
                        </p>
                        <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                          over {results.years} years · {results.years > 0 ? `age ${age}–${fiAge}` : ""}
                        </p>
                      </div>

                      {/* Two-column: take-home + taxes */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div style={{
                          background: "#1e2d4a",
                          borderRadius: 12,
                          border: "1px solid #0f3460",
                          padding: "18px 16px",
                        }}>
                          <p style={{ color: "#a8a8b3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            Take-home after taxes
                          </p>
                          <p style={{ color: "#4ade80", fontSize: "clamp(17px,4vw,22px)", fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
                            {fmt(results.takeHome)}
                          </p>
                          <p style={{ color: "#a8a8b3", fontSize: 12 }}>after 28% est. rate</p>
                        </div>
                        <div style={{
                          background: "#1e2d4a",
                          borderRadius: 12,
                          border: "1px solid #7f1d1d",
                          padding: "18px 16px",
                        }}>
                          <p style={{ color: "#fca5a5", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            Estimated taxes paid
                          </p>
                          <p style={{ color: "#ff6b6b", fontSize: "clamp(17px,4vw,22px)", fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
                            {fmt(results.taxes)}
                          </p>
                          <p style={{ color: "#a8a8b3", fontSize: 12 }}>flat 28% estimate</p>
                        </div>
                      </div>

                      {/* Card 3 — 401k */}
                      <div style={{
                        background: "#1e2d4a",
                        borderRadius: 12,
                        border: "1px solid #0f3460",
                        padding: "20px",
                      }}>
                        <p style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                          Projected 401k balance at age {fiAge}
                        </p>
                        <p style={{ color: "#e2e8f0", fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
                          {fmt(results.balance401k)}
                        </p>
                        <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                          10% contributions · 7% annual return
                        </p>
                      </div>

                      {/* Card 4 — The Wealth Gap (hero card) */}
                      <div style={{
                        background: "#431407",
                        borderRadius: 14,
                        border: "2px solid #f97316",
                        padding: "24px 20px",
                        textAlign: "center",
                      }}>
                        <p style={{
                          color: "#fed7aa",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          marginBottom: 12,
                        }}>
                          The Wealth You Did Not Build
                        </p>
                        <p style={{
                          color: "#fff",
                          fontSize: "clamp(28px,8vw,48px)",
                          fontWeight: 900,
                          lineHeight: 1,
                          marginBottom: 8,
                        }}>
                          {fmt(results.wealthGap)}
                        </p>
                        <p style={{ color: "#fed7aa", fontSize: 14, lineHeight: 1.5 }}>
                          take-home income minus projected 401k balance
                        </p>
                      </div>

                    </div>

                    {/* Corporate verdict */}
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

                    {/* Projection breakdown */}
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
                        Projection inputs
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { label: "Starting salary",      value: salary ? `$${parseFloat(salary.replace(/,/g,"")).toLocaleString()}` : "—" },
                          { label: "Annual raise",          value: `${raise || "3"}%` },
                          { label: "Years to FI",           value: `${results.years} years` },
                          { label: "Tax rate (estimate)",   value: "28% effective" },
                          { label: "401k contribution",     value: "10% of salary / year" },
                          { label: "Investment return",     value: "7% annual" },
                          { label: "Starting 401k balance", value: balance ? `$${(parseFloat(balance.replace(/,/g,""))||0).toLocaleString()}` : "$0" },
                        ].map((row, i) => (
                          <div key={i} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: 8,
                            borderBottom: i < 6 ? "1px solid #0f3460" : "none",
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
                      title="Corporate Salary Ceiling Calculator — What Is Your Career Actually Building?"
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
                      Enter your salary, age, and target financial independence age to see the numbers.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Salary projection compounds annual raises. Tax estimate uses a flat 28% effective rate for illustrative purposes only — actual tax liability varies. Investment projection assumes 10% of annual salary contributed to a 401k at 7% annual return compounded annually. This is not financial advice." />
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
                  { emoji: "💰", title: "Salary Ceiling Calculator",                desc: "The original salary ceiling calculation",                         href: "/tools/salary-ceiling-calculator" },
                  { emoji: "🏢", title: "Entrepreneur vs Employee Wealth Gap",      desc: "The financial difference between a salary and a business",        href: "/tools/entrepreneur-vs-employee-wealth-gap" },
                  { emoji: "📅", title: "Wealth Transfer Timeline",                 desc: "Project your wealth at 65 and 75 and your generational impact",   href: "/tools/wealth-transfer-timeline" },
                  { emoji: "🏛️", title: "Financial Legacy Score",                  desc: "How ready is your family for what you leave behind?",             href: "/tools/financial-legacy-score" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
