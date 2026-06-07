"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

const SKILL_LIST = ["Writing","Design","Coding","Teaching","Marketing","Photography","Video Editing","Accounting","Handyman","Cooking","Social Media","Customer Service","Data Analysis","Music","Languages"] as const
type Skill = typeof SKILL_LIST[number]
type ExpLevel = "beginner" | "intermediate" | "expert"

interface Hustle {
  name: string; skills: string[]; beginner: [number,number]; intermediate: [number,number]; expert: [number,number]
  platform: string; timeToIncome: string; hoursPerMonth: number; description: string; passive: boolean
}

const hustles: Hustle[] = [
  { name:"Freelance Writing", skills:["Writing"], beginner:[200,600], intermediate:[600,2000], expert:[2000,6000], platform:"Upwork, ProBlogger, Fiverr", timeToIncome:"2-4 weeks", hoursPerMonth:20, description:"Blog posts, articles, copywriting for businesses", passive:false },
  { name:"Copywriting", skills:["Writing","Marketing"], beginner:[400,1000], intermediate:[1000,3500], expert:[3500,10000], platform:"Upwork, direct clients", timeToIncome:"2-6 weeks", hoursPerMonth:20, description:"Sales copy, email campaigns, landing pages", passive:false },
  { name:"Freelance Design", skills:["Design"], beginner:[300,900], intermediate:[900,3000], expert:[3000,10000], platform:"99designs, Fiverr, Upwork", timeToIncome:"1-3 weeks", hoursPerMonth:25, description:"Logos, branding, social graphics", passive:false },
  { name:"Canva Template Selling", skills:["Design"], beginner:[50,300], intermediate:[300,1200], expert:[1200,5000], platform:"Etsy, Creative Market", timeToIncome:"4-8 weeks", hoursPerMonth:10, description:"Create once, sell repeatedly — passive income", passive:true },
  { name:"Freelance Development", skills:["Coding"], beginner:[500,1500], intermediate:[1500,5000], expert:[5000,15000], platform:"Upwork, Toptal, Gun.io", timeToIncome:"2-4 weeks", hoursPerMonth:30, description:"Websites, apps, automation scripts", passive:false },
  { name:"Online Tutoring", skills:["Teaching"], beginner:[300,900], intermediate:[900,2500], expert:[2500,7000], platform:"Wyzant, Tutor.com, Chegg", timeToIncome:"1-2 weeks", hoursPerMonth:20, description:"Academic subjects, test prep, skills coaching", passive:false },
  { name:"Online Course Creation", skills:["Teaching"], beginner:[100,500], intermediate:[500,3000], expert:[3000,20000], platform:"Udemy, Teachable, Gumroad", timeToIncome:"6-12 weeks", hoursPerMonth:15, description:"Create once, earn indefinitely — best passive option", passive:true },
  { name:"Social Media Management", skills:["Marketing","Social Media"], beginner:[300,800], intermediate:[800,2500], expert:[2500,7000], platform:"Direct small business clients", timeToIncome:"2-4 weeks", hoursPerMonth:20, description:"Manage social accounts for local businesses", passive:false },
  { name:"SEO Consulting", skills:["Marketing"], beginner:[400,1200], intermediate:[1200,4000], expert:[4000,12000], platform:"Direct clients, Upwork", timeToIncome:"3-6 weeks", hoursPerMonth:25, description:"Help businesses rank higher in Google", passive:false },
  { name:"Photography Services", skills:["Photography"], beginner:[200,700], intermediate:[700,2500], expert:[2500,8000], platform:"Local clients, Instagram", timeToIncome:"2-4 weeks", hoursPerMonth:15, description:"Events, portraits, product photography", passive:false },
  { name:"Stock Photography", skills:["Photography"], beginner:[30,150], intermediate:[150,600], expert:[600,2500], platform:"Shutterstock, Adobe Stock", timeToIncome:"4-8 weeks", hoursPerMonth:10, description:"Upload photos once, earn royalties forever", passive:true },
  { name:"Video Editing", skills:["Video Editing"], beginner:[300,900], intermediate:[900,3000], expert:[3000,9000], platform:"Upwork, YouTube creators", timeToIncome:"1-3 weeks", hoursPerMonth:25, description:"Edit videos for content creators and businesses", passive:false },
  { name:"Bookkeeping Services", skills:["Accounting"], beginner:[400,1200], intermediate:[1200,3500], expert:[3500,9000], platform:"Bench, direct small business clients", timeToIncome:"2-4 weeks", hoursPerMonth:20, description:"Monthly books for small businesses", passive:false },
  { name:"Tax Preparation", skills:["Accounting"], beginner:[300,900], intermediate:[900,3000], expert:[3000,8000], platform:"Direct clients, local advertising", timeToIncome:"Seasonal Jan-Apr", hoursPerMonth:25, description:"Individual and small business tax returns", passive:false },
  { name:"Home Repair Services", skills:["Handyman"], beginner:[300,900], intermediate:[900,2500], expert:[2500,6000], platform:"TaskRabbit, Thumbtack, Angi", timeToIncome:"1-2 weeks", hoursPerMonth:20, description:"Repairs, assembly, painting, installation", passive:false },
  { name:"Data Analysis Freelance", skills:["Data Analysis"], beginner:[500,1200], intermediate:[1200,4000], expert:[4000,12000], platform:"Upwork, direct clients", timeToIncome:"2-4 weeks", hoursPerMonth:20, description:"Dashboards, reports, insights for businesses", passive:false },
  { name:"Music Lessons", skills:["Music"], beginner:[200,600], intermediate:[600,2000], expert:[2000,5000], platform:"Local, TakeLessons, online", timeToIncome:"1-3 weeks", hoursPerMonth:15, description:"Teach instrument or vocals online or in person", passive:false },
  { name:"Translation Services", skills:["Languages"], beginner:[200,700], intermediate:[700,2500], expert:[2500,8000], platform:"ProZ, Upwork, direct clients", timeToIncome:"2-4 weeks", hoursPerMonth:20, description:"Translate documents, websites, marketing", passive:false },
  { name:"Virtual Assistant", skills:["Customer Service"], beginner:[300,800], intermediate:[800,2000], expert:[2000,5000], platform:"Fancy Hands, Belay, Upwork", timeToIncome:"1-2 weeks", hoursPerMonth:20, description:"Admin, scheduling, email management for businesses", passive:false },
  { name:"Private Chef / Meal Prep", skills:["Cooking"], beginner:[200,700], intermediate:[700,2500], expert:[2500,7000], platform:"Local clients, Thumbtack", timeToIncome:"1-3 weeks", hoursPerMonth:20, description:"Meal prep, dinner parties, private events", passive:false },
]

