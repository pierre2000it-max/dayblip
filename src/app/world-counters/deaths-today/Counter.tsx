"use client"
import { useNow } from "@/lib/useNow"

// UN World Population Prospects 2024, 2025 estimates. Must match population/Counter.tsx and births-today/Counter.tsx.
const ANNUAL_BIRTHS = 132_400_000
const ANNUAL_DEATHS = 63_100_000
const SECS_YEAR     = 365.25 * 86_400
const DEATHS_PER_SEC  = ANNUAL_DEATHS / SECS_YEAR
const DEATHS_PER_MIN  = DEATHS_PER_SEC * 60
const DEATHS_PER_HOUR = DEATHS_PER_SEC * 3600
const DEATHS_PER_DAY  = ANNUAL_DEATHS / 365.25
const BIRTHS_PER_SEC  = ANNUAL_BIRTHS / SECS_YEAR

function fmtWhole(n: number) { return Math.floor(n).toLocaleString("en-US") }

export default function DeathsCounter({ initialNow }: { initialNow: number }) {
  const now = useNow(initialNow)
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const secToday = Math.floor((now.getTime() - sod.getTime()) / 1000)
  const deathsToday = secToday * DEATHS_PER_SEC
  const birthsToday = secToday * BIRTHS_PER_SEC

  const cards = [
    { label: "Deaths per second", value: DEATHS_PER_SEC.toFixed(2) },
    { label: "Deaths per minute", value: fmtWhole(DEATHS_PER_MIN) },
    { label: "Deaths per hour", value: fmtWhole(DEATHS_PER_HOUR) },
    { label: "Deaths per day (avg)", value: fmtWhole(DEATHS_PER_DAY) },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#f87171]/40 bg-[#0d1b2a] p-8 text-center">
        <p className="text-[#a8a8b3] mb-2 text-sm uppercase tracking-wide">People who have died today</p>
        <div className="text-5xl md:text-6xl font-black text-[#f87171] tabular-nums">{fmtWhole(deathsToday)}</div>
        <p className="text-[#a8a8b3]/70 text-sm mt-2">and counting, about {DEATHS_PER_SEC.toFixed(1)} per second. Resets at midnight local time.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(s => (
          <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-5 text-center">
            <div className="text-2xl font-black tabular-nums text-[#f87171]">{s.value}</div>
            <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#4ade80]/30 bg-[#0d1b2a] p-5 text-center">
          <div className="text-2xl font-black text-[#4ade80] tabular-nums">{fmtWhole(birthsToday)}</div>
          <div className="text-sm text-[#a8a8b3]">Births so far today</div>
        </div>
        <div className="rounded-xl border border-[#2dd4bf]/30 bg-[#0d1b2a] p-5 text-center">
          <div className="text-2xl font-black text-[#2dd4bf] tabular-nums">+{fmtWhole(birthsToday - deathsToday)}</div>
          <div className="text-sm text-[#a8a8b3]">Net population gain so far today</div>
        </div>
      </div>
    </div>
  )
}
