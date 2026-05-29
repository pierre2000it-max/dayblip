"use client";
import { useState, useEffect } from "react";

type Mode = "summer"|"back"|"graduation";

function pad(n: number) { return String(n).padStart(2,"0"); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}); }

export default function SchoolCountdownTool() {
  const [mode,     setMode]     = useState<Mode>("summer");
  const [date,     setDate]     = useState("");
  const [timeLeft, setTimeLeft] = useState({d:0,h:0,m:0,s:0});
  const [target,   setTarget]   = useState<Date|null>(null);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = Math.max(0,target.getTime()-Date.now());
      const tot  = Math.floor(diff/1000);
      setTimeLeft({d:Math.floor(tot/86400),h:Math.floor((tot%86400)/3600),m:Math.floor((tot%3600)/60),s:tot%60});
    };
    tick();
    const id = setInterval(tick,1000);
    return () => clearInterval(id);
  },[target]);

  const calculate = () => {
    if (!date) { setError("Please enter a date."); return; }
    setError("");
    setTarget(new Date(date+"T00:00:00"));
  };

  const LABELS: Record<Mode,{title:string;label:string;share:string}> = {
    summer:     { title:"Days Until Summer Break", label:"Last day of school", share:`Only ${timeLeft.d} days until summer break!!! dayblip.com/school-countdown` },
    back:       { title:"Days Until Back to School", label:"First day back", share:`Only ${timeLeft.d} days until school starts! dayblip.com/school-countdown` },
    graduation: { title:"Days Until Graduation 🎓", label:"Graduation date", share:`Only ${timeLeft.d} days until graduation! dayblip.com/school-countdown` },
  };

  const shareText = encodeURIComponent(LABELS[mode].share);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📚</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">School Countdown Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">Count down to summer break, graduation or back to school</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px] space-y-5">
          {/* Mode tabs */}
          <div className="flex rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-1 gap-1">
            {(["summer","back","graduation"] as Mode[]).map(m=>(
              <button key={m} onClick={()=>{setMode(m);setTarget(null);setDate("");}}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${m===mode?"bg-[#e94560] text-white":"text-[#a8a8b3] hover:text-white"}`}>
                {m==="summer"?"☀️ Summer":m==="back"?"🎒 Back to School":"🎓 Graduation"}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <h2 className="font-bold text-white">{LABELS[mode].title}</h2>
            <div>
              <label className="mb-1 block text-sm text-[#a8a8b3]">{LABELS[mode].label}</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Show Countdown →</button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {target && (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center space-y-4">
              <p className="text-[#a8a8b3] text-sm">{fmtDate(target)}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[{l:"Days",v:timeLeft.d},{l:"Hours",v:timeLeft.h},{l:"Min",v:timeLeft.m},{l:"Sec",v:timeLeft.s}].map(u=>(
                  <div key={u.l} className="min-w-[80px] rounded-xl bg-[#16213e] border border-[#0f3460] px-4 py-3 text-center">
                    <div className="text-3xl font-black text-[#e94560] tabular-nums">{pad(u.v)}</div>
                    <div className="text-xs text-[#a8a8b3]">{u.l}</div>
                  </div>
                ))}
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
