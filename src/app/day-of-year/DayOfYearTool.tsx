"use client";

import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isLeap(y: number) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

function getWeekOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff  = d.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

function getQuarter(d: Date): number { return Math.ceil((d.getMonth() + 1) / 3); }

function fmtFull(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function DayOfYearTool() {
  const [today,      setToday]      = useState<Date | null>(null);
  const [lookupDate, setLookupDate] = useState("");
  const [lookupResult, setLookupResult] = useState<{ date: Date; dayNum: number } | null>(null);

  useEffect(() => { setToday(new Date()); }, []);

  if (!today) return null;

  const dayNum    = getDayOfYear(today);
  const year      = today.getFullYear();
  const totalDays = isLeap(year) ? 366 : 365;
  const remaining = totalDays - dayNum;
  const pct       = (dayNum / totalDays * 100).toFixed(1);
  const week      = getWeekOfYear(today);
  const quarter   = getQuarter(today);

  const handleLookup = () => {
    if (!lookupDate) return;
    const d = new Date(lookupDate + "T00:00:00");
    setLookupResult({ date: d, dayNum: getDayOfYear(d) });
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-2 text-[#a8a8b3] text-lg">Today is</div>
          <div className="flex items-end justify-center gap-3 mb-2">
            <span className="text-8xl font-black text-[#e94560] leading-none">{dayNum}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">of {totalDays}</div>
          <h1 className="text-2xl font-bold text-white md:text-3xl mb-3">What Day of the Year Is It?</h1>
          <p className="text-[#a8a8b3]">{fmtFull(today)}</p>
        </div>
      </section>

      {/* Year progress */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 mb-6">
            <div className="mb-3 flex justify-between items-center">
              <span className="text-white font-bold">Year {year} Progress</span>
              <span className="text-[#e94560] font-bold text-xl">{pct}%</span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-full bg-[#16213e]">
              <div className="h-full rounded-full bg-[#e94560] transition-all"
                style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-sm text-[#a8a8b3]">{remaining} days remaining in {year}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-8 md:grid-cols-3">
            {[
              { label: "Day of the year",    val: `Day ${dayNum}` },
              { label: "Days remaining",     val: String(remaining) },
              { label: "Year % complete",    val: `${pct}%` },
              { label: "Day of the week",    val: DAYS[today.getDay()] },
              { label: "Week of year",       val: `Week ${week}` },
              { label: "Quarter",            val: `Q${quarter}` },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                <div className="text-xs text-[#a8a8b3] mb-1">{s.label}</div>
                <div className="font-bold text-white">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Lookup */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h3 className="mb-4 font-bold text-white">Look Up Any Date</h3>
            <div className="flex gap-3">
              <input type="date" value={lookupDate} onChange={e => setLookupDate(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={handleLookup}
                className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Check →
              </button>
            </div>
            {lookupResult && (
              <div className="mt-4 rounded-lg bg-[#16213e] px-4 py-3">
                <p className="text-white">
                  <strong>{fmtFull(lookupResult.date)}</strong> is{" "}
                  <strong className="text-[#e94560]">day {lookupResult.dayNum}</strong>{" "}
                  of {lookupResult.date.getFullYear()}
                </p>
              </div>
            )}
          </div>
          <ShareButtons
            text={`Today is day ${dayNum} of ${totalDays} in ${year}. How far through the year are we? Check on Dayblip!`}
            url="https://www.dayblip.com/day-of-year"
            title="Day of Year"
          />
        </div>
      </section>
    </div>
  );
}
