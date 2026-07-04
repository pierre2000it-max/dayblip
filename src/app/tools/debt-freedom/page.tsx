"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import { generateShareImage } from "@/utils/generateShareImage"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

interface Debt { name: string; balance: string; rate: string; min: string }
interface PayoffEvent { name: string; monthIndex: number }
interface SimResult { months: number; totalInterest: number; events: PayoffEvent[] }

function simulate(debts: { name: string; balance: number; rate: number; min: number }[], extra: number, strategy: string): SimResult {
  const ds = debts.map(d => ({ ...d, bal: d.balance }))
  let totalInterest = 0
  let months = 0
  const events: PayoffEvent[] = []
  const paid = new Set<number>()
  while (ds.some(d => d.bal > 0.01) && months < 1200) {
    months++
    // apply interest
    ds.forEach(d => { if (d.bal > 0) { const i = d.bal * (d.rate / 100 / 12); totalInterest += i; d.bal += i } })
    // pay minimums
    let pool = extra
    ds.forEach(d => {
      if (d.bal > 0) {
        const pay = Math.min(d.min, d.bal)
        d.bal -= pay
        if (d.min > pay) pool += d.min - pay
      } else {
        pool += d.min
      }
    })
    // target debt
    const active = ds.map((d, i) => ({ d, i })).filter(x => x.d.bal > 0.01)
    active.sort((a, b) => strategy === "snowball" ? a.d.bal - b.d.bal : b.d.rate - a.d.rate)
    for (const t of active) {
      if (pool <= 0) break
      const pay = Math.min(pool, t.d.bal)
      t.d.bal -= pay
      pool -= pay
    }
    ds.forEach((d, i) => { if (d.bal <= 0.01 && !paid.has(i)) { paid.add(i); events.push({ name: d.name, monthIndex: months }) } })
  }
  return { months, totalInterest, events }
}

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Educational estimate.</strong> Actual payoff depends on consistent payments and unchanged rates. Not financial advice.
  </div>
)

function addMonths(months: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d
}

