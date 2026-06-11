"use client"

import { useState, useEffect, useCallback } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Country data ───────────────────────────────────────────────────────────────

interface Country {
  name: string
  code: string   // ISO currency code
  symbol: string // display symbol or code
  region: string
}

const COUNTRIES: Country[] = [
  // North America & Caribbean
  { name: "Mexico",                code: "MXN", symbol: "MX$",  region: "North America & Caribbean" },
  { name: "Guatemala",             code: "GTQ", symbol: "Q",    region: "North America & Caribbean" },
  { name: "Honduras",              code: "HNL", symbol: "L",    region: "North America & Caribbean" },
  { name: "El Salvador",           code: "USD", symbol: "$",    region: "North America & Caribbean" },
  { name: "Dominican Republic",    code: "DOP", symbol: "RD$",  region: "North America & Caribbean" },
  { name: "Jamaica",               code: "JMD", symbol: "J$",   region: "North America & Caribbean" },
  { name: "Haiti",                 code: "HTG", symbol: "G",    region: "North America & Caribbean" },
  { name: "Costa Rica",            code: "CRC", symbol: "₡",   region: "North America & Caribbean" },
  { name: "Panama",                code: "PAB", symbol: "B/.",  region: "North America & Caribbean" },
  { name: "Nicaragua",             code: "NIO", symbol: "C$",   region: "North America & Caribbean" },
  { name: "Trinidad and Tobago",   code: "TTD", symbol: "TT$",  region: "North America & Caribbean" },
  // South America
  { name: "Brazil",                code: "BRL", symbol: "R$",   region: "South America" },
  { name: "Colombia",              code: "COP", symbol: "COP$", region: "South America" },
  { name: "Peru",                  code: "PEN", symbol: "S/.",  region: "South America" },
  { name: "Ecuador",               code: "USD", symbol: "$",    region: "South America" },
  { name: "Bolivia",               code: "BOB", symbol: "Bs",   region: "South America" },
  { name: "Paraguay",              code: "PYG", symbol: "₲",   region: "South America" },
  { name: "Uruguay",               code: "UYU", symbol: "$U",   region: "South America" },
  { name: "Chile",                 code: "CLP", symbol: "CL$",  region: "South America" },
  { name: "Argentina",             code: "ARS", symbol: "AR$",  region: "South America" },
  // Europe
  { name: "United Kingdom",        code: "GBP", symbol: "£",    region: "Europe" },
  { name: "European Union",        code: "EUR", symbol: "€",    region: "Europe" },
  { name: "Switzerland",           code: "CHF", symbol: "CHF",  region: "Europe" },
  { name: "Poland",                code: "PLN", symbol: "zł",   region: "Europe" },
  { name: "Czech Republic",        code: "CZK", symbol: "Kč",   region: "Europe" },
  { name: "Hungary",               code: "HUF", symbol: "Ft",   region: "Europe" },
  { name: "Romania",               code: "RON", symbol: "lei",  region: "Europe" },
  { name: "Sweden",                code: "SEK", symbol: "kr",   region: "Europe" },
  { name: "Norway",                code: "NOK", symbol: "kr",   region: "Europe" },
  { name: "Denmark",               code: "DKK", symbol: "kr",   region: "Europe" },
  // Middle East
  { name: "United Arab Emirates",  code: "AED", symbol: "AED",  region: "Middle East" },
  { name: "Saudi Arabia",          code: "SAR", symbol: "SAR",  region: "Middle East" },
  { name: "Qatar",                 code: "QAR", symbol: "QAR",  region: "Middle East" },
  { name: "Kuwait",                code: "KWD", symbol: "KWD",  region: "Middle East" },
  { name: "Bahrain",               code: "BHD", symbol: "BHD",  region: "Middle East" },
  { name: "Jordan",                code: "JOD", symbol: "JOD",  region: "Middle East" },
  { name: "Israel",                code: "ILS", symbol: "₪",    region: "Middle East" },
  { name: "Turkey",                code: "TRY", symbol: "₺",    region: "Middle East" },
  { name: "Egypt",                 code: "EGP", symbol: "E£",   region: "Middle East" },
  { name: "Morocco",               code: "MAD", symbol: "MAD",  region: "Middle East" },
  // Asia
  { name: "India",                 code: "INR", symbol: "₹",    region: "Asia" },
  { name: "Philippines",           code: "PHP", symbol: "₱",    region: "Asia" },
  { name: "China",                 code: "CNY", symbol: "¥",    region: "Asia" },
  { name: "Vietnam",               code: "VND", symbol: "₫",    region: "Asia" },
  { name: "Pakistan",              code: "PKR", symbol: "₨",    region: "Asia" },
  { name: "Bangladesh",            code: "BDT", symbol: "৳",    region: "Asia" },
  { name: "Nepal",                 code: "NPR", symbol: "NPR",  region: "Asia" },
  { name: "Indonesia",             code: "IDR", symbol: "Rp",   region: "Asia" },
  { name: "Malaysia",              code: "MYR", symbol: "RM",   region: "Asia" },
  { name: "Thailand",              code: "THB", symbol: "฿",    region: "Asia" },
  { name: "Singapore",             code: "SGD", symbol: "S$",   region: "Asia" },
  { name: "Japan",                 code: "JPY", symbol: "¥",    region: "Asia" },
  { name: "South Korea",           code: "KRW", symbol: "₩",    region: "Asia" },
  { name: "Hong Kong",             code: "HKD", symbol: "HK$",  region: "Asia" },
  { name: "Taiwan",                code: "TWD", symbol: "NT$",  region: "Asia" },
  // Africa
  { name: "Nigeria",               code: "NGN", symbol: "₦",    region: "Africa" },
  { name: "Kenya",                 code: "KES", symbol: "KSh",  region: "Africa" },
  { name: "Ghana",                 code: "GHS", symbol: "GH₵",  region: "Africa" },
  { name: "Tanzania",              code: "TZS", symbol: "TSh",  region: "Africa" },
  { name: "Uganda",                code: "UGX", symbol: "USh",  region: "Africa" },
  { name: "Ethiopia",              code: "ETB", symbol: "Br",   region: "Africa" },
  { name: "Senegal",               code: "XOF", symbol: "CFA",  region: "Africa" },
  { name: "Zambia",                code: "ZMW", symbol: "ZK",   region: "Africa" },
  { name: "South Africa",          code: "ZAR", symbol: "R",    region: "Africa" },
  { name: "Rwanda",                code: "RWF", symbol: "RF",   region: "Africa" },
  // Oceania
  { name: "Australia",             code: "AUD", symbol: "A$",   region: "Oceania" },
  { name: "New Zealand",           code: "NZD", symbol: "NZ$",  region: "Oceania" },
]

