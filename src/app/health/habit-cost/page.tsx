"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const TABS = ["Smoking", "Coffee", "Alcohol", "Fast Food", "Streaming", "Shopping"]

const UNITS: Record<string, string> = {
  Smoking: "packs", Coffee: "cups", Alcohol: "drinks", "Fast Food": "meals", Streaming: "months", Shopping: "purchases",
}

const TIME_PER_UNIT: Record<string, number> = {
  Smoking: 10, Coffee: 15, Alcohol: 30, "Fast Food": 20, Streaming: 90, Shopping: 45,
}

function fv(annual: number, years: number, rate: number) {
  // future value of annuity
  if (rate === 0) return annual * years
  return annual * ((Math.pow(1 + rate, years) - 1) / rate)
}

export default function HabitCostPage() {
  const [tab, setTab] = useState("Smoking")
  const [costStr, setCostStr] = useState("15")
  const [freq, setFreq] = useState<"daily" | "weekly">("daily")
  const [years, setYears] = useState("10")
  const [ageStarted, setAgeStarted] = useState("20")

  const calc = useMemo(() => {
    const cost = parseFloat(costStr) || 0
    const yrs = parseFloat(years) || 0
    const dailyCost = freq === "daily" ? cost : cost / 7
    const annualCost = dailyCost * 365
    const totalSpent = annualCost * yrs
    const dailyUnits = freq === "daily" ? 1 : 1 / 7
    const totalUnits = Math.round(dailyUnits * 365 * yrs)
    const minutesPerDay = dailyUnits * TIME_PER_UNIT[tab]
    const totalMinutes = minutesPerDay * 365 * yrs
    const totalDays = Math.floor(totalMinutes / 1440)
    const totalHours = Math.floor((totalMinutes % 1440) / 60)
    const investValue = fv(annualCost, yrs, 0.07)
    return { totalSpent, totalUnits, totalDays, totalHours, investValue }
  }, [costStr, freq, years, tab])

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">How Much Has Your Habit Cost You?</h1>
          <p className="text-[#a8a8b3]">The shocking true cost of everyday habits</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === t ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Cost per {freq === "daily" ? "day" : "week"} ($)</span>
              <input type="number" step="0.5" value={costStr} onChange={e => setCostStr(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Frequency</span>
              <div className="flex gap-2">
                {(["daily", "weekly"] as const).map(f => (
                  <button key={f} onClick={() => setFreq(f)}
                    className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${freq === f ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Years of habit</span>
              <input type="number" value={years} onChange={e => setYears(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Age started</span>
              <input type="number" value={ageStarted} onChange={e => setAgeStarted(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { emoji: "💰", label: "Total Spent", value: fmt(calc.totalSpent), color: "#e94560" },
              { emoji: "📦", label: `Total ${UNITS[tab]}`, value: calc.totalUnits.toLocaleString(), color: "#F9A825" },
              { emoji: "⏰", label: "Time Spent", value: `${calc.totalDays} days, ${calc.totalHours} hrs`, color: "#a8a8b3" },
              { emoji: "📈", label: "If Invested @ 7%", value: fmt(calc.investValue), color: "#4ade80" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                <div className="text-3xl mb-1">{r.emoji}</div>
                <div className="text-2xl font-black" style={{ color: r.color }}>{r.value}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">{r.label}</div>
              </div>
            ))}
          </div>

          <ShareButtons
            text={`My ${tab} habit has cost me ${fmt(calc.totalSpent)} over ${years} years! Calculate yours. (Educational only)`}
            url="https://dayblip.com/health/habit-cost"
            title="Habit Cost Calculator"
          />
        </div>
      </section>
    </div>
  )
}
