import type { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import AdUnit from "@/components/AdUnit"
import ThisYearProgressClient from "./ThisYearProgressClient"
import FAQAccordion from "@/components/FAQAccordion"
import AuthorByline from "@/components/AuthorByline"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

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
    images: [{ url: "https://www.dayblip.com/api/og/tools", width: 1200, height: 630, alt: "2026 Year Progress — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Year Progress 2026 — How Much of the Year Is Left? | Dayblip",
    description:
      "See exactly how much of 2026 is complete and how many days remain. Live year progress bar updated in real time — see where 2026 stands right now.",
    images: ["https://www.dayblip.com/api/og/tools"],
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

            <FAQAccordion items={FAQ_ITEMS.map(f => ({
              question: f.q,
              answer: f.a
            }))} />

            <AdUnit slot="2847591036" format="leaderboard" className="mt-8" />
            <AuthorByline variant="tool" />
            <LastUpdated date="June 2026" />
            <MethodologyNote text="Year progress calculated as elapsed days since January 1 2026 divided by 365 total days (2026 is not a leap year). Day of year is the number of days elapsed plus one. Weeks remaining calculated as floor division of remaining days by 7. Milestone dates are fixed calendar dates for Q1 end (April 1), year midpoint (July 2), Q3 end (October 1), final quarter start (November 30), and year end (December 31). Progress bar updates every second using JavaScript setInterval." />
          </div>
        </section>
      </div>
    </>
  )
}