const REGIONS = [
  "North America & Caribbean",
  "South America",
  "Europe",
  "Middle East",
  "Asia",
  "Africa",
  "Oceania",
]

// ── Fallback exchange rates (USD base) ────────────────────────────────────────

const FALLBACK_RATES: Record<string, number> = {
  MXN: 17.2,  PHP: 56.8,  INR: 83.5,  GTQ: 7.75,  DOP: 58.5,
  SVC: 8.75,  CNY: 7.24,  NGN: 1580,  VND: 25420, COP: 3950,
  HNL: 24.7,  JMD: 157,   HTG: 132,   BRL: 5.1,   GHS: 15.2,
  KES: 129,   PKR: 278,   BDT: 110,   NPR: 133,   IDR: 15840,
  EGP: 48.5,  MAD: 9.95,  TZS: 2580,  UGX: 3720,  ZMW: 26.8,
  XOF: 612,   ETB: 57.2,  MYR: 4.68,  THB: 35.8,  SGD: 1.35,
  AED: 3.67,  SAR: 3.75,  QAR: 3.64,  KWD: 0.307, BHD: 0.377,
  JOD: 0.709, GBP: 0.79,  EUR: 0.93,  CAD: 1.36,  AUD: 1.55,
  CHF: 0.90,  JPY: 149,   KRW: 1340,  HKD: 7.82,  NZD: 1.64,
  ZAR: 18.6,  TRY: 32.4,  TWD: 32.1,  CZK: 23.1,  PLN: 4.02,
  HUF: 358,   RON: 4.68,  SEK: 10.4,  NOK: 10.8,  DKK: 6.94,
  ILS: 3.72,  PEN: 3.72,  BOB: 6.91,  PYG: 7300,  UYU: 39.5,
  CLP: 940,   ARS: 900,   CRC: 520,   PAB: 1.0,   NIO: 36.5,
  TTD: 6.79,  USD: 1.0,   XAF: 612,   RWF: 1285,
}

// ── Service definitions ────────────────────────────────────────────────────────

