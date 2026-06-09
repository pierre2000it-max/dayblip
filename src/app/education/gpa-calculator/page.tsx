"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Grade map ─────────────────────────────────────────────────────────────────

const GRADES: [string, number][] = [
  ["A+", 4.0], ["A", 4.0], ["A-", 3.7],
  ["B+", 3.3], ["B", 3.0], ["B-", 2.7],
  ["C+", 2.3], ["C", 2.0], ["C-", 1.7],
  ["D+", 1.3], ["D", 1.0], ["D-", 0.7],
  ["F", 0.0],
]

type CourseType = "standard" | "honors" | "ap"

interface Course {
  id: number
  name: string
  grade: string
  credits: string
  type: CourseType
}

function newCourse(id: number): Course {
  return { id, name: "", grade: "A", credits: "3", type: "standard" }
}

function gradePoints(grade: string, type: CourseType, weighted: boolean): number {
  const base = GRADES.find(([g]) => g === grade)?.[1] ?? 0
  if (!weighted) return base
  const bonus = type === "honors" ? 0.5 : type === "ap" ? 1.0 : 0
  return Math.min(5.0, base + bonus)
}

function letterFromGPA(gpa: number): string {
  if (gpa >= 3.7) return "A"
  if (gpa >= 3.3) return "B+"
  if (gpa >= 3.0) return "B"
  if (gpa >= 2.7) return "B-"
  if (gpa >= 2.0) return "C"
  if (gpa >= 1.0) return "D"
  return "F"
}

let nextId = 5

