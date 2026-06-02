"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"

// ─── Synonym resolution ───────────────────────────────────────────────────────
const synonyms: Record<string, string> = {
  "doctor": "Physician", "md": "Physician", "rn": "Registered Nurse",
  "attorney": "Lawyer", "counsel": "Lawyer",
  "programmer": "Software Engineer", "developer": "Software Engineer",
  "coder": "Software Engineer", "dev": "Software Engineer",
  "designer": "Graphic Designer", "reporter": "Journalist",
  "therapist": "Psychologist", "cop": "Police Officer",
  "officer": "Police Officer", "cook": "Chef", "hr": "HR Manager",
  "bookkeeper": "Bookkeeper", "data entry": "Data Entry Clerk",
}

// ─── Risk database ────────────────────────────────────────────────────────────
interface RiskEntry {
  score: number; label: string; color: string
  automatedTasks: string[]; safeTasks: string[]
  timeline: string; pivotSkills: string[]; insight: string
}

const aiRiskData: Record<string, RiskEntry> = {
  "Data Entry Clerk": {
    score: 95, label: "Critical Risk", color: "#dc2626",
    automatedTasks: ["Entering data into systems", "Processing forms and documents", "Copy-paste operations", "Basic data validation"],
    safeTasks: ["Handling exceptions and anomalies", "Client communication", "Quality judgment calls"],
    timeline: "Already happening — 1-3 years",
    pivotSkills: ["Data analysis and visualization", "AI prompt engineering", "Process automation management"],
    insight: "Data entry is among the most automated roles. AI handles repetitive data tasks faster and more accurately than humans.",
  },
  "Telemarketer": {
    score: 92, label: "Critical Risk", color: "#dc2626",
    automatedTasks: ["Cold calling scripts", "Lead qualification", "Appointment scheduling", "Basic customer responses"],
    safeTasks: ["Complex negotiations", "High-value relationship sales", "Emotional support situations"],
    timeline: "1-3 years",
    pivotSkills: ["Consultative sales", "Account management", "Digital marketing"],
    insight: "AI voice agents already handle basic telemarketing at scale and cost a fraction of human agents.",
  },
  "Bookkeeper": {
    score: 88, label: "Critical Risk", color: "#dc2626",
    automatedTasks: ["Transaction categorization", "Bank reconciliation", "Invoice processing", "Basic financial reports", "Payroll calculations"],
    safeTasks: ["Complex tax strategy", "Client advisory relationships", "Audit judgment calls", "Business financial planning"],
    timeline: "2-4 years",
    pivotSkills: ["Strategic CFO advisory", "Tax planning specialist", "AI accounting tools management"],
    insight: "QuickBooks AI already automates most bookkeeping tasks. Strategic advisory roles remain safe.",
  },
  "Cashier": {
    score: 85, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Processing transactions", "Scanning items", "Cash handling", "Basic customer service queries"],
    safeTasks: ["Handling disputes and complaints", "Assisting customers with special needs", "Loss prevention judgment"],
    timeline: "2-5 years",
    pivotSkills: ["Retail management", "Customer experience specialist", "Inventory and supply chain"],
    insight: "Self-checkout and cashierless stores like Amazon Go are expanding rapidly across retail.",
  },
  "Paralegal": {
    score: 80, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Legal document review", "Contract analysis and comparison", "Case research and summarization", "Standard document drafting", "Discovery document processing"],
    safeTasks: ["Complex litigation support", "Client relationship management", "Courtroom presence and coordination", "Ethical judgment and strategy"],
    timeline: "2-5 years",
    pivotSkills: ["Legal AI tools specialist", "Litigation strategy support", "Legal operations management"],
    insight: "AI legal tools like Harvey and Casetext already handle document review at major law firms.",
  },
  "Graphic Designer": {
    score: 68, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Stock image and illustration creation", "Basic logo generation", "Template-based social media graphics", "Simple product mockups"],
    safeTasks: ["Brand identity strategy", "Complex creative direction", "Client collaboration and briefing", "Original concept development", "Motion and interactive design"],
    timeline: "Already happening — 2-5 years",
    pivotSkills: ["Brand strategy and direction", "UX and UI design", "Motion design and animation", "AI art direction and prompting"],
    insight: "Midjourney and DALL-E already handle basic graphic tasks. Strategic creative direction stays human.",
  },
  "Accountant": {
    score: 72, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Tax return preparation", "Financial statement generation", "Audit data analysis", "Expense categorization", "Compliance checking"],
    safeTasks: ["Complex tax strategy", "Mergers and acquisitions advisory", "Forensic accounting", "Client relationship management", "Ethical and judgment decisions"],
    timeline: "3-7 years",
    pivotSkills: ["Strategic financial advisory", "AI accounting oversight", "Business consulting", "Specialized tax strategy"],
    insight: "Basic accounting is rapidly automating. Strategic advisory and complex judgment remain human-essential.",
  },
  "Radiologist": {
    score: 70, label: "High Risk", color: "#ea580c",
    automatedTasks: ["X-ray and scan reading", "Anomaly detection in images", "Routine report generation", "Standard image classification"],
    safeTasks: ["Complex multi-system cases", "Patient consultation", "Interventional procedures", "Treatment planning decisions"],
    timeline: "3-7 years",
    pivotSkills: ["Interventional radiology", "AI radiology oversight", "Clinical decision support"],
    insight: "AI already matches radiologists on many scan types. Interventional and complex cases stay safe.",
  },
  "Journalist": {
    score: 60, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Routine news summaries", "Sports and earnings reports", "Basic data journalism", "SEO article writing"],
    safeTasks: ["Investigative journalism", "Source cultivation and protection", "Complex narrative writing", "Breaking news judgment", "Video and field reporting"],
    timeline: "3-6 years",
    pivotSkills: ["Investigative reporting", "Video and audio journalism", "Podcast production", "AI-assisted research"],
    insight: "AI writes routine articles. Investigative and narrative journalism requires human sources and judgment.",
  },
  "Financial Analyst": {
    score: 65, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Financial modeling and projections", "Market data analysis", "Standard report writing", "Performance tracking dashboards"],
    safeTasks: ["Investment thesis development", "Client advisory relationships", "Novel market analysis", "Strategic recommendations"],
    timeline: "4-8 years",
    pivotSkills: ["Investment banking advisory", "Quantitative strategy", "AI financial tools management"],
    insight: "AI handles data analysis rapidly. Novel insights, strategy and client trust remain human.",
  },
  "Real Estate Agent": {
    score: 62, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Property matching algorithms", "Market analysis reports", "Virtual tour creation", "Contract document preparation", "Lead generation and qualification"],
    safeTasks: ["Price negotiation", "Client relationship building", "Local market expertise", "Emotional guidance in purchase", "Complex deal structuring"],
    timeline: "3-7 years",
    pivotSkills: ["Luxury and niche markets", "Commercial real estate", "Property investment advisory"],
    insight: "Major life purchases need human trust. AI handles search but not negotiation or emotional support.",
  },
  "Marketing Manager": {
    score: 55, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Ad copy generation", "Email campaign creation", "Social media scheduling", "A/B testing analysis", "Performance reporting"],
    safeTasks: ["Brand strategy", "Creative direction", "Stakeholder management", "Crisis communications", "Novel campaign concepts"],
    timeline: "3-7 years",
    pivotSkills: ["AI marketing strategy", "Brand storytelling", "Customer experience design"],
    insight: "AI handles execution tasks. Strategy, creativity and human insight remain essential.",
  },
  "HR Manager": {
    score: 52, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Resume screening and ranking", "Interview scheduling", "Onboarding documentation", "Benefits administration", "Compliance tracking"],
    safeTasks: ["Conflict resolution", "Culture building and management", "Complex employee relations", "Leadership development", "Sensitive terminations"],
    timeline: "4-8 years",
    pivotSkills: ["Organizational development", "AI recruitment oversight", "People analytics strategy"],
    insight: "AI handles admin and screening. Human empathy and judgment in people decisions is irreplaceable.",
  },
  "Lawyer": {
    score: 58, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Contract review and drafting", "Legal research and summarization", "Discovery document review", "Basic compliance work", "Standard template documents"],
    safeTasks: ["Complex litigation strategy", "Courtroom advocacy", "Strategic legal counsel", "Client relationship management", "Ethical judgment calls"],
    timeline: "3-8 years for routine work",
    pivotSkills: ["Litigation specialization", "AI legal tools management", "Legal strategy advisory"],
    insight: "AI handles routine legal work. Complex advocacy, strategy and client relationships remain human.",
  },
  "Software Engineer": {
    score: 45, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Boilerplate and routine code writing", "Simple bug fixing", "Unit test generation", "Code documentation", "Code review assistance"],
    safeTasks: ["System architecture design", "Complex problem solving", "Cross-team collaboration", "Security and ethical decisions", "Novel algorithm design"],
    timeline: "5-10 years",
    pivotSkills: ["AI system architecture", "AI prompt engineering", "Machine learning engineering", "Product thinking"],
    insight: "AI accelerates coding but cannot replace system thinking, architecture and complex problem solving.",
  },
  "UX Designer": {
    score: 38, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Wireframe and mockup generation", "Basic usability testing", "Design system components", "Accessibility checking"],
    safeTasks: ["User research and empathy mapping", "Complex interaction design", "Stakeholder collaboration", "Novel experience strategy", "Ethical design decisions"],
    timeline: "5-10 years",
    pivotSkills: ["AI experience design", "Voice and gesture UI", "Design strategy leadership"],
    insight: "User research and empathy require human insight. AI handles production design tasks.",
  },
  "Project Manager": {
    score: 42, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Status report generation", "Meeting scheduling and minutes", "Task tracking updates", "Resource allocation basics", "Timeline and Gantt creation"],
    safeTasks: ["Stakeholder management", "Conflict resolution", "Risk judgment calls", "Team motivation", "Complex negotiations"],
    timeline: "5-10 years",
    pivotSkills: ["Strategic program management", "AI tools integration lead", "Organizational change management"],
    insight: "AI handles administrative tasks. Human judgment in people management is irreplaceable.",
  },
  "Teacher": {
    score: 25, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Grading routine assignments", "Generating lesson plan drafts", "Answering basic student questions", "Administrative paperwork"],
    safeTasks: ["Mentoring and inspiring students", "Classroom management", "Emotional support and guidance", "Adapting to individual student needs", "Social skill development"],
    timeline: "AI assists teachers — not replaces",
    pivotSkills: ["AI-enhanced teaching methods", "Social-emotional learning specialist", "Educational technology leadership"],
    insight: "Children need human connection and mentorship. AI is a powerful tool for teachers, not a replacement.",
  },
  "Physician": {
    score: 30, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Routine diagnosis assistance", "Medical literature review", "Standard documentation", "Basic triage support"],
    safeTasks: ["Complex diagnosis and treatment", "Patient relationship and trust", "Emergency decision making", "Surgical and procedural work", "Rare and novel cases"],
    timeline: "AI assists physicians — 10+ years before significant displacement",
    pivotSkills: ["AI diagnostic oversight", "Complex case specialization", "Telemedicine leadership"],
    insight: "AI assists with diagnosis but cannot replace clinical judgment, patient trust or complex treatment.",
  },
  "Surgeon": {
    score: 20, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Routine procedure robotic assistance", "Surgical planning from scans", "Post-operative documentation"],
    safeTasks: ["Complex surgical judgment", "Intraoperative decisions", "Patient consultation", "Rare and emergency surgery", "Novel procedure development"],
    timeline: "Robotic assistance yes — full replacement no",
    pivotSkills: ["Robotic surgery specialization", "Minimally invasive techniques", "Surgical AI oversight"],
    insight: "Surgical robots assist but surgeons direct. Complex cases require years of human training and judgment.",
  },
  "Registered Nurse": {
    score: 15, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Basic vital sign monitoring", "Medication scheduling reminders", "Routine documentation", "Patient data entry"],
    safeTasks: ["Patient physical assessment and care", "Emotional support and communication", "Complex clinical judgment", "Emergency response", "Family consultation", "Physical procedures and treatments"],
    timeline: "AI assists with admin only",
    pivotSkills: ["Advanced practice nursing", "Telehealth specialization", "Healthcare AI tools management"],
    insight: "Nursing requires human touch, physical presence and complex empathy. One of the safest careers.",
  },
  "Psychologist": {
    score: 8, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Appointment scheduling", "Basic psychoeducation content", "Session notes formatting"],
    safeTasks: ["Therapeutic relationship building", "Trauma processing and treatment", "Crisis intervention", "Complex mental health assessment", "Human empathy and connection"],
    timeline: "AI supplements only — not replacing",
    pivotSkills: ["Teletherapy specialization", "AI-assisted therapy tools", "Group therapy facilitation"],
    insight: "Human connection is the foundation of therapy. AI cannot replicate empathy, trust or healing relationships.",
  },
  "Electrician": {
    score: 12, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Scheduling and dispatch", "Basic diagnostic readings", "Invoice generation"],
    safeTasks: ["Physical installation and repair", "On-site problem diagnosis", "Safety judgment and code compliance", "Emergency troubleshooting"],
    timeline: "Physical work — not replacing",
    pivotSkills: ["Solar and EV charging installation", "Smart home systems specialist", "Electrical contracting business"],
    insight: "Physical skilled trades require hands-on presence and real-world judgment. Robots cannot do this affordably.",
  },
  "Plumber": {
    score: 10, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Job scheduling and dispatch", "Parts ordering and inventory", "Basic remote diagnostics"],
    safeTasks: ["Physical installation and repair", "On-site problem solving", "Emergency water and gas response", "Code compliance decisions"],
    timeline: "Physical work — not replacing",
    pivotSkills: ["Smart plumbing systems", "Water efficiency specialist", "Plumbing business ownership"],
    insight: "Skilled trades requiring physical presence and hands-on work are among the safest from AI replacement.",
  },
  "Social Worker": {
    score: 12, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Case documentation", "Resource lookup and matching", "Report generation"],
    safeTasks: ["Crisis intervention", "Child welfare assessment", "Community advocacy", "Trust building with clients", "Complex family situation navigation"],
    timeline: "AI assists with admin only",
    pivotSkills: ["Policy advocacy", "Community organization", "Mental health integration"],
    insight: "Social work requires human empathy, trust and physical presence in communities. Very safe career.",
  },
  "Chef": {
    score: 18, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Recipe generation and variation", "Inventory management", "Nutritional calculation"],
    safeTasks: ["Creative cuisine development", "Kitchen team leadership", "Quality judgment and tasting", "Customer experience creation", "Physical cooking execution"],
    timeline: "AI tools assist — not replacing",
    pivotSkills: ["Culinary entrepreneurship", "Food tech consulting", "Specialty cuisine development"],
    insight: "Creative cooking, leadership and physical food preparation require human skill and artistry.",
  },
  "Police Officer": {
    score: 22, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Report writing assistance", "Traffic monitoring", "Data analysis and predictive routing"],
    safeTasks: ["Physical enforcement and presence", "Crisis de-escalation", "Community relations building", "Complex investigations", "Emergency response"],
    timeline: "AI assists — physical role safe",
    pivotSkills: ["Cybercrime investigation", "Community policing specialist", "Forensic technology"],
    insight: "Physical presence, community trust and complex judgment keep policing largely human-dependent.",
  },
  "Other": {
    score: 48, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Routine and repetitive tasks", "Data processing and entry", "Report and document generation", "Scheduling and calendar management"],
    safeTasks: ["Complex human judgment calls", "Physical hands-on tasks", "Creative and novel problems", "Client and stakeholder relationships"],
    timeline: "3-8 years depending on specific role",
    pivotSkills: ["AI tools proficiency in your field", "Critical thinking and analysis", "Human-centered communication skills"],
    insight: "Most roles will be transformed by AI rather than fully replaced. Adapt, specialize and embrace AI tools.",
  },
}

