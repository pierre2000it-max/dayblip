import type { Metadata } from "next";
import Link from "next/link";
import bornInRaw from "@/data/bornIn.json";
import { generateBornInSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import AdUnit from "@/components/AdUnit";
import RelatedTools from "@/components/RelatedTools";
import ShareCard from "@/components/ShareCard";
import ShareButtons from "@/components/ShareButtons";

// ── Types ────────────────────────────────────────────────────────────────────

interface BornInData {
  year: number;
  number1Song: string;
  number1Movie: string;
  topTV: string;
  gasPrice: string;
  minWage: string;
  newCar: string;
  newHome: string;
  population: string;
  president: string;
  superBowl: string;
  worldEvent: string;
  funFact: string;
}

const bornInData = bornInRaw as BornInData[];
const BASE       = "https://www.dayblip.com";

// ── Helpers ───────────────────────────────────────────────────────────────────

function commas(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getStats(d: BornInData) {
  return [
    { emoji: "🎵", label: "#1 Song",           value: d.number1Song },
    { emoji: "🎬", label: "#1 Movie",           value: d.number1Movie },
    { emoji: "📺", label: "Top TV Show",        value: d.topTV },
    { emoji: "⛽", label: "Gas Price",          value: d.gasPrice },
    { emoji: "💵", label: "Min. Wage",          value: d.minWage },
    { emoji: "🚗", label: "Average New Car",    value: d.newCar },
    { emoji: "🏠", label: "Average New Home",   value: d.newHome },
    { emoji: "🌍", label: "World Population",   value: d.population },
    { emoji: "🎙️", label: "US President",       value: d.president },
    { emoji: "🏆", label: "Super Bowl Winner",  value: d.superBowl },
  ];
}

const AGE_MILESTONES = [10, 18, 21, 30, 50];
const POPULAR_YEARS  = [1985, 1990, 1995, 2000, 2005, 2010];

// Split "Song Title - Artist" into its two parts.
function splitSong(raw: string): { song: string; artist: string } {
  const idx = raw.indexOf(" - ");
  if (idx === -1) return { song: raw.trim(), artist: "" };
  return { song: raw.slice(0, idx).trim(), artist: raw.slice(idx + 3).trim() };
}

// Build a unique 2-3 sentence intro paragraph from the year's own data.
function buildIntro(d: BornInData): string {
  const { song, artist } = splitSong(d.number1Song);
  const event   = d.worldEvent.replace(/\.\s*$/, "");
  const songClause = artist
    ? `${song} by ${artist} was the number one song`
    : `${song} was the number one song`;
  return `${d.year} was a year the world would not forget — ${event.charAt(0).toLowerCase()}${event.slice(1)}. ${songClause}, while ${d.number1Movie} packed out movie theaters. Gas cost just ${d.gasPrice} a gallon and the global population stood at ${d.population}.`;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { year: string };
}): Promise<Metadata> {
  const year  = parseInt(params.year, 10);
  const label = isNaN(year) ? params.year : String(year);
  const data  = isNaN(year) ? null : bornInData.find((d) => d.year === year) ?? null;

  const title = data
    ? `Born in ${label}? ${data.worldEvent} | What The World Was Like`
    : `Born in ${label} | What Was The World Like?`;
  const desc  = data
    ? `In ${label}, ${data.worldEvent.replace(/\.\s*$/, "")}. "${splitSong(data.number1Song).song}" topped the charts, gas cost ${data.gasPrice} a gallon and the world population was ${data.population}. See every fact from the year you were born.`
    : `Discover what the world looked like in ${label}. The #1 song, top movies, gas prices and major events from the year you were born.`;
  const url   = `https://www.dayblip.com/born-in/${label}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, type: "article", url,
      images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BornInPage({
  params,
}: {
  params: { year: string };
}) {
  const yearNum     = parseInt(params.year, 10);
  const currentYear = new Date().getFullYear();
  const isValid     = !isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear;

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#1a1a2e] px-6 text-center">
        <span className="text-6xl">📅</span>
        <h1 className="text-3xl font-bold text-white">Invalid Year</h1>
        <p className="text-[#a8a8b3]">Please enter a year between 1900 and {currentYear}.</p>
        <Link href="/" className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
          Go Home
        </Link>
      </div>
    );
  }

  const data      = bornInData.find((d) => d.year === yearNum) ?? null;
  const age       = currentYear - yearNum;
  const daysAlive = Math.floor((Date.now() - new Date(yearNum, 6, 1).getTime()) / 86400000);

  const pageUrl   = `${BASE}/born-in/${yearNum}`;

  // JSON-LD schemas
  const articleSchema    = generateBornInSchema(yearNum);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home",    url: BASE },
    { name: "Born In", url: `${BASE}/born-in` },
    { name: String(yearNum), url: pageUrl },
  ]);

  const bornInFaqSchema = data ? faqSchema([
    { question: `What was the #1 song in ${yearNum}?`, answer: `The number one song of ${yearNum} was ${data.number1Song}. Find more facts about ${yearNum} at dayblip.com/born-in/${yearNum}` },
    { question: `What was the top movie in ${yearNum}?`, answer: `The top movie of ${yearNum} was ${data.number1Movie}. Discover more about what happened in ${yearNum} at dayblip.com.` },
    { question: `How much did gas cost in ${yearNum}?`, answer: `Gas cost approximately ${data.gasPrice} per gallon in ${yearNum}.` },
    { question: `What was the world population in ${yearNum}?`, answer: `The world population in ${yearNum} was approximately ${data.population}.` },
    { question: `What major events happened in ${yearNum}?`, answer: `Major events of ${yearNum} included: ${data.worldEvent}.` },
  ]) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {bornInFaqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bornInFaqSchema) }} />}

      <div className="min-h-screen bg-[#1a1a2e]">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="px-6 py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
          <div className="mx-auto max-w-[900px]">
            <div className="select-none text-8xl font-black leading-none text-white/5 md:text-9xl">{yearNum}</div>
            <h1 className="-mt-6 mb-4 text-4xl font-bold text-white md:text-5xl">
              Born in {yearNum}? Here&apos;s Your World.
            </h1>
            <p className="mb-1 text-lg text-[#a8a8b3]">
              You are <span className="font-bold text-white">{age} years old</span> today
            </p>
            <p style={{ color: '#a8a8b3', fontSize: '15px', lineHeight: '1.7', margin: '12px 0 24px 0' }}>
              Also explore:{' '}
              <a href="/tools/life-in-weeks" style={{ color: '#e94560', textDecoration: 'none' }}>your life in weeks</a>,{' '}
              <a href="/number-one-song" style={{ color: '#e94560', textDecoration: 'none' }}>your number one song</a>,{' '}
              <a href="/birthday-twins" style={{ color: '#e94560', textDecoration: 'none' }}>your celebrity birthday twins</a>,
              and{' '}
              <a href="/tools/generation-quiz" style={{ color: '#e94560', textDecoration: 'none' }}>your generation</a>.
            </p>
            <p className="text-[#a8a8b3]">
              You have been alive approximately{" "}
              <span className="font-bold text-[#e94560]">{commas(daysAlive)} days</span>
            </p>
          </div>
        </section>

        {/* ── INTRO ─────────────────────────────────────────────────── */}
        {data && (
          <p
            className="mx-auto pt-10 text-center"
            style={{
              fontSize: "16px",
              color: "#a8a8b3",
              maxWidth: "700px",
              padding: "0 20px 24px",
            }}
          >
            {buildIntro(data)}
          </p>
        )}

        {/* ── STATS or NO-DATA ──────────────────────────────────────── */}
        {data ? (
          <section className="bg-[#16213e] px-6 py-14">
            <div className="mx-auto max-w-[1200px]">
              <h2 className="mb-8 text-center text-2xl font-bold text-white">The World in {yearNum}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {getStats(data).map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                    <span className="text-2xl">{stat.emoji}</span>
                    <span className="text-xs uppercase tracking-wider text-[#a8a8b3]">{stat.label}</span>
                    <span className="text-sm font-semibold leading-tight text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-[#16213e] px-6 py-14">
            <div className="mx-auto max-w-[900px] text-center">
              <span className="mb-4 block text-5xl">🔍</span>
              <h2 className="mb-3 text-2xl font-bold text-white">We don&apos;t have data for {yearNum} yet</h2>
              <p className="mb-8 text-[#a8a8b3]">We&apos;re working on adding more years. Try one of these:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {POPULAR_YEARS.map((y) => (
                  <Link key={y} href={`/born-in/${y}`}
                    className="rounded-full bg-[#0f3460] px-5 py-2 text-white transition-colors hover:bg-[#e94560]">
                    {y}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ad — below stats grid */}
        {data && (
          <div className="bg-[#16213e] px-6 pb-4">
            <div className="mx-auto max-w-[1200px]">
              <AdUnit slot="1234567890" format="rectangle" />
            </div>
          </div>
        )}

        {/* ── WORLD EVENT ───────────────────────────────────────────── */}
        {data && (
          <section className="bg-[#1a1a2e] px-6 py-14">
            <div className="mx-auto max-w-[900px]">
              <h2 className="mb-6 text-2xl font-bold text-white">The Biggest News Story of {yearNum}</h2>
              <div className="mb-4 rounded-xl border border-[#e94560]/30 bg-[#16213e] p-6">
                <p className="text-lg leading-relaxed text-white">{data.worldEvent}</p>
              </div>
              <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
                <p className="mb-2 text-xs uppercase tracking-wider text-[#e94560]">Fun Fact</p>
                <p className="leading-relaxed text-[#a8a8b3]">{data.funFact}</p>
              </div>
            </div>
          </section>
        )}

        {/* Ad — between world events and milestones */}
        <div className="bg-[#1a1a2e] px-6 pb-4">
          <div className="mx-auto max-w-[900px]">
            <AdUnit slot="1234567890" format="rectangle" />
          </div>
        </div>

        {/* ── MILESTONES ────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">Your Age Milestones</h2>
            <div className="flex flex-col gap-3">
              {AGE_MILESTONES.map((milestone) => {
                const milestoneYear = yearNum + milestone;
                const isPast        = milestoneYear <= currentYear;
                return (
                  <div key={milestone}
                    className={`flex items-center justify-between rounded-xl border px-5 py-4 ${isPast ? "border-[#0f3460] bg-[#1a1a2e]" : "border-[#e94560]/20 bg-[#1a1a2e]"}`}>
                    <span className="text-white">
                      {isPast ? "Turned" : "Will turn"}{" "}
                      <span className="text-xl font-bold text-[#e94560]">{milestone}</span>
                    </span>
                    <span className="text-[#a8a8b3]">in {milestoneYear}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ad — above share section */}
        <div className="bg-[#16213e] px-6 pb-4">
          <div className="mx-auto max-w-[900px]">
            <AdUnit slot="1234567890" format="leaderboard" />
          </div>
        </div>

        {/* ── SHARE ─────────────────────────────────────────────────── */}
        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <ShareButtons
              text={`I was born in ${yearNum}! Check out what the world looked like when I arrived 👶`}
              url={pageUrl}
              title={`Born in ${yearNum} — What Happened That Year`}
            />
          </div>
        </section>

        {/* ── SHARE CARD ────────────────────────────────────────────── */}
        {data && (
          <section className="bg-[#16213e] px-6 py-14">
            <div className="mx-auto max-w-[900px]">
              <ShareCard
                year={yearNum}
                number1Song={data.number1Song}
                number1Movie={data.number1Movie}
                gasPrice={data.gasPrice}
                population={data.population}
              />
            </div>
          </section>
        )}

        {/* ── NAVIGATION ────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            <div className="mb-8 flex items-center justify-between gap-4">
              {yearNum > 1900 ? (
                <Link href={`/born-in/${yearNum - 1}`}
                  className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-5 py-3 text-white transition-colors hover:border-[#e94560]">
                  ← Born in {yearNum - 1}
                </Link>
              ) : <div />}
              {yearNum < currentYear ? (
                <Link href={`/born-in/${yearNum + 1}`}
                  className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-5 py-3 text-white transition-colors hover:border-[#e94560]">
                  Born in {yearNum + 1} →
                </Link>
              ) : <div />}
            </div>
            <p className="mb-4 text-center text-sm text-[#a8a8b3]">Popular Years</p>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_YEARS.map((y) => (
                <Link key={y} href={`/born-in/${y}`}
                  className={`rounded-full border px-5 py-2 text-sm transition-colors ${y === yearNum ? "border-[#e94560] bg-[#e94560]/10 text-[#e94560]" : "border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"}`}>
                  {y}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED TOOLS ─────────────────────────────────────────────────── */}
        <section className="bg-[#1a1a2e] px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            {/* Cluster mesh block — do not remove */}
            <div style={{ background: '#1e2d4a', borderRadius: '12px', padding: '24px', margin: '0 0 32px 0' }}>
              <p style={{ color: '#a8a8b3', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>Explore Your Story</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="/tools/life-in-weeks" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>📅 Life in Weeks</a>
                <a href="/tools/generation-quiz" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🧬 What Generation Am I?</a>
                <a href="/number-one-song" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🎵 #1 Song on Your Birthday</a>
                <a href="/birthday-twins" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🎂 Celebrity Birthday Twins</a>
                <a href="/tools/name-popularity" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🔤 Name Popularity</a>
                <a href="/tools/this-year-progress" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>📊 Year Progress</a>
                <a href="/tools/where-you-rank" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>🏆 Where Do You Rank?</a>
                <a href="/tools/couple-compatibility" style={{ color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>💑 Couple Compatibility</a>
              </div>
            </div>
            <RelatedTools title="Explore More" tools={[
              { emoji: "📅", title: "Life in Weeks", desc: "See your entire life as a grid of weeks", href: "/tools/life-in-weeks" },
              { emoji: "🧬", title: "What Generation Am I?", desc: "Find your true generational identity", href: "/tools/generation-quiz" },
              { emoji: "🎵", title: "#1 Song on Your Birthday", desc: "Discover the hit song from your birth year", href: "/number-one-song" },
              { emoji: "🎂", title: "Celebrity Birthday Twins", desc: "Famous people who share your birthday", href: "/birthday-twins" },
            ]} />
          </div>
        </section>

      </div>
    </>
  );
}
