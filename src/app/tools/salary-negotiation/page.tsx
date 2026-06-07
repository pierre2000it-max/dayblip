"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

// ─── Salary data (source: BLS OES 2025, educational estimates) ───────────────
const salaryData: Record<string, Record<string, [number, number]>> = {
  "Software Engineer":      { "0-1":[75000,95000],"2-4":[95000,130000],"5-9":[130000,170000],"10-14":[160000,210000],"15+":[190000,250000] },
  "Software Developer":     { "0-1":[70000,90000],"2-4":[90000,125000],"5-9":[120000,160000],"10-14":[150000,200000],"15+":[180000,240000] },
  "Data Scientist":         { "0-1":[80000,105000],"2-4":[100000,135000],"5-9":[130000,175000],"10-14":[160000,215000],"15+":[190000,260000] },
  "Data Analyst":           { "0-1":[55000,75000],"2-4":[70000,95000],"5-9":[90000,120000],"10-14":[110000,148000],"15+":[130000,175000] },
  "DevOps Engineer":        { "0-1":[80000,105000],"2-4":[100000,135000],"5-9":[130000,170000],"10-14":[158000,210000],"15+":[185000,245000] },
  "Cybersecurity Analyst":  { "0-1":[70000,92000],"2-4":[88000,118000],"5-9":[112000,150000],"10-14":[140000,185000],"15+":[165000,220000] },
  "Product Manager":        { "0-1":[75000,100000],"2-4":[100000,140000],"5-9":[135000,180000],"10-14":[165000,220000],"15+":[195000,260000] },
  "UX Designer":            { "0-1":[55000,75000],"2-4":[70000,98000],"5-9":[92000,125000],"10-14":[115000,155000],"15+":[138000,185000] },
  "Graphic Designer":       { "0-1":[40000,55000],"2-4":[52000,72000],"5-9":[68000,92000],"10-14":[82000,110000],"15+":[95000,130000] },
  "Cloud Architect":        { "0-1":[95000,125000],"2-4":[120000,160000],"5-9":[155000,205000],"10-14":[190000,250000],"15+":[220000,290000] },
  "AI Engineer":            { "0-1":[100000,135000],"2-4":[130000,175000],"5-9":[168000,225000],"10-14":[205000,270000],"15+":[235000,310000] },
  "IT Manager":             { "0-1":[75000,98000],"2-4":[95000,128000],"5-9":[122000,162000],"10-14":[150000,198000],"15+":[175000,232000] },
  "Physician":              { "0-1":[180000,250000],"2-4":[220000,310000],"5-9":[260000,370000],"10-14":[295000,420000],"15+":[320000,480000] },
  "Registered Nurse":       { "0-1":[55000,70000],"2-4":[65000,82000],"5-9":[76000,96000],"10-14":[86000,108000],"15+":[95000,122000] },
  "Nurse Practitioner":     { "0-1":[95000,118000],"2-4":[112000,138000],"5-9":[130000,160000],"10-14":[148000,182000],"15+":[165000,205000] },
  "Pharmacist":             { "0-1":[115000,135000],"2-4":[125000,148000],"5-9":[135000,162000],"10-14":[145000,175000],"15+":[155000,188000] },
  "Physical Therapist":     { "0-1":[68000,85000],"2-4":[80000,100000],"5-9":[92000,115000],"10-14":[105000,130000],"15+":[115000,145000] },
  "Physician Assistant":    { "0-1":[95000,118000],"2-4":[110000,135000],"5-9":[125000,155000],"10-14":[140000,172000],"15+":[155000,190000] },
  "Psychologist":           { "0-1":[72000,92000],"2-4":[88000,112000],"5-9":[105000,135000],"10-14":[122000,158000],"15+":[140000,182000] },
  "Accountant":             { "0-1":[45000,60000],"2-4":[58000,78000],"5-9":[75000,100000],"10-14":[92000,125000],"15+":[110000,152000] },
  "CPA":                    { "0-1":[55000,72000],"2-4":[70000,95000],"5-9":[90000,122000],"10-14":[112000,150000],"15+":[132000,178000] },
  "Financial Analyst":      { "0-1":[55000,72000],"2-4":[68000,90000],"5-9":[85000,115000],"10-14":[105000,145000],"15+":[128000,172000] },
  "Financial Advisor":      { "0-1":[48000,68000],"2-4":[65000,98000],"5-9":[92000,145000],"10-14":[125000,200000],"15+":[160000,280000] },
  "Lawyer":                 { "0-1":[72000,105000],"2-4":[98000,150000],"5-9":[138000,215000],"10-14":[185000,295000],"15+":[235000,400000] },
  "Paralegal":              { "0-1":[42000,56000],"2-4":[52000,70000],"5-9":[64000,86000],"10-14":[76000,102000],"15+":[88000,118000] },
  "Teacher":                { "0-1":[35000,46000],"2-4":[40000,55000],"5-9":[50000,66000],"10-14":[58000,76000],"15+":[65000,86000] },
  "Professor":              { "0-1":[58000,80000],"2-4":[72000,100000],"5-9":[90000,128000],"10-14":[112000,158000],"15+":[132000,192000] },
  "Electrician":            { "0-1":[42000,58000],"2-4":[54000,72000],"5-9":[66000,88000],"10-14":[78000,105000],"15+":[88000,120000] },
  "Plumber":                { "0-1":[42000,58000],"2-4":[55000,74000],"5-9":[68000,92000],"10-14":[80000,108000],"15+":[92000,125000] },
  "Marketing Manager":      { "0-1":[45000,62000],"2-4":[60000,85000],"5-9":[82000,112000],"10-14":[100000,138000],"15+":[118000,162000] },
  "Project Manager":        { "0-1":[55000,72000],"2-4":[70000,95000],"5-9":[90000,122000],"10-14":[108000,148000],"15+":[125000,168000] },
  "HR Manager":             { "0-1":[48000,64000],"2-4":[60000,82000],"5-9":[76000,105000],"10-14":[92000,128000],"15+":[108000,150000] },
  "Operations Manager":     { "0-1":[52000,70000],"2-4":[66000,90000],"5-9":[84000,115000],"10-14":[100000,138000],"15+":[118000,162000] },
  "Sales Manager":          { "0-1":[55000,78000],"2-4":[72000,105000],"5-9":[98000,145000],"10-14":[125000,185000],"15+":[148000,225000] },
  "Sales Representative":   { "0-1":[40000,62000],"2-4":[55000,82000],"5-9":[72000,112000],"10-14":[88000,138000],"15+":[102000,162000] },
  "Business Analyst":       { "0-1":[55000,72000],"2-4":[68000,92000],"5-9":[85000,115000],"10-14":[102000,138000],"15+":[118000,160000] },
  "Management Consultant":  { "0-1":[75000,105000],"2-4":[98000,142000],"5-9":[135000,195000],"10-14":[175000,258000],"15+":[215000,325000] },
  "Copywriter":             { "0-1":[42000,58000],"2-4":[54000,75000],"5-9":[68000,95000],"10-14":[82000,115000],"15+":[95000,135000] },
  "Journalist":             { "0-1":[38000,52000],"2-4":[48000,66000],"5-9":[58000,80000],"10-14":[68000,95000],"15+":[78000,110000] },
  "Social Media Manager":   { "0-1":[40000,56000],"2-4":[52000,72000],"5-9":[65000,90000],"10-14":[78000,108000],"15+":[90000,125000] },
  "Real Estate Agent":      { "0-1":[35000,58000],"2-4":[52000,88000],"5-9":[75000,130000],"10-14":[98000,175000],"15+":[118000,225000] },
  "Chef":                   { "0-1":[35000,50000],"2-4":[46000,64000],"5-9":[58000,82000],"10-14":[70000,100000],"15+":[82000,118000] },
  "Police Officer":         { "0-1":[48000,65000],"2-4":[58000,78000],"5-9":[68000,92000],"10-14":[78000,106000],"15+":[88000,120000] },
  "Social Worker":          { "0-1":[38000,52000],"2-4":[46000,64000],"5-9":[56000,76000],"10-14":[64000,88000],"15+":[72000,100000] },
  "Administrative Assistant":{ "0-1":[32000,45000],"2-4":[40000,55000],"5-9":[48000,65000],"10-14":[55000,74000],"15+":[62000,84000] },
  "Customer Service Rep":   { "0-1":[30000,42000],"2-4":[36000,50000],"5-9":[42000,58000],"10-14":[48000,66000],"15+":[54000,74000] },
  "Other":                  { "0-1":[35000,52000],"2-4":[45000,65000],"5-9":[58000,82000],"10-14":[70000,98000],"15+":[82000,115000] },
}

