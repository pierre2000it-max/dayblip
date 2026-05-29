"use client";

import { useState } from "react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function commas(n: number) { return n.toLocaleString(); }

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86400000);
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface Milestone {
  label: string;
  date: Date;
  isPast: boolean;
}

interface LifeResult {
  daysLived: number;
  daysRemaining: number;
  yearsLived: string;
  yearsRemaining: string;
  weeksLived: number;
  hoursLived: number;
  pct: string;
  pctNum: number;
  milestones: Milestone[];
  birth: Date;
  totalDays: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LifeProgressTool() {
  const [dob,      setDob]      = useState("");
  const [lifespan, setLifespan] = useState(80);
  const [result,   setResult]   = useState<LifeResult | null>(null);
  const [error,    setError]    = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");

    const daysLived   = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    const totalDays   = Math.round(lifespan * 365.25);
    const pctNum      = Math.min(100, daysLived / totalDays * 100);

    const dayMarks    = [1000, 5000, 10000, 15000, 20000, 25000, 30000];
    const halfwayDay  = Math.floor(totalDays / 2);

    const milestones: Milestone[] = [
      ...dayMarks.map(d => ({
        label: `Day ${commas(d)}`,
        date:  addDays(birth, d),
        isPast: addDays(birth, d) <= today,
      })),
      {
        label: "50% of life",
        date:  addDays(birth, halfwayDay),
        isPast: addDays(birth, halfwayDay) <= today,
      },
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    setResult({
      daysLived,
      daysRemaining:  Math.max(0, totalDays - daysLived),
      yearsLived:     (daysLived / 365.25).toFixed(1),
      yearsRemaining: Math.max(0, (totalDays - daysLived) / 365.25).toFixed(1),
      weeksLived:     Math.floor(daysLived / 7),
      hoursLived:     daysLived * 24,
      pct:            pctNum.toFixed(2),
      pctNum,
      milestones,
      birth,
      totalDays,
    });
  };

  const shareText = result
    ? encodeURIComponent(`I am ${result.pct}% through my life 😮\n${commas(result.daysLived)} days lived, ${commas(result.daysRemaining)} days to go\nCheck yours → dayblip.com/life-progress`)
    : "";

  const STATS = result ? [
    { icon: "✅", label: "Days lived",         val: commas(result.daysLived) },
    { icon: "⏳", label: "Days remaining",      val: commas(result.daysRemaining) },
    { icon: "📅", label: "Years lived",         val: result.yearsLived },
    { icon: "🎯", label: "Years remaining",     val: result.yearsRemaining },
    { icon: "🗓️", label: "Weeks lived",         val: commas(result.weeksLived) },
    { icon: "⏰", label: "Hours lived (approx)", val: commas(result.hoursLived) },
  ] : [];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📊</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Your Life Progress Bar</h1>
          <p className="text-lg text-[#a8a8b3]">See how far through life you are</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">
                Expected lifespan: <span className="text-[#e94560]">{lifespan} years</span>
              </label>
              <input type="range" min={60} max={100} value={lifespan} onChange={e => setLifespan(Number(e.target.value))}
                className="w-full accent-[#e94560]" />
              <div className="mt-1 flex justify-between text-xs text-[#a8a8b3]">
                <span>60</span><span>80</span><span>100</span>
              </div>
            </div>
            <button onClick={calculate}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Show My Progress →
            </button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Progress bar */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl font-black text-[#e94560]">{result.pct}%</span>
                  <span className="text-[#a8a8b3] text-sm">Complete</span>
                </div>
                <div className="h-8 w-full overflow-hidden rounded-full bg-[#16213e]">
                  <div className="h-full rounded-full bg-[#e94560] transition-all duration-1000"
                    style={{ width: `${result.pctNum}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-[#a8a8b3]">
                  <span>Born {fmtDate(result.birth)}</span>
                  <span>{commas(result.totalDays)} total days</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {STATS.map(s => (
                  <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                    <div className="text-lg">{s.icon}</div>
                    <div className="mt-1 text-xs text-[#a8a8b3]">{s.label}</div>
                    <div className="mt-0.5 font-bold text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Milestones */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-5 text-lg font-bold text-white">Life Milestones</h3>
                <div className="space-y-3">
                  {result.milestones.map(m => (
                    <div key={m.label}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${m.isPast ? "border-[#0f3460] opacity-60" : "border-[#e94560]/40"}`}>
                      <div className="flex items-center gap-3">
                        <span>{m.isPast ? "✅" : "⏳"}</span>
                        <span className={`font-semibold ${m.isPast ? "text-[#a8a8b3]" : "text-white"}`}>{m.label}</span>
                      </div>
                      <span className="text-sm text-[#a8a8b3]">{fmtDate(m.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <a href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Share My Life Progress on X →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
