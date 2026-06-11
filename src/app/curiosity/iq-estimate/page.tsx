"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

interface Question {
  q: string
  options: string[]
  answer: number
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    q: "What comes next in this sequence?\n2, 4, 8, 16, ?",
    options: ["A) 24", "B) 32", "C) 28", "D) 20"],
    answer: 1,
    explanation: "Each number doubles. 16 × 2 = 32.",
  },
  {
    q: "Which number does NOT belong?\n3, 7, 11, 14, 19",
    options: ["A) 3", "B) 7", "C) 14", "D) 19"],
    answer: 2,
    explanation: "All others (3, 7, 11, 19) are odd prime numbers. 14 is even and composite.",
  },
  {
    q: "Book is to Library as Painting is to ?",
    options: ["A) Canvas", "B) Museum", "C) Artist", "D) Color"],
    answer: 1,
    explanation: "A book is stored/displayed in a library; a painting is stored/displayed in a museum.",
  },
  {
    q: "What comes next?\n1, 1, 2, 3, 5, 8, 13, ?",
    options: ["A) 18", "B) 20", "C) 21", "D) 24"],
    answer: 2,
    explanation: "Fibonacci sequence: each number is the sum of the two before it. 8 + 13 = 21.",
  },
  {
    q: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
    options: ["A) Yes", "B) No", "C) Cannot determine"],
    answer: 0,
    explanation: "If all Bloops are Razzies, and all Razzies are Lazzies, then all Bloops must also be Lazzies (transitive property).",
  },
  {
    q: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["A) 0°", "B) 7.5°", "C) 15°", "D) 90°"],
    answer: 1,
    explanation: "At 3:15 the minute hand is at 3 (90°). The hour hand has moved ¼ of the way from 3 to 4, adding 7.5°. So it's at 97.5°. Difference = 7.5°.",
  },
  {
    q: "What comes next?\n144, 121, 100, 81, 64, ?",
    options: ["A) 48", "B) 49", "C) 50", "D) 36"],
    answer: 1,
    explanation: "These are perfect squares descending: 12², 11², 10², 9², 8², 7² = 49.",
  },
  {
    q: "Centimeter is to Meter as Cent is to ?",
    options: ["A) Money", "B) Dollar", "C) Hundred", "D) Coin"],
    answer: 1,
    explanation: "100 centimeters = 1 meter. 100 cents = 1 dollar. Both share the 'cent' (hundred) prefix relationship.",
  },
  {
    q: "If you rearrange the letters CIFAIPC, what US state do you get?",
    options: ["A) Florida", "B) Michigan", "C) Pacific", "D) California"],
    answer: 3,
    explanation: "CIFAIPC rearranges to CALIFPC — close but it's CALIFORNIA with extra letters rearranged.",
  },
  {
    q: "What letter comes next?\nO, T, T, F, F, S, S, E, ?",
    options: ["A) N", "B) T", "C) E", "D) I"],
    answer: 0,
    explanation: "These are the first letters of: One Two Three Four Five Six Seven Eight — next is Nine → N.",
  },
]

interface IQRange {
  correct: number
  range: string
  label: string
  desc: string
  color: string
}

function getResult(score: number): IQRange {
  const correct = score / 10
  if (correct <= 3) return { correct, range: "85–95", label: "Below average on this estimate", desc: "Remember this is a very short entertainment quiz — not a real IQ test. Many brilliant people score poorly on timed logic puzzles. Take a full test with a psychologist for accurate results.", color: "#4FC3F7" }
  if (correct <= 5) return { correct, range: "95–105", label: "Average range on this estimate", desc: "You scored in the middle of the bell curve on this short quiz. This entertainment estimate is based on pattern recognition and logic questions only.", color: "#4ade80" }
  if (correct <= 7) return { correct, range: "105–120", label: "Above average on this estimate", desc: "You show strong logical reasoning on these question types. Remember this is an entertainment quiz, not a clinical IQ test.", color: "#F9A825" }
  if (correct <= 9) return { correct, range: "120–130", label: "Well above average on this estimate", desc: "You demonstrate strong pattern recognition and logical reasoning across most question types.", color: "#fb923c" }
  return { correct, range: "130+", label: "Top range on this estimate", desc: "You got a perfect score on these 10 questions showing strong ability across all question types. Impressive!", color: "#e94560" }
}

