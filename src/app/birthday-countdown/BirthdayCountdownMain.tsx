"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function BirthdayCountdownMain() {
  const router = useRouter();
  const [name,  setName]  = useState("");
  const [month, setMonth] = useState("1");
  const [day,   setDay]   = useState("1");
  const [year,  setYear]  = useState("1990");
  const [msg,   setMsg]   = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    const y = parseInt(year, 10);
    const d = parseInt(day,  10);
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) { setError("Please enter a valid birth year."); return; }
    if (isNaN(d) || d < 1 || d > 31) { setError("Please enter a valid day."); return; }
    setError("");

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const params = new URLSearchParams({ bd: `${month}-${day}-${year}`, msg });
    router.push(`/birthday-countdown/${slug}?${params.toString()}`);
  };

  const daysInMonth = [31,29,31,30,31,30,31,31,30,31,30,31][parseInt(month)-1];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎂</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Birthday Countdown — How Many Days Until Your Next Birthday?</h1>
          <p className="text-lg text-[#a8a8b3]">Generate a personal countdown page to share with friends and family</p>
        </div>
      </section>

      {/* ── Quick Answer ───────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">There are always between 0 and 364 days until your next birthday. The average person has 27,375 birthdays in a 75-year life. Your birthday falls on a different day of the week each year — advancing by one day in regular years and two days after a leap year. On average your birthday falls on a weekend approximately 2 out of every 7 years.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">A birthday countdown calculates the exact number of days, hours, minutes and seconds until your next birthday and updates in real time. It also shows what day of the week your upcoming birthday falls on and how many birthdays you have celebrated so far in your lifetime.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[600px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Your name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Smith"
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Your birthday</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={month} onChange={e => setMonth(e.target.value)}
                  className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none">
                  {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                </select>
                <select value={day} onChange={e => setDay(e.target.value)}
                  className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none">
                  {Array.from({ length: daysInMonth }, (_, i) => i+1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year"
                  className="rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-white">Personal message (optional)</label>
              <input type="text" value={msg} onChange={e => setMsg(e.target.value.slice(0, 100))}
                placeholder="e.g. Can't wait for my big day!"
                className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              <p className="text-xs text-[#a8a8b3] mt-1">{msg.length}/100 characters</p>
            </div>

            <button onClick={generate}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Generate My Countdown →
            </button>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
