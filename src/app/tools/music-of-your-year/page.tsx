"use client"
import { useState, useEffect } from "react"
import ShareButtons from "@/components/ShareButtons"
import bornInData from "@/data/bornIn.json"
import RelatedTools from "@/components/RelatedTools"

interface BornIn { year: number; number1Song: string }
const SONGS = bornInData as BornIn[]

const decadeMusic: Record<string, { era: string; description: string; artists: string[]; genre: string; personality: string }> = {
  "1960s": { era: "The British Invasion and Motown", description: "The Beatles, Rolling Stones and Motown dominated. Rock and roll was transforming into something revolutionary.", artists: ["The Beatles", "The Rolling Stones", "Aretha Franklin", "Bob Dylan", "Motown artists"], genre: "Rock, Soul, Folk", personality: "You are a Classic Soul" },
  "1970s": { era: "Disco, Funk and Classic Rock", description: "Disco ruled the dance floors while Led Zeppelin and Pink Floyd defined rock. Funk brought groove to everything.", artists: ["Led Zeppelin", "ABBA", "Fleetwood Mac", "Bee Gees", "David Bowie", "Elton John"], genre: "Disco, Classic Rock, Funk", personality: "You are a Disco/Rock Legend" },
  "1980s": { era: "Synth Pop, Hair Metal and Hip Hop Dawn", description: "MTV changed music forever. Synthesizers defined the sound. Michael Jackson became the King of Pop.", artists: ["Michael Jackson", "Madonna", "Prince", "Bruce Springsteen", "Whitney Houston"], genre: "Pop, Rock, Early Hip Hop, Synth", personality: "You are a Pop Icon Era" },
  "1990s": { era: "Grunge, Boy Bands and Hip Hop", description: "Nirvana kicked in the alternative era while hip hop became mainstream. Boy bands ruled teen culture.", artists: ["Nirvana", "Tupac", "Biggie", "Backstreet Boys", "Mariah Carey", "TLC"], genre: "Grunge, Hip Hop, R&B, Pop", personality: "You are a 90s Alternative Kid" },
  "2000s": { era: "Pop Punk, R&B and Digital Revolution", description: "iTunes changed how we bought music. Pop punk exploded while R&B ruled the charts. MySpace launched music careers.", artists: ["Eminem", "Beyonce", "Justin Timberlake", "Linkin Park", "Nelly", "Usher"], genre: "Pop Punk, R&B, Rap, Pop", personality: "You are a Digital Music Pioneer" },
  "2010s": { era: "Streaming Era and Hip Hop Takeover", description: "Spotify and streaming changed everything. Hip hop became the most popular genre. EDM exploded globally.", artists: ["Drake", "Taylor Swift", "Adele", "Ed Sheeran", "Kendrick Lamar", "Beyonce"], genre: "Hip Hop, Pop, EDM, Indie", personality: "You are a Streaming Generation" },
}

function decadeKey(year: number): string {
  if (year >= 2020) return "2010s"
  const d = Math.floor(year / 10) * 10
  const key = `${d}s`
  return decadeMusic[key] ? key : "2010s"
}

function parseSong(raw: string): { song: string; artist: string } {
  const parts = raw.split(" - ")
  if (parts.length >= 2) return { song: parts[0].trim(), artist: parts.slice(1).join(" - ").trim() }
  return { song: raw, artist: "" }
}

interface Result { year: number; song: string; artist: string; decade: string }

function compute(year: number): Result | null {
  if (year < 1960 || year > 2020) return null
  const entry = SONGS.find(s => s.year === year)
  const { song, artist } = entry ? parseSong(entry.number1Song) : { song: "", artist: "" }
  return { year, song, artist, decade: decadeKey(year) }
}

