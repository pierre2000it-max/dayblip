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
  wash:    [30,  60],
  exterior:[100, 175],
  interior:[100, 175],
  full:    [175, 300],
  paint:   [300, 600],
  ceramic: [500, 1200],
}

const VEHICLE_MULT: Record<string, number> = {
  sedan:   1.0,
  suv:     1.2,
  truck:   1.25,
  minivan: 1.2,
  luxury:  1.5,
}

const COND_MULT: Record<string, number> = {
  good:     1.0,
  average:  1.15,
  poor:     1.35,
  verypoor: 1.6,
}

const LOC_MULT: Record<string, number> = {
  rural: 0.85,
  mid:   1.0,
  metro: 1.25,
}

const INCLUDED: Record<string, string> = {
  wash:     "Hand wash, rinse, and dry. Wheel cleaning and window wipe-down included.",
  exterior: "Hand wash, clay bar treatment, machine polish, and protective wax or sealant. Wheels, tires, and trim dressed.",
  interior: "Full vacuum of all surfaces and seats, carpet and upholstery shampoo, dashboard and door panel wipe-down, and interior glass cleaning.",
  full:     "Complete interior and exterior service. Everything in both services combined for a full vehicle refresh.",
  paint:    "Machine compounding and polishing to remove scratches, swirl marks, water spots, and oxidation. Paint restored to near-original clarity.",
  ceramic:  "Professional-grade ceramic coating applied to exterior paint for long-term protection against UV, contaminants, and light scratches. Includes paint decontamination prep.",
}

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString()}`
}

function fmtRange(lo: number, hi: number): string {
  return `${fmt(lo)} – ${fmt(hi)}`
}

type Results = { low: number; high: number; note: string }

const TOOL_URL = "https://www.dayblip.com/tools/auto-detailing-cost-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Auto Detailing Cost Calculator",
      url: TOOL_URL,
      description: "Estimate your auto detailing cost instantly. Enter your vehicle type, service, and condition for a realistic price range.",
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
          name: "How much does auto detailing cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Auto detailing costs range from $30–$60 for a basic exterior wash to $500–$1,200 for a ceramic coating application. A full detail (interior and exterior) typically runs $175–$300 for a sedan. Vehicle size, condition, and location all affect the final price.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a car wash and auto detailing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A car wash cleans surface dirt using automated or hand washing. Auto detailing is a thorough, multi-step process that includes decontamination, polishing, and protection treatments. Detailing restores paint condition and protects surfaces, while a car wash simply removes surface dirt.",
          },
        },
        {
          "@type": "Question",
          name: "Is paint correction worth it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Paint correction removes scratches, swirl marks, water spots, and oxidation using machine polishing. It is worthwhile if you plan to apply a ceramic coating (which requires a clean surface), want to restore a vehicle's appearance before selling, or own a vehicle where paint condition affects its value. Costs typically range from $300–$600 for a sedan.",
          },
        },
        {
          "@type": "Question",
          name: "How long does a full auto detail take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A full detail (interior and exterior) typically takes 4–8 hours depending on vehicle size and condition. Paint correction can take 8–12 hours. Ceramic coating applications usually require 1–2 days including prep time and cure time.",
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

export default function AutoDetailingCostCalculatorPage() {
  const [vehicle,   setVehicle]   = useState("sedan")
  const [service,   setService]   = useState("full")
  const [condition, setCondition] = useState("good")
  const [location,  setLocation]  = useState("mid")
  const [results,   setResults]   = useState<Results | null>(null)

  useEffect(() => {
    const base: Range   = BASE_RATE[service]   ?? [100, 175]
    const vMult         = VEHICLE_MULT[vehicle] ?? 1
    const cMult         = COND_MULT[condition]  ?? 1
    const lMult         = LOC_MULT[location]    ?? 1

    const low  = base[0] * vMult * cMult * lMult
    const high = base[1] * vMult * cMult * lMult

    setResults({ low, high, note: INCLUDED[service] ?? "" })
  }, [vehicle, service, condition, location])

  const shareText = `I estimated my auto detailing cost with this free calculator: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .detail-select:focus { border-color: #f97316 !important; }
        .detail-select option { background: #0d1b2a; color: #fff; }
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
              Auto Detailing Cost Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              What should you pay to detail your car? Choose your vehicle type and
              service to get an instant estimate. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Auto Detailing Cost Calculator" },
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
                Auto detailing costs range from $30–$60 for a basic exterior wash to
                $500–$1,200 for ceramic coating. A full interior and exterior detail
                on a sedan typically runs $175–$300. Vehicle size, condition, and
                location all affect the final price significantly.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Estimates reflect typical US market rates. Actual prices vary by provider
              and specific vehicle conditions.
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
                  About your vehicle
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Vehicle type
                    </label>
                    <select className="detail-select" style={selectStyle} value={vehicle} onChange={e => setVehicle(e.target.value)}>
                      <option value="sedan">Sedan or coupe</option>
                      <option value="suv">SUV or crossover</option>
                      <option value="truck">Truck or van</option>
                      <option value="minivan">Minivan</option>
                      <option value="luxury">Luxury or exotic vehicle</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Service type
                    </label>
                    <select className="detail-select" style={selectStyle} value={service} onChange={e => setService(e.target.value)}>
                      <option value="wash">Basic exterior wash and dry</option>
                      <option value="exterior">Full exterior detail (wash, clay bar, polish, wax)</option>
                      <option value="interior">Interior detail (vacuum, shampoo, wipe down, windows)</option>
                      <option value="full">Full detail (interior and exterior combined)</option>
                      <option value="paint">Paint correction (remove scratches, swirl marks, oxidation)</option>
                      <option value="ceramic">Ceramic coating application</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Vehicle condition
                    </label>
                    <select className="detail-select" style={selectStyle} value={condition} onChange={e => setCondition(e.target.value)}>
                      <option value="good">Good — light dirt, well maintained</option>
                      <option value="average">Average — moderate dirt and some staining</option>
                      <option value="poor">Poor — heavy dirt, stains, pet hair, or neglect</option>
                      <option value="verypoor">Very poor — significant neglect, heavy contamination</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                      Your location type
                    </label>
                    <select className="detail-select" style={selectStyle} value={location} onChange={e => setLocation(e.target.value)}>
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
                        Estimated detailing cost
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
                        one-time service estimate
                      </p>
                    </div>

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
                            label: "Vehicle type",
                            value: { sedan: "Sedan / coupe (1.0×)", suv: "SUV / crossover (1.2×)", truck: "Truck / van (1.25×)", minivan: "Minivan (1.2×)", luxury: "Luxury / exotic (1.5×)" }[vehicle] ?? vehicle,
                          },
                          {
                            label: "Service",
                            value: { wash: "Basic exterior wash", exterior: "Full exterior detail", interior: "Interior detail", full: "Full detail", paint: "Paint correction", ceramic: "Ceramic coating" }[service] ?? service,
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
                            borderBottom: i < 3 ? "1px solid #0f3460" : "none",
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
                        EcoClean offers professional auto detailing services in Wisconsin.
                        Get an accurate quote for your specific vehicle and service.
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
                        Book Your Detail with EcoClean →
                      </a>
                    </div>

                    <ShareButtons
                      text={shareText}
                      url={TOOL_URL}
                      title="Auto Detailing Cost Calculator — What Should You Pay to Detail Your Car?"
                    />
                  </>
                )}
              </div>

            </div>

            {/* Methodology & Attribution */}
            <div style={{ marginTop: 40 }}>
              <MethodologyNote text="Estimates are based on typical US market rates for auto detailing services and are provided for informational purposes only. Actual prices vary by provider, location, and specific vehicle condition. Contact EcoClean for an accurate quote." />
              <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                Powered by EcoClean — professional auto detailing and cleaning services in Wisconsin.
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* Related Tools */}
            <div style={{ marginTop: 40 }}>
              <RelatedTools tools={[
                { emoji: "🏠", title: "Home Cleaning Cost Calculator",            desc: "Estimate regular residential cleaning costs",         href: "/tools/home-cleaning-cost-calculator" },
                { emoji: "📦", title: "Move-In/Out Cleaning Cost Calculator",     desc: "What should you pay for a move clean?",             href: "/tools/move-in-out-cleaning-cost-calculator" },
                { emoji: "🏢", title: "Commercial Cleaning ROI Calculator",       desc: "The business case for professional office cleaning", href: "/tools/commercial-cleaning-roi-calculator" },
                { emoji: "💸", title: "Corporate Salary Ceiling Calculator",      desc: "What is your career actually building?",            href: "/tools/corporate-salary-ceiling-calculator" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
