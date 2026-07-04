"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";
import { generateShareImage } from "@/utils/generateShareImage";

function pad(n: number) { return String(n).padStart(2,"0"); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}); }

export default function RetirementCountdownTool() {
  const [dob,      setDob]      = useState("");
  const [retAge,   setRetAge]   = useState(65);
  const [jobStart, setJobStart] = useState("");
  const [timeLeft, setTimeLeft] = useState({d:0,h:0,m:0,s:0});
  const [retDate,  setRetDate]  = useState<Date|null>(null);
  const [error,    setError]    = useState("");
  const [retired,  setRetired]  = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const d = p.get("dob"), a = p.get("age");
    if (d) { setDob(d); }
    if (a) { setRetAge(parseInt(a, 10)); }
  }, []);

  useEffect(() => {
    if (!retDate) return;
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, retDate.getTime()-now);
      const tot = Math.floor(diff/1000);
      setTimeLeft({d:Math.floor(tot/86400),h:Math.floor((tot%86400)/3600),m:Math.floor((tot%3600)/60),s:tot%60});
    };
    tick();
    const id = setInterval(tick,1000);
    return () => clearInterval(id);
  },[retDate]);

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob+"T00:00:00");
    const ret   = new Date(birth.getFullYear()+retAge, birth.getMonth(), birth.getDate());
    const today = new Date(); today.setHours(0,0,0,0);
    setError("");
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/retirement-countdown?dob=" + dob + "&age=" + retAge);
    }
    setRetDate(ret);
    setRetired(ret<=today);
  };

  const today = new Date();
  const birthDate = dob ? new Date(dob+"T00:00:00") : null;
  const careerStartDate = jobStart ? new Date(jobStart+"T00:00:00") : null;
  const careerYears = careerStartDate ? ((today.getTime()-careerStartDate.getTime())/86400000/365.25).toFixed(1) : null;
  const pct = (careerStartDate && retDate)
    ? Math.min(100, ((today.getTime()-careerStartDate.getTime())/(retDate.getTime()-careerStartDate.getTime())*100)).toFixed(0)
    : null;

  const daysOldAtRetirement = retDate && birthDate
    ? Math.round((retDate.getTime()-birthDate.getTime())/86400000)
    : null;

  function downloadShareImage() {
    if (!retDate || retired) return
    generateShareImage({
      title: "My Retirement Countdown",
      primaryStat: timeLeft.d.toLocaleString(),
      primaryLabel: "days until retirement",
      stats: [
        { label: "Retirement date", value: fmtDate(retDate) },
        { label: "Retiring at age", value: `${retAge}` },
        { label: "Days old at retirement", value: daysOldAtRetirement ? daysOldAtRetirement.toLocaleString() : "—" },
      ],
      tagline: "Every day worked is one day closer.",
      toolUrl: "dayblip.com/retirement-countdown",
      filename: "dayblip-retirement-countdown.png",
    })
  }


  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💼</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Retirement Countdown — How Many Days Until You Retire?</h1>
          <p className="text-lg text-[#a8a8b3]">Count down to the day you retire</p>
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The standard US retirement age is 67 for full Social Security benefits for people born after 1960. A 36-year-old planning to retire at 67 has 11,315 days remaining until retirement — approximately 31 years. Early retirement at 55 would be 6,935 days away for the same 36-year-old.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A retirement countdown calculates the exact number of days, months and years until your target retirement date based on your current age and chosen retirement age. It shows the time remaining as a live countdown and helps make an abstract future milestone feel concrete and real.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-5">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
              <input type="date" value={dob} onChange={e=>setDob(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Retirement age: <span className="text-[#e94560]">{retAge}</span></label>
              <input type="range" min={55} max={75} value={retAge} onChange={e=>setRetAge(Number(e.target.value))} className="w-full accent-[#e94560]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Job/career start date (optional)</label>
              <input type="date" value={jobStart} onChange={e=>setJobStart(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {retDate && (
            <div className="space-y-4">
              {retired ? (
                <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-6 text-center">
                  <p className="text-3xl font-black text-green-400">🎉 Congratulations!</p>
                  <p className="text-white mt-2">You have been retired for <strong className="text-[#e94560]">{timeLeft.d.toLocaleString()} days!</strong></p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6">
                    <p className="text-center text-[#a8a8b3] text-sm mb-3">You retire in</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[{l:"Days",v:timeLeft.d},{l:"Hours",v:timeLeft.h},{l:"Min",v:timeLeft.m},{l:"Sec",v:timeLeft.s}].map(u=>(
                        <div key={u.l} className="text-center rounded-xl bg-[#16213e] border border-[#0f3460] px-5 py-3 min-w-[80px]">
                          <div className="text-3xl font-black text-[#e94560] tabular-nums leading-none">{pad(u.v)}</div>
                          <div className="text-xs text-[#a8a8b3] mt-1">{u.l}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-[#a8a8b3] text-sm mt-3">Retirement date: <strong className="text-white">{fmtDate(retDate)}</strong></p>
                  </div>

                  {pct && (
                    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold">Career Progress</span>
                        <span className="text-[#e94560] font-bold">{pct}%</span>
                      </div>
                      <div className="h-4 w-full rounded-full bg-[#16213e] overflow-hidden">
                        <div className="h-full rounded-full bg-[#e94560]" style={{width:`${pct}%`}} />
                      </div>
                      <p className="text-[#a8a8b3] text-xs mt-2">{careerYears} years worked · ~{Math.max(0,retAge-(today.getFullYear()-(birthDate?.getFullYear()??0))).toFixed(0)} years remaining</p>
                    </div>
                  )}

                  {daysOldAtRetirement && <p className="text-center text-[#a8a8b3] text-sm">You will be {daysOldAtRetirement.toLocaleString()} days old when you retire</p>}
                  {retDate && (
                    <ShareButtons
                      text={`I retire in ${timeLeft.d} days! Counting down every day 🎉`}
                      url={"https://www.dayblip.com/retirement-countdown?dob=" + dob + "&age=" + retAge}
                      title="Retirement Countdown"
                    />
                  )}
                  <button
                    onClick={downloadShareImage}
                    style={{ width: "100%", background: "#e8445a", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
                  >
                    📸 Download Your Result
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
