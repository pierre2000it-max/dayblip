"use client";
import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";

const REF_FULL_MOON = new Date(2025, 0, 13); // Jan 13, 2025
const LUNAR_CYCLE   = 29.53059; // days

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
}

function getPhase(date: Date): string {
  const days = (date.getTime() - REF_FULL_MOON.getTime()) / 86400000;
  const phase = ((days % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  if (phase < 1.85)  return "🌕 Full Moon";
  if (phase < 7.38)  return "🌖 Waning Gibbous";
  if (phase < 9.22)  return "🌗 Last Quarter";
  if (phase < 14.75) return "🌘 Waning Crescent";
  if (phase < 16.60) return "🌑 New Moon";
  if (phase < 22.15) return "🌒 Waxing Crescent";
  if (phase < 23.99) return "🌓 First Quarter";
  return "🌔 Waxing Gibbous";
}

function getNextFullMoons(count: number): Date[] {
  const today = new Date();
  const daysSinceRef = (today.getTime() - REF_FULL_MOON.getTime()) / 86400000;
  const nextCycle    = Math.ceil(daysSinceRef / LUNAR_CYCLE);
  return Array.from({ length: count }, (_, i) =>
    new Date(REF_FULL_MOON.getTime() + (nextCycle + i) * LUNAR_CYCLE * 86400000)
  );
}

export default function FullMoonsTool() {
  const [dob,    setDob]    = useState("");
  const [result, setResult] = useState<{ moons: number; daysAgo: number; phase: string } | null>(null);
  const [error,  setError]  = useState("");

  const today      = new Date();
  const nextMoons  = getNextFullMoons(6);
  const todayPhase = getPhase(today);

  const calculate = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");
    const daysSinceBirth = (today.getTime() - birth.getTime()) / 86400000;
    const moons = Math.floor(daysSinceBirth / LUNAR_CYCLE);
    // Days from birth to nearest past full moon
    const daysSinceRef  = (birth.getTime() - REF_FULL_MOON.getTime()) / 86400000;
    const cycleOffset   = ((daysSinceRef % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
    const daysAgo       = Math.round(cycleOffset);
    setResult({ moons, daysAgo, phase: getPhase(birth) });
  };


  const FACTS = [
    "A full moon cycle is called a lunation",
    "There are 12–13 full moons per year",
    "The moon affects tides and some animals",
    "A blue moon is when two full moons occur in one calendar month",
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-6xl">🌕</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Full Moons Calculator — How Many Full Moons Have You Lived?</h1>
          <p className="text-lg text-[#a8a8b3]">Calculate the number of full moons since you were born</p>
          <div className="mt-4 inline-block rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-4 py-1.5 text-sm text-[#e94560]">
            Moon phase today: {todayPhase}
          </div>
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">There are approximately 12.37 full moons per year. A 36-year-old has lived through approximately 445 full moons. In a 78-year lifetime the average person sees roughly 965 full moons. The next full moon occurs approximately every 29.5 days — the length of one lunar cycle.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The full moons calculator counts the number of full moons that have occurred since your birth date based on the 29.5-day lunar cycle. It also shows the date of your next full moon and how many full moons remain in your expected lifetime. Many cultures have used full moons to mark time and celebrate life milestones throughout human history.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-8">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <label className="mb-1 block text-sm font-semibold text-white">Date of birth</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={calculate}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Count My Moons →
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-6 text-center">
              <p className="text-6xl font-black text-[#e94560]">{result.moons}</p>
              <p className="text-white text-xl font-semibold mt-1">full moons lived</p>
              <p className="text-[#a8a8b3] mt-3 text-sm">
                You were born approximately <strong className="text-white">{result.daysAgo} days</strong> into a lunar cycle
              </p>
              {result && (
                <ShareButtons
                  text={`I have lived through ${result.moons} full moons! 🌕 Calculate yours!`}
                  url="https://dayblip.com/full-moons"
                  title="Full Moons Calculator"
                />
              )}
            </div>
          )}

          {/* Next 6 full moons */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h3 className="mb-4 font-bold text-white">Next 6 Full Moons</h3>
            <div className="space-y-2">
              {nextMoons.map((m, i) => {
                const days = Math.ceil((m.getTime() - today.getTime()) / 86400000);
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-[#16213e] px-4 py-3">
                    <span className="text-white">🌕 {fmtDate(m)}</span>
                    <span className="text-[#e94560] font-semibold text-sm">{days} days away</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fun facts */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <h3 className="mb-4 font-bold text-white">🌙 Moon Facts</h3>
            {FACTS.map(f => (
              <div key={f} className="flex gap-2 mb-2"><span className="text-[#e94560]">→</span><span className="text-[#a8a8b3] text-sm">{f}</span></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
