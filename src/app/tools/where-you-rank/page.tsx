import type { Metadata } from "next"
import Breadcrumb from "@/components/Breadcrumb"
import AdUnit from "@/components/AdUnit"
import WhereYouRankClient from "./WhereYouRankClient"
import FAQAccordion from "@/components/FAQAccordion"
import AuthorByline from "@/components/AuthorByline"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"

export const metadata: Metadata = {
  title: "Where Do You Rank? Income & Wealth Percentile Calculator | Dayblip",
  description:
    "Find out your income and wealth percentile in the US. See how you rank compared to every other American — the number may surprise you.",
  alternates: { canonical: "https://www.dayblip.com/tools/where-you-rank" },
  openGraph: {
    title: "Where Do You Rank? Income & Wealth Percentile Calculator | Dayblip",
    description:
      "Find out your income and wealth percentile in the US. See how you rank compared to every other American — the number may surprise you.",
    url: "https://www.dayblip.com/tools/where-you-rank",
    type: "website",
    images: [{ url: "https://www.dayblip.com/api/og/tools", width: 1200, height: 630, alt: "Where Do You Rank? — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Where Do You Rank? Income & Wealth Percentile Calculator | Dayblip",
    description:
      "Find out your income and wealth percentile in the US. See how you rank compared to every other American — the number may surprise you.",
    images: ["https://www.dayblip.com/api/og/tools"],
  },
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "US Income and Wealth Percentile Calculator",
  url: "https://www.dayblip.com/tools/where-you-rank",
  description:
    "Find out what income and wealth percentile you are in compared to all Americans using Federal Reserve and Census Bureau data.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What data is used to calculate income percentile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Income percentile is calculated using US Census Bureau Current Population Survey data which tracks household and individual income distributions across all Americans.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between income and wealth percentile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Income is what you earn each year. Wealth or net worth is what you own minus what you owe. Someone can have a high income but low wealth if they spend everything they earn, and vice versa.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as net worth?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Net worth is the total value of everything you own — savings, investments, home equity, retirement accounts, and other assets — minus all your debts including mortgage, car loans, student loans, and credit cards.",
      },
    },
    {
      "@type": "Question",
      name: "Is this US data only?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All percentile data is based on US Federal Reserve Survey of Consumer Finances and US Census Bureau data covering American households.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is this calculator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator uses the most recent publicly available Federal Reserve and Census Bureau distribution data. Individual results are estimates based on where your inputs fall within those distributions.",
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
    { "@type": "ListItem", position: 3, name: "Where Do You Rank?", item: "https://www.dayblip.com/tools/where-you-rank" },
  ],
}

const FAQ_ITEMS = [
  {
    q: "What data is used to calculate income percentile?",
    a: "Income percentile is calculated using US Census Bureau Current Population Survey data which tracks household and individual income distributions across all Americans.",
  },
  {
    q: "What is the difference between income and wealth percentile?",
    a: "Income is what you earn each year. Wealth or net worth is what you own minus what you owe. Someone can have a high income but low wealth if they spend everything they earn, and vice versa.",
  },
  {
    q: "What counts as net worth?",
    a: "Net worth is the total value of everything you own — savings, investments, home equity, retirement accounts, and other assets — minus all your debts including mortgage, car loans, student loans, and credit cards.",
  },
  {
    q: "Is this US data only?",
    a: "Yes. All percentile data is based on US Federal Reserve Survey of Consumer Finances and US Census Bureau data covering American households.",
  },
  {
    q: "How accurate is this calculator?",
    a: "The calculator uses the most recent publicly available Federal Reserve and Census Bureau distribution data. Individual results are estimates based on where your inputs fall within those distributions.",
  },
]

export default function WhereYouRankPage() {
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
            <h1 className="mb-3 text-4xl font-bold text-white">Where Do You Rank?</h1>
            <p className="text-[#a8a8b3]">
              Find out your income and wealth percentile compared to every American.
            </p>
          </div>
        </section>

        <section className="bg-[#16213e] px-6 py-12">
          <div className="mx-auto max-w-[900px]">
            <Breadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "Where Do You Rank?" },
              ]}
            />

            <WhereYouRankClient />

            <FAQAccordion items={FAQ_ITEMS.map(f => ({
              question: f.q,
              answer: f.a
            }))} />

            <AdUnit slot="2847591036" format="leaderboard" className="mt-8" />
            <AuthorByline variant="tool" />
            <LastUpdated date="June 2026" />
            <MethodologyNote text="Income percentile calculated using US Census Bureau Current Population Survey data. Net worth percentile calculated using Federal Reserve Survey of Consumer Finances 2022 data. Percentiles are estimated via linear interpolation between published distribution breakpoints. Approximately 258 million adults used as the US adult population base. All figures are estimates — actual percentiles vary with annual data updates. Income and wealth distributions are for US residents only." />
          </div>
        </section>
      </div>
    </>
  )
}
