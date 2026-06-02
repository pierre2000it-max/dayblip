"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const CURRENT_YEAR = 2026

const stockMultipliers: Record<string, Record<number, number>> = {
  "Apple": { 2001: 780, 2003: 420, 2005: 120, 2008: 48, 2010: 35, 2012: 18, 2015: 8.5, 2017: 5.2, 2019: 3.8, 2020: 3.2, 2022: 1.4 },
  "Amazon": { 2001: 1900, 2003: 800, 2005: 280, 2008: 95, 2010: 45, 2012: 22, 2015: 12, 2017: 6.8, 2019: 4.2, 2020: 3.5, 2022: 1.3 },
  "Netflix": { 2007: 180, 2009: 120, 2011: 45, 2013: 25, 2015: 12, 2017: 7.5, 2019: 3.2, 2020: 2.8, 2022: 0.8 },
  "Tesla": { 2012: 120, 2014: 55, 2016: 18, 2018: 12, 2020: 8.5, 2021: 4.2, 2022: 1.5, 2023: 2.1 },
  "Google": { 2004: 95, 2006: 42, 2008: 18, 2010: 12, 2013: 7.5, 2015: 5.2, 2017: 3.8, 2019: 2.8, 2021: 2.2 },
  "Microsoft": { 2000: 18, 2005: 8.5, 2010: 6.2, 2013: 5.8, 2015: 4.8, 2017: 3.5, 2019: 2.8, 2021: 2.1 },
  "Bitcoin": { 2015: 380, 2016: 88, 2017: 45, 2019: 22, 2020: 12, 2021: 6.5, 2022: 1.8, 2023: 3.2 },
  "S&P 500": { 2000: 3.8, 2003: 5.8, 2005: 5.2, 2008: 3.2, 2010: 6.1, 2013: 4.5, 2015: 3.2, 2017: 2.8, 2019: 2.2, 2020: 2.1, 2022: 1.1 },
}

const STOCKS = Object.keys(stockMultipliers)

const presets = [
  { stock: "Apple", year: 2001, amount: 1000, mult: 780 },
  { stock: "Amazon", year: 2001, amount: 1000, mult: 1900 },
  { stock: "Netflix", year: 2007, amount: 1000, mult: 180 },
  { stock: "Tesla", year: 2012, amount: 1000, mult: 120 },
  { stock: "Google", year: 2004, amount: 1000, mult: 95 },
  { stock: "Microsoft", year: 2000, amount: 1000, mult: 18 },
  { stock: "Bitcoin", year: 2015, amount: 1000, mult: 45 },
  { stock: "S&P 500", year: 2000, amount: 1000, mult: 3.8 },
]

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational and entertainment purposes only.</strong> Not investment advice. Past returns do not predict future results. Investing involves risk of loss.
  </div>
)

interface Result {
  stock: string; year: number; amount: number; mult: number
  result: number; years: number; annualReturn: number; profit: number
  spResult: number; spMult: number
}

