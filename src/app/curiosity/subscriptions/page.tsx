"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fv(monthly: number, annualRate: number, years: number): number {
  if (monthly <= 0) return 0
  const r = annualRate / 12
  const n = years * 12
  return r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r)
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational & entertainment purposes only.</strong> Not investment advice. Past S&P 500 returns do not guarantee future results.
    Actual returns vary and can be negative. Consult a financial advisor before making investment decisions.
  </div>
)

interface Sub { id: string; emoji: string; name: string; price: number; on: boolean }

const DEFAULTS: Sub[] = [
  { id: "netflix",   emoji: "🎬", name: "Netflix",          price: 22.99, on: true  },
  { id: "disney",    emoji: "🏰", name: "Disney+",          price: 13.99, on: true  },
  { id: "amazon",    emoji: "📦", name: "Amazon Prime",     price: 14.99, on: true  },
  { id: "peacock",   emoji: "🦚", name: "Peacock",          price:  7.99, on: false },
  { id: "hulu",      emoji: "🎭", name: "Hulu",             price: 17.99, on: false },
  { id: "appletv",   emoji: "🍎", name: "Apple TV+",        price:  9.99, on: true  },
  { id: "hbomax",    emoji: "📺", name: "HBO Max",          price: 15.99, on: false },
  { id: "paramount", emoji: "🎥", name: "Paramount+",       price: 11.99, on: false },
  { id: "spotify",   emoji: "🎵", name: "Spotify",          price: 11.99, on: true  },
  { id: "applemus",  emoji: "🎵", name: "Apple Music",      price: 10.99, on: false },
  { id: "audible",   emoji: "📚", name: "Audible",          price: 14.95, on: false },
  { id: "xboxgp",    emoji: "🎮", name: "Xbox Game Pass",   price: 14.99, on: false },
  { id: "psplus",    emoji: "🎮", name: "PlayStation Plus", price: 17.99, on: false },
  { id: "nintendo",  emoji: "🎮", name: "Nintendo Online",  price:  3.99, on: false },
  { id: "gym",       emoji: "💪", name: "Gym Membership",   price: 50.00, on: true  },
  { id: "icloud",    emoji: "☁️", name: "iCloud Storage",   price:  2.99, on: true  },
  { id: "vpn",       emoji: "🔒", name: "VPN Service",      price:  9.99, on: false },
  { id: "news",      emoji: "📰", name: "News Subscription",price: 17.00, on: false },
  { id: "afresh",    emoji: "🛒", name: "Amazon Fresh",     price: 14.99, on: false },
]

