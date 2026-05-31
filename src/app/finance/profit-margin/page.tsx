"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const BENCHMARKS = [
  { industry: "Software / SaaS", gross: "70–80%", operating: "20–35%", net: "15–30%" },
  { industry: "Retail", gross: "20–50%", operating: "3–8%", net: "2–6%" },
  { industry: "Restaurant", gross: "60–65%", operating: "3–9%", net: "3–9%" },
  { industry: "Manufacturing", gross: "20–40%", operating: "5–15%", net: "4–10%" },
  { industry: "Consulting", gross: "40–70%", operating: "15–30%", net: "10–25%" },
  { industry: "E-commerce", gross: "20–45%", operating: "2–10%", net: "1–8%" },
]

export default function ProfitMarginPage() {
  const [revenue, setRevenue] = useState("500000")
  const [cogs, setCogs] = useState("200000")
  const [opex, setOpex] = useState("150000")
  const [taxes, setTaxes] = useState("30000")
  const [desiredMargin, setDesiredMargin] = useState("20")
  const [units, setUnits] = useState("1000")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("revenue")) setRevenue(p.get("revenue")!)
    if (p.get("cogs")) setCogs(p.get("cogs")!)
    if (p.get("opex")) setOpex(p.get("opex")!)
    if (p.get("taxes")) setTaxes(p.get("taxes")!)
  }, [])

  const calc = useMemo(() => {
    const rev = parseFloat(revenue) || 0
    const c = parseFloat(cogs) || 0
    const op = parseFloat(opex) || 0
    const tx = parseFloat(taxes) || 0

    const grossProfit = rev - c
    const grossMarginPct = rev > 0 ? (grossProfit / rev * 100).toFixed(1) : "0"

    const operatingProfit = grossProfit - op
    const operatingMarginPct = rev > 0 ? (operatingProfit / rev * 100).toFixed(1) : "0"

    const netProfit = operatingProfit - tx
    const netMarginPct = rev > 0 ? (netProfit / rev * 100).toFixed(1) : "0"

    const u = parseFloat(units) || 1
    const dm = parseFloat(desiredMargin) || 0
    const requiredPrice = u > 0 && c > 0 ? (c / u) / (1 - dm / 100) : 0

    return { grossProfit, grossMarginPct, operatingProfit, operatingMarginPct, netProfit, netMarginPct, requiredPrice }
  }, [revenue, cogs, opex, taxes, desiredMargin, units])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  const MarginCard = ({ label, profit, pct, color }: { label: string; profit: number; pct: string; color: string }) => (
    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
      <h3 className="text-sm text-[#a8a8b3] mb-2">{label}</h3>
      <div className="text-3xl font-black" style={{ color }}>{fmt(profit)}</div>
      <div className="text-xl font-bold text-white">{pct}%</div>
      <div className="mt-2 h-2 rounded-full bg-[#16213e] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, parseFloat(pct)))}%`, background: color }} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Profit Margin Calculator</h1>
          <p className="text-[#a8a8b3]">Calculate gross, operating and net profit margins for your business</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Revenue ($)</span>
              <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Cost of Goods Sold ($)</span>
              <input type="number" value={cogs} onChange={e => setCogs(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Operating Expenses ($)</span>
              <input type="number" value={opex} onChange={e => setOpex(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Taxes ($)</span>
              <input type="number" value={taxes} onChange={e => setTaxes(e.target.value)} className={inp} /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MarginCard label="Gross Profit Margin" profit={calc.grossProfit} pct={calc.grossMarginPct} color="#4ade80" />
            <MarginCard label="Operating Profit Margin" profit={calc.operatingProfit} pct={calc.operatingMarginPct} color="#F9A825" />
            <MarginCard label="Net Profit Margin" profit={calc.netProfit} pct={calc.netMarginPct} color="#4FC3F7" />
          </div>

          {/* Pricing calculator */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🎯 Pricing Calculator</h2>
            <p className="text-sm text-[#a8a8b3] mb-3">What price do you need to hit your target net margin?</p>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1"><span className="text-xs text-[#a8a8b3]">Units sold</span>
                <input type="number" value={units} onChange={e => setUnits(e.target.value)} className={inp} /></label>
              <label className="flex flex-col gap-1"><span className="text-xs text-[#a8a8b3]">Desired margin (%)</span>
                <input type="number" value={desiredMargin} onChange={e => setDesiredMargin(e.target.value)} className={inp} /></label>
              <div className="rounded-lg bg-[#16213e] p-3 flex flex-col justify-center">
                <div className="text-xs text-[#a8a8b3]">Required price/unit</div>
                <div className="text-xl font-black text-[#F9A825]">
                  {calc.requiredPrice > 0 ? `$${calc.requiredPrice.toFixed(2)}` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 Industry Benchmarks</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Industry</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Gross</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Operating</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Net</th>
                </tr></thead>
                <tbody>{BENCHMARKS.map(b => (
                  <tr key={b.industry} className="border-b border-[#0f3460]/50">
                    <td className="py-2 text-white">{b.industry}</td>
                    <td className="py-2 text-center text-[#4ade80]">{b.gross}</td>
                    <td className="py-2 text-center text-[#F9A825]">{b.operating}</td>
                    <td className="py-2 text-center text-[#4FC3F7]">{b.net}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <ShareButtons
            text={`Gross margin: ${calc.grossMarginPct}% | Operating: ${calc.operatingMarginPct}% | Net: ${calc.netMarginPct}%. (Educational only)`}
            url={`https://www.dayblip.com/finance/profit-margin?revenue=${revenue}&cogs=${cogs}&opex=${opex}&taxes=${taxes}`}
            title="Profit Margin Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Benchmarks are approximate industry averages and vary by company size, geography and business model.</p>
        </div>
      </section>
    </div>
  )
}
