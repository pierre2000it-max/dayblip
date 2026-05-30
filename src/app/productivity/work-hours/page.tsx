"use client"
import { useState, useMemo } from "react"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }
function fmtNum(n: number) { return Math.round(n).toLocaleString() }

export default function WorkHoursPage() {
  const [ageStarted, setAgeStarted] = useState("22")
  const [currentAge, setCurrentAge] = useState("35")
  const [hoursPerWeek, setHoursPerWeek] = useState("40")
  const [vacationWeeks, setVacationWeeks] = useState("2")
  const [wageType, setWageType] = useState<"hourly" | "annual">("annual")
  const [wage, setWage] = useState("65000")
  const [copied, setCopied] = useState(false)

  const calc = useMemo(() => {
    const as = parseFloat(ageStarted) || 0
    const ca = parseFloat(currentAge) || 0
    const hpw = parseFloat(hoursPerWeek) || 0
    const vw = parseFloat(vacationWeeks) || 0
    const w = parseFloat(wage) || 0
    const weeksPerYear = 52 - vw
    const hoursPerYear = hpw * weeksPerYear
    const yearsWorked = Math.max(0, ca - as)
    const totalHours = hoursPerYear * yearsWorked
    const hourlyRate = wageType === "hourly" ? w : (hoursPerYear > 0 ? w / hoursPerYear : 0)
    const totalEarned = hourlyRate * totalHours
    const retirementAge = 65
    const hoursLeft = hoursPerYear * Math.max(0, retirementAge - ca)

    // Lifetime earnings with 3% annual raise
    let lifetimeTotal = 0
    let currentSalary = wageType === "annual" ? w : w * hoursPerYear
    for (let i = 0; i < Math.max(0, retirementAge - ca); i++) {
      lifetimeTotal += currentSalary
      currentSalary *= 1.03
    }

    return { totalHours, yearsWorked, totalEarned, hoursLeft, lifetimeTotal, hoursPerYear }
  }, [ageStarted, currentAge, hoursPerWeek, vacationWeeks, wageType, wage])

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Work Hours Calculator</h1>
          <p className="text-[#a8a8b3]">How much of your life have you spent working?</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Age Started Working</span>
              <input type="number" value={ageStarted} onChange={e => setAgeStarted(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Current Age</span>
              <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Hours Per Week</span>
              <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className={inp} /></label>
            <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Vacation Weeks Per Year</span>
              <input type="number" value={vacationWeeks} onChange={e => setVacationWeeks(e.target.value)} className={inp} /></label>
            <div className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Wage Type</span>
              <div className="flex gap-2">
                {(["hourly", "annual"] as const).map(t => (
                  <button key={t} onClick={() => setWageType(t)}
                    className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${wageType === t ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">{wageType === "hourly" ? "Hourly Rate ($)" : "Annual Salary ($)"}</span>
              <input type="number" value={wage} onChange={e => setWage(e.target.value)} className={inp} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Total Hours Worked", value: fmtNum(calc.totalHours) + " hrs", color: "#4FC3F7" },
              { label: "Years at Work", value: calc.yearsWorked + " years", color: "#ffffff" },
              { label: "Total Career Earnings", value: fmt(calc.totalEarned), color: "#F9A825" },
              { label: "Hours Until Retirement (65)", value: fmtNum(calc.hoursLeft) + " hrs", color: "#a8a8b3" },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                <div className="text-2xl font-black" style={{ color: r.color }}>{r.value}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#4ade80]/20 bg-[#1a1a2e] p-5 text-center">
            <div className="text-sm text-[#a8a8b3] mb-1">Projected Lifetime Earnings to 65 (with 3% annual raises)</div>
            <div className="text-3xl font-black text-[#4ade80]">{fmt(calc.lifetimeTotal)}</div>
          </div>

          <button onClick={share} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white hover:opacity-90">
            {copied ? "Copied! ✓" : "Share →"}
          </button>
        </div>
      </section>
    </div>
  )
}
