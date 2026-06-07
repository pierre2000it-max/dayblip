"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import Link from "next/link"

// ── Annual baselines ──────────────────────────────────────────────────────────
const WORLD_POP        = 8_200_000_000
const ANNUAL_BIRTHS    = 140_000_000       // UN 2024
const ANNUAL_DEATHS    = 58_000_000        // WHO
const ANNUAL_NET       = ANNUAL_BIRTHS - ANNUAL_DEATHS   // 82M
const DEBT_JAN1_2026   = 36_400_000_000_000
const DEBT_PER_SEC     = 72_920            // ~$2.3T / yr
const WORLD_GDP_ANNUAL = 105_000_000_000_000
const EMAILS_PER_DAY   = 347_000_000_000  // Statista — per DAY not per year
const GOOGLE_ANNUAL    = 8_500_000_000_000
const TREES_CUT_ANNUAL = 15_000_000_000
const TREES_PLANT_ANN  = 1_800_000_000
const LIGHTNING_ANNUAL = 1_400_000_000
const COFFEE_PER_DAY   = 2_250_000_000    // cups/day (ICO 2024)
const MCDONALDS_ANNUAL = 9_000_000_000
const CIGS_ANNUAL      = 5_600_000_000_000

// Derived per-second rates
const SECS_YEAR        = 365.25 * 86_400  // 31,557,600
const SECS_DAY         = 86_400

const BIRTHS_PER_SEC   = ANNUAL_BIRTHS  / SECS_YEAR   // ~4.434
const DEATHS_PER_SEC   = ANNUAL_DEATHS  / SECS_YEAR   // ~1.838
const NET_PER_SEC      = ANNUAL_NET     / SECS_YEAR   // ~2.597
const GDP_PER_SEC      = WORLD_GDP_ANNUAL / SECS_YEAR
const GOOGLE_PER_SEC   = GOOGLE_ANNUAL  / SECS_YEAR
const TREES_CUT_PER_SEC = TREES_CUT_ANNUAL / SECS_YEAR
const TREES_PLANT_PER_SEC = TREES_PLANT_ANN / SECS_YEAR
const LIGHTNING_PER_SEC = LIGHTNING_ANNUAL / SECS_YEAR
const MCDONALDS_PER_SEC = MCDONALDS_ANNUAL / SECS_YEAR
const CIGS_PER_SEC     = CIGS_ANNUAL    / SECS_YEAR
const EMAILS_PER_SEC   = EMAILS_PER_DAY / SECS_DAY    // per-day baseline ÷ 86400
const COFFEE_PER_SEC   = COFFEE_PER_DAY / SECS_DAY
const YOUTUBE_PER_SEC  = 500 / 60                     // 500 hrs/min uploaded
const HEARTBEATS_PER_SEC_WORLD = WORLD_POP * (70 / 60)

const STEPS_PER_SEC    = 8_000 / SECS_DAY


// ── Formatters ────────────────────────────────────────────────────────────────

