import type { Metadata } from "next";
import Link from "next/link";
import bornInRaw from "@/data/bornIn.json";

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

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { year: string };
}): Promise<Metadata> {
  const year = parseInt(params.year, 10);
  const label = isNaN(year) ? params.year : String(year);
  return {
    title: `Born in ${label} | What Was The World Like?`,
    description: `Discover what the world looked like in ${label}. The #1 song, top movies, gas prices and major events from the year you were born.`,
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

  // ── Invalid year ───────────────────────────────────────────────────────
  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#1a1a2e] px-6 text-center">
        <span className="text-6xl">📅</span>
        <h1 className="text-3xl font-bold text-white">Invalid Year</h1>
        <p className="text-[#a8a8b3]">
          Please enter a year between 1900 and {currentYear}.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    );
  }

  // ── Data lookup ────────────────────────────────────────────────────────
  const data    = bornInData.find((d) => d.year === yearNum) ?? null;
  const age     = currentYear - yearNum;
  // Approximate days alive — using July 1 as mid-year assumed birthday
  const daysAlive = Math.floor(
    (Date.now() - new Date(yearNum, 6, 1).getTime()) / 86400000,
  );

  // Share URLs
  const pageUrl      = `https://dayblip.com/born-in/${yearNum}`;
  const tweetText    = encodeURIComponent(
    `I was born in ${yearNum}! Check out what the world looked like when I arrived 👶 dayblip.com/born-in/${yearNum}`,
  );
  const fbShareUrl   = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const xShareUrl    = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
      >
        <div className="mx-auto max-w-[900px]">
          {/* Decorative year watermark */}
          <div className="select-none text-8xl font-black leading-none text-white/5 md:text-9xl">
            {yearNum}
          </div>
          <h1 className="-mt-6 text-4xl font-bold text-white md:text-5xl mb-4">
            Born in {yearNum}? Here&apos;s Your World.
          </h1>
          <p className="mb-1 text-lg text-[#a8a8b3]">
            You are{" "}
            <span className="font-bold text-white">{age} years old</span> today
          </p>
          <p className="text-[#a8a8b3]">
            You have been alive approximately{" "}
            <span className="font-bold text-[#e94560]">
              {commas(daysAlive)} days
            </span>
          </p>
        </div>
      </section>

      {/* ── STATS GRID or NO-DATA ────────────────────────────────────── */}
      {data ? (
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              The World in {yearNum}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {getStats(data).map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4"
                >
                  <span className="text-2xl">{stat.emoji}</span>
                  <span className="text-xs uppercase tracking-wider text-[#a8a8b3]">
                    {stat.label}
                  </span>
                  <span className="text-sm font-semibold leading-tight text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px] text-center">
            <span className="mb-4 block text-5xl">🔍</span>
            <h2 className="mb-3 text-2xl font-bold text-white">
              We don&apos;t have data for {yearNum} yet
            </h2>
            <p className="mb-8 text-[#a8a8b3]">
              We&apos;re working on adding more years. Try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_YEARS.map((y) => (
                <Link
                  key={y}
                  href={`/born-in/${y}`}
                  className="rounded-full bg-[#0f3460] px-5 py-2 text-white transition-colors hover:bg-[#e94560]"
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WORLD EVENT ─────────────────────────────────────────────── */}
      {data && (
        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-6 text-2xl font-bold text-white">
              The Biggest News Story of {yearNum}
            </h2>
            <div className="mb-4 rounded-xl border border-[#e94560]/30 bg-[#16213e] p-6">
              <p className="text-lg leading-relaxed text-white">
                {data.worldEvent}
              </p>
            </div>
            <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
              <p className="mb-2 text-xs uppercase tracking-wider text-[#e94560]">
                Fun Fact
              </p>
              <p className="leading-relaxed text-[#a8a8b3]">{data.funFact}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── AGE MILESTONES ───────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-8 text-2xl font-bold text-white">
            Your Age Milestones
          </h2>
          <div className="flex flex-col gap-3">
            {AGE_MILESTONES.map((milestone) => {
              const milestoneYear = yearNum + milestone;
              const isPast        = milestoneYear <= currentYear;
              return (
                <div
                  key={milestone}
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 ${
                    isPast
                      ? "border-[#0f3460] bg-[#1a1a2e]"
                      : "border-[#e94560]/20 bg-[#1a1a2e]"
                  }`}
                >
                  <span className="text-white">
                    {isPast ? "Turned" : "Will turn"}{" "}
                    <span className="text-xl font-bold text-[#e94560]">
                      {milestone}
                    </span>
                  </span>
                  <span className="text-[#a8a8b3]">in {milestoneYear}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SHARE ───────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Share Your Birth Year
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href={fbShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1877f2] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Share on Facebook →
            </a>
            <a
              href={xShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#000000] border border-[#333] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Share on X →
            </a>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION ──────────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[900px]">
          {/* Prev / Next */}
          <div className="mb-8 flex items-center justify-between gap-4">
            {yearNum > 1900 ? (
              <Link
                href={`/born-in/${yearNum - 1}`}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-5 py-3 text-white transition-colors hover:border-[#e94560]"
              >
                ← Born in {yearNum - 1}
              </Link>
            ) : (
              <div />
            )}
            {yearNum < currentYear ? (
              <Link
                href={`/born-in/${yearNum + 1}`}
                className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-5 py-3 text-white transition-colors hover:border-[#e94560]"
              >
                Born in {yearNum + 1} →
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Popular year pills */}
          <p className="mb-4 text-center text-sm text-[#a8a8b3]">
            Popular Years
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_YEARS.map((y) => (
              <Link
                key={y}
                href={`/born-in/${y}`}
                className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                  y === yearNum
                    ? "border-[#e94560] bg-[#e94560]/10 text-[#e94560]"
                    : "border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
