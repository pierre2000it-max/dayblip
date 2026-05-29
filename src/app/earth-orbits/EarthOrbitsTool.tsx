"use client";
import { useState } from "react";

function commas(n: number) { return n.toLocaleString(); }

export default function EarthOrbitsTool() {
  const [dob,    setDob]    = useState("");
  const [result, setResult] = useState<Record<string,number|string>|null>(null);
  const [error,  setError]  = useState("");

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob+"T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (birth>=today) { setError("Birth date must be in the past."); return; }
    setError("");

    const days      = Math.floor((today.getTime()-birth.getTime())/86400000);
    const years     = days/365.25;
    const orbits    = years;
    const miles     = Math.round(orbits * 584_000_000);
    const moonCycles= Math.floor(days/27.3);
    const sunrises  = days;
    const lightYrs  = (years * 9.461e12).toExponential(2);

    setResult({ days, years:years.toFixed(4), orbits:orbits.toFixed(4), miles, moonCycles, sunrises, lightYrs });
  };

  const shareText = result
    ? encodeURIComponent(`Since I was born Earth has orbited the sun ${result.orbits} times and traveled ${Number(result.miles).toLocaleString()} miles! 🌍\ndayblip.com/earth-orbits`)
    : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌌</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">How Many Times Has Earth Orbited the Sun?</h1>
          <p className="text-lg text-[#a8a8b3]">Cosmic facts about your time on Earth</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-5">
          <div className="flex gap-3">
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)}
              className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
            <button onClick={calculate} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
          </div>
          {error && <p className="text-sm text-[#e94560]">{error}</p>}

          {result && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {icon:"🌍",label:"Earth orbits since your birth",val:String(result.orbits)},
                  {icon:"🚀",label:"Miles Earth has traveled",val:commas(Number(result.miles))},
                  {icon:"🌙",label:"Moon cycles since your birth",val:commas(Number(result.moonCycles))},
                  {icon:"🌅",label:"Sunrises you have lived",val:commas(Number(result.sunrises))},
                ].map(s=>(
                  <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className="text-xs text-[#a8a8b3]">{s.label}</div>
                    <div className="text-xl font-bold text-[#e94560] mt-1">{s.val}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 space-y-3">
                <h3 className="font-bold text-white">⚡ Cosmic Speed Facts</h3>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">Right now you are traveling at <strong className="text-white">67,000 mph</strong> around the sun</span></div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">Earth&apos;s rotation adds another <strong className="text-white">~1,000 mph</strong></span></div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">Light from your birth date has traveled approximately <strong className="text-white">{String(result.lightYrs)} km</strong> away</span></div>
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
