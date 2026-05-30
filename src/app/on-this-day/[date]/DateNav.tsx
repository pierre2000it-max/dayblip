"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const MONTH_SLUGS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
]

function daysInMonth(month: number): number {
  return new Date(2024, month, 0).getDate()
}

interface DateNavProps {
  currentMonth: number // 1-indexed
  currentDay: number
  currentLabel: string
}

export default function DateNav({ currentMonth, currentDay, currentLabel }: DateNavProps) {
  const router = useRouter()
  const [month, setMonth] = useState(currentMonth)
  const [day, setDay]     = useState(currentDay)

  const maxDays = daysInMonth(month)
  const safeDay = Math.min(day, maxDays)

  const go = () => {
    router.push(`/on-this-day/${MONTH_SLUGS[month - 1]}-${safeDay}`)
  }

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none"

  return (
    <div className="bg-[#0f3460]/40 border-b border-[#0f3460] px-6 py-3">
      <div className="mx-auto max-w-[900px] flex flex-wrap items-center gap-3">
        <span className="text-sm text-[#a8a8b3] shrink-0">
          📅 <span className="text-white font-semibold">Exploring: {currentLabel}</span>
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(1) }} className={sel}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={safeDay} onChange={e => setDay(Number(e.target.value))} className={sel + " w-16"}>
            {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button onClick={go}
            className="rounded-lg bg-[#e94560] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap">
            Go →
          </button>
        </div>
      </div>
    </div>
  )
}
