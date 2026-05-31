"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import Link from "next/link"

const ANNUAL_BIRTHS   = 140_000_000
const ANNUAL_DEATHS   = 58_000_000
const BIRTHS_PER_SEC  = ANNUAL_BIRTHS / 31_557_600
const BIRTHS_PER_MIN  = BIRTHS_PER_SEC * 60
const BIRTHS_PER_HOUR = BIRTHS_PER_SEC * 3600
const BIRTHS_PER_DAY  = ANNUAL_BIRTHS / 365

const DEATHS_PER_SEC = ANNUAL_DEATHS / 31_557_600

function fmtWhole(n: number) { return Math.floor(n).toLocaleString() }
function fmtBig(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`
  return fmtWhole(n)
}

export default function BirthdaysTodayPage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Always use fresh new Date() to avoid SSR/hydration mismatch
  const now     = new Date()
  const sod     = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const secToday = Math.floor((now.getTime() - sod.getTime()) / 1000)

  void tick  // consumed to force re-render each second

  const birthsToday = secToday * BIRTHS_PER_SEC
  const deathsToday = secToday * DEATHS_PER_SEC

  // Progress toward next 1000 births milestone
  const nextMilestone = Math.ceil(birthsToday / 1000) * 1000
  const prevMilestone = nextMilestone - 1000
  const progressToNext = birthsToday - prevMilestone
  const pct = (progressToNext / 1000) * 100
  const secsToNextK = (nextMilestone - birthsToday) / BIRTHS_PER_SEC

  const hoursLeft = Math.floor(secsToNextK / 3600)
  const minsLeft  = Math.floor((secsToNextK % 3600) / 60)
  const secsLeft  = Math.floor(secsToNextK % 60)

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">👶</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Babies Born Today — Live Counter</h1>
          <p className="text-[#a8a8b3]">Every second, {BIRTHS_PER_SEC.toFixed(2)} babies are born somewhere in the world</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          {/* Big births today counter */}
          <div className="rounded-xl border border-[#4ade80]/40 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">Babies Born Today</p>
            <div className="text-5xl md:text-6xl font-black text-[#4ade80] tabular-nums">{fmtWhole(birthsToday)}</div>
            <p className="text-[#a8a8b3]/70 text-sm mt-2">and counting — {BIRTHS_PER_SEC.toFixed(2)} per second</p>
          </div>

          {/* Next 1000 milestone */}
          <div className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5">
            <h2 className="font-bold text-white mb-3">🎯 Next 1,000 Births Milestone: {nextMilestone.toLocaleString()}</h2>
            <div className="h-4 rounded-full bg-[#16213e] overflow-hidden mb-2">
              <div className="h-full rounded-full bg-[#4ade80] transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[#a8a8b3]">
              <span>{fmtWhole(progressToNext)} / 1,000</span>
              <span>Next milestone in ~{String(hoursLeft).padStart(2,"0")}:{String(minsLeft).padStart(2,"0")}:{String(secsLeft).padStart(2,"0")}</span>
            </div>
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Births per second", value: BIRTHS_PER_SEC.toFixed(2), color: "#4ade80" },
              { label: "Births per minute", value: fmtWhole(BIRTHS_PER_MIN), color: "#86efac" },
              { label: "Births per hour", value: fmtWhole(BIRTHS_PER_HOUR), color: "#4ade80" },
              { label: "Births per day (avg)", value: fmtWhole(BIRTHS_PER_DAY), color: "#2dd4bf" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Births vs Deaths today */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Births vs Deaths Today</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#4ade80]/30 bg-[#0d1b2a] p-5 text-center">
                <div className="text-3xl mb-1">👶</div>
                <div className="text-2xl font-black text-[#4ade80] tabular-nums">{fmtBig(birthsToday)}</div>
                <div className="text-sm text-[#a8a8b3]">Born today</div>
              </div>
              <div className="rounded-xl border border-[#f87171]/30 bg-[#0d1b2a] p-5 text-center">
                <div className="text-3xl mb-1">💀</div>
                <div className="text-2xl font-black text-[#f87171] tabular-nums">{fmtBig(deathsToday)}</div>
                <div className="text-sm text-[#a8a8b3]">Deaths today</div>
              </div>
              <div className="rounded-xl border border-[#2dd4bf]/30 bg-[#0d1b2a] p-5 text-center">
                <div className="text-3xl mb-1">📈</div>
                <div className="text-2xl font-black text-[#2dd4bf] tabular-nums">+{fmtBig(birthsToday - deathsToday)}</div>
                <div className="text-sm text-[#a8a8b3]">Net population gain today</div>
              </div>
            </div>
          </div>

          <ShareButtons
            text={`${fmtWhole(birthsToday)} babies have been born today so far! A new baby arrives every 0.44 seconds. Watch it tick live:`}
            url="https://dayblip.com/world-counters/births-today"
            title="Babies Born Today — Live Counter"
          />

          <p className="text-xs text-[#a8a8b3]/60">Source: UN World Population Prospects 2024 — 140 million births per year. Figures are estimates. Resets at midnight local time.</p>
        </div>
      </section>
    </div>
  )
}
