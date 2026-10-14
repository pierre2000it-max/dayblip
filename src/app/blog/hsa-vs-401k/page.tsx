import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import {
  HSA_FAMILY, HSA_SELF, K401_LIMIT, SS_WAGE_BASE, STANDARD_DEDUCTION,
  additionalMedicareTax, federalTax, marginalRate, medicareTax, socialSecurityTax,
} from "@/lib/tax2026"

// Every dollar figure is computed from src/lib/tax2026.ts.
// Model: single filer, standard deduction, federal tax only, self-only HSA
// limit. Both accounts get the same contribution. The HSA is funded through
// payroll (a cafeteria plan), which skips FICA. The 401k does not skip FICA.
// Both grow 7% for 30 years. In retirement the 401k is withdrawn evenly over
// 25 years on top of $30,000 of other taxable income. The HSA pays medical
// costs, so withdrawals are tax-free.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const pctr = (r: number) => Math.round(r * 100) + "%"
const C = HSA_SELF
const YEARS = 30
const GROWTH = Math.pow(1.07, YEARS)
const OTHER = 30000
const WITHDRAW_YEARS = 25
const taxable = (income: number) => Math.max(0, income - STANDARD_DEDUCTION.single)

function scenario(salary: number) {
  const fedSaved = federalTax(taxable(salary), "single") - federalTax(taxable(salary - C), "single")
  const ficaSaved =
    socialSecurityTax(salary) - socialSecurityTax(salary - C) +
    medicareTax(salary) - medicareTax(salary - C) +
    additionalMedicareTax(salary, "single") - additionalMedicareTax(salary - C, "single")
  const fv = C * GROWTH
  const w = fv / WITHDRAW_YEARS
  const extra = federalTax(taxable(OTHER + w), "single") - federalTax(taxable(OTHER), "single")
  return {
    salary, fedSaved, ficaSaved,
    hsaToday: fedSaved + ficaSaved,
    nowRate: marginalRate(taxable(salary), "single"),
    hsaNet: fv,
    k401Net: fv - extra * WITHDRAW_YEARS,
  }
}

const ROWS = [50000, 100000, 200000].map(scenario)
const ex = ROWS[1]
const hi = ROWS[2]
const fv = C * GROWTH

const PAGE_URL = "https://www.dayblip.com/blog/hsa-vs-401k"
const TITLE = "HSA vs 401k in 2026: Which to Fund First?"

const schema = articleSchema(
  TITLE,
  `After the 401k match, fund an HSA before more 401k. On a ${usd(100000)} salary a ${usd(C)} payroll HSA contribution saves ${usd(ex.hsaToday)} in tax this year, ${usd(ex.ficaSaved)} more than the same 401k contribution.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Should I max my HSA or my 401k first?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contribute to your 401k up to the full employer match first. Then fund an HSA if you are eligible, because it avoids income tax, FICA tax when funded through payroll, and tax on medical withdrawals. After that, return to the 401k.",
      },
    },
    {
      "@type": "Question",
      name: "What are the 2026 HSA contribution limits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The 2026 limit is ${usd(HSA_SELF)} for self-only coverage and ${usd(HSA_FAMILY)} for family coverage. People 55 and older can add $1,000. You must be covered by a high-deductible health plan to contribute.`,
      },
    },
    {
      "@type": "Question",
      name: "Does an HSA avoid FICA tax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contributions made through your employer's payroll plan skip Social Security and Medicare tax. Contributions you make on your own and deduct on your tax return reduce income tax but not FICA. A 401k contribution does not skip FICA.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to an HSA if I do not spend it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The balance stays yours and rolls over every year. After age 65 you can withdraw for any purpose and pay ordinary income tax, with no penalty. Withdrawals for qualified medical costs stay tax-free at any age.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "See what pre-tax contributions do to your paycheck." },
  { title: "Paycheck Calculator", href: "/finance/paycheck-calculator", description: "Enter your HSA and 401k per paycheck." },
  { title: "401k Calculator", href: "/finance/401k-calculator", description: "Project your 401k and employer match." },
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "Find your marginal rate today." },
]

