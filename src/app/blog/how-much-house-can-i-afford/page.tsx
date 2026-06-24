import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Much House Can I Actually Afford? The Calculation Banks Use vs What You Should Use",
  description: "Banks will approve housing costs up to 28% of gross income (front-end DTI) and 43% total debt (back-end DTI). Most financial planners recommend keeping housing at 25% of net income or below. At a $75,000 salary those are very different numbers.",
  url: "https://www.dayblip.com/blog/how-much-house-can-i-afford",
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
      name: "What is the DTI ratio for a mortgage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DTI stands for Debt-to-Income ratio. Lenders use two versions: Front-end DTI (housing costs only) should stay at or below 28% of gross monthly income for most conventional loans (FHA allows up to 31%). Back-end DTI (all monthly debt payments including housing) should stay at or below 43% for most conventional loans. Source: CFPB Ability-to-Repay rules, 2024.",
      },
    },
    {
      "@type": "Question",
      name: "How much house can I afford on a $75,000 salary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At a $75,000 salary, the bank's 28% front-end DTI maximum allows approximately $1,750 per month in total housing costs (principal, interest, taxes, insurance). At 7% rate on a 30-year mortgage, after subtracting taxes and insurance, this supports a loan of approximately $199,000. With a 10% down payment, that is a home price of approximately $221,000. Financial planners typically recommend keeping housing at 25% of net take-home pay, which on a $75,000 salary is approximately $1,279 per month — supporting a loan of roughly $193,000.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Mortgage Calculator", href: "/finance/mortgage-calculator", description: "Calculate your exact monthly mortgage payment at any rate and term." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Calculate your actual net income after taxes." },
  { title: "Net Worth Calculator", href: "/finance/net-worth", description: "Track your complete financial picture." },
  { title: "American Dream Calculator", href: "/tools/american-dream-calculator", description: "Model the full financial picture of homeownership." },
]

