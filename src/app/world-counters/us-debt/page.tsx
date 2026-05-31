"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import Link from "next/link"

const DEBT_JAN1_2026   = 36_400_000_000_000
const DEBT_PER_SEC     = 72_920
const US_POPULATION    = 335_000_000
const US_TAXPAYERS     = 150_000_000
const SECS_YEAR        = 31_557_600

function secondsSinceJan1(now: Date): number {
  const jan1 = new Date(now.getFullYear(), 0, 1)
  return (now.getTime() - jan1.getTime()) / 1000
}
function secondsToday(now: Date): number {
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return (now.getTime() - sod.getTime()) / 1000
}
function fmtDollars(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(3)} trillion`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)} billion`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)} million`
  return `$${Math.floor(n).toLocaleString()}`
}

export default function USDebtPage() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const secThisYr = secondsSinceJan1(now)
  const secToday  = secondsToday(now)
  const totalDebt     = DEBT_JAN1_2026 + secThisYr * DEBT_PER_SEC
  const debtPerCitizen   = totalDebt / US_POPULATION
  const debtPerTaxpayer  = totalDebt / US_TAXPAYERS
  const debtTodayIncrease = secToday * DEBT_PER_SEC
  const debtThisYrIncrease = secThisYr * DEBT_PER_SEC

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💸</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">US National Debt Live Counter</h1>
          <p className="text-[#a8a8b3]">The US national debt ticking up in real time — $72,920 every second</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          {/* Live debt — main hero number */}
          <div className="rounded-xl border border-[#fbbf24]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">US National Debt Right Now</p>
            <div className="text-4xl md:text-5xl font-black text-[#fbbf24] tabular-nums break-all">{fmtDollars(totalDebt)}</div>
            <div className="text-lg font-bold text-[#f87171] mt-2 tabular-nums">
              ${Math.floor(totalDebt).toLocaleString()}
            </div>
            <p className="text-[#a8a8b3]/70 text-sm mt-2">Growing at <span className="text-[#fbbf24] font-bold">$72,920</span> per second · <span className="text-[#fbbf24] font-bold">$4.4 million</span> per minute</p>
          </div>

          {/* Per person */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-6 text-center">
              <div className="text-3xl mb-2">👤</div>
              <div className="text-3xl font-black text-[#fbbf24] tabular-nums">{fmtDollars(debtPerCitizen)}</div>
              <div className="text-sm text-[#a8a8b3] mt-1">Debt per US citizen</div>
              <div className="text-xs text-[#a8a8b3]/60">{US_POPULATION.toLocaleString()} citizens</div>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-6 text-center">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-3xl font-black text-[#f87171] tabular-nums">{fmtDollars(debtPerTaxpayer)}</div>
              <div className="text-sm text-[#a8a8b3] mt-1">Debt per US taxpayer</div>
              <div className="text-xs text-[#a8a8b3]/60">{US_TAXPAYERS.toLocaleString()} taxpayers</div>
            </div>
          </div>

          {/* Growth stats */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Debt Growth</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Added today", value: fmtDollars(debtTodayIncrease), color: "#f87171" },
                { label: `Added this year (${now.getFullYear()})`, value: fmtDollars(debtThisYrIncrease), color: "#fbbf24" },
                { label: "Added per minute", value: fmtDollars(DEBT_PER_SEC * 60), color: "#fca5a5" },
                { label: "Added per hour", value: fmtDollars(DEBT_PER_SEC * 3600), color: "#fbbf24" },
                { label: "Added per day (est.)", value: fmtDollars(DEBT_PER_SEC * 86400), color: "#f87171" },
                { label: "Added per year (est.)", value: fmtDollars(DEBT_PER_SEC * SECS_YEAR), color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center rounded-lg border border-[#0f3460] bg-[#0d1b2a] px-5 py-3">
                  <span className="text-sm text-[#a8a8b3]">{s.label}</span>
                  <span className="font-black tabular-nums" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5">
            <h2 className="font-bold text-white mb-3">📊 Context</h2>
            <div className="space-y-2 text-sm text-[#a8a8b3]">
              <div>• The US national debt surpassed <span className="text-white">$36 trillion</span> in late 2025</div>
              <div>• At $72,920/sec the debt grows by roughly <span className="text-white">$2.3 trillion per year</span></div>
              <div>• Interest payments alone exceed <span className="text-white">$1 trillion per year</span></div>
              <div>• The debt-to-GDP ratio is approximately <span className="text-white">120%</span></div>
              <div>• Baseline: $36.4 trillion on January 1, 2026 (US Treasury)</div>
            </div>
          </div>

          <ShareButtons
            text={`The US national debt is currently ${fmtDollars(totalDebt)} and growing at $72,920 every second! Watch it tick live:`}
            url="https://dayblip.com/world-counters/us-debt"
            title="US National Debt Live Counter"
          />

          <p className="text-xs text-[#a8a8b3]/60">Sources: US Treasury, Congressional Budget Office. Baseline: $36.4T on Jan 1, 2026. Rate: ~$2.3T/year ($72,920/sec). Educational purposes only.</p>
        </div>
      </section>
    </div>
  )
}
