"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

// ─── Scoring tables ───────────────────────────────────────────────────────────
function scoreEmergency(months: number): number {
  if (months === 0) return 0
  if (months <= 1) return 5
  if (months <= 2) return 8
  if (months <= 5) return 15
  if (months <= 8) return 20
  if (months <= 11) return 23
  return 25
}

const industryScores: Record<string, number> = {
  "Multiple income sources": 25, "Healthcare": 24, "Government": 23, "Education": 20,
  "Engineering": 18, "Technology": 16, "Finance": 15, "Manufacturing": 10,
  "Freelance or Self-employed": 10, "Retail": 6, "Hospitality": 4, "Other": 12,
}

const employmentBonus: Record<string, number> = {
  "Full-time salaried": 0, "Full-time hourly": 0, "Part-time": -2,
  "Freelance or contract": -3, "Self-employed": -3, "Multiple income streams": 5,
}

function scoreDebt(d: number): number {
  if (d === 0) return 20
  if (d <= 2000) return 16
  if (d <= 5000) return 12
  if (d <= 10000) return 8
  if (d <= 20000) return 4
  return 0
}

const diversificationOptions = [
  "Not invested at all",
  "Single stock or crypto only",
  "Some diversification",
  "Well diversified (index funds)",
  "Fully diversified across assets",
]

function scoreDiversification(val: string): number {
  const map: Record<string, number> = {
    "Fully diversified across assets": 15, "Well diversified (index funds)": 12,
    "Some diversification": 7, "Single stock or crypto only": 2, "Not invested at all": 3,
  }
  return map[val] ?? 5
}

function scoreSideIncome(income: number): number {
  if (income === 0) return 0
  if (income <= 300) return 3
  if (income <= 700) return 6
  if (income <= 1500) return 8
  return 10
}

function scoreSpending(pct: number): number {
  if (pct < 40) return 5
  if (pct < 50) return 4
  if (pct < 60) return 3
  if (pct < 70) return 2
  if (pct < 80) return 1
  return 0
}

function fmt(n: number) { return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) }

interface ScoreBreakdown {
  emergency: number; jobSecurity: number; debt: number
  diversification: number; sideIncome: number; spending: number; total: number
}

interface Result {
  scores: ScoreBreakdown; survivalMonths: number
  emergencyMonths: number; highDebt: number; sideIncome: number
  diversification: string; spending: number; industry: string
}

function compute(
  emergencyMonths: number, industry: string, employmentType: string,
  highDebt: number, diversification: string, sideIncome: number, spending: number
): Result {
  const emergencyScore = scoreEmergency(emergencyMonths)
  const rawJobScore = industryScores[industry] ?? 12
  const bonus = employmentBonus[employmentType] ?? 0
  const jobSecurity = Math.min(25, Math.max(0, rawJobScore + bonus))
  const debtScore = scoreDebt(highDebt)
  const divScore = scoreDiversification(diversification)
  const sideScore = scoreSideIncome(sideIncome)
  const spendScore = scoreSpending(spending)
  const total = emergencyScore + jobSecurity + debtScore + divScore + sideScore + spendScore

  const sideIncomeBuffer = sideIncome > 0 ? 2 : 0
  const divBuffer = diversification.includes("Well") || diversification.includes("Fully") ? 1 : 0
  const survivalMonths = emergencyMonths + sideIncomeBuffer + divBuffer

  return {
    scores: { emergency: emergencyScore, jobSecurity, debt: debtScore, diversification: divScore, sideIncome: sideScore, spending: spendScore, total },
    survivalMonths, emergencyMonths, highDebt, sideIncome, diversification, spending, industry,
  }
}

function scoreLabel(score: number) {
  if (score >= 80) return { text: "🟢 Well Prepared", color: "#15803d" }
  if (score >= 60) return { text: "🟡 Moderately Prepared", color: "#16a34a" }
  if (score >= 40) return { text: "🟠 Some Gaps to Address", color: "#d97706" }
  if (score >= 20) return { text: "🔴 Vulnerable — Act Now", color: "#ea580c" }
  return { text: "🚨 High Risk — Urgent Action Needed", color: "#dc2626" }
}

const INDUSTRIES = Object.keys(industryScores)
const EMPLOYMENT_TYPES = Object.keys(employmentBonus)

