"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import LastUpdated from "@/components/LastUpdated"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

const QUESTIONS = [
  {
    id: 0,
    text: "When a new lead comes in, how quickly do you typically respond?",
    label: "Lead Response Speed",
    answers: [
      "Within minutes — I have an automated or instant response system",
      "Within a few hours — I get to it when I can",
      "By end of day — I try to respond same day",
      "Next day or later — it depends on how busy things are",
    ],
  },
  {
    id: 1,
    text: "What happens when you miss a call from a potential customer?",
    label: "Missed Calls",
    answers: [
      "An automatic text or callback sequence triggers immediately",
      "We call back when we notice the missed call",
      "It goes to voicemail — follow-up varies",
      "It often goes unanswered with no follow-up",
    ],
  },
  {
    id: 2,
    text: "How consistent is your follow-up with leads who don't convert right away?",
    label: "Follow-Up Consistency",
    answers: [
      "Automated sequence — texts or emails go out on a schedule without me doing anything",
      "I have a manual process I follow each time",
      "I follow up when I remember to",
      "I usually don't follow up again after the first attempt",
    ],
  },
  {
    id: 3,
    text: "How many hours per week do you spend on repetitive admin tasks (data entry, scheduling, invoicing, etc.)?",
    label: "Repetitive Admin Work",
    answers: [
      "Under 2 hours — most of it is automated",
      "2–5 hours",
      "5–10 hours",
      "10+ hours",
    ],
  },
  {
    id: 4,
    text: "How do routine customer questions and inquiries get answered?",
    label: "Customer Communication",
    answers: [
      "Automated — chatbot, FAQ page, or auto-reply handles the common ones",
      "Templates I copy and paste and send manually",
      "I answer each one individually from scratch",
      "Customers often wait a while for a reply",
    ],
  },
  {
    id: 5,
    text: "How does appointment or job booking typically work for your business?",
    label: "Scheduling Process",
    answers: [
      "Online self-booking — customers pick a time, no back-and-forth needed",
      "I send a booking link and they pick a time",
      "Back-and-forth over text, email, or phone to find a time",
      "No formal booking process — it's informal",
    ],
  },
  {
    id: 6,
    text: "Where does your customer and job information live?",
    label: "Data & Systems",
    answers: [
      "One CRM system — everything is in one place",
      "A few tools — spreadsheet, calendar, notes app, etc.",
      "Mostly in my head or scattered across notes",
      "No consistent system",
    ],
  },
  {
    id: 7,
    text: "Are you currently using any AI or automation tools in your business?",
    label: "Current AI & Automation Use",
    answers: [
      "Yes, actively — I use AI or automation for multiple things",
      "Yes, I've tried one or two things",
      "I've looked into it but haven't started yet",
      "No, not at all",
    ],
  },
]

const BANDS = [
  {
    min: 80,
    max: 100,
    label: "AI-Ready",
    color: "#22c55e",
    bg: "#052e16",
    description: "You're already ahead of most small businesses. Your systems are working — the opportunity now is to optimize and layer in more sophisticated automation to compound those advantages.",
  },
  {
    min: 55,
    max: 79,
    label: "Building Momentum",
    color: "#4FC3F7",
    bg: "#0c2340",
    description: "You have good foundations in place, with clear gaps to close. A few targeted automations could meaningfully free up your time and tighten your lead conversion.",
  },
  {
    min: 30,
    max: 54,
    label: "Early Stage",
    color: "#F9A825",
    bg: "#2d1f00",
    description: "Manual processes are costing you real time — and likely real revenue. The good news: the first few automations typically deliver the biggest returns, and you have a lot of room to capture.",
  },
  {
    min: 0,
    max: 29,
    label: "Wide Open Opportunity",
    color: "#e94560",
    bg: "#2d0a0f",
    description: "Nearly everything is still manual, which means there's real, immediate upside available almost anywhere you look first. You don't need to automate everything at once — starting with one high-impact area changes the picture quickly.",
  },
]

