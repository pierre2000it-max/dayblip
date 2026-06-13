"use client";

import { useState } from "react";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import RelatedTools from "@/components/RelatedTools";
import bornInRaw from "@/data/bornIn.json";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BornIn {
  year: number;
  number1Song: string;
  number1Movie: string;
  gasPrice: string;
}

const bornInData = bornInRaw as BornIn[];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSong(str: string): { title: string; artist: string } {
  const idx = str.indexOf(" - ");
  if (idx === -1) return { title: str, artist: "" };
  return { title: str.slice(0, idx), artist: str.slice(idx + 3) };
}

const WEEKS_AT_NUMBER_ONE: Record<string, number> = {
  "Call Me":                                  6,
  "Bette Davis Eyes":                        9,
  "Physical":                               10,
  "Every Breath You Take":                  8,
  "When Doves Cry":                         5,
  "Careless Whisper":                        3,
  "That's What Friends Are For":            4,
  "Walk Like an Egyptian":                  4,
  "Faith":                                   4,
  "Look Away":                               4,
  "Nothing Compares 2 U":                   4,
  "Everything I Do I Do It For You":        16,
  "End of the Road":                        13,
  "I Will Always Love You":                 14,
  "The Sign":                                6,
  "Gangsta's Paradise":                      3,
  "Macarena":                               14,
  "Candle in the Wind":                     14,
  "Too Close":                               4,
  "Believe":                                 4,
  "Breathe":                                 3,
  "Hanging by a Moment":                     8,
  "How You Remind Me":                       4,
  "In da Club":                             9,
  "Yeah!":                                  12,
  "We Belong Together":                     16,
  "Bad Day":                                 5,
  "Irreplaceable":                           5,
  "Low":                                     10,
  "Boom Boom Pow":                          12,
  "TiK ToK":                               9,
  "Rolling in the Deep":                    7,
  "Somebody That I Used to Know":            8,
  "Thrift Shop":                             6,
  "Happy":                                   10,
  "Uptown Funk":                            14,
  "One Dance":                               10,
  "Shape of You":                           12,
  "God's Plan":                             11,
  "Old Town Road":                          19,
  "Blinding Lights":                         4,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function NumberOneSongTool() {
  const [dateInput, setDateInput] = useState("");
  const [result,    setResult]    = useState<{ data: BornIn; song: ReturnType<typeof parseSong> } | null>(null);
  const [year,      setYear]      = useState<number | null>(null);
  const [error,     setError]     = useState("");

  const findSong = () => {
    if (!dateInput) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dateInput + "T00:00:00");
    const y     = birth.getFullYear();
    setYear(y);
    setError("");

    const data = bornInData.find(d => d.year === y);
    if (!data) { setResult(null); return; }
    setResult({ data, song: parseSong(data.number1Song) });
  };


  // Nearest year in data
  const nearestYear = year && !result
    ? bornInData.reduce((best, d) => Math.abs(d.year - year) < Math.abs(best.year - year) ? d : best).year
    : null;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎵</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">What Was #1 On Your Birthday?</h1>
          <p className="text-lg text-[#a8a8b3]">Discover the #1 song the week you were born</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={findSong}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Find My Song →
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {/* Result card */}
          {result && (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-8 text-center">
                <p className="text-[#a8a8b3] text-sm mb-3">🎵 #1 Song in {result.data.year}</p>
                <div className="text-6xl mb-4">🎼</div>
                <h2 className="text-3xl font-black text-white mb-2">{result.song.title}</h2>
                <p className="text-xl text-[#e94560] font-semibold">{result.song.artist}</p>
                <p className="text-[#a8a8b3] mt-1">{result.data.year}</p>
              </div>

              {/* Fun facts */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-3">
                <h3 className="font-bold text-white mb-2">Fun Facts</h3>
                {WEEKS_AT_NUMBER_ONE[result.song.title] && (
                  <div className="flex items-start gap-3">
                    <span className="text-[#e94560]">→</span>
                    <span className="text-[#a8a8b3]">
                      This song spent approximately <strong className="text-white">{WEEKS_AT_NUMBER_ONE[result.song.title]} weeks</strong> at #1
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3]">Gas cost <strong className="text-white">{result.data.gasPrice}</strong> per gallon that year</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3]">
                    The #1 movie was <strong className="text-white">{result.data.number1Movie}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/born-in/${result.data.year}`}
                  className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  See everything from {result.data.year} →
                </Link>
              </div>
              {result && (
                <ShareButtons
                  text={`The #1 song the week I was born was "${result.song.title}" by ${result.song.artist}! Find yours!`}
                  url="https://dayblip.com/number-one-song"
                  title="Number One Song on My Birthday"
                />
              )}
            </div>
          )}

          {/* Year not in data */}
          {year && !result && dateInput && (
            <div className="mt-8 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
              <p className="text-[#a8a8b3] mb-4">We don&apos;t have data for {year} yet.</p>
              {nearestYear && (
                <Link href={`/born-in/${nearestYear}`}
                  className="inline-block rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Check out Born In {nearestYear} →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#1a1a2e] px-6 py-12">
        <div className="mx-auto max-w-[700px]">
          {/* Cluster mesh block — do not remove */}
          <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', margin: '0 0 32px 0' }}>
            <p style={{ color: '#a8a8b3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Explore Your Story</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a href="/born-in" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🌍 Born In Your Year</a>
              <a href="/tools/life-in-weeks" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>📅 Life in Weeks</a>
              <a href="/tools/generation-quiz" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🧬 What Generation Am I?</a>
              <a href="/birthday-twins" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🎂 Celebrity Birthday Twins</a>
            </div>
          </div>
          <RelatedTools tools={[
            { emoji: "🌍", title: "Born In Your Year", desc: "Facts, events and history from when you arrived", href: "/born-in" },
            { emoji: "📅", title: "Life in Weeks", desc: "See your entire life as a grid of weeks", href: "/tools/life-in-weeks" },
            { emoji: "🧬", title: "What Generation Am I?", desc: "Find your true generational identity", href: "/tools/generation-quiz" },
            { emoji: "🎂", title: "Celebrity Birthday Twins", desc: "Famous people who share your birthday", href: "/birthday-twins" },
          ]} />
        </div>
      </section>
    </div>
  );
}
