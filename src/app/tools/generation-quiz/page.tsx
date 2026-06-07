"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"

type Gen = "Z" | "M" | "X" | "B"

interface Q { q: string; a: { text: string; gen: Gen }[] }

const QUESTIONS: Q[] = [
  { q: "How do you prefer to communicate?", a: [{ text: "Text only", gen: "Z" }, { text: "Text or DM", gen: "M" }, { text: "Email or call", gen: "X" }, { text: "Call or in person", gen: "B" }] },
  { q: "Where do you get your news?", a: [{ text: "TikTok or Instagram", gen: "Z" }, { text: "Twitter/X or online", gen: "M" }, { text: "Cable TV or podcasts", gen: "X" }, { text: "Newspaper or TV news", gen: "B" }] },
  { q: "What is your relationship with work?", a: [{ text: "Work to live, side hustle", gen: "Z" }, { text: "Work-life balance is everything", gen: "M" }, { text: "Work hard play hard", gen: "X" }, { text: "Company loyalty above all", gen: "B" }] },
  { q: "How do you pay for things?", a: [{ text: "Phone tap always", gen: "Z" }, { text: "Card or phone", gen: "M" }, { text: "Card preferred", gen: "X" }, { text: "Cash is fine", gen: "B" }] },
  { q: "Did you have a MySpace page?", a: [{ text: "MySpace what?", gen: "Z" }, { text: "Obviously yes", gen: "M" }, { text: "Vaguely remember it", gen: "X" }, { text: "Never used it", gen: "B" }] },
  { q: "Your retirement plan?", a: [{ text: "What is retirement?", gen: "Z" }, { text: "FIRE by 45 hopefully", gen: "M" }, { text: "60 sounds good", gen: "X" }, { text: "Traditional 65", gen: "B" }] },
  { q: "Dial-up internet memories?", a: [{ text: "What is dial-up?", gen: "Z" }, { text: "The sound haunts me", gen: "M" }, { text: "We upgraded fast", gen: "X" }, { text: "We got internet late", gen: "B" }] },
  { q: "Favorite entertainment?", a: [{ text: "Short video content", gen: "Z" }, { text: "Streaming binge", gen: "M" }, { text: "Cable + streaming mix", gen: "X" }, { text: "Cable TV or movies", gen: "B" }] },
  { q: "How do you handle photos?", a: [{ text: "Story then delete", gen: "Z" }, { text: "Instagram grid curated", gen: "M" }, { text: "Facebook albums", gen: "X" }, { text: "Physical photo albums", gen: "B" }] },
  { q: "Your take on hustle culture?", a: [{ text: "Against it completely", gen: "Z" }, { text: "Believe in it but burnt out", gen: "M" }, { text: "Did it, have regrets", gen: "X" }, { text: "Hard work always pays", gen: "B" }] },
]

const GEN_NAMES: Record<Gen, string> = { Z: "Gen Z", M: "Millennial", X: "Gen X", B: "Boomer" }

const GEN_INFO: Record<Gen, { years: string; famous: string; moments: string; tech: string; traits: string }> = {
  Z: { years: "1997–2012", famous: "Billie Eilish, Greta Thunberg, Zendaya", moments: "COVID-19, social media everywhere, climate activism", tech: "Smartphones, TikTok, streaming from birth", traits: "Digital native · Pragmatic · Socially conscious" },
  M: { years: "1981–1996", famous: "Mark Zuckerberg, Serena Williams, LeBron James", moments: "9/11, the rise of the internet, the Great Recession", tech: "Dial-up to broadband, MySpace, the first iPhone", traits: "Adaptable · Idealistic · Tech-fluent" },
  X: { years: "1965–1980", famous: "Elon Musk, Jennifer Lopez, Kurt Cobain", moments: "Fall of the Berlin Wall, MTV, the PC revolution", tech: "Cassette tapes, early PCs, the first cell phones", traits: "Independent · Resourceful · Skeptical" },
  B: { years: "1946–1964", famous: "Oprah Winfrey, Bill Gates, Steve Jobs", moments: "Moon landing, Vietnam War, civil rights movement", tech: "TV, landlines, the first home computers", traits: "Hardworking · Loyal · Optimistic" },
}

function getBirthGen(year: number): Gen | null {
  if (year >= 1997 && year <= 2012) return "Z"
  if (year >= 1981 && year <= 1996) return "M"
  if (year >= 1965 && year <= 1980) return "X"
  if (year >= 1946 && year <= 1964) return "B"
  return null
}

