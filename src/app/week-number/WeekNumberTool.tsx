"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

function getWeekNumber(d: Date): number {
  const s = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day = s.getUTCDay()||7;
  s.setUTCDate(s.getUTCDate()+4-day);
  const yearStart = new Date(Date.UTC(s.getUTCFullYear(),0,1));
  return Math.ceil((((s.getTime()-yearStart.getTime())/86400000)+1)/7);
}

function getMonday(d: Date): Date {
  const day=d.getDay(), diff=day===0?-6:1-day;
  const m=new Date(d); m.setDate(d.getDate()+diff); m.setHours(0,0,0,0); return m;
}

function isLeap(y: number) { return (y%4===0&&y%100!==0)||y%400===0; }

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US",{month:"long",day:"numeric"});
}

export default function WeekNumberTool() {
  const [today, setToday] = useState<Date|null>(null);
  const [lookup, setLookup] = useState("");
  const [lookupResult, setLookupResult] = useState<{date:Date;week:number}|null>(null);

  useEffect(() => { setToday(new Date()); }, []);

  if (!today) return null;

  const week    = getWeekNumber(today);
  const year    = today.getFullYear();
  const total   = isLeap(year) ? 366 : 365;
  const doy     = Math.floor((today.getTime()-new Date(year,0,0).getTime())/86400000);
  const pct     = (doy/total*100).toFixed(1);
  const remaining = 52 - week;
  const quarter = Math.ceil((today.getMonth()+1)/3);
  const monday  = getMonday(today);
  const sunday  = new Date(monday); sunday.setDate(monday.getDate()+6);

  const doLookup = () => {
    if (!lookup) return;
    const d = new Date(lookup+"T00:00:00");
    setLookupResult({ date:d, week:getWeekNumber(d) });
  };

  // All 52 weeks for mini calendar
  const weeks = Array.from({length:52},(_,i)=>i+1);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-2 text-[#a8a8b3] text-lg">Today is</div>
          <div className="text-7xl font-black text-[#e94560] leading-none">Week {week}</div>
          <div className="text-2xl font-bold text-white mt-1">of {year}</div>
          <h1 className="mb-3 mt-3 text-2xl font-bold text-white">What Week Number Is It?</h1>
          <p className="text-[#a8a8b3]">{fmtDate(monday)} — {fmtDate(sunday)}</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              {l:"Year % complete",v:`${pct}%`},
              {l:"Weeks remaining",v:remaining},
              {l:"Quarter",v:`Q${quarter}`},
              {l:"Day of year",v:`Day ${doy}`},
              {l:"Days remaining",v:total-doy},
              {l:"Is it a leap year?",v:isLeap(year)?"Yes":"No"},
            ].map(s=>(
              <div key={s.l} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                <div className="text-xs text-[#a8a8b3]">{s.l}</div>
                <div className="font-bold text-[#e94560] mt-1">{String(s.v)}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <div className="flex justify-between mb-2">
              <span className="text-white font-semibold">Year Progress</span>
              <span className="text-[#e94560] font-bold">{pct}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-[#16213e] overflow-hidden">
              <div className="h-full rounded-full bg-[#e94560]" style={{width:`${pct}%`}} />
            </div>
          </div>

          {/* Mini week calendar */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h3 className="font-bold text-white mb-3">All 52 Weeks of {year}</h3>
            <div className="flex flex-wrap gap-1">
              {weeks.map(w=>(
                <div key={w} className={`w-7 h-7 rounded text-xs flex items-center justify-center font-semibold ${w<week?"bg-[#16213e] text-[#a8a8b3]":w===week?"bg-[#e94560] text-white":"border border-[#0f3460] text-[#a8a8b3]"}`}>{w}</div>
              ))}
            </div>
          </div>

          {/* Lookup */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h3 className="font-bold text-white mb-3">Look Up Any Date</h3>
            <div className="flex gap-3">
              <input type="date" value={lookup} onChange={e=>setLookup(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={doLookup} className="rounded-lg bg-[#e94560] px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90">Check →</button>
            </div>
            {lookupResult && (
              <p className="mt-3 text-white">{lookupResult.date.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} is <strong className="text-[#e94560]">Week {lookupResult.week}</strong> of {lookupResult.date.getFullYear()}</p>
            )}
          </div>
          <ShareButtons
            text={`We are in week ${week} of ${year}. See what week it is on Dayblip!`}
            url="https://www.dayblip.com/week-number"
            title="Week Number"
          />
        </div>
      </section>
    </div>
  );
}
