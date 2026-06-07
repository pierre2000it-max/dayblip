"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

function calcOrdinaryTax(taxable: number, filing: string): number {
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

function getLTCGRate(income: number, filing: string): number {
  const thresholds = filing === "mfj"
    ? [94050, 583750] : [47025, 518900]
  if (income <= thresholds[0]) return 0
  if (income <= thresholds[1]) return 0.15
  return 0.20
}

function getOrdinaryRate(taxable: number, filing: string): number {
  const brackets = filing === "mfj"
    ? [[23850,0.10],[96950,0.12],[206700,0.22],[394600,0.24],[501050,0.32],[751600,0.35],[Infinity,0.37]] as [number,number][]
    : [[11925,0.10],[48475,0.12],[103350,0.22],[197300,0.24],[250525,0.32],[626350,0.35],[Infinity,0.37]] as [number,number][]
  for (const [limit, rate] of brackets) {
    if (taxable <= limit) return rate
  }
  return 0.37
}

export default function CapitalGainsPage() {
  const [purchasePrice, setPurchasePrice] = useState("10000")
  const [salePrice, setSalePrice] = useState("25000")
  const [holding, setHolding] = useState<"short" | "long">("long")
  const [annualIncome, setAnnualIncome] = useState("75000")
  const [filing, setFiling] = useState("single")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("purchase")) setPurchasePrice(p.get("purchase")!)
    if (p.get("sale")) setSalePrice(p.get("sale")!)
    if (p.get("holding")) setHolding(p.get("holding") as "short" | "long")
    if (p.get("income")) setAnnualIncome(p.get("income")!)
    if (p.get("filing")) setFiling(p.get("filing")!)
  }, [])

  const calc = useMemo(() => {
    const pp = parseFloat(purchasePrice) || 0
    const sp = parseFloat(salePrice) || 0
    const gain = sp - pp
    const income = parseFloat(annualIncome) || 0

    const stdDed = filing === "mfj" ? 30000 : 15000
    const taxableIncome = Math.max(0, income - stdDed)

    let taxRate: number
    let taxOwed: number
    let rateLabel: string

    if (holding === "short") {
      taxRate = getOrdinaryRate(taxableIncome + Math.max(0, gain), filing)
      taxOwed = gain > 0 ? calcOrdinaryTax(taxableIncome + gain, filing) - calcOrdinaryTax(taxableIncome, filing) : 0
      rateLabel = `${(taxRate * 100).toFixed(0)}% (ordinary income)`
    } else {
      taxRate = getLTCGRate(income, filing)
      taxOwed = gain > 0 ? gain * taxRate : 0
      rateLabel = `${(taxRate * 100).toFixed(0)}% (long-term)`
    }

    const afterTaxProfit = gain - Math.max(0, taxOwed)

    // Short-term comparison (if currently long-term)
    const stTax = gain > 0 ? calcOrdinaryTax(taxableIncome + gain, filing) - calcOrdinaryTax(taxableIncome, filing) : 0
    const ltRate = getLTCGRate(income, filing)
    const ltTax = gain > 0 ? gain * ltRate : 0
    const savedByWaiting = stTax - ltTax

    // NIIT
    const niitThreshold = filing === "mfj" ? 250000 : 200000
    const niit = income > niitThreshold && gain > 0 ? gain * 0.038 : 0

    return { gain, taxRate, taxOwed, rateLabel, afterTaxProfit, stTax, ltTax, savedByWaiting, niit, income }
  }, [purchasePrice, salePrice, holding, annualIncome, filing])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Capital Gains Tax Calculator",
          "Estimate the capital gains tax you owe on investment profits for short and long term holdings.",
          "https://www.dayblip.com/finance/capital-gains",
          "FinanceApplication"
        ),
        faqSchema([
          { question: "What is the difference between short-term and long-term capital gains?", answer: "Short-term gains apply to assets held one year or less and are taxed at your ordinary income tax rate. Long-term gains apply to assets held more than one year and are taxed at lower rates of 0%, 15%, or 20% depending on your income and filing status." },
          { question: "How much capital gains tax will I owe?", answer: "Enter your purchase price, sale price, holding period, annual income, and filing status. The calculator computes your gain and applies either ordinary income brackets (short-term) or the 0/15/20% long-term rates to estimate your federal tax owed and after-tax profit." },
          { question: "Can I save money by holding an investment longer than a year?", answer: "Often yes. Because long-term rates are usually lower than ordinary income rates, holding an asset past the one-year mark can reduce the tax owed. The calculator shows a side-by-side comparison of selling now versus waiting for long-term treatment." },
          { question: "What is the Net Investment Income Tax?", answer: "The Net Investment Income Tax is an additional 3.8% tax on investment income for filers whose income exceeds $200,000 (single) or $250,000 (married filing jointly). The calculator adds this surtax when your income crosses the threshold." },
          { question: "Does this include state capital gains tax?", answer: "No. This calculator estimates federal capital gains tax only and does not include state taxes or every individual adjustment. Consult a CPA for figures specific to your situation and state." },
        ]),
        howToSchema(
          "Capital Gains Tax Calculator — How To Use",
          "Estimate federal tax on your investment gains for short and long term holdings.",
          [
            "Enter the purchase price and sale price of your asset.",
            "Enter your annual income and select your filing status.",
            "Choose whether the holding period is short-term or long-term.",
            "Review your capital gain, tax rate, tax owed, and after-tax profit.",
          ]
        ),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "Capital Gains Tax Calculator", url: "https://www.dayblip.com/finance/capital-gains" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Capital Gains Tax Calculator</h1>
          <p className="text-[#a8a8b3]">Calculate how much tax you owe on investments, property and assets</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Purchase Price ($)</span>
              <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Sale Price ($)</span>
              <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Annual Income ($)</span>
              <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Filing Status</span>
              <select value={filing} onChange={e => setFiling(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                <option value="single">Single</option>
                <option value="mfj">Married Filing Jointly</option>
              </select></label>
            <div className="flex flex-col gap-1 md:col-span-2"><span className="text-sm font-semibold text-white">Holding Period</span>
              <div className="flex gap-2">
                {([["short","Short-term (< 1 year)"],["long","Long-term (> 1 year)"]] as const).map(([v, label]) => (
                  <button key={v} onClick={() => setHolding(v)}
                    className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${holding === v ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={`rounded-xl p-6 text-center ${calc.gain >= 0 ? "border border-green-500/30 bg-green-900/20" : "border border-red-500/30 bg-red-900/20"}`}>
            <div className="text-sm text-[#a8a8b3] mb-1">Your Capital {calc.gain >= 0 ? "Gain" : "Loss"}</div>
            <div className={`text-5xl font-black ${calc.gain >= 0 ? "text-[#4ade80]" : "text-[#e94560]"}`}>{fmt(Math.abs(calc.gain))}</div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div><div className="font-bold text-white">{calc.rateLabel}</div><div className="text-[#a8a8b3]">Tax rate</div></div>
              <div><div className="font-bold text-[#e94560]">{fmt(calc.taxOwed)}</div><div className="text-[#a8a8b3]">Tax owed</div></div>
              <div><div className="font-bold text-[#F9A825]">{fmt(calc.afterTaxProfit)}</div><div className="text-[#a8a8b3]">After-tax profit</div></div>
            </div>
          </div>

          {/* Holding period impact */}
          {calc.gain > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h2 className="mb-3 font-bold text-white">⏰ Short vs Long-Term Comparison</h2>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div className={`rounded-lg p-4 ${holding === "short" ? "border border-[#e94560]/30 bg-[#e94560]/10" : "bg-[#16213e]"}`}>
                  <div className="font-bold text-white mb-1">Short-term (sell now)</div>
                  <div className="text-[#e94560] font-black">{fmt(calc.stTax)} tax</div>
                </div>
                <div className={`rounded-lg p-4 ${holding === "long" ? "border border-green-500/30 bg-green-900/20" : "bg-[#16213e]"}`}>
                  <div className="font-bold text-white mb-1">Long-term (wait 1+ year)</div>
                  <div className="text-green-400 font-black">{fmt(calc.ltTax)} tax</div>
                </div>
              </div>
              {calc.savedByWaiting > 0 && (
                <div className="mt-3 text-sm text-center">
                  <span className="text-green-400 font-bold">Save {fmt(calc.savedByWaiting)}</span>
                  <span className="text-[#a8a8b3]"> by holding for long-term treatment</span>
                </div>
              )}
            </div>
          )}

          {/* NIIT */}
          {calc.niit > 0 && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm">
              <span className="text-yellow-300 font-semibold">⚠️ Net Investment Income Tax (3.8%): </span>
              <span className="text-[#a8a8b3]">Your income exceeds the NIIT threshold. Additional tax: </span>
              <span className="text-white font-bold">{fmt(calc.niit)}</span>
            </div>
          )}

          {/* 2026 Rates */}
          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📋 2026 Long-Term Capital Gains Rates</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#0f3460]">
                <th className="py-2 text-left text-[#a8a8b3]">Rate</th>
                <th className="py-2 text-right text-[#a8a8b3]">Single Income</th>
                <th className="py-2 text-right text-[#a8a8b3]">MFJ Income</th>
              </tr></thead>
              <tbody>
                {[["0%","Up to $47,025","Up to $94,050"],["15%","$47,026–$518,900","$94,051–$583,750"],["20%","Over $518,900","Over $583,750"]].map(r => (
                  <tr key={r[0]} className="border-b border-[#0f3460]/50">
                    <td className="py-2 font-bold text-[#4ade80]">{r[0]}</td>
                    <td className="py-2 text-right text-[#a8a8b3]">{r[1]}</td>
                    <td className="py-2 text-right text-[#a8a8b3]">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ShareButtons
            text={`Capital gain of ${fmt(calc.gain)} with ${calc.rateLabel} tax rate = ${fmt(calc.taxOwed)} owed. (Educational only)`}
            url={`https://www.dayblip.com/finance/capital-gains?purchase=${purchasePrice}&sale=${salePrice}&holding=${holding}&income=${annualIncome}&filing=${filing}`}
            title="Capital Gains Tax Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">Educational estimate only. Does not include state capital gains taxes or all adjustments. Consult a CPA for accurate tax advice.</p>
        </div>
      </section>
    </div>
  )
}
