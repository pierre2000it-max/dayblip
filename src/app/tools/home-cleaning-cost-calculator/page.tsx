"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── data ──────────────────────────────────────────────────────────────────────

type Range = [number, number]

const BASE_STANDARD: Record<string, Range> = {
  "studio":  [80,  120],
  "2bed":    [100, 150],
  "3bed":    [130, 180],
  "4bed":    [160, 220],
  "5+bed":   [200, 280],
}

const TYPE_MULTIPLIER: Record<string, number> = {
  "standard":     1.0,
  "deep":         1.6,
  "move":         1.8,
  "construction": 2.2,
}

const BATH_ADD_LOW  = 15
const BATH_ADD_HIGH = 25

const LOCATION_MULT: Record<string, number> = {
  "rural":  0.85,
  "mid":    1.0,
  "metro":  1.25,
}

const FREQ_DISCOUNT: Record<string, number> = {
  "once":      0,
  "monthly":   0.05,
  "biweekly":  0.10,
  "weekly":    0.15,
}

const FREQ_SESSIONS_PER_YEAR: Record<string, number> = {
  "once":     1,
  "monthly":  12,
  "biweekly": 26,
  "weekly":   52,
}

const INCLUDED_NOTES: Record<string, string> = {
  "standard":     "Includes dusting, vacuuming, mopping, bathroom and kitchen surfaces, and general tidying.",
  "deep":         "Includes everything in a standard clean plus inside appliances, baseboards, window sills, and detailed scrubbing of bathrooms and kitchen.",
  "move":         "Full deep clean of the entire property including inside cabinets, closets, and all appliances. Suitable for landlords and new tenants.",
  "construction": "Specialized cleaning to remove construction dust, debris, and residue from all surfaces, fixtures, and floors.",
}

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString()}`
}

function fmtRange(lo: number, hi: number): string {
  return `${fmt(lo)} – ${fmt(hi)}`
}

type Results = {
  perSessionLow:  number
  perSessionHigh: number
  monthlyLow:     number | null
  monthlyHigh:    number | null
  annualLow:      number | null
  annualHigh:     number | null
  note:           string
  isRecurring:    boolean
}

const TOOL_URL = "https://www.dayblip.com/tools/home-cleaning-cost-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Home Cleaning Cost Calculator",
      url: TOOL_URL,
      description: "Estimate your home cleaning cost in seconds. Enter your home size, cleaning type, and location to get a realistic price range for any budget.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author:    { "@type": "Organization", name: "Dayblip",   url: "https://www.dayblip.com" },
      publisher: { "@type": "Organization", name: "EcoClean",  url: "https://ecocleanwis.com" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does a standard house cleaning cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A standard house cleaning typically ranges from $80 to $280 depending on home size, location, and number of bathrooms. Smaller homes in rural areas cost less; larger homes in major metros cost more. Regular recurring clients often receive a 5–15% discount.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a standard clean and a deep clean?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A standard clean covers routine maintenance — dusting, vacuuming, mopping, and surface cleaning of kitchens and bathrooms. A deep clean goes further, including inside appliances, baseboards, window sills, and detailed scrubbing. Deep cleans typically cost 50–60% more than a standard clean.",
          },
        },
        {
          "@type": "Question",
          name: "How much does a move-out cleaning cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Move-in and move-out cleanings cost roughly 1.8 times a standard clean for the same home size. They include inside cabinets, closets, and all appliances — making them suitable for landlords preparing a unit for new tenants or tenants trying to get their deposit back.",
          },
        },
        {
          "@type": "Question",
          name: "Does cleaning frequency affect price?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — most professional cleaning companies offer discounts for recurring bookings. Weekly cleanings typically receive a 15% per-session discount, bi-weekly 10%, and monthly 5%. One-time cleanings are priced at the full rate.",
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

// ── component ─────────────────────────────────────────────────────────────────

export default function HomeCleaningCostCalculatorPage() {
  const [size,      setSize]      = useState("studio")
  const [baths,     setBaths]     = useState("1")
  const [cleanType, setCleanType] = useState("standard")
  const [freq,      setFreq]      = useState("once")
  const [location,  setLocation]  = useState("mid")
  const [results,   setResults]   = useState<Results | null>(null)

  useEffect(() => {
    const base: Range = BASE_STANDARD[size] ?? [80, 120]

    // bathroom adjustment — extra per bath above first
    const bathCount = parseInt(baths, 10)
    const extraBaths = Math.max(0, bathCount - 1)
    const bathLow  = extraBaths * BATH_ADD_LOW
    const bathHigh = extraBaths * BATH_ADD_HIGH

    const typeMult  = TYPE_MULTIPLIER[cleanType] ?? 1
    const locMult   = LOCATION_MULT[location] ?? 1
    const discount  = FREQ_DISCOUNT[freq] ?? 0

    const rawLow  = (base[0] + bathLow)  * typeMult * locMult
    const rawHigh = (base[1] + bathHigh) * typeMult * locMult

    const sessionLow  = rawLow  * (1 - discount)
    const sessionHigh = rawHigh * (1 - discount)

    const isRecurring = freq !== "once"
    const sessionsPerYear = FREQ_SESSIONS_PER_YEAR[freq] ?? 1

    // monthly: sessions per year / 12
    const monthlyLow  = isRecurring ? (sessionLow  * sessionsPerYear) / 12 : null
    const monthlyHigh = isRecurring ? (sessionHigh * sessionsPerYear) / 12 : null

    const annualLow  = isRecurring ? sessionLow  * sessionsPerYear : null
    const annualHigh = isRecurring ? sessionHigh * sessionsPerYear : null

    setResults({
      perSessionLow:  sessionLow,
      perSessionHigh: sessionHigh,
      monthlyLow,
      monthlyHigh,
      annualLow,
      annualHigh,
      note: INCLUDED_NOTES[cleanType] ?? "",
      isRecurring,
    })
  }, [size, baths, cleanType, freq, location])

  const shareText = `I estimated my home cleaning cost with this free calculator: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        select:focus {
          border-color: #f97316 !important;
        }
        select option {
          background: #0d1b2a;
          color: #ffffff;
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
              Home Cleaning Cost Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              What should you pay for house cleaning? Enter five details and get
              a realistic price range instantly. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Home Cleaning Cost Calculator" },
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
                A standard home cleaning typically costs $80–$280 depending on home size
                and location. Deep cleans run 60% higher, move-out cleans 80% higher, and
                post-construction cleans can cost more than double a standard clean. Recurring
                bookings — weekly, bi-weekly, or monthly — usually receive a 5–15% per-session
                discount.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Estimates below are based on typical US market rates for residential cleaning.
              Actual prices vary by provider and specific home conditions.
            </p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* Two-column layout on wider screens */}
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
                  About your home
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Home size
                    </label>
                    <select style={selectStyle} value={size} onChange={e => setSize(e.target.value)}>
                      <option value="studio">Studio or 1 bedroom</option>
                      <option value="2bed">2 bedrooms</option>
                      <option value="3bed">3 bedrooms</option>
                      <option value="4bed">4 bedrooms</option>
                      <option value="5+bed">5 or more bedrooms</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Number of bathrooms
                    </label>
                    <select style={selectStyle} value={baths} onChange={e => setBaths(e.target.value)}>
                      <option value="1">1 bathroom</option>
                      <option value="2">2 bathrooms</option>
                      <option value="3">3 bathrooms</option>
                      <option value="4">4 or more bathrooms</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Type of cleaning
                    </label>
                    <select style={selectStyle} value={cleanType} onChange={e => setCleanType(e.target.value)}>
                      <option value="standard">Standard clean (regular maintenance)</option>
                      <option value="deep">Deep clean (thorough top to bottom)</option>
                      <option value="move">Move-in or move-out clean</option>
                      <option value="construction">Post-construction or post-renovation clean</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      How often do you need cleaning?
                    </label>
                    <select style={selectStyle} value={freq} onChange={e => setFreq(e.target.value)}>
                      <option value="once">One time only</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Your location type
                    </label>
                    <select style={selectStyle} value={location} onChange={e => setLocation(e.target.value)}>
                      <option value="rural">Small city or rural area</option>
                      <option value="mid">Mid-size city</option>
                      <option value="metro">Large city or metro area</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* ── Results ─────────────────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {results && (
                  <>
                    {/* Per-session estimate */}
                    <div style={{
                      background: "#1e2d4a",
                      borderRadius: 14,
                      border: "2px solid #f97316",
                      padding: "28px 24px",
                      textAlign: "center",
                    }}>
                      <p style={{
                        color: "#a8a8b3",
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 10,
                      }}>
                        Estimated per-session cost
                        {freq !== "once" && (
                          <span style={{ color: "#4ade80", marginLeft: 8, fontWeight: 700 }}>
                            ({Math.round(FREQ_DISCOUNT[freq] * 100)}% recurring discount applied)
                          </span>
                        )}
                      </p>
                      <p style={{
                        color: "#f97316",
                        fontSize: "clamp(28px,8vw,44px)",
                        fontWeight: 900,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}>
                        {fmtRange(results.perSessionLow, results.perSessionHigh)}
                      </p>
                      <p style={{ color: "#a8a8b3", fontSize: 13 }}>per cleaning session</p>
                    </div>

                    {/* Monthly + annual if recurring */}
                    {results.isRecurring && results.monthlyLow !== null && results.monthlyHigh !== null && results.annualLow !== null && results.annualHigh !== null && (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}>
                        <div style={{
                          background: "#1e2d4a",
                          borderRadius: 12,
                          border: "1px solid #0f3460",
                          padding: "18px 16px",
                          textAlign: "center",
                        }}>
                          <p style={{ color: "#a8a8b3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            Monthly cost
                          </p>
                          <p style={{ color: "#fff", fontSize: "clamp(16px,4vw,22px)", fontWeight: 800, lineHeight: 1 }}>
                            {fmtRange(results.monthlyLow, results.monthlyHigh)}
                          </p>
                        </div>
                        <div style={{
                          background: "#1e2d4a",
                          borderRadius: 12,
                          border: "1px solid #0f3460",
                          padding: "18px 16px",
                          textAlign: "center",
                        }}>
                          <p style={{ color: "#a8a8b3", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            Annual cost
                          </p>
                          <p style={{ color: "#fff", fontSize: "clamp(16px,4vw,22px)", fontWeight: 800, lineHeight: 1 }}>
                            {fmtRange(results.annualLow, results.annualHigh)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* What's included */}
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
                        marginBottom: 8,
                      }}>
                        What&apos;s typically included
                      </p>
                      <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                        {results.note}
                      </p>
                    </div>

                    {/* Breakdown */}
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
                        Estimate breakdown
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { label: "Home size",        value: { "studio": "Studio / 1 bed", "2bed": "2 bedrooms", "3bed": "3 bedrooms", "4bed": "4 bedrooms", "5+bed": "5+ bedrooms" }[size] ?? size },
                          { label: "Bathrooms",        value: `${baths === "4" ? "4+" : baths} bathroom${baths === "1" ? "" : "s"}` },
                          { label: "Cleaning type",    value: { "standard": "Standard", "deep": "Deep clean", "move": "Move-in/out", "construction": "Post-construction" }[cleanType] ?? cleanType },
                          { label: "Frequency",        value: { "once": "One time", "weekly": "Weekly (−15%)", "biweekly": "Bi-weekly (−10%)", "monthly": "Monthly (−5%)" }[freq] ?? freq },
                          { label: "Location factor",  value: { "rural": "0.85× (rural/small city)", "mid": "1.0× (mid-size city)", "metro": "1.25× (large city/metro)" }[location] ?? location },
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
                        EcoClean provides professional residential cleaning services in
                        Wisconsin. Get an accurate quote based on your specific home.
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
                          padding: "13px 28px",
                          fontWeight: 700,
                          fontSize: 15,
                          textDecoration: "none",
                        }}
                      >
                        Get a Free Quote from EcoClean →
                      </a>
                    </div>

                    <ShareButtons
                      text={shareText}
                      url={TOOL_URL}
                      title="Home Cleaning Cost Calculator — What Should You Pay for House Cleaning?"
                    />
                  </>
                )}
              </div>

            </div>

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Estimates are based on typical market rates for residential cleaning in the US and are provided for informational purposes only. Actual prices vary by provider, location, and specific home conditions. Contact EcoClean for an accurate quote." />
              <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                Powered by EcoClean — professional cleaning services in Wisconsin.
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* Related Tools */}
            <div style={{ marginTop: 40 }}>
              <RelatedTools tools={[
                { emoji: "🏠", title: "Family Mental Load Score",        desc: "How much of your household are you carrying alone?",           href: "/tools/family-mental-load-score" },
                { emoji: "📦", title: "Moving Stress Calculator",         desc: "How much is your move actually weighing on you?",             href: "/tools/moving-stress-calculator" },
                { emoji: "💰", title: "Salary Ceiling Calculator",        desc: "See the lifetime wealth limit a salary creates",              href: "/tools/salary-ceiling-calculator" },
                { emoji: "⏱️", title: "Procrastination Cost Calculator", desc: "The financial cost of putting decisions off",                 href: "/tools/procrastination-cost" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
