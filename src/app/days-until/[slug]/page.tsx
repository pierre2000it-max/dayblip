import type { Metadata } from "next";
import Link from "next/link";
import holidaysData from "@/data/holidays.json";
import CountdownDisplay from "./CountdownDisplay";
import {
  generateCountdownSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  getNextHolidayDate,
} from "@/lib/seo";
import AdUnit from "@/components/AdUnit";

// ── Types ────────────────────────────────────────────────────────────────────

interface FAQ {
  q: string;
  a: string;
}

interface Holiday {
  slug: string;
  name: string;
  emoji: string;
  date: string;
  description: string;
  color: string;
  facts: string[];
  faqs: FAQ[];
}

const holidays = holidaysData as Holiday[];
const BASE = "https://dayblip.com";

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const holiday = holidays.find((h) => h.slug === params.slug);
  if (!holiday) return { title: "Not Found" };
  const year = new Date().getFullYear();
  const title = `Days Until ${holiday.name} ${year}`;
  const description = `How many days until ${holiday.name}? Live countdown to ${holiday.name} ${year}. Updated in real time.`;
  const url = `/days-until/${params.slug}`;
  return {
    title,
    description,
    keywords: [
      `days until ${holiday.name.toLowerCase()}`,
      `how many days until ${holiday.name.toLowerCase()}`,
      `${holiday.name.toLowerCase()} countdown ${year}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CountdownPage({
  params,
}: {
  params: { slug: string };
}) {
  const holiday = holidays.find((h) => h.slug === params.slug);

  if (!holiday) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#1a1a2e] px-6 text-center">
        <span className="text-6xl">🔍</span>
        <h1 className="text-3xl font-bold text-white">Holiday Not Found</h1>
        <p className="text-[#a8a8b3]">
          We couldn&apos;t find a countdown for{" "}
          <code className="rounded bg-[#16213e] px-2 py-0.5 text-white">
            /days-until/{params.slug}
          </code>
        </p>
        <Link href="/" className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
          Browse All Countdowns
        </Link>
      </div>
    );
  }

  const year    = new Date().getFullYear();
  const related = holidays.filter((h) => h.slug !== holiday.slug).slice(0, 4);
  const pageUrl = `${BASE}/days-until/${holiday.slug}`;
  const title   = `Days Until ${holiday.name} ${year}`;
  const desc    = `How many days until ${holiday.name}? Live countdown to ${holiday.name} ${year}. Updated in real time.`;

  // ── Compute next holiday date for FAQ enrichment ─────────────────────────
  const DAY_NAMES_S   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTH_NAMES_S = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const nextDate      = getNextHolidayDate(holiday.date);
  const nextYear      = nextDate.getFullYear();
  const dayOfWeek     = DAY_NAMES_S[nextDate.getDay()];
  const monthName     = MONTH_NAMES_S[nextDate.getMonth()];
  const dayNum        = nextDate.getDate();
  const dateStr       = `${dayOfWeek}, ${monthName} ${dayNum}, ${nextYear}`;

  const todayMs       = new Date().setHours(0, 0, 0, 0);
  const daysUntil     = Math.ceil((nextDate.getTime() - todayMs) / 86400000);
  const weeksAway     = Math.floor(daysUntil / 7);
  const daysRemainder = daysUntil % 7;
  const weeksStr      = weeksAway > 0
    ? `${weeksAway} week${weeksAway !== 1 ? "s" : ""} and ${daysRemainder} day${daysRemainder !== 1 ? "s" : ""}`
    : `${daysRemainder} day${daysRemainder !== 1 ? "s" : ""}`;

  // Replace generic "check above" answers with actual dates
  const enrichedFaqs = holiday.faqs.map((faq) => {
    const a = faq.a;
    const aL = a.toLowerCase();
    if (aL.includes("check the countdown above for the exact date and day of the week") ||
        aL.includes("check the countdown above for the exact day of the week")) {
      return { ...faq, a: `${holiday.name} ${nextYear} falls on ${dateStr}.` };
    }
    if (aL.includes("use the live countdown above") || aL.includes("use the countdown above")) {
      return { ...faq, a: `There are currently ${daysUntil.toLocaleString()} days until ${holiday.name}. It falls on ${dateStr}.` };
    }
    if (aL.includes("divide the days shown above by 7")) {
      return { ...faq, a: `${holiday.name} ${nextYear} is ${weeksStr} away — it falls on ${dateStr}.` };
    }
    if (aL.includes("the number of sleeps is the same as the number of days shown above")) {
      return { ...faq, a: `There are ${daysUntil.toLocaleString()} sleeps until ${holiday.name} ${nextYear} on ${dateStr}.` };
    }
    return faq;
  });

  // JSON-LD schemas (use enriched FAQs)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: enrichedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
  const eventSchema      = generateCountdownSchema(holiday);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home",       url: BASE },
    { name: "Countdowns", url: `${BASE}/days-until` },
    { name: holiday.name, url: pageUrl },
  ]);
  const webPageSchema = generateWebPageSchema(title, desc, pageUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <div className="min-h-screen bg-[#1a1a2e]">

        {/* ── HERO + COUNTDOWN ──────────────────────────────────────── */}
        <section className="px-6 py-16 text-center"
          style={{ background: `linear-gradient(135deg, #1a1a2e 0%, ${holiday.color}1a 100%)` }}>
          <div className="mx-auto max-w-[900px]">
            <div className="mb-4 text-7xl">{holiday.emoji}</div>
            <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
              Days Until {holiday.name}
            </h1>
            <p className="mb-10 text-lg text-[#a8a8b3]">
              Live countdown to {holiday.name} {year}
            </p>
            <CountdownDisplay date={holiday.date} color={holiday.color} name={holiday.name} />
            <div className="mx-auto mt-4 max-w-[900px]">
              <AdUnit slot="1234567890" format="rectangle" />
            </div>
          </div>
        </section>

        {/* ── ABOUT + FACTS ─────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-4 text-2xl font-bold text-white">About {holiday.name}</h2>
            <p className="mb-10 leading-relaxed text-[#a8a8b3]">{holiday.description}</p>
            <h3 className="mb-5 text-xl font-semibold text-white">Fun Facts</h3>
            <ul className="flex flex-col gap-3">
              {holiday.facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-bold" style={{ color: holiday.color }}>✓</span>
                  <span className="text-[#a8a8b3]">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ad — between facts and FAQ */}
        <div className="bg-[#16213e] px-6 pb-4">
          <div className="mx-auto max-w-[900px]">
            <AdUnit slot="1234567890" format="rectangle" />
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-3">
              {enrichedFaqs.map((faq, i) => (
                <details key={i}
                  className="group rounded-xl border border-[#16213e] bg-[#16213e] open:border-[#e94560]/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white">
                    <span>{faq.q}</span>
                    <span className="shrink-0 text-xl text-[#e94560] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-5 pb-5 pt-1 leading-relaxed text-[#a8a8b3]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Ad — below FAQ */}
        <div className="bg-[#1a1a2e] px-6 pb-4">
          <div className="mx-auto max-w-[900px]">
            <AdUnit slot="1234567890" format="leaderboard" />
          </div>
        </div>

        {/* ── RELATED ───────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">More Countdowns</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((h) => (
                <Link key={h.slug} href={`/days-until/${h.slug}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center transition-all duration-200 hover:border-[#e94560]">
                  <span className="text-3xl">{h.emoji}</span>
                  <span className="text-sm font-semibold text-white">{h.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
