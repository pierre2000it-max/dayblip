"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function pad(n: number) { return String(Math.floor(n)).padStart(2, "0") }

export default function MeetingCostPage() {
  const [mode, setMode] = useState<"timer" | "manual">("timer")
  const [timerAttendees, setTimerAttendees] = useState("5")
  const [timerRate, setTimerRate] = useState("75")
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [manualMins, setManualMins] = useState("60")
  const [manualAttendees, setManualAttendees] = useState("5")
  const [manualRate, setManualRate] = useState("75")

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const timerCostPerSec = (parseFloat(timerAttendees) || 0) * (parseFloat(timerRate) || 0) / 3600
  const timerCost = elapsed * timerCostPerSec

  const manualCost = (parseFloat(manualAttendees) || 0) * (parseFloat(manualRate) || 0) * (parseFloat(manualMins) || 0) / 60
  const costPerAttendee = manualCost / (parseFloat(manualAttendees) || 1)
  const annualWeekly = manualCost * 52

  const coffees = Math.round(manualCost / 6)
  const gas = Math.round(manualCost / 60)
  const netflix = Math.round(manualCost / 16)

  const inp = "rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Meeting Cost Calculator</h1>
          <p className="text-[#a8a8b3]">Find out what your meetings are really costing</p>
        </div>
      </section>
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="flex gap-2">
            {([["timer", "⏱️ Live Timer"], ["manual", "📊 Manual"]] as const).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-3 font-semibold transition-colors ${mode === m ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "timer" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Attendees</span>
                  <input type="number" value={timerAttendees} onChange={e => setTimerAttendees(e.target.value)} className={inp} /></label>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Hourly Rate per Person ($)</span>
                  <input type="number" value={timerRate} onChange={e => setTimerRate(e.target.value)} className={inp} /></label>
              </div>
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-8 text-center">
                <div className="text-5xl font-black text-[#e94560] tabular-nums">
                  {fmt(timerCost)}
                </div>
                <div className="text-[#a8a8b3] mt-2">
                  {pad(Math.floor(elapsed / 3600))}:{pad((elapsed % 3600) / 60)}:{pad(elapsed % 60)}
                </div>
                <button
                  onClick={() => { if (running) { setRunning(false) } else { setElapsed(0); setRunning(true) } }}
                  className={`mt-4 rounded-lg px-8 py-3 font-bold text-white transition-colors ${running ? "bg-gray-600 hover:bg-gray-500" : "bg-[#e94560] hover:opacity-90"}`}>
                  {running ? "⏹ Stop" : "▶ Start Meeting"}
                </button>
                {!running && elapsed > 0 && (
                  <button onClick={() => setElapsed(0)} className="ml-3 text-sm text-[#a8a8b3] hover:text-white">Reset</button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Duration (min)</span>
                  <input type="number" value={manualMins} onChange={e => setManualMins(e.target.value)} className={inp} /></label>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Attendees</span>
                  <input type="number" value={manualAttendees} onChange={e => setManualAttendees(e.target.value)} className={inp} /></label>
                <label className="flex flex-col gap-1"><span className="text-sm font-semibold text-white">Hourly Rate ($)</span>
                  <input type="number" value={manualRate} onChange={e => setManualRate(e.target.value)} className={inp} /></label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-[#e94560]">{fmt(manualCost)}</div>
                  <div className="text-sm text-[#a8a8b3]">Total Meeting Cost</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-white">{fmt(costPerAttendee)}</div>
                  <div className="text-sm text-[#a8a8b3]">Per Attendee</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
                  <div className="text-2xl font-black text-[#F9A825]">{fmt(annualWeekly)}</div>
                  <div className="text-sm text-[#a8a8b3]">Annual if Weekly</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="mb-3 font-bold text-white">🤔 That&apos;s equivalent to...</h2>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div><div className="font-bold text-white">{coffees}</div><div className="text-[#a8a8b3]">Starbucks coffees</div></div>
                  <div><div className="font-bold text-white">{gas}</div><div className="text-[#a8a8b3]">Tanks of gas</div></div>
                  <div><div className="font-bold text-white">{netflix}</div><div className="text-[#a8a8b3]">Months of Netflix</div></div>
                </div>
              </div>

              <ShareButtons
                text={`Our ${manualAttendees}-person meeting cost $${manualCost.toFixed(2)} in salary time! 😱`}
                url="https://dayblip.com/productivity/meeting-cost"
                title="Meeting Cost Calculator"
              />
            </div>
          )}

          <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-5">
            <h2 className="mb-2 font-bold text-white">💡 Productivity Tips</h2>
            <ul className="text-sm text-[#a8a8b3] space-y-1">
              <li>• Set a clear agenda and share it 24 hours before the meeting</li>
              <li>• Invite only essential decision-makers — every extra person multiplies the cost</li>
              <li>• End 5 minutes early to give attendees a buffer for their next commitment</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
