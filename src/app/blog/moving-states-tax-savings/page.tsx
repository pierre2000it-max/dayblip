import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { stateIncomeTax } from "@/lib/stateTax"

// All state-tax figures are computed from src/lib/stateTax.ts (single filer, standard deduction).
const SALARY = 75000
const MOVE_COST = 7000 // assumption, not a national average
const FV_FACTOR = (Math.pow(1.07, 30) - 1) / 0.07
const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const tax = (st: string) => stateIncomeTax(st, SALARY, "single")
const CA = tax("CA")
const OR = tax("OR")
const HI = tax("HI")
const CA_FV = CA * FV_FACTOR
const CA_MONTHS = Math.ceil((MOVE_COST / CA) * 12)
const ROWS = [
  { from: "Oregon", st: "OR", to: "Washington / Texas / Florida" },
  { from: "Hawaii", st: "HI", to: "Florida / Texas / WY" },
  { from: "Minnesota", st: "MN", to: "South Dakota / WY" },
  { from: "Illinois", st: "IL", to: "Florida / Texas" },
  { from: "New York", st: "NY", to: "Florida / Texas" },
  { from: "California", st: "CA", to: "Texas / Nevada / WY" },
].map((r) => ({ ...r, save: tax(r.st), future: tax(r.st) * FV_FACTOR }))

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Tax Case for Moving States: What Relocating Actually Saves You",
  description: `Moving from California to Texas saves ${usd(CA)} a year in state income tax on a $75,000 salary. Invested at 7% for 30 years, that grows to ${usd(CA_FV)}.`,
  url: "https://www.dayblip.com/blog/moving-states-tax-savings",
  datePublished: "2026-06-13",
  dateModified: "2026-10-21",
  author: { "@type": "Organization", name: "Dayblip" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do you save by moving from California to Texas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `On a $75,000 salary and a single filer with the standard deduction, moving from California to Texas saves about ${usd(CA)} per year in state income tax. Texas has no state income tax. On an assumed $7,000 move cost, the break-even is about ${CA_MONTHS} months. Over 30 years invested at a constant 7%, the annual savings would grow to about ${usd(CA_FV)}, an illustration rather than a forecast.`,
      },
    },
    {
      "@type": "Question",
      name: "Does cost of living offset state tax savings when moving?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on where you move within the destination state. Texas has no income tax, but Austin and Dallas median home prices have risen significantly. Rural or suburban Texas remains substantially cheaper than coastal California. The tax savings are certain and calculable; the cost-of-living difference depends heavily on the specific cities being compared. Always calculate both before deciding.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Cost of Living Comparison", href: "/finance/cost-of-living", description: "Compare housing, groceries, and total costs between any two US cities." },
  { title: "Paycheck Calculator", href: "/finance/paycheck-calculator", description: "Calculate take-home pay for your salary in any state." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Your exact net pay after all taxes and deductions." },
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "See your federal and state marginal and effective tax rates." },
]

