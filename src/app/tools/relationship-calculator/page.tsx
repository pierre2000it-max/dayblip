"use client"

import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function fmtUSD(n: number): string {
  return "$" + fmt(Math.round(n))
}

// ── types ─────────────────────────────────────────────────────────────────────

type Tab = "wedding" | "child" | "divorce" | "compatibility"

// ── Wedding tab ───────────────────────────────────────────────────────────────

interface WeddingResult {
  venue: number
  catering: number
  photography: number
  music: number
  flowers: number
  attire: number
  other: number
  total: number
  investedValue: number
  opportunityCost: number
}

function WeddingTab() {
  const [budget, setBudget] = useState(30000)
  const [guests, setGuests] = useState(100)
  const [yearsUntil, setYearsUntil] = useState(2)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [result, setResult] = useState<WeddingResult | null>(null)

  function calculate() {
    const venue = budget * 0.3
    const catering = budget * 0.35
    const photography = budget * 0.1
    const music = budget * 0.05
    const flowers = budget * 0.05
    const attire = budget * 0.08
    const other = budget * 0.07
    const investedValue = budget * Math.pow(1 + annualReturn / 100, 30)
    const opportunityCost = investedValue - budget
    setResult({
      venue,
      catering,
      photography,
      music,
      flowers,
      attire,
      other,
      total: budget,
      investedValue,
      opportunityCost,
    })
  }

  const breakdown: Array<{ label: string; value: number; pct: number }> = result
    ? [
        { label: "Venue", value: result.venue, pct: 30 },
        { label: "Catering", value: result.catering, pct: 35 },
        { label: "Photography", value: result.photography, pct: 10 },
        { label: "Music / DJ", value: result.music, pct: 5 },
        { label: "Flowers", value: result.flowers, pct: 5 },
        { label: "Attire", value: result.attire, pct: 8 },
        { label: "Other", value: result.other, pct: 7 },
      ]
    : []

  return (
    <div>
      <h2 style={{ color: "#e8e8e8", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        True Cost of a Wedding
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <InputField
          label="Wedding budget ($)"
          value={budget}
          onChange={setBudget}
          min={1000}
          step={1000}
        />
        <InputField
          label="Number of guests"
          value={guests}
          onChange={setGuests}
          min={1}
          step={10}
        />
        <InputField
          label="Years until wedding"
          value={yearsUntil}
          onChange={setYearsUntil}
          min={0}
          step={1}
        />
        <InputField
          label="Expected annual return (%)"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={1}
          max={20}
          step={0.5}
        />
      </div>

      <CalcButton onClick={calculate}>Calculate Wedding Cost</CalcButton>

      {result && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              background: "#16213e",
              borderRadius: 10,
              padding: "20px 24px",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                color: "#a8a8b3",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              Cost Breakdown
            </p>
            {breakdown.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <span style={{ color: "#a8a8b3", fontSize: 14, width: 140, flexShrink: 0 }}>
                  {item.label} ({item.pct}%)
                </span>
                <div
                  style={{
                    flex: 1,
                    background: "#1a1a2e",
                    borderRadius: 4,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.pct * (100 / 35)}%`,
                      background: "#e94560",
                      height: "100%",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span
                  style={{ color: "#e8e8e8", fontSize: 14, fontWeight: 600, width: 90, textAlign: "right" }}
                >
                  {fmtUSD(item.value)}
                </span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid #0f3460",
                marginTop: 12,
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#e8e8e8", fontWeight: 700, fontSize: 15 }}>Total</span>
              <span style={{ color: "#e94560", fontWeight: 800, fontSize: 18 }}>
                {fmtUSD(result.total)}
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#16213e",
              borderLeft: "4px solid #F9A825",
              borderRadius: 8,
              padding: "18px 22px",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                color: "#F9A825",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Opportunity Cost
            </p>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
            >
              <span style={{ color: "#a8a8b3", fontSize: 14 }}>
                If invested at {annualReturn}% for 30 years
              </span>
              <span style={{ color: "#4FC3F7", fontWeight: 700, fontSize: 16 }}>
                {fmtUSD(result.investedValue)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "#a8a8b3", fontSize: 14 }}>Opportunity cost</span>
              <span style={{ color: "#F9A825", fontWeight: 700, fontSize: 16 }}>
                {fmtUSD(result.opportunityCost)}
              </span>
            </div>
            <p style={{ color: "#a8a8b3", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              {fmtUSD(result.total)} invested instead of spent on a wedding grows to{" "}
              {fmtUSD(result.investedValue)} over 30 years at {annualReturn}% returns.
            </p>
          </div>

          <div
            style={{
              border: "1px solid rgba(234,179,8,0.3)",
              background: "rgba(78,63,0,0.3)",
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <p style={{ color: "#fef08a", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              A wedding is a once-in-a-lifetime celebration — not just a financial transaction.
              These numbers are for informed planning, not to discourage celebration.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Child tab ─────────────────────────────────────────────────────────────────

type CollegeType = "none" | "public" | "private"

interface ChildResult {
  costPerChild: number
  totalCost: number
  monthlyAddition: number
  percentOfIncome: number
  collegeExtra: number
  collegeLabel: string
  remainingYears: number
}

const ageBrackets: Array<{ min: number; max: number; annual: number }> = [
  { min: 0, max: 2, annual: 17000 },
  { min: 3, max: 5, annual: 17500 },
  { min: 6, max: 8, annual: 18000 },
  { min: 9, max: 11, annual: 18500 },
  { min: 12, max: 14, annual: 19000 },
  { min: 15, max: 17, annual: 20000 },
]

function calcChildCost(currentAge: number): number {
  let total = 0
  for (const bracket of ageBrackets) {
    const start = Math.max(currentAge, bracket.min)
    const end = bracket.max
    if (start <= end) {
      total += (end - start + 1) * bracket.annual
    }
  }
  return total
}

function ChildTab() {
  const [numChildren, setNumChildren] = useState(1)
  const [income, setIncome] = useState(75000)
  const [currentAge, setCurrentAge] = useState(0)
  const [college, setCollege] = useState<CollegeType>("none")
  const [result, setResult] = useState<ChildResult | null>(null)

  function calculate() {
    const collegeCosts: Record<CollegeType, number> = {
      none: 0,
      public: 110000,
      private: 240000,
    }
    const collegeLabels: Record<CollegeType, string> = {
      none: "No college estimate",
      public: "Public in-state (4yr)",
      private: "Private (4yr)",
    }
    const remainingYears = Math.max(18 - currentAge, 1)
    const costPerChild = calcChildCost(currentAge)
    const collegeExtra = collegeCosts[college]
    const totalCost = (costPerChild + collegeExtra) * numChildren
    const monthlyAddition = totalCost / remainingYears / 12
    const percentOfIncome = (totalCost / remainingYears / income) * 100

    setResult({
      costPerChild,
      totalCost,
      monthlyAddition,
      percentOfIncome,
      collegeExtra,
      collegeLabel: collegeLabels[college],
      remainingYears,
    })
  }

  const assessmentColor =
    result == null
      ? "#e8e8e8"
      : result.percentOfIncome < 15
      ? "#4ade80"
      : result.percentOfIncome < 25
      ? "#F9A825"
      : "#e94560"
  const assessmentText =
    result == null
      ? ""
      : result.percentOfIncome < 15
      ? "Manageable with your income"
      : result.percentOfIncome < 25
      ? "Significant adjustment to budget"
      : "Major lifestyle change required"

  return (
    <div>
      <h2 style={{ color: "#e8e8e8", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Cost of Raising a Child
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <InputField
          label="Number of children"
          value={numChildren}
          onChange={setNumChildren}
          min={1}
          max={10}
          step={1}
        />
        <InputField
          label="Annual household income ($)"
          value={income}
          onChange={setIncome}
          min={20000}
          step={5000}
        />
        <InputField
          label="Child's current age (0–17)"
          value={currentAge}
          onChange={setCurrentAge}
          min={0}
          max={17}
          step={1}
        />
        <div>
          <label
            style={{
              display: "block",
              color: "#a8a8b3",
              fontSize: 13,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            College type
          </label>
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value as CollegeType)}
            style={{
              width: "100%",
              background: "#1e2d4a",
              border: "1px solid #0f3460",
              borderRadius: 6,
              color: "#e8e8e8",
              padding: "10px 12px",
              fontSize: 14,
            }}
          >
            <option value="none">No college estimate</option>
            <option value="public">Public in-state (4yr)</option>
            <option value="private">Private (4yr)</option>
          </select>
        </div>
      </div>

      <CalcButton onClick={calculate}>Calculate</CalcButton>

      {result && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              background: "#16213e",
              borderRadius: 10,
              padding: "20px 24px",
              marginBottom: 16,
            }}
          >
            <StatRow
              label={`Estimated cost to age 18 (per child)`}
              value={fmtUSD(result.costPerChild)}
              accent="#4FC3F7"
            />
            <StatRow
              label={`Total for ${numChildren} ${numChildren === 1 ? "child" : "children"}`}
              value={fmtUSD(result.totalCost)}
              accent="#e94560"
              large
            />
            <StatRow
              label="Monthly budget addition"
              value={fmtUSD(result.monthlyAddition) + "/month"}
              accent="#4FC3F7"
            />
            <StatRow
              label="As % of annual income"
              value={fmt(result.percentOfIncome, 1) + "%"}
              accent="#F9A825"
            />
            {result.collegeExtra > 0 && (
              <StatRow
                label={`${result.collegeLabel} (per child)`}
                value={"+" + fmtUSD(result.collegeExtra)}
                accent="#F9A825"
              />
            )}
          </div>

          <div
            style={{
              background: "#16213e",
              border: `1px solid ${assessmentColor}`,
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <p style={{ color: assessmentColor, fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>
              {assessmentText}
            </p>
            <p style={{ color: "#a8a8b3", fontSize: 13, margin: 0 }}>
              Annual child cost as {fmt(result.percentOfIncome, 1)}% of your household income over{" "}
              {result.remainingYears} remaining {result.remainingYears === 1 ? "year" : "years"}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Divorce tab ───────────────────────────────────────────────────────────────

type DivorceType = "uncontested" | "contested"

interface DivorceResult {
  legalFees: number
  assetDivision: number
  additionalAnnualCost: number
  recoveryYears: number
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
  "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
  "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
]

function DivorceTab() {
  const [marriageLength, setMarriageLength] = useState(10)
  const [jointIncome, setJointIncome] = useState(120000)
  const [homeEquity, setHomeEquity] = useState(150000)
  const [divorceType, setDivorceType] = useState<DivorceType>("uncontested")
  const [state, setState] = useState("California")
  const [result, setResult] = useState<DivorceResult | null>(null)

  function calculate() {
    const legalFees = divorceType === "uncontested" ? 4000 : 22500
    const assetDivision = homeEquity / 2
    const additionalAnnualCost = jointIncome * 0.25
    const totalImpact = legalFees + assetDivision + additionalAnnualCost * 2
    const recoveryYears = Math.ceil(totalImpact / (jointIncome * 0.15))

    setResult({ legalFees, assetDivision, additionalAnnualCost, recoveryYears })
  }

  return (
    <div>
      <h2 style={{ color: "#e8e8e8", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Cost of Divorce
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <InputField
          label="Marriage length (years)"
          value={marriageLength}
          onChange={setMarriageLength}
          min={1}
          step={1}
        />
        <InputField
          label="Joint annual income ($)"
          value={jointIncome}
          onChange={setJointIncome}
          min={20000}
          step={5000}
        />
        <InputField
          label="Home equity ($)"
          value={homeEquity}
          onChange={setHomeEquity}
          min={0}
          step={5000}
        />
        <div>
          <label
            style={{
              display: "block",
              color: "#a8a8b3",
              fontSize: 13,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Divorce type
          </label>
          <select
            value={divorceType}
            onChange={(e) => setDivorceType(e.target.value as DivorceType)}
            style={{
              width: "100%",
              background: "#1e2d4a",
              border: "1px solid #0f3460",
              borderRadius: 6,
              color: "#e8e8e8",
              padding: "10px 12px",
              fontSize: 14,
            }}
          >
            <option value="uncontested">Uncontested (mutual agreement)</option>
            <option value="contested">Contested (disagreements)</option>
          </select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              color: "#a8a8b3",
              fontSize: 13,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{
              width: "100%",
              background: "#1e2d4a",
              border: "1px solid #0f3460",
              borderRadius: 6,
              color: "#e8e8e8",
              padding: "10px 12px",
              fontSize: 14,
            }}
          >
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CalcButton onClick={calculate}>Calculate</CalcButton>

      {result && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              background: "#16213e",
              borderRadius: 10,
              padding: "20px 24px",
              marginBottom: 16,
            }}
          >
            <StatRow label="Legal fees (estimated)" value={fmtUSD(result.legalFees)} accent="#e94560" />
            <StatRow
              label="Asset division impact"
              value={fmtUSD(result.assetDivision)}
              accent="#e94560"
            />
            <StatRow
              label="Additional annual living costs (2 households)"
              value={fmtUSD(result.additionalAnnualCost) + "/yr"}
              accent="#F9A825"
            />
            <div
              style={{
                borderTop: "1px solid #0f3460",
                marginTop: 12,
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#e8e8e8", fontSize: 14 }}>Estimated financial recovery time</span>
              <span style={{ color: "#4FC3F7", fontWeight: 800, fontSize: 22 }}>
                {result.recoveryYears} {result.recoveryYears === 1 ? "year" : "years"}
              </span>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(234,179,8,0.3)",
              background: "rgba(78,63,0,0.3)",
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <p style={{ color: "#fef08a", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Divorce costs vary enormously based on complexity, assets, and legal representation.
              These are national averages for planning purposes only.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Compatibility tab ─────────────────────────────────────────────────────────

type SpendingStyle = "saver" | "balanced" | "spender"
type DebtLevel = "none" | "under10k" | "10k_50k" | "over50k"
type FinancialGoal = "early_retirement" | "comfortable" | "experiences" | "building_wealth"
type MoneyCommunication = "open" | "rarely" | "avoid"

interface PersonProfile {
  spending: SpendingStyle
  debt: DebtLevel
  goal: FinancialGoal
  communication: MoneyCommunication
}

function scoreSpending(a: SpendingStyle, b: SpendingStyle): number {
  if (a === b) return 25
  const arr: SpendingStyle[] = ["saver", "balanced", "spender"]
  const diff = Math.abs(arr.indexOf(a) - arr.indexOf(b))
  return diff === 1 ? 12 : 0
}

function scoreDebt(a: DebtLevel, b: DebtLevel): number {
  const arr: DebtLevel[] = ["none", "under10k", "10k_50k", "over50k"]
  const diff = Math.abs(arr.indexOf(a) - arr.indexOf(b))
  if (diff === 0) return a === "none" ? 20 : 15
  if (diff === 1) return 15
  if (diff === 2) return 8
  return 0
}

function scoreGoal(a: FinancialGoal, b: FinancialGoal): number {
  if (a === b) return 30
  const compatible: Array<[FinancialGoal, FinancialGoal]> = [
    ["early_retirement", "building_wealth"],
    ["comfortable", "experiences"],
  ]
  for (const [x, y] of compatible) {
    if ((a === x && b === y) || (a === y && b === x)) return 18
  }
  return 0
}

function scoreCommunication(a: MoneyCommunication, b: MoneyCommunication): number {
  if (a === b) return 25
  if ((a === "open" && b === "rarely") || (a === "rarely" && b === "open")) return 15
  if ((a === "open" && b === "avoid") || (a === "avoid" && b === "open")) return 5
  return 8
}

const DEFAULT_PERSON: PersonProfile = {
  spending: "balanced",
  debt: "under10k",
  goal: "comfortable",
  communication: "open",
}

function CompatibilityTab() {
  const [person1, setPerson1] = useState<PersonProfile>({ ...DEFAULT_PERSON })
  const [person2, setPerson2] = useState<PersonProfile>({ ...DEFAULT_PERSON })
  const [score, setScore] = useState<number | null>(null)

  function calculate() {
    const s =
      scoreSpending(person1.spending, person2.spending) +
      scoreDebt(person1.debt, person2.debt) +
      scoreGoal(person1.goal, person2.goal) +
      scoreCommunication(person1.communication, person2.communication)
    setScore(Math.min(s, 100))
  }

  const scoreColor =
    score == null
      ? "#e8e8e8"
      : score >= 80
      ? "#4ade80"
      : score >= 60
      ? "#F9A825"
      : score >= 40
      ? "#f97316"
      : "#e94560"

  const scoreLabel =
    score == null
      ? ""
      : score >= 80
      ? "Financially Compatible"
      : score >= 60
      ? "Mostly Compatible"
      : score >= 40
      ? "Mixed Compatibility"
      : "Financial Misalignment"

  const scoreDesc =
    score == null
      ? ""
      : score >= 80
      ? "You share similar money values and habits. Strong foundation for financial decisions together."
      : score >= 60
      ? "Some differences worth discussing but manageable with open communication."
      : score >= 40
      ? "Significant financial differences. Recommend discussing money goals in depth before major commitments."
      : "Very different money styles. Not a dealbreaker but requires serious honest conversation and potentially a financial counselor."

  return (
    <div>
      <h2 style={{ color: "#e8e8e8", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Financial Compatibility Score
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <PersonForm label="Person 1" profile={person1} onChange={setPerson1} />
        <PersonForm label="Person 2" profile={person2} onChange={setPerson2} />
      </div>

      <CalcButton onClick={calculate}>Calculate Compatibility</CalcButton>

      {score !== null && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              background: "#16213e",
              borderRadius: 10,
              padding: "28px 24px",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: `4px solid ${scoreColor}`,
                marginBottom: 16,
              }}
            >
              <span style={{ color: scoreColor, fontSize: 36, fontWeight: 800 }}>{score}</span>
              <span style={{ color: scoreColor, fontSize: 18, alignSelf: "flex-end", paddingBottom: 8 }}>
                /100
              </span>
            </div>
            <p style={{ color: scoreColor, fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
              {scoreLabel}
            </p>
            <p style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              {scoreDesc}
            </p>
          </div>

          <div
            style={{
              border: "1px solid rgba(234,179,8,0.3)",
              background: "rgba(78,63,0,0.3)",
              borderRadius: 8,
              padding: "14px 18px",
            }}
          >
            <p style={{ color: "#fef08a", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              This calculator is for entertainment and self-reflection only. Real relationship success
              depends on communication, respect, and shared values — not just financial alignment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function PersonForm({
  label,
  profile,
  onChange,
}: {
  label: string
  profile: PersonProfile
  onChange: (p: PersonProfile) => void
}) {
  function set<K extends keyof PersonProfile>(key: K, value: PersonProfile[K]) {
    onChange({ ...profile, [key]: value })
  }

  return (
    <div
      style={{
        background: "#16213e",
        borderRadius: 10,
        padding: "18px 20px",
        border: "1px solid #0f3460",
      }}
    >
      <p
        style={{
          color: "#4FC3F7",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 14,
        }}
      >
        {label}
      </p>

      <SelectField
        label="Monthly spending style"
        value={profile.spending}
        onChange={(v) => set("spending", v as SpendingStyle)}
        options={[
          { value: "saver", label: "Saver (saves 20%+)" },
          { value: "balanced", label: "Balanced (saves 10–20%)" },
          { value: "spender", label: "Spender (saves under 10%)" },
        ]}
      />
      <SelectField
        label="Debt level"
        value={profile.debt}
        onChange={(v) => set("debt", v as DebtLevel)}
        options={[
          { value: "none", label: "Debt free" },
          { value: "under10k", label: "Under $10,000" },
          { value: "10k_50k", label: "$10,000–$50,000" },
          { value: "over50k", label: "Over $50,000" },
        ]}
      />
      <SelectField
        label="Financial goal"
        value={profile.goal}
        onChange={(v) => set("goal", v as FinancialGoal)}
        options={[
          { value: "early_retirement", label: "Early retirement" },
          { value: "comfortable", label: "Comfortable lifestyle" },
          { value: "experiences", label: "Experiences and travel" },
          { value: "building_wealth", label: "Building wealth for family" },
        ]}
      />
      <SelectField
        label="Money communication"
        value={profile.communication}
        onChange={(v) => set("communication", v as MoneyCommunication)}
        options={[
          { value: "open", label: "Talk openly about money" },
          { value: "rarely", label: "Rarely discuss it" },
          { value: "avoid", label: "Avoid the topic" },
        ]}
      />
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          color: "#a8a8b3",
          fontSize: 13,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          background: "#1e2d4a",
          border: "1px solid #0f3460",
          borderRadius: 6,
          color: "#e8e8e8",
          padding: "10px 12px",
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          color: "#a8a8b3",
          fontSize: 12,
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#1e2d4a",
          border: "1px solid #0f3460",
          borderRadius: 6,
          color: "#e8e8e8",
          padding: "8px 10px",
          fontSize: 13,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function CalcButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#e94560",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "13px 28px",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        transition: "opacity 0.15s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  )
}

function StatRow({
  label,
  value,
  accent,
  large,
}: {
  label: string
  value: string
  accent: string
  large?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: "1px solid #0f3460",
      }}
    >
      <span style={{ color: "#a8a8b3", fontSize: 14 }}>{label}</span>
      <span style={{ color: accent, fontWeight: large ? 800 : 700, fontSize: large ? 20 : 15 }}>
        {value}
      </span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "wedding", label: "💍 Wedding" },
  { id: "child", label: "👶 Having a Child" },
  { id: "divorce", label: "⚖️ Divorce" },
  { id: "compatibility", label: "❤️ Compatibility" },
]

export default function RelationshipCalculatorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("wedding")

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          webApplicationSchema(
            "Relationship Cost Calculator",
            "Calculate the true financial cost of weddings divorces and having children with opportunity cost analysis",
            "https://www.dayblip.com/tools/relationship-calculator",
            "FinanceApplication"
          ),
          faqSchema([
            {
              question: "How much does a wedding cost in 2026?",
              answer:
                "The average US wedding costs approximately $30,000 in 2026 according to wedding industry surveys. This includes venue catering photography music flowers attire and other expenses. Costs vary significantly by region — weddings in New York and California average $40,000-60,000 while Midwest weddings average $20,000-25,000. A $30,000 wedding budget invested at 7% annual returns for 30 years would grow to approximately $228,000.",
            },
            {
              question: "How much does it cost to raise a child in the US?",
              answer:
                "The USDA estimates it costs approximately $310,000 to raise one child from birth to age 18 in the US not including college. This averages $17,000-20,000 per year depending on age. With a 4-year public college education the total cost approaches $420,000 per child. Private college adds another $130,000 bringing the total to $550,000 per child.",
            },
          ]),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com" },
            { name: "Tools", url: "https://www.dayblip.com/tools" },
            {
              name: "Relationship Calculator",
              url: "https://www.dayblip.com/tools/relationship-calculator",
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
        <div style={{ fontSize: 56, marginBottom: 16 }}>💍</div>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.25,
            maxWidth: 740,
            margin: "0 auto 16px",
          }}
        >
          Relationship Cost Calculator — The True Financial Cost of Major Life Decisions
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
          Wedding costs, child-rearing expenses, divorce costs, and financial compatibility
        </p>
      </div>

      {/* Body */}
      <div
        style={{
          background: "#1a1a2e",
          padding: "32px 24px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Relationship Calculator" },
          ]}
        />

        {/* Quick answer */}
        <div
          style={{
            background: "#1e2d4a",
            borderLeft: "4px solid #e94560",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 24,
            marginTop: 20,
          }}
        >
          <p
            style={{
              color: "#e94560",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            QUICK ANSWER
          </p>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            The average US wedding costs $30,000. Raising one child to age 18 costs $310,000 per USDA
            data. The average US divorce costs $15,000–20,000 in legal fees plus ongoing financial
            restructuring. $30,000 invested at 7% for 30 years instead of spent on a wedding grows to
            $228,000. These are not reasons to avoid these decisions — they are numbers every adult
            deserves to know.
          </p>
        </div>

        <p style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          Major relationship milestones carry significant financial costs that are rarely calculated
          in advance. This calculator shows the direct costs and the opportunity cost — what the
          same money would be worth if invested instead. Understanding the financial impact of major
          decisions leads to better planning not fewer celebrations. This calculator is for
          informational purposes only.
        </p>

        {/* Tab nav */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#e94560" : "#16213e",
                color: activeTab === tab.id ? "#ffffff" : "#a8a8b3",
                border: activeTab === tab.id ? "none" : "1px solid #0f3460",
                borderRadius: 8,
                padding: "10px 18px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          style={{
            background: "#16213e",
            borderRadius: 12,
            padding: "28px 24px",
            marginBottom: 32,
            border: "1px solid #0f3460",
          }}
        >
          {activeTab === "wedding" && <WeddingTab />}
          {activeTab === "child" && <ChildTab />}
          {activeTab === "divorce" && <DivorceTab />}
          {activeTab === "compatibility" && <CompatibilityTab />}
        </div>

        {/* Share */}
        <div style={{ marginBottom: 32 }}>
          <ShareButtons
            text="The average US wedding costs $30,000. Invested at 7% for 30 years that grows to $228,000. Calculate your relationship costs:"
            url="https://www.dayblip.com/tools/relationship-calculator"
            title="Relationship Cost Calculator"
          />
        </div>

        {/* Related tools */}
        <RelatedTools
          tools={[
            {
              emoji: "💰",
              title: "Compound Interest Calculator",
              desc: "See what money grows to over time",
              href: "/finance/compound-interest",
            },
            {
              emoji: "🏠",
              title: "Mortgage Calculator",
              desc: "Monthly payment and total cost",
              href: "/finance/mortgage-calculator",
            },
            {
              emoji: "👶",
              title: "Pregnancy Due Date",
              desc: "Calculate your baby's due date",
              href: "/health/due-date-calculator",
            },
            {
              emoji: "📊",
              title: "Net Worth Calculator",
              desc: "Calculate your total net worth",
              href: "/finance/net-worth",
            },
          ]}
        />
      </div>
    </div>
  )
}