const ALL_JOBS = Object.keys(aiRiskData).filter(k => k !== "Other")

function getSuggestions(q: string): string[] {
  if (!q.trim()) return []
  const lq = q.toLowerCase().trim()
  const synMatch = synonyms[lq]
  const direct = ALL_JOBS.filter(j => j.toLowerCase().includes(lq))
  const results = new Set<string>()
  if (synMatch && aiRiskData[synMatch]) results.add(synMatch)
  direct.forEach(j => results.add(j))
  return Array.from(results).slice(0, 5)
}

function resolveJob(q: string): string {
  const lq = q.toLowerCase().trim()
  if (synonyms[lq] && aiRiskData[synonyms[lq]]) return synonyms[lq]
  const exact = ALL_JOBS.find(j => j.toLowerCase() === lq)
  if (exact) return exact
  const partial = ALL_JOBS.find(j => j.toLowerCase().includes(lq))
  if (partial) return partial
  return "Other"
}

const riskEmoji = (score: number) =>
  score >= 81 ? "🚨" : score >= 61 ? "🔴" : score >= 41 ? "🟠" : score >= 21 ? "🟡" : "🟢"

export default function AIJobScorePage() {
  const [jobInput, setJobInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSug, setShowSug] = useState(false)
  const [result, setResult] = useState<{ jobTitle: string; entry: RiskEntry } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sugRef = useRef<HTMLDivElement>(null)

  function handleInput(val: string) {
    setJobInput(val)
    const s = getSuggestions(val)
    setSuggestions(s)
    setShowSug(s.length > 0)
  }

  function selectSug(s: string) {
    setJobInput(s)
    setSuggestions([])
    setShowSug(false)
  }

  function runCalc(input = jobInput, push = true) {
    if (!input.trim()) return
    const jobTitle = resolveJob(input)
    const entry = aiRiskData[jobTitle]
    setResult({ jobTitle, entry })
    setShowSug(false)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?job=${encodeURIComponent(input.trim())}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const j = p.get("job")
    if (j) { setJobInput(j); runCalc(j, false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (sugRef.current && !sugRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSug(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/ai-job-score?job=${encodeURIComponent(jobInput)}` : ""
  const shareText = result
    ? `My AI job replacement risk score: ${result.entry.score}/100 — ${result.entry.label}\nJob: ${result.jobTitle}\nKey safe skill: ${result.entry.safeTasks[0]}\nGet your score (free):`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Will AI Replace Your Job?</h1>
          <p className="text-[#a8a8b3]">Get your personalized AI risk score based on your job title</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <span className="mb-2 block text-sm font-semibold text-white">Your job title</span>
              <input
                ref={inputRef}
                type="text"
                value={jobInput}
                onChange={e => handleInput(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSug(true) }}
                onKeyDown={e => { if (e.key === "Enter") runCalc() }}
                placeholder="Type your job title… e.g. Accountant, Nurse, Developer"
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
              />
              {showSug && suggestions.length > 0 && (
                <div ref={sugRef} className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#0f3460] bg-[#16213e] shadow-lg">
                  {suggestions.map(s => (
                    <button key={s} onMouseDown={() => selectSug(s)} className="w-full px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-[#e94560]/20">{s}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => runCalc()} disabled={!jobInput.trim()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40">
              Get My AI Risk Score
            </button>
          </div>

          {result && (
            <div className="space-y-6">
              {/* Score gauge */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                <div className="text-sm text-[#a8a8b3]">AI Risk Score for: <span className="font-bold text-white">{result.jobTitle}</span></div>
                <div className="my-3 text-7xl font-black" style={{ color: result.entry.color }}>
                  {result.entry.score}<span className="text-3xl text-[#a8a8b3]">/100</span>
                </div>
                <div className="text-xl font-bold" style={{ color: result.entry.color }}>
                  {riskEmoji(result.entry.score)} {result.entry.label}
                </div>
                {/* Risk spectrum bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#a8a8b3] mb-1">
                    <span>Very Safe</span><span>Moderate</span><span>Critical Risk</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#15803d] via-[#d97706] to-[#dc2626]">
                    <div className="absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow-lg" style={{ left: `${result.entry.score}%` }} />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                <div className="font-bold text-white mb-1">⏱️ Estimated timeline</div>
                <div className="text-[#a8a8b3]">{result.entry.timeline}</div>
              </div>

              {/* Automated tasks */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5">
                <div className="mb-3 font-bold text-white">⚠️ Tasks AI is automating</div>
                <ul className="space-y-1.5 text-sm">
                  {result.entry.automatedTasks.map(t => <li key={t} className="flex items-start gap-2 text-[#a8a8b3]"><span className="mt-0.5 text-[#e94560]">✗</span>{t}</li>)}
                </ul>
              </div>

              {/* Safe tasks */}
              <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-5">
                <div className="mb-3 font-bold text-white">✅ Tasks still requiring humans</div>
                <ul className="space-y-1.5 text-sm">
                  {result.entry.safeTasks.map(t => <li key={t} className="flex items-start gap-2 text-[#a8a8b3]"><span className="mt-0.5 text-[#4ade80]">✓</span>{t}</li>)}
                </ul>
              </div>

              {/* Pivot skills */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <div className="mb-3 font-bold text-white">📈 Recommended pivot skills</div>
                <div className="flex flex-wrap gap-2">
                  {result.entry.pivotSkills.map(s => (
                    <span key={s} className="rounded-full border border-[#e94560]/50 bg-[#e94560]/10 px-3 py-1 text-sm text-white">{s}</span>
                  ))}
                </div>
              </div>

              {/* Insight */}
              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                <span className="font-bold text-[#F9A825]">💡 What this means: </span>{result.entry.insight}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-xs text-[#a8a8b3]">
                AI risk scores are estimates based on current technology trajectories and research. Individual roles vary by company, specialization and location. Focus on developing skills that complement AI rather than compete with it.
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Will AI Replace My Job?" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
