import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { LTCG_LIMITS, STANDARD_DEDUCTION, federalTax, ltcgTax, marginalRate } from "@/lib/tax2026"

// Every dollar figure is computed from src/lib/tax2026.ts.
// Model: single filer, wages only plus one $20,000 gain, standard deduction,
// federal tax only. Net Investment Income Tax is 3.8% of the smaller of the
// gain or the amount by which income exceeds $200,000 (single).

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const pctr = (r: number) => Math.round(r * 100) + "%"
const GAIN = 20000
const NIIT_RATE = 0.038
const NIIT_THRESHOLD = 200000
const [ZERO_TOP, FIFTEEN_TOP] = LTCG_LIMITS.single
const taxable = (income: number) => Math.max(0, income - STANDARD_DEDUCTION.single)

function scenario(wages: number) {
  const ord = taxable(wages)
  const lt = ltcgTax(GAIN, ord, "single")
  const st = federalTax(ord + GAIN, "single") - federalTax(ord, "single")
  const niit = NIIT_RATE * Math.min(GAIN, Math.max(0, wages + GAIN - NIIT_THRESHOLD))
  return { wages, ord, lt, st, niit, ltTotal: lt + niit, stTotal: st + niit, saved: st - lt, stRate: marginalRate(ord, "single") }
}

const ROWS = [40000, 80000, 150000, 250000].map(scenario)
const low = ROWS[0]
const mid = ROWS[1]
const high = ROWS[3]
const zeroRoom = (wages: number) => Math.max(0, ZERO_TOP - taxable(wages))
const BIG_GAIN = 40000
const bigTax = ltcgTax(BIG_GAIN, taxable(40000), "single")

const PAGE_URL = "https://www.dayblip.com/blog/capital-gains-tax-2026"
const TITLE = "Capital Gains Tax in 2026: Rates, Thresholds, Examples"

