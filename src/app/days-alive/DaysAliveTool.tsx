"use client";

import { useState } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const MILESTONE_DAYS = [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,12000,15000,20000,25000,30000,35000,40000];

function commas(n: number) { return n.toLocaleString(); }

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86400000);
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface MilestoneResult {
  days: number;
  date: Date;
  isPast: boolean;
  daysAway: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DaysAliveTool() {
  const [dob,     setDob]     = useState("");
  const [results, setResults] = useState<MilestoneResult[] | null>(null);
  const [daysOld, setDaysOld] = useState(0);
  const [error,   setError]   = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");

    const daysAlive = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    setDaysOld(daysAlive);

    const ms: MilestoneResult[] = MILESTONE_DAYS.map(d => {
      const date    = addDays(birth, d);
      const isPast  = date <= today;
      const daysAway = isPast ? 0 : Math.ceil((date.getTime() - today.getTime()) / 86400000);
      return { days: d, date, isPast, daysAway };
    });
    setResults(ms);
  };

  const past   = results?.filter(m => m.isPast)  ?? [];
  const future = results?.filter(m => !m.isPast) ?? [];
  const next   = future[0];

  const shareText = encodeURIComponent(
    `I am ${commas(daysOld)} days old today! 🎉\nFind out how many days old you are → dayblip.com/days-alive`
  );

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎯</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Days Alive Milestone Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">Find out when you hit major milestones in days alive</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={calculate}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Calculate My Milestones →
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {results && (
            <div className="mt-8 space-y-6">
              {/* Today's count */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] text-sm mb-1">You are</p>
                <p className="text-5xl font-black text-[#e94560]">{commas(daysOld)}</p>
                <p className="text-white text-xl font-semibold mt-1">days old today</p>
              </div>

              {/* Next milestone highlight */}
              {next && (
                <div className="rounded-xl border border-[#e94560]/30 bg-[#16213e] p-5">
                  <p className="text-sm text-[#a8a8b3] mb-1">Your next milestone</p>
                  <p className="text-white font-bold text-lg">Day {commas(next.days)}</p>
                  <p className="text-[#e94560] font-semibold">in {commas(next.daysAway)} days — {fmtDate(next.date)}</p>
                </div>
              )}

              {/* Past milestones */}
              {past.length > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                  <h3 className="mb-4 font-bold text-white">✅ Past Milestones</h3>
                  <div className="space-y-2">
                    {past.map(m => (
                      <div key={m.days} className="flex items-center justify-between rounded-lg bg-[#16213e] px-4 py-2.5 opacity-70">
                        <span className="text-white font-semibold">Day {commas(m.days)}</span>
                        <span className="text-[#a8a8b3] text-sm">{fmtDate(m.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming milestones */}
              {future.length > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                  <h3 className="mb-4 font-bold text-white">⏳ Upcoming Milestones</h3>
                  <div className="space-y-2">
                    {future.map(m => (
                      <div key={m.days} className="flex items-center justify-between rounded-lg border border-[#e94560]/20 bg-[#16213e] px-4 py-2.5">
                        <span className="text-white font-semibold">Day {commas(m.days)}</span>
                        <div className="text-right">
                          <span className="text-[#e94560] text-sm font-semibold block">in {commas(m.daysAway)} days</span>
                          <span className="text-[#a8a8b3] text-xs">{fmtDate(m.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <a href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Share on X →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
