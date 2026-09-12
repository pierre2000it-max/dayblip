"use client"
import { useState, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

// ── data ──────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    text: "Do you have a will or estate plan in place?",
    options: [
      { label: "Yes — fully in place",                      score: 1 },
      { label: "Started but not finished",                   score: 2 },
      { label: "Planning to but have not started",           score: 3 },
      { label: "No and have not thought about it",           score: 4 },
    ],
  },
  {
    text: "Do you have life insurance coverage?",
    options: [
      { label: "Yes — enough to cover my family for several years", score: 1 },
      { label: "Yes but probably not enough",                        score: 2 },
      { label: "No but I am looking into it",                        score: 3 },
      { label: "No and I have not prioritized it",                   score: 4 },
    ],
  },
  {
    text: "How consistently do you save or invest each month?",
    options: [
      { label: "Every month without fail",             score: 1 },
      { label: "Most months",                          score: 2 },
      { label: "Occasionally when I have extra",       score: 3 },
      { label: "Rarely or not at all",                 score: 4 },
    ],
  },
  {
    text: "Have you talked to your family about money, wealth, and what you want to leave behind?",
    options: [
      { label: "Yes — we have had real conversations about it", score: 1 },
      { label: "A little but not in depth",                      score: 2 },
      { label: "Not really",                                     score: 3 },
      { label: "Never",                                          score: 4 },
    ],
  },
  {
    text: "Do you have an emergency fund that covers at least 3 months of expenses?",
    options: [
      { label: "Yes — 6 or more months covered",     score: 1 },
      { label: "Yes — about 3 months",               score: 2 },
      { label: "Partially — less than 3 months",     score: 3 },
      { label: "No emergency fund",                  score: 4 },
    ],
  },
  {
    text: "Are you actively teaching your children or younger family members about money?",
    options: [
      { label: "Yes — regularly",                                 score: 1 },
      { label: "Sometimes",                                       score: 2 },
      { label: "Not really",                                      score: 3 },
      { label: "No children or not applicable",                   score: 1 },
    ],
  },
  {
    text: "Do you have any debt that would be left to your family if something happened to you?",
    options: [
      { label: "No significant debt",                             score: 1 },
      { label: "Some manageable debt",                            score: 2 },
      { label: "Significant debt I am working on",                score: 3 },
      { label: "Significant debt I have not addressed",           score: 4 },
    ],
  },
  {
    text: "Do you know how much you need saved to be financially independent or retire comfortably?",
    options: [
      { label: "Yes — I have a clear number and a plan",  score: 1 },
      { label: "I have a rough idea",                     score: 2 },
      { label: "Not really",                              score: 3 },
      { label: "No idea",                                 score: 4 },
    ],
  },
  {
    text: "How intentional are you about building wealth versus just covering expenses month to month?",
    options: [
      { label: "Very intentional — I have a strategy",      score: 1 },
      { label: "Somewhat intentional",                      score: 2 },
      { label: "Mostly just covering expenses",             score: 3 },
      { label: "Entirely reactive — no plan in place",      score: 4 },
    ],
  },
] as const

type Profile = {
  range: string
  label: string
  body: string
}

const PROFILES: Profile[] = [
  {
    range: "9–15",
    label: "Strong Foundation",
    body: "You are building intentionally and your family will feel that. The habits and structures you have put in place — the savings discipline, the planning, the conversations — are exactly what separates families that build wealth across generations from those that start over each one. The work you are doing now matters far beyond your own lifetime. Keep going.",
  },
  {
    range: "16–24",
    label: "Solid Progress with Gaps",
    body: "You have built real momentum and a few focused moves could significantly strengthen your legacy. The foundation is there — you are thinking about this, you are taking steps, and that puts you ahead of most. The gaps are not failures; they are the next chapter. Identifying them is the most valuable thing you can do right now, because what gets named gets addressed.",
  },
  {
    range: "25–30",
    label: "Legacy at Risk",
    body: "The habits and plans that protect your family are not fully in place yet — and that is entirely fixable. Most people do not have this figured out, and the fact that you are here means you are already thinking about it differently than the people who never ask the question. Every step forward from here, no matter how small, is a real change in the trajectory for your family.",
  },
  {
    range: "31–36",
    label: "Starting Point Identified",
    body: "The most important thing you can do right now is start — one decision at a time. Not everything. Not all at once. Just the next thing. A will. A savings habit. A conversation with your family about money. Any one of those is a genuine act of legacy building, and each one makes the next one easier. You are not behind — you are at the beginning.",
  },
]