function fv(monthly: number, months: number, rate = 0.07): number {
  const r = rate / 12
  return monthly * ((Math.pow(1 + r, months) - 1) / r)
}
function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

interface Result {
  skills: Skill[]; hours: number; level: ExpLevel
  matches: Hustle[]; minMonth: number; maxMonth: number
  topHustle: string
}

function compute(skills: Skill[], hours: number, level: ExpLevel): Result {
  const monthlyHours = hours * 4.3
  const matching = hustles.filter(h => h.skills.some(s => skills.includes(s as Skill)))
  const feasible = matching.filter(h => monthlyHours >= h.hoursPerMonth * 0.5)
  const sorted = [...feasible].sort((a, b) => b[level][1] - a[level][1]).slice(0, 6)
  const all = sorted.length > 0 ? sorted : matching.slice(0, 6)

  const minMonth = all.length > 0 ? Math.min(...all.map(h => h[level][0])) : 0
  const maxMonth = all.length > 0 ? Math.max(...all.map(h => h[level][1])) : 0
  const topHustle = all[0]?.name ?? "freelancing"

  return { skills, hours, level, matches: all, minMonth, maxMonth, topHustle }
}

export default function SideHustlePage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [hours, setHours] = useState(10)
  const [level, setLevel] = useState<ExpLevel>("intermediate")
  const [goal, setGoal] = useState("Extra spending money")
  const [result, setResult] = useState<Result | null>(null)

  function toggleSkill(s: Skill) {
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  function runCalc(push = true, sk = skills, h = hours, lv = level) {
    if (sk.length === 0) return
    const res = compute(sk, h, lv)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?skills=${encodeURIComponent(sk.join(","))}&hours=${h}&level=${lv}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const sk = p.get("skills"), h = p.get("hours"), lv = p.get("level")
    if (sk) {
      const parsedSkills = sk.split(",").filter(s => SKILL_LIST.includes(s as Skill)) as Skill[]
      const parsedHours = h ? Number(h) : 10
      const parsedLevel = (lv ?? "intermediate") as ExpLevel
      setSkills(parsedSkills); setHours(parsedHours); setLevel(parsedLevel)
      if (parsedSkills.length > 0) runCalc(false, parsedSkills, parsedHours, parsedLevel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mid = result ? Math.round((result.minMonth + result.maxMonth) / 2) : 0

  const goalText = result ? (() => {
    switch (goal) {
      case "Extra spending money": return `Your top hustle adds ${fmt(result.maxMonth)}/month in extra income — ${fmt(result.maxMonth * 12)}/year`
      case "Pay off debt":        return `At ${fmt(mid)}/month you could pay off ${fmt(mid * 24)} in debt within 2 years`
      case "Build investment fund": return `${fmt(mid)}/month invested for 10 years = ${fmt(fv(mid, 120))} at 7%`
      case "Eventually replace income": return `At ${fmt(result.maxMonth)}/month you are building toward income replacement`
      default: return ""
    }
  })() : ""

  const shareUrl = result ? `https://www.dayblip.com/tools/side-hustle?skills=${encodeURIComponent(skills.join(","))}&hours=${hours}&level=${level}` : ""
  const shareText = result
    ? `My side hustle potential: ${fmt(result.minMonth)}–${fmt(result.maxMonth)}/month with just ${hours} hours/week!\nBest match: ${result.topHustle}\nCalculate yours:`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Side Hustle Income Calculator", "Discover your side hustle income potential based on your skills and available time. Find the best side hustle for your situation.", "https://www.dayblip.com/tools/side-hustle", "FinanceApplication"),
        faqSchema([
          { question: "How much can I make from a side hustle?", answer: "Side hustle income varies widely by skill and time. Freelance coding can earn $1,500-$15,000 per month. Writing $200-$6,000. Teaching $300-$7,000. Home services $300-$6,000." },
          { question: "What is the best side hustle for beginners?", answer: "Beginners often find success with freelance writing, virtual assistance, online tutoring, home services, or social media management — all require minimal startup costs." },
          { question: "How many hours per week do I need for a side hustle?", answer: "Even 5-10 hours per week can generate meaningful income. Most successful side hustlers start with 10-15 hours weekly and scale based on demand and income goals." },
        ]),
        howToSchema("How to Calculate Your Side Hustle Potential", "Find your best-matched side hustle and income", [
          "Select all skills you have from the checklist",
          "Set your available hours per week using the slider",
          "Select your experience level",
          "Choose your income goal",
          "Click Show My Hustle Potential for top matches",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Side Hustle Calculator", url: "https://www.dayblip.com/tools/side-hustle" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">What Could You Earn on the Side?</h1>
          <p className="text-[#a8a8b3]">Discover your side hustle income potential based on your skills and available time</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Side hustle income potential varies by skill. Freelance software development earns $500–$15,000 per month. Writing $200–$6,000. Online tutoring $300–$7,000. Social media management $300–$7,000. Home services $300–$6,000. With 10 hours per week most people with marketable skills can earn $500–$2,000 per month within 4–8 weeks of starting.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Side hustle income depends on your existing skills, available hours per week and experience level. This calculator matches your skills against 19 proven income streams and estimates realistic monthly earnings based on current market rates on platforms like Upwork, Fiverr, Etsy and Teachable.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Side Hustle Potential" }
          ]} />
          {/* Skills */}
          <div>
            <div className="mb-2 text-sm font-semibold text-white">Your skills (select all that apply)</div>
            <div className="flex flex-wrap gap-2">
              {SKILL_LIST.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${skills.includes(s) ? "bg-[#e94560] text-white" : "border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Hours per week available: {hours}</span>
            <input type="range" min={2} max={40} value={hours} onChange={e => setHours(Number(e.target.value))} className="accent-[#e94560]" />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Experience level</span>
              <select value={level} onChange={e => setLevel(e.target.value as ExpLevel)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Your goal</span>
              <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                <option>Extra spending money</option>
                <option>Pay off debt faster</option>
                <option>Build investment fund</option>
                <option>Eventually replace income</option>
              </select>
            </label>
          </div>

          <button onClick={() => runCalc()} disabled={skills.length === 0} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40">
            Show My Hustle Potential
          </button>

          {result && (
            <div className="space-y-6">
              {/* Income summary */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-center">
                <div className="text-sm text-[#a8a8b3]">Based on your {result.skills.join(", ")} skills and {hours} hrs/week</div>
                <div className="my-2 text-4xl font-black text-[#e94560]">{fmt(result.minMonth)} – {fmt(result.maxMonth)}</div>
                <div className="text-sm text-[#a8a8b3]">per month · {fmt(result.minMonth * 12)} – {fmt(result.maxMonth * 12)} per year</div>
              </div>

              {/* Goal context */}
              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-4 text-sm font-medium text-white">{goalText}</div>

              {/* Top hustle matches */}
              <div>
                <div className="mb-3 font-bold text-white">Top hustle matches for your skills</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {result.matches.map((h, i) => (
                    <div key={h.name} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white">{i + 1}. {h.name}</div>
                          {h.passive && <span className="text-xs text-[#4ade80]">💤 Passive income</span>}
                        </div>
                        <div className="text-right text-sm font-bold text-[#e94560] shrink-0">{fmt(h[level][0])}–{fmt(h[level][1])}<div className="text-xs font-normal text-[#a8a8b3]">/month</div></div>
                      </div>
                      <div className="mt-2 text-xs text-[#a8a8b3]">{h.description}</div>
                      <div className="mt-1.5 flex gap-3 text-xs text-[#a8a8b3]">
                        <span>📍 {h.platform}</span>
                        <span>⏱ {h.timeToIncome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment impact */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                <div className="font-bold text-white mb-2">If you invest {fmt(mid)}/month</div>
                {[[1, 12], [5, 60], [10, 120]].map(([yr, mo]) => (
                  <p key={yr} className="mt-1 text-[#a8a8b3]"><span className="font-bold text-white">{yr} year{yr > 1 ? "s" : ""}:</span> {fmt(fv(mid, mo))} at 7%</p>
                ))}
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Side Hustle Income Calculator" />
              <RelatedTools tools={[
                { emoji: "🤖", title: "Will AI Replace My Job?", desc: "Get your personalized AI risk score", href: "/tools/ai-job-score" },
                { emoji: "💰", title: "Salary Negotiation Guide", desc: "How much to ask for + ready-to-use script", href: "/tools/salary-negotiation" },
                { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
                { emoji: "📊", title: "Tax Bracket", desc: "Find your 2026 federal bracket", href: "/finance/tax-bracket" },
                { emoji: "🧾", title: "Self-Employment Tax", desc: "SE tax + quarterly estimates", href: "/finance/self-employment-tax" },
              ]} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
