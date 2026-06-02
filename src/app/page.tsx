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

        {/* Live counters pill */}
        <Link
          href="/world-counters"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-4 py-2 text-sm text-white transition-colors hover:bg-[#e94560]/20"
        >
          <span className="h-2 w-2 rounded-full bg-[#e94560] animate-pulse shrink-0" />
          Live: Watch world births, deaths and US debt tick in real time →
        </Link>

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
          FINANCE & MONEY CALCULATORS
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-16" style={{ background: "#0d1f3c" }}>
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">💰 Finance &amp; Money Calculators</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">High-value tools to plan your financial future</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { emoji: "💹", title: "Compound Interest", desc: "Watch your money grow", href: "/finance/compound-interest" },
              { emoji: "🏦", title: "Retirement Savings", desc: "Are you on track?", href: "/finance/retirement-savings" },
              { emoji: "🏠", title: "Mortgage Calculator", desc: "Monthly payment breakdown", href: "/finance/mortgage-calculator" },
              { emoji: "💳", title: "Debt Payoff", desc: "Avalanche or snowball", href: "/finance/debt-payoff" },
              { emoji: "📊", title: "Net Worth", desc: "Know where you stand", href: "/finance/net-worth" },
              { emoji: "📉", title: "Inflation Calculator", desc: "Buying power over time", href: "/finance/inflation" },
              { emoji: "💼", title: "401(k) Calculator", desc: "Maximize employer match", href: "/finance/401k-calculator" },
              { emoji: "🛡️", title: "Emergency Fund", desc: "How much do you need?", href: "/finance/emergency-fund" },
              { emoji: "👴", title: "Social Security", desc: "Best age to claim", href: "/finance/social-security" },
              { emoji: "🎓", title: "Student Loans", desc: "Payoff timeline", href: "/finance/student-loan" },
              { emoji: "💼", title: "Freelancer Rate", desc: "What should you charge?", href: "/finance/freelancer-rate" },
              { emoji: "💵", title: "Take Home Pay", desc: "Paycheck after deductions", href: "/finance/take-home-pay" },
              { emoji: "📊", title: "Tax Bracket", desc: "Your 2026 federal bracket", href: "/finance/tax-bracket" },
              { emoji: "🧾", title: "SE Tax Calculator", desc: "Self-employment tax estimate", href: "/finance/self-employment-tax" },
              { emoji: "💰", title: "Savings Goal", desc: "Time to reach your goal", href: "/finance/savings-goal" },
              { emoji: "📋", title: "Budget Planner", desc: "50/30/20 rule budget", href: "/finance/budget-calculator" },
              { emoji: "🚗", title: "Car Affordability", desc: "How much car can you afford?", href: "/finance/car-affordability" },
              { emoji: "🎓", title: "College Savings", desc: "529 plan calculator", href: "/finance/college-savings" },
              { emoji: "📈", title: "Break Even", desc: "When does your business profit?", href: "/finance/break-even" },
              { emoji: "📊", title: "Profit Margin", desc: "Gross & net margins", href: "/finance/profit-margin" },
              { emoji: "💹", title: "Capital Gains Tax", desc: "Tax on investments", href: "/finance/capital-gains" },
              { emoji: "📈", title: "Stock Return", desc: "Investment return calculator", href: "/finance/stock-return" },
              { emoji: "🏙️", title: "Cost of Living", desc: "Compare cities", href: "/finance/cost-of-living" },
            ].map(tool => (
              <Link key={tool.href} href={tool.href}
                className="flex flex-col gap-2 rounded-xl border border-[#1a3a6e] bg-[#16213e] p-5 text-center transition-all duration-200 hover:border-[#e94560]">
                <span className="text-3xl">{tool.emoji}</span>
                <span className="text-sm font-bold text-white">{tool.title}</span>
                <span className="text-xs text-[#a8a8b3] leading-snug">{tool.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          LIFE & MONEY INSIGHTS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">💡 Life &amp; Money Insights</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">Tools that reveal what you might not know about your finances</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { emoji: "💼", title: "Am I Underpaid?", desc: "Check market rate for your role", href: "/tools/salary-checker" },
              { emoji: "📈", title: "Historical Stock Calculator", desc: "What if you had invested in Apple in 2001?", href: "/tools/stock-calculator" },
              { emoji: "🗺️", title: "State Tax Savings", desc: "How much would moving states save?", href: "/tools/tax-migration" },
              { emoji: "⏰", title: "True Hourly Wage", desc: "What does your job really pay per hour?", href: "/tools/true-hourly-wage" },
              { emoji: "📊", title: "Career Timeline", desc: "Project your salary and savings over time", href: "/tools/career-timeline" },
              { emoji: "🏠", title: "Home Affordability History", desc: "Could you afford a home in 1990?", href: "/tools/mortgage-by-year" },
              { emoji: "🗓️", title: "Debt Freedom Date", desc: "When will you be completely debt free?", href: "/tools/debt-freedom" },
              { emoji: "👨‍👩‍👧", title: "Generational Wealth Gap", desc: "Compare finances to your parents at your age", href: "/tools/generational-wealth" },
              { emoji: "🚗", title: "True Car Cost", desc: "The real total cost of owning your car", href: "/tools/car-true-cost" },
              { emoji: "😴", title: "Procrastination Cost", desc: "What is waiting really costing you?", href: "/tools/procrastination-cost" },
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

      {/* ════════════════════════════════════════════════════════════════
          CURIOSITY CALCULATORS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-1 text-center text-3xl font-bold text-white">🤔 Curiosity Calculators</h2>
          <p className="mb-2 text-center text-[#a8a8b3]">What could your spending be worth if invested instead?</p>
          <p className="mb-8 text-center text-xs text-yellow-300">Educational only — not investment advice</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { emoji: "📺", title: "Subscriptions", desc: "Netflix + Spotify opportunity cost", href: "/curiosity/subscriptions" },
              { emoji: "☕", title: "Latte Factor", desc: "Your daily coffee's hidden cost", href: "/curiosity/latte-factor" },
              { emoji: "🚬", title: "Smoking Cost", desc: "Financial cost of smoking", href: "/curiosity/smoking-investment" },
              { emoji: "🍽️", title: "Dining Out", desc: "Cook more, invest the difference", href: "/curiosity/dining-out" },
              { emoji: "🎰", title: "Lottery Tickets", desc: "What $20/week could build", href: "/curiosity/lottery" },
              { emoji: "🚗", title: "Car Upgrades", desc: "True cost of a nicer car", href: "/curiosity/car-upgrade" },
              { emoji: "🛒", title: "Impulse Shopping", desc: "What impulse buys cost your future", href: "/curiosity/impulse-shopping" },
              { emoji: "📱", title: "Phone Upgrades", desc: "Annual upgrade habit cost", href: "/curiosity/phone-upgrade" },
              { emoji: "💪", title: "Side Hustle", desc: "What extra income could build", href: "/curiosity/side-hustle" },
              { emoji: "🏋️", title: "Gym Membership", desc: "Your real cost per visit", href: "/curiosity/gym-membership" },
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

      {/* ════════════════════════════════════════════════════════════════
          HEALTH & LIFESTYLE
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">❤️ Health &amp; Lifestyle</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">Understand your health numbers and make informed decisions</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { emoji: "🧬", title: "Life Expectancy", desc: "Statistical estimate", href: "/health/life-expectancy" },
              { emoji: "⚖️", title: "BMI Calculator", desc: "Body mass index", href: "/health/bmi-calculator" },
              { emoji: "🚬", title: "Habit Cost", desc: "True cost of habits", href: "/health/habit-cost" },
              { emoji: "🛡️", title: "Life Insurance", desc: "Coverage needs", href: "/health/life-insurance" },
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

      {/* ════════════════════════════════════════════════════════════════
          REAL ESTATE
      ════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-16" style={{ background: "#0d1f3c" }}>
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">🏠 Real Estate</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">Smarter decisions about buying, selling, and renting</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { emoji: "🏠", title: "Rent vs Buy", desc: "Which is smarter for you?", href: "/real-estate/rent-vs-buy" },
              { emoji: "📈", title: "Home Value Growth", desc: "What is your home worth?", href: "/real-estate/home-value" },
              { emoji: "💰", title: "Affordability", desc: "How much can you afford?", href: "/real-estate/affordability" },
            ].map(tool => (
              <Link key={tool.href} href={tool.href}
                className="flex flex-col gap-2 rounded-xl border border-[#1a3a6e] bg-[#16213e] p-5 text-center transition-all duration-200 hover:border-[#e94560]">
                <span className="text-3xl">{tool.emoji}</span>
                <span className="text-sm font-bold text-white">{tool.title}</span>
                <span className="text-xs text-[#a8a8b3] leading-snug">{tool.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PRODUCTIVITY
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">⚡ Productivity</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">Understand the real value of your time and work</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { emoji: "⏰", title: "Work Hours Calculator", desc: "Hours worked in your career", href: "/productivity/work-hours" },
              { emoji: "💸", title: "Meeting Cost Calculator", desc: "Live cost of your meeting", href: "/productivity/meeting-cost" },
              { emoji: "💰", title: "Salary Calculator", desc: "Convert between pay periods", href: "/productivity/salary-calculator" },
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

      {/* ════════════════════════════════════════════════════════════════
          MORE FUN TOOLS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-3 text-center text-3xl font-bold text-white">More Fun Tools</h2>
          <p className="mb-10 text-center text-[#a8a8b3]">
            Explore more ways to discover your connection to time
          </p>
          {(() => {
            const TOOLS: Record<string, { emoji: string; title: string; desc: string }> = {
              "/life-progress":        { emoji: "📊", title: "Life Progress Bar",     desc: "See what % of your life you've lived" },
              "/days-alive":           { emoji: "🎯", title: "Days Alive Milestones", desc: "Find out how many days old you are" },
              "/birthday-twins":       { emoji: "🎂", title: "Birthday Twin Finder",  desc: "Find famous people who share your birthday" },
              "/number-one-song":      { emoji: "🎵", title: "#1 Song on Birthday",   desc: "Discover the #1 hit when you were born" },
              "/couples-countdown":    { emoji: "💕", title: "Couples Countdown",     desc: "How many days have you been together?" },
              "/day-of-year":          { emoji: "📅", title: "Day of Year Counter",   desc: "What day number is today?" },
              "/world-countdowns":     { emoji: "🌍", title: "World Countdowns",      desc: "Live timers to every major world event" },
              "/this-day-in-my-life":  { emoji: "⏳", title: "This Day in My Life",   desc: "Your personal life timeline" },
              "/fact-spinner":         { emoji: "🎰", title: "Fact Spinner",          desc: "Spin for a random historical fact" },
              "/older-than":           { emoji: "📱", title: "Older Than Calculator", desc: "Are you older than the iPhone?" },
              "/birthday-countdown":   { emoji: "🎂", title: "Birthday Countdown",    desc: "Create your personal birthday countdown" },
              "/age-facts":            { emoji: "🤯", title: "Fun Age Facts",         desc: "How many times has your heart beaten?" },
              "/history-quiz":         { emoji: "⚡", title: "History Quiz",          desc: "Before or After? Test your knowledge" },
              "/price-history":        { emoji: "💰", title: "Price History",         desc: "What did things cost in 1990?" },
              "/star-sign":            { emoji: "♈", title: "Star Sign",             desc: "Your zodiac + birthday countdown" },
              "/full-moons":           { emoji: "🌕", title: "Full Moons",            desc: "How many full moons have you lived?" },
              "/time-spent":           { emoji: "⏰", title: "Time Spent",            desc: "How much life have you spent sleeping?" },
              "/daily-trivia":         { emoji: "🧠", title: "Daily Trivia",          desc: "New history question every day" },
              "/oldest-things":        { emoji: "🌍", title: "Oldest Things",         desc: "How old are you vs the oldest things?" },
              "/decade-quiz":          { emoji: "🕺", title: "Decade Quiz",           desc: "Which decade were you born for?" },
              "/tech-nostalgia":       { emoji: "💻", title: "Tech Nostalgia",        desc: "Tech invented in your lifetime" },
              "/world-population":     { emoji: "👶", title: "World Population",       desc: "Population when you were born" },
              "/this-week-in-history": { emoji: "📰", title: "This Week in History",  desc: "Major events from this week in history" },
              "/celebrity-age":        { emoji: "⭐", title: "Celebrity Ages",        desc: "How old is Taylor Swift today?" },
              "/guess-the-year":       { emoji: "📅", title: "Guess the Year",        desc: "Can you guess when it happened?" },
              "/how-long-ago":         { emoji: "🎚️", title: "How Long Ago?",         desc: "Drag to guess how many years ago" },
              "/famous-or-fictional":  { emoji: "✅", title: "Famous or Fictional?",  desc: "Was this person real or made up?" },
              "/timeline-builder":     { emoji: "📋", title: "Timeline Builder",      desc: "Put events in the right order" },
              "/name-that-decade":     { emoji: "🎵", title: "Name That Decade",      desc: "Which decade is this song from?" },
              "/country-history":      { emoji: "🌍", title: "Country History",       desc: "Major events by country" },
              "/science-today":        { emoji: "🔬", title: "This Day in Science",   desc: "Scientific discoveries today" },
              "/presidents":           { emoji: "🇺🇸", title: "US Presidents",       desc: "Presidential timeline in your lifetime" },
              "/how-long-to-build":    { emoji: "🏗️", title: "How Long to Build?",   desc: "Famous construction times vs your age" },
              "/what-generation":      { emoji: "👶", title: "What Generation?",      desc: "Boomer, Millennial or Gen Z?" },
              "/weekends-left":        { emoji: "🏖️", title: "Weekends Left",        desc: "How many weekends do you have left?" },
              "/baby-age":             { emoji: "👶", title: "Baby Age",              desc: "Track your baby's age in weeks" },
              "/retirement-countdown": { emoji: "💼", title: "Retirement Countdown",  desc: "Count down to your retirement day" },
              "/days-since":           { emoji: "📰", title: "Days Since Events",     desc: "Live counters for history's moments" },
              "/time-capsule":         { emoji: "⏳", title: "Time Capsule",          desc: "Write to your future self" },
              "/resolution-tracker":   { emoji: "🎯", title: "Resolution Tracker",    desc: "Track your New Year resolutions" },
              "/school-countdown":     { emoji: "📚", title: "School Countdown",      desc: "Days until summer break" },
              "/anniversary":          { emoji: "💍", title: "Anniversary Calculator",desc: "Find your traditional gift" },
              "/world-records":        { emoji: "🏆", title: "World Records",         desc: "How records changed over time" },
              "/birthday-now":         { emoji: "🌍", title: "Birthday Time Zones",   desc: "Is it your birthday anywhere?" },
              "/earth-orbits":         { emoji: "🌌", title: "Earth Orbits",          desc: "Cosmic facts about your lifetime" },
              "/world-counters":       { emoji: "🌍", title: "World Live Counters",   desc: "Watch births, debt, emails tick live" },
              "/newspaper":            { emoji: "📰", title: "Newspaper Generator",   desc: "Headlines from any date in history" },
              "/week-number":          { emoji: "📅", title: "Week Number",           desc: "What week number is it today?" },
              "/birth-number":         { emoji: "🔢", title: "Your Birth Number",     desc: "What number human are you?" },
              "/birthday-weather":     { emoji: "🌤️", title: "Birthday Weather",     desc: "Weather patterns on your birthday" },
            };
            const SUBSECTIONS: { heading: string; hrefs: string[] }[] = [
              { heading: "🎯 Life & Personal Tools", hrefs: ["/life-progress","/days-alive","/baby-age","/retirement-countdown","/weekends-left","/couples-countdown","/anniversary","/birthday-countdown","/school-countdown","/resolution-tracker"] },
              { heading: "🎮 Games & Quizzes", hrefs: ["/history-quiz","/decade-quiz","/daily-trivia","/guess-the-year","/how-long-ago","/famous-or-fictional","/timeline-builder","/name-that-decade"] },
              { heading: "🌟 Fun & Viral", hrefs: ["/fact-spinner","/celebrity-age","/birthday-twins","/older-than","/age-facts","/star-sign","/full-moons","/world-countdowns","/this-day-in-my-life","/number-one-song"] },
              { heading: "📚 History & World", hrefs: ["/days-since","/country-history","/science-today","/presidents","/how-long-to-build","/world-records","/price-history","/tech-nostalgia","/newspaper","/this-week-in-history"] },
              { heading: "🌍 Cosmic & Curiosity", hrefs: ["/world-counters","/earth-orbits","/world-population","/birth-number","/time-capsule","/birthday-weather","/time-spent","/day-of-year","/week-number","/what-generation","/birthday-now","/oldest-things"] },
            ];
            return SUBSECTIONS.map((section) => (
              <div key={section.heading} className="mb-12 border-t border-[#0f3460] pt-8">
                <h3 className="mb-6 text-xl font-bold text-white">{section.heading}</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {section.hrefs.map((href) => {
                    const tool = TOOLS[href];
                    if (!tool) return null;
                    return (
                      <Link key={href} href={href}
                        className="flex flex-col gap-2 rounded-xl border border-[#0f3460] bg-[#16213e] p-5 text-center transition-all duration-200 hover:border-[#e94560]">
                        <span className="text-3xl">{tool.emoji}</span>
                        <span className="text-sm font-bold text-white">{tool.title}</span>
                        <span className="text-xs text-[#a8a8b3] leading-snug">{tool.desc}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      </section>

    </div>
  );
}
