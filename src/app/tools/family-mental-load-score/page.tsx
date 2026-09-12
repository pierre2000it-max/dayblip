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
    text: "How often do you remember appointments, deadlines, and events for the whole household?",
    options: [
      { label: "Someone else handles it", score: 1 },
      { label: "We share it equally", score: 2 },
      { label: "Mostly me", score: 3 },
      { label: "Always me", score: 4 },
    ],
  },
  {
    text: "How often do you think about what groceries, supplies, or household items need to be restocked?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you coordinate schedules for kids, family, or household activities?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you notice when something at home needs to be fixed, cleaned, or replaced?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you feel like you are the only one who knows what needs to happen next at home?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do household tasks fall through the cracks because no one tracked them?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you feel mentally exhausted from keeping track of everything at home?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do other household members ask you what needs to be done instead of checking themselves?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you plan ahead for upcoming household needs like seasonal tasks or events?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you feel like the household would fall apart if you stopped tracking everything?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
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
    range: "10–17",
    label: "Balanced Load",
    body: "Your household load is balanced. Things are getting tracked and shared well. The cognitive work of running a home is distributed, and that is something worth protecting. You likely have rhythms or agreements that work — keep them visible and keep them shared.",
  },
  {
    range: "18–25",
    label: "Carrying More Than Your Share",
    body: "You are carrying more than your share. The system is working but it is mostly running through you. Day-to-day life looks functional from the outside, but the invisible work of noticing, planning, and remembering is landing on one person. That imbalance has a cumulative cost — even when no one is naming it.",
  },
  {
    range: "26–33",
    label: "High Mental Load",
    body: "High mental load. You are the household operating system and it is taking a toll. The appointments, the restocking, the scheduling, the follow-through — so much of it lives in your head. That is exhausting even when each individual task seems small. Shared systems, not more reminders to yourself, are what actually shift this.",
  },
  {
    range: "34–40",
    label: "Running It All Alone",
    body: "You are running the entire household in your head. That is not sustainable and it is not your job alone. You may have absorbed this gradually — each task small enough that asking for help felt like more effort than just doing it. But the weight of all of it together is real. A shared, visible system means others can see what needs doing without being asked.",
  },
]

function getProfile(score: number): Profile {
  if (score <= 17) return PROFILES[0]
  if (score <= 25) return PROFILES[1]
  if (score <= 33) return PROFILES[2]
  return PROFILES[3]
}

