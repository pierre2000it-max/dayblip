import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import {
  BENCHMARK_SALARY, REPORT_YEAR, STANDARD_DED, TAXABLE_INCOME,
  FEDERAL_INCOME_TAX, SOCIAL_SECURITY_TAX, MEDICARE_TAX, FICA_TAX, FEDERAL_TOTAL, AFTER_FEDERAL,
  FEDERAL_BRACKET_ROWS, NO_TAX_STATES, LOWEST, BOTTOM_FIVE, EXAMPLE_NO_TAX,
  ANNUAL_GAP, MONTHLY_GAP, GROWTH_RATE, CAREER_YEARS, ANNUITY_FACTOR_30, gapCompounded,
  stateFacts, stateRow, usd, pct, approxThousands, listNames, SS_RATE_LABEL, MEDICARE_RATE_LABEL,
  BLOG_CARD_DESCRIPTION,
} from "@/lib/paycheckReport"

// Every figure below is computed from src/lib/paycheckReport.ts (tax2026.ts + stateTax.ts).
const second = BOTTOM_FIVE[1]
const third = BOTTOM_FIVE[2]
const lowFacts = stateFacts(LOWEST.code)
const secondFacts = stateFacts(second.code)
const ca = stateRow("CA")
const caFacts = stateFacts("CA")
const fv30 = approxThousands(gapCompounded(CAREER_YEARS))
const bracketLabel = FEDERAL_BRACKET_ROWS.map((r) => pct(r.rate)).join("/")
const shareText = `Same ${usd(BENCHMARK_SALARY)} salary: ${usd(AFTER_FEDERAL)} take-home in ${EXAMPLE_NO_TAX.name} vs ${usd(LOWEST.takeHome)} in ${LOWEST.name}. State income tax creates a ${usd(ANNUAL_GAP)} annual gap. See all 50 states: www.dayblip.com/blog/paycheck-by-state-2026`
const headline = `Your ${usd(BENCHMARK_SALARY)} Salary Is Worth Very Different Amounts Depending on Your State`

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  description: BLOG_CARD_DESCRIPTION,
  url: "https://www.dayblip.com/blog/paycheck-by-state-2026",
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
      name: `Which state has the highest take-home pay on a ${usd(BENCHMARK_SALARY)} salary?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `The ${NO_TAX_STATES.length} states with no income tax — ${listNames(NO_TAX_STATES)} — all produce the same take-home pay of ${usd(AFTER_FEDERAL)} on a ${usd(BENCHMARK_SALARY)} gross salary for a single filer using the ${REPORT_YEAR} standard deduction. Federal income tax (${usd(FEDERAL_INCOME_TAX)}) and FICA (${usd(FICA_TAX)}) are the only deductions.`,
      },
    },
    {
      "@type": "Question",
      name: `How much does state income tax cost on a ${usd(BENCHMARK_SALARY)} salary?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `State income tax on a ${usd(BENCHMARK_SALARY)} salary ranges from $0 in the ${NO_TAX_STATES.length} no-income-tax states to ${usd(LOWEST.stateTax)} in ${LOWEST.name}, the highest-tax state for this benchmark. ${second.name} (${usd(second.stateTax)}) and ${third.name} (${usd(third.stateTax)}) follow. The difference between the best and worst state is ${usd(ANNUAL_GAP)} per year, or ${usd(MONTHLY_GAP)} per month.`,
      },
    },
  ],
}

const relatedTools = [
  { title: "Paycheck Calculator", href: "/finance/paycheck-calculator", description: "Calculate exact take-home pay for any salary in any state." },
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "See which federal and state brackets your income falls into." },
  { title: "Cost of Living Comparison", href: "/finance/cost-of-living", description: "Compare purchasing power across US cities and states." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Your exact net pay after all taxes and deductions." },
]

