import type { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import AdUnit from "@/components/AdUnit"
import CoupleCompatibilityClient from "./CoupleCompatibilityClient"

export const metadata: Metadata = {
  title: "Couple Compatibility Calculator — Your Real Numbers Together | Dayblip",
  description:
    "Enter two birthdates and see the real numbers of your relationship — days alive together, shared weekends remaining, generation match, age gap in days, and more.",
  alternates: { canonical: "https://www.dayblip.com/tools/couple-compatibility" },
  openGraph: {
    title: "Couple Compatibility Calculator — Your Real Numbers Together | Dayblip",
    description:
      "Enter two birthdates and see the real numbers of your relationship — days alive together, shared weekends remaining, generation match, age gap in days, and more.",
    url: "https://www.dayblip.com/tools/couple-compatibility",
    type: "website",
    images: [{ url: "https://www.dayblip.com/og-default.svg", width: 1200, height: 630, alt: "Couple Compatibility Calculator — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Couple Compatibility Calculator — Your Real Numbers Together | Dayblip",
    description:
      "Enter two birthdates and see the real numbers of your relationship — days alive together, shared weekends remaining, generation match, age gap in days, and more.",
    images: ["https://www.dayblip.com/og-default.svg"],
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

            {/* FAQ */}
            <div style={{ marginTop: "48px" }}>
              <h2
                style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, marginBottom: "24px" }}
              >
                Frequently Asked Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {FAQ_ITEMS.map((item) => (
                  <div
                    key={item.q}
                    style={{ background: "#1e2d4a", borderRadius: "10px", padding: "20px 24px" }}
                  >
                    <h3
                      style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600, margin: "0 0 8px 0" }}
                    >
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