export default function StockCalculatorPage() {
  const [stock, setStock] = useState("Apple")
  const [year, setYear] = useState(2001)
  const [amount, setAmount] = useState("1000")
  const [result, setResult] = useState<Result | null>(null)

  const yearsFor = (s: string) => Object.keys(stockMultipliers[s]).map(Number).sort((a, b) => a - b)

  function compute(s: string, y: number, amt: number): Result | null {
    const mult = stockMultipliers[s]?.[y]
    if (mult === undefined) return null
    const res = amt * mult
    const years = CURRENT_YEAR - y
    const annualReturn = (Math.pow(mult, 1 / years) - 1) * 100
    const spMult = stockMultipliers["S&P 500"][y] ?? stockMultipliers["S&P 500"][2000]
    const spResult = amt * spMult
    return { stock: s, year: y, amount: amt, mult, result: res, years, annualReturn, profit: res - amt, spResult, spMult }
  }

  function runCalc(s = stock, y = year, amt = parseFloat(amount) || 0, push = true) {
    const res = compute(s, y, amt)
    if (!res) return
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?stock=${encodeURIComponent(s)}&year=${y}&amount=${amt}`)
    }
  }

  function applyPreset(p: typeof presets[number]) {
    setStock(p.stock); setYear(p.year); setAmount(String(p.amount))
    runCalc(p.stock, p.year, p.amount)
  }

  function onStockChange(s: string) {
    setStock(s)
    const yrs = yearsFor(s)
    if (!yrs.includes(year)) setYear(yrs[0])
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const s = p.get("stock"); const y = p.get("year"); const amt = p.get("amount")
    if (s && stockMultipliers[s] && y && stockMultipliers[s][Number(y)] !== undefined) {
      const yn = Number(y); const an = amt ? Number(amt) : 1000
      setStock(s); setYear(yn); setAmount(String(an))
      runCalc(s, yn, an, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/stock-calculator?stock=${encodeURIComponent(result.stock)}&year=${result.year}&amount=${result.amount}` : ""
  const shareText = result ? `${fmt(result.amount)} in ${result.stock} in ${result.year} would be worth ${fmt(result.result)} today! That is ${result.mult}x in ${result.years} years 😮 (Not investment advice)` : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <h1 className="mb-3 text-4xl font-bold text-white">What If You Had Invested Then?</h1>
          <p className="text-[#a8a8b3]">See what a past investment in famous stocks would be worth today</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          {DISCLAIMER}

          <div>
            <h2 className="mb-4 text-center text-xl font-bold text-white">Featured examples</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {presets.map(p => (
                <button key={p.stock + p.year} onClick={() => applyPreset(p)}
                  className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center transition-all hover:border-[#e94560]">
                  <div className="text-sm font-semibold text-white">${p.amount.toLocaleString()} in {p.stock} in {p.year}</div>
                  <div className="mt-1 text-lg font-black text-[#e94560]">→ {fmt(p.amount * p.mult)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Stock</span>
              <select value={stock} onChange={e => onStockChange(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Year invested</span>
              <select value={year} onChange={e => setYear(Number(e.target.value))}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {yearsFor(stock).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Amount invested</span>
              <div className="flex items-center gap-2">
                <span className="text-[#a8a8b3]">$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <div className="text-6xl font-black text-[#e94560]">{fmt(result.result)}</div>
                <p className="mt-3 text-white">{fmt(result.amount)} in {result.stock} in {result.year} would be worth {fmt(result.result)} today</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div><div className="font-bold text-[#F9A825]">{result.mult}x</div><div className="text-[#a8a8b3]">Your money</div></div>
                  <div><div className="font-bold text-[#4ade80]">{result.annualReturn.toFixed(1)}%</div><div className="text-[#a8a8b3]">Annual return</div></div>
                  <div><div className="font-bold text-white">{result.years}</div><div className="text-[#a8a8b3]">Years held</div></div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-2 font-bold text-white">vs S&P 500 same period</h3>
                <p className="text-sm text-[#a8a8b3]">{fmt(result.amount)} in the S&P 500 in {result.year} would be worth <span className="font-bold text-white">{fmt(result.spResult)}</span>.</p>
                <p className="mt-2 text-sm" style={{ color: result.result >= result.spResult ? "#4ade80" : "#FF6B6B" }}>
                  {result.stock} {result.result >= result.spResult ? "outperformed" : "underperformed"} the S&P 500 by {fmt(Math.abs(result.result - result.spResult))}.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#4ade80]">{fmt(result.profit)}</div><div className="text-[#a8a8b3]">Profit</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-[#F9A825]">{((result.mult - 1) * 100).toFixed(0)}%</div><div className="text-[#a8a8b3]">Total return</div></div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"><div className="font-bold text-white">{result.annualReturn.toFixed(1)}%/yr</div><div className="text-[#a8a8b3]">Annualized</div></div>
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-[#F9A825]">⚠️ The hard truth</h3>
                <p>Most investors do NOT achieve these returns because they:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[#e0e0e8]">
                  <li>Buy after prices have already risen</li>
                  <li>Sell during market downturns</li>
                  <li>Cannot predict which stocks will win</li>
                  <li>Timing the market is nearly impossible</li>
                </ul>
                <p className="mt-2">This is why index funds (S&P 500) work better for most investors.</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Historical Stock Calculator" />
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
