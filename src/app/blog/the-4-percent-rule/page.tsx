import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The 4% Rule: The Simple Math Behind Retirement That Changed How People Think About Work",
  description: "The research behind the 4% rule, what it actually says, where it has limits, and how to use it to calculate when you can stop working.",
  url: "https://www.dayblip.com/blog/the-4-percent-rule",
  datePublished: "2026-06-13",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "Financial Independence Date", href: "/tools/fi-date", description: "Calculate the exact date your portfolio can fund your lifestyle indefinitely." },
  { title: "Retirement Savings Calculator", href: "/finance/retirement-savings", description: "Project your retirement balance based on contributions, returns, and time." },
  { title: "Compound Interest Calculator", href: "/finance/compound-interest", description: "See how investments grow over time with regular contributions." },
]

export default function TheFourPercentRulePage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">The 4% Rule</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-orange-900/40 text-orange-300 rounded px-2 py-1">Retirement</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          The 4% Rule: The Simple Math Behind Retirement That Changed How People Think About Work
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          One number, derived from 75 years of market data, became the foundation for a whole generation of retirement planning. Here is what it actually says — and what it does not.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              The 4% rule states that a retiree can withdraw 4% of their portfolio in year one of retirement, then adjust that amount for inflation annually, with a high probability of not running out of money over a 30-year retirement. The inverse — the 25x rule — says you need roughly 25 times your annual expenses saved before you can retire. $50,000 in annual expenses requires a $1,250,000 portfolio.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="The 4% rule explained: the research behind retirement planning that changed how people think about work. dayblip.com/blog/the-4-percent-rule"
            url="https://www.dayblip.com/blog/the-4-percent-rule"
            title="The 4% Rule: The Math Behind Retirement"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <p>
            In 1994, financial planner William Bengen published a paper in the Journal of Financial Planning analyzing how much a retiree could withdraw annually from a balanced portfolio without running out of money. He tested withdrawal rates against historical data going back to 1926 and found that a 4% initial withdrawal rate — adjusted for inflation each subsequent year — had survived every 30-year period in the historical record.
          </p>

          <p>
            That finding became the 4% rule, and it reshaped retirement planning conversations for the next three decades.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Original Research Actually Found</h2>

          <p>
            Bengen tested a portfolio of 50% large-cap US stocks and 50% intermediate-term US government bonds. He looked at every 30-year retirement window in the historical data — someone who retired in 1926 and needed their money to last until 1956, someone who retired in 1927 and needed it through 1957, and so on.
          </p>

          <p>
            The worst historical scenario — a retirement beginning near a market peak, followed by poor returns and high inflation — was the early 1970s. A retiree starting in 1972 faced the 1973–74 market crash and the oil-shock inflation of the mid-1970s simultaneously. Even in that scenario, a 4% withdrawal rate held up over 30 years.
          </p>

          <p>
            Later research by Cooley, Hubbard, and Walz — often called the Trinity Study — confirmed and expanded these findings, testing a wider range of portfolio allocations and time horizons. Their work produced the frequently cited success rates: at a 4% withdrawal rate with a 50/50 stock-bond allocation over 30 years, historical success rates were above 95%.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The 25x Rule: Working Backwards</h2>

          <p>
            The 4% rule has a practical inverse that makes it useful for planning: to know how large your portfolio needs to be, multiply your annual expenses by 25.
          </p>

          <p>
            If you spend $40,000 per year, you need $1,000,000 invested to sustain that spending indefinitely at a 4% withdrawal rate. If you spend $80,000 per year, you need $2,000,000. If you can reduce your annual expenses to $35,000, you need only $875,000.
          </p>

          <p>
            This makes the savings target a function of spending, not just income. Two people earning the same salary but spending at different rates reach financial independence at dramatically different portfolio sizes — and at different times.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Where the Rule Has Limits</h2>

          <p>
            The 4% rule was designed for a 30-year retirement. Someone retiring at 65 and expecting to fund expenses through 95 is well-served by that horizon. Someone retiring at 40 needs to fund 50+ years of expenses — and the historical success rates for 40-year and 50-year time horizons at 4% withdrawal are lower than for 30 years.
          </p>

          <p>
            Research suggests that a more conservative rate — 3.3% to 3.5% — is appropriate for very long retirement horizons. Inverting those rates, a 50-year retirement planner might target 28x to 30x annual expenses rather than 25x.
          </p>

          <p>
            The original research also used only US market data. International data shows more variability — retirees in countries that experienced extended poor market conditions or high inflation would have seen lower success rates at 4%. The US market has historically been among the strongest in the world; projecting that performance forward is not guaranteed.
          </p>

          <p>
            Current yield environments affect the projections as well. The original research period included eras of much higher bond yields. In extended low-yield environments, the bond portion of a balanced portfolio provides less cushion than it historically did.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How to Use It Practically</h2>

          <p>
            The 4% rule works best as a planning tool — a way to estimate the portfolio size you need — rather than as a rigid mechanical withdrawal rule you follow without adjustment.
          </p>

          <p>
            Most financial researchers and practitioners suggest some flexibility in actual withdrawals: spending less in years when markets have declined, spending somewhat more when returns have been strong. This &apos;guardrails&apos; approach tends to increase the probability of portfolio survival while allowing higher average lifetime spending than a rigid annual inflation adjustment.
          </p>

          <p>
            Social Security, pensions, or other income sources reduce the burden on your investment portfolio. A household needing $60,000 per year in retirement that will receive $24,000 per year in Social Security benefits only needs the portfolio to cover $36,000 — implying a target of $900,000 rather than $1,500,000.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What It Changed About How People Think</h2>

          <p>
            Before the 4% rule entered popular consciousness, most retirement planning conversations centered on accumulating as much as possible and hoping it lasted. The rule shifted the conversation: it gave people a specific target, a way to measure progress, and a framework for understanding when enough was actually enough.
          </p>

          <p>
            It also separated the concept of retirement from age. If financial independence is a portfolio size — 25x your annual expenses — then reaching it is a function of how much you save and invest, not how many years you have worked. That reframing accelerated the modern financial independence movement, which treats early retirement as a mathematical problem to be solved rather than a distant milestone to wait for.
          </p>

          <p>
            Whether you plan to retire at 45 or 70, the 4% rule gives you a number to aim for and a way to calculate how far you are from it.
          </p>

        </article>

        <div
          className="mt-12 rounded-xl p-8 text-center"
          style={{ background: "#1e2d4a", border: "1px solid #e94560" }}
        >
          <h2 className="text-white text-2xl font-bold mb-3">Find Your Financial Independence Date</h2>
          <p className="text-[#a8a8b3] mb-6 leading-relaxed">
            Enter your current savings, monthly contributions, and annual expenses to calculate the exact month and year your portfolio can fund your lifestyle indefinitely.
          </p>
          <Link
            href="/tools/fi-date"
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
            Calculate My FI Date →
          </Link>
        </div>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="The 4% rule explained: the research behind retirement planning that changed how people think about work. dayblip.com/blog/the-4-percent-rule"
            url="https://www.dayblip.com/blog/the-4-percent-rule"
            title="The 4% Rule: The Math Behind Retirement"
          />
        </div>

      </div>
    </main>
  )
}
