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
const BASE = "https://www.dayblip.com";

// ── Unique descriptive intro per holiday (SEO / unique content) ────────────────
const HOLIDAY_INTROS: Record<string, string> = {
  "christmas":
    "Christmas is celebrated on December 25 in more than 160 countries worldwide. The holiday marks the birth of Jesus Christ in Christian tradition and has grown into a global celebration of family, generosity and winter festivities. Americans spend an average of $998 on Christmas gifts, decorations and food each year.",
  "halloween":
    "Halloween is celebrated on October 31 each year across the United States, Canada, Ireland and the United Kingdom. Rooted in the ancient Celtic festival of Samhain, it evolved into a night of costumes, trick-or-treating and jack-o-lanterns. Americans spend over $12 billion on Halloween annually — making it the second largest commercial holiday after Christmas.",
  "thanksgiving":
    "Thanksgiving is celebrated on the fourth Thursday of November in the United States. The holiday traces its origins to a 1621 harvest feast shared between the Pilgrims and the Wampanoag people. Approximately 46 million turkeys are consumed in the US on Thanksgiving Day each year.",
  "new-years":
    "New Year's Day on January 1 is the most widely celebrated holiday on Earth — observed in virtually every country across every time zone. The global celebration begins in the Pacific islands and sweeps westward over 26 hours. An estimated 1 billion people watch some form of New Year's countdown broadcast each year.",
  "new-years-eve":
    "New Year's Eve on December 31 is celebrated with fireworks, countdowns and gatherings in cities across the world. Times Square in New York City has hosted its famous ball drop since 1907. The global celebration generates over $300 billion in economic activity across travel, hospitality and entertainment each year.",
  "valentines-day":
    "Valentine's Day on February 14 is celebrated in the United States, Canada, the United Kingdom, Australia and dozens of other countries. The holiday honors Saint Valentine and has become a global celebration of romantic love. Americans spend approximately $24 billion on Valentine's Day gifts each year — averaging $192 per person.",
  "st-patricks-day":
    "Saint Patrick's Day on March 17 commemorates the death of Saint Patrick, the patron saint of Ireland, in 461 AD. The holiday celebrates Irish culture and heritage and is observed in more countries than any other national festival. An estimated 13 million pints of Guinness are consumed worldwide on Saint Patrick's Day.",
  "easter":
    "Easter is a Christian holiday celebrating the resurrection of Jesus Christ. Unlike most holidays it falls on a different date each year — the first Sunday after the first full moon following the spring equinox. Americans spend approximately $22 billion on Easter each year including candy, gifts, food and clothing.",
  "independence-day":
    "Independence Day on July 4 marks the adoption of the Declaration of Independence in 1776 when the United States declared independence from Britain. It is celebrated with fireworks, parades, barbecues and concerts across the country. Americans purchase approximately $2.5 billion worth of fireworks for Independence Day each year.",
  "labor-day":
    "Labor Day is celebrated on the first Monday of September in the United States and Canada. The holiday honors the American labor movement and the contributions of workers to society. It was first celebrated in 1882 in New York City and became a federal holiday in 1894.",
  "memorial-day":
    "Memorial Day is observed on the last Monday of May in the United States. The holiday honors military personnel who died while serving in the US armed forces. Originally called Decoration Day it was first widely observed after the Civil War. More than 36 million Americans travel over Memorial Day weekend each year.",
  "fathers-day":
    "Father's Day is celebrated on the third Sunday of June in the United States, Canada and the United Kingdom. The holiday honors fathers and father figures and was first celebrated in 1910 in Spokane, Washington. Americans spend approximately $20 billion on Father's Day gifts each year.",
  "mothers-day":
    "Mother's Day is celebrated on the second Sunday of May in the United States. The modern holiday was created by Anna Jarvis in 1908 and became a federal holiday in 1914. It is the busiest day of the year for restaurants and one of the top gift-giving holidays. Americans spend approximately $35 billion on Mother's Day each year.",
  "black-friday":
    "Black Friday falls on the day after Thanksgiving — the fourth Friday of November — and marks the traditional start of the Christmas shopping season in the United States. The name refers to retailers moving from financial loss to profit for the year. Americans spend over $9 billion online on Black Friday alone each year.",
};

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
  const intro = HOLIDAY_INTROS[params.slug];
  const description = intro
    ? intro.length > 160 ? `${intro.slice(0, 157).trimEnd()}...` : intro
    : `How many days until ${holiday.name}? Live countdown to ${holiday.name} ${year}. Updated in real time.`;
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
            {HOLIDAY_INTROS[holiday.slug] && (
              <p
                className="mx-auto text-center"
                style={{
                  fontSize: "15px",
                  color: "#a8a8b3",
                  maxWidth: "680px",
                  paddingBottom: "24px",
                }}
              >
                {HOLIDAY_INTROS[holiday.slug]}
              </p>
            )}
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
