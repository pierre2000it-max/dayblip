"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

const DAYS_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface TimeLeft { days: number; h: number; m: number; s: number }

function calcTimeLeft(month: number, day: number): TimeLeft {
  const today = new Date();
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next <= today) next = new Date(today.getFullYear() + 1, month - 1, day);
  const diff = Math.max(0, next.getTime() - today.getTime());
  const total = Math.floor(diff / 1000);
  return { days: Math.floor(total / 86400), h: Math.floor((total % 86400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

// ── Birthday stats with real CDC birth distribution data ──────────────────────
const WORLD_POP     = 8_200_000_000;
const ANNUAL_BIRTHS = 140_000_000;
const WEEKLY_BIRTHS = Math.round(ANNUAL_BIRTHS / 52); // ~2,692,308 — constant

// CDC National Vital Statistics — actual US birth frequency by month
const MONTH_DIST: Record<number, number> = {
  1: 0.0791, 2: 0.0750, 3: 0.0816, 4: 0.0795, 5: 0.0816, 6: 0.0807,
  7: 0.0883, 8: 0.0902, 9: 0.0889, 10: 0.0866, 11: 0.0803, 12: 0.0882,
};

const DAYS_IN_MONTH: Record<number, number> = {
  1: 31, 2: 28.25, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31,    9: 30, 10: 31, 11: 30, 12: 31,
};

function getBirthdayStats(month: number, day: number) {
  // Special case: Feb 29 (leap day)
  if (month === 2 && day === 29) {
    const sharing = Math.round(WORLD_POP / (365.25 * 4));          // ~5,616,000
    const annual  = Math.round(ANNUAL_BIRTHS / (365.25 * 4));      // ~96,000
    return {
      sharing,
      annual,
      bornInMonth: Math.round(WORLD_POP * MONTH_DIST[2]),
      weekly: WEEKLY_BIRTHS,
      isLeapDay: true,
    };
  }
  const monthShare  = MONTH_DIST[month] ?? (1 / 12);
  const daysInMo    = DAYS_IN_MONTH[month] ?? 30;
  const dailyShare  = monthShare / daysInMo;
  return {
    sharing: Math.round(WORLD_POP * dailyShare),
    annual:  Math.round(ANNUAL_BIRTHS * dailyShare),
    bornInMonth: Math.round(WORLD_POP * monthShare),
    weekly: WEEKLY_BIRTHS,
    isLeapDay: false,
  };
}

function monthContext(month: number): string {
  if ([7, 8, 9].includes(month))
    return "Summer and fall birthdays are among the most common — you’re in good company!";
  if ([12, 1, 2, 3].includes(month))
    return "Winter and spring birthdays are less common — you’re more unique!";
  return "Your birth month has average frequency worldwide.";
}

export default function BirthdayCountdownClient({ slug }: { slug: string }) {
  const params = useSearchParams();
  const bd  = params.get("bd") ?? "";
  const msg = params.get("msg") ?? "";

  const [bdParts, setBdParts] = useState<{ month: number; day: number; year: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, h: 0, m: 0, s: 0 });
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    if (!bd) return;
    const [m, d, y] = bd.split("-").map(Number);
    if (!m || !d || !y) return;
    setBdParts({ month: m, day: d, year: y });
    setTimeLeft(calcTimeLeft(m, d));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(m, d)), 1000);
    return () => clearInterval(id);
  }, [bd]);

  const name     = toDisplayName(slug);
  const pageUrl  = typeof window !== "undefined" ? window.location.href : `https://dayblip.com/birthday-countdown/${slug}?bd=${bd}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  const nextBirthdayDate = bdParts
    ? (() => {
        const today = new Date();
        let d = new Date(today.getFullYear(), bdParts.month - 1, bdParts.day);
        if (d <= today) d = new Date(today.getFullYear() + 1, bdParts.month - 1, bdParts.day);
        return d;
      })()
    : null;

  const turningAge = bdParts && nextBirthdayDate ? nextBirthdayDate.getFullYear() - bdParts.year : null;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Confetti via CSS */}
      <style>{`
        @keyframes confetti-fall { 0%{transform:translateY(-100px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
        .confetti-piece { position:fixed; top:-20px; width:10px; height:10px; border-radius:2px; animation:confetti-fall linear infinite; pointer-events:none; z-index:50; }
      `}</style>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${(i * 8.5) % 100}%`,
          background: ["#e94560","#FFD700","#4FC3F7","#9b59b6","#27ae60"][i % 5],
          animationDuration: `${3 + (i % 4)}s`,
          animationDelay: `${(i * 0.3) % 2}s`,
        }} />
      ))}

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">🎂 {name}&apos;s Birthday Countdown!</h1>
          {msg && <p className="text-lg text-[#e94560] italic">&ldquo;{msg}&rdquo;</p>}
          {turningAge && <p className="mt-2 text-[#a8a8b3]">{name} is turning <strong className="text-white">{turningAge}</strong>!</p>}
          {nextBirthdayDate && (
            <p className="text-sm text-[#a8a8b3] mt-1">
              Birthday: {MONTH_NAMES[nextBirthdayDate.getMonth()]} {nextBirthdayDate.getDate()}, {nextBirthdayDate.getFullYear()} ({DAYS_NAMES[nextBirthdayDate.getDay()]})
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-8">
          {/* Countdown */}
          <div className="flex flex-wrap justify-center gap-4">
            {[{ label: "Days", val: timeLeft.days }, { label: "Hours", val: timeLeft.h }, { label: "Minutes", val: timeLeft.m }, { label: "Seconds", val: timeLeft.s }].map(u => (
              <div key={u.label} className="flex flex-col items-center rounded-xl border border-[#0f3460] bg-[#1a1a2e] px-6 py-5 min-w-[110px]">
                <span className="text-6xl font-black text-[#e94560] tabular-nums leading-none">{String(u.val).padStart(2,"0")}</span>
                <span className="mt-2 text-sm uppercase tracking-wider text-[#a8a8b3]">{u.label}</span>
              </div>
            ))}
          </div>

          {/* Share */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h3 className="mb-4 font-bold text-white text-lg">Share this countdown!</h3>
            <div className="flex flex-col gap-3 sm:flex-row mb-4">
              <input readOnly value={pageUrl} className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2 text-white text-sm" />
              <button onClick={copyLink}
                className="rounded-lg bg-[#e94560] px-4 py-2 font-semibold text-white text-sm transition-opacity hover:opacity-90">
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            <ShareButtons
              text={`${timeLeft.days} days until ${name}'s birthday! 🎂`}
              url={pageUrl}
              title={`${name}'s Birthday Countdown`}
            />
          </div>

          {/* Fun facts */}
          {(() => {
            const stats = bdParts
              ? getBirthdayStats(bdParts.month, bdParts.day)
              : null;
            const monthName = bdParts ? MONTH_NAMES[bdParts.month - 1] : "";
            const facts = stats ? [
              stats.isLeapDay
                ? `As a leap day birthday, only ~${(stats.sharing / 1_000_000).toFixed(1)} million people worldwide share your exact date!`
                : `~${(stats.sharing / 1_000_000).toFixed(1)} million people worldwide share your ${monthName} birthday`,
              `~${stats.annual.toLocaleString()} babies are born on your birthday each year`,
              `~${(stats.bornInMonth / 1_000_000).toFixed(0)} million people share your birth month of ${monthName}`,
              `~${(stats.weekly / 1_000_000).toFixed(1)} million babies are born worldwide each week`,
              "The word birthday originates from the Old English word byrddæg",
            ] : [
              "~22.4 million people worldwide share your birthday",
              "~2.7 million babies are born worldwide each week",
              "The word birthday originates from the Old English word byrddæg",
            ];
            return (
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-2">
                <h3 className="font-bold text-white mb-3">🎉 Birthday Fun Facts</h3>
                {facts.map(f => (
                  <div key={f} className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">{f}</span></div>
                ))}
                {nextBirthdayDate && (
                  <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">Your birthday falls on a {DAYS_NAMES[nextBirthdayDate.getDay()]} this year</span></div>
                )}
                {bdParts && (
                  <div className="flex gap-2"><span className="text-[#4FC3F7]">💡</span><span className="text-[#a8a8b3] text-sm">{monthContext(bdParts.month)}</span></div>
                )}
                <p className="text-xs text-[#a8a8b3]/60 pt-1">Based on CDC birth distribution data, world population of 8.2 billion and ~140 million annual global births.</p>
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
