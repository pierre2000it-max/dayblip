"use client";

import { useState } from "react";
import Link from "next/link";
import AdUnit from "@/components/AdUnit";
import FAQAccordion from "@/components/FAQAccordion";
import ShareButtons from "@/components/ShareButtons";

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How many days between two dates?",
      acceptedAnswer: { "@type": "Answer", text: "Enter your start and end dates above and click Calculate for the exact count, including weekdays and weekends." } },
    { "@type": "Question", name: "How many weekdays between two dates?",
      acceptedAnswer: { "@type": "Answer", text: "Our calculator shows both total days and weekdays (Monday–Friday) separately in the results." } },
    { "@type": "Question", name: "How many days until my birthday?",
      acceptedAnswer: { "@type": "Answer", text: "Enter today as the start date and your next birthday as the end date, then click Calculate." } },
  ],
};

const POPULAR = [
  { label: "Days Until Christmas",       slug: "christmas",      emoji: "🎄" },
  { label: "Days Until New Year",        slug: "new-years",      emoji: "🎆" },
  { label: "Days Until Halloween",       slug: "halloween",      emoji: "🎃" },
  { label: "Days Until Thanksgiving",    slug: "thanksgiving",   emoji: "🦃" },
  { label: "Days Until Valentine's Day", slug: "valentines-day", emoji: "💝" },
  { label: "Days Until Independence Day",slug: "independence-day",emoji: "🇺🇸" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateDisplay(d: Date): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function countWeekdays(start: Date, end: Date): number {
  const [d1, d2] = start <= end ? [start, end] : [end, start];
  const totalDays = Math.floor((d2.getTime() - d1.getTime()) / 86400000);
  const fullWeeks = Math.floor(totalDays / 7);
  let wd = fullWeeks * 5;
  const startDay = d1.getDay();
  const extra = totalDays % 7;
  for (let i = 0; i < extra; i++) {
    const day = (startDay + i) % 7;
    if (day !== 0 && day !== 6) wd++;
  }
  return wd;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DiffResult {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  approxMonths: number;
  approxMonthsDays: number;
  years: number;
  months: number;
  days: number;
  weekdays: number;
  weekendDays: number;
  totalHours: number;
  totalMinutes: number;
  date1: Date;
  date2: Date;
}

// ── Calculation ───────────────────────────────────────────────────────────────

function calcDiff(str1: string, str2: string): DiffResult | string {
  const d1 = new Date(str1 + "T00:00:00");
  const d2 = new Date(str2 + "T00:00:00");
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return "Please enter valid dates.";

  const [start, end] = d1 <= d2 ? [d1, d2] : [d2, d1];
  const totalDays    = Math.floor((end.getTime() - start.getTime()) / 86400000);
  const weeks        = Math.floor(totalDays / 7);
  const remaining    = totalDays % 7;
  const approxMonths = Math.floor(totalDays / 30.44);
  const approxMDays  = Math.floor(totalDays % 30.44);
  const wd           = countWeekdays(start, end);

  // Years / months / days breakdown
  let years  = end.getFullYear() - start.getFullYear();
  let months = end.getMonth()    - start.getMonth();
  let days   = end.getDate()     - start.getDate();
  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }

  return {
    totalDays, weeks, remainingDays: remaining,
    approxMonths, approxMonthsDays: approxMDays,
    years, months, days,
    weekdays: wd, weekendDays: totalDays - wd,
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 24 * 60,
    date1: start, date2: end,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DaysBetweenTool() {
  const [date1,  setDate1]  = useState("");
  const [date2,  setDate2]  = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);
  const [error,  setError]  = useState("");

  const handleCalculate = () => {
    if (!date1 || !date2) { setError("Please enter both dates."); return; }
    const res = calcDiff(date1, date2);
    if (typeof res === "string") { setError(res); setResult(null); return; }
    setError("");
    setResult(res);
  };

  const FAQS = [
    { q: "How many days between two dates?",
      a: "Enter your start and end dates above and click Calculate for the exact count, including weekdays and weekends." },
    { q: "How many weekdays between two dates?",
      a: "Our calculator shows both total days and weekdays (Monday–Friday) separately in the results." },
    { q: "How many days until my birthday?",
      a: "Enter today as the start date and your next birthday as the end date, then click Calculate." },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⏱</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Days Between Dates Calculator — Exact Days Between Any Two Dates</h1>
          <p className="text-lg text-[#a8a8b3]">
            Calculate the exact number of days between any two dates
          </p>
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">There are 365 days between January 1 2025 and January 1 2026. Between January 1 2000 and January 1 2026 there are 9,497 days. Leap years add one extra day every 4 years — there have been 7 leap years between 2000 and 2026. The calculator accounts for all leap years automatically.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A days between dates calculator finds the exact number of days separating any two calendar dates. It accounts for leap years, varying month lengths and can calculate both forward and backward in time. Common uses include calculating contract durations, project timelines, age differences and the time between historical events.</p>
        </div>
      </section>

      {/* ── Calculator ─────────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Start date</label>
                <input type="date" value={date1} onChange={e => setDate1(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">End date</label>
                <input type="date" value={date2} onChange={e => setDate2(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </div>
            <button onClick={handleCalculate}
              className="mt-4 w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate →
            </button>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
              {/* Headline */}
              <p className="mb-1 text-3xl font-bold text-[#e94560]">
                {result.totalDays.toLocaleString()} days
              </p>
              <p className="mb-5 text-sm text-[#a8a8b3]">
                between{" "}
                <span className="text-white">{formatDateDisplay(result.date1)}</span>{" "}
                and{" "}
                <span className="text-white">{formatDateDisplay(result.date2)}</span>
              </p>

              {/* Breakdown */}
              <div className="space-y-2.5 border-t border-[#0f3460] pt-4">
                {[
                  [`= ${result.weeks.toLocaleString()} weeks and ${result.remainingDays} days`],
                  [`= ~${result.approxMonths} months and ${result.approxMonthsDays} days`],
                  [`= ${result.years} years, ${result.months} months and ${result.days} days`],
                  [`${result.weekdays.toLocaleString()} weekdays (Monday to Friday)`],
                  [`${result.weekendDays.toLocaleString()} weekend days (Saturday and Sunday)`],
                  [`${result.totalHours.toLocaleString()} hours`],
                  [`${result.totalMinutes.toLocaleString()} minutes`],
                ].map(([label]) => (
                  <div key={label} className="flex items-start gap-2 text-[#a8a8b3]">
                    <span className="mt-1 shrink-0 text-[#e94560]">→</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ShareButtons
              text={`There are ${result.totalDays.toLocaleString()} days between those dates. Calculate yours on Dayblip!`}
              url="https://www.dayblip.com/days-between"
              title="Days Between Dates Calculator"
            />
            </div>
          )}
        </div>
      </section>

      {/* Ad — below results box */}
      <div className="bg-[#16213e] px-6 pb-4">
        <div className="mx-auto max-w-[700px]">
          <AdUnit slot="1234567890" format="rectangle" />
        </div>
      </div>

      {/* ── Popular Calculations ────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-8 text-2xl font-bold text-white">Popular Date Calculations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {POPULAR.map(p => (
              <Link key={p.slug} href={`/days-until/${p.slug}`}
                className="flex items-center gap-3 rounded-xl border border-[#0f3460] bg-[#16213e] px-4 py-4 transition-all hover:border-[#e94560]">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-sm font-semibold text-white">{p.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <FAQAccordion items={FAQS.map(faq => ({ question: faq.q, answer: faq.a }))} />
          {/* Ad — below FAQ */}
          <AdUnit slot="1234567890" format="leaderboard" />
        </div>
      </section>
    </div>
  );
}
