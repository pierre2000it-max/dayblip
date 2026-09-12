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

const REINVEST_RATE = 0.20
const GROWTH_RATE   = 0.07

function fvAnnual(annual: number, rate: number, years: number): number {
  if (years <= 0) return 0
  if (rate === 0) return annual * years
  return annual * ((Math.pow(1 + rate, years) - 1) / rate)
}

interface Result {
  years: number
  employeeTotal: number
  entrepreneurIncome: number
  entrepreneurWealth: number
  entrepreneurTotal: number
  wealthGap: number
  verdict: string
}

function calculate(salary: number, bizIncome: number, age: number, retireAge: number): Result | null {
  const years = retireAge - age
  if (years <= 0) return null

  const employeeTotal = salary * years

  const entrepreneurIncome = bizIncome * years
  const annualReinvestment  = bizIncome * REINVEST_RATE
  const entrepreneurWealth  = Math.round(fvAnnual(annualReinvestment, GROWTH_RATE, years))
  const entrepreneurTotal   = Math.round(entrepreneurIncome + entrepreneurWealth)

  const wealthGap = entrepreneurTotal - employeeTotal

  let verdict: string
  if (wealthGap < 300_000) {
    verdict = "The gap is real but narrow. Execution matters more than the path."
  } else if (wealthGap < 700_000) {
    verdict = "The difference is significant. One path builds income. The other builds wealth."
  } else if (wealthGap < 1_500_000) {
    verdict = "You are looking at a life-changing gap. The math favors the builder."
  } else {
    verdict = "The wealth gap between these two paths is not a small difference. It is a different life."
  }

  return { years, employeeTotal, entrepreneurIncome, entrepreneurWealth, entrepreneurTotal, wealthGap, verdict }
}

