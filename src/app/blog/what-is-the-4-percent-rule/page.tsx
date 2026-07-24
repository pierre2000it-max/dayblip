import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What Is the 4% Rule and Does It Still Work in 2026?",
  "description": "The 4% rule was first proposed by William Bengen in 1994 and further analyzed in the 1998 Trinity Study by Cooley Hubbard and Walz. Multiply annual retirement spending by 25. At $50,000/year spending you need $1,250,000.",
  "datePublished": "2026-07-25",
  "dateModified": "2026-07-25",
  "author": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
  "publisher": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
  "url": "https://www.dayblip.com/blog/what-is-the-4-percent-rule",
  "isAccessibleForFree": true,
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the 4% rule for retirement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 4% rule states that you can withdraw 4% of your retirement portfolio in year one then adjust for inflation each subsequent year and have a high historical probability of not running out of money over a 30-year retirement. It was first proposed by financial planner William Bengen in his 1994 paper Determining Withdrawal Rates Using Historical Data and was further supported by the Trinity Study published in 1998 by professors Cooley Hubbard and Walz at Trinity University.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I calculate my retirement number using the 4% rule?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiply your expected annual retirement spending by 25. If you plan to spend $40,000 per year you need $1,000,000. At $60,000 per year you need $1,500,000. At $80,000 per year you need $2,000,000. This is because 4% of $1,000,000 is $40,000 — the math works as the inverse of 4% which is multiplying by 25. Social Security income reduces the portfolio size you need since it covers part of your annual spending.",
      },
    },
    {
      "@type": "Question",
      "name": "Does the 4% rule still work in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 4% rule is a historical framework based on US market data from 1926 to 1995. Some researchers including Wade Pfau now suggest a more conservative 3.3% to 3.5% withdrawal rate given current market valuations and longer potential retirement periods. The rule remains a useful starting point for most planners but should be combined with flexibility to reduce spending in poor market years and an accounting of Social Security income which reduces the portfolio size needed.",
      },
    },
  ],
}

const relatedTools = [
  { title: "FI Date Calculator", href: "/tools/fi-date", description: "See your exact financial independence date" },
  { title: "Retirement Savings", href: "/finance/retirement-savings", description: "Are you on track for retirement?" },
  { title: "Compound Interest", href: "/tools/compound-interest", description: "See how investments grow over time" },
  { title: "Net Worth Calculator", href: "/finance/net-worth", description: "Track total assets minus liabilities" },
]

