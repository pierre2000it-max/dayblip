import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import DateNav from "./DateNav";
import ShareButtons from "@/components/ShareButtons";
import WikiEvents, { type FallbackData, type WikiData } from "./WikiEvents";
import onThisDayRaw from "@/data/onThisDay.json";
import { generateOnThisDaySchema, generateBreadcrumbSchema } from "@/lib/seo";
import AdUnit from "@/components/AdUnit";

// ── Types ────────────────────────────────────────────────────────────────────

interface DayEvent  { year: number; event: string }
interface Birthday  { name: string; year: number; role: string }
interface DayData   { events: DayEvent[]; birthdays: Birthday[] }

const onThisDayData = onThisDayRaw as Record<string, DayData>;
const BASE = "https://www.dayblip.com";

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

// ── Wikipedia API types ───────────────────────────────────────────────────────

interface WikiApiPage { titles?: { normalized?: string }; description?: string }
interface WikiApiEntry { year: number; text: string; pages?: WikiApiPage[] }

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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// ── Server-side Wikipedia fetch (cached 24 hrs) ───────────────────────────────

async function fetchWikiData(month: number, day: number): Promise<WikiData> {
  const mm = pad2(month);
  const dd = pad2(day);

  try {
    const res = await fetch(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`,
      {
        headers: { "Api-User-Agent": "Dayblip/1.0 (dayblip.com)" },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
    const data = await res.json();

    return {
      fetchFailed: false,
      events: (data.events ?? []).slice(0, 10).map((e: WikiApiEntry) => ({
        year: String(e.year),
        text: e.text,
      })),
      births: (data.births ?? []).slice(0, 8).map((e: WikiApiEntry) => ({
        year: String(e.year),
        name: e.pages?.[0]?.titles?.normalized ?? e.text.split(",")[0],
        description: e.pages?.[0]?.description ?? e.text,
      })),
      deaths: (data.deaths ?? []).slice(0, 5).map((e: WikiApiEntry) => ({
        year: String(e.year),
        name: e.pages?.[0]?.titles?.normalized ?? e.text.split(",")[0],
        description: e.pages?.[0]?.description ?? e.text,
      })),
    };
  } catch {
    // Backup API
    try {
      const res = await fetch(
        `https://history.muffinlabs.com/date/${month}/${day}`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) throw new Error(`Backup API ${res.status}`);
      const data = await res.json();

      const mapEntry = (e: { year: string; text: string }) => ({ year: e.year, text: e.text });
      const mapPerson = (e: { year: string; text: string }) => {
        const parts = e.text.split(",");
        return {
          year: e.year,
          name: parts[0]?.trim() ?? e.text,
          description: parts.slice(1).join(",").trim() || e.text,
        };
      };

      return {
        fetchFailed: false,
        events: (data.data?.Events ?? []).slice(0, 10).map(mapEntry),
        births: (data.data?.Births ?? []).slice(0, 8).map(mapPerson),
        deaths: (data.data?.Deaths ?? []).slice(0, 5).map(mapPerson),
      };
    } catch {
      return { fetchFailed: true, events: [], births: [], deaths: [] };
    }
  }
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { date: string };
}): Promise<Metadata> {
  const parsed = parseSlug(params.date);
  const label  = parsed ? `${MONTH_DISPLAY[parsed.month - 1]} ${ordinal(parsed.day)}` : params.date;
  const title  = `What Happened on ${label}? Historical Events | Dayblip`;
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

// ── Static params — pre-renders all 366 date pages at build time ──────────────

export async function generateStaticParams() {
  const months = [
    { name: "january",   days: 31 },
    { name: "february",  days: 29 },
    { name: "march",     days: 31 },
    { name: "april",     days: 30 },
    { name: "may",       days: 31 },
    { name: "june",      days: 30 },
    { name: "july",      days: 31 },
    { name: "august",    days: 31 },
    { name: "september", days: 30 },
    { name: "october",   days: 31 },
    { name: "november",  days: 30 },
    { name: "december",  days: 31 },
  ];

  const params: { date: string }[] = [];
  for (const month of months) {
    for (let day = 1; day <= month.days; day++) {
      params.push({ date: `${month.name}-${day}` });
    }
  }
  return params;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function OnThisDayPage({
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
  const prevSlug       = adjacentSlug(month, day, -1);
  const nextSlug       = adjacentSlug(month, day, 1);
  const pageUrl        = `${BASE}/on-this-day/${params.date}`;
  const desc           = `Discover what happened on ${formattedDate} in history. Famous birthdays, major events and historical facts.`;

  // Fetch Wikipedia server-side — result is cached 24 hrs on Vercel edge.
  // Page awaits this before rendering so users receive a complete page with no loading state.
  const wikiData = await fetchWikiData(month, day);

  // JSON-LD schemas
  const articleSchema    = generateOnThisDaySchema(formattedDate, desc);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home",        url: BASE },
    { name: "On This Day", url: `${BASE}/on-this-day` },
    { name: formattedDate, url: pageUrl },
  ]);

  const fallbackForSchema = data ?? null;
  const faqSchema = fallbackForSchema && fallbackForSchema.events.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What happened on ${formattedDate} in history?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: fallbackForSchema.events.slice(0, 3).map(e => `${e.year}: ${e.event}`).join(" | "),
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

        {/* ── EVENTS — pre-fetched, no loading state ────────────────── */}
        <Suspense fallback={
          <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "32px", textAlign: "center", color: "#a8a8b3", fontSize: "15px", margin: "32px 24px" }}>
            Loading historical events...
          </div>
        }>
          <WikiEvents
            wikiData={wikiData}
            formattedDate={formattedDate}
            monthDay={monthDay}
            fallback={data as FallbackData | null}
          />
        </Suspense>

        {/* Ad — after events */}
        <div className="bg-[#1a1a2e] px-6 pb-4">
          <div className="mx-auto max-w-[900px]">
            <AdUnit slot="1234567890" format="rectangle" />
          </div>
        </div>

        <section className="bg-[#1a1a2e] px-6 py-10">
          <div className="mx-auto max-w-[900px]">
            <ShareButtons
              text={`On ${monthDay} in history: see all historical events for any date at www.dayblip.com/on-this-day`}
              url={pageUrl}
              title={`What Happened on ${formattedDate}? Historical Events | Dayblip`}
            />
          </div>
        </section>

        {/* Ad — below share section */}
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