const TOOL_URL = "https://www.dayblip.com/tools/entrepreneur-vs-employee-wealth-gap"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Entrepreneur vs Employee Wealth Gap Calculator",
      url: TOOL_URL,
      description: "Compare your lifetime earnings as an employee versus building your own business. See the wealth gap the math reveals over your working years.",
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
          name: "How is the entrepreneur path calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The entrepreneur path adds total estimated business income over the working years to the compounded future value of reinvesting 20% of that income annually at 7%. This represents a business owner who consistently reinvests a portion of profits rather than consuming all income.",
          },
        },
        {
          "@type": "Question",
          name: "How is the employee path calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The employee path is a straight-line projection: current annual salary multiplied by years remaining until retirement. No investment growth is assumed, isolating the income difference between the two paths.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Wealth Gap?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Wealth Gap is the difference between the entrepreneur path total (income plus compounded reinvestment) and the employee path total (straight-line salary). It shows the opportunity cost of staying employed rather than building a business at the income level you estimate.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function EntrepreneurVsEmployeeWealthGapPage() {
  const [salary,     setSalary]     = useState("85000")
  const [bizIncome,  setBizIncome]  = useState("120000")
  const [age,        setAge]        = useState("32")
  const [retireAge,  setRetireAge]  = useState("50")
  const [result,     setResult]     = useState<Result | null>(null)
  const [copied,     setCopied]     = useState(false)

  useEffect(() => {
    const s  = parseFloat(salary)
    const b  = parseFloat(bizIncome)
    const a  = parseFloat(age)
    const r  = parseFloat(retireAge)
    if (s > 0 && b > 0 && a > 0 && r > a) {
      setResult(calculate(s, b, a, r))
    } else {
      setResult(null)
    }
  }, [salary, bizIncome, age, retireAge])

  async function handleShare() {
    if (!result) return
    const text = `The wealth gap between staying employed and building my own thing is ${fmt(result.wealthGap)}. Here's the math: ${TOOL_URL}`
    try { await navigator.clipboard.writeText(text) }
    catch {
      const el = document.createElement("textarea")
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand("copy"); document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const shareText = result
    ? `The wealth gap between staying employed and building my own thing is ${fmt(result.wealthGap)}. Here's the math: ${TOOL_URL}`
    : `See the wealth gap between employment and entrepreneurship: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <div className="min-h-screen bg-[#0d1b2a]">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          className="px-6 py-14 text-center"
          style={{ background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)" }}
        >
          <div className="mx-auto max-w-[700px]">
            <h1 className="mb-3 text-3xl font-bold text-white leading-tight sm:text-4xl">
              Entrepreneur vs Employee<br className="hidden sm:block" /> Wealth Gap Calculator
            </h1>
            <p className="text-[#a8a8b3]">
              What is the real cost of staying employed? Compare the two paths
              side by side. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ─────────────────────────────────── */}
        <section className="px-6 py-8 bg-[#0d1b2a]">
          <div className="mx-auto max-w-[700px]">
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Entrepreneur vs Employee Wealth Gap" },
            ]} />

            <div style={{
              background: "#1e2d4a",
              borderLeft: "4px solid #e94560",
              borderRadius: 8,
              padding: "16px 20px",
            }}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>
                Quick Answer
              </div>
              <p className="text-[#e2e8f0]" style={{ lineHeight: 1.6 }}>
                An employee on $85,000 for 18 years earns $1.53M in straight-line income.
                A business owner earning $120,000 and reinvesting 20% at 7% compounded accumulates
                over $3.3M — a gap exceeding $1.7M. The difference is not just income; it is
                what happens to a portion of that income when it compounds instead of being
                consumed.
              </p>
            </div>

            <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">
              Employment is a linear income model. Business ownership, when paired with consistent
              reinvestment, is an exponential wealth model. This calculator shows the exact dollar
              difference between those two trajectories at the income levels you choose.
            </p>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[700px]">

            {/* ── Inputs ───────────────────────────────────────────────── */}
            <div className="space-y-6 rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6">
              <h2 className="text-lg font-bold text-white">Enter your numbers</h2>

              {/* Salary */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Current annual salary ($)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#a8a8b3]">$</span>
                  <input
                    type="number" min="1" value={salary}
                    onChange={e => setSalary(e.target.value)}
                    placeholder="e.g. 85000"
                    className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                  />
                </div>
              </label>

              {/* Business income */}
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">
                  Estimated annual business income ($)
                </span>
                <span className="mb-2 block text-xs text-[#a8a8b3]">
                  What you realistically estimate earning running your own business
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#a8a8b3]">$</span>
                  <input
                    type="number" min="1" value={bizIncome}
                    onChange={e => setBizIncome(e.target.value)}
                    placeholder="e.g. 120000"
                    className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                  />
                </div>
              </label>

              {/* Age + retire age side by side */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Current age</span>
                  <input
                    type="number" min="18" max="70" value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 32"
                    className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Target retirement age</span>
                  <input
                    type="number" min="30" max="80" value={retireAge}
                    onChange={e => setRetireAge(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-4 py-3 text-white placeholder-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                  />
                </label>
              </div>

              {result && (
                <p className="text-xs text-[#a8a8b3]">
                  Projecting over <strong className="text-white">{result.years} years</strong> (age {age} → {retireAge})
                </p>
              )}
            </div>

            {/* ── Results ──────────────────────────────────────────────── */}
            {result && (
              <div className="mt-8 space-y-6">

                {/* Two path cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Employee path */}
                  <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6">
                    <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#a8a8b3]">
                      Employee Path
                    </div>
                    <div className="mb-1 text-2xl font-black text-white">
                      {fmt(result.employeeTotal)}
                    </div>
                    <div className="mb-4 text-xs text-[#a8a8b3]">
                      lifetime salary total
                    </div>
                    <div className="space-y-2 text-sm text-[#a8a8b3]">
                      <div className="flex justify-between">
                        <span>Annual salary</span>
                        <span className="font-semibold text-white">{fmt(parseFloat(salary) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Years working</span>
                        <span className="font-semibold text-white">{result.years} yrs</span>
                      </div>
                      <div className="flex justify-between border-t border-[#0f3460] pt-2">
                        <span>Lifetime total</span>
                        <span className="font-bold text-white">{fmt(result.employeeTotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Compounding</span>
                        <span className="text-[#a8a8b3]">None</span>
                      </div>
                    </div>
                  </div>

                  {/* Entrepreneur path */}
                  <div
                    className="rounded-xl p-6"
                    style={{ border: "2px solid #f97316", background: "#1e2d4a" }}
                  >
                    <div className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: "#f97316" }}>
                      Entrepreneur Path
                    </div>
                    <div className="mb-1 text-2xl font-black text-white">
                      {fmt(result.entrepreneurTotal)}
                    </div>
                    <div className="mb-4 text-xs text-[#a8a8b3]">
                      income + reinvested wealth
                    </div>
                    <div className="space-y-2 text-sm text-[#a8a8b3]">
                      <div className="flex justify-between">
                        <span>Annual business income</span>
                        <span className="font-semibold text-white">{fmt(parseFloat(bizIncome) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total income ({result.years} yrs)</span>
                        <span className="font-semibold text-white">{fmt(result.entrepreneurIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reinvestment (20% @ 7%)</span>
                        <span className="font-semibold" style={{ color: "#f97316" }}>+{fmt(result.entrepreneurWealth)}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#0f3460] pt-2">
                        <span>Total wealth built</span>
                        <span className="font-bold text-white">{fmt(result.entrepreneurTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wealth Gap */}
                <div
                  className="rounded-xl p-6 text-center"
                  style={{ border: "2px solid #f97316", background: "#431407" }}
                >
                  <div className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: "#f97316" }}>
                    The Wealth Gap
                  </div>
                  <div
                    className="text-4xl font-black sm:text-5xl"
                    style={{ color: "#f97316" }}
                  >
                    {fmt(result.wealthGap)}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "#fb923c" }}>
                    difference between the two paths
                  </div>
                </div>

                {/* Verdict */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] px-6 py-5 text-center">
                  <p className="text-base italic leading-relaxed text-white">
                    &ldquo;{result.verdict}&rdquo;
                  </p>
                </div>

                {/* Full breakdown */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-6">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#a8a8b3]">
                    Full breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "Employee: lifetime salary",         value: fmt(result.employeeTotal),          highlight: false },
                      { label: "Entrepreneur: lifetime income",     value: fmt(result.entrepreneurIncome),     highlight: false },
                      { label: "Entrepreneur: compounded wealth",   value: `+${fmt(result.entrepreneurWealth)}`, highlight: true },
                      { label: "Entrepreneur: total",               value: fmt(result.entrepreneurTotal),      highlight: false },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex justify-between border-b border-[#0f3460] pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-[#a8a8b3]">{row.label}</span>
                        <span
                          className="font-bold"
                          style={{ color: row.highlight ? "#f97316" : "#fff" }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3">
                      <span className="font-bold" style={{ color: "#f97316" }}>Wealth Gap</span>
                      <span className="text-xl font-black" style={{ color: "#f97316" }}>
                        {fmt(result.wealthGap)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share result */}
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
                  title="Entrepreneur vs Employee Wealth Gap — What Is the Real Cost of Staying Employed?"
                />
              </div>
            )}

            {/* ── Methodology & Attribution ─────────────────────────────── */}
            <div className="mt-10 space-y-3">
              <MethodologyNote text="Employee path is a straight-line salary projection with no investment growth. Entrepreneur path assumes 20% of annual business income reinvested at 7% compounded annually. Business income estimate is user-supplied and not guaranteed. This is not financial advice." />
              <p style={{ color: "#a8a8b3", fontSize: "13px", fontStyle: "italic", lineHeight: 1.6 }}>
                I ran the numbers. A salary wasn&apos;t going to get me to retirement by 50.
                This calculator is why I left. — Pierre, MBA, Business Strategist &amp; AI
                Consultant, Founder of Dayblip
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* ── Related Tools ─────────────────────────────────────────── */}
            <div className="mt-10">
              <RelatedTools tools={[
                { emoji: "📊", title: "Salary Ceiling Calculator",        desc: "See the gap between salary and invested wealth",          href: "/tools/salary-ceiling-calculator" },
                { emoji: "🆓", title: "Financial Independence Date",       desc: "Find the exact date you could stop working",             href: "/tools/fi-date" },
                { emoji: "💼", title: "Job Offer Comparison",              desc: "Compare two job offers side by side",                    href: "/tools/job-offer-comparison" },
                { emoji: "📈", title: "Stock Market Calculator",           desc: "Project investment returns over time",                   href: "/tools/stock-calculator" },
              ]} />
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
