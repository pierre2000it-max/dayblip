import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { freelanceRate, type FreelanceInputs } from "@/lib/freelanceRate"

// Every figure is computed from src/lib/freelanceRate.ts, the model the
// Freelancer Rate Calculator uses, so the article and the tool cannot disagree.
// Example: single filer in a state with no income tax (TX), $75,000 target
// take-home, 4 weeks off, 30 billable hours a week, $200 a month in business
// expenses, $400 a month health insurance, $500 a month retirement saving.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const usd2 = (n: number) => "$" + n.toFixed(2)

const BASE: FreelanceInputs = {
  income: 75000, vacationWeeks: 4, billablePerWeek: 30,
  bizMonthly: 200, healthMonthly: 400, retirementMonthly: 500, state: "TX",
}
const f = freelanceRate(BASE)
const naive = BASE.income / 2080
const multiple = f.baseRate / naive
const hoursRows = [15, 20, 25, 30, 35].map((h) => ({ h, f: freelanceRate({ ...BASE, billablePerWeek: h }) }))
const noRetire = freelanceRate({ ...BASE, retirementMonthly: 0 })
const b = f.breakdown

const PAGE_URL = "https://www.dayblip.com/blog/how-to-set-freelance-rate"
const TITLE = "How to Set Your Freelance Hourly Rate in 2026"

const schema = articleSchema(
  TITLE,
  `To take home ${usd(BASE.income)} as a freelancer billing ${BASE.billablePerWeek} hours a week, a single filer with no state income tax needs about ${usd2(f.baseRate)} an hour. A salary of the same size works out to ${usd2(naive)} an hour.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I calculate my freelance hourly rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Add the take-home income you want, your business expenses, health insurance, retirement saving and every tax, then divide by the hours you can actually bill. With ${usd(BASE.income)} of take-home and ${f.totalBillableHours.toLocaleString("en-US")} billable hours a year, the answer is about ${usd2(f.baseRate)} an hour.`,
      },
    },
    {
      "@type": "Question",
      name: "Why is a freelance rate higher than an employee's hourly wage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Freelancers pay both halves of Social Security and Medicare tax, buy their own health insurance and retirement plan, and bill only part of the hours they work. A salary of ${usd(BASE.income)} is ${usd2(naive)} an hour over 2,080 hours. The same take-home as a freelancer needs ${usd2(f.baseRate)}, about ${multiple.toFixed(1)} times as much.`,
      },
    },
    {
      "@type": "Question",
      name: "How many hours can a freelancer bill in a week?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many freelancers bill well under 40 hours because finding clients, sending invoices, scoping projects and handling admin are unpaid. This article uses 30 billable hours a week as an example. Track your own for a month before you trust any number.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Freelancer Rate Calculator", href: "/finance/freelancer-rate", description: "Enter your own income, expenses and state to get your rate." },
  { title: "Self-Employment Tax Guide", href: "/blog/self-employment-tax-2026", description: "How the 15.3% is figured and when you pay it." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Compare a salary's net pay with freelance take-home." },
  { title: "True Hourly Wage", href: "/blog/true-hourly-wage", description: "What your pay works out to once unpaid time is counted." },
]

