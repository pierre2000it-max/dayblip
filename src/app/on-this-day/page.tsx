"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

const MONTH_SLUGS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
]

function daysInMonth(month: number): number {
  // month is 1-indexed. Use a leap year (2024) for Feb.
  return new Date(2024, month, 0).getDate()
}

const POPULAR_DATES = [
  { slug: "january-1",    label: "January 1" },
  { slug: "january-15",   label: "January 15" },
  { slug: "february-14",  label: "February 14" },
  { slug: "march-14",     label: "March 14" },
  { slug: "april-15",     label: "April 15" },
  { slug: "july-4",       label: "July 4" },
  { slug: "august-6",     label: "August 6" },
  { slug: "september-11", label: "September 11" },
  { slug: "october-31",   label: "October 31" },
  { slug: "november-22",  label: "November 22" },
  { slug: "december-25",  label: "December 25" },
  { slug: "december-31",  label: "December 31" },
]

export default function OnThisDayLandingPage() {
  const router = useRouter()
  const [month, setMonth] = useState(1)
  const [day, setDay]     = useState(1)

  const maxDays = daysInMonth(month)
  const safeDay = Math.min(day, maxDays)

  const go = () => {
    router.push(`/on-this-day/${MONTH_SLUGS[month - 1]}-${safeDay}`)
  }

  const goToday = () => {
    const today = new Date()
    const slug  = `${MONTH_SLUGS[today.getMonth()]}-${today.getDate()}`
    router.push(`/on-this-day/${slug}`)
  }

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Hero */}
      <section className="px-6 py-20 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📅</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">On This Day in History</h1>
          <p className="text-lg text-[#a8a8b3]">
            Select any date to discover historical events, famous birthdays and scientific discoveries
          </p>
        </div>
      </section>

      {/* Date selector */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px] space-y-6">

          {/* Today shortcut */}
          <button onClick={goToday}
            className="w-full rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 py-4 text-lg font-bold text-[#e94560] transition-colors hover:bg-[#e94560]/20">
            🗓️ See Today&apos;s History →
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#0f3460]" />
            <span className="text-[#a8a8b3] text-sm">or pick any date</span>
            <div className="flex-1 h-px bg-[#0f3460]" />
          </div>

          {/* Month + Day selectors */}
          <div className="flex gap-3">
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Month</span>
              <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1) }} className={sel}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </label>
            <label className="w-28 flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Day</span>
              <select value={safeDay} onChange={e => setDay(Number(e.target.value))} className={sel}>
                {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>

          <button onClick={go}
            className="w-full rounded-xl bg-[#e94560] py-4 text-lg font-bold text-white transition-opacity hover:opacity-90">
            Show History for {MONTHS[month - 1]} {safeDay} →
          </button>

          {/* Fun prompt */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
            <p className="text-[#a8a8b3] leading-relaxed">
              What major event happened on your birthday?<br />
              Who shares your birthday in history?<br />
              <span className="text-white font-semibold">Select a date to find out.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Popular dates */}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-6 text-center text-xl font-bold text-white">📌 Popular Dates</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_DATES.map(d => (
              <Link key={d.slug} href={`/on-this-day/${d.slug}`}
                className="rounded-full border border-[#0f3460] bg-[#16213e] px-5 py-2.5 text-white font-semibold transition-colors hover:border-[#e94560] hover:bg-[#e94560]/10">
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