const OPPORTUNITY_BLURBS = [
  "Your biggest opportunity is lead response time. Leads that wait more than a few minutes are far more likely to go with whoever answers first. An automated instant-response system alone can meaningfully change your close rate.",
  "Your biggest opportunity is what happens after a missed call. Every unanswered call with no automatic follow-up is a lead handed to a competitor. A simple auto-text-back system closes this gap.",
  "Your biggest opportunity is follow-up consistency. Most sales happen after multiple touches, not the first one. An automated follow-up sequence keeps leads warm without relying on memory.",
  "Your biggest opportunity is time lost to repetitive admin work. Hours spent on manual data entry, scheduling, or invoicing are hours not spent on revenue-generating work. Automation can reclaim most of that time.",
  "Your biggest opportunity is how routine questions get answered. If customers wait for individual replies to common questions, you're losing time and possibly losing them. An automated first response handles the repetitive part instantly.",
  "Your biggest opportunity is booking friction. Every back-and-forth to find a time is a chance for a lead to lose interest or go elsewhere. Self-serve booking removes that friction entirely.",
  "Your biggest opportunity is where your customer information lives. Scattered notes and memory don't scale, and they make every other automation harder to build. A single system is the foundation everything else depends on.",
  "Your biggest opportunity is getting started. You haven't yet put AI or automation to work in your business, which means there's real, immediate upside available almost anywhere you look first.",
]

const FAQ_ITEMS = [
  {
    question: "How is the AI Business Readiness Score calculated?",
    answer: "You answer 8 questions covering lead response, missed call handling, follow-up consistency, admin time, customer communication, scheduling, data systems, and current AI use. Each answer scores 0–3 points. Your total (max 24) is converted to a 0–100 scale. The result places you in one of four bands: AI-Ready (80–100), Building Momentum (55–79), Early Stage (30–54), or Wide Open Opportunity (0–29).",
  },
  {
    question: "What does 'biggest opportunity' mean on my result?",
    answer: "It highlights the single question where your business scored lowest — the area where automation would likely have the greatest immediate impact. If two questions tie for lowest, the one earlier in the assessment wins, since earlier questions (like lead response speed) tend to have the highest revenue impact for most small businesses.",
  },
  {
    question: "Does a low score mean my business is failing?",
    answer: "No. A low score simply means most of your current processes are still manual — which is very common for small businesses. It also means there's meaningful upside available quickly. Many businesses move from Early Stage to Building Momentum by automating just one or two workflows.",
  },
  {
    question: "How long does the assessment take?",
    answer: "About 60–90 seconds. There are 8 multiple-choice questions with no open-ended fields, no email required, and no account to create.",
  },
  {
    question: "Who is this assessment designed for?",
    answer: "Small business owners and solo operators who want to understand how AI-ready their day-to-day operations are. It's most useful if you handle your own lead follow-up, scheduling, or customer communication — or if you're spending significant hours on repetitive admin work.",
  },
  {
    question: "Is this assessment free? Do I need to sign up?",
    answer: "Completely free, no signup, no email capture. Your answers are processed entirely in your browser — nothing is stored or transmitted.",
  },
]

function getBand(score: number) {
  return BANDS.find(b => score >= b.min && score <= b.max) ?? BANDS[BANDS.length - 1]
}

