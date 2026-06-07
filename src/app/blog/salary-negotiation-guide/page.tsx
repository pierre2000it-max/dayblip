import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/blog/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The 10-Minute Conversation Most People Never Have — And What It Costs Them",
  description: "Starting $8,000 below market rate compounds to a $300,000 career earnings gap over 30 years.",
  url: "https://www.dayblip.com/blog/salary-negotiation-guide",
  datePublished: "2026-06-07",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "Salary Negotiation Calculator", href: "/tools/salary-negotiation", description: "Market rate data + negotiation script generator" },
  { title: "Salary Checker", href: "/tools/salary-checker", description: "Are you at, above or below market rate?" },
  { title: "True Hourly Wage", href: "/tools/true-hourly-wage", description: "What your job really pays after all costs" },
  { title: "Career Timeline", href: "/tools/career-timeline", description: "Project your lifetime earnings trajectory" },
]

export default function SalaryNegotiationGuidePage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Salary Negotiation Guide</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-8">
          The 10-Minute Conversation Most People Never Have — And What It Costs Them
        </h1>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Starting a job $8,000 below market rate and accepting the same annual raises as a properly paid peer produces a career earnings gap of $300,000 to $400,000 over 30 years. Virtually no legitimate job offers are rescinded due to reasonable salary negotiation.
            </p>
          </div>
        </section>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">
          <p>
            The average person accepts the first salary offer they receive. Not always — but most of the time. Research from Salary.com and hiring surveys consistently finds that between 55% and 60% of workers do not negotiate their starting salary. Of those who do negotiate, most accept the first counter-offer.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How the Gap Compounds</h2>

          <p>
            Consider two people starting the same job. Same role, same company, same hiring cohort. One accepts the initial offer of $72,000. The other negotiates to $80,000 — $8,000 more at the start. Over the next 30 years, assuming identical 3% annual raises for both:
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="text-left text-[#a8a8b3] pb-2 font-medium">Year</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Non-Negotiator Salary</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Negotiator Salary</th>
                  <th className="text-right text-[#a8a8b3] pb-2 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Year 1", "$72,000", "$80,000", "$8,000"],
                  ["Year 10", "$94,200", "$104,700", "$10,500"],
                  ["Year 20", "$126,500", "$140,600", "$14,100"],
                  ["Year 30", "$169,800", "$188,700", "$18,900"],
                  ["Cumulative gap", "—", "—", "~$340,000"],
                ].map(([yr, a, b, gap]) => (
                  <tr key={yr} className="border-b border-[#2d3748]/50">
                    <td className="text-[#a8a8b3] py-2">{yr}</td>
                    <td className="text-right py-2 text-white">{a}</td>
                    <td className="text-right py-2 text-white">{b}</td>
                    <td className="text-right py-2 text-[#e94560] font-medium">{gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            This figure does not include the compounding effect on retirement savings. If both save 10% of income, the higher earner is contributing more to their portfolio every year. Including investment returns on that difference, the total lifetime wealth gap from a single negotiation can exceed $500,000.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why Most People Do Not Negotiate</h2>

          <p>
            The research on why workers avoid negotiation is consistent. The top reasons are fear the offer will be rescinded, anxiety about seeming ungrateful or aggressive, not knowing the market rate for their role, and not knowing how to structure the conversation.
          </p>

          <p>
            The first fear is empirically unfounded. Studies of hiring managers across industries find that legitimate job offers are almost never rescinded because a candidate asked for more money. The interview process costs companies $5,000 to $15,000 per hire in time invested. Rescinding an offer over a salary negotiation and starting over costs more than paying slightly above the initial offer.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Market Rate Question</h2>

          <p>
            The most useful preparation is understanding what your role actually pays in your market. Sources: Levels.fyi for tech roles, LinkedIn Salary, Glassdoor, Bureau of Labor Statistics Occupational Employment Statistics, and direct conversations with people in your field.
          </p>

          <p>
            You want a defensible number — a specific, sourced figure for what the market pays for your role in your geography at your experience level. Not &quot;I need more&quot; but &quot;market data puts this role at $85,000 to $92,000 in this city, and given my background in X and Y, I am targeting $89,000.&quot;
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Mechanics of the Conversation</h2>

          <p>
            The most important tactic is not aggression or elaborate strategy. It is not providing the first number. When an employer asks for your salary requirements, decline to anchor early: &quot;I would rather focus on finding the right fit. I am confident we can work out compensation if this seems like a good mutual match.&quot; Most employers will respect this framing.
          </p>

          <p>
            When they make an offer, do not accept on the spot. Ask for 24 to 48 hours. When you counter, counter high but within reason — typically 10% to 20% above the initial offer if market data supports it. Have a specific number ready, not a range (giving a range anchors on the bottom). Frame it positively: you are excited about the role and want to make it work.
          </p>

          <p>
            Most negotiations end somewhere in the middle. Targeting $89,000 against an $80,000 offer typically lands at $84,000 to $86,000. That is still $4,000 to $6,000 more than accepting the initial offer — and that gap compounds for the rest of your career.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The ROI Calculation</h2>

          <p>
            A 10-minute negotiation conversation with a $5,000 successful outcome represents a return of $30,000 per hour of time invested. Including compounding effects over a career, the ROI is effectively incalculable.
          </p>

          <p>
            The reason not to negotiate is anxiety. The reason to negotiate is $300,000 in career earnings. Use the calculator below to see the current market rate for your specific role and location — having the actual number is the first step toward having the conversation.
          </p>
        </article>

        <div className="mt-10 pt-8 border-t border-[#2d3748]">
          <p className="text-[#a8a8b3] text-sm mb-4 font-medium">Found this useful? Share it.</p>
          <ShareButtons
            shareText="55–60% of workers never negotiate their starting salary. Starting $8,000 below market = $300,000 career earnings gap:"
            url="https://www.dayblip.com/blog/salary-negotiation-guide"
          />
        </div>

        <RelatedTools tools={relatedTools} />
      </div>
    </main>
  )
}
