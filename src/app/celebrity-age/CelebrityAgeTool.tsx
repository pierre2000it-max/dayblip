"use client";

import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SearchResult {
  id:           string;
  name:         string;
  description:  string;
  birthDateStr: string;
}

interface Celebrity {
  name:        string;
  description: string;
  birthDate:   Date;
}

interface SameBdayPerson {
  name:        string;
  description: string;
  birthYear:   number;
}

interface TimeLeft { days: number; h: number; m: number; s: number }

// ── Constants ─────────────────────────────────────────────────────────────────

const POPULAR = [
  "Taylor Swift","Elon Musk","LeBron James","Beyoncé","Tom Hanks",
  "Oprah Winfrey","Dwayne Johnson","Cristiano Ronaldo","Billie Eilish",
  "Barack Obama","Kim Kardashian","Drake",
];

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseBirthDate(s: string): Date | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function fmtDate(d: Date): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getStarSign(month: number, day: number): string {
  if ((month===3&&day>=21)||(month===4&&day<=19)) return "♈ Aries";
  if ((month===4&&day>=20)||(month===5&&day<=20)) return "♉ Taurus";
  if ((month===5&&day>=21)||(month===6&&day<=20)) return "♊ Gemini";
  if ((month===6&&day>=21)||(month===7&&day<=22)) return "♋ Cancer";
  if ((month===7&&day>=23)||(month===8&&day<=22)) return "♌ Leo";
  if ((month===8&&day>=23)||(month===9&&day<=22)) return "♍ Virgo";
  if ((month===9&&day>=23)||(month===10&&day<=22)) return "♎ Libra";
  if ((month===10&&day>=23)||(month===11&&day<=21)) return "♏ Scorpio";
  if ((month===11&&day>=22)||(month===12&&day<=21)) return "♐ Sagittarius";
  if ((month===12&&day>=22)||(month===1&&day<=19)) return "♑ Capricorn";
  if ((month===1&&day>=20)||(month===2&&day<=18)) return "♒ Aquarius";
  return "♓ Pisces";
}

function calcAge(birth: Date): { years:number; months:number; days:number; totalDays:number; totalMonths:number; totalWeeks:number; totalHours:number } {
  const now      = new Date();
  const totalMs  = now.getTime() - birth.getTime();
  const totalDays = Math.floor(totalMs / 86400000);

  let years  = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth()    - birth.getMonth();
  let days   = now.getDate()     - birth.getDate();
  if (days < 0)   { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }

  return { years, months, days, totalDays, totalMonths: years*12+months, totalWeeks: Math.floor(totalDays/7), totalHours: totalDays*24 };
}

function getNextBirthday(birth: Date): Date {
  const now  = new Date(); now.setHours(0,0,0,0);
  let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (next <= now) next = new Date(now.getFullYear()+1, birth.getMonth(), birth.getDate());
  return next;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff  = Math.max(0, target.getTime() - Date.now());
  const total = Math.floor(diff / 1000);
  return { days:Math.floor(total/86400), h:Math.floor((total%86400)/3600), m:Math.floor((total%3600)/60), s:total%60 };
}

function countPresidents(birthYear: number): number {
  // Inauguration years of US presidents since modern era
  const inaugs = [1933,1945,1953,1961,1963,1969,1974,1977,1981,1989,1993,2001,2009,2017,2021];
  return inaugs.filter(y => y >= birthYear).length;
}

function commas(n: number) { return n.toLocaleString(); }

// ── API calls ─────────────────────────────────────────────────────────────────

