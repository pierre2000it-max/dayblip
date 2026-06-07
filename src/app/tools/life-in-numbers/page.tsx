"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

interface Stat { label: string; value: number; color?: string; prefix?: string }

const f = (n: number) => Math.floor(n).toLocaleString()

function Section({ title, stats }: { title: string; stats: Stat[] }) {
  return (
    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
      <h3 className="mb-4 font-bold text-white">{title}</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-3 text-center">
            <div className="font-black tabular-nums" style={{ color: s.color ?? "#ffffff" }}>{s.prefix ?? ""}{f(s.value)}</div>
            <div className="mt-1 text-xs text-[#a8a8b3]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LifeInNumbersPage() {
  const [dob, setDob] = useState("1990-01-01")
  const [time, setTime] = useState("")
  const [active, setActive] = useState(false)
  const [secBorn, setSecBorn] = useState(0)

  function start(push = true, d = dob, t = time) {
    const dt = new Date(t ? `${d}T${t}` : `${d}T00:00:00`)
    if (isNaN(dt.getTime()) || dt.getTime() > Date.now()) return
    setActive(true)
    setSecBorn((Date.now() - dt.getTime()) / 1000)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?dob=${d}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const d = p.get("dob")
    if (d) {
      setDob(d)
      start(false, d, "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!active) return
    const dt = new Date(time ? `${dob}T${time}` : `${dob}T00:00:00`)
    const id = setInterval(() => {
      setSecBorn((Date.now() - dt.getTime()) / 1000)
    }, 1000)
    return () => clearInterval(id)
  }, [active, dob, time])

  const timeLived: Stat[] = [
    { label: "Days alive", value: secBorn / 86400 },
    { label: "Hours", value: secBorn / 3600 },
    { label: "Minutes", value: secBorn / 60 },
    { label: "Seconds (live)", value: secBorn, color: "#e94560" },
    { label: "Weeks", value: secBorn / 604800 },
    { label: "Months", value: secBorn / 2629800 },
  ]
  const body: Stat[] = [
    { label: "Heart beats", value: secBorn * 1.1667, color: "#e94560" },
    { label: "Breaths taken", value: secBorn * 0.267 },
    { label: "Steps taken", value: (secBorn / 86400) * 8000 },
    { label: "Blinks", value: secBorn * 0.267 },
    { label: "Calories burned", value: (secBorn / 86400) * 2000 },
  ]
  const sleep: Stat[] = [
    { label: "Days slept", value: (secBorn / 86400) * 0.333, color: "#F9A825" },
  ]
  const world: Stat[] = [
    { label: "Babies born since you", value: secBorn * 4.44 },
    { label: "People died since you", value: secBorn * 1.84 },
    { label: "US debt increase since born", value: secBorn * 72920, prefix: "$" },
  ]

  const heartbeats = f(secBorn * 1.1667)
  const breaths = f(secBorn * 0.267)
  const daysSlept = f((secBorn / 86400) * 0.333)

  const shareUrl = `https://www.dayblip.com/tools/life-in-numbers?dob=${dob}`
  const shareText = `My heart has beaten ${heartbeats} times!\nI have taken ${breaths} breaths!\nI have slept ${daysSlept} days of my life!`

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Life in Numbers — Your Life as Fascinating Statistics</h1>
          <p className="text-[#a8a8b3]">Your entire life summarized in fascinating live statistics</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">In your lifetime your heart beats approximately 2.5 billion times. You breathe about 600 million breaths. You sleep roughly one third of your entire life. The average person walks 100,000 miles in a lifetime — equivalent to circling the Earth four times. You spend approximately 6 months of your life waiting at red traffic lights.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Life in numbers transforms your age into fascinating biological and behavioral statistics that reveal the extraordinary scale of ordinary human experience. By entering your birth date this tool shows live-updating counts of your heartbeats, breaths, steps and other measurable life events — giving a striking perspective on the scope of a single human life.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Your birth date</span>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Birth time (optional)</span>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>
          <button onClick={() => start()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Show My Numbers
          </button>

          {active && (
            <div className="space-y-6">
              <Section title="⏱️ Time Lived" stats={timeLived} />
              <Section title="❤️ Body Stats" stats={body} />
              <Section title="😴 Sleep" stats={sleep} />
              <Section title="🌍 The World While You Lived" stats={world} />
              <ShareButtons text={shareText} url={shareUrl} title="Your Life in Numbers" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
