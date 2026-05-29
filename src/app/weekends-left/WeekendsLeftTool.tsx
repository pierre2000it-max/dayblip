"use client";
import { useState } from "react";

function commas(n: number) { return Math.round(n).toLocaleString(); }

export default function WeekendsLeftTool() {
  const [dob,      setDob]      = useState("");
  const [lifespan, setLifespan] = useState(80);
  const [result,   setResult]   = useState<{lived:number;remaining:number;totalYrs:number}|null>(null);
  const [error,    setError]    = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob+"T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (birth>=today) { setError("Birth date must be in the past."); return; }
    setError("");
    const daysLived = Math.floor((today.getTime()-birth.getTime())/86400000);
    const weekendsLived = Math.floor(daysLived/7);
    const weekendsTotal = Math.round(lifespan*52);
    const weekendsRemaining = Math.max(0, weekendsTotal-weekendsLived);
    setResult({ lived:weekendsLived, remaining:weekendsRemaining, totalYrs:lifespan });
  };

  // Days to next Saturday
  const today = new Date();
  const daysToWeekend = today.getDay()===6?0:today.getDay()===0?6:6-today.getDay();

  const shareText = result
    ? encodeURIComponent(`I have approximately ${commas(result.remaining)} weekends left. Making every one count!\ndayblip.com/weekends-left`)
    : "";

  const MOTIVATIONAL = [
    "Each weekend is a gift. What will you do with yours?",
    "You have enough weekends to read 1,000 books, visit 100 countries, or start 10 businesses. Choose wisely.",
    "Make your weekends count. They are the margin where life happens.",
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🏖️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">How Many Weekends Do You Have Left?</h1>
          <p className="text-lg text-[#a8a8b3]">A thought-provoking look at your remaining weekends</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
              <input type="date" value={dob} onChange={e=>setDob(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Expected lifespan: <span className="text-[#e94560]">{lifespan} years</span></label>
              <input type="range" min={70} max={100} value={lifespan} onChange={e=>setLifespan(Number(e.target.value))} className="w-full accent-[#e94560]" />
            </div>
            <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] text-sm mb-2">You have approximately</p>
                <p className="text-7xl font-black text-[#e94560]">{commas(result.remaining)}</p>
                <p className="text-white text-xl font-semibold mt-1">weekends remaining</p>
                <p className="text-[#a8a8b3] text-sm mt-2">You have lived {commas(result.lived)} weekends so far</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-sm text-[#a8a8b3]">Weekends per year</div>
                  <div className="font-bold text-white">52</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-sm text-[#a8a8b3]">Next weekend in</div>
                  <div className="font-bold text-[#e94560]">{daysToWeekend} day{daysToWeekend!==1?"s":""}</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <p className="text-[#e94560] font-bold text-center text-lg">
                  &ldquo;{MOTIVATIONAL[today.getDay()%3]}&rdquo;
                </p>
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
