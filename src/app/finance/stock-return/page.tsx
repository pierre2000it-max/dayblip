"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmtPct(n: number) { return (n >= 0 ? "+" : "") + n.toFixed(2) + "%" }

const SP500_ANNUAL = 0.105 // 10.5% historical avg

export default function StockReturnPage() {
  const [initialInv, setInitialInv] = useState("10000")
  const [currentValue, setCurrentValue] = useState("25000")
  const [years, setYears] = useState("10")
  const [dividends, setDividends] = useState("500")
  const [additionalInv, setAdditionalInv] = useState("0")

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("initial")) setInitialInv(p.get("initial")!)
    if (p.get("current")) setCurrentValue(p.get("current")!)
    if (p.get("years")) setYears(p.get("years")!)
    if (p.get("dividends")) setDividends(p.get("dividends")!)
  }, [])

  const calc = useMemo(() => {
    const inv = parseFloat(initialInv) || 0
    const cur = parseFloat(currentValue) || 0
    const yrs = parseFloat(years) || 1
    const div = parseFloat(dividends) || 0
    const addl = parseFloat(additionalInv) || 0
    const totalInvested = inv + addl

    const gain = cur - totalInvested
    const totalReturn = totalInvested > 0 ? (gain / totalInvested * 100) : 0
    const annualizedReturn = totalInvested > 0 && yrs > 0
      ? ((Math.pow(cur / totalInvested, 1 / yrs) - 1) * 100)
      : 0
    const totalWithDiv = gain + div
    const totalReturnWithDiv = totalInvested > 0 ? (totalWithDiv / totalInvested * 100) : 0

    const sp500Value = inv * Math.pow(1 + SP500_ANNUAL, yrs)
    const vsSP500 = annualizedReturn - SP500_ANNUAL * 100
    const rule72 = annualizedReturn > 0 ? (72 / annualizedReturn).toFixed(1) : "—"

    return { gain, totalReturn, annualizedReturn, totalWithDiv, totalReturnWithDiv, sp500Value, vsSP500, rule72, totalInvested }
  }, [initialInv, currentValue, years, dividends, additionalInv])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Stock Return Calculator</h1>
          <p className="text-[#a8a8b3]">Calculate your investment return and compare to market benchmarks</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Initial Investment ($)</span>
              <input type="number" value={initialInv} onChange={e => setInitialInv(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current / Sale Value ($)</span>
              <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Holding Period (years)</span>
              <input type="number" step="0.5" value={years} onChange={e => setYears(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Dividends Received ($)</span>
              <input type="number" value={dividends} onChange={e => setDividends(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1 md:col-span-2"><span className="text-sm font-semibold text-white">Additional Investments ($)</span>
              <input type="number" value={additionalInv} onChange={e => setAdditionalInv(e.target.value)} className={inp} /></label>
          </div>

          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Total Invested", value: fmt(calc.totalInvested), color: "text-white" },
              { label: "Current Value", value: fmt(parseFloat(currentValue) || 0), color: "text-[#F9A825]" },
              { label: "Total Gain / Loss", value: fmt(calc.gain), color: calc.gain >= 0 ? "text-[#4ade80]" : "text-[#e94560]" },
              { label: "Total Return", value: fmtPct(calc.totalReturn), color: calc.totalReturn >= 0 ? "text-[#4ade80]" : "text-[#e94560]" },
              { label: "Annualized Return", value: fmtPct(calc.annualizedReturn), color: "text-[#4FC3F7]" },
              { label: "Dividends Received", value: fmt(parseFloat(dividends) || 0), color: "text-[#a8a8b3]" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 flex justify-between items-center">
                <span className="text-sm text-[#a8a8b3]">{r.label}</span>
                <span className={`font-black text-lg ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* S&P 500 comparison */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">📊 vs S&amp;P 500 Benchmark</h2>
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <div className="rounded-lg bg-[#16213e] p-4">
                <div className="text-[#a8a8b3] mb-1">Your investment</div>
                <div className="text-2xl font-black text-[#F9A825]">{fmt(parseFloat(currentValue) || 0)}</div>
                <div className="text-[#a8a8b3]">{fmtPct(calc.annualizedReturn)}/yr annualized</div>
              </div>
              <div className="rounded-lg bg-[#16213e] p-4">
                <div className="text-[#a8a8b3] mb-1">S&amp;P 500 (10.5%/yr avg)</div>
                <div className="text-2xl font-black text-[#4FC3F7]">{fmt(calc.sp500Value)}</div>
                <div className="text-[#a8a8b3]">+10.50%/yr avg</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-center">
              <span className={calc.vsSP500 >= 0 ? "text-green-400 font-bold" : "text-[#e94560] font-bold"}>
                {calc.vsSP500 >= 0 ? "✅ " : "⚠️ "}{Math.abs(calc.vsSP500).toFixed(2)}% {calc.vsSP500 >= 0 ? "better" : "worse"} than S&amp;P 500
              </span>
            </div>
          </div>

          {/* Rule of 72 */}
          {calc.annualizedReturn > 0 && (
            <div className="rounded-xl border border-[#e94560]/20 bg-[#1a1a2e] p-4 text-sm">
              <span className="text-[#e94560] font-semibold">📐 Rule of 72: </span>
              <span className="text-[#a8a8b3]">At your {calc.annualizedReturn.toFixed(1)}% return, your money doubles every </span>
              <span className="text-white font-bold">{calc.rule72} years</span>
            </div>
          )}

          <ShareButtons
            text={`${fmtPct(calc.totalReturn)} total return (${fmtPct(calc.annualizedReturn)}/yr annualized). ${calc.vsSP500 >= 0 ? "Beat" : "Behind"} S&P 500 by ${Math.abs(calc.vsSP500).toFixed(2)}%. (Educational only)`}
            url={`https://www.dayblip.com/finance/stock-return?initial=${initialInv}&current=${currentValue}&years=${years}&dividends=${dividends}`}
            title="Stock Return Calculator"
          />
          <p className="text-xs text-[#a8a8b3]">For educational purposes only. Past returns do not guarantee future results. S&P 500 historical average is approximate. Not investment advice.</p>
        </div>
      </section>
    </div>
  )
}
