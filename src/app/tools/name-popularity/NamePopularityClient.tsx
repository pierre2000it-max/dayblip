"use client";

import { useState, useRef } from "react";
import ShareButtons from "@/components/ShareButtons";
import RelatedTools from "@/components/RelatedTools";

// ── Types ─────────────────────────────────────────────────────────────────────

type GenderKey = "F" | "M";
type YearMap   = Record<string, number>;
type NameData  = Partial<Record<GenderKey, YearMap>>;
type NamesDB   = Record<string, NameData>;

interface NameStats {
  name:        string;
  gender:      GenderKey;
  totalCount:  number;
  peakYear:    string;
  peakCount:   number;
  peakRank:    number;
  oneInX:      number;
  trend:       "Rising" | "Falling" | "Stable";
  decades:     Record<string, number>;
  years:       YearMap;
}

// ── Births by year (interpolated from CDC/NCHS data) ──────────────────────────

const BIRTHS_BY_YEAR: Record<string, number> = {
  "1880":800000,"1881":800000,"1882":820000,"1883":820000,"1884":840000,
  "1885":840000,"1886":860000,"1887":860000,"1888":880000,"1889":880000,
  "1890":900000,"1891":910000,"1892":920000,"1893":930000,"1894":940000,
  "1895":950000,"1896":960000,"1897":970000,"1898":980000,"1899":990000,
  "1900":1000000,"1901":1050000,"1902":1100000,"1903":1150000,"1904":1200000,
  "1905":1250000,"1906":1300000,"1907":1350000,"1908":1400000,"1909":1450000,
  "1910":1500000,"1911":1600000,"1912":1700000,"1913":1800000,"1914":1900000,
  "1915":2000000,"1916":2100000,"1917":2200000,"1918":2300000,"1919":2400000,
  "1920":2950000,"1921":3000000,"1922":2980000,"1923":2960000,"1924":2970000,
  "1925":2909000,"1926":2839000,"1927":2802000,"1928":2674000,"1929":2582000,
  "1930":2618000,"1931":2506000,"1932":2440000,"1933":2307000,"1934":2396000,
  "1935":2377000,"1936":2355000,"1937":2413000,"1938":2496000,"1939":2466000,
  "1940":2559000,"1941":2703000,"1942":2989000,"1943":3104000,"1944":2939000,
  "1945":2858000,"1946":3411000,"1947":3817000,"1948":3637000,"1949":3649000,
  "1950":3632000,"1951":3820000,"1952":3909000,"1953":3965000,"1954":4078000,
  "1955":4097000,"1956":4218000,"1957":4308000,"1958":4255000,"1959":4295000,
  "1960":4257850,"1961":4268326,"1962":4167362,"1963":4098020,"1964":4027490,
  "1965":3760000,"1966":3606000,"1967":3521000,"1968":3501564,"1969":3600206,
  "1970":3731386,"1971":3555970,"1972":3258411,"1973":3136965,"1974":3159958,
  "1975":3144198,"1976":3167788,"1977":3326632,"1978":3333279,"1979":3494398,
  "1980":3612258,"1981":3629238,"1982":3680537,"1983":3638933,"1984":3669141,
  "1985":3760561,"1986":3756547,"1987":3809394,"1988":3909510,"1989":4040958,
  "1990":4158212,"1991":4110907,"1992":4065014,"1993":4000240,"1994":3952767,
  "1995":3899589,"1996":3891494,"1997":3880894,"1998":3941553,"1999":3959417,
  "2000":4058814,"2001":4025933,"2002":4021726,"2003":4089950,"2004":4112052,
  "2005":4138349,"2006":4265555,"2007":4316233,"2008":4247694,"2009":4130665,
  "2010":3999386,"2011":3953590,"2012":3952841,"2013":3932181,"2014":3988076,
  "2015":3978497,"2016":3945875,"2017":3855500,"2018":3791712,"2019":3745540,
  "2020":3613647,"2021":3659289,"2022":3667758,"2023":3596017,
};

function getBirthsForYear(year: string): number {
  if (BIRTHS_BY_YEAR[year]) return BIRTHS_BY_YEAR[year];
  // Interpolate between nearest known years
  const ys = Object.keys(BIRTHS_BY_YEAR).map(Number).sort((a, b) => a - b);
  const y  = parseInt(year, 10);
  const lo = ys.filter(n => n <= y).pop();
  const hi = ys.find(n => n > y);
  if (!lo) return BIRTHS_BY_YEAR[String(hi ?? ys[0])];
  if (!hi) return BIRTHS_BY_YEAR[String(lo)];
  const t = (y - lo) / (hi - lo);
  return Math.round(BIRTHS_BY_YEAR[String(lo)] * (1 - t) + BIRTHS_BY_YEAR[String(hi)] * t);
}

