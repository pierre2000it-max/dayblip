"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"

interface Profile {
  dob: string
  sign: string; signSymbol: string; signTraits: string
  chinese: string
  weekday: string; weekdayTrait: string
  moon: string
  flower: string
  stone: string
  lifePath: number; lifePathMeaning: string
  generation: string
  dayOfYear: number; daysToYearEnd: number
  nextBirthdayDays: number; nextBirthdayStr: string
}

function getSign(m: number, d: number): [string, string, string] {
  const z: [number, number, string, string, string][] = [
    [1, 19, "Capricorn", "♑", "Disciplined · Ambitious · Practical"],
    [2, 18, "Aquarius", "♒", "Independent · Original · Humanitarian"],
    [3, 20, "Pisces", "♓", "Compassionate · Artistic · Intuitive"],
    [4, 19, "Aries", "♈", "Bold · Energetic · Pioneering"],
    [5, 20, "Taurus", "♉", "Reliable · Patient · Devoted"],
    [6, 20, "Gemini", "♊", "Curious · Adaptable · Witty"],
    [7, 22, "Cancer", "♋", "Loyal · Emotional · Nurturing"],
    [8, 22, "Leo", "♌", "Confident · Generous · Charismatic"],
    [9, 22, "Virgo", "♍", "Analytical · Kind · Hardworking"],
    [10, 22, "Libra", "♎", "Diplomatic · Fair · Social"],
    [11, 21, "Scorpio", "♏", "Passionate · Resourceful · Brave"],
    [12, 21, "Sagittarius", "♐", "Optimistic · Adventurous · Honest"],
    [12, 31, "Capricorn", "♑", "Disciplined · Ambitious · Practical"],
  ]
  for (const [mm, dd, name, sym, tr] of z) {
    if (m < mm || (m === mm && d <= dd)) return [name, sym, tr]
  }
  return ["Capricorn", "♑", "Disciplined · Ambitious · Practical"]
}

const CHINESE = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"]
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const WEEKDAY_TRAITS: Record<string, string> = {
  Monday: "Intuitive and emotional",
  Tuesday: "Energetic and determined",
  Wednesday: "Communicative and witty",
  Thursday: "Generous and philosophical",
  Friday: "Sociable and creative",
  Saturday: "Disciplined and ambitious",
  Sunday: "Optimistic and charismatic",
}
const FLOWERS = ["Carnation", "Violet", "Daffodil", "Daisy", "Lily of the Valley", "Rose", "Larkspur", "Gladiolus", "Aster", "Marigold", "Chrysanthemum", "Narcissus"]
const STONES = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"]
const LIFE_PATH: Record<number, string> = {
  1: "Leader and pioneer", 2: "Peacemaker and partner", 3: "Creative communicator",
  4: "Builder and organizer", 5: "Freedom seeker and adventurer", 6: "Nurturer and caregiver",
  7: "Seeker and thinker", 8: "Achiever and executive", 9: "Humanitarian and idealist",
  11: "Intuitive visionary (master number)", 22: "Master builder (master number)",
}

function reduceNum(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split("").reduce((a, c) => a + Number(c), 0)
  }
  return n
}

function getGeneration(y: number): string {
  if (y >= 1997 && y <= 2012) return "Gen Z (1997–2012)"
  if (y >= 1981 && y <= 1996) return "Millennial (1981–1996)"
  if (y >= 1965 && y <= 1980) return "Gen X (1965–1980)"
  if (y >= 1946 && y <= 1964) return "Baby Boomer (1946–1964)"
  if (y >= 1928 && y <= 1945) return "Silent Generation (1928–1945)"
  if (y > 2012) return "Gen Alpha (2013–)"
  return "Greatest Generation"
}

function getMoon(dob: Date): string {
  const knownNewMoon = new Date("2000-01-06T18:14:00Z")
  const daysSince = (dob.getTime() - knownNewMoon.getTime()) / 86400000
  const phase = ((daysSince % 29.5) + 29.5) % 29.5
  return phase < 1.85 ? "New Moon" :
    phase < 7.38 ? "Waxing Crescent" :
    phase < 11.08 ? "First Quarter" :
    phase < 14.77 ? "Waxing Gibbous" :
    phase < 18.46 ? "Full Moon" :
    phase < 22.15 ? "Waning Gibbous" :
    phase < 25.85 ? "Last Quarter" : "Waning Crescent"
}

