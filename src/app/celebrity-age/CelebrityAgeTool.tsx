"use client";

import { useState, useEffect, useRef } from "react";
import ShareButtons from "@/components/ShareButtons";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuickResult {
  id:          string;
  name:        string;
  description: string;
}

interface Celebrity {
  name:        string;
  description: string;
  birthDate:   Date;
}

interface RecentCelebrity {
  name:        string;
  description: string;
  birthDate:   string; // "YYYY-MM-DD"
}

interface SameBdayPerson {
  name:        string;
  description: string;
  birthYear:   number;
}

interface TimeLeft { days: number; h: number; m: number; s: number }

// ── Hardcoded popular celebrities (instant — no API needed) ───────────────────

const POPULAR_DATA: { name: string; birthDate: string; description: string }[] = [
  { name:"Taylor Swift",     birthDate:"1989-12-13", description:"Singer and songwriter" },
  { name:"Elon Musk",        birthDate:"1971-06-28", description:"Entrepreneur and businessman" },
  { name:"LeBron James",     birthDate:"1984-12-30", description:"Professional basketball player" },
  { name:"Beyoncé",          birthDate:"1981-09-04", description:"Singer and entertainer" },
  { name:"Tom Hanks",        birthDate:"1956-07-09", description:"Actor and filmmaker" },
  { name:"Oprah Winfrey",    birthDate:"1954-01-29", description:"TV host and media executive" },
  { name:"Dwayne Johnson",   birthDate:"1972-05-02", description:"Actor and former wrestler" },
  { name:"Cristiano Ronaldo",birthDate:"1985-02-05", description:"Professional footballer" },
  { name:"Billie Eilish",    birthDate:"2001-12-18", description:"Singer and songwriter" },
  { name:"Barack Obama",     birthDate:"1961-08-04", description:"44th US President" },
  { name:"Kim Kardashian",   birthDate:"1980-10-21", description:"Media personality and businesswoman" },
  { name:"Drake",            birthDate:"1986-10-24", description:"Rapper and singer" },
];

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSimpleDate(s: string): Date | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function parseWikidataTime(s: string): Date | null {
  // Format: "+1989-12-13T00:00:00Z" or "-0044-..."
  const m = s.match(/^[+-](\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const yr = parseInt(m[1], 10), mo = parseInt(m[2], 10), dy = parseInt(m[3], 10);
  if (yr < 1 || mo < 1 || dy < 1) return null;
  return new Date(yr, mo - 1, dy);
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

function calcAge(birth: Date) {
  const now      = new Date();
  const totalMs  = now.getTime() - birth.getTime();
  const totalDays = Math.floor(totalMs / 86400000);
  let years  = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth()    - birth.getMonth();
  let days   = now.getDate()     - birth.getDate();
  if (days < 0)   { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  return { years, months, days, totalDays, totalMonths:years*12+months, totalWeeks:Math.floor(totalDays/7), totalHours:totalDays*24 };
}

function getNextBirthday(birth: Date): Date {
  const now = new Date(); now.setHours(0,0,0,0);
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
  return [1933,1945,1953,1961,1963,1969,1974,1977,1981,1989,1993,2001,2009,2017,2021,2025]
    .filter(y => y >= birthYear).length;
}

function commas(n: number) { return n.toLocaleString(); }

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, ms = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

/** Fast Wikidata search — returns results in ~1s */
async function searchCelebs(term: string): Promise<QuickResult[]> {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}&language=en&type=item&format=json&origin=*&limit=8`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error("search API error");
  const json = await res.json();
  return ((json.search ?? []) as { id:string; label:string; description?:string }[]).map(r => ({
    id:          r.id,
    name:        r.label,
    description: r.description ?? "",
  }));
}

/** Get birth date for a specific Wikidata entity */
async function fetchBirthDate(entityId: string): Promise<Date | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error("entity API error");
  const json = await res.json();
  const entity = json.entities?.[entityId];
  const timeStr = entity?.claims?.P569?.[0]?.mainsnak?.datavalue?.value?.time as string | undefined;
  return timeStr ? parseWikidataTime(timeStr) : null;
}

/** SPARQL for same-birthday celebrities — non-blocking, slower */
async function fetchSameBirthday(month: number, day: number, excludeName: string): Promise<SameBdayPerson[]> {
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
    ORDER BY ?birthYear LIMIT 10
  `;
  const res = await fetchWithTimeout(
    `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
    15000
  );
  if (!res.ok) throw new Error("sparql error");
  const json = await res.json();
  type B = { personLabel:{value:string}; description?:{value:string}; birthYear?:{value:string} };
  const seen = new Set<string>();
  return (json.results.bindings as B[])
    .filter(b => b.personLabel?.value && !b.personLabel.value.startsWith("Q") && b.personLabel.value !== excludeName)
    .map(b => ({ name:b.personLabel.value, description:b.description?.value??"", birthYear:parseInt(b.birthYear?.value??"0",10) }))
    .filter(r => { if (seen.has(r.name)) return false; seen.add(r.name); return true; })
    .slice(0, 6);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CelebrityAgeTool() {
  const [query,          setQuery]          = useState("");
  const [isSearching,    setIsSearching]    = useState(false);
  const [isLoadingBirth, setIsLoadingBirth] = useState(false);
  const [quickResults,   setQuickResults]   = useState<QuickResult[]>([]);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [celebrity,      setCelebrity]      = useState<Celebrity | null>(null);
  const [timeLeft,       setTimeLeft]       = useState<TimeLeft>({ days:0, h:0, m:0, s:0 });
  const [sameBday,       setSameBday]       = useState<SameBdayPerson[]>([]);
  const [loadingSameBday,setLoadingSameBday]= useState(false);
  const [error,          setError]          = useState("");
  const [retryTerm,      setRetryTerm]      = useState("");
  const [myDob,          setMyDob]          = useState("");
  const [showCompare,    setShowCompare]    = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentCelebrity[]>([]);

  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const skipSearchRef = useRef(false); // prevent debounce when query set programmatically

  // Load recents
  useEffect(() => {
    try { const s=localStorage.getItem("ca_recent2"); if(s) setRecentSearches(JSON.parse(s)); } catch { /* ignore */ }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Live countdown
  useEffect(() => {
    if (!celebrity) return;
    const next = getNextBirthday(celebrity.birthDate);
    setTimeLeft(calcTimeLeft(next));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(next)), 1000);
    return () => clearInterval(id);
  }, [celebrity]);

  // Debounced search → fast wbsearchentities
  useEffect(() => {
    if (skipSearchRef.current) { skipSearchRef.current = false; return; }
    if (query.length < 3) { setQuickResults([]); setShowDropdown(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true); setError("");
      try {
        const results = await searchCelebs(query);
        setQuickResults(results);
        setShowDropdown(results.length > 0);
        if (results.length === 0) setError(`No results for "${query}". Try a different spelling.`);
      } catch {
        setError("Search is taking longer than usual. Please try again.");
        setRetryTerm(query);
        setShowDropdown(false);
      }
      setIsSearching(false);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // ── Load celebrity from hardcoded or API ─────────────────────────────────────

  const showCeleb = (name: string, description: string, birth: Date) => {
    setCelebrity({ name, description, birthDate: birth });
    setShowDropdown(false);
    setQuickResults([]);
    setError("");
    setSameBday([]);

    const rec: RecentCelebrity = { name, description, birthDate: `${birth.getFullYear()}-${String(birth.getMonth()+1).padStart(2,"0")}-${String(birth.getDate()).padStart(2,"0")}` };
    setRecentSearches(prev => {
      const next = [rec, ...prev.filter(r => r.name !== name)].slice(0, 5);
      try { localStorage.setItem("ca_recent2", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });

    // Async same-birthday (non-blocking)
    setLoadingSameBday(true);
    fetchSameBirthday(birth.getMonth()+1, birth.getDate(), name)
      .then(same => setSameBday(same))
      .catch(() => { /* silently ignore */ })
      .finally(() => setLoadingSameBday(false));
  };

  const selectQuickResult = async (r: QuickResult) => {
    setQuery(r.name);
    setShowDropdown(false);
    setIsLoadingBirth(true);
    setError("");
    try {
      const birth = await fetchBirthDate(r.id);
      if (!birth) { setError(`Could not find birth date for ${r.name}.`); }
      else         { showCeleb(r.name, r.description, birth); }
    } catch {
      setError("Search is taking longer than usual. Please try again.");
      setRetryTerm(r.name);
    }
    setIsLoadingBirth(false);
  };

  const handlePopularPill = (data: typeof POPULAR_DATA[0]) => {
    const birth = parseSimpleDate(data.birthDate);
    if (!birth) return;
    skipSearchRef.current = true; // don't trigger debounce
    setQuery(data.name);
    setQuickResults([]);
    setShowDropdown(false);
    showCeleb(data.name, data.description, birth);
  };

  const handleRecentPill = (r: RecentCelebrity) => {
    const birth = parseSimpleDate(r.birthDate);
    if (!birth) return;
    skipSearchRef.current = true;
    setQuery(r.name);
    setQuickResults([]);
    setShowDropdown(false);
    showCeleb(r.name, r.description, birth);
  };

  const handleRetry = async () => {
    setError(""); setIsSearching(true);
    try {
      const results = await searchCelebs(retryTerm);
      setQuickResults(results);
      setShowDropdown(results.length > 0);
    } catch {
      setError("Still having trouble. Please check your connection.");
    }
    setIsSearching(false);
  };

  const handleSearchButton = async () => {
    if (query.length < 2) return;
    setIsSearching(true); setError(""); setShowDropdown(false);
    try {
      const results = await searchCelebs(query);
      if (results.length > 0) await selectQuickResult(results[0]);
      else setError(`No results for "${query}".`);
    } catch {
      setError("Search is taking longer than usual. Please try again.");
      setRetryTerm(query);
    }
    setIsSearching(false);
  };

  // ── Derived data ──────────────────────────────────────────────────────────────

  const age        = celebrity ? calcAge(celebrity.birthDate) : null;
  const nextBday   = celebrity ? getNextBirthday(celebrity.birthDate) : null;
  const turningAge = celebrity && nextBday ? nextBday.getFullYear() - celebrity.birthDate.getFullYear() : null;
  const sign       = celebrity ? getStarSign(celebrity.birthDate.getMonth()+1, celebrity.birthDate.getDate()) : null;
  const presidents = celebrity ? countPresidents(celebrity.birthDate.getFullYear()) : null;
  const myBirth    = myDob ? parseSimpleDate(myDob) : null;
  const myAge      = myBirth ? calcAge(myBirth) : null;
  const ageDiff    = (age && myAge) ? Math.abs(age.years - myAge.years) : null;
  const celebOlder = (celebrity && myBirth) ? celebrity.birthDate < myBirth : null;
  const shareTextPlain = celebrity && age
    ? `${celebrity.name} is ${age.years} years old! Calculate any celebrity age at dayblip.com/celebrity-age`
    : "Free celebrity age calculator — find out how old any famous person is! dayblip.com/celebrity-age";

  const isWorking = isSearching || isLoadingBirth;

  // ── Render ────────────────────────────────────────────────────────────────────

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

          {/* Search input + dropdown */}
          <div ref={wrapperRef} className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setCelebrity(null); }}
                onFocus={() => quickResults.length > 0 && setShowDropdown(true)}
                onKeyDown={e => e.key === "Enter" && handleSearchButton()}
                placeholder="Type a celebrity name... e.g. Taylor Swift, Elon Musk"
                className="flex-1 rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
              />
              <button
                onClick={handleSearchButton}
                disabled={query.length < 2 || isWorking}
                className="whitespace-nowrap rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isSearching ? "Searching…" : isLoadingBirth ? "Loading…" : "Search →"}
              </button>
            </div>

            {/* Loading indicator */}
            {isSearching && query.length >= 3 && (
              <p className="mt-1 text-xs text-[#a8a8b3]">Searching for {query}...</p>
            )}
            {isLoadingBirth && (
              <p className="mt-1 text-xs text-[#a8a8b3]">Loading birthday data...</p>
            )}

            {/* Dropdown */}
            {showDropdown && quickResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-[#0f3460] bg-[#1a1a2e] shadow-xl overflow-hidden">
                {quickResults.map((r, i) => (
                  <button key={i} onClick={() => selectQuickResult(r)}
                    className="w-full px-4 py-3 text-left hover:bg-[#16213e] border-b border-[#0f3460] last:border-0 transition-colors">
                    <p className="font-semibold text-white">{r.name}</p>
                    {r.description && <p className="text-xs text-[#a8a8b3]">{r.description}</p>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error + retry */}
          {error && !celebrity && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-[#e94560] flex-1">{error}</p>
              {retryTerm && (
                <button onClick={handleRetry} className="shrink-0 rounded-lg border border-[#e94560] px-3 py-1.5 text-xs font-semibold text-[#e94560] hover:bg-[#e94560]/10 transition-colors">
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Popular searches — instant hardcoded */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-[#a8a8b3]">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DATA.map(p => (
                <button key={p.name} onClick={() => handlePopularPill(p)}
                  className="rounded-full border border-[#0f3460] bg-[#1a1a2e] px-3 py-1.5 text-sm text-[#a8a8b3] transition-colors hover:border-[#e94560] hover:text-white">
                  {p.name}
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
                  <button key={r.name} onClick={() => handleRecentPill(r)}
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

            {/* Name + badges */}
            <div className="rounded-xl border border-[#e94560]/30 bg-[#16213e] p-6">
              <h2 className="text-3xl font-black text-white">{celebrity.name}</h2>
              {celebrity.description && <p className="text-[#a8a8b3] mt-1 capitalize">{celebrity.description}</p>}
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-[#e94560]/10 border border-[#e94560]/30 px-3 py-1 text-[#e94560]">{sign}</span>
                <span className="rounded-full bg-[#0f3460] px-3 py-1 text-[#a8a8b3]">Born {fmtDate(celebrity.birthDate)}</span>
                <span className="rounded-full bg-[#0f3460] px-3 py-1 text-[#a8a8b3]">Born on a {DAYS[celebrity.birthDate.getDay()]}</span>
              </div>
            </div>

            {/* Age breakdown */}
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
                  <p className="mt-1">Birthday falls on a <strong className="text-white">{DAYS[nextBday.getDay()]}</strong> this year</p>
                </div>
              )}
            </div>

            {/* Fun comparisons */}
            <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
              <h3 className="mb-4 font-bold text-white">🔢 Fun Comparisons</h3>
              <div className="space-y-3">
                <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3] text-sm">Born <strong className="text-white">{Math.abs(celebrity.birthDate.getFullYear()-2007)} years</strong> {celebrity.birthDate.getFullYear()<2007?"before":"after"} the first iPhone (2007)</span>
                </div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3] text-sm">Born <strong className="text-white">{Math.abs(celebrity.birthDate.getFullYear()-1991)} years</strong> {celebrity.birthDate.getFullYear()<1991?"before":"after"} the public internet (1991)</span>
                </div>
                <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                  <span className="text-[#a8a8b3] text-sm">Lived through approximately <strong className="text-white">{presidents}</strong> US presidential terms</span>
                </div>
                {ageDiff !== null && celebOlder !== null && (
                  <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                    <span className="text-[#a8a8b3] text-sm">{celebrity.name} is <strong className="text-white">{ageDiff} years {celebOlder?"older":"younger"}</strong> than you</span>
                  </div>
                )}
                {myAge && celebrity && (
                  <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                    <span className="text-[#a8a8b3] text-sm">When {celebrity.name} was your age ({myAge.years}), it was <strong className="text-white">{celebrity.birthDate.getFullYear()+myAge.years}</strong></span>
                  </div>
                )}
                {myBirth && age && (
                  <div className="flex gap-2"><span className="text-[#e94560]">→</span>
                    <span className="text-[#a8a8b3] text-sm">When you reach {celebrity.name}&apos;s age ({age.years}), it will be <strong className="text-white">{myBirth.getFullYear()+age.years}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Share */}
            <ShareButtons
              text={shareTextPlain}
              url="https://dayblip.com/celebrity-age"
              title="Celebrity Age Calculator"
            />

            {/* Same birthday */}
            <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-6">
              <h3 className="mb-4 font-bold text-white">
                🎂 Other Celebrities Born on {MONTHS[celebrity.birthDate.getMonth()]} {celebrity.birthDate.getDate()}:
              </h3>
              {loadingSameBday && <p className="text-[#a8a8b3] text-sm animate-pulse">Loading birthday twins…</p>}
              {!loadingSameBday && sameBday.length === 0 && <p className="text-[#a8a8b3] text-sm">No additional results found.</p>}
              {sameBday.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {sameBday.map((p, i) => (
                    <div key={i} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4">
                      <p className="font-semibold text-white text-sm">{p.name}</p>
                      {p.description && <p className="text-xs text-[#a8a8b3] mt-1">{p.description}</p>}
                      {p.birthYear > 0 && <p className="text-xs text-[#e94560] mt-1">Born {p.birthYear}</p>}
                    </div>
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
