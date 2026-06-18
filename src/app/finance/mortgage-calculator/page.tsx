"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import AuthorByline from "@/components/AuthorByline"
import FAQAccordion from "@/components/FAQAccordion"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function MortgagePage() {
  const [homePrice, setHomePrice] = useState("400000")
  const [downPayment, setDownPayment] = useState("80000")
  const [term, setTerm] = useState(30)
  const [rate, setRate] = useState("7.0")
  const [taxRate, setTaxRate] = useState("1.2")
  const [insurance, setInsurance] = useState("150")
  const [income, setIncome] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("price")) setHomePrice(p.get("price")!)
    if (p.get("down")) setDownPayment(p.get("down")!)
    if (p.get("rate")) setRate(p.get("rate")!)
    if (p.get("term")) setTerm(Number(p.get("term")))
  }, [])

  const pushUrl = () => {
    if (typeof window === "undefined") return
    const url = `${window.location.pathname}?price=${homePrice}&down=${downPayment}&rate=${rate}&term=${term}`
    window.history.replaceState(null, "", url)
  }

  const calc = useMemo(() => {
    const hp = parseFloat(homePrice) || 0
    const dp = parseFloat(downPayment) || 0
    const loan = Math.max(0, hp - dp)
    const mr = (parseFloat(rate) || 0) / 100 / 12
    const n = term * 12
    const pi = mr === 0 ? (n > 0 ? loan / n : 0) : loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
    const tax = hp * (parseFloat(taxRate) || 0) / 100 / 12
    const ins = parseFloat(insurance) || 0
    const total = pi + tax + ins
    const totalPaid = total * n + dp
    const totalInterest = Math.max(0, pi * n - loan)
    const inc = parseFloat(income) || 0
    const affordable = inc > 0 ? total <= inc / 12 * 0.28 : null
    const amort = [5, 10, 15, 20, 25, 30].filter(y => y <= term).map(y => {
      let bal = loan
      let totP = 0
      let totI = 0
      for (let mo = 0; mo < y * 12; mo++) {
        const interest = bal * mr
        const principal = pi - interest
        totI += interest
        totP += principal
        bal -= principal
        if (bal < 0) bal = 0
      }
      return { year: y, balance: Math.max(0, bal), principalPaid: totP, interestPaid: totI }
    })
    return { pi, tax, ins, total, totalPaid, totalInterest, affordable, amort }
  }, [homePrice, downPayment, term, rate, taxRate, insurance, income])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Mortgage Calculator",
          "Calculate your monthly mortgage payment, total interest and amortization schedule.",
          "https://www.dayblip.com/finance/mortgage-calculator",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "What does this mortgage calculator include in the monthly payment?", answer: "It adds principal and interest, monthly property tax (from the home price and tax rate you enter) and home insurance to show your full monthly housing cost, not just the loan payment." },
          { question: "How is total interest on a mortgage calculated?", answer: "The calculator uses standard amortization: each month interest accrues on the remaining balance, the rest of your payment reduces principal, and the interest paid over the full loan term is summed. A $320,000 loan at 7% over 30 years pays roughly $446,000 in interest." },
          { question: "What is the 28% housing ratio rule?", answer: "Lenders often suggest your total housing payment stay at or below 28% of your gross monthly income. Enter your income and the calculator flags whether your payment fits within that guideline." },
          { question: "How much does a shorter loan term save?", answer: "A 15-year mortgage has higher monthly payments than a 30-year but dramatically less total interest because you borrow for half the time. The amortization table lets you compare remaining balance at 5, 10, 15, 20, 25 and 30 years." },
        ]),
        howToSchema(
          "Mortgage Calculator — How To Use",
          "Estimate your monthly mortgage payment and total interest.",
          [
            "Enter the home price and your down payment.",
            "Enter the interest rate and choose a loan term (30, 20 or 15 years).",
            "Add the property tax rate and monthly home insurance cost.",
            "Optionally enter your gross monthly income to run the 28% affordability check.",
            "Review the monthly payment, total interest and amortization table, then use Share / Copy Link to save your scenario.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Mortgage Calculator", url: "https://www.dayblip.com/finance/mortgage-calculator" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Mortgage Calculator — Total Interest Over the Life of Your Loan</h1>
          <p className="text-[#a8a8b3]">Calculate your monthly payment and total cost of homeownership</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A $300,000 mortgage at 7% interest over 30 years costs $418,527 in total interest — more than the original loan amount. Monthly payment is $1,996. Total amount paid is $718,527 on a $300,000 loan. Making one extra monthly payment per year saves approximately $64,000 in interest and pays off the loan 4 years early.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A mortgage calculator shows the true total cost of a home loan including all interest paid over the loan term. Most homebuyers focus on the monthly payment without realizing the total interest cost often exceeds the original purchase price over a 30-year term. Understanding this helps evaluate whether extra payments are worth making.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <AuthorByline variant="tool" />
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Mortgage Calculator" }]} />
          <LastUpdated />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Home Price ($)</span>
              <input type="number" value={homePrice} onChange={e => setHomePrice(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Down Payment ($)</span>
              <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Interest Rate (%)</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Property Tax Rate (%/yr)</span>
              <input type="number" step="0.1" value={taxRate} onChange={e => setTaxRate(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Home Insurance ($/mo)</span>
              <input type="number" value={insurance} onChange={e => setInsurance(e.target.value)} className={inp} /></label>
            <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Loan Term</span>
              <div className="flex gap-2">
                {[30, 20, 15].map(t => (
                  <button key={t} onClick={() => setTerm(t)}
                    className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${term === t ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {t}yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
            <div className="text-4xl font-black text-[#e94560] text-center">
              {fmt(calc.total)}<span className="text-xl font-normal text-[#a8a8b3]">/month</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div><div className="font-bold text-white">{fmt(calc.pi)}</div><div className="text-[#a8a8b3]">Principal & Interest</div></div>
              <div><div className="font-bold text-white">{fmt(calc.tax)}</div><div className="text-[#a8a8b3]">Property Tax</div></div>
              <div><div className="font-bold text-white">{fmt(calc.ins)}</div><div className="text-[#a8a8b3]">Insurance</div></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
              <div><div className="font-bold text-white">{fmt(calc.totalPaid)}</div><div className="text-[#a8a8b3]">Total Paid</div></div>
              <div><div className="font-bold text-[#e94560]">{fmt(calc.totalInterest)}</div><div className="text-[#a8a8b3]">Total Interest</div></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <p className="mb-3 font-bold text-white">💰 Affordability Check</p>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-[#a8a8b3]">Your gross monthly income ($)</span>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 8000" className={inp} />
            </label>
            {income && (
              <p className={`mt-2 font-semibold ${calc.affordable ? "text-green-400" : "text-[#e94560]"}`}>
                {calc.affordable ? "✅ Within 28% housing ratio guideline" : "⚠️ Exceeds 28% housing ratio guideline"}
              </p>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#0f3460]">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460] bg-[#1a1a2e]">
                {["Year", "Remaining Balance", "Principal Paid", "Interest Paid"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">{h}</th>
                ))}
              </tr></thead>
              <tbody>{calc.amort.map(r => (
                <tr key={r.year} className="border-b border-[#0f3460]/50">
                  <td className="px-4 py-2 text-white">{r.year}</td>
                  <td className="px-4 py-2 text-[#F9A825]">{fmt(r.balance)}</td>
                  <td className="px-4 py-2 text-[#4ade80]">{fmt(r.principalPaid)}</td>
                  <td className="px-4 py-2 text-[#e94560]">{fmt(r.interestPaid)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <button onClick={pushUrl} className="rounded-lg bg-[#e94560] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Share / Copy Link</button>
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
          <MethodologyNote text="Standard amortization formula. Interest compounds monthly on the outstanding principal balance." />
          {/* ── NOW WHAT? Interpretation Layer ── */}
          {(() => {
            const homePriceAmt = parseFloat(homePrice) || 0
            const downAmt = parseFloat(downPayment) || 0
            const downPct = homePriceAmt > 0 ? Math.round((downAmt / homePriceAmt) * 100) : 0
            const loanAmt = homePriceAmt - downAmt
            const interestRatio = loanAmt > 0
              ? Math.round((calc.totalInterest / loanAmt) * 100)
              : 0
            const termNum = term
            const rateNum = parseFloat(rate) || 7

            let affordTier: 'no-income' | 'affordable' | 'stretch'
            let affordMessage: string

            if (calc.affordable === null) {
              affordTier = 'no-income'
              affordMessage = `Enter your gross monthly income above to see whether this mortgage meets the 28% front-end ratio guideline used by most lenders. The 28% rule means your total monthly payment (principal, interest, taxes, insurance) should not exceed 28% of gross monthly income.`
            } else if (calc.affordable === true) {
              affordTier = 'affordable'
              affordMessage = `This mortgage payment (${fmt(calc.total)}/month) is within the 28% guideline — lenders will likely qualify you for this loan at your income level. Note: this is the front-end ratio only. Lenders also check total debt payments (back-end ratio, typically 36-43% maximum including car loans, student loans, and credit cards).`
            } else {
              affordTier = 'stretch'
              affordMessage = `This mortgage payment (${fmt(calc.total)}/month) exceeds the 28% affordability guideline at your income level. Lenders may still approve the loan if your back-end ratio is acceptable and credit score is strong — but you are in stretch territory. Consider a lower price point, larger down payment, or longer term to reduce monthly payment.`
            }

            let downMessage: string
            if (downPct < 10) {
              downMessage = `Your ${downPct}% down payment will require Private Mortgage Insurance (PMI) — typically 0.5-1.5% of the loan annually. On a ${fmt(loanAmt)} loan that is ${fmt(Math.round(loanAmt * 0.01 / 12))}-${fmt(Math.round(loanAmt * 0.015 / 12))}/month added to your payment until you reach 20% equity.`
            } else if (downPct < 20) {
              downMessage = `Your ${downPct}% down payment is below the 20% threshold — PMI likely applies. You are ${20 - downPct}% away from avoiding PMI. On this loan avoiding PMI saves approximately ${fmt(Math.round(loanAmt * 0.01 / 12))}-${fmt(Math.round(loanAmt * 0.0125 / 12))}/month.`
            } else {
              downMessage = `Your ${downPct}% down payment avoids PMI — a meaningful monthly saving. You also start with substantial equity which reduces risk if home values decline and improves your loan-to-value ratio for future refinancing.`
            }

            const totalInterestStr = fmt(calc.totalInterest)
            let nextActions: string[]

            if (affordTier === 'stretch') {
              nextActions = [
                `Increase down payment to reduce loan amount and monthly payment — each $10,000 additional down saves approximately ${fmt(Math.round(10000 * rateNum / 100 / 12 / (1 - Math.pow(1 + rateNum / 100 / 12, -termNum * 12))))}/month`,
                `Consider a ${termNum === 30 ? '15' : '30'}-year term — ${termNum === 30 ? 'higher monthly but approximately ' + fmt(Math.round(calc.totalInterest * 0.4)) + ' less interest total' : 'lower monthly payment at higher total interest cost'}`,
                `Verify your back-end debt-to-income ratio — add all monthly debt payments and ensure total stays below 43% of gross income`,
                `Check whether waiting 12-18 months to save a larger down payment changes affordability significantly`
              ]
            } else {
              nextActions = [
                `You will pay ${totalInterestStr} in interest over ${termNum} years — consider making one extra principal payment per year to reduce this by 4-6 years`,
                `${downPct < 20 ? 'Track your equity — request PMI cancellation as soon as you reach 20% equity (you can request this; lenders must cancel at 22%)' : 'Refinance if rates drop 1%+ below your current rate — model the break-even point before deciding'}`,
                `Build a home maintenance reserve of 1-2% of home value annually (${fmt(Math.round(homePriceAmt * 0.015 / 12))}/month) — unexpected repairs are the most common cause of financial stress for new homeowners`,
                `Verify your property tax and insurance estimates — these can change annually and affect your true monthly payment`
              ]
            }

            const borderColor = affordTier === 'affordable' ? '#4ade80'
              : affordTier === 'no-income' ? '#60a5fa'
              : '#facc15'
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
                    Now What? Your Mortgage Action Plan
                  </h3>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Affordability — {calc.affordable === null ? 'Enter Income to Check' : calc.affordable ? '✅ Within 28% Guideline' : '⚠️ Exceeds 28% Guideline'}
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {affordMessage}
                  </p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: labelColor, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    Down Payment — {downPct}% ({downPct >= 20 ? 'No PMI' : 'PMI Required'})
                  </p>
                  <p style={{ color: '#a8a8b3', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {downMessage}
                  </p>
                </div>
                <div style={{ background: '#1e2d4a', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
                  <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.7', margin: 0, fontWeight: '600' }}>
                    💡 Total interest cost: {totalInterestStr} over {termNum} years —
                    {interestRatio}% of your original loan amount.
                    Making one extra mortgage payment per year reduces a 30-year mortgage
                    by approximately 4-6 years and saves tens of thousands in interest.
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
            text={`My $${homePrice} mortgage at ${rate}% will cost ${fmt(calc.totalPaid)} total — ${fmt(calc.totalInterest)} in interest alone! Calculate yours (educational only):`}
            url={`https://www.dayblip.com/finance/mortgage-calculator?price=${homePrice}&down=${downPayment}&rate=${rate}&term=${term}`}
            title="Mortgage Payment Calculator"
          />
          <RelatedTools tools={[
            { emoji: "🏠", title: "Rent vs Buy Calculator", desc: "Should you rent or buy in your city?", href: "/blog/rent-vs-buy-calculator" },
            { emoji: "💰", title: "How Much House Can You Afford?", desc: "The 28/36 rule explained", href: "/blog/how-much-house-can-you-afford" },
            { emoji: "📊", title: "Net Worth Calculator", desc: "Calculate your total net worth", href: "/finance/net-worth" },
            { emoji: "💸", title: "Debt Payoff Calculator", desc: "Avalanche vs snowball method", href: "/finance/debt-payoff" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Actual rates and costs may vary. Consult a mortgage professional.</p>
          <FAQAccordion items={[
            { q: "How is a monthly mortgage payment calculated?", a: "Monthly payment is calculated using the formula M equals P times r times (1 plus r) to the power of n, divided by (1 plus r) to the power of n minus 1, where P is loan principal, r is monthly interest rate, and n is total number of payments. This covers principal and interest only." },
            { q: "What is included in a mortgage payment?", a: "A standard mortgage payment covers principal reduction and interest. Your total monthly housing cost also includes property taxes, homeowner's insurance, and if your down payment is under 20 percent, private mortgage insurance known as PMI." },
            { q: "What is a good mortgage interest rate?", a: "Mortgage rates change daily based on Federal Reserve policy, bond markets, and lender competition. As of 2024 to 2026, 30-year fixed rates have ranged between 6 and 8 percent. Your personal rate depends on credit score, down payment, loan type, and lender." },
            { q: "How much house can I afford?", a: "A common guideline is to keep total housing costs below 28 percent of gross monthly income. For an $80,000 annual salary that suggests a maximum housing payment of around $1,867 per month including taxes and insurance." },
          ].map(item => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>
    </div>
  )
}
