"use client";
import { useState } from "react";

const GENERATIONS = [
  { name:"The Greatest Generation", start:1901, end:1927, emoji:"🎖️",
    description:"You lived through the Great Depression and World War 2. Known for sacrifice, hard work and patriotism. This generation rebuilt the world.",
    keyEvents:["Great Depression","World War 2","New Deal","Pearl Harbor"],
    famousPeople:["John F. Kennedy","Ronald Reagan","Marilyn Monroe","Frank Sinatra"] },
  { name:"The Silent Generation", start:1928, end:1945, emoji:"🤫",
    description:"Born during hard times of Depression and WW2. Known for conformity, hard work and loyalty. Built the foundations of the middle class.",
    keyEvents:["Korean War","McCarthy Era","Early Civil Rights","Post-war boom"],
    famousPeople:["Martin Luther King Jr","Elvis Presley","Woody Allen","Clint Eastwood"] },
  { name:"Baby Boomers", start:1946, end:1964, emoji:"🌸",
    description:"Born in the post-war boom. Grew up with rock and roll, Vietnam and civil rights. The largest and most influential generation.",
    keyEvents:["Vietnam War","Civil Rights Movement","Moon Landing","Woodstock","Watergate"],
    famousPeople:["Bill Clinton","Steve Jobs","Oprah Winfrey","Donald Trump"] },
  { name:"Generation X", start:1965, end:1980, emoji:"✌️",
    description:"The forgotten middle child generation. Grew up with MTV, AIDS crisis and the rise of computers. Known for independence and skepticism.",
    keyEvents:["End of Cold War","Fall of Berlin Wall","Rise of MTV","AIDS epidemic"],
    famousPeople:["Barack Obama","Elon Musk","Kurt Cobain","Jennifer Aniston"] },
  { name:"Millennials (Gen Y)", start:1981, end:1996, emoji:"💻",
    description:"Digital natives who grew up with the internet. Shaped by 9/11, the 2008 recession and social media. Known for optimism and idealism.",
    keyEvents:["September 11","2008 Recession","Rise of social media","Smartphones"],
    famousPeople:["Taylor Swift","Mark Zuckerberg","LeBron James","Adele"] },
  { name:"Generation Z (Zoomers)", start:1997, end:2012, emoji:"📱",
    description:"True digital natives who have never known life without smartphones. Shaped by social media, climate anxiety and COVID-19.",
    keyEvents:["COVID-19 pandemic","Climate crisis","TikTok rise","Black Lives Matter"],
    famousPeople:["Billie Eilish","Olivia Rodrigo","Greta Thunberg","Emma Chamberlain"] },
  { name:"Generation Alpha", start:2013, end:2025, emoji:"🤖",
    description:"Born into a world of AI, tablets and smart devices. The most technologically immersed generation in history.",
    keyEvents:["AI revolution","COVID childhood","Climate activism"],
    famousPeople:["Still growing up!"] },
];

export default function WhatGenerationTool() {
  const [yearStr, setYearStr] = useState("");
  const [result,  setResult]  = useState<typeof GENERATIONS[0]|null>(null);
  const [error,   setError]   = useState("");

  const find = () => {
    const y = parseInt(yearStr, 10);
    if (isNaN(y)||y<1900||y>2025) { setError("Please enter a year between 1900 and 2025."); return; }
    setError("");
    const gen = GENERATIONS.find(g => y>=g.start && y<=g.end);
    setResult(gen ?? null);
    if (!gen) setError("No matching generation found.");
  };

  const shareText = result ? encodeURIComponent(`I am a ${result.name}! ${result.emoji}\nFind out yours → dayblip.com/what-generation`) : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">👶</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">What Generation Are You?</h1>
          <p className="text-lg text-[#a8a8b3]">Find out which generation you belong to and what it means</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="flex gap-3">
            <input type="number" value={yearStr} onChange={e=>setYearStr(e.target.value)} placeholder="Enter your birth year e.g. 1990"
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
            <button onClick={find} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Find My Generation →</button>
          </div>
          {error && <p className="text-sm text-[#e94560]">{error}</p>}

          {result && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <div className="text-5xl mb-3">{result.emoji}</div>
                <h2 className="text-3xl font-black text-[#e94560]">{result.name}</h2>
                <p className="text-[#a8a8b3] text-sm mt-1">{result.start}–{result.end}</p>
                <p className="text-[#a8a8b3] mt-4 leading-relaxed">{result.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <h3 className="font-bold text-white mb-3">📅 Key Events of Your Era</h3>
                  {result.keyEvents.map(e=><div key={e} className="flex gap-2 mb-1"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">{e}</span></div>)}
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <h3 className="font-bold text-white mb-3">🌟 Famous {result.name}s</h3>
                  {result.famousPeople.map(p=><div key={p} className="text-[#a8a8b3] text-sm mb-1">{p}</div>)}
                </div>
              </div>

              <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Share on X →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
