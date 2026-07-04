"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import { generateShareImage } from "@/utils/generateShareImage"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function CompoundInterestPage() {
  const [initial, setInitial] = useState("10000")
  const [monthly, setMonthly] = useState("500")
  const [rate, setRate] = useState("7")
  const [years, setYears] = useState(20)

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("principal")) setInitial(p.get("principal")!)
    if (p.get("monthly")) setMonthly(p.get("monthly")!)
    if (p.get("rate")) setRate(p.get("rate")!)
    if (p.get("years")) setYears(Number(p.get("years")))
  }, [])



  const calc = useMemo(() => {
    const p = parseFloat(initial) || 0
    const m = parseFloat(monthly) || 0
    const r = (parseFloat(rate) || 0) / 100 / 12
    const n = years * 12
    const finalBalance = r === 0
      ? p + m * n
      : p * Math.pow(1 + r, n) + m * ((Math.pow(1 + r, n) - 1) / r)
    const totalContributions = p + m * n
    const totalInterest = finalBalance - totalContributions
    const multiplier = totalContributions > 0 ? finalBalance / totalContributions : 0
    const rule72 = parseFloat(rate) > 0 ? (72 / parseFloat(rate)).toFixed(1) : "—"
    const rows = Array.from({ length: years }, (_, i) => {
      const yr = i + 1
      const mn = yr * 12
      const bal = r === 0 ? p + m * mn : p * Math.pow(1 + r, mn) + m * ((Math.pow(1 + r, mn) - 1) / r)
      const contrib = p + m * mn
      return { yr, bal, contrib, interest: bal - contrib }
    })
    return { finalBalance, totalContributions, totalInterest, multiplier, rule72, rows }
  }, [initial, monthly, rate, years])

  function downloadShareImage() {
    generateShareImage({
      title: "My Compound Interest",
      primaryStat: fmt(calc.finalBalance),
      primaryLabel: `projected balance in ${years} years`,
      stats: [
        { label: "My contributions", value: fmt(calc.totalContributions) },
        { label: "Interest earned", value: fmt(calc.totalInterest) },
        { label: "Money multiplied", value: `${calc.multiplier.toFixed(1)}×` },
      ],
      tagline: "Time in the market beats timing the market.",
      toolUrl: "dayblip.com/finance/compound-interest",
      filename: "dayblip-compound-interest.png",
    })
  }

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Compound Interest Calculator",
          "See how your money grows over time with compound interest and regular contributions.",
          "https://www.dayblip.com/finance/compound-interest",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How does compound interest work?", answer: "Compound interest earns returns not only on your original investment but also on the interest already earned. Over time this snowball effect accelerates growth. This calculator compounds monthly using your initial investment, monthly contributions, rate, and time horizon." },
          { question: "How much will my investment grow?", answer: "Enter your initial amount, monthly contribution, annual rate, and number of years. The calculator shows your final balance, total contributions, total interest earned, and the multiple by which your money grew, plus a year-by-year breakdown." },
          { question: "What is the Rule of 72?", answer: "The Rule of 72 is a quick way to estimate how long it takes money to double: divide 72 by your annual interest rate. At 7%, money doubles roughly every 10.3 years. The calculator displays this for your chosen rate." },
          { question: "Why are monthly contributions so powerful?", answer: "Regular monthly contributions add new money that itself compounds over time. Even modest amounts invested consistently can produce far more in interest than your total contributions, as the year-by-year table makes clear." },
        ]),
        howToSchema(
          "Compound Interest Calculator — How To Use",
          "Project how an investment grows with compound interest and monthly contributions.",
          [
            "Enter your initial investment amount.",
            "Enter your monthly contribution.",
            "Enter your expected annual interest rate.",
            "Set the number of years to grow your money.",
            "Review your final balance, total interest, and year-by-year growth.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Compound Interest Calculator", url: "https://www.dayblip.com/finance/compound-interest" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Compound Interest Calculator — Watch Your Money Grow</h1>
          <p className="text-[#a8a8b3]">See how your money grows over time with the power of compounding</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Compound interest grows money exponentially by earning returns on previous returns. $10,000 invested at 7% annual return becomes $76,123 after 30 years without adding a dollar. With $500 monthly additions it grows to $605,000. Albert Einstein reportedly called compound interest the eighth wonder of the world.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Compound interest means your investment returns generate their own returns over time. Unlike simple interest which only earns on the principal, compound interest earns on the growing total — creating exponential growth that accelerates the longer money stays invested. Daily and monthly compounding grows faster than annual compounding.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Compound Interest Calculator" }]} />
          <LastUpdated />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Initial Investment ($)</span>
              <input type="number" value={initial} onChange={e => setInitial(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Monthly Contribution ($)</span>
              <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual Interest Rate (%)</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years: {years}</span>
              <input type="range" min={1} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="mt-2 accent-[#e94560]" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Final Balance", value: fmt(calc.finalBalance), color: "#F9A825" },
              { label: "Total Contributions", value: fmt(calc.totalContributions), color: "#ffffff" },
              { label: "Total Interest", value: fmt(calc.totalInterest), color: "#4ade80" },
              { label: "Money Grew", value: calc.multiplier.toFixed(2) + "x", color: "#4FC3F7" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                <div className="text-2xl font-black" style={{ color: r.color }}>{r.value}</div>
                <div className="mt-1 text-xs text-[#a8a8b3]">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5">
            <p className="font-bold text-white">📐 Rule of 72</p>
            <p className="text-[#a8a8b3]">At {rate}% your money doubles every <span className="font-bold text-white">{calc.rule72} years</span></p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#0f3460]">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460] bg-[#1a1a2e]">
                {["Year", "Balance", "Contributions", "Interest Earned"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">{h}</th>
                ))}
              </tr></thead>
              <tbody>{calc.rows.map(r => (
                <tr key={r.yr} className="border-b border-[#0f3460]/50 hover:bg-[#1a1a2e]/50">
                  <td className="px-4 py-2 text-white">{r.yr}</td>
                  <td className="px-4 py-2 font-semibold text-[#F9A825]">{fmt(r.bal)}</td>
                  <td className="px-4 py-2 text-[#a8a8b3]">{fmt(r.contrib)}</td>
                  <td className="px-4 py-2 text-[#4ade80]">{fmt(r.interest)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          {/* Embed this tool */}
          <div style={{
            textAlign: "center",
            marginTop: "32px",
            marginBottom: "16px",
            padding: "16px",
            background: "#1e2d4a",
            borderRadius: "8px",
            border: "1px solid #2a3a5a",
          }}>
            <p style={{ color: "#a8a8b3", fontSize: "14px", margin: "0 0 8px 0" }}>
              Want to add this tool to your website?
            </p>
            <a
              href="/embed"
              style={{ color: "#e94560", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
            >
              Get the free embed code →
            </a>
          </div>
          <MethodologyNote text="Standard compound interest formula A = P(1 + r/n)^(nt). Contributions compound at the selected annual rate, applied monthly." />
          {/* ── NOW WHAT? Interpretation Layer ── */}
          {(() => {
            const initialAmt = parseFloat(initial) || 0
            const monthlyAmt = parseFloat(monthly) || 0
            const rateAmt = parseFloat(rate) || 7
            const multiplier = calc.multiplier
            const interest = calc.totalInterest
            const contributions = calc.totalContributions
            const interestRatio = contributions > 0
              ? Math.round((interest / contributions) * 100)
              : 0

            let tier: 'early' | 'building' | 'strong' | 'exceptional'
            let tierMessage: string

            if (multiplier < 2) {
              tier = 'early'
              tierMessage = `Your money grows to ${multiplier.toFixed(2)}× its contributed value over ${years} years. You are in the early compounding phase where time has not yet produced dramatic results. This is exactly where most people give up — and exactly where staying consistent matters most. Every year you continue, the growth curve steepens.`
            } else if (multiplier < 4) {
              tier = 'building'
              tierMessage = `Your money grows to ${multiplier.toFixed(2)}× its contributed value. Compounding is working — interest earned ($${interest.toLocaleString()}) is approaching your total contributions ($${contributions.toLocaleString()}). This ratio keeps improving: at this rate your interest will soon exceed new contributions, making time your most powerful financial asset.`
            } else if (multiplier < 8) {
              tier = 'strong'
              tierMessage = `Your money grows to ${multiplier.toFixed(2)}× its contributed value — compounding is doing significant work. Your interest earned ($${interest.toLocaleString()}) exceeds your total contributions ($${contributions.toLocaleString()}). You are past the inflection point where money earns more than you put in.`
            } else {
              tier = 'exceptional'
              tierMessage = `Your money grows to ${multiplier.toFixed(2)}× its contributed value — exceptional compounding. Interest earned ($${interest.toLocaleString()}) dwarfs contributions ($${contributions.toLocaleString()}). This illustrates why time in the market is the single most important variable in wealth building. The math here is not intuitive — it is exponential.`
            }

            let ratioMessage: string
            if (interestRatio < 50) {
              ratioMessage = `Interest earned represents ${interestRatio}% of your contributions — compounding is starting but time is doing limited work yet. Extending the timeline by even 5 years dramatically changes this ratio.`
            } else if (interestRatio < 150) {
              ratioMessage = `Interest earned represents ${interestRatio}% of your contributions — compounding is meaningful. You are earning back roughly $${Math.round(interestRatio / 100)} for every dollar contributed beyond principal.`
            } else {
              ratioMessage = `Interest earned is ${interestRatio}% of your contributions — compounding is doing most of the heavy lifting. The market, not your labor, is building your wealth at this stage.`
            }

            let nextActions: string[]
            if (tier === 'early') {
              nextActions = [
                `Increase the years — even 5 additional years at this rate transforms the outcome dramatically`,
                `Automate your $${monthlyAmt > 0 ? monthlyAmt.toLocaleString() : 'monthly'} contribution so you never miss a month — consistency beats optimization`,
                `Do not interrupt compounding — the cost of stopping contributions for 2 years is often larger than the total amount saved in those years`,
                `Open a Roth IRA if eligible — same compounding math with zero tax on the growth`
              ]
            } else if (tier === 'building') {
              nextActions = [
                `Increase monthly contributions — you are approaching the inflection point where interest exceeds new money. Adding more now has outsized impact`,
                `Verify your ${rateAmt}% return assumption — a diversified index fund portfolio has historically returned 7-10% long-term`,
                `Protect against sequence-of-returns risk if this timeline approaches retirement — shift toward bonds as the date nears`,
                `Reinvest all dividends — dividend reinvestment is a significant component of long-term compounding that many investors overlook`
              ]
            } else if (tier === 'strong') {
              nextActions = [
                `Your interest now exceeds contributions — protect this by never interrupting the compounding chain`,
                `Review asset allocation — at this balance level a 10% market correction is a large dollar amount. Ensure allocation matches your risk tolerance`,
                `Consider tax efficiency — at your projected balance, tax drag on dividends and capital gains in taxable accounts becomes meaningful`,
                `Model the impact of a 1% return increase — at this scale even small return improvements produce large absolute dollar differences`
              ]
            } else {
              nextActions = [
                `Sequence-of-returns risk is your primary concern at this multiplier — build a 3-5 year cash/bond buffer before retirement`,
                `Tax planning becomes critical at this balance — Roth conversions, tax-loss harvesting, and withdrawal sequencing matter significantly`,
                `Review your safe withdrawal rate assumption — at this balance a 3.5% rate instead of 4% adds significant longevity protection`,
                `Consider a fee-only fiduciary advisor — at this projected balance professional tax and estate planning generates positive ROI`
              ]
            }

            const borderColor = tier === 'early' ? '#60a5fa'
              : tier === 'building' ? '#4ade80'
              : tier === 'strong' ? '#a78bfa'
              : '#e94560'
            const labelColor = borderColor

            return (
              <div style={{
                background: '#0d1b2a',
                borderRadius: '16px',
                padding: '28px 28px 24px',
                margin: '32px 0 24px',
                borderLeft: `4px solid ${borderColor}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '22px' }}>🧭</span>
                  <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                    Now What? Your Compounding Action Plan
                  </h3>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Growth — {multiplier.toFixed(2)}× Multiplier Over {years} Years
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {tierMessage}
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Interest vs Contributions — {interestRatio}% Ratio
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {ratioMessage}
                  </p>
                </div>
                <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                  <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                    ⏰ Rule of 72: At {rateAmt}% return your money doubles every {calc.rule72} years.
                    That means ${initialAmt > 0 ? initialAmt.toLocaleString() : 'your initial investment'} becomes
                    twice as large by year {calc.rule72} — without adding another dollar.
                  </p>
                </div>
                <div>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                    Your Next 4 Actions
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {nextActions.map((action, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: borderColor, fontSize: '14px', fontWeight: '800', minWidth: '20px', marginTop: '1px' }}>{i + 1}.</span>
                        <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
          <ShareButtons
            text={`$${monthly}/month invested for ${years} years = ${fmt(calc.finalBalance)}! Only ${fmt(calc.totalContributions)} is my money, the rest is compound interest 📈 (Educational only)`}
            url={`https://www.dayblip.com/finance/compound-interest?principal=${initial}&monthly=${monthly}&rate=${rate}&years=${years}`}
            title="Compound Interest Calculator"
          />
          <button
            onClick={downloadShareImage}
            style={{ width: "100%", background: "#e8445a", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
            onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
          >
            📸 Download Your Result
          </button>
          <RelatedTools tools={[
            { emoji: "🏖️", title: "FI Date Calculator", desc: "When can you stop working?", href: "/tools/fi-date" },
            { emoji: "📈", title: "What If I Had Invested", desc: "See what any investment would be worth", href: "/finance/what-if-i-invested" },
            { emoji: "🐢", title: "Early vs Late Saver", desc: "The true cost of waiting to invest", href: "/tools/early-vs-late" },
            { emoji: "🏦", title: "Retirement Savings Calculator", desc: "Are you on track to retire?", href: "/finance/retirement-savings" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Results assume constant rate and do not account for taxes or fees.</p>
          <FAQAccordion items={[
            { q: "How does compound interest work?", a: "Compound interest calculates interest on both your original principal and the interest already earned. Each period your interest is added to your balance and the next period's interest is calculated on that larger amount. This creates exponential growth over time." },
            { q: "What is the difference between APY and APR?", a: "APR is the annual percentage rate — the base interest rate without compounding. APY is the annual percentage yield — it reflects the actual return after compounding is applied. APY is always equal to or higher than APR." },
            { q: "How often should interest compound for best results?", a: "The more frequently interest compounds the faster your balance grows. Daily compounding produces slightly more than monthly which produces more than annual. For most savings accounts the difference between daily and monthly compounding is small over short periods." },
            { q: "What formula does this calculator use?", a: "This calculator uses the standard compound interest formula A equals P times (1 plus r divided by n) raised to the power of n times t, where P is principal, r is annual rate, n is compounding frequency per year, and t is time in years." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
