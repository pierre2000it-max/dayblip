"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";
import { generateShareImage } from "@/utils/generateShareImage";

function commas(n: number) { return n.toLocaleString(); }

export default function EarthOrbitsTool() {
  const [dob,    setDob]    = useState("");
  const [result, setResult] = useState<Record<string,number|string>|null>(null);
  const [error,  setError]  = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const d = p.get("dob");
    if (d) { setDob(d); }
  }, []);

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

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/earth-orbits?dob=" + dob);
    }
    setResult({ days, years:years.toFixed(4), orbits:orbits.toFixed(4), miles, moonCycles, sunrises, lightYrs });
  };


  function downloadShareImage() {
    if (!result) return
    generateShareImage({
      title: "My Earth Orbits",
      primaryStat: String(result.orbits),
      primaryLabel: "orbits around the sun",
      stats: [
        { label: "Miles traveled", value: Number(result.miles).toLocaleString() },
        { label: "Sunrises witnessed", value: Number(result.sunrises).toLocaleString() },
        { label: "Moon cycles", value: Number(result.moonCycles).toLocaleString() },
      ],
      tagline: "You have traveled billions of miles.",
      toolUrl: "dayblip.com/earth-orbits",
      filename: "dayblip-earth-orbits.png",
    })
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)"}}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌌</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Earth Orbits Calculator — How Many Times Have You Orbited the Sun?</h1>
          <p className="text-lg text-[#a8a8b3]">Cosmic facts about your time on Earth</p>
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Each birthday marks one complete orbit of Earth around the Sun. A 36-year-old has completed 36 full orbits traveling approximately 20.8 billion miles through space. Earth travels at 67,000 miles per hour in its orbit. In your lifetime your body has traveled further through space than any human-made spacecraft ever launched.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">Earth orbits calculators express age in terms of trips around the Sun — each year representing one complete 584-million-mile journey. It also calculates the total distance traveled through space, the speed of that journey and compares your space travel to famous spacecraft and astronomical distances. A fun cosmic perspective on the passage of time.</p>
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

              {result && (
                <ShareButtons
                  text={`Since I was born Earth has orbited the sun ${result.orbits} times and traveled ${Number(result.miles).toLocaleString()} miles! 🌍`}
                  url={"https://www.dayblip.com/earth-orbits?dob=" + dob}
                  title="Earth Orbits Calculator"
                />
              )}
              {result && (
                <button
                  onClick={downloadShareImage}
                  style={{ width: "100%", background: "#e8445a", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#c73348")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#e8445a")}
                >
                  📸 Download Your Result
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
