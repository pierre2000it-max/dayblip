"use client";
import { useState, useEffect } from "react";
import onThisDayRaw from "@/data/onThisDay.json";

interface DayEvent  { year: number; event: string }
interface Birthday  { name: string; year: number; role: string }
interface DayData   { events: DayEvent[]; birthdays: Birthday[] }

const OTD = onThisDayRaw as Record<string, DayData>;

const MONTH_SLUG = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const MONTH_DISP = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Fallback events for the current week area (late May/early June)
const FALLBACK_EVENTS = [
  { date:"May 25", year:1977, event:"Star Wars Episode IV premiered in theaters" },
  { date:"May 25", year:1961, event:"JFK announced goal to put man on moon by end of decade" },
  { date:"May 26", year:1897, event:"Dracula by Bram Stoker was published" },
  { date:"May 27", year:1937, event:"Golden Gate Bridge opened in San Francisco" },
  { date:"May 28", year:1934, event:"Dionne quintuplets born in Canada" },
  { date:"May 29", year:1953, event:"Edmund Hillary and Tenzing Norgay reached summit of Everest" },
  { date:"May 30", year:1431, event:"Joan of Arc was burned at the stake in Rouen France" },
  { date:"May 31", year:1889, event:"Johnstown Flood killed over 2,200 people in Pennsylvania" },
  { date:"June 1",  year:1967, event:"Beatles released Sgt Peppers Lonely Hearts Club Band" },
];

function getMonday(d: Date): Date {
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  const mon  = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month:"long", day:"numeric" });
}

export default function ThisWeekInHistoryTool() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => { setToday(new Date()); }, []);

  if (!today) return null;

  const monday = getMonday(today);
  const days   = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
  });
  const sunday = days[6];

  // Collect events from OTD for each day this week
  const weekEvents: { date: Date; slug: string; events: DayEvent[]; birthdays: Birthday[] }[] = days.map(d => {
    const slug = `${MONTH_SLUG[d.getMonth()]}-${d.getDate()}`;
    const data = OTD[slug] ?? null;
    return { date: d, slug, events: data?.events ?? [], birthdays: data?.birthdays ?? [] };
  });

  const allEvents   = weekEvents.flatMap(w => w.events.map(e => ({ ...e, date: w.date })));
  const allBirthday = weekEvents.flatMap(w => w.birthdays.map(b => ({ ...b, date: w.date })));
  const currentYear = today.getFullYear();

  const daysToNextMonday = 7 - (today.getDay() === 0 ? 7 : today.getDay()) + 1;

  const shareText = FALLBACK_EVENTS[0]
    ? encodeURIComponent(`This week in history: ${FALLBACK_EVENTS[0].event} (${FALLBACK_EVENTS[0].year})!\nDiscover more at dayblip.com/this-week-in-history`)
    : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">📰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">This Week in History</h1>
          <p className="text-lg text-[#a8a8b3]">Major events that happened this week throughout history</p>
          <p className="mt-3 text-sm text-[#a8a8b3]">
            Week of {fmtDate(monday)} — {fmtDate(sunday)}, {currentYear}
          </p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-8">
          {/* Events from OTD data or fallback */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h2 className="mb-6 text-xl font-bold text-white">📅 Events This Week in History</h2>
            {allEvents.length > 0 ? (
              <div className="space-y-4">
                {allEvents.sort((a,b) => a.year - b.year).map((e, i) => (
                  <div key={i} className="flex gap-4 rounded-lg bg-[#16213e] px-5 py-4 items-start">
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-[#a8a8b3]">{MONTH_DISP[e.date.getMonth()]} {e.date.getDate()}</div>
                      <div className="text-lg font-bold text-[#e94560]">{e.year}</div>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{e.event}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {FALLBACK_EVENTS.map((e, i) => (
                  <div key={i} className="flex gap-4 rounded-lg bg-[#16213e] px-5 py-4 items-start">
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-[#a8a8b3]">{e.date}</div>
                      <div className="text-lg font-bold text-[#e94560]">{e.year}</div>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{e.event}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Famous birthdays this week */}
          {allBirthday.length > 0 && (
            <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
              <h2 className="mb-5 text-xl font-bold text-white">🎂 Historical Birthdays This Week</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {allBirthday.slice(0, 6).map((b, i) => (
                  <div key={i} className="rounded-lg bg-[#16213e] p-4">
                    <p className="font-bold text-white">{b.name}</p>
                    <p className="text-sm text-[#a8a8b3]">{b.role}</p>
                    <p className="text-xs text-[#e94560] mt-1">Born {b.year} — {MONTH_DISP[b.date.getMonth()]} {b.date.getDate()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Come back CTA */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
            <p className="text-white font-semibold">New events update every Monday</p>
            <p className="text-[#a8a8b3] text-sm mt-1">Next update in {daysToNextMonday} day{daysToNextMonday !== 1 ? "s" : ""}</p>
          </div>

          <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
            className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
            Share on X →
          </a>
        </div>
      </section>
    </div>
  );
}
