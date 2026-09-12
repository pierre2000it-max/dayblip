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

function fvAnnualContributions(annual: number, rate: number, years: number): number {
  // Future value of end-of-year contributions: C * ((1+r)^n - 1) / r
  if (years <= 0) return 0
  if (rate === 0) return annual * years
  return annual * ((Math.pow(1 + rate, years) - 1) / rate)
}

interface Result {
  lifetimeSalary: number
  investedEquivalent: number
  ceilingGap: number
  verdict: string
}

const RATE = 0.07

function calculate(salary: number, years: number): Result {
  const lifetimeSalary = salary * years
  const investedEquivalent = Math.round(fvAnnualContributions(salary, RATE, years))
  const ceilingGap = investedEquivalent - lifetimeSalary

  let verdict: string
  if (ceilingGap < 200_000) {
    verdict = "Your ceiling is manageable — but it's still a ceiling."
  } else if (ceilingGap < 500_000) {
    verdict = "Your salary is costing you real wealth. Here's what you're not building."
  } else if (ceilingGap < 1_000_000) {
    verdict = "You're trading wealth-building years for a fixed income. The gap is significant."
  } else {
    verdict = "Your salary ceiling is a wealth ceiling. The math doesn't lie."
  }

  return { lifetimeSalary, investedEquivalent, ceilingGap, verdict }
}

