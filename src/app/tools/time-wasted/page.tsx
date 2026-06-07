"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const SKILLS = [
  { name: "Conversational Spanish", hours: 600 },
  { name: "Web development basics", hours: 500 },
  { name: "Play guitar (beginner)", hours: 150 },
  { name: "Write a book", hours: 200 },
  { name: "Real estate license", hours: 150 },
  { name: "Learn Photoshop", hours: 100 },
  { name: "Personal finance mastery", hours: 40 },
  { name: "Public speaking", hours: 80 },
  { name: "Speed reading", hours: 20 },
  { name: "Touch typing", hours: 40 },
  { name: "Basic video editing", hours: 150 },
  { name: "Cook 50 new recipes", hours: 100 },
  { name: "Run a 5K", hours: 60 },
  { name: "Run a marathon", hours: 400 },
  { name: "Meditate daily practice", hours: 30 },
  { name: "Learn chess (intermediate)", hours: 200 },
  { name: "Social media marketing", hours: 80 },
  { name: "Basic accounting", hours: 120 },
  { name: "Copywriting skills", hours: 100 },
  { name: "Drawing fundamentals", hours: 200 },
]

interface Result {
  social: number; tv: number; gaming: number; browsing: number; other: number; years: number
  totalHours: number; days: number; months: number; pctWaking: number
  topSkill: string
}

function Field({ label, val, set }: { label: string; val: string; set: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-white">{label} (hrs/day)</span>
      <input type="number" min={0} step={0.5} value={val} onChange={e => set(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
    </label>
  )
}

function compute(social: number, tv: number, gaming: number, browsing: number, other: number, years: number): Result {
  const totalHours = (social + tv + gaming + browsing + other) * 365 * years
  const days = totalHours / 24
  const months = days / 30.44
  const pctWaking = (totalHours / (16 * 365 * years)) * 100
  const achievable = SKILLS.filter(s => totalHours >= s.hours).sort((a, b) => b.hours - a.hours)
  const topSkill = achievable[0]?.name ?? "build a small daily habit"
  return { social, tv, gaming, browsing, other, years, totalHours, days, months, pctWaking, topSkill }
}

export default function TimeWastedPage() {
  const [social, setSocial] = useState("2")
  const [tv, setTv] = useState("2")
  const [gaming, setGaming] = useState("1")
  const [browsing, setBrowsing] = useState("1")
  const [other, setOther] = useState("0")
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true) {
    const res = compute(+social || 0, +tv || 0, +gaming || 0, +browsing || 0, +other || 0, years)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?social=${+social || 0}&tv=${+tv || 0}&gaming=${+gaming || 0}&browsing=${+browsing || 0}&years=${years}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("social") || p.get("tv") || p.get("years")) {
      const s = p.get("social") ?? "2", t = p.get("tv") ?? "2", g = p.get("gaming") ?? "1", b = p.get("browsing") ?? "1", o = p.get("other") ?? "0", y = p.get("years") ?? "5"
      setSocial(s); setTv(t); setGaming(g); setBrowsing(b); setOther(o); setYears(Number(y))
      setResult(compute(+s, +t, +g, +b, +o, +y))
    }
  }, [])

  const total = result?.totalHours ?? 0
  const skillStatus = (h: number) => total >= h ? "ok" : total >= h * 0.8 ? "close" : "no"

  const futureSkills = result ? SKILLS.filter(s => 365 >= s.hours).sort((a, b) => a.hours - b.hours) : []

  const shareUrl = result ? `https://www.dayblip.com/tools/time-wasted?social=${result.social}&tv=${result.tv}&years=${result.years}` : ""
  const shareText = result
    ? `I have spent ${Math.round(result.days).toLocaleString()} days of my life on screens 😮\nI could have learned ${result.topSkill} in that time!`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Screen Time Cost Calculator — What Could You Learn With That Time?</h1>
          <p className="text-[#a8a8b3]">Turn daily minutes into life-changing skills and achievements</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average American spends 7 hours per day on screens — 2,555 hours per year. That is equivalent to 106 full days of waking hours annually spent on devices. In that same time a person could learn a new language (600 hours), get a professional certification (200 hours) and read 100 books (250 hours) with time to spare.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Screen time cost calculators convert daily device usage into opportunity cost — the skills, books, languages and experiences that same time could produce. The average person will spend approximately 44 years of waking hours on screens across their lifetime. This tool shows what that time could be worth if redirected to deliberate learning and skill building.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Social media" val={social} set={setSocial} />
            <Field label="TV / streaming" val={tv} set={setTv} />
            <Field label="Gaming" val={gaming} set={setGaming} />
            <Field label="Browsing internet" val={browsing} set={setBrowsing} />
            <Field label="Other" val={other} set={setOther} />
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Years doing this: {years}</span>
            <input type="range" min={1} max={20} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
          </label>
          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Show What I Could Have Done
          </button>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center text-white">
                <div className="mb-2 text-sm text-[#a8a8b3]">You have spent approximately:</div>
                <div className="text-4xl font-black text-[#e94560]">{Math.round(result.totalHours).toLocaleString()} hours</div>
                <div className="mt-2 text-sm text-[#a8a8b3]">= {Math.round(result.days).toLocaleString()} days = {Math.round(result.months).toLocaleString()} months = {result.pctWaking.toFixed(1)}% of your waking life</div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 font-bold text-white">What you could have learned</h3>
                <ul className="space-y-2 text-sm">
                  {[...SKILLS].sort((a, b) => {
                    const order = (s: typeof a) => skillStatus(s.hours) === "ok" ? 0 : skillStatus(s.hours) === "close" ? 1 : 2
                    return order(a) - order(b) || a.hours - b.hours
                  }).map(s => {
                    const st = skillStatus(s.hours)
                    return (
                      <li key={s.name} className="flex items-center justify-between border-b border-[#0f3460] pb-1.5">
                        <span style={{ color: st === "ok" ? "#ffffff" : st === "close" ? "#F9A825" : "#6b7280" }}>
                          {st === "ok" ? "✅" : st === "close" ? "⏳" : "❌"} {s.name}
                        </span>
                        <span className="text-[#a8a8b3]">{s.hours}h</span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-white">Going forward — if you cut 1 hour/day</h3>
                <p className="text-[#a8a8b3]">That frees 365 hours per year. In one year you could learn:</p>
                <p className="mt-2">{futureSkills.map(s => s.name).join(" · ")}</p>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                Small daily actions compound into life-changing skills.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Screen Time Calculator" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
