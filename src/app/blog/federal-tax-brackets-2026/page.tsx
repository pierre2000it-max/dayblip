import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { BRACKETS, STANDARD_DEDUCTION, federalTax, marginalRate } from "@/lib/tax2026"

// Every dollar figure below is computed from src/lib/tax2026.ts (IRS Rev. Proc.
// 2025-32), the same source the Tax Bracket Calculator uses.
// Examples assume a single filer taking the standard deduction, wages only.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const pct = (n: number) => n.toFixed(1) + "%"
const rate = (r: number) => Math.round(r * 100) + "%"

const SD = STANDARD_DEDUCTION.single
const single = BRACKETS.single
const mfj = BRACKETS.mfj

function rows(filing: "single" | "mfj") {
  let prev = 0
  return BRACKETS[filing].map(([limit, r]) => {
    const row = { from: prev, to: limit, r }
    prev = limit
    return row
  })
}
const SINGLE_ROWS = rows("single")
const MFJ_ROWS = rows("mfj")
const range = (from: number, to: number) => (to === Infinity ? `Over ${usd(from)}` : `${usd(from + (from === 0 ? 0 : 1))} to ${usd(to)}`)

// Worked example: $80,000 of wages, single
const GROSS = 80000
const taxable = GROSS - SD
const tax = federalTax(taxable, "single")
const marg = marginalRate(taxable, "single")
const effTaxable = (tax / taxable) * 100
const effGross = (tax / GROSS) * 100

// Slice-by-slice breakdown of that example
const slices = (() => {
  const out: { label: string; amount: number; r: number; tax: number }[] = []
  let prev = 0
  for (const [limit, r] of single) {
    if (taxable <= prev) break
    const amount = Math.min(taxable, limit) - prev
    out.push({ label: range(prev, limit), amount, r, tax: amount * r })
    prev = limit
  }
  return out
})()

// Raise myth: $1,000 raise that crosses the first bracket line
const lineTop = single[0][0]
const before = lineTop - 500
const after = lineTop + 500
const raiseTax = federalTax(after, "single") - federalTax(before, "single")
const raiseNet = 1000 - raiseTax

const PAGE_URL = "https://www.dayblip.com/blog/federal-tax-brackets-2026"
const TITLE = "How Federal Tax Brackets Work in 2026: Marginal vs Effective Rate"

const schema = articleSchema(
  TITLE,
  `A single filer with ${usd(GROSS)} of wages pays ${usd(tax)} in federal income tax in 2026. That is ${pct(effGross)} of pay, even though the top bracket reached is ${rate(marg)}.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does moving into a higher tax bracket reduce my take-home pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Only the dollars above the bracket line are taxed at the higher rate. Income below the line stays taxed at the lower rates, so a raise always leaves you with more money than before.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a marginal and an effective tax rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Your marginal rate is the rate on your last dollar of taxable income. Your effective rate is your total tax divided by your income. On ${usd(GROSS)} of wages, a single filer's marginal rate is ${rate(marg)} and the effective rate is ${pct(effGross)} of gross pay.`,
      },
    },
    {
      "@type": "Question",
      name: "Are tax brackets applied to gross income?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `No. Brackets apply to taxable income, which is your income after deductions. Most filers subtract the standard deduction first, which is ${usd(SD)} for a single filer in 2026.`,
      },
    },
  ],
}

const relatedTools = [
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "Enter your income and filing status to see your marginal and effective rate." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Turn your salary into a paycheck after federal, state and payroll tax." },
  { title: "Paycheck Calculator", href: "/finance/paycheck-calculator", description: "See what comes out of each pay period." },
  { title: "Self-Employment Tax Guide", href: "/blog/self-employment-tax-2026", description: "The extra 15.3% freelancers pay on top of income tax." },
]

