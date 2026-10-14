import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { cities } from "@/data/cost-of-living"
import { adjustForArea, fairRange, verdict, gapCost, FAIR_BAND } from "@/lib/salaryFairness"

// Every dollar figure is computed from src/lib/salaryFairness.ts and the
// cost-of-living indexes in src/data/cost-of-living.ts (national average = 100).
// Literals (not computed): the list of states with pay-range posting laws.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const idx = (slug: string) => cities.find(c => c.slug === slug)!.coliIndex
const MKE = idx("milwaukee")
const CHI = idx("chicago")

const MARKET_CHI = 80000
const MARKET_MKE = adjustForArea(MARKET_CHI, CHI, MKE)
const RANGE = fairRange(MARKET_MKE)
const PAY_OK = 72000
const PAY_LOW = 60000
const GAP = MARKET_MKE - PAY_LOW
const RAISE = 0.03
const BAND_PCT = Math.round(FAIR_BAND * 100)

const MOVES = ["chicago", "austin", "denver", "seattle", "new-york-city", "san-francisco"].map(slug => {
  const c = cities.find(x => x.slug === slug)!
  return { name: c.name, index: c.coliIndex, needed: adjustForArea(PAY_OK, MKE, c.coliIndex) }
})

const GAPS = [5000, 10000, 15000].map(g => ({ g, five: gapCost(g, RAISE, 5), ten: gapCost(g, RAISE, 10) }))

const PAGE_URL = "https://www.dayblip.com/blog/is-my-salary-fair"
const TITLE = "Is My Salary Fair for My Area? A 3-Step Check"

const schema = articleSchema(
  TITLE,
  `A salary is fair if it falls within ${BAND_PCT}% of the local market for your role. A ${usd(MARKET_CHI)} Chicago benchmark equals ${usd(MARKET_MKE)} in Milwaukee, so ${usd(PAY_OK)} is fair there and ${usd(PAY_LOW)} is not.`,
  PAGE_URL,
  "2026-10-14"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I know if I am underpaid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Collect 3 pay benchmarks for your role, adjust them to your area, and take the middle one. If your pay is more than ${BAND_PCT}% below it, you are likely underpaid. One data point is not enough to call it.`,
      },
    },
    {
      "@type": "Question",
      name: "Does cost of living change what a fair salary is?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes, but not one for one. A ${usd(MARKET_CHI)} job in Chicago converts to ${usd(MARKET_MKE)} in Milwaukee on cost of living alone. Employers also pay for the local labor market, so treat the adjusted figure as a guide and use the ${BAND_PCT}% band to absorb the difference.`,
      },
    },
    {
      "@type": "Question",
      name: "Where can I find pay data for my job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use 3 sources: government wage statistics for your occupation and metro area, job postings that list a pay range for similar roles, and what recruiters or peers in your field report. Pay ranges in job postings are required in Colorado, California, Washington and New York, among other places.",
      },
    },
    {
      "@type": "Question",
      name: "How much does being underpaid cost over time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `A ${usd(10000)} gap that grows with 3% raises costs ${usd(GAPS[1].five)} over 5 years and ${usd(GAPS[1].ten)} over 10 years.`,
      },
    },
  ],
}

const relatedTools = [
  { title: "Salary Checker", href: "/tools/salary-checker", description: "Compare your pay to ranges for 80+ job titles." },
  { title: "Salary Negotiation Calculator", href: "/tools/salary-negotiation", description: "Market data plus a negotiation script." },
  { title: "Cost of Living Calculator", href: "/tools/cost-of-living", description: "Compare costs between 50 US cities." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "See what a raise is worth after tax." },
]