interface ServiceDef {
  name: string
  emoji: string
  fee: (amount: number) => number
  fxMarkupPct: number
  speedStandard: string
  speedExpress: string
}

const SERVICES: ServiceDef[] = [
  {
    name: "Wise",
    emoji: "🟢",
    fee: (a) => Math.max(0.50, a * 0.009),
    fxMarkupPct: 0.005,
    speedStandard: "1-2 business days",
    speedExpress: "Same day (extra fee)",
  },
  {
    name: "Remitly",
    emoji: "🔵",
    fee: (a) => a < 500 ? 3.99 : 2.99,
    fxMarkupPct: 0.015,
    speedStandard: "3-5 business days",
    speedExpress: "Minutes (+$2)",
  },
  {
    name: "Western Union",
    emoji: "🟡",
    fee: (a) => a <= 200 ? 4.99 : a <= 500 ? 9.99 : 14.99,
    fxMarkupPct: 0.025,
    speedStandard: "1-3 business days",
    speedExpress: "Minutes (extra fee)",
  },
  {
    name: "MoneyGram",
    emoji: "🟠",
    fee: () => 1.99,
    fxMarkupPct: 0.03,
    speedStandard: "1-3 business days",
    speedExpress: "Minutes",
  },
  {
    name: "PayPal / Xoom",
    emoji: "🔷",
    fee: () => 4.99,
    fxMarkupPct: 0.04,
    speedStandard: "1-3 business days",
    speedExpress: "Minutes (via Xoom)",
  },
  {
    name: "Bank Wire",
    emoji: "🏦",
    fee: () => 35,
    fxMarkupPct: 0.035,
    speedStandard: "3-5 business days",
    speedExpress: "Not available",
  },
]

// ── Calculation types ──────────────────────────────────────────────────────────