const synonyms: Record<string, string> = {
  "doctor":"Physician","md":"Physician","rn":"Registered Nurse","attorney":"Lawyer",
  "counsel":"Lawyer","dev":"Software Developer","programmer":"Software Engineer",
  "coder":"Software Engineer","mechanic":"Auto Mechanic","realtor":"Real Estate Agent",
  "cop":"Police Officer","therapist":"Physical Therapist","shrink":"Psychologist",
  "cook":"Chef",
}

const stateMultiplier: Record<string, number> = {
  CA:1.28,NY:1.25,WA:1.22,MA:1.20,CT:1.18,NJ:1.18,CO:1.08,VA:1.07,TX:1.02,
  FL:1.00,GA:0.98,AZ:0.97,NC:0.95,TN:0.93,OH:0.92,MI:0.91,PA:0.96,IL:1.04,
}
const mult = (s: string) => stateMultiplier[s] ?? 0.93

const STATES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",
  CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",
  IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
  ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",
  MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",
  NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",
  TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",
  WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
}

const EXP_LEVELS = [
  { v: "0-1", label: "0-1 years" }, { v: "2-4", label: "2-4 years" },
  { v: "5-9", label: "5-9 years" }, { v: "10-14", label: "10-14 years" }, { v: "15+", label: "15+ years" },
]