const TOOL_URL = "https://www.dayblip.com/tools/family-mental-load-score"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Family Mental Load Score",
      url: TOOL_URL,
      description: "10 questions. Find out how much of your household you are carrying alone and what a shared system could change.",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
      publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
      dateModified: "2026-09-12",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the mental load in a household?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The mental load is the invisible cognitive work of tracking, planning, and managing household tasks — remembering appointments, anticipating what needs restocking, coordinating schedules, and noticing what needs to be done. It often falls disproportionately on one person.",
          },
        },
        {
          "@type": "Question",
          name: "What does this quiz measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The quiz measures how much of your household's tracking and planning work you carry personally — from appointments and supplies to scheduling and anticipating future needs. It surfaces the imbalance so it can be addressed.",
          },
        },
        {
          "@type": "Question",
          name: "How can a shared household system help?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When household tasks, schedules, and needs are visible to everyone — not just stored in one person's head — other members can act without being asked. That shifts mental load from a single person to the whole household.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function FamilyMentalLoadScorePage() {
  const [step, setStep]           = useState<number>(0)   // 0=intro, 1-10=questions, 11=results
  const [answers, setAnswers]     = useState<number[]>([])
  const [visible, setVisible]     = useState(true)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [copied, setCopied]       = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const total = QUESTIONS.length
  const questionIndex = step - 1
  const isIntro  = step === 0
  const isDone   = step === total + 1

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

  function handleAnswer(score: number, idx: number) {
    setSelectedIdx(idx)
    setTimeout(() => {
      const isLast = questionIndex === total - 1
      advance(isLast ? total + 1 : step + 1, score)
    }, 320)
  }

  function restart() {
    setAnswers([])
    setSelectedIdx(null)
    advance(0)
  }

  const progressPct = isDone ? 100 : step === 0 ? 0 : (step / total) * 100

  const shareText = profile
    ? `My Family Mental Load Score is "${profile.label}". Find out yours: ${TOOL_URL}`
    : `Find out how much of your household you are carrying alone: ${TOOL_URL}`

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

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{
          padding: "56px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)",
        }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1 style={{
              fontSize: "clamp(24px,5vw,38px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.25,
              marginBottom: 12,
            }}>
              Family Mental Load Score
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              How much of your household lives in your head? 10 questions.
              Instant results. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ─────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Family Mental Load Score" },
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
                The mental load of running a household — tracking appointments, restocking supplies,
                coordinating schedules, anticipating what comes next — often falls on one person
                without anyone naming it. This quiz surfaces how much of that invisible work you
                are carrying so you can see the imbalance clearly and decide what to do about it.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Mental load is not about doing tasks — it is about the cognitive overhead of
              remembering, planning, and noticing. When it concentrates in one person it becomes
              invisible to everyone else, and that invisibility is part of what makes it heavy.
            </p>
          </div>
        </section>

        {/* ── Quiz / Results ────────────────────────────────────────────── */}
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

              {/* ── Intro ──────────────────────────────────────────────── */}
              {isIntro && (
                <div style={{
                  background: "#1e2d4a",
                  borderRadius: 14,
                  border: "1px solid #0f3460",
                  padding: "36px 28px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    How much of your household are you carrying alone?
                  </h2>
                  <p style={{ color: "#a8a8b3", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Ten quick questions about how your household gets tracked and managed.
                    Answer honestly — there are no wrong answers, only useful ones.
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

              {/* ── Question ───────────────────────────────────────────── */}
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
                    fontSize: "clamp(17px,4vw,21px)",
                    fontWeight: 700,
                    lineHeight: 1.4,
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

              {/* ── Results ────────────────────────────────────────────── */}
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
                      Your score: <strong style={{ color: "#fff" }}>{score} / 40</strong>
                    </p>
                    <p style={{
                      color: "#f97316",
                      fontSize: "clamp(22px,6vw,32px)",
                      fontWeight: 900,
                      lineHeight: 1.2,
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
                    <p style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.75, margin: 0 }}>
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
                        const a = answers[i]
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
                            }}>
                              {opt?.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Share result */}
                  <button
                    onClick={async () => {
                      const text = `My Family Mental Load Score is "${profile.label}". Find out yours: ${TOOL_URL}`
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
                      Checkbloom makes household tasks visible to everyone — not just the person
                      holding everything in their head. Shared lists, shared reminders, shared
                      accountability.
                    </p>
                    <a
                      href="https://checkbloom.app"
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
                      Try Checkbloom Free →
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
                    title="Family Mental Load Score — How Much of Your Household Lives in Your Head?"
                  />
                </div>
              )}
            </div>

            {/* ── Methodology & Attribution ─────────────────────────────── */}
            {(isIntro || isDone) && (
              <div style={{ marginTop: 40 }}>
                <MethodologyNote text="This tool measures self-reported household task tracking. It is not a clinical or psychological assessment." />
                <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                  Powered by Checkbloom — household management built for real families.
                </p>
                <LastUpdated date="September 2026" />
              </div>
            )}

            {/* ── Related Tools ─────────────────────────────────────────── */}
            {isDone && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "⏱️", title: "Procrastination Cost Calculator", desc: "The financial cost of putting things off", href: "/tools/procrastination-cost" },
                  { emoji: "😴", title: "Sleep Debt Calculator", desc: "See how much sleep you have lost and its cost", href: "/tools/sleep-debt" },
                  { emoji: "🧠", title: "ADHD Productivity Score", desc: "Find out where your brain loses momentum", href: "/tools/adhd-productivity-score" },
                  { emoji: "💻", title: "Screen Time Cost Calculator", desc: "What your screen time is really costing you", href: "/tools/time-wasted" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