export default function SubscriptionsPage() {
  const [subs, setSubs]     = useState<Sub[]>(DEFAULTS)
  const [rate, setRate]     = useState(10.5)
  const [years, setYears]   = useState(20)

  const toggle = (id: string) => setSubs(s => s.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const setPrice = (id: string, v: string) => setSubs(s => s.map(x => x.id === id ? { ...x, price: parseFloat(v) || 0 } : x))

  const r = rate / 100

  const activeSubs   = subs.filter(s => s.on)
  const monthlyTotal = activeSubs.reduce((sum, s) => sum + s.price, 0)
  const annualTotal  = monthlyTotal * 12
  const dailyTotal   = monthlyTotal / 30

  const bigNumber    = fv(monthlyTotal, r, years)
  const totalContrib = monthlyTotal * years * 12
  const growthEarned = bigNumber - totalContrib
  const multiplier   = totalContrib > 0 ? bigNumber / totalContrib : 0

  const subRows = activeSubs.map(s => ({
    ...s,
    annual: s.price * 12,
    spValue: fv(s.price, r, years),
  }))

  const scenarios = [0, 0.25, 0.5, 1].map(cut => {
    const monthly = monthlyTotal * cut
    return { label: cut === 0 ? "Cut nothing" : `Cut ${(cut * 100).toFixed(0)}%`, monthly, value: fv(monthly, r, years) }
  })

  const shareText = `My streaming subscriptions could be worth ${fmt(bigNumber)} if invested instead! Calculate yours (educational only) 👇`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Subscription Cost Calculator — What Could Your Subscriptions Be Worth?</h1>
          <p className="text-[#a8a8b3]">See what your monthly subscriptions would grow to if invested in the S&P 500 instead</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average American spends $273 per month on subscription services including streaming, apps, gym and software. Invested at 7% annual return over 20 years that is $170,000 in lost investment opportunity. Netflix, Spotify, Hulu, Disney Plus and a gym membership alone total $85-120 per month for most households.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Subscription costs are easy to underestimate because each individual charge seems small. This calculator adds up all your subscriptions and shows the true monthly total alongside what that money would be worth over time if invested instead. Educational only — not financial advice.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          {DISCLAIMER}

          {/* Subscription tiles */}
          <div>
            <h2 className="mb-4 font-bold text-white text-lg">Toggle your subscriptions</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {subs.map(s => (
                <div key={s.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${s.on ? "border-[#e94560]/40 bg-[#e94560]/5" : "border-[#0f3460] bg-[#1a1a2e]"}`}>
                  <button onClick={() => toggle(s.id)} className={`h-5 w-5 shrink-0 rounded border-2 transition-colors ${s.on ? "border-[#e94560] bg-[#e94560]" : "border-[#0f3460]"}`}>
                    {s.on && <span className="text-white text-xs flex items-center justify-center leading-none">✓</span>}
                  </button>
                  <span className="text-lg">{s.emoji}</span>
                  <span className="flex-1 text-sm text-white">{s.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#a8a8b3] text-xs">$</span>
                    <input type="number" step="0.01" value={s.price} onChange={e => setPrice(s.id, e.target.value)}
                      className="w-16 rounded border border-[#0f3460] bg-[#16213e] px-2 py-1 text-sm text-white focus:border-[#e94560] focus:outline-none text-right" />
                    <span className="text-[#a8a8b3] text-xs">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid gap-4 md:grid-cols-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}% <span className="text-[#a8a8b3] font-normal">(S&P 500 historical avg: 10.5%)</span></span>
              <input type="range" min={7} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Time horizon: {years} years</span>
              <input type="range" min={5} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Monthly total */}
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "Monthly spend", value: fmt(monthlyTotal) },
              { label: "Annual spend", value: fmt(annualTotal) },
              { label: "Daily spend", value: `$${dailyTotal.toFixed(2)}` },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                <div className="text-2xl font-black text-white">{r.value}</div>
                <div className="text-sm text-[#a8a8b3]">{r.label}</div>
              </div>
            ))}
          </div>

          {/* BIG NUMBER */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">If invested in S&P 500 for {years} years:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(bigNumber)}</div>
            <p className="text-[#a8a8b3] mt-1">your subscriptions could have been worth</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div><div className="font-bold text-white">{fmt(totalContrib)}</div><div className="text-[#a8a8b3]">Total contributed</div></div>
              <div><div className="font-bold text-[#4ade80]">{fmt(growthEarned)}</div><div className="text-[#a8a8b3]">Growth from returns</div></div>
              <div><div className="font-bold text-[#F9A825]">{multiplier.toFixed(1)}x</div><div className="text-[#a8a8b3]">Money multiplied</div></div>
            </div>
          </div>

          {/* Individual breakdown */}
          {subRows.length > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h2 className="mb-3 font-bold text-white">📊 Per Subscription Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#0f3460]">
                    {["Service","Monthly","Annual",`${years}yr S&P Value`].map(h => (
                      <th key={h} className="py-2 text-left text-[#a8a8b3] font-semibold pr-4">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{subRows.map(s => (
                    <tr key={s.id} className="border-b border-[#0f3460]/50">
                      <td className="py-2 text-white pr-4">{s.emoji} {s.name}</td>
                      <td className="py-2 text-[#a8a8b3] pr-4">${s.price.toFixed(2)}</td>
                      <td className="py-2 text-[#a8a8b3] pr-4">{fmt(s.annual)}</td>
                      <td className="py-2 text-[#e94560] font-bold">{fmt(s.spValue)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Scenario comparison */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-4 font-bold text-white">🎯 What if you cut some?</h2>
            <div className="space-y-3">
              {scenarios.map(s => {
                const pct = bigNumber > 0 ? (s.value / fv(monthlyTotal, r, years)) * 100 : 0
                return (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#a8a8b3]">{s.label} — invest {fmt(s.monthly)}/mo</span>
                      <span className="text-white font-bold">{fmt(s.value)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-[#16213e] overflow-hidden">
                      <div className="h-full rounded-full bg-[#e94560] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <ShareButtons
            text={shareText}
            url={`https://www.dayblip.com/curiosity/subscriptions?years=${years}&rate=${rate}`}
            title="Subscription Opportunity Cost Calculator"
          />          <RelatedTools tools={[
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
            { emoji: "💸", title: "Habit Cost Calculator", desc: "Total cost of habits", href: "/health/habit-cost" },
            { emoji: "📊", title: "Budget Calculator", desc: "Build a monthly budget", href: "/finance/budget-calculator" },
            { emoji: "💯", title: "Financial Life Score", desc: "Rate your financial health", href: "/tools/financial-life-score" },
          ]} />

          {DISCLAIMER}
        </div>
      </section>
    </div>
  )
}
