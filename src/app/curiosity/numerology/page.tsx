"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

// ── Letter → number map (Pythagorean) ─────────────────────────────────────────
const LETTER_MAP: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
}
const VOWELS = new Set(["A","E","I","O","U"])

function reduceToSingle(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  const sum = String(n).split("").reduce((a, d) => a + parseInt(d), 0)
  return reduceToSingle(sum)
}

function calcLifePath(dob: string): number {
  const digits = dob.replace(/-/g, "").split("").map(Number)
  const sum = digits.reduce((a, d) => a + d, 0)
  return reduceToSingle(sum)
}

function calcNameNumber(name: string, vowelsOnly: boolean): number {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("")
  const filtered = vowelsOnly ? letters.filter(l => VOWELS.has(l)) : letters
  const sum = filtered.reduce((a, l) => a + (LETTER_MAP[l] || 0), 0)
  return reduceToSingle(sum)
}

interface NumberMeaning {
  title: string
  desc: string
  compatible: string
}

const MEANINGS: Record<number, NumberMeaning> = {
  1: { title: "The Leader", desc: "Independent ambitious and pioneering. You are a natural born leader who prefers to forge your own path rather than follow others. Your greatest strength is your ability to initiate and your greatest challenge is learning to collaborate.", compatible: "3, 5, 9" },
  2: { title: "The Peacemaker", desc: "Diplomatic sensitive and cooperative. You have a gift for bringing people together and seeing all sides of a situation. Your greatest strength is your empathy and your challenge is learning to stand firm in your own truth.", compatible: "6, 8, 9" },
  3: { title: "The Communicator", desc: "Creative expressive and social. You have a natural gift for words art and performance. Your greatest strength is your optimism and creativity and your challenge is following through on projects.", compatible: "1, 6, 9" },
  4: { title: "The Builder", desc: "Practical disciplined and reliable. You build solid foundations and are known for your hard work and integrity. Your greatest strength is your dependability and your challenge is embracing change and flexibility.", compatible: "6, 7, 8" },
  5: { title: "The Freedom Seeker", desc: "Adventurous versatile and progressive. You crave variety experience and freedom. Your greatest strength is your adaptability and your challenge is committing to long-term goals.", compatible: "1, 3, 7" },
  6: { title: "The Nurturer", desc: "Caring responsible and harmonious. You are drawn to home family and community. Your greatest strength is your compassion and your challenge is avoiding perfectionism and over-responsibility.", compatible: "2, 3, 9" },
  7: { title: "The Seeker", desc: "Analytical introspective and spiritual. You are a deep thinker who seeks truth and understanding. Your greatest strength is your wisdom and your challenge is opening up emotionally to others.", compatible: "4, 5, 11" },
  8: { title: "The Achiever", desc: "Ambitious authoritative and business-minded. You have a natural talent for leadership and material success. Your greatest strength is your drive and determination and your challenge is balancing material ambition with spiritual values.", compatible: "2, 4, 22" },
  9: { title: "The Humanitarian", desc: "Compassionate idealistic and globally conscious. You feel a deep sense of mission to serve humanity. Your greatest strength is your generosity and your challenge is learning to release and let go.", compatible: "1, 2, 3, 6" },
  11: { title: "The Intuitive", desc: "Master number. Highly intuitive visionary and inspiring. You are a spiritual messenger with the potential to inspire many. Your greatest strength is your intuition and your challenge is managing sensitivity and anxiety.", compatible: "7, 22" },
  22: { title: "The Master Builder", desc: "Master number. The most powerful life path. Visionary practical and capable of turning dreams into reality on a large scale. Your greatest challenge is the weight of your own potential.", compatible: "8, 11" },
  33: { title: "The Master Teacher", desc: "Master number. The rarest life path. Pure compassion devoted to uplifting others. You are a spiritual teacher and healer whose challenge is focusing this powerful energy.", compatible: "11, 22" },
}

