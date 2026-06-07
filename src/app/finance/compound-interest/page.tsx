"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

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

          <ShareButtons
            text={`$${monthly}/month invested for ${years} years = ${fmt(calc.finalBalance)}! Only ${fmt(calc.totalContributions)} is my money, the rest is compound interest 📈 (Educational only)`}
            url={`https://www.dayblip.com/finance/compound-interest?principal=${initial}&monthly=${monthly}&rate=${rate}&years=${years}`}
            title="Compound Interest Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Results assume constant rate and do not account for taxes or fees.</p>
        </div>
      </section>
    </div>
  )
}
