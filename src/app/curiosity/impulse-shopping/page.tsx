"use client"
import { useState, useMemo, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fv(monthly: number, r: number, years: number): number {
  if (monthly <= 0 || years <= 0) return 0
  const mr = r / 12; const n = years * 12
  return mr === 0 ? monthly * n : monthly * ((Math.pow(1 + mr, n) - 1) / mr)
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational & entertainment purposes only.</strong> Not investment advice. Past S&P 500 returns do not guarantee future results. Consult a financial advisor.
  </div>
)

interface Category { id: string; emoji: string; label: string; default: number; on: boolean; amount: string }

const DEFAULTS: Category[] = [
  { id:"amazon",    emoji:"🛒", label:"Amazon impulse buys",      default:80,  on:true,  amount:"80" },
  { id:"clothes",   emoji:"👗", label:"Clothes not needed",       default:60,  on:true,  amount:"60" },
  { id:"apps",      emoji:"📱", label:"App purchases",            default:15,  on:true,  amount:"15" },
  { id:"games",     emoji:"🎮", label:"Games / DLC",              default:25,  on:false, amount:"25" },
  { id:"decor",     emoji:"🏠", label:"Home décor",               default:40,  on:false, amount:"40" },
  { id:"delivery",  emoji:"🍕", label:"Late night food delivery", default:50,  on:true,  amount:"50" },
  { id:"beauty",    emoji:"💄", label:"Beauty / grooming extras", default:35,  on:false, amount:"35" },
  { id:"books",     emoji:"📚", label:"Books unread",             default:20,  on:false, amount:"20" },
  { id:"gifts",     emoji:"🎁", label:"Gifts over budget",        default:30,  on:false, amount:"30" },
  { id:"other",     emoji:"✨", label:"Other",                    default:0,   on:false, amount:"0"  },
]

export default function ImpulseShoppingPage() {
  const [cats,  setCats]  = useState<Category[]>(DEFAULTS)
  const [years, setYears] = useState(25)
  const [rate,  setRate]  = useState(10.5)

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("years")) setYears(Number(p.get("years")))
    if (p.get("rate")) setRate(Number(p.get("rate")))
  }, [])

  const toggle = (id: string) => setCats(c => c.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const setAmt = (id: string, v: string) => setCats(c => c.map(x => x.id === id ? { ...x, amount: v } : x))

  const r = rate / 100

  const calc = useMemo(() => {
    const active  = cats.filter(c => c.on)
    const monthly = active.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0)
    const annual  = monthly * 12
    const scenarios = [0.25, 0.50, 0.75, 1.00].map(cut => ({
      pct: cut,
      label: `Cut ${(cut * 100).toFixed(0)}%`,
      monthly: monthly * cut,
      value: fv(monthly * cut, r, years),
    }))
    const highlight = scenarios[1] // 50% scenario
    return { monthly, annual, scenarios, highlight }
  }, [cats, years, r])


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Impulse Shopping Calculator — What Impulse Buys Cost Your Future</h1>
          <p className="text-[#a8a8b3]">What is your impulse spending really costing your future self?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average American makes 3 impulse purchases per week totaling $151 monthly or $1,812 per year. Online shopping has increased impulse buying by 40% since 2020. $150 per month in impulse spending invested at 7% annual return over 25 years grows to $120,000. Most impulse purchases are forgotten within 90 days.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Impulse purchases are unplanned buying decisions made in the moment without prior intention. Research shows that 40-80% of all purchases have an impulse component. This calculator shows the cumulative annual cost of impulse buying habits and the investment opportunity cost of that spending over time.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          {DISCLAIMER}

          {/* Category tiles */}
          <div>
            <h2 className="mb-3 font-bold text-white">Toggle your impulse categories</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {cats.map(c => (
                <div key={c.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${c.on ? "border-[#e94560]/40 bg-[#e94560]/5" : "border-[#0f3460] bg-[#1a1a2e]"}`}>
                  <button onClick={() => toggle(c.id)} className={`h-5 w-5 shrink-0 rounded border-2 transition-colors ${c.on ? "border-[#e94560] bg-[#e94560]" : "border-[#0f3460]"}`}>
                    {c.on && <span className="text-white text-xs flex items-center justify-center leading-none">✓</span>}
                  </button>
                  <span className="text-lg">{c.emoji}</span>
                  <span className="flex-1 text-sm text-white">{c.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#a8a8b3] text-xs">$</span>
                    <input type="number" value={c.amount} onChange={e => setAmt(c.id, e.target.value)}
                      className="w-16 rounded border border-[#0f3460] bg-[#16213e] px-2 py-1 text-sm text-white focus:border-[#e94560] focus:outline-none text-right" />
                    <span className="text-[#a8a8b3] text-xs">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years to invest: {years}</span>
              <input type="range" min={10} max={40} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Annual return: {rate}%</span>
              <input type="range" min={6} max={12} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="accent-[#e94560]" />
            </label>
          </div>

          {/* Monthly total */}
          <div className="grid gap-3 md:grid-cols-2 text-center">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
              <div className="text-2xl font-black text-white">{fmt(calc.monthly)}</div>
              <div className="text-sm text-[#a8a8b3]">Monthly impulse spending</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
              <div className="text-2xl font-black text-[#e94560]">{fmt(calc.annual)}</div>
              <div className="text-sm text-[#a8a8b3]">Annual impulse spending</div>
            </div>
          </div>

          {/* BIG NUMBER — 50% scenario */}
          <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2">Cutting half your impulse spending and investing the rest for {years} years:</p>
            <div className="text-6xl font-black text-[#e94560]">{fmt(calc.highlight.value)}</div>
          </div>

          {/* Scenarios */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-4 font-bold text-white">🎯 Cut & Invest Scenarios</h2>
            <div className="space-y-4">
              {calc.scenarios.map(s => (
                <div key={s.pct}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#a8a8b3]">{s.label} → invest {fmt(s.monthly)}/mo</span>
                    <span className="text-white font-bold">{fmt(s.value)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#16213e] overflow-hidden">
                    <div className="h-full rounded-full bg-[#e94560]" style={{ width: `${s.pct * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`My impulse shopping could cost me ${fmt(calc.highlight.value)} in future wealth! (Educational purposes only)`}
            url={`https://www.dayblip.com/curiosity/impulse-shopping?monthly=200&years=${years}&rate=${rate}`}
            title="Impulse Shopping Investment Calculator"
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
