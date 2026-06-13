import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import AdUnit from "@/components/AdUnit";
import NamePopularityClient from "./NamePopularityClient";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Name Popularity — How Many People Share Your Name? | Dayblip",
  description:
    "Discover how popular your name has been across every decade since 1880. See peak year, total count, 1-in-X rarity, trend, and decade-by-decade breakdown — powered by official SSA data.",
  alternates: {
    canonical: "https://www.dayblip.com/tools/name-popularity",
  },
  openGraph: {
    title: "Name Popularity — How Common Is Your Name?",
    description:
      "Look up any name and see how its popularity has changed over 140+ years of US birth records.",
    url: "https://www.dayblip.com/tools/name-popularity",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// ── JSON-LD ───────────────────────────────────────────────────────────────────

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Name Popularity Tool",
  description:
    "Discover how popular your name has been across 140+ years of US birth records using official SSA data.",
  url: "https://www.dayblip.com/tools/name-popularity",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: "https://www.dayblip.com" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.dayblip.com" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.dayblip.com/tools" },
    { "@type": "ListItem", position: 3, name: "Name Popularity", item: "https://www.dayblip.com/tools/name-popularity" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where does the name popularity data come from?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All data comes from the Social Security Administration (SSA) baby names dataset, which covers every name given to at least 5 babies in the United States from 1880 to the most recent year available.",
      },
    },
    {
      "@type": "Question",
      name: "How is the 1-in-X rarity calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We divide the total US births in your name's peak year by the number of babies given that name that year. For example, if 80,000 babies were named Emma in a year when 4 million babies were born, that's roughly 1 in every 50 babies.",
      },
    },
    {
      "@type": "Question",
      name: "Why might my name not appear in the results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SSA only includes names given to at least 5 babies in a given year to protect privacy. Very rare or unique names may not appear, and the dataset covers US births only.",
      },
    },
    {
      "@type": "Question",
      name: "What does the trend indicator mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The trend compares average annual births for your name in the most recent 5 years vs the previous 10 years. Rising means more babies are getting this name recently; Falling means fewer; Stable means roughly the same.",
      },
    },
  ],
};

// ── FAQ section data ──────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Where does the name popularity data come from?",
    a: "All data comes from the Social Security Administration (SSA) baby names dataset, which covers every name given to at least 5 babies in the United States from 1880 to the most recent year available.",
  },
  {
    q: "How is the 1-in-X rarity calculated?",
    a: "We divide the total US births in your name's peak year by the number of babies given that name that year. For example, if 80,000 babies were named Emma in a year when 4 million babies were born, that's roughly 1 in every 50 babies.",
  },
  {
    q: "Why might my name not appear in the results?",
    a: "The SSA only includes names given to at least 5 babies in a given year to protect privacy. Very rare or unique names may not appear, and the dataset covers US births only.",
  },
  {
    q: "What does the trend indicator mean?",
    a: "The trend compares average annual births for your name in the most recent 5 years vs the previous 10 years. Rising means more babies are getting this name recently; Falling means fewer; Stable means roughly the same.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NamePopularityPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section
        className="px-6 py-16 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
      >
        <div className="mx-auto max-w-[700px]">
          <div className="mb-4 text-5xl">📛</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            How Popular Is Your Name?
          </h1>
          <p className="text-lg text-[#a8a8b3]">
            Discover how your name has trended across 140+ years of US birth records — peak year,
            total count, decade-by-decade breakdown, and more.
          </p>
          <p className="mt-3 text-sm text-[#a8a8b3]">
            Powered by official SSA data · 1880–2023
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[700px] px-6 pt-4">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Name Popularity" },
          ]}
        />
      </div>

      {/* Ad */}
      <div className="mx-auto max-w-[700px] px-6">
        <AdUnit slot="2847591036" format="leaderboard" />
      </div>

      {/* Interactive tool */}
      <NamePopularityClient />

      {/* FAQ */}
      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[700px]">
          <h2 className="mb-8 text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <h3 className="mb-2 font-semibold text-white">{q}</h3>
                <p className="text-sm leading-relaxed text-[#a8a8b3]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-[700px] px-6 pb-10">
        <AdUnit slot="3958602147" format="rectangle" />
      </div>
    </div>
  );
}
