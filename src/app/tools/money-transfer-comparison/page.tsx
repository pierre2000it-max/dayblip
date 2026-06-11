"use client"

import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

interface ServiceResult {
  name: string
  fee: number
  fxMarkupPct: number
  fxMarkupAmt: number
  totalCost: number
  available: boolean
}

const COUNTRIES = [
  "Mexico",
  "Philippines",
  "India",
  "Guatemala",
  "Dominican Republic",
  "El Salvador",
  "China",
  "Nigeria",
  "Vietnam",
  "Colombia",
  "Honduras",
  "Jamaica",
  "Haiti",
  "Brazil",
  "Ghana",
  "Kenya",
  "Pakistan",
  "Bangladesh",
  "Nepal",
  "Indonesia",
]

function fmt2(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%"
}

function calcServices(amount: number): ServiceResult[] {
  const wiseFee = amount * 0.009
  const wise: ServiceResult = {
    name: "Wise",
    fee: wiseFee,
    fxMarkupPct: 0,
    fxMarkupAmt: 0,
    totalCost: wiseFee,
    available: true,
  }

  const remitlyFee = amount < 1000 ? 2.99 : 1.99
  const remitlyMarkup = amount * 0.015
  const remitly: ServiceResult = {
    name: "Remitly",
    fee: remitlyFee,
    fxMarkupPct: 0.015,
    fxMarkupAmt: remitlyMarkup,
    totalCost: remitlyFee + remitlyMarkup,
    available: true,
  }

  const wuFee = amount <= 200 ? 4.99 : amount <= 500 ? 9.99 : 14.99
  const wuMarkup = amount * 0.025
  const westernUnion: ServiceResult = {
    name: "Western Union",
    fee: wuFee,
    fxMarkupPct: 0.025,
    fxMarkupAmt: wuMarkup,
    totalCost: wuFee + wuMarkup,
    available: true,
  }

  const mgMarkup = amount * 0.03
  const moneygram: ServiceResult = {
    name: "MoneyGram",
    fee: 1.99,
    fxMarkupPct: 0.03,
    fxMarkupAmt: mgMarkup,
    totalCost: 1.99 + mgMarkup,
    available: true,
  }

  const ppFee = Math.min(4.99, Math.max(0.99, amount * 0.05))
  const ppMarkup = amount * 0.04
  const paypal: ServiceResult = {
    name: "PayPal",
    fee: ppFee,
    fxMarkupPct: 0.04,
    fxMarkupAmt: ppMarkup,
    totalCost: ppFee + ppMarkup,
    available: true,
  }

  const bankMarkup = amount * 0.035
  const bankWire: ServiceResult = {
    name: "Bank Wire",
    fee: 35,
    fxMarkupPct: 0.035,
    fxMarkupAmt: bankMarkup,
    totalCost: 35 + bankMarkup,
    available: true,
  }

  return [wise, remitly, westernUnion, moneygram, paypal, bankWire].sort(
    (a, b) => a.totalCost - b.totalCost
  )
}

const inputClass =
  "w-full rounded-md px-3 py-[10px] bg-[#1a1a2e] border border-[#0f3460] text-white placeholder-[#a8a8b3] focus:outline-none focus:border-[#4FC3F7] transition-colors"

const labelClass = "block text-sm font-medium text-[#a8a8b3] mb-1"

