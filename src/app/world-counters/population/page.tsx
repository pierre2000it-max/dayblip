"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import Link from "next/link"

const ANNUAL_BIRTHS = 140_000_000
const ANNUAL_DEATHS = 58_000_000
const ANNUAL_NET    = ANNUAL_BIRTHS - ANNUAL_DEATHS
const SECS_YEAR     = 31_557_600
const WORLD_POP_NOW = 8_200_000_000

function secondsToday(now: Date): number {
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return (now.getTime() - sod.getTime()) / 1000
}
function secondsSinceJan1(now: Date): number {
  const jan1 = new Date(now.getFullYear(), 0, 1)
  return (now.getTime() - jan1.getTime()) / 1000
}
function fmtWhole(n: number) { return Math.floor(n).toLocaleString() }
function fmtBig(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(3)} billion`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`
  return fmtWhole(n)
}

export default function PopulationCounterPage() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const secToday  = secondsToday(now)
  const secThisYr = secondsSinceJan1(now)
  const currentPop = Math.floor(WORLD_POP_NOW + secThisYr * (ANNUAL_NET / SECS_YEAR))
  const birthsToday  = secToday * (ANNUAL_BIRTHS / 86400)
  const deathsToday  = secToday * (ANNUAL_DEATHS / 86400)
  const birthsPerSec = ANNUAL_BIRTHS / SECS_YEAR
  const deathsPerSec = ANNUAL_DEATHS / SECS_YEAR

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌱</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">World Population Live Counter</h1>
          <p className="text-[#a8a8b3]">Real-time births, deaths, and population growth — updated every second</p>
          <Link href="/world-counters" className="mt-4 inline-block text-sm text-[#4FC3F7] hover:underline">← All World Counters</Link>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-10">

          {/* Live world population */}
          <div className="rounded-xl border border-[#4ade80]/30 bg-[#0d1b2a] p-8 text-center">
            <p className="text-[#a8a8b3] mb-2 text-sm">Current World Population (estimated)</p>
            <div className="text-5xl md:text-6xl font-black text-[#4ade80] tabular-nums">{currentPop.toLocaleString()}</div>
            <p className="text-[#a8a8b3]/70 text-xs mt-2">Growing by ~{(ANNUAL_NET / SECS_YEAR).toFixed(2)} people per second</p>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { emoji: "👶", label: "Births per second", value: birthsPerSec.toFixed(2), color: "#4ade80" },
              { emoji: "💀", label: "Deaths per second", value: deathsPerSec.toFixed(2), color: "#f87171" },
              { emoji: "📈", label: "Net gain per second", value: (birthsPerSec - deathsPerSec).toFixed(2), color: "#2dd4bf" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Today */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Today So Far</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { emoji: "👶", label: "Births today", value: fmtBig(birthsToday), color: "#4ade80" },
                { emoji: "💀", label: "Deaths today", value: fmtBig(deathsToday), color: "#f87171" },
                { emoji: "📊", label: "Net population change today", value: `+${fmtBig(birthsToday - deathsToday)}`, color: "#2dd4bf" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* This year */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">This Year So Far ({now.getFullYear()})</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { emoji: "👶", label: "Births this year", value: fmtBig(secThisYr * (ANNUAL_BIRTHS / SECS_YEAR)), color: "#4ade80" },
                { emoji: "💀", label: "Deaths this year", value: fmtBig(secThisYr * (ANNUAL_DEATHS / SECS_YEAR)), color: "#f87171" },
                { emoji: "📊", label: "Population growth this year", value: `+${fmtBig(secThisYr * (ANNUAL_NET / SECS_YEAR))}`, color: "#2dd4bf" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`The world population is currently ${currentPop.toLocaleString()} and ${fmtBig(birthsToday)} babies have been born today! Watch it live:`}
            url="https://dayblip.com/world-counters/population"
            title="World Population Live Counter"
          />

          <p className="text-xs text-[#a8a8b3]/60">Sources: UN World Population Prospects 2024 — 140M births/year, 58M deaths/year. Figures are estimates.</p>
        </div>
      </section>
    </div>
  )
}
