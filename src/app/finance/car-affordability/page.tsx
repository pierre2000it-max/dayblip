"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

export default function CarAffordabilityPage() {
  const [annualIncome, setAnnualIncome] = useState("75000")
  const [monthlyTakeHome, setMonthlyTakeHome] = useState("5000")
  const [monthlyDebts, setMonthlyDebts] = useState("300")
  const [downPayment, setDownPayment] = useState("5000")
  const [tradeIn, setTradeIn] = useState("0")
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState("7")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("income")) setAnnualIncome(p.get("income")!)
    if (p.get("takehome")) setMonthlyTakeHome(p.get("takehome")!)
    if (p.get("debts")) setMonthlyDebts(p.get("debts")!)
    if (p.get("down")) setDownPayment(p.get("down")!)
    if (p.get("term")) setLoanTerm(Number(p.get("term")))
    if (p.get("rate")) setInterestRate(p.get("rate")!)
  }, [])

  const calc = useMemo(() => {
    const annInc = parseFloat(annualIncome) || 0
    const mth = parseFloat(monthlyTakeHome) || 0
    const debts = parseFloat(monthlyDebts) || 0
    const dp = parseFloat(downPayment) || 0
    const ti = parseFloat(tradeIn) || 0
    const r = (parseFloat(interestRate) || 0) / 100 / 12
    const n = loanTerm

    const maxByIncome = annInc * 0.15           // 15% annual income rule
    const maxMonthlyPmt = mth * 0.15            // 15% take-home
    const maxWithDebts = Math.max(0, mth * 0.20 - debts)
    const effectiveMaxPmt = Math.min(maxMonthlyPmt, maxWithDebts)

    // Max loan from max payment
    const maxLoan = r > 0
      ? effectiveMaxPmt * ((1 - Math.pow(1 + r, -n)) / r)
      : effectiveMaxPmt * n
    const maxCarByPayment = maxLoan + dp + ti

    const recommendedMax = Math.min(maxByIncome, maxCarByPayment)
    const loanAmount = Math.max(0, recommendedMax - dp - ti)
    const monthlyPI = r > 0
      ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : loanAmount / n
    const totalInterest = monthlyPI * n - loanAmount
    const totalPaid = recommendedMax + totalInterest

    // True cost of ownership
    const insuranceMonthly = recommendedMax * 0.0012
    const fuelMonthly = 200
    const maintenanceMonthly = recommendedMax * 0.015 / 12
    const regAnnual = recommendedMax * 0.01
    const totalMonthly = monthlyPI + insuranceMonthly + fuelMonthly + maintenanceMonthly + regAnnual / 12

    // Used car comparison (3yr old, ~60% of new value)
    const usedValue = recommendedMax * 0.60
    const depreciation = recommendedMax - usedValue

    return {
      maxByIncome, maxMonthlyPmt, recommendedMax, loanAmount,
      monthlyPI, totalInterest, totalPaid,
      insuranceMonthly, fuelMonthly, maintenanceMonthly, regAnnual, totalMonthly,
      usedValue, depreciation, dp, ti,
    }
  }, [annualIncome, monthlyTakeHome, monthlyDebts, downPayment, tradeIn, loanTerm, interestRate])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Car Affordability Calculator",
          "Find out how much car you can afford based on your income, down payment and loan terms.",
          "https://www.dayblip.com/finance/car-affordability",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "How much car can I afford based on my income?", answer: "A common guideline is to keep the total price of your car at or below 15% of your annual income, and your monthly car payment within about 15% of your take-home pay. This calculator applies those rules along with your down payment, trade-in, and existing debts to recommend a maximum price." },
          { question: "What is the true cost of owning a car?", answer: "Beyond the loan payment, ownership includes insurance, fuel, maintenance, and registration. This calculator estimates each of these and adds them to your monthly payment to show a more realistic total monthly cost of ownership." },
          { question: "How does my down payment affect affordability?", answer: "A larger down payment plus any trade-in value reduces the loan amount you need to finance, which lowers your monthly payment and the total interest paid. The calculator factors both into your maximum affordable price." },
          { question: "Is a used car a better deal than a new car?", answer: "New cars lose roughly 15 to 25% of their value in the first year. The calculator estimates the value of a comparable three-year-old used car and the depreciation you avoid by buying used instead of new." },
        ]),
        howToSchema(
          "Car Affordability Calculator — How To Use",
          "Estimate how much car you can afford from your income, down payment, and loan terms.",
          [
            "Enter your annual income and monthly take-home pay.",
            "Enter your existing monthly debt payments.",
            "Enter your down payment and any trade-in value.",
            "Enter your interest rate and select a loan term.",
            "Review your maximum affordable price and true monthly cost of ownership.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Car Affordability Calculator", url: "https://www.dayblip.com/finance/car-affordability" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Car Affordability Calculator — How Much Car Can You Really Afford?</h1>
          <p className="text-[#a8a8b3]">Find out how much car you can actually afford</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The general rule is to spend no more than 15% of take-home pay on total car costs including payment, insurance, fuel and maintenance. On a $5,000 monthly take-home that is $750 total. The average new car payment in 2025 is $738 per month — before insurance, fuel and maintenance which add another $400-600 monthly.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Car affordability goes beyond the monthly payment. The true monthly cost of car ownership includes the loan payment, insurance, fuel, maintenance, registration and depreciation. This calculator shows total monthly ownership cost and whether a vehicle fits your budget using the 15% of take-home guideline.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Car Affordability Calculator" }]} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Income ($)</span>
              <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Monthly Take-Home Pay ($)</span>
              <input type="number" value={monthlyTakeHome} onChange={e => setMonthlyTakeHome(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Existing Monthly Debt Payments ($)</span>
              <input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Down Payment ($)</span>
              <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Trade-In Value ($)</span>
              <input type="number" value={tradeIn} onChange={e => setTradeIn(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Interest Rate (%)</span>
              <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} className={inp} /></label>
            <div className="flex flex-col gap-1 md:col-span-2"><span className="text-sm font-semibold text-white">Loan Term</span>
              <div className="flex gap-2">{[36, 48, 60, 72].map(t => (
                <button key={t} onClick={() => setLoanTerm(t)}
                  className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${loanTerm === t ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                  {t} mo
                </button>
              ))}</div>
            </div>
          </div>

          {/* Max price */}
          <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-6 text-center">
            <p className="text-[#a8a8b3] mb-1">Based on the 15% income rule, you can afford:</p>
            <div className="text-5xl font-black text-[#F9A825]">{fmt(calc.recommendedMax)}</div>
            <div className="mt-2 text-sm text-[#a8a8b3]">Max monthly payment: <span className="text-white font-bold">{fmt(calc.monthlyPI)}</span></div>
          </div>

          {/* Loan breakdown */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💳 Loan Cost Breakdown</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Purchase price", value: fmt(calc.recommendedMax) },
                { label: "Down payment", value: `−${fmt(calc.dp)}` },
                { label: "Trade-in", value: `−${fmt(calc.ti)}` },
                { label: "Loan amount", value: fmt(calc.loanAmount) },
                { label: "Total interest", value: `+${fmt(calc.totalInterest)}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[#a8a8b3]">{r.label}</span><span className="text-white">{r.value}</span>
                </div>
              ))}
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">Total Paid</span><span className="text-[#e94560]">{fmt(calc.totalPaid)}</span>
              </div>
            </div>
          </div>

          {/* True cost */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🔍 True Monthly Cost of Ownership</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Loan payment (P&I)", value: calc.monthlyPI },
                { label: "Insurance estimate", value: calc.insuranceMonthly },
                { label: "Fuel estimate", value: calc.fuelMonthly },
                { label: "Maintenance (est.)", value: calc.maintenanceMonthly },
                { label: "Registration (est. annual÷12)", value: calc.regAnnual / 12 },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[#a8a8b3]">{r.label}</span><span className="text-white">{fmt(r.value)}</span>
                </div>
              ))}
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">Total Monthly</span><span className="text-[#e94560]">{fmt(calc.totalMonthly)}</span>
              </div>
            </div>
          </div>

          {/* Used vs new */}
          <div className="rounded-xl border border-[#4ade80]/20 bg-green-900/10 p-5">
            <h2 className="mb-2 font-bold text-white">🔄 New vs Used Comparison</h2>
            <p className="text-sm text-[#a8a8b3]">
              A 3-year-old used car worth approximately <span className="text-white font-bold">{fmt(calc.usedValue)}</span> saves you
              <span className="text-green-400 font-bold"> ~{fmt(calc.depreciation)}</span> in first-year depreciation alone.
              New cars lose 15–25% of value in the first year.
            </p>
          </div>

          <ShareButtons
            text={`Based on my income I can afford a car up to ${fmt(calc.recommendedMax)} (15% rule). (Educational only)`}
            url={`https://www.dayblip.com/finance/car-affordability?income=${annualIncome}&takehome=${monthlyTakeHome}&debts=${monthlyDebts}&down=${downPayment}&term=${loanTerm}&rate=${interestRate}`}
            title="Car Affordability Calculator"
          />
          <RelatedTools tools={[
            { emoji: "📈", title: "Net Worth Calculator", desc: "Track your net worth", href: "/finance/net-worth" },
            { emoji: "📊", title: "Budget Calculator", desc: "Build a monthly budget", href: "/finance/budget-calculator" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
            { emoji: "💵", title: "Take-Home Pay", desc: "See your net paycheck", href: "/finance/take-home-pay" },
          ]} />
          <p className="text-xs text-[#a8a8b3]">Educational estimate only. Interest rates vary by credit score and lender. Actual insurance and fuel costs vary by location and driving habits.</p>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 20px 0 20px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0' }}>
              Frequently Asked Questions
            </h2>
            {[
              { q: "How much car can I afford?", a: "A common guideline is to keep total vehicle costs including payment, insurance, fuel, and maintenance below 15 to 20 percent of take-home pay. For a $4,000 per month take-home that is $600 to $800 per month total." },
              { q: "What is a good car loan interest rate?", a: "Car loan rates depend on credit score and loan term. With excellent credit above 750, rates in 2024 to 2026 have ranged from 5 to 7 percent for new cars. With fair credit between 620 and 680 rates can exceed 10 to 14 percent." },
              { q: "Is it better to buy or lease a car?", a: "Buying is better long-term — you build equity and eliminate payments once paid off. Leasing has lower monthly payments but you never own the vehicle and face mileage limits and wear-and-tear charges. Buying used is typically the most cost-effective option." },
              { q: "How much should I put down on a car?", a: "A 20 percent down payment on a new car avoids being underwater on the loan since new cars depreciate 15 to 25 percent in the first year. For used cars 10 percent is a common minimum." },
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
