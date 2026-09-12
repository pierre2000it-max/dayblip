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
    text: "How many weeks away is your move date?",
    options: [
      { label: "More than 8 weeks",   score: 1 },
      { label: "5 to 8 weeks",        score: 2 },
      { label: "2 to 4 weeks",        score: 3 },
      { label: "Less than 2 weeks",   score: 4 },
    ],
  },
  {
    text: "How much of your packing is done right now?",
    options: [
      { label: "Most or all of it",   score: 1 },
      { label: "About half",          score: 2 },
      { label: "Just started",        score: 3 },
      { label: "Have not started",    score: 4 },
    ],
  },
  {
    text: "How many rooms are you moving?",
    options: [
      { label: "1 to 2 rooms",        score: 1 },
      { label: "3 to 4 rooms",        score: 2 },
      { label: "5 to 6 rooms",        score: 3 },
      { label: "7 or more rooms",     score: 4 },
    ],
  },
  {
    text: "Do you have kids or pets moving with you?",
    options: [
      { label: "No kids or pets",     score: 1 },
      { label: "Pets only",           score: 2 },
      { label: "Kids only",           score: 3 },
      { label: "Both kids and pets",  score: 4 },
    ],
  },
  {
    text: "How organized is your current home right now?",
    options: [
      { label: "Very organized — everything has a place",  score: 1 },
      { label: "Mostly organized with some clutter",       score: 2 },
      { label: "A bit chaotic but manageable",             score: 3 },
      { label: "It is a lot right now",                    score: 4 },
    ],
  },
  {
    text: "Are you coordinating the move on your own or with help?",
    options: [
      { label: "Full moving company handling everything",  score: 1 },
      { label: "Friends and family helping",               score: 2 },
      { label: "Mix of help and DIY",                      score: 3 },
      { label: "Doing it all myself",                      score: 4 },
    ],
  },
  {
    text: "How many tasks on your moving checklist are still untracked or in your head?",
    options: [
      { label: "Almost none — it is all written down",     score: 1 },
      { label: "A few things not tracked yet",             score: 2 },
      { label: "Quite a bit still in my head",             score: 3 },
      { label: "Most of it is still in my head",           score: 4 },
    ],
  },
  {
    text: "How stressed do you feel about this move right now?",
    options: [
      { label: "Not stressed at all",  score: 1 },
      { label: "Slightly stressed",    score: 2 },
      { label: "Pretty stressed",      score: 3 },
      { label: "Very stressed",        score: 4 },
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
    range: "8–14",
    label: "Under Control",
    body: "Your move is under control. Keep the momentum going and you will land well. You have enough time, enough help, and enough visibility into what needs to happen. The main job now is staying consistent — keep ticking things off, keep the list visible, and do not let the final week sneak up on you.",
  },
  {
    range: "15–22",
    label: "Some Pressure",
    body: "There is some pressure here. A clear checklist and a few focused hours will make a big difference. You are not behind — but you are at the point where keeping things in your head starts to cost you. Getting everything written down in one place is the highest-leverage thing you can do right now. Once it is visible, it becomes manageable.",
  },
  {
    range: "23–28",
    label: "High Stress Move",
    body: "High stress move. You have a lot of moving parts and most of them need attention soon. The combination of timing, logistics, and everything still in your head is creating real pressure. This is the moment to stop holding it all mentally and start working from a written list. You do not need everything done today — you need everything visible today.",
  },
  {
    range: "29–32",
    label: "Needs a System Now",
    body: "This move needs a system right now. The chaos is manageable but only if you get it out of your head and onto a list. You are carrying a significant load — the volume, the timing, the details — and right now most of it exists only in your memory. That is exhausting. A shared checklist, even a rough one, immediately reduces the mental weight and gives everyone involved something to work from.",
  },
]

function getProfile(score: number): Profile {
  if (score <= 14) return PROFILES[0]
  if (score <= 22) return PROFILES[1]
  if (score <= 28) return PROFILES[2]
  return PROFILES[3]
}

const TOOL_URL = "https://www.dayblip.com/tools/moving-stress-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Moving Stress Calculator",
      url: TOOL_URL,
      description: "8 questions. Find out how much stress your move is carrying and what getting it out of your head and onto a list could change.",
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
          name: "What does the Moving Stress Calculator measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool measures self-reported moving stress across 8 factors: timeline, packing progress, home size, family complexity, current organization, available help, how much is still untracked, and your own stress level. It returns a profile with practical framing for what to do next.",
          },
        },
        {
          "@type": "Question",
          name: "Why does having tasks in your head increase moving stress?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When moving tasks exist only in memory rather than in a written list, the brain has to continuously rehearse them to avoid forgetting — a process that uses working memory and creates background cognitive load. Getting tasks onto a list removes this overhead immediately.",
          },
        },
        {
          "@type": "Question",
          name: "What is the best way to reduce moving stress quickly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The fastest single action is a brain dump: write down every moving task you are holding in your head, without worrying about order or completeness. This moves the load from memory to a list and immediately reduces the mental overhead of the move.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function MovingStressCalculatorPage() {
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
    ? `My Moving Stress Score is "${profile.label}". Find out yours: ${TOOL_URL}`
    : `Find out how much your move is actually weighing on you: ${TOOL_URL}`

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
              Moving Stress Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              How much is your move actually weighing on you? 8 questions.
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
              { label: "Moving Stress Calculator" },
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
                Moving is consistently ranked among the most stressful life events — not because
                any single task is impossible, but because there are so many of them, on a fixed
                deadline, while the rest of life keeps going. The stress compounds when tasks live
                in your head instead of on a list. This quiz surfaces exactly where your pressure
                is coming from.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Understanding your stress level is the first step toward doing something about it.
              A high score does not mean you are behind — it means you have identified what needs
              attention. That is already progress.
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
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Let&apos;s see what your move is actually costing you mentally
                  </h2>
                  <p style={{ color: "#a8a8b3", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Eight quick questions about your move. Answer based on where things
                    stand right now — not where you hope they will be.
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
                      Your score: <strong style={{ color: "#fff" }}>{score} / 32</strong>
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
                      const text = `My Moving Stress Score is "${profile.label}". Find out yours: ${TOOL_URL}`
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
                      Checkbloom helps you get every moving task out of your head and into a
                      shared list — so nothing falls through the cracks and everyone involved
                      knows what needs doing.
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
                    title="Moving Stress Calculator — How Much Is Your Move Actually Weighing on You?"
                  />
                </div>
              )}
            </div>

            {/* ── Methodology & Attribution ─────────────────────────────── */}
            {(isIntro || isDone) && (
              <div style={{ marginTop: 40 }}>
                <MethodologyNote text="This tool measures self-reported moving stress based on common complexity factors. It is not a clinical assessment." />
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
                  { emoji: "🏠", title: "Family Mental Load Score",          desc: "Find out how much of your household you carry alone",   href: "/tools/family-mental-load-score" },
                  { emoji: "⏱️", title: "Procrastination Cost Calculator",  desc: "The financial cost of putting things off",              href: "/tools/procrastination-cost" },
                  { emoji: "🌀", title: "Brain Chaos Calculator",            desc: "How loud is your head on a typical day?",              href: "/tools/brain-chaos-calculator" },
                  { emoji: "😴", title: "Sleep Debt Calculator",             desc: "See how much sleep you have lost and its cost",         href: "/tools/sleep-debt" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
