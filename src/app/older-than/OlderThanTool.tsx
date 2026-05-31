"use client";
import { useState, useEffect } from "react";
import ShareButtons from "@/components/ShareButtons";

const COMPARISONS = [
  { item: "the iPhone",                   emoji: "📱", year: 2007, description: "Apple released the first iPhone" },
  { item: "the internet (World Wide Web)",emoji: "🌐", year: 1991, description: "Tim Berners-Lee launched the WWW" },
  { item: "Google",                        emoji: "🔍", year: 1998, description: "Google was founded" },
  { item: "Facebook",                      emoji: "👥", year: 2004, description: "Facebook was founded" },
  { item: "YouTube",                       emoji: "▶️", year: 2005, description: "YouTube was founded" },
  { item: "Netflix",                       emoji: "🎬", year: 1997, description: "Netflix was founded" },
  { item: "Amazon",                        emoji: "📦", year: 1994, description: "Amazon was founded" },
  { item: "Wikipedia",                     emoji: "📚", year: 2001, description: "Wikipedia was launched" },
  { item: "Twitter/X",                     emoji: "🐦", year: 2006, description: "Twitter was founded" },
  { item: "Instagram",                     emoji: "📸", year: 2010, description: "Instagram was launched" },
  { item: "Snapchat",                      emoji: "👻", year: 2011, description: "Snapchat was founded" },
  { item: "TikTok",                        emoji: "🎵", year: 2016, description: "TikTok was launched globally" },
  { item: "sliced bread",                  emoji: "🍞", year: 1928, description: "First sliced bread was sold" },
  { item: "color TV",                      emoji: "📺", year: 1954, description: "Color TV was introduced commercially" },
  { item: "the microwave oven",            emoji: "🍳", year: 1946, description: "The microwave oven was invented" },
  { item: "McDonald's",                    emoji: "🍔", year: 1940, description: "McDonald's was founded" },
  { item: "NASA",                          emoji: "🚀", year: 1958, description: "NASA was established" },
  { item: "the first moon landing",        emoji: "🌙", year: 1969, description: "Apollo 11 landed on the moon" },
  { item: "the Berlin Wall falling",       emoji: "🧱", year: 1989, description: "The Berlin Wall fell" },
  { item: "the first Star Wars movie",     emoji: "⭐", year: 1977, description: "Star Wars Episode IV released" },
  { item: "Disneyland",                    emoji: "🏰", year: 1955, description: "Disneyland opened in California" },
  { item: "the first video game (Pong)",   emoji: "🎮", year: 1972, description: "Pong was released by Atari" },
  { item: "the personal computer",         emoji: "💻", year: 1975, description: "First personal computer released" },
  { item: "GPS navigation",               emoji: "🗺️", year: 1995, description: "GPS became available to civilians" },
  { item: "Bluetooth",                     emoji: "📡", year: 1999, description: "Bluetooth was released commercially" },
];

export default function OlderThanTool() {
  const [dob,    setDob]    = useState("");
  const [result, setResult] = useState<{ birthYear: number; results: typeof COMPARISONS[0][] } | null>(null);
  const [error,  setError]  = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const d = p.get("dob");
    if (d) { setDob(d); }
  }, []);

  const compare = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    if (isNaN(birth.getTime())) { setError("Invalid date."); return; }
    setError("");
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/older-than?dob=" + dob);
    }
    setResult({ birthYear: birth.getFullYear(), results: COMPARISONS });
  };

  const birthYear = result?.birthYear ?? 0;
  const currentYear = new Date().getFullYear();

  // Most surprising: oldest thing you're younger than OR newest thing you're older than
  const younger = result ? COMPARISONS.filter(c => birthYear > c.year) : [];
  const mostSurprising = younger.length > 0
    ? younger.reduce((a, b) => (currentYear - a.year > currentYear - b.year ? a : b))
    : null;

  const shareItems = result ? COMPARISONS.filter(c => birthYear < c.year).slice(0, 1) : [];
  const shareOlder = result ? COMPARISONS.filter(c => birthYear > c.year).slice(-1) : [];

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📱</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Are You Older or Younger Than...?</h1>
          <p className="text-lg text-[#a8a8b3]">Compare your age to famous inventions, events and things</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8 mb-8">
            <label className="mb-1 block text-sm font-semibold text-white">Your date of birth</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={compare}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Compare Me →
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {result && (
            <div className="space-y-4">
              {mostSurprising && (
                <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-4 text-center">
                  <p className="text-white">
                    Most surprising: <strong className="text-[#e94560]">You have never lived in a world without {mostSurprising.item}!</strong>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {COMPARISONS.map(c => {
                  const diff = Math.abs(birthYear - c.year);
                  const isOlder = birthYear < c.year;
                  return (
                    <div key={c.item} className={`rounded-xl border p-4 ${isOlder ? "border-[#e94560]/30 bg-[#1a1a2e]" : "border-[#0f3460] bg-[#16213e]"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="font-bold text-white text-sm">{c.item}</span>
                      </div>
                      <p className={`text-sm font-semibold ${isOlder ? "text-[#e94560]" : "text-green-400"}`}>
                        {isOlder
                          ? `You are ${diff} years YOUNGER`
                          : `You are ${diff} years OLDER`}
                      </p>
                      <p className="text-xs text-[#a8a8b3] mt-1">{c.description} ({c.year})</p>
                    </div>
                  );
                })}
              </div>

              <ShareButtons
                text={shareItems[0] && shareOlder[0]
                  ? `I am older than ${shareItems[0].item} but younger than ${shareOlder[0].item}! 😮 Find out yours!`
                  : "Find out if you are older than the iPhone! 😮"}
                url={"https://www.dayblip.com/older-than?dob=" + dob}
                title="Older Than Calculator"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
