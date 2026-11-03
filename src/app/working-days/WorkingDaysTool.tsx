"use client"
import { useState } from "react"
import { federalHolidays, weekdaysInMonth, workingDaysInMonth, workingDaysInYear, weekdaysInYear, MONTH_NAMES } from "@/lib/workingDays"

const YEARS = Array.from({ length: 16 }, (_, i) => 2020 + i)
const th = { textAlign: "left" as const, padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560", whiteSpace: "nowrap" as const }
const td = { padding: "8px 12px", borderBottom: "1px solid #0f3460" }

function fmtDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number)
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][w]}, ${MONTH_NAMES[m - 1].slice(0, 3)} ${d}`
}

export default function WorkingDaysTool() {
  const [year, setYear] = useState(2026)
  const weekdays = weekdaysInYear(year)
  const working = workingDaysInYear(year)
  const holidays = federalHolidays(year)

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
        <label htmlFor="wd-year" className="mb-2 block text-sm font-semibold text-white">Choose a year</label>
        <select
          id="wd-year"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
        >
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: `Working days in ${year}`, value: working },
            { label: "Weekdays (Mon to Fri)", value: weekdays },
            { label: "Federal holidays on weekdays", value: holidays.length },
            { label: "Working hours at 8 a day", value: working * 8 },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#0d1b2a] p-4 text-center">
              <div className="text-2xl font-black tabular-nums text-[#e94560]">{s.value.toLocaleString("en-US")}</div>
              <div className="mt-1 text-xs text-[#a8a8b3]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Working days by month in {year}</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
            <thead><tr><th scope="col" style={th}>Month</th><th scope="col" style={th}>Weekdays</th><th scope="col" style={th}>Holidays</th><th scope="col" style={th}>Working days</th></tr></thead>
            <tbody>
              {MONTH_NAMES.map((name, i) => {
                const wd = weekdaysInMonth(year, i + 1)
                const wk = workingDaysInMonth(year, i + 1)
                return (
                  <tr key={name} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                    <td style={td}>{name}</td><td style={td}>{wd}</td><td style={td}>{wd - wk}</td><td style={td}>{wk}</td>
                  </tr>
                )
              })}
              <tr style={{ background: "#0f3460", fontWeight: 700 }}>
                <td style={td}>Total</td><td style={td}>{weekdays}</td><td style={td}>{holidays.length}</td><td style={td}>{working}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>US federal holidays in {year}</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
            <thead><tr><th scope="col" style={th}>Holiday</th><th scope="col" style={th}>Date</th><th scope="col" style={th}>Day off</th></tr></thead>
            <tbody>
              {holidays.map((h, i) => (
                <tr key={h.name} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                  <td style={td}>{h.name}</td>
                  <td style={td}>{fmtDate(h.actual)}</td>
                  <td style={td}>{fmtDate(h.observed)}{h.actual !== h.observed ? " (observed)" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
