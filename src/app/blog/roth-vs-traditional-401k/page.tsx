import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { K401_CATCHUP, K401_LIMIT, STANDARD_DEDUCTION, federalTax, marginalRate } from "@/lib/tax2026"

// Every dollar figure is computed from src/lib/tax2026.ts.
// Model: single filer, standard deduction, federal tax only. A $10,000
// traditional contribution is compared with the Roth contribution that costs
// the same take-home pay (the $10,000 minus the tax it would have saved).
// Both grow 7% a year for 30 years. In retirement the traditional balance is
// withdrawn evenly over 25 years, on top of other taxable income.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const CONTRIB = 10000
const YEARS = 30
const GROWTH = Math.pow(1.07, YEARS)
const WITHDRAW_YEARS = 25
const taxable = (income: number) => Math.max(0, income - STANDARD_DEDUCTION.single)

function scenario(salary: number, other: number) {
  const saved = federalTax(taxable(salary), "single") - federalTax(taxable(salary - CONTRIB), "single")
  const tradFv = CONTRIB * GROWTH
  const rothFv = (CONTRIB - saved) * GROWTH
  const w = tradFv / WITHDRAW_YEARS
  const extra = federalTax(taxable(other + w), "single") - federalTax(taxable(other), "single")
  const tradNet = tradFv - extra * WITHDRAW_YEARS
  return {
    salary, other, saved,
    nowRate: marginalRate(taxable(salary), "single"),
    retireRate: marginalRate(taxable(other + w), "single"),
    tradNet, rothNet: rothFv,
  }
}

const ROWS = [
  scenario(50000, 30000), scenario(50000, 100000),
  scenario(100000, 30000), scenario(100000, 100000),
  scenario(200000, 30000), scenario(200000, 100000),
]
const ex = ROWS[2]
const exTradFv = CONTRIB * GROWTH
const exRothIn = CONTRIB - ex.saved
const exWithdraw = exTradFv / WITHDRAW_YEARS
const pctr = (r: number) => Math.round(r * 100) + "%"
const verdict = (r: { tradNet: number; rothNet: number }) =>
  Math.abs(r.tradNet - r.rothNet) < 1 ? "Tie" : r.tradNet > r.rothNet ? "Traditional" : "Roth"

const PAGE_URL = "https://www.dayblip.com/blog/roth-vs-traditional-401k"
const TITLE = "Roth 401k vs Traditional 401k in 2026: Which Wins?"

const schema = articleSchema(
  TITLE,
  `A traditional 401k wins when your tax rate in retirement is lower than today, and a Roth wins when it is higher. On a ${usd(100000)} salary with ${usd(30000)} of other retirement income, a ${usd(CONTRIB)} traditional contribution ends ${usd(ex.tradNet - ex.rothNet)} ahead after tax.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is a Roth 401k or traditional 401k better?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Neither wins in general. A traditional 401k is better if your tax rate in retirement will be lower than your rate today. A Roth 401k is better if it will be higher. If the two rates are equal, the after-tax result is the same.",
      },
    },
    {
      "@type": "Question",
      name: "What is the 2026 401k contribution limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The 2026 employee limit is ${usd(K401_LIMIT)}, plus a ${usd(K401_CATCHUP)} catch-up if you are 50 or older. The limit is shared: Roth and traditional contributions together cannot exceed it.`,
      },
    },
    {
      "@type": "Question",
      name: "Is there an income limit for a Roth 401k?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Unlike a Roth IRA, a Roth 401k has no income limit, so high earners can contribute if their plan offers it.",
      },
    },
    {
      "@type": "Question",
      name: "Can I split contributions between Roth and traditional?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, if your plan allows both. Many people split to hedge against not knowing their future tax rate. The combined total still has to stay under the annual limit.",
      },
    },
  ],
}

const relatedTools = [
  { title: "401k Calculator", href: "/finance/401k-calculator", description: "See how your contribution and employer match grow over time." },
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "Find your marginal rate today." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "See what a 401k contribution does to your paycheck." },
  { title: "Retirement Savings Calculator", href: "/finance/retirement-savings", description: "Check whether your savings rate reaches your target." },
]

