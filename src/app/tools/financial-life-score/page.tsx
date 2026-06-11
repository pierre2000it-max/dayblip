"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

interface Question {
  id: number
  text: string
  options: { label: string; points: number }[]
  category: string
  maxPoints: number
}

const QUESTIONS: Question[] = [
  {
    id: 1, category: "Emergency Fund", maxPoints: 20,
    text: "How many months of expenses do you have in emergency savings?",
    options: [
      { label: "None", points: 0 },
      { label: "Less than 1 month", points: 5 },
      { label: "1–3 months", points: 10 },
      { label: "3–6 months", points: 18 },
      { label: "6+ months", points: 20 },
    ],
  },
  {
    id: 2, category: "Debt Level", maxPoints: 15,
    text: "What is your total debt excluding your mortgage?",
    options: [
      { label: "Over $50,000", points: 0 },
      { label: "$20,000–$50,000", points: 3 },
      { label: "$5,000–$20,000", points: 7 },
      { label: "Under $5,000", points: 12 },
      { label: "Zero debt", points: 15 },
    ],
  },
  {
    id: 3, category: "Savings Rate", maxPoints: 15,
    text: "What percentage of your income do you save or invest monthly?",
    options: [
      { label: "Nothing", points: 0 },
      { label: "1–5%", points: 3 },
      { label: "6–10%", points: 6 },
      { label: "11–20%", points: 10 },
      { label: "Over 20%", points: 15 },
    ],
  },
  {
    id: 4, category: "Retirement", maxPoints: 10,
    text: "Do you have a retirement account with regular contributions?",
    options: [
      { label: "No retirement savings", points: 0 },
      { label: "Account exists but no contributions", points: 2 },
      { label: "Contributing under employer match", points: 5 },
      { label: "Getting full employer match", points: 8 },
      { label: "Maxing out contributions", points: 10 },
    ],
  },
  {
    id: 5, category: "Credit Score", maxPoints: 10,
    text: "What is your approximate credit score range?",
    options: [
      { label: "Under 580", points: 0 },
      { label: "580–669", points: 2 },
      { label: "670–739", points: 5 },
      { label: "740–799", points: 8 },
      { label: "800+", points: 10 },
    ],
  },
  {
    id: 6, category: "Insurance", maxPoints: 5,
    text: "Do you have adequate life insurance?",
    options: [
      { label: "No life insurance", points: 0 },
      { label: "Only employer-provided", points: 2 },
      { label: "Some personal coverage", points: 4 },
      { label: "10x income covered", points: 5 },
    ],
  },
  {
    id: 7, category: "Goals", maxPoints: 5,
    text: "Do you have a written financial goal for the next 5 years?",
    options: [
      { label: "No financial goals", points: 0 },
      { label: "Vague idea", points: 1 },
      { label: "Clear goal not written", points: 2 },
      { label: "Written specific goal", points: 5 },
    ],
  },
  {
    id: 8, category: "Cash Flow", maxPoints: 5,
    text: "Do you spend less than you earn every month?",
    options: [
      { label: "No — I go into debt most months", points: 0 },
      { label: "Break even most months", points: 2 },
      { label: "Usually spend less", points: 4 },
      { label: "Always spend less — consistent surplus", points: 5 },
    ],
  },
  {
    id: 9, category: "Estate Plan", maxPoints: 5,
    text: "Do you have a will or basic estate plan?",
    options: [
      { label: "No will or estate plan", points: 0 },
      { label: "Been meaning to do it", points: 0 },
      { label: "Basic will only", points: 3 },
      { label: "Full estate plan", points: 5 },
    ],
  },
  {
    id: 10, category: "Wellbeing", maxPoints: 5,
    text: "How do you feel about your financial situation overall?",
    options: [
      { label: "Very stressed — losing sleep", points: 0 },
      { label: "Anxious but managing", points: 1 },
      { label: "Okay — not great not bad", points: 2 },
      { label: "Comfortable and confident", points: 4 },
      { label: "Excellent — on track for goals", points: 5 },
    ],
  },
]

interface Zone {
  label: string
  color: string
  message: string
}