export default function HowMuchHouseCanIAffordPage() {
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
          <span className="text-white">How Much House Can I Afford</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-900/40 text-emerald-300 rounded px-2 py-1">Housing</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How Much House Can I Actually Afford? The Calculation Banks Use vs What You Should Use
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The bank&apos;s maximum approval and your actual affordability ceiling are often very different numbers. Here is how both are calculated — and which one to use.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Most lenders will approve a mortgage where total housing costs do not exceed 28-31% of gross monthly income (the front-end DTI ratio) and where all monthly debt payments including housing do not exceed 43% of gross monthly income (back-end DTI). At a $75,000 salary that means a maximum housing payment of approximately $1,750 per month by the bank&apos;s standard. At 7% interest rate on a 30-year mortgage that supports approximately $263,000 in loan amount before taxes, insurance, and maintenance. However the bank&apos;s maximum and your personal affordability maximum are often very different numbers. Source: CFPB Ability-to-Repay rules, 2024.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="Banks will approve housing costs up to 28% of your GROSS income. Most planners recommend 25% of NET income. On a $75,000 salary those are very different numbers. The full affordability calculation: www.dayblip.com/blog/how-much-house-can-i-afford"
            url="https://www.dayblip.com/blog/how-much-house-can-i-afford"
            title="How Much House Can I Actually Afford? The Full Calculation"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Rule Banks Use — Front-End and Back-End DTI</h2>

          <p>
            DTI stands for Debt-to-Income ratio. Lenders use two versions:
          </p>

          <p>
            <strong className="text-white">Front-end DTI (housing only):</strong> Your total monthly housing costs — principal, interest, property taxes, and insurance — divided by gross monthly income. Most conventional loans require this to stay at or below 28%. FHA loans allow up to 31%.
          </p>

          <p>
            <strong className="text-white">Back-end DTI (all monthly debts):</strong> All monthly minimum debt payments — housing, student loans, car loans, credit card minimums — divided by gross monthly income. Most conventional loans allow up to 43% maximum. Some programs allow up to 50% with compensating factors like a large down payment or excellent credit score.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Calculation — $75,000 Salary</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Gross monthly income", amount: "$6,250" },
                  { label: "28% front-end maximum (housing)", amount: "$1,750/month" },
                  { label: "43% back-end maximum (all debts)", amount: "$2,688/month" },
                  { label: "If $500/month in other debts, housing room is", amount: "$2,188/month" },
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
            The bank approves what it approves. That number is the maximum — not the recommendation. The bank&apos;s interest is in confirming you can repay the loan, not in optimizing your financial wellbeing or retirement savings rate.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What $1,750 Per Month Actually Buys at 7% in 2026</h2>

          <p>
            Working backwards from the front-end DTI ceiling at a $75,000 salary, with the maximum PITI (principal, interest, taxes, insurance) at $1,750 per month:
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Max PITI at 28% DTI</span><span className="text-white font-semibold">$1,750/month</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Less estimated property taxes (1.1%/year on $300K home)</span><span className="text-[#FF6B6B]">−$275/month</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Less homeowners insurance</span><span className="text-[#FF6B6B]">−$150/month</span></div>
            <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-white font-bold">Remaining for mortgage payment</span><span className="text-[#F9A825] font-bold">~$1,325/month</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Loan at 7% / 30 years this supports</span><span className="text-[#F9A825] font-semibold">~$199,000</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">With 10% down — home price</span><span className="text-[#F9A825] font-semibold">~$221,000</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">With 20% down — home price</span><span className="text-[#F9A825] font-semibold">~$249,000</span></div>
          </div>

          <p>
            The median US home price was $420,700 per St. Louis Federal Reserve data for Q1 2026. At this salary level, buying a median-priced home requires either a larger down payment, a dual income, or a salary higher than $75,000 in most markets.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The 28% Rule vs Reality — A More Honest Framework</h2>

          <p>
            The 28% front-end ratio is the bank&apos;s rule for their risk — not a recommendation for your financial life. The problem with 28% of gross is that it ignores taxes. At $75,000 gross, the take-home pay is approximately $61,390 in a no-income-tax state per 2026 IRS data — $5,116 per month net.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Housing Budget Rule</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Monthly Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "28% of $75K gross (bank maximum)", amount: "$1,750" },
                  { label: "28% of $5,116 net (actual take-home)", amount: "$1,432" },
                  { label: "25% of $5,116 net (planner recommendation)", amount: "$1,279" },
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
            The three numbers to know: what the bank will lend (their ceiling), what feels comfortable monthly (your cash flow test), and what lets you still save 10 to 15 percent of income after housing (your real affordability). Number three is the right target.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Down Payment Reality Check</h2>

          <p>
            A 20% down payment on a $350,000 home requires $70,000 in cash before closing costs. Most first-time buyers use lower down payment programs: FHA loans allow 3.5% down with a credit score of 580 or higher, and conventional loans allow 3% down in some programs (such as Fannie Mae HomeReady).
          </p>

          <p>
            The trade-off: less than 20% down requires PMI (private mortgage insurance), typically $50 to $200 per month until 20% equity is reached. On a $315,000 loan this is approximately $131 per month — money that goes entirely to the insurance company and builds no equity.
          </p>

          <p>
            At a $75,000 salary, saving $1,000 per month specifically for a down payment produces: $50,000 in 4.2 years, and $70,000 in 5.8 years. This timeline is why many first-time buyers use lower down payment programs rather than wait — in some markets the home appreciates faster than the savings accumulate, making the waiting strategy counterproductive.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Calculate your exact monthly mortgage payment at any rate, loan amount, and term:</p>
            <Link
              href="/finance/mortgage-calculator"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Mortgage Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute financial advice. Home affordability depends on many individual factors. Consult a qualified mortgage professional for your situation.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="Banks will approve housing costs up to 28% of your GROSS income. Most planners recommend 25% of NET income. On a $75,000 salary those are very different numbers. The full affordability calculation: www.dayblip.com/blog/how-much-house-can-i-afford"
            url="https://www.dayblip.com/blog/how-much-house-can-i-afford"
            title="How Much House Can I Actually Afford? The Full Calculation"
          />
        </div>

      </div>
    </main>
  )
}