// ── Calculations ──────────────────────────────────────────────────────────────

function computeStats(name: string, gender: GenderKey, db: NamesDB): NameStats | null {
  const entry = db[name];
  if (!entry) return null;
  const years: YearMap = entry[gender] ?? {};
  if (Object.keys(years).length === 0) return null;

  // Total
  const totalCount = Object.values(years).reduce((s, c) => s + c, 0);

  // Peak year
  let peakYear  = "";
  let peakCount = 0;
  for (const [yr, cnt] of Object.entries(years)) {
    if (cnt > peakCount) { peakCount = cnt; peakYear = yr; }
  }

  // 1-in-X at peak year
  const births = getBirthsForYear(peakYear);
  const oneInX = peakCount > 0 ? Math.round(births / peakCount) : 0;

  // Rank at peak year — count names with higher count in that year for same gender
  let peakRank = 1;
  for (const [, nameData] of Object.entries(db)) {
    const cnt = nameData[gender]?.[peakYear] ?? 0;
    if (cnt > peakCount) peakRank++;
  }

  // Trend: avg of last 5 years vs avg of prior 10 years
  const sortedYears = Object.keys(years).map(Number).sort((a, b) => a - b);
  const maxY = sortedYears[sortedYears.length - 1];
  const last5  = sortedYears.filter(y => y >= maxY - 4);
  const prior10 = sortedYears.filter(y => y >= maxY - 14 && y < maxY - 4);
  const avg5  = last5.length  ? last5.reduce( (s, y) => s + (years[String(y)] ?? 0), 0) / last5.length  : 0;
  const avg10 = prior10.length ? prior10.reduce((s, y) => s + (years[String(y)] ?? 0), 0) / prior10.length : avg5;
  let trend: "Rising" | "Falling" | "Stable" = "Stable";
  if (avg10 > 0) {
    const pct = (avg5 - avg10) / avg10;
    if (pct > 0.1) trend = "Rising";
    else if (pct < -0.1) trend = "Falling";
  }

  // Decades
  const decades: Record<string, number> = {};
  for (const [yr, cnt] of Object.entries(years)) {
    const decade = Math.floor(parseInt(yr, 10) / 10) * 10;
    decades[String(decade)] = (decades[String(decade)] ?? 0) + cnt;
  }

  return { name, gender, totalCount, peakYear, peakCount, peakRank, oneInX, trend, decades, years };
}

// ── Formatters ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const TREND_META: Record<string, { emoji: string; color: string; label: string }> = {
  Rising:  { emoji: "📈", color: "#4ade80", label: "Rising — more popular recently" },
  Falling: { emoji: "📉", color: "#f87171", label: "Falling — less popular recently" },
  Stable:  { emoji: "➡️",  color: "#a8a8b3", label: "Stable — consistent over time"  },
};

const DECADE_COLORS = [
  "#e94560","#f97316","#eab308","#22c55e","#06b6d4","#6366f1","#a855f7","#ec4899",
  "#64748b","#84cc16","#14b8a6","#f43f5e","#8b5cf6","#0ea5e9",
];

// ── Share card ────────────────────────────────────────────────────────────────

