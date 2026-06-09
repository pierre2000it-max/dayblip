"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Numerology helpers (duplicated from numerology page) ──────────────────────
function reduceToSingle(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reduceToSingle(String(n).split("").reduce((a, d) => a + parseInt(d), 0))
}
function calcLP(dob: string): number {
  const digits = dob.replace(/-/g, "").split("").map(Number)
  return reduceToSingle(digits.reduce((a, d) => a + d, 0))
}

// ── Chinese zodiac helper ─────────────────────────────────────────────────────
const ZODIAC_NAMES = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"]
const ZODIAC_EMOJI = ["🐭","🐂","🐯","🐰","🐉","🐍","🐴","🐐","🐒","🐓","🐕","🐷"]
const BEST_MATCHES: Record<string, string[]> = {
  Rat:["Dragon","Monkey","Ox"], Ox:["Rat","Snake","Rooster"], Tiger:["Horse","Dog","Pig"],
  Rabbit:["Goat","Monkey","Dog","Pig"], Dragon:["Monkey","Rat","Rooster"], Snake:["Dragon","Rooster","Ox"],
  Horse:["Tiger","Goat","Dog"], Goat:["Rabbit","Horse","Pig"], Monkey:["Ox","Rabbit","Dragon"],
  Rooster:["Ox","Dragon","Snake"], Dog:["Rabbit","Tiger","Horse"], Pig:["Tiger","Rabbit","Goat"],
}
function getZodiac(year: number): { name: string; emoji: string } {
  const idx = ((year - 4) % 12 + 12) % 12
  return { name: ZODIAC_NAMES[idx], emoji: ZODIAC_EMOJI[idx] }
}

// ── LP compatibility scores ───────────────────────────────────────────────────
const LP_SCORES: Record<string, number> = {
  "1-3":9,"3-1":9, "1-5":9,"5-1":9, "1-9":8,"9-1":8, "2-6":9,"6-2":9, "2-8":8,"8-2":8,
  "3-6":8,"6-3":8, "3-9":9,"9-3":9, "4-8":9,"8-4":9, "4-6":7,"6-4":7, "5-7":8,"7-5":8,
  "6-9":8,"9-6":8, "7-11":9,"11-7":9, "1-1":5, "2-2":6, "3-3":6, "4-4":5, "5-5":7,
  "6-6":8, "7-7":5, "8-8":5, "9-9":7,
  // Challenging
  "1-4":4,"4-1":4, "2-7":4,"7-2":4, "3-8":4,"8-3":4, "4-9":4,"9-4":4, "5-6":4,"6-5":4,
}
function getLPScore(a: number, b: number): number {
  const key = `${a}-${b}`
  const keyRev = `${b}-${a}`
  return LP_SCORES[key] ?? LP_SCORES[keyRev] ?? 6
}

function getZodiacScore(a: string, b: string): number {
  const best = BEST_MATCHES[a] ?? []
  if (best.includes(b)) return 9
  const bestB = BEST_MATCHES[b] ?? []
  if (bestB.includes(a)) return 9
  return 5
}

const LP_MEANINGS: Record<number, string> = {
  1:"The Leader — independent and pioneering",2:"The Peacemaker — empathetic and cooperative",
  3:"The Communicator — creative and expressive",4:"The Builder — practical and reliable",
  5:"The Freedom Seeker — adventurous and versatile",6:"The Nurturer — caring and responsible",
  7:"The Seeker — analytical and spiritual",8:"The Achiever — ambitious and driven",
  9:"The Humanitarian — compassionate and idealistic",11:"The Intuitive — visionary and inspired",
  22:"The Master Builder — powerful and transformative",33:"The Master Teacher — compassionate guide",
}

function getStrengths(lp1: number, lp2: number, z1: string, z2: string): string[] {
  const s: string[] = []
  if (getLPScore(lp1, lp2) >= 8) s.push("Highly compatible life path energy — your core values and drives naturally align")
  if (getZodiacScore(z1, z2) >= 8) s.push("Strong Chinese zodiac match — traditional compatibility indicates natural harmony")
  if ((lp1 + lp2) % 9 === 0) s.push("Your numbers are numerologically balanced — you complement each other&apos;s strengths")
  if (s.length < 2) s.push("Different strengths that can complement each other when both parties are committed")
  if (s.length < 3) s.push("Shared potential for growth through understanding each other&apos;s unique perspectives")
  return s.slice(0, 3)
}

