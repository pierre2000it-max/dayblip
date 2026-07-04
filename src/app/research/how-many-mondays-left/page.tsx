import type { Metadata } from "next"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/blog/RelatedTools"
import AuthorByline from "@/components/AuthorByline"

export const metadata: Metadata = {
  title: "How Many Mondays Do You Have Left in Your Career?",
  description:
    "At 35 you have roughly 1,500 Mondays left before retirement at 65. At 45 you have 1,000. The data behind the number that reframes how you think about every work week.",
  alternates: { canonical: "https://www.dayblip.com/research/how-many-mondays-left" },
  openGraph: {
    title: "How Many Mondays Do You Have Left in Your Career?",
    description:
      "At 35 you have roughly 1,500 Mondays left before retirement at 65. At 45 you have 1,000. The data behind the number that reframes how you think about every work week.",
    url: "https://www.dayblip.com/research/how-many-mondays-left",
    type: "article",
    publishedTime: "2026-06-13T00:00:00Z",
    section: "Research",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Many Mondays Do You Have Left in Your Career?",
  description:
    "At 35 you have roughly 1,500 Mondays left before retirement at 65. The Dayblip data behind the number that reframes how you think about every work week.",
  url: "https://www.dayblip.com/research/how-many-mondays-left",
  publisher: {
    "@type": "Organization",
    name: "Dayblip",
    url: "https://www.dayblip.com",
  },
  mainEntityOfPage: "https://www.dayblip.com/research/how-many-mondays-left",
}

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Career Mondays Remaining by Age — Dayblip",
  description:
    "Estimated Mondays remaining in a typical career at each age from 22 to 64, calculated assuming retirement at age 65 and 50 working weeks per year.",
  url: "https://www.dayblip.com/research/how-many-mondays-left",
  creator: {
    "@type": "Organization",
    name: "Dayblip",
    url: "https://www.dayblip.com",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
}

const tableData = [
  { age: 22, mondays: "2,150", years: 43, valuePerMonday: "$1,145", totalValue: "$2,461,750" },
  { age: 25, mondays: "2,000", years: 40, valuePerMonday: "$1,145", totalValue: "$2,290,000" },
  { age: 30, mondays: "1,750", years: 35, valuePerMonday: "$1,145", totalValue: "$2,003,750" },
  { age: 35, mondays: "1,500", years: 30, valuePerMonday: "$1,145", totalValue: "$1,717,500" },
  { age: 40, mondays: "1,250", years: 25, valuePerMonday: "$1,145", totalValue: "$1,431,250" },
  { age: 45, mondays: "1,000", years: 20, valuePerMonday: "$1,145", totalValue: "$1,145,000" },
  { age: 50, mondays: "750",   years: 15, valuePerMonday: "$1,145", totalValue: "$858,750"   },
  { age: 55, mondays: "500",   years: 10, valuePerMonday: "$1,145", totalValue: "$572,500"   },
  { age: 60, mondays: "250",   years: 5,  valuePerMonday: "$1,145", totalValue: "$286,250"   },
  { age: 62, mondays: "150",   years: 3,  valuePerMonday: "$1,145", totalValue: "$171,750"   },
  { age: 64, mondays: "50",    years: 1,  valuePerMonday: "$1,145", totalValue: "$57,250"    },
]

const relatedTools = [
  { title: "True Hourly Wage",           href: "/tools/true-hourly-wage",        description: "What your job actually pays per hour of your life" },
  { title: "Financial Independence Date", href: "/tools/fi-date",                 description: "The exact date you could stop working" },
  { title: "Am I Underpaid?",            href: "/tools/salary-checker",           description: "Check your salary against market rate" },
  { title: "Weekends You Have Left",     href: "/research/weekends-you-have-left", description: "The companion report on your leisure time" },
]

export default function HowManyMondaysLeftPage() {
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
          <span className="text-white">How Many Mondays Do You Have Left?</span>
        </nav>

        {/* Article header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-[#e94560]/20 text-[#e94560] rounded px-2 py-1">
            Research
          </span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How Many Mondays Do You Have Left in Your Career?
        </h1>
        <p className="text-[#a8a8b3] text-lg mb-8">
          Most people have never counted them. The number is smaller than you think.
        </p>

        <AuthorByline variant="research" />
        {/* Share — above article */}
        <div className="mb-8">
          <ShareButtons
            text="How many Mondays do you have left in your career? At 35 you have roughly 1,500. The data: www.dayblip.com/research/how-many-mondays-left"
            url="https://www.dayblip.com/research/how-many-mondays-left"
            title="How Many Mondays Do You Have Left in Your Career?"
          />
        </div>

        {/* Article body */}
        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            Nobody counts their Mondays. They know roughly how many years they have left to work, but the actual number of Monday mornings — the specific count of times the alarm goes off before a work day — stays uncalculated.
          </p>

          <p>We counted them.</p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Calculation</h2>

          <p>
            We used a retirement age of 65 — the full Social Security retirement age for Americans born after 1960. We assumed 50 working weeks per year to account for vacation and holidays. Each working week contains one Monday.
          </p>

          <p>
            The formula: Mondays remaining equals 65 minus your current age, multiplied by 50.
          </p>

          <p>
            We also calculated the dollar value of each remaining Monday using Bureau of Labor Statistics data. Median weekly earnings for full-time US workers hit $1,145 in Q4 2024. Each Monday starts a week worth approximately that.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Numbers Actually Show</h2>

          <p>
            At 22 you have 2,150 Mondays left. That sounds like a lot. Most of them are already allocated — to a specific employer, a specific building, a specific set of people you did not pick.
          </p>

          <p>
            At 35 the number is 1,500. At 45 it is 1,000. At 55 it is 500.
          </p>

          <p>
            Five hundred. That is less than ten years of work weeks. Most people at 55 have never seen that number. When they do, the Sunday dread gets a shape.
          </p>

          <p>
            The total career earnings picture shifts too. At 35 with 1,500 Mondays left at median wages, total remaining career value is approximately $1.7 million gross. At 55 with 500 Mondays it is $572,500. Same wages. Different count.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Each Monday Is Worth</h2>

          <p>
            The per-Monday framing does something to salary negotiation that annual figures do not.
          </p>

          <p>
            A $5,000 raise sounds meaningful. Spread across 1,500 remaining Mondays it is $3.33 per Monday — about $167 per remaining work week. The same raise at 55 with 500 Mondays left is $10 per Monday, $500 per week. Three times the per-unit value for the same dollar amount, simply because the pool of remaining weeks is smaller.
          </p>

          <p>
            This is the math behind pushing harder on salary in your 40s and 50s. Every dollar per hour gained applies to a concentrated number of remaining hours. Most people never run that calculation.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Monday as a Unit</h2>

          <p>
            Five year plans. Ten year visions. Retirement in twenty years.
          </p>

          <p>
            None of those land the way the Monday count does. You do not experience your career in years — you experience it one work week at a time. Your salary arrives in 26 or 52 increments. Your vacation days are measured in weeks. Your performance reviews come roughly every 52 Mondays.
          </p>

          <p>
            Thinking in Mondays does not change the number of them. It makes each one count as a discrete thing with a value and an endpoint.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Buyback Calculation</h2>

          <p>
            Every percentage point increase in savings rate buys back Mondays. Someone who saves aggressively enough to retire at 55 instead of 65 eliminates 500 Mondays from their mandatory total. At median wages that is roughly $572,500 in labor they no longer have to perform.
          </p>

          <p>
            Financial independence is usually framed as freedom. The Monday count makes it concrete — it is a specific number of alarm clocks that never go off.
          </p>

          <p>
            Dayblip&apos;s Financial Independence Date calculator shows the exact date you could stop working based on your current savings rate. The table below shows what you are buying back.
          </p>

          {/* Data table */}
          <div style={{ background: "#1e2d4a", borderRadius: "12px", padding: "24px", margin: "32px 0", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d1b2a" }}>
                  {["Current Age", "Mondays Remaining", "Years Until Retirement", "Value Per Monday", "Total Remaining Career Value"].map((h) => (
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
                      {row.mondays}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.years}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.valuePerMonday}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.totalValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "16px", lineHeight: "1.6" }}>
              Mondays remaining calculated assuming retirement at age 65 and 50 working weeks per year. Value per Monday based on Bureau of Labor Statistics Q4 2024 median weekly earnings for full-time US workers ($1,145). Total remaining career value is a gross earnings estimate before tax. Dayblip original analysis.
            </p>
          </div>
        </article>

        {/* CTA box */}
        <div className="mt-12 rounded-xl p-8 text-center" style={{ background: "#1e2d4a", border: "1px solid #2d3748" }}>
          <h2 className="text-white text-2xl font-bold mb-3">Find Your Financial Independence Date</h2>
          <p className="text-[#a8a8b3] mb-6 leading-relaxed">
            The FI Date calculator shows the exact date you could stop working based on your savings rate and expenses — and how many Mondays you could buy back.
          </p>
          <Link
            href="/tools/fi-date"
            style={{ background: "#e94560", borderRadius: "8px", padding: "14px 28px", fontWeight: 600, color: "#ffffff", display: "inline-block", textDecoration: "none" }}
            className="hover:opacity-90 transition-opacity"
          >
            Calculate My FI Date →
          </Link>
        </div>

        {/* Share — below article */}
        <div className="mt-10">
          <ShareButtons
            text="How many Mondays do you have left in your career? At 35 you have roughly 1,500. The data: www.dayblip.com/research/how-many-mondays-left"
            url="https://www.dayblip.com/research/how-many-mondays-left"
            title="How Many Mondays Do You Have Left in Your Career?"
          />
        </div>

        {/* Related tools */}
        <RelatedTools tools={relatedTools} />

      </div>
    </main>
  )
}
