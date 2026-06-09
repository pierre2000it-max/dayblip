"use client"
import { useState } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"

interface ZodiacAnimal {
  name: string
  emoji: string
  element: string
  lucky: string[]
  luckyColors: string[]
  personality: string[]
  best: string[]
  avoid: string[]
  recentYears: number[]
}

const ANIMALS: ZodiacAnimal[] = [
  { name: "Rat",      emoji: "🐭", element: "Water", lucky: ["2","3"],   luckyColors: ["Blue","Gold","Green"],          personality: ["Intelligent","Charming","Quick-witted","Resourceful"], best: ["Dragon","Monkey","Ox"],         avoid: ["Horse","Rabbit"],          recentYears: [1960,1972,1984,1996,2008,2020] },
  { name: "Ox",       emoji: "🐂", element: "Earth", lucky: ["1","4"],   luckyColors: ["White","Yellow","Green"],        personality: ["Diligent","Dependable","Strong","Determined"],         best: ["Rat","Snake","Rooster"],       avoid: ["Goat","Horse","Dog"],       recentYears: [1961,1973,1985,1997,2009,2021] },
  { name: "Tiger",    emoji: "🐯", element: "Wood",  lucky: ["1","3","4"],luckyColors: ["Blue","Grey","Orange"],          personality: ["Brave","Confident","Competitive","Unpredictable"],    best: ["Horse","Dog","Pig"],           avoid: ["Ox","Snake","Monkey"],      recentYears: [1962,1974,1986,1998,2010,2022] },
  { name: "Rabbit",   emoji: "🐰", element: "Wood",  lucky: ["3","4","6"],luckyColors: ["Red","Pink","Purple","White"],   personality: ["Quiet","Elegant","Kind","Responsible"],               best: ["Goat","Monkey","Dog","Pig"],   avoid: ["Snake","Rooster"],          recentYears: [1963,1975,1987,1999,2011,2023] },
  { name: "Dragon",   emoji: "🐉", element: "Earth", lucky: ["1","6","7"],luckyColors: ["Gold","Silver","Grey"],          personality: ["Confident","Intelligent","Enthusiastic","Ambitious"],  best: ["Monkey","Rat","Rooster"],      avoid: ["Ox","Goat","Dog"],          recentYears: [1964,1976,1988,2000,2012,2024] },
  { name: "Snake",    emoji: "🐍", element: "Fire",  lucky: ["2","8","9"],luckyColors: ["Black","Red","Yellow"],          personality: ["Enigmatic","Wise","Intuitive","Elegant"],              best: ["Dragon","Rooster","Ox"],       avoid: ["Tiger","Pig"],              recentYears: [1965,1977,1989,2001,2013,2025] },
  { name: "Horse",    emoji: "🐴", element: "Fire",  lucky: ["2","3","7"],luckyColors: ["Yellow","Green"],                personality: ["Energetic","Independent","Impatient","Warm-hearted"],  best: ["Tiger","Goat","Dog"],          avoid: ["Rat","Ox"],                 recentYears: [1966,1978,1990,2002,2014,2026] },
  { name: "Goat",     emoji: "🐐", element: "Earth", lucky: ["2","7"],    luckyColors: ["Brown","Red","Purple"],          personality: ["Gentle","Calm","Generous","Creative"],                 best: ["Rabbit","Horse","Pig"],        avoid: ["Ox","Dog","Rat"],           recentYears: [1967,1979,1991,2003,2015] },
  { name: "Monkey",   emoji: "🐒", element: "Metal", lucky: ["1","7","8"],luckyColors: ["White","Gold","Blue"],           personality: ["Witty","Intelligent","Innovative","Mischievous"],      best: ["Ox","Rabbit","Dragon"],        avoid: ["Tiger","Pig","Snake"],      recentYears: [1956,1968,1980,1992,2004,2016] },
  { name: "Rooster",  emoji: "🐓", element: "Metal", lucky: ["5","7","8"],luckyColors: ["Gold","Brown","Yellow"],         personality: ["Observant","Hardworking","Courageous","Talented"],     best: ["Ox","Dragon","Snake"],         avoid: ["Rat","Rabbit","Dog"],       recentYears: [1957,1969,1981,1993,2005,2017] },
  { name: "Dog",      emoji: "🐕", element: "Earth", lucky: ["3","4","9"],luckyColors: ["Green","Red","Purple"],          personality: ["Loyal","Honest","Kind-hearted","Sincere"],             best: ["Rabbit","Tiger","Horse"],      avoid: ["Dragon","Goat","Rooster"],  recentYears: [1958,1970,1982,1994,2006,2018] },
  { name: "Pig",      emoji: "🐷", element: "Water", lucky: ["2","5","8"],luckyColors: ["Yellow","Grey","Brown"],         personality: ["Compassionate","Generous","Diligent","Optimistic"],    best: ["Tiger","Rabbit","Goat"],       avoid: ["Snake","Monkey"],           recentYears: [1959,1971,1983,1995,2007,2019] },
]