export default function MusicOfYourYearPage() {
  const [year, setYear] = useState("1990")
  const [result, setResult] = useState<Result | null>(null)

  function runCalc(push = true, y = year) {
    const res = compute(Number(y))
    setResult(res)
    if (res && push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?year=${y}`)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const y = p.get("year")
    if (y) { setYear(y); setResult(compute(Number(y))) }
  }, [])

  const info = result ? decadeMusic[result.decade] : null
  const query = result ? encodeURIComponent(`${result.song} ${result.artist}`) : ""

  const shareUrl = result ? `https://www.dayblip.com/tools/music-of-your-year?year=${result.year}` : ""
  const shareText = result && info
    ? `The #1 song the year I was born was ${result.song || "a hit"}${result.artist ? ` by ${result.artist}` : ""}!\nI am a ${info.personality.replace(/^You are /, "")} 🎵\nDiscover your music era:`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Music of Your Year — Songs That Defined the Year You Were Born</h1>
          <p className="text-[#a8a8b3]">Discover the songs and sounds that defined the year you arrived</p>
        </div>
      </section>
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Music from your adolescence (ages 12-25) is processed differently by the brain and forms stronger memories than music heard at any other life stage. This is called the reminiscence bump. The songs that topped the charts the year you were born reflect the cultural moment that shaped the world you arrived into — from technology and politics to fashion and values.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The music of your birth year captures a cultural snapshot of the world at the moment you arrived. Top songs, albums and artists from your birth year reflect the sounds, attitudes and events that shaped your parents and the society that would raise you. This tool shows the number one songs and defining music of any birth year from 1970 to 2020.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-white">Your birth year</span>
            <input type="number" min={1960} max={2020} value={year} onChange={e => setYear(e.target.value)} className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
          </label>
          <button onClick={() => runCalc()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Show My Music Era
          </button>

          {result && info && (
            <div className="space-y-6">
              {result.song && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center text-white">
                  <div className="text-sm text-[#a8a8b3]">🎵 The #1 song of {result.year}</div>
                  <div className="my-2 text-2xl font-black text-[#F9A825]">{result.song}</div>
                  {result.artist && <div className="text-[#a8a8b3]">by {result.artist}</div>}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <a href={`https://www.youtube.com/results?search_query=${query}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#FF0000] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85">▶ Listen on YouTube →</a>
                    <a href={`https://open.spotify.com/search/${query}`} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#1DB954] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85">🎧 Find on Spotify →</a>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-white">
                <div className="text-sm text-[#a8a8b3]">Your music era — the {result.decade}</div>
                <div className="my-1 text-xl font-bold text-[#e94560]">{info.era}</div>
                <p className="mt-2 text-sm text-[#a8a8b3]">{info.description}</p>
                <p className="mt-3 text-sm"><span className="font-bold text-[#a8a8b3]">Key artists: </span>{info.artists.join(", ")}</p>
                <p className="mt-1 text-sm"><span className="font-bold text-[#a8a8b3]">Genres: </span>{info.genre}</p>
              </div>

              <div className="rounded-xl border border-[#e94560]/40 bg-[#e94560]/10 p-6 text-center text-white">
                <div className="text-sm text-[#a8a8b3]">Your music personality</div>
                <div className="mt-1 text-2xl font-black text-[#F9A825]">{info.personality} 🎵</div>
              </div>

              <ShareButtons text={shareText} url={shareUrl} title="The Music of Your Birth Year" />
            </div>
          )}          <RelatedTools tools={[
            { emoji: "🎂", title: "Born In Explorer", desc: "Explore your birth year", href: "/born-in" },
            { emoji: "🎯", title: "Generation Quiz", desc: "What generation are you?", href: "/tools/generation-quiz" },
            { emoji: "🌟", title: "Birthday Personality", desc: "Your birthday traits", href: "/tools/birthday-personality" },
            { emoji: "🎂", title: "Age Calculator", desc: "How old are you exactly?", href: "/age-calculator" },
          ]} />

        </div>
      </section>
    </div>
  )
}
