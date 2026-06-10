"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

function toLetter(pct: number): string {
  if (pct >= 90) return "A"
  if (pct >= 80) return "B"
  if (pct >= 70) return "C"
  if (pct >= 60) return "D"
  return "F"
}

interface Assignment {
  id: number
  name: string
  score: string
  weight: string
}

let nextId = 4

export default function GradeCalculatorPage() {
  const [tab, setTab] = useState<"final" | "weighted" | "test">("final")

  // Final exam tab
  const [currentGrade, setCurrentGrade] = useState("78")
  const [finalWeight, setFinalWeight] = useState("30")
  const [targetGrade, setTargetGrade] = useState("80")
  const [finalResult, setFinalResult] = useState<{ needed: number; maxPossible: number } | null>(null)

  // Weighted tab
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: "Homework", score: "85", weight: "20" },
    { id: 2, name: "Midterm", score: "78", weight: "30" },
    { id: 3, name: "Final Project", score: "92", weight: "50" },
  ])
  const [weightedResult, setWeightedResult] = useState<{ grade: number; letter: string } | null>(null)

  // Test score tab
  const [correct, setCorrect] = useState("42")
  const [total, setTotal] = useState("50")
  const [testResult, setTestResult] = useState<{ pct: number; letter: string; missForA: number; missForB: number } | null>(null)

  // ── Final calc ─────────────────────────────────────────────────────────────
  function calcFinal() {
    const cg = parseFloat(currentGrade) || 0
    const fw = parseFloat(finalWeight) / 100 || 0.3
    const tg = parseFloat(targetGrade) || 80
    const currentWeight = 1 - fw
    const needed = (tg - cg * currentWeight) / fw
    const maxPossible = cg * currentWeight + 100 * fw
    setFinalResult({ needed, maxPossible })
  }

  // ── Weighted calc ──────────────────────────────────────────────────────────
  function calcWeighted() {
    let numerator = 0, totalWeight = 0
    for (const a of assignments) {
      const s = parseFloat(a.score) || 0
      const w = parseFloat(a.weight) || 0
      numerator += s * w
      totalWeight += w
    }
    const grade = totalWeight > 0 ? numerator / totalWeight : 0
    setWeightedResult({ grade, letter: toLetter(grade) })
  }

  // ── Test calc ──────────────────────────────────────────────────────────────
  function calcTest() {
    const c = parseInt(correct) || 0
    const t = parseInt(total) || 50
    const pct = (c / t) * 100
    const missForA = t - Math.ceil(0.9 * t)
    const missForB = t - Math.ceil(0.8 * t)
    setTestResult({ pct, letter: toLetter(pct), missForA, missForB })
  }

  const shareText = finalResult
    ? `I need a ${finalResult.needed.toFixed(1)}% on my final exam to get the grade I want. Calculate yours free: www.dayblip.com/education/grade-calculator`
    : "Calculate what you need on your final exam: www.dayblip.com/education/grade-calculator"

  const TABS = [
    { key: "final", label: "Final Exam Needed" },
    { key: "weighted", label: "Weighted Grade" },
    { key: "test", label: "Test Score" },
  ] as const

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Grade Calculator", "Calculate final exam needed grade and weighted course grade for any class", "https://www.dayblip.com/education/grade-calculator", "EducationalApplication"),
        faqSchema([
          { question: "How do I calculate what I need on my final exam?", answer: "Multiply your current grade by its weight as a decimal. Subtract from your target grade. Divide by the final exam weight as a decimal. Example: 78% current grade with 30% final weight wanting 80% overall: (80 - 78×0.70) / 0.30 = 85.3% needed on the final." },
          { question: "How do I calculate a weighted grade?", answer: "Multiply each assignment score by its weight percentage. Add all weighted scores and divide by total weight. Example: 85% on homework worth 20% (17 points) plus 78% on midterm worth 30% (23.4 points) plus 92% on project worth 50% (46 points) equals 86.4% total." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Education", url: "https://www.dayblip.com/education" },
          { name: "Grade Calculator", url: "https://www.dayblip.com/education/grade-calculator" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Grade Calculator — What Grade Do You Need on Your Final Exam?</h1>
          <p className="text-[#a8a8b3]">Final exam needed, weighted grades, test scores — all in one tool</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Education", href: "/education" }, { label: "Grade Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>To calculate the grade needed on a final exam: subtract (current grade times its weight) from your target grade then divide by the final exam weight. Example: current grade 78% worth 70% of the final grade and you want an 80% overall. Needed final exam grade equals (80 minus 78 times 0.70) divided by 0.30 which equals 85.3%. An 86% on the final earns a B in the class.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>A grade calculator determines what score you need on upcoming assignments or a final exam to achieve your target grade in a course. It accounts for the weight of each graded component — participation, homework, midterms and finals — to show exactly what is mathematically required to hit your goal.</p>

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

          {/* ── Final Exam Tab ── */}
          {tab === "final" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Current grade (%)</span>
                  <input type="number" value={currentGrade} onChange={e => setCurrentGrade(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Final exam weight (%)</span>
                  <input type="number" value={finalWeight} onChange={e => setFinalWeight(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Target grade (%)</span>
                  <input type="number" value={targetGrade} onChange={e => setTargetGrade(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
              </div>
              <button onClick={calcFinal} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate</button>

              {finalResult && (
                <div className="space-y-4">
                  {finalResult.needed > 100 ? (
                    <div className="rounded-xl border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 p-6 text-center">
                      <div className="text-[#FF6B6B] font-bold text-lg mb-2">Target not achievable</div>
                      <div className="text-[#a8a8b3] text-sm">The highest you can earn in this class is <strong className="text-white">{finalResult.maxPossible.toFixed(1)}%</strong> ({toLetter(finalResult.maxPossible)}), even with a perfect 100% on the final.</div>
                    </div>
                  ) : finalResult.needed < 0 ? (
                    <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-6 text-center">
                      <div className="text-green-400 font-bold text-lg">You&apos;ve already secured your target grade!</div>
                      <div className="text-[#a8a8b3] text-sm mt-2">Even with a 0% on the final you would earn {finalResult.maxPossible.toFixed(1)}%.</div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
                      <div className="text-sm text-[#a8a8b3] mb-1">You need on your final exam</div>
                      <div className="text-5xl font-black text-[#F9A825]">{finalResult.needed.toFixed(1)}%</div>
                      <div className="text-sm text-[#a8a8b3] mt-2">That is a <strong className="text-white">{toLetter(finalResult.needed)}</strong> on the final</div>
                    </div>
                  )}
                  <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-xs text-[#a8a8b3] grid grid-cols-5 gap-1 text-center">
                    {[["A", "90%+"], ["B", "80–89%"], ["C", "70–79%"], ["D", "60–69%"], ["F", "<60%"]].map(([l, r]) => (
                      <div key={l}><div className="font-bold text-white">{l}</div><div>{r}</div></div>
                    ))}
                  </div>
                  <ShareButtons text={shareText} url="https://www.dayblip.com/education/grade-calculator" title="Grade Calculator" />
                </div>
              )}
            </div>
          )}

          {/* ── Weighted Grade Tab ── */}
          {tab === "weighted" && (
            <div className="space-y-4">
              <div className="space-y-2">
                {assignments.map((a, i) => (
                  <div key={a.id} className="grid grid-cols-[1fr_80px_80px_auto] gap-2 items-center">
                    <input value={a.name} onChange={e => setAssignments(as => as.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      placeholder={`Assignment ${i + 1}`}
                      className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" />
                    <div className="relative">
                      <input type="number" value={a.score} onChange={e => setAssignments(as => as.map((x, j) => j === i ? { ...x, score: e.target.value } : x))}
                        placeholder="Score %"
                        className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-2 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" />
                    </div>
                    <div className="relative">
                      <input type="number" value={a.weight} onChange={e => setAssignments(as => as.map((x, j) => j === i ? { ...x, weight: e.target.value } : x))}
                        placeholder="Weight %"
                        className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-2 py-2 text-sm text-white focus:border-[#e94560] focus:outline-none" />
                    </div>
                    <button onClick={() => setAssignments(as => as.filter((_, j) => j !== i))} className="text-xs text-[#FF6B6B] px-1">✕</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setAssignments(as => [...as, { id: nextId++, name: "", score: "", weight: "" }])}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] py-2 text-sm text-[#4FC3F7] hover:border-[#4FC3F7]">
                + Add Assignment
              </button>
              <button onClick={calcWeighted} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate My Grade</button>
              {weightedResult && (
                <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center space-y-2">
                  <div className="text-sm text-[#a8a8b3]">Current weighted grade</div>
                  <div className="text-5xl font-black text-[#F9A825]">{weightedResult.grade.toFixed(1)}%</div>
                  <div className="text-lg font-bold text-white">Grade: {weightedResult.letter}</div>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                    <div className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] p-2">
                      <div className="text-[#a8a8b3]">Points needed for A (90%)</div>
                      <div className="font-bold text-white">{Math.max(0, 90 - weightedResult.grade).toFixed(1)} more pts</div>
                    </div>
                    <div className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] p-2">
                      <div className="text-[#a8a8b3]">Points needed for B (80%)</div>
                      <div className="font-bold text-white">{Math.max(0, 80 - weightedResult.grade).toFixed(1)} more pts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Test Score Tab ── */}
          {tab === "test" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Questions correct</span>
                  <input type="number" value={correct} onChange={e => setCorrect(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-white">Total questions</span>
                  <input type="number" value={total} onChange={e => setTotal(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
              </div>
              <button onClick={calcTest} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate Score</button>
              {testResult && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-[#F9A825]/30 bg-[#F9A825]/10 p-6 text-center">
                    <div className="text-5xl font-black text-[#F9A825]">{testResult.pct.toFixed(1)}%</div>
                    <div className="text-lg font-bold text-white mt-1">Grade: {testResult.letter}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-center">
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                      <div className="text-[#a8a8b3]">Can miss for A</div>
                      <div className="font-black text-white text-xl">{testResult.missForA}</div>
                      <div className="text-xs text-[#a8a8b3]">questions</div>
                    </div>
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3">
                      <div className="text-[#a8a8b3]">Can miss for B</div>
                      <div className="font-black text-white text-xl">{testResult.missForB}</div>
                      <div className="text-xs text-[#a8a8b3]">questions</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "📊", title: "GPA Calculator", desc: "Calculate your grade point average", href: "/education/gpa-calculator" },
            { emoji: "🎓", title: "College ROI Calculator", desc: "Is your degree worth the investment?", href: "/tools/college-roi" },
            { emoji: "💰", title: "Student Loan Calculator", desc: "True cost of your student debt", href: "/finance/student-loan" },
            { emoji: "⏰", title: "Procrastination Cost", desc: "What waiting is costing you", href: "/tools/procrastination-cost" },
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
