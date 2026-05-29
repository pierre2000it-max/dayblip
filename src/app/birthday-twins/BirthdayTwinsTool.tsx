"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WikiPerson {
  name: string;
  description: string;
  birthYear: number;
}

// ── Fallback data ─────────────────────────────────────────────────────────────

const FALLBACK: Record<string, WikiPerson[]> = {
  "1-1":  [{ name: "J.D. Salinger", description: "Author of The Catcher in the Rye", birthYear: 1919 }, { name: "Verne Troyer", description: "Actor", birthYear: 1969 }],
  "7-4":  [{ name: "Calvin Coolidge", description: "30th US President", birthYear: 1872 }, { name: "Post Malone", description: "Rapper and Singer", birthYear: 1995 }],
  "12-25":[{ name: "Isaac Newton", description: "Mathematician and Physicist", birthYear: 1643 }, { name: "Justin Trudeau", description: "Canadian Prime Minister", birthYear: 1971 }],
  "10-31":[{ name: "John Keats", description: "Poet", birthYear: 1795 }, { name: "Vanilla Ice", description: "Rapper", birthYear: 1967 }],
  "2-14": [{ name: "Frederick Douglass", description: "Abolitionist and Statesman", birthYear: 1818 }, { name: "Michael Bloomberg", description: "Businessman and Politician", birthYear: 1942 }],
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MAX_DAYS = [31,29,31,30,31,30,31,31,30,31,30,31];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BirthdayTwinsTool() {
  const [month,   setMonth]   = useState(1);
  const [day,     setDay]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [people,  setPeople]  = useState<WikiPerson[]>([]);
  const [searched,setSearched]= useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const maxDay = MAX_DAYS[month - 1];
  const safeDay = Math.min(day, maxDay);

  const search = async () => {
    setLoading(true);
    setSearched(true);
    setUsedFallback(false);

    const query = `SELECT ?person ?personLabel ?description ?birthYear WHERE {
      ?person wdt:P31 wd:Q5 .
      ?person wdt:P569 ?birthDate .
      FILTER(MONTH(?birthDate) = ${month})
      FILTER(DAY(?birthDate) = ${safeDay})
      OPTIONAL { ?person schema:description ?description . FILTER(LANG(?description) = "en") }
      BIND(YEAR(?birthDate) AS ?birthYear)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    }
    ORDER BY ?birthYear
    LIMIT 20`;

    try {
      const res = await fetch(
        `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
        { headers: { Accept: "application/sparql-results+json" } }
      );
      if (!res.ok) throw new Error("API error");

      const json = await res.json();
      type Binding = { personLabel?: { value: string }; description?: { value: string }; birthYear?: { value: string } };
      const mapped: WikiPerson[] = (json.results.bindings as Binding[])
        .map(b => ({
          name:        b.personLabel?.value  ?? "",
          description: b.description?.value  ?? "",
          birthYear:   parseInt(b.birthYear?.value ?? "0", 10),
        }))
        .filter(p => p.name && !p.name.startsWith("Q") && p.birthYear > 0);

      if (mapped.length === 0) {
        setUsedFallback(true);
        setPeople(FALLBACK[`${month}-${safeDay}`] ?? []);
      } else {
        setPeople(mapped);
      }
    } catch {
      setUsedFallback(true);
      setPeople(FALLBACK[`${month}-${safeDay}`] ?? []);
    }

    setLoading(false);
  };

  const currentYear = new Date().getFullYear();
  const dateLabel   = `${MONTHS[month - 1]} ${safeDay}`;
  const shareText   = people.length >= 2
    ? encodeURIComponent(`My birthday twins are ${people[0].name} and ${people[1].name}! 🎂\nFind yours → dayblip.com/birthday-twins`)
    : encodeURIComponent(`Find your celebrity birthday twins → dayblip.com/birthday-twins`);

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">🎂</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Birthday Twin Finder</h1>
          <p className="text-lg text-[#a8a8b3]">Discover famous people who share your birthday</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <label className="mb-3 block text-sm font-semibold text-white">Select your birth month and day</label>
            <div className="flex gap-3 mb-4">
              <select value={month} onChange={e => setMonth(Number(e.target.value))}
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select value={safeDay} onChange={e => setDay(Number(e.target.value))}
                className="w-24 rounded-lg border border-[#0f3460] bg-[#16213e] px-3 py-3 text-white focus:border-[#e94560] focus:outline-none">
                {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <button onClick={search} disabled={loading}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {loading ? "Searching…" : "Find My Birthday Twins →"}
            </button>
          </div>

          {/* Results */}
          {searched && !loading && (
            <div className="mt-8">
              <h2 className="mb-2 text-xl font-bold text-white">
                Famous people born on {dateLabel}:
              </h2>
              {usedFallback && (
                <p className="mb-4 text-xs text-[#a8a8b3]">Showing curated data (live data unavailable)</p>
              )}
              {people.length === 0 ? (
                <p className="text-[#a8a8b3]">No famous birthdays found for {dateLabel}. Try another date!</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {people.map((p, i) => (
                    <div key={i} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                      <p className="font-bold text-white text-lg">{p.name}</p>
                      {p.description && <p className="text-[#a8a8b3] text-sm mt-1">{p.description}</p>}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[#e94560] font-semibold text-sm">Born {p.birthYear}</span>
                        <span className="text-[#a8a8b3] text-xs">{currentYear - p.birthYear} years ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {people.length >= 2 && (
                <a href={`https://twitter.com/intent/tweet?text=${shareText}`}
                  target="_blank" rel="noopener noreferrer"
                  className="mt-6 inline-block rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Share on X →
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