function getZone(score: number): Zone {
  if (score <= 29) return { label: "Financial Red Zone", color: "#e94560", message: "Your finances need immediate attention in several areas. The good news is that small consistent changes have the biggest impact at this level. Start with building a $1,000 emergency fund — it is the single highest-impact first step." }
  if (score <= 49) return { label: "Financial Yellow Zone", color: "#f39c12", message: "You have some foundations in place but significant gaps remain. Focus on the two categories with the lowest scores first for maximum improvement." }
  if (score <= 69) return { label: "Financial Green Zone", color: "#3498db", message: "Solid financial foundation. You are doing better than most Americans. The gap between 60 and 80 is smaller than it looks — targeted improvements in 2–3 categories can move you there quickly." }
  if (score <= 84) return { label: "Financial Strong Zone", color: "#27ae60", message: "Strong financial health. You are in the top 25% of Americans in financial fitness. Focus on optimization — maxing retirement accounts and building additional wealth." }
  return { label: "Financial Elite Zone", color: "#f1c40f", message: "Exceptional financial health. Top 10% of Americans. Focus on advanced strategies — tax optimization estate planning and wealth protection." }
}

function getImprovementTips(answers: Record<number, number>): string[] {
  const scored: { q: Question; pts: number; gap: number }[] = QUESTIONS.map(q => {
    const pts = answers[q.id] ?? 0
    return { q, pts, gap: q.maxPoints - pts }
  }).sort((a, b) => b.gap - a.gap)

  const tips: string[] = []
  const tipMap: Record<string, string> = {
    "Emergency Fund": "Build your emergency fund to 3 months of expenses — open a high-yield savings account and automate $200–$500/month until you reach that target.",
    "Debt Level": "Attack your highest-interest debt first using the avalanche method — every extra dollar above minimums goes to the highest-rate balance.",
    "Savings Rate": "Increase your savings rate by 1% every 3 months. Automate contributions so you never see the money — what you don't see you don't spend.",
    "Retirement": "At minimum contribute enough to get your full employer match — that is a 100% return on your money before any market gains.",
    "Credit Score": "Pay every bill on time and get your credit utilization below 30% — these two factors make up 65% of your credit score.",
    "Insurance": "Get a 20-year term life insurance policy — a healthy 30-year-old can get $500,000 of coverage for around $25/month.",
    "Goals": "Write your financial goal on paper with a specific dollar amount and target date — people with written goals are 42% more likely to achieve them.",
    "Cash Flow": "Track every dollar for 30 days using a free app — most people find 10–15% of spending they don't value once they see it.",
    "Estate Plan": "Create a basic will at minimum — services like Trust & Will or LegalZoom make it possible in under an hour for under $200.",
    "Wellbeing": "Financial stress is real — consider a one-time session with a fee-only financial planner for a personalized roadmap.",
  }

  for (const { q } of scored) {
    const tip = tipMap[q.category]
    if (tip && tips.length < 3) tips.push(tip)
  }
  return tips
}

