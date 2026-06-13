import type { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import AdUnit from "@/components/AdUnit"
import ThisYearProgressClient from "./ThisYearProgressClient"

export const metadata: Metadata = {
  title: "Year Progress 2026 — How Much of the Year Is Left? | Dayblip",
  description:
    "See exactly how much of 2026 is complete and how many days remain. Live year progress bar updated in real time — see where 2026 stands right now.",
  alternates: { canonical: "https://www.dayblip.com/tools/this-year-progress" },
  openGraph: {
    title: "Year Progress 2026 — How Much of the Year Is Left? | Dayblip",
    description:
      "See exactly how much of 2026 is complete and how many days remain. Live year progress bar updated in real time — see where 2026 stands right now.",
    url: "https://www.dayblip.com/tools/this-year-progress",
    type: "website",
    images: [{ url: "https://www.dayblip.com/og-default.svg", width: 1200, height: 630, alt: "Year Progress 2026 — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Year Progress 2026 — How Much of the Year Is Left? | Dayblip",
    description:
      "See exactly how much of 2026 is complete and how many days remain. Live year progress bar updated in real time — see where 2026 stands right now.",
    images: ["https://www.dayblip.com/og-default.svg"],
  },
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Year Progress Bar 2026",
  url: "https://www.dayblip.com/tools/this-year-progress",
  description:
    "Live year progress bar showing exactly how much of 2026 is complete and how many days remain.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is year progress calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Year progress is calculated by dividing the number of days elapsed since January 1st by the total number of days in the year (365 or 366 for leap years), then multiplying by 100 to get a percentage.",
      },
    },
    {
      "@type": "Question",
      name: "How many days are left in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The exact number of days remaining updates in real time based on today's date. The page recalculates automatically every second.",
      },
    },
    {
      "@type": "Question",
      name: "Is 2026 a leap year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. 2026 has 365 days.",
      },
    },
    {
      "@type": "Question",
      name: "What time zone is the year progress based on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Year progress is calculated based on your local device time zone so the result matches your calendar.",
      },
    },
    {
      "@type": "Question",
      name: "When does the year progress bar reset?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The bar resets to 0% automatically at midnight on January 1st in your local time zone.",
      },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.dayblip.com" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.dayblip.com/tools" },
    { "@type": "ListItem", position: 3, name: "Year Progress 2026", item: "https://www.dayblip.com/tools/this-year-progress" },
  ],
}

const FAQ_ITEMS = [
  {
    q: "How is year progress calculated?",
    a: "Year progress is calculated by dividing the number of days elapsed since January 1st by the total number of days in the year (365 or 366 for leap years), then multiplying by 100 to get a percentage.",
  },
  {
    q: "How many days are left in 2026?",
    a: "The exact number of days remaining updates in real time based on today's date. The page recalculates automatically every second.",
  },
  {
    q: "Is 2026 a leap year?",
    a: "No. 2026 has 365 days.",
  },
  {
    q: "What time zone is the year progress based on?",
    a: "Year progress is calculated based on your local device time zone so the result matches your calendar.",
  },
  {
    q: "When does the year progress bar reset?",
    a: "The bar resets to 0% automatically at midnight on January 1st in your local time zone.",
  },
]

export default function ThisYearProgressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[#0d1b2a]">
        <section
          className="px-6 py-16 text-center"
          style={{ background: "linear-gradient(135deg,#0d1b2a 0%,#0f3460 100%)" }}
        >
          <div className="mx-auto max-w-[700px]">
            <h1 className="mb-3 text-4xl font-bold text-white">Year Progress 2026</h1>
            <p className="text-[#a8a8b3]">
              How much of 2026 is gone — and how much is left.
            </p>
          </div>
        </section>

        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            <Breadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "Year Progress 2026" },
              ]}
            />

            <ThisYearProgressClient />

            {/* FAQ */}
            <div style={{ marginTop: "48px" }}>
              <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {FAQ_ITEMS.map((item) => (
                  <div
                    key={item.q}
                    style={{ background: "#1e2d4a", borderRadius: "10px", padding: "20px 24px" }}
                  >
                    <h3 style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, margin: "0 0 8px 0" }}>
                      {item.q}
                    </h3>
                    <p style={{ color: "#a8a8b3", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <AdUnit slot="2847591036" format="leaderboard" className="mt-8" />
          </div>
        </section>
      </div>
    </>
  )
}
