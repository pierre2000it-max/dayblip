"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const POPULAR_YEARS = [1960,1965,1970,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020];

export default function BornInLanding() {
  const router = useRouter();
  const [yearInput, setYearInput] = useState("");
  const [error,     setError]     = useState("");

  const go = () => {
    const y = parseInt(yearInput, 10);
    if (isNaN(y) || y < 1940 || y > 2020) {
      setError("Please enter a year between 1940 and 2020.");
      return;
    }
    router.push(`/born-in/${y}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-20 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🗓️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            Born In Your Year — Facts, Events and History From When You Arrived
          </h1>
          <p className="mb-8 text-lg text-[#a8a8b3]">
            Enter your birth year to discover what the world looked like when you arrived
          </p>

          {/* Year input */}
          <div className="mx-auto max-w-[400px]">
            <div className="flex gap-3 mb-3">
              <input
                type="number"
                min={1940}
                max={2020}
                value={yearInput}
                onChange={e => setYearInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="e.g. 1990"
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-4 text-2xl font-bold text-white text-center placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
              />
              <button onClick={go}
                className="rounded-lg bg-[#e94560] px-6 py-4 font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap">
                Show My Year →
              </button>
            </div>
            {error && <p className="text-sm text-[#e94560]">{error}</p>}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">Discover what the world looked like the year you were born. Find the number one song, top movie, gas price, world population, major events and who was president for any year from 1940 to 2020. Each year page includes dozens of historical facts about the world as it was when you arrived.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The Born In year tool shows a complete snapshot of the world for any birth year. Data includes music, film, sports, gas prices, minimum wage, notable events and world population — giving you a rich picture of the historical context of your birth year. Available for every year from 1940 to 2020.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          {/* Fun prompt */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 mb-8 text-center">
            <p className="text-[#a8a8b3] text-lg leading-relaxed">
              What was the #1 song when you were born?<br />
              What did gas cost? Who was president?<br />
              <strong className="text-white">Enter your year to find out.</strong>
            </p>
          </div>

          {/* Popular years */}
          <h2 className="mb-4 text-center text-xl font-bold text-white">Popular Years</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_YEARS.map(y => (
              <Link key={y} href={`/born-in/${y}`}
                className="rounded-full border border-[#0f3460] bg-[#1a1a2e] px-5 py-2.5 text-white font-semibold transition-colors hover:border-[#e94560] hover:bg-[#e94560]/10">
                {y}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