function NameShareCard({ stats }: { stats: NameStats }) {
  const displayName = stats.name.charAt(0).toUpperCase() + stats.name.slice(1).toLowerCase();
  const gLabel      = stats.gender === "F" ? "female" : "male";

  return (
    <div
      style={{
        background: "#1a1a2e",
        border: "1px solid #e94560",
        borderRadius: "12px",
        padding: "28px 32px",
        maxWidth: "560px",
        fontFamily: "Arial, Helvetica, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: "#e94560" }} />
      <div style={{ fontSize: "13px", color: "#a8a8b3", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        📛 Name Popularity
      </div>
      <div style={{ fontSize: "40px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1, marginBottom: "4px" }}>
        {displayName}
      </div>
      <div style={{ fontSize: "14px", color: "#a8a8b3", marginBottom: "20px" }}>
        {gLabel} · US data 1880–2023
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {[
          { label: "Total registered", value: fmt(stats.totalCount) },
          { label: "Peak year",        value: stats.peakYear },
          { label: "At peak",          value: "#" + fmt(stats.peakRank) + " most popular" },
          { label: "Rarity at peak",   value: "1 in " + fmt(stats.oneInX) },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "#16213e", padding: "12px 14px", borderRadius: "8px", borderLeft: "3px solid #e94560" }}>
            <div style={{ fontSize: "11px", color: "#a8a8b3", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "12px", color: "#a8a8b3", textAlign: "right", marginTop: "16px" }}>dayblip.com</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "#e94560" }} />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NamePopularityClient() {
  const [nameInput,  setNameInput]  = useState("");
  const [gender,     setGender]     = useState<GenderKey>("F");
  const [loading,    setLoading]    = useState(false);
  const [dbLoading,  setDbLoading]  = useState(false);
  const [stats,      setStats]      = useState<NameStats | null>(null);
  const [notFound,   setNotFound]   = useState(false);
  const [error,      setError]      = useState("");

  const dbRef = useRef<NamesDB | null>(null);

  const handleSearch = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) { setError("Please enter a name."); return; }
    setError("");
    setNotFound(false);
    setStats(null);

    // Load DB once
    if (!dbRef.current) {
      setDbLoading(true);
      try {
        const res = await fetch("/data/names.json");
        if (!res.ok) throw new Error("names.json not found — run node scripts/process-names.js first");
        dbRef.current = await res.json() as NamesDB;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load name data.");
        setDbLoading(false);
        return;
      }
      setDbLoading(false);
    }

    setLoading(true);
    // Normalise to Title Case to match SSA format
    const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    const result = computeStats(normalized, gender, dbRef.current!);
    setLoading(false);

    if (!result) { setNotFound(true); return; }
    setStats(result);
  };

  const displayName = nameInput.trim()
    ? nameInput.trim().charAt(0).toUpperCase() + nameInput.trim().slice(1).toLowerCase()
    : "";
  const shareText   = stats
    ? `The name ${displayName} has been given to ${fmt(stats.totalCount)} ${stats.gender === "F" ? "girls" : "boys"} in the US since 1880! Its peak was ${stats.peakYear}. Find out about your name:`
    : "";

  return (
    <div className="bg-[#16213e]">
      {/* Input */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 md:p-8">
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">First name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="e.g. Emma"
                  className="w-full rounded-lg border border-[#0f3460] bg-[#16213e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white">Registered as</label>
                <div className="flex gap-2">
                  {(["F", "M"] as GenderKey[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className="flex-1 rounded-lg border px-4 py-3 font-semibold transition-colors"
                      style={{
                        background:   gender === g ? "#e94560" : "#16213e",
                        borderColor:  gender === g ? "#e94560" : "#0f3460",
                        color:        "#ffffff",
                      }}
                    >
                      {g === "F" ? "Female" : "Male"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || dbLoading}
              className="w-full rounded-lg bg-[#e94560] py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {dbLoading ? "Loading name database…" : loading ? "Searching…" : "Look Up Name →"}
            </button>
            {error && <p className="mt-3 text-sm text-[#e94560]">{error}</p>}
          </div>

          {/* Not found */}
          {notFound && (
            <div className="mt-8 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
              <p className="text-2xl mb-3">🤷</p>
              <p className="text-white font-semibold mb-2">
                &ldquo;{displayName}&rdquo; not found as a {gender === "F" ? "female" : "male"} name in SSA records.
              </p>
              <p className="text-[#a8a8b3] text-sm">
                This could mean the name is very rare (&lt;5 babies/year), spelled differently, or not in US records.
                Try the other gender or a different spelling.
              </p>
            </div>
          )}

          {/* Results */}
          {stats && (
            <div className="mt-8 space-y-6">

              {/* Quick Answer */}
              <div className="rounded-xl border border-[#e94560]/40 bg-[#1a1a2e] p-6 text-center">
                <p className="text-[#a8a8b3] text-sm mb-2">📛 Name popularity result</p>
                <h2 className="text-4xl font-black text-white mb-1">{displayName}</h2>
                <p className="text-[#a8a8b3] text-sm mb-5">
                  {stats.gender === "F" ? "Female" : "Male"} · US SSA records 1880–2023
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total registered", value: fmt(stats.totalCount), sub: "since 1880" },
                    { label: "Peak year",         value: stats.peakYear,       sub: `${fmt(stats.peakCount)} babies` },
                    { label: "Peak rank",         value: "#" + fmt(stats.peakRank), sub: "most popular" },
                    { label: "Rarity at peak",    value: "1 in " + fmt(stats.oneInX), sub: "births that year" },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="rounded-lg border border-[#0f3460] bg-[#16213e] p-3">
                      <div className="text-xs text-[#a8a8b3] mb-1 uppercase tracking-wide">{label}</div>
                      <div className="text-xl font-black text-[#e94560]">{value}</div>
                      <div className="text-xs text-[#a8a8b3] mt-0.5">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share card */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Your Name Card</h3>
                <NameShareCard stats={stats} />
              </div>

              {/* Share buttons */}
              <ShareButtons
                text={shareText}
                url={`https://www.dayblip.com/tools/name-popularity`}
                title={`Name Popularity — ${displayName}`}
              />

              {/* Stats detail */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 space-y-4">
                <h3 className="font-bold text-white text-lg">Name Details</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <span className="text-[#e94560] mt-0.5">→</span>
                    <span className="text-[#a8a8b3] text-sm">
                      A total of <strong className="text-white">{fmt(stats.totalCount)}</strong> {stats.gender === "F" ? "girls" : "boys"} have been
                      named {displayName} in the US since 1880.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#e94560] mt-0.5">→</span>
                    <span className="text-[#a8a8b3] text-sm">
                      Peak popularity was in <strong className="text-white">{stats.peakYear}</strong> with{" "}
                      <strong className="text-white">{fmt(stats.peakCount)}</strong> babies named {displayName} that year.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#e94560] mt-0.5">→</span>
                    <span className="text-[#a8a8b3] text-sm">
                      In {stats.peakYear}, {displayName} was the{" "}
                      <strong className="text-white">#{fmt(stats.peakRank)} most popular</strong>{" "}
                      {stats.gender === "F" ? "girl" : "boy"}&apos;s name.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#e94560] mt-0.5">→</span>
                    <span className="text-[#a8a8b3] text-sm">
                      At peak, roughly <strong className="text-white">1 in {fmt(stats.oneInX)}</strong> babies born
                      that year received this name.
                    </span>
                  </div>
                </div>

                {/* Trend */}
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#0f3460] bg-[#16213e] p-4">
                  <span className="text-2xl">{TREND_META[stats.trend].emoji}</span>
                  <div>
                    <div className="font-semibold" style={{ color: TREND_META[stats.trend].color }}>
                      {stats.trend}
                    </div>
                    <div className="text-sm text-[#a8a8b3]">{TREND_META[stats.trend].label}</div>
                  </div>
                </div>
              </div>

              {/* Decade badges */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6">
                <h3 className="font-bold text-white text-lg mb-4">Decade-by-Decade Popularity</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.decades)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([decade, count], i) => {
                      const peakDecadeCount = Math.max(...Object.values(stats.decades));
                      const intensity       = count / peakDecadeCount;
                      const color           = DECADE_COLORS[i % DECADE_COLORS.length];
                      return (
                        <div
                          key={decade}
                          title={`${decade}s — ${fmt(count)} babies`}
                          style={{
                            background:   color + Math.round(intensity * 0.8 * 255).toString(16).padStart(2, "0"),
                            border:       `1px solid ${color}`,
                            borderRadius: "8px",
                            padding:      "8px 14px",
                            cursor:       "default",
                          }}
                        >
                          <div className="text-xs font-bold text-white">{decade}s</div>
                          <div className="text-xs text-white/80">{fmt(count)}</div>
                        </div>
                      );
                    })}
                </div>
                <p className="mt-3 text-xs text-[#a8a8b3]">
                  Brighter = more popular in that decade. Hover for exact count.
                </p>
              </div>

              {/* Explore Your Story cluster */}
              <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "24px" }}>
                <p style={{ color: "#a8a8b3", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px 0" }}>
                  Explore Your Story
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <a href="/born-in"              style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🌍 Born In Your Year</a>
                  <a href="/tools/life-in-weeks"  style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>📅 Life in Weeks</a>
                  <a href="/tools/generation-quiz" style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🧬 What Generation Am I?</a>
                  <a href="/number-one-song"       style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🎵 #1 Song on Your Birthday</a>
                  <a href="/birthday-twins"        style={{ color: "#e94560", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>🎂 Celebrity Birthday Twins</a>
                </div>
              </div>

              {/* Related tools */}
              <RelatedTools
                title="More Personal Tools"
                tools={[
                  { emoji: "🌍", title: "Born In Your Year",       desc: "Facts and history from the year you were born",   href: "/born-in" },
                  { emoji: "📅", title: "Life in Weeks",           desc: "See your entire life as a grid of weeks",         href: "/tools/life-in-weeks" },
                  { emoji: "🧬", title: "What Generation Am I?",   desc: "Discover your true generational identity",        href: "/tools/generation-quiz" },
                  { emoji: "🎵", title: "#1 Song on Your Birthday", desc: "The hit song from the week you were born",       href: "/number-one-song" },
                ]}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
