"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"
import Breadcrumb from "@/components/Breadcrumb"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

function calcFedTax(taxable: number, filing: string): number {
  const brackets = filing === "mfj"
    ? [[23850,0.10],[96950,0.12],[206700,0.22],[394600,0.24],[501050,0.32],[751600,0.35],[Infinity,0.37]] as [number,number][]
    : [[11925,0.10],[48475,0.12],[103350,0.22],[197300,0.24],[250525,0.32],[626350,0.35],[Infinity,0.37]] as [number,number][]
  let tax = 0; let prev = 0
  for (const [limit, rate] of brackets) {
    if (taxable <= prev) break
    tax += (Math.min(taxable, limit) - prev) * rate
    prev = limit
  }
  return tax
}

export default function SelfEmploymentTaxPage() {
  const [netIncome, setNetIncome] = useState("80000")
  const [w2Income, setW2Income] = useState("0")
  const [filing, setFiling] = useState("single")
  const [bizExpenses, setBizExpenses] = useState("5000")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("income")) setNetIncome(p.get("income")!)
    if (p.get("other")) setW2Income(p.get("other")!)
    if (p.get("filing")) setFiling(p.get("filing")!)
    if (p.get("expenses")) setBizExpenses(p.get("expenses")!)
  }, [])

  const calc = useMemo(() => {
    const net = (parseFloat(netIncome) || 0) - (parseFloat(bizExpenses) || 0)
    const w2 = parseFloat(w2Income) || 0
    const seBase = Math.max(0, net) * 0.9235
    const seTax = seBase * 0.153
    const ss = seBase * 0.124
    const medicare = seBase * 0.029
    const seDeduction = seTax / 2

    const stdDed = filing === "mfj" ? 30000 : 15000
    const totalIncome = Math.max(0, net) + w2
    const taxable = Math.max(0, totalIncome - seDeduction - stdDed)
    const fedTax = calcFedTax(taxable, filing)
    const totalTax = seTax + fedTax
    const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome * 100).toFixed(1) : "0"
    const setAsidePct = totalIncome > 0 ? Math.ceil(totalTax / totalIncome * 100) : 0

    const quarterly = totalTax / 4

    return { seTax, ss, medicare, seDeduction, seBase, fedTax, totalTax, effectiveRate, setAsidePct, quarterly, net: Math.max(0, net), totalIncome }
  }, [netIncome, w2Income, filing, bizExpenses])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
  const sel = inp

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Self-Employment Tax Calculator",
          "Estimate the self-employment tax you owe on freelance and 1099 income.",
          "https://www.dayblip.com/finance/self-employment-tax",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "What is the self-employment tax rate?", answer: "Self-employment tax is 15.3% — 12.4% for Social Security and 2.9% for Medicare. It is applied to 92.35% of your net self-employment earnings, since that deductible portion mirrors the employer share employees do not pay." },
          { question: "Can I deduct part of my self-employment tax?", answer: "Yes. You can deduct half of your self-employment tax from your taxable income for income-tax purposes, which the calculator applies before estimating your federal income tax." },
          { question: "Why do I need to pay quarterly estimated taxes?", answer: "Freelancers have no employer withholding, so the IRS expects estimated payments four times a year — around April 15, June 15, September 15 and January 15 — to avoid underpayment penalties. The calculator splits your total tax into those four payments." },
          { question: "How much should I set aside for taxes as a freelancer?", answer: "The tool computes a set-aside percentage from your total tax over your total income so you know roughly what share of every payment to reserve. It typically lands in the 20–35% range depending on income and filing status." },
        ]),
        howToSchema(
          "Self-Employment Tax Calculator — How To Use",
          "Estimate self-employment tax on freelance and 1099 income.",
          [
            "Enter your net self-employment income and deductible business expenses.",
            "Enter any other W-2 income and choose your filing status.",
            "Review the SE tax breakdown, including the Social Security and Medicare portions and the deductible half.",
            "Check your quarterly estimated payments and the percentage to set aside from each payment for taxes.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Self-Employment Tax Calculator", url: "https://www.dayblip.com/finance/self-employment-tax" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Self Employment Tax Calculator — What Freelancers Actually Owe</h1>
          <p className="text-[#a8a8b3]">Calculate how much self-employment tax you owe as a freelancer or business owner</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Self-employed workers pay 15.3% self-employment tax on net earnings up to $168,600 in 2025 — this covers Social Security and Medicare that employers normally split with employees. On $80,000 of freelance income the self-employment tax alone is $11,304 before any income tax. You can deduct half of SE tax from your income.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Self-employment tax is paid by freelancers, independent contractors and business owners in place of the payroll taxes shared between employees and employers. It consists of 12.4% for Social Security and 2.9% for Medicare. This calculator shows your total SE tax liability and estimated quarterly payment amounts to avoid IRS underpayment penalties.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "Self-Employment Tax Calculator" }]} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Net Self-Employment Income ($)</span>
              <input type="number" value={netIncome} onChange={e => setNetIncome(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Business Expenses ($)</span>
              <input type="number" value={bizExpenses} onChange={e => setBizExpenses(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Other W2 Income ($)</span>
              <input type="number" value={w2Income} onChange={e => setW2Income(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Filing Status</span>
              <select value={filing} onChange={e => setFiling(e.target.value)} className={sel}>
                <option value="single">Single</option>
                <option value="mfj">Married Filing Jointly</option>
              </select></label>
          </div>

          {/* SE Tax breakdown */}
          <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
            <h2 className="mb-4 font-bold text-white">🧾 SE Tax Breakdown</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Net SE income</span><span className="text-white">{fmt(calc.net)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">× 92.35% (deductible portion)</span><span className="text-white">{fmt(calc.seBase)}</span></div>
              <div className="border-t border-[#0f3460] my-2" />
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Social Security (12.4%)</span><span className="text-[#F9A825]">{fmt(calc.ss)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Medicare (2.9%)</span><span className="text-[#F9A825]">{fmt(calc.medicare)}</span></div>
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">Total SE Tax</span><span className="text-[#e94560] text-lg">{fmt(calc.seTax)}</span>
              </div>
            </div>
          </div>

          {/* SE deduction */}
          <div className="rounded-xl border border-green-500/20 bg-green-900/10 p-5">
            <h2 className="mb-2 font-bold text-white">✅ SE Tax Deduction</h2>
            <p className="text-sm text-[#a8a8b3]">You can deduct half your SE tax from income:</p>
            <div className="mt-2 text-lg font-black text-green-400">Deductible: {fmt(calc.seDeduction)}</div>
            <p className="text-xs text-[#a8a8b3] mt-1">This reduces your taxable income and thus your income tax.</p>
          </div>

          {/* Quarterly */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📅 Quarterly Estimated Taxes</h2>
            <p className="text-sm text-[#a8a8b3] mb-3">To avoid IRS penalties, pay quarterly:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Q1 — April 15", calc.quarterly],
                ["Q2 — June 15", calc.quarterly],
                ["Q3 — September 15", calc.quarterly],
                ["Q4 — January 15", calc.quarterly],
              ].map(([label, val]) => (
                <div key={String(label)} className="rounded-lg bg-[#16213e] p-3 flex justify-between">
                  <span className="text-[#a8a8b3]">{String(label)}</span>
                  <span className="text-white font-bold">{fmt(Number(val))}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total picture */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💰 Total Tax Picture</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#a8a8b3]">SE Tax</span><span className="text-[#e94560]">{fmt(calc.seTax)}</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Est. Federal Income Tax</span><span className="text-[#e94560]">{fmt(calc.fedTax)}</span></div>
              <div className="border-t border-[#0f3460] pt-2 flex justify-between font-bold">
                <span className="text-white">Total Tax</span><span className="text-[#e94560]">{fmt(calc.totalTax)}</span>
              </div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Effective Rate</span><span className="text-white">{calc.effectiveRate}%</span></div>
            </div>
            <div className="mt-4 rounded-lg bg-[#16213e] p-3 text-center">
              <p className="text-sm text-[#a8a8b3]">Set aside</p>
              <p className="text-3xl font-black text-[#F9A825]">{calc.setAsidePct}%</p>
              <p className="text-sm text-[#a8a8b3]">of every payment you receive for taxes</p>
            </div>
          </div>

          <ShareButtons
            text={`Self-employment tax on $${netIncome}: ${fmt(calc.seTax)}. Set aside ${calc.setAsidePct}% of every payment. (Educational only)`}
            url={`https://www.dayblip.com/finance/self-employment-tax?income=${netIncome}&other=${w2Income}&filing=${filing}&expenses=${bizExpenses}`}
            title="Self-Employment Tax Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Educational estimate only. Does not include all deductions, credits, or state taxes. Consult a CPA for accurate tax advice.</p>
        </div>
      </section>
    </div>
  )
}
