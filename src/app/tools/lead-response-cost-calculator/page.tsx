"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

type RiskLevel = "Low" | "Medium" | "High" | "Critical"

interface Result {
  leadsLostPerMonth: number
  revenueLostPerMonth: number
  revenueLostPerYear: number
  risk: RiskLevel
}

function calcLossFraction(hours: number): number {
  if (hours <= 1) return 0
  // Logarithmic decay: 0% at 1h → 85.7% (=1-1/7) at 24h, capped beyond 24h
  const MAX_LOSS = 1 - 1 / 7 // ≈ 0.857
  const fraction = MAX_LOSS * Math.log(hours) / Math.log(24)
  return Math.min(fraction, MAX_LOSS)
}

function calcRisk(dealValue: number, responseHours: number): RiskLevel {
  if (responseHours > 24 && dealValue >= 2000) return "Critical"
  if (responseHours > 24) return "High"
  if (responseHours > 5 && dealValue >= 1000) return "High"
  if (responseHours > 2 && dealValue >= 500) return "Medium"
  if (responseHours > 5) return "Medium"
  if (responseHours > 1 && dealValue >= 200) return "Medium"
  return "Low"
}

function calculate(leads: number, dealValue: number, hours: number): Result {
  const lossFraction = calcLossFraction(hours)
  const leadsLostPerMonth = Math.round(leads * lossFraction)
  const revenueLostPerMonth = Math.round(leadsLostPerMonth * dealValue)
  const revenueLostPerYear = revenueLostPerMonth * 12
  const risk = calcRisk(dealValue, hours)
  return { leadsLostPerMonth, revenueLostPerMonth, revenueLostPerYear, risk }
}

const RISK_STYLES: Record<RiskLevel, { bg: string; color: string; border: string }> = {
  Low:      { bg: "#14532d",  color: "#4ade80",  border: "#16a34a" },
  Medium:   { bg: "#713f12",  color: "#fbbf24",  border: "#ca8a04" },
  High:     { bg: "#7c2d12",  color: "#fb923c",  border: "#ea580c" },
  Critical: { bg: "#450a0a",  color: "#f87171",  border: "#dc2626" },
}