const EXPRESSION_MEANINGS: Record<number, string> = {
  1: "Your expression number suggests natural leadership abilities and a strong drive for independence. You excel when given freedom to pioneer new directions.",
  2: "Your expression number reveals gifts for diplomacy cooperation and bringing harmony to groups. You work best in partnership and excel at mediation.",
  3: "Your expression number shows creative and communicative talents. You have a natural ability to inspire others through words art or performance.",
  4: "Your expression number indicates methodical practical talents. You have a gift for organization structure and building lasting systems.",
  5: "Your expression number reveals versatile adaptable abilities. You have talent for communication sales and any work involving change and variety.",
  6: "Your expression number shows nurturing responsible talents. You excel in roles involving care teaching and creating harmony in your environment.",
  7: "Your expression number indicates analytical and research-oriented talents. You have gifts for investigation specialization and uncovering hidden truths.",
  8: "Your expression number reveals business-minded executive talents. You have natural abilities in management finance and leadership.",
  9: "Your expression number shows humanitarian artistic talents. You are drawn to work that serves a larger cause or involves creativity and healing.",
  11: "Your expression number reveals master-level intuitive and visionary talents. You have powerful potential to inspire and illuminate others.",
  22: "Your expression number indicates master builder talents — the ability to turn ambitious visions into practical reality.",
  33: "Your expression number shows master teacher talents — pure service and the ability to uplift and heal others.",
}

const SOUL_MEANINGS: Record<number, string> = {
  1: "Your soul urge is independence and originality. Deep down you want to be first to blaze trails and be recognized for your unique contributions.",
  2: "Your soul urge is for love peace and harmony. You deeply desire close relationships cooperation and to feel needed by others.",
  3: "Your soul urge is for self-expression and joy. You deeply desire to create communicate and bring beauty and laughter to the world.",
  4: "Your soul urge is for security order and a solid foundation. You deeply desire stability honesty and to build something lasting.",
  5: "Your soul urge is for freedom adventure and variety. You deeply desire new experiences travel and the ability to live life on your own terms.",
  6: "Your soul urge is for love family and service. You deeply desire to love and be loved and to nurture those around you.",
  7: "Your soul urge is for knowledge truth and solitude. You deeply desire to understand life&apos;s mysteries and to find your own inner wisdom.",
  8: "Your soul urge is for achievement abundance and authority. You deeply desire to succeed accomplish and be recognized for your power.",
  9: "Your soul urge is to serve humanity and make the world better. You deeply desire to contribute to something greater than yourself.",
  11: "Your soul urge is to illuminate and inspire. You deeply desire to uplift others and live a life of spiritual purpose.",
  22: "Your soul urge is to build something of lasting importance. You deeply desire to leave a significant legacy in the world.",
  33: "Your soul urge is to serve and teach with unconditional love. You deeply desire to heal elevate and nurture all of humanity.",
}