interface ServiceResult {
  name: string
  emoji: string
  statementFee: number
  fxMarkupPct: number
  fxMarkupAmt: number
  totalCostUSD: number
  recipientGets: number
  effectiveRate: number
  speedStandard: string
  speedExpress: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtRecipient(n: number, symbol: string): string {
  const rounded = n >= 10000 ? Math.round(n) : Math.round(n * 10) / 10
  return `${symbol}${rounded.toLocaleString("en-US")}`
}

function fmtRate(rate: number): string {
  if (rate >= 100) return rate.toLocaleString("en-US", { maximumFractionDigits: 0 })
  if (rate >= 10) return rate.toLocaleString("en-US", { maximumFractionDigits: 2 })
  return rate.toLocaleString("en-US", { maximumFractionDigits: 4 })
}

function calcResults(amount: number, liveRate: number): ServiceResult[] {
  return SERVICES.map((svc) => {
    const fee = svc.fee(amount)
    const fxMarkupAmt = amount * svc.fxMarkupPct
    const totalCostUSD = fee + fxMarkupAmt
    const effectiveRate = liveRate * (1 - svc.fxMarkupPct)
    const recipientGets = (amount - fee) * effectiveRate
    return {
      name: svc.name,
      emoji: svc.emoji,
      statementFee: fee,
      fxMarkupPct: svc.fxMarkupPct,
      fxMarkupAmt,
      totalCostUSD,
      recipientGets,
      effectiveRate,
      speedStandard: svc.speedStandard,
      speedExpress: svc.speedExpress,
    }
  }).sort((a, b) => b.recipientGets - a.recipientGets) // most received = best
}

// ── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#1a1a2e",
  border: "1px solid #0f3460",
  borderRadius: 6,
  padding: "10px 12px",
  color: "#ffffff",
  fontSize: 15,
  boxSizing: "border-box",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#a8a8b3",
  marginBottom: 6,
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MoneyTransferComparisonPage() {
  const [amount, setAmount]         = useState("500")
  const [countryName, setCountryName] = useState("Mexico")
  const [speed, setSpeed]           = useState("standard")
  const [rates, setRates]           = useState<Record<string, number>>(FALLBACK_RATES)
  const [rateDate, setRateDate]     = useState<string | null>(null)
  const [rateError, setRateError]   = useState(false)

  // Fetch live rates on mount
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data: { rates?: Record<string, number>; time_last_update_utc?: string }) => {
        if (data.rates) {
          setRates({ ...FALLBACK_RATES, ...data.rates })
          if (data.time_last_update_utc) {
            const d = new Date(data.time_last_update_utc)
            setRateDate(d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
          }
        } else {
          setRateError(true)
        }
      })
      .catch(() => setRateError(true))
  }, [])

  const amountNum = Math.max(0, parseFloat(amount) || 0)
  const country   = COUNTRIES.find((c) => c.name === countryName) ?? COUNTRIES[0]
  const liveRate  = rates[country.code] ?? 1

  const results = useCallback(() => {
    if (amountNum < 1) return []
    return calcResults(amountNum, liveRate)
  }, [amountNum, liveRate, country])()

  const best  = results[0]
  const worst = results[results.length - 1]
  const wuResult = results.find((r) => r.name === "Western Union")

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Money Transfer Comparison Calculator",
          "Compare Wise Western Union Remitly PayPal and MoneyGram for any amount to 60 countries. See true total cost including exchange rate markup.",
          "https://www.dayblip.com/tools/money-transfer-comparison",
          "FinanceApplication"
        ),
        faqSchema([
          {
            question: "What is the cheapest way to send money internationally?",
            answer: "Wise (formerly TransferWise) is consistently the cheapest service for international money transfers, using the real mid-market exchange rate with transparent fees averaging 0.5-1.5% of the transfer amount. Remitly is also competitive for many corridors. Western Union, MoneyGram, and bank wire transfers are typically the most expensive due to exchange rate markups of 2-4% above mid-market rate in addition to stated fees.",
          },
          {
            question: "What is a hidden transfer fee?",
            answer: "Most money transfer services make their real profit on the exchange rate markup — charging a rate worse than the real mid-market rate. A service advertising zero fees often charges 3-5% in exchange rate markup. On a $1,000 transfer a 3% markup costs $30 regardless of the stated fee. The true cost of any transfer is the stated fee plus exchange rate markup combined.",
          },
          {
            question: "How do I compare money transfer services?",
            answer: "Compare money transfer services by looking at two things: the stated transfer fee and the exchange rate offered versus the real mid-market rate. The mid-market rate is the rate shown on Google or XE.com. Any rate worse than that is an exchange rate markup — a hidden fee. Add the transfer fee and the exchange rate markup together to get the true total cost.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Money Transfer Comparison", url: "https://www.dayblip.com/tools/money-transfer-comparison" },
        ]),
      ]} />

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💱</div>
        <h1 style={{ color: "#fff", fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, lineHeight: 1.2, maxWidth: 760, margin: "0 auto 16px" }}>
          Money Transfer Comparison — Find the Cheapest Way to Send Money Internationally
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 16, maxWidth: 580, margin: "0 auto" }}>
          Live exchange rates · 60 countries · True total cost including hidden FX markup · No signup
        </p>
      </div>

      {/* Body wrapper */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 0" }}>
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Money Transfer Comparison" },
        ]} />

        {/* Quick answer */}
        <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ color: "#e94560", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            QUICK ANSWER
          </div>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Sending $500 to Mexico via Western Union costs approximately $9.99 in fees plus a 2.5% exchange rate markup
            totaling about $22 in real cost. The same transfer via Wise costs about $4.50 in fees with near-zero
            exchange rate markup — a total saving of $17. On $500 monthly to family abroad that difference saves
            $204 per year.
          </p>
        </div>

        <p style={{ color: "#a8a8b3", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          International money transfers have two costs: the stated transfer fee and the hidden exchange rate markup.
          Most services show a low fee but profit on the exchange rate by charging 2-5% above the real market rate.
          This calculator shows true total cost including both. Live exchange rates are updated daily.
        </p>
      </div>

      {/* Calculator */}
      <div style={{ background: "#16213e", padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
              Compare Transfer Costs
            </h2>
            {/* Live rate indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: rateError ? "#F9A825" : "#22c55e", display: "inline-block" }} />
              <span style={{ color: "#a8a8b3", fontSize: 12 }}>
                {rateError
                  ? "Using fallback rates"
                  : rateDate
                    ? `Rates updated ${rateDate}`
                    : "Loading live rates…"}
              </span>
            </div>
          </div>

          {/* Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle} htmlFor="mtc-amount">Amount to send ($)</label>
              <input
                id="mtc-amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={inputStyle}
                placeholder="500"
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="mtc-country">Send to</label>
              <select
                id="mtc-country"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                style={inputStyle}
              >
                {REGIONS.map((region) => (
                  <optgroup key={region} label={region}>
                    {COUNTRIES.filter((c) => c.region === region).map((c) => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle} htmlFor="mtc-speed">Delivery speed</label>
              <select
                id="mtc-speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                style={inputStyle}
              >
                <option value="standard">Standard (1-5 business days)</option>
                <option value="express">Express (same day or next day)</option>
              </select>
            </div>
          </div>

          {/* Live rate display */}
          {amountNum >= 1 && (
            <div style={{ background: "#1a1a2e", border: "1px solid #0f3460", borderRadius: 8, padding: "10px 16px", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ color: "#4FC3F7", fontSize: 13, fontWeight: 600 }}>
                Live rate: $1 USD = {fmtRate(liveRate)} {country.code}
              </span>
              <span style={{ color: "#0f3460", fontSize: 16 }}>|</span>
              <span style={{ color: "#a8a8b3", fontSize: 13 }}>
                Mid-market · services charge above this
              </span>
            </div>
          )}

          {/* Results — live, no button needed */}
          {amountNum >= 1 && results.length > 0 && (
            <div>
              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
                {/* Best deal card */}
                <div style={{ background: "#0d2a1a", border: "1px solid #22c55e", borderRadius: 12, padding: "16px 20px" }}>
                  <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                    🏆 Best Deal
                  </div>
                  <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{best?.name}</div>
                  <div style={{ color: "#a8a8b3", fontSize: 13, marginTop: 4 }}>
                    Recipient gets:{" "}
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>
                      {best ? fmtRecipient(best.recipientGets, country.symbol) : "—"} {country.code}
                    </span>
                  </div>
                  <div style={{ color: "#a8a8b3", fontSize: 13, marginTop: 2 }}>
                    Your total cost:{" "}
                    <span style={{ color: "#e8e8e8", fontWeight: 600 }}>
                      {best ? fmtUSD(best.totalCostUSD) : "—"}
                    </span>
                  </div>
                </div>

                {/* You save card */}
                {best && worst && (
                  <div style={{ background: "#1e2d4a", border: "1px solid #0f3460", borderRadius: 12, padding: "16px 20px" }}>
                    <div style={{ color: "#F9A825", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                      💰 You Save
                    </div>
                    <div style={{ color: "#a8a8b3", fontSize: 13 }}>
                      Using {best.name} vs {worst.name}
                    </div>
                    <div style={{ color: "#F9A825", fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                      {fmtUSD(worst.totalCostUSD - best.totalCostUSD)}
                    </div>
                    <div style={{ color: "#a8a8b3", fontSize: 13, marginTop: 2 }}>
                      per transfer ·{" "}
                      <span style={{ color: "#F9A825", fontWeight: 600 }}>
                        {fmtUSD((worst.totalCostUSD - best.totalCostUSD) * 12)}
                      </span>{" "}
                      per year if monthly
                    </div>
                  </div>
                )}
              </div>

              {/* Results heading */}
              <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
                Sending {fmtUSD(amountNum)} to {country.name} — sorted by most received
              </h3>

              {/* Service rows */}
              {results.map((svc, idx) => {
                const isBest  = idx === 0
                const isWorst = idx === results.length - 1
                const savingsVsWU = wuResult && svc.recipientGets > (wuResult.recipientGets) && svc.name !== "Western Union"
                  ? svc.recipientGets - wuResult.recipientGets
                  : null

                return (
                  <div
                    key={svc.name}
                    style={{
                      background: isBest ? "#0d2a1a" : isWorst ? "#2a0d0d" : "#1a1a2e",
                      border: `1px solid ${isBest ? "#22c55e" : isWorst ? "#e94560" : "#0f3460"}`,
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 10,
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                      <span style={{
                        background: isBest ? "#F9A825" : isWorst ? "#e94560" : "#0f3460",
                        color: isBest ? "#000" : "#fff",
                        fontSize: 11, fontWeight: 800,
                        padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
                      }}>
                        #{idx + 1}{isBest ? " Best ✅" : isWorst ? " Most expensive" : ""}
                      </span>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
                        {svc.name}
                      </span>
                      <span style={{ color: "#a8a8b3", fontSize: 12, marginLeft: "auto" }}>
                        {speed === "express" ? svc.speedExpress : svc.speedStandard}
                      </span>
                    </div>

                    {/* Data grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>Recipient gets</div>
                        <div style={{ color: isBest ? "#22c55e" : "#e8e8e8", fontWeight: 700, fontSize: 16 }}>
                          {fmtRecipient(svc.recipientGets, country.symbol)} {country.code}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>Transfer fee</div>
                        <div style={{ color: "#e8e8e8", fontWeight: 600 }}>{fmtUSD(svc.statementFee)}</div>
                      </div>
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>FX markup</div>
                        <div style={{ color: svc.fxMarkupPct === 0 ? "#22c55e" : "#e8e8e8", fontWeight: 600 }}>
                          {(svc.fxMarkupPct * 100).toFixed(1)}%
                          <span style={{ color: "#a8a8b3", fontWeight: 400, fontSize: 13 }}>
                            {" "}(+{fmtUSD(svc.fxMarkupAmt)})
                          </span>
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>Total cost</div>
                        <div style={{ color: isBest ? "#22c55e" : isWorst ? "#e94560" : "#fff", fontWeight: 700, fontSize: 16 }}>
                          {fmtUSD(svc.totalCostUSD)}
                        </div>
                      </div>
                    </div>

                    {savingsVsWU !== null && (
                      <div style={{ marginTop: 8, color: "#4FC3F7", fontSize: 13 }}>
                        Recipient gets {fmtRecipient(savingsVsWU, country.symbol)} {country.code} more than via Western Union
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Monthly savings */}
              {best && worst && (
                <div style={{ background: "#1e2d4a", borderRadius: 12, padding: 20, marginTop: 8 }}>
                  <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                    If you send {fmtUSD(amountNum)} every month
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Cheapest option</div>
                      <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 18 }}>{fmtUSD(best.totalCostUSD)}/transfer</div>
                      <div style={{ color: "#a8a8b3", fontSize: 12 }}>{best.name}</div>
                    </div>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Most expensive option</div>
                      <div style={{ color: "#e94560", fontWeight: 700, fontSize: 18 }}>{fmtUSD(worst.totalCostUSD)}/transfer</div>
                      <div style={{ color: "#a8a8b3", fontSize: 12 }}>{worst.name}</div>
                    </div>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Monthly savings</div>
                      <div style={{ color: "#F9A825", fontWeight: 700, fontSize: 18 }}>{fmtUSD(worst.totalCostUSD - best.totalCostUSD)}/mo</div>
                    </div>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Annual savings</div>
                      <div style={{ color: "#F9A825", fontWeight: 700, fontSize: 18 }}>{fmtUSD((worst.totalCostUSD - best.totalCostUSD) * 12)}/yr</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div style={{ background: "#16213e", borderRadius: 10, padding: 16, marginTop: 16 }}>
                <p style={{ color: "#a8a8b3", fontSize: 13, margin: "0 0 8px", lineHeight: 1.6 }}>
                  Transfer fees and exchange rate markups shown are approximate 2026 estimates for
                  educational comparison. Actual rates vary by amount, country, payment method, and
                  promotional pricing. Always verify current rates directly before transferring.
                </p>
                <p style={{ color: "#e94560", fontSize: 13, fontWeight: 700, margin: 0 }}>
                  All service names are for comparison only. No affiliate links. No links to any service provided.
                </p>
              </div>
            </div>
          )}

          {amountNum < 1 && (
            <div style={{ textAlign: "center", color: "#a8a8b3", fontSize: 15, padding: "24px 0" }}>
              Enter an amount above to see live comparison results.
            </div>
          )}
        </div>
      </div>

      {/* Share + Related */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 48px" }}>
        <ShareButtons
          text="Sending $500 internationally with the wrong service costs $19 more than the cheapest option. That is $228 per year on $500 monthly transfers. Compare transfer costs free:"
          url="https://www.dayblip.com/tools/money-transfer-comparison"
          title="Money Transfer Comparison Calculator"
        />

        <div style={{ marginTop: 40 }}>
          <RelatedTools tools={[
            { emoji: "💱", title: "Currency Converter",       desc: "Live exchange rates for 150+ currencies",  href: "/tools/currency-converter" },
            { emoji: "🏙️", title: "Cost of Living Comparison", desc: "Compare costs between US cities",          href: "/finance/cost-of-living" },
            { emoji: "💰", title: "Take Home Pay Calculator",  desc: "Your actual paycheck after taxes",         href: "/finance/take-home-pay" },
            { emoji: "📊", title: "True Hourly Wage",         desc: "What your job really pays per hour",       href: "/tools/true-hourly-wage" },
          ]} />
        </div>
      </div>
    </div>
  )
}
