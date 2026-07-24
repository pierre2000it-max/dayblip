import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The True Cost of Student Loans — What You Actually Pay Back",
  "description": "Federal undergraduate student loan rate for 2025-26 is 6.39% per the US Department of Education. A $30,000 loan at 6.39% on standard 10-year repayment costs $10,800 in interest and $40,800 total. Extended to 20 years: $53,280.",
  "datePublished": "2026-07-25",
  "dateModified": "2026-07-25",
  "author": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
  "publisher": { "@type": "Organization", "name": "Dayblip", "url": "https://www.dayblip.com" },
  "url": "https://www.dayblip.com/blog/true-cost-of-student-loans",
  "isAccessibleForFree": true,
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are federal student loan interest rates in 2025-2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Federal student loan interest rates for loans disbursed July 1 2025 through June 30 2026 per the US Department of Education are: 6.39% fixed for Direct Subsidized and Unsubsidized Loans for undergraduates 7.94% fixed for Direct Unsubsidized Loans for graduate students and 8.94% fixed for Direct PLUS Loans for parents and graduate students. Rates are fixed for the life of each loan and apply only to loans disbursed in that academic year.",
      },
    },
    {
      "@type": "Question",
      "name": "How much interest do you pay on a $30,000 student loan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A $30,000 federal student loan at the 2025-26 undergraduate rate of 6.39% on the standard 10-year repayment plan has a monthly payment of approximately $340 and total interest paid of approximately $10,800 meaning you repay approximately $40,800 on a $30,000 loan. Extended to a 20-year repayment term the monthly payment drops to approximately $222 but total interest paid increases to approximately $23,280 and total repaid becomes approximately $53,280.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it better to pay off student loans quickly or use income-driven repayment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The standard 10-year plan minimizes total interest paid. On a $30,000 loan at 6.39% the difference in total interest between 10-year and 20-year repayment is approximately $12,480. Income-driven repayment plans make sense primarily in two situations: when income is genuinely too low to afford standard payments in the early career years or when pursuing Public Service Loan Forgiveness where working in government or nonprofit for 10 years while making income-driven payments results in the remaining balance being forgiven.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Debt Payoff Calculator", href: "/tools/debt-payoff", description: "See your exact student loan payoff timeline" },
  { title: "Compound Interest", href: "/tools/compound-interest", description: "See what loan payments invested would become" },
  { title: "College ROI", href: "/tools/college-roi", description: "Calculate the return on your degree investment" },
  { title: "Net Worth Calculator", href: "/finance/net-worth", description: "Track total assets minus liabilities" },
]

