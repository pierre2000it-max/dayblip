"use client";
import { useState } from "react";

const TECH_TIMELINE = [
  { year:1971, item:"First email sent", emoji:"📧" },
  { year:1973, item:"First mobile phone call", emoji:"📱" },
  { year:1975, item:"First personal computer", emoji:"💻" },
  { year:1977, item:"Apple II released", emoji:"🍎" },
  { year:1979, item:"Walkman invented", emoji:"🎧" },
  { year:1981, item:"IBM PC released", emoji:"🖥️" },
  { year:1983, item:"Internet born (TCP/IP)", emoji:"🌐" },
  { year:1984, item:"Apple Macintosh launched", emoji:"🖥️" },
  { year:1985, item:"Windows 1.0 released", emoji:"🪟" },
  { year:1989, item:"World Wide Web invented", emoji:"🕸️" },
  { year:1991, item:"WWW goes public", emoji:"🌍" },
  { year:1992, item:"First text message sent", emoji:"💬" },
  { year:1993, item:"First web browser (Mosaic)", emoji:"🔍" },
  { year:1994, item:"Amazon founded", emoji:"📦" },
  { year:1995, item:"Windows 95 launched", emoji:"🪟" },
  { year:1997, item:"Netflix founded", emoji:"🎬" },
  { year:1998, item:"Google founded", emoji:"🔍" },
  { year:1999, item:"Napster launches music sharing", emoji:"🎵" },
  { year:2001, item:"Wikipedia launched", emoji:"📚" },
  { year:2001, item:"iPod released", emoji:"🎵" },
  { year:2003, item:"iTunes Music Store opens", emoji:"🎵" },
  { year:2004, item:"Facebook founded", emoji:"👥" },
  { year:2005, item:"YouTube founded", emoji:"▶️" },
  { year:2006, item:"Twitter founded", emoji:"🐦" },
  { year:2007, item:"iPhone 1 released", emoji:"📱" },
  { year:2008, item:"App Store launched", emoji:"📲" },
  { year:2008, item:"Spotify launched", emoji:"🎵" },
  { year:2008, item:"Android launched", emoji:"🤖" },
  { year:2010, item:"Instagram launched", emoji:"📸" },
  { year:2010, item:"iPad released", emoji:"📱" },
  { year:2011, item:"Siri launched", emoji:"🎙️" },
  { year:2011, item:"Snapchat launched", emoji:"👻" },
  { year:2016, item:"TikTok launched", emoji:"🎵" },
  { year:2022, item:"ChatGPT launched", emoji:"🤖" },
  { year:2023, item:"AI art tools go mainstream", emoji:"🎨" },
];

export default function TechNostalgiaTool() {
  const [birthYearStr, setBirthYearStr] = useState("");
  const [birthYear,    setBirthYear]    = useState<number | null>(null);
  const [error,        setError]        = useState("");

  const calculate = () => {
    const y = parseInt(birthYearStr, 10);
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) { setError("Please enter a valid birth year."); return; }
    setError("");
    setBirthYear(y);
  };

  const items  = birthYear ? TECH_TIMELINE.filter(t => t.year > birthYear) : [];
  const iphone = 2007;
  const currentYear = new Date().getFullYear();
  const iphoneGens  = birthYear ? Math.max(0, currentYear - iphone) : 0;
  const beforeIphone = birthYear && birthYear < iphone ? iphone - birthYear : null;
  const afterIphone  = birthYear && birthYear >= iphone ? birthYear - iphone : null;

  const shareText = birthYear
    ? encodeURIComponent(`I was born ${beforeIphone ? `${beforeIphone} years before` : `${afterIphone} years after`} the iPhone and have seen ${items.length} major tech inventions!\ndayblip.com/tech-nostalgia`)
    : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">💻</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Tech Nostalgia Calculator</h1>
          <p className="text-lg text-[#a8a8b3]">How many iPhones ago were you born? See how technology changed in your lifetime</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
            <label className="mb-1 block text-sm font-semibold text-white">Your birth year</label>
            <div className="flex gap-3">
              <input type="number" value={birthYearStr} onChange={e => setBirthYearStr(e.target.value)} placeholder="e.g. 1990" min="1900" max="2025"
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none" />
              <button onClick={calculate} className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">Calculate →</button>
            </div>
            {error && <p className="mt-2 text-sm text-[#e94560]">{error}</p>}
          </div>

          {birthYear && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-4 text-center">
                  <div className="text-3xl font-black text-[#e94560]">{items.length}</div>
                  <div className="text-xs text-[#a8a8b3]">tech inventions in your lifetime</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-3xl font-black text-white">{iphoneGens}</div>
                  <div className="text-xs text-[#a8a8b3]">iPhone versions since it launched</div>
                </div>
                <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-center">
                  <div className="text-xl font-black text-white">{beforeIphone ? `${beforeIphone}yr before` : `${afterIphone}yr after`}</div>
                  <div className="text-xs text-[#a8a8b3]">the iPhone</div>
                </div>
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="mb-4 font-bold text-white">Tech invented in your lifetime</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {items.map((t, i) => {
                    const age = birthYear ? t.year - birthYear : 0;
                    const badge = age < 10 ? "🟡 Under 10" : age < 18 ? "🟠 Teen" : age < 21 ? "🟢 21" : "";
                    return (
                      <div key={i} className="flex items-center gap-3 rounded-lg bg-[#16213e] px-4 py-2.5">
                        <span>{t.emoji}</span>
                        <span className="flex-1 text-white text-sm">{t.item}</span>
                        <span className="text-[#a8a8b3] text-xs">{t.year}</span>
                        {badge && <span className="text-xs">{badge}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

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
