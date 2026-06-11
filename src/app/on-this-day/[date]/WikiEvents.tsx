import { Suspense } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WikiEvent {
  year: string;
  text: string;
}

interface WikiPerson {
  year: string;
  name: string;
  description: string;
}

interface FallbackEvent  { year: number; event: string }
interface FallbackBirthday { name: string; year: number; role: string }
interface FallbackData   { events: FallbackEvent[]; birthdays: FallbackBirthday[] }

interface Props {
  month: number;
  day: number;
  formattedDate: string;
  monthDay: string;
  fallback: FallbackData | null;
}

// ── Wikipedia API types ───────────────────────────────────────────────────────

interface WikiApiPage { titles?: { normalized?: string }; description?: string }
interface WikiApiEntry { year: number; text: string; pages?: WikiApiPage[] }

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractDescription(pages?: WikiApiPage[]): string {
  return pages?.[0]?.description ?? "";
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

async function fetchWikipedia(month: number, day: number): Promise<{ events: WikiEvent[]; births: WikiPerson[]; deaths: WikiPerson[] }> {
  const mm = pad2(month);
  const dd = pad2(day);
  const res = await fetch(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`,
    {
      headers: { "Api-User-Agent": "Dayblip/1.0 (dayblip.com)" },
      next: { revalidate: 86400 },
    }
  );
  if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
  const data = await res.json();

  const events: WikiEvent[] = (data.events ?? []).slice(0, 10).map((e: WikiApiEntry) => ({
    year: String(e.year),
    text: e.text,
  }));

  const births: WikiPerson[] = (data.births ?? []).slice(0, 8).map((e: WikiApiEntry) => ({
    year: String(e.year),
    name: e.pages?.[0]?.titles?.normalized ?? e.text.split(",")[0],
    description: extractDescription(e.pages) || e.text,
  }));

  const deaths: WikiPerson[] = (data.deaths ?? []).slice(0, 5).map((e: WikiApiEntry) => ({
    year: String(e.year),
    name: e.pages?.[0]?.titles?.normalized ?? e.text.split(",")[0],
    description: extractDescription(e.pages) || e.text,
  }));

  return { events, births, deaths };
}

async function fetchBackup(month: number, day: number): Promise<{ events: WikiEvent[]; births: WikiPerson[]; deaths: WikiPerson[] }> {
  const res = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Backup API ${res.status}`);
  const data = await res.json();

  const mapEntry = (e: { year: string; text: string }): WikiEvent => ({
    year: e.year,
    text: e.text,
  });

  const mapPerson = (e: { year: string; text: string }): WikiPerson => {
    const parts = e.text.split(",");
    return {
      year: e.year,
      name: parts[0]?.trim() ?? e.text,
      description: parts.slice(1).join(",").trim() || e.text,
    };
  };

  return {
    events: (data.data?.Events ?? []).slice(0, 10).map(mapEntry),
    births: (data.data?.Births ?? []).slice(0, 8).map(mapPerson),
    deaths: (data.data?.Deaths ?? []).slice(0, 5).map(mapPerson),
  };
}

// ── Server component (actual fetch + render) ──────────────────────────────────

async function WikiEventsContent({ month, day, formattedDate, monthDay, fallback }: Props) {
  let events: WikiEvent[] = [];
  let births: WikiPerson[] = [];
  let deaths: WikiPerson[] = [];
  let fetchFailed = false;

  try {
    const result = await fetchWikipedia(month, day);
    events = result.events;
    births = result.births;
    deaths = result.deaths;
  } catch {
    try {
      const result = await fetchBackup(month, day);
      events = result.events;
      births = result.births;
      deaths = result.deaths;
    } catch {
      fetchFailed = true;
    }
  }

  // ── Fallback to hardcoded data ───────────────────────────────────────────
  if (fetchFailed && fallback) {
    return (
      <>
        <div className="bg-[#16213e] px-6 pt-8">
          <div className="mx-auto max-w-[900px]">
            <p className="rounded-lg border border-[#e94560]/20 bg-[#e94560]/5 px-4 py-2 text-sm text-[#a8a8b3]">
              Unable to load live events. Showing saved highlights.
            </p>
          </div>
        </div>

        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-10 text-2xl font-bold text-white">What Happened on {monthDay}?</h2>
            <FallbackTimeline events={fallback.events} />
          </div>
        </section>

        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">Famous Birthdays on {monthDay}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {fallback.birthdays.map((b) => (
                <div key={b.name} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-5">
                  <p className="mb-1 text-lg font-bold text-white">{b.name}</p>
                  <p className="mb-3 text-sm text-[#a8a8b3]">{b.role}</p>
                  <span className="text-sm font-semibold text-[#e94560]">Born {b.year}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // ── Error (no fallback) ──────────────────────────────────────────────────
  if (fetchFailed) {
    return (
      <section className="bg-[#16213e] px-6 py-16">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="mb-4 block text-5xl">📡</span>
          <h2 className="mb-3 text-xl font-bold text-white">Unable to load live events</h2>
          <p className="text-[#a8a8b3]">Please try again later.</p>
        </div>
      </section>
    );
  }

  // ── Live data ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-[#16213e] px-6 pt-8">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[14px] text-[#a8a8b3]">
            Events below are loaded live for {formattedDate}
          </p>
        </div>
      </div>

      {/* SECTION 1 — Historical Events */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px]">
          <h2 className="mb-10 text-2xl font-bold text-white">
            What Happened on {monthDay} in History
          </h2>
          <div className="relative">
            <div className="absolute bottom-0 left-[5.5rem] top-0 w-px bg-[#0f3460]" />
            {[...events]
              .sort((a, b) => Number(b.year) - Number(a.year))
              .map((ev, i) => (
                <div key={i} className="group relative mb-8 flex items-start gap-6">
                  <div className="w-20 shrink-0 pt-0.5 text-right">
                    <span className="text-lg font-bold text-[#e94560]">{ev.year}</span>
                  </div>
                  <div className="relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full bg-[#e94560] ring-4 ring-[#16213e]" />
                  <div className="flex-1 pt-0.5">
                    <p className="leading-relaxed text-[#e8e8e8]">{ev.text}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Born on This Day */}
      {births.length > 0 && (
        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">Born on This Day</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {births.map((p, i) => (
                <div key={i}
                  className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 transition-colors hover:border-l-4 hover:border-l-[#e94560]">
                  <p className="mb-1 text-lg font-bold text-white">{p.name}</p>
                  <p className="mb-3 line-clamp-2 text-sm text-[#a8a8b3]">{p.description}</p>
                  <span className="text-sm font-semibold text-[#e94560]">Born {p.year}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3 — Died on This Day */}
      {deaths.length > 0 && (
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">Died on This Day</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {deaths.map((p, i) => (
                <div key={i}
                  className="rounded-xl border border-[#0f3460] bg-[#1e2d4a] p-5 transition-colors hover:border-l-4 hover:border-l-[#e94560]">
                  <p className="mb-1 text-lg font-bold text-white">{p.name}</p>
                  <p className="mb-3 line-clamp-2 text-sm text-[#a8a8b3]">{p.description}</p>
                  <span className="text-sm font-semibold text-[#e94560]">{p.year}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingUI() {
  return (
    <section className="bg-[#16213e] px-6 py-20">
      <div className="mx-auto max-w-[900px] text-center">
        <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#0f3460] border-t-[#e94560]" />
        <p className="text-[#a8a8b3]">Loading historical events…</p>
      </div>
    </section>
  );
}

// ── Fallback timeline ─────────────────────────────────────────────────────────

function FallbackTimeline({ events }: { events: FallbackEvent[] }) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[5.5rem] top-0 w-px bg-[#0f3460]" />
      {[...events].sort((a, b) => a.year - b.year).map((ev) => (
        <div key={ev.year} className="relative mb-8 flex items-start gap-6">
          <div className="w-20 shrink-0 pt-0.5 text-right">
            <span className="text-lg font-bold text-[#e94560]">{ev.year}</span>
          </div>
          <div className="relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full bg-[#e94560] ring-4 ring-[#16213e]" />
          <p className="flex-1 pt-0.5 leading-relaxed text-white">{ev.event}</p>
        </div>
      ))}
    </div>
  );
}

// ── Public export (Suspense wrapper) ─────────────────────────────────────────

export default function WikiEvents(props: Props) {
  return (
    <Suspense fallback={<LoadingUI />}>
      <WikiEventsContent {...props} />
    </Suspense>
  );
}
