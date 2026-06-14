import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Is College Worth It in 2026? The ROI Calculation Most People Never Run",
  description: "CS starting salaries run $75K–$100K+. Bootcamp graduates start at $55K–$70K. Average student debt: $29,400. Whether college is worth it depends heavily on your major.",
  url: "https://www.dayblip.com/blog/is-college-worth-it",
  datePublished: "2026-06-13",
  dateModified: "2026-06-13",
  author: { "@type": "Organization", name: "Dayblip" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is college worth it financially in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends heavily on the major. Georgetown University's Center on Education and the Workforce estimates a bachelor's degree produces a $1.2 million lifetime earnings premium on average over a high school diploma. But this average conceals enormous variation: engineering and CS degrees often deliver very high ROI, while some arts and humanities majors may not recoup tuition costs for decades. The average student debt for bachelor's graduates in 2023 was $29,400 (College Board). The right calculation compares the specific major's expected starting salary against the cost of the specific institution.",
      },
    },
    {
      "@type": "Question",
      name: "How do coding bootcamp salaries compare to CS degree salaries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Computer science bachelor's graduates at major tech employers typically start at $75,000–$100,000+, with FAANG and top-tier companies often offering $150,000+ in total compensation. Coding bootcamp graduates generally start at $55,000–$70,000 in their first developer role. The gap narrows within a few years for skilled bootcamp graduates, but the entry-level difference is real. CS degrees also open doors at employers who use the credential as a filter for certain roles.",
      },
    },
  ],
}

const relatedTools = [
  { title: "College ROI Calculator", href: "/finance/college-roi", description: "Calculate the break-even point and lifetime ROI for your specific college and major." },
  { title: "Salary Comparison Tool", href: "/career/salary-comparison", description: "Compare starting salaries by field and degree level." },
  { title: "Debt Freedom Date", href: "/finance/debt-freedom", description: "Calculate when you will pay off student loans under different payment strategies." },
  { title: "Career Timeline Planner", href: "/career/career-timeline", description: "Model your career earnings trajectory with and without a degree." },
]

