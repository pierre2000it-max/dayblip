import type { Metadata } from "next"
import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/blog/RelatedTools"
import AuthorByline from "@/components/AuthorByline"
import {
  BLS_MEDIAN_WEEKLY_EARNINGS, BLS_EARNINGS_PERIOD, RETIREMENT_AGE, WORK_WEEKS_PER_YEAR, EXAMPLE_RAISE,
  EARLY_RETIREMENT_AGE, MONDAY_ROWS, mondaysLeft, careerValue, raiseLifetimeValue, RAISE_PER_WEEK,
  MONDAYS_META_DESCRIPTION, MONDAYS_OG_DESCRIPTION, MONDAYS_SHARE_TEXT, n, usd, usdM,
} from "@/lib/finiteTime"

// Every figure on this page is computed from src/lib/finiteTime.ts. Nothing is hand-typed.
const boughtBack = mondaysLeft(EARLY_RETIREMENT_AGE)

export const metadata: Metadata = {
  title: "How Many Mondays Do You Have Left in Your Career?",
  description: MONDAYS_META_DESCRIPTION,
  alternates: { canonical: "https://www.dayblip.com/research/how-many-mondays-left" },
  openGraph: {
    title: "How Many Mondays Do You Have Left in Your Career?",
    description: MONDAYS_OG_DESCRIPTION,
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
  description: MONDAYS_OG_DESCRIPTION,
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
    `Estimated Mondays remaining in a typical career at each age from ${MONDAY_ROWS[0].age} to ${MONDAY_ROWS[MONDAY_ROWS.length - 1].age}, calculated assuming retirement at age ${RETIREMENT_AGE} and ${WORK_WEEKS_PER_YEAR} working weeks per year.`,
  url: "https://www.dayblip.com/research/how-many-mondays-left",
  creator: {
    "@type": "Organization",
    name: "Dayblip",
    url: "https://www.dayblip.com",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
}

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
            text={MONDAYS_SHARE_TEXT}
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
            We used a retirement age of {RETIREMENT_AGE}, the age most people still picture when they say &quot;retirement,&quot; even though the full Social Security retirement age for anyone born in 1960 or later is 67. We assumed {WORK_WEEKS_PER_YEAR} working weeks per year to account for vacation and holidays. Each working week contains one Monday.
          </p>

          <p>
            The formula: Mondays remaining equals {RETIREMENT_AGE} minus your current age, multiplied by {WORK_WEEKS_PER_YEAR}.
          </p>

          <p>
            We also calculated the dollar value of each remaining Monday using Bureau of Labor Statistics data. Median weekly earnings for full-time US workers reached {usd(BLS_MEDIAN_WEEKLY_EARNINGS)} in {BLS_EARNINGS_PERIOD}. Each Monday starts a week worth approximately that.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Numbers Actually Show</h2>

          <p>
            At 22 you have {n(mondaysLeft(22))} Mondays left. That sounds like a lot. Most of them are already allocated — to a specific employer, a specific building, a specific set of people you did not pick.
          </p>

          <p>
            At 35 the number is {n(mondaysLeft(35))}. At 45 it is {n(mondaysLeft(45))}. At 55 it is {n(mondaysLeft(55))}.
          </p>

          <p>
            {n(mondaysLeft(55))}. That is {RETIREMENT_AGE - 55} years of work weeks. Most people at 55 have never seen that number. When they do, the Sunday dread gets a shape.
          </p>

          <p>
            The total career earnings picture shifts too. At 35 with {n(mondaysLeft(35))} Mondays left at median wages, total remaining career value is approximately {usdM(careerValue(35))} gross. At 55 with {n(mondaysLeft(55))} Mondays it is {usd(careerValue(55))}. Same wages. Different count.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Each Monday Is Worth</h2>

          <p>
            The per-Monday framing does something to salary negotiation that annual figures do not.
          </p>

          <p>
            A {usd(EXAMPLE_RAISE)} raise sounds meaningful. Per Monday it is {usd(RAISE_PER_WEEK)}: the same {usd(RAISE_PER_WEEK)} a week whether you are 35 or 55. What changes with age is how many Mondays are left to collect it. At 35 that raise pays out over {n(mondaysLeft(35))} Mondays, {usd(raiseLifetimeValue(35))} in total. At 55 it pays out over {n(mondaysLeft(55))} Mondays, {usd(raiseLifetimeValue(55))}. Same raise. A third of the lifetime value.
          </p>

          <p>
            This is the math behind asking early. Every year you wait to negotiate is {WORK_WEEKS_PER_YEAR} Mondays of the raise you never collect, {usd(EXAMPLE_RAISE)} at this example. Most people never run that calculation.
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
            Every percentage point increase in savings rate buys back Mondays. Someone who saves aggressively enough to retire at {EARLY_RETIREMENT_AGE} instead of {RETIREMENT_AGE} eliminates {n(boughtBack)} Mondays from their mandatory total. At median wages that is roughly {usd(careerValue(EARLY_RETIREMENT_AGE))} in labor they no longer have to perform.
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
                {MONDAY_ROWS.map((row, i) => (
                  <tr key={row.age} style={{ background: i % 2 === 0 ? "#1e2d4a" : "#162338" }}>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.age}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#e94560", fontWeight: 700, borderBottom: "1px solid #0d1b2a" }}>
                      {n(row.mondays)}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {row.years}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {usd(row.valuePerMonday)}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "15px", color: "#ffffff", borderBottom: "1px solid #0d1b2a" }}>
                      {usd(row.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: "#a8a8b3", fontSize: "13px", marginTop: "16px", lineHeight: "1.6" }}>
              Mondays remaining calculated assuming retirement at age {RETIREMENT_AGE} and {WORK_WEEKS_PER_YEAR} working weeks per year. Value per Monday based on Bureau of Labor Statistics {BLS_EARNINGS_PERIOD} median weekly earnings for full-time US workers ({usd(BLS_MEDIAN_WEEKLY_EARNINGS)}). Total remaining career value is a gross earnings estimate before tax. Dayblip original analysis.
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
            text={MONDAYS_SHARE_TEXT}
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
