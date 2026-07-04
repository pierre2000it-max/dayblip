import type { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import AdUnit from "@/components/AdUnit"
import CoupleCompatibilityClient from "./CoupleCompatibilityClient"
import FAQAccordion from "@/components/FAQAccordion"
import AuthorByline from "@/components/AuthorByline"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

export const metadata: Metadata = {
  title: "Couple Compatibility Calculator — Your Real Numbers Together",
  description:
    "Enter two birthdates and see the real numbers of your relationship — days alive together, shared weekends remaining, generation match, and more.",
  alternates: { canonical: "https://www.dayblip.com/tools/couple-compatibility" },
  openGraph: {
    title: "Couple Compatibility Calculator — Your Real Numbers Together",
    description:
      "Enter two birthdates and see the real numbers of your relationship — days alive together, shared weekends remaining, generation match, and more.",
    url: "https://www.dayblip.com/tools/couple-compatibility",
    type: "website",
    images: [{ url: "https://www.dayblip.com/api/og/tools", width: 1200, height: 630, alt: "Couple Compatibility Calculator — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Couple Compatibility Calculator — Your Real Numbers Together",
    description:
      "Enter two birthdates and see the real numbers of your relationship — days alive together, shared weekends remaining, generation match, and more.",
    images: ["https://www.dayblip.com/api/og/tools"],
  },
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Couple Compatibility Calculator",
  url: "https://www.dayblip.com/tools/couple-compatibility",
  description:
    "Enter two birthdates to discover the real numbers of your relationship — days alive together, shared weekends remaining, generation match, and more.",
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
      name: "How is couple compatibility calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool uses pure date math based on two birthdates. It calculates days alive at the same time, shared weekends remaining if both live to 80, age gap in days, generation match, and combined life milestones. No astrology or zodiac is used.",
      },
    },
    {
      "@type": "Question",
      name: "What does days alive together mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Days alive together is the number of days both people have been alive at the same time — from the birthday of the younger person to today.",
      },
    },
    {
      "@type": "Question",
      name: "What are shared weekends remaining?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shared weekends remaining estimates how many Saturdays and Sundays you could share if both people live to age 80, based on the younger person's current age.",
      },
    },
    {
      "@type": "Question",
      name: "What is a generation match?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A generation match shows whether both people belong to the same generation — Gen Z, Millennial, Gen X, Boomer, or Silent Generation — based on their birth years.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for any relationship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This tool works for romantic partners, best friends, siblings, or any two people whose shared timeline you want to explore.",
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
    { "@type": "ListItem", position: 3, name: "Couple Compatibility", item: "https://www.dayblip.com/tools/couple-compatibility" },
  ],
}

const FAQ_ITEMS = [
  {
    q: "How is couple compatibility calculated?",
    a: "This tool uses pure date math based on two birthdates. It calculates days alive at the same time, shared weekends remaining if both live to 80, age gap in days, generation match, and combined life milestones. No astrology or zodiac is used.",
  },
  {
    q: "What does days alive together mean?",
    a: "Days alive together is the number of days both people have been alive at the same time — from the birthday of the younger person to today.",
  },
  {
    q: "What are shared weekends remaining?",
    a: "Shared weekends remaining estimates how many Saturdays and Sundays you could share if both people live to age 80, based on the younger person's current age.",
  },
  {
    q: "What is a generation match?",
    a: "A generation match shows whether both people belong to the same generation — Gen Z, Millennial, Gen X, Boomer, or Silent Generation — based on their birth years.",
  },
  {
    q: "Can I use this for any relationship?",
    a: "Yes. This tool works for romantic partners, best friends, siblings, or any two people whose shared timeline you want to explore.",
  },
]

export default function CoupleCompatibilityPage() {
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
            <h1 className="mb-3 text-4xl font-bold text-white">
              Couple Compatibility Calculator
            </h1>
            <p className="text-[#a8a8b3]">
              Not astrology. Not zodiac. Just the real numbers of your time together.
            </p>
          </div>
        </section>

        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            <Breadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "Couple Compatibility" },
              ]}
            />

            <CoupleCompatibilityClient />

            <FAQAccordion items={FAQ_ITEMS.map(f => ({
              question: f.q,
              answer: f.a
            }))} />

            <AdUnit slot="2847591036" format="leaderboard" className="mt-8" />
            <AuthorByline variant="tool" />
            <LastUpdated date="June 2026" />
            <MethodologyNote text="Days alive together calculated from the younger person's birthdate to today. Shared weekends remaining calculated assuming both partners live to age 80 — this is a statistical estimate, not a prediction. Generation categories based on Pew Research Center generational definitions: Gen Alpha born 2013+, Gen Z born 1997-2012, Millennial born 1981-1996, Gen X born 1965-1980, Baby Boomer born 1946-1964, Silent Generation born 1928-1945. Milestone dates calculated by adding exact day counts to the younger partner's birthdate." />
          </div>
        </section>
      </div>
    </>
  )
}
