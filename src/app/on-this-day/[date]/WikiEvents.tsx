// Pure display component — data is fetched server-side in page.tsx and passed as props.
// No fetch, no Suspense, no loading state.

interface WikiEvent {
  year: string;
  text: string;
}

interface WikiPerson {
  year: string;
  name: string;
  description: string;
}

interface FallbackEvent    { year: number; event: string }
interface FallbackBirthday { name: string; year: number; role: string }

export interface FallbackData { events: FallbackEvent[]; birthdays: FallbackBirthday[] }

export interface WikiData {
  events: WikiEvent[];
  births: WikiPerson[];
  deaths: WikiPerson[];
  fetchFailed: boolean;
}

interface Props {
  wikiData: WikiData;
  formattedDate: string;
  monthDay: string;
  fallback: FallbackData | null;
}

export default function WikiEvents({ wikiData, formattedDate, monthDay, fallback }: Props) {
  const { events, births, deaths, fetchFailed } = wikiData;

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
