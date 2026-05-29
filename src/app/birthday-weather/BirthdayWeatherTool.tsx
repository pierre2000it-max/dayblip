"use client";
import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type Season = "winter"|"spring"|"summer"|"fall";
type Region = "northeast"|"southeast"|"midwest"|"southwest"|"northwest";

const WEATHER: Record<Season,Record<Region,string>> = {
  winter:{ northeast:"Cold and snowy, average 25–35°F",southeast:"Cool and mild, average 45–60°F",midwest:"Very cold, average 15–30°F",southwest:"Mild and cool, average 45–65°F",northwest:"Cold and rainy, average 35–50°F" },
  spring:{ northeast:"Cool and warming, average 40–65°F",southeast:"Warm and pleasant, average 60–75°F",midwest:"Variable, average 40–65°F",southwest:"Warm and sunny, average 65–80°F",northwest:"Cool and rainy, average 45–60°F" },
  summer:{ northeast:"Warm and humid, average 70–85°F",southeast:"Hot and humid, average 80–95°F",midwest:"Hot and humid, average 75–90°F",southwest:"Very hot and dry, average 90–105°F",northwest:"Warm and dry, average 65–80°F" },
  fall:  { northeast:"Cool and crisp, average 45–65°F",southeast:"Warm and pleasant, average 60–75°F",midwest:"Cool and variable, average 45–65°F",southwest:"Warm and pleasant, average 65–80°F",northwest:"Cool and rainy, average 45–60°F" },
};

function getSeason(month: number): Season {
  if (month>=12||month<=2) return "winter";
  if (month<=5) return "spring";
  if (month<=8) return "summer";
  return "fall";
}

const REGION_LABELS: Record<Region,string> = {
  northeast:"Northeast (NY, MA, PA, NJ...)",
  southeast:"Southeast (FL, GA, TX, NC...)",
  midwest:"Midwest (IL, OH, MI, MN...)",
  southwest:"Southwest (AZ, NM, NV, CA...)",
  northwest:"Northwest (WA, OR, ID...)",
};

const FUN_FACTS = [
  "Babies born in winter are statistically slightly taller than summer babies",
  "More babies are born in September than any other month in the US",
  "The season you are born in may influence personality according to some studies",
  "Spring babies tend to be more optimistic according to some research",
  "Winter babies have the lowest risk of food allergies according to one study",
];

export default function BirthdayWeatherTool() {
  const [month,  setMonth]  = useState(1);
  const [region, setRegion] = useState<Region>("northeast");
  const [result, setResult] = useState<{season:Season;weather:string}|null>(null);

  const check = () => {
    const season = getSeason(month);
    setResult({ season, weather: WEATHER[season][region] });
  };

  const SEASON_EMOJI: Record<Season,string> = {winter:"❄️",spring:"🌸",summer:"☀️",fall:"🍂"};

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌤️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Historical Weather on Your Birthday</h1>
          <p className="text-lg text-[#a8a8b3]">What was the weather typically like on the day you were born?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-5">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Birth month</label>
              <select value={month} onChange={e=>setMonth(Number(e.target.value))}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">US Region</label>
              <select value={region} onChange={e=>setRegion(e.target.value as Region)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {(Object.entries(REGION_LABELS) as [Region,string][]).map(([r,l])=><option key={r} value={r}>{l}</option>)}
              </select>
            </div>
            <button onClick={check} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Check Weather →</button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <div className="text-5xl mb-2">{SEASON_EMOJI[result.season]}</div>
                <p className="text-xl font-bold text-white capitalize">{result.season} baby!</p>
                <p className="text-[#a8a8b3] mt-1">Born in {MONTHS[month-1]} in the {REGION_LABELS[region].split(" (")[0]}</p>
                <div className="mt-4 rounded-lg bg-[#16213e] px-4 py-3">
                  <p className="text-white font-semibold">{result.weather}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h3 className="font-bold text-white mb-3">🎂 Birthday Season Fun Facts</h3>
                {FUN_FACTS.slice(0,3).map(f=>(
                  <div key={f} className="flex gap-2 mb-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">{f}</span></div>
                ))}
              </div>

              <p className="text-xs text-[#a8a8b3] text-center">This shows typical historical weather patterns. For exact weather on your specific birth date, check historical weather archives.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
