"use client"

import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkArrangement =
  | "Fully in-office"
  | "Hybrid (1-2 days remote)"
  | "Hybrid (3-4 days remote)"
  | "Fully remote"

type CommuteMethod = "Car" | "Public transit" | "Walk/Bike"

interface OfferInputs {
  salary: number
  bonus: number
  state: string
  arrangement: WorkArrangement
  commuteMiles: number
  commuteMethod: CommuteMethod
  matchPct: number
  healthPremium: number
  otherBenefits: number
}

interface OfferResult {
  grossSalary: number
  federalRate: number
  federalTax: number
  stateTax: number
  stateRate: number
  fica: number
  healthAnnual: number
  commuteCost: number
  commuteTimeValue: number
  matchValue: number
  otherBenefits: number
  takehome: number
  trueValue: number
  trueHourly: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATE_TAX: Record<string, number> = {
  Texas: 0,
  Florida: 0,
  Nevada: 0,
  Washington: 0,
  "South Dakota": 0,
  Wyoming: 0,
  Alaska: 0,
  Tennessee: 0,
  "New Hampshire": 0,
  California: 0.093,
  "New York": 0.0685,
  "New Jersey": 0.055,
  Illinois: 0.0495,
  Massachusetts: 0.05,
  Virginia: 0.0575,
  Georgia: 0.0549,
  "North Carolina": 0.045,
  Arizona: 0.025,
  Colorado: 0.044,
  Ohio: 0.0375,
  Michigan: 0.0425,
}

const ALL_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
]

