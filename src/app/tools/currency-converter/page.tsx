"use client"
import { useState, useEffect, useCallback } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Currency list ─────────────────────────────────────────────────────────────

const CURRENCIES: [string, string][] = [
  ["USD", "US Dollar"], ["EUR", "Euro"], ["GBP", "British Pound"],
  ["JPY", "Japanese Yen"], ["CAD", "Canadian Dollar"], ["AUD", "Australian Dollar"],
  ["CHF", "Swiss Franc"], ["CNY", "Chinese Yuan"], ["INR", "Indian Rupee"],
  ["MXN", "Mexican Peso"], ["BRL", "Brazilian Real"], ["KRW", "South Korean Won"],
  ["SGD", "Singapore Dollar"], ["HKD", "Hong Kong Dollar"], ["NOK", "Norwegian Krone"],
  ["SEK", "Swedish Krona"], ["DKK", "Danish Krone"], ["NZD", "New Zealand Dollar"],
  ["ZAR", "South African Rand"], ["AED", "UAE Dirham"], ["SAR", "Saudi Riyal"],
  ["THB", "Thai Baht"], ["PHP", "Philippine Peso"], ["IDR", "Indonesian Rupiah"],
  ["TRY", "Turkish Lira"],
]

const FALLBACK: Record<string, number> = {
  USD: 1, EUR: 0.93, GBP: 0.79, JPY: 149, CAD: 1.36, AUD: 1.55,
  CHF: 0.90, CNY: 7.24, INR: 83.5, MXN: 17.2, BRL: 5.1, KRW: 1320,
  SGD: 1.34, HKD: 7.82, NOK: 10.5, SEK: 10.4, DKK: 6.89, NZD: 1.63,
  ZAR: 18.4, AED: 3.67, SAR: 3.75, THB: 35.1, PHP: 56.2, IDR: 15700, TRY: 32.1,
}

const QUICK_PAIRS = [
  ["USD", "EUR"], ["USD", "GBP"], ["USD", "JPY"],
  ["USD", "CAD"], ["USD", "AUD"], ["EUR", "USD"],
  ["GBP", "USD"], ["EUR", "GBP"],
] as const

export default function CurrencyConverterPage() {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [amount, setAmount] = useState("100")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("EUR")

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(data => {
        if (data?.rates) {
          setRates(data.rates)
          setRateDate(data.time_last_update_utc ?? null)
        }
      })
      .catch(() => { /* use fallback */ })
      .finally(() => setLoading(false))
  }, [])

  const convert = useCallback((amt: number, f: string, t: string) => {
    const usd = amt / (rates[f] ?? 1)
    return usd * (rates[t] ?? 1)
  }, [rates])

  const parsed = parseFloat(amount) || 0
  const result = convert(parsed, from, to)
  const rate = convert(1, from, to)
  const inverse = convert(1, to, from)

  function fmt(n: number, code: string): string {
    if (code === "JPY" || code === "KRW" || code === "IDR") return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  }

  const shareText = `Quick currency conversion: $${amount} USD = ${fmt(result, to)} ${to} today. Free live converter — no signup: www.dayblip.com/tools/currency-converter`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Currency Converter", "Convert between 150+ currencies with live exchange rates", "https://www.dayblip.com/tools/currency-converter", "FinanceApplication"),
        faqSchema([
          { question: "What is today's USD to EUR exchange rate?", answer: "The US Dollar to Euro exchange rate fluctuates daily. As of mid-2026 one US Dollar equals approximately 0.93 Euros. Exchange rates change based on Federal Reserve and European Central Bank decisions, economic data releases and market conditions. Always check live rates before making transfers." },
          { question: "Why is the currency converter rate different from my bank?", answer: "This converter shows the mid-market rate — the midpoint between buy and sell rates. Banks and transfer services add a markup called a spread typically 1-3% above mid-market rate. This is how they make money on currency exchange. Services like Wise often offer rates closer to mid-market." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Currency Converter", url: "https://www.dayblip.com/tools/currency-converter" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Currency Converter — Live Exchange Rates</h1>
          <p className="text-[#a8a8b3]">{loading ? "Loading live rates…" : rateDate ? `Rates updated: ${new Date(rateDate).toLocaleDateString()}` : "Using reference rates"}</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Currency Converter" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>One US Dollar equals approximately 0.93 Euros, 0.79 British Pounds, 149 Japanese Yen, 1.36 Canadian Dollars and 1.55 Australian Dollars as of mid-2026. Exchange rates change every business day based on central bank decisions, economic data and global trade activity. Always check current rates before making international transfers.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Currency exchange rates represent the price of one currency in terms of another. Rates fluctuate constantly based on interest rate decisions by central banks, economic indicators, political events and market sentiment. This converter uses live rates from the ExchangeRate-API free tier which updates daily. For large transfers always verify rates with your bank or transfer service.</p>

          {/* Quick pair buttons */}
          <div>
            <div className="mb-2 text-xs font-semibold text-[#a8a8b3] uppercase tracking-wider">Quick pairs</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PAIRS.map(([f, t]) => (
                <button key={`${f}-${t}`} onClick={() => { setFrom(f); setTo(t) }}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{ background: from === f && to === t ? "#e94560" : "#1a1a2e", color: from === f && to === t ? "#fff" : "#a8a8b3", border: "1px solid #0f3460" }}>
                  {f}→{t}
                </button>
              ))}
            </div>
          </div>

          {/* Main converter */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Amount</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-lg text-white focus:border-[#e94560] focus:outline-none" />
            </label>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">From</span>
                <select value={from} onChange={e => setFrom(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
                  {CURRENCIES.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
                </select>
              </label>
              <button onClick={() => { setFrom(to); setTo(from) }}
                className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-[#e94560] text-xl hover:border-[#e94560] transition-colors mb-0.5">
                ⇄
              </button>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">To</span>
                <select value={to} onChange={e => setTo(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-2.5 text-white focus:border-[#e94560] focus:outline-none">
                  {CURRENCIES.map(([code, name]) => <option key={code} value={code}>{code} — {name}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
            <div className="text-sm text-[#a8a8b3] mb-2">{amount || "1"} {from} =</div>
            <div className="text-4xl font-black text-[#F9A825]">{fmt(result, to)} <span className="text-2xl">{to}</span></div>
            <div className="mt-4 space-y-1 text-sm text-[#a8a8b3]">
              <div>1 {from} = <span className="text-white font-semibold">{fmt(rate, to)} {to}</span></div>
              <div>1 {to} = <span className="text-white font-semibold">{fmt(inverse, from)} {from}</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-3 text-xs text-[#a8a8b3] text-center">
            Mid-market rate for reference only. Banks and transfer services charge a spread above this rate.
          </div>

          <ShareButtons text={shareText} url="https://www.dayblip.com/tools/currency-converter" title="Currency Converter" />

          <RelatedTools tools={[
            { emoji: "🏙️", title: "Cost of Living Calculator", desc: "Compare costs between US cities", href: "/finance/cost-of-living" },
            { emoji: "🗺️", title: "State Tax Migration", desc: "How much moving states saves you", href: "/tools/tax-migration" },
            { emoji: "💰", title: "Take Home Pay Calculator", desc: "Your actual paycheck after taxes", href: "/finance/take-home-pay" },
            { emoji: "📐", title: "Unit Converter", desc: "Convert metric and imperial units", href: "/tools/unit-converter" },
          ]} />
        </div>
      </section>
    </div>
  )
}
