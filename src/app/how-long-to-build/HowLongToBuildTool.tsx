"use client";
import { useState } from "react";

const BUILDS = [
  {name:"Great Wall of China",emoji:"🧱",years:1800,description:"Built across multiple dynasties",completed:1644},
  {name:"Egyptian Pyramids of Giza",emoji:"🔺",years:20,description:"Built around 2560 BC",completed:-2560},
  {name:"The Colosseum in Rome",emoji:"🏟️",years:8,description:"Built by Emperor Vespasian",completed:80},
  {name:"Notre Dame Cathedral",emoji:"⛪",years:182,description:"Construction began 1163",completed:1345},
  {name:"Eiffel Tower",emoji:"🗼",years:2,description:"Built for 1889 World Fair",completed:1889},
  {name:"Empire State Building",emoji:"🏢",years:1,description:"410 days of construction",completed:1931},
  {name:"Golden Gate Bridge",emoji:"🌉",years:4,description:"Opened in 1937",completed:1937},
  {name:"Sydney Opera House",emoji:"🎭",years:14,description:"Opened in 1973",completed:1973},
  {name:"Sagrada Familia",emoji:"⛪",years:142,description:"Still under construction since 1882",completed:null},
  {name:"Burj Khalifa",emoji:"🏙️",years:6,description:"World's tallest building",completed:2010},
  {name:"Panama Canal",emoji:"🚢",years:10,description:"Opened in 1914",completed:1914},
  {name:"International Space Station",emoji:"🛸",years:13,description:"Assembly 1998 to 2011",completed:2011},
  {name:"iPhone (development)",emoji:"📱",years:2,description:"Secret project started 2005",completed:2007},
  {name:"The Beatles career",emoji:"🎵",years:10,description:"From 1960 to 1970",completed:1970},
];

export default function HowLongToBuildTool() {
  const [dob, setDob] = useState("");

  const myAge = dob ? Math.floor((Date.now()-new Date(dob+"T00:00:00").getTime())/86400000/365.25) : null;

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🏗️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">How Long Did It Take to Build?</h1>
          <p className="text-lg text-[#a8a8b3]">Famous constructions and how long they took compared to your age</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px] space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-white">Your date of birth (optional — for comparisons)</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {BUILDS.map(b => {
              const timesOver = myAge && b.years < myAge ? Math.floor(myAge/b.years) : null;
              const pct       = myAge ? Math.min(100,(b.years/myAge*100)).toFixed(0) : null;
              return (
                <div key={b.name} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{b.emoji}</span>
                    <div>
                      <p className="font-bold text-white">{b.name}</p>
                      <p className="text-xs text-[#a8a8b3]">{b.description}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#e94560]">{b.years.toLocaleString()} year{b.years!==1?"s":""} to build</p>
                  {b.completed && <p className="text-xs text-[#a8a8b3]">Completed: {b.completed>0?b.completed:`${Math.abs(b.completed)} BC`}</p>}
                  {myAge && (
                    <div className="mt-2 text-xs text-[#a8a8b3]">
                      {pct && <p>That is {pct}% of your lifetime</p>}
                      {timesOver && <p>You could build this {timesOver}× over in your lifetime!</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
