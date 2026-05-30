import type { Metadata } from "next";
import Link from "next/link";
import DateNav from "./DateNav";
import onThisDayRaw from "@/data/onThisDay.json";
import { generateOnThisDaySchema, generateBreadcrumbSchema } from "@/lib/seo";
import AdUnit from "@/components/AdUnit";

// ── Types ────────────────────────────────────────────────────────────────────

interface DayEvent  { year: number; event: string }
interface Birthday  { name: string; year: number; role: string }
interface DayData   { events: DayEvent[]; birthdays: Birthday[] }

const onThisDayData = onThisDayRaw as Record<string, DayData>;
const BASE = "https://dayblip.com";

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTH_SLUG    = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const MONTH_DISPLAY = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const POPULAR_DATES = [
  { slug: "january-1",   label: "January 1"   },
  { slug: "july-4",      label: "July 4"       },
  { slug: "october-31",  label: "October 31"   },
  { slug: "december-25", label: "December 25"  },
  { slug: "february-14", label: "February 14"  },
  { slug: "march-17",    label: "March 17"     },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function parseSlug(slug: string): { month: number; day: number } | null {
  for (let i = 0; i < MONTH_SLUG.length; i++) {
    const mn = MONTH_SLUG[i];
    if (slug.startsWith(mn + "-")) {
      const day = parseInt(slug.slice(mn.length + 1), 10);
      if (!isNaN(day) && day >= 1 && day <= 31) return { month: i + 1, day };
    }
  }
  return null;
}

function daysUntilDate(month: number, day: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let target = new Date(today.getFullYear(), month - 1, day);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() <= today.getTime()) target = new Date(today.getFullYear() + 1, month - 1, day);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function adjacentSlug(month: number, day: number, delta: 1 | -1): string {
  const d = new Date(2024, month - 1, day + delta);
  return `${MONTH_SLUG[d.getMonth()]}-${d.getDate()}`;
}

function slugLabel(slug: string): string {
  const p = parseSlug(slug);
  if (!p) return slug;
  return `${MONTH_DISPLAY[p.month - 1]} ${ordinal(p.day)}`;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { date: string };
}): Promise<Metadata> {
  const parsed = parseSlug(params.date);
  const label  = parsed ? `${MONTH_DISPLAY[parsed.month - 1]} ${ordinal(parsed.day)}` : params.date;
  const title  = `On This Day: ${label} — History, Events & Birthdays`;
  const desc   = `Discover what happened on ${label} in history. Famous birthdays, major events and historical facts.`;
  const url    = `/on-this-day/${params.date}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title, description: desc, type: "article", url,
      images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OnThisDayPage({
  params,
}: {
  params: { date: string };
}) {
  const parsed = parseSlug(params.date);

  if (!parsed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#1a1a2e] px-6 text-center">
        <span className="text-6xl">📅</span>
        <h1 className="text-3xl font-bold text-white">Invalid Date</h1>
        <p className="text-[#a8a8b3]">
          <code className="rounded bg-[#16213e] px-2 py-0.5 text-white">{params.date}</code>{" "}
          isn&apos;t a recognised date format.
        </p>
        <Link href="/" className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
          Go Home
        </Link>
      </div>
    );
  }

  const { month, day } = parsed;
  const formattedDate  = `${MONTH_DISPLAY[month - 1]} ${ordinal(day)}`;
  const monthDay       = `${MONTH_DISPLAY[month - 1]} ${day}`;
  const data           = onThisDayData[params.date] ?? null;
  const daysAway       = daysUntilDate(month, day);
  const currentYear    = new Date().getFullYear();
  const prevSlug       = adjacentSlug(month, day, -1);
  const nextSlug       = adjacentSlug(month, day, 1);
  const pageUrl        = `${BASE}/on-this-day/${params.date}`;
  const desc           = `Discover what happened on ${formattedDate} in history. Famous birthdays, major events and historical facts.`;

  // JSON-LD schemas
  const articleSchema    = generateOnThisDaySchema(formattedDate, desc);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home",        url: BASE },
    { name: "On This Day", url: `${BASE}/on-this-day` },
    { name: formattedDate, url: pageUrl },
  ]);

  // FAQ schema (only when data exists)
  const faqSchema = data && data.events.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What happened on ${formattedDate} in history?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.events.slice(0, 3).map(e => `${e.year}: ${e.event}`).join(" | "),
        },
      },
    ],
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="min-h-screen bg-[#1a1a2e]">

        {/* ── DATE NAV BAR ──────────────────────────────────────────── */}
        <DateNav currentMonth={month} currentDay={day} currentLabel={formattedDate} />

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="px-6 py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
          <div className="mx-auto max-w-[900px]">
            <div className="mb-6 inline-block rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-4 py-1.5 text-sm text-[#e94560]">
              {daysAway === 0
                ? `🎉 Today is ${formattedDate}!`
                : `Next ${formattedDate} in ${daysAway} day${daysAway === 1 ? "" : "s"}`}
            </div>
            <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
              On This Day: {formattedDate}
            </h1>
            <p className="text-lg text-[#a8a8b3]">A look back at history on this date</p>
          </div>
        </section>

        {data ? (
          <>
            {/* ── EVENTS ───────────────────────────────────────────── */}
            <section className="bg-[#16213e] px-6 py-14">
              <div className="mx-auto max-w-[900px]">
                <h2 className="mb-10 text-2xl font-bold text-white">
                  What Happened on {monthDay}?
                </h2>
                <div className="relative">
                  <div className="absolute bottom-0 left-[5.5rem] top-0 w-px bg-[#0f3460]" />
                  {[...data.events]
                    .sort((a, b) => a.year - b.year)
                    .map((ev) => (
                      <div key={ev.year} className="relative mb-8 flex items-start gap-6">
                        <div className="w-20 shrink-0 pt-0.5 text-right">
                          <span className="text-lg font-bold text-[#e94560]">{ev.year}</span>
                        </div>
                        <div className="relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full bg-[#e94560] ring-4 ring-[#16213e]" />
                        <p className="flex-1 pt-0.5 leading-relaxed text-white">{ev.event}</p>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            {/* Ad — between events and birthdays */}
            <div className="bg-[#16213e] px-6 pb-4">
              <div className="mx-auto max-w-[900px]">
                <AdUnit slot="1234567890" format="rectangle" />
              </div>
            </div>

            {/* ── BIRTHDAYS ────────────────────────────────────────── */}
            <section className="bg-[#1a1a2e] px-6 py-14">
              <div className="mx-auto max-w-[900px]">
                <h2 className="mb-8 text-2xl font-bold text-white">
                  Famous Birthdays on {monthDay}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {data.birthdays.map((b) => (
                    <div key={b.name} className="rounded-xl border border-[#0f3460] bg-[#16213e] p-5">
                      <p className="mb-1 text-lg font-bold text-white">{b.name}</p>
                      <p className="mb-3 text-sm text-[#a8a8b3]">{b.role}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#e94560]">Born {b.year}</span>
                        <span className="text-xs text-[#a8a8b3]">{currentYear - b.year} years ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="bg-[#16213e] px-6 py-16">
            <div className="mx-auto max-w-[900px] text-center">
              <span className="mb-4 block text-5xl">📜</span>
              <h2 className="mb-3 text-2xl font-bold text-white">Coming Soon</h2>
              <p className="mb-8 text-[#a8a8b3]">
                We are still adding history for{" "}
                <strong className="text-white">{formattedDate}</strong>. Check back soon!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {POPULAR_DATES.map((d) => (
                  <Link key={d.slug} href={`/on-this-day/${d.slug}`}
                    className="rounded-full border border-[#0f3460] px-5 py-2 text-sm text-[#a8a8b3] transition-colors hover:border-[#e94560] hover:text-white">
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ad — below birthdays / coming-soon section */}
        <div className="bg-[#1a1a2e] px-6 pb-4">
          <div className="mx-auto max-w-[900px]">
            <AdUnit slot="1234567890" format="rectangle" />
          </div>
        </div>

        {/* ── EXPLORE ───────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-6 text-xl font-bold text-white">Explore Other Dates</h2>
            <div className="flex flex-wrap gap-3">
              {POPULAR_DATES.filter((d) => d.slug !== params.date).map((d) => (
                <Link key={d.slug} href={`/on-this-day/${d.slug}`}
                  className="rounded-full border border-[#0f3460] px-5 py-2 text-sm text-[#a8a8b3] transition-colors hover:border-[#e94560] hover:text-white">
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── NAVIGATION ────────────────────────────────────────────── */}
        <section className="bg-[#1a1a2e] px-6 py-10">
          <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4">
            <Link href={`/on-this-day/${prevSlug}`}
              className="rounded-lg border border-[#0f3460] bg-[#16213e] px-5 py-3 text-white transition-colors hover:border-[#e94560]">
              ← {slugLabel(prevSlug)}
            </Link>
            <Link href={`/on-this-day/${nextSlug}`}
              className="rounded-lg border border-[#0f3460] bg-[#16213e] px-5 py-3 text-white transition-colors hover:border-[#e94560]">
              {slugLabel(nextSlug)} →
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
