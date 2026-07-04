"use client";

import { useState } from "react";
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
    { "@type": "Question", name: "How do I add days to a date?",
      acceptedAnswer: { "@type": "Answer", text: "Use Mode A above, select Add, enter the number of days and click Calculate." } },
    { "@type": "Question", name: "How many days between two dates?",
      acceptedAnswer: { "@type": "Answer", text: "Use Mode B above, enter both dates and click Calculate to see the exact count." } },
    { "@type": "Question", name: "What date is 90 days from today?",
      acceptedAnswer: { "@type": "Answer", text: "Select today as your start date, choose Add 90 Days and click Calculate." } },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateDisplay(d: Date): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatDateShort(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function addToDate(dateStr: string, amount: number, unit: string, op: string): Date {
  const d = new Date(dateStr + "T00:00:00");
  const n = op === "subtract" ? -amount : amount;
  if (unit === "days")   d.setDate(d.getDate() + n);
  if (unit === "weeks")  d.setDate(d.getDate() + n * 7);
  if (unit === "months") d.setMonth(d.getMonth() + n);
  if (unit === "years")  d.setFullYear(d.getFullYear() + n);
  return d;
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

type Mode = "add-subtract" | "days-between";

interface ResultA {
  resultDate: Date;
  operation: string;
  amount: number;
  unit: string;
  fromDate: Date;
}

interface ResultB {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  approxMonths: number;
  weekdays: number;
  weekendDays: number;
  date1: Date;
  date2: Date;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DateCalculatorTool() {
  const [mode, setMode] = useState<Mode>("add-subtract");

  // Mode A state
  const [startDate, setStartDate] = useState("");
  const [operation, setOperation] = useState("add");
  const [amount,    setAmount]    = useState("90");
  const [unit,      setUnit]      = useState("days");
  const [resultA,   setResultA]   = useState<ResultA | null>(null);

  // Mode B state
  const [dateB1,  setDateB1]  = useState("");
  const [dateB2,  setDateB2]  = useState("");
  const [resultB, setResultB] = useState<ResultB | null>(null);

  const [error, setError] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleCalculateA = () => {
    if (!startDate) { setError("Please enter a start date."); return; }
    const n = parseInt(amount, 10);
    if (isNaN(n) || n < 0) { setError("Please enter a valid positive number."); return; }
    setError("");
    const from = new Date(startDate + "T00:00:00");
    const result = addToDate(startDate, n, unit, operation);
    setResultA({ resultDate: result, operation, amount: n, unit, fromDate: from });
  };

  const handleCalculateB = () => {
    if (!dateB1 || !dateB2) { setError("Please enter both dates."); return; }
    setError("");
    const d1 = new Date(dateB1 + "T00:00:00");
    const d2 = new Date(dateB2 + "T00:00:00");
    const totalDays  = Math.abs(Math.floor((d2.getTime() - d1.getTime()) / 86400000));
    const weeks      = Math.floor(totalDays / 7);
    const remaining  = totalDays % 7;
    const wd         = countWeekdays(d1, d2);
    setResultB({
      totalDays,
      weeks,
      remainingDays: remaining,
      approxMonths:  Math.floor(totalDays / 30.44),
      weekdays:      wd,
      weekendDays:   totalDays - wd,
      date1:         d1,
      date2:         d2,
    });
  };

  const FAQS = [
    { q: "How do I add days to a date?",
      a: "Use Mode A above, select Add, enter the number of days and click Calculate." },
    { q: "How many days between two dates?",
      a: "Use Mode B above, enter both dates and click Calculate to see the exact count." },
    { q: "What date is 90 days from today?",
      a: "Select today as your start date, choose Add 90 Days and click Calculate." },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📅</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Date Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">
            Add or subtract days, weeks, months or years from any date
          </p>
        </div>
      </section>

      {/* ── Calculator ─────────────────────────────────────────────── */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">

          {/* Mode tabs */}
          <div className="mb-6 flex rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-1">
            {(["add-subtract", "days-between"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setResultA(null); setResultB(null); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-[#e94560] text-white"
                    : "text-[#a8a8b3] hover:text-white"
                }`}
              >
                {m === "add-subtract" ? "Add / Subtract from Date" : "Days Between Two Dates"}
              </button>
            ))}
          </div>

          {/* ── MODE A ──────────────────────────────────────────────── */}
          {mode === "add-subtract" && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-white">Start date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-white">Operation</label>
                    <select value={operation} onChange={e => setOperation(e.target.value)}
                      className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                      <option value="add">Add</option>
                      <option value="subtract">Subtract</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-white">Amount</label>
                    <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-white">Unit</label>
                    <select value={unit} onChange={e => setUnit(e.target.value)}
                      className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleCalculateA}
                  className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Calculate →
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-[#e94560]">{error}</p>}
              {resultA && (
                <div className="mt-6 rounded-lg border border-[#e94560]/30 bg-[#16213e] p-5">
                  <p className="mb-3 text-lg font-bold text-white">
                    {resultA.amount} {resultA.unit}{" "}
                    {resultA.operation === "add" ? "after" : "before"}{" "}
                    <span className="text-[#e94560]">{formatDateShort(resultA.fromDate)}</span> is:
                  </p>
                  <p className="text-2xl font-bold text-[#e94560]">{formatDateShort(resultA.resultDate)}</p>
                  <p className="mt-1 text-sm text-[#a8a8b3]">{DAYS[resultA.resultDate.getDay()]}</p>
                </div>
              )}
            </div>
          )}

          {/* ── MODE B ──────────────────────────────────────────────── */}
          {mode === "days-between" && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-white">Start date</label>
                    <input type="date" value={dateB1} onChange={e => setDateB1(e.target.value)}
                      className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-white">End date</label>
                    <input type="date" value={dateB2} onChange={e => setDateB2(e.target.value)}
                      className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
                  </div>
                </div>
                <button onClick={handleCalculateB}
                  className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Calculate →
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-[#e94560]">{error}</p>}
              {resultB && (
                <div className="mt-6 rounded-lg border border-[#e94560]/30 bg-[#16213e] p-5 space-y-2.5">
                  <p className="text-2xl font-bold text-[#e94560]">
                    {resultB.totalDays.toLocaleString()} days
                  </p>
                  <p className="text-sm text-[#a8a8b3]">
                    between{" "}
                    <span className="text-white">{formatDateDisplay(resultB.date1)}</span>{" "}
                    and{" "}
                    <span className="text-white">{formatDateDisplay(resultB.date2)}</span>
                  </p>
                  <div className="border-t border-[#0f3460] pt-3 space-y-2">
                    {[
                      [`= ${resultB.weeks} weeks and ${resultB.remainingDays} days`, ""],
                      [`= ~${resultB.approxMonths} months`, ""],
                      [`${resultB.weekdays.toLocaleString()} weekdays (Mon–Fri)`, ""],
                      [`${resultB.weekendDays.toLocaleString()} weekend days`, ""],
                    ].map(([label]) => (
                      <div key={label} className="text-[#a8a8b3]">{label}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {mode === "add-subtract" && resultA && (
            <ShareButtons
              text={`${resultA.amount} ${resultA.unit} ${resultA.operation === "add" ? "after" : "before"} ${formatDateShort(resultA.fromDate)} is ${formatDateShort(resultA.resultDate)}. Calculated on Dayblip!`}
              url="https://www.dayblip.com/date-calculator"
              title="Date Calculator"
            />
          )}
          {mode === "days-between" && resultB && (
            <ShareButtons
              text={`There are ${resultB.totalDays.toLocaleString()} days between ${formatDateShort(resultB.date1)} and ${formatDateShort(resultB.date2)}. Calculated on Dayblip!`}
              url="https://www.dayblip.com/date-calculator"
              title="Date Calculator"
            />
          )}
          {/* Ad — below results box */}
          <AdUnit slot="1234567890" format="rectangle" />
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <FAQAccordion items={FAQS.map(faq => ({ question: faq.q, answer: faq.a }))} />
          {/* Ad — below FAQ */}
          <AdUnit slot="1234567890" format="leaderboard" />
        </div>
      </section>
    </div>
  );
}
