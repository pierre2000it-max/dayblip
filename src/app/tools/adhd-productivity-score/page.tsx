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
    text: "How often do you start tasks but struggle to finish them?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How hard is it to get started on something even when you want to do it?",
    options: [
      { label: "Not hard at all", score: 1 },
      { label: "Slightly hard", score: 2 },
      { label: "Pretty hard", score: 3 },
      { label: "Extremely hard", score: 4 },
    ],
  },
  {
    text: "How often do you lose track of time and miss deadlines or appointments?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you feel overwhelmed when you have multiple things to do?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often do you forget things you were just thinking about?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How hard is it to sit down and focus when your environment is noisy or busy?",
    options: [
      { label: "Not hard at all", score: 1 },
      { label: "Slightly hard", score: 2 },
      { label: "Pretty hard", score: 3 },
      { label: "Extremely hard", score: 4 },
    ],
  },
  {
    text: "How often do you switch between tasks before finishing the first one?",
    options: [
      { label: "Almost never", score: 1 },
      { label: "Sometimes", score: 2 },
      { label: "Often", score: 3 },
      { label: "Almost always", score: 4 },
    ],
  },
  {
    text: "How often does your to-do list feel impossible to start even though it is not that long?",
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
    range: "8–14",
    label: "Mostly Intact Focus",
    body: "Your focus is mostly intact. You have some friction but your system is working. You probably notice the occasional dropped ball or wandering attention, but overall your brain finds its way back on track. Small tweaks to your environment or routine can smooth out the rough edges.",
  },
  {
    range: "15–20",
    label: "Productive in Bursts",
    body: "Your brain is fighting the system. You are productive in bursts but inconsistent. Some days everything clicks — other days the same tasks feel impossible. That inconsistency is real and exhausting. The good news: brains like yours often do their best work with the right structure, not more willpower.",
  },
  {
    range: "21–26",
    label: "High Friction",
    body: "High friction. Starting, switching, and finishing tasks costs you more energy than it should. You are likely spending a significant amount of effort just to begin — before any actual work happens. That energy debt adds up. Systems built around how your brain actually works can dramatically reduce that overhead.",
  },
  {
    range: "27–32",
    label: "Built Differently",
    body: "Your brain runs differently. Most tools were not built for how you think. There is a better way. You may have spent years trying to squeeze your thinking style into systems designed for a different kind of brain. The issue is not effort or motivation — it is fit. Approaches that honour how you naturally work tend to unlock a very different level of output.",
  },
]

function getProfile(score: number): Profile {
  if (score <= 14) return PROFILES[0]
  if (score <= 20) return PROFILES[1]
  if (score <= 26) return PROFILES[2]
  return PROFILES[3]
}

