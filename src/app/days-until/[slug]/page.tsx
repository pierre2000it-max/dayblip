import type { Metadata } from "next";
import Link from "next/link";
import holidaysData from "@/data/holidays.json";
import CountdownDisplay from "./CountdownDisplay";

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

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const holiday = holidays.find((h) => h.slug === params.slug);
  if (!holiday) return { title: "Not Found | Dayblip" };
  const year = new Date().getFullYear();
  return {
    title: `Days Until ${holiday.name} ${year}`,
    description: `How many days until ${holiday.name}? Live countdown to ${holiday.name} ${year}. Updated in real time.`,
    keywords: [
      `days until ${holiday.name.toLowerCase()}`,
      `how many days until ${holiday.name.toLowerCase()}`,
      `${holiday.name.toLowerCase()} countdown ${year}`,
    ],
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CountdownPage({
  params,
}: {
  params: { slug: string };
}) {
  const holiday = holidays.find((h) => h.slug === params.slug);

  // ── 404 fallback ────────────────────────────────────────────────────────
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
        <Link
          href="/"
          className="rounded-lg bg-[#e94560] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Browse All Countdowns
        </Link>
      </div>
    );
  }

  const year = new Date().getFullYear();
  const related = holidays.filter((h) => h.slug !== holiday.slug).slice(0, 4);

  // FAQ JSON-LD schema for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: holiday.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#1a1a2e]">

        {/* ── HERO + COUNTDOWN ────────────────────────────────────────── */}
        <section
          className="px-6 py-16 text-center"
          style={{
            background: `linear-gradient(135deg, #1a1a2e 0%, ${holiday.color}1a 100%)`,
          }}
        >
          <div className="mx-auto max-w-[900px]">
            <div className="mb-4 text-7xl">{holiday.emoji}</div>
            <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
              Days Until {holiday.name}
            </h1>
            <p className="mb-10 text-lg text-[#a8a8b3]">
              Live countdown to {holiday.name} {year}
            </p>

            {/* Live countdown — client component */}
            <CountdownDisplay date={holiday.date} color={holiday.color} />
          </div>
        </section>

        {/* ── ABOUT + FACTS ───────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-4 text-2xl font-bold text-white">
              About {holiday.name}
            </h2>
            <p className="mb-10 leading-relaxed text-[#a8a8b3]">
              {holiday.description}
            </p>

            <h3 className="mb-5 text-xl font-semibold text-white">
              Fun Facts
            </h3>
            <ul className="flex flex-col gap-3">
              {holiday.facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 shrink-0 font-bold"
                    style={{ color: holiday.color }}
                  >
                    ✓
                  </span>
                  <span className="text-[#a8a8b3]">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section className="bg-[#1a1a2e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-3">
              {holiday.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-[#16213e] bg-[#16213e] open:border-[#e94560]/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white">
                    <span>{faq.q}</span>
                    <span className="shrink-0 text-xl text-[#e94560] transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 pt-1 leading-relaxed text-[#a8a8b3]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── RELATED ─────────────────────────────────────────────────── */}
        <section className="bg-[#16213e] px-6 py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-8 text-2xl font-bold text-white">
              More Countdowns
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((h) => (
                <Link
                  key={h.slug}
                  href={`/days-until/${h.slug}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-center transition-all duration-200 hover:border-[#e94560]"
                >
                  <span className="text-3xl">{h.emoji}</span>
                  <span className="text-sm font-semibold text-white">
                    {h.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
