"use client";
import { useState } from "react";

const GIFTS: Record<number, {traditional:string; modern:string}> = {
  1:{traditional:"Paper",modern:"Clocks"},
  2:{traditional:"Cotton",modern:"China"},
  3:{traditional:"Leather",modern:"Crystal/Glass"},
  4:{traditional:"Fruit/Flowers",modern:"Appliances"},
  5:{traditional:"Wood",modern:"Silverware"},
  6:{traditional:"Candy/Iron",modern:"Wood"},
  7:{traditional:"Wool/Copper",modern:"Desk Sets"},
  8:{traditional:"Pottery/Bronze",modern:"Linens"},
  9:{traditional:"Pottery/Willow",modern:"Leather"},
  10:{traditional:"Tin/Aluminum",modern:"Diamond Jewelry"},
  15:{traditional:"Crystal",modern:"Watches"},
  20:{traditional:"China",modern:"Platinum"},
  25:{traditional:"Silver",modern:"Silver"},
  30:{traditional:"Pearl",modern:"Diamond"},
  40:{traditional:"Ruby",modern:"Ruby"},
  50:{traditional:"Gold",modern:"Gold"},
  60:{traditional:"Diamond",modern:"Diamond"},
};

const MILESTONES = [1,2,3,4,5,6,7,8,9,10,15,20,25,30,40,50,60];

function fmtDate(d: Date) { return d.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}); }
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function AnniversaryTool() {
  const [annDate, setAnnDate] = useState("");
  const [type,    setType]    = useState("Wedding");
  const [result,  setResult]  = useState<{years:number;days:number;past:boolean;nextDate:Date;nextYears:number}|null>(null);
  const [error,   setError]   = useState("");

  const calculate = () => {
    if (!annDate) { setError("Please enter your anniversary date."); return; }
    const ann   = new Date(annDate+"T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (ann>today) { setError("Date must be in the past."); return; }
    setError("");

    const years = today.getFullYear()-ann.getFullYear();
    // Current year's anniversary
    const thisYear = new Date(today.getFullYear(),ann.getMonth(),ann.getDate());
    const pastThis = thisYear<=today;
    const nextDate = pastThis ? new Date(today.getFullYear()+1,ann.getMonth(),ann.getDate()) : thisYear;
    const nextYears = nextDate.getFullYear()-ann.getFullYear();
    const days = Math.ceil((nextDate.getTime()-today.getTime())/86400000);
    setResult({ years:pastThis?years:years-1, days, past:pastThis, nextDate, nextYears });
  };

  const giftFor = (y: number) => {
    const ks = MILESTONES.filter(k=>k<=y);
    return ks.length>0 ? GIFTS[ks[ks.length-1]] : null;
  };

  const nextMilestone = result ? MILESTONES.find(m=>m>result.nextYears) : null;
  const nextMilestoneDate = (result && nextMilestone) ? new Date(new Date(annDate+"T00:00:00").getFullYear()+nextMilestone, new Date(annDate+"T00:00:00").getMonth(), new Date(annDate+"T00:00:00").getDate()) : null;

  const shareText = result ? encodeURIComponent(`Today is our ${result.nextYears}th anniversary! 💕\n${result.nextYears} years together\ndayblip.com/anniversary`) : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Anniversary Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">Find out your anniversary milestone and the traditional gift</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-5">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Anniversary date</label>
                <input type="date" value={annDate} onChange={e=>setAnnDate(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Type</label>
                <select value={type} onChange={e=>setType(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                  {["Wedding","Relationship","Work","Other"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-5xl font-black text-[#e94560]">{result.nextYears}</p>
                <p className="text-white font-bold mt-1">{type} anniversary {result.days===0?"today!":"coming up"}</p>
                {result.days>0 && <p className="text-[#a8a8b3] text-sm">In {result.days} day{result.days!==1?"s":""} on {fmtDate(result.nextDate)} ({DAYS[result.nextDate.getDay()]})</p>}
                {result.days===0 && <p className="text-[#a8a8b3] text-sm">🎉 Happy Anniversary! Today is {DAYS[result.nextDate.getDay()]}</p>}
              </div>

              {giftFor(result.nextYears) && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <h3 className="font-bold text-white mb-3">🎁 Anniversary {result.nextYears} Gifts</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-[#16213e] p-3"><div className="text-xs text-[#a8a8b3]">Traditional</div><div className="font-bold text-[#e94560]">{giftFor(result.nextYears)?.traditional}</div></div>
                    <div className="rounded-lg bg-[#16213e] p-3"><div className="text-xs text-[#a8a8b3]">Modern</div><div className="font-bold text-white">{giftFor(result.nextYears)?.modern}</div></div>
                  </div>
                </div>
              )}

              {nextMilestone && nextMilestoneDate && (
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4 text-sm">
                  <p className="text-[#a8a8b3]">Next milestone: <strong className="text-white">{nextMilestone}th anniversary</strong> on {fmtDate(nextMilestoneDate)}</p>
                  {GIFTS[nextMilestone] && <p className="text-[#a8a8b3] mt-1">Traditional gift: <strong className="text-[#e94560]">{GIFTS[nextMilestone].traditional}</strong></p>}
                </div>
              )}

              <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Share on X →</a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