export default function MovingStatesTaxSavingsPage() {
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
          <span className="text-white">Moving States Tax Savings</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          The Tax Case for Moving States: What Relocating Actually Saves You
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Moving from a high-tax state to a no-tax state is the largest single tax lever most middle-income earners have. Here is the actual math.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Moving from California to Texas on a $75,000 salary saves <strong>{usd(CA)} per year</strong> in state income tax (single filer, 2026 rules). Oregon to Washington saves {usd(OR)}, and Hawaii to Florida saves {usd(HI)}. An assumed $7,000 move breaks even in about {CA_MONTHS} months for California to Texas. Invested at a constant 7% for 30 years, the California-to-Texas savings would grow to about <strong>{usd(CA_FV)}</strong>.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Moving CA → TX saves about ${usd(CA)}/year in state tax on a $75K salary. Invested at 7% for 30 years that is about ${usd(CA_FV)}. Full breakdown: www.dayblip.com/blog/moving-states-tax-savings`}
            url="https://www.dayblip.com/blog/moving-states-tax-savings"
            title="The Tax Case for Moving States: What Relocating Actually Saves You"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Biggest Moves — Annual Savings on a $75,000 Salary</h2>

          <p>
            The annual savings from relocating out of a high-tax state are fixed and computable. Unlike market returns or salary negotiations, the tax rules are published. The table below shows the annual state income tax savings from moving from each high-tax state to a no-income-tax state, on a $75,000 gross salary, single filer, 2026.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Moving from</th>
                  <th className="text-left px-4 py-3 text-white font-semibold">Moving to</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Annual savings</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">30-yr at 7%</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.from}</td>
                    <td className="px-4 py-3 text-[#a8a8b3]">{row.to}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825] font-semibold">{usd(row.save)}</td>
                    <td className="px-4 py-3 text-right text-[#4FC3F7]">~{usd(Math.round(row.future / 1000) * 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[#a8a8b3]">
            Methodology: $75,000 gross salary, single filer, 2026 standard deduction ($16,100). Federal tax identical in all cases. State tax computed from DayblipState tax is computed from Dayblip&apos;s 2026 state tax tables (standard deduction only; credits and local taxes not included).apos;s 2026 state tax tables (standard deduction only; credits and local taxes not included). 30-year figure uses FV = annual savings × ((1.07³⁰ − 1)/0.07).
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">California to Texas: The Numbers in Detail</h2>

          <p>
            On $75,000, a California resident filing as single with the standard deduction pays about {usd(CA)} in state income tax under the site&apos;s 2026 state tax tables. A Texas resident on the same salary pays $0. That difference is about {usd(CA / 12)} per month. California&apos;s top brackets are steep, but at this income most of the salary falls in the lower and middle brackets, which is why the saving is smaller than many headlines suggest.
          </p>

          <p>
            Move costs vary widely with distance, home size and whether an employer pays. This article assumes $7,000 as a round figure, so substitute your own quote. At {usd(MOVE_COST)} and {usd(CA)} a year in savings, the break-even point is {(MOVE_COST / CA).toFixed(1)} years, or about {CA_MONTHS} months. Every year after that is a net positive, before cost-of-living differences.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="font-semibold text-white mb-3">CA → TX break-even analysis ($75,000 salary)</div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Annual state income tax savings</span><span className="text-[#F9A825] font-semibold">{usd(CA)}</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Assumed move cost</span><span className="text-[#FF6B6B]">{usd(MOVE_COST)}</span></div>
            <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-[#a8a8b3]">Break-even point</span><span className="text-white font-semibold">~{CA_MONTHS} months</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">Cumulative savings at year 5</span><span className="text-[#F9A825] font-semibold">{usd(CA * 5)}</span></div>
            <div className="flex justify-between"><span className="text-white font-bold">Invested 30y at 7%</span><span className="text-[#4FC3F7] font-bold">~{usd(Math.round(CA_FV / 1000) * 1000)}</span></div>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Cost-of-Living Caveat</h2>

          <p>
            Tax savings are only one part of the equation. Moving to a no-tax state in a high-cost metro can shrink the savings or erase them. A rent or mortgage difference of a few hundred dollars a month is the same size as the tax saving. Compare housing in the specific cities you are weighing, not state averages, and run the numbers before you commit.
          </p>

          <p>
            The clearest wins are moves from high-tax, high-cost states to lower-cost metros within no-tax states. Moving from the San Francisco Bay Area to San Antonio, or from Portland to Wyoming, typically preserves most or all of the tax savings because the cost-of-living delta also works in the mover&apos;s favor.
          </p>

          <p>
            Moves from high-tax states to low-cost metros within no-tax states (suburban Texas, rural Nevada, inland Washington) capture the full tax benefit plus a housing discount. These are where the lifetime impact is largest.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the 30-Year Compounding Number Actually Means</h2>

          <p>
            The {usd(Math.round(CA_FV / 1000) * 1000)} figure for California-to-Texas at 7% assumes the annual {usd(CA)} tax saving is invested consistently each year. It does not assume a lump-sum investment. The formula is a standard future value of an annuity:
          </p>

          <p className="bg-[#16213e] rounded-lg p-4 font-mono text-sm text-[#4FC3F7]">
            FV = {usd(CA)} × ((1.07³⁰ − 1) / 0.07) = {usd(CA)} × {FV_FACTOR.toFixed(2)} ≈ {usd(Math.round(CA_FV / 1000) * 1000)}
          </p>

          <p>
            A constant 7% a year is an assumption, not a forecast. Real returns vary year to year and can be negative. This is illustrative; consult a financial advisor before making relocation decisions based on investment projections.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Tax Residency Rules: What Counts as Leaving</h2>

          <p>
            Relocating for tax purposes requires genuinely establishing domicile in the new state — not just renting an address. California in particular has aggressive sourcing rules and can pursue former residents who maintain substantial California ties. Criteria that matter: where you sleep most nights, where your primary bank accounts are, where your vehicle is registered, where your family lives, where your professional licenses are held.
          </p>

          <p>
            Generally, 183 days or more in a new state, combined with a genuine change of domicile (updated license, voter registration, bank accounts), establishes residency for most states. California may still tax income earned in California by remote workers if the employer is California-based, depending on work arrangements. Tax residency rules vary by individual situation — consult a tax professional for advice specific to your circumstances.
          </p>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Moving CA → TX saves about ${usd(CA)}/year in state tax on a $75K salary. Invested at 7% for 30 years that is about ${usd(CA_FV)}. Full breakdown: www.dayblip.com/blog/moving-states-tax-savings`}
            url="https://www.dayblip.com/blog/moving-states-tax-savings"
            title="The Tax Case for Moving States: What Relocating Actually Saves You"
          />
        </div>

      </div>
    </main>
  )
}
