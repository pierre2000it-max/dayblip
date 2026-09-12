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
    text: "How much sleep are you getting on a typical night right now?",
    options: [
      { label: "6 or more hours",                              score: 1 },
      { label: "4 to 6 hours",                                 score: 2 },
      { label: "2 to 4 hours",                                 score: 3 },
      { label: "Less than 2 hours or completely unpredictable", score: 4 },
    ],
  },
  {
    text: "How on top of household tasks like laundry, dishes, and meals do you feel?",
    options: [
      { label: "Everything is mostly under control",  score: 1 },
      { label: "Managing but behind on some things",  score: 2 },
      { label: "Falling behind on a lot of it",       score: 3 },
      { label: "It feels completely out of control",  score: 4 },
    ],
  },
  {
    text: "How often do you feel like you do not know what needs to happen next?",
    options: [
      { label: "Almost never",  score: 1 },
      { label: "Sometimes",     score: 2 },
      { label: "Often",         score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How much of the baby care and household coordination lives only in your head?",
    options: [
      { label: "Almost none — it is shared or written down", score: 1 },
      { label: "Some of it",                                 score: 2 },
      { label: "Most of it",                                 score: 3 },
      { label: "All of it",                                  score: 4 },
    ],
  },
  {
    text: "How often do important tasks fall through the cracks because no one tracked them?",
    options: [
      { label: "Almost never",  score: 1 },
      { label: "Sometimes",     score: 2 },
      { label: "Often",         score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How supported do you feel by the people around you right now?",
    options: [
      { label: "Very supported",                    score: 1 },
      { label: "Mostly supported",                  score: 2 },
      { label: "A little support but not enough",   score: 3 },
      { label: "Mostly on my own",                  score: 4 },
    ],
  },
  {
    text: "How often do you feel mentally exhausted before the day is even half done?",
    options: [
      { label: "Almost never",  score: 1 },
      { label: "Sometimes",     score: 2 },
      { label: "Often",         score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How much time do you have for yourself — even just 15 minutes — on a typical day?",
    options: [
      { label: "Most days",           score: 1 },
      { label: "A few times a week",  score: 2 },
      { label: "Rarely",              score: 3 },
      { label: "Almost never",        score: 4 },
    ],
  },
  {
    text: "How would you describe the overall feeling in your home right now?",
    options: [
      { label: "Mostly calm and under control",    score: 1 },
      { label: "Busy but manageable",              score: 2 },
      { label: "Chaotic and hard to keep up with", score: 3 },
      { label: "Overwhelming most of the time",    score: 4 },
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
    label: "You Are Handling This Well",
    body: "Things are hard but you have a rhythm going. That does not mean it is easy — it just means you have found enough of a footing to keep moving. The fact that you paused to check in on yourself is a good sign. Keep doing what is working, lean on the people around you, and give yourself credit for how much you are actually managing.",
  },
  {
    range: "16–24",
    label: "You Are in the Thick of It",
    body: "The load is real and a little more structure could go a long way. You are not failing — you are in one of the most demanding seasons a person can be in, and you are doing it without a full system to hold everything together. Getting some of this out of your head and into a shared list would immediately take some pressure off. You do not have to figure it all out, but you do need to stop holding it all alone.",
  },
  {
    range: "25–30",
    label: "High Overwhelm",
    body: "You are carrying a lot and most of it is running through you alone. That is exhausting in a way that is hard to describe to anyone who is not in it. This is not a personal failing — it is what happens when the volume of what needs doing outpaces any one person&apos;s capacity. The most important thing right now is getting visible on the load: what is it, who can hold some of it, and what can wait.",
  },
  {
    range: "31–36",
    label: "You Need Support Now",
    body: "This is not sustainable and it is not supposed to be done alone. What you are experiencing is not weakness — it is the natural result of an unsupported load reaching its limit. Please reach out to someone today, whether that is a partner, a family member, a friend, or a healthcare provider. You deserve help, and asking for it is the strongest thing you can do right now.",
  },
]

function getProfile(score: number): Profile {
  if (score <= 15) return PROFILES[0]
  if (score <= 24) return PROFILES[1]
  if (score <= 30) return PROFILES[2]
  return PROFILES[3]
}

const TOOL_URL = "https://www.dayblip.com/tools/new-baby-overwhelm-index"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "New Baby Overwhelm Index",
      url: TOOL_URL,
      description: "9 questions. Find out how much of the new baby load you are carrying alone and what a shared household system could take off your plate.",
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
          name: "What does the New Baby Overwhelm Index measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool measures self-reported overwhelm across 9 factors common to new parents: sleep, household task management, clarity on what needs doing, mental load distribution, task tracking, support levels, mental exhaustion, personal time, and overall home atmosphere.",
          },
        },
        {
          "@type": "Question",
          name: "Why do so many new parents feel overwhelmed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New parenthood dramatically increases the volume of tasks that need to happen while dramatically reducing the resources — time, sleep, cognitive bandwidth — needed to do them. When this load is held by one person without a shared system to distribute it, overwhelm is the natural result, not a personal failure.",
          },
        },
        {
          "@type": "Question",
          name: "What is the most effective way to reduce new parent overwhelm?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Research consistently points to two factors: shared load and visible systems. When baby care and household tasks are written down and distributed rather than held in one person's memory, cognitive load drops immediately. Tools like shared checklists and household management apps help both partners see and own the full picture.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function NewBabyOverwhelmIndexPage() {
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
    ? `My New Baby Overwhelm Score is "${profile.label}". Find out yours: ${TOOL_URL}`
    : `Find out how much of the new baby load you are carrying alone: ${TOOL_URL}`

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
              New Baby Overwhelm Index
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              How much are you actually carrying right now? 9 questions.
              Instant results. Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ──────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "New Baby Overwhelm Index" },
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
                New parenthood is one of the most demanding transitions a person can go through —
                and it almost always involves one person carrying far more of the mental and
                physical load than feels fair or sustainable. This quiz helps you see exactly
                how much you are holding and where the pressure is coming from.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              There is no right score. There is only an honest picture of where things stand
              right now. That picture is the starting point for anything that gets better.
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
                  <div style={{ fontSize: 48, marginBottom: 16 }}>👶</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Let&apos;s see how much you are actually carrying
                  </h2>
                  <p style={{ color: "#a8a8b3", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Nine honest questions about life with a new baby. Answer based on where
                    things genuinely are right now — not where you wish they were or think
                    they should be.
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
                      fontSize: "clamp(20px,5vw,28px)",
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
                    <p
                      style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.8, margin: 0 }}
                      dangerouslySetInnerHTML={{ __html: profile.body }}
                    />
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
                              maxWidth: "45%",
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
                      const text = `My New Baby Overwhelm Score is "${profile.label}". Find out yours: ${TOOL_URL}`
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
                      Checkbloom helps new parents get the full household load out of one
                      person&apos;s head and into a shared system — so both partners can see
                      what needs doing and nothing falls through the cracks.
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
                      Get Organized with Checkbloom →
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
                    title="New Baby Overwhelm Index — How Much Are You Actually Carrying Right Now?"
                  />
                </div>
              )}
            </div>

            {/* ── Methodology & Attribution ──────────────────────────────────── */}
            {(isIntro || isDone) && (
              <div style={{ marginTop: 40 }}>
                <MethodologyNote text="This tool measures self-reported overwhelm based on common new parent stress factors. It is not a clinical assessment. If you are struggling with your mental health please reach out to a healthcare provider." />
                <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                  Powered by Checkbloom — household management built for real families.
                </p>
                <LastUpdated date="September 2026" />
              </div>
            )}

            {/* ── Related Tools ──────────────────────────────────────────────── */}
            {isDone && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "🏠", title: "Family Mental Load Score",       desc: "Find out how much of your household you carry alone",            href: "/tools/family-mental-load-score" },
                  { emoji: "📦", title: "Moving Stress Calculator",        desc: "How much is your move actually weighing on you?",               href: "/tools/moving-stress-calculator" },
                  { emoji: "🌀", title: "Brain Chaos Calculator",          desc: "How loud is your head on a typical day?",                       href: "/tools/brain-chaos-calculator" },
                  { emoji: "⚡", title: "Energy Level Task Matcher",       desc: "Match your tasks to how you actually feel right now",           href: "/tools/energy-level-task-matcher" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
