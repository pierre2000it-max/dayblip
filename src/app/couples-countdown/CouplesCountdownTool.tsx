"use client";

import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

// ── Helpers ───────────────────────────────────────────────────────────────────

function commas(n: number) { return n.toLocaleString(); }

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86400000);
}

const MILESTONES = [100, 365, 500, 1000, 1500, 2000, 3000, 5000];

interface CouplesResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextAnniversary: Date;
  daysToAnniversary: number;
  milestones: { label: string; date: Date; isPast: boolean; daysAway: number }[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CouplesCountdownTool() {
  const [startDate, setStartDate] = useState("");
  const [name1,     setName1]     = useState("");
  const [name2,     setName2]     = useState("");
  const [result,    setResult]    = useState<CouplesResult | null>(null);
  const [error,     setError]     = useState("");

  // Restore names from localStorage
  useEffect(() => {
    try {
      setName1(localStorage.getItem("cc_name1") ?? "");
      setName2(localStorage.getItem("cc_name2") ?? "");
    } catch { /* ignore */ }
  }, []);

  const saveName1 = (v: string) => {
    setName1(v);
    try { localStorage.setItem("cc_name1", v); } catch { /* ignore */ }
  };
  const saveName2 = (v: string) => {
    setName2(v);
    try { localStorage.setItem("cc_name2", v); } catch { /* ignore */ }
  };

  const calculate = () => {
    if (!startDate) { setError("Please enter your start date."); return; }
    const start = new Date(startDate + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (start > today) { setError("Date must be in the past."); return; }
    setError("");

    const totalDays = Math.floor((today.getTime() - start.getTime()) / 86400000);
    let years  = today.getFullYear() - start.getFullYear();
    let months = today.getMonth()    - start.getMonth();
    let days   = today.getDate()     - start.getDate();
    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    // Next anniversary
    let nextAnn = new Date(today.getFullYear(), start.getMonth(), start.getDate());
    if (nextAnn <= today) nextAnn = new Date(today.getFullYear() + 1, start.getMonth(), start.getDate());
    const daysToAnn = Math.ceil((nextAnn.getTime() - today.getTime()) / 86400000);

    const milestones = MILESTONES.map(d => {
      const date    = addDays(start, d);
      const isPast  = date <= today;
      const daysAway = isPast ? 0 : Math.ceil((date.getTime() - today.getTime()) / 86400000);
      return { label: d === 365 ? "1 Year (365 days)" : `${commas(d)} days`, date, isPast, daysAway };
    });

    setResult({ years, months, days, totalDays, totalHours: totalDays * 24, totalMinutes: totalDays * 24 * 60, nextAnniversary: nextAnn, daysToAnniversary: daysToAnn, milestones });
  };

  const couple = name1 && name2 ? `${name1} & ${name2}` : name1 ? name1 : "You two";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💕</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Couples Countdown</h1>
          <p className="text-lg text-[#a8a8b3]">How long have you been together?</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">When did you get together?</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Your name (optional)</label>
                <input type="text" value={name1} onChange={e => saveName1(e.target.value)} placeholder="Your name"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Partner name (optional)</label>
                <input type="text" value={name2} onChange={e => saveName2(e.target.value)} placeholder="Partner name"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              </div>
            </div>
            <button onClick={calculate}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Calculate →
            </button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              {/* Hero result */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-2xl font-bold text-white mb-2">{couple} 💕</p>
                <p className="text-[#a8a8b3] mb-4">Together for</p>
                <p className="text-4xl font-black text-[#e94560]">{commas(result.totalDays)} days</p>
                <p className="text-[#a8a8b3] mt-2">
                  {result.years > 0 && `${result.years} year${result.years > 1 ? "s" : ""}, `}
                  {result.months > 0 && `${result.months} month${result.months > 1 ? "s" : ""}, `}
                  {result.days} day{result.days !== 1 ? "s" : ""}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Total days",    val: commas(result.totalDays) },
                    { label: "Total hours",   val: commas(result.totalHours) },
                    { label: "Total minutes", val: commas(result.totalMinutes) },
                    { label: "Next anniversary in", val: `${result.daysToAnniversary} days` },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg bg-[#16213e] p-3">
                      <div className="text-xs text-[#a8a8b3]">{s.label}</div>
                      <div className="font-bold text-white">{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anniversary */}
              <div className="rounded-xl border border-[#e94560]/20 bg-[#16213e] p-5">
                <p className="text-[#a8a8b3] text-sm">Your next anniversary is in</p>
                <p className="text-2xl font-bold text-[#e94560]">{result.daysToAnniversary} days</p>
                <p className="text-white">on {fmtDate(result.nextAnniversary)}</p>
              </div>

              {/* Milestones */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 font-bold text-white">Relationship Milestones</h3>
                <div className="space-y-2">
                  {result.milestones.map(m => (
                    <div key={m.label}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${m.isPast ? "border-[#0f3460] opacity-60" : "border-[#e94560]/30"}`}>
                      <div className="flex items-center gap-2">
                        <span>{m.isPast ? "✅" : "⏳"}</span>
                        <span className={`font-semibold ${m.isPast ? "text-[#a8a8b3]" : "text-white"}`}>{m.label}</span>
                      </div>
                      <div className="text-right text-sm">
                        {m.isPast
                          ? <span className="text-[#a8a8b3]">{fmtDate(m.date)}</span>
                          : <span className="text-[#e94560]">in {commas(m.daysAway)} days</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result && (
                <ShareButtons
                  text={`We have been together ${result.totalDays.toLocaleString()} days! 💕 Calculate yours!`}
                  url="https://dayblip.com/couples-countdown"
                  title="Couples Countdown"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