async function apiSearch(term: string): Promise<SearchResult[]> {
  const safe  = term.replace(/"/g, "");
  const query = `
    SELECT ?person ?personLabel ?birthDate ?description WHERE {
      ?person wdt:P31 wd:Q5 .
      ?person wdt:P569 ?birthDate .
      ?person rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      FILTER(CONTAINS(LCASE(?label), LCASE("${safe}")))
      OPTIONAL { ?person schema:description ?description . FILTER(LANG(?description) = "en") }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    }
    ORDER BY ?personLabel
    LIMIT 8
  `;
  const res = await fetch(
    `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
    { headers: { Accept: "application/sparql-results+json" } }
  );
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  type B = { person:{value:string}; personLabel:{value:string}; birthDate?:{value:string}; description?:{value:string} };
  const seen = new Set<string>();
  return (json.results.bindings as B[])
    .filter(b => b.birthDate?.value && b.personLabel?.value && !b.personLabel.value.startsWith("Q"))
    .map(b => ({
      id:           b.person.value.split("/").pop() ?? "",
      name:         b.personLabel.value,
      description:  b.description?.value ?? "",
      birthDateStr: b.birthDate!.value,
    }))
    .filter(r => { if (seen.has(r.name)) return false; seen.add(r.name); return true; });
}

async function apiSameBday(month: number, day: number, excludeName: string): Promise<SameBdayPerson[]> {
  const query = `
    SELECT ?person ?personLabel ?description ?birthYear WHERE {
      ?person wdt:P31 wd:Q5 .
      ?person wdt:P569 ?birthDate .
      FILTER(MONTH(?birthDate) = ${month})
      FILTER(DAY(?birthDate) = ${day})
      OPTIONAL { ?person schema:description ?description . FILTER(LANG(?description) = "en") }
      BIND(YEAR(?birthDate) AS ?birthYear)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    }
    ORDER BY ?birthYear
    LIMIT 10
  `;
  const res = await fetch(
    `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
    { headers: { Accept: "application/sparql-results+json" } }
  );
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  type B2 = { personLabel:{value:string}; description?:{value:string}; birthYear?:{value:string} };
  const seen = new Set<string>();
  return (json.results.bindings as B2[])
    .filter(b => b.personLabel?.value && !b.personLabel.value.startsWith("Q") && b.personLabel.value !== excludeName)
    .map(b => ({ name:b.personLabel.value, description:b.description?.value??"", birthYear:parseInt(b.birthYear?.value??"0",10) }))
    .filter(r => { if (seen.has(r.name)) return false; seen.add(r.name); return true; })
    .slice(0, 6);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CelebrityAgeTool() {
  const [searchTerm,     setSearchTerm]     = useState("");
  const [isLoading,      setIsLoading]      = useState(false);
  const [searchResults,  setSearchResults]  = useState<SearchResult[]>([]);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [celebrity,      setCelebrity]      = useState<Celebrity | null>(null);
  const [timeLeft,       setTimeLeft]       = useState<TimeLeft>({ days:0, h:0, m:0, s:0 });
  const [sameBday,       setSameBday]       = useState<SameBdayPerson[]>([]);
  const [error,          setError]          = useState("");
  const [myDob,          setMyDob]          = useState("");
  const [showCompare,    setShowCompare]    = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [loadingSameBday,setLoadingSameBday]= useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  // Load recents
  useEffect(() => {
    try {
      const s = localStorage.getItem("ca_recent");
      if (s) setRecentSearches(JSON.parse(s));
    } catch { /* ignore */ }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Countdown
  useEffect(() => {
    if (!celebrity) return;
    const next = getNextBirthday(celebrity.birthDate);
    setTimeLeft(calcTimeLeft(next));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(next)), 1000);
    return () => clearInterval(id);
  }, [celebrity]);

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 3) { setSearchResults([]); setShowDropdown(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true); setError("");
      try {
        const results = await apiSearch(searchTerm);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
        if (results.length === 0) setError(`No results found for '${searchTerm}'. Try a different spelling.`);
      } catch {
        setError("Could not connect to search database. Please try again in a moment.");
        setShowDropdown(false);
      }
      setIsLoading(false);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchTerm]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const selectResult = async (r: SearchResult) => {
    const birth = parseBirthDate(r.birthDateStr);
    if (!birth) return;
    setCelebrity({ name:r.name, description:r.description, birthDate:birth });
    setSearchTerm(r.name);
    setShowDropdown(false);
    setSearchResults([]);
    setSameBday([]);
    setError("");

    // Save recent
    const next = [r, ...recentSearches.filter(x => x.name !== r.name)].slice(0,5);
    setRecentSearches(next);
    try { localStorage.setItem("ca_recent", JSON.stringify(next)); } catch { /* ignore */ }

    // Same birthday fetch
    setLoadingSameBday(true);
    try {
      const same = await apiSameBday(birth.getMonth()+1, birth.getDate(), r.name);
      setSameBday(same);
    } catch { /* ignore */ }
    setLoadingSameBday(false);
  };

  const triggerPopular = async (name: string) => {
    setSearchTerm(name);
    setIsLoading(true);
    setError("");
    setShowDropdown(false);
    try {
      const results = await apiSearch(name);
      if (results.length > 0) await selectResult(results[0]);
      else setError(`No results found for '${name}'.`);
    } catch {
      setError("Could not connect to search database.");
    }
    setIsLoading(false);
  };

  // ── Derived data ─────────────────────────────────────────────────────────────

  const age        = celebrity ? calcAge(celebrity.birthDate) : null;
  const nextBday   = celebrity ? getNextBirthday(celebrity.birthDate) : null;
  const turningAge = celebrity && nextBday ? nextBday.getFullYear() - celebrity.birthDate.getFullYear() : null;
  const sign       = celebrity ? getStarSign(celebrity.birthDate.getMonth()+1, celebrity.birthDate.getDate()) : null;
  const presidents = celebrity ? countPresidents(celebrity.birthDate.getFullYear()) : null;

  const myBirth  = myDob ? parseBirthDate(myDob) : null;
  const myAge    = myBirth ? calcAge(myBirth) : null;
  const ageDiff  = (age && myAge) ? Math.abs(age.years - myAge.years) : null;
  const celebOlderThanMe = (celebrity && myBirth) ? celebrity.birthDate < myBirth : null;

  const shareText = celebrity && age
    ? encodeURIComponent(`${celebrity.name} is ${age.years} years old today!\nThey turn ${turningAge} in ${timeLeft.days} days 🎂\nCheck any celebrity → dayblip.com/celebrity-age`)
    : "";

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1a1a2e]">

      {/* Hero */}
      <section className="px-6 py-16 text-center"
        style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">⭐</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            How Old Is...? Celebrity Age Calculator
          </h1>
          <p className="text-lg text-[#a8a8b3]">
            Search any celebrity or famous person to find their exact age, birthday and countdown to their next birthday
          </p>
        </div>
      </section>

      {/* Search section */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-6">

          {/* Search input */}
          <div ref={wrapperRef} className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCelebrity(null); }}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Type a celebrity name... e.g. Taylor Swift, Elon Musk, LeBron James"
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
              />
              <button
                onClick={() => searchTerm.length >= 3 && triggerPopular(searchTerm)}
                disabled={searchTerm.length < 3 || isLoading}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isLoading ? "…" : "Search →"}
              </button>
            </div>

            {/* Results dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-[#0f3460] bg-[#1a1a2e] shadow-xl overflow-hidden">
                {searchResults.map((r, i) => {
                  const birth = parseBirthDate(r.birthDateStr);
                  return (
                    <button key={i} onClick={() => selectResult(r)}
                      className="w-full px-4 py-3 text-left hover:bg-[#16213e] border-b border-[#0f3460] last:border-0 transition-colors">
                      <p className="font-semibold text-white">{r.name}</p>
                      <p className="text-xs text-[#a8a8b3]">
                        {r.description}{birth ? ` · Born ${birth.getFullYear()}` : ""}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error */}
          {error && !celebrity && (
            <p className="text-sm text-[#e94560]">{error}</p>
          )}

          {/* Popular searches */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-[#a8a8b3]">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map(name => (
                <button key={name} onClick={() => triggerPopular(name)}
                  className="rounded-full border border-[#0f3460] bg-[#1a1a2e] px-3 py-1.5 text-sm text-[#a8a8b3] transition-colors hover:border-[#e94560] hover:text-white">
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-[#a8a8b3]">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(r => (
                  <button key={r.name} onClick={() => selectResult(r)}
                    className="rounded-full border border-[#e94560]/30 bg-[#e94560]/10 px-3 py-1.5 text-sm text-[#e94560] transition-colors hover:bg-[#e94560]/20">
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compare (collapsible) */}
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] overflow-hidden">
            <button onClick={() => setShowCompare(s => !s)}
              className="w-full px-5 py-3 text-left text-sm font-semibold text-[#a8a8b3] hover:text-white transition-colors flex justify-between items-center">
              <span>Compare with your age (optional)</span>
              <span>{showCompare ? "▲" : "▼"}</span>
            </button>
            {showCompare && (
              <div className="px-5 pb-4">
                <label className="mb-1 block text-xs text-[#a8a8b3]">Your date of birth</label>
                <input type="date" value={myDob} onChange={e => setMyDob(e.target.value)}
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-2.5 text-white focus:border-[#e94560] focus:outline-none" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Celebrity profile */}
      {celebrity && age && (
        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[700px] space-y-6">

            {/* Name + description + sign */}
            <div className="rounded-xl border border-[#e94560]/30 bg-[#16213e] p-6">
              <h2 className="text-3xl font-black text-white">{celebrity.name}</h2>
              {celebrity.description && <p className="text-[#a8a8b3] mt-1 capitalize">{celebrity.description}</p>}
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-[#e94560]/10 border border-[#e94560]/30 px-3 py-1 text-[#e94560]">
                  {sign}
                </span>
                <span className="rounded-full bg-[#0f3460] px-3 py-1 text-[#a8a8b3]">
                  Born {fmtDate(celebrity.birthDate)}
                </span>
                <span className="rounded-full bg-[#0f3460] px-3 py-1 text-[#a8a8b3]">
                  Born on a {DAYS[celebrity.birthDate.getDay()]}
                </span>
              </div>
            </div>

            {/* Age breakdown cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label:"Years old",    val:commas(age.years) },
                { label:"Total months", val:commas(age.totalMonths) },
                { label:"Total weeks",  val:commas(age.totalWeeks) },
                { label:"Total days",   val:commas(age.totalDays) },
                { label:"Total hours",  val:commas(age.totalHours) },
                { label:"Months + days",val:`${age.months}m ${age.days}d` },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4 text-center">
                  <div className="text-xl font-black text-[#e94560]">{s.val}</div>
                  <div className="text-xs text-[#a8a8b3] mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Birthday countdown */}
            <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
              <h3 className="mb-4 font-bold text-white">🎂 Next Birthday Countdown</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {[{l:"Days",v:timeLeft.days},{l:"Hours",v:timeLeft.h},{l:"Min",v:timeLeft.m},{l:"Sec",v:timeLeft.s}].map(u => (
                  <div key={u.l} className="min-w-[80px] rounded-xl bg-[#1a1a2e] px-4 py-3 text-center border border-[#0f3460]">
                    <div className="text-3xl font-black text-[#e94560] tabular-nums leading-none">{String(u.v).padStart(2,"0")}</div>
                    <div className="text-xs text-[#a8a8b3] mt-1">{u.l}</div>
                  </div>
                ))}
              </div>
              {nextBday && turningAge && (
                <div className="text-center text-sm text-[#a8a8b3]">
                  <p>{celebrity.name} turns <strong className="text-white">{turningAge}</strong> on {MONTHS[nextBday.getMonth()]} {nextBday.getDate()}, {nextBday.getFullYear()}</p>
                  <p className="mt-1">Their birthday falls on a <strong className="text-white">{DAYS[nextBday.getDay()]}</strong> this year</p>
                </div>
              )}
            </div>

            {/* Fun comparisons */}
            <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
              <h3 className="mb-4 font-bold text-white">🔢 Fun Comparisons</h3>
              <div className="space-y-3">
                <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3] text-sm">
                    They were born <strong className="text-white">{Math.abs(celebrity.birthDate.getFullYear() - 2007)} years</strong>{" "}
                    {celebrity.birthDate.getFullYear() < 2007 ? "before" : "after"} the first iPhone (2007)
                  </span>
                </div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3] text-sm">
                    They were born <strong className="text-white">{Math.abs(celebrity.birthDate.getFullYear() - 1991)} years</strong>{" "}
                    {celebrity.birthDate.getFullYear() < 1991 ? "before" : "after"} the public internet (1991)
                  </span>
                </div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3] text-sm">
                    They have lived through approximately <strong className="text-white">{presidents}</strong> US presidential terms
                  </span>
                </div>
                {ageDiff !== null && celebOlderThanMe !== null && (
                  <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                    <span className="text-[#a8a8b3] text-sm">
                      {celebrity.name} is <strong className="text-white">{ageDiff} years {celebOlderThanMe ? "older" : "younger"}</strong> than you
                    </span>
                  </div>
                )}
                {myAge && celebrity && (
                  <>
                    <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                      <span className="text-[#a8a8b3] text-sm">
                        When {celebrity.name} was your age ({myAge.years}), it was <strong className="text-white">{celebrity.birthDate.getFullYear() + myAge.years}</strong>
                      </span>
                    </div>
                    {myBirth && (
                      <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                        <span className="text-[#a8a8b3] text-sm">
                          When you reach {celebrity.name}&apos;s current age ({age.years}), it will be <strong className="text-white">{myBirth.getFullYear() + age.years}</strong>
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Share */}
            <div className="flex flex-wrap gap-3">
              <a href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank" rel="noopener noreferrer"
                className="rounded-lg border border-[#333] bg-black px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Share {celebrity.name}&apos;s Age on X →
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://dayblip.com/celebrity-age")}`}
                target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-[#1877f2] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                Share on Facebook →
              </a>
            </div>

            {/* Same birthday celebrities */}
            <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
              <h3 className="mb-4 font-bold text-white">
                🎂 Other Celebrities Born on {MONTHS[celebrity.birthDate.getMonth()]} {celebrity.birthDate.getDate()}:
              </h3>
              {loadingSameBday && <p className="text-[#a8a8b3] text-sm">Loading...</p>}
              {!loadingSameBday && sameBday.length === 0 && <p className="text-[#a8a8b3] text-sm">No additional results found.</p>}
              {sameBday.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {sameBday.map((p, i) => (
                    <button key={i} onClick={() => triggerPopular(p.name)}
                      className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-left transition-all hover:border-[#e94560]">
                      <p className="font-semibold text-white text-sm">{p.name}</p>
                      {p.description && <p className="text-xs text-[#a8a8b3] mt-1">{p.description}</p>}
                      {p.birthYear > 0 && <p className="text-xs text-[#e94560] mt-1">Born {p.birthYear}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      )}
    </div>
  );
}
