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
    text: "How often do you have so many thoughts running at once that it is hard to focus on just one?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you sit down to work and immediately think of 5 other things you should be doing instead?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you lose a thought mid-sentence or mid-task before you can act on it?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often does the noise in your head make it hard to wind down at night?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you feel like your brain is running faster than you can keep up with?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you feel mentally exhausted even when you have not done much physically?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you wish you could just dump everything out of your head somewhere so you could think clearly?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes",    score: 2 },
      { label: "Often",        score: 3 },
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
    range: "7–11",
    label: "Mostly Clear",
    body: "Your mental space is mostly clear. You get noise sometimes but it is not running the show. You have probably built habits or rhythms that create enough quiet for you to think. That is worth naming — it does not happen by accident. Keep those anchors visible.",
  },
  {
    range: "12–17",
    label: "Busy Brain",
    body: "Your brain is busy. You are managing it but it is costing you energy to do so. You likely get through your days effectively, but underneath there is a background hum — a sense that you are always half-occupied by something else. That overhead is real, even when it is invisible to everyone around you.",
  },
  {
    range: "18–22",
    label: "High Chaos",
    body: "High chaos. Your thoughts are competing for space and it is hard to find a clear signal. You may be used to it by now — the constant switching, the ideas that arrive faster than you can capture them, the exhaustion that is hard to explain to anyone who does not feel it. A brain like yours is not the problem. The absence of the right external system for it is.",
  },
  {
    range: "23–28",
    label: "Always On",
    body: "Your brain never really stops. That is not a flaw — it just means you need a different kind of system. The standard approaches were not built for this level of internal noise. A place to externalize thoughts as they arrive, rather than trying to hold them, changes the experience significantly. You are not looking for quiet — you are looking for somewhere to put it all.",
  },
]

function getProfile(score: number): Profile {
  if (score <= 11) return PROFILES[0]
  if (score <= 17) return PROFILES[1]
  if (score <= 22) return PROFILES[2]
  return PROFILES[3]
}

const TOOL_URL = "https://www.dayblip.com/tools/brain-chaos-calculator"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Brain Chaos Calculator",
      url: TOOL_URL,
      description: "7 questions. Find out how much mental noise you are carrying and whether your current system is built for how your brain actually works.",
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
          name: "What does the Brain Chaos Calculator measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool measures how much mental noise you experience on a typical day — things like racing thoughts, difficulty focusing, mental exhaustion, and the feeling that your brain never fully stops. It returns a self-awareness profile, not a clinical result.",
          },
        },
        {
          "@type": "Question",
          name: "Is this tool a diagnostic instrument?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This tool is not a diagnostic instrument. It is designed to help you reflect on how your thoughts feel day to day. For clinical support speak with a qualified professional.",
          },
        },
        {
          "@type": "Question",
          name: "What happens after I finish the quiz?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "After all 7 questions you receive an instant score and a profile describing the level of mental noise your brain carries. The profile is validating and practical — it names the experience and points toward what kind of external system tends to help.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function BrainChaosCalculatorPage() {
  const [step,        setStep]        = useState<number>(0)
  const [answers,     setAnswers]     = useState<number[]>([])
  const [visible,     setVisible]     = useState(true)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [copied,      setCopied]      = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const total        = QUESTIONS.length
  const questionIndex = step - 1
  const isIntro      = step === 0
  const isDone       = step === total + 1

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
    ? `My Brain Chaos Score is "${profile.label}". Find out yours: ${TOOL_URL}`
    : `Find out how loud your head is on a typical day: ${TOOL_URL}`

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
              Brain Chaos Calculator
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              How loud is your head on a typical day? 7 questions. Instant results.
              Free — no signup required.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ─────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "Brain Chaos Calculator" },
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
                Mental noise — the constant background hum of competing thoughts, half-finished
                ideas, and things you are trying not to forget — is not random. It has a pattern,
                and that pattern tells you something useful about what kind of external system your
                brain is looking for. This quiz maps the noise level so you can stop fighting it
                and start working with it.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              A busy, fast-moving brain is not a broken one. It is often a creative, pattern-seeking,
              highly connected one that happens to generate more internal traffic than standard
              productivity tools were designed to handle. Knowing where you sit helps you choose
              what to reach for.
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
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🌀</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Let&apos;s find out what is going on in there
                  </h2>
                  <p style={{ color: "#a8a8b3", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Seven questions about how your thoughts feel on a typical day.
                    No right answers — just honest ones. Takes about 90 seconds.
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
                      Your score: <strong style={{ color: "#fff" }}>{score} / 28</strong>
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
                      const text = `My Brain Chaos Score is "${profile.label}". Find out yours: ${TOOL_URL}`
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
                      Noova is a thinking space built for brains with a lot going on — a place
                      to get thoughts out of your head and into a system that actually keeps up
                      with you.
                    </p>
                    <a
                      href="https://noova.app"
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
                      Try Noova Free →
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
                    title="Brain Chaos Calculator — How Loud Is Your Head on a Typical Day?"
                  />
                </div>
              )}
            </div>

            {/* ── Methodology & Attribution ─────────────────────────────── */}
            {(isIntro || isDone) && (
              <div style={{ marginTop: 40 }}>
                <MethodologyNote text="This tool is not a diagnostic instrument. It is designed to help you reflect on how your thoughts feel day to day. For clinical support speak with a qualified professional." />
                <p style={{ color: "#a8a8b3", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>
                  Powered by Noova — built for brains that work differently.
                </p>
                <LastUpdated date="September 2026" />
              </div>
            )}

            {/* ── Related Tools ─────────────────────────────────────────── */}
            {isDone && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "🧠", title: "ADHD Productivity Score",         desc: "Find out where your brain loses momentum",            href: "/tools/adhd-productivity-score" },
                  { emoji: "😴", title: "Sleep Debt Calculator",            desc: "See how much sleep you have lost and its cost",       href: "/tools/sleep-debt" },
                  { emoji: "⏱️", title: "Procrastination Cost Calculator", desc: "The financial cost of putting things off",            href: "/tools/procrastination-cost" },
                  { emoji: "💻", title: "Screen Time Cost Calculator",      desc: "What your screen time is really costing you",        href: "/tools/time-wasted" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
