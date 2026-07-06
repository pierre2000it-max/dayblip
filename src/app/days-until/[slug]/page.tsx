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
import FinanceCTA from "@/components/FinanceCTA";

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
  "summer-break":
    "The first day of summer falls on the summer solstice — June 20 or 21 each year. It marks the longest day of the year and the unofficial start of summer vacation for millions of students across the United States.",
};

// ── Finance CTAs — holiday-specific internal links ────────────────────────────
const HOLIDAY_CTAS: Record<string, { emoji: string; headline: string; description: string; linkText: string; href: string }> = {
  "christmas": {
    emoji: "🎁",
    headline: "Make your holidays count",
    description: "See how much your holiday budget could grow if you invested it instead. One calculation could change how you think about holiday spending.",
    linkText: "Try the Compound Interest Calculator",
    href: "/finance/compound-interest",
  },
  "new-years": {
    emoji: "🎆",
    headline: "New year, new financial goals",
    description: "See if you are on track to retire comfortably. A new year is the perfect time to check your retirement timeline.",
    linkText: "Check Your Retirement Timeline",
    href: "/finance/retirement-savings",
  },
  "thanksgiving": {
    emoji: "🦃",
    headline: "Grateful for your financial health?",
    description: "See your true net worth and find out where you stand financially heading into the new year.",
    linkText: "Net Worth Calculator",
    href: "/finance/net-worth",
  },
  "halloween": {
    emoji: "🎃",
    headline: "Don't let debt haunt you",
    description: "See exactly when you will be debt free and how much interest you will save by paying more each month.",
    linkText: "Debt Freedom Date Calculator",
    href: "/tools/debt-freedom",
  },
}

// ── Dedicated meta descriptions per holiday (complete, keyword-rich, 130-155 chars) ──
const HOLIDAY_META_DESCRIPTIONS: Record<string, string> = {
  "halloween":
    "How many days until Halloween 2026? Live countdown to October 31 with days, hours, minutes and seconds. Free — no signup required.",
  "thanksgiving":
    "How many days until Thanksgiving 2026? Live countdown to the fourth Thursday in November. Days, hours, minutes and seconds. Free.",
  "new-years":
    "How many days until New Year's Day 2027? Live countdown to January 1 with exact days, hours, minutes and seconds remaining. Free.",
  "new-years-eve":
    "How many days until New Year's Eve 2026? Live countdown to December 31 with exact days, hours, minutes and seconds remaining. Free.",
  "valentines-day":
    "How many days until Valentine's Day 2027? Live countdown to February 14 with exact days, hours, minutes and seconds remaining. Free.",
  "st-patricks-day":
    "How many days until St. Patrick's Day 2027? Live countdown to March 17 with exact days, hours, minutes and seconds remaining. Free.",
  "easter":
    "How many days until Easter 2027? Live countdown to Easter Sunday with exact days, hours, minutes and seconds remaining. Free tool.",
  "independence-day":
    "How many days until Independence Day 2026? Live countdown to July 4 with exact days, hours, minutes and seconds remaining. Free.",
  "labor-day":
    "How many days until Labor Day 2026? Live countdown to the first Monday in September with exact days, hours and minutes. Free tool.",
  "memorial-day":
    "How many days until Memorial Day 2026? Live countdown to the last Monday in May with exact days, hours, minutes and seconds. Free.",
  "fathers-day":
    "How many days until Father's Day 2026? Live countdown to the third Sunday in June with exact days, hours, minutes and seconds. Free.",
  "mothers-day":
    "How many days until Mother's Day 2027? Live countdown to the second Sunday in May with exact days, hours, minutes and seconds. Free.",
  "black-friday":
    "How many days until Black Friday 2026? Live countdown to the Friday after Thanksgiving with exact days, hours and minutes. Free tool.",
};

// ── Per-slug title overrides (for better CTR on specific search queries) ──────
const HOLIDAY_TITLE_OVERRIDES: Record<string, string> = {
  "summer-break": "Days Until Summer Break 2026 — Live Countdown",
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
  const title = HOLIDAY_TITLE_OVERRIDES[params.slug] ?? `Days Until ${holiday.name} ${year}`;
  const intro = HOLIDAY_INTROS[params.slug];
  const descriptionText = params.slug === "christmas"
    ? "How many days until Christmas 2026? Live countdown to December 25 showing exact days, hours, minutes and seconds remaining. Free — no signup required."
    : params.slug === "summer-break"
    ? "How many days until summer break 2026? Live countdown for students showing exact days, hours, minutes and seconds until school lets out. Free — no signup."
    : HOLIDAY_META_DESCRIPTIONS[params.slug]
    ?? (intro
      ? intro.length > 160 ? `${intro.slice(0, 157).trimEnd()}...` : intro
      : `How many days until ${holiday.name}? Live countdown to ${holiday.name} ${year}. Updated in real time.`);
  const description = descriptionText;
  const url = `https://www.dayblip.com/days-until/${params.slug}`;
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
      images: [{ url: "/api/og?title=Days+Until+Calculator&emoji=⏳&subtitle=Count+down+to+any+date+or+holiday", width: 1200, height: 630, alt: title }],
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

        {/* ── FINANCE CTA (holiday-specific) ────────────────────────── */}
        {HOLIDAY_CTAS[holiday.slug] && (
          <section className="bg-[#1a1a2e] px-6 pt-8 pb-2">
            <div className="mx-auto max-w-[900px]">
              <FinanceCTA {...HOLIDAY_CTAS[holiday.slug]!} />
            </div>
          </section>
        )}

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

        {/* ── SPORTS COUNTDOWNS ─────────────────────────────────────── */}
        <section className="bg-[#0f3460] px-6 py-10">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-6 text-xl font-bold text-white">
              🏆 Sports Countdowns
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { emoji: '⚽', label: 'World Cup Final', href: '/days-until/world-cup' },
                { emoji: '🏈', label: 'Super Bowl', href: '/days-until/super-bowl' },
                { emoji: '⚾', label: 'World Series', href: '/days-until/world-series' },
                { emoji: '🏀', label: 'March Madness', href: '/days-until/march-madness' },
                { emoji: '🏆', label: 'NBA Finals', href: '/days-until/nba-finals' },
              ].map(sport => (
                <Link
                  key={sport.href}
                  href={sport.href}
                  className="flex items-center gap-2 rounded-xl bg-[#1a1a2e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16213e]"
                >
                  <span>{sport.emoji}</span>
                  <span>{sport.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
