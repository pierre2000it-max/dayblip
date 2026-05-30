"use client";

import { useState } from "react";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import bornInRaw from "@/data/bornIn.json";
import onThisDayRaw from "@/data/onThisDay.json";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BornIn {
  year: number;
  number1Song: string;
  number1Movie: string;
  worldEvent: string;
  gasPrice: string;
}

interface DayData {
  events: { year: number; event: string }[];
  birthdays: { name: string; year: number; role: string }[];
}

const bornInData     = bornInRaw    as BornIn[];
const onThisDayData  = onThisDayRaw as Record<string, DayData>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTH_SLUG = ["january","february","march","april","may","june","july","august","september","october","november","december"];

function addDays(d: Date, n: number): Date { return new Date(d.getTime() + n * 86400000); }

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function dateToSlug(d: Date): string { return `${MONTH_SLUG[d.getMonth()]}-${d.getDate()}`; }

function getBornIn(year: number): BornIn | undefined { return bornInData.find(b => b.year === year); }

function getOnThisDay(d: Date): DayData | undefined { return onThisDayData[dateToSlug(d)]; }

function getContextForDate(d: Date, birthYear: number): string {
  const year = d.getFullYear();
  const otd  = getOnThisDay(d);
  if (otd?.events?.[0]) return otd.events[0].event;
  const bi = getBornIn(year);
  if (bi) return bi.worldEvent;
  const biNear = getBornIn(birthYear);
  if (biNear) return biNear.worldEvent;
  return "";
}

// ── Milestones ────────────────────────────────────────────────────────────────

const MILESTONE_DEFS = [
  { days: 0,     label: "Day you were born",  useData: "birth"  },
  { days: 100,   label: "Day 100",             useData: "otd"    },
  { days: 365,   label: "1st Birthday",        useData: "song"   },
  { days: 1000,  label: "Day 1,000",           useData: "event"  },
  { days: 3650,  label: "10th Birthday",       useData: "movie"  },
  { days: 5000,  label: "Day 5,000",           useData: "event"  },
  { days: 6570,  label: "18th Birthday",       useData: "event"  },
  { days: 7665,  label: "21st Birthday",       useData: "event"  },
  { days: 10000, label: "Day 10,000",          useData: "event"  },
  { days: 10950, label: "30th Birthday",       useData: "event"  },
];

interface TimelineItem {
  label:   string;
  date:    Date;
  context: string;
  isPast:  boolean;
  days:    number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ThisDayInMyLifeTool() {
  const [dob,      setDob]      = useState("");
  const [timeline, setTimeline] = useState<TimelineItem[] | null>(null);
  const [daysOld,  setDaysOld]  = useState(0);
  const [error,    setError]    = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");

    const alive  = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    setDaysOld(alive);

    const items: TimelineItem[] = MILESTONE_DEFS.map(def => {
      const date    = addDays(birth, def.days);
      const year    = date.getFullYear();
      const bi      = getBornIn(year);

      let context = "";
      if (def.useData === "birth" || def.useData === "event") {
        context = getContextForDate(date, birth.getFullYear());
      } else if (def.useData === "song") {
        context = bi ? `#1 Song: ${bi.number1Song}` : getContextForDate(date, birth.getFullYear());
      } else if (def.useData === "movie") {
        context = bi ? `#1 Movie: ${bi.number1Movie}` : getContextForDate(date, birth.getFullYear());
      } else {
        context = getContextForDate(date, birth.getFullYear());
      }

      return { label: def.label, date, context, isPast: date <= today, days: def.days };
    });

    // Add "Today"
    items.push({ label: "Today", date: today, context: `You are ${alive.toLocaleString()} days old`, isPast: true, days: alive });
    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    setTimeline(items);
  };

  const day10k = timeline?.find(m => m.days === 10000);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⏳</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">This Day in Your Life</h1>
          <p className="text-lg text-[#a8a8b3]">Discover what was happening in the world on your milestone days</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[800px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={calculate}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Explore My Life →
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {timeline && (
            <div className="mt-8 space-y-6">
              {/* Days old banner */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5 text-center">
                <p className="text-[#a8a8b3] text-sm">You are</p>
                <p className="text-4xl font-black text-[#e94560]">{daysOld.toLocaleString()}</p>
                <p className="text-white font-semibold">days old today</p>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[6px] top-0 bottom-0 w-0.5 bg-[#0f3460]" />
                <div className="space-y-4 pl-8">
                  {timeline.map((item, i) => (
                    <div key={i} className={`relative rounded-xl border p-5 ${item.isPast ? "border-[#0f3460] bg-[#16213e]" : "border-[#e94560]/30 bg-[#1a1a2e]"}`}>
                      {/* Timeline dot */}
                      <div className={`absolute -left-[26px] top-5 h-3 w-3 rounded-full ring-4 ring-[#1a1a2e] ${item.isPast ? "bg-[#a8a8b3]" : "bg-[#e94560]"}`} />

                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className={`font-bold ${item.label === "Today" ? "text-[#e94560]" : "text-white"}`}>
                            {item.label}
                          </span>
                          <span className="ml-2 text-sm text-[#a8a8b3]">{fmtDate(item.date)}</span>
                        </div>
                        {item.isPast && item.days > 0 && (
                          <Link href={`/born-in/${item.date.getFullYear()}`}
                            className="text-xs text-[#e94560] hover:underline">
                            See {item.date.getFullYear()} →
                          </Link>
                        )}
                      </div>
                      {item.context && (
                        <p className="mt-2 text-sm leading-relaxed text-[#a8a8b3]">{item.context}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {day10k && (
                <ShareButtons
                  text={`On my 10,000th day alive it was ${fmtDate(day10k.date)}! Find yours at dayblip.com/this-day-in-my-life`}
                  url="https://dayblip.com/this-day-in-my-life"
                  title="This Day in My Life"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
