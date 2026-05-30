"use client";

import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

// ── Date helpers ────────────────────────────────────────────────────────────

function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getThanksgiving(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const daysToFirstThu = (4 - nov1.getDay() + 7) % 7;
  return new Date(year, 10, 1 + daysToFirstThu + 21);
}

function getBlackFriday(year: number): Date {
  const tg = getThanksgiving(year);
  return new Date(tg.getFullYear(), tg.getMonth(), tg.getDate() + 1);
}

function getMothersDay(year: number): Date {
  const may1 = new Date(year, 4, 1);
  const daysToFirstSun = (7 - may1.getDay()) % 7;
  return new Date(year, 4, 1 + daysToFirstSun + 7);
}

function getHolidayDate(date: string, year: number): Date {
  switch (date) {
    case "dynamic-thanksgiving": return getThanksgiving(year);
    case "dynamic-easter":       return getEaster(year);
    case "dynamic-blackfriday":  return getBlackFriday(year);
    case "dynamic-mothersday":   return getMothersDay(year);
    default: {
      const parts = date.split("-").map(Number);
      return new Date(year, parts[0] - 1, parts[1]);
    }
  }
}

function getNextOccurrence(date: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  let target = getHolidayDate(date, year);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() <= today.getTime()) {
    target = getHolidayDate(date, year + 1);
    target.setHours(0, 0, 0, 0);
  }
  return target;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(date: string): TimeLeft {
  const target = getNextOccurrence(date);
  const diff = Math.max(0, target.getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    days:    Math.floor(total / 86400),
    hours:   Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

// ── Component ───────────────────────────────────────────────────────────────

interface Props {
  date:  string;
  color: string;
  name?: string; // holiday name for "falls on" display
}

const UNIT_LABELS = ["Days", "Hours", "Minutes", "Seconds"] as const;

export default function CountdownDisplay({ date, color, name }: Props) {
  const [timeLeft,   setTimeLeft]   = useState<TimeLeft | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    const target = getNextOccurrence(date);
    setTargetDate(target);
    setTimeLeft(calcTimeLeft(date));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  // Pre-hydration placeholder
  if (!timeLeft || !targetDate) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {UNIT_LABELS.map((label) => (
          <div key={label}
            className="flex min-w-[110px] flex-col items-center rounded-xl border border-[#0f3460] bg-[#0f3460]/40 px-6 py-5">
            <span className="text-6xl font-bold leading-none text-white/20 tabular-nums">--</span>
            <span className="mt-2 text-sm uppercase tracking-wider text-[#a8a8b3]">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  // Compute date display info
  const dayOfWeek     = DAY_NAMES[targetDate.getDay()];
  const monthName     = MONTH_NAMES[targetDate.getMonth()];
  const dayNum        = targetDate.getDate();
  const targetYear    = targetDate.getFullYear();
  const dateStr       = `${dayOfWeek}, ${monthName} ${dayNum}, ${targetYear}`;

  const todayMs       = new Date().setHours(0, 0, 0, 0);
  const daysUntil     = Math.ceil((targetDate.getTime() - todayMs) / 86400000);
  const weeksAway     = Math.floor(daysUntil / 7);
  const daysRemainder = daysUntil % 7;
  const weeksStr      = weeksAway > 0
    ? `${weeksAway} week${weeksAway !== 1 ? "s" : ""} and ${daysRemainder} day${daysRemainder !== 1 ? "s" : ""} away`
    : `${daysRemainder} day${daysRemainder !== 1 ? "s" : ""} away`;

  return (
    <div>
      {/* Countdown boxes */}
      <div className="flex flex-wrap justify-center gap-4">
        {units.map((u) => (
          <div key={u.label}
            className="flex min-w-[110px] flex-col items-center rounded-xl border border-[#0f3460] bg-[#0f3460]/60 px-6 py-5 transition-all duration-300"
            style={{ boxShadow: `0 0 24px ${color}33` }}>
            <span className="text-6xl font-bold leading-none text-white tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-2 text-sm uppercase tracking-wider text-[#a8a8b3]">{u.label}</span>
          </div>
        ))}
      </div>

      {/* Date info below countdown */}
      <div className="mt-6 border-t border-white/10 pt-5 space-y-2 text-center">
        <p className="text-white text-lg font-semibold">📅 {dateStr}</p>
        <p className="text-[#a8a8b3] text-sm">📆 That is {weeksStr}</p>
        {name && (
          <p className="text-[#a8a8b3] text-sm">
            🗓️ {name} falls on a <strong className="text-white">{dayOfWeek}</strong> this year
          </p>
        )}
      </div>

      <div className="mt-6">
        <ShareButtons
          text={`${name ? name : "My countdown"} is ${daysUntil} days away! Check the countdown!`}
          url={typeof window !== "undefined" ? window.location.href : "https://dayblip.com/days-until"}
          title={name ? `Days Until ${name}` : "Days Until Countdown"}
        />
      </div>
    </div>
  );
}
