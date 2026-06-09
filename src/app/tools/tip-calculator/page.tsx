"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmt0(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

type WorkerFiling = "single" | "married"

const WORKER_BRACKETS: Record<WorkerFiling, [number, number][]> = {
  single:  [[11925, 0.10],[48475, 0.12],[103350, 0.22],[197300, 0.24],[250525, 0.32],[626350, 0.35],[Infinity, 0.37]],
  married: [[23850, 0.10],[96950, 0.12],[206700, 0.22],[394600, 0.24],[501050, 0.32],[751600, 0.35],[Infinity, 0.37]],
}

function calcFederalTax(income: number, filing: WorkerFiling): number {
  let tax = 0, prev = 0
  for (const [ceiling, rate] of WORKER_BRACKETS[filing]) {
    if (income <= prev) break
    tax += (Math.min(income, ceiling) - prev) * rate
    prev = ceiling
    if (ceiling === Infinity) break
  }
  return Math.max(0, tax)
}

interface BillResult {
  tip: number
  total: number
  tipPerPerson: number
  totalPerPerson: number
}

interface WorkerResult {
  annualTips: number
  ficaOnTips: number
  tipIncomeKept: number
  takeHomePct: number
  taxSavedVsOld: number
}

export default function TipCalculatorPage() {
  // Section A
  const [billAmount, setBillAmount] = useState("85")
  const [tipPct, setTipPct] = useState(20)
  const [people, setPeople] = useState("4")
  const [billResult, setBillResult] = useState<BillResult | null>(null)

  // Section B
  const [weeklyTips, setWeeklyTips] = useState("500")
  const [workerFiling, setWorkerFiling] = useState<WorkerFiling>("single")
  const [workerResult, setWorkerResult] = useState<WorkerResult | null>(null)

  function calcBill() {
    const bill = parseFloat(billAmount) || 85
    const pct = tipPct / 100
    const n = parseInt(people) || 4
    const tip = bill * pct
    const total = bill + tip
    setBillResult({ tip, total, tipPerPerson: tip / n, totalPerPerson: total / n })
  }

  function calcWorker() {
    const wt = parseFloat(weeklyTips) || 500
    const annualTips = wt * 52
    const ficaOnTips = annualTips * 0.0765
    const tipIncomeKept = annualTips - ficaOnTips
    const takeHomePct = (tipIncomeKept / annualTips) * 100
    // Old law: tips taxed as income; estimate savings at ~12% bracket
    const taxSavedVsOld = calcFederalTax(annualTips, workerFiling)
    setWorkerResult({ annualTips, ficaOnTips, tipIncomeKept, takeHomePct, taxSavedVsOld })
  }

  const shareText = billResult
    ? `Split a $${billAmount} bill ${people} ways with ${tipPct}% tip = ${fmt(billResult.totalPerPerson)} per person. Free tip calculator — no signup: www.dayblip.com/tools/tip-calculator`
    : "Free tip calculator — no signup: www.dayblip.com/tools/tip-calculator"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Tip Calculator",
          "Calculate tip and split bills instantly for any party size",
          "https://www.dayblip.com/tools/tip-calculator",
          "UtilitiesApplication",
        ),
        faqSchema([
          { question: "How much should I tip at a restaurant in 2026?", answer: "Standard US tipping: 15% for adequate service, 18% for good service, 20% for excellent service and 25%+ for exceptional. On a $85 bill: 15% = $12.75, 18% = $15.30, 20% = $17.00, 25% = $21.25." },
          { question: "Do tipped workers pay taxes on tips in 2026?", answer: "Under the One Big Beautiful Bill Act signed July 4 2025 qualifying tipped workers pay zero federal income tax on tip income. FICA taxes (Social Security and Medicare) still apply to all tip income. State taxes vary." },
          { question: "Should I tip on the pre-tax or post-tax amount?", answer: "Traditional etiquette says tip on the pre-tax subtotal. However most people tip on the total shown which is post-tax. The difference is small — on an $80 pre-tax bill with 8% sales tax the difference between tipping 20% on $80 ($16) versus $86.40 ($17.28) is $1.28." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Tip Calculator", url: "https://www.dayblip.com/tools/tip-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Tip Calculator — Split Any Bill Instantly</h1>
          <p className="text-[#a8a8b3]">Calculate tips, split bills, and see 2026 tipped worker tax info</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Tip Calculator" },
          ]} />

          {/* Quick Answer */}
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>
              Standard tip percentages: 15% for adequate service, 18% for good service, 20% for excellent service and 25%+ for exceptional service. On an $85 restaurant bill a 20% tip is $17 total or $4.25 per person for a table of 4. In the US tipping 15–20% at restaurants is standard. Under the 2026 OBBBA qualifying tipped workers pay zero federal income tax on tip income.
            </p>
          </div>

          {/* Definition */}
          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>
            A tip calculator divides the gratuity across any number of people for any bill amount and tip percentage. Tipping customs vary by service type — restaurants typically expect 15–20% while delivery and rideshare commonly receive 10–20%. Under the 2026 One Big Beautiful Bill Act qualifying tipped workers receive a federal income tax exemption on tip income.
          </p>

          {/* Section A */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-5">
            <h2 className="text-white text-xl font-bold">Split the Bill</h2>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Bill amount ($)</span>
              <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold text-white">Tip percentage: <span className="text-[#e94560]">{tipPct}%</span></span>
              <div className="flex gap-2 mb-3 flex-wrap">
                {[15, 18, 20, 25].map(p => (
                  <button key={p} onClick={() => setTipPct(p)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                    style={{ background: tipPct === p ? "#e94560" : "#16213e", color: tipPct === p ? "#fff" : "#a8a8b3", border: "1px solid #0f3460" }}>
                    {p}%
                  </button>
                ))}
              </div>
              <input type="range" min={0} max={30} value={tipPct} onChange={e => setTipPct(parseInt(e.target.value))} className="w-full accent-[#e94560]" />
              <div className="flex justify-between text-xs text-[#a8a8b3] mt-1"><span>0%</span><span>15%</span><span>20%</span><span>30%</span></div>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Number of people</span>
              <input type="number" value={people} onChange={e => setPeople(e.target.value)} min={1} className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>

            <button onClick={calcBill} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate
            </button>

            {billResult && (
              <div className="grid grid-cols-2 gap-3 text-center text-sm pt-2">
                {[
                  ["Tip amount", fmt(billResult.tip), "#F9A825"],
                  ["Total with tip", fmt(billResult.total), "#fff"],
                  ["Per person (tip only)", fmt(billResult.tipPerPerson), "#4FC3F7"],
                  ["Per person (total)", fmt(billResult.totalPerPerson), "#e94560"],
                ].map(([l, v, c]) => (
                  <div key={l} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                    <div className="font-black text-xl" style={{ color: c }}>{v}</div>
                    <div className="text-[#a8a8b3] text-xs mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B */}
          <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-6 space-y-5">
            <h2 className="text-white text-xl font-bold">Are You a Tipped Worker? 2026 Tax Info</h2>
            <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.6" }}>
              Under the One Big Beautiful Bill Act qualifying tipped workers pay zero federal income tax on tip income in 2026.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Weekly tips earned ($)</span>
                <input type="number" value={weeklyTips} onChange={e => setWeeklyTips(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Filing status</span>
                <select value={workerFiling} onChange={e => setWorkerFiling(e.target.value as WorkerFiling)} className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </label>
            </div>

            <button onClick={calcWorker} className="w-full rounded-lg bg-[#F9A825] px-5 py-3 font-semibold text-[#1a1a2e] transition-opacity hover:opacity-90">
              Calculate My Tax Savings
            </button>

            {workerResult && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center text-sm">
                  {[
                    ["Annual tip income", fmt0(workerResult.annualTips), "#fff"],
                    ["Federal income tax on tips", "$0", "#4ade80"],
                    ["FICA on tips (7.65%)", fmt0(workerResult.ficaOnTips), "#FF6B6B"],
                    ["Tip income you keep", fmt0(workerResult.tipIncomeKept), "#F9A825"],
                  ].map(([l, v, c]) => (
                    <div key={l} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3">
                      <div className="font-black text-lg" style={{ color: c }}>{v}</div>
                      <div className="text-[#a8a8b3] text-xs mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-4 text-center">
                  <div className="text-sm text-[#a8a8b3]">Estimated federal tax saved vs prior law</div>
                  <div className="text-2xl font-black text-green-400">{fmt0(workerResult.taxSavedVsOld)}</div>
                </div>
                <p className="text-xs text-[#a8a8b3]">Tax savings estimate based on 2026 OBBBA. FICA taxes still apply. Consult a tax professional.</p>
              </div>
            )}
          </div>

          <ShareButtons text={shareText} url="https://www.dayblip.com/tools/tip-calculator" title="Tip Calculator" />

          <RelatedTools tools={[
            { emoji: "📊", title: "Percentage Calculator", desc: "Calculate any percentage instantly", href: "/tools/percentage-calculator" },
            { emoji: "💵", title: "No Tax on Overtime", desc: "Calculate your 2026 overtime tax savings", href: "/finance/overtime-tax" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Your full paycheck after all taxes", href: "/finance/take-home-pay" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What your job really pays per hour", href: "/tools/true-hourly-wage" },
          ]} />
        </div>
      </section>
    </div>
  )
}
