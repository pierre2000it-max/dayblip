"use client";

import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";
import FinanceCTA from "@/components/FinanceCTA";
import GeoAnswerBlock from "@/components/GeoAnswerBlock";
import { generateShareImage } from "@/utils/generateShareImage";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const d = p.get("dob");
    if (d) { setDob(d); }
  }, []);

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");

    const daysAlive = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/days-alive?dob=" + dob);
    }
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

  function downloadShareImage() {
    if (!results) return
    void generateShareImage({
      title: "My Days Alive",
      primaryStat: daysOld.toLocaleString(),
      primaryLabel: "days alive",
      stats: [
        { label: "Next milestone", value: next ? `Day ${next.days.toLocaleString()}` : "—" },
        { label: "Days away", value: next ? `${next.daysAway.toLocaleString()} days` : "—" },
        { label: "Milestones passed", value: `${past.length} of ${MILESTONE_DAYS.length}` },
      ],
      tagline: "Every day is a milestone worth celebrating.",
      toolUrl: "dayblip.com/days-alive",
      filename: "dayblip-days-alive.png",
    })
  }


  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎯</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Days Alive Calculator — How Many Days Have You Been Alive?</h1>
          <p className="text-lg text-[#a8a8b3]">Find out when you hit major milestones in days alive</p>
        </div>
      </section>

      {/* ── GEO Answer Block ───────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-0 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <GeoAnswerBlock answer="To calculate how many days you have been alive: subtract your birth date from today's date. A person born on January 1, 1990 is approximately 12,966 days old as of mid-2025. Every 1,000 days is roughly 2 years and 9 months. Milestone days like 10,000 and 15,000 are worth celebrating. Use the interactive tool below." />
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">A 36-year-old has been alive for approximately 13,149 days. At 10,000 days old you are 27 years and 4 months. At 20,000 days old you are 54 years and 9 months. Most people never celebrate their 10,000 day milestone despite it being a remarkable achievement worth recognizing.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The days alive calculator converts your birth date into the total number of days you have been alive. It also shows milestone ages in days — your 1,000th day, 5,000th day, 10,000th day and 20,000th day. Many people find expressing age in days gives a fresh and striking perspective on time lived.</p>
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
              <FinanceCTA
                emoji="📈"
                headline="Your days are your greatest asset"
                description="See how much your money could grow over the days you have ahead."
                linkText="Compound Interest Calculator"
                href="/finance/compound-interest"
              />
              <ShareButtons
                text={`I am ${daysOld.toLocaleString()} days old today! 🎉 Find out how many days old you are!`}
                url={"https://www.dayblip.com/days-alive?dob=" + dob}
                title="Days Alive Calculator"
              />
              <button
                onClick={downloadShareImage}
                style={{ width: "100%", background: "#e8445a", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
                onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
              >
                📸 Download Your Result
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
