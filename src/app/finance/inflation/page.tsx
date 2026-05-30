"use client"
import { useState, useMemo } from "react"

const CPI: Record<number, number> = {
  1913: 9.9, 1920: 20.0, 1930: 16.7, 1940: 14.0, 1950: 24.1,
  1960: 29.6, 1970: 38.8, 1975: 53.8, 1980: 82.4, 1985: 107.6,
  1990: 130.7, 1995: 152.4, 2000: 172.2, 2005: 195.3, 2010: 218.1,
  2015: 237.0, 2020: 258.8, 2024: 314.0, 2026: 325.0,
}

const YEARS = Object.keys(CPI).map(Number).sort((a, b) => a - b)

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function InflationPage() {
  const [mode, setMode] = useState<"past" | "present">("past")
  const [amount, setAmount] = useState("100")
  const [fromYear, setFromYear] = useState(1980)
  const [toYear, setToYear] = useState(1980)

  const result = useMemo(() => {
    const a = parseFloat(amount) || 0
    if (mode === "past") {
      const adjusted = (a * CPI[2026]) / CPI[fromYear]
      const pct = ((adjusted - a) / a * 100).toFixed(1)
      return { value: adjusted, label: `$${a} in ${fromYear} = ${fmt(adjusted)} in 2026`, pct: `+${pct}% purchasing power change` }
    } else {
      const adjusted = (a * CPI[toYear]) / CPI[2026]
      const pct = ((adjusted - a) / a * 100).toFixed(1)
      return { value: adjusted, label: `$${a} today = ${fmt(adjusted)} in ${toYear}`, pct: `${pct}% purchasing power change` }
    }
  }, [mode, amount, fromYear, toYear])

  const buyingPowerRows = [1913, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].map(yr => ({
    year: yr,
    value: (100 * CPI[2026]) / CPI[yr],
  }))

  const items = [
    { item: "Gallon of Gas", then: "$0.29 (1970)", now: "$3.50", change: "+1,107%" },
    { item: "Movie Ticket", then: "$1.55 (1970)", now: "$15.00", change: "+868%" },
    { item: "New Car", then: "$3,500 (1970)", now: "$48,000", change: "+1,271%" },
    { item: "New Home", then: "$23,450 (1970)", now: "$420,000", change: "+1,691%" },
    { item: "Loaf of Bread", then: "$0.25 (1970)", now: "$4.50", change: "+1,700%" },
  ]

  const sel = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Inflation Calculator</h1>
          <p className="text-[#a8a8b3]">See how purchasing power has changed over time</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="flex gap-2">
            {([["past", "📅 Past → Today"], ["present", "🕐 Today → Past"]] as const).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-3 font-semibold text-sm transition-colors ${mode === m ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">Amount ($)</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            {mode === "past" ? (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">From Year</span>
                <select value={fromYear} onChange={e => setFromYear(Number(e.target.value))} className={sel}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            ) : (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Equivalent in Year</span>
                <select value={toYear} onChange={e => setToYear(Number(e.target.value))} className={sel}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
            )}
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-4 text-center">
              <div className="text-2xl font-black text-[#F9A825]">{fmt(result.value)}</div>
              <div className="text-xs text-[#a8a8b3] mt-1">{result.pct}</div>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
            <p className="font-semibold text-white text-center">{result.label}</p>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">💵 What was $100 worth? (in 2026 dollars)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Year</th>
                  <th className="py-2 text-right text-[#a8a8b3]">$100 then = today</th>
                </tr></thead>
                <tbody>{buyingPowerRows.map(r => (
                  <tr key={r.year} className="border-b border-[#0f3460]/50">
                    <td className="py-2 text-white">{r.year}</td>
                    <td className="py-2 text-right text-[#F9A825]">{fmt(r.value)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h2 className="mb-3 font-bold text-white">🛒 Common Items — Then vs Now</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#0f3460]">
                  <th className="py-2 text-left text-[#a8a8b3]">Item</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Then</th>
                  <th className="py-2 text-center text-[#a8a8b3]">Now</th>
                  <th className="py-2 text-right text-[#a8a8b3]">Change</th>
                </tr></thead>
                <tbody>{items.map(r => (
                  <tr key={r.item} className="border-b border-[#0f3460]/50">
                    <td className="py-2 text-white">{r.item}</td>
                    <td className="py-2 text-center text-[#a8a8b3]">{r.then}</td>
                    <td className="py-2 text-center text-white">{r.now}</td>
                    <td className="py-2 text-right text-[#e94560]">{r.change}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-[#a8a8b3]">CPI data based on US Bureau of Labor Statistics. For educational purposes only.</p>
        </div>
      </section>
    </div>
  )
}
