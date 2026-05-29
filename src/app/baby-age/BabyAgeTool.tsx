"use client";
import { useState } from "react";

const MILESTONES = [
  { weeks:0,   label:"Newborn stage",              detail:"Welcome to the world! Sleeps 16-18 hours" },
  { weeks:4,   label:"Social smiling begins",       detail:"First smiles appear around 6-8 weeks" },
  { weeks:12,  label:"Holds head up, tracks objects",detail:"Head control developing, follows movement" },
  { weeks:16,  label:"Laughs, rolls over",          detail:"Social development accelerating" },
  { weeks:26,  label:"Sits with support, solid foods",detail:"Ready to try pureed foods!" },
  { weeks:39,  label:"Crawls, pulls to stand",      detail:"Major mobility milestone" },
  { weeks:52,  label:"First words, first steps",    detail:"Walking and talking begin (varies widely)" },
  { weeks:65,  label:"Walking confidently",         detail:"Exploring everything now!" },
  { weeks:78,  label:"Vocabulary of 10-20 words",   detail:"Language explosion begins" },
  { weeks:104, label:"Running, 2-word phrases",     detail:"Full toddler mode activated" },
  { weeks:156, label:"Full sentences, imaginative play",detail:"Preschool language developing" },
  { weeks:208, label:"Writes name, rides tricycle", detail:"Fine motor skills growing" },
  { weeks:260, label:"Ready for kindergarten",      detail:"Big milestone — school time!" },
];

export default function BabyAgeTool() {
  const [dob,    setDob]    = useState("");
  const [result, setResult] = useState<{weeks:number;days:number;months:number;remDays:number;totalDays:number}|null>(null);
  const [error,  setError]  = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter baby's date of birth."); return; }
    const birth = new Date(dob+"T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (birth>today) { setError("Date must be in the past."); return; }
    setError("");
    const totalDays = Math.floor((today.getTime()-birth.getTime())/86400000);
    const weeks     = Math.floor(totalDays/7);
    const days      = totalDays%7;
    const months    = Math.floor(totalDays/30.44);
    const remDays   = Math.round(totalDays%30.44);
    setResult({ weeks, days, months, remDays, totalDays });
  };

  const currentWeeks = result?.weeks ?? 0;
  const past   = MILESTONES.filter(m => m.weeks <= currentWeeks);
  const future = MILESTONES.filter(m => m.weeks > currentWeeks);
  const next   = future[0];

  const shareText = result
    ? encodeURIComponent(`My baby is ${result.weeks} weeks and ${result.days} days old today!\nTrack yours → dayblip.com/baby-age`)
    : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">👶</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Baby Age Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">Track your baby or toddler&apos;s exact age in weeks, months and days</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="flex gap-3">
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)}
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            <button onClick={calculate} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
          </div>
          {error && <p className="text-sm text-[#e94560]">{error}</p>}

          {result && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
                <p className="text-5xl font-black text-[#e94560]">{result.weeks} weeks</p>
                <p className="text-xl text-white mt-1">and {result.days} day{result.days!==1?"s":""} old</p>
                <p className="text-[#a8a8b3] mt-2">{result.months} months and {result.remDays} days · {result.totalDays.toLocaleString()} total days</p>
              </div>

              {next && (
                <div className="rounded-xl border border-[#e94560]/20 bg-[#16213e] p-5">
                  <p className="text-[#a8a8b3] text-sm mb-1">Next milestone</p>
                  <p className="font-bold text-white">{next.label}</p>
                  <p className="text-[#e94560] text-sm">~Week {next.weeks} — in approximately {next.weeks-currentWeeks} weeks</p>
                  <p className="text-[#a8a8b3] text-xs mt-1">{next.detail}</p>
                </div>
              )}

              {past.length > 0 && (
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                  <h3 className="font-bold text-white mb-3">✅ Milestones Reached</h3>
                  {[...past].reverse().map(m=>(
                    <div key={m.weeks} className="flex gap-2 mb-2 opacity-70">
                      <span className="text-green-400 shrink-0">✅</span>
                      <div><p className="text-white text-sm">{m.label}</p><p className="text-[#a8a8b3] text-xs">{m.detail}</p></div>
                    </div>
                  ))}
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