function fmtBig(n: number, prefix = ""): string {
  const abs = Math.abs(n)
  if (abs >= 1e12) return `${prefix}${(n / 1e12).toFixed(2)} trillion`
  if (abs >= 1e9)  return `${prefix}${(n / 1e9).toFixed(2)} billion`
  if (abs >= 1e6)  return `${prefix}${(n / 1e6).toFixed(2)} million`
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
  // Use a tick counter instead of storing the Date in state.
  // getSecToday() is always computed from a fresh new Date() to avoid
  // SSR/hydration mismatches that cause it to equal secThisYear.
  const [redraw, setRedraw] = useState(false)
  const [dob, setDob] = useState("")
  const [dobDate, setDobDate] = useState<Date | null>(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setRedraw(r => !r), 1000)
    return () => clearInterval(t)
  }, [])
  void redraw  // read here so ESLint sees it as used; the toggle triggers re-render

  // Always derive time from a live new Date() — never from stale state
  const now = new Date()

  // Time buckets — recalculate each tick
  const startOfDay    = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const secToday      = Math.floor((now.getTime() - startOfDay.getTime()) / 1000)
  const startOfYear   = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
  const secThisYear   = Math.floor((now.getTime() - startOfYear.getTime()) / 1000)
  const secThisHour   = now.getMinutes() * 60 + now.getSeconds()
  const currentDebt   = DEBT_JAN1_2026 + secThisYear * DEBT_PER_SEC

  const secSinceBirth = dobDate ? (now.getTime() - dobDate.getTime()) / 1000 : null

  // birthStats computed inline (now is a local var, so useMemo on it is pointless)
  const birthStats = secSinceBirth && secSinceBirth > 0 ? {
    heartbeats: Math.floor(secSinceBirth * (70 / 60)),
    steps:      Math.floor(secSinceBirth * STEPS_PER_SEC),
    babiesBorn: Math.floor(secSinceBirth * BIRTHS_PER_SEC),
    debtGrowth: secSinceBirth * DEBT_PER_SEC,
    popGrowth:  Math.floor(secSinceBirth * NET_PER_SEC),
    coffeeCups: Math.floor(secSinceBirth * COFFEE_PER_SEC),
  } : null

  const shareText = birthStats
    ? `Since I was born, ${fmtBig(birthStats.babiesBorn)} babies have been born and the US debt grew by ${fmtDebt(birthStats.debtGrowth)}! Watch the world change live:`
    : "Watch the world change in real time — births, deaths, US debt, emails and more ticking every second!"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🌍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Live World Counters — Real Time Global Statistics Updating Every Second</h1>
          <p className="text-lg text-[#a8a8b3]">Watch the world change in real time — updated every second</p>
          <p className="text-sm text-[#a8a8b3]/70 mt-2">All counters calculated from verified annual baselines. See sources below.</p>

          {/* Sub-page links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { href: "/world-counters/population", label: "🌱 Population Counter" },
              { href: "/world-counters/us-debt",    label: "💸 US Debt Live"       },
              { href: "/world-counters/births-today",label: "👶 Births Today"      },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="rounded-full border border-[#0f3460] bg-[#16213e] px-5 py-2 text-sm text-[#a8a8b3] hover:border-[#e94560] hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A baby is born somewhere in the world every 0.23 seconds — approximately 140 million births per year. The world population grows by approximately 80 million people annually. The US national debt increases by roughly $72,920 every second. These counters update in real time based on current global statistical rates.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Live world counters show global statistics updating in real time every second based on current annual rates from organizations including the UN, World Health Organization and US Treasury. The counters show world births, deaths and net population change today alongside the US national debt counter and your personal birth statistics.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[1100px] space-y-14">

          {/* ── PERSONAL SECTION ───────────────────────────────────────────── */}
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
                <CounterCard emoji="❤️" label="Times your heart has beaten"    value={fmtWhole(birthStats.heartbeats)} color="#f87171" />
                <CounterCard emoji="👟" label="Steps you have taken (est.)"    value={fmtWhole(birthStats.steps)}     color="#4ade80" sublabel="Based on 8,000 avg steps/day" />
                <CounterCard emoji="👶" label="Babies born since you"          value={fmtBig(birthStats.babiesBorn)}  color="#4ade80" />
                <CounterCard emoji="📈" label="US debt growth since you"       value={fmtDebt(birthStats.debtGrowth)} color="#fbbf24" sublabel="$72,920 per second" />
                <CounterCard emoji="🌏" label="World population grew by"       value={fmtBig(birthStats.popGrowth)}   color="#2dd4bf" sublabel="Net births minus deaths" />
                <CounterCard emoji="☕" label="Cups of coffee consumed worldwide" value={fmtBig(birthStats.coffeeCups)} color="#fb923c" />
              </div>
            ) : (
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-8 text-center text-[#a8a8b3]">
                Enter your birth date above to see your personal world stats ↑
              </div>
            )}
          </div>

          {/* ── TODAY COUNTERS ─────────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">📅 Today So Far</h2>

            {/* Life & Population */}
            <div className="mb-8">
              <SectionHead title="🌱 Life & Population" color="#4ade80" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <CounterCard emoji="👶" label="Births today"
                  value={fmtWhole(secToday * BIRTHS_PER_SEC)}
                  color="#4ade80"
                  sublabel={`~${(BIRTHS_PER_SEC * 60).toFixed(0)} per minute`} />
                <CounterCard emoji="💀" label="Deaths today"
                  value={fmtWhole(secToday * DEATHS_PER_SEC)}
                  color="#f87171"
                  sublabel={`~${(DEATHS_PER_SEC * 60).toFixed(0)} per minute`} />
                <CounterCard emoji="📊" label="Net population gain today"
                  value={fmtWhole(secToday * NET_PER_SEC)}
                  color="#4ade80" />
                <CounterCard emoji="⏰" label="Births this hour"
                  value={fmtWhole(secThisHour * BIRTHS_PER_SEC)}
                  color="#86efac"
                  sublabel="Since the hour started" />
              </div>
            </div>

            {/* Health */}
            <div className="mb-8">
              <SectionHead title="🫀 Health" color="#f87171" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <CounterCard emoji="🚬" label="Cigarettes smoked worldwide today"
                  value={fmtBig(secToday * CIGS_PER_SEC)}
                  color="#f87171" />
                <CounterCard emoji="❤️" label="Heartbeats worldwide today"
                  value={fmtBig(secToday * HEARTBEATS_PER_SEC_WORLD)}
                  color="#fca5a5"
                  sublabel="8.2B people × 70 bpm" />
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
                <CounterCard emoji="💹" label="World GDP generated today"
                  value={fmtBig(secToday * GDP_PER_SEC, "$")}
                  color="#fbbf24" />
                <CounterCard emoji="📉" label="US debt increase today"
                  value={fmtBig(secToday * DEBT_PER_SEC, "$")}
                  color="#f87171" />
              </div>
            </div>

            {/* Technology */}
            <div className="mb-8">
              <SectionHead title="💻 Technology" color="#a78bfa" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <CounterCard emoji="📧" label="Emails sent today"
                  value={fmtBig(secToday * EMAILS_PER_SEC)}
                  color="#a78bfa"
                  sublabel="347B sent each day" />
                <CounterCard emoji="🔍" label="Google searches today"
                  value={fmtBig(secToday * GOOGLE_PER_SEC)}
                  color="#c4b5fd" />
                <CounterCard emoji="▶️" label="YouTube hours uploaded today"
                  value={fmtBig(secToday * YOUTUBE_PER_SEC)}
                  color="#a78bfa"
                  sublabel="500 hrs/min uploaded" />
              </div>
            </div>

            {/* Nature */}
            <div className="mb-8">
              <SectionHead title="🌳 Nature" color="#2dd4bf" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <CounterCard emoji="🪓" label="Trees cut down today"
                  value={fmtBig(secToday * TREES_CUT_PER_SEC)}
                  color="#f87171" />
                <CounterCard emoji="🌱" label="Trees planted today"
                  value={fmtBig(secToday * TREES_PLANT_PER_SEC)}
                  color="#2dd4bf" />
                <CounterCard emoji="⚡" label="Lightning strikes today"
                  value={fmtBig(secToday * LIGHTNING_PER_SEC)}
                  color="#fbbf24" />
              </div>
            </div>

            {/* Food */}
            <div className="mb-8">
              <SectionHead title="🍔 Food & Drink" color="#fb923c" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <CounterCard emoji="☕" label="Cups of coffee consumed today"
                  value={fmtBig(secToday * COFFEE_PER_SEC)}
                  color="#fb923c"
                  sublabel="~2.25B cups per day worldwide" />
                <CounterCard emoji="🍟" label="McDonald's meals today"
                  value={fmtBig(secToday * MCDONALDS_PER_SEC)}
                  color="#fbbf24" />
              </div>
            </div>
          </div>

          {/* ── THIS YEAR ──────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">📆 This Year So Far ({now.getFullYear()})</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <CounterCard emoji="👶" label="Babies born this year"        value={fmtBig(secThisYear * BIRTHS_PER_SEC)}    color="#4ade80" />
              <CounterCard emoji="💀" label="People died this year"        value={fmtBig(secThisYear * DEATHS_PER_SEC)}    color="#f87171" />
              <CounterCard emoji="📊" label="Population growth this year"  value={fmtBig(secThisYear * NET_PER_SEC)}       color="#2dd4bf" />
              <CounterCard emoji="📈" label="US debt added this year"      value={fmtDebt(secThisYear * DEBT_PER_SEC)}     color="#fbbf24" />
              <CounterCard emoji="🪓" label="Trees cut down this year"     value={fmtBig(secThisYear * TREES_CUT_PER_SEC)} color="#f87171" />
              <CounterCard emoji="📧" label="Emails sent this year"        value={fmtBig(secThisYear * EMAILS_PER_SEC)}    color="#a78bfa" />
              <CounterCard emoji="🔍" label="Google searches this year"    value={fmtBig(secThisYear * GOOGLE_PER_SEC)}    color="#c4b5fd" />
              <CounterCard emoji="☕" label="Cups of coffee this year"     value={fmtBig(secThisYear * COFFEE_PER_SEC)}    color="#fb923c" />
            </div>
          </div>

          {/* ── SHARE ──────────────────────────────────────────────────────── */}
          <ShareButtons
            text={shareText}
            url="https://dayblip.com/world-counters"
            title="World Live Counters"
          />

          {/* ── SOURCES ────────────────────────────────────────────────────── */}
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
                  ["World births",          "140 million/year (→ 4.43/sec)",               "UN World Population Prospects 2024"],
                  ["World deaths",          "58 million/year (→ 1.84/sec)",                "WHO Global Health Estimates"],
                  ["US National Debt growth","~$2.3 trillion/year ($72,920/sec)",            "US Treasury, Congressional Budget Office"],
                  ["World GDP",             "$105 trillion/year",                           "World Bank 2024"],
                  ["Global email volume",   "347 billion/day (→ 4.01M/sec)",               "Statista 2024"],
                  ["Google searches",       "8.5 trillion/year (→ 269K/sec)",              "Google, Statista 2024"],
                  ["Trees cut down",        "15 billion/year",                              "Nature journal, 2015 study"],
                  ["Trees planted",         "1.8 billion/year",                             "Plant-for-the-Planet, FAO"],
                  ["Global coffee",         "~2.25 billion cups/day",                       "ICO 2024"],
                  ["Cigarettes smoked",     "~5.6 trillion/year",                           "WHO"],
                  ["Lightning strikes",     "1.4 billion/year",                             "NOAA"],
                  ["McDonald's meals",      "9 billion/year",                               "McDonald's annual reports"],
                  ["YouTube uploads",       "500 hours per minute",                         "YouTube press statistics"],
                  ["Average heart rate",    "70 bpm",                                       "Medical standard"],
                  ["Average daily steps",   "8,000/day",                                    "CDC guidelines"],
                ].map(([item, val, src]) => (
                  <div key={item} className="flex gap-2">
                    <span className="text-[#e94560] shrink-0">•</span>
                    <span><strong className="text-white">{item}:</strong> {val} ({src})</span>
                  </div>
                ))}
                <p className="text-xs text-[#a8a8b3]/60 pt-2">
                  All figures are estimates based on published global statistics. Actual values vary. Updated annually.
                  Emails use a per-day baseline (347B/day ÷ 86,400 sec). All other annual figures use 365.25-day year (31,557,600 sec).
                </p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}