const ALL_ROLES = Object.keys(salaryData)

function getSuggestions(q: string): string[] {
  if (!q.trim()) return []
  const lq = q.toLowerCase().trim()
  const synMatch = synonyms[lq]
  const direct = ALL_ROLES.filter(r => r.toLowerCase().includes(lq))
  const res = new Set<string>()
  if (synMatch) res.add(synMatch)
  direct.forEach(r => res.add(r))
  return Array.from(res).slice(0, 5)
}

function resolveRole(q: string): string {
  const lq = q.toLowerCase().trim()
  if (synonyms[lq]) return synonyms[lq]
  const exact = ALL_ROLES.find(r => r.toLowerCase() === lq)
  if (exact) return exact
  const partial = ALL_ROLES.find(r => r.toLowerCase().includes(lq))
  if (partial) return partial
  return "Other"
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

interface Result {
  role: string; exp: string; state: string; stateName: string
  offeredSalary: number; marketLow: number; marketHigh: number; marketMedian: number
  gap: number; percentBelow: number; negotiationTarget: number; negotiationFloor: number
  lifetimeImpact: number; verdict: "above" | "at" | "below"
}

function compute(roleInput: string, exp: string, state: string, offered: number): Result {
  const role = resolveRole(roleInput)
  const m = mult(state)
  const base = salaryData[role]?.[exp] ?? salaryData["Other"][exp]
  const marketLow = Math.round(base[0] * m)
  const marketHigh = Math.round(base[1] * m)
  const marketMedian = Math.round((marketLow + marketHigh) / 2)
  const gap = marketMedian - offered
  const percentBelow = Math.abs(gap) / marketMedian * 100
  const negotiationTarget = Math.round(marketMedian * 1.10 / 1000) * 1000
  const negotiationFloor = Math.round(marketMedian * 0.95 / 1000) * 1000
  const lifetimeImpact = gap > 0 ? Math.round(gap * 40 * 1.5) : 0
  const verdict: "above" | "at" | "below" =
    offered >= marketMedian * 1.05 ? "above" :
    offered >= marketMedian * 0.95 ? "at" : "below"
  return { role, exp, state, stateName: STATES[state], offeredSalary: offered, marketLow, marketHigh, marketMedian, gap, percentBelow, negotiationTarget, negotiationFloor, lifetimeImpact, verdict }
}

export default function SalaryNegotiationPage() {
  const [jobInput, setJobInput] = useState("Software Engineer")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSug, setShowSug] = useState(false)
  const [exp, setExp] = useState("5-9")
  const [state, setState] = useState("CA")
  const [offered, setOffered] = useState("120000")
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const sugRef = useRef<HTMLDivElement>(null)

  function handleInput(val: string) {
    setJobInput(val)
    const s = getSuggestions(val)
    setSuggestions(s)
    setShowSug(s.length > 0)
  }

  function selectSug(s: string) { setJobInput(s); setSuggestions([]); setShowSug(false) }

  function runCalc(push = true, job = jobInput, e = exp, s = state, o = offered) {
    const res = compute(job, e, s, +(o) || 0)
    setResult(res)
    setShowSug(false)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?role=${encodeURIComponent(job)}&exp=${e}&state=${s}&offered=${+o || 0}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const r = p.get("role"), e = p.get("exp"), s = p.get("state"), o = p.get("offered")
    if (r && e && s && o) {
      setJobInput(r); setExp(e); setState(s); setOffered(o)
      runCalc(false, r, e, s, o)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (sugRef.current && !sugRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) setShowSug(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const script = result
    ? `Thank you for the offer of ${fmt(result.offeredSalary)}. I'm really excited about this opportunity and can see myself making a strong contribution here.\n\nBased on my ${EXP_LEVELS.find(x => x.v === result.exp)?.label} of experience and the current market rate of ${fmt(result.marketLow)}–${fmt(result.marketHigh)} for ${result.role} professionals in ${result.stateName}, I was hoping we could discuss a salary of ${fmt(result.negotiationTarget)}.\n\nIs there any flexibility there?`
    : ""

  function copyScript() {
    navigator.clipboard.writeText(script).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const verdictConfig = {
    above: { color: "#4ade80", border: "border-[#4ade80]/40", bg: "bg-[#4ade80]/10", emoji: "🟢", label: "Above Market — You Are Well Paid" },
    at:    { color: "#F9A825", border: "border-[#F9A825]/40", bg: "bg-[#F9A825]/10", emoji: "🟡", label: "At Market Rate — Still Negotiate" },
    below: { color: "#e94560", border: "border-[#e94560]/40", bg: "bg-[#e94560]/10", emoji: "🔴", label: "Below Market — Negotiate Now" },
  }

  const shareUrl = result ? `https://www.dayblip.com/tools/salary-negotiation?role=${encodeURIComponent(jobInput)}&exp=${exp}&state=${state}&offered=${+offered || 0}` : ""
  const shareText = result
    ? `Not negotiating your salary costs ${fmt(result.lifetimeImpact)} over a career! 😮\nMarket rate for ${result.role} in ${result.stateName}: ${fmt(result.marketLow)}–${fmt(result.marketHigh)}\nFree negotiation calculator + script:\n(Educational — BLS 2025 data)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Salary Negotiation Calculator", "Calculate exactly how much to ask for in salary negotiations. Get a ready-to-use negotiation script based on real market data for your role and location.", "https://www.dayblip.com/tools/salary-negotiation", "FinanceApplication"),
        faqSchema([
          { question: "Should I negotiate my salary?", answer: "Yes. 87% of employers expect salary negotiation and almost never rescind offers because of it. Not negotiating your starting salary can cost $300,000+ over a career due to compounding raises." },
          { question: "How much should I ask for in salary negotiation?", answer: "Ask for 10-15% above the market median for your role, experience level and location. This gives room to settle at market rate while leaving you room to negotiate." },
          { question: "What is the best way to negotiate salary?", answer: "Thank them for the offer, express enthusiasm, then cite specific market data for your role and location. Use a specific number not a range. Let silence work after making your ask." },
          { question: "Will negotiating salary hurt my chances?", answer: "No. Studies show 87% of hiring managers expect negotiation and virtually no offers are rescinded due to reasonable salary negotiation." },
        ]),
        howToSchema("How to Calculate Your Salary Negotiation Amount", "Get your target salary number and a negotiation script", [
          "Enter your job title",
          "Select your years of experience",
          "Select your state",
          "Enter the salary you were offered or currently earn",
          "Click Analyze My Salary to see market data",
          "Copy the ready-to-use negotiation script",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Salary Negotiation", url: "https://www.dayblip.com/tools/salary-negotiation" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Should You Negotiate Your Salary?</h1>
          <p className="text-[#a8a8b3]">Calculate exactly how much to ask for and get a ready-to-use script</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
            ⚠️ <strong>Educational estimates only.</strong> Market data based on BLS OES 2025 national data. Actual salaries vary by company, industry and individual performance. Not financial advice.
          </div>

          <div className="space-y-4">
            {/* Job search */}
            <div className="relative">
              <span className="mb-2 block text-sm font-semibold text-white">Job title</span>
              <input ref={inputRef} type="text" value={jobInput} onChange={e => handleInput(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSug(true) }}
                placeholder="e.g. Software Engineer, Nurse, Marketing Manager"
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              {showSug && suggestions.length > 0 && (
                <div ref={sugRef} className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#0f3460] bg-[#16213e] shadow-lg">
                  {suggestions.map(s => <button key={s} onMouseDown={() => selectSug(s)} className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#e94560]/20">{s}</button>)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">Years of experience</span>
                <select value={exp} onChange={e => setExp(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                  {EXP_LEVELS.map(x => <option key={x.v} value={x.v}>{x.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-white">State</span>
                <select value={state} onChange={e => setState(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                  {Object.entries(STATES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Current or offered salary</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={offered} onChange={e => setOffered(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>

            <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Analyze My Salary
            </button>
          </div>

          {result && (() => {
            const vc = verdictConfig[result.verdict]
            return (
              <div className="space-y-6">
                {/* Verdict banner */}
                <div className={`rounded-xl border ${vc.border} ${vc.bg} p-5 text-center`}>
                  <div className="text-xl font-black" style={{ color: vc.color }}>{vc.emoji} {vc.label}</div>
                  <div className="mt-2 text-sm text-white">
                    {result.verdict === "above" && `This offer is ${result.percentBelow.toFixed(1)}% above market rate. You could still negotiate benefits or equity.`}
                    {result.verdict === "at" && `You are within market range. 87% of employers expect negotiation. Not negotiating leaves money behind.`}
                    {result.verdict === "below" && `You are ${result.percentBelow.toFixed(1)}% below market rate. Not negotiating costs you ${fmt(result.gap)}/year.`}
                  </div>
                </div>

                {/* Market data */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-3">Market data for {result.role} in {result.stateName}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[["Market range", `${fmt(result.marketLow)} – ${fmt(result.marketHigh)}`],["Market median", fmt(result.marketMedian)],
                      ["Your salary", fmt(result.offeredSalary)],[result.gap > 0 ? "Below median" : "Above median", fmt(Math.abs(result.gap))]].map(([l, v]) => (
                      <div key={String(l)} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-2.5">
                        <div className="text-xs text-[#a8a8b3]">{l}</div>
                        <div className="font-bold text-white">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negotiation guide */}
                <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-[#F9A825] mb-2">💰 Negotiation guide</div>
                  <p className="text-white">Counter offer: <span className="font-bold text-[#e94560]">{fmt(result.negotiationTarget)}</span></p>
                  <p className="mt-1 text-white">Your minimum: <span className="font-bold text-white">{fmt(result.negotiationFloor)}</span></p>
                  <p className="mt-1 text-white">Market evidence: <span className="text-[#a8a8b3]">{fmt(result.marketLow)}–{fmt(result.marketHigh)}</span></p>
                </div>

                {/* Script */}
                <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-bold text-white">📝 Your negotiation script</div>
                    <button onClick={copyScript} className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#e94560]">
                      {copied ? "✓ Copied!" : "Copy →"}
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap rounded-lg border border-[#0f3460] bg-[#16213e] p-4 text-sm text-[#a8a8b3] leading-relaxed">{script}</div>
                </div>

                {/* Lifetime impact */}
                {result.gap > 0 && (
                  <div className="rounded-xl border border-[#e94560]/30 bg-[#e94560]/10 p-5 text-sm text-white">
                    <div className="font-bold text-[#e94560] mb-2">Getting {fmt(result.gap)} more/year compounds over a career:</div>
                    {[["Year 1", result.gap], ["Year 5", result.gap * 5 * Math.pow(1.03, 2)], ["Year 10", result.gap * 10 * Math.pow(1.03, 5)], ["Career (40 yrs)", result.lifetimeImpact]].map(([yr, v]) => (
                      <p key={String(yr)} className="mt-1"><span className="text-[#a8a8b3]">{yr}: </span><span className="font-bold text-[#F9A825]">+{fmt(+v)}</span></p>
                    ))}
                    <p className="mt-3 font-bold">The 10-minute negotiation conversation is worth {fmt(result.lifetimeImpact)} over your career.</p>
                  </div>
                )}

                {/* Tips */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm text-white">
                  <div className="font-bold text-white mb-2">5 rules of salary negotiation</div>
                  {["Always negotiate — 87% of employers expect it","Get the offer in writing first","Give a specific number, not a range","Let silence work for you after the ask","Consider total comp — equity, bonus, PTO, remote"].map((t, i) => (
                    <p key={i} className="mt-1 text-[#a8a8b3]"><span className="text-[#e94560] font-bold">{i + 1}. </span>{t}</p>
                  ))}
                </div>

                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3 text-xs text-[#a8a8b3]">Market data: BLS OES 2025 data. Educational estimates only. Actual salaries vary by company, industry and individual factors.</div>

                <ShareButtons
                  text={shareText} url={shareUrl}
                  title={`Salary Negotiation: ${result.role} in ${result.stateName}`}
                />
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
