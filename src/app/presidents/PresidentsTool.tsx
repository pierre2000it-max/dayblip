"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";

const PRESIDENTS = [
  {number:1,name:"George Washington",start:1789,end:1797,party:"Unaffiliated",fact:"Only president elected unanimously"},
  {number:16,name:"Abraham Lincoln",start:1861,end:1865,party:"Republican",fact:"Led nation through Civil War, abolished slavery"},
  {number:32,name:"Franklin D. Roosevelt",start:1933,end:1945,party:"Democratic",fact:"Only president elected four times"},
  {number:33,name:"Harry Truman",start:1945,end:1953,party:"Democratic",fact:"Made decision to drop atomic bombs on Japan"},
  {number:34,name:"Dwight Eisenhower",start:1953,end:1961,party:"Republican",fact:"Created NASA and Interstate Highway System"},
  {number:35,name:"John F. Kennedy",start:1961,end:1963,party:"Democratic",fact:"Youngest elected president, assassinated 1963"},
  {number:36,name:"Lyndon B. Johnson",start:1963,end:1969,party:"Democratic",fact:"Signed Civil Rights Act and Voting Rights Act"},
  {number:37,name:"Richard Nixon",start:1969,end:1974,party:"Republican",fact:"Only president to resign from office"},
  {number:38,name:"Gerald Ford",start:1974,end:1977,party:"Republican",fact:"Only president never elected president or VP"},
  {number:39,name:"Jimmy Carter",start:1977,end:1981,party:"Democratic",fact:"Won Nobel Peace Prize after presidency"},
  {number:40,name:"Ronald Reagan",start:1981,end:1989,party:"Republican",fact:"Former actor, oldest president at time of election"},
  {number:41,name:"George H.W. Bush",start:1989,end:1993,party:"Republican",fact:"Led coalition in Gulf War, ended Cold War era"},
  {number:42,name:"Bill Clinton",start:1993,end:2001,party:"Democratic",fact:"Presided over longest peacetime economic expansion"},
  {number:43,name:"George W. Bush",start:2001,end:2009,party:"Republican",fact:"Led nation after September 11 attacks"},
  {number:44,name:"Barack Obama",start:2009,end:2017,party:"Democratic",fact:"First African American president"},
  {number:45,name:"Donald Trump",start:2017,end:2021,party:"Republican",fact:"First president impeached twice"},
  {number:46,name:"Joe Biden",start:2021,end:2025,party:"Democratic",fact:"Oldest person elected to the presidency"},
  {number:47,name:"Donald Trump",start:2025,end:2029,party:"Republican",fact:"First president to serve non-consecutive terms"},
];

export default function PresidentsTool() {
  const [dob,      setDob]      = useState("");
  const [expanded, setExpanded] = useState<number|null>(null);

  const birthYear = dob ? new Date(dob+"T00:00:00").getFullYear() : null;
  const currentYear = new Date().getFullYear();

  const inLifetime = (p: typeof PRESIDENTS[0]) =>
    birthYear ? p.start <= currentYear && p.end > birthYear : false;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🇺🇸</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">US Presidential Timeline</h1>
          <p className="text-lg text-[#a8a8b3]">Explore every US president and see which ones served during your lifetime</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-4">
          <div className="flex gap-3">
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} placeholder="Your birth date (optional)"
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            {dob && <button onClick={()=>setDob("")} className="rounded-lg border border-[#0f3460] px-4 py-3 text-[#a8a8b3] hover:text-white">Clear</button>}
          </div>
          {birthYear && <p className="text-sm text-[#a8a8b3] text-center">Presidents highlighted in red served during your lifetime</p>}

          <div className="space-y-2">
            {PRESIDENTS.map(p => {

              const highlight = dob && inLifetime(p);
              const myAge = birthYear ? Math.min(p.end,currentYear) - birthYear : null;
              return (
                <div key={`${p.number}-${p.start}`}
                  className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${highlight?"border-[#e94560]/50 bg-[#e94560]/5":"border-[#0f3460] bg-[#1a1a2e]"}`}
                  onClick={() => setExpanded(expanded===p.start?null:p.start)}>
                  <div className="flex items-center gap-4 px-4 py-3">
                    <span className={`text-sm font-bold ${highlight?"text-[#e94560]":"text-[#a8a8b3]"}`}>#{p.number}</span>
                    <span className="font-bold text-white flex-1">{p.name}</span>
                    <span className="text-[#a8a8b3] text-sm">{p.start}–{p.end}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.party==="Democratic"?"bg-blue-900/40 text-blue-300":"bg-red-900/40 text-red-300"}`}>{p.party.slice(0,3)}</span>
                  </div>
                  {expanded===p.start && (
                    <div className="px-4 pb-4 border-t border-[#0f3460] pt-3">
                      <p className="text-[#a8a8b3] text-sm mb-1">{p.fact}</p>
                      {myAge!==null && myAge>0 && <p className="text-[#e94560] text-sm">You were born {Math.max(0,p.start-birthYear!)} years into this presidency era</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <ShareButtons
            text="From George Washington to today — explore every US president and their legacy on Dayblip!"
            url="https://www.dayblip.com/presidents"
            title="US Presidential Timeline"
          />
        </div>
      </section>
    </div>
  );
}
