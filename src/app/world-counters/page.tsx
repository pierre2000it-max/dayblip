"use client"
import { useState, useEffect, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import Link from "next/link"

// ── Constants & baselines ─────────────────────────────────────────────────────

const WORLD_POP        = 8_200_000_000
const ANNUAL_BIRTHS    = 140_000_000
const ANNUAL_DEATHS    = 58_000_000
const ANNUAL_NET       = ANNUAL_BIRTHS - ANNUAL_DEATHS          // 82M
const DEBT_JAN1_2026   = 36_400_000_000_000
const DEBT_PER_SEC     = 72_920
const WORLD_GDP_ANNUAL = 105_000_000_000_000
const EMAILS_PER_DAY   = 347_000_000_000
const GOOGLE_ANNUAL    = 8_500_000_000_000
const TREES_CUT_ANNUAL = 15_000_000_000
const TREES_PLANT_ANN  = 1_800_000_000
const LIGHTNING_ANNUAL = 1_400_000_000
const COFFEE_PER_DAY   = 2_250_000_000          // cups/day estimate
const MCDONALDS_ANNUAL = 9_000_000_000
const CIGS_ANNUAL      = 5_600_000_000_000
const HEARTBEATS_PER_SEC_WORLD = WORLD_POP * (70 / 60)  // bpm
const STEPS_PER_SEC    = 8000 / 86400

const SECS_YEAR = 31_557_600  // 365.25 days

// ── Helpers ───────────────────────────────────────────────────────────────────

function secondsToday(now: Date): number {
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return (now.getTime() - sod.getTime()) / 1000
}

function secondsSinceJan1(now: Date): number {
  const jan1 = new Date(now.getFullYear(), 0, 1)
  return (now.getTime() - jan1.getTime()) / 1000
}

function fmtBig(n: number, prefix = ""): string {
  if (n >= 1e12) return `${prefix}${(n / 1e12).toFixed(2)} trillion`
  if (n >= 1e9)  return `${prefix}${(n / 1e9).toFixed(2)} billion`
  if (n >= 1e6)  return `${prefix}${(n / 1e6).toFixed(2)} million`
  return `${prefix}${Math.floor(n).toLocaleString()}`
}

function fmtDebt(n: number): string {
  return `$${(n / 1e12).toFixed(3)} trillion`
}

function fmtWhole(n: number): string {
  return Math.floor(n).toLocaleString()
}

// ── Counter card ──────────────────────────────────────────────────────────────

function CounterCard({ emoji, label, value, color, sublabel }: {
  emoji: string; label: string; value: string; color: string; sublabel?: string
}) {
  return (
    <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5">
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-2xl font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-sm text-[#a8a8b3] mt-1">{label}</div>
      {sublabel && <div className="text-xs text-[#a8a8b3]/70 mt-0.5">{sublabel}</div>}
    </div>
  )
}

function SectionHead({ title, color }: { title: string; color: string }) {
  return <h2 className="text-xl font-bold mb-4" style={{ color }}>{title}</h2>
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function WorldCountersPage() {
  const [now, setNow] = useState(() => new Date())
  const [dob, setDob] = useState("")
  const [dobDate, setDobDate] = useState<Date | null>(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const secToday   = secondsToday(now)
  const secThisYr  = secondsSinceJan1(now)
  const currentDebt = DEBT_JAN1_2026 + secThisYr * DEBT_PER_SEC

  const secSinceBirth = dobDate ? (now.getTime() - dobDate.getTime()) / 1000 : null

  const birthStats = useMemo(() => {
    if (!secSinceBirth || secSinceBirth <= 0) return null
    return {
      heartbeats:    Math.floor(secSinceBirth * (70 / 60)),
      steps:         Math.floor(secSinceBirth * STEPS_PER_SEC),
      babiesBorn:    Math.floor(secSinceBirth * (ANNUAL_BIRTHS / SECS_YEAR)),
      debtGrowth:    secSinceBirth * DEBT_PER_SEC,
      popGrowth:     Math.floor(secSinceBirth * (ANNUAL_NET / SECS_YEAR)),
      coffeeCups:    Math.floor(secSinceBirth * (COFFEE_PER_DAY / 86400)),
    }
  }, [secSinceBirth])

  const shareText = birthStats
    ? `Since I was born, ${fmtBig(birthStats.babiesBorn)} babies have been born and the US debt grew by ${fmtDebt(birthStats.debtGrowth)}! Watch the world change live:`
    : "Watch the world change in real time — births, deaths, US debt, emails and more ticking every second!"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🌍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">World Live Counters</h1>
          <p className="text-lg text-[#a8a8b3]">Watch the world change in real time — updated every second</p>
          <p className="text-sm text-[#a8a8b3]/70 mt-2">All counters calculated from verified annual baselines. See sources below.</p>

          {/* Sub-page links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { href: "/world-counters/population", label: "🌱 Population Counter" },
              { href: "/world-counters/us-debt", label: "💸 US Debt Live" },
              { href: "/world-counters/births-today", label: "👶 Births Today" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="rounded-full border border-[#0f3460] bg-[#16213e] px-5 py-2 text-sm text-[#a8a8b3] hover:border-[#e94560] hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[1100px] space-y-14">

          {/* ── PERSONAL SECTION ─────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">⏳ Since You Were Born</h2>
            <p className="text-[#a8a8b3] text-sm mb-6">Enter your birthday to see what happened in the world since your first breath.</p>

            <div className="flex gap-3 mb-6 flex-wrap">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={() => { if (dob) setDobDate(new Date(dob + "T00:00:00")) }}
                className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white hover:opacity-90">
                Show My Stats →
              </button>
            </div>

            {birthStats ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <CounterCard emoji="❤️" label="Times your heart has beaten" value={fmtWhole(birthStats.heartbeats)} color="#f87171" />
                <CounterCard emoji="👟" label="Steps you have taken (est.)" value={fmtWhole(birthStats.steps)} color="#4ade80" sublabel="Based on 8,000 avg steps/day" />
                <CounterCard emoji="👶" label="Babies born since you" value={fmtBig(birthStats.babiesBorn)} color="#4ade80" />
                <CounterCard emoji="📈" label="US debt growth since you" value={fmtDebt(birthStats.debtGrowth)} color="#fbbf24" sublabel="$72,920 per second" />
                <CounterCard emoji="🌏" label="World population grew by" value={fmtBig(birthStats.popGrowth)} color="#2dd4bf" sublabel="Net births minus deaths" />
                <CounterCard emoji="☕" label="Cups of coffee consumed since you" value={fmtBig(birthStats.coffeeCups)} color="#fb923c" sublabel="Worldwide" />
              </div>
            ) : (
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-8 text-center text-[#a8a8b3]">
                Enter your birth date above to see your personal world stats ↑
              </div>
            )}
          </div>

          {/* ── TODAY COUNTERS ────────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">📅 Today So Far</h2>

            {/* Life */}
            <div className="mb-8">
              <SectionHead title="🌱 Life & Population" color="#4ade80" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <CounterCard emoji="👶" label="Births today" value={fmtBig(secToday * (ANNUAL_BIRTHS / 86400))} color="#4ade80" />
                <CounterCard emoji="💀" label="Deaths today" value={fmtBig(secToday * (ANNUAL_DEATHS / 86400))} color="#f87171" />
                <CounterCard emoji="📊" label="Net population gain today" value={fmtBig(secToday * (ANNUAL_NET / 86400))} color="#4ade80" />
                <CounterCard emoji="⏰" label="Births this hour" value={fmtWhole(Math.min(secToday, 3600) * (ANNUAL_BIRTHS / 86400))} color="#86efac" sublabel="Last 3,600 seconds" />
              </div>
            </div>

            {/* Health */}
            <div className="mb-8">
              <SectionHead title="🫀 Health" color="#f87171" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <CounterCard emoji="🚬" label="Cigarettes smoked worldwide today" value={fmtBig(secToday * (CIGS_ANNUAL / SECS_YEAR))} color="#f87171" />
                <CounterCard emoji="❤️" label="Heartbeats worldwide today" value={fmtBig(secToday * HEARTBEATS_PER_SEC_WORLD)} color="#fca5a5" sublabel="8.2B people × 70 bpm" />
              </div>
            </div>

            {/* Money */}
            <div className="mb-8">
              <SectionHead title="💰 Money" color="#fbbf24" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#fbbf24]/30 bg-[#0d1b2a] p-5 md:col-span-1">
                  <div className="text-2xl mb-2">🇺🇸</div>
                  <div className="text-3xl font-black tabular-nums text-[#fbbf24]">{fmtDebt(currentDebt)}</div>
                  <div className="text-sm text-[#a8a8b3] mt-1">US National Debt right now</div>
                  <div className="text-xs text-[#a8a8b3]/70 mt-0.5">Growing at $72,920 per second</div>
                </div>
                <CounterCard emoji="💹" label="World GDP generated today" value={fmtBig(secToday * (WORLD_GDP_ANNUAL / SECS_YEAR), "$")} color="#fbbf24" />
                <CounterCard emoji="📉" label="US debt increase today" value={fmtBig(secToday * DEBT_PER_SEC, "$")} color="#f87171" />
              </div>
            </div>

            {/* Technology */}
            <div className="mb-8">
              <SectionHead title="💻 Technology" color="#a78bfa" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <CounterCard emoji="📧" label="Emails sent today" value={fmtBig(secToday * (EMAILS_PER_DAY / 86400))} color="#a78bfa" />
                <CounterCard emoji="🔍" label="Google searches today" value={fmtBig(secToday * (GOOGLE_ANNUAL / SECS_YEAR))} color="#c4b5fd" />
                <CounterCard emoji="▶️" label="YouTube hours uploaded today" value={fmtBig(secToday * (500 * 60 / 3600))} color="#a78bfa" sublabel="500 hrs/min uploaded" />
              </div>
            </div>

            {/* Nature */}
            <div className="mb-8">
              <SectionHead title="🌳 Nature" color="#2dd4bf" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <CounterCard emoji="🪓" label="Trees cut down today" value={fmtBig(secToday * (TREES_CUT_ANNUAL / SECS_YEAR))} color="#f87171" />
                <CounterCard emoji="🌱" label="Trees planted today" value={fmtBig(secToday * (TREES_PLANT_ANN / SECS_YEAR))} color="#2dd4bf" />
                <CounterCard emoji="⚡" label="Lightning strikes today" value={fmtBig(secToday * (LIGHTNING_ANNUAL / SECS_YEAR))} color="#fbbf24" />
              </div>
            </div>

            {/* Food */}
            <div className="mb-8">
              <SectionHead title="🍔 Food & Drink" color="#fb923c" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <CounterCard emoji="☕" label="Cups of coffee consumed today" value={fmtBig(secToday * (COFFEE_PER_DAY / 86400))} color="#fb923c" />
                <CounterCard emoji="🍟" label="McDonald's meals today" value={fmtBig(secToday * (MCDONALDS_ANNUAL / SECS_YEAR))} color="#fbbf24" />
              </div>
            </div>
          </div>

          {/* ── THIS YEAR ─────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">📆 This Year So Far ({now.getFullYear()})</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <CounterCard emoji="👶" label="Babies born this year" value={fmtBig(secThisYr * (ANNUAL_BIRTHS / SECS_YEAR))} color="#4ade80" />
              <CounterCard emoji="💀" label="People died this year" value={fmtBig(secThisYr * (ANNUAL_DEATHS / SECS_YEAR))} color="#f87171" />
              <CounterCard emoji="📊" label="Population growth this year" value={fmtBig(secThisYr * (ANNUAL_NET / SECS_YEAR))} color="#2dd4bf" />
              <CounterCard emoji="📈" label="US debt added this year" value={fmtDebt(secThisYr * DEBT_PER_SEC)} color="#fbbf24" />
              <CounterCard emoji="🪓" label="Trees cut down this year" value={fmtBig(secThisYr * (TREES_CUT_ANNUAL / SECS_YEAR))} color="#f87171" />
              <CounterCard emoji="📧" label="Emails sent this year" value={fmtBig(secThisYr * (EMAILS_PER_DAY * 365 / SECS_YEAR))} color="#a78bfa" />
              <CounterCard emoji="🔍" label="Google searches this year" value={fmtBig(secThisYr * (GOOGLE_ANNUAL / SECS_YEAR))} color="#c4b5fd" />
              <CounterCard emoji="☕" label="Cups of coffee this year" value={fmtBig(secThisYr * (COFFEE_PER_DAY / 86400))} color="#fb923c" />
            </div>
          </div>

          {/* ── SHARE ────────────────────────────────────────────────────── */}
          <ShareButtons
            text={shareText}
            url="https://dayblip.com/world-counters"
            title="World Live Counters"
          />

          {/* ── SOURCES ──────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] overflow-hidden">
            <button
              onClick={() => setSourcesOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#16213e] transition-colors">
              <span className="font-semibold text-white">📚 Sources &amp; Methodology</span>
              <span className="text-[#a8a8b3]">{sourcesOpen ? "▲" : "▼"}</span>
            </button>
            {sourcesOpen && (
              <div className="px-6 pb-6 text-sm text-[#a8a8b3] space-y-1.5 border-t border-[#0f3460]">
                <p className="pt-4 font-semibold text-white">Annual baselines used for calculations:</p>
                {[
                  ["World births", "140 million/year", "UN World Population Prospects 2024"],
                  ["World deaths", "58 million/year", "WHO Global Health Estimates"],
                  ["US National Debt growth", "~$2.3 trillion/year ($72,920/sec)", "US Treasury, Congressional Budget Office"],
                  ["World GDP", "$105 trillion/year", "World Bank 2024"],
                  ["Global email volume", "347 billion/day", "Statista 2024"],
                  ["Google searches", "8.5 trillion/year", "Google, Statista 2024"],
                  ["Trees cut down", "15 billion/year", "Nature journal, 2015 study"],
                  ["Trees planted", "1.8 billion/year", "Plant-for-the-Planet, FAO"],
                  ["Global coffee consumption", "~2.25 billion cups/day", "ICO 2024"],
                  ["Cigarettes smoked", "~5.6 trillion/year", "WHO"],
                  ["Lightning strikes", "1.4 billion/year", "NOAA"],
                  ["McDonald's meals", "9 billion/year", "McDonald's annual reports"],
                  ["YouTube uploads", "500 hours per minute", "YouTube press statistics"],
                  ["Average heart rate", "70 bpm", "Medical standard"],
                  ["Average daily steps", "8,000/day", "CDC guidelines"],
                ].map(([item, val, src]) => (
                  <div key={item} className="flex gap-2">
                    <span className="text-[#e94560] shrink-0">•</span>
                    <span><strong className="text-white">{item}:</strong> {val} ({src})</span>
                  </div>
                ))}
                <p className="text-xs text-[#a8a8b3]/60 pt-2">All figures are estimates based on published global statistics. Actual values vary. Updated annually.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
