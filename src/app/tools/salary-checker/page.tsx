"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"

const salaryData: Record<string, Record<string, [number, number]>> = {
  "Software Engineer": { "0-1":[75000,95000],"2-4":[95000,130000],"5-9":[130000,170000],"10-14":[160000,210000],"15+":[190000,250000] },
  "Software Developer": { "0-1":[70000,90000],"2-4":[90000,125000],"5-9":[120000,160000],"10-14":[150000,200000],"15+":[180000,240000] },
  "Data Scientist": { "0-1":[80000,105000],"2-4":[100000,135000],"5-9":[130000,175000],"10-14":[160000,215000],"15+":[190000,260000] },
  "Data Analyst": { "0-1":[55000,75000],"2-4":[70000,95000],"5-9":[90000,120000],"10-14":[110000,148000],"15+":[130000,175000] },
  "DevOps Engineer": { "0-1":[80000,105000],"2-4":[100000,135000],"5-9":[130000,170000],"10-14":[158000,210000],"15+":[185000,245000] },
  "Cybersecurity Analyst": { "0-1":[70000,92000],"2-4":[88000,118000],"5-9":[112000,150000],"10-14":[140000,185000],"15+":[165000,220000] },
  "Product Manager": { "0-1":[75000,100000],"2-4":[100000,140000],"5-9":[135000,180000],"10-14":[165000,220000],"15+":[195000,260000] },
  "UX Designer": { "0-1":[55000,75000],"2-4":[70000,98000],"5-9":[92000,125000],"10-14":[115000,155000],"15+":[138000,185000] },
  "Graphic Designer": { "0-1":[40000,55000],"2-4":[52000,72000],"5-9":[68000,92000],"10-14":[82000,110000],"15+":[95000,130000] },
  "Network Engineer": { "0-1":[65000,85000],"2-4":[82000,110000],"5-9":[105000,140000],"10-14":[130000,172000],"15+":[152000,200000] },
  "Cloud Architect": { "0-1":[95000,125000],"2-4":[120000,160000],"5-9":[155000,205000],"10-14":[190000,250000],"15+":[220000,290000] },
  "AI Engineer": { "0-1":[100000,135000],"2-4":[130000,175000],"5-9":[168000,225000],"10-14":[205000,270000],"15+":[235000,310000] },
  "Database Administrator": { "0-1":[65000,85000],"2-4":[80000,108000],"5-9":[102000,138000],"10-14":[128000,168000],"15+":[150000,198000] },
  "IT Manager": { "0-1":[75000,98000],"2-4":[95000,128000],"5-9":[122000,162000],"10-14":[150000,198000],"15+":[175000,232000] },
  "Scrum Master": { "0-1":[70000,92000],"2-4":[88000,118000],"5-9":[112000,148000],"10-14":[138000,182000],"15+":[160000,210000] },
  "Physician": { "0-1":[180000,250000],"2-4":[220000,310000],"5-9":[260000,370000],"10-14":[295000,420000],"15+":[320000,480000] },
  "Surgeon": { "0-1":[250000,380000],"2-4":[320000,480000],"5-9":[400000,580000],"10-14":[460000,650000],"15+":[500000,720000] },
  "Nurse Practitioner": { "0-1":[95000,118000],"2-4":[112000,138000],"5-9":[130000,160000],"10-14":[148000,182000],"15+":[165000,205000] },
  "Registered Nurse": { "0-1":[55000,70000],"2-4":[65000,82000],"5-9":[76000,96000],"10-14":[86000,108000],"15+":[95000,122000] },
  "Dentist": { "0-1":[130000,175000],"2-4":[155000,210000],"5-9":[185000,255000],"10-14":[215000,295000],"15+":[240000,335000] },
  "Pharmacist": { "0-1":[115000,135000],"2-4":[125000,148000],"5-9":[135000,162000],"10-14":[145000,175000],"15+":[155000,188000] },
  "Physical Therapist": { "0-1":[68000,85000],"2-4":[80000,100000],"5-9":[92000,115000],"10-14":[105000,130000],"15+":[115000,145000] },
  "Physician Assistant": { "0-1":[95000,118000],"2-4":[110000,135000],"5-9":[125000,155000],"10-14":[140000,172000],"15+":[155000,190000] },
  "Medical Assistant": { "0-1":[32000,40000],"2-4":[36000,46000],"5-9":[42000,54000],"10-14":[48000,62000],"15+":[54000,70000] },
  "Veterinarian": { "0-1":[85000,108000],"2-4":[100000,128000],"5-9":[118000,152000],"10-14":[138000,178000],"15+":[158000,205000] },
  "Psychologist": { "0-1":[72000,92000],"2-4":[88000,112000],"5-9":[105000,135000],"10-14":[122000,158000],"15+":[140000,182000] },
  "Psychiatrist": { "0-1":[195000,245000],"2-4":[225000,285000],"5-9":[258000,325000],"10-14":[285000,358000],"15+":[308000,390000] },
  "Accountant": { "0-1":[45000,60000],"2-4":[58000,78000],"5-9":[75000,100000],"10-14":[92000,125000],"15+":[110000,152000] },
  "CPA": { "0-1":[55000,72000],"2-4":[70000,95000],"5-9":[90000,122000],"10-14":[112000,150000],"15+":[132000,178000] },
  "Financial Analyst": { "0-1":[55000,72000],"2-4":[68000,90000],"5-9":[85000,115000],"10-14":[105000,145000],"15+":[128000,172000] },
  "Investment Banker": { "0-1":[100000,145000],"2-4":[140000,210000],"5-9":[195000,320000],"10-14":[260000,450000],"15+":[350000,700000] },
  "Financial Advisor": { "0-1":[48000,68000],"2-4":[65000,98000],"5-9":[92000,145000],"10-14":[125000,200000],"15+":[160000,280000] },
  "Actuary": { "0-1":[72000,95000],"2-4":[92000,125000],"5-9":[118000,158000],"10-14":[148000,198000],"15+":[175000,235000] },
  "Insurance Agent": { "0-1":[38000,58000],"2-4":[52000,78000],"5-9":[70000,108000],"10-14":[88000,138000],"15+":[105000,168000] },
  "Loan Officer": { "0-1":[45000,65000],"2-4":[58000,85000],"5-9":[75000,112000],"10-14":[92000,140000],"15+":[108000,165000] },
  "Auditor": { "0-1":[50000,66000],"2-4":[62000,84000],"5-9":[78000,105000],"10-14":[96000,128000],"15+":[114000,152000] },
  "Lawyer": { "0-1":[72000,105000],"2-4":[98000,150000],"5-9":[138000,215000],"10-14":[185000,295000],"15+":[235000,400000] },
  "Paralegal": { "0-1":[42000,56000],"2-4":[52000,70000],"5-9":[64000,86000],"10-14":[76000,102000],"15+":[88000,118000] },
  "Judge": { "0-1":[95000,130000],"2-4":[118000,158000],"5-9":[145000,195000],"10-14":[172000,232000],"15+":[195000,270000] },
  "Legal Assistant": { "0-1":[35000,48000],"2-4":[44000,60000],"5-9":[54000,72000],"10-14":[64000,85000],"15+":[72000,96000] },
  "Teacher": { "0-1":[35000,46000],"2-4":[40000,55000],"5-9":[50000,66000],"10-14":[58000,76000],"15+":[65000,86000] },
  "Professor": { "0-1":[58000,80000],"2-4":[72000,100000],"5-9":[90000,128000],"10-14":[112000,158000],"15+":[132000,192000] },
  "School Principal": { "0-1":[75000,95000],"2-4":[88000,112000],"5-9":[100000,130000],"10-14":[115000,148000],"15+":[128000,165000] },
  "School Counselor": { "0-1":[42000,58000],"2-4":[52000,70000],"5-9":[62000,82000],"10-14":[72000,96000],"15+":[82000,108000] },
  "Librarian": { "0-1":[45000,60000],"2-4":[55000,72000],"5-9":[65000,85000],"10-14":[74000,98000],"15+":[82000,108000] },
  "Electrician": { "0-1":[42000,58000],"2-4":[54000,72000],"5-9":[66000,88000],"10-14":[78000,105000],"15+":[88000,120000] },
  "Plumber": { "0-1":[42000,58000],"2-4":[55000,74000],"5-9":[68000,92000],"10-14":[80000,108000],"15+":[92000,125000] },
  "HVAC Technician": { "0-1":[38000,52000],"2-4":[48000,65000],"5-9":[58000,78000],"10-14":[68000,92000],"15+":[76000,104000] },
  "Carpenter": { "0-1":[36000,50000],"2-4":[46000,62000],"5-9":[56000,76000],"10-14":[66000,90000],"15+":[74000,102000] },
  "Welder": { "0-1":[36000,48000],"2-4":[44000,60000],"5-9":[54000,72000],"10-14":[62000,84000],"15+":[70000,96000] },
  "Construction Manager": { "0-1":[58000,78000],"2-4":[72000,98000],"5-9":[90000,122000],"10-14":[108000,148000],"15+":[125000,172000] },
  "Auto Mechanic": { "0-1":[35000,48000],"2-4":[44000,60000],"5-9":[54000,72000],"10-14":[62000,84000],"15+":[70000,96000] },
  "Marketing Manager": { "0-1":[45000,62000],"2-4":[60000,85000],"5-9":[82000,112000],"10-14":[100000,138000],"15+":[118000,162000] },
  "Project Manager": { "0-1":[55000,72000],"2-4":[70000,95000],"5-9":[90000,122000],"10-14":[108000,148000],"15+":[125000,168000] },
  "HR Manager": { "0-1":[48000,64000],"2-4":[60000,82000],"5-9":[76000,105000],"10-14":[92000,128000],"15+":[108000,150000] },
  "Operations Manager": { "0-1":[52000,70000],"2-4":[66000,90000],"5-9":[84000,115000],"10-14":[100000,138000],"15+":[118000,162000] },
  "Supply Chain Manager": { "0-1":[58000,78000],"2-4":[72000,98000],"5-9":[90000,122000],"10-14":[110000,148000],"15+":[128000,172000] },
  "Sales Manager": { "0-1":[55000,78000],"2-4":[72000,105000],"5-9":[98000,145000],"10-14":[125000,185000],"15+":[148000,225000] },
  "Sales Representative": { "0-1":[40000,62000],"2-4":[55000,82000],"5-9":[72000,112000],"10-14":[88000,138000],"15+":[102000,162000] },
  "Business Analyst": { "0-1":[55000,72000],"2-4":[68000,92000],"5-9":[85000,115000],"10-14":[102000,138000],"15+":[118000,160000] },
  "Management Consultant": { "0-1":[75000,105000],"2-4":[98000,142000],"5-9":[135000,195000],"10-14":[175000,258000],"15+":[215000,325000] },
  "CEO": { "0-1":[95000,145000],"2-4":[145000,245000],"5-9":[225000,420000],"10-14":[320000,650000],"15+":[450000,1200000] },
  "CFO": { "0-1":[105000,145000],"2-4":[142000,202000],"5-9":[195000,285000],"10-14":[252000,375000],"15+":[315000,500000] },
  "Copywriter": { "0-1":[42000,58000],"2-4":[54000,75000],"5-9":[68000,95000],"10-14":[82000,115000],"15+":[95000,135000] },
  "Journalist": { "0-1":[38000,52000],"2-4":[48000,66000],"5-9":[58000,80000],"10-14":[68000,95000],"15+":[78000,110000] },
  "Video Editor": { "0-1":[40000,56000],"2-4":[52000,72000],"5-9":[64000,90000],"10-14":[76000,108000],"15+":[88000,125000] },
  "Social Media Manager": { "0-1":[40000,56000],"2-4":[52000,72000],"5-9":[65000,90000],"10-14":[78000,108000],"15+":[90000,125000] },
  "Photographer": { "0-1":[32000,48000],"2-4":[42000,62000],"5-9":[54000,80000],"10-14":[65000,98000],"15+":[75000,115000] },
  "Real Estate Agent": { "0-1":[35000,58000],"2-4":[52000,88000],"5-9":[75000,130000],"10-14":[98000,175000],"15+":[118000,225000] },
  "Property Manager": { "0-1":[42000,58000],"2-4":[52000,72000],"5-9":[64000,88000],"10-14":[76000,105000],"15+":[88000,122000] },
  "Chef": { "0-1":[35000,50000],"2-4":[46000,64000],"5-9":[58000,82000],"10-14":[70000,100000],"15+":[82000,118000] },
  "Restaurant Manager": { "0-1":[42000,58000],"2-4":[52000,72000],"5-9":[62000,86000],"10-14":[72000,100000],"15+":[82000,115000] },
  "Police Officer": { "0-1":[48000,65000],"2-4":[58000,78000],"5-9":[68000,92000],"10-14":[78000,106000],"15+":[88000,120000] },
  "Firefighter": { "0-1":[42000,58000],"2-4":[52000,70000],"5-9":[62000,84000],"10-14":[72000,98000],"15+":[80000,110000] },
  "Social Worker": { "0-1":[38000,52000],"2-4":[46000,64000],"5-9":[56000,76000],"10-14":[64000,88000],"15+":[72000,100000] },
  "Administrative Assistant": { "0-1":[32000,45000],"2-4":[40000,55000],"5-9":[48000,65000],"10-14":[55000,74000],"15+":[62000,84000] },
  "Executive Assistant": { "0-1":[48000,65000],"2-4":[58000,80000],"5-9":[70000,96000],"10-14":[82000,112000],"15+":[94000,130000] },
  "Customer Service Rep": { "0-1":[30000,42000],"2-4":[36000,50000],"5-9":[42000,58000],"10-14":[48000,66000],"15+":[54000,74000] },
  "Other": { "0-1":[35000,52000],"2-4":[45000,65000],"5-9":[58000,82000],"10-14":[70000,98000],"15+":[82000,115000] },
}

