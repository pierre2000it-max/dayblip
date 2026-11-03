"use client"
import { useState } from "react"
import { hoursMinutesToDecimal, decimalToHoursMinutes } from "@/lib/timeDecimal"

const input = "w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

export default function TimeDecimalTool() {
  const [h, setH] = useState("8")
  const [m, setM] = useState("20")
  const [dec, setDec] = useState("8.33")

  const hn = Math.max(0, Number(h) || 0)
  const mn = Math.min(59, Math.max(0, Number(m) || 0))
  const toDec = hoursMinutesToDecimal(hn, mn)
  const dn = Math.max(0, Number(dec) || 0)
  const back = decimalToHoursMinutes(dn)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
        <h2 className="mb-4 font-bold text-white">Hours and minutes to decimal</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="td-h" className="mb-1 block text-sm text-[#a8a8b3]">Hours</label>
            <input id="td-h" inputMode="numeric" className={input} value={h} onChange={e => setH(e.target.value)} />
          </div>
          <div>
            <label htmlFor="td-m" className="mb-1 block text-sm text-[#a8a8b3]">Minutes</label>
            <input id="td-m" inputMode="numeric" className={input} value={m} onChange={e => setM(e.target.value)} />
          </div>
        </div>
        <p className="mt-4 text-3xl font-black tabular-nums text-[#e94560]">{toDec.toFixed(2)} hours</p>
        <p className="text-sm text-[#a8a8b3]">{hn} h {mn} min = {toDec.toFixed(2)} decimal hours</p>
      </div>

      <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
        <h2 className="mb-4 font-bold text-white">Decimal hours to hours and minutes</h2>
        <label htmlFor="td-d" className="mb-1 block text-sm text-[#a8a8b3]">Decimal hours</label>
        <input id="td-d" inputMode="decimal" className={input} value={dec} onChange={e => setDec(e.target.value)} />
        <p className="mt-4 text-3xl font-black tabular-nums text-[#e94560]">{back.hours} h {back.minutes} min</p>
        <p className="text-sm text-[#a8a8b3]">{dn.toFixed(2)} decimal hours = {back.hours} hours {back.minutes} minutes</p>
      </div>
    </div>
  )
}