export default function GPACalculatorPage() {
  const [tab, setTab] = useState<"semester" | "cumulative" | "needed">("semester")
  const [weighted, setWeighted] = useState(false)
  const [courses, setCourses] = useState<Course[]>([1, 2, 3, 4].map(newCourse))
  const [semResult, setSemResult] = useState<{ gpa: number; totalCredits: number; totalQP: number } | null>(null)

  // Cumulative tab
  const [currentGPA, setCurrentGPA] = useState("3.0")
  const [existingCredits, setExistingCredits] = useState("30")
  const [newSemGPA, setNewSemGPA] = useState("3.5")
  const [newSemCredits, setNewSemCredits] = useState("15")
  const [cumResult, setCumResult] = useState<{ newGPA: number; change: number; total: number } | null>(null)

  // Needed tab
  const [neededCurrentGPA, setNeededCurrentGPA] = useState("3.0")
  const [neededCredits, setNeededCredits] = useState("45")
  const [targetGPA, setTargetGPA] = useState("3.5")
  const [remainingCredits, setRemainingCredits] = useState("15")
  const [neededResult, setNeededResult] = useState<{ required: number; achievable: boolean; extraNeeded?: number } | null>(null)

  // ── Semester calc ──────────────────────────────────────────────────────────
  function calcSemester() {
    let totalQP = 0, totalCredits = 0
    for (const c of courses) {
      const cr = parseFloat(c.credits) || 0
      const gp = gradePoints(c.grade, c.type, weighted)
      totalQP += gp * cr
      totalCredits += cr
    }
    const gpa = totalCredits > 0 ? totalQP / totalCredits : 0
    setSemResult({ gpa, totalCredits, totalQP })
  }

  // ── Cumulative calc ────────────────────────────────────────────────────────
  function calcCumulative() {
    const cg = parseFloat(currentGPA) || 0
    const ec = parseFloat(existingCredits) || 0
    const ng = parseFloat(newSemGPA) || 0
    const nc = parseFloat(newSemCredits) || 0
    const newGPA = (cg * ec + ng * nc) / (ec + nc)
    setCumResult({ newGPA, change: newGPA - cg, total: ec + nc })
  }

  // ── Needed calc ────────────────────────────────────────────────────────────
  function calcNeeded() {
    const cg = parseFloat(neededCurrentGPA) || 0
    const cc = parseFloat(neededCredits) || 0
    const tg = parseFloat(targetGPA) || 0
    const rc = parseFloat(remainingCredits) || 0
    const currentQP = cg * cc
    const targetTotalQP = tg * (cc + rc)
    const requiredQP = targetTotalQP - currentQP
    const required = rc > 0 ? requiredQP / rc : Infinity
    if (required > 4.0) {
      const extra = Math.ceil((requiredQP - 4.0 * rc) / 4.0)
      setNeededResult({ required, achievable: false, extraNeeded: extra })
    } else {
      setNeededResult({ required, achievable: true })
    }
  }

  const shareText = semResult
    ? `My semester GPA is ${semResult.gpa.toFixed(2)}. Calculate yours free — no signup: www.dayblip.com/education/gpa-calculator`
    : "Calculate your GPA free — no signup: www.dayblip.com/education/gpa-calculator"

  const TABS = [
    { key: "semester", label: "Semester GPA" },
    { key: "cumulative", label: "Cumulative GPA" },
    { key: "needed", label: "GPA Needed" },
  ] as const

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("GPA Calculator", "Calculate semester and cumulative GPA for high school and college on the 4.0 scale", "https://www.dayblip.com/education/gpa-calculator", "EducationalApplication"),
        faqSchema([
          { question: "How is GPA calculated?", answer: "GPA is calculated by multiplying each course grade (converted to a 4.0 scale) by its credit hours to get quality points. All quality points are added and divided by total credit hours. An A (4.0) in a 3-credit course gives 12 quality points. Divide total quality points by total credit hours for final GPA." },
          { question: "What is a good GPA?", answer: "A 3.0 GPA (B average) is generally considered satisfactory. A 3.5+ is considered strong for most colleges. A 3.7+ is competitive for graduate school and professional programs. Most colleges require a minimum 2.0 GPA to maintain good academic standing and graduate." },
          { question: "What is weighted vs unweighted GPA?", answer: "Unweighted GPA uses a standard 4.0 scale for all courses. Weighted GPA gives bonus points for harder courses — typically 0.5 extra for honors and 1.0 extra for AP or IB courses creating a scale up to 5.0. Many colleges recalculate GPA on an unweighted scale for admissions." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Education", url: "https://www.dayblip.com/education" },
          { name: "GPA Calculator", url: "https://www.dayblip.com/education/gpa-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">GPA Calculator — Calculate Your Grade Point Average Instantly</h1>
          <p className="text-[#a8a8b3]">Semester GPA, cumulative GPA, weighted and unweighted — all in one tool</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Education", href: "/education" }, { label: "GPA Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>GPA is calculated by multiplying each course grade point value by credit hours then dividing total quality points by total credit hours. An A (4.0) in a 3-credit course gives 12 quality points. A B (3.0) in a 4-credit course gives 12 quality points. 48 total quality points across 15 credit hours equals a 3.2 GPA. Most colleges require a 2.0 minimum to graduate.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Grade Point Average (GPA) is the standard measure of academic performance in the US. It converts letter grades to a 4.0 scale and weights them by credit hours. Cumulative GPA covers all semesters. Semester GPA covers one term only. Weighted GPA gives bonus points for honors, AP and IB courses. Unweighted GPA treats all courses equally on a 4.0 scale.</p>

          {/* Tabs */}
          <div className="flex rounded-lg overflow-hidden border border-[#0f3460]">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex-1 py-2.5 text-sm font-semibold transition-colors"
                style={{ background: tab === t.key ? "#e94560" : "#1a1a2e", color: tab === t.key ? "#fff" : "#a8a8b3" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Semester GPA Tab ── */}
          {tab === "semester" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">GPA Type:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!weighted} onChange={() => setWeighted(false)} className="accent-[#e94560]" />
                  <span className="text-sm text-white">Unweighted</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={weighted} onChange={() => setWeighted(true)} className="accent-[#e94560]" />
                  <span className="text-sm text-white">Weighted</span>
                </label>
              </div>

              <div className="space-y-2">
                {courses.map((c, i) => (
                  <div key={c.id} className="grid gap-2 rounded-lg border border-[#0f3460] bg-[#1a1a2e] p-3" style={{ gridTemplateColumns: weighted ? "1fr auto auto auto auto" : "1fr auto auto auto" }}>
                    <input value={c.name} onChange={e => setCourses(cs => cs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      placeholder={`Course ${i + 1}`}
                      className="rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none" />
                    <select value={c.grade} onChange={e => setCourses(cs => cs.map((x, j) => j === i ? { ...x, grade: e.target.value } : x))}
                      className="rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none">
                      {GRADES.map(([g]) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <input type="number" min={1} max={6} value={c.credits}
                      onChange={e => setCourses(cs => cs.map((x, j) => j === i ? { ...x, credits: e.target.value } : x))}
                      className="w-16 rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none" />
                    {weighted && (
                      <select value={c.type} onChange={e => setCourses(cs => cs.map((x, j) => j === i ? { ...x, type: e.target.value as CourseType } : x))}
                        className="rounded border border-[#0f3460] bg-[#16213e] px-2 py-1.5 text-sm text-white focus:border-[#e94560] focus:outline-none">
                        <option value="standard">Standard</option>
                        <option value="honors">Honors</option>
                        <option value="ap">AP / IB</option>
                      </select>
                    )}
                    <button onClick={() => setCourses(cs => cs.filter((_, j) => j !== i))}
                      className="text-xs text-[#FF6B6B] hover:text-red-400 px-1">✕</button>
                  </div>
                ))}
              </div>

              <button onClick={() => setCourses(cs => [...cs, newCourse(nextId++)])}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] py-2 text-sm text-[#4FC3F7] hover:border-[#4FC3F7] transition-colors">
                + Add Course
              </button>

              <button onClick={calcSemester} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Calculate GPA
              </button>

              {semResult && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
                    <div className="text-sm text-[#a8a8b3] mb-1">Semester GPA ({weighted ? "Weighted" : "Unweighted"})</div>
                    <div className="text-5xl font-black text-[#F9A825]">{semResult.gpa.toFixed(2)}</div>
                    <div className="text-sm text-[#a8a8b3] mt-1">out of {weighted ? "5.0" : "4.0"} — {letterFromGPA(semResult.gpa)} average</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center text-sm">
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                      <div className="font-black text-white text-xl">{semResult.totalCredits}</div>
                      <div className="text-[#a8a8b3] text-xs">Credit hours</div>
                    </div>
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                      <div className="font-black text-white text-xl">{semResult.totalQP.toFixed(1)}</div>
                      <div className="text-[#a8a8b3] text-xs">Quality points</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-sm space-y-2">
                    <div className="font-bold text-white mb-2">Course Breakdown</div>
                    {courses.map((c, i) => {
                      const cr = parseFloat(c.credits) || 0
                      const gp = gradePoints(c.grade, c.type, weighted)
                      return (
                        <div key={c.id} className="flex justify-between border-b border-[#0f3460] pb-1.5 last:border-0">
                          <span className="text-[#a8a8b3]">{c.name || `Course ${i + 1}`} ({c.grade})</span>
                          <span className="text-white">{gp.toFixed(1)} × {cr} = {(gp * cr).toFixed(1)} QP</span>
                        </div>
                      )
                    })}
                  </div>
                  <ShareButtons text={shareText} url="https://www.dayblip.com/education/gpa-calculator" title="GPA Calculator" />
                </div>
              )}
            </div>
          )}

          {/* ── Cumulative GPA Tab ── */}
          {tab === "cumulative" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Current cumulative GPA</span>
                  <input type="number" step="0.01" value={currentGPA} onChange={e => setCurrentGPA(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Credit hours completed</span>
                  <input type="number" value={existingCredits} onChange={e => setExistingCredits(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">New semester GPA</span>
                  <input type="number" step="0.01" value={newSemGPA} onChange={e => setNewSemGPA(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">New semester credits</span>
                  <input type="number" value={newSemCredits} onChange={e => setNewSemCredits(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
              </div>
              <button onClick={calcCumulative} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Calculate New Cumulative GPA
              </button>
              {cumResult && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
                    <div className="text-sm text-[#a8a8b3] mb-1">New Cumulative GPA</div>
                    <div className="text-5xl font-black text-[#F9A825]">{cumResult.newGPA.toFixed(2)}</div>
                    <div className="mt-2 text-sm" style={{ color: cumResult.change >= 0 ? "#4ade80" : "#FF6B6B" }}>
                      {cumResult.change >= 0 ? "▲" : "▼"} {Math.abs(cumResult.change).toFixed(2)} from {currentGPA}
                    </div>
                    <div className="text-xs text-[#a8a8b3] mt-1">{cumResult.total} total credit hours</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── GPA Needed Tab ── */}
          {tab === "needed" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Current GPA</span>
                  <input type="number" step="0.01" value={neededCurrentGPA} onChange={e => setNeededCurrentGPA(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Credits completed</span>
                  <input type="number" value={neededCredits} onChange={e => setNeededCredits(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Target GPA</span>
                  <input type="number" step="0.01" value={targetGPA} onChange={e => setTargetGPA(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Credits remaining</span>
                  <input type="number" value={remainingCredits} onChange={e => setRemainingCredits(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
              </div>
              <button onClick={calcNeeded} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Calculate Required GPA
              </button>
              {neededResult && (
                <div className={`rounded-xl border p-6 text-center ${neededResult.achievable ? "border-green-500/30 bg-green-900/10" : "border-[#FF6B6B]/30 bg-[#FF6B6B]/10"}`}>
                  {neededResult.achievable ? (
                    <>
                      <div className="text-sm text-[#a8a8b3] mb-1">Required GPA this semester</div>
                      <div className="text-5xl font-black text-green-400">{neededResult.required.toFixed(2)}</div>
                      <div className="text-sm text-[#a8a8b3] mt-2">You can reach your target GPA of {targetGPA}. Keep it up!</div>
                    </>
                  ) : (
                    <>
                      <div className="text-[#FF6B6B] font-bold text-lg mb-2">Target not achievable in {remainingCredits} credits</div>
                      <div className="text-sm text-[#a8a8b3]">You would need approximately {neededResult.extraNeeded} more credit hours at a 4.0 to reach your target.</div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "📝", title: "Grade Calculator", desc: "What grade do you need on your final?", href: "/education/grade-calculator" },
            { emoji: "🎓", title: "College ROI Calculator", desc: "Was your degree worth the cost?", href: "/tools/college-roi" },
            { emoji: "💰", title: "Student Loan Calculator", desc: "True cost of your student debt", href: "/finance/student-loan" },
            { emoji: "🤖", title: "AI Job Score", desc: "How AI-proof is your field of study?", href: "/tools/ai-job-score" },
          ]} />

          <div style={{ background: "#1e2d4a", borderRadius: 8, padding: 16, textAlign: "center", marginTop: 32, marginBottom: 16 }}>
            <p style={{ color: "#fff", fontSize: 14, marginBottom: 8, marginTop: 0 }}>Want to add this tool to your website?</p>
            <a href="/embed" style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Get the free embed code →</a>
          </div>
        </div>
      </section>
    </div>
  )
}