function BracketTable({ data }: { data: { from: number; to: number; r: number }[] }) {
  return (
    <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#1e2d4a" }}>
            <th className="text-left px-4 py-3 text-white font-semibold">Taxable income</th>
            <th className="text-right px-4 py-3 text-white font-semibold">Rate on that slice</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.from} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
              <td className="px-4 py-3 text-white">{range(row.from, row.to)}</td>
              <td className="px-4 py-3 text-right text-[#e94560] font-bold">{rate(row.r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function FederalTaxBrackets2026Page() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-[780px] px-6 py-12">

        <nav className="mb-8 flex items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-[#e94560] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#e94560] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white">Federal Tax Brackets 2026</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most people think a raise can push them into a bracket that shrinks their paycheck. It can&apos;t. Here is how the brackets work, with the 2026 numbers and one worked example.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Federal brackets tax each slice of your taxable income at its own rate. They don&apos;t tax all of it at your top rate. A single filer with {usd(GROSS)} of wages has {usd(taxable)} of taxable income after the {usd(SD)} standard deduction. The top bracket reached is {rate(marg)}, but the tax is {usd(tax)}, which is {pct(effGross)} of pay.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Tax brackets tax each slice of income at its own rate, not all of it at your top rate. On ${usd(GROSS)} of wages a single filer's top bracket is ${rate(marg)}, but the real rate is ${pct(effGross)}. www.dayblip.com/blog/federal-tax-brackets-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Brackets Tax Slices, Not the Whole Pile</h2>

          <p>
            The U.S. uses a marginal system. Your taxable income is split into slices, and each slice is taxed at its own rate. The first slice is taxed at {rate(single[0][1])}. Only the income that reaches the next slice is taxed at the next rate.
          </p>

          <p>
            Brackets apply to taxable income, not gross pay. You get to taxable income by subtracting deductions first. Most filers take the standard deduction, which is {usd(SD)} for a single filer and {usd(STANDARD_DEDUCTION.mfj)} for married couples filing jointly in 2026.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">2026 Brackets: Single Filers</h2>

          <BracketTable data={SINGLE_ROWS} />

          <h2 className="text-white text-xl font-bold mt-8 mb-3">2026 Brackets: Married Filing Jointly</h2>

          <BracketTable data={MFJ_ROWS} />

          <p>
            The married filing jointly brackets are roughly double the single ones through the {rate(mfj[4][1])} bracket. The two filing statuses diverge at the top. Head of household and married filing separately use their own tables, which the calculator below handles.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {usd(GROSS)} Example, Slice by Slice</h2>

          <p>
            A single filer earns {usd(GROSS)} in wages and takes the standard deduction. Taxable income is {usd(GROSS)} minus {usd(SD)}, or {usd(taxable)}. Here is the tax on each slice.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Slice</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Income in slice</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Rate</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Tax</th>
                </tr>
              </thead>
              <tbody>
                {slices.map((s, i) => (
                  <tr key={s.label} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-white">{s.label}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(s.amount)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{rate(s.r)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(s.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            The slices add up to {usd(tax)}. Your marginal rate is {rate(marg)}, because that is the rate on your next dollar. Your effective rate is {pct(effTaxable)} of taxable income, or {pct(effGross)} of the full {usd(GROSS)}. The second number is the one that describes your real burden.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why a Raise Never Costs You Money</h2>

          <p>
            Take a single filer with {usd(before)} of taxable income who gets a {usd(1000)} raise. That lifts taxable income to {usd(after)} and crosses the line into the {rate(single[1][1])} bracket. Federal tax rises by {usd(raiseTax)}, because {usd(500)} is taxed at {rate(single[0][1])} and {usd(500)} at {rate(single[1][1])}. The filer keeps {usd(raiseNet)} of the raise.
          </p>

          <p>
            Crossing a line changes the rate on the dollars above it, and nothing else. Income below the line is taxed exactly as before. A higher bracket never leaves you with less than you had.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Brackets Leave Out</h2>

          <p>
            Federal income tax is one piece of what comes out of a paycheck. Social Security and Medicare take another 7.65% of wages, and most states add their own income tax. Pre-tax contributions to a 401(k) lower taxable income, so they pull you down into a lower slice. Credits, such as the child tax credit, reduce the tax itself after the brackets are applied.
          </p>

          <p>
            Long-term capital gains and qualified dividends use their own rate schedule instead of the ordinary brackets above. If you sell investments, the tool below separates the two.
          </p>

          <p>
            This article uses the standard deduction. If you own a home or give a lot to charity, itemizing may beat it. See <Link href="/blog/standard-deduction-vs-itemizing-2026" className="text-[#e94560]">Standard Deduction vs Itemizing in 2026</Link> for the break-even.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Enter your income and filing status to see your marginal rate, effective rate and total federal tax:</p>
            <Link
              href="/finance/tax-bracket"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Tax Bracket Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal or financial advice. Figures use 2026 federal rules, the standard deduction and a simplified wage-only example. Your tax depends on your state, deductions, credits and other income. Consult a qualified tax professional for your situation.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Tax brackets tax each slice of income at its own rate, not all of it at your top rate. On ${usd(GROSS)} of wages a single filer's top bracket is ${rate(marg)}, but the real rate is ${pct(effGross)}. www.dayblip.com/blog/federal-tax-brackets-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
