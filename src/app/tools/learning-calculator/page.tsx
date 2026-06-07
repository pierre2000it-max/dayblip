"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

interface Skill { name: string; hours: number; category: string; description: string }

const SKILLS: Skill[] = [
  { name: "Conversational Spanish", hours: 600, category: "Languages", description: "Order food, make friends, travel confidently" },
  { name: "Basic Mandarin", hours: 800, category: "Languages", description: "Greetings and basic phrases" },
  { name: "Conversational French", hours: 600, category: "Languages", description: "Navigate France and Canada" },
  { name: "Python programming basics", hours: 200, category: "Technology", description: "Automate tasks, analyze data" },
  { name: "Web development (HTML/CSS/JS)", hours: 300, category: "Technology", description: "Build your own websites" },
  { name: "Excel mastery", hours: 60, category: "Technology", description: "Formulas, pivot tables, VBA" },
  { name: "Photoshop fundamentals", hours: 100, category: "Technology", description: "Photo editing and design basics" },
  { name: "Video editing basics", hours: 150, category: "Technology", description: "Create YouTube and social videos" },
  { name: "Personal finance mastery", hours: 40, category: "Business", description: "Budget, invest, retire earlier" },
  { name: "Public speaking", hours: 80, category: "Business", description: "Speak confidently in any room" },
  { name: "Copywriting", hours: 100, category: "Business", description: "Write words that sell" },
  { name: "Social media marketing", hours: 80, category: "Business", description: "Grow any brand online" },
  { name: "Basic accounting", hours: 120, category: "Business", description: "Understand any business" },
  { name: "Real estate license prep", hours: 150, category: "Business", description: "Qualify for real estate exam" },
  { name: "Drawing fundamentals", hours: 200, category: "Creative", description: "Sketch, shade, create art" },
  { name: "Write a novel", hours: 300, category: "Creative", description: "First draft of your book" },
  { name: "Photography basics", hours: 60, category: "Creative", description: "Composition, lighting, editing" },
  { name: "Cook 100 new recipes", hours: 150, category: "Creative", description: "Become a confident home cook" },
  { name: "Run a 5K", hours: 40, category: "Health", description: "8-week beginner program" },
  { name: "Run a half marathon", hours: 120, category: "Health", description: "16-week training program" },
  { name: "Run a full marathon", hours: 300, category: "Health", description: "20-week training program" },
  { name: "Daily meditation habit", hours: 30, category: "Health", description: "10 minutes per day for 3 months" },
  { name: "Yoga basics", hours: 60, category: "Health", description: "Flexibility and mindfulness" },
  { name: "Guitar (beginner songs)", hours: 100, category: "Music", description: "Play 10 popular songs" },
  { name: "Piano basics", hours: 150, category: "Music", description: "Read music, play simple songs" },
  { name: "Singing basics", hours: 60, category: "Music", description: "Breath control, basic technique" },
  { name: "Speed reading", hours: 20, category: "Business", description: "Double your reading speed" },
  { name: "Touch typing (100wpm)", hours: 40, category: "Technology", description: "Type without looking" },
  { name: "Chess intermediate", hours: 200, category: "Business", description: "Openings, tactics, strategy" },
  { name: "Learn to code mobile apps", hours: 400, category: "Technology", description: "Build iOS or Android apps" },
]

const CATEGORIES = ["All", "Technology", "Business", "Languages", "Creative", "Health", "Music"]