const TOOL_URL = "https://www.dayblip.com/tools/salary-ceiling-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Salary Ceiling Calculator",
      url: TOOL_URL,
      description: "Calculate the true cost of staying employed. Compare your lifetime salary earnings to what that same money could build as invested wealth.",
      applicationCategory: "FinanceApplication",
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
          name: "What is a salary ceiling?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A salary ceiling is the upper limit on income a salaried employee can earn over their working years. Unlike invested capital, a salary grows linearly while invested money compounds — creating an ever-widening gap between the two over time.",
          },
        },
        {
          "@type": "Question",
          name: "How is the invested equivalent calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The invested equivalent is the future value of annual salary contributions compounded at 7% per year, consistent with long-term S&P 500 historical averages. It shows what your salary could be worth if treated as invested capital rather than consumed income.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Ceiling Gap?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Ceiling Gap is the difference between the invested future value of your salary and the straight-line total you would receive as employment income. It represents the opportunity cost of trading capital appreciation for a fixed salary over time.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function SalaryCeilingCalculatorPage() {
  const [salary, setSalary]     = useState("85000")
  const [age, setAge]           = useState("32")
  const [yearsLeft, setYearsLeft] = useState("18")
  const [result, setResult]     = useState<Result | null>(null)
  const [copied, setCopied]     = useState(false)

  // Derive years to retirement from age + yearsLeft; update yearsLeft when age changes
  useEffect(() => {
    const s = parseFloat(salary)
    const y = parseFloat(yearsLeft)
    if (s > 0 && y > 0) {
      setResult(calculate(s, y))
    } else {
      setResult(null)
    }
  }, [salary, yearsLeft])

  async function handleShare() {
    const text = result
      ? `I calculated my salary ceiling gap is ${fmt(result.ceilingGap)}. Here's the math: ${TOOL_URL}`
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

  const retirementAge = (parseFloat(age) || 0) + (parseFloat(yearsLeft) || 0)

  const shareText = result
    ? `I calculated my salary ceiling gap is ${fmt(result.ceilingGap)}. Here's the math: ${TOOL_URL}`
    : `See what your salary is really costing you: ${TOOL_URL}`

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
              Salary Ceiling Calculator
            </h1>
            <p className="text-[#a8a8b3]">
              What is your salary really costing you? See the gap between your lifetime pay
              and what that same money could build. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer ───────────────────────────────────────────────── */}
        <section className="px-6 py-8 bg-[#0d1b2a]">
          <div className="mx-auto max-w-[700px]">
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Salary Ceiling Calculator" },
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
                A $85,000 salary over 18 years pays out $1.53 million in straight-line income.
                That same $85,000 invested annually at 7% compounded return grows to over
                $2.9 million — a gap of more than $1.3 million. The salary ceiling is real,
                and the math gets worse the longer you wait.
              </p>
            </div>

            <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">
              A salary is linear. Invested capital is exponential. This calculator shows the
              exact dollar difference between staying on a salary trajectory and redirecting that
              same income into compounding wealth — so you can see what you are actually choosing
              when you choose employment over ownership.
            </p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[700px]">

            {/* ── Inputs ───────────────────────────────────────────────── */}
            <div className="space-y-6 rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6">
              <h2 className="text-lg font-bold text-white">Enter your numbers</h2>

              {/* Current salary */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Current annual salary ($)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#a8a8b3]">$</span>
                  <input
                    type="number"
                    min="1"
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    placeholder="e.g. 85000"
                    className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                  />
                </div>
              </label>

              {/* Current age */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Your current age
                </span>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 32"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
              </label>

              {/* Years to retirement */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Years until you want to retire
                  {retirementAge > 0 && (
                    <span className="ml-2 text-xs font-normal text-[#a8a8b3]">
                      (at age {retirementAge})
                    </span>
                  )}
                </span>
                <span className="mb-2 block text-xs text-[#a8a8b3]">
                  Target: retire by 50 means entering years left until age 50
                </span>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={yearsLeft}
                  onChange={e => setYearsLeft(e.target.value)}
                  placeholder="e.g. 18"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
              </label>
            </div>

            {/* ── Results ──────────────────────────────────────────────── */}
            {result && (
              <div className="mt-8 space-y-6">

                {/* 3 stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#a8a8b3] mb-2">
                      Lifetime Salary Total
                    </div>
                    <div className="text-2xl font-black text-white">
                      {fmt(result.lifetimeSalary)}
                    </div>
                    <div className="mt-1 text-xs text-[#a8a8b3]">
                      straight-line over {yearsLeft} yrs
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#a8a8b3] mb-2">
                      Invested Equivalent
                    </div>
                    <div className="text-2xl font-black text-white">
                      {fmt(result.investedEquivalent)}
                    </div>
                    <div className="mt-1 text-xs text-[#a8a8b3]">
                      at 7% compounded annually
                    </div>
                  </div>

                  <div
                    className="rounded-xl border p-5 text-center"
                    style={{ borderColor: "#f97316", background: "#431407" }}
                  >
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "#f97316" }}
                    >
                      The Ceiling Gap
                    </div>
                    <div
                      className="text-3xl font-black"
                      style={{ color: "#f97316" }}
                    >
                      {fmt(result.ceilingGap)}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: "#fb923c" }}>
                      wealth you&apos;re not building
                    </div>
                  </div>
                </div>

                {/* Verdict */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] px-6 py-5 text-center">
                  <p className="text-base text-white italic leading-relaxed">
                    &ldquo;{result.verdict}&rdquo;
                  </p>
                </div>

                {/* Breakdown */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6 text-sm text-[#e2e8f0] leading-relaxed space-y-2">
                  <h3 className="font-bold text-white text-base mb-3">How the numbers work</h3>
                  <div className="flex justify-between border-b border-[#0f3460] pb-2">
                    <span className="text-[#a8a8b3]">Annual salary</span>
                    <span className="font-semibold text-white">{fmt(parseFloat(salary) || 0)}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#0f3460] pb-2">
                    <span className="text-[#a8a8b3]">Years until retirement</span>
                    <span className="font-semibold text-white">{yearsLeft} years</span>
                  </div>
                  <div className="flex justify-between border-b border-[#0f3460] pb-2">
                    <span className="text-[#a8a8b3]">Total salary collected</span>
                    <span className="font-semibold text-white">{fmt(result.lifetimeSalary)}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#0f3460] pb-2">
                    <span className="text-[#a8a8b3]">Same amount invested at 7%</span>
                    <span className="font-semibold text-white">{fmt(result.investedEquivalent)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold" style={{ color: "#f97316" }}>Ceiling Gap</span>
                    <span className="font-black text-lg" style={{ color: "#f97316" }}>
                      {fmt(result.ceilingGap)}
                    </span>
                  </div>
                </div>

                {/* Share result button */}
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

                <ShareButtons
                  text={shareText}
                  url={TOOL_URL}
                  title="Salary Ceiling Calculator — What Is Your Salary Really Costing You?"
                />
              </div>
            )}

            {/* ── Methodology & Attribution ─────────────────────────────── */}
            <div className="mt-10 space-y-3">
              <MethodologyNote text="Salary total is a straight-line projection. Investment figure assumes 7% average annual return compounded annually, consistent with long-term S&P 500 historical averages. This is not financial advice." />
              <p style={{ color: "#a8a8b3", fontSize: "13px", fontStyle: "italic", lineHeight: "1.6" }}>
                I ran the numbers. A salary wasn&apos;t going to get me to retirement by 50.
                This calculator is why I left. — Pierre, MBA, Business Strategist &amp; AI Consultant,
                Founder of Dayblip
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* ── Related Tools ─────────────────────────────────────────── */}
            <div className="mt-10">
              <RelatedTools tools={[
                { emoji: "🆓", title: "Financial Independence Date", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
                { emoji: "⏱️", title: "Procrastination Cost Calculator", desc: "The financial cost of putting things off", href: "/tools/procrastination-cost" },
                { emoji: "💼", title: "Job Offer Comparison", desc: "Compare two job offers side by side", href: "/tools/job-offer-comparison" },
                { emoji: "📈", title: "Stock Market Calculator", desc: "Project investment returns over time", href: "/tools/stock-calculator" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