function getAnimal(year: number): ZodiacAnimal {
  const idx = ((year - 4) % 12 + 12) % 12
  return ANIMALS[idx]
}

export default function ChineseZodiacPage() {
  const [birthYear, setBirthYear] = useState("")
  const [animal, setAnimal] = useState<ZodiacAnimal | null>(null)
  const [error, setError] = useState("")

  function calculate() {
    setError("")
    const y = parseInt(birthYear)
    if (!y || y < 1900 || y > 2100) { setError("Please enter a valid birth year between 1900 and 2100."); return }
    setAnimal(getAnimal(y))
  }

  const shareText = animal
    ? `I am a ${animal.name} in the Chinese Zodiac — ${animal.personality[0].toLowerCase()} and ${animal.personality[1].toLowerCase()}. Find your sign free: www.dayblip.com/curiosity/chinese-zodiac`
    : "Find your Chinese zodiac animal free: www.dayblip.com/curiosity/chinese-zodiac"

  // Current + upcoming years for fun context
  const currentYear = new Date().getFullYear()
  const currentAnimal = getAnimal(currentYear)

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("Chinese Zodiac Calculator", "Find your Chinese zodiac animal sign based on birth year with traits and compatibility", "https://www.dayblip.com/curiosity/chinese-zodiac", "EntertainmentApplication"),
        faqSchema([
          { question: "What is my Chinese zodiac sign?", answer: "Chinese zodiac is determined by birth year. 2024 Dragon 2023 Rabbit 2022 Tiger 2021 Ox 2020 Rat 2019 Pig 2018 Dog 2017 Rooster 2016 Monkey 2015 Goat 2014 Horse 2013 Snake. Note that Chinese New Year falls in January or February — people born in those months may belong to the previous year's animal." },
          { question: "What year is 2026 in the Chinese zodiac?", answer: "2026 is the Year of the Horse in the Chinese zodiac. Horse years are associated with energy freedom and independence. The previous Horse years were 2014 2002 1990 1978 1966." },
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Curiosity", url: "https://www.dayblip.com/curiosity" },
          { name: "Chinese Zodiac", url: "https://www.dayblip.com/curiosity/chinese-zodiac" },
        ]),
      ]} />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-3 text-4xl">🐉</div>
          <h1 className="mb-3 text-4xl font-bold text-white">Chinese Zodiac Calculator — Your Animal Sign and Meaning</h1>
          <p className="text-[#a8a8b3]">{currentYear} is the Year of the {currentAnimal.name} {currentAnimal.emoji}</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Curiosity", href: "/curiosity" }, { label: "Chinese Zodiac" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#e8e8e8", fontSize: "15px", lineHeight: "1.6" }}>The Chinese zodiac follows a 12-year cycle. 2024 was the Year of the Dragon. 2025 is the Year of the Snake. 2026 is the Year of the Horse. People born in 1984 1996 2008 2020 are Rats. Born in 1985 1997 2009 2021 are Oxen. Each animal has distinct personality traits compatible signs and lucky numbers in Chinese tradition.</p>
          </div>

          <p style={{ color: "#a8a8b3", fontSize: "14px", lineHeight: "1.7" }}>The Chinese zodiac assigns one of twelve animals to each year in a repeating 12-year cycle. Unlike Western astrology which is based on birth month the Chinese zodiac is based on birth year. Each animal carries specific personality traits compatible signs and auspicious associations. The cycle runs: Rat Ox Tiger Rabbit Dragon Snake Horse Goat Monkey Rooster Dog and Pig.</p>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-white">Birth year</span>
              <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)} placeholder="e.g. 1990"
                min={1900} max={2100}
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
            </label>
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-900/10 p-3 text-xs text-yellow-200">
              ⚠️ Note: Chinese New Year falls in January or February. If you were born in January or early February you may belong to the previous year&apos;s animal sign.
            </div>
          </div>

          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Find My Zodiac Animal
          </button>

          {animal && (
            <div className="space-y-4">
              {/* Main result */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <div className="text-6xl mb-2">{animal.emoji}</div>
                <div className="text-3xl font-black text-[#e94560]">{animal.name}</div>
                <div className="text-sm text-[#a8a8b3] mt-1">Element: {animal.element}</div>
              </div>

              {/* Personality */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                <h2 className="font-bold text-white">Personality Traits</h2>
                <div className="flex flex-wrap gap-2">
                  {animal.personality.map(t => (
                    <span key={t} className="rounded-full bg-[#16213e] border border-[#0f3460] px-3 py-1 text-sm text-[#4FC3F7]">{t}</span>
                  ))}
                </div>
              </div>

              {/* Lucky info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                  <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-2">Lucky Numbers</div>
                  <div className="text-lg font-black text-[#F9A825]">{animal.lucky.join(" · ")}</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                  <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-2">Lucky Colors</div>
                  <div className="text-sm font-semibold text-white">{animal.luckyColors.join(", ")}</div>
                </div>
              </div>

              {/* Compatibility */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                <h2 className="font-bold text-white">Compatibility</h2>
                <div>
                  <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-1">Best Matches</div>
                  <div className="flex flex-wrap gap-2">
                    {animal.best.map(a => {
                      const found = ANIMALS.find(x => x.name === a)
                      return <span key={a} className="rounded-full bg-green-900/30 border border-green-500/40 px-3 py-1 text-sm text-green-300">{found?.emoji} {a}</span>
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-1">Challenging Matches</div>
                  <div className="flex flex-wrap gap-2">
                    {animal.avoid.map(a => {
                      const found = ANIMALS.find(x => x.name === a)
                      return <span key={a} className="rounded-full bg-red-900/30 border border-red-500/40 px-3 py-1 text-sm text-red-300">{found?.emoji} {a}</span>
                    })}
                  </div>
                </div>
              </div>

              {/* Recent years */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-xs text-[#a8a8b3] uppercase tracking-wider mb-2">Recent {animal.name} Years</div>
                <div className="flex flex-wrap gap-2">
                  {animal.recentYears.map(y => (
                    <span key={y} className="rounded-lg bg-[#16213e] border border-[#0f3460] px-3 py-1 text-sm text-white">{y}</span>
                  ))}
                </div>
              </div>

              <ShareButtons text={shareText} url="https://www.dayblip.com/curiosity/chinese-zodiac" title="Chinese Zodiac Calculator" />
            </div>
          )}

          {/* Quick reference grid */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
            <div className="text-sm font-bold text-white mb-3">All 12 Animals — Quick Reference</div>
            <div className="grid grid-cols-4 gap-2">
              {ANIMALS.map(a => (
                <button key={a.name} onClick={() => setAnimal(a)}
                  className="rounded-lg border border-[#0f3460] bg-[#16213e] p-2 text-center hover:border-[#e94560] transition-colors">
                  <div className="text-xl">{a.emoji}</div>
                  <div className="text-xs text-[#a8a8b3] mt-0.5">{a.name}</div>
                </button>
              ))}
            </div>
          </div>

          <RelatedTools tools={[
            { emoji: "🔢", title: "Numerology Calculator", desc: "Your life path number and meaning", href: "/curiosity/numerology" },
            { emoji: "🎂", title: "Birthday Personality", desc: "What your birthday says about you", href: "/tools/birthday-personality" },
            { emoji: "⭐", title: "Star Sign Calculator", desc: "Your western astrology sign", href: "/star-sign" },
            { emoji: "❤️", title: "Love Compatibility", desc: "Are you compatible with your partner?", href: "/curiosity/compatibility" },
          ]} />
        </div>
      </section>
    </div>
  )
}
