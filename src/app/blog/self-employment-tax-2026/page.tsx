import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { SS_WAGE_BASE, STANDARD_DEDUCTION, federalTax, selfEmploymentTax } from "@/lib/tax2026"

// Every dollar figure below is computed from src/lib/tax2026.ts, the same
// source the Self-Employment Tax Calculator uses, so the two cannot disagree.
// Assumptions: single filer, no other income, standard deduction, no state tax,
// no credits, no qualified business income deduction.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const pct = (n: number) => n.toFixed(1) + "%"

function scenario(net: number) {
  const se = selfEmploymentTax(net)
  const taxable = Math.max(0, net - se.deduction - STANDARD_DEDUCTION.single)
  const fed = federalTax(taxable, "single")
  const total = se.total + fed
  return { net, se, taxable, fed, total }
}

const LEVELS = [30000, 50000, 80000, 120000, 200000].map(scenario)
const ex80 = scenario(80000)
const ex250 = selfEmploymentTax(250000)
const solo60 = selfEmploymentTax(60000)
const mixed60 = selfEmploymentTax(60000, 150000)
const employee50 = 50000 * 0.0765
const se50 = selfEmploymentTax(50000).total

const PAGE_URL = "https://www.dayblip.com/blog/self-employment-tax-2026"
const TITLE = "Self-Employment Tax in 2026: What You Owe and How Much to Set Aside"

const schema = articleSchema(
  TITLE,
  `Self-employment tax is 15.3% of 92.35% of net profit, about 14.1% of what you keep. On ${usd(80000)} of net profit a single filer owes ${usd(ex80.se.total)} in self-employment tax and ${usd(ex80.fed)} in federal income tax.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the self-employment tax rate in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Self-employment tax is 15.3%: 12.4% for Social Security and 2.9% for Medicare. It applies to 92.35% of your net earnings, which works out to about 14.1% of net profit. The Social Security part stops once net earnings reach the ${usd(SS_WAGE_BASE)} wage base for 2026. The Medicare part has no cap.`,
      },
    },
    {
      "@type": "Question",
      name: "Can I deduct part of my self-employment tax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can deduct half of your self-employment tax when you figure your adjusted gross income. That lowers your income tax, but it does not lower the self-employment tax itself.",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to make quarterly estimated tax payments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally yes, if you expect to owe $1,000 or more when you file. The four payment dates are April 15, June 15, September 15 and January 15 of the next year. You usually avoid the underpayment penalty by paying at least the smaller of 90% of this year's tax or 100% of last year's tax (110% if last year's adjusted gross income was above $150,000).",
      },
    },
  ],
}

const relatedTools = [
  { title: "Self-Employment Tax Calculator", href: "/finance/self-employment-tax", description: "Enter your own income, expenses and W-2 pay to see the full bill." },
  { title: "Freelancer Rate Calculator", href: "/finance/freelancer-rate", description: "Find the hourly rate that covers taxes, time off and expenses." },
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "See which federal bracket your income lands in." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Compare your net pay as an employee with your net as a freelancer." },
]

