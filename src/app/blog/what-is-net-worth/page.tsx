import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Net Worth and Why the Number Most People Know Is Wrong",
  description: "Net worth is assets minus liabilities — but most people miscalculate it in ways that make them feel either richer or poorer than they actually are.",
  url: "https://www.dayblip.com/blog/what-is-net-worth",
  datePublished: "2026-06-13",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "Net Worth Calculator", href: "/finance/net-worth", description: "Track every asset and liability with a full net worth breakdown." },
  { title: "Financial Life Score", href: "/tools/financial-life-score", description: "A broader view of your financial health beyond the single number." },
  { title: "Debt Payoff Calculator", href: "/finance/debt-payoff", description: "See how fast you can eliminate liabilities and grow net worth." },
]

export default function WhatIsNetWorthPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">What Is Net Worth</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          What Is Net Worth and Why the Number Most People Know Is Wrong
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The formula is simple. The errors people make when applying it are consistent — and they compound over time.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Net worth = total assets minus total liabilities. The median US household net worth was $192,700 as of the Federal Reserve&apos;s 2022 Survey of Consumer Finances. The mean was $1,059,470 — pulled dramatically upward by high-wealth households. Median is the number that describes where most people actually are.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="Net worth is assets minus liabilities — but most people calculate it wrong. Here is the correct way. dayblip.com/blog/what-is-net-worth"
            url="https://www.dayblip.com/blog/what-is-net-worth"
            title="What Is Net Worth and Why the Number Most People Know Is Wrong"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <p>
            Net worth is the single number that summarizes your financial position: everything you own minus everything you owe. Assets minus liabilities. That is the complete definition.
          </p>

          <p>
            The calculation is not complicated. Most people who think about their finances have at least a rough idea of the formula. The errors come in what goes into each side of the equation — specifically, what people include, what they exclude, and what they value incorrectly.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Assets: What Actually Counts</h2>

          <p>
            An asset is anything you own that has monetary value and could be converted to cash. The complete list for most people includes: checking and savings account balances, money market and brokerage accounts, retirement accounts (401k, IRA, Roth IRA — at current value, not future projected value), real estate at current market value, vehicles at current market value, business ownership interests, cash value of permanent life insurance (not term), and any other investments.
          </p>

          <p>
            Common errors on the asset side: including things that have sentimental but no realistic liquidation value; using the original purchase price instead of current market value for real estate or vehicles; including future income as an asset (your salary is not an asset — it is future cash flow); and inflating retirement account balances by not accounting for the taxes owed on pre-tax accounts when withdrawn.
          </p>

          <p>
            On that last point: a $500,000 traditional 401k is not equivalent to $500,000 in a Roth IRA. The traditional account will be taxed on withdrawal — potentially at a meaningful effective rate. A precise net worth calculation would apply an estimated future tax rate to pre-tax retirement assets. For a working approximation, most people use the full face value and note that traditional retirement balances overstate after-tax net worth.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Liabilities: What Most People Undercount</h2>

          <p>
            A liability is anything you owe — any debt obligation with a current balance. The complete list: mortgage balance (not the original loan, the current payoff amount), home equity loan or line of credit balance, auto loan balance, student loan balance, credit card balances (the full statement balance, not the minimum payment), medical debt, personal loans, and any other outstanding obligations.
          </p>

          <p>
            Common errors on the liability side: forgetting to include the full mortgage balance (this is usually the largest number and the most frequently omitted); using monthly payment amounts rather than outstanding balances; and omitting accounts with small balances because they feel insignificant.
          </p>

          <p>
            A household with a $450,000 home and a $380,000 mortgage balance has $70,000 in home equity — not $450,000 in assets. The mortgage is a liability that offsets the asset value. This distinction is what makes some homeowners significantly less wealthy than they feel.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Federal Reserve Data Shows</h2>

          <p>
            The Federal Reserve&apos;s Survey of Consumer Finances, published every three years, provides the most comprehensive picture of American household wealth. The 2022 survey found median family net worth of $192,700 — up from $121,700 in 2019, largely driven by home equity appreciation and retirement account growth.
          </p>

          <p>
            Broken down by age, the median figures show a clear trajectory. Families under 35 had median net worth of $39,000. Ages 35–44: $135,300. Ages 45–54: $247,200. Ages 55–64: $364,500. Ages 65–74: $409,900. Ages 75 and older: $335,600.
          </p>

          <p>
            These numbers describe the middle of each age group — half of families in each bracket have less, half have more. They are useful as benchmarks but not as targets. Household size, cost of living, income trajectory, and life choices vary too much for a single number to be a meaningful personal goal.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why the Rate of Change Matters More Than the Level</h2>

          <p>
            Net worth at any single point in time is less useful than the trend over time. A 30-year-old with $40,000 in net worth who is adding $12,000 per year is in a substantially better position than a 45-year-old with $200,000 in net worth who has been flat for three years.
          </p>

          <p>
            The directional question is: is your net worth growing, flat, or declining? The magnitude question is: by how much? For most working-age adults, growing net worth means spending less than you earn, reducing debt faster than it accrues, and allowing investment accounts to compound.
          </p>

          <p>
            Tracking net worth quarterly or annually — using the same methodology each time — turns it from a snapshot into a measurement of financial momentum. That is the number worth paying attention to.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Number That Does Not Tell You Everything</h2>

          <p>
            Net worth is a balance sheet number. It does not measure income, cash flow, job security, emergency fund adequacy, insurance coverage, or any of the other components of financial health. A household with $500,000 in net worth and $800 per month in credit card interest is not in the same position as a household with $500,000 in net worth and no consumer debt.
          </p>

          <p>
            It also does not distinguish between liquid and illiquid wealth. A household with $400,000 in home equity and $20,000 in savings cannot easily deploy that equity in an emergency. Liquidity matters — a net worth calculation that does not separate accessible assets from locked-up equity tells an incomplete story.
          </p>

          <p>
            Calculate the full number. Then look at what is driving it, how quickly it is changing, and how much of it you could actually access in a crisis. That full picture is what the single figure cannot show you.
          </p>

        </article>

        <div
          className="mt-12 rounded-xl p-8 text-center"
          style={{ background: "#1e2d4a", border: "1px solid #e94560" }}
        >
          <h2 className="text-white text-2xl font-bold mb-3">Calculate Your Net Worth</h2>
          <p className="text-[#a8a8b3] mb-6 leading-relaxed">
            Enter your assets and liabilities to get your complete net worth breakdown — home equity, retirement accounts, debts, and everything in between.
          </p>
          <Link
            href="/finance/net-worth"
            style={{
              display: "inline-block",
              background: "#e94560",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "14px 28px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Calculate My Net Worth →
          </Link>
        </div>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="Net worth is assets minus liabilities — but most people calculate it wrong. Here is the correct way. dayblip.com/blog/what-is-net-worth"
            url="https://www.dayblip.com/blog/what-is-net-worth"
            title="What Is Net Worth and Why the Number Most People Know Is Wrong"
          />
        </div>

      </div>
    </main>
  )
}