export default function IsCollegeWorthItPage() {
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
          <span className="text-white">Is College Worth It</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          Is College Worth It in 2026? The ROI Calculation Most People Never Run
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The honest answer depends almost entirely on what you study and where you go. Here is the math that most college-choice conversations skip.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Computer science bachelor&apos;s graduates start at <strong>$75,000–$100,000+</strong>. Coding bootcamp graduates typically start at <strong>$55,000–$70,000</strong>. Average student debt for bachelor&apos;s graduates: <strong>$29,400</strong> (College Board 2023). Georgetown CEW estimates a $1.2 million lifetime earnings premium for a bachelor&apos;s degree on average — but this average hides dramatic variation by major and institution. The ROI of college is a math problem, not a philosophy debate.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="CS degree: $75K–$100K+ starting. Bootcamp: $55K–$70K. Avg student debt: $29,400. Whether college is worth it is a math problem. Most people never run the numbers: www.dayblip.com/blog/is-college-worth-it"
            url="https://www.dayblip.com/blog/is-college-worth-it"
            title="Is College Worth It in 2026? The ROI Calculation Most People Never Run"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Cost Baseline — What College Actually Charges in 2026</h2>

          <p>
            The College Board&apos;s 2023–24 Trends in College Pricing report puts the average published annual cost at:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Institution type</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Avg annual cost</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">4-year total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Private four-year", annual: "$58,600", total: "$234,400" },
                  { type: "Public four-year (out-of-state)", annual: "$44,150", total: "$176,600" },
                  { type: "Public four-year (in-state)", annual: "$28,840", total: "$115,360" },
                  { type: "Community college (in-district)", annual: "$10,700", total: "$21,400 (2yr)" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.type}</td>
                    <td className="px-4 py-3 text-right text-[#FF6B6B]">{row.annual}</td>
                    <td className="px-4 py-3 text-right text-[#FF6B6B] font-semibold">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[#a8a8b3]">
            Source: College Board, Trends in College Pricing 2023–24. Costs include tuition, fees, room, and board. Does not include opportunity cost (foregone income during enrollment).
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">ROI by Major — Starting Salary vs. Cost</h2>

          <p>
            The same four-year degree at the same tuition produces radically different ROI depending on the major. Georgetown University&apos;s Center on Education and the Workforce publishes major-by-major earnings data. The following ranges reflect median early-career earnings:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Major / field</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Median starting salary</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Debt payoff (est.)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: "Computer Science / Software Engineering", salary: "$75,000–$100,000+", payoff: "2–4 years" },
                  { field: "Electrical / Mechanical Engineering", salary: "$70,000–$90,000", payoff: "3–5 years" },
                  { field: "Nursing / Health Sciences", salary: "$62,000–$80,000", payoff: "3–6 years" },
                  { field: "Business / Finance", salary: "$52,000–$72,000", payoff: "5–9 years" },
                  { field: "Education", salary: "$38,000–$48,000", payoff: "10–18 years" },
                  { field: "Fine Arts / Performing Arts", salary: "$32,000–$42,000", payoff: "15–25+ years" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.field}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{row.salary}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{row.payoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[#a8a8b3]">
            Debt payoff estimates assume $29,400 average debt at 5.5% on a standard 10-year repayment plan, adjusted proportionally by income. Source: Georgetown University Center on Education and the Workforce; College Board; National Center for Education Statistics.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Coding Bootcamp vs. CS Degree: The Honest Comparison</h2>

          <p>
            A coding bootcamp costs roughly $10,000–$20,000 and takes 3–6 months. A CS bachelor&apos;s degree costs $115,000–$235,000 over four years at in-state public vs. private tuition, plus four years of foregone income.
          </p>

          <p>
            Bootcamp graduates typically secure their first developer role at $55,000–$70,000. CS bachelor&apos;s graduates at companies that recruit from universities typically start at $75,000–$100,000+. FAANG and top-tier tech companies frequently offer new-grad CS packages of $150,000+ in total compensation including equity.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm">
            <div className="font-semibold text-white mb-3">Break-even comparison (in-state public CS degree vs. bootcamp)</div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-[#a8a8b3]">CS degree: 4-year cost (in-state public)</span><span className="text-[#FF6B6B]">$115,000</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">CS degree: foregone income (4y @ $35K)</span><span className="text-[#FF6B6B]">$140,000</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Bootcamp: cost</span><span className="text-[#FF6B6B]">$15,000</span></div>
              <div className="flex justify-between"><span className="text-[#a8a8b3]">Bootcamp: foregone income (6 months)</span><span className="text-[#FF6B6B]">$17,500</span></div>
              <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-[#a8a8b3]">CS degree salary premium (est.)</span><span className="text-[#F9A825]">$20,000–$30,000/yr</span></div>
              <div className="flex justify-between"><span className="text-white font-bold">CS degree break-even vs. bootcamp</span><span className="text-[#4FC3F7] font-bold">~8–12 years</span></div>
            </div>
          </div>

          <p>
            The CS degree wins on long-run earnings for many workers, particularly at employers where the credential is a filter for senior roles. The bootcamp wins on speed-to-income and lower total investment, especially for career changers in their 30s or 40s. Neither path guarantees employment — the quality of the institution and the individual&apos;s portfolio both matter significantly.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The $1.2 Million Lifetime Premium — And What It Hides</h2>

          <p>
            Georgetown CEW&apos;s widely cited $1.2 million lifetime earnings premium for a bachelor&apos;s degree over a high school diploma is a real finding — but it is an average across all majors and all workers over a 40-year career. It includes high-earning engineers and doctors who significantly raise the average.
          </p>

          <p>
            For specific low-ROI major / high-cost-institution combinations, the math does not support the investment at current tuition levels. A fine arts degree from a $58,600/year private institution, producing $38,000 in starting salary and $180,000 in debt, may not achieve a positive NPV in any reasonable timeframe compared to entering the workforce at 18 and investing the equivalent funds.
          </p>

          <p>
            The financially optimal college choice is a high-ROI major (or one of the licensed professions where degrees are mandatory) at the lowest-cost institution that provides a comparable credential signal in that field. For most STEM careers, this is an in-state public flagship. For medicine, law, and elite finance, the institution&apos;s ranking legitimately affects placement outcomes.
          </p>

          <p className="text-sm text-[#a8a8b3] mt-6">
            Tax situations vary by individual. Educational tax credits (American Opportunity Credit, Lifetime Learning Credit) and student loan interest deductions can reduce the effective cost. Consult a tax professional for advice specific to your situation.
          </p>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="CS degree: $75K–$100K+ starting. Bootcamp: $55K–$70K. Avg student debt: $29,400. Whether college is worth it is a math problem. Most people never run the numbers: www.dayblip.com/blog/is-college-worth-it"
            url="https://www.dayblip.com/blog/is-college-worth-it"
            title="Is College Worth It in 2026? The ROI Calculation Most People Never Run"
          />
        </div>

      </div>
    </main>
  )
}