export default function GenerationQuizPage() {
  const [answers, setAnswers] = useState<(Gen | null)[]>(Array(10).fill(null))
  const [birthYear, setBirthYear] = useState("")
  const [result, setResult] = useState<{ primary: Gen; score: number; blend: string | null } | null>(null)

  function calcResult(ans: (Gen | null)[]) {
    const scores: Record<Gen, number> = { Z: 0, M: 0, X: 0, B: 0 }
    ans.forEach(a => { if (a) scores[a] += 2 })
    const sorted = (Object.keys(scores) as Gen[]).sort((a, b) => scores[b] - scores[a])
    const primary = sorted[0]
    const top = scores[primary]
    const second = scores[sorted[1]]
    let blend: string | null = null
    if (top > 0 && second >= top * 0.66 && second > 0) {
      const total = top + second
      blend = `You are ${Math.round((top / total) * 100)}% ${GEN_NAMES[primary]} ${Math.round((second / total) * 100)}% ${GEN_NAMES[sorted[1]]}`
      if ((primary === "M" && sorted[1] === "X") || (primary === "X" && sorted[1] === "M")) blend += " — a classic Xennial!"
    }
    return { primary, score: top, blend }
  }

  function submit(push = true) {
    if (answers.some(a => a === null)) return
    const res = calcResult(answers)
    setResult(res)
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?result=${GEN_NAMES[res.primary]}&score=${res.score}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const r = p.get("result")
    if (r) {
      const entry = (Object.entries(GEN_NAMES) as [Gen, string][]).find(([, v]) => v === r)
      if (entry) setResult({ primary: entry[0], score: Number(p.get("score") ?? 0), blend: null })
    }
  }, [])

  function pick(qi: number, gen: Gen) {
    const next = [...answers]
    next[qi] = gen
    setAnswers(next)
  }

  const birthGen = birthYear ? getBirthGen(Number(birthYear)) : null
  const info = result ? GEN_INFO[result.primary] : null

  const shareUrl = result ? `https://www.dayblip.com/tools/generation-quiz?result=${GEN_NAMES[result.primary]}&score=${result.score}` : ""
  const shareText = result
    ? `My quiz says I am a ${GEN_NAMES[result.primary]}!${birthGen ? `\nBut I was born in ${birthYear} so technically I am ${GEN_NAMES[birthGen]}.` : ""}\nTake the quiz:`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Generation Quiz — What Generation Are You Really?</h1>
          <p className="text-[#a8a8b3]">10 questions to find your true generational identity — you might be surprised</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Generation boundaries are defined by birth year: Silent Generation (1928-1945), Baby Boomers (1946-1964), Generation X (1965-1980), Millennials (1981-1996), Generation Z (1997-2012), Generation Alpha (2013-present). However cultural experiences often matter more than birth year — someone born in 1981 may identify more with Gen X than Millennials depending on their experiences.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Generational labels are sociological categories that group people who share similar formative cultural experiences shaped by major historical events, technology and economic conditions. This quiz goes beyond just your birth year to assess which generation you most closely identify with based on your actual attitudes, experiences and cultural touchstones.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          {QUESTIONS.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
              <div className="mb-3 font-semibold text-white">{qi + 1}. {q.q}</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.a.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => pick(qi, opt.gen)}
                    className="rounded-lg border px-3 py-2.5 text-left text-sm transition-colors"
                    style={{
                      borderColor: answers[qi] === opt.gen ? "#e94560" : "#0f3460",
                      backgroundColor: answers[qi] === opt.gen ? "rgba(233,69,96,0.15)" : "#16213e",
                      color: "#ffffff",
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <label className="block rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <span className="mb-2 block text-sm font-semibold text-white">What year were you born? (optional)</span>
            <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)} placeholder="e.g. 1990" className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
          </label>

          <button onClick={() => submit()} disabled={answers.some(a => a === null)} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40">
            See My Result
          </button>

          {result && info && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center">
                <div className="text-sm text-[#a8a8b3]">You are most…</div>
                <div className="my-1 text-3xl font-black text-[#e94560]">{GEN_NAMES[result.primary]}</div>
                <div className="text-sm text-white">{info.years}</div>
                {result.blend && <div className="mt-2 text-sm font-semibold text-[#F9A825]">{result.blend}</div>}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-sm text-white space-y-2">
                <p><span className="font-bold text-[#a8a8b3]">Famous faces: </span>{info.famous}</p>
                <p><span className="font-bold text-[#a8a8b3]">Defining moments: </span>{info.moments}</p>
                <p><span className="font-bold text-[#a8a8b3]">Technology: </span>{info.tech}</p>
                <p><span className="font-bold text-[#a8a8b3]">Key traits: </span>{info.traits}</p>
              </div>

              {birthGen && (
                <div className="rounded-xl border border-[#F9A825]/40 bg-[#1a1a2e] p-6 text-center text-white">
                  <p>Your birth year says <span className="font-bold text-[#F9A825]">{GEN_NAMES[birthGen]}</span>. Your quiz says <span className="font-bold text-[#e94560]">{GEN_NAMES[result.primary]}</span>.</p>
                  {birthGen !== result.primary && <p className="mt-2 font-semibold">You are a {GEN_NAMES[result.primary]} trapped in a {GEN_NAMES[birthGen]} body!</p>}
                </div>
              )}

              <ShareButtons text={shareText} url={shareUrl} title="What Generation Are You Really?" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