function compute(dobStr: string): Profile | null {
  const dob = new Date(`${dobStr}T12:00:00`)
  if (isNaN(dob.getTime())) return null
  const m = dob.getMonth() + 1
  const d = dob.getDate()
  const y = dob.getFullYear()
  const [sign, signSymbol, signTraits] = getSign(m, d)
  const weekday = WEEKDAYS[dob.getDay()]
  const digits = dobStr.replace(/-/g, "").split("").reduce((a, c) => a + Number(c), 0)
  const lifePath = reduceNum(digits)

  const startOfYear = new Date(y, 0, 0)
  const dayOfYear = Math.floor((dob.getTime() - startOfYear.getTime()) / 86400000)
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
  const daysToYearEnd = (isLeap ? 366 : 365) - dayOfYear

  const now = new Date()
  let next = new Date(now.getFullYear(), m - 1, d)
  if (next.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    next = new Date(now.getFullYear() + 1, m - 1, d)
  }
  const nextBirthdayDays = Math.round((next.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000)
  const nextBirthdayStr = next.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return {
    dob: dobStr, sign, signSymbol, signTraits,
    chinese: CHINESE[y % 12],
    weekday, weekdayTrait: WEEKDAY_TRAITS[weekday],
    moon: getMoon(dob),
    flower: FLOWERS[m - 1], stone: STONES[m - 1],
    lifePath, lifePathMeaning: LIFE_PATH[lifePath] ?? "Unique path",
    generation: getGeneration(y),
    dayOfYear, daysToYearEnd,
    nextBirthdayDays, nextBirthdayStr,
  }
}

function Item({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-5">
      <div className="mb-1 text-2xl">{icon}</div>
      <div className="text-xs uppercase tracking-wide text-[#a8a8b3]">{label}</div>
      <div className="mt-1 font-bold text-white">{value}</div>
      {sub && <div className="mt-1 text-sm text-[#a8a8b3]">{sub}</div>}
    </div>
  )
}

export default function BirthdayPersonalityPage() {
  const [dob, setDob] = useState("1990-06-15")
  const [profile, setProfile] = useState<Profile | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  function runCalc(push = true, d = dob) {
    const res = compute(d)
    setProfile(res)
    if (res && push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?dob=${d}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const d = p.get("dob")
    if (d) { setDob(d); setProfile(compute(d)) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function download() {
    if (!cardRef.current) return
    const html2canvas = (await import("html2canvas")).default
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#1a1a2e" })
    const link = document.createElement("a")
    link.download = "dayblip-birthday-profile.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const shareUrl = profile ? `https://www.dayblip.com/tools/birthday-personality?dob=${profile.dob}` : ""
  const shareText = profile
    ? `My birthday profile:\n${profile.sign} born on a ${profile.weekday} under a ${profile.moon} moon 🌙\nLife Path Number: ${profile.lifePath}\nBirth Flower: ${profile.flower}`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Birthday Personality — Everything Your Birthday Says About You</h1>
          <p className="text-[#a8a8b3]">A complete deep dive into what your birthday says about you</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Your birth date connects you to a rich tapestry of facts — your Chinese zodiac animal, Western star sign, birth number in numerology, and the historical events that shaped the world on your exact birthday. Statistically the most common birth month in the US is September — meaning more people were conceived in December than any other month.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Birthday personality tools combine multiple cultural and historical systems to reveal the symbolic meaning attached to your specific birth date. This includes Western astrology, Chinese zodiac, numerological birth numbers, historical events on your birthday and fun statistical facts about people born in your month and season.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px] space-y-8">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-white">Your full birth date</span>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Reveal My Birthday Profile
            </button>
          </div>

          {profile && (
            <div className="space-y-6">
              <div ref={cardRef} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <Item icon={profile.signSymbol} label="Star Sign" value={profile.sign} sub={profile.signTraits} />
                  <Item icon="🐉" label="Chinese Zodiac" value={profile.chinese} />
                  <Item icon="📅" label="Day Born" value={profile.weekday} sub={profile.weekdayTrait} />
                  <Item icon="🌙" label="Moon Phase" value={profile.moon} />
                  <Item icon="🌸" label="Birth Flower" value={profile.flower} />
                  <Item icon="💎" label="Birthstone" value={profile.stone} />
                  <Item icon="🔢" label="Life Path Number" value={String(profile.lifePath)} sub={profile.lifePathMeaning} />
                  <Item icon="👥" label="Generation" value={profile.generation} />
                  <Item icon="🗓️" label="Day of Year" value={`Day ${profile.dayOfYear}`} sub={`${profile.daysToYearEnd} days before year end`} />
                </div>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <div className="font-bold">🎉 Your next birthday is in {profile.nextBirthdayDays} days</div>
                <div className="mt-1 text-sm text-[#a8a8b3]">{profile.nextBirthdayStr}</div>
              </div>

              <button onClick={download} className="w-full rounded-lg border border-[#e94560] bg-transparent px-5 py-3 font-semibold text-[#e94560] transition-colors hover:bg-[#e94560] hover:text-white">
                Download My Birthday Profile →
              </button>

              <ShareButtons text={shareText} url={shareUrl} title="Everything About Your Birthday" />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