function getChallenges(lp1: number, lp2: number): string[] {
  const c: string[] = []
  if (getLPScore(lp1, lp2) <= 4) c.push("Your life path numbers suggest different approaches to achieving goals — communication is key")
  else c.push("May need to consciously balance independence with togetherness")
  c.push("No two people are perfectly compatible — success depends on mutual respect and effort")
  return c
}

interface CompatResult {
  name1: string; name2: string
  lp1: number; lp2: number
  z1: string; z1e: string; z2: string; z2e: string
  lpScore: number; zScore: number; overall: number
  strengths: string[]; challenges: string[]
}

export default function CompatibilityPage() {
  const [name1, setName1] = useState("")
  const [dob1, setDob1] = useState("")
  const [name2, setName2] = useState("")
  const [dob2, setDob2] = useState("")
  const [result, setResult] = useState<CompatResult | null>(null)
  const [error, setError] = useState("")

  function calculate() {
    setError("")
    if (!dob1 || !dob2) { setError("Please enter both birth dates."); return }
    const lp1 = calcLP(dob1)
    const lp2 = calcLP(dob2)
    const y1 = parseInt(dob1.split("-")[0])
    const y2 = parseInt(dob2.split("-")[0])
    const { name: z1, emoji: z1e } = getZodiac(y1)
    const { name: z2, emoji: z2e } = getZodiac(y2)
    const lpScore = getLPScore(lp1, lp2)
    const zScore = getZodiacScore(z1, z2)
    const overall = Math.round((lpScore + zScore) / 2)
    setResult({
      name1: name1.trim() || "Person 1", name2: name2.trim() || "Person 2",
      lp1, lp2, z1, z1e, z2, z2e, lpScore, zScore, overall,
      strengths: getStrengths(lp1, lp2, z1, z2),
      challenges: getChallenges(lp1, lp2),
    })
  }

  function getHearts(score: number): { hearts: string; label: string } {
    const pct = score * 10
    if (pct >= 90) return { hearts: "💕💕💕💕💕", label: "Soulmates" }
    if (pct >= 70) return { hearts: "💕💕💕💕", label: "Very Compatible" }
    if (pct >= 50) return { hearts: "💕💕💕", label: "Compatible" }
    if (pct >= 30) return { hearts: "💕💕", label: "Challenging" }
    return { hearts: "💕", label: "Growth Opportunity" }
  }

  const shareText = result
    ? `${result.name1} and ${result.name2} are ${result.overall * 10}% compatible according to numerology and Chinese zodiac. Calculate yours free: www.dayblip.com/curiosity/compatibility`
    : "Calculate your love compatibility free: www.dayblip.com/curiosity/compatibility"

  const inp = "w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none text-sm"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Love Compatibility Calculator", "Calculate love compatibility based on numerology life path numbers and Chinese zodiac signs", "https://www.dayblip.com/curiosity/compatibility", "EntertainmentApplication"),
        faqSchema([
          { question: "How is love compatibility calculated?", answer: "This calculator combines two systems: numerology life path numbers (derived from birth dates) and Chinese zodiac compatibility (derived from birth year). Each system scores compatibility 1-10 and the overall score is the average. Highly compatible life path pairings include 1+5 2+6 3+9 and 4+8. Best zodiac pairings are based on traditional Chinese astrology compatibility." },
          { question: "Can a compatibility calculator predict relationship success?", answer: "No compatibility calculator can predict relationship success. Real relationship compatibility depends on communication mutual respect shared values and individual effort — not numbers or zodiac signs. This calculator is for entertainment and self-reflection only." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Curiosity", url: "https://www.dayblip.com/curiosity" },
          { name: "Love Compatibility", url: "https://www.dayblip.com/curiosity/compatibility" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">❤️</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Love Compatibility Calculator — How Compatible Are You?</h1>
          <p className="text-[#a8a8b3]">Numerology and Chinese zodiac compatibility — for fun and self-reflection</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Curiosity", href: "/curiosity" }, { label: "Love Compatibility" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>Love compatibility in numerology is calculated by comparing life path numbers. Highly compatible pairs: 1 and 5 (both freedom-loving) 2 and 6 (both nurturing) 3 and 9 (both creative) 4 and 8 (both ambitious) 7 and 11 (both spiritual). No pairing is truly incompatible — every combination has strengths and challenges. Compatibility tools are for fun and self-reflection only.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Love compatibility calculators combine multiple systems — life path numerology and Chinese zodiac — to assess relationship dynamics between two people. No tool can predict relationship success which depends on communication respect and shared values. This calculator is for entertainment and self-reflection purposes only.</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
              <div className="text-sm font-bold text-[#e94560] uppercase tracking-wider">Person 1</div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Your name</span>
                <input type="text" value={name1} onChange={e => setName1(e.target.value)} placeholder="Optional" className={inp} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Date of birth</span>
                <input type="date" value={dob1} onChange={e => setDob1(e.target.value)} className={inp} />
              </label>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 space-y-3">
              <div className="text-sm font-bold text-[#4FC3F7] uppercase tracking-wider">Person 2</div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Partner name</span>
                <input type="text" value={name2} onChange={e => setName2(e.target.value)} placeholder="Optional" className={inp} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-white">Partner date of birth</span>
                <input type="date" value={dob2} onChange={e => setDob2(e.target.value)} className={inp} />
              </label>
            </div>
          </div>

          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate Compatibility
          </button>

          {result && (() => {
            const { hearts, label } = getHearts(result.overall)
            const pct = result.overall * 10
            return (
              <div className="space-y-4">
                {/* Main score */}
                <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                  <div className="text-4xl mb-2">{hearts}</div>
                  <div className="text-5xl font-black text-[#e94560]">{pct}%</div>
                  <div className="text-xl font-bold text-white mt-1">{label}</div>
                  <div className="text-sm text-[#a8a8b3] mt-2">{result.name1} &amp; {result.name2}</div>
                </div>

                {/* Profile row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                    <div className="text-lg font-bold text-[#e94560]">{result.name1}</div>
                    <div className="text-sm text-[#a8a8b3] mt-1">Life Path <span className="text-white font-bold">{result.lp1}</span></div>
                    <div className="text-sm text-[#a8a8b3]">{result.z1e} {result.z1}</div>
                    <div className="text-xs text-[#a8a8b3] mt-1">{LP_MEANINGS[result.lp1]}</div>
                  </div>
                  <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                    <div className="text-lg font-bold text-[#4FC3F7]">{result.name2}</div>
                    <div className="text-sm text-[#a8a8b3] mt-1">Life Path <span className="text-white font-bold">{result.lp2}</span></div>
                    <div className="text-sm text-[#a8a8b3]">{result.z2e} {result.z2}</div>
                    <div className="text-xs text-[#a8a8b3] mt-1">{LP_MEANINGS[result.lp2]}</div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                  {[
                    { label: "Numerology Compatibility", score: result.lpScore, desc: `Life Path ${result.lp1} + Life Path ${result.lp2}` },
                    { label: "Chinese Zodiac Compatibility", score: result.zScore, desc: `${result.z1} + ${result.z2}` },
                  ].map(({ label, score, desc }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-semibold">{label}</span>
                        <span className="text-[#F9A825] font-bold">{score}/10</span>
                      </div>
                      <div className="h-2 bg-[#0f3460] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#e94560]" style={{ width: `${score * 10}%` }} />
                      </div>
                      <div className="text-xs text-[#a8a8b3] mt-1">{desc}</div>
                    </div>
                  ))}
                </div>

                {/* Strengths */}
                <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-5">
                  <h2 className="font-bold text-green-300 mb-3">💚 Relationship Strengths</h2>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-[#a8a8b3] flex gap-2">
                        <span className="text-green-400">•</span><span dangerouslySetInnerHTML={{ __html: s }} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth areas */}
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/10 p-5">
                  <h2 className="font-bold text-yellow-300 mb-3">🌱 Growth Areas</h2>
                  <ul className="space-y-2">
                    {result.challenges.map((c, i) => (
                      <li key={i} className="text-sm text-[#a8a8b3] flex gap-2"><span className="text-yellow-400">•</span><span>{c}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-xs text-center text-[#a8a8b3]">
                  ⚠️ This calculator is for entertainment and self-reflection only. Real relationship compatibility depends on communication mutual respect shared values and individual effort — not numbers or zodiac signs.
                </div>

                <ShareButtons text={shareText} url="https://www.dayblip.com/curiosity/compatibility" title="Love Compatibility Calculator" />
              </div>
            )
          })()}

          <RelatedTools tools={[
            { emoji: "🔢", title: "Numerology Calculator", desc: "Calculate your life path number", href: "/curiosity/numerology" },
            { emoji: "🐉", title: "Chinese Zodiac", desc: "Your Chinese zodiac animal", href: "/curiosity/chinese-zodiac" },
            { emoji: "🎂", title: "Birthday Personality", desc: "What your birthday reveals", href: "/tools/birthday-personality" },
            { emoji: "⭐", title: "Star Sign Calculator", desc: "Your western zodiac sign", href: "/star-sign" },
          ]} />
        </div>
      </section>
    </div>
  )
}
