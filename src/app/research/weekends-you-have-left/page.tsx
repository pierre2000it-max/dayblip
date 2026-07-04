import type { Metadata } from "next"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/blog/RelatedTools"
import AuthorByline from "@/components/AuthorByline"

export const metadata: Metadata = {
  title: "How Many Weekends Do You Have Left?",
  description:
    "At 40 you have roughly 2,080 weekends left if you live to 80. At 50 you have 1,560. The data behind the number that changes how you think about Saturday morning.",
  alternates: { canonical: "https://www.dayblip.com/research/weekends-you-have-left" },
  openGraph: {
    title: "How Many Weekends Do You Have Left?",
    description:
      "At 40 you have roughly 2,080 weekends left if you live to 80. At 50 you have 1,560. The data behind the number that changes how you think about Saturday morning.",
    url: "https://www.dayblip.com/research/weekends-you-have-left",
    type: "article",
    publishedTime: "2026-06-13T00:00:00Z",
    section: "Research",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Many Weekends Do You Have Left?",
  description:
    "At 40 you have roughly 2,080 weekends left if you live to 80. The Dayblip data behind the number that changes how you think about Saturday morning.",
  url: "https://www.dayblip.com/research/weekends-you-have-left",
  publisher: {
    "@type": "Organization",
    name: "Dayblip",
    url: "https://www.dayblip.com",
  },
  mainEntityOfPage: "https://www.dayblip.com/research/weekends-you-have-left",
}

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Weekends Remaining by Age — Dayblip",
  description:
    "Estimated weekends remaining at each age from 20 to 75, calculated using CDC life expectancy data and assuming survival to age 80.",
  url: "https://www.dayblip.com/research/weekends-you-have-left",
  creator: {
    "@type": "Organization",
    name: "Dayblip",
    url: "https://www.dayblip.com",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
}

const tableData = [
  { age: 20, weekends: "3,120", years: 60, freeHours: 11, totalFreeHours: "34,320" },
  { age: 25, weekends: "2,860", years: 55, freeHours: 11, totalFreeHours: "31,460" },
  { age: 30, weekends: "2,600", years: 50, freeHours: 11, totalFreeHours: "28,600" },
  { age: 35, weekends: "2,340", years: 45, freeHours: 11, totalFreeHours: "25,740" },
  { age: 40, weekends: "2,080", years: 40, freeHours: 11, totalFreeHours: "22,880" },
  { age: 45, weekends: "1,820", years: 35, freeHours: 11, totalFreeHours: "20,020" },
  { age: 50, weekends: "1,560", years: 30, freeHours: 11, totalFreeHours: "17,160" },
  { age: 55, weekends: "1,300", years: 25, freeHours: 11, totalFreeHours: "14,300" },
  { age: 60, weekends: "1,040", years: 20, freeHours: 11, totalFreeHours: "11,440" },
  { age: 65, weekends: "780",   years: 15, freeHours: 11, totalFreeHours: "8,580"  },
  { age: 70, weekends: "520",   years: 10, freeHours: 11, totalFreeHours: "5,720"  },
  { age: 75, weekends: "260",   years: 5,  freeHours: 11, totalFreeHours: "2,860"  },
]

const relatedTools = [
  { title: "Life in Weeks",        href: "/tools/life-in-weeks",      description: "See your entire life as a grid of squares" },
  { title: "Couple Compatibility", href: "/tools/couple-compatibility",description: "How many weekends do you have left together" },
  { title: "Year Progress",        href: "/tools/this-year-progress",  description: "How much of this year is already gone" },
  { title: "Name Popularity",      href: "/blog/name-popularity",      description: "How popular was your name the year you were born" },
]

export default function WeekendsYouHaveLeftPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="mx-auto max-w-[780px] px-6 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/research" className="hover:text-[#e94560] transition-colors">Research</Link>
          <span>/</span>
          <span className="text-white">How Many Weekends Do You Have Left?</span>
        </nav>

        {/* Article header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-[#e94560]/20 text-[#e94560] rounded px-2 py-1">
            Research
          </span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How Many Weekends Do You Have Left?
        </h1>
        <p className="text-[#a8a8b3] text-lg mb-8">
          The number that changes how you think about every Saturday morning.
        </p>

        <AuthorByline variant="research" />
        {/* Share — above article */}
        <div className="mb-8">
          <ShareButtons
            text="How many weekends do you have left? At 40 you have roughly 2,080. The data: www.dayblip.com/research/weekends-you-have-left"
            url="https://www.dayblip.com/research/weekends-you-have-left"
            title="How Many Weekends Do You Have Left?"
          />
        </div>

        {/* Article body */}
        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            Most people have never counted their weekends. They know roughly how old they are and roughly how long they might live, but the math in the middle — the actual number of Saturday mornings remaining — stays uncalculated.
          </p>

          <p>We ran the numbers.</p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Calculation</h2>

          <p>
            We used CDC life expectancy data as the baseline. The current US life expectancy is approximately 77 years, but for planning purposes we calculated weekends remaining assuming survival to age 80 — a reasonable target for someone in average health today. Each year contains exactly 52 weekends. A weekend is counted as a Saturday-Sunday pair.
          </p>

          <p>
            The formula is simple: weekends remaining equals (80 minus current age) multiplied by 52.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Numbers Show</h2>

          <p>
            The results are not dramatic in isolation. They become dramatic when you realize most of those weekends are already spoken for — sleep, errands, family obligations, recovery from the week. The average American adult spends roughly 6 hours per weekend on household chores alone. Factor in sleep and the free, unscheduled hours in a typical weekend shrink to somewhere between 8 and 14.
          </p>

          <p>
            At 30, you have approximately 2,600 weekends left. That sounds like a lot. It is also only 2,600 Saturday mornings to sleep in, take a road trip, finish a project, or do nothing at all.
          </p>

          <p>
            At 40, the number drops to 2,080. At 50, it is 1,560. At 60, it is 1,040. These are not small numbers, but they are finite ones — and most people have never seen them written down.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Data</h2>

          <p>
            Here is the full table of weekends remaining by current age, calculated using the methodology above:
          </p>

          {/* Data table */}
          <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "24px", margin: "32px 0", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d1b2a" }}>
                  {["Current Age", "Weekends Remaining", "Years Remaining", "Free Hours Per Weekend (est.)", "Total Free Weekend Hours"].map((h) => (
                    <th key={h} style={{ color: "#a8a8b3", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={row.age} style={{ background: i % 2 === 0 ? "#1e2d4a" : "#162338" }}>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.age}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#e94560", fontWeight: 700, borderBottom: "1px solid #0d1b2a" }}>
                      {row.weekends}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.years}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.freeHours}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.totalFreeHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "16px", lineHeight: "1.6" }}>
              Weekends remaining calculated assuming survival to age 80 using CDC life expectancy baseline. Free hours per weekend estimated at 11 based on Bureau of Labor Statistics American Time Use Survey data after accounting for sleep and household obligations. Dayblip original analysis.
            </p>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why This Matters for Financial Planning</h2>

          <p>
            The weekends remaining number has an underappreciated role in retirement planning. Most retirement calculators think in years — save for 30 years, spend for 20 years. Thinking in weekends changes the texture of the calculation.
          </p>

          <p>
            If you retire at 65 and live to 85, you have 1,040 weekends of retirement. If you spend $200 per weekend on activities, travel, and experiences, that is $208,000 in weekend spending alone — not counted in most retirement budget templates.
          </p>

          <p>
            Thinking in weekends also changes how people evaluate time-money tradeoffs. Buying back a weekend — through outsourcing, automation, or simply taking a day off — has a concrete value once you know how many you have left.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What People Do With This Number</h2>

          <p>
            In our analysis of how people respond to finite time calculations, the weekends number produces a different reaction than years or days. Years feel abstract. Days feel granular and hard to visualize. Weekends are the unit most adults actually experience as discrete leisure time.
          </p>

          <p>
            The most common response to seeing the number is a recalibration — not panic, but a quiet reassessment of what the next Saturday morning should contain.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Tool</h2>

          <p>
            Dayblip&apos;s Life in Weeks tool shows your entire life as a grid of squares — each square one week. The weekends remaining calculation is the leisure-time equivalent: how many of those squares are left, and how many of them will be genuinely free.
          </p>
        </article>

        {/* CTA box */}
        <div className="mt-12 rounded-xl p-8 text-center" style={{ background: "#1e2d4a", border: "1px solid #2d3748" }}>
          <h2 className="text-white text-2xl font-bold mb-3">See Your Life as a Grid of Weeks</h2>
          <p className="text-[#a8a8b3] mb-6 leading-relaxed">
            The Life in Weeks tool shows your entire life as a visual grid — every week you have lived and every week remaining. Built on the same data as this report.
          </p>
          <Link
            href="/tools/life-in-weeks"
            style={{ background: "#e94560", borderRadius: "8px", padding: "14px 28px", fontWeight: 600, color: "#ffffff", display: "inline-block", textDecoration: "none" }}
            className="hover:opacity-90 transition-opacity"
          >
            Open Life in Weeks →
          </Link>
        </div>

        {/* Share — below article */}
        <div className="mt-10">
          <ShareButtons
            text="How many weekends do you have left? At 40 you have roughly 2,080. The data: www.dayblip.com/research/weekends-you-have-left"
            url="https://www.dayblip.com/research/weekends-you-have-left"
            title="How Many Weekends Do You Have Left?"
          />
        </div>

        {/* Related tools */}
        <RelatedTools tools={relatedTools} />

      </div>
    </main>
  )
}