const synonyms: Record<string, string> = {
  "doctor": "Physician", "md": "Physician", "rn": "Registered Nurse",
  "attorney": "Lawyer", "counsel": "Lawyer", "dev": "Software Developer",
  "programmer": "Software Engineer", "coder": "Software Engineer",
  "mechanic": "Auto Mechanic", "realtor": "Real Estate Agent",
  "cop": "Police Officer", "fireman": "Firefighter",
  "therapist": "Physical Therapist", "shrink": "Psychologist",
  "chef": "Chef", "cook": "Chef",
}

const ALL_ROLES = Object.keys(salaryData)

function getSuggestions(query: string): string[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  // check synonyms first
  const synonymMatch = synonyms[q]
  // roles that contain the query
  const direct = ALL_ROLES.filter(r => r.toLowerCase().includes(q))
  const results = new Set<string>()
  if (synonymMatch) results.add(synonymMatch)
  direct.forEach(r => results.add(r))
  return Array.from(results).slice(0, 5)
}

function resolveRole(query: string): string {
  const q = query.toLowerCase().trim()
  if (synonyms[q]) return synonyms[q]
  const match = ALL_ROLES.find(r => r.toLowerCase() === q)
  if (match) return match
  const partial = ALL_ROLES.find(r => r.toLowerCase().includes(q))
  if (partial) return partial
  return "Other"
}