export default function PaycheckByState2026Page() {
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
          <span className="text-white">Paycheck by State 2026</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">5 min read · June 2026 · Figures recomputed November 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          {headline}
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The same gross salary produces a meaningfully different bank account depending on which side of a state line you live on. Here is the full {REPORT_YEAR} breakdown.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              A single filer earning {usd(BENCHMARK_SALARY)} takes home <strong>{usd(AFTER_FEDERAL)}</strong> in Wyoming, Texas, Florida, or any of the {NO_TAX_STATES.length} no-income-tax states, and just <strong>{usd(LOWEST.takeHome)}</strong> in {LOWEST.name}. The {usd(ANNUAL_GAP)} annual gap is driven entirely by state income tax. Federal deductions ({usd(FEDERAL_INCOME_TAX)} income tax + {usd(FICA_TAX)} FICA = {usd(FEDERAL_TOTAL)}) are identical everywhere. Over {CAREER_YEARS} years invested at {pct(GROWTH_RATE)}, that {usd(ANNUAL_GAP)}/year gap compounds to approximately {fv30}.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={shareText}
            url="https://www.dayblip.com/blog/paycheck-by-state-2026"
            title={headline}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Federal Taxes Take First — The Same in Every State</h2>

          <p>
            Before state tax enters the picture, every American earning {usd(BENCHMARK_SALARY)} in {REPORT_YEAR} faces the same federal deductions. Using the standard deduction of {usd(STANDARD_DED)} for a single filer, federal taxable income is {usd(TAXABLE_INCOME)}.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Deduction</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: `Federal income tax (${bracketLabel} brackets)`, amount: usd(FEDERAL_INCOME_TAX) },
                  { label: `Social Security (${SS_RATE_LABEL})`, amount: usd(SOCIAL_SECURITY_TAX) },
                  { label: `Medicare (${MEDICARE_RATE_LABEL})`, amount: usd(MEDICARE_TAX) },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.label}</td>
                    <td className="px-4 py-3 text-right text-[#FF6B6B]">{row.amount}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #e94560", background: "#1e2d4a" }}>
                  <td className="px-4 py-3 font-bold text-white">Total federal deductions</td>
                  <td className="px-4 py-3 text-right font-bold text-[#FF6B6B]">{usd(FEDERAL_TOTAL)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #1e2d4a", background: "#16213e" }}>
                  <td className="px-4 py-3 font-bold text-white">After-federal base (same in all 50 states)</td>
                  <td className="px-4 py-3 text-right font-bold text-[#F9A825]">{usd(AFTER_FEDERAL)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Sources: IRS Revenue Procedure 2025-32 (2026 federal brackets and standard deduction); SSA Fact Sheet 2026 (FICA rates). The {usd(AFTER_FEDERAL)} figure is the maximum possible take-home — achieved only in states with no income tax.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {NO_TAX_STATES.length} No-Income-Tax States — {usd(AFTER_FEDERAL)} Take-Home</h2>

          <p>
            {NO_TAX_STATES.length} states impose no individual income tax: {listNames(NO_TAX_STATES)}. Workers in all of them take home an identical {usd(AFTER_FEDERAL)} from a {usd(BENCHMARK_SALARY)} salary. The federal government takes {usd(FEDERAL_TOTAL)}. The state takes nothing.
          </p>

          <p>
            Washington has a capital gains tax on high earners but no income tax on wages. Tennessee eliminated its Hall Tax on investment income in 2022. New Hampshire taxes interest and dividends above $2,400 but not wages. All three produce the same {usd(AFTER_FEDERAL)} take-home on a {usd(BENCHMARK_SALARY)} W-2 salary.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The High-Tax End — {LOWEST.name}, {second.name}, {third.name}</h2>

          <p>
            At the other end of the spectrum, 5 states take the biggest bite out of a {usd(BENCHMARK_SALARY)} salary:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">State</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Take-home</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">State tax</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Effective rate</th>
                </tr>
              </thead>
              <tbody>
                {BOTTOM_FIVE.map((r) => ({
                  state: r.name, take: usd(r.takeHome), tax: usd(r.stateTax), rate: `${r.effective.toFixed(1)}%`,
                })).map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.state}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-semibold">{row.take}</td>
                    <td className="px-4 py-3 text-right text-[#FF6B6B]">{row.tax}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            {LOWEST.name} is the most expensive state for a {usd(BENCHMARK_SALARY)} salary in {REPORT_YEAR}: its {pct(lowFacts.marginalRate, 2)} bracket starts at {usd(lowFacts.marginalStart)} of taxable income and its standard deduction is only {usd(lowFacts.deduction)}, so most of the salary is taxed near the top rate. {second.name} has a higher top rate ({pct(secondFacts.topRate, 1)}), but it applies only above {usd(secondFacts.topStart)}, so a {usd(BENCHMARK_SALARY)} earner lands in its {pct(secondFacts.marginalRate, 1)} bracket. California, often assumed to be the worst, comes in at {ca.effective.toFixed(1)}% total, because its {pct(caFacts.nextBracketRate ?? caFacts.topRate, 1)} rate starts above {usd(caFacts.nextBracketStart ?? caFacts.topStart)} of taxable income.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {usd(ANNUAL_GAP)} Gap Compounded Over {CAREER_YEARS} Years</h2>

          <p>
            The annual gap between the best and worst state is {usd(ANNUAL_GAP)}, or {usd(MONTHLY_GAP)} per month. On its own, that is a meaningful but not dramatic difference. What makes it significant is what happens when that gap is invested rather than paid to the state.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[#a8a8b3]">{usd(ANNUAL_GAP)}/year invested at {pct(GROWTH_RATE)} after 10 years</span><span className="text-[#F9A825] font-semibold">{approxThousands(gapCompounded(10))}</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">After 20 years</span><span className="text-[#F9A825] font-semibold">{approxThousands(gapCompounded(20))}</span></div>
            <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-white font-bold">After {CAREER_YEARS} years</span><span className="text-[#e94560] font-bold text-base">{fv30}</span></div>
          </div>

          <p>
            Formula: FV = {usd(ANNUAL_GAP)} × ((1.07³⁰ − 1) / 0.07) = {usd(ANNUAL_GAP)} × {ANNUITY_FACTOR_30.toFixed(2)} = approximately {fv30}. Total contributions over the {CAREER_YEARS} years are {usd(ANNUAL_GAP * CAREER_YEARS)}; the rest is growth at a {pct(GROWTH_RATE)} average annual return, consistent with long-run S&P 500 historical averages adjusted for inflation (Source: FRED, Federal Reserve Bank of St. Louis).
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Methodology Note</h2>

          <p>
            All figures use a {usd(BENCHMARK_SALARY)} gross annual salary, single filing status, {REPORT_YEAR} standard deduction ({usd(STANDARD_DED)}), no pre-tax deductions, no dependents. State tax is computed from the same bracket tables that power the Dayblip paycheck calculator, so the article and the calculator always agree. Federal brackets per IRS Revenue Procedure 2025-32. FICA per SSA Fact Sheet 2026. State income tax rates sourced from individual state revenue department publications and the Tax Foundation&apos;s 2026 State Individual Income Tax Rates and Brackets report. Local income taxes not included.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">See the full 50-state take-home table with all methodology details:</p>
            <Link
              href="/research/paycheck-report-2026"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Full 50-State Research Report →
            </Link>
          </div>

          <p>
            State income tax is one of the most predictable levers in personal finance — unlike market returns or career outcomes, the rules are published and fixed for the year. Knowing what your state takes is the first step to understanding what your paycheck actually delivers. For most middle-income earners, the difference between a no-tax state and a high-tax state is worth more per year than many people save voluntarily.
          </p>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={shareText}
            url="https://www.dayblip.com/blog/paycheck-by-state-2026"
            title={headline}
          />
        </div>

      </div>
    </main>
  )
}
