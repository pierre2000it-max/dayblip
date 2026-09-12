"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/RelatedTools"
import Breadcrumb from "@/components/Breadcrumb"
import LastUpdated from "@/components/LastUpdated"

// ── data ──────────────────────────────────────────────────────────────────────

type EnergyKey = "full" | "steady" | "low" | "empty"

interface EnergyLevel {
  key: EnergyKey
  label: string
  sublabel: string
  emoji: string
  headline: string
  tasks: string[]
}

const ENERGY_LEVELS: EnergyLevel[] = [
  {
    key: "full",
    label: "Full Power",
    sublabel: "I am sharp, focused, and ready to work",
    emoji: "⚡",
    headline: "This is your high-output window. Protect it.",
    tasks: [
      "Deep work that requires sustained focus",
      "Writing, creating, or building something from scratch",
      "Complex decisions that need your clearest thinking",
      "Learning something new or difficult",
      "Strategy and planning for the week or month ahead",
      "Anything you have been avoiding because it feels hard",
    ],
  },
  {
    key: "steady",
    label: "Steady",
    sublabel: "I am functional but not at my peak",
    emoji: "🔋",
    headline: "You have enough to move things forward. Use it.",
    tasks: [
      "Responding to emails and messages",
      "Reviewing and editing existing work",
      "Attending meetings or calls",
      "Organizing files, notes, or your workspace",
      "Research and reading",
      "Following up on open tasks",
    ],
  },
  {
    key: "low",
    label: "Low",
    sublabel: "I am tired, scattered, or distracted",
    emoji: "🌥️",
    headline: "Low energy is not wasted time. Match the task to the state.",
    tasks: [
      "Admin tasks that do not require thinking",
      "Organizing your to-do list or planning tomorrow",
      "Watching a tutorial or listening to a podcast",
      "Tidying your physical workspace",
      "Batching small repetitive tasks",
      "Gentle movement or a short walk if possible",
    ],
  },
  {
    key: "empty",
    label: "Running on Empty",
    sublabel: "I can barely think straight right now",
    emoji: "🪫",
    headline: "Your brain is asking for a reset. Listen to it.",
    tasks: [
      "Step away from screens for 10 minutes",
      "Drink water and eat something if you have not",
      "Do one tiny task just to feel momentum",
      "Write down everything in your head to clear the mental queue",
      "Rest without guilt — recovery is part of the work",
      "Set a timer for 20 minutes and do nothing demanding",
    ],
  },
]

const TOOL_URL = "https://www.dayblip.com/tools/energy-level-task-matcher"

// ── schema ────────────────────────────────────────────────────────────────────

const schemaJson = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Energy Level Task Matcher",
      url: TOOL_URL,
      description: "Pick your energy level and get a matched task list instantly. Stop forcing deep work when your brain is not there yet.",
      applicationCategory: "ProductivityApplication",
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
          name: "What is energy-matched productivity?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Energy-matched productivity means choosing tasks based on your current mental state rather than forcing the same output regardless of how you feel. Deep creative work requires a different kind of focus than admin tasks — matching them to the right energy window reduces friction and increases actual output.",
          },
        },
        {
          "@type": "Question",
          name: "Why is rest listed as a task for Running on Empty?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Recovery is productive. Pushing through mental exhaustion typically produces lower-quality work and extends the low-energy period. Treating rest as a deliberate choice rather than a failure allows you to return to high-output work sooner.",
          },
        },
        {
          "@type": "Question",
          name: "How do I use this tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Select the energy level that most closely describes how you feel right now. The tool instantly returns a matched list of 6 task types well-suited to that state. Use it as a starting point for deciding what to work on next.",
          },
        },
      ],
    },
  ],
}

// ── component ─────────────────────────────────────────────────────────────────