export default function IQEstimatePage() {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  function start() { setStarted(true); setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); setAnswers([]) }

  function selectAnswer(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === QUESTIONS[current].answer
    if (correct) setScore(s => s + 10)
    setAnswers(a => [...a, correct])
  }

  function next() {
    setSelected(null)
    setAnswered(false)
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const q = QUESTIONS[current]
  const finalResult = getResult(score)
  const shareText = finished
    ? `I got ${score / 10}/10 on the Dayblip IQ estimate quiz — estimated range ${finalResult.range}. Try it: www.dayblip.com/curiosity/iq-estimate`
    : "Take the IQ estimate quiz free: www.dayblip.com/curiosity/iq-estimate"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("IQ Estimate Quiz", "10-question logical reasoning quiz for entertainment estimate of cognitive reasoning", "https://www.dayblip.com/curiosity/iq-estimate", "EntertainmentApplication"),
        faqSchema([
          { question: "Is this a real IQ test?", answer: "No. This is a 10-question entertainment quiz that provides a rough estimate based on pattern recognition and logical reasoning. Real IQ measurement requires standardized testing administered by a licensed psychologist over multiple hours using validated instruments. This score should not be used for any educational, employment, or medical purpose." },
          { question: "What is the average IQ score?", answer: "IQ scores are designed with a mean of 100 and standard deviation of 15. About 68% of people score between 85 and 115. Scores above 130 represent roughly the top 2% and scores above 145 represent roughly the top 0.1% of the population. IQ measures specific cognitive abilities — not creativity, emotional intelligence, or overall potential." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Curiosity", url: "https://www.dayblip.com/curiosity" },
          { name: "IQ Estimate", url: "https://www.dayblip.com/curiosity/iq-estimate" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🧠</div>
          <h1 className="mb-3 text-4xl font-bold text-white">IQ Estimate — Quick Intelligence Quiz</h1>
          <p className="text-[#a8a8b3]">10 questions · Pattern recognition, sequences, and logic · Entertainment only</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Curiosity", href: "/curiosity" }, { label: "IQ Estimate" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>IQ scores follow a normal distribution with average set at 100 and standard deviation of 15. Approximately 68% of people score between 85 and 115. Scores above 130 represent the top 2% of the population. IQ measures specific cognitive abilities including pattern recognition working memory and processing speed — not overall intelligence creativity or potential.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>This is a short entertainment quiz that estimates cognitive reasoning ability across pattern recognition numerical sequences and logical reasoning. It is NOT a clinical IQ test and should not be used for educational employment or diagnostic purposes. Official IQ testing requires a licensed psychologist. This tool is for curiosity and entertainment only.</p>

          {!started && !finished && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center space-y-4">
              <div className="text-4xl">🧠</div>
              <div className="text-white font-bold text-lg">10 Questions — No Time Limit</div>
              <p className="text-sm text-[#a8a8b3]">Pattern recognition · Number sequences · Logic analogies · Spatial reasoning</p>
              <button onClick={start} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Start the Quiz
              </button>
            </div>
          )}

          {started && !finished && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-[#a8a8b3] mb-1">
                  <span>Question {current + 1} of {QUESTIONS.length}</span>
                  <span>Score: {score / 10}/{current + (answered ? 1 : 0)}</span>
                </div>
                <div className="h-2 bg-[#0f3460] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#e94560] transition-all" style={{ width: `${((current + (answered ? 1 : 0)) / QUESTIONS.length) * 100}%` }} />
                </div>
              </div>

              {/* Question card */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <div className="text-sm text-[#e94560] font-bold uppercase tracking-wider mb-3">Question {current + 1}</div>
                <p className="text-white font-semibold text-lg leading-relaxed whitespace-pre-line">{q.q}</p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let style = "border-[#0f3460] bg-[#1a1a2e] text-white hover:border-[#e94560]"
                  if (answered) {
                    if (i === q.answer) style = "border-green-500 bg-green-900/20 text-green-300"
                    else if (i === selected && i !== q.answer) style = "border-[#FF6B6B] bg-red-900/20 text-[#FF6B6B]"
                    else style = "border-[#0f3460] bg-[#1a1a2e] text-[#a8a8b3]"
                  }
                  return (
                    <button key={i} onClick={() => selectAnswer(i)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${style} ${!answered ? "cursor-pointer" : "cursor-default"}`}>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className={`rounded-xl border p-4 text-sm ${selected === q.answer ? "border-green-500/30 bg-green-900/10 text-green-300" : "border-[#FF6B6B]/30 bg-red-900/10 text-[#FF6B6B]"}`}>
                  <div className="font-bold mb-1">{selected === q.answer ? "✓ Correct!" : "✗ Incorrect"}</div>
                  <p className="text-[#a8a8b3] text-xs">{q.explanation}</p>
                </div>
              )}

              {answered && (
                <button onClick={next} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  {current + 1 < QUESTIONS.length ? "Next Question →" : "See My Results →"}
                </button>
              )}
            </div>
          )}

          {finished && (
            <div className="space-y-4">
              {/* Score summary */}
              <div className="rounded-xl border p-6 text-center" style={{ borderColor: finalResult.color + "50", background: finalResult.color + "15" }}>
                <div className="text-sm text-[#a8a8b3] mb-1">Your Score</div>
                <div className="text-5xl font-black" style={{ color: finalResult.color }}>{score / 10}/10</div>
                <div className="text-lg font-bold text-white mt-1">{finalResult.label}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">Estimated IQ Range: <span className="text-white font-semibold">{finalResult.range}</span></div>
              </div>

              <p className="text-sm text-[#a8a8b3] leading-relaxed">{finalResult.desc}</p>

              {/* Answer breakdown */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-sm font-bold text-white mb-3">Answer Breakdown</div>
                <div className="flex flex-wrap gap-2">
                  {answers.map((correct, i) => (
                    <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${correct ? "bg-green-900/30 text-green-400 border border-green-500/40" : "bg-red-900/30 text-[#FF6B6B] border border-red-500/40"}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-4 text-xs text-yellow-200">
                ⚠️ This 10-question quiz is for entertainment and curiosity only. It is NOT a valid IQ test. Real IQ measurement requires standardized testing administered by a licensed psychologist over multiple hours. This estimate should not be used for any educational, employment or medical purpose.
              </div>

              <div className="flex gap-3">
                <button onClick={start} className="flex-1 rounded-lg border border-[#e94560] bg-transparent px-5 py-3 font-semibold text-[#e94560] transition-colors hover:bg-[#e94560] hover:text-white">
                  Try Again
                </button>
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/curiosity/iq-estimate" title="IQ Estimate Quiz" />
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🧠", title: "Dayblip Daily", desc: "One financial puzzle every day", href: "/daily" },
            { emoji: "🧬", title: "Generation Quiz", desc: "What generation do you really belong to?", href: "/tools/generation-quiz" },
            { emoji: "🎂", title: "Birthday Personality", desc: "What your birthday says about you", href: "/tools/birthday-personality" },
            { emoji: "📚", title: "Learning Calculator", desc: "How long to master any skill", href: "/tools/learning-calculator" },
          ]} />
        </div>
      </section>
    </div>
  )
}