const schema = articleSchema(
  TITLE,
  `Long-term capital gains are taxed at 0%, 15% or 20% in 2026. A single filer with ${usd(80000)} of wages who sells at a ${usd(GAIN)} gain after more than 1 year owes ${usd(mid.lt)}. Selling before 1 year costs ${usd(mid.st)}.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the 2026 long-term capital gains tax rates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The rates are 0%, 15% and 20%. For a single filer, the 0% rate applies up to ${usd(ZERO_TOP)} of taxable income and the 15% rate applies up to ${usd(FIFTEEN_TOP)}. Above that the rate is 20%. The thresholds count your gain as part of taxable income.`,
      },
    },
    {
      "@type": "Question",
      name: "How long must I hold an asset for the long-term rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "More than 1 year. If you sell after holding for 1 year or less, the gain is short-term and taxed at your ordinary income tax rate.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Net Investment Income Tax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It is an extra 3.8% on investment income, including capital gains, for single filers with income above ${usd(NIIT_THRESHOLD)} ($250,000 for married filing jointly). It applies to the smaller of your investment income or the amount over the threshold.`,
      },
    },
    {
      "@type": "Question",
      name: "Can capital losses reduce my tax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Losses first offset capital gains. If losses exceed gains, you can deduct up to $3,000 against other income each year and carry the rest forward.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Capital Gains Tax Calculator", href: "/finance/capital-gains", description: "Enter your gain, income and holding period." },
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "See where your ordinary income lands." },
  { title: "Stock Return Calculator", href: "/finance/stock-return", description: "Work out the gain before you work out the tax." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "See your pay after federal and state tax." },
]

export default function CapitalGainsTax2026Page() {
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
          <span className="text-white">Capital Gains Tax 2026</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The day you sell decides the rate you pay. The same gain can be taxed at 0%, 15% or your full income tax rate. Here are the 2026 thresholds and what they cost at 4 incomes.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Gains on assets held more than 1 year are taxed at 0%, 15% or 20%. Gains on assets held 1 year or less are taxed as ordinary income. A single filer with {usd(80000)} of wages and a {usd(GAIN)} gain owes {usd(mid.lt)} if the gain is long-term and {usd(mid.st)} if it is short-term. Waiting saves {usd(mid.saved)}. At {usd(40000)} of wages, the long-term tax is {usd(low.lt)}.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Capital gains tax in 2026: 0%, 15% or 20% if you hold more than 1 year, your full income rate if you do not. Worked examples at 4 incomes: www.dayblip.com/blog/capital-gains-tax-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Short-Term vs Long-Term</h2>

          <p>
            A capital gain is the sale price minus what you paid. You owe tax only when you sell. The holding period sets the rate.
          </p>

          <p>
            <strong className="text-white">Short-term:</strong> you held the asset 1 year or less. The gain is added to your income and taxed at your ordinary rate, anywhere from 10% to 37%.
          </p>

          <p>
            <strong className="text-white">Long-term:</strong> you held it more than 1 year. The rate is 0%, 15% or 20%, depending on your taxable income.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The 2026 Long-Term Thresholds</h2>

          <p>
            For a single filer, the 0% rate applies while taxable income stays at or below {usd(ZERO_TOP)}. The 15% rate applies up to {usd(FIFTEEN_TOP)}. The 20% rate applies above that. The gain itself counts as taxable income, so a large gain can push part of it into a higher zone.
          </p>

          <p>
            Taxable income is wages minus the {usd(STANDARD_DEDUCTION.single)} standard deduction. With {usd(40000)} of wages, taxable income is {usd(low.ord)}, which leaves {usd(zeroRoom(40000))} of room in the 0% zone. A gain up to that size is tax-free.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What a {usd(GAIN)} Gain Costs at Four Incomes</h2>

          <p>
            The model: a single filer, wages plus one {usd(GAIN)} gain, the standard deduction and federal tax only. The last column adds the 3.8% Net Investment Income Tax where it applies.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Wages</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Long-term tax</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Short-term tax</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Saved by waiting</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Surtax (NIIT)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.wages} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{usd(r.wages)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.lt)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.st)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(r.saved)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.niit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            At {usd(40000)} the gain falls inside the 0% zone, so the long-term tax is {usd(low.lt)}. At {usd(80000)} the gain is taxed at 15%, or {usd(mid.lt)}. Sold short-term, the same gain costs {usd(mid.st)}, because it lands in the {pctr(mid.stRate)} bracket.
          </p>

          <p>
            At {usd(250000)} of wages, the long-term rate is 15% but the surtax adds {usd(high.niit)}. The surtax applies to the smaller of the gain or the amount your income exceeds {usd(NIIT_THRESHOLD)}.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {usd(80000)} Example, Step by Step</h2>

          <p>
            <strong className="text-white">1. Taxable income before the gain.</strong> {usd(80000)} minus the {usd(STANDARD_DEDUCTION.single)} standard deduction is {usd(mid.ord)}.
          </p>

          <p>
            <strong className="text-white">2. Find the zone.</strong> {usd(mid.ord)} is above the {usd(ZERO_TOP)} limit for the 0% rate and below the {usd(FIFTEEN_TOP)} limit for 15%. The whole gain is taxed at 15%.
          </p>

          <p>
            <strong className="text-white">3. Long-term tax.</strong> 15% of {usd(GAIN)} is {usd(mid.lt)}.
          </p>

          <p>
            <strong className="text-white">4. Compare short-term.</strong> Adding the gain to ordinary income raises federal tax by {usd(mid.st)}. Waiting past the 1-year mark saves {usd(mid.saved)}.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How Much Gain Fits in the 0% Zone</h2>

          <p>
            The 0% zone is a fixed amount of room. A single filer with {usd(40000)} of wages has {usd(zeroRoom(40000))} of it. A {usd(GAIN)} gain fits entirely. A {usd(BIG_GAIN)} gain does not: the first {usd(zeroRoom(40000))} is tax-free, and the rest is taxed at 15%, for {usd(bigTax)} in total.
          </p>

          <p>
            At {usd(80000)} of wages there is no room at all, because taxable income of {usd(mid.ord)} is already above the {usd(ZERO_TOP)} limit. That is why the same sale can cost nothing for one investor and {usd(mid.lt)} for another.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Common Mistakes</h2>

          <p>
            <strong className="text-white">Selling days before the 1-year mark.</strong> The holding period runs from the day after you buy. A sale one week early can turn a {usd(mid.lt)} tax bill into {usd(mid.st)}.
          </p>

          <p>
            <strong className="text-white">Forgetting reinvested dividends.</strong> Reinvested dividends add to your cost basis. If you skip them, you report a higher gain than you earned and overpay.
          </p>

          <p>
            <strong className="text-white">Ignoring the gain&apos;s effect on other income.</strong> A large gain raises your income for the year. It can move part of your gain into the next zone and cut tax breaks that phase out with income.
          </p>

          <p>
            <strong className="text-white">Selling a winner to rebalance without a plan.</strong> A rebalance in a taxable account can create a bill. Direct new contributions to the underweight asset first, or rebalance inside a retirement account where sales are not taxed.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Ways to Lower the Bill</h2>

          <p>
            <strong className="text-white">Hold past 1 year.</strong> If a sale is days short of the mark, check the date first.
          </p>

          <p>
            <strong className="text-white">Use losses.</strong> Losses offset gains first. If losses are larger, up to $3,000 a year reduces other income and the rest carries forward.
          </p>

          <p>
            <strong className="text-white">Time the sale.</strong> In a low-income year, such as a gap between jobs, part of your gain can land in the 0% zone.
          </p>

          <p>
            <strong className="text-white">Sell a home you lived in.</strong> If you owned and lived in the home for 2 of the last 5 years, you can exclude up to $250,000 of gain, or $500,000 for married couples filing jointly.
          </p>

          <p>
            Gains inside a 401k or IRA are not taxed when you sell. Tax applies when you withdraw. See <Link href="/blog/roth-vs-traditional-401k" className="text-[#e94560]">Roth vs traditional 401k</Link> for how that works. For the ordinary income side, see <Link href="/blog/federal-tax-brackets-2026" className="text-[#e94560]">how 2026 federal tax brackets work</Link>.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What This Model Leaves Out</h2>

          <p>
            State tax is not included, and most states tax capital gains as ordinary income. Some assets have different rules, including collectibles and depreciated real estate. Mutual fund and ETF distributions can also create gains you did not choose. Confirm the details on your own return.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Enter your own gain, income and holding period:</p>
            <Link
              href="/finance/capital-gains"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Capital Gains Tax Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal or financial advice. Figures use 2026 federal rules and a simplified single-filer example. Your tax depends on your state, other income and the asset you sell. Consult a qualified tax professional.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Capital gains tax in 2026: 0%, 15% or 20% if you hold more than 1 year, your full income rate if you do not. Worked examples at 4 incomes: www.dayblip.com/blog/capital-gains-tax-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
