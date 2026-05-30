"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import ShareButtons from "@/components/ShareButtons";

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the age calculator work?",
      acceptedAnswer: { "@type": "Answer", text: "Enter your birth date and we calculate the exact difference between that date and today, showing your age in years, months, days, hours and more." } },
    { "@type": "Question", name: "How many days old am I?",
      acceptedAnswer: { "@type": "Answer", text: "Use the calculator above to find your exact age in days. The result is based on today's date." } },
    { "@type": "Question", name: "What day of the week was I born?",
      acceptedAnswer: { "@type": "Answer", text: "The calculator above shows the exact day of the week you were born once you enter your birth date." } },
    { "@type": "Question", name: "How many hours old am I?",
      acceptedAnswer: { "@type": "Answer", text: "Multiply your total days by 24 for an approximate count. Our calculator shows this figure automatically." } },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function commas(n: number): string {
  return n.toLocaleString();
}

function countLeapYears(from: number, to: number): number {
  let n = 0;
  for (let y = from; y <= to; y++) {
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) n++;
  }
  return n;
}

function countSummerOlympics(birthYear: number, endYear: number): number {
  const skipped = new Set([1916, 1940, 1944]);
  let n = 0;
  for (let y = 1896; y <= endYear; y += 4) {
    if (y >= birthYear && !skipped.has(y)) n++;
  }
  return n;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  bornOnDay: string;
  nextBirthdayDays: number;
  nextBirthdayDay: string;
  leapYears: number;
  decade: string;
  presidentialTerms: number;
  olympicsCount: number;
  dogYears: number;
}

// ── Calculation ───────────────────────────────────────────────────────────────

function calcAge(dateStr: string): AgeResult | string {
  const birth = new Date(dateStr + "T00:00:00");
  if (isNaN(birth.getTime())) return "Invalid date.";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birth >= today) return "Birth date must be in the past.";

  let years  = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth()    - birth.getMonth();
  let days   = today.getDate()     - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalDays    = Math.floor((today.getTime() - birth.getTime()) / 86400000);
  const totalWeeks   = Math.floor(totalDays / 7);
  const totalMonths  = years * 12 + months;
  const totalHours   = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday <= today) nextBday.setFullYear(today.getFullYear() + 1);
  const nextBirthdayDays = Math.ceil((nextBday.getTime() - today.getTime()) / 86400000);

  const birthYear   = birth.getFullYear();
  const currentYear = today.getFullYear();

  return {
    years, months, days,
    totalMonths, totalWeeks, totalDays, totalHours, totalMinutes,
    bornOnDay:        DAYS[birth.getDay()],
    nextBirthdayDays,
    nextBirthdayDay:  DAYS[nextBday.getDay()],
    leapYears:        countLeapYears(birthYear, currentYear),
    decade:           `${Math.floor(birthYear / 10) * 10}s`,
    presidentialTerms: Math.floor(years / 4),
    olympicsCount:    countSummerOlympics(birthYear, currentYear),
    dogYears:         years * 7,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgeCalculatorTool() {
  const [dateInput, setDateInput] = useState("");
  const [result,    setResult]    = useState<AgeResult | null>(null);
  const [error,     setError]     = useState("");

  const handleCalculate = () => {
    if (!dateInput) { setError("Please enter your date of birth."); return; }
    const res = calcAge(dateInput);
    if (typeof res === "string") { setError(res); setResult(null); return; }
    setError("");
    setResult(res);
  };

  const ROW_DATA: [string, string][] = result ? [
    ["= Total months",  commas(result.totalMonths)],
    ["= Total weeks",   commas(result.totalWeeks)],
    ["= Total days",    commas(result.totalDays)],
    ["= Total hours",   commas(result.totalHours)],
    ["= Total minutes", commas(result.totalMinutes)],
  ] : [];

  const FUN_FACTS: string[] = result ? [
    `You have experienced ${result.leapYears} leap years`,
    `You were born in the ${result.decade} era`,
    `You have lived through approximately ${result.presidentialTerms} US presidential terms`,
    `You have seen ${result.olympicsCount} Summer Olympics`,
    `In dog years you are approximately ${result.dogYears}`,
  ] : [];

  const FAQS = [
    { q: "How does the age calculator work?",
      a: "Enter your birth date and we calculate the exact difference between that date and today, showing your age in years, months, days, hours and more." },
    { q: "How many days old am I?",
      a: "Use the calculator above to find your exact age in days. The result is based on today's date." },
    { q: "What day of the week was I born?",
      a: "The calculator above shows the exact day of the week you were born once you enter your birth date." },
    { q: "How many hours old am I?",
      a: "Multiply your total days by 24 for an approximate count. Our calculator shows this figure automatically." },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎂</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Age Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">
            Find out exactly how old you are in years, months, weeks, days, hours and minutes
          </p>
        </div>
      </section>

      {/* ── Calculator ─────────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">

          {/* Input card */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <label className="mb-2 block text-sm font-semibold text-white">
              Enter your date of birth
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="date"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCalculate()}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none"
              />
              <button
                onClick={handleCalculate}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              >
                Calculate My Age →
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* Main age breakdown */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
                <p className="mb-5 text-xl font-bold text-white">
                  You are{" "}
                  <span className="text-[#e94560]">{result.years} years</span>,{" "}
                  <span className="text-[#e94560]">{result.months} months</span> and{" "}
                  <span className="text-[#e94560]">{result.days} days</span> old
                </p>
                <div className="space-y-2.5 border-t border-[#0f3460] pt-4">
                  {ROW_DATA.map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[#a8a8b3]">{label}</span>
                      <span className="font-semibold text-white">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2.5 border-t border-[#0f3460] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a8a8b3]">Born on a</span>
                    <span className="font-semibold text-white">{result.bornOnDay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#a8a8b3]">Next birthday in</span>
                    <span className="font-bold text-[#e94560]">{commas(result.nextBirthdayDays)} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#a8a8b3]">Your next birthday is on a</span>
                    <span className="font-semibold text-white">{result.nextBirthdayDay}</span>
                  </div>
                </div>
              </div>

              {/* Fun facts */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 text-lg font-bold text-white">✨ Fun Facts</h3>
                <ul className="space-y-3">
                  {FUN_FACTS.map(fact => (
                    <li key={fact} className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 font-bold text-[#e94560]">→</span>
                      <span className="text-[#a8a8b3]">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result && (
            <ShareButtons
              text={`I am ${result.years} years, ${result.months} months and ${result.days} days old! That is ${result.totalDays.toLocaleString()} total days alive!`}
              url="https://dayblip.com/age-calculator"
              title="Age Calculator"
            />
          )}

          {/* Ad — below results box */}
          <AdUnit slot="1234567890" format="rectangle" />
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-8 text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map(faq => (
              <details key={faq.q}
                className="group rounded-xl border border-[#16213e] bg-[#16213e] open:border-[#e94560]/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white">
                  <span>{faq.q}</span>
                  <span className="shrink-0 text-xl text-[#e94560] transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 pt-1 leading-relaxed text-[#a8a8b3]">{faq.a}</p>
              </details>
            ))}
          </div>
          {/* Ad — below FAQ */}
          <AdUnit slot="1234567890" format="leaderboard" />
        </div>
      </section>
    </div>
  );
}