function getProfile(score: number): Profile {
  if (score <= 15) return PROFILES[0]
  if (score <= 24) return PROFILES[1]
  if (score <= 30) return PROFILES[2]
  return PROFILES[3]
}

const TOOL_URL = "https://www.dayblip.com/tools/financial-legacy-score"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Financial Legacy Score",
      url: TOOL_URL,
      description: "9 questions. Find out how prepared you are to build and transfer wealth to the next generation. Free educational tool from GW360.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author:    { "@type": "Organization", name: "Dayblip",                 url: "https://www.dayblip.com" },
      publisher: { "@type": "Organization", name: "Generational Wealth 360", url: "https://generationalwealth360.com" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does the Financial Legacy Score measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool measures self-reported financial preparedness across 9 legacy planning factors: estate planning, life insurance, savings consistency, family money conversations, emergency fund coverage, financial education for younger family members, debt exposure, retirement clarity, and wealth-building intentionality.",
          },
        },
        {
          "@type": "Question",
          name: "What is a financial legacy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A financial legacy is the combination of assets, habits, knowledge, and structures you leave behind for the next generation. It includes tangible wealth like savings, investments, and property — but also the financial education and conversations that shape how the next generation handles money.",
          },
        },
        {
          "@type": "Question",
          name: "What is the most important first step in building a financial legacy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most financial planners point to three foundational steps that apply regardless of income level: establishing a will or basic estate plan, securing appropriate life insurance coverage, and beginning consistent saving — even small amounts. These create the structural floor that everything else builds on.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function FinancialLegacyScorePage() {
  const [step,        setStep]        = useState<number>(0)
  const [answers,     setAnswers]     = useState<number[]>([])
  const [visible,     setVisible]     = useState(true)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [copied,      setCopied]      = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const total         = QUESTIONS.length
  const questionIndex = step - 1
  const isIntro       = step === 0
  const isDone        = step === total + 1

  const score   = answers.reduce((a, b) => a + b, 0)
  const profile = isDone ? getProfile(score) : null

  function advance(nextStep: number, appendScore?: number) {
    setVisible(false)
    setTimeout(() => {
      setSelectedIdx(null)
      if (appendScore !== undefined) setAnswers(prev => [...prev, appendScore])
      setStep(nextStep)
      setVisible(true)
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
    }, 220)
  }

  function handleAnswer(sc: number, idx: number) {
    setSelectedIdx(idx)
    setTimeout(() => {
      const isLast = questionIndex === total - 1
      advance(isLast ? total + 1 : step + 1, sc)
    }, 320)
  }

  function restart() {
    setAnswers([])
    setSelectedIdx(null)
    advance(0)
  }

  const progressPct = isDone ? 100 : step === 0 ? 0 : (step / total) * 100

  const shareText = profile
    ? `My Financial Legacy Score is "${profile.label}". Find out yours: ${TOOL_URL}`
    : `Find out how prepared you are to build financial legacy for your family: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .fade-card {
          transition: opacity 0.22s ease, transform 0.22s ease;
        }
        .fade-card.hidden-card {
          opacity: 0;
          transform: translateY(8px);
        }
        .fade-card.visible-card {
          opacity: 1;
          transform: translateY(0);
        }
        .answer-btn {
          width: 100%;
          text-align: left;
          padding: 14px 18px;
          border-radius: 10px;
          border: 2px solid #0f3460;
          background: #0d1b2a;
          color: #ffffff;
          font-size: 15px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
          line-height: 1.4;
        }
        .answer-btn:hover {
          border-color: #f97316;
          background: #1a1a2e;
        }
        .answer-btn.selected {
          border-color: #f97316;
          background: #431407;
          transform: scale(0.98);
        }
        .answer-btn:disabled {
          cursor: default;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section style={{
          padding: "56px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)",
        }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1 style={{
              fontSize: "clamp(22px,5vw,36px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 12,
            }}>
              Financial Legacy Score
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              How ready is your family for what you leave behind? 9 questions.
              Instant results. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home",  href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Financial Legacy Score" },
            ]} />

            <div style={{
              background: "#1e2d4a",
              borderLeft: "4px solid #e94560",
              borderRadius: 8,
              padding: "16px 20px",
            }}>
              <div style={{
                color: "#e94560",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 8,
              }}>
                Quick Answer
              </div>
              <p style={{ color: "#e2e8f0", margin: 0, lineHeight: 1.6 }}>
                Most families do not lose wealth because of bad investments — they lose it
                because of the absence of planning, conversation, and structure. A will, a
                savings habit, life insurance coverage, and honest money conversations with
                family are the foundation of any financial legacy, regardless of income level.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              This quiz is for educational purposes only and is not financial advice. For
              personalized guidance on estate planning, insurance, or wealth building,
              consult a certified financial planner.
            </p>
          </div>
        </section>

        {/* ── Quiz / Results ─────────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>

            {/* Progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ height: 4, background: "#0f3460", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background: "#f97316",
                  borderRadius: 99,
                  transition: "width 0.35s ease",
                }} />
              </div>
              {!isIntro && !isDone && (
                <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, textAlign: "right" }}>
                  Question {step} of {total}
                </p>
              )}
            </div>

            {/* Card */}
            <div
              ref={cardRef}
              className={`fade-card ${visible ? "visible-card" : "hidden-card"}`}
            >

              {/* ── Intro ─────────────────────────────────────────────────── */}
              {isIntro && (
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 14,
                  border: "1px solid #0f3460",
                  padding: "36px 28px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Let&apos;s see where your legacy stands
                  </h2>
                  <p style={{ color: "#a8a8b3", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Nine honest questions about your financial habits, planning, and
                    preparedness. Answer based on where things actually are today — not
                    where you hope they will be. There is no judgment here, only clarity.
                  </p>
                  <button
                    onClick={() => advance(1)}
                    style={{
                      background: "#f97316",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "14px 36px",
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Start the quiz →
                  </button>
                </div>
              )}

              {/* ── Question ──────────────────────────────────────────────── */}
              {!isIntro && !isDone && (
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 14,
                  border: "1px solid #0f3460",
                  padding: "28px 24px",
                }}>
                  <p style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 14, fontWeight: 600 }}>
                    Question {step} of {total}
                  </p>
                  <h2 style={{
                    color: "#fff",
                    fontSize: "clamp(16px,4vw,20px)",
                    fontWeight: 700,
                    lineHeight: 1.45,
                    marginBottom: 24,
                  }}>
                    {QUESTIONS[questionIndex].text}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {QUESTIONS[questionIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        className={`answer-btn${selectedIdx === i ? " selected" : ""}`}
                        onClick={() => handleAnswer(opt.score, i)}
                        disabled={selectedIdx !== null}
                      >
                        <span style={{ color: "#f97316", fontWeight: 700, marginRight: 10 }}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Results ───────────────────────────────────────────────── */}
              {isDone && profile && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Score + label */}
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "2px solid #f97316",
                    padding: "32px 24px",
                    textAlign: "center",
                  }}>
                    <p style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 8 }}>
                      Your score: <strong style={{ color: "#fff" }}>{score} / 36</strong>
                    </p>
                    <p style={{
                      color: "#f97316",
                      fontSize: "clamp(20px,5vw,30px)",
                      fontWeight: 900,
                      lineHeight: 1.25,
                      marginBottom: 4,
                    }}>
                      {profile.label}
                    </p>
                    <p style={{ color: "#a8a8b3", fontSize: 13 }}>Range {profile.range}</p>
                  </div>

                  {/* Profile body */}
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "1px solid #0f3460",
                    padding: "24px",
                  }}>
                    <p style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                      {profile.body}
                    </p>
                  </div>

                  {/* Answer breakdown */}
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "1px solid #0f3460",
                    padding: "20px 24px",
                  }}>
                    <p style={{
                      color: "#a8a8b3",
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 14,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}>
                      Your answers
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {QUESTIONS.map((q, i) => {
                        const a   = answers[i]
                        const opt = q.options.find(o => o.score === a)
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 12,
                              paddingBottom: 10,
                              borderBottom: i < QUESTIONS.length - 1 ? "1px solid #0f3460" : "none",
                            }}
                          >
                            <span style={{ color: "#a8a8b3", fontSize: 13, flex: 1, lineHeight: 1.5 }}>
                              {q.text}
                            </span>
                            <span style={{
                              color: a >= 3 ? "#f97316" : "#4ade80",
                              fontWeight: 700,
                              fontSize: 13,
                              whiteSpace: "nowrap",
                              maxWidth: "40%",
                              textAlign: "right",
                            }}>
                              {opt?.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Copy share text */}
                  <button
                    onClick={async () => {
                      const text = `My Financial Legacy Score is "${profile.label}". Find out yours: ${TOOL_URL}`
                      try { await navigator.clipboard.writeText(text) }
                      catch {
                        const el = document.createElement("textarea")
                        el.value = text
                        document.body.appendChild(el)
                        el.select()
                        document.execCommand("copy")
                        document.body.removeChild(el)
                      }
                      setCopied(true)
                      setTimeout(() => setCopied(false), 3000)
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      padding: "13px 20px",
                      borderRadius: 10,
                      border: "1px solid #0f3460",
                      background: "#1e2d4a",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {copied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 16, height: 16, flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied to clipboard!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16, flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                        Share your result
                      </>
                    )}
                  </button>

                  {/* CTA */}
                  <div style={{
                    background: "#431407",
                    border: "1px solid #f97316",
                    borderRadius: 14,
                    padding: "24px",
                    textAlign: "center",
                  }}>
                    <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                      Generational Wealth 360 publishes free financial education for families
                      who want to build lasting wealth — covering estate basics, savings
                      strategies, and the money conversations that change family trajectories.
                    </p>
                    <a
                      href="https://generationalwealth360.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        background: "#f97316",
                        color: "#fff",
                        borderRadius: 10,
                        padding: "13px 32px",
                        fontWeight: 700,
                        fontSize: 15,
                        textDecoration: "none",
                      }}
                    >
                      Learn More at GW360 →
                    </a>
                  </div>

                  {/* Retake */}
                  <button
                    onClick={restart}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#a8a8b3",
                      fontSize: 14,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Retake the quiz
                  </button>

                  <ShareButtons
                    text={shareText}
                    url={TOOL_URL}
                    title="Financial Legacy Score — How Ready Is Your Family for What You Leave Behind?"
                  />
                </div>
              )}
            </div>

            {/* ── Methodology & Attribution ──────────────────────────────────── */}
            {(isIntro || isDone) && (
              <div style={{ marginTop: 40 }}>
                <MethodologyNote text="This tool measures self-reported financial preparedness across common legacy planning factors. It is for educational purposes only and is not financial advice. For personalized guidance consult a certified financial planner." />
                <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                  Powered by Generational Wealth 360 — financial education for families building legacy.
                </p>
                <LastUpdated date="September 2026" />
              </div>
            )}

            {/* ── Related Tools ──────────────────────────────────────────────── */}
            {isDone && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "📅", title: "Wealth Transfer Timeline",              desc: "Project your wealth at 65 and 75 and your generational impact",   href: "/tools/wealth-transfer-timeline" },
                  { emoji: "💰", title: "Salary Ceiling Calculator",              desc: "See the lifetime limit a salary puts on your wealth",             href: "/tools/salary-ceiling-calculator" },
                  { emoji: "🏢", title: "Entrepreneur vs Employee Wealth Gap",    desc: "The financial difference between a salary and a business",        href: "/tools/entrepreneur-vs-employee-wealth-gap" },
                  { emoji: "🏠", title: "Family Mental Load Score",               desc: "How much of your household are you carrying alone?",             href: "/tools/family-mental-load-score" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
