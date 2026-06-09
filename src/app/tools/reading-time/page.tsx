"use client"
import { useState, useMemo } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

function fmtTime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${Math.round(totalSeconds)} seconds`
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.round(totalSeconds % 60)
  if (mins < 60) return secs > 0 ? `${mins} min ${secs} sec` : `${mins} minutes`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return remMins > 0 ? `${hrs} hr ${remMins} min` : `${hrs} hours`
}

const SPEEDS = [
  { label: "Slow (150 wpm)", wpm: 150 },
  { label: "Average (238 wpm)", wpm: 238 },
  { label: "Fast (350 wpm)", wpm: 350 },
  { label: "Speed reader (500 wpm)", wpm: 500 },
]

const BOOKS = [
  { label: "Short story", words: 5000 },
  { label: "Novella", words: 30000 },
  { label: "Novel", words: 90000 },
  { label: "Non-fiction", words: 65000 },
]

export default function ReadingTimePage() {
  const [mode, setMode] = useState<"text" | "count">("text")
  const [text, setText] = useState("")
  const [wordCount, setWordCount] = useState("1000")
  const [speed, setSpeed] = useState(238)
  const [customWpm, setCustomWpm] = useState("300")
  const [speedChoice, setSpeedChoice] = useState("238")

  const activeWpm = speedChoice === "custom" ? parseInt(customWpm) || 238 : parseInt(speedChoice)

  const stats = useMemo(() => {
    if (!text.trim()) return null
    const words = text.trim().split(/\s+/).filter(Boolean)
    const chars = text.replace(/\s/g, "").length
    const sentences = (text.match(/[.!?]+/g) || []).length || 1
    const avgWordLen = words.length ? chars / words.length : 0
    return { words: words.length, chars: text.length, sentences, avgWordLen }
  }, [text])

  const countWords = mode === "text" ? (stats?.words ?? 0) : parseInt(wordCount) || 0
  const activeWpmFinal = mode === "text" ? speed : activeWpm

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Reading Time Calculator", "Calculate how long it takes to read any text or article based on word count and reading speed", "https://www.dayblip.com/tools/reading-time", "UtilitiesApplication"),
        faqSchema([
          { question: "How long does it take to read 1000 words?", answer: "At the average adult reading speed of 238 words per minute 1000 words takes approximately 4 minutes and 12 seconds to read. At a slow reading speed (150 wpm) it takes about 6 minutes and 40 seconds. At a fast reading speed (350 wpm) about 2 minutes and 51 seconds. Technical content is typically read 20-30% slower than general text." },
          { question: "How long does it take to read a 300-page book?", answer: "A 300-page book contains approximately 75000 words. At average reading speed (238 wpm) this takes approximately 5 hours and 15 minutes. Reading one hour per day you would finish in about 5 days. Most non-fiction bestsellers range from 60000 to 80000 words. Fiction novels average 80000 to 100000 words." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "Reading Time Calculator", url: "https://www.dayblip.com/tools/reading-time" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">📖</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Reading Time Calculator — How Long Will This Take to Read?</h1>
          <p className="text-[#a8a8b3]">Paste text or enter word count to estimate reading time at any speed</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Reading Time Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>The average adult reads approximately 238 words per minute for non-fiction and 260 words per minute for fiction. A 1000-word blog article takes about 4 minutes to read. A 300-page book with approximately 75000 words takes about 5.3 hours. A New York Times article averages 800 words — about 3.4 minutes. Speed readers achieve 400–700 words per minute.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Reading time estimates help writers set reader expectations, bloggers optimize article length, and readers plan their time. Average reading speeds vary significantly by content type — technical documents and academic papers are read more slowly than fiction or casual articles. This calculator estimates reading time from word count or pasted text and adjusts for different reading speed profiles.</p>

          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[#0f3460]">
            {(["text", "count"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${mode === m ? "bg-[#e94560] text-white" : "bg-[#1a1a2e] text-[#a8a8b3] hover:text-white"}`}>
                {m === "text" ? "Paste Text" : "Enter Word Count"}
              </button>
            ))}
          </div>

          {mode === "text" ? (
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={8}
                placeholder="Paste any text here to calculate reading time..."
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white text-sm focus:border-[#e94560] focus:outline-none resize-none"
              />

              {stats && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: "Words", value: stats.words.toLocaleString() },
                    { label: "Characters", value: stats.chars.toLocaleString() },
                    { label: "Sentences", value: stats.sentences.toLocaleString() },
                    { label: "Avg word length", value: `${stats.avgWordLen.toFixed(1)} chars` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3 text-center">
                      <div className="text-xs text-[#a8a8b3] mb-1">{label}</div>
                      <div className="font-bold text-white text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {stats && stats.words > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                  <h2 className="font-bold text-white text-sm">Reading time at different speeds:</h2>
                  {SPEEDS.map(s => (
                    <div key={s.wpm} onClick={() => setSpeed(s.wpm)}
                      className={`flex justify-between items-center rounded-lg border px-4 py-3 cursor-pointer transition-colors ${speed === s.wpm ? "border-[#e94560] bg-[#e94560]/10" : "border-[#0f3460] bg-[#16213e] hover:border-[#e94560]/50"}`}>
                      <span className="text-sm text-[#a8a8b3]">{s.label}</span>
                      <span className={`font-bold text-sm ${speed === s.wpm ? "text-[#e94560]" : "text-white"}`}>
                        {fmtTime((stats.words / s.wpm) * 60)}
                        {speed === s.wpm && " ✅"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Word count</span>
                  <input type="number" value={wordCount} onChange={e => setWordCount(e.target.value)} min={1}
                    className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Reading speed</span>
                  <select value={speedChoice} onChange={e => setSpeedChoice(e.target.value)}
                    className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-3 py-2.5 text-white text-sm focus:border-[#e94560] focus:outline-none">
                    {SPEEDS.map(s => <option key={s.wpm} value={String(s.wpm)}>{s.label}</option>)}
                    <option value="custom">Custom (enter wpm)</option>
                  </select>
                </label>
              </div>
              {speedChoice === "custom" && (
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-white">Your WPM</span>
                  <input type="number" value={customWpm} onChange={e => setCustomWpm(e.target.value)} min={50} max={2000}
                    className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
                </label>
              )}

              {countWords > 0 && activeWpmFinal > 0 && (
                <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
                  <div className="text-4xl font-black text-[#e94560]">{fmtTime((countWords / activeWpmFinal) * 60)}</div>
                  <div className="text-sm text-[#a8a8b3] mt-2">at {activeWpmFinal} words per minute</div>
                  <div className="text-sm text-[#a8a8b3]">{parseInt(wordCount).toLocaleString()} words</div>
                </div>
              )}
            </div>
          )}

          {/* Book comparisons */}
          {countWords > 0 && activeWpmFinal > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <h2 className="font-bold text-white mb-3">Common Book Reading Times</h2>
              <div className="space-y-2">
                {BOOKS.map(b => (
                  <div key={b.label} className="flex justify-between items-center py-2 border-b border-[#0f3460] last:border-0">
                    <div>
                      <span className="text-sm font-semibold text-white">{b.label}</span>
                      <span className="text-xs text-[#a8a8b3] ml-2">({b.words.toLocaleString()} words)</span>
                    </div>
                    <span className="text-sm font-bold text-[#F9A825]">{fmtTime((b.words / activeWpmFinal) * 60)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#a8a8b3] mt-2">Based on your selected reading speed of {activeWpmFinal} wpm.</p>
            </div>
          )}

          <ShareButtons
            text="A 1000-word article takes 4 minutes to read at average speed. Free reading time calculator: www.dayblip.com/tools/reading-time"
            url="https://www.dayblip.com/tools/reading-time"
            title="Reading Time Calculator"
          />

          <RelatedTools tools={[
            { emoji: "📚", title: "Learning Calculator", desc: "How long to master any skill", href: "/tools/learning-calculator" },
            { emoji: "⏰", title: "Procrastination Cost", desc: "What waiting is costing you", href: "/tools/procrastination-cost" },
            { emoji: "💻", title: "Screen Time Calculator", desc: "What your screen time costs you", href: "/tools/time-wasted" },
            { emoji: "🔢", title: "Unit Converter", desc: "Convert any unit instantly", href: "/tools/unit-converter" },
          ]} />
        </div>
      </section>
    </div>
  )
}
