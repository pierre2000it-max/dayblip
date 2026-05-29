"use client";
import { useState } from "react";

const NATURE = [
  { item:"Pando (clonal tree colony, Utah)", age:80000, emoji:"🌲" },
  { item:"Bristlecone Pine (Methuselah tree)", age:4855, emoji:"🌳" },
  { item:"Ocean Quahog clam (Ming)", age:507, emoji:"🐚" },
  { item:"Bowhead Whale", age:211, emoji:"🐋" },
  { item:"Galapagos Giant Tortoise", age:190, emoji:"🐢" },
  { item:"Greenland Shark", age:400, emoji:"🦈" },
];
const CREATIONS = [
  { item:"Stonehenge", age:5000, emoji:"🗿" },
  { item:"Great Pyramid of Giza", age:4500, emoji:"🔺" },
  { item:"The Great Wall of China", age:2300, emoji:"🧱" },
  { item:"The Colosseum in Rome", age:1950, emoji:"🏟️" },
  { item:"Notre Dame Cathedral", age:860, emoji:"⛪" },
  { item:"The United States of America", age:250, emoji:"🇺🇸" },
  { item:"The Eiffel Tower", age:137, emoji:"🗼" },
];
const COMPANIES = [
  { item:"Nishiyama Onsen Keiunkan (Japan)", age:1315, emoji:"🏨" },
  { item:"Oxford University Press", age:535, emoji:"📖" },
  { item:"Beretta (firearms)", age:499, emoji:"🔫" },
  { item:"Barclays Bank", age:334, emoji:"🏦" },
  { item:"London Stock Exchange", age:323, emoji:"💹" },
];

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-[#0f3460] overflow-hidden mt-2">
      <div className="h-full rounded-full bg-[#e94560]" style={{ width: `${Math.max(0.5, Math.min(100, pct))}%` }} />
    </div>
  );
}

export default function OldestThingsTool() {
  const [dob,    setDob]    = useState("");
  const [myAge,  setMyAge]  = useState<number | null>(null);
  const [error,  setError]  = useState("");

  const compare = () => {
    if (!dob) { setError("Please enter your date of birth."); return; }
    const birth = new Date(dob + "T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if (birth >= today) { setError("Birth date must be in the past."); return; }
    setError("");
    setMyAge(Math.floor((today.getTime() - birth.getTime()) / 86400000 / 365.25));
  };

  const shareText = myAge
    ? encodeURIComponent(`The oldest tree on Earth is 4,855 years old. I am ${((myAge/4855)*100).toFixed(2)}% as old 🌳\ndayblip.com/oldest-things`)
    : "";

  const renderList = (title: string, items: { item: string; age: number; emoji: string }[]) => (
    <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
      <h3 className="mb-4 font-bold text-white">{title}</h3>
      <div className="space-y-4">
        {items.map(it => {
          const pct   = myAge ? (myAge / it.age * 100) : 0;
          const ratio = myAge ? (it.age / myAge).toFixed(1) : null;
          return (
            <div key={it.item}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-white text-sm font-semibold">{it.emoji} {it.item}</span>
                <span className="text-[#a8a8b3] text-xs shrink-0">{it.age.toLocaleString()} yrs</span>
              </div>
              {myAge && (
                <p className="text-xs mt-0.5 text-[#e94560]">
                  {pct >= 100
                    ? `You are older! (${((myAge/it.age)*100).toFixed(0)}% older)`
                    : ratio ? `${ratio}× older than you` : ""}
                </p>
              )}
              {myAge && <Bar pct={pct} />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🌍</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">The Oldest Things in the World</h1>
          <p className="text-lg text-[#a8a8b3]">How does your age compare to the oldest things on Earth?</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <label className="mb-1 block text-sm font-semibold text-white">Your date of birth</label>
            <div className="flex gap-3">
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none" />
              <button onClick={compare} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Compare →</button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
            {myAge && <p className="mt-3 text-center text-white">You are <strong className="text-[#e94560]">{myAge} years old</strong></p>}
          </div>

          {renderList("🌿 Oldest Things in Nature", NATURE)}
          {renderList("🏛️ Oldest Human Creations", CREATIONS)}
          {renderList("🏢 Oldest Companies", COMPANIES)}

          {myAge && (
            <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
              className="inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              Share on X →
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