export default function DebtFreedomPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit Card", balance: "8000", rate: "19.99", min: "200" },
    { name: "Car Loan", balance: "12000", rate: "6.5", min: "300" },
  ])
  const [extra, setExtra] = useState("100")
  const [strategy, setStrategy] = useState("avalanche")
  const [result, setResult] = useState<{ sim: SimResult; minSim: SimResult; freedomDate: Date; daysAway: number } | null>(null)
  const [now, setNow] = useState<number>(0)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    setNow(Date.now())
    return () => clearInterval(t)
  }, [])

  function parsedDebts() {
    return debts.filter(d => parseFloat(d.balance) > 0).map(d => ({
      name: d.name || "Debt", balance: parseFloat(d.balance) || 0, rate: parseFloat(d.rate) || 0, min: parseFloat(d.min) || 0,
    }))
  }

  function compute(push = true) {
    const pd = parsedDebts()
    if (pd.length === 0) return
    const ex = parseFloat(extra) || 0
    const sim = simulate(pd, ex, strategy)
    const minSim = simulate(pd, 0, strategy)
    const freedomDate = addMonths(sim.months)
    const daysAway = Math.ceil((freedomDate.getTime() - Date.now()) / 86400000)
    setResult({ sim, minSim, freedomDate, daysAway })
    if (push && typeof window !== "undefined") {
      const params = new URLSearchParams()
      pd.forEach((d, i) => {
        params.set(`debt${i + 1}name`, d.name); params.set(`debt${i + 1}bal`, String(d.balance))
        params.set(`debt${i + 1}rate`, String(d.rate)); params.set(`debt${i + 1}min`, String(d.min))
      })
      params.set("extra", String(ex)); params.set("strategy", strategy)
      window.history.pushState({}, "", `?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("debt1bal")) {
      const loaded: Debt[] = []
      for (let i = 1; i <= 5; i++) {
        const bal = p.get(`debt${i}bal`)
        if (!bal) break
        loaded.push({ name: p.get(`debt${i}name`) || "Debt", balance: bal, rate: p.get(`debt${i}rate`) || "0", min: p.get(`debt${i}min`) || "0" })
      }
      if (loaded.length) setDebts(loaded)
      const ex = p.get("extra"); const st = p.get("strategy")
      if (ex) setExtra(ex); if (st) setStrategy(st)
      const pd = loaded.map(d => ({ name: d.name, balance: parseFloat(d.balance) || 0, rate: parseFloat(d.rate) || 0, min: parseFloat(d.min) || 0 }))
      const sim = simulate(pd, Number(ex ?? 0), st ?? "avalanche")
      const minSim = simulate(pd, 0, st ?? "avalanche")
      const freedomDate = addMonths(sim.months)
      setResult({ sim, minSim, freedomDate, daysAway: Math.ceil((freedomDate.getTime() - Date.now()) / 86400000) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateDebt(i: number, key: keyof Debt, v: string) {
    setDebts(ds => ds.map((d, idx) => idx === i ? { ...d, [key]: v } : d))
  }
  function addDebt() { if (debts.length < 5) setDebts(ds => [...ds, { name: "Debt", balance: "", rate: "", min: "" }]) }
  function removeDebt(i: number) { setDebts(ds => ds.filter((_, idx) => idx !== i)) }

  // live countdown
  let cd = { d: 0, h: 0, m: 0, s: 0 }
  if (result && now) {
    const diff = Math.max(0, result.freedomDate.getTime() - now)
    cd = { d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000) % 24, m: Math.floor(diff / 60000) % 60, s: Math.floor(diff / 1000) % 60 }
  }

  const fdStr = result ? `${MONTHS[result.freedomDate.getMonth()]} ${result.freedomDate.getDate()}, ${result.freedomDate.getFullYear()}` : ""
  const interestSaved = result ? result.minSim.totalInterest - result.sim.totalInterest : 0
  const monthsSooner = result ? result.minSim.months - result.sim.months : 0

  const shareUrl = result && typeof window !== "undefined" ? window.location.href.split("?")[0] + window.location.search : "https://www.dayblip.com/tools/debt-freedom"
  const shareText = result ? `I will be completely DEBT FREE on ${fdStr}! That is ${result.daysAway} days away! Calculate your debt freedom date:` : ""

  function downloadShareImage() {
    if (!result) return
    generateShareImage({
      title: "My Debt Freedom Date",
      primaryStat: result.daysAway.toLocaleString(),
      primaryLabel: "days until debt freedom",
      stats: [
        { label: "Freedom date", value: fdStr },
        { label: "Total interest", value: fmt(result.sim.totalInterest) },
        { label: "Months to payoff", value: `${result.sim.months} months` },
      ],
      tagline: "Freedom is a date on the calendar.",
      toolUrl: "dayblip.com/tools/debt-freedom",
      filename: "dayblip-debt-freedom.png",
    })
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Debt Freedom Date Calculator — When Will You Be Completely Debt Free?</h1>
          <p className="text-[#a8a8b3]">Find the exact date you will be completely debt free</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average American carries $104,215 in total debt including mortgage, auto loans, student loans and credit cards. Without a debt payoff strategy most people carry significant debt into retirement. Paying just 10-20% extra per month on the highest-interest debt first can eliminate it years sooner and save thousands in interest.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A debt freedom date calculator shows the exact date you will be completely debt free based on your current debts, interest rates and monthly payments. It uses the debt avalanche method — paying minimums on all debts while putting extra money toward the highest interest rate first — to minimize total interest paid across all debts.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-4">
            {debts.map((d, i) => (
              <div key={i} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <input value={d.name} onChange={e => updateDebt(i, "name", e.target.value)}
                    className="rounded border border-[#0f3460] bg-[#16213e] px-2 py-1 text-sm font-semibold text-white focus:border-[#e94560] focus:outline-none" />
                  {debts.length > 1 && <button onClick={() => removeDebt(i)} className="text-xs text-[#FF6B6B]">Remove</button>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="block"><span className="mb-1 block text-xs text-[#a8a8b3]">Balance $</span>
                    <input type="number" value={d.balance} onChange={e => updateDebt(i, "balance", e.target.value)} className="w-full rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
                  <label className="block"><span className="mb-1 block text-xs text-[#a8a8b3]">Rate %</span>
                    <input type="number" step="0.01" value={d.rate} onChange={e => updateDebt(i, "rate", e.target.value)} className="w-full rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
                  <label className="block"><span className="mb-1 block text-xs text-[#a8a8b3]">Min payment $</span>
                    <input type="number" value={d.min} onChange={e => updateDebt(i, "min", e.target.value)} className="w-full rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none" /></label>
                </div>
              </div>
            ))}
            {debts.length < 5 && <button onClick={addDebt} className="rounded-lg border border-[#0f3460] px-4 py-2 text-sm text-[#a8a8b3] hover:text-white">+ Add debt</button>}

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Extra monthly payment</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={extra} onChange={e => setExtra(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" /></div>
            </label>

            <div className="flex gap-2">
              {[{ v: "avalanche", l: "Avalanche (highest interest first)" }, { v: "snowball", l: "Snowball (lowest balance first)" }].map(s => (
                <button key={s.v} onClick={() => setStrategy(s.v)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${strategy === s.v ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>{s.l}</button>
              ))}
            </div>

            <button onClick={() => compute()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Find My Freedom Date
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <p className="text-sm text-[#a8a8b3]">YOU WILL BE DEBT FREE:</p>
                <div className="mt-1 text-3xl font-black text-[#e94560]">{fdStr}</div>
                <p className="mt-2 text-white">That is {result.daysAway.toLocaleString()} days from today</p>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {[{ v: cd.d, l: "days" }, { v: cd.h, l: "hours" }, { v: cd.m, l: "min" }, { v: cd.s, l: "sec" }].map(x => (
                    <div key={x.l} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-2"><div className="text-xl font-black text-[#F9A825]">{x.v}</div><div className="text-xs text-[#a8a8b3]">{x.l}</div></div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm">
                <h3 className="mb-2 font-bold text-white">Debt payoff order</h3>
                <ul className="space-y-1.5 text-[#a8a8b3]">
                  {result.sim.events.map((e, idx) => {
                    const dt = addMonths(e.monthIndex)
                    return <li key={idx} className="flex justify-between"><span>{e.name} paid</span><span className="text-white">{MONTHS[dt.getMonth()]} {dt.getFullYear()}</span></li>
                  })}
                  <li className="flex justify-between border-t border-[#0f3460] pt-1.5 font-bold"><span className="text-white">ALL DEBT FREE</span><span className="text-[#e94560]">{MONTHS[result.freedomDate.getMonth()]} {result.freedomDate.getFullYear()}</span></li>
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <h4 className="mb-1 font-bold text-white">Minimum only</h4>
                  <p className="text-[#a8a8b3]">Freedom: {MONTHS[addMonths(result.minSim.months).getMonth()]} {addMonths(result.minSim.months).getFullYear()}</p>
                  <p className="text-[#a8a8b3]">Total interest: <span className="text-[#FF6B6B]">{fmt(result.minSim.totalInterest)}</span></p>
                </div>
                <div className="rounded-xl border border-[#4ade80]/40 bg-[#1a1a2e] p-5 text-sm">
                  <h4 className="mb-1 font-bold text-white">With extra {fmt(parseFloat(extra) || 0)}/mo</h4>
                  <p className="text-[#a8a8b3]">Freedom: {fdStr} ({monthsSooner} months sooner)</p>
                  <p className="text-[#a8a8b3]">Total interest: <span className="text-[#4ade80]">{fmt(result.sim.totalInterest)}</span> (save {fmt(interestSaved)})</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-5 text-sm text-white">
                By paying {fmt(parseFloat(extra) || 0)} extra/month: save <span className="font-bold text-[#4ade80]">{fmt(interestSaved)}</span> in interest and become free <span className="font-bold text-[#F9A825]">{monthsSooner} months</span> sooner.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Debt Freedom Date Calculator" />
              <button
                onClick={downloadShareImage}
                style={{ width: "100%", background: "#e8445a", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
                onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
              >
                📸 Download Your Result
              </button>
              {DISCLAIMER}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
