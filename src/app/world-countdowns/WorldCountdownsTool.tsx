"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import FinanceCTA from "@/components/FinanceCTA";

// ── Date helpers ──────────────────────────────────────────────────────────────

function getThanksgiving(y: number): Date {
  const nov1 = new Date(y, 10, 1);
  return new Date(y, 10, 1+((4-nov1.getDay()+7)%7)+21);
}
function getMothersDay(y: number): Date {
  const may1 = new Date(y, 4, 1);
  return new Date(y, 4, 1+((7-may1.getDay())%7)+7);
}
function getFathersDay(y: number): Date {
  const jun1 = new Date(y, 5, 1);
  return new Date(y, 5, 1+((7-jun1.getDay())%7)+14);
}

function nextDate(fn: (y: number) => Date): Date {
  const today = new Date(); today.setHours(0,0,0,0);
  const y = today.getFullYear();
  let t = fn(y); t.setHours(0,0,0,0);
  if (t.getTime() <= today.getTime()) { t = fn(y+1); t.setHours(0,0,0,0); }
  return t;
}
function nextFixed(month: number, day: number): Date {
  return nextDate(y => new Date(y, month-1, day));
}

// ── Events definition ─────────────────────────────────────────────────────────

interface WorldEvent {
  name: string;
  emoji: string;
  getTarget: () => Date;
}

const EVENTS: WorldEvent[] = [
  { name: "Christmas",       emoji: "🎄", getTarget: () => nextFixed(12, 25) },
  { name: "New Year's",      emoji: "🎆", getTarget: () => nextFixed(1,  1)  },
  { name: "Halloween",       emoji: "🎃", getTarget: () => nextFixed(10, 31) },
  { name: "Super Bowl",      emoji: "🏈", getTarget: () => new Date(2027,1,7) > new Date() ? new Date(2027,1,7) : new Date(2028,1,6) },
  { name: "Earth Day",       emoji: "🌍", getTarget: () => nextFixed(4,  22) },
  { name: "Mother's Day",    emoji: "👩‍👧", getTarget: () => nextDate(getMothersDay) },
  { name: "Father's Day",    emoji: "👨‍👧", getTarget: () => nextDate(getFathersDay) },
  { name: "Independence Day",emoji: "🇺🇸", getTarget: () => nextFixed(7,  4)  },
  { name: "Valentine's Day", emoji: "💝", getTarget: () => nextFixed(2,  14) },
  { name: "Thanksgiving",    emoji: "🦃", getTarget: () => nextDate(getThanksgiving) },
  { name: "St. Patrick's",   emoji: "☘️", getTarget: () => nextFixed(3,  17) },
  { name: "New Year's Eve",  emoji: "🎓", getTarget: () => nextFixed(12, 31) },
];

interface Countdown {
  days: number;
  h:    number;
  m:    number;
  s:    number;
}

function calc(target: Date): Countdown {
  const diff = Math.max(0, target.getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    h:    Math.floor((total % 86400) / 3600),
    m:    Math.floor((total % 3600) / 60),
    s:    total % 60,
  };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

// ── Time zones ────────────────────────────────────────────────────────────────

const CITIES = [
  { name: "New York",  tz: "America/New_York" },
  { name: "London",    tz: "Europe/London"    },
  { name: "Tokyo",     tz: "Asia/Tokyo"       },
  { name: "Sydney",    tz: "Australia/Sydney" },
];

function cityTime(tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  }).format(new Date());
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorldCountdownsTool() {
  const [countdowns, setCountdowns] = useState<Countdown[]>(() =>
    EVENTS.map(e => calc(e.getTarget()))
  );
  const [times, setTimes] = useState<string[]>(() => CITIES.map(c => cityTime(c.tz)));
  const olympicsDays = Math.max(0, Math.ceil((new Date(2028, 6, 14).getTime() - Date.now()) / 86400000));

  useEffect(() => {
    const id = setInterval(() => {
      setCountdowns(EVENTS.map(e => calc(e.getTarget())));
      setTimes(CITIES.map(c => cityTime(c.tz)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[900px]">
          <div className="mb-4 text-5xl">🌍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Live World Countdowns</h1>
          <p className="text-lg text-[#a8a8b3]">Real-time countdowns to the world&apos;s biggest events</p>
        </div>
      </section>

      {/* Countdown grid */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((ev, i) => {
              const c = countdowns[i];
              return (
                <div key={ev.name}
                  className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{ev.emoji}</span>
                    <span className="font-bold text-white">{ev.name}</span>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="text-center">
                      <div className="text-3xl font-black text-[#e94560] tabular-nums">{c.days}</div>
                      <div className="text-xs text-[#a8a8b3]">days</div>
                    </div>
                    <span className="text-[#a8a8b3] text-xl mb-3">:</span>
                    <div className="text-center">
                      <div className="text-3xl font-black text-white tabular-nums">{pad(c.h)}</div>
                      <div className="text-xs text-[#a8a8b3]">hrs</div>
                    </div>
                    <span className="text-[#a8a8b3] text-xl mb-3">:</span>
                    <div className="text-center">
                      <div className="text-3xl font-black text-white tabular-nums">{pad(c.m)}</div>
                      <div className="text-xs text-[#a8a8b3]">min</div>
                    </div>
                    <span className="text-[#a8a8b3] text-xl mb-3">:</span>
                    <div className="text-center">
                      <div className="text-3xl font-black text-white tabular-nums">{pad(c.s)}</div>
                      <div className="text-xs text-[#a8a8b3]">sec</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <FinanceCTA
              emoji="🎁"
              headline="Make your holidays count"
              description="See how much your holiday spending could grow if you invested it instead of spending it."
              linkText="Try the Compound Interest Calculator"
              href="/finance/compound-interest"
            />
            <ShareButtons
              text={`The next Olympics is in ${olympicsDays.toLocaleString()} days. See live countdowns to every major world event on Dayblip!`}
              url="https://www.dayblip.com/world-countdowns"
              title="Live World Countdowns"
            />
          </div>
        </div>
      </section>

      {/* Time zones */}
      <section className="bg-[#1a1a2e] px-6 py-12">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-6 text-xl font-bold text-white">Current Time Around the World</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CITIES.map((c, i) => (
              <div key={c.name} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4 text-center">
                <div className="text-xs text-[#a8a8b3] mb-1">{c.name}</div>
                <div className="text-xl font-bold text-white tabular-nums">{times[i]}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#0f3460] bg-[#16213e] p-5 text-center">
            <p className="text-[#a8a8b3] text-sm mb-2">Want more real-time world stats?</p>
            <Link href="/world-counters"
              className="inline-block rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity">
              🌍 World Live Counters — Births, Debt &amp; More →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