export default function TrueCostOfStudentLoansPage() {
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
          <span className="text-white">True Cost of Student Loans</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          The True Cost of Student Loans &mdash; What You Actually Pay Back
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most borrowers know the amount they borrowed. Almost nobody calculates the total amount they will repay before signing &mdash; or what those same monthly payments would have grown to if invested instead.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Federal student loan rates for loans disbursed July 1 2025 through June 30 2026 per the US Department of Education: 6.39% for undergraduate Direct Loans 7.94% for graduate Direct Unsubsidized Loans and 8.94% for PLUS Loans. On a $30,000 undergraduate loan at 6.39% on the standard 10-year repayment plan the monthly payment is approximately $340 and total interest paid is approximately $10,800 &mdash; meaning you repay $40,800 on a $30,000 loan. At $50,000 balance total interest on standard repayment is approximately $17,920. Extending to a 20-year income-driven term reduces monthly payments but significantly increases total interest paid &mdash; on the same $30,000 loan total interest grows to approximately $23,280.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="A $30,000 student loan at 6.39% (2025-26 federal rate) costs $10,800 in interest on standard 10-year repayment. Extended to 20 years: $23,280 in interest. At $50,000 the opportunity cost of those payments not invested adds $97,000+ in forgone growth. The full calculation:"
            url="https://www.dayblip.com/blog/true-cost-of-student-loans"
            title="The True Cost of Student Loans — What You Actually Pay Back"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Starting Number Most Borrowers Never Look Up</h2>

          <p>
            Most people who take out a student loan know the amount they are borrowing. Fewer know the interest rate they are borrowing at. Almost nobody calculates the total amount they will repay before signing.
          </p>

          <p>
            Federal student loan rates are set annually by Congress based on the yield of the 10-year Treasury note from May plus a fixed add-on that depends on the loan type. The rates are fixed for the life of each loan. What you borrow at in your freshman year stays at that rate for the entire repayment period regardless of what rates do afterward.
          </p>

          <p>For loans disbursed July 1 2025 through June 30 2026 per the US Department of Education:</p>

          <p><strong className="text-white">Direct Subsidized Loans for undergraduates:</strong> 6.39% fixed.</p>
          <p><strong className="text-white">Direct Unsubsidized Loans for undergraduates:</strong> 6.39% fixed.</p>
          <p><strong className="text-white">Direct Unsubsidized Loans for graduate or professional students:</strong> 7.94% fixed.</p>
          <p><strong className="text-white">Direct PLUS Loans for parents and graduate students:</strong> 8.94% fixed.</p>

          <p>
            One distinction that matters for undergraduates: subsidized loans do not accrue interest while you are enrolled at least half-time. Unsubsidized loans accrue interest from the day they are disbursed &mdash; even while you are still in school. Interest that accrues during enrollment capitalizes meaning it is added to the principal balance when repayment begins. A $10,000 unsubsidized loan taken out in freshman year may have a balance of $10,900 or more by the time payments start.
          </p>

          <p className="text-sm text-[#a8a8b3]">
            Source: US Department of Education Federal Student Aid 2025-26 interest rate announcement.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Common Balances Actually Cost to Repay</h2>

          <p>
            All examples below use the standard 10-year repayment plan at the 2025&ndash;26 undergraduate rate of 6.39%.
          </p>

          <p className="text-sm text-[#a8a8b3]">
            Monthly payment formula: P &times; (r &times; (1+r)^n) / ((1+r)^n &minus; 1) &mdash; Monthly rate r = 0.0639/12 = 0.005325 &mdash; n = 120 months for 10-year plan
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-4">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a", borderBottom: "1px solid #0f3460" }}>
                  <th className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">Balance</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Monthly payment</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Total interest</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Total repaid</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { balance: "$20,000", payment: "~$227", interest: "$7,240", total: "$27,240" },
                  { balance: "$30,000", payment: "~$340", interest: "$10,800", total: "$40,800" },
                  { balance: "$50,000", payment: "~$566", interest: "$17,920", total: "$67,920" },
                  { balance: "$100,000 (7.94%)", payment: "~$1,210", interest: "$45,200", total: "$145,200" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9] font-semibold">{row.balance}</td>
                    <td className="px-4 py-3 text-right text-[#c9d1d9]">{row.payment}</td>
                    <td className="px-4 py-3 text-right" style={{ color: "#FF6B6B" }}>{row.interest}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: "#F9A825" }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Note: these calculations assume a single loan at a single rate. Most borrowers have multiple loans disbursed across multiple years at different rates. The real calculation requires running the numbers on each loan separately and adding them together. The pattern holds: on a standard 10-year plan you repay approximately $1.36 for every dollar of undergraduate principal at today&rsquo;s rates.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How Income-Driven Plans Change the Total Cost</h2>

          <p>
            Income-driven repayment plans lower monthly payments by extending the repayment period. This is genuinely helpful when income is genuinely low. The trade-off is substantially more total interest paid over the life of the loan.
          </p>

          <p>$30,000 at 6.39% &mdash; comparison by plan:</p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-4">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a", borderBottom: "1px solid #0f3460" }}>
                  <th className="px-4 py-3 text-left text-[#a8a8b3] font-semibold">Plan</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Monthly payment</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Total interest</th>
                  <th className="px-4 py-3 text-right text-[#a8a8b3] font-semibold">Total repaid</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: "Standard 10-year", payment: "$340", interest: "$10,800", total: "$40,800" },
                  { plan: "Extended 20-year", payment: "~$222", interest: "~$23,280", total: "~$53,280" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.plan}</td>
                    <td className="px-4 py-3 text-right text-[#c9d1d9]">{row.payment}</td>
                    <td className="px-4 py-3 text-right" style={{ color: i === 1 ? "#FF6B6B" : "#c9d1d9" }}>{row.interest}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: "#F9A825" }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            The difference: a $118 reduction in monthly payment costs $12,480 in additional lifetime interest &mdash; a 115% increase in interest cost to reduce the payment by about 35%.
          </p>

          <p>
            <strong className="text-white">When income-driven repayment makes sense:</strong> When income is genuinely insufficient to cover standard payments in the early career years without hardship. When pursuing Public Service Loan Forgiveness &mdash; PSLF requires 10 years of employment with a qualifying government or nonprofit employer while making qualifying income-driven payments. The remaining balance is then forgiven. This can be very valuable for borrowers with high balances and careers in public service.
          </p>

          <p>
            <strong className="text-white">When income-driven repayment costs you:</strong> When you can afford standard payments but choose income-driven for the lower monthly number. The math over time is not favorable unless forgiveness at 20 or 25 years is realistic and the tax implications of forgiven amounts have been considered.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Opportunity Cost &mdash; What Those Payments Could Have Become</h2>

          <p>
            There is a cost to student loan payments that does not appear on any statement. It is the investment growth that those dollars would have generated if they had been invested instead of paid to a loan servicer.
          </p>

          <p>
            The $340 monthly payment on a $30,000 loan over 10 years is not only $40,800 in repayment. It is also $340 per month that cannot go toward a Roth IRA a brokerage account or an emergency fund during the same ten years.
          </p>

          <p>$340 per month invested at 7% average annual return over 10 years grows to approximately $58,800.</p>

          <p>At $50,000 in loans the $566 monthly payment over 10 years at 7% would have grown to approximately $98,000.</p>

          <p>
            That is the opportunity cost: not the interest paid but the compound growth foregone on those payments during the repayment window.
          </p>

          <p>
            This does not mean borrowing for education is wrong. A degree that generates $20,000 more in annual income fully justifies the total cost of a $30,000 loan. The ROI in that case is clear. What changes is how you think about the borrow-versus-save decision at the margin.
          </p>

          <p>
            The decision about how much to borrow for college is one of the most consequential financial decisions most people make &mdash; often before they fully understand personal finance. The true cost is the total repayment plus the opportunity cost of those payments not invested. Running that number before signing &mdash; not after &mdash; is the only way to make the decision with eyes open.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "24px", textAlign: "center", margin: "32px 0" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Calculate your exact student loan payoff timeline and total interest paid on any balance:</p>
            <Link
              href="/tools/debt-payoff"
              style={{ display: "inline-block", background: "#e94560", color: "white", padding: "12px 24px", borderRadius: "6px", fontWeight: 600, textDecoration: "none", fontSize: "15px" }}
            >
              Debt Payoff Calculator &rarr;
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only. Student loan costs depend on loan amounts interest rates repayment plans and individual circumstances. Federal loan rates change annually. Consult studentaid.gov for the most current rate information and a qualified financial advisor for guidance specific to your situation. The opportunity cost calculations shown assume historical average returns and do not predict future investment results.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div style={{ borderTop: "1px solid #2a3f5f", paddingTop: "32px", marginTop: "32px" }}>
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="A $30,000 student loan at 6.39% (2025-26 federal rate) costs $10,800 in interest on standard 10-year repayment. Extended to 20 years: $23,280 in interest. At $50,000 the opportunity cost of those payments not invested adds $97,000+ in forgone growth. The full calculation:"
            url="https://www.dayblip.com/blog/true-cost-of-student-loans"
            title="The True Cost of Student Loans — What You Actually Pay Back"
          />
        </div>

      </div>
    </main>
  )
}