export default function RecessionScorePage() {
  const [emergencyMonths, setEmergencyMonths] = useState(2)
  const [industry, setIndustry] = useState("Technology")
  const [employmentType, setEmploymentType] = useState("Full-time salaried")
  const [highDebt, setHighDebt] = useState("5000")
  const [diversification, setDiversification] = useState("Some diversification")
  const [sideIncome, setSideIncome] = useState("0")
  const [spending, setSpending] = useState(65)
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true, e = emergencyMonths, i = industry, et = employmentType, d = highDebt, dv = diversification, si = sideIncome, sp = spending) {
    const res = compute(e, i, et, +(d) || 0, dv, +(si) || 0, sp)
    setResult(res)
    if (push && typeof window !== "undefined") {
      const divIdx = diversificationOptions.indexOf(dv)
      window.history.pushState({}, "", `?emergency=${e}&industry=${encodeURIComponent(i)}&debt=${+d||0}&diversification=${divIdx}&sideincome=${+si||0}&spending=${sp}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const e = p.get("emergency"), i = p.get("industry"), d = p.get("debt"),
      dv = p.get("diversification"), si = p.get("sideincome"), sp = p.get("spending")
    if (e && i) {
      const em = +e, ind = decodeURIComponent(i), debt = d ?? "0",
        divIdx = dv ? +dv : 2, divVal = diversificationOptions[divIdx] ?? "Some diversification",
        siVal = si ?? "0", spVal = sp ? +sp : 65
      setEmergencyMonths(em); setIndustry(ind); if (d) setHighDebt(debt)
      setDiversification(divVal); if (si) setSideIncome(siVal); if (sp) setSpending(spVal)
      runCalc(false, em, ind, employmentType, debt, divVal, siVal, spVal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getActions(res: Result): { title: string; detail: string; impact: string }[] {
    const actions: { title: string; detail: string; impact: string; priority: number }[] = []

    if (res.scores.emergency < 15) {
      const target = 3000
      actions.push({ title: "Build your emergency fund", detail: `Target: 6 months of expenses. Save ${fmt(target / 12)}/month for 1 year.`, impact: "Could add up to 7 points", priority: res.scores.emergency })
    }
    if (res.highDebt > 2000) {
      actions.push({ title: "Pay off high-interest debt", detail: `Current: ${fmt(res.highDebt)}. Costs ~${fmt(res.highDebt * 0.18)}/year in interest at 18%.`, impact: "Could add up to 8 points", priority: res.scores.debt })
    }
    if (res.sideIncome === 0) {
      actions.push({ title: "Add a side income stream", detail: "Even $300–500/month provides a buffer if your main job is lost.", impact: "Could add up to 10 points", priority: res.scores.sideIncome })
    }
    if (!res.diversification.includes("Well") && !res.diversification.includes("Fully")) {
      actions.push({ title: "Diversify into index funds", detail: "S&P 500 index funds (VOO, VTI) provide long-term growth and stability.", impact: "Could add up to 8 points", priority: res.scores.diversification })
    }
    if (res.spending > 70) {
      actions.push({ title: "Reduce essential spending ratio", detail: `Your spending ratio is ${res.spending}%. Cut one recurring expense to increase flexibility.`, impact: "Could add up to 3 points", priority: res.scores.spending })
    }

    return actions.sort((a, b) => a.priority - b.priority).slice(0, 3)
  }

  const shareUrl = result ? `https://www.dayblip.com/tools/recession-score?emergency=${emergencyMonths}&industry=${encodeURIComponent(industry)}&debt=${+highDebt||0}&spending=${spending}` : ""
  const shareText = result
    ? `My recession readiness score: ${result.scores.total}/100\nStatus: ${scoreLabel(result.scores.total).text}\nI could weather a ${result.survivalMonths}-month job loss.\nHow prepared are you?`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Recession Readiness Score", "Get your personal recession readiness score. Find out how long you could survive a job loss and your top 3 actions to prepare.", "https://www.dayblip.com/tools/recession-score", "FinanceApplication"),
        faqSchema([
          { question: "How do I prepare for a recession?", answer: "Build a 6-month emergency fund, pay off high-interest debt, diversify income sources, reduce essential fixed expenses, and diversify investments across asset classes." },
          { question: "How much emergency fund do I need?", answer: "Financial experts recommend 3-6 months of essential living expenses in liquid savings. 6+ months provides strong protection during recessions or job loss." },
          { question: "What is a recession readiness score?", answer: "A recession readiness score measures your financial resilience across emergency savings, job security, debt levels, investment diversification and income sources." },
        ]),
        howToSchema("How to Calculate Your Recession Readiness Score", "Measure your financial resilience", [
          "Enter months of emergency fund savings",
          "Select your industry and employment type",
          "Enter total high-interest debt amount",
          "Select your investment diversification level",
          "Enter monthly side income if any",
          "Set your essential spending percentage",
          "Click Get My Score for full analysis",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Recession Readiness Score", url: "https://www.dayblip.com/tools/recession-score" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Your Recession Readiness Score</h1>
          <p className="text-[#a8a8b3]">How prepared are you for an economic downturn?</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A recession-ready household has 6 months of expenses in emergency savings, no high-interest debt, diversified investments and at least one income source beyond a primary job. The average American has only 1.2 months of emergency savings and $6,400 in high-interest debt — leaving most households highly vulnerable to economic downturns.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Recession readiness measures your financial resilience across five key areas: emergency fund size, job security, high-interest debt levels, investment diversification and supplemental income. This score helps identify your weakest areas and shows exactly what to fix first to improve your financial safety net.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[800px] space-y-6">
          {/* Emergency fund */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">
              Months of expenses saved: <span className="text-[#e94560]">{emergencyMonths >= 12 ? "12+" : emergencyMonths} {emergencyMonths === 0 ? "(None)" : emergencyMonths <= 2 ? "(Starter)" : emergencyMonths <= 5 ? "(Good)" : emergencyMonths <= 8 ? "(Target)" : "(Excellent)"}</span>
            </span>
            <input type="range" min={0} max={12} value={emergencyMonths} onChange={e => setEmergencyMonths(+e.target.value)} className="accent-[#e94560]" />
            <div className="flex justify-between text-xs text-[#a8a8b3]"><span>None</span><span>3 mo</span><span>6 mo</span><span>9 mo</span><span>12+ mo</span></div>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Your industry</span>
              <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Employment type</span>
              <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">High-interest debt (above 10%) ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={highDebt} onChange={e => setHighDebt(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Monthly side income ($)</span>
              <div className="flex items-center gap-2"><span className="text-[#a8a8b3]">$</span>
                <input type="number" value={sideIncome} onChange={e => setSideIncome(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Investment diversification</span>
            <select value={diversification} onChange={e => setDiversification(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
              {diversificationOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white">Essential spending ratio: <span className="text-[#e94560]">{spending}%</span></span>
            <p className="text-xs text-[#a8a8b3]">What % of income goes to fixed expenses (rent, utilities, food, insurance, debt minimums)?</p>
            <input type="range" min={20} max={100} value={spending} onChange={e => setSpending(+e.target.value)} className="accent-[#e94560]" />
            <div className="flex justify-between text-xs text-[#a8a8b3]"><span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span></div>
          </label>

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Get My Score
          </button>

          {result && (() => {
            const lbl = scoreLabel(result.scores.total)
            const actions = getActions(result)
            return (
              <div className="space-y-6">
                {/* Score */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                  <div className="text-sm text-[#a8a8b3]">Recession Readiness Score</div>
                  <div className="my-2 text-7xl font-black" style={{ color: lbl.color }}>
                    {result.scores.total}<span className="text-3xl text-[#a8a8b3]">/100</span>
                  </div>
                  <div className="text-xl font-bold" style={{ color: lbl.color }}>{lbl.text}</div>
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#0f3460]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${result.scores.total}%`, backgroundColor: lbl.color }} />
                  </div>
                </div>

                {/* Survival estimate */}
                <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-5 text-center text-white">
                  <div className="text-sm text-[#a8a8b3]">Based on your profile you could comfortably weather a</div>
                  <div className="my-1 text-4xl font-black text-[#e94560]">{result.survivalMonths}-month</div>
                  <div className="text-sm">job loss without major financial stress</div>
                </div>

                {/* Category breakdown */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <div className="font-bold text-white mb-3">Score breakdown</div>
                  {[
                    ["Emergency Fund", result.scores.emergency, 25],
                    ["Job Security", result.scores.jobSecurity, 25],
                    ["Debt Level", result.scores.debt, 20],
                    ["Diversification", result.scores.diversification, 15],
                    ["Side Income", result.scores.sideIncome, 10],
                    ["Essential Spending", result.scores.spending, 5],
                  ].map(([label, score, max]) => (
                    <div key={String(label)} className="mt-3">
                      <div className="flex justify-between text-sm text-white mb-1">
                        <span>{label}</span><span className="font-bold">{score}/{max}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#0f3460]">
                        <div className="h-full rounded-full bg-[#e94560]" style={{ width: `${(+score / +max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top actions */}
                {actions.length > 0 && (
                  <div className="space-y-3">
                    <div className="font-bold text-white">🎯 Your top {actions.length} priority actions</div>
                    {actions.map((a, i) => (
                      <div key={i} className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-4 text-sm">
                        <div className="font-bold text-[#F9A825]">{i + 1}. {a.title}</div>
                        <p className="mt-1 text-[#a8a8b3]">{a.detail}</p>
                        <p className="mt-1 text-xs text-[#e94560]">📈 {a.impact}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Benchmarks */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                  <div className="font-bold text-white mb-2">📊 How you compare to the average American</div>
                  {[
                    ["Average emergency fund", "1.2 months", result.emergencyMonths > 1.2],
                    ["Average high-interest debt", "$6,400", result.highDebt < 6400],
                    ["Average savings rate", "3.5%", result.spending < 96.5],
                    ["% with side income", "36%", result.sideIncome > 0],
                  ].map(([label, avg, better]) => (
                    <div key={String(label)} className="flex justify-between border-b border-[#0f3460] py-1.5">
                      <span className="text-[#a8a8b3]">{label}</span>
                      <span className="font-bold" style={{ color: better ? "#4ade80" : "#F9A825" }}>{avg} {better ? "✓ better" : ""}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-xs text-[#a8a8b3]">
                  This score is an educational estimate based on general financial principles. Individual circumstances vary. Consult a financial advisor for personalized guidance.
                </div>

                <ShareButtons text={shareText} url={shareUrl} title="Recession Readiness Score" />
              </div>
            )
          })()}
        </div>
      </section>
    </div>
  )
}
