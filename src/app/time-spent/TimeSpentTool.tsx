"use client";
import { useState } from "react";

export default function TimeSpentTool() {
  const [dob,      setDob]      = useState("");
  const [sleep,    setSleep]    = useState(8);
  const [work,     setWork]     = useState(8);
  const [screen,   setScreen]   = useState(5);
  const [exercise, setExercise] = useState(3); // hrs/week
  const [result,   setResult]   = useState<Record<string, number> | null>(null);
  const [error,    setError]    = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");

    const days  = Math.floor((today.getTime() - birth.getTime()) / 86400000);
    const years = days / 365.25;

    const sleepYears    = (sleep / 24) * years;
    const workYears     = (work  / 24) * years;
    const screenYears   = (screen/ 24) * years;
    const exerciseYears = (exercise / 7 / 24) * years;
    const eatYears      = ((1.5 / 24)) * years; // ~1.5h eating per day
    const commuteYears  = ((1   / 24)) * years; // ~1h commute per day
    const total         = sleepYears + workYears + screenYears + exerciseYears + eatYears + commuteYears;
    const freeYears     = Math.max(0, years - total);

    setResult({ days, years, sleepYears, workYears, screenYears, exerciseYears, eatYears, commuteYears, freeYears, total });
  };

  const pct  = (v: number) => result ? Math.round(v / result.years * 100) : 0;
  const yrs  = (v: number) => v.toFixed(1);

  const shareText = result
    ? encodeURIComponent(`I have spent ${yrs(result.sleepYears)} years sleeping and ${yrs(result.screenYears)} years on screens 😮\nCalculate yours → dayblip.com/time-spent`)
    : "";

  const BARS = result ? [
    { icon:"😴", label:"Sleeping",          val:result.sleepYears,    col:"#e94560" },
    { icon:"💼", label:"Working/School",    val:result.workYears,     col:"#4FC3F7" },
    { icon:"📱", label:"Screen Time",       val:result.screenYears,   col:"#9b59b6" },
    { icon:"🍽️", label:"Eating",            val:result.eatYears,      col:"#F9A825" },
    { icon:"🏃", label:"Exercising",        val:result.exerciseYears, col:"#27ae60" },
    { icon:"🚗", label:"Commuting",         val:result.commuteYears,  col:"#e67e22" },
    { icon:"✨", label:"Free Time",         val:result.freeYears,     col:"#e94560" },
  ] : [];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">⏰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Time Spent Calculator — How Much Life Have You Spent Sleeping?</h1>
          <p className="text-lg text-[#a8a8b3]">How much of your life have you spent sleeping, working and eating?</p>
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">The average person spends 26 years sleeping in a 78-year lifetime. They spend 11 years working, 4 years eating, 3 years in education, 2 years watching TV and 1.5 years on social media daily. That leaves approximately 9 years for family, hobbies, exercise and everything else. Most people are surprised by how little truly discretionary time remains.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Time spent calculators break down a human lifetime into categories of activity based on average time use research. By entering your age the tool shows how many years you have already spent sleeping, working, eating and commuting — and how many years remain for each activity based on average life expectancy.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            </div>
            {[
              { label:`Sleep per night: ${sleep}h`,       val:sleep,    set:setSleep,    min:4,  max:12 },
              { label:`Work/school per day: ${work}h`,    val:work,     set:setWork,     min:0,  max:12 },
              { label:`Screen time per day: ${screen}h`,  val:screen,   set:setScreen,   min:0,  max:16 },
              { label:`Exercise per week: ${exercise}h`,  val:exercise, set:setExercise, min:0,  max:20 },
            ].map(s => (
              <div key={s.label}>
                <label className="mb-1 block text-sm font-semibold text-white">{s.label}</label>
                <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className="w-full accent-[#e94560]" />
              </div>
            ))}
            <button onClick={calculate} className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate My Time →</button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="mt-8 space-y-4">
              {BARS.map(b => (
                <div key={b.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">{b.icon} {b.label}</span>
                    <span className="text-sm text-[#a8a8b3]">{yrs(b.val)} years ({pct(b.val)}%)</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-[#16213e] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${Math.min(100,pct(b.val))}%`, background: b.col }} />
                  </div>
                </div>
              ))}
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