export default function FinancialLifeScorePage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [done, setDone] = useState(false)

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const zone = getZone(totalScore)
  const tips = done ? getImprovementTips(answers) : []

  function selectAnswer(qId: number, pts: number) {
    const next = { ...answers, [qId]: pts }
    setAnswers(next)
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1)
    } else {
      setDone(true)
    }
  }

  function restart() {
    setCurrentQ(0)
    setAnswers({})
    setDone(false)
  }

  const progress = done ? 100 : (currentQ / QUESTIONS.length) * 100
  const q = QUESTIONS[currentQ]

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema(
          "Financial Life Score Calculator",
          "Get your personal Financial Life Score from 0-100 based on 10 financial health questions.",
          "https://www.dayblip.com/tools/financial-life-score",
          "FinanceApplication"
        ),
        faqSchema([
          {
            question: "What is a good financial health score?",
            answer: "A Financial Life Score of 70 or above indicates strong financial health. The Consumer Financial Protection Bureau's Financial Well-Being Scale shows the average American scores around 54 out of 100. Scores above 70 indicate financial resilience and the ability to absorb financial shocks. Scores above 85 indicate exceptional financial health in the top 10% of Americans.",
          },
          {
            question: "What is the most important factor in financial health?",
            answer: "Emergency fund size is the most impactful single factor in financial health according to CFPB research. Having 3-6 months of expenses saved reduces financial stress more than any other single variable. It also prevents debt from accumulating during unexpected events — protecting all other financial goals simultaneously.",
          },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Financial Life Score", url: "https://www.dayblip.com/tools/financial-life-score" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Financial Life Score — How Healthy Is Your Financial Life? (0–100)</h1>
          <p className="text-[#a8a8b3]">Answer 10 honest questions. Get your score and actionable next steps.</p>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[800px]">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Financial Life Score" }]} />
          <div className="mt-6" style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase" style={{ color: "#e94560", letterSpacing: "2px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px" }}>The average American scores approximately 52 out of 100 on financial health metrics according to the Consumer Financial Protection Bureau. A score of 70+ indicates strong financial health. The two biggest score killers are no emergency fund (affects 57% of Americans) and high credit card debt carrying a balance. Improving your emergency fund from zero to three months adds approximately 12 points to your Financial Life Score.</p>
          </div>
          <p className="mt-4 leading-relaxed" style={{ color: "#a8a8b3", fontSize: "14px" }}>Your Financial Life Score measures overall financial health across six categories: emergency preparedness debt management retirement readiness income optimization insurance coverage and financial goal clarity. The scoring methodology is based on Consumer Financial Protection Bureau benchmarks and Federal Reserve financial health surveys. This score is for educational self-assessment purposes only.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[640px] space-y-6">
          {!done ? (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-[#a8a8b3]">
                <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                <span>{q.category}</span>
              </div>
              <div className="mb-6 h-2 rounded-full bg-[#0f3460] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "#e94560" }} />
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <p className="text-white font-semibold text-lg mb-5">{q.text}</p>
                <div className="space-y-3">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => selectAnswer(q.id, opt.points)}
                      className="w-full text-left rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white text-sm transition-all hover:border-[#e94560] hover:bg-[#1e2d4a]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border p-8 text-center" style={{ borderColor: zone.color + "66", background: "#1a1a2e" }}>
                <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: zone.color }}>{zone.label}</div>
                <div className="text-7xl font-black mb-1" style={{ color: zone.color }}>{totalScore}</div>
                <div className="text-[#a8a8b3] text-sm mb-4">out of 100</div>
                <p className="text-[#e8e8e8] text-sm leading-relaxed">{zone.message}</p>
              </div>

              <div>
                <h2 className="text-white font-bold mb-3 text-lg">Score by Category</h2>
                <div className="space-y-2">
                  {QUESTIONS.map(q => {
                    const pts = answers[q.id] ?? 0
                    const pct = (pts / q.maxPoints) * 100
                    return (
                      <div key={q.id} className="flex items-center gap-3">
                        <span className="text-[#a8a8b3] text-xs w-28 shrink-0">{q.category}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#0f3460] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 70 ? "#27ae60" : pct >= 40 ? "#f39c12" : "#e94560" }} />
                        </div>
                        <span className="text-white text-xs font-bold w-12 text-right">{pts}/{q.maxPoints}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h2 className="text-white font-bold mb-3">Your Top 3 Improvements</h2>
                <div className="space-y-3">
                  {tips.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="font-bold text-sm shrink-0" style={{ color: "#e94560" }}>{i + 1}.</span>
                      <p className="text-[#a8a8b3] text-sm">{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={restart} className="w-full rounded-lg border border-[#0f3460] py-3 text-[#a8a8b3] text-sm hover:border-[#e94560] hover:text-white transition-all">
                Retake the Quiz
              </button>

              <ShareButtons
                text={`My Financial Life Score is ${totalScore}/100 — ${zone.label}. Take 2 minutes to check yours:`}
                url="https://www.dayblip.com/tools/financial-life-score"
                title="Financial Life Score"
              />
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🆓", title: "FI Date Calculator", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
            { emoji: "🛡️", title: "Life Insurance Calculator", desc: "How much coverage do you actually need?", href: "/tools/life-insurance-calculator" },
            { emoji: "🧠", title: "Dayblip Daily", desc: "One financial puzzle every day", href: "/daily" },
            { emoji: "📊", title: "Net Worth", desc: "Know where you stand financially", href: "/finance/net-worth" },
          ]} />
        </div>
      </section>
    </div>
  )
}