export default function HowToSetFreelanceRatePage() {
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
          <span className="text-white">Freelance Hourly Rate</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most new freelancers divide their old salary by 2,080 hours and quote that. It&apos;s the most common way to underprice. Here is the math that gets you to a rate that actually pays you.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              To take home {usd(BASE.income)} a year billing {BASE.billablePerWeek} hours a week for {f.workWeeks} weeks, you need about {usd2(f.baseRate)} an hour. A {usd(BASE.income)} salary is only {usd2(naive)} an hour. The gap comes from self-employment tax, health insurance, retirement saving, business costs and {f.totalBillableHours.toLocaleString("en-US")} billable hours instead of 2,080. This example assumes a single filer in a state with no income tax.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`To take home ${usd(BASE.income)} as a freelancer billing ${BASE.billablePerWeek} hours a week you need about ${usd2(f.baseRate)} an hour, not ${usd2(naive)}. The math: www.dayblip.com/blog/how-to-set-freelance-rate`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why Salary Divided by 2,080 Fails</h2>

          <p>
            An employee is paid for about 2,080 hours a year: 40 hours for 52 weeks. A freelancer is paid only for hours a client agrees to buy. Time spent finding clients, writing proposals, sending invoices and fixing your own tools earns nothing.
          </p>

          <p>
            Take 4 weeks off and bill {BASE.billablePerWeek} hours in each of the other {f.workWeeks} weeks. That is {f.totalBillableHours.toLocaleString("en-US")} billable hours, about {Math.round((f.totalBillableHours / 2080) * 100)}% of an employee&apos;s year. The same income has to fit into fewer paid hours, so the hourly number rises before you add a single cost.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Rate Has to Cover</h2>

          <p>
            Here is the full bill for {usd(BASE.income)} of take-home. Each line is the cost spread over your {f.totalBillableHours.toLocaleString("en-US")} billable hours.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Cost</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Per year</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Per billable hour</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Take-home you want", hr: b.incomeHr },
                  { label: "Business expenses", hr: b.bizHr },
                  { label: "Health insurance", hr: b.hiHr },
                  { label: "Retirement saving", hr: b.retHr },
                  { label: "Self-employment tax", hr: b.seHr },
                  { label: "Federal income tax", hr: b.taxHr },
                ].map((r, i) => (
                  <tr key={r.label} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-white">{r.label}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.hr * f.totalBillableHours)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd2(r.hr)}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #e94560", background: "#1e2d4a" }}>
                  <td className="px-4 py-3 font-bold text-white">Revenue to bill</td>
                  <td className="px-4 py-3 text-right font-bold text-[#e94560]">{usd(f.revenue)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#e94560]">{usd2(f.baseRate)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Taxes take {usd2(b.seHr + b.taxHr)} of every billable hour. Self-employment tax alone is {usd2(b.seHr)}, because you pay both the employer and employee halves of Social Security and Medicare. The tax figures use 2026 federal rules, a single filer and the standard deduction, and they are figured on the revenue you bill after business expenses and the health insurance deduction.
          </p>

          <p>
            The example treats retirement saving as after-tax money. If you put it into a deductible plan such as a SEP-IRA, your tax bill falls and the rate you need falls with it. Set the retirement line to $0 and the rate drops from {usd2(f.baseRate)} to {usd2(noRetire.baseRate)}.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Billable Hours Move the Rate the Most</h2>

          <p>
            No other input changes the answer as much. Same income, same costs, different billable hours:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Billable hours a week</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Billable hours a year</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Rate needed</th>
                </tr>
              </thead>
              <tbody>
                {hoursRows.map((r, i) => (
                  <tr key={r.h} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{r.h}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{r.f.totalBillableHours.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd2(r.f.baseRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            At 15 billable hours a week the rate needed is {usd2(hoursRows[0].f.baseRate)}. At 35 it is {usd2(hoursRows[4].f.baseRate)}. If you assume you will bill 35 hours and actually bill 20, you are charging {usd2(hoursRows[4].f.baseRate)} when you needed {usd2(hoursRows[1].f.baseRate)}. Track your real billable hours for a month before you set a number.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Treat the Hourly Rate as a Floor</h2>

          <p>
            This number is the least you can charge and still hit your goal. It is not what the work is worth. For a fixed-price project, estimate the hours, multiply by your floor rate, then price above that if the result is worth more to the client than the hours it takes you. A rate that covers your costs keeps you solvent. A price based on the value you deliver is how you earn more than the floor.
          </p>

          <p>
            Add padding for what hours estimates miss: revisions, calls and a late client. If a project takes 20 hours of work, plan on more than 20 billable hours to deliver it.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Check Your Own Numbers</h2>

          <p>
            The example assumes a state with no income tax. Your state tax, expenses and health insurance cost will change the answer. The calculator below uses the same model and lets you enter your own.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Enter your target income, billable hours, costs and state to get your hourly rate:</p>
            <Link
              href="/finance/freelancer-rate"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Freelancer Rate Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal or financial advice. Figures use 2026 federal rules and a simplified single-filer example with no state income tax. Your tax depends on your state, deductions, credits and other income. Consult a qualified tax professional for your situation.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`To take home ${usd(BASE.income)} as a freelancer billing ${BASE.billablePerWeek} hours a week you need about ${usd2(f.baseRate)} an hour, not ${usd2(naive)}. The math: www.dayblip.com/blog/how-to-set-freelance-rate`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