const WORK_DAYS: Record<WorkArrangement, number> = {
  "Fully in-office": 250,
  "Hybrid (1-2 days remote)": 210,
  "Hybrid (3-4 days remote)": 115,
  "Fully remote": 0,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFederalRate(salary: number): number {
  if (salary <= 50400) return 0.12
  if (salary <= 105700) return 0.22
  if (salary <= 201775) return 0.24
  return 0.32
}

function getStateTaxRate(state: string): number {
  return STATE_TAX[state] ?? 0.05
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(2) + "%"
}

function calcOffer(inputs: OfferInputs): OfferResult {
  const grossSalary = inputs.salary + inputs.bonus
  const federalRate = getFederalRate(grossSalary)
  const stateRate = getStateTaxRate(inputs.state)

  const federalTax = grossSalary * federalRate
  const stateTax = grossSalary * stateRate
  const fica = grossSalary * 0.0765
  const healthAnnual = inputs.healthPremium * 12

  const takehome = grossSalary - federalTax - stateTax - fica - healthAnnual

  const workdays = WORK_DAYS[inputs.arrangement]

  let commuteCost = 0
  let commuteTimeValue = 0

  if (inputs.arrangement !== "Fully remote") {
    if (inputs.commuteMethod === "Car") {
      const annualMiles = inputs.commuteMiles * 2 * workdays
      commuteCost = annualMiles * 0.21
    } else if (inputs.commuteMethod === "Public transit") {
      commuteCost = inputs.commuteMiles * 0.5 * 2 * workdays
    }

    if (inputs.commuteMethod !== "Walk/Bike") {
      const hoursPerYear = (inputs.commuteMiles / 25) * 2 * workdays
      commuteTimeValue = hoursPerYear * ((grossSalary / 2080) * 0.5)
    }
  }

  const matchValue = grossSalary * (inputs.matchPct / 100)

  const trueValue =
    takehome + matchValue + inputs.otherBenefits - commuteCost - commuteTimeValue

  const trueHourly = trueValue / 2080

  return {
    grossSalary,
    federalRate,
    federalTax,
    stateTax,
    stateRate,
    fica,
    healthAnnual,
    commuteCost,
    commuteTimeValue,
    matchValue,
    otherBenefits: inputs.otherBenefits,
    takehome,
    trueValue,
    trueHourly,
  }
}

// ─── Input defaults ───────────────────────────────────────────────────────────

const defaultA: OfferInputs = {
  salary: 80000,
  bonus: 0,
  state: "Texas",
  arrangement: "Fully in-office",
  commuteMiles: 15,
  commuteMethod: "Car",
  matchPct: 4,
  healthPremium: 200,
  otherBenefits: 0,
}

const defaultB: OfferInputs = {
  salary: 85000,
  bonus: 0,
  state: "New York",
  arrangement: "Hybrid (3-4 days remote)",
  commuteMiles: 25,
  commuteMethod: "Car",
  matchPct: 3,
  healthPremium: 350,
  otherBenefits: 0,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1a1a2e",
  border: "1px solid #0f3460",
  color: "#ffffff",
  borderRadius: 6,
  padding: "10px 12px",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#a8a8b3",
  fontSize: 13,
  marginBottom: 6,
  fontWeight: 500,
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

interface OfferColumnProps {
  label: string
  inputs: OfferInputs
  onChange: (updated: OfferInputs) => void
}

function OfferColumn({ label, inputs, onChange }: OfferColumnProps) {
  function set<K extends keyof OfferInputs>(key: K, value: OfferInputs[K]) {
    onChange({ ...inputs, [key]: value })
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          backgroundColor: "#1e2d4a",
          borderRadius: 8,
          padding: "10px 16px",
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          color: "#ffffff",
          marginBottom: 20,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>

      <Field label="Base Salary ($)">
        <input
          type="number"
          style={inputStyle}
          value={inputs.salary}
          onChange={(e) => set("salary", Number(e.target.value))}
          min={0}
        />
      </Field>

      <Field label="Annual Bonus ($)">
        <input
          type="number"
          style={inputStyle}
          value={inputs.bonus}
          onChange={(e) => set("bonus", Number(e.target.value))}
          min={0}
        />
      </Field>

      <Field label="State">
        <select
          style={inputStyle}
          value={inputs.state}
          onChange={(e) => set("state", e.target.value)}
        >
          {ALL_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Work Arrangement">
        <select
          style={inputStyle}
          value={inputs.arrangement}
          onChange={(e) => set("arrangement", e.target.value as WorkArrangement)}
        >
          <option>Fully in-office</option>
          <option>Hybrid (1-2 days remote)</option>
          <option>Hybrid (3-4 days remote)</option>
          <option>Fully remote</option>
        </select>
      </Field>

      {inputs.arrangement !== "Fully remote" && (
        <>
          <Field label="Commute Distance (miles one way)">
            <input
              type="number"
              style={inputStyle}
              value={inputs.commuteMiles}
              onChange={(e) => set("commuteMiles", Number(e.target.value))}
              min={0}
            />
          </Field>

          <Field label="Commute Method">
            <select
              style={inputStyle}
              value={inputs.commuteMethod}
              onChange={(e) => set("commuteMethod", e.target.value as CommuteMethod)}
            >
              <option>Car</option>
              <option>Public transit</option>
              <option>Walk/Bike</option>
            </select>
          </Field>
        </>
      )}

      <Field label="401k Match (%)">
        <input
          type="number"
          style={inputStyle}
          value={inputs.matchPct}
          onChange={(e) => set("matchPct", Number(e.target.value))}
          min={0}
          max={100}
          step={0.5}
        />
      </Field>

      <Field label="Health Insurance Monthly Premium ($)">
        <input
          type="number"
          style={inputStyle}
          value={inputs.healthPremium}
          onChange={(e) => set("healthPremium", Number(e.target.value))}
          min={0}
        />
      </Field>

      <Field label="Other Annual Benefits Value ($)">
        <input
          type="number"
          style={inputStyle}
          value={inputs.otherBenefits}
          onChange={(e) => set("otherBenefits", Number(e.target.value))}
          min={0}
        />
      </Field>
    </div>
  )
}

interface ResultCardProps {
  label: string
  inputs: OfferInputs
  result: OfferResult
  isWinner: boolean
}

function ResultCard({ label, inputs, result, isWinner }: ResultCardProps) {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 0",
    borderBottom: "1px solid #0f3460",
    fontSize: 14,
    color: "#e8e8e8",
  }

  const negStyle: React.CSSProperties = { color: "#FF6B6B", fontWeight: 600 }
  const posStyle: React.CSSProperties = { color: "#4FC3F7", fontWeight: 600 }

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: "#1e2d4a",
        borderRadius: 10,
        border: `2px solid ${isWinner ? "#22c55e" : "#0f3460"}`,
        padding: "20px 22px",
        position: "relative",
      }}
    >
      {isWinner && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#22c55e",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 700,
            padding: "3px 12px",
            borderRadius: 20,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
          }}
        >
          🏆 Winner
        </div>
      )}

      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          color: "#ffffff",
          marginBottom: 18,
          marginTop: isWinner ? 6 : 0,
        }}
      >
        {label}
      </div>

      <div style={rowStyle}>
        <span>Gross Salary</span>
        <span style={posStyle}>+${fmt(result.grossSalary)}</span>
      </div>
      <div style={rowStyle}>
        <span>Federal Tax ({fmtPct(result.federalRate)})</span>
        <span style={negStyle}>−${fmt(result.federalTax)}</span>
      </div>
      <div style={rowStyle}>
        <span>
          State Tax ({inputs.state}, {fmtPct(result.stateRate)})
        </span>
        <span style={negStyle}>−${fmt(result.stateTax)}</span>
      </div>
      <div style={rowStyle}>
        <span>FICA (7.65%)</span>
        <span style={negStyle}>−${fmt(result.fica)}</span>
      </div>
      <div style={rowStyle}>
        <span>Health Insurance</span>
        <span style={negStyle}>−${fmt(result.healthAnnual)}/yr</span>
      </div>
      {result.commuteCost > 0 && (
        <div style={rowStyle}>
          <span>Commute Cost</span>
          <span style={negStyle}>−${fmt(result.commuteCost)}/yr</span>
        </div>
      )}
      {result.commuteTimeValue > 0 && (
        <div style={rowStyle}>
          <span>Commute Time Value</span>
          <span style={negStyle}>−${fmt(result.commuteTimeValue)}/yr</span>
        </div>
      )}
      <div style={rowStyle}>
        <span>401k Match</span>
        <span style={posStyle}>+${fmt(result.matchValue)}/yr</span>
      </div>
      {result.otherBenefits > 0 && (
        <div style={rowStyle}>
          <span>Other Benefits</span>
          <span style={posStyle}>+${fmt(result.otherBenefits)}/yr</span>
        </div>
      )}

      <div
        style={{
          borderTop: "2px solid #0f3460",
          marginTop: 12,
          paddingTop: 14,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#a8a8b3",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          True Annual Value
        </div>
        <div
          style={{
            color: "#F9A825",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          ${fmt(result.trueValue)}
        </div>
        <div style={{ color: "#a8a8b3", fontSize: 13, marginTop: 6 }}>
          True Hourly Rate: ${result.trueHourly.toFixed(2)}/hour (2,080 hrs)
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobOfferComparisonPage() {
  const [offerA, setOfferA] = useState<OfferInputs>(defaultA)
  const [offerB, setOfferB] = useState<OfferInputs>(defaultB)
  const [results, setResults] = useState<{
    a: OfferResult
    b: OfferResult
  } | null>(null)

  function handleCompare() {
    setResults({ a: calcOffer(offerA), b: calcOffer(offerB) })
  }

  const winnerBanner = (() => {
    if (!results) return null
    const diff = Math.abs(results.a.trueValue - results.b.trueValue)
    if (diff < 2000) {
      return {
        text: "These offers are essentially equal. Choose based on career growth, company culture, and role fit.",
        bg: "#1e3a5f",
        color: "#4FC3F7",
      }
    }
    const winner = results.a.trueValue > results.b.trueValue ? "A" : "B"
    return {
      text: `Offer ${winner} is worth $${fmt(diff)} more per year in true annual value`,
      bg: "#14532d",
      color: "#22c55e",
    }
  })()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1a1a2e" }}>
      <SchemaMarkup
        schemas={[
          webApplicationSchema(
            "Job Offer Comparison Calculator",
            "Compare two job offers by true annual value after taxes commute costs and benefits",
            "https://www.dayblip.com/tools/job-offer-comparison",
            "FinanceApplication"
          ),
          faqSchema([
            {
              question: "How do I compare two job offers?",
              answer:
                "To properly compare two job offers calculate the true annual value of each: start with base salary subtract federal and state income taxes and FICA (7.65%) subtract annual commute costs and the value of commute time then add 401k match value and benefits. A $90,000 offer in California nets approximately $61,000 after taxes. The same salary in Texas nets $69,000 — an $8,000 difference from state taxes alone.",
            },
            {
              question: "Is a higher salary always better?",
              answer:
                "Not always. A higher salary in a high-tax state with a long commute can net less than a lower salary in a no-tax state with remote work. Key factors to compare: state income tax difference (up to 13.3% in CA), commute cost and time value (average $7,200 per year), health insurance premium difference, 401k match and remote work days which save $3,000-8,000 per year in commute expenses.",
            },
          ]),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com" },
            { name: "Tools", url: "https://www.dayblip.com/tools" },
            {
              name: "Job Offer Comparison",
              url: "https://www.dayblip.com/tools/job-offer-comparison",
            },
          ]),
        ]}
      />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>💼</div>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.25,
            maxWidth: 780,
            margin: "0 auto 16px",
          }}
        >
          Job Offer Comparison Calculator — Which Job Offer Is Really Worth More?
        </h1>
        <p
          style={{
            color: "#a8a8b3",
            fontSize: 17,
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          See the true annual value of any offer after taxes commute and benefits
        </p>
      </div>

      {/* Breadcrumb + intro */}
      <section
        style={{
          backgroundColor: "#1a1a2e",
          padding: "32px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Job Offer Comparison" },
          ]}
        />

        {/* Quick Answer Box */}
        <div
          style={{
            backgroundColor: "#1e2d4a",
            borderLeft: "4px solid #e94560",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "#e94560",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Quick Answer
          </div>
          <p
            style={{
              color: "#e8e8e8",
              fontSize: 15,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            A $90,000 job in New York City after state tax and commute costs can net less than an
            $80,000 remote job in Texas. The five factors that change which offer wins: state income
            tax difference (up to $15,000/year), commute time value (average $4,200/year), health
            insurance premium difference, 401k match difference, and remote work days saving
            $3,000–8,000/year in commute and work expenses.
          </p>
        </div>

        <p
          style={{
            color: "#a8a8b3",
            fontSize: 14,
            marginBottom: 32,
            lineHeight: 1.7,
          }}
        >
          A job offer comparison calculator shows the true annual value of each offer after all
          taxes commute costs and benefit values are factored in. The salary on your offer letter is
          not what you actually take home. Two offers that look identical on paper can differ by
          $15,000 or more in real annual value once all factors are calculated.
        </p>

        <ShareButtons
          text="I compared two job offers. Offer A pays $80K but Offer B pays $85K. After taxes and commute costs Offer A is actually worth more. Free job offer calculator:"
          url="https://www.dayblip.com/tools/job-offer-comparison"
          title="Job Offer Comparison Calculator"
        />
      </section>

      {/* Calculator */}
      <section
        style={{
          backgroundColor: "#16213e",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            Enter Both Offers
          </h2>

          {/* Two-column input grid */}
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <OfferColumn label="Offer A" inputs={offerA} onChange={setOfferA} />
            </div>
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <OfferColumn label="Offer B" inputs={offerB} onChange={setOfferB} />
            </div>
          </div>

          {/* Compare button */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={handleCompare}
              style={{
                backgroundColor: "#e94560",
                color: "#ffffff",
                padding: "12px 32px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
                letterSpacing: 0.3,
              }}
            >
              Compare These Offers →
            </button>
          </div>

          {/* Results */}
          {results && (
            <div style={{ marginTop: 40 }}>
              <h2
                style={{
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                True Annual Value Breakdown
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                  <ResultCard
                    label="Offer A"
                    inputs={offerA}
                    result={results.a}
                    isWinner={results.a.trueValue >= results.b.trueValue}
                  />
                </div>
                <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                  <ResultCard
                    label="Offer B"
                    inputs={offerB}
                    result={results.b}
                    isWinner={results.b.trueValue > results.a.trueValue}
                  />
                </div>
              </div>

              {/* Winner banner */}
              {winnerBanner && (
                <div
                  style={{
                    marginTop: 24,
                    backgroundColor: winnerBanner.bg,
                    borderRadius: 8,
                    padding: "16px 24px",
                    textAlign: "center",
                    color: winnerBanner.color,
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {winnerBanner.text}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related tools + share */}
      <section
        style={{
          backgroundColor: "#1a1a2e",
          padding: "48px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <RelatedTools
          tools={[
            {
              emoji: "💰",
              title: "Take Home Pay Calculator",
              desc: "Exact net pay after all taxes",
              href: "/finance/take-home-pay",
            },
            {
              emoji: "⏰",
              title: "True Hourly Wage",
              desc: "What your job really pays per hour",
              href: "/tools/true-hourly-wage",
            },
            {
              emoji: "📊",
              title: "Salary Negotiation",
              desc: "Get paid what your role is worth",
              href: "/tools/salary-negotiation",
            },
            {
              emoji: "🏛️",
              title: "Tax Bracket Calculator",
              desc: "How your salary affects your taxes",
              href: "/finance/tax-bracket",
            },
          ]}
        />
      </section>
    </div>
  )
}