const TOOL_URL = "https://www.dayblip.com/tools/adhd-productivity-score"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ADHD Productivity Score",
      url: TOOL_URL,
      description: "8 questions. Instant results. Find out where your brain loses momentum and what kind of system actually works for how you think.",
      applicationCategory: "HealthApplication",
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
          name: "What does the ADHD Productivity Score measure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool measures how much friction your brain experiences around starting, switching, and finishing tasks. It identifies which cognitive patterns are costing you the most energy day to day — not as a clinical evaluation, but as a self-awareness exercise.",
          },
        },
        {
          "@type": "Question",
          name: "Is this tool a diagnostic instrument?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This tool is not a diagnostic instrument and does not screen for any clinical situation. It is designed to help you understand how your brain approaches tasks. For clinical evaluation speak with a qualified professional.",
          },
        },
        {
          "@type": "Question",
          name: "What happens after I complete the quiz?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "After answering all 8 questions you receive an instant score profile describing where your brain tends to lose momentum and what kind of environment or system tends to help brains that work similarly.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ADHDProductivityScorePage() {
  const [step, setStep] = useState<number>(0)          // 0 = intro, 1-8 = questions, 9 = results
  const [answers, setAnswers] = useState<number[]>([])
  const [visible, setVisible] = useState(true)          // controls fade
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const total = QUESTIONS.length
  const questionIndex = step - 1  // 0-based when step 1-8
  const isIntro = step === 0
  const isDone = step === total + 1

  const score = answers.reduce((a, b) => a + b, 0)
  const profile = isDone ? getProfile(score) : null

  // fade-out → update step → fade-in
  function advance(nextStep: number, appendScore?: number) {
    setVisible(false)
    setTimeout(() => {
      setSelectedIdx(null)
      if (appendScore !== undefined) {
        setAnswers(prev => [...prev, appendScore])
      }
      setStep(nextStep)
      setVisible(true)
      // Scroll card into view on mobile
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
    ? `My ADHD Productivity Score is "${profile.label}". Find out yours: ${TOOL_URL}`
    : `Find out how your brain handles tasks: ${TOOL_URL}`

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
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1b2a" }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{
          padding: "56px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)",
        }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1 style={{ fontSize: "clamp(26px,5vw,38px)", fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>
              ADHD Productivity Score
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16 }}>
              8 questions. Instant results. Find out where your brain loses momentum
              and what kind of system actually works for how you think.
            </p>
          </div>
        </section>

        {/* ── Quick Answer + Breadcrumb ─────────────────────────────────── */}
        <section style={{ padding: "32px 24px 0", background: "#0d1b2a" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Breadcrumb crumbs={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/finance" },
              { label: "ADHD Productivity Score" },
            ]} />
            <div style={{
              background: "#1e2d4a",
              borderLeft: "4px solid #e94560",
              borderRadius: 8,
              padding: "16px 20px",
            }}>
              <div style={{ color: "#e94560", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                Quick Answer
              </div>
              <p style={{ color: "#e2e8f0", margin: 0, lineHeight: 1.6 }}>
                Brains that struggle with starting, switching, or finishing tasks are not
                broken — they are often running on systems that were never designed for them.
                This tool maps where your brain loses momentum across 8 real-world scenarios
                and returns an instant profile so you know exactly where to focus your energy.
              </p>
            </div>
            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              There is no right or wrong score here. The goal is self-knowledge — understanding
              which parts of your workflow cost you the most energy so you can build around them,
              not against them.
            </p>
          </div>
        </section>

        {/* ── Quiz / Results ────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>

            {/* Progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                height: 4,
                background: "#0f3460",
                borderRadius: 99,
                overflow: "hidden",
              }}>
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
                <div style={{ background: "#1e2d4a", borderRadius: 14, border: "1px solid #0f3460", padding: "36px 28px", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
                  <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Ready to find out how your brain works?
                  </h2>
                  <p style={{ color: "#a8a8b3", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                    Eight quick questions about your day-to-day experience. No right answers.
                    No judgment. Just honest self-reflection — and an instant profile at the end.
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
                <div style={{ background: "#1e2d4a", borderRadius: 14, border: "1px solid #0f3460", padding: "28px 24px" }}>
                  <p style={{ color: "#a8a8b3", fontSize: 13, marginBottom: 14, fontWeight: 600 }}>
                    Question {step} of {total}
                  </p>
                  <h2 style={{ color: "#fff", fontSize: "clamp(17px,4vw,21px)", fontWeight: 700, lineHeight: 1.4, marginBottom: 24 }}>
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
                    <p style={{ color: "#f97316", fontSize: "clamp(22px,6vw,32px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>
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

                  {/* Score breakdown */}
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "1px solid #0f3460",
                    padding: "20px 24px",
                  }}>
                    <p style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                      Your answers
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {QUESTIONS.map((q, i) => {
                        const a = answers[i]
                        const opt = q.options.find(o => o.score === a)
                        return (
                          <div key={i} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 12,
                            paddingBottom: 10,
                            borderBottom: i < QUESTIONS.length - 1 ? "1px solid #0f3460" : "none",
                          }}>
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

                  {/* Share */}
                  <button
                    onClick={async () => {
                      const text = `My ADHD Productivity Score is "${profile.label}". Find out yours: ${TOOL_URL}`
                      try { await navigator.clipboard.writeText(text) }
                      catch {
                        const el = document.createElement("textarea")
                        el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el)
                      }
                      setCopied(true); setTimeout(() => setCopied(false), 3000)
                    }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", padding: "13px 20px", borderRadius: 10,
                      border: "1px solid #0f3460", background: "#1e2d4a",
                      color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer",
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
                      Noova is built for brains that work differently — a productivity layer that
                      adapts to how you actually think, not how you&apos;re supposed to think.
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
                      background: "none", border: "none",
                      color: "#a8a8b3", fontSize: 14, cursor: "pointer", textDecoration: "underline",
                    }}
                  >
                    Retake the quiz
                  </button>

                  <ShareButtons
                    text={shareText}
                    url={TOOL_URL}
                    title="ADHD Productivity Score — Find Out How Your Brain Handles Tasks"
                  />
                </div>
              )}
            </div>

            {/* ── Methodology & Attribution ─────────────────────────────── */}
            {(isIntro || isDone) && (
              <div style={{ marginTop: 40 }}>
                <MethodologyNote text="This tool is not a diagnostic instrument and does not screen for any condition. It is designed to help you understand how your brain approaches tasks. For clinical evaluation speak with a qualified professional." />
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
                  { emoji: "⏱️", title: "Procrastination Cost Calculator", desc: "The financial cost of putting things off", href: "/tools/procrastination-cost" },
                  { emoji: "😴", title: "Sleep Debt Calculator", desc: "See how much sleep you have lost and what it costs", href: "/tools/sleep-debt" },
                  { emoji: "💻", title: "Screen Time Cost Calculator", desc: "What your screen time is really costing you", href: "/tools/time-wasted" },
                  { emoji: "📚", title: "Learning Calculator", desc: "How long to master any skill at your pace", href: "/tools/learning-calculator" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