export default function EnergyLevelTaskMatcherPage() {
  const [selected, setSelected] = useState<EnergyKey | null>(null)
  const [visible,  setVisible]  = useState(false)
  const [copied,   setCopied]   = useState(false)

  const activeLevel = ENERGY_LEVELS.find(e => e.key === selected) ?? null

  function handleSelect(key: EnergyKey) {
    if (selected === key) return
    // If already showing results, fade out first
    if (selected !== null) {
      setVisible(false)
      setTimeout(() => { setSelected(key); setVisible(true) }, 200)
    } else {
      setSelected(key)
      setTimeout(() => setVisible(true), 30)
    }
  }

  function handleReset() {
    setVisible(false)
    setTimeout(() => setSelected(null), 200)
  }

  async function handleShare() {
    if (!activeLevel) return
    const text = `I am running at "${activeLevel.label}" today. Here is what Noova matched me with: ${TOOL_URL}`
    try { await navigator.clipboard.writeText(text) }
    catch {
      const el = document.createElement("textarea")
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand("copy"); document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const shareText = activeLevel
    ? `I am running at "${activeLevel.label}" today. Here is what Noova matched me with: ${TOOL_URL}`
    : `Match your work to how you actually feel right now: ${TOOL_URL}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <style>{`
        .energy-card {
          width: 100%;
          text-align: left;
          padding: 20px 20px;
          border-radius: 12px;
          border: 2px solid #0f3460;
          background: #0d1b2a;
          color: #ffffff;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s, transform 0.12s;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .energy-card:hover {
          border-color: #f97316;
          background: #1a1a2e;
        }
        .energy-card.active {
          border-color: #f97316;
          background: #1e2d4a;
        }
        .energy-card:active {
          transform: scale(0.98);
        }
        .results-panel {
          transition: opacity 0.22s ease, transform 0.22s ease;
        }
        .results-panel.hidden {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
        }
        .results-panel.shown {
          opacity: 1;
          transform: translateY(0);
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
              Energy Level Task Matcher
            </h1>
            <p style={{ color: "#a8a8b3", fontSize: 16, lineHeight: 1.6 }}>
              Stop forcing deep work when your brain is not there yet.
              Pick where you are right now and get a matched task list instantly.
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
              { label: "Energy Level Task Matcher" },
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
                Not all work requires the same brain. Deep creative thinking needs full cognitive
                capacity. Admin and routine tasks can be done on low energy. Matching the task to
                your current state — instead of fighting it — means you get real output at every
                level, not just when you are at your peak.
              </p>
            </div>

            <p style={{ color: "#a8a8b3", fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>
              Your energy is not constant throughout the day and that is completely normal. The
              most effective approach is not to push through every state with the same tasks —
              it is to route your work to where your brain actually is.
            </p>
          </div>
        </section>

        {/* ── Tool ──────────────────────────────────────────────────────── */}
        <section style={{ padding: "32px 24px 64px", background: "#16213e" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>

            {/* ── Step 1: Energy selection ──────────────────────────────── */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 6,
              }}>
                How are you feeling right now?
              </h2>
              <p style={{ color: "#a8a8b3", fontSize: 14, marginBottom: 20 }}>
                Pick the one that fits closest — no overthinking it.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ENERGY_LEVELS.map(level => (
                  <button
                    key={level.key}
                    className={`energy-card${selected === level.key ? " active" : ""}`}
                    onClick={() => handleSelect(level.key)}
                  >
                    {/* Emoji */}
                    <span style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>
                      {level.emoji}
                    </span>

                    {/* Text */}
                    <span style={{ flex: 1 }}>
                      <span style={{
                        display: "block",
                        fontWeight: 700,
                        fontSize: 16,
                        color: selected === level.key ? "#f97316" : "#fff",
                        marginBottom: 2,
                      }}>
                        {level.label}
                      </span>
                      <span style={{ display: "block", fontSize: 13, color: "#a8a8b3", lineHeight: 1.4 }}>
                        {level.sublabel}
                      </span>
                    </span>

                    {/* Active indicator */}
                    {selected === level.key && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        style={{ width: 20, height: 20, flexShrink: 0 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 2: Results ───────────────────────────────────────── */}
            <div
              className={`results-panel ${selected && visible ? "shown" : "hidden"}`}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
              aria-live="polite"
            >
              {activeLevel && (
                <>
                  {/* Headline */}
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "2px solid #f97316",
                    padding: "24px",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}>
                      <span style={{ fontSize: 28 }}>{activeLevel.emoji}</span>
                      <span style={{ color: "#a8a8b3", fontSize: 13, fontWeight: 600 }}>
                        Matched to: <strong style={{ color: "#fff" }}>{activeLevel.label}</strong>
                      </span>
                    </div>
                    <p style={{
                      color: "#f97316",
                      fontSize: "clamp(17px,4vw,21px)",
                      fontWeight: 800,
                      lineHeight: 1.3,
                      margin: 0,
                    }}>
                      {activeLevel.headline}
                    </p>
                  </div>

                  {/* Task list */}
                  <div style={{
                    background: "#1e2d4a",
                    borderRadius: 14,
                    border: "1px solid #0f3460",
                    padding: "24px",
                  }}>
                    <p style={{
                      color: "#a8a8b3",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      marginBottom: 16,
                    }}>
                      Recommended for this state
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {activeLevel.tasks.map((task, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                          }}
                        >
                          <span style={{
                            color: "#f97316",
                            fontSize: 16,
                            lineHeight: 1.5,
                            flexShrink: 0,
                            marginTop: 1,
                          }}>
                            ◆
                          </span>
                          <span style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.55 }}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Share result */}
                  <button
                    onClick={handleShare}
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
                        Share your match
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
                      Noova helps you capture, sort, and act on your thoughts at any energy level —
                      so nothing falls through the cracks whether you are at full power or running
                      on empty.
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

                  {/* Start over */}
                  <button
                    onClick={handleReset}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#a8a8b3",
                      fontSize: 14,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    ← Pick a different energy level
                  </button>

                  <ShareButtons
                    text={shareText}
                    url={TOOL_URL}
                    title="Energy Level Task Matcher — Match Your Work to How You Actually Feel"
                  />
                </>
              )}
            </div>

            {/* ── Attribution ───────────────────────────────────────────── */}
            <div style={{ marginTop: selected ? 40 : 32 }}>
              <p style={{ color: "#a8a8b3", fontSize: 13, fontStyle: "italic" }}>
                Powered by Noova — built for brains that work differently.
              </p>
              <LastUpdated date="September 2026" />
            </div>

            {/* ── Related Tools ─────────────────────────────────────────── */}
            {selected && visible && (
              <div style={{ marginTop: 40 }}>
                <RelatedTools tools={[
                  { emoji: "🧠", title: "ADHD Productivity Score",          desc: "Find out where your brain loses momentum",             href: "/tools/adhd-productivity-score" },
                  { emoji: "🌀", title: "Brain Chaos Calculator",            desc: "How loud is your head on a typical day?",             href: "/tools/brain-chaos-calculator" },
                  { emoji: "😴", title: "Sleep Debt Calculator",             desc: "See how much sleep you have lost and its cost",        href: "/tools/sleep-debt" },
                  { emoji: "⏱️", title: "Procrastination Cost Calculator",  desc: "The financial cost of putting things off",             href: "/tools/procrastination-cost" },
                ]} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
  )
}
