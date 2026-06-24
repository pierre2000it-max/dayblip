import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Read Your W-2 Form — Every Box Explained",
  description: "The W-2 is the IRS form your employer sends each January showing what you earned and what was withheld. Box 1 is not your gross salary. Box 3 is often different from Box 1. Box 12 has 30+ codes most people ignore.",
  url: "https://www.dayblip.com/blog/how-to-read-your-w2",
  datePublished: "2026-06-24",
  dateModified: "2026-06-24",
  author: { "@type": "Organization", name: "Dayblip" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is Box 1 on my W-2 less than my salary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Box 1 shows federal taxable wages — your gross salary minus pre-tax deductions. Traditional 401k contributions (Code D in Box 12), health insurance premiums paid pre-tax through your employer, HSA contributions (Code W in Box 12), dependent care FSA, and transit benefits all reduce Box 1 from your gross salary. For example, a $75,000 salary with $10,000 in 401k contributions and $3,200 in health insurance premiums produces a Box 1 of $59,800.",
      },
    },
    {
      "@type": "Question",
      name: "What does Code D mean in Box 12 of my W-2?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Code D in Box 12 represents your traditional 401k contributions for the year. This amount was excluded from Box 1, which is why it does not appear in your federal taxable income. The 2025 contribution limit was $23,500 per IRS Revenue Procedure 2025-32.",
      },
    },
    {
      "@type": "Question",
      name: "Why is Box 3 (Social Security wages) higher than Box 1?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some pre-tax deductions that reduce Box 1 do NOT reduce Box 3. For example, traditional 401k contributions reduce both Box 1 and Box 3. However, health insurance premiums paid through a Section 125 cafeteria plan reduce Box 1 but may not reduce Box 3, depending on the plan structure. This means Box 3 can be higher than Box 1 for some workers.",
      },
    },
  ],
}

const relatedTools = [
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "See which federal and state brackets your income falls into." },
  { title: "Paycheck Calculator", href: "/finance/paycheck-calculator", description: "Calculate exact take-home pay for any salary." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Your exact net pay after all taxes and deductions." },
  { title: "Overtime Tax Calculator", href: "/finance/overtime-tax", description: "See how overtime pay affects your effective tax rate." },
]