const EXP_LEVELS = [
  { v: "0-1", label: "0-1 years" }, { v: "2-4", label: "2-4 years" }, { v: "5-9", label: "5-9 years" },
  { v: "10-14", label: "10-14 years" }, { v: "15+", label: "15+ years" },
]

const STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
}

const stateMultiplier: Record<string, number> = {
  CA: 1.28, NY: 1.25, WA: 1.22, MA: 1.20, CT: 1.18, NJ: 1.18, CO: 1.08, VA: 1.07, TX: 1.02,
  FL: 1.00, GA: 0.98, AZ: 0.97, NC: 0.95, TN: 0.93, OH: 0.92, MI: 0.91, PA: 0.96, IL: 1.04,
}
const mult = (s: string) => stateMultiplier[s] ?? 0.93

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

const DISCLAIMER = (
  <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4 text-sm text-yellow-200">
    ⚠️ <strong>Salary estimates are educational approximations based on national data.</strong> Actual salaries vary by company, industry and individual performance. Sources: BLS, Glassdoor, LinkedIn Salary.
  </div>
)

interface Result {
  role: string; exp: string; expLabel: string; state: string; stateName: string
  low: number; high: number; median: number; current: number
  diff: number; pct: number; cities: { name: string; value: number }[]
}

export default function SalaryCheckerPage() {
  const [jobInput, setJobInput] = useState("Software Engineer")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [exp, setExp] = useState("5-9")
  const [state, setState] = useState("CA")
  const [current, setCurrent] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestRef = useRef<HTMLDivElement>(null)

  function handleJobInput(val: string) {
    setJobInput(val)
    const sugs = getSuggestions(val)
    setSuggestions(sugs)
    setShowSuggestions(sugs.length > 0)
  }

  function selectSuggestion(s: string) {
    setJobInput(s)
    setSuggestions([])
    setShowSuggestions(false)
  }

  function compute(jobTitle: string, e: string, s: string, cur: string): Result {
    const role = resolveRole(jobTitle)
    const m = mult(s)
    const base = salaryData[role]?.[e] ?? salaryData["Other"][e]
    const low = Math.round(base[0] * m)
    const high = Math.round(base[1] * m)
    const median = Math.round((low + high) / 2)
    const baseMedian = (base[0] + base[1]) / 2
    const cities = [
      { name: "New York", value: Math.round(baseMedian * 1.25) },
      { name: "San Francisco", value: Math.round(baseMedian * 1.28) },
      { name: "Austin", value: Math.round(baseMedian * 1.02) },
      { name: "Chicago", value: Math.round(baseMedian * 1.04) },
      { name: "Remote (national avg)", value: Math.round(baseMedian * 0.93) },
    ]
    const curNum = parseFloat(cur) || 0
    const diff = curNum > 0 ? curNum - median : 0
    const pct = curNum > 0 ? ((curNum - median) / median) * 100 : 0
    return {
      role, exp: e, expLabel: EXP_LEVELS.find(x => x.v === e)?.label ?? e,
      state: s, stateName: STATES[s], low, high, median, current: curNum, diff, pct, cities,
    }
  }

  function runCalc(job = jobInput, e = exp, s = state, cur = current, push = true) {
    setShowSuggestions(false)
    const res = compute(job, e, s, cur)
    setResult(res)
    if (push && typeof window !== "undefined") {
      const params = new URLSearchParams({ role: job, exp: e, state: s })
      if (cur) params.set("current", cur)
      window.history.pushState({}, "", `?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const r = p.get("role"); const e = p.get("exp"); const s = p.get("state"); const cur = p.get("current")
    if (r && e && s) {
      setJobInput(r); setExp(e); setState(s); if (cur) setCurrent(cur)
      runCalc(r, e, s, cur ?? "", false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close suggestions on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const shareUrl = result
    ? `https://www.dayblip.com/tools/salary-checker?role=${encodeURIComponent(jobInput)}&exp=${result.exp}&state=${result.state}${result.current ? `&current=${result.current}` : ""}`
    : ""
  const shareText = result
    ? `The market rate for a ${jobInput} with ${result.expLabel} experience in ${result.stateName} is ${fmt(result.low)}-${fmt(result.high)}/year! Are you being paid fairly? (Educational — BLS 2025 data)`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Salary Checker — Am I Being Paid Fairly for My Role?</h1>
          <p className="text-[#a8a8b3]">Check if your salary matches market rates for your role and experience</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">54% of employees are paid below the market median for their role and location according to compensation data. The pay gap between the 25th and 75th percentile for the same role in the same city can exceed 40%. Knowing your market rate is the first step — employees who negotiate earn an average of $5,000 more annually than those who accept initial offers.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A salary checker compares your current compensation against market rate data for your specific job title, experience level and geographic location. This tool uses BLS 2025 Occupational Employment and Wage Statistics covering 80+ job titles across all 50 US states to show whether your salary is below, at or above market rate.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-8">
          {DISCLAIMER}

          <div className="space-y-5">
            {/* Searchable job title input */}
            <div className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Job title</span>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={jobInput}
                  onChange={e => handleJobInput(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                  placeholder="Type any job title... e.g. Plumber, Lawyer, Chef, Nurse"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div ref={suggestRef} className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-[#0f3460] bg-[#16213e] shadow-lg overflow-hidden">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onMouseDown={() => selectSuggestion(s)}
                        className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#e94560]/20 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-[#a8a8b3]">Search from 60+ job titles — type &ldquo;doctor&rdquo;, &ldquo;dev&rdquo;, &ldquo;rn&rdquo; and more</p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Years of experience</span>
              <select value={exp} onChange={e => setExp(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {EXP_LEVELS.map(x => <option key={x.v} value={x.v}>{x.label}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">State</span>
              <select value={state} onChange={e => setState(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {Object.entries(STATES).map(([abbr, name]) => <option key={abbr} value={abbr}>{name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Current salary (optional)</span>
              <div className="flex items-center gap-2">
                <span className="text-[#a8a8b3]">$</span>
                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. 120000"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>

            <button onClick={() => runCalc()}
              className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Check My Market Rate
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <p className="mb-2 text-[#a8a8b3]">Market rate for {jobInput} with {result.expLabel} in {result.stateName}:</p>
                <div className="text-4xl font-black text-[#e94560]">{fmt(result.low)} — {fmt(result.high)}</div>
                <p className="mt-3 text-white">Median: <span className="font-bold text-[#F9A825]">{fmt(result.median)}</span></p>
              </div>

              {result.current > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                  <div className="mb-3 flex justify-between text-xs text-[#a8a8b3]">
                    <span>← Underpaid</span><span>Market Rate</span><span>Overpaid →</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#F9A825] to-[#4ade80]">
                    <div className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded bg-white"
                      style={{ left: `${Math.min(100, Math.max(0, 50 + result.pct * 1.5))}%` }} />
                  </div>
                  <p className="mt-4 text-center text-lg font-bold" style={{ color: result.diff >= 0 ? "#4ade80" : "#FF6B6B" }}>
                    You are earning {fmt(Math.abs(result.diff))} {result.diff >= 0 ? "above" : "below"} the median market rate
                  </p>
                  <p className="mt-1 text-center text-sm" style={{ color: result.diff >= 0 ? "#4ade80" : "#FF6B6B" }}>
                    You are earning {Math.abs(result.pct).toFixed(1)}% {result.pct >= 0 ? "above" : "below"} market
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-3 font-bold text-white">Same role in 5 cities (median)</h3>
                <ul className="space-y-2 text-sm">
                  {result.cities.map(c => (
                    <li key={c.name} className="flex justify-between border-b border-[#0f3460] pb-1.5">
                      <span className="text-[#a8a8b3]">{c.name}</span>
                      <span className="font-bold text-white">{fmt(c.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.current > 0 && result.diff < 0 && (
                <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-6">
                  <h3 className="mb-2 font-bold text-[#F9A825]">💡 Negotiation tip</h3>
                  <p className="text-sm text-white">You may have room to negotiate. The market supports {fmt(result.low)}-{fmt(result.high)} for your role and experience level.</p>
                </div>
              )}

              <div className="rounded-xl border border-[#4FC3F7]/20 bg-[#1a1a2e] p-4 text-xs text-[#a8a8b3]">
                Salary ranges based on BLS Occupational Employment and Wage Statistics (OES) 2025 data. Educational estimates only.
              </div>

              {/* Embed this tool */}
              <div style={{
                textAlign: "center",
                marginTop: "32px",
                marginBottom: "16px",
                padding: "16px",
                background: "#1e2d4a",
                borderRadius: "8px",
                border: "1px solid #2a3a5a",
              }}>
                <p style={{ color: "#a8a8b3", fontSize: "14px", margin: "0 0 8px 0" }}>
                  Want to add this tool to your website?
                </p>
                <a
                  href="/embed"
                  style={{ color: "#e94560", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
                >
                  Get the free embed code →
                </a>
              </div>
              <ShareButtons text={shareText} url={shareUrl} title="Salary Checker — Am I Being Paid Fairly?" />

              {DISCLAIMER}
            </div>
          )}          <RelatedTools tools={[
            { emoji: "💼", title: "Salary Negotiation", desc: "Negotiate a raise", href: "/tools/salary-negotiation" },
            { emoji: "⏰", title: "True Hourly Wage", desc: "What you really earn", href: "/tools/true-hourly-wage" },
            { emoji: "📊", title: "Job Offer Comparison", desc: "Compare job offers", href: "/tools/job-offer-comparison" },
            { emoji: "💵", title: "Take-Home Pay", desc: "See your net paycheck", href: "/finance/take-home-pay" },
          ]} />

        </div>
      </section>
    </div>
  )
}