export default function WhatIsThe4PercentRulePage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-8">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">What Is the 4% Rule</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-orange-900/40 text-orange-300 rounded px-2 py-1">Retirement</span>
          <span className="text-[#a8a8b3] text-sm">6 min read</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          What Is the 4% Rule and Does It Still Work in 2026?
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most people have heard of the 4% rule. Fewer know where it came from, what it actually claims, and whether it still holds for retirements longer than thirty years.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              The 4% rule states that you can withdraw 4% of your retirement portfolio in year one then adjust for inflation annually and have a high historical probability of not running out of money over a 30-year retirement. It was first proposed by financial planner William Bengen in 1994 and further analyzed in the 1998 Trinity Study by professors Philip Cooley Carl Hubbard and Daniel Walz at Trinity University. The practical formula: multiply your expected annual retirement spending by 25 to find your portfolio target. At $40,000/year spending you need $1,000,000. At $60,000/year: $1,500,000. At $80,000/year: $2,000,000. Social Security income reduces the portfolio size needed significantly &mdash; if you will receive $20,000 per year in benefits you only need to fund the remaining $20,000 to $40,000 from your portfolio. Some researchers now suggest 3.3% to 3.5% as safer for longer retirement horizons.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="The 4% rule: multiply annual retirement spending by 25. At $50K/year you need $1.25M. At $80K/year you need $2M. Social Security reduces the number. Some researchers now suggest 3.3-3.5%. The full explanation and 2026 caveats:"
            url="https://www.dayblip.com/blog/what-is-the-4-percent-rule"
            title="What Is the 4% Rule and Does It Still Work in 2026?"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Where the 4% Rule Actually Comes From</h2>

          <p>
            Most people have heard of the 4% rule. Fewer people know it has a specific origin &mdash; and that the origin matters for understanding what the rule actually claims.
          </p>

          <p>
            In 1994 a financial planner named William Bengen published a paper called Determining Withdrawal Rates Using Historical Data. Bengen analyzed US stock and bond market returns going back decades and asked a simple question: what is the highest withdrawal rate a retiree could have sustained in the worst historical periods without running out of money over thirty years?
          </p>

          <p>His answer was 4%.</p>

          <p>
            Not 4% as a guarantee. Not 4% as the optimal number. 4% as the rate that had never failed in the historical data he analyzed &mdash; what he called the SAFEMAX.
          </p>

          <p>
            Four years later in 1998 three finance professors at Trinity University in Texas &mdash; Philip Cooley Carl Hubbard and Daniel Walz &mdash; published their own analysis under the title Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable. Their work examined different portfolio compositions and withdrawal rates across historical market cycles including the Great Depression and the stagflation of the 1970s.
          </p>

          <p>
            Their finding broadly supported Bengen: a 4% withdrawal rate on a balanced portfolio of stocks and bonds had historically high success rates over thirty-year periods.
          </p>

          <p>
            The two pieces of research together became what the personal finance world now calls the 4% rule.
          </p>

          <p>
            One important thing Bengen himself has noted: the rule was designed for a traditional retirement starting at sixty-five covering thirty years. It was not designed for someone retiring at forty who needs the portfolio to last fifty years.
          </p>

          <p className="text-sm text-[#a8a8b3]">
            Source: Bengen 1994 Journal of Financial Planning. Cooley Hubbard Walz 1998 AAII Journal.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Multiply by 25 Formula &mdash; Your Retirement Number</h2>

          <p>
            The 4% rule produces a remarkably simple calculation. If you can sustainably withdraw 4% of your portfolio each year then you need 25 times your annual spending saved and invested. Four percent and twenty-five are mathematical inverses.
          </p>

          <p>Here is what that looks like at common spending levels:</p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-4">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a", borderBottom: "1px solid #0f3460" }}>
                  <th className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">Annual spending</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Portfolio needed (25×)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { spending: "$30,000", portfolio: "$750,000" },
                  { spending: "$40,000", portfolio: "$1,000,000" },
                  { spending: "$50,000", portfolio: "$1,250,000" },
                  { spending: "$60,000", portfolio: "$1,500,000" },
                  { spending: "$70,000", portfolio: "$1,750,000" },
                  { spending: "$80,000", portfolio: "$2,000,000" },
                  { spending: "$100,000", portfolio: "$2,500,000" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.spending}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: "#F9A825" }}>{row.portfolio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            These numbers assume your portfolio is the only source of retirement income. Most people will also receive Social Security which changes the math in a significant way.
          </p>

          <p>
            Example: You expect to spend $60,000 per year in retirement and will receive $18,000 per year in Social Security benefits. Your portfolio only needs to fund the remaining $42,000.
          </p>

          <p>$42,000 &times; 25 = $1,050,000</p>

          <p>
            Instead of needing $1,500,000 you need $1,050,000 &mdash; a $450,000 difference from one input changing.
          </p>

          <p>
            Your Social Security benefit estimate is available for free at ssa.gov/myaccount and takes about five minutes to check.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Does the 4% Rule Still Work in 2026?</h2>

          <p>This is the honest answer: it depends on what you are asking it to do.</p>

          <p>
            The original research used US market data from 1926 to 1995. The portfolios that succeeded at 4% over thirty years survived the Great Depression the inflation of the 1970s and multiple severe bear markets. The rule is not fragile &mdash; it was specifically designed around worst-case historical scenarios.
          </p>

          <p>
            <strong className="text-white">The argument for using 4%:</strong> The rule held through every period of major market stress in the data. A balanced portfolio of stocks and bonds has recovered from every historical downturn to date. Inflation-adjusted withdrawal means your spending power is maintained not just your dollar amount.
          </p>

          <p>
            <strong className="text-white">The argument for going lower:</strong> Some researchers &mdash; most notably Wade Pfau whose work on safe withdrawal rates has been published in the Journal of Financial Planning &mdash; now suggest that 3.3% to 3.5% may be more appropriate for current conditions. Two reasons drive this view. First current equity valuations measured by metrics like the Shiller CAPE ratio are elevated relative to historical averages suggesting future returns may be lower. Second longer life expectancies mean a thirty-year retirement is increasingly common but many people &mdash; especially those pursuing early retirement &mdash; may need the portfolio to last forty or fifty years not thirty.
          </p>

          <p>
            <strong className="text-white">The practical middle ground:</strong> Most financial planners use 4% as a starting target while building in the intention to be flexible. If markets perform poorly early in retirement &mdash; what researchers call sequence of returns risk &mdash; reducing spending temporarily by even 10% to 15% meaningfully extends portfolio longevity. The 4% rule treated as a rigid unchangeable withdrawal is more fragile than the 4% rule treated as a starting point with room to adjust.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Three Things the 4% Rule Does Not Account For</h2>

          <p>
            <strong className="text-white">1. Retirement spending is not flat.</strong> The rule assumes constant inflation-adjusted spending from year one through year thirty. Real retirement spending tends to follow a smile curve &mdash; higher in the early active years of retirement when travel and experiences dominate lower in the middle years as activity naturally slows and higher again in the later years when healthcare costs escalate. Building spending flexibility into the model and being willing to spend more early and less during down markets makes the 4% rule more durable not less.
          </p>

          <p>
            <strong className="text-white">2. Social Security timing changes the number more than most people realize.</strong> Claiming Social Security at age 62 versus age 70 produces approximately a 77% difference in monthly benefit for someone born after 1960. The higher the Social Security income the smaller the portfolio needs to be. For someone whose Social Security benefit covers $24,000 per year of a $60,000 annual spending target the portfolio only needs to fund $36,000 per year &mdash; not $60,000. That changes the retirement number from $1,500,000 to $900,000. This is one of the most overlooked levers in retirement planning.
          </p>

          <p>
            <strong className="text-white">3. Geographic flexibility changes everything and the rule ignores it.</strong> The same $60,000 per year buys a fundamentally different lifestyle depending on where you spend it. A retiree in rural Portugal or Mexico City or Chattanooga Tennessee lives very differently than a retiree in Manhattan or San Francisco on the same annual withdrawal. For people with flexibility on location the effective safe withdrawal rate can increase significantly because the lifestyle can be maintained on less. The rule does not know where you live. You do.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "24px", textAlign: "center", margin: "32px 0" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Calculate your specific financial independence date and the portfolio you need at your current savings rate:</p>
            <Link
              href="/tools/fi-date"
              style={{ display: "inline-block", background: "#e94560", color: "white", padding: "12px 24px", borderRadius: "6px", fontWeight: 600, textDecoration: "none", fontSize: "15px" }}
            >
              FI Date Calculator &rarr;
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute investment or financial advice. The 4% rule is a historical framework based on past market returns and is not a guarantee of future results. Individual retirement outcomes depend on many factors including actual investment returns inflation spending patterns and Social Security income. Consult a qualified financial professional for retirement planning guidance specific to your situation.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div style={{ borderTop: "1px solid #2a3f5f", paddingTop: "32px", marginTop: "32px" }}>
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="The 4% rule: multiply annual retirement spending by 25. At $50K/year you need $1.25M. At $80K/year you need $2M. Social Security reduces the number. Some researchers now suggest 3.3-3.5%. The full explanation and 2026 caveats:"
            url="https://www.dayblip.com/blog/what-is-the-4-percent-rule"
            title="What Is the 4% Rule and Does It Still Work in 2026?"
          />
        </div>

      </div>
    </main>
  )
}
