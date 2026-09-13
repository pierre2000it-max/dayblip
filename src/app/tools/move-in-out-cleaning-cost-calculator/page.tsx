"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── data ──────────────────────────────────────────────────────────────────────

type Range = [number, number]

const BASE_RATE: Record<string, Range> = {
  studio: [150, 220],
  "2bed": [200, 300],
  "3bed": [280, 400],
  "4bed": [360, 500],
  "5+bed": [450, 650],
}

const TYPE_MULT: Record<string, number> = {
  moveout:   1.0,
  movein:    1.0,
  tenancy:   1.0,
  reno:      1.5,
}

const COND_MULT: Record<string, number> = {
  good:      1.0,
  average:   1.15,
  poor:      1.35,
  verypoor:  1.6,
}

const BATH_ADD_LOW  = 30
const BATH_ADD_HIGH = 50

const LOC_MULT: Record<string, number> = {
  rural: 0.85,
  mid:   1.0,
  metro: 1.25,
}

const INCLUDED: Record<string, string> = {
  moveout:  "Includes deep cleaning of all rooms, kitchen appliances inside and out, bathroom scrubbing, baseboards, window sills, and removal of all surface grime. Property left ready for handover or new occupants.",
  movein:   "Includes full sanitization of all rooms, kitchen and bathroom deep clean, inside cabinets and closets, and surface cleaning throughout. Property left move-in ready.",
  tenancy:  "Comprehensive clean meeting landlord and letting agent standards. Includes all surfaces, appliances, bathrooms, carpets spot-cleaned, and areas behind furniture. Designed to protect your deposit.",
  reno:     "Specialized clean removing construction dust, paint splatter, adhesive residue, and debris from all surfaces, fixtures, floors, and windows. Property left handover-ready.",
}

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString()}`
}

function fmtRange(lo: number, hi: number): string {
  return `${fmt(lo)} – ${fmt(hi)}`
}

type Results = {
  low:  number
  high: number
  note: string
  isDeposit: boolean
}

const TOOL_URL = "https://www.dayblip.com/tools/move-in-out-cleaning-cost-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Move-In/Out Cleaning Cost Calculator",
      url: TOOL_URL,
      description: "Estimate your move-in or move-out cleaning cost instantly. Enter your property size, condition, and location for a realistic price range.",
      applicationCategory: "UtilitiesApplication",
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
          name: "How much does a move-out cleaning cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A move-out cleaning typically ranges from $150 to $650 depending on property size, condition, and location. Smaller properties in rural areas cost less; larger or heavily soiled properties in major metros cost more. Post-renovation cleans carry a 50% premium due to the specialized work required.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a move-out clean and an end of tenancy clean?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Both are comprehensive deep cleans, but an end of tenancy clean is specifically designed to meet landlord and letting agent standards for deposit return. It typically includes areas behind furniture, carpet spot-cleaning, and documentation. A standard move-out clean is suitable for homeowners or buyers but may not meet the specific requirements in a tenancy agreement.",
          },
        },
        {
          "@type": "Question",
          name: "Does property condition affect move-out cleaning cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — significantly. A property in good condition with light soiling costs the base rate. Average condition adds roughly 15%, poor condition adds 35%, and heavily neglected properties can cost 60% more than the base rate. The condition multiplier reflects the additional time and materials required to restore the property to a clean standard.",
          },
        },
        {
          "@type": "Question",
          name: "Should I hire a professional cleaner for move-out to protect my deposit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A professional end of tenancy clean is one of the most effective ways to protect a rental deposit. Most landlords require the property returned to its original cleaned condition, and deductions for cleaning are among the most common deposit disputes. Professional cleaning with a receipt also provides documentation if the deposit is challenged.",
          },
        },
      ],
    },
  ],
}

// ── shared select style ───────────────────────────────────────────────────────

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

export default function MoveInOutCleaningCostCalculatorPage() {
  const [cleanType, setCleanType] = useState("moveout")
  const [size,      setSize]      = useState("studio")
  const [baths,     setBaths]     = useState("1")
  const [condition, setCondition] = useState("good")
  const [location,  setLocation]  = useState("mid")
  const [results,   setResults]   = useState<Results | null>(null)

  useEffect(() => {
    const base: Range = BASE_RATE[size] ?? [150, 220]
    const bathCount   = parseInt(baths, 10)
    const extraBaths  = Math.max(0, bathCount - 1)
    const bathLow     = extraBaths * BATH_ADD_LOW
    const bathHigh    = extraBaths * BATH_ADD_HIGH

    const typeMult = TYPE_MULT[cleanType] ?? 1
    const condMult = COND_MULT[condition] ?? 1
    const locMult  = LOC_MULT[location]   ?? 1

    const low  = (base[0] + bathLow)  * typeMult * condMult * locMult
    const high = (base[1] + bathHigh) * typeMult * condMult * locMult

    setResults({
      low,
      high,
      note:      INCLUDED[cleanType] ?? "",
      isDeposit: cleanType === "tenancy",
    })
  }, [cleanType, size, baths, condition, location])

  const shareText = `I estimated my move-in/out cleaning cost with this free calculator: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .move-select:focus { border-color: #f97316 !important; }
        .move-select option { background: #0d1b2a; color: #fff; }
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
              Move-In/Out Cleaning Cost Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              What should you pay for a move clean? Choose your cleaning type and
              property details to get an instant estimate. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Move-In/Out Cleaning Cost Calculator" },
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
                Move-in and move-out cleans typically cost $150–$650 depending on property
                size and condition. Post-renovation cleans run 50% higher due to construction
                dust and debris. End of tenancy cleans are designed to landlord handover
                standards and are among the most effective ways to protect a rental deposit.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Estimates reflect typical US market rates. Actual prices vary by provider
              and specific property conditions.
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
                  About your property
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Type of cleaning
                    </label>
                    <select className="move-select" style={selectStyle} value={cleanType} onChange={e => setCleanType(e.target.value)}>
                      <option value="moveout">Move-out clean (leaving a property)</option>
                      <option value="movein">Move-in clean (preparing before moving in)</option>
                      <option value="tenancy">End of tenancy clean (rental handover)</option>
                      <option value="reno">Post-renovation clean (after construction or remodeling)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Property size
                    </label>
                    <select className="move-select" style={selectStyle} value={size} onChange={e => setSize(e.target.value)}>
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
                    <select className="move-select" style={selectStyle} value={baths} onChange={e => setBaths(e.target.value)}>
                      <option value="1">1 bathroom</option>
                      <option value="2">2 bathrooms</option>
                      <option value="3">3 bathrooms</option>
                      <option value="4">4 or more bathrooms</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Property condition
                    </label>
                    <select className="move-select" style={selectStyle} value={condition} onChange={e => setCondition(e.target.value)}>
                      <option value="good">Good condition — light cleaning needed</option>
                      <option value="average">Average condition — standard cleaning required</option>
                      <option value="poor">Poor condition — heavy cleaning and scrubbing required</option>
                      <option value="verypoor">Very poor condition — neglected property, significant work needed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Your location type
                    </label>
                    <select className="move-select" style={selectStyle} value={location} onChange={e => setLocation(e.target.value)}>
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
                    {/* Primary estimate */}
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
                        Estimated cleaning cost
                      </p>
                      <p style={{
                        color: "#f97316",
                        fontSize: "clamp(28px,8vw,46px)",
                        fontWeight: 900,
                        lineHeight: 1,
                        marginBottom: 8,
                      }}>
                        {fmtRange(results.low, results.high)}
                      </p>
                      <p style={{ color: "#a8a8b3", fontSize: 13 }}>
                        for a one-time cleaning service
                      </p>
                    </div>

                    {/* Deposit note for end of tenancy */}
                    {results.isDeposit && (
                      <div style={{
                        background: "#1e3a2e",
                        borderRadius: 12,
                        border: "1px solid #16a34a",
                        padding: "16px 18px",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                      }}>
                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🔑</span>
                        <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                          A professional end of tenancy clean is one of the most effective ways
                          to protect your deposit. Most landlords require the property returned
                          to its original condition.
                        </p>
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

                    {/* Estimate breakdown */}
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
                          {
                            label: "Cleaning type",
                            value: { moveout: "Move-out", movein: "Move-in", tenancy: "End of tenancy", reno: "Post-renovation (1.5×)" }[cleanType] ?? cleanType,
                          },
                          {
                            label: "Property size",
                            value: { studio: "Studio / 1 bed", "2bed": "2 bedrooms", "3bed": "3 bedrooms", "4bed": "4 bedrooms", "5+bed": "5+ bedrooms" }[size] ?? size,
                          },
                          {
                            label: "Bathrooms",
                            value: `${baths === "4" ? "4+" : baths} bathroom${baths === "1" ? "" : "s"}`,
                          },
                          {
                            label: "Condition",
                            value: { good: "Good (1.0×)", average: "Average (1.15×)", poor: "Poor (1.35×)", verypoor: "Very poor (1.6×)" }[condition] ?? condition,
                          },
                          {
                            label: "Location factor",
                            value: { rural: "0.85× (rural/small city)", mid: "1.0× (mid-size city)", metro: "1.25× (large city/metro)" }[location] ?? location,
                          },
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
                        EcoClean specializes in move-in, move-out, end of tenancy, and
                        post-renovation cleaning services in Wisconsin. Get an accurate
                        quote for your specific property.
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
                      title="Move-In/Out Cleaning Cost Calculator — What Should You Pay for a Move Clean?"
                    />
                  </>
                )}
              </div>

            </div>

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Estimates are based on typical US market rates for move-in/out cleaning services and are provided for informational purposes only. Actual prices vary by provider, location, and specific property conditions. Contact EcoClean for an accurate quote." />
              <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                Powered by EcoClean — move-in/out and commercial cleaning services in Wisconsin.
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* Related Tools */}
            <div style={{ marginTop: 40 }}>
              <RelatedTools tools={[
                { emoji: "🏠", title: "Home Cleaning Cost Calculator",    desc: "Estimate regular residential cleaning costs",                    href: "/tools/home-cleaning-cost-calculator" },
                { emoji: "📦", title: "Moving Stress Calculator",          desc: "How much is your move actually weighing on you?",              href: "/tools/moving-stress-calculator" },
                { emoji: "🏢", title: "Commercial Cleaning ROI Calculator", desc: "The business case for professional office cleaning",           href: "/tools/commercial-cleaning-roi-calculator" },
                { emoji: "🏠", title: "Family Mental Load Score",           desc: "How much of your household are you carrying alone?",          href: "/tools/family-mental-load-score" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
