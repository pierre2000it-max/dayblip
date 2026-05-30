"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdUnit from "@/components/AdUnit";

// ── WebSite JSON-LD schema ─────────────────────────────────────────────────
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dayblip",
  "url": "https://dayblip.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://dayblip.com/days-until/{search_term}",
    "query-input": "required name=search_term",
  },
};

// ── Easter: Anonymous Gregorian algorithm ──────────────────────────────────
function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// ── 4th Thursday of November ──────────────────────────────────────────────
function getThanksgiving(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const daysToFirstThu = (4 - nov1.getDay() + 7) % 7;
  return new Date(year, 10, 1 + daysToFirstThu + 21);
}

// ── Days until next occurrence of a recurring holiday ─────────────────────
function nextOccurrence(getDate: (year: number) => Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let target = getDate(today.getFullYear());
  target.setHours(0, 0, 0, 0);
  if (target <= today) {
    target = getDate(today.getFullYear() + 1);
    target.setHours(0, 0, 0, 0);
  }
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

// ── Holiday data ───────────────────────────────────────────────────────────
const HOLIDAYS = [
  { emoji: "🎄", name: "Christmas",         slug: "christmas",       getDate: (y: number) => new Date(y, 11, 25) },
  { emoji: "🎃", name: "Halloween",          slug: "halloween",        getDate: (y: number) => new Date(y,  9, 31) },
  { emoji: "🦃", name: "Thanksgiving",       slug: "thanksgiving",     getDate: getThanksgiving },
  { emoji: "🎆", name: "New Year's",         slug: "new-years",        getDate: (y: number) => new Date(y,  0,  1) },
  { emoji: "💝", name: "Valentine's Day",    slug: "valentines-day",   getDate: (y: number) => new Date(y,  1, 14) },
  { emoji: "🍀", name: "St. Patrick's Day",  slug: "st-patricks-day",  getDate: (y: number) => new Date(y,  2, 17) },
  { emoji: "🐣", name: "Easter",             slug: "easter",           getDate: getEaster },
  { emoji: "🇺🇸", name: "Independence Day",  slug: "independence-day", getDate: (y: number) => new Date(y,  6,  4) },
];

const MONTH_LONG  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const QUICK_PICKS = [
  { label: "🎄 Christmas",   href: "/days-until/christmas" },
  { label: "🎃 Halloween",   href: "/days-until/halloween" },
  { label: "🎆 New Year's",  href: "/days-until/new-years" },
  { label: "💝 Valentine's", href: "/days-until/valentines-day" },
];

const TOOLS = [
  {
    emoji: "🎂",
    title: "Age Calculator",
    desc: "Find out exactly how old you are in days, weeks and months",
    href: "/age-calculator",
  },
  {
    emoji: "📅",
    title: "Date Calculator",
    desc: "Add or subtract days from any date instantly",
    href: "/date-calculator",
  },
  {
    emoji: "⏱",
    title: "Days Between",
    desc: "Find the exact number of days between two dates",
    href: "/days-between",
  },
];

const HISTORY_FACTS = [
  { year: "1863", fact: "Emancipation Proclamation took effect" },
  { year: "1892", fact: "Ellis Island opened" },
  { year: "1959", fact: "Fidel Castro took power in Cuba" },
];

export default function HomePage() {
  const router = useRouter();
  const [dateInput, setDateInput]   = useState("");
  const [yearInput, setYearInput]   = useState("");
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => { setHeroVisible(true); }, []);

  const today       = new Date();
  const todayDisplay = `${DAY_NAMES[today.getDay()]}, ${MONTH_LONG[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
  const todaySlug   = `${MONTH_SHORT[today.getMonth()]}-${today.getDate()}`;

  const handleCalculate = () => {
    if (dateInput) router.push(`/days-until/${dateInput}`);
  };

  const handleBornIn = () => {
    const y = parseInt(yearInput, 10);
    if (y >= 1900 && y <= today.getFullYear()) router.push(`/born-in/${yearInput}`);
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════ */}
      <section
        className="flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
      >
        <h1
          className={`text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-1000 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          How Many Days Until...?
        </h1>

        <p
          className={`text-lg md:text-xl text-[#a8a8b3] mb-10 max-w-xl transition-all duration-1000 delay-200 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Countdowns, date tools &amp; curious facts — all in one place
        </p>

        {/* Date input + Calculate button */}
        <div className="flex w-full max-w-md gap-2 mb-6">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-base text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
          />
          <button
            onClick={handleCalculate}
            disabled={!dateInput}
            className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Calculate →
          </button>
        </div>

        {/* Quick-pick pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_PICKS.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className="rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-5 py-2 text-sm text-white transition-colors hover:bg-[#e94560]/30"
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — POPULAR COUNTDOWNS GRID
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-10 text-center text-3xl font-bold text-white">
            Popular Countdowns
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOLIDAYS.map((h) => (
              <Link
                key={h.slug}
                href={`/days-until/${h.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-[#16213e] bg-[#16213e] p-6 transition-all duration-200 hover:border-[#e94560] hover:bg-[#1a1a2e]"
              >
                <span className="text-4xl">{h.emoji}</span>
                <span className="text-center text-lg font-semibold text-white">
                  {h.name}
                </span>
                <span className="text-2xl font-bold text-[#e94560]">
                  {nextOccurrence(h.getDate)}
                </span>
                <span className="text-sm text-[#a8a8b3]">days away</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad — between Popular Countdowns and Born In */}
      <div className="bg-[#1a1a2e] px-6">
        <div className="mx-auto max-w-[1200px]">
          <AdUnit slot="1234567890" format="leaderboard" />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — BORN IN
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 md:flex-row">
          {/* Left — text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-4 text-3xl font-bold text-white">
              What Was The World Like When You Were Born?
            </h2>
            <p className="text-lg text-[#a8a8b3]">
              Discover the music, movies, and major events from your birth year
            </p>
          </div>

          {/* Right — input */}
          <div className="w-full flex-1">
            <div className="mb-4 flex gap-2">
              <input
                type="number"
                min={1900}
                max={today.getFullYear()}
                placeholder="Enter year e.g. 1990"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBornIn()}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-base text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
              />
              <button
                onClick={handleBornIn}
                disabled={!yearInput}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Show Me →
              </button>
            </div>
            {/* Year pills */}
            <div className="flex flex-wrap gap-2">
              {[1980, 1985, 1990, 1995, 2000, 2005].map((y) => (
                <Link
                  key={y}
                  href={`/born-in/${y}`}
                  className="rounded-full border border-[#0f3460] bg-[#0f3460]/50 px-4 py-1.5 text-sm text-[#a8a8b3] transition-colors hover:border-[#e94560] hover:text-white"
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — ON THIS DAY TEASER
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-1 text-2xl font-bold text-white">
            Today is {todayDisplay}. Here&apos;s what happened...
          </h2>
          <p className="mb-8 text-sm text-[#a8a8b3]">
            Historical facts for January 1
          </p>

          <div className="mb-8 flex max-w-2xl flex-col gap-4">
            {HISTORY_FACTS.map((item) => (
              <div
                key={item.year}
                className="flex items-start gap-4 rounded-lg bg-[#16213e] px-5 py-4"
              >
                <span className="shrink-0 text-lg font-bold text-[#e94560]">
                  {item.year}
                </span>
                <span className="text-white">{item.fact}</span>
              </div>
            ))}
          </div>

          <Link
            href={`/on-this-day/${todaySlug}`}
            className="inline-block rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            See Full History For Today →
          </Link>
        </div>
      </section>

      {/* Ad — between On This Day and Tools */}
      <div className="bg-[#1a1a2e] px-6">
        <div className="mx-auto max-w-[1200px]">
          <AdUnit slot="1234567890" format="leaderboard" />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 5 — TOOLS GRID
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-10 text-center text-3xl font-bold text-white">
            Date Tools
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => (
              <div
                key={tool.href}
                className="flex flex-col gap-4 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-8 transition-all duration-200 hover:border-[#e94560]"
              >
                <span className="text-4xl">{tool.emoji}</span>
                <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                <p className="flex-1 text-[#a8a8b3]">{tool.desc}</p>
                <Link
                  href={tool.href}
                  className="inline-block rounded-lg bg-[#e94560] px-5 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Open Tool →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MORE FUN TOOLS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">More Fun Tools</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">
            Explore more ways to discover your connection to time
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { emoji: "📊", title: "Life Progress Bar",     desc: "See what % of your life you've lived",         href: "/life-progress" },
              { emoji: "🎯", title: "Days Alive Milestones", desc: "Find out how many days old you are",            href: "/days-alive" },
              { emoji: "🎂", title: "Birthday Twin Finder",  desc: "Find famous people who share your birthday",   href: "/birthday-twins" },
              { emoji: "🎵", title: "#1 Song on Birthday",   desc: "Discover the #1 hit when you were born",       href: "/number-one-song" },
              { emoji: "💕", title: "Couples Countdown",     desc: "How many days have you been together?",        href: "/couples-countdown" },
              { emoji: "📅", title: "Day of Year Counter",   desc: "What day number is today?",                    href: "/day-of-year" },
              { emoji: "🌍", title: "World Countdowns",      desc: "Live timers to every major world event",       href: "/world-countdowns" },
              { emoji: "⏳", title: "This Day in My Life",   desc: "Your personal life timeline",                  href: "/this-day-in-my-life" },
              { emoji: "🎰", title: "Fact Spinner",           desc: "Spin for a random historical fact",             href: "/fact-spinner" },
              { emoji: "📱", title: "Older Than Calculator",  desc: "Are you older than the iPhone?",               href: "/older-than" },
              { emoji: "🎂", title: "Birthday Countdown",     desc: "Create your personal birthday countdown",       href: "/birthday-countdown" },
              { emoji: "🤯", title: "Fun Age Facts",          desc: "How many times has your heart beaten?",         href: "/age-facts" },
              { emoji: "⚡", title: "History Quiz",           desc: "Before or After? Test your knowledge",          href: "/history-quiz" },
              { emoji: "💰", title: "Price History",          desc: "What did things cost in 1990?",                 href: "/price-history" },
              { emoji: "♈", title: "Star Sign",              desc: "Your zodiac + birthday countdown",              href: "/star-sign" },
              { emoji: "🌕", title: "Full Moons",             desc: "How many full moons have you lived?",           href: "/full-moons" },
              { emoji: "⏰", title: "Time Spent",             desc: "How much life have you spent sleeping?",        href: "/time-spent" },
              { emoji: "🧠", title: "Daily Trivia",           desc: "New history question every day",                href: "/daily-trivia" },
              { emoji: "🌍", title: "Oldest Things",          desc: "How old are you vs the oldest things?",         href: "/oldest-things" },
              { emoji: "🕺", title: "Decade Quiz",            desc: "Which decade were you born for?",               href: "/decade-quiz" },
              { emoji: "💻", title: "Tech Nostalgia",         desc: "Tech invented in your lifetime",                href: "/tech-nostalgia" },
              { emoji: "👶", title: "World Population",       desc: "Population when you were born",                 href: "/world-population" },
              { emoji: "📰", title: "This Week in History",   desc: "Major events from this week in history",        href: "/this-week-in-history" },
              { emoji: "⭐", title: "Celebrity Ages",         desc: "How old is Taylor Swift today?",                href: "/celebrity-age" },
              { emoji: "📅", title: "Guess the Year",        desc: "Can you guess when it happened?",               href: "/guess-the-year" },
              { emoji: "🎚️", title: "How Long Ago?",         desc: "Drag to guess how many years ago",              href: "/how-long-ago" },
              { emoji: "✅", title: "Famous or Fictional?",  desc: "Was this person real or made up?",              href: "/famous-or-fictional" },
              { emoji: "📋", title: "Timeline Builder",      desc: "Put events in the right order",                 href: "/timeline-builder" },
              { emoji: "🎵", title: "Name That Decade",      desc: "Which decade is this song from?",               href: "/name-that-decade" },
              { emoji: "🌍", title: "Country History",       desc: "Major events by country",                       href: "/country-history" },
              { emoji: "🔬", title: "This Day in Science",   desc: "Scientific discoveries today",                  href: "/science-today" },
              { emoji: "🇺🇸", title: "US Presidents",       desc: "Presidential timeline in your lifetime",        href: "/presidents" },
              { emoji: "🏗️", title: "How Long to Build?",   desc: "Famous construction times vs your age",         href: "/how-long-to-build" },
              { emoji: "👶", title: "What Generation?",      desc: "Boomer, Millennial or Gen Z?",                 href: "/what-generation" },
              { emoji: "🏖️", title: "Weekends Left",        desc: "How many weekends do you have left?",           href: "/weekends-left" },
              { emoji: "👶", title: "Baby Age",              desc: "Track your baby's age in weeks",                href: "/baby-age" },
              { emoji: "💼", title: "Retirement Countdown",  desc: "Count down to your retirement day",             href: "/retirement-countdown" },
              { emoji: "📰", title: "Days Since Events",     desc: "Live counters for history's moments",           href: "/days-since" },
              { emoji: "⏳", title: "Time Capsule",          desc: "Write to your future self",                     href: "/time-capsule" },
              { emoji: "🎯", title: "Resolution Tracker",    desc: "Track your New Year resolutions",               href: "/resolution-tracker" },
              { emoji: "📚", title: "School Countdown",      desc: "Days until summer break",                       href: "/school-countdown" },
              { emoji: "💍", title: "Anniversary Calculator",desc: "Find your traditional gift",                    href: "/anniversary" },
              { emoji: "🏆", title: "World Records",         desc: "How records changed over time",                 href: "/world-records" },
              { emoji: "🌍", title: "Birthday Time Zones",   desc: "Is it your birthday anywhere?",                 href: "/birthday-now" },
              { emoji: "🌌", title: "Earth Orbits",          desc: "Cosmic facts about your lifetime",              href: "/earth-orbits" },
              { emoji: "📰", title: "Newspaper Generator",   desc: "Headlines from any date in history",            href: "/newspaper" },
              { emoji: "📅", title: "Week Number",           desc: "What week number is it today?",                 href: "/week-number" },
              { emoji: "🔢", title: "Your Birth Number",     desc: "What number human are you?",                    href: "/birth-number" },
              { emoji: "🌤️", title: "Birthday Weather",     desc: "Weather patterns on your birthday",             href: "/birthday-weather" },
            ].map(tool => (
              <Link key={tool.href} href={tool.href}
                className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#16213e] p-5 text-center transition-all duration-200 hover:border-[#e94560]">
                <span className="text-3xl">{tool.emoji}</span>
                <span className="text-sm font-bold text-white">{tool.title}</span>
                <span className="text-xs text-[#a8a8b3] leading-snug">{tool.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