export default function SelfEmploymentTax2026Page() {
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
          <span className="text-white">Self-Employment Tax 2026</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          {TITLE}
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Nobody withholds tax from a freelancer&apos;s payments. Most people see the real number for the first time in April. Here is the math, with worked examples, so you can set money aside before the bill arrives.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Self-employment tax is 15.3% of 92.35% of your net profit, which is about 14.1% of what you keep after business expenses. The Social Security part stops at {usd(SS_WAGE_BASE)} of earnings in 2026. A single filer with {usd(80000)} of net profit owes {usd(ex80.se.total)} in self-employment tax plus {usd(ex80.fed)} in federal income tax. That is {usd(ex80.total)} in total, or {pct((ex80.total / 80000) * 100)} of net profit, before any state tax.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Self-employment tax is about 14.1% of net profit, on top of income tax. On ${usd(80000)} of net profit a single filer owes about ${usd(ex80.total)} in federal tax in 2026. The full math: www.dayblip.com/blog/self-employment-tax-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Self-Employment Tax Actually Is</h2>

          <p>
            As an employee you pay 7.65% of your pay toward Social Security (6.2%) and Medicare (1.45%). Your employer pays the other 7.65%, and you never see it. When you work for yourself, you are both. You pay 15.3%: 12.4% for Social Security and 2.9% for Medicare.
          </p>

          <p>
            The IRS applies that rate to 92.35% of your net earnings, which adjusts for the employer half. Multiply 15.3% by 92.35% and you get about 14.1% of net profit. You owe it once your net earnings from self-employment reach $400.
          </p>

          <p>
            Two limits matter. The Social Security part only applies up to the wage base, which is {usd(SS_WAGE_BASE)} in 2026. The Medicare part has no cap, and an additional 0.9% Medicare tax applies to earnings above $200,000 for single filers. The examples below leave out the additional Medicare tax.
          </p>

          <p>
            The gap with a regular job is real. On {usd(50000)} of pay, an employee pays {usd(employee50)} in payroll tax. A freelancer with {usd(50000)} of net profit pays {usd(se50)}, or {usd(se50 - employee50)} more, because the employer half is now theirs.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What It Costs at Five Income Levels</h2>

          <p>
            These figures assume a single filer with no other income, the {usd(STANDARD_DEDUCTION.single)} standard deduction, no state tax, no credits and no qualified business income deduction. They are federal taxes only.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Net profit</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Self-employment tax</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Federal income tax</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Total</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Share of profit</th>
                </tr>
              </thead>
              <tbody>
                {LEVELS.map((row, i) => (
                  <tr key={row.net} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{usd(row.net)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(row.se.total)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(row.fed)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(row.total)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{pct((row.total / row.net) * 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Self-employment tax stays near 14.1% of profit at every level shown. Income tax is what climbs, because the brackets rise. Above the wage base the rate finally falls: at {usd(250000)} of net profit, self-employment tax is {usd(ex250.total)}, or {pct((ex250.total / 250000) * 100)}, because the Social Security part has stopped.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The {usd(80000)} Example, Step by Step</h2>

          <p>
            <strong className="text-white">1. Find the earnings subject to the tax.</strong> {usd(80000)} × 92.35% = {usd(ex80.se.base)}.
          </p>

          <p>
            <strong className="text-white">2. Apply the two rates.</strong> Social Security at 12.4% is {usd(ex80.se.ss)}. Medicare at 2.9% is {usd(ex80.se.medicare)}. Self-employment tax is {usd(ex80.se.total)}.
          </p>

          <p>
            <strong className="text-white">3. Deduct half of it.</strong> Half of {usd(ex80.se.total)} is {usd(ex80.se.deduction)}, which comes off your income for income-tax purposes.
          </p>

          <p>
            <strong className="text-white">4. Find taxable income.</strong> {usd(80000)} minus {usd(ex80.se.deduction)} minus the {usd(STANDARD_DEDUCTION.single)} standard deduction leaves {usd(ex80.taxable)}.
          </p>

          <p>
            <strong className="text-white">5. Apply the 2026 brackets.</strong> Federal income tax on {usd(ex80.taxable)} is {usd(ex80.fed)}.
          </p>

          <p>
            <strong className="text-white">6. Add them up.</strong> {usd(ex80.se.total)} plus {usd(ex80.fed)} is {usd(ex80.total)}, or {usd(ex80.total / 12)} a month.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Lowers the Bill and What Does Not</h2>

          <p>
            Business expenses lower net profit, so they reduce both the self-employment tax and the income tax. That is why tracking them matters more than any other step.
          </p>

          <p>
            The half-of-self-employment-tax deduction, retirement plan contributions and the qualified business income deduction all work on the income-tax side. None of them reduce the self-employment tax itself, which is calculated on net profit before those items. Eligibility and limits for each depend on your situation, so check the rules or ask a tax professional before you count on them.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">If You Also Have a W-2 Job</h2>

          <p>
            Wages from a job use up the Social Security wage base first. With {usd(60000)} of freelance profit and no other income, self-employment tax is {usd(solo60.total)}. Add {usd(150000)} of W-2 wages and the answer changes. Only {usd(SS_WAGE_BASE - 150000)} of room is left under the wage base, so Social Security tax applies to just {usd(SS_WAGE_BASE - 150000)} of the {usd(mixed60.base)} in earnings subject to the tax. Self-employment tax drops to {usd(mixed60.total)}, a difference of {usd(solo60.total - mixed60.total)}. The Medicare part still applies to all of it.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Paying It During the Year</h2>

          <p>
            Because nothing is withheld, you pay as you go with estimated taxes. You generally need to if you expect to owe $1,000 or more when you file. For the 2026 tax year the four due dates are April 15, June 15, September 15 and January 15, 2027. When a date lands on a weekend or holiday, the deadline moves to the next business day.
          </p>

          <p>
            To avoid the underpayment penalty, you generally need to have paid at least the smaller of two amounts: 90% of this year&apos;s tax, or 100% of last year&apos;s tax. If last year&apos;s adjusted gross income was above $150,000, the second figure becomes 110%. You can pay through your IRS online account, IRS Direct Pay or the IRS app, or by mail with Form 1040-ES.
          </p>

          <p>
            On the {usd(80000)} example, an even split is about {usd(ex80.total / 4)} per quarter for federal tax. Add your state tax on top.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Three Ways It Catches People Off Guard</h2>

          <p>
            <strong className="text-white">The first-year bill arrives all at once.</strong> A new freelancer has no prior-year tax to use as a guide and no withholding to soften April. The full year of self-employment tax and income tax comes due together.
          </p>

          <p>
            <strong className="text-white">It starts with the first dollar.</strong> Once net earnings reach $400, the 14.1% applies to all of them, not just the amount above some threshold, and there is no standard deduction against it.
          </p>

          <p>
            <strong className="text-white">Income-tax-only estimates run low.</strong> A freelancer who sets aside only the income-tax share is short by the self-employment tax, which is another 14.1% of profit.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Enter your own income, expenses and W-2 pay to see your full federal bill and a quarterly payment:</p>
            <Link
              href="/finance/self-employment-tax"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Self-Employment Tax Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal or financial advice. Figures use 2026 federal rules and a simplified single-filer example. Your tax depends on your state, deductions, credits and other income. Consult a qualified tax professional for your situation.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Self-employment tax is about 14.1% of net profit, on top of income tax. On ${usd(80000)} of net profit a single filer owes about ${usd(ex80.total)} in federal tax in 2026. The full math: www.dayblip.com/blog/self-employment-tax-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
