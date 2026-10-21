import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "No Tax on Overtime in 2026: What It Actually Means for Your Paycheck",
  description: "The federal overtime deduction is law for 2025 through 2028. See what qualifies, the $12,500 cap, who phases out, and what it saves you.",
  dateModified: "2026-10-21",
  url: "https://www.dayblip.com/blog/no-tax-on-overtime-2026",
  datePublished: "2026-06-13",
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const relatedTools = [
  { title: "Overtime Tax Calculator", href: "/finance/overtime-tax", description: "See exactly how much you keep after taxes on your overtime hours." },
  { title: "Paycheck Calculator", href: "/finance/paycheck-calculator", description: "Full take-home pay breakdown including federal, state, and FICA." },
  { title: "True Hourly Wage", href: "/tools/true-hourly-wage", description: "What your job actually pays per hour once you count everything." },
]

export default function NoTaxOnOvertimePage() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">No Tax on Overtime 2026</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          No Tax on Overtime in 2026: What It Actually Means for Your Paycheck
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The headline sounds straightforward. The details are not. Here is what the proposal actually does and how to calculate your real number.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Overtime is not tax free, but a federal deduction now exists. Under the 2025 OBBBA law, you can deduct up to $12,500 ($25,000 on a joint return) of the premium part of your overtime pay, the extra half in time-and-a-half. The deduction shrinks above $150,000 of modified adjusted gross income ($300,000 joint). Social Security and Medicare tax still apply. A worker in the 12% bracket with $5,000 of qualifying premium pay saves about $600.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="The federal overtime deduction explained: what it covers, the cap, and what it saves in 2026. dayblip.com/blog/no-tax-on-overtime-2026"
            url="https://www.dayblip.com/blog/no-tax-on-overtime-2026"
            title="No Tax on Overtime in 2026: What It Actually Means for Your Paycheck"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <p>
            &ldquo;No tax on overtime&rdquo; is a slogan, and the law behind it is narrower than the slogan. The One Big Beautiful Bill Act, signed in July 2025, created a federal income tax deduction for qualified overtime compensation. It does not make overtime pay tax free, and it does not change your paycheck withholding by itself. You claim it on your tax return.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Deduction Covers</h2>

          <p>
            Only overtime required by the Fair Labor Standards Act counts, and only the premium portion. If you earn $20 an hour and get $30 an hour for overtime, the extra $10 is what qualifies. The first $20 of each overtime hour is ordinary pay and stays fully taxable. Overtime paid under a union contract or state rule that goes beyond the federal requirement generally does not qualify.
          </p>

          <p>
            The deduction is capped at $12,500 per year, or $25,000 on a joint return. It phases out by $100 for every $1,000 of modified adjusted gross income above $150,000 ($300,000 joint). The statute covers tax years 2025 through 2028. It lowers your income tax only. FICA (Social Security at 6.2% and Medicare at 1.45%) still applies to every overtime dollar, and the IRS confirmed that employment taxes are not reduced.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Who Overtime Rules Apply To</h2>

          <p>
            The FLSA requires overtime at 1.5 times the regular rate for nonexempt employees who work more than 40 hours in a workweek. Exempt employees, generally salaried workers in executive, administrative or professional roles above the salary threshold, are not covered. If you are exempt and work long weeks with no separate overtime pay, you have no qualified overtime to deduct.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Numbers for a Typical Hourly Worker</h2>

          <p>
            Take a warehouse worker who earns $20 an hour, works 40 regular hours a week and 10 overtime hours a week for 50 weeks. Regular pay is $40,000. Overtime pay at $30 an hour is $15,000, so total pay is $55,000.
          </p>

          <p>
            Of that $15,000, the premium part is $10 &times; 500 hours = $5,000. That $5,000 is the deduction. A single filer with $55,000 of pay lands in the 12% bracket after the $16,100 standard deduction. Using the 2026 brackets, federal income tax drops from $4,420 to $3,820, a saving of $600.
          </p>

          <p>
            FICA on the full $55,000 is $4,208 and does not change. So the worker keeps $600 more at tax time, not an extra $15,000.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How to Find Your Own Number</h2>

          <p>
            Step 1: multiply your regular hourly rate by 0.5 to get the premium per overtime hour. Step 2: multiply by your overtime hours for the year. Step 3: cap the result at $12,500 ($25,000 joint) and reduce it if your income is over the phase-out line. Step 4: multiply by your marginal federal rate.
          </p>

          <p>
            The hourly worker above hits only $5,000 of the $12,500 cap. To reach the cap, a worker at $30 an hour would need roughly 833 overtime hours in a year, about 16 extra hours every week. Most people who benefit see a deduction well under the cap, so the real value is usually in the hundreds of dollars, or low thousands at the high end.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How It Shows Up on Your W-2</h2>

          <p>
            Starting with 2026 wages, employers report qualified overtime compensation in Box 12 with code TT. The amount reported is the premium portion, even if part of it is not deductible because of the cap or the phase-out. For 2025 wages, many employers reported it in Box 14 or provided a separate statement, so check your year-end paperwork. Keep your pay stubs: if your W-2 does not break out the premium, they are how you support the number.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The State Tax Question</h2>

          <p>
            Federal law does not force states to follow it. Nine states have no wage income tax (Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming), so there is nothing to deduct there. In the other states, whether overtime gets the same break depends on whether your state conforms to the federal change. Many do not. Check your state revenue department before you assume a state saving.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Planning Around It</h2>

          <p>
            Do not count on a bigger paycheck. Withholding tables did not change, so the benefit arrives as a larger refund or a smaller bill when you file. If you take on extra shifts to chase the deduction, run the after-tax math first: the deduction offsets income tax on the premium half only, and FICA, state tax and the loss of other income-based benefits can still shrink what you keep.
          </p>

        </article>

        <div
          className="mt-12 rounded-xl p-8 text-center"
          style={{ background: "#1e2d4a", border: "1px solid #e94560" }}
        >
          <h2 className="text-white text-2xl font-bold mb-3">Calculate Your Overtime Take-Home Pay</h2>
          <p className="text-[#a8a8b3] mb-6 leading-relaxed">
            Enter your hourly rate and overtime hours to see exactly what you keep after federal tax, state tax, and FICA with and without the overtime deduction.
          </p>
          <Link
            href="/finance/overtime-tax"
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
            Calculate My Overtime →
          </Link>
        </div>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="The federal overtime deduction explained: what it covers, the cap, and what it saves in 2026. dayblip.com/blog/no-tax-on-overtime-2026"
            url="https://www.dayblip.com/blog/no-tax-on-overtime-2026"
            title="No Tax on Overtime in 2026: What It Actually Means for Your Paycheck"
          />
        </div>

      </div>
    </main>
  )
}
