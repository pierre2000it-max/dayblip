"use client";
import { useState } from "react";

const BIRTHS: Record<number,number> = {
  1900:12e9,1910:12.6e9,1920:13.3e9,1930:14.1e9,1940:15e9,
  1950:16.1e9,1960:17.8e9,1970:20e9,1980:22.4e9,1990:25e9,
  2000:27.7e9,2010:30.6e9,2020:33.9e9,2026:35e9,
};
const TOTAL = 108e9; // estimated total humans ever born

function getBirthNumber(year: number): number {
  const keys = Object.keys(BIRTHS).map(Number).sort((a,b)=>a-b);
  if (year<=keys[0]) return BIRTHS[keys[0]];
  if (year>=keys[keys.length-1]) return BIRTHS[keys[keys.length-1]];
  for (let i=0;i<keys.length-1;i++) {
    if (year>=keys[i]&&year<=keys[i+1]) {
      const t=(year-keys[i])/(keys[i+1]-keys[i]);
      return BIRTHS[keys[i]]+t*(BIRTHS[keys[i+1]]-BIRTHS[keys[i]]);
    }
  }
  return BIRTHS[keys[keys.length-1]];
}

export default function BirthNumberTool() {
  const [yearStr, setYearStr] = useState("");
  const [result,  setResult]  = useState<{n:number;pct:string;rank:string}|null>(null);
  const [error,   setError]   = useState("");

  const calculate = () => {
    const y = parseInt(yearStr,10);
    if (isNaN(y)||y<1900||y>new Date().getFullYear()) { setError("Please enter a valid birth year."); return; }
    setError("");
    const n   = getBirthNumber(y);
    const pct = (n/TOTAL*100).toFixed(1);
    const rank = n.toLocaleString();
    setResult({ n, pct, rank });
  };

  const shareText = result
    ? encodeURIComponent(`I am approximately the ${result.rank}th human ever born!\nOut of 108 billion people in history 🌍\ndayblip.com/birth-number`)
    : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🔢</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Your Number in Human History</h1>
          <p className="text-lg text-[#a8a8b3]">Approximately what number human being are you in the history of our species?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-5">
          <div className="flex gap-3">
            <input type="number" value={yearStr} onChange={e=>setYearStr(e.target.value)} placeholder="Enter your birth year e.g. 1990"
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
            <button onClick={calculate} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
          </div>
          {error && <p className="text-sm text-[#e94560]">{error}</p>}

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] text-sm mb-2">You were approximately the</p>
                <p className="text-4xl font-black text-[#e94560]">#{result.rank}</p>
                <p className="text-white font-semibold mt-1">human ever born</p>
                <p className="text-[#a8a8b3] text-sm mt-3">Out of an estimated <strong className="text-white">108 billion</strong> humans who ever lived</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-xs text-[#a8a8b3]">% of all humans born before you</div>
                  <div className="text-2xl font-black text-[#e94560]">{result.pct}%</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-xs text-[#a8a8b3]">Alive at the same time as you</div>
                  <div className="text-2xl font-black text-white">~8 billion</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-2">
                <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">More people are alive today than have ever died in history</span></div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">If all 108 billion humans held hands they would circle Earth ~50 times</span></div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">The current world population is a record high</span></div>
              </div>

              <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Share on X →</a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