export default function HsaVs401kPage() {
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
          <span className="text-white">HSA vs 401k</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most savers fill the 401k and never look at the HSA. If you qualify for one, the HSA has the better tax treatment of the two. Here is the math and the order to fund them.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Fund your 401k up to the full employer match first. Then fund an HSA if you have a high-deductible health plan, up to {usd(HSA_SELF)} for self-only coverage in 2026. Then go back to the 401k. On a {usd(100000)} salary, a {usd(C)} payroll HSA contribution saves {usd(ex.hsaToday)} in tax this year. The same amount in a 401k saves {usd(ex.fedSaved)}, because a 401k does not skip the 7.65% payroll tax.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`After the 401k match, fund an HSA before more 401k. A payroll HSA skips income tax AND the 7.65% payroll tax. Worked 2026 examples: www.dayblip.com/blog/hsa-vs-401k`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why an HSA Beats a 401k on Tax</h2>

          <p>
            A traditional 401k gives you two of three tax breaks. The money goes in before income tax, and it grows untaxed. You pay income tax when you withdraw it.
          </p>

          <p>
            An HSA gives you all three. Contributions go in before income tax. They grow untaxed. Withdrawals for qualified medical costs come out untaxed too. If you fund the HSA through your employer&apos;s payroll plan, the contribution also skips Social Security and Medicare tax, which a 401k never does.
          </p>

          <p>
            The catch is eligibility. You need a high-deductible health plan. The 2026 limit is {usd(HSA_SELF)} for self-only coverage and {usd(HSA_FAMILY)} for family coverage, plus $1,000 more if you are 55 or older. The 401k limit is {usd(K401_LIMIT)}, so the HSA is a small account next to it.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Math at Three Salaries</h2>

          <p>
            The model: a single filer, the {usd(STANDARD_DEDUCTION.single)} standard deduction and federal tax only. The same {usd(C)} goes into each account and grows 7% a year for {YEARS} years. The 401k is withdrawn over {WITHDRAW_YEARS} years on top of {usd(OTHER)} of other taxable income. The HSA pays medical costs, so nothing is taxed.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Salary</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Income tax saved</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">FICA saved (HSA only)</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">HSA saves today</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">HSA after {YEARS} years</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">401k after tax</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.salary} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{usd(r.salary)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.fedSaved)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.ficaSaved)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.hsaToday)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(r.hsaNet)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.k401Net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            At {usd(100000)}, the {usd(C)} contribution saves {usd(ex.fedSaved)} in income tax at the {pctr(ex.nowRate)} bracket. The HSA adds {usd(ex.ficaSaved)} in payroll tax, for {usd(ex.hsaToday)} in total. That is {usd(ex.ficaSaved)} the 401k cannot match.
          </p>

          <p>
            The payroll tax saving shrinks at higher pay. At {usd(200000)}, wages are above the {usd(SS_WAGE_BASE)} Social Security wage base, so the HSA saves only the Medicare part: {usd(hi.ficaSaved)}.
          </p>

          <p>
            After {YEARS} years the {usd(C)} grows to {usd(fv)}. Spent on medical costs, all of it is yours. The same amount in a 401k leaves {usd(ex.k401Net)} after tax in this model.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {usd(100000)} Example, Step by Step</h2>

          <p>
            <strong className="text-white">1. Income tax.</strong> A {usd(C)} pre-tax contribution cuts taxable income from {usd(taxable(100000))} to {usd(taxable(100000 - C))}. Federal income tax falls by {usd(ex.fedSaved)}.
          </p>

          <p>
            <strong className="text-white">2. Payroll tax.</strong> Wages subject to Social Security and Medicare drop from {usd(100000)} to {usd(100000 - C)} when the HSA is funded through payroll. At 7.65%, that saves {usd(ex.ficaSaved)}. A 401k deferral saves none of this, because 401k contributions still count as FICA wages.
          </p>

          <p>
            <strong className="text-white">3. Total.</strong> {usd(ex.fedSaved)} plus {usd(ex.ficaSaved)} is {usd(ex.hsaToday)}, or {pctr(ex.hsaToday / C)} of the contribution, returned in the first year.
          </p>

          <p>
            <strong className="text-white">4. Growth.</strong> At 7% for {YEARS} years, {usd(C)} becomes {usd(fv)}. If it covers medical costs, you owe nothing on it.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Family Coverage and the Catch-Up</h2>

          <p>
            With family coverage the 2026 limit rises to {usd(HSA_FAMILY)}. At {usd(100000)}, that is {usd(HSA_FAMILY - C)} more room than self-only coverage, and every extra dollar saves tax the same way. Savers aged 55 and older can add $1,000 on top of either limit.
          </p>

          <p>
            Employer contributions count toward the limit. If your employer puts in {usd(500)}, you can add only {usd(C - 500)} on a self-only plan. Check your pay stub before you set your own amount, or you risk an excess contribution that triggers a tax.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Common Mistakes</h2>

          <p>
            <strong className="text-white">Leaving the balance in cash.</strong> Many HSAs pay almost no interest on cash. Most providers let you invest the balance once it passes a set amount. A long-term HSA left in cash gives up the growth that makes it valuable.
          </p>

          <p>
            <strong className="text-white">Paying from the HSA by habit.</strong> If you can cover this year&apos;s bills from your budget, letting the HSA grow gives you more tax-free money later. Keep the receipts.
          </p>

          <p>
            <strong className="text-white">Skipping the match for the HSA.</strong> The match comes first. An employer match is a return no tax break matches.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Order to Fund Them</h2>

          <p>
            <strong className="text-white">1. The 401k up to the full match.</strong> A match is an instant return on your contribution. Nothing else beats it. See <Link href="/blog/how-much-to-save-in-401k" className="text-[#e94560]">how much to save in a 401k</Link>.
          </p>

          <p>
            <strong className="text-white">2. The HSA, to the limit.</strong> If you are eligible, this is the best tax treatment available.
          </p>

          <p>
            <strong className="text-white">3. More 401k.</strong> Return to the 401k and fill it toward {usd(K401_LIMIT)}. Choose between types with <Link href="/blog/roth-vs-traditional-401k" className="text-[#e94560]">Roth vs traditional 401k</Link>.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">When the HSA Is the Wrong Move</h2>

          <p>
            A high-deductible plan can cost more than a traditional plan if you have frequent medical needs. Compare your total yearly cost, premiums plus the deductible you would likely pay, before you switch plans just to open an HSA. The tax saving is a few hundred dollars. A bad plan choice can cost thousands.
          </p>

          <p>
            You also cannot contribute once you enroll in Medicare. Some states, including California and New Jersey, do not give the HSA contribution a state income tax break. Check your state.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How to Use an HSA as a Retirement Account</h2>

          <p>
            Pay current medical bills from cash and keep the receipts. Leave the HSA invested. You can reimburse yourself for those costs years later, tax-free, as long as the expense happened after you opened the account.
          </p>

          <p>
            After age 65, you can also withdraw for any purpose. Non-medical withdrawals are taxed as ordinary income with no penalty, so the account works like a traditional 401k in the worst case. Medical withdrawals stay tax-free.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">See what a pre-tax HSA and 401k contribution does to your paycheck:</p>
            <Link
              href="/finance/take-home-pay"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Take Home Pay Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal, medical or financial advice. Figures use 2026 federal rules, a simplified single-filer model and an assumed 7% return. Your results depend on your state, health plan and employer rules. Consult a qualified professional.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`After the 401k match, fund an HSA before more 401k. A payroll HSA skips income tax AND the 7.65% payroll tax. Worked 2026 examples: www.dayblip.com/blog/hsa-vs-401k`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
