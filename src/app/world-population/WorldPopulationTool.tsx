"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";

const POP_DATA: Record<number, number> = {
  1950:2.5,1955:2.8,1960:3.0,1965:3.3,1970:3.7,1975:4.1,
  1980:4.4,1985:4.8,1990:5.3,1995:5.7,2000:6.1,2005:6.5,
  2010:6.9,2015:7.3,2020:7.8,2025:8.1,2026:8.2,
};
const CURRENT = 8.2;

const MILESTONES = [
  { pop:1, year:1804 }, { pop:2, year:1927 }, { pop:3, year:1960 },
  { pop:4, year:1974 }, { pop:5, year:1987 }, { pop:6, year:1999 },
  { pop:7, year:2011 }, { pop:8, year:2022 },
];

function getPopForYear(year: number): number {
  const keys = Object.keys(POP_DATA).map(Number).sort((a,b)=>a-b);
  if (year <= keys[0]) return POP_DATA[keys[0]];
  if (year >= keys[keys.length-1]) return CURRENT;
  // Linear interpolation
  for (let i = 0; i < keys.length - 1; i++) {
    if (year >= keys[i] && year <= keys[i+1]) {
      const t = (year - keys[i]) / (keys[i+1] - keys[i]);
      return POP_DATA[keys[i]] + t * (POP_DATA[keys[i+1]] - POP_DATA[keys[i]]);
    }
  }
  return CURRENT;
}

const BAR_YEARS = [1950,1960,1970,1980,1990,2000,2010,2020,2026];

export default function WorldPopulationTool() {
  const [yearStr, setYearStr] = useState("");
  const [year,    setYear]    = useState<number | null>(null);
  const [error,   setError]   = useState("");

  const calculate = () => {
    const y = parseInt(yearStr, 10);
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) { setError("Please enter a valid birth year."); return; }
    setError("");
    setYear(y);
  };

  const popAtBirth = year ? getPopForYear(year) : null;
  const growth     = popAtBirth ? CURRENT - popAtBirth : null;
  const pct        = popAtBirth ? ((CURRENT - popAtBirth) / popAtBirth * 100).toFixed(1) : null;
  const maxPop     = CURRENT;


  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">👶</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">World Population When You Were Born</h1>
          <p className="text-lg text-[#a8a8b3]">Discover your place in the history of human population</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <label className="mb-1 block text-sm font-semibold text-white">Your birth year</label>
            <div className="flex gap-3">
              <input type="number" value={yearStr} onChange={e => setYearStr(e.target.value)} placeholder="e.g. 1990" min="1900" max={currentYear}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              <button onClick={calculate} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {year && popAtBirth && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] text-sm mb-1">World population in {year}</p>
                <p className="text-5xl font-black text-[#e94560]">{popAtBirth.toFixed(1)}B</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#16213e] p-3">
                    <div className="text-xs text-[#a8a8b3]">Today</div>
                    <div className="font-bold text-white">8.2 billion</div>
                  </div>
                  <div className="rounded-lg bg-[#16213e] p-3">
                    <div className="text-xs text-[#a8a8b3]">Growth since your birth</div>
                    <div className="font-bold text-[#e94560]">+{growth?.toFixed(1)}B ({pct}%)</div>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 font-bold text-white">Population Growth</h3>
                <div className="space-y-2">
                  {BAR_YEARS.map(y => {
                    const pop = getPopForYear(y);
                    const w   = (pop / maxPop * 100).toFixed(1);
                    const isMyYear = year && y <= year && (BAR_YEARS[BAR_YEARS.indexOf(y)+1] > year || y === year);
                    return (
                      <div key={y} className="flex items-center gap-3">
                        <span className="text-xs text-[#a8a8b3] w-10 shrink-0">{y}</span>
                        <div className="flex-1 h-5 rounded-full bg-[#16213e] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${w}%`, background: isMyYear ? "#e94560" : "#4FC3F7" }} />
                        </div>
                        <span className="text-xs text-white w-10 shrink-0">{pop.toFixed(1)}B</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 font-bold text-white">Population Milestones</h3>
                <div className="space-y-2">
                  {MILESTONES.map(m => {
                    const inLife = m.year >= year;
                    return (
                      <div key={m.pop} className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${inLife ? "bg-[#e94560]/10 border border-[#e94560]/20" : "bg-[#16213e]"}`}>
                        <span className="text-white text-sm">{inLife ? "✅" : "📅"} World hits {m.pop} billion</span>
                        <span className={`text-sm font-semibold ${inLife ? "text-[#e94560]" : "text-[#a8a8b3]"}`}>{m.year}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {popAtBirth && (
                <ShareButtons
                  text={`When I was born there were ${popAtBirth.toFixed(1)} billion people on Earth. Now there are 8.2 billion! 🌍`}
                  url="https://dayblip.com/world-population"
                  title="World Population Calculator"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