export default function IsMySalaryFairPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Is My Salary Fair</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most people judge their pay against a coworker or a number they saw online. Neither tells you what your role pays in your city. Here is a check you can finish in 30 minutes.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Your salary is fair if it falls within {BAND_PCT}% of the local market for your role. Find 3 benchmarks, adjust them to your area, and take the middle one. A {usd(MARKET_CHI)} benchmark from Chicago equals {usd(MARKET_MKE)} in Milwaukee, so a Milwaukee worker at {usd(PAY_OK)} is in range and one at {usd(PAY_LOW)} is not.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Is your salary fair for your area? Pull 3 benchmarks, adjust for cost of living, then check the 10% band: www.dayblip.com/blog/is-my-salary-fair`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Step 1: Pull 3 Benchmarks</h2>

          <p>
            One number can be wrong. Three numbers show a pattern. Collect these for your exact role and level.
          </p>

          <p>
            <strong className="text-white">Government wage data.</strong> The Bureau of Labor Statistics publishes wages by occupation and metro area in its Occupational Employment and Wage Statistics program. It is the least biased source, but it lags by about a year.
          </p>

          <p>
            <strong className="text-white">Job postings with pay ranges.</strong> Colorado, California, Washington and New York, among other places, require employers to post a range. Search for 5 postings with your title and level. Ignore the top and bottom ends and note the middle.
          </p>

          <p>
            <strong className="text-white">People in your field.</strong> Ask a recruiter or 2 peers at other companies what the role pays. Ask for a range, not an exact salary.
          </p>

          <p>
            Take the middle of the 3 numbers. That is your market figure. For a quick first pass, the <Link href="/tools/salary-checker" className="text-[#e94560]">Salary Checker</Link> gives a range by title and years of experience.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Step 2: Adjust for Your Area</h2>

          <p>
            A benchmark from another city does not transfer. Scale it by the cost of living index of each place. The index sets the national average at 100. Milwaukee sits at {MKE} and Chicago at {CHI}.
          </p>

          <p>
            The formula is salary times the new city&apos;s index, divided by the old city&apos;s index. A {usd(MARKET_CHI)} Chicago benchmark becomes {usd(MARKET_CHI)} × {MKE} ÷ {CHI} = {usd(MARKET_MKE)} in Milwaukee.
          </p>

          <p>
            The same math works for a move. Here is what a worker earning {usd(PAY_OK)} in Milwaukee needs elsewhere to hold the same standard of living.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">City</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Cost index</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Pay needed</th>
                </tr>
              </thead>
              <tbody>
                {MOVES.map((m, i) => (
                  <tr key={m.name} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{m.name}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{m.index}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(m.needed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Treat this as a ceiling on the adjustment, not a rule. Employers pay for the local labor market as well as living costs, so real pay gaps between cities often differ from the cost gap. The band in step 3 absorbs that difference. The <Link href="/tools/cost-of-living" className="text-[#e94560]">Cost of Living Calculator</Link> covers 50 cities.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Step 3: Apply the {BAND_PCT}% Band</h2>

          <p>
            Pay for the same role varies by employer, so no one is paid the market figure to the dollar. A fair salary sits within {BAND_PCT}% of it. With a Milwaukee market figure of {usd(MARKET_MKE)}, the fair range is {usd(RANGE.low)} to {usd(RANGE.high)}.
          </p>

          <p>
            <strong className="text-white">{usd(PAY_OK)}:</strong> {verdict(PAY_OK, MARKET_MKE) === "within" ? "inside the range. You are paid fairly for the area." : "outside the range."}
          </p>

          <p>
            <strong className="text-white">{usd(PAY_LOW)}:</strong> {verdict(PAY_LOW, MARKET_MKE) === "below" ? `below the range by ${usd(RANGE.low - PAY_LOW)}. Against the market figure the gap is ${usd(GAP)}. This worker is likely underpaid.` : "inside the range."}
          </p>

          <p>
            Below the band means act. Inside it means your pay is fair, even if a number from a bigger city looked higher. Above it means you are well paid and your risk is a pay freeze, not a gap.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What a Gap Costs Over Time</h2>

          <p>
            A gap does not stay small. Raises are a percent of base pay, so a low base shrinks every raise. The table assumes the gap stays the same share of your pay and you get 3% raises.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Gap today</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Lost over 5 years</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Lost over 10 years</th>
                </tr>
              </thead>
              <tbody>
                {GAPS.map((r, i) => (
                  <tr key={r.g} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{usd(r.g)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.five)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(r.ten)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            The worker at {usd(PAY_LOW)} has a gap of {usd(GAP)}. Left alone, that is {usd(gapCost(GAP, RAISE, 10))} over 10 years before tax. Switching employers resets the base, which is why a job change often closes a gap that annual raises cannot.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">If You Are Below the Band</h2>

          <p>
            <strong className="text-white">1. Write down your 3 benchmarks.</strong> Bring the middle figure and the sources. A range from 3 sources is harder to dismiss than one screenshot.
          </p>

          <p>
            <strong className="text-white">2. Ask for the market figure, not a percentage.</strong> Name the number and tie it to your results from the past year. The <Link href="/blog/salary-negotiation-guide" className="text-[#e94560]">salary negotiation guide</Link> has the script.
          </p>

          <p>
            <strong className="text-white">3. Set a deadline.</strong> If the answer is no, check what similar roles pay at other employers. A real offer is the strongest benchmark you can get.
          </p>

          <p>
            Before you compare, check your pay on the right basis. Weekly earnings by age are in <Link href="/blog/average-salary-by-age" className="text-[#e94560]">average salary by age</Link>, and the <Link href="/blog/true-hourly-wage" className="text-[#e94560]">true hourly wage</Link> article shows what you earn per hour after commute and unpaid time.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What This Check Leaves Out</h2>

          <p>
            Salary is one part of pay. Bonus, equity, health premiums, retirement match and remote work all change the total. Compare total compensation when you can. The cost of living indexes are from 2024 and move slowly, but they are not live figures.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Check your title and experience against market ranges:</p>
            <Link
              href="/tools/salary-checker"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Salary Checker →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute financial or career advice. The examples are illustrations built on cost of living indexes, not a verdict on any person&apos;s pay. Check current data for your role before you negotiate.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Is your salary fair for your area? Pull 3 benchmarks, adjust for cost of living, then check the 10% band: www.dayblip.com/blog/is-my-salary-fair`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
