"use client"
import { useState } from "react"

const tools = [
  { emoji: "💹", name: "Compound Interest", slug: "compound-interest", height: 480, use: "Math, economics: demonstrate exponential growth" },
  { emoji: "🏠", name: "Mortgage Calculator", slug: "mortgage", height: 460, use: "Personal finance: real-world loan math" },
  { emoji: "💵", name: "Take Home Pay", slug: "take-home-pay", height: 460, use: "Civics, economics: tax system basics" },
  { emoji: "💳", name: "Debt Payoff", slug: "debt-payoff", height: 420, use: "Personal finance: cost of credit card debt" },
  { emoji: "🎂", name: "Age Calculator", slug: "age-calculator", height: 400, use: "Math: date arithmetic, elapsed time" },
  { emoji: "🗓️", name: "Born In Year Facts", slug: "born-in", height: 440, use: "History, social studies: historical context" },
  { emoji: "🎓", name: "GPA Calculator", slug: "gpa-calculator", height: 520, use: "Academic advising: track and calculate student GPA. No student accounts required." },
  { emoji: "📊", name: "Percentage Calculator", slug: "percentage-calculator", height: 440, use: "Math class: calculate any percentage — three calculation types. No signup needed." },
]

const linkedTools: { emoji: string; name: string; href: string; use: string }[] = []

function EmbedCodeBlock({ slug, height }: { slug: string; height: number }) {
  const [copied, setCopied] = useState(false)
  const code = `<iframe src="https://www.dayblip.com/embed/${slug}" width="100%" height="${height}" frameborder="0" style="border-radius:8px;border:1px solid #1e2d4a;" loading="lazy"></iframe>`

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
        <button onClick={copy} style={{ background: copied ? "#22c55e" : "#e94560", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {copied ? "Copied! ✓" : "Copy Code"}
        </button>
      </div>
      <pre style={{ background: "#0d1b2a", border: "1px solid #1e2d4a", borderRadius: 6, padding: 12, color: "#a8a8b3", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
        {code}
      </pre>
    </div>
  )
}

export default function ForEducatorsPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
        🎓 Free Financial Tools for Educators
      </h1>
      <p style={{ color: "#a8a8b3", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        Dayblip provides free interactive calculators perfect for personal finance, economics, math and civics classrooms. No student accounts needed. No ads in embed mode. Works on any school website, Google Classroom or LMS.
      </p>

      <div style={{ background: "#16213e", borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Why Dayblip for Education</h2>
        {[
          "✅ No student login or account required",
          "✅ No advertising shown in embed mode",
          "✅ Works in iframes on any LMS or school site",
          "✅ Mobile responsive — works on phones and tablets",
          "✅ Free forever — no licensing fees",
        ].map(item => (
          <div key={item} style={{ fontSize: 13, color: "#a8a8b3", marginBottom: 6 }}>{item}</div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Best Tools for the Classroom</h2>
      <div style={{ display: "grid", gap: 20 }}>
        {tools.map(t => (
          <div key={t.slug} style={{ background: "#16213e", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{t.emoji} {t.name}</div>
            <div style={{ fontSize: 12, color: "#e94560", marginBottom: 8 }}>Best for: {t.use}</div>
            <EmbedCodeBlock slug={t.slug} height={t.height} />
          </div>
        ))}
      </div>

      {linkedTools.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {linkedTools.map(t => (
            <div key={t.href} style={{ background: "#16213e", borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{t.emoji} {t.name}</div>
              <div style={{ fontSize: 12, color: "#e94560", marginBottom: 8 }}>Best for: {t.use}</div>
              <a href={t.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#4FC3F7", textDecoration: "none", fontWeight: 600 }}>
                Open tool → {t.href.replace("https://www.dayblip.com", "dayblip.com")}
              </a>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, padding: 16, background: "#16213e", borderRadius: 8, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "#a8a8b3", marginBottom: 8 }}>Browse all embeddable tools</div>
        <a
          href="https://www.dayblip.com/embed"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#e94560", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
        >
          www.dayblip.com/embed →
        </a>
      </div>
    </div>
  )
}
