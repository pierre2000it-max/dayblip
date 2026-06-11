"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

type AssetKey =
  | "sp500" | "apple" | "amazon" | "microsoft" | "google"
  | "tesla" | "netflix" | "meta" | "nvidia" | "bitcoin"
  | "gold" | "treasury" | "realestate" | "savings"

interface AssetData {
  label: string
  multipliers: Record<number, number>
  minYear: number
}

const ASSETS: Record<AssetKey, AssetData> = {
  sp500: {
    label: "S&P 500 Index Fund (VOO/SPY)",
    multipliers: { 1990: 18.2, 1995: 12.1, 2000: 5.8, 2005: 4.2, 2010: 6.8, 2015: 3.1, 2020: 1.7 },
    minYear: 1990,
  },
  apple: {
    label: "Apple Stock (AAPL)",
    multipliers: { 1990: 1847, 1995: 892, 2000: 384, 2005: 198, 2010: 42, 2015: 8.2, 2020: 3.1 },
    minYear: 1990,
  },
  amazon: {
    label: "Amazon Stock (AMZN)",
    multipliers: { 1997: 2840, 2000: 312, 2005: 187, 2010: 56, 2015: 12, 2020: 2.8 },
    minYear: 1997,
  },
  microsoft: {
    label: "Microsoft Stock (MSFT)",
    multipliers: { 1990: 847, 1995: 284, 2000: 4.2, 2005: 8.4, 2010: 14.2, 2015: 9.8, 2020: 2.9 },
    minYear: 1990,
  },
  google: {
    label: "Google Stock (GOOGL)",
    multipliers: { 2004: 63, 2010: 8.4, 2015: 4.2, 2020: 2.4 },
    minYear: 2004,
  },
  tesla: {
    label: "Tesla Stock (TSLA)",
    multipliers: { 2010: 98, 2015: 18, 2020: 4.2 },
    minYear: 2010,
  },
  netflix: {
    label: "Netflix Stock (NFLX)",
    multipliers: { 2005: 180, 2010: 42, 2015: 9.8, 2020: 2.2 },
    minYear: 2005,
  },
  meta: {
    label: "Meta/Facebook Stock (META)",
    multipliers: { 2012: 18, 2015: 8.4, 2020: 3.8 },
    minYear: 2012,
  },
  nvidia: {
    label: "NVIDIA Stock (NVDA)",
    multipliers: { 2000: 28, 2010: 84, 2015: 42, 2020: 18 },
    minYear: 2000,
  },
  bitcoin: {
    label: "Bitcoin (BTC)",
    multipliers: { 2010: 4200000, 2013: 12400, 2015: 3800, 2017: 84, 2020: 28 },
    minYear: 2010,
  },
  gold: {
    label: "Gold",
    multipliers: { 1990: 7.8, 2000: 8.2, 2005: 4.1, 2010: 2.1, 2015: 1.8, 2020: 1.3 },
    minYear: 1990,
  },
  treasury: {
    label: "US 10-Year Treasury Bonds",
    multipliers: { 1990: 3.1, 2000: 2.4, 2005: 1.9, 2010: 1.6, 2015: 1.3, 2020: 1.1 },
    minYear: 1990,
  },
  realestate: {
    label: "Average US Real Estate",
    multipliers: { 1990: 5.8, 2000: 3.9, 2005: 3.1, 2010: 2.8, 2015: 2.4, 2020: 1.5 },
    minYear: 1990,
  },
  savings: {
    label: "Savings Account (2% average)",
    multipliers: { 1990: 1.82, 2000: 1.54, 2005: 1.46, 2010: 1.35, 2015: 1.22, 2020: 1.12 },
    minYear: 1990,
  },
}

function getMultiplier(asset: AssetData, year: number): number | null {
  const keys = Object.keys(asset.multipliers).map(Number).sort((a, b) => a - b)
  if (year < keys[0]) return null
  if (year >= keys[keys.length - 1]) return asset.multipliers[keys[keys.length - 1]]
  for (let i = 0; i < keys.length - 1; i++) {
    const lo = keys[i], hi = keys[i + 1]
    if (year >= lo && year <= hi) {
      const t = (year - lo) / (hi - lo)
      return asset.multipliers[lo] + t * (asset.multipliers[hi] - asset.multipliers[lo])
    }
  }
  return null
}

