import type { Metadata } from "next";
import PriceHistoryTool from "./PriceHistoryTool";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedTools from "@/components/RelatedTools";
import LastUpdated from "@/components/LastUpdated";
import MethodologyNote from "@/components/MethodologyNote";
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

const URL = "https://www.dayblip.com/price-history";
const TITLE = "Historical Price Comparison: What Things Cost";
const DESCRIPTION =
  "Compare what gas, bread, milk, houses and cars cost from 1950 to 2026, plus an inflation calculator for any decade. Free, no signup required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["historical prices", "what did things cost in 1990", "price history", "inflation calculator", "gas prices 1990"],
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    question: "What did a gallon of gas cost in 1990?",
    answer:
      "In this comparison, a gallon of gas cost about $1.16 in 1990. The 2026 estimate is about $3.20, a rise of roughly 176%. Gas rose slower than most items on the list over the same period.",
  },
  {
    question: "How much is $100 in 1990 worth today?",
    answer:
      "About $249 in 2026 dollars. The calculator divides a 2026 CPI projection of 325.0 by the 1990 CPI-U annual average of 130.7, which gives a multiplier of about 2.49.",
  },
  {
    question: "How much did the average house cost in 1980?",
    answer:
      "About $76,400 in this data, against an estimated $420,000 in 2026. That is a rise of roughly 450%, more than the 3.9x rise in the general price level over the same years.",
  },
  {
    question: "Which items rose the most since 1950?",
    answer:
      "Of the 8 items here, a cup of coffee rose the most in percentage terms, from about $0.05 to $5.50. Houses rose about 57x and bread about 32x. Gas and milk rose less than the general price level.",
  },
  {
    question: "Are these prices exact?",
    answer:
      "No. Past prices are rounded national averages and the 2026 prices are estimates. Use the percentage changes as a guide, not as an official statistic.",
  },
];

export default function PriceHistoryPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          webApplicationSchema("Historical Price Comparison", DESCRIPTION, URL, "UtilitiesApplication", "2026-10-04"),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com/" },
            { name: "Tools", url: "https://www.dayblip.com/tools" },
            { name: "Historical Price Comparison", url: URL },
          ]),
        ]}
      />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">💰</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Historical Price Comparison</h1>
          <p className="text-lg text-[#a8a8b3]">See what things cost in the past vs what they cost today</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Historical Price Comparison" }]} />

          <div
            style={{
              background: "#1e2d4a",
              borderLeft: "4px solid #e94560",
              borderRadius: "8px",
              padding: "16px 20px",
            }}
          >
            <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>
              Quick Answer
            </div>
            <p style={{ color: "#ffffff", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
              $100 in 1990 buys what about $249 buys in 2026. Over the same years a gallon of gas went from $1.16 to about $3.20,
              a new car from $16,012 to about $48,000, and the average house from $149,800 to about $420,000. Pick a year below to
              compare 8 everyday items.
            </p>
          </div>

          <PriceHistoryTool />

          <article style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.7 }}>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>
              How prices have changed since 1950
            </h2>
            <p style={{ margin: "0 0 16px" }}>
              A gallon of gas cost about $0.27 in 1950 and about $3.20 today, a 12x rise. A loaf of bread went from $0.14 to
              $4.50, a 32x rise. A postage stamp went from 3 cents to 73 cents. The average house went from about $7,354 to
              about $420,000, a 57x rise. The general price level, measured by CPI-U, rose about 13.5x across the same period.
            </p>

            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "24px 0 12px" }}>
              Which items beat inflation
            </h2>
            <p style={{ margin: "0 0 16px" }}>
              Compare each item with the 13.5x rise in the general price level since 1950. Houses (57x), bread (32x), new cars
              (32x) and movie tickets (30x) rose faster. Gas (12x) and milk (5x) rose slower. Coffee shows the biggest jump
              because a cup cost a nickel in 1950 and a café price is far higher now. A price that beats inflation means the item
              got more expensive in real terms, not only in dollars.
            </p>

            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "24px 0 12px" }}>
              Why a 1990 dollar buys less today
            </h2>
            <p style={{ margin: "0 0 16px" }}>
              Inflation lowers what a dollar buys each year. CPI-U tracks the cost of a fixed basket of goods and services. If the
              index was 130.7 in 1990 and is projected at 325.0 in 2026, the same basket costs about 2.49 times as much. The
              inflation calculator above applies that ratio to any amount and any of the 8 decades.
            </p>

            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "24px 0 12px" }}>
              How to read the table
            </h2>
            <p style={{ margin: "0 0 16px" }}>
              Prices alone don&apos;t show whether life got harder to afford. Wages also rose over these decades, so a 57x rise
              in house prices does not mean a 57x harder purchase. Use the table to see the direction and size of each change, and
              compare it with the general inflation rate to see which costs outran the average.
            </p>
          </article>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 16px" }}>
              Frequently asked questions
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {FAQS.map((f) => (
                <div key={f.question}>
                  <h3 style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600, margin: "0 0 6px" }}>{f.question}</h3>
                  <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div>
            <MethodologyNote text="Past prices are rounded U.S. national averages for each year. The 2026 prices are estimates, so treat percentage changes as approximate. Inflation adjustments use CPI-U annual averages with a 2026 projection of 325.0." />
            <LastUpdated date="October 2026" />
          </div>

          <RelatedTools
            tools={[
              { emoji: "📈", title: "Inflation Calculator", desc: "See what any amount was worth in past years", href: "/finance/inflation" },
              { emoji: "🎂", title: "Born In Year", desc: "Songs, prices and facts from your birth year", href: "/born-in" },
              { emoji: "🏠", title: "Cost of Living Compare", desc: "Compare living costs between U.S. cities", href: "/finance/cost-of-living" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