export default function RothVsTraditional401kPage() {
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
          <span className="text-white">Roth vs Traditional 401k</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-orange-900/40 text-orange-300 rounded px-2 py-1">Retirement</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most people pick Roth or traditional on a guess. The choice comes down to one comparison: your tax rate today against your tax rate when you withdraw. Here is the math with 2026 numbers.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Choose traditional if you expect a lower tax rate in retirement. Choose Roth if you expect a higher one. If the rates match, the two end up identical. A single filer earning {usd(100000)} sits in the {pctr(ex.nowRate)} bracket. With {usd(30000)} of other retirement income, withdrawals land in the {pctr(ex.retireRate)} bracket, so a {usd(CONTRIB)} traditional contribution finishes {usd(ex.tradNet - ex.rothNet)} ahead after tax.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Roth or traditional 401k? It comes down to your tax rate now versus in retirement. Worked 2026 examples: www.dayblip.com/blog/roth-vs-traditional-401k`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Only Difference Is When You Pay Tax</h2>

          <p>
            A traditional 401k takes the money out of your paycheck before income tax. You get the deduction now and pay tax on every dollar you withdraw later. A Roth 401k takes it out after tax. You get no deduction now, and qualified withdrawals come out tax-free.
          </p>

          <p>
            The 2026 limit is {usd(K401_LIMIT)}, or {usd(K401_LIMIT + K401_CATCHUP)} if you are 50 or older. Roth and traditional share it. A Roth 401k also has no income limit, which a Roth IRA does.
          </p>

          <p>
            Here is the key fact. If your tax rate is the same on both ends, the two accounts finish with the same after-tax money. The decision is only about which way your rate moves.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Math at Three Salaries</h2>

          <p>
            The model: a single filer, the {usd(STANDARD_DEDUCTION.single)} standard deduction and federal tax only. A {usd(CONTRIB)} traditional contribution is compared with the Roth contribution that costs the same take-home pay, which is {usd(CONTRIB)} minus the tax the deduction would have saved. Both grow 7% a year for {YEARS} years. The traditional balance is withdrawn evenly over {WITHDRAW_YEARS} years on top of other taxable retirement income.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Salary</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Rate now</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Other retirement income</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Rate in retirement</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Traditional, after tax</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Roth</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Better</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{usd(r.salary)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{pctr(r.nowRate)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.other)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{pctr(r.retireRate)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.tradNet)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.rothNet)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{verdict(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Read the {usd(100000)} rows. With {usd(30000)} of other income, the deduction saves tax at {pctr(ex.nowRate)} and withdrawals are taxed at {pctr(ex.retireRate)}. Traditional wins by {usd(ex.tradNet - ex.rothNet)}. With {usd(100000)} of other income, both rates are {pctr(ROWS[3].nowRate)} and the result is a {verdict(ROWS[3]).toLowerCase()}.
          </p>

          <p>
            Now the {usd(50000)} rows. Today&apos;s rate is {pctr(ROWS[0].nowRate)}. A retiree with {usd(100000)} of other income withdraws into the {pctr(ROWS[1].retireRate)} bracket, and Roth wins by {usd(ROWS[1].rothNet - ROWS[1].tradNet)}.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {usd(100000)} Example, Step by Step</h2>

          <p>
            <strong className="text-white">1. The deduction.</strong> A {usd(CONTRIB)} traditional contribution cuts taxable income from {usd(taxable(100000))} to {usd(taxable(100000 - CONTRIB))}. Federal tax falls by {usd(ex.saved)}.
          </p>

          <p>
            <strong className="text-white">2. The matching Roth.</strong> To keep take-home pay equal, the Roth contribution is {usd(CONTRIB)} minus {usd(ex.saved)}, or {usd(exRothIn)}. You put less in, because you are not getting the deduction.
          </p>

          <p>
            <strong className="text-white">3. Growth.</strong> At 7% for {YEARS} years, {usd(CONTRIB)} grows to {usd(exTradFv)}. The {usd(exRothIn)} grows to {usd(ex.rothNet)}, and none of it is taxed.
          </p>

          <p>
            <strong className="text-white">4. Retirement.</strong> Withdrawing the traditional balance over {WITHDRAW_YEARS} years adds {usd(exWithdraw)} a year to {usd(30000)} of other income. Tax on that slice leaves {usd(ex.tradNet)}, which is {usd(ex.tradNet - ex.rothNet)} more than the Roth.
          </p>

          <p>
            The traditional account won because the deduction saved tax at {pctr(ex.nowRate)} and the withdrawals paid tax at {pctr(ex.retireRate)}. Swap those two rates and the result flips.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Common Mistakes</h2>

          <p>
            <strong className="text-white">Comparing equal contributions.</strong> Putting {usd(CONTRIB)} in each account makes Roth look better, because the Roth costs you more take-home pay. The fair test holds your take-home pay equal, as the table does.
          </p>

          <p>
            <strong className="text-white">Using your average rate.</strong> The deduction saves tax at your marginal rate, the rate on your last dollar of income. Use the bracket, not the overall percentage.
          </p>

          <p>
            <strong className="text-white">Ignoring where you live.</strong> State income tax adds to both sides. Moving from a high-tax state to a no-tax state in retirement favors traditional. The reverse favors Roth.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Pushes Your Rate Up or Down</h2>

          <p>
            Your rate tends to rise if you are early in your career, expect big raises, or will have a pension, rental income or large required withdrawals. It tends to fall if you are at your peak earnings now and plan a modest retirement.
          </p>

          <p>
            Two caveats apply. Brackets can change by law, and the current ones are set by Congress. Nobody knows what rates will be in 30 years. That uncertainty is the main reason to split between both accounts.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Rules That Can Tip the Choice</h2>

          <p>
            <strong className="text-white">Employer match.</strong> Matching contributions have usually gone into the traditional side. Some plans now allow the match as Roth, but the plan has to offer it. Take the full match first either way.
          </p>

          <p>
            <strong className="text-white">No required withdrawals.</strong> Since 2024, Roth 401k balances are no longer subject to required minimum distributions. Traditional balances still are.
          </p>

          <p>
            <strong className="text-white">The Roth catch-up rule.</strong> Starting in 2026, if your prior-year FICA wages were above $150,000, your {usd(K401_CATCHUP)} catch-up contribution has to go in as Roth. Your plan must offer a Roth option for this to work.
          </p>

          <p>
            <strong className="text-white">Qualified withdrawals.</strong> Roth earnings come out tax-free once you are 59½ and the account has been open at least 5 years. Check your plan for the exact rule.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">A Simple Way to Decide</h2>

          <p>
            Find your marginal rate in the <Link href="/finance/tax-bracket" className="text-[#e94560]">Tax Bracket Calculator</Link>. If it is 22% or higher and you expect a lower bracket in retirement, lean traditional. If it is 12% or lower and your income is likely to grow, lean Roth. If you sit between those and cannot tell, split the contribution.
          </p>

          <p>
            The wrong choice is rarely costly compared with the cost of not contributing. Getting the match and saving {usd(K401_LIMIT)} beats any optimizing between the two types.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">See how your contribution and employer match grow over time:</p>
            <Link
              href="/finance/401k-calculator"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              401k Calculator →
            </Link>
          </div>

          <p className="text-[#a8a8b3] text-sm">
            Looking at an IRA instead? See <Link href="/blog/roth-ira-vs-traditional-ira" className="text-[#e94560]">Roth IRA vs Traditional IRA</Link>.
          </p>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal or financial advice. Figures use 2026 federal rules, a simplified single-filer model and an assumed 7% return. Your results depend on your state, income and plan rules. Consult a qualified tax professional.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Roth or traditional 401k? It comes down to your tax rate now versus in retirement. Worked 2026 examples: www.dayblip.com/blog/roth-vs-traditional-401k`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