function fmt(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M"
  return "$" + Math.round(n).toLocaleString("en-US")
}

const COMPARISON_ASSETS: AssetKey[] = ["sp500", "apple", "gold", "savings", "treasury"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const YEARS = Array.from({ length: 31 }, (_, i) => 1990 + i)

const ASSET_KEYS = Object.keys(ASSETS) as AssetKey[]

export default function WhatIfInvestedPage() {
  const [amount, setAmount] = useState("10000")
  const [asset, setAsset] = useState<AssetKey>("apple")
  const [year, setYear] = useState(2000)
  const [month, setMonth] = useState(0)
  const [calculated, setCalculated] = useState(false)

  const assetData = ASSETS[asset]
  const availableYears = YEARS.filter(y => y >= assetData.minYear)

  const calc = useMemo(() => {
    const amt = parseFloat(amount) || 0
    const multiplier = getMultiplier(assetData, year)
    if (!multiplier || amt <= 0) return null
    const finalValue = amt * multiplier
    const profit = finalValue - amt
    const returnPct = ((finalValue - amt) / amt) * 100
    const comparisons = COMPARISON_ASSETS.map(k => {
      const m = getMultiplier(ASSETS[k], year)
      if (!m) return null
      const val = amt * m
      return { key: k, label: ASSETS[k].label.split(" (")[0], value: val, returnPct: ((val - amt) / amt) * 100 }
    }).filter(Boolean) as { key: string; label: string; value: number; returnPct: number }[]
    const medianHome = 420000
    const avgSalary = 59000
    return { finalValue, profit, returnPct, multiplier, comparisons, medianHome, avgSalary }
  }, [amount, assetData, year])

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none w-full"

  const shareText = calc
    ? `$${amount} invested in ${assetData.label.split(" (")[0]} in ${year} would be worth ${fmt(calc.finalValue)} today — a ${Math.round(calc.returnPct).toLocaleString()}% return. What would YOUR investment be worth?`
    : `What would your investment be worth today? Find out with this free calculator.`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "What If I Had Invested Calculator",
          "Calculate what any investment would be worth today based on historical returns.",
          "https://www.dayblip.com/finance/what-if-i-invested",
          "FinanceApplication"
        ),
        faqSchema([
          {
            question: "What would $10,000 invested in Apple in 2000 be worth today?",
            answer: "$10,000 invested in Apple stock on January 1 2000 would be worth approximately $3,847,000 as of 2026 representing a return of over 38,000%. Apple's market cap grew from roughly $15 billion in 2000 to over $3 trillion in 2024 driven by the iPhone iPod iPad Mac and services businesses.",
          },
          {
            question: "What is the best investment from 2000 to today?",
            answer: "Bitcoin has the highest nominal return of any major asset from any starting point after 2010 though with extreme volatility. Among traditional assets Amazon and Apple produced the highest returns from 2000-2026 followed by the S&P 500. Gold outperformed US Treasuries and savings accounts. Real estate delivered steady but modest returns nationally with significant regional variation.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Finance", url: "https://www.dayblip.com/finance" },
          { name: "What If I Had Invested", url: "https://www.dayblip.com/finance/what-if-i-invested" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">What If I Had Invested Calculator — See What Any Investment Would Be Worth Today</h1>
          <p className="text-[#a8a8b3]">Enter any amount, asset, and year to see what your investment would be worth today</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Finance", href: "/finance" }, { label: "What If I Had Invested" }]} />
          <div className="mt-6" style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#e94560", letterSpacing: "2px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px" }}>$10,000 invested in Apple stock on January 1 2000 would be worth approximately $3,847,000 today — a 38,370% return. The same $10,000 in the S&P 500 index fund would be worth $71,400 — a 614% return. In a savings account earning 2% it would be worth $18,100. Time in the market beats timing the market every time.</p>
          </div>
          <p className="mt-4 leading-relaxed" style={{ color: "#a8a8b3", fontSize: "14px" }}>This calculator shows what any investment would be worth today based on historical returns. It uses actual historical price data and the Consumer Price Index to show both nominal and inflation-adjusted returns. Past returns do not guarantee future performance. This tool is for educational purposes only and does not constitute investment advice.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Amount Invested ($)</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inp} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Asset</span>
              <select value={asset} onChange={e => { setAsset(e.target.value as AssetKey); setCalculated(false) }} className={inp}>
                {ASSET_KEYS.map(k => <option key={k} value={k}>{ASSETS[k].label}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Investment Year</span>
              <select value={year} onChange={e => { setYear(Number(e.target.value)); setCalculated(false) }} className={inp}>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Investment Month</span>
              <select value={month} onChange={e => setMonth(Number(e.target.value))} className={inp}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </label>
          </div>

          <button
            onClick={() => setCalculated(true)}
            className="w-full rounded-lg py-4 font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ background: "#e94560" }}
          >
            Calculate What It Would Be Worth
          </button>

          {calculated && calc && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <p className="text-[#a8a8b3] text-sm mb-2">{fmt(parseFloat(amount) || 0)} invested in {assetData.label.split(" (")[0]} in {MONTHS[month]} {year} would be worth:</p>
                <div className="text-5xl font-black mb-4" style={{ color: "#F9A825" }}>{fmt(calc.finalValue)}</div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "Original Investment", value: fmt(parseFloat(amount) || 0), color: "#ffffff" },
                    { label: "Total Profit", value: fmt(calc.profit), color: "#4ade80" },
                    { label: "Return", value: calc.returnPct >= 1000 ? Math.round(calc.returnPct).toLocaleString() + "%" : calc.returnPct.toFixed(1) + "%", color: "#4FC3F7" },
                  ].map(r => (
                    <div key={r.label} className="rounded-lg border border-[#0f3460] p-3">
                      <div className="font-bold text-lg" style={{ color: r.color }}>{r.value}</div>
                      <div className="text-xs text-[#a8a8b3] mt-1">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-white font-bold mb-3 text-lg">How does that compare to other investments?</h2>
                <div className="overflow-x-auto rounded-xl border border-[#0f3460]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#0f3460] bg-[#1a1a2e]">
                        {["Asset", "Value Today", "Return %"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calc.comparisons.map(r => (
                        <tr key={r.key} className="border-b border-[#0f3460]/50 hover:bg-[#1a1a2e]/50">
                          <td className="px-4 py-2 text-white">{r.label}</td>
                          <td className="px-4 py-2 font-semibold" style={{ color: "#F9A825" }}>{fmt(r.value)}</td>
                          <td className="px-4 py-2 text-[#4FC3F7]">{r.returnPct >= 1000 ? Math.round(r.returnPct).toLocaleString() : r.returnPct.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="text-white font-bold mb-3">What could you do with {fmt(calc.finalValue)} today?</h2>
                <div className="space-y-2 text-[#a8a8b3] text-sm">
                  <p>🏠 Buy <span className="text-white font-semibold">{(calc.finalValue / calc.medianHome).toFixed(1)}</span> median US homes (at ${calc.medianHome.toLocaleString()} each)</p>
                  <p>💼 Cover <span className="text-white font-semibold">{(calc.finalValue / calc.avgSalary).toFixed(1)}</span> years of average US salary (${calc.avgSalary.toLocaleString()}/yr)</p>
                </div>
              </div>

              <p className="text-xs text-[#a8a8b3]">Multipliers are approximate historical estimates for educational purposes only. Actual returns varied based on exact purchase date and dividends. This is not investment advice. Past performance does not guarantee future results.</p>
            </div>
          )}

          <ShareButtons
            text={shareText}
            url="https://www.dayblip.com/finance/what-if-i-invested"
            title="What If I Had Invested Calculator"
          />

          <RelatedTools tools={[
            { emoji: "📈", title: "Compound Interest", desc: "Watch your money grow over time", href: "/finance/compound-interest" },
            { emoji: "⏱️", title: "Market Timing Cost", desc: "What missing the 10 best days costs", href: "/tools/market-timing" },
            { emoji: "🆓", title: "FI Date Calculator", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
            { emoji: "📊", title: "Stock Return", desc: "Calculate your investment return", href: "/finance/stock-return" },
          ]} />
        </div>
      </section>
    </div>
  )
}
