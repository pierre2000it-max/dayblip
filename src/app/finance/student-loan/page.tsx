"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function addMonths(months: number) {
  const d = new Date(2025, 4, 1)
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}
function simulate(balance: number, rate: number, payment: number) {
  let bal = balance
  let totalInterest = 0
  let months = 0
  const MAX = 600
  while (bal > 0 && months < MAX) {
    const interest = bal * rate / 12
    totalInterest += interest
    bal += interest - payment
    months++
    if (bal <= 0) { bal = 0 }
  }
  return { months, totalInterest }
}

export default function StudentLoanPage() {
  const [balance, setBalance] = useState("35000")
  const [rate, setRate] = useState("6.5")
  const [payment, setPayment] = useState("400")
  const [extra, setExtra] = useState("100")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("balance")) setBalance(p.get("balance")!)
    if (p.get("rate")) setRate(p.get("rate")!)
    if (p.get("payment")) setPayment(p.get("payment")!)
    if (p.get("extra")) setExtra(p.get("extra")!)
  }, [])

  const calc = useMemo(() => {
    const b = parseFloat(balance) || 0
    const r = (parseFloat(rate) || 0) / 100
    const p = parseFloat(payment) || 0
    const e = parseFloat(extra) || 0
    const standard = simulate(b, r, p)
    const withExtra = simulate(b, r, p + e)
    return {
      standard,
      withExtra,
      monthsSaved: standard.months - withExtra.months,
      interestSaved: standard.totalInterest - withExtra.totalInterest,
    }
  }, [balance, rate, payment, extra])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Student Loan Calculator",
          "Calculate your student loan monthly payment, total interest and payoff timeline.",
          "https://www.dayblip.com/finance/student-loan",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How long will it take to pay off my student loans?", answer: "The calculator simulates your balance month by month: interest accrues on the remaining balance, your payment reduces it, and it counts the months until the balance reaches zero. It then shows both the number of months and the payoff date." },
          { question: "How much can extra payments save on student loans?", answer: "Extra payments go straight to principal, cutting both the payoff time and total interest. The tool compares your standard payment to a plan with an extra monthly amount and shows the dollars and months saved side by side." },
          { question: "How is total interest on a student loan calculated?", answer: "Each month interest equals the balance times the monthly rate (annual rate divided by 12). Summing that interest across every month until payoff gives your total interest paid — which extra payments reduce." },
          { question: "What income-driven repayment plans exist?", answer: "Federal options include SAVE, PAYE, IBR and ICR, which cap payments at a share of discretionary income and offer forgiveness after 10–25 years. Visit studentaid.gov for official estimates and to apply." },
        ]),
        howToSchema(
          "Student Loan Calculator — How To Use",
          "Estimate your student loan payoff time and interest savings.",
          [
            "Enter your total loan balance and interest rate.",
            "Enter your current monthly payment.",
            "Enter an extra monthly payment amount to test.",
            "Compare the standard and with-extra payoff dates, total interest and the interest and months you save.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Student Loan Calculator", url: "https://www.dayblip.com/finance/student-loan" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Student Loan Calculator — True Cost of Your Student Debt</h1>
          <p className="text-[#a8a8b3]">See how extra payments can save you thousands</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average US student loan balance is $37,650. On a standard 10-year repayment at 6.5% interest the monthly payment is $427 and total interest paid is $13,567. Income-driven repayment reduces monthly payments but can double total interest over 20-25 years. 43 million Americans carry student loan debt totaling $1.7 trillion.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Student loan calculators show the true total cost of education debt including all interest paid over the repayment period. They compare different repayment strategies — standard 10-year, extended, graduated and income-driven plans — to show total interest and monthly payments for each approach.</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Student Loan Calculator" }]} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Total Balance ($)</span>
              <input type="number" value={balance} onChange={e => setBalance(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Interest Rate (%)</span>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly Payment ($)</span>
              <input type="number" value={payment} onChange={e => setPayment(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Extra Monthly Payment ($)</span>
              <input type="number" value={extra} onChange={e => setExtra(e.target.value)} className={inp} /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h3 className="font-bold text-[#a8a8b3] mb-3">Standard Payments</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Payoff Date</span><span className="text-white">{addMonths(calc.standard.months)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Total Interest</span><span className="text-[#e94560]">{fmt(calc.standard.totalInterest)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Months</span><span className="text-white">{calc.standard.months}</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-5">
              <h3 className="font-bold text-green-400 mb-3">With Extra Payment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Payoff Date</span><span className="text-white">{addMonths(calc.withExtra.months)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Total Interest</span><span className="text-green-400">{fmt(calc.withExtra.totalInterest)}</span></div>
                <div className="flex justify-between"><span className="text-[#a8a8b3]">Months</span><span className="text-white">{calc.withExtra.months}</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-5 text-center">
            <div className="text-3xl font-black text-[#F9A825]">You save {fmt(calc.interestSaved)}</div>
            <div className="text-[#a8a8b3] mt-1">and pay off {calc.monthsSaved} months sooner</div>
          </div>

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📚 Income-Driven Repayment Plans</h2>
            <ul className="text-sm text-[#a8a8b3] space-y-2">
              <li><span className="text-white font-semibold">SAVE Plan:</span> Caps payments at 5% of discretionary income for undergrad loans. Forgiveness after 10–20 years.</li>
              <li><span className="text-white font-semibold">PAYE:</span> 10% of discretionary income. Forgiveness after 20 years.</li>
              <li><span className="text-white font-semibold">IBR:</span> 10–15% of discretionary income depending on when you borrowed. 20–25 year forgiveness.</li>
              <li><span className="text-white font-semibold">ICR:</span> 20% of discretionary income or fixed 12-year payment. 25-year forgiveness.</li>
              <li>Visit <span className="text-[#4FC3F7]">studentaid.gov</span> to apply and get official estimates.</li>
            </ul>
          </div>

          <ShareButtons
            text={`Extra $${extra}/month on student loans saves ${fmt(calc.interestSaved)} and ${calc.monthsSaved} months! (Educational only)`}
            url={`https://www.dayblip.com/finance/student-loan?balance=${balance}&rate=${rate}&payment=${payment}&extra=${extra}`}
            title="Student Loan Payoff Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Not financial advice. Loan terms vary. Visit studentaid.gov for official information.</p>
          <RelatedTools tools={[
            { emoji: "📊", title: "GPA Calculator", desc: "Calculate your semester or cumulative GPA", href: "/education/gpa-calculator" },
            { emoji: "🎓", title: "College ROI Calculator", desc: "Was your degree worth the cost?", href: "/tools/college-roi" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Your actual paycheck after taxes", href: "/finance/take-home-pay" },
            { emoji: "📝", title: "Grade Calculator", desc: "What grade do you need on your final?", href: "/education/grade-calculator" },
          ]} />
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 20px 0 20px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0' }}>
              Frequently Asked Questions
            </h2>
            {[
              { q: "What repayment plan should I choose?", a: "Standard 10-year repayment minimizes total interest paid. Income-driven plans cap payments at 5 to 20 percent of discretionary income and offer forgiveness after 10 to 25 years. If pursuing Public Service Loan Forgiveness an income-driven plan is required." },
              { q: "What is the difference between subsidized and unsubsidized loans?", a: "Subsidized loans do not accrue interest while you are enrolled at least half-time, during the grace period, or during deferment. Unsubsidized loans accrue interest from disbursement — unpaid interest capitalizes and increases your principal balance." },
              { q: "Should I pay off student loans early?", a: "If your loan rate is above 6 to 7 percent, accelerating payoff often beats investing in taxable accounts. If your rate is below 5 percent, investing may produce better long-term returns. Federal loans below 4 percent are generally worth carrying while investing in retirement accounts first." },
              { q: "What is student loan capitalization?", a: "Capitalization is when unpaid interest is added to your loan principal. This increases the balance on which future interest is calculated. It commonly occurs after the grace period ends, when leaving deferment or forbearance, and when switching repayment plans." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  {item.q}
                </h3>
                <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.7', margin: '0' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