export default function AIReadinessPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(8).fill(null))
  const [result, setResult] = useState<{ score: number; bandIdx: number; lowestQ: number } | null>(null)

  const answeredCount = answers.filter(a => a !== null).length
  const allAnswered = answeredCount === 8

  function selectAnswer(qIdx: number, aIdx: number) {
    setAnswers(prev => {
      const next = [...prev]
      next[qIdx] = aIdx
      return next
    })
    setResult(null)
  }

  function calculate() {
    if (!allAnswered) return
    const scores = answers.map(a => 3 - (a as number))
    const total = scores.reduce((s, v) => s + v, 0)
    const score = Math.round((total / 24) * 100)
    const lowestScore = Math.min(...scores)
    const lowestQ = scores.indexOf(lowestScore)
    const band = getBand(score)
    const bandIdx = BANDS.indexOf(band)
    setResult({ score, bandIdx, lowestQ })
    setTimeout(() => {
      document.getElementById("ai-readiness-result")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  function reset() {
    setAnswers(Array(8).fill(null))
    setResult(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const schemas = [
    webApplicationSchema(
      "AI Business Readiness Assessment",
      "Free 8-question assessment that scores how ready your small business is for AI and automation. No signup required.",
      "https://www.dayblip.com/tools/ai-readiness",
      "BusinessApplication",
      "2026-09-14"
    ),
    faqSchema(FAQ_ITEMS),
    breadcrumbSchema([
      { name: "Home", url: "https://www.dayblip.com" },
      { name: "Tools", url: "https://www.dayblip.com/tools" },
      { name: "AI Business Readiness", url: "https://www.dayblip.com/tools/ai-readiness" },
    ]),
  ]

  return (
    <>
      <SchemaMarkup schemas={schemas} />

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
        padding: "48px 24px 40px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🤖</div>
        <h1 style={{ color: "#ffffff", fontSize: 32, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
          AI Business Readiness Assessment
        </h1>
        <p style={{ color: "#a8a8b3", fontSize: 17, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          8 questions. 60 seconds. See how ready your business is for AI — and where to start.
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 64px" }}>

        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "AI Business Readiness", href: "/tools/ai-readiness" },
        ]} />

        {/* Quick Answer box */}
        <div style={{
          background: "#1e2d4a",
          borderLeft: "4px solid #e94560",
          borderRadius: 8,
          padding: "16px 20px",
          margin: "24px 0",
        }}>
          <div style={{ color: "#e94560", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            QUICK ANSWER
          </div>
          <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Most small businesses are still running on manual processes — the average score on this assessment is in the Early Stage band (30–54). Automating lead response alone moves most businesses up a full band. Answer the 8 questions below to see exactly where you stand.
          </p>
        </div>

        {/* Assessment card */}
        <div style={{ background: "#16213e", borderRadius: 12, padding: "32px 28px", marginBottom: 32 }}>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <span style={{ color: "#a8a8b3", fontSize: 14 }}>
              {answeredCount === 0
                ? "Answer all 8 questions to see your score"
                : answeredCount === 8
                ? "All questions answered — ready to score"
                : `${answeredCount} of 8 answered`}
            </span>
            {/* Progress bar */}
            <div style={{ width: 160, height: 6, background: "#0f3460", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${(answeredCount / 8) * 100}%`,
                height: "100%",
                background: "#e94560",
                borderRadius: 3,
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>

          {/* Questions */}
          {QUESTIONS.map((q, qIdx) => (
            <div key={q.id} style={{ marginBottom: 36 }}>
              <div style={{ color: "#a8a8b3", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                Question {qIdx + 1} of 8 — {q.label}
              </div>
              <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>
                {q.text}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.answers.map((ans, aIdx) => {
                  const selected = answers[qIdx] === aIdx
                  return (
                    <button
                      key={aIdx}
                      onClick={() => selectAnswer(qIdx, aIdx)}
                      style={{
                        background: selected ? "#1e3a5f" : "#0f1e33",
                        border: `2px solid ${selected ? "#e94560" : "#0f3460"}`,
                        borderRadius: 8,
                        padding: "12px 16px",
                        color: selected ? "#ffffff" : "#c0c8d8",
                        fontSize: 14,
                        lineHeight: 1.5,
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "border-color 0.15s, background 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      <span style={{
                        display: "inline-block",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: `2px solid ${selected ? "#e94560" : "#2a4060"}`,
                        background: selected ? "#e94560" : "transparent",
                        marginRight: 12,
                        verticalAlign: "middle",
                        flexShrink: 0,
                      }} />
                      {ans}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Calculate button */}
          <button
            onClick={calculate}
            disabled={!allAnswered}
            style={{
              width: "100%",
              background: allAnswered ? "#e94560" : "#2a3a4a",
              color: allAnswered ? "#ffffff" : "#6a7a8a",
              border: "none",
              borderRadius: 10,
              padding: "16px 32px",
              fontSize: 17,
              fontWeight: 700,
              cursor: allAnswered ? "pointer" : "not-allowed",
              transition: "background 0.2s",
              fontFamily: "inherit",
            }}
          >
            {allAnswered ? "Get My Readiness Score →" : `Answer all 8 questions to continue`}
          </button>
        </div>

        {/* Result */}
        {result !== null && (() => {
          const band = BANDS[result.bandIdx]
          const blurb = OPPORTUNITY_BLURBS[result.lowestQ]
          const lowestLabel = QUESTIONS[result.lowestQ].label
          return (
            <div id="ai-readiness-result" style={{ background: "#16213e", borderRadius: 12, padding: "32px 28px", marginBottom: 32 }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ color: "#a8a8b3", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  Your AI Readiness Score
                </div>
                <div style={{ fontSize: 72, fontWeight: 900, color: band.color, lineHeight: 1, marginBottom: 12 }}>
                  {result.score}
                </div>
                <div style={{ display: "inline-block", background: band.bg, border: `2px solid ${band.color}`, borderRadius: 24, padding: "6px 20px", marginBottom: 16 }}>
                  <span style={{ color: band.color, fontSize: 16, fontWeight: 700 }}>{band.label}</span>
                </div>
                <p style={{ color: "#c8d0e0", fontSize: 15, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
                  {band.description}
                </p>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #1e3050", margin: "24px 0" }} />

              {/* Biggest opportunity */}
              <div style={{ background: "#0f1e33", borderRadius: 10, padding: "20px 22px" }}>
                <div style={{ color: "#e94560", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
                  Biggest Opportunity — {lowestLabel}
                </div>
                <p style={{ color: "#e8e8e8", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                  {blurb}
                </p>
              </div>

              {/* Score breakdown */}
              <div style={{ marginTop: 24 }}>
                <div style={{ color: "#a8a8b3", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
                  Score by area
                </div>
                {QUESTIONS.map((q, i) => {
                  const pts = 3 - (answers[i] as number)
                  const pct = (pts / 3) * 100
                  const isLowest = i === result.lowestQ
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ color: isLowest ? "#e94560" : "#c0c8d8", fontSize: 13, fontWeight: isLowest ? 700 : 400 }}>
                          {isLowest ? "⚠ " : ""}{q.label}
                        </span>
                        <span style={{ color: isLowest ? "#e94560" : "#a8a8b3", fontSize: 13, fontWeight: 600 }}>
                          {pts}/3
                        </span>
                      </div>
                      <div style={{ height: 5, background: "#0f3460", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: isLowest ? "#e94560" : "#22c55e",
                          borderRadius: 3,
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Powered by */}
              <div style={{ textAlign: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid #1e3050" }}>
                <span style={{ color: "#a8a8b3", fontSize: 13 }}>Powered by </span>
                <a
                  href="https://apexaipilot.com?src=dayblip_readiness"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4FC3F7", fontSize: 13, textDecoration: "none", fontWeight: 600 }}
                >
                  Apex AI Pilot
                </a>
              </div>

              {/* Retake */}
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button
                  onClick={reset}
                  style={{
                    background: "transparent",
                    border: "1px solid #2a4060",
                    borderRadius: 8,
                    padding: "10px 24px",
                    color: "#a8a8b3",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          )
        })()}

        <ShareButtons
          text="I just took the free AI Business Readiness Assessment — see how ready your business is for AI:"
          url="https://www.dayblip.com/tools/ai-readiness"
          title="AI Business Readiness Assessment"
        />

        {/* FAQ */}
        <div style={{ marginTop: 48, marginBottom: 40 }}>
          <h2 style={{ color: "#ffffff", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
            Frequently Asked Questions
          </h2>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} style={{ borderTop: "1px solid #1e3050", padding: "18px 0" }}>
              <div style={{ color: "#e8e8e8", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                {faq.question}
              </div>
              <div style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.7 }}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <RelatedTools tools={[
          { emoji: "🤖", title: "AI Job Score", desc: "Will AI replace your job? Get a risk score.", href: "/tools/ai-job-score" },
          { emoji: "💰", title: "True Hourly Wage", desc: "What does your job actually pay per hour?", href: "/tools/true-hourly-wage" },
          { emoji: "📊", title: "Recession Score", desc: "How recession-proof is your financial situation?", href: "/tools/recession-score" },
          { emoji: "🧠", title: "Brain Chaos Calculator", desc: "How much mental load are you actually carrying?", href: "/tools/brain-chaos-calculator" },
        ]} />

        <LastUpdated date="2026-09-14" />
      </div>
    </>
  )
}