export default function HowToReadYourW2Page() {
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
          <span className="text-white">How to Read Your W-2</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · June 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          How to Read Your W-2 Form — Every Box Explained
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most people glance at the deposit number and file. The rest of the form tells you exactly where your money went — and reveals whether your withholding was right.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              The W-2 (Wage and Tax Statement) is the IRS form your employer sends each January showing what you earned and what was withheld in the prior tax year. The most important boxes are Box 1 (federal taxable wages — not your gross salary), Box 2 (federal income tax withheld), Box 3 (Social Security wages — often different from Box 1), Box 4 (Social Security tax withheld — 6.2% of Box 3), Box 5 (Medicare wages) and Box 6 (Medicare tax withheld — 1.45% of Box 5). Box 12 contains coded information about retirement contributions, health savings accounts, and other benefits. Source: IRS General Instructions for Forms W-2 and W-3, 2026.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text="Box 1 on your W-2 is NOT your salary. Box 3 is often higher than Box 1. Box 12 has 30+ codes most people never look at. Every box explained in plain English: www.dayblip.com/blog/how-to-read-your-w2"
            url="https://www.dayblip.com/blog/how-to-read-your-w2"
            title="How to Read Your W-2 Form — Every Box Explained"
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Why Box 1 Is Not Your Gross Salary</h2>

          <p>
            The single most common W-2 misconception: Box 1 equals your annual salary. It does not. Box 1 — Wages, Tips, Other Compensation — shows your federal taxable wages, which is your gross salary minus pre-tax deductions.
          </p>

          <p>
            What reduces your Box 1 from gross: traditional 401k contributions (Code D in Box 12), health insurance premiums paid pre-tax through your employer plan, Health Savings Account contributions (Code W in Box 12), dependent care FSA contributions (shown in Box 10), and transit or parking benefits (Code Q in Box 12).
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Item</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Gross salary", amount: "$75,000" },
                  { label: "Less 401k contribution", amount: "−$10,000" },
                  { label: "Less health insurance premium", amount: "−$3,200" },
                  { label: "Less HSA contribution", amount: "−$2,000" },
                  { label: "Box 1 — federal taxable wages", amount: "$59,800" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.label}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${i === 4 ? "text-[#F9A825]" : row.amount.startsWith("−") ? "text-[#FF6B6B]" : "text-white"}`}>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            This is why your Box 1 is often meaningfully lower than your annual salary — and why your federal tax bill is lower than a simple rate applied to gross salary would suggest.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Boxes 1 Through 6 — The Core Tax Data</h2>

          <p>
            <strong className="text-white">Box 1 — Wages, Tips, Other Compensation:</strong> Your federal taxable wages. This is what you report as income on Form 1040 Line 1a. Not gross salary.
          </p>

          <p>
            <strong className="text-white">Box 2 — Federal Income Tax Withheld:</strong> Total federal income tax withheld from all paychecks during the year. Compare this to your actual federal tax liability on your return. If Box 2 is more than you owe, you get a refund. If Box 2 is less than you owe, you owe the difference — and may owe an underpayment penalty if the gap is large enough.
          </p>

          <p>
            <strong className="text-white">Box 3 — Social Security Wages:</strong> Wages subject to Social Security tax. For most workers this equals gross salary. Some pre-tax deductions that reduce Box 1 do not reduce Box 3 — meaning Box 3 can be higher than Box 1. The 2025 Social Security wage base was $176,100 per IRS instructions. Wages above $176,100 are not subject to Social Security tax.
          </p>

          <p>
            <strong className="text-white">Box 4 — Social Security Tax Withheld:</strong> Should equal Box 3 multiplied by 6.2%. If you had two employers during the year, check this carefully — you may have overpaid Social Security tax and can claim a credit on your return.
          </p>

          <p>
            <strong className="text-white">Box 5 — Medicare Wages and Tips:</strong> Almost always equals gross salary. There is no wage cap on Medicare wages — unlike Social Security, every dollar of earnings is subject to Medicare tax.
          </p>

          <p>
            <strong className="text-white">Box 6 — Medicare Tax Withheld:</strong> Should equal Box 5 multiplied by 1.45% for most workers. If you earned over $200,000, an additional 0.9% applies per the Affordable Care Act. Your employer withholds this additional amount once your wages exceed $200,000 in the year.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Box 12 — The Coded Box Most People Skip</h2>

          <p>
            Box 12 contains important information under letter codes. Here are the codes most workers encounter:
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Code</th>
                  <th className="text-left px-4 py-3 text-white font-semibold">What It Means</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "D", meaning: "Traditional 401k contributions. Excluded from Box 1. 2025 limit: $23,500." },
                  { code: "W", meaning: "Employer + employee HSA contributions. Both types appear here." },
                  { code: "DD", meaning: "Cost of employer-sponsored health insurance. Informational only — not taxable, not deductible." },
                  { code: "AA", meaning: "Roth 401k contributions. These were NOT excluded from Box 1 — you already paid tax. Withdrawals in retirement are tax-free." },
                  { code: "EE", meaning: "Roth 403(b) contributions. Same tax treatment as Code AA." },
                  { code: "Q", meaning: "Nontaxable military pay." },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-bold text-[#F9A825]">{row.code}</td>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            New in 2026 per IRS instructions: Box 14 has been split into Box 14a and Box 14b. Employers now separately report overtime compensation in Box 14a to align with the 2025 OBBBA overtime deduction provisions.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Box 13 and Box 14 — Checkboxes and Everything Else</h2>

          <p>
            <strong className="text-white">Box 13 — Three checkboxes:</strong> Statutory Employee (you pay self-employment tax but employer does not withhold it), Retirement Plan (you participated in an employer retirement plan — this affects IRA deduction limits on your return), and Third-party Sick Pay (disability payments from a third party).
          </p>

          <p>
            <strong className="text-white">Box 14a — Other:</strong> Employers report miscellaneous information here. Common items include union dues, educational assistance, state disability insurance premiums, and health insurance premiums. New in 2026: overtime pay deduction information must be reported separately here per updated IRS instructions.
          </p>

          <p>
            <strong className="text-white">Boxes 15 through 20 — State and local tax information:</strong> Box 15 is your state employer ID, Box 16 is state wages, Box 17 is state income tax withheld, Box 18 is local wages, Box 19 is local income tax withheld, and Box 20 is the name of the locality. If you worked in a state with no income tax, these boxes may be blank or show zero.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Calculate how much federal and state tax you should have paid on your salary:</p>
            <Link
              href="/finance/tax-bracket"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Tax Bracket Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article explains W-2 form boxes for educational purposes. For your specific tax situation consult a qualified tax professional. Tax situations vary by individual.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text="Box 1 on your W-2 is NOT your salary. Box 3 is often higher than Box 1. Box 12 has 30+ codes most people never look at. Every box explained in plain English: www.dayblip.com/blog/how-to-read-your-w2"
            url="https://www.dayblip.com/blog/how-to-read-your-w2"
            title="How to Read Your W-2 Form — Every Box Explained"
          />
        </div>

      </div>
    </main>
  )
}
