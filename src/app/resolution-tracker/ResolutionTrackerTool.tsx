"use client";
import { useState, useEffect } from "react";

type Status = "not-started"|"in-progress"|"done";
interface Resolution { text:string; status:Status }

const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Small daily improvements are the key to staggering long-term results.",
  "You don't have to be great to start, but you have to start to be great.",
  "Progress, not perfection.",
  "A year from now you will wish you had started today.",
];

function getDayOfYear(d: Date): number {
  return Math.floor((d.getTime()-new Date(d.getFullYear(),0,0).getTime())/86400000);
}

function isLeap(y: number) { return (y%4===0&&y%100!==0)||y%400===0; }

export default function ResolutionTrackerTool() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [newText,     setNewText]     = useState("");
  const today = new Date();
  const doy   = getDayOfYear(today);
  const total = isLeap(today.getFullYear()) ? 366 : 365;
  const pct   = (doy/total*100).toFixed(1);
  const remaining = total-doy;
  const quarter = Math.ceil((today.getMonth()+1)/3);
  const daysToNewYear = Math.ceil((new Date(today.getFullYear()+1,0,1).getTime()-today.getTime())/86400000);

  useEffect(() => {
    try { const s=localStorage.getItem("rt_resolutions"); if(s) setResolutions(JSON.parse(s)); } catch { /* ignore */ }
  },[]);

  const save = (r: Resolution[]) => {
    setResolutions(r);
    try { localStorage.setItem("rt_resolutions",JSON.stringify(r)); } catch { /* ignore */ }
  };

  const addResolution = () => {
    if (!newText.trim()||resolutions.length>=5) return;
    save([...resolutions,{text:newText.trim(),status:"not-started"}]);
    setNewText("");
  };

  const cycleStatus = (i: number) => {
    const order: Status[] = ["not-started","in-progress","done"];
    const r=[...resolutions];
    r[i]={...r[i],status:order[(order.indexOf(r[i].status)+1)%3]};
    save(r);
  };

  const remove = (i: number) => { const r=[...resolutions]; r.splice(i,1); save(r); };

  const shareText = encodeURIComponent(`The year is ${pct}% complete! How are your resolutions going?\ndayblip.com/resolution-tracker`);

  const STATUS_STYLE: Record<Status,string> = {
    "not-started":"border-[#0f3460] text-[#a8a8b3]",
    "in-progress":"border-yellow-500/50 text-yellow-400",
    "done":"border-green-500/50 text-green-400",
  };
  const STATUS_LABEL: Record<Status,string> = {"not-started":"Not Started","in-progress":"In Progress","done":"Done ✅"};

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎯</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">New Year Resolution Tracker</h1>
          <p className="text-lg text-[#a8a8b3]">Track your progress through the year</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          {/* Year progress */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-white">Year {today.getFullYear()} Progress</span>
              <span className="text-[#e94560] font-bold">{pct}%</span>
            </div>
            <div className="h-5 w-full rounded-full bg-[#16213e] overflow-hidden mb-3">
              <div className="h-full rounded-full bg-[#e94560]" style={{width:`${pct}%`}} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {[{l:"Day of year",v:`Day ${doy}`},{l:"Days remaining",v:remaining},{l:"Quarter",v:`Q${quarter}`},{l:"Days to New Year",v:daysToNewYear}].map(s=>(
                <div key={s.l} className="rounded-lg bg-[#16213e] p-2 text-center">
                  <div className="text-xs text-[#a8a8b3]">{s.l}</div>
                  <div className="font-bold text-white">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolutions */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
            <h3 className="font-bold text-white mb-4">My Resolutions ({resolutions.length}/5)</h3>
            {resolutions.map((r,i)=>(
              <div key={i} className={`flex items-center gap-3 rounded-lg border px-4 py-3 mb-2 ${STATUS_STYLE[r.status]}`}>
                <span className="flex-1 text-white text-sm">{r.text}</span>
                <button onClick={()=>cycleStatus(i)} className={`text-xs px-2 py-1 rounded border ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</button>
                <button onClick={()=>remove(i)} className="text-[#a8a8b3] hover:text-[#e94560] text-lg leading-none">×</button>
              </div>
            ))}
            {resolutions.length<5 && (
              <div className="flex gap-2 mt-2">
                <input type="text" value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addResolution()}
                  placeholder="Add a resolution..."
                  className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2 text-white placeholder:text-[#a8a8b3] text-sm focus:border-[#e94560] focus:outline-none" />
                <button onClick={addResolution} className="rounded-lg bg-[#e94560] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">Add</button>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center">
            <p className="text-[#e94560] italic">&ldquo;{QUOTES[doy%QUOTES.length]}&rdquo;</p>
          </div>

          <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
            className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Share on X →</a>
        </div>
      </section>
    </div>
  );
}