function SkillList({ title, list, color, suffix }: { title: string; list: Skill[]; color: string; suffix?: (s: Skill) => string }) {
  if (list.length === 0) return null
  return (
    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
      <h3 className="mb-3 font-bold" style={{ color }}>{title}</h3>
      <ul className="space-y-2 text-sm">
        {list.map(s => (
          <li key={s.name} className="border-b border-[#0f3460] pb-2">
            <div className="flex justify-between"><span className="font-medium text-white">{s.name}</span><span className="text-[#a8a8b3]">{suffix ? suffix(s) : `${s.hours}h`}</span></div>
            <div className="text-xs text-[#a8a8b3]">{s.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function LearningCalculatorPage() {
  const [minutes, setMinutes] = useState(30)
  const [weeks, setWeeks] = useState(50)
  const [years, setYears] = useState(3)
  const [category, setCategory] = useState("All")
  const [result, setResult] = useState<{ minutes: number; weeks: number; years: number; category: string; totalHours: number } | null>(null)

  function runCalc(push = true, m = minutes, w = weeks, y = years, c = category) {
    const totalHours = (m / 60) * 7 * w * y
    setResult({ minutes: m, weeks: w, years: y, category: c, totalHours })
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?minutes=${m}&years=${y}&category=${c}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("minutes") || p.get("years")) {
      const m = Number(p.get("minutes") ?? 30), y = Number(p.get("years") ?? 3), c = p.get("category") ?? "All"
      setMinutes(m); setYears(y); setCategory(c)
      runCalc(false, m, weeks, y, c)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const total = result?.totalHours ?? 0
  const filtered = result ? SKILLS.filter(s => result.category === "All" || s.category === result.category) : []
  const canDo = filtered.filter(s => total >= s.hours).sort((a, b) => b.hours - a.hours)
  const almost = filtered.filter(s => total < s.hours && total >= s.hours * 0.8).sort((a, b) => a.hours - b.hours)
  const future = filtered.filter(s => total < s.hours * 0.8).sort((a, b) => a.hours - b.hours)
  const topSkill = canDo[0]?.name ?? almost[0]?.name ?? "build a strong daily habit"

  const shareUrl = result ? `https://www.dayblip.com/tools/learning-calculator?minutes=${result.minutes}&years=${result.years}` : ""
  const shareText = result
    ? `${result.minutes} minutes per day for ${result.years} years = ${Math.round(result.totalHours).toLocaleString()} hours of learning!\nI could ${topSkill} in that time!\nWhat would you learn?`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Learning Calculator — What Could You Achieve With Your Time?</h1>
          <p className="text-[#a8a8b3]">Calculate what you could achieve with your available daily time</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Dedicating 30 minutes per day to deliberate practice leads to approximately 182 hours per year of skill development. Research suggests 1,000 hours of deliberate practice can take a complete beginner to professional competency in most skills. At 30 minutes per day that is 5.5 years. At 2 hours per day the same journey takes just 1.4 years.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The learning calculator is based on deliberate practice research popularized by Anders Ericsson and Malcolm Gladwell&apos;s 10,000 hour rule. It shows how daily time investment compounds into skill mastery over months and years. Enter any skill and daily practice time to see realistic milestones on the path from beginner to expert.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Minutes available per day: {minutes}</span>
            <input type="range" min={15} max={240} value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="accent-[#e94560]" />
            <div className="flex gap-2">
              {[15, 30, 60, 120].map(m => (
                <button key={m} onClick={() => setMinutes(m)} className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-1 text-xs text-white hover:border-[#e94560]">
                  {m < 60 ? `${m}min` : `${m / 60}hr${m / 60 > 1 ? "s" : ""}`}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Weeks per year</span>
            <input type="number" min={1} max={52} value={weeks} onChange={e => setWeeks(Number(e.target.value))} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Years to invest: {years}</span>
            <input type="range" min={1} max={10} value={years} onChange={e => setYears(Number(e.target.value))} className="accent-[#e94560]" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Interest area</span>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Show What I Can Learn
          </button>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">{result.minutes} min/day × {result.weeks} weeks × {result.years} years</div>
                <div className="my-1 text-4xl font-black text-[#e94560]">{Math.round(result.totalHours).toLocaleString()} hours</div>
                <div className="text-sm text-[#a8a8b3]">of focused learning</div>
              </div>

              <SkillList title="✅ You can do this" list={canDo} color="#4ade80" />
              <SkillList title="⏳ Almost there" list={almost} color="#F9A825" suffix={s => `Just ${Math.ceil(s.hours - total)} more hours needed`} />
              <SkillList title="📚 Future goals" list={future} color="#a8a8b3" suffix={s => `Would need ${Math.ceil(s.hours - total)} more hours`} />

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white">
                <h3 className="mb-2 font-bold text-white">Skills often build on each other</h3>
                <p className="text-[#a8a8b3]">Python + Excel + SQL = Data Analyst</p>
                <p className="text-[#a8a8b3]">HTML + CSS + JavaScript = Web Developer</p>
                <p className="text-[#a8a8b3]">Marketing + Copywriting + Social Media = Digital Marketer</p>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                {result.minutes} minutes per day feels small. Over {result.years} years it becomes {Math.round(result.totalHours).toLocaleString()} hours — enough to {topSkill}.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Learning Calculator" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
