import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Build a 6-Month Emergency Fund — Step by Step",
  description: "A fully-funded emergency fund covers 3 to 6 months of essential expenses. For the average American household that means $14,400 to $28,800, kept in a high-yield savings account earning 3.80-4.50% APY in 2026.",
  url: "https://www.dayblip.com/blog/how-to-build-emergency-fund",
  datePublished: "2026-06-24",
  dateModified: "2026-06-24",
  author: { "@type": "Organization", name: "Dayblip" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much should an emergency fund cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An emergency fund should cover 3 to 6 months of essential expenses — not total income or total spending. Essential expenses include rent or mortgage, utilities, groceries, health insurance premiums, minimum debt payments, and transportation to work. For the average American household spending $4,800 per month on essentials, a 6-month fund equals $28,800.",
      },
    },
    {
      "@type": "Question",
      name: "Where should I keep my emergency fund in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A high-yield savings account (HYSA) at an online bank is the right place for an emergency fund in 2026. The best HYSAs pay 3.80-4.50% APY compared to the national average of 0.38% per FDIC data. Both account types are FDIC-insured up to $250,000. The fund should not be in the stock market, CDs, or your checking account.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Compound Interest Calculator", href: "/tools/compound-interest", description: "See how your savings grow over time at different rates." },
  { title: "Debt Payoff Calculator", href: "/tools/debt-payoff", description: "Build a plan to eliminate debt while building savings." },
  { title: "FI Date Calculator", href: "/tools/fi-date", description: "Calculate your financial independence date." },
  { title: "Net Worth Calculator", href: "/finance/net-worth", description: "Track your complete financial picture." },
]

