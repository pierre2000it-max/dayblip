"use client";
import { useState } from "react";

type Tab = "mile"|"building"|"population";

const MILE_RECORDS = [
  {year:1954,time:"3:59.4",holder:"Roger Bannister",note:"First sub-4-minute mile"},
  {year:1975,time:"3:49.4",holder:"John Walker",note:""},
  {year:1993,time:"3:44.39",holder:"Noureddine Morceli",note:""},
  {year:1999,time:"3:43.13",holder:"Hicham El Guerrouj",note:"Current world record"},
];

const BUILDINGS = [
  {year:1931,name:"Empire State Building",height:"443m",city:"New York",note:""},
  {year:1972,name:"World Trade Center",height:"417m",city:"New York",note:""},
  {year:1974,name:"Willis Tower",height:"442m",city:"Chicago",note:""},
  {year:1998,name:"Petronas Towers",height:"452m",city:"Kuala Lumpur",note:""},
  {year:2004,name:"Taipei 101",height:"508m",city:"Taipei",note:""},
  {year:2010,name:"Burj Khalifa",height:"828m",city:"Dubai",note:"Current record holder"},
];

const POPULATION = [
  {year:1804,pop:"1 billion",note:"First billion milestone"},
  {year:1927,pop:"2 billion",note:"Took 123 years"},
  {year:1960,pop:"3 billion",note:"Took 33 years"},
  {year:1974,pop:"4 billion",note:"Took 14 years"},
  {year:1987,pop:"5 billion",note:""},
  {year:1999,pop:"6 billion",note:""},
  {year:2011,pop:"7 billion",note:""},
  {year:2022,pop:"8 billion",note:"Current approximate"},
];

export default function WorldRecordsTool() {
  const [tab, setTab] = useState<Tab>("mile");

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🏆</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">World Records Through Time</h1>
          <p className="text-lg text-[#a8a8b3]">How world records have changed across the decades</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[800px] space-y-6">
          <div className="flex rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-1 gap-1">
            {([["mile","🏃 Fastest Mile"],["building","🏢 Tallest Building"],["population","🌍 World Population"]] as [Tab,string][]).map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${t===tab?"bg-[#e94560] text-white":"text-[#a8a8b3] hover:text-white"}`}>
                {l}
              </button>
            ))}
          </div>

          {tab==="mile" && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">🏃 World Mile Record Progression</h2>
              {MILE_RECORDS.map((r,i)=>(
                <div key={i} className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${r.note?"border-[#e94560]/40 bg-[#e94560]/5":"border-[#0f3460] bg-[#1a1a2e]"}`}>
                  <span className="text-[#e94560] font-bold w-12 shrink-0">{r.year}</span>
                  <span className="text-3xl font-black text-white">{r.time}</span>
                  <div><p className="text-white text-sm">{r.holder}</p>{r.note&&<p className="text-[#e94560] text-xs">{r.note}</p>}</div>
                </div>
              ))}
            </div>
          )}

          {tab==="building" && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">🏢 Tallest Building Through History</h2>
              {BUILDINGS.map((b,i)=>(
                <div key={i} className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${b.note?"border-[#e94560]/40 bg-[#e94560]/5":"border-[#0f3460] bg-[#1a1a2e]"}`}>
                  <span className="text-[#e94560] font-bold w-12 shrink-0">{b.year}</span>
                  <div className="flex-1"><p className="text-white font-semibold">{b.name}</p><p className="text-[#a8a8b3] text-sm">{b.city} · {b.height}</p></div>
                  {b.note&&<span className="text-[#e94560] text-xs">{b.note}</span>}
                </div>
              ))}
            </div>
          )}

          {tab==="population" && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">🌍 World Population Milestones</h2>
              {POPULATION.map((p,i)=>(
                <div key={i} className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${p.note.includes("Current")?"border-[#e94560]/40 bg-[#e94560]/5":"border-[#0f3460] bg-[#1a1a2e]"}`}>
                  <span className="text-[#e94560] font-bold w-12 shrink-0">{p.year}</span>
                  <span className="text-2xl font-black text-white flex-1">{p.pop}</span>
                  <span className="text-[#a8a8b3] text-xs">{p.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