export default function MoneyTransferComparisonPage() {
  const [amount, setAmount] = useState<string>("500")
  const [country, setCountry] = useState<string>("Mexico")
  const [delivery, setDelivery] = useState<string>("bank")
  const [calculated, setCalculated] = useState<boolean>(false)
  const [results, setResults] = useState<ServiceResult[]>([])

  const amountNum = useMemo(() => {
    const n = parseFloat(amount)
    return isNaN(n) || n < 1 ? 0 : n
  }, [amount])

  function handleCompare() {
    if (amountNum < 1) return
    setResults(calcServices(amountNum))
    setCalculated(true)
  }

  const cheapest = results[0]
  const mostExpensive = results[results.length - 1]
  const westernUnionResult = results.find((r) => r.name === "Western Union")

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          webApplicationSchema(
            "Money Transfer Comparison Calculator",
            "Compare the cheapest way to send money internationally including total fees and exchange rate markup",
            "https://www.dayblip.com/tools/money-transfer-comparison",
            "FinanceApplication"
          ),
          faqSchema([
            {
              question: "What is the cheapest way to send money internationally?",
              answer:
                "Wise (formerly TransferWise) is consistently the cheapest service for international money transfers using the real mid-market exchange rate with low transparent fees averaging 0.5-1.5% of the transfer amount. Remitly is also competitive for many corridors. Western Union MoneyGram and bank wire transfers are typically the most expensive due to exchange rate markups of 2-4% above mid-market rate in addition to stated fees.",
            },
            {
              question: "What is a hidden transfer fee?",
              answer:
                "Most money transfer services make their real profit on the exchange rate markup — charging a rate worse than the real mid-market rate. A service advertising zero fees often charges 3-5% in exchange rate markup. On a $1,000 transfer a 3% markup costs $30 regardless of the stated fee. The true cost of any transfer is stated fee plus exchange rate markup combined.",
            },
          ]),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com" },
            { name: "Tools", url: "https://www.dayblip.com/tools" },
            {
              name: "Money Transfer Comparison",
              url: "https://www.dayblip.com/tools/money-transfer-comparison",
            },
          ]),
        ]}
      />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>💱</div>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.2,
            maxWidth: 760,
            margin: "0 auto 16px",
          }}
        >
          Money Transfer Comparison — Find the Cheapest Way to Send Money Internationally
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          See true total cost including hidden exchange rate markups — no signup required
        </p>
      </div>

      {/* Body */}
      <div
        className="bg-[#1a1a2e] px-6 py-8"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Money Transfer Comparison" },
          ]}
        />

        {/* Quick answer */}
        <div
          style={{
            background: "#1e2d4a",
            borderLeft: "4px solid #e94560",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "#e94560",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            QUICK ANSWER
          </div>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Sending $500 to Mexico via Western Union costs approximately $9.99 in fees plus a 2-3%
            exchange rate markup totaling $19-24 in real cost. The same transfer via Wise costs
            $4.50 in fees with near-zero exchange rate markup totaling $4.50-5 real cost. The
            difference on $500 is $15-19. On $2,000 per month that saves $60-76 every single month.
          </p>
        </div>

        <p style={{ color: "#a8a8b3", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          International money transfers have two costs: the stated transfer fee and the hidden
          exchange rate markup. Most services show a low fee but make their real profit on the
          exchange rate — charging 2-5% above the real mid-market rate. This calculator shows the
          TRUE total cost of any transfer including both fees and the exchange rate difference from
          mid-market rate.
        </p>
      </div>

      {/* Calculator */}
      <div className="bg-[#16213e] px-6 py-12">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            Compare Transfer Costs
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <label className={labelClass} htmlFor="amount">
                Amount to send ($)
              </label>
              <input
                id="amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
                placeholder="500"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="country">
                To country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="delivery">
                Delivery method
              </label>
              <select
                id="delivery"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className={inputClass}
              >
                <option value="bank">Bank deposit (cheapest)</option>
                <option value="wallet">Mobile wallet</option>
                <option value="cash">Cash pickup</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={amountNum < 1}
            style={{
              background: amountNum < 1 ? "#555" : "#e94560",
              color: "white",
              padding: "12px 32px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: amountNum < 1 ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            Compare Transfer Costs →
          </button>

          {/* Results */}
          {calculated && results.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                Results for sending {fmt2(amountNum)} to {country}
              </h3>

              {results.map((svc, idx) => {
                const isCheapest = idx === 0
                const savingsVsWU =
                  westernUnionResult && svc.totalCost < westernUnionResult.totalCost
                    ? westernUnionResult.totalCost - svc.totalCost
                    : null

                return (
                  <div
                    key={svc.name}
                    style={{
                      background: isCheapest ? "#0d2a1a" : "#1a1a2e",
                      border: `1px solid ${isCheapest ? "#22c55e" : "#0f3460"}`,
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      {isCheapest ? (
                        <span
                          style={{
                            background: "#F9A825",
                            color: "#000",
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: 20,
                            whiteSpace: "nowrap",
                          }}
                        >
                          #1 Best ✅
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#0f3460",
                            color: "#a8a8b3",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          #{idx + 1}
                        </span>
                      )}
                      <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 17 }}>
                        {svc.name}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>
                          Transfer Fee
                        </div>
                        <div style={{ color: "#e8e8e8", fontWeight: 600 }}>
                          {fmt2(svc.fee)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>
                          Exchange Rate Markup
                        </div>
                        <div style={{ color: "#e8e8e8", fontWeight: 600 }}>
                          {fmtPct(svc.fxMarkupPct)}{" "}
                          <span style={{ color: "#a8a8b3", fontWeight: 400, fontSize: 13 }}>
                            (+{fmt2(svc.fxMarkupAmt)})
                          </span>
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "#a8a8b3", fontSize: 12, marginBottom: 2 }}>
                          Total Cost
                        </div>
                        <div
                          style={{
                            color: isCheapest ? "#22c55e" : "#ffffff",
                            fontWeight: 700,
                            fontSize: 17,
                          }}
                        >
                          {fmt2(svc.totalCost)}
                        </div>
                      </div>
                    </div>

                    {savingsVsWU !== null && (
                      <div style={{ marginTop: 8, color: "#4FC3F7", fontSize: 13 }}>
                        You save {fmt2(savingsVsWU)} vs Western Union
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Monthly savings */}
              {cheapest && mostExpensive && (
                <div
                  style={{
                    background: "#1e2d4a",
                    borderRadius: 12,
                    padding: 20,
                    marginTop: 24,
                  }}
                >
                  <h4
                    style={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    If you send {fmt2(amountNum)} every month:
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Cheapest option</div>
                      <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 18 }}>
                        {fmt2(cheapest.totalCost)}/transfer
                      </div>
                      <div style={{ color: "#a8a8b3", fontSize: 12 }}>{cheapest.name}</div>
                    </div>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Most expensive option</div>
                      <div style={{ color: "#e94560", fontWeight: 700, fontSize: 18 }}>
                        {fmt2(mostExpensive.totalCost)}/transfer
                      </div>
                      <div style={{ color: "#a8a8b3", fontSize: 12 }}>{mostExpensive.name}</div>
                    </div>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Monthly savings</div>
                      <div style={{ color: "#F9A825", fontWeight: 700, fontSize: 18 }}>
                        {fmt2(mostExpensive.totalCost - cheapest.totalCost)}/month
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#a8a8b3", fontSize: 13 }}>Annual savings</div>
                      <div style={{ color: "#F9A825", fontWeight: 700, fontSize: 18 }}>
                        {fmt2((mostExpensive.totalCost - cheapest.totalCost) * 12)}/year
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div
                style={{
                  background: "#16213e",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 24,
                }}
              >
                <p style={{ color: "#a8a8b3", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  Transfer costs and exchange rates change frequently. These are approximate 2026
                  estimates for comparison purposes. Always verify current rates on each
                  provider&apos;s website before transferring. Wise, Remitly, and other services are
                  independent companies not affiliated with Dayblip.
                </p>
                <p
                  style={{
                    color: "#e94560",
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 10,
                    marginBottom: 0,
                  }}
                >
                  All service names shown are for comparison only. No links to any service are
                  provided.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share + Related */}
      <div className="bg-[#1a1a2e] px-6 py-8" style={{ maxWidth: 900, margin: "0 auto" }}>
        <ShareButtons
          text="Sending $500 internationally with the wrong service costs $19 more than the cheapest option. That is $228 per year on $500 monthly transfers. Compare transfer costs free:"
          url="https://www.dayblip.com/tools/money-transfer-comparison"
          title="Money Transfer Comparison Calculator"
        />

        <div style={{ marginTop: 40 }}>
          <RelatedTools
            tools={[
              {
                emoji: "💱",
                title: "Currency Converter",
                desc: "Live exchange rates for 150+ currencies",
                href: "/tools/currency-converter",
              },
              {
                emoji: "🏙️",
                title: "Cost of Living Comparison",
                desc: "Compare costs between US cities",
                href: "/finance/cost-of-living",
              },
              {
                emoji: "💰",
                title: "Take Home Pay Calculator",
                desc: "Your actual paycheck after taxes",
                href: "/finance/take-home-pay",
              },
              {
                emoji: "📊",
                title: "True Hourly Wage",
                desc: "What your job really pays per hour",
                href: "/tools/true-hourly-wage",
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