export default function HowToBuildEmergencyFundPage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">How to Build an Emergency Fund</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How to Build a 6-Month Emergency Fund — Step by Step
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most people know they need an emergency fund. Almost nobody has a specific plan for building one. Here is the exact system — including the right target, the right account, and a realistic timeline.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              A fully-funded emergency fund covers 3 to 6 months of essential expenses — not total income. For the average American household spending $4,800 per month on essentials, that means $14,400 for 3 months or $28,800 for 6 months. The fund belongs in a high-yield savings account earning 3.80-4.50% APY in 2026, not a traditional savings account paying the national average of 0.38%. The right target depends on your job stability, number of income sources, and whether you have dependents. Source: FDIC national savings rate average, Bankrate 2026.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="The average American needs $14,400-$28,800 in an emergency fund. In 2026 a HYSA earns 3.80-4.50% APY vs 0.38% at a traditional bank — a $1,000+ annual difference on a full fund. The step-by-step build plan: www.dayblip.com/blog/how-to-build-emergency-fund"
            url="https://www.dayblip.com/blog/how-to-build-emergency-fund"
            title="How to Build a 6-Month Emergency Fund — Step by Step"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why 3 Months Is Not Enough for Most People</h2>

          <p>
            The standard advice is 3 to 6 months of expenses. For most people, the right number is 6 months — and the data explains why. Bureau of Labor Statistics data from 2025 shows the average duration of unemployment is 21.7 weeks. That is over 5 months for the average displaced worker before finding new employment.
          </p>

          <p>
            Two-income households can sometimes manage with 3 months because one income can often cover minimum essentials while the other is temporarily lost. Single-income households need 6 months minimum. Freelancers, self-employed workers, and anyone in a volatile industry should target 9 to 12 months.
          </p>

          <p>
            The right frame is not &ldquo;how much does everybody say to save.&rdquo; It is: how long could you genuinely survive without income at your current essential spending level? That answer determines your target &mdash; not a generic formula.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Calculate Your Actual Target</h2>

          <p>
            Essential expenses only — not total spending. What counts as essential: rent or mortgage payment, utilities (electric, gas, water, internet), groceries (not restaurants), health insurance premiums, minimum debt payments, transportation to work (gas or transit), and child or pet care required for work. What does not count: subscriptions and streaming services, dining out, clothing beyond true necessities, vacations, and entertainment.
          </p>

          <p>
            Most people discover their essential monthly spending is 60 to 70 percent of their total monthly spending when they do this exercise honestly. Here is an example calculation:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Scenario</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Total monthly spending", amount: "$6,800" },
                  { label: "Essential portion (68%)", amount: "$4,600" },
                  { label: "3-month target", amount: "$13,800" },
                  { label: "6-month target", amount: "$27,600" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.label}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825] font-semibold">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            This is the number to save toward — not some generic dollar figure from a headline. Your essential expenses are the only number that matters.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Where to Keep an Emergency Fund in 2026</h2>

          <p>
            The fund must meet three criteria: liquid (accessible within 1 to 2 days), safe (FDIC-insured up to $250,000), and earning a real return — not 0.38%. In 2026, the best high-yield savings accounts pay 3.80 to 4.50% APY according to Bankrate and NerdWallet tracking. The national average savings account rate is 0.38% per FDIC published data.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[#a8a8b3]">$27,600 fund at 0.38% APY</span><span className="text-[#FF6B6B] font-semibold">$105/year</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">$27,600 fund at 4.25% APY</span><span className="text-[#F9A825] font-semibold">$1,173/year</span></div>
            <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-white font-bold">Annual difference</span><span className="text-[#e94560] font-bold text-base">$1,068/year</span></div>
          </div>

          <p>
            That $1,068 annual difference requires no additional risk. Both account types are FDIC-insured up to $250,000 per depositor. Providers currently offering competitive rates include SoFi, Marcus by Goldman Sachs, Ally Bank, and American Express HYSA among others. Rates move with Federal Reserve policy decisions, so the specific rate available will vary over time.
          </p>

          <p>
            What the emergency fund is not: the stock market (too volatile for emergency money), CDs (too illiquid), or your checking account (too tempting to spend).
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Step-by-Step Build Plan</h2>

          <p>
            <strong className="text-white">Step 1: Open the account today.</strong> Open a high-yield savings account before you have a single dollar saved. The psychological act of opening the account is what makes most people actually follow through. An empty account waiting to be filled is more powerful than a plan waiting to be started.
          </p>

          <p>
            <strong className="text-white">Step 2: Set the starter milestone.</strong> $1,000 first. Not 3 months. Not 6 months. Just $1,000. This covers most genuine financial emergencies — car repair, medical bill, unexpected travel — and prevents new credit card debt from those events.
          </p>

          <p>
            <strong className="text-white">Step 3: Automate the transfer.</strong> Decide what you can transfer on payday and set it up automatically. Even $100 per month builds $1,200 per year before interest. $300 per month builds $3,600 per year. The amount matters less than the automation. Manual transfers fail. Automated transfers happen.
          </p>

          <p>
            <strong className="text-white">Step 4: Increase at every raise.</strong> When income increases, increase the automated transfer first — before lifestyle catches up with the new income. This is one of the highest-leverage financial habits available.
          </p>

          <p>
            <strong className="text-white">Step 5: Do not touch it.</strong> This fund is for loss of income and true emergencies only — not vacations, sales, or impulse purchases. Define the criteria for what qualifies as an emergency before you need to use them, when emotion is not a factor.
          </p>

          <p>
            <strong className="text-white">Step 6: Rebuild immediately if used.</strong> If you dip into the fund, restart the automatic transfers to rebuild it as the single top financial priority before resuming any other savings or investing.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How Fast Can You Realistically Get There?</h2>

          <p>
            Using a $27,600 target and 4.25% HYSA interest, here is what different monthly contributions produce:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Monthly Contribution</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Time to Full Fund</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { amount: "$300/month", time: "~8 years" },
                  { amount: "$500/month", time: "~4.5 years" },
                  { amount: "$750/month", time: "~3 years" },
                  { amount: "$1,000/month", time: "~2.3 years" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.amount}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825] font-semibold">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            The fastest paths to accelerate the timeline: direct any tax refund straight to savings, route any bonus or windfall to the fund before it reaches your checking account, sell unused items, or temporarily reduce one major expense while building the fund. Once the fund is fully built, the monthly contribution redirects to investing.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Calculate your exact emergency fund target based on your essential expenses:</p>
            <Link
              href="/finance/savings-calculator"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Savings Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute financial advice. Consult a qualified financial professional for guidance specific to your situation.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="The average American needs $14,400-$28,800 in an emergency fund. In 2026 a HYSA earns 3.80-4.50% APY vs 0.38% at a traditional bank — a $1,000+ annual difference on a full fund. The step-by-step build plan: www.dayblip.com/blog/how-to-build-emergency-fund"
            url="https://www.dayblip.com/blog/how-to-build-emergency-fund"
            title="How to Build a 6-Month Emergency Fund — Step by Step"
          />
        </div>

      </div>
    </main>
  )
}
