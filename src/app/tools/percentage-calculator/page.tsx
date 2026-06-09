"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

function fmtN(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—"
  const rounded = Math.round(n * 100) / 100
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 4 })
}

export default function PercentageCalculatorPage() {
  const [tab, setTab] = useState<0 | 1 | 2>(0)

  // Tab 0 — X% of Y
  const [pct0, setPct0] = useState("20")
  const [num0, setNum0] = useState("85")

  // Tab 1 — X is what % of Y
  const [val1, setVal1] = useState("45")
  const [tot1, setTot1] = useState("200")

  // Tab 2 — % change
  const [from2, setFrom2] = useState("80")
  const [to2, setTo2] = useState("100")

  // Results
  const r0 = (parseFloat(pct0) / 100) * parseFloat(num0)
  const r1 = (parseFloat(val1) / parseFloat(tot1)) * 100
  const r1inv = 100 - r1
  const diff2 = parseFloat(to2) - parseFloat(from2)
  const r2 = (diff2 / parseFloat(from2)) * 100
  const isIncrease = diff2 >= 0

  const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none"

  // Quick tip table based on tab 0 num0
  const tipBase = parseFloat(num0) || 50
  const tipRows = [10, 15, 18, 20, 25]

  const TABS = ["X% of Y", "X is what % of Y", "% Change"]

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Percentage Calculator", "Calculate percentage of a number percentage change and what percent one number is of another", "https://www.dayblip.com/tools/percentage-calculator", "UtilitiesApplication"),
        faqSchema([
          { question: "How do I calculate 20% of a number?", answer: "To find 20% of any number multiply by 0.20 (or divide by 5). Examples: 20% of 50 = 10. 20% of 85 = 17. 20% of 200 = 40. 20% of 1000 = 200. For other percentages multiply by the decimal equivalent: 15% = 0.15, 25% = 0.25, 30% = 0.30 and so on." },
          { question: "How do I calculate percentage change?", answer: "Percentage change formula: divide the difference between new and old values by the old value then multiply by 100. From 80 to 100: (100-80)÷80×100 = 25% increase. From 100 to 80: (80-100)÷100×100 = -20% decrease. Positive result means increase, negative means decrease." },
          { question: "What is the formula for percentage?", answer: "Three key percentage formulas: 1. Part = (Percentage ÷ 100) × Whole. 2. Percentage = (Part ÷ Whole) × 100. 3. Percentage change = ((New - Old) ÷ Old) × 100. These three formulas cover virtually every everyday percentage calculation." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Percentage Calculator", url: "https://www.dayblip.com/tools/percentage-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">%</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Percentage Calculator — Three Ways to Calculate Any Percentage</h1>
          <p className="text-[#a8a8b3]">Percentage of a number, what percent, and percentage change — all in one tool</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Percentage Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>Three common percentage calculations: 1. What is 20% of 85? Multiply 85 times 0.20 equals 17. 2. 45 is what percent of 200? Divide 45 by 200 times 100 equals 22.5%. 3. Percentage change from 80 to 100? Divide the difference (20) by the original (80) times 100 equals 25% increase. Percentage decrease from 100 to 80 equals 20% decrease.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Percentage calculations appear in everyday life — discounts, tax, tips, test scores, pay raises and statistics. Three types cover almost every scenario: finding a percentage of a number, calculating what percentage one number is of another, and finding the percentage change between two values. This calculator handles all three types with clear explanations.</p>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[#0f3460]">
            {TABS.map((t, i) => (
              <button key={i} onClick={() => setTab(i as 0 | 1 | 2)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === i ? "bg-[#e94560] text-white" : "bg-[#1a1a2e] text-[#a8a8b3] hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
              <h2 className="font-bold text-white">What is X% of Y?</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Percentage (%)</span>
                  <input type="number" value={pct0} onChange={e => setPct0(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Of number</span>
                  <input type="number" value={num0} onChange={e => setNum0(e.target.value)} className={inp} />
                </label>
              </div>
              {isFinite(r0) && !isNaN(r0) && (
                <div className="rounded-xl border border-[#e94560]/30 bg-[#16213e] p-5 text-center">
                  <div className="text-4xl font-black text-[#e94560]">{fmtN(r0)}</div>
                  <div className="text-sm text-[#a8a8b3] mt-2">{pct0}% of {num0} = <span className="text-white font-bold">{fmtN(r0)}</span></div>
                  <div className="text-sm text-[#a8a8b3]">{fmtN(r0)} is {pct0}% of {num0}</div>
                </div>
              )}
            </div>
          )}

          {tab === 1 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
              <h2 className="font-bold text-white">X is what % of Y?</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Value</span>
                  <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Is what % of</span>
                  <input type="number" value={tot1} onChange={e => setTot1(e.target.value)} className={inp} />
                </label>
              </div>
              {isFinite(r1) && !isNaN(r1) && (
                <div className="rounded-xl border border-[#e94560]/30 bg-[#16213e] p-5 text-center">
                  <div className="text-4xl font-black text-[#e94560]">{fmtN(r1)}%</div>
                  <div className="text-sm text-[#a8a8b3] mt-2">{val1} is <span className="text-white font-bold">{fmtN(r1)}%</span> of {tot1}</div>
                  <div className="text-sm text-[#a8a8b3] mt-1">{fmtN(parseFloat(tot1) - parseFloat(val1))} is {fmtN(r1inv)}% of {tot1}</div>
                </div>
              )}
            </div>
          )}

          {tab === 2 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-4">
              <h2 className="font-bold text-white">% Change from X to Y</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">From</span>
                  <input type="number" value={from2} onChange={e => setFrom2(e.target.value)} className={inp} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">To</span>
                  <input type="number" value={to2} onChange={e => setTo2(e.target.value)} className={inp} />
                </label>
              </div>
              {isFinite(r2) && !isNaN(r2) && (
                <div className={`rounded-xl border p-5 text-center ${isIncrease ? "border-green-500/30 bg-green-900/10" : "border-[#FF6B6B]/30 bg-red-900/10"}`}>
                  <div className={`text-4xl font-black ${isIncrease ? "text-green-400" : "text-[#FF6B6B]"}`}>
                    {isIncrease ? "+" : ""}{fmtN(r2)}% {isIncrease ? "↑" : "↓"}
                  </div>
                  <div className="text-sm text-[#a8a8b3] mt-2">
                    {from2} → {to2} is a <span className={`font-bold ${isIncrease ? "text-green-400" : "text-[#FF6B6B]"}`}>{fmtN(Math.abs(r2))}% {isIncrease ? "INCREASE" : "DECREASE"}</span>
                  </div>
                  <div className="text-xs text-[#a8a8b3] mt-2 font-mono">({to2} − {from2}) ÷ {from2} × 100 = {fmtN(r2)}%</div>
                </div>
              )}
            </div>
          )}

          {/* Tip table */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="font-bold text-white mb-3">Quick Tip Reference — Bill ${fmtN(tipBase)}</h2>
            <div className="space-y-2">
              {tipRows.map(p => (
                <div key={p} className="flex justify-between items-center py-2 border-b border-[#0f3460] last:border-0">
                  <span className="text-sm text-[#a8a8b3]">{p}% tip</span>
                  <span className="font-bold text-[#F9A825]">${fmtN((tipBase * p) / 100)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#a8a8b3] mt-2">Update the bill amount using the &ldquo;Of number&rdquo; field in tab 1.</p>
          </div>

          <ShareButtons
            text="20% of 85 = 17. Quick percentage calculator — all 3 types: www.dayblip.com/tools/percentage-calculator"
            url="https://www.dayblip.com/tools/percentage-calculator"
            title="Percentage Calculator"
          />

          <RelatedTools tools={[
            { emoji: "💰", title: "Tip Calculator", desc: "Calculate and split tips instantly", href: "/tools/tip-calculator" },
            { emoji: "📊", title: "Tax Bracket Calculator", desc: "Marginal vs effective tax rate", href: "/finance/tax-bracket" },
            { emoji: "💹", title: "Profit Margin Calculator", desc: "Calculate business profit margin", href: "/finance/profit-margin" },
            { emoji: "📈", title: "Stock Return Calculator", desc: "Investment return percentage", href: "/finance/stock-return" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