const TOOL_URL = "https://www.dayblip.com/tools/lead-response-cost-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Lead Response Time Cost Calculator",
      url: TOOL_URL,
      description: "Calculate how much revenue you lose every month from slow lead follow-up. Enter your monthly leads, deal value, and average response time.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
      publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does slow lead follow-up cost revenue?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harvard Business Review research found businesses that respond within 1 hour are 7x more likely to qualify a lead than those that wait longer. Every hour of delay reduces the probability of connecting with and converting that lead.",
          },
        },
        {
          "@type": "Question",
          name: "What is a good lead response time?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under 1 hour is the gold standard for inbound leads. Responding within 5 minutes is even better — studies show response rates drop dramatically beyond the first hour.",
          },
        },
        {
          "@type": "Question",
          name: "How is the revenue loss estimate calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The calculator applies a logarithmic decay model to the 7x qualification uplift from the Harvard Business Review study. At 1 hour response time there is zero estimated loss; at 24 hours the loss peaks at approximately 85.7% of potential conversions. Revenue lost equals leads lost multiplied by average deal value.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function LeadResponseCostCalculatorPage() {
  const [leads, setLeads] = useState("50")
  const [dealValue, setDealValue] = useState("2500")
  const [hours, setHours] = useState("8")
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)

  // Compute instantly on every input change
  useEffect(() => {
    const l = parseFloat(leads)
    const d = parseFloat(dealValue)
    const h = parseFloat(hours)
    if (l > 0 && d > 0 && h >= 0) {
      setResult(calculate(l, d, h))
    } else {
      setResult(null)
    }
  }, [leads, dealValue, hours])

  const shareText = result
    ? `I calculated I'm losing ${fmt(result.revenueLostPerMonth)}/month from slow lead follow-up. Find out what you're losing: ${TOOL_URL}`
    : `Find out how much revenue you're losing from slow lead follow-up: ${TOOL_URL}`

  async function handleShare() {
    const text = result
      ? `I calculated I'm losing ${fmt(result.revenueLostPerMonth)}/month from slow lead follow-up. Find out what you're losing: ${TOOL_URL}`
      : TOOL_URL
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const risk = result?.risk
  const riskStyle = risk ? RISK_STYLES[risk] : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="min-h-screen bg-[#0d1b2a]">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section
          className="px-6 py-14 text-center"
          style={{ background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)" }}
        >
          <div className="mx-auto max-w-[700px]">
            <h1 className="mb-3 text-3xl font-bold text-white leading-tight sm:text-4xl">
              Lead Response Time Cost Calculator
            </h1>
            <p className="text-[#a8a8b3]">
              Find out how much revenue you&apos;re losing every month from slow lead follow-up.
              Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer ───────────────────────────────────────────────── */}
        <section className="px-6 py-8 bg-[#0d1b2a]">
          <div className="mx-auto max-w-[700px]">
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Lead Response Cost Calculator" },
            ]} />

            <div style={{
              background: "#1e2d4a",
              borderLeft: "4px solid #e94560",
              borderRadius: "8px",
              padding: "16px 20px",
            }}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>
                Quick Answer
              </div>
              <p className="text-[#e2e8f0]">
                Businesses that respond to inbound leads within 1 hour are 7x more likely to qualify
                those leads than businesses that wait longer, according to Harvard Business Review
                research. For a company with 50 monthly leads and a $2,500 average deal, responding
                in 8 hours instead of 1 hour can cost over $60,000 in lost revenue per year.
              </p>
            </div>

            <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">
              Speed-to-lead is one of the highest-leverage variables in sales. This calculator
              quantifies the exact cost of your current response time so you can make an informed
              decision about fixing it.
            </p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[700px]">

            {/* ── Inputs ───────────────────────────────────────────────── */}
            <div className="space-y-6 rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6">
              <h2 className="text-lg font-bold text-white">Enter your numbers</h2>

              {/* Inbound leads */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Inbound leads per month
                </span>
                <span className="mb-2 block text-xs text-[#a8a8b3]">
                  How many new leads come in each month (calls, forms, DMs, etc.)
                </span>
                <input
                  type="number"
                  min="1"
                  value={leads}
                  onChange={e => setLeads(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
              </label>

              {/* Deal value */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Average deal value ($)
                </span>
                <span className="mb-2 block text-xs text-[#a8a8b3]">
                  Your average revenue per closed client or sale
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#a8a8b3]">$</span>
                  <input
                    type="number"
                    min="1"
                    value={dealValue}
                    onChange={e => setDealValue(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                  />
                </div>
              </label>

              {/* Response time */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Average lead follow-up time (hours)
                </span>
                <span className="mb-2 block text-xs text-[#a8a8b3]">
                  How many hours it typically takes your team to first contact a new lead
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  placeholder="e.g. 8"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
                <span className="mt-1 block text-xs text-[#a8a8b3]">
                  Tip: responding within 1 hour is the benchmark. Enter 0.5 for 30 minutes.
                </span>
              </label>
            </div>

            {/* ── Results ──────────────────────────────────────────────── */}
            {result && (
              <div className="mt-8 space-y-6">

                {/* Headline */}
                <div className="rounded-xl border border-[#e94560]/50 bg-[#e94560]/10 p-6 text-center">
                  <p className="text-xl font-bold text-white sm:text-2xl">
                    You&apos;re losing an estimated{" "}
                    <span style={{ color: "#e94560" }}>{fmt(result.revenueLostPerMonth)}</span>{" "}
                    per month in revenue from slow lead response.
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 text-center">
                    <div className="text-2xl font-black text-white">
                      {result.leadsLostPerMonth.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-[#a8a8b3]">Leads lost per month</div>
                  </div>
                  <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 text-center">
                    <div className="text-2xl font-black" style={{ color: "#e94560" }}>
                      {fmt(result.revenueLostPerMonth)}
                    </div>
                    <div className="mt-1 text-sm text-[#a8a8b3]">Revenue lost / month</div>
                  </div>
                  <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 text-center">
                    <div className="text-2xl font-black" style={{ color: "#e94560" }}>
                      {fmt(result.revenueLostPerYear)}
                    </div>
                    <div className="mt-1 text-sm text-[#a8a8b3]">Revenue lost / year</div>
                  </div>
                </div>

                {/* Risk badge */}
                {riskStyle && (
                  <div className="flex items-center gap-4 rounded-xl border p-5"
                    style={{ borderColor: riskStyle.border, background: riskStyle.bg }}>
                    <span
                      className="rounded-full px-4 py-1.5 text-sm font-bold"
                      style={{ background: riskStyle.border, color: "#fff" }}
                    >
                      {risk}
                    </span>
                    <p className="text-sm text-white">
                      {risk === "Critical" && "Critical risk — your current response time is costing you a significant share of pipeline. Immediate action recommended."}
                      {risk === "High" && "High risk — your response window is long enough that most leads have already gone cold or chosen a competitor."}
                      {risk === "Medium" && "Medium risk — you are losing a meaningful portion of leads. Cutting your response time in half would meaningfully increase revenue."}
                      {risk === "Low" && "Low risk — your response time is close to optimal. Small improvements may still capture additional conversions."}
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6 text-sm text-[#e2e8f0] leading-relaxed">
                  <p>
                    Harvard Business Review research found that businesses responding to inbound leads
                    within 1 hour are <strong className="text-white">7 times more likely</strong> to
                    qualify those leads compared to businesses that wait longer. Every hour of delay
                    reduces the probability of connecting with an interested prospect — they move on,
                    find a competitor who calls them back faster, or simply lose interest. The
                    estimates above model this degradation using a logarithmic decay from the 7x
                    benchmark: at your current{" "}
                    <strong className="text-white">{hours}-hour</strong> response time, approximately{" "}
                    <strong className="text-white">
                      {Math.round(calcLossFraction(parseFloat(hours) || 0) * 100)}%
                    </strong>{" "}
                    of your qualifying conversations are estimated to be lost before they start.
                  </p>
                </div>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0f3460] bg-[#1e2d4a] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Copied to clipboard!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      Share your result
                    </>
                  )}
                </button>

                {/* CTA */}
                <div className="rounded-xl border border-orange-500/40 bg-orange-950/30 p-6 text-center">
                  <p className="mb-4 text-sm text-[#e2e8f0]">
                    Apex AI Pilot responds to every inbound lead within seconds — automatically,
                    24/7, without adding headcount.
                  </p>
                  <a
                    href="https://apexaipilot.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "#f97316" }}
                  >
                    See How Apex AI Pilot Fixes This →
                  </a>
                </div>

                <ShareButtons
                  text={shareText}
                  url={TOOL_URL}
                  title="Lead Response Time Cost Calculator — Apex AI Pilot"
                />
              </div>
            )}

            {/* ── Methodology ──────────────────────────────────────────── */}
            <div className="mt-10">
              <MethodologyNote text="Based on Harvard Business Review research showing businesses that respond within 1 hour are 7x more likely to qualify leads. Loss fraction uses a logarithmic decay model calibrated to the 7x benchmark at 24-hour response time. Estimates are illustrative and will vary by industry, lead quality, and business model." />
              <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "8px" }}>
                Powered by{" "}
                <a
                  href="https://apexaipilot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#f97316" }}
                >
                  Apex AI Pilot
                </a>
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* ── Related Tools ─────────────────────────────────────────── */}
            <div className="mt-10">
              <RelatedTools tools={[
                { emoji: "⏱️", title: "Procrastination Cost Calculator", desc: "The financial cost of putting things off", href: "/tools/procrastination-cost" },
                { emoji: "🤑", title: "True Hourly Wage Calculator", desc: "What your job actually pays per hour", href: "/tools/true-hourly-wage" },
                { emoji: "💼", title: "Job Offer Comparison", desc: "Compare two job offers side by side", href: "/tools/job-offer-comparison" },
                { emoji: "💰", title: "Side Hustle Calculator", desc: "Project income from a side business", href: "/tools/side-hustle" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
