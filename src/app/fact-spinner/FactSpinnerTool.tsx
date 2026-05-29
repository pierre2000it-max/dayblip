"use client";
import { useState, useEffect } from "react";

const FACTS = [
  "In 1969, Neil Armstrong walked on the moon while 600 million people watched on TV",
  "The Great Wall of China took over 1,800 years to build across multiple dynasties",
  "Cleopatra lived closer in time to the Moon landing than to the building of the pyramids",
  "Nintendo was founded in 1889, originally selling handmade playing cards",
  "Oxford University is older than the Aztec Empire",
  "The fax machine was invented before the telephone",
  "France was still using the guillotine when Star Wars was released in 1977",
  "The woolly mammoth was still alive when the Great Pyramid was being built",
  "Vikings used to give kittens to new brides as essential gifts for a new home",
  "Betty White was older than sliced bread",
  "The first computer bug was an actual bug — a moth found in a Harvard computer in 1947",
  "More people are alive today than have ever died",
  "The shortest war in history lasted 38 minutes between Britain and Zanzibar in 1896",
  "Humans share 50% of their DNA with bananas",
  "A group of flamingos is called a flamboyance",
  "The average person walks 100,000 miles in their lifetime",
  "Shakespeare invented over 1,700 words we still use today",
  "The Eiffel Tower grows 6 inches taller in summer due to heat expansion",
  "Honey never spoils — edible honey was found in 3,000 year old Egyptian tombs",
  "The first alarm clock could only ring at 4am",
  "Coca-Cola was originally green",
  "It would take 100,000 years to travel to the nearest star at current speeds",
  "The fingerprints of a koala are nearly indistinguishable from human fingerprints",
  "A day on Venus is longer than a year on Venus",
  "The inventor of the Frisbee was turned into a Frisbee after he died",
  "The dot over the letter i is called a tittle",
  "A jiffy is an actual unit of time — 1/100th of a second",
  "The average person spends 6 months of their lifetime waiting for red lights",
  "Crows can remember human faces and hold grudges",
  "There are more possible chess games than atoms in the observable universe",
  "The first text message ever sent said Merry Christmas in 1992",
  "Toilet paper was invented before indoor plumbing",
  "Pineapples take two years to grow",
  "A shrimp's heart is in its head",
  "The human brain generates enough electricity to power a small light bulb",
  "Elephants are the only animals that cannot jump",
  "A snail can sleep for three years at a time",
  "The tongue is the strongest muscle in the body relative to its size",
  "Butterflies taste with their feet",
  "The average person has about 70,000 thoughts per day",
  "You cannot hum while holding your nose closed",
  "It is impossible to sneeze with your eyes open",
  "The first YouTube video was uploaded on April 23, 2005",
  "Google processes over 8.5 billion searches per day",
  "The iPhone was announced on January 9, 2007",
  "Wikipedia was launched on January 15, 2001",
  "The Berlin Wall fell on November 9, 1989",
  "The first email was sent in 1971 by Ray Tomlinson to himself",
  "Windex was originally used as a toilet cleaner",
  "The Roman Empire was founded before the invention of the calendar we use today",
];

export default function FactSpinnerTool() {
  const [fact,       setFact]       = useState<string | null>(null);
  const [spinning,   setSpinning]   = useState(false);
  const [factIndex,  setFactIndex]  = useState(0);
  const [seenFacts,  setSeenFacts]  = useState<Set<number>>(new Set());
  const [rotation,   setRotation]   = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fs_seen");
      if (saved) setSeenFacts(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setFact(null);

    let unused = FACTS.map((_, i) => i).filter(i => !seenFacts.has(i));
    if (unused.length === 0) { setSeenFacts(new Set()); unused = FACTS.map((_, i) => i); }

    const chosen = unused[Math.floor(Math.random() * unused.length)];
    setRotation(r => r + 720 + Math.floor(Math.random() * 360));

    setTimeout(() => {
      setFact(FACTS[chosen]);
      setFactIndex(chosen);
      const next = new Set(seenFacts).add(chosen);
      setSeenFacts(next);
      try { localStorage.setItem("fs_seen", JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      setSpinning(false);
    }, 1500);
  };

  const shareText = fact
    ? encodeURIComponent(`${fact} 🤯\nDiscover more at dayblip.com/fact-spinner`)
    : "";

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Random Historical Fact Spinner</h1>
          <p className="text-lg text-[#a8a8b3]">Spin to discover a random fact from history</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] flex flex-col items-center">
          {/* Spin button */}
          <button
            onClick={spin} disabled={spinning}
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 1.5s cubic-bezier(0.2,0,0.1,1)" : "none" }}
            className="h-40 w-40 rounded-full bg-[#e94560] text-6xl shadow-2xl transition-opacity hover:opacity-90 disabled:cursor-not-allowed flex items-center justify-center mb-8"
            aria-label="Spin">
            {spinning ? "🌀" : "🎲"}
          </button>

          <p className="text-[#a8a8b3] mb-6">
            {spinning ? "Spinning…" : fact ? "Click to spin again!" : "Click to spin!"}
          </p>

          {/* Fact card */}
          {fact && !spinning && (
            <div className="w-full space-y-4">
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6">
                <p className="text-lg leading-relaxed text-white font-medium">{fact}</p>
                <p className="mt-3 text-xs text-[#a8a8b3]">
                  Fact {factIndex + 1} of {FACTS.length} — {seenFacts.size} seen
                </p>
              </div>

              {seenFacts.size >= FACTS.length && (
                <p className="text-center text-[#a8a8b3] text-sm">You have seen all our facts! New facts added weekly.</p>
              )}

              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={spin}
                  className="rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Spin Again
                </button>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}`}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Share on X →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
