"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

const EVENTS = [
  { name:"September 11 Attacks",emoji:"🗽",date:"2001-09-11",description:"Terrorist attacks on the United States" },
  { name:"First Moon Landing",emoji:"🌙",date:"1969-07-20",description:"Apollo 11 lands on the moon" },
  { name:"Berlin Wall Fell",emoji:"🧱",date:"1989-11-09",description:"End of Cold War division of Germany" },
  { name:"First iPhone Released",emoji:"📱",date:"2007-06-29",description:"Apple changed the world forever" },
  { name:"Facebook Founded",emoji:"👥",date:"2004-02-04",description:"Mark Zuckerberg launched from Harvard" },
  { name:"COVID-19 Pandemic Declared",emoji:"😷",date:"2020-03-11",description:"WHO declared global pandemic" },
  { name:"Barack Obama Inaugurated",emoji:"🇺🇸",date:"2009-01-20",description:"First Black US President took office" },
  { name:"Princess Diana Died",emoji:"👑",date:"1997-08-31",description:"Car crash in Paris tunnel" },
  { name:"Google Founded",emoji:"🔍",date:"1998-09-04",description:"Larry Page and Sergey Brin launched Google" },
  { name:"YouTube Launched",emoji:"▶️",date:"2005-04-23",description:"First video uploaded to YouTube" },
  { name:"Netflix Launched Streaming",emoji:"🎬",date:"2007-01-15",description:"Netflix began streaming service" },
  { name:"Twitter Founded",emoji:"🐦",date:"2006-03-21",description:"First tweet sent by Jack Dorsey" },
  { name:"Amazon Founded",emoji:"📦",date:"1994-07-05",description:"Jeff Bezos started selling books online" },
  { name:"Wikipedia Launched",emoji:"📚",date:"2001-01-15",description:"Free online encyclopedia went live" },
  { name:"Nelson Mandela Released",emoji:"✊",date:"1990-02-11",description:"Released after 27 years in prison" },
  { name:"Soviet Union Dissolved",emoji:"🇷🇺",date:"1991-12-25",description:"End of the Cold War era" },
  { name:"ChatGPT Launched",emoji:"🤖",date:"2022-11-30",description:"AI revolution began for the public" },
  { name:"Instagram Launched",emoji:"📸",date:"2010-10-06",description:"Photo sharing app changed social media" },
];

const DECADES = ["All","1960s","1970s","1980s","1990s","2000s","2010s","2020s"];

function inDecade(dateStr: string, d: string): boolean {
  if (d==="All") return true;
  const y = parseInt(dateStr.slice(0,4),10);
  const start = parseInt(d,10);
  return y>=start && y<start+10;
}

interface Counter { d:number; h:number; m:number; s:number }

function calcElapsed(dateStr: string): Counter {
  const past  = new Date(dateStr+"T00:00:00");
  const diff  = Math.max(0, Date.now()-past.getTime());
  const total = Math.floor(diff/1000);
  return { d:Math.floor(total/86400), h:Math.floor((total%86400)/3600), m:Math.floor((total%3600)/60), s:total%60 };
}

function pad(n: number) { return String(n).padStart(2,"0"); }

export default function DaysSinceTool() {
  const [counters, setCounters] = useState<Counter[]>(() => EVENTS.map(e=>calcElapsed(e.date)));
  const [decade,   setDecade]   = useState("All");
  const [dob,      setDob]      = useState("");

  useEffect(() => {
    const id = setInterval(() => setCounters(EVENTS.map(e=>calcElapsed(e.date))), 1000);
    return () => clearInterval(id);
  },[]);

  const myBirth = dob ? new Date(dob+"T00:00:00") : null;
  const currentYear = new Date().getFullYear();

  const visible = EVENTS.filter(e => inDecade(e.date, decade));

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[900px]">
          <div className="mb-4 text-5xl">📰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Days Since Famous Events</h1>
          <p className="text-lg text-[#a8a8b3]">Live counters showing how long ago history&apos;s biggest moments happened</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[1100px] space-y-6">
          <div className="flex flex-wrap gap-3">
            {DECADES.map(d=>(
              <button key={d} onClick={()=>setDecade(d)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${d===decade?"bg-[#e94560] text-white":"border border-[#0f3460] text-[#a8a8b3] hover:border-[#e94560] hover:text-white"}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} placeholder="Your birth date (optional)"
              className="rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-2 text-white text-sm focus:border-[#e94560] focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(e => {
              const idx = EVENTS.indexOf(e);
              const c   = counters[idx] ?? {d:0,h:0,m:0,s:0};
              const eventYear = parseInt(e.date.slice(0,4),10);
              const myAge = myBirth ? Math.max(0,Math.floor((new Date(e.date+"T00:00:00").getTime()-myBirth.getTime())/86400000/365.25)) : null;
              const beforeBirth = myBirth && new Date(e.date+"T00:00:00") < myBirth;

              return (
                <div key={e.date+e.name} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{e.emoji}</span>
                    <div><p className="font-bold text-white text-sm">{e.name}</p><p className="text-xs text-[#a8a8b3]">{e.date.slice(0,4)}</p></div>
                  </div>
                  <div className="flex gap-2 items-end mb-2">
                    <span className="text-2xl font-black text-[#e94560] tabular-nums">{c.d.toLocaleString()}</span>
                    <span className="text-[#a8a8b3] text-xs mb-0.5">days</span>
                    <span className="text-white tabular-nums text-sm">{pad(c.h)}:{pad(c.m)}:{pad(c.s)}</span>
                  </div>
                  {myBirth && (
                    <p className="text-xs text-[#a8a8b3]">
                      {beforeBirth
                        ? `Happened ${currentYear-eventYear} years before you were born`
                        : `You were ~${myAge} year${myAge!==1?"s":""} old`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <ShareButtons
            text="Check out this live days-since counter for major historical events!"
            url="https://dayblip.com/days-since"
            title="Days Since Historical Events"
          />
        </div>
      </section>
    </div>
  );
}
