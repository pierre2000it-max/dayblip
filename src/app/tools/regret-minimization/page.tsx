"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

const QUESTIONS = [
  "If you do this and it WORKS OUT, how happy will 80-year-old you be?",
  "If you do this and it FAILS, how bad will 80-year-old you feel? (Remember — you tried. Failure teaches.)",
  "If you do NOT do this, how much will 80-year-old you wonder 'what if'?",
  "How REVERSIBLE is this decision?",
  "In 10 years will this decision even matter significantly?",
]
const WEIGHTS = [0.3, 0.15, 0.3, 0.15, 0.1]

function computeScore(q: number[]): number {
  const raw = q[0] * WEIGHTS[0] + q[1] * WEIGHTS[1] + q[2] * WEIGHTS[2] + q[3] * WEIGHTS[3] + q[4] * WEIGHTS[4]
  return Math.round((raw / 10) * 100)
}

function interpret(score: number) {
  if (score >= 70) return { text: "80-year-old you will very likely regret NOT doing this. The Bezos framework strongly suggests taking action.", color: "#4ade80" }
  if (score >= 40) return { text: "This is genuinely uncertain. Focus on reversibility — if you can undo it easily, lean toward trying.", color: "#F9A825" }
  return { text: "80-year-old you may be at peace with not pursuing this right now. The timing or conditions may not be right.", color: "#4FC3F7" }
}

export default function RegretMinimizationPage() {
  const [age, setAge] = useState("30")
  const [decision, setDecision] = useState("")
  const [q, setQ] = useState([5, 5, 5, 5, 5])
  const [result, setResult] = useState<{ score: number } | null>(null)

  function runCalc(push = true, qv = q) {
    const score = computeScore(qv)
    setResult({ score })
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?score=${score}&q1=${qv[0]}&q2=${qv[1]}&q3=${qv[2]}&q4=${qv[3]}&q5=${qv[4]}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    if (p.get("q1")) {
      const qv = [1, 2, 3, 4, 5].map(i => Number(p.get(`q${i}`) ?? 5))
      setQ(qv)
      setResult({ score: p.get("score") ? Number(p.get("score")) : computeScore(qv) })
    }
  }, [])

  const interp = result ? interpret(result.score) : null
  const maxIdx = q.indexOf(Math.max(...q))

  const shareUrl = result ? `https://www.dayblip.com/tools/regret-minimization?score=${result.score}` : ""
  const shareText = result
    ? `I used Jeff Bezos's Regret Minimization Framework for my big decision.\nMy regret risk score: ${result.score}/100`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Will You Regret This Decision?</h1>
          <p className="text-[#a8a8b3]">Use Jeff Bezos&apos;s framework to evaluate any major life decision</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="rounded-xl border border-[#e94560]/50 bg-[#1a1a2e] p-5 text-sm text-white">
            Jeff Bezos used this framework to decide to leave his Wall Street job and start Amazon. He imagined himself at 80 years old looking back at his life.
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">Your current age</span>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">Your decision</span>
            <textarea value={decision} onChange={e => setDecision(e.target.value)} rows={3} placeholder="Describe what you are considering... e.g. Starting my own business, Moving to another city, Changing careers, Going back to school" className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          {QUESTIONS.map((qt, i) => (
            <label key={i} className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
              <span className="text-sm font-medium text-white">{i + 1}. {qt}</span>
              <input type="range" min={1} max={10} value={q[i]} onChange={e => { const n = [...q]; n[i] = Number(e.target.value); setQ(n) }} className="accent-[#e94560]" />
              <span className="text-right text-sm font-bold text-[#e94560]">{q[i]}/10</span>
            </label>
          ))}

          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Regret Score
          </button>

          {result && interp && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-8 text-center">
                <div className="text-6xl font-black" style={{ color: interp.color }}>{result.score}<span className="text-2xl text-[#a8a8b3]">/100</span></div>
                <div className="mt-1 text-sm text-[#a8a8b3]">Regret Risk Score</div>
              </div>

              <div className="rounded-xl border bg-[#1a1a2e] p-6 text-center text-white" style={{ borderColor: interp.color }}>
                {interp.text}
              </div>

              <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-6 text-sm text-white">
                <div className="font-bold text-[#F9A825]">Your biggest factor:</div>
                <p className="mt-1">{QUESTIONS[maxIdx]}</p>
                <p className="mt-1 text-[#a8a8b3]">You scored this {q[maxIdx]}/10.</p>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <p className="text-lg font-bold italic">&ldquo;I knew that when I was 80 I would never regret having tried this. I would only regret not trying.&rdquo;</p>
                <p className="mt-2 text-sm text-[#a8a8b3]">— Jeff Bezos on starting Amazon</p>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="Regret Minimization Calculator" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