export default function NumerologyPage() {
  const [dob, setDob] = useState("")
  const [name, setName] = useState("")
  const [result, setResult] = useState<{ lp: number; expr: number; soul: number } | null>(null)
  const [error, setError] = useState("")

  function calculate() {
    setError("")
    if (!dob) { setError("Please enter your date of birth."); return }
    const lp = calcLifePath(dob)
    const expr = name.trim() ? calcNameNumber(name, false) : 0
    const soul = name.trim() ? calcNameNumber(name, true) : 0
    setResult({ lp, expr, soul })
  }

  const lpMeaning = result ? MEANINGS[result.lp] : null

  const shareText = result && lpMeaning
    ? `My numerology life path number is ${result.lp} — ${lpMeaning.title}. Calculate yours free: www.dayblip.com/curiosity/numerology`
    : "Calculate your numerology numbers free: www.dayblip.com/curiosity/numerology"

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Numerology Calculator", "Calculate life path expression and soul urge numbers from birth date and name", "https://www.dayblip.com/curiosity/numerology", "EntertainmentApplication"),
        faqSchema([
          { question: "How do I calculate my life path number?", answer: "Add all digits of your birth date until you get a single digit. Example: born June 15 1985 — add 0+6+1+5+1+9+8+5 equals 35 then 3+5 equals 8. Life path 8. Exception: do not reduce master numbers 11 22 or 33." },
          { question: "What are master numbers in numerology?", answer: "Master numbers 11 22 and 33 are considered especially powerful in numerology and are not reduced to a single digit. Life path 11 is the intuitive — highly sensitive and visionary. Life path 22 is the master builder — capable of extraordinary achievement. Life path 33 is the master teacher — the rarest and most spiritually evolved number." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Curiosity", url: "https://www.dayblip.com/curiosity" },
          { name: "Numerology Calculator", url: "https://www.dayblip.com/curiosity/numerology" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🔢</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Numerology Calculator — Your Life Path Number and Meaning</h1>
          <p className="text-[#a8a8b3]">Life path, expression, and soul urge numbers from your birth date and name</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Curiosity", href: "/curiosity" }, { label: "Numerology Calculator" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>Your life path number is calculated by reducing your birth date to a single digit. Born June 15 1985: 0+6+1+5+1+9+8+5 equals 35 then 3+5 equals 8. Life path 8 represents ambition authority and material success. Life path 1 represents leadership. Life path 7 represents analysis and spirituality. Master numbers 11 22 and 33 are not reduced further.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>Numerology is the ancient study of numbers and their symbolic meanings in relation to human life and events. Your life path number — derived from your birth date — is considered the most important number in your numerology chart revealing your core personality and life purpose. This calculator is for entertainment and self-reflection purposes.</p>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Date of birth</span>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Full birth name <span className="text-[#a8a8b3] font-normal">(optional — for expression and soul urge numbers)</span></span>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First Middle Last"
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
          </div>

          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Calculate My Numbers
          </button>

          {result && lpMeaning && (
            <div className="space-y-4">
              {/* Life Path */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#e94560] text-3xl font-black text-[#e94560]">
                    {result.lp}
                  </div>
                  <div>
                    <div className="text-xs text-[#a8a8b3] uppercase tracking-wider">Life Path Number</div>
                    <div className="text-xl font-bold text-white">{lpMeaning.title}</div>
                  </div>
                </div>
                <p className="text-[#a8a8b3] text-sm leading-relaxed">{lpMeaning.desc}</p>
                <div className="mt-3 text-xs text-[#a8a8b3]">
                  Naturally compatible with life paths: <span className="text-[#4FC3F7] font-semibold">{lpMeaning.compatible}</span>
                </div>
              </div>

              {result.expr > 0 && (
                <div className="rounded-xl border border-[#4FC3F7]/30 bg-[#1a1a2e] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#4FC3F7] text-xl font-black text-[#4FC3F7]">
                      {result.expr}
                    </div>
                    <div>
                      <div className="text-xs text-[#a8a8b3] uppercase tracking-wider">Expression Number</div>
                      <div className="font-bold text-white">Talents &amp; Abilities</div>
                    </div>
                  </div>
                  <p className="text-[#a8a8b3] text-sm leading-relaxed">{EXPRESSION_MEANINGS[result.expr] ?? EXPRESSION_MEANINGS[1]}</p>
                </div>
              )}

              {result.soul > 0 && (
                <div className="rounded-xl border border-[#F9A825]/30 bg-[#1a1a2e] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#F9A825] text-xl font-black text-[#F9A825]">
                      {result.soul}
                    </div>
                    <div>
                      <div className="text-xs text-[#a8a8b3] uppercase tracking-wider">Soul Urge Number</div>
                      <div className="font-bold text-white">Inner Desires &amp; Motivations</div>
                    </div>
                  </div>
                  <p className="text-[#a8a8b3] text-sm leading-relaxed">{SOUL_MEANINGS[result.soul] ?? SOUL_MEANINGS[1]}</p>
                </div>
              )}

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-3 text-xs text-center text-[#a8a8b3]">
                For entertainment and self-reflection purposes only.
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/curiosity/numerology" title="Numerology Calculator" />
            </div>
          )}

          <RelatedTools tools={[
            { emoji: "🎂", title: "Birthday Personality", desc: "Everything your birthday says about you", href: "/tools/birthday-personality" },
            { emoji: "🐉", title: "Chinese Zodiac Calculator", desc: "Your Chinese zodiac animal and meaning", href: "/curiosity/chinese-zodiac" },
            { emoji: "⭐", title: "Star Sign Calculator", desc: "Your western zodiac sign", href: "/star-sign" },
            { emoji: "❤️", title: "Love Compatibility", desc: "Numerology compatibility with a partner", href: "/curiosity/compatibility" },
          ]} />
        </div>
      </section>
    </div>
  )
}
