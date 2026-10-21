import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { BRACKETS, STANDARD_DEDUCTION } from "@/lib/tax2026"
import {
  AGED_EXTRA_MARRIED, AGED_EXTRA_UNMARRIED, CHARITY_NON_ITEMIZER, MORTGAGE_DEBT_LIMIT, SALT_CAP_2026,
  SALT_FLOOR, SALT_PHASEDOWN_START, SENIOR_DEDUCTION, SENIOR_PHASEOUT_START, breakEvenOtherItems,
  charityItemized, medicalDeduction, saltDeduction, seniorDeduction, taxWithBest,
} from "@/lib/itemizing"

// Every dollar figure is computed from src/lib/tax2026.ts and src/lib/itemizing.ts.
// Literals: the 35% benefit cap for the 37% bracket and the $750,000 debt limit rules
// are stated in prose. Re-check the itemizing.ts header each January.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const STD = STANDARD_DEDUCTION
const PAGE_URL = "https://www.dayblip.com/blog/standard-deduction-vs-itemizing-2026"
const TITLE = "Standard Deduction vs Itemizing in 2026: Which Saves More?"

// First-year interest on a 30-year fixed loan.
function firstYearInterest(loan: number, rate: number) {
  const r = rate / 12
  const pay = (loan * r) / (1 - Math.pow(1 + r, -360))
  let bal = loan
  let interest = 0
  for (let i = 0; i < 12; i++) {
    const int = bal * r
    interest += int
    bal -= pay - int
  }
  return interest
}

// Example A: single, $85,000, renter.
const A = (() => {
  const agi = 85000, saltPaid = 6500, gifts = 2000
  const salt = saltDeduction(saltPaid, agi)
  const charity = charityItemized(gifts, agi)
  const itemized = salt + charity
  return { agi, saltPaid, gifts, salt, charity, itemized, ...taxWithBest(agi, itemized, "single") }
})()

// Example B: married filing jointly, $160,000, $400,000 mortgage at 6.5%.
const B = (() => {
  const agi = 160000, loan = 400000, rate = 0.065, prop = 6000, stateInc = 7000, gifts = 3000
  const interest = firstYearInterest(loan, rate)
  const salt = saltDeduction(prop + stateInc, agi)
  const charity = charityItemized(gifts, agi)
  const itemized = interest + salt + charity
  const std = taxWithBest(agi, 0, "mfj")
  const item = taxWithBest(agi, itemized, "mfj")
  return { agi, loan, rate, prop, stateInc, gifts, interest, salt, charity, itemized, std, item, saved: std.tax - item.tax }
})()

// Break-even mortgage rows.
const BE = [
  { label: "Single, " + usd(85000) + " income", filing: "single" as const, agi: 85000, salt: 8000, gifts: 1500 },
  { label: "Married, " + usd(160000) + " income", filing: "mfj" as const, agi: 160000, salt: 13000, gifts: 3000 },
].map((r) => {
  const known = saltDeduction(r.salt, r.agi) + charityItemized(r.gifts, r.agi)
  const need = breakEvenOtherItems(r.filing, known)
  return { ...r, known, need, loan: need / 0.065 }
})

// SALT cap table.
const SALT_ROWS = [10000, 20000, 30000, 50000].map((p) => ({
  paid: p, low: saltDeduction(p, 200000), high: saltDeduction(p, 605000),
}))

// Bunching example: single, $90,000, $12,000 of SALT and mortgage interest, $5,000 of gifts a year.
const BUNCH = (() => {
  const agi = 90000, other = 12000, gifts = 5000
  const yearly = taxWithBest(agi, other + charityItemized(gifts, agi), "single")
  const heavy = taxWithBest(agi, other + charityItemized(gifts * 2, agi), "single")
  const light = taxWithBest(agi, other, "single")
  const base = yearly.tax * 2
  const bunched = heavy.tax + light.tax
  return { agi, other, gifts, yearly, heavy, light, base, bunched, saved: base - bunched }
})()

const MED_AGI = 80000
const MED_EXP = 9000
const MED = medicalDeduction(MED_EXP, MED_AGI)
const TOP_START = BRACKETS.single[5][0]

const schema = articleSchema(
  TITLE,
  `Take the standard deduction unless your itemized deductions top ${usd(STD.single)} for a single filer or ${usd(STD.mfj)} for a married couple filing jointly in 2026. In the married example below, itemizing saves ${usd(B.saved)} in federal tax.`,
  PAGE_URL,
  "2026-10-20"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the standard deduction for 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `For tax year 2026 the standard deduction is ${usd(STD.single)} for single filers and married filing separately, ${usd(STD.hoh)} for head of household, and ${usd(STD.mfj)} for married filing jointly.`,
      },
    },
    {
      "@type": "Question",
      name: "When should I itemize deductions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Itemize when the total of your itemized deductions is larger than your standard deduction. The main items are mortgage interest, state and local taxes up to the ${usd(SALT_CAP_2026)} cap, charitable gifts above 0.5% of income, and medical costs above 7.5% of income.`,
      },
    },
    {
      "@type": "Question",
      name: "What is the SALT deduction cap in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The cap on state and local tax deductions is ${usd(SALT_CAP_2026)} for 2026. It shrinks by 30 cents for each dollar of income over ${usd(SALT_PHASEDOWN_START)}, and it never drops below ${usd(SALT_FLOOR)}.`,
      },
    },
    {
      "@type": "Question",
      name: "Can I deduct charity if I take the standard deduction?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Starting in 2026, yes. Standard-deduction filers can deduct up to ${usd(CHARITY_NON_ITEMIZER.single)} (${usd(CHARITY_NON_ITEMIZER.mfj)} for joint filers) of cash gifts to qualifying charities. Gifts to donor-advised funds do not qualify.`,
      },
    },
  ],
}

const relatedTools = [
  { title: "Tax Bracket Calculator", href: "/finance/tax-bracket", description: "See your marginal rate after the deduction you choose." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Turn your salary into take-home pay with 2026 taxes." },
  { title: "Mortgage Calculator", href: "/finance/mortgage-calculator", description: "Estimate your payment and first-year interest." },
  { title: "401k Calculator", href: "/finance/401k-calculator", description: "Pre-tax contributions lower income before deductions apply." },
]

export default function StandardDeductionVsItemizingPage() {
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
          <span className="text-white">Standard Deduction vs Itemizing</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Finance</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Most filers never run this comparison. Their software picks for them. Knowing the break-even point shows you when a mortgage, a big charity year or a state tax bill changes the answer.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              Take the standard deduction unless your itemized deductions add up to more than {usd(STD.single)} (single) or {usd(STD.mfj)} (married filing jointly) in 2026. Itemizing wins for the married couple below: {usd(B.itemized)} of deductions against {usd(STD.mfj)}, which saves {usd(B.saved)} in federal tax. The single renter loses by {usd(STD.single - A.itemized)} and should not itemize.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Standard deduction or itemize in 2026? Itemize only when your deductions top ${usd(STD.single)} (single) or ${usd(STD.mfj)} (married). Worked examples: www.dayblip.com/blog/standard-deduction-vs-itemizing-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The 2026 Standard Deduction</h2>

          <p>
            Every filer gets a flat deduction with no receipts. You take it, or you itemize instead. You cannot do both. You pick whichever is larger.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Filing status</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">2026 standard deduction</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Single", STD.single],
                  ["Married filing separately", STD.mfs],
                  ["Head of household", STD.hoh],
                  ["Married filing jointly", STD.mfj],
                ].map(([label, amount], i) => (
                  <tr key={label as string} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-white">{label}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825] font-semibold">{usd(amount as number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Itemizing only pays when your eligible expenses beat that number. For a couple, that bar is {usd(STD.mfj)}, which is why households without a mortgage rarely clear it. See how these amounts fit into the brackets in <Link href="/blog/federal-tax-brackets-2026" className="text-[#e94560]">Federal Tax Brackets 2026</Link>.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Counts When You Itemize</h2>

          <p>
            <strong className="text-white">State and local taxes (SALT).</strong> You can deduct state income tax or sales tax, plus property tax. The 2026 cap is {usd(SALT_CAP_2026)}. It shrinks by 30 cents for every dollar of income over {usd(SALT_PHASEDOWN_START)} and never falls below {usd(SALT_FLOOR)}.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">State and local taxes paid</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Deductible at {usd(200000)} income</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Deductible at {usd(605000)} income</th>
                </tr>
              </thead>
              <tbody>
                {SALT_ROWS.map((r, i) => (
                  <tr key={r.paid} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-white">{usd(r.paid)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.low)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            <strong className="text-white">Mortgage interest.</strong> Deductible on up to {usd(MORTGAGE_DEBT_LIMIT)} of home purchase debt. Home equity interest counts only if the money bought, built or improved the home.
          </p>

          <p>
            <strong className="text-white">Charitable gifts.</strong> New in 2026, itemized gifts count only above 0.5% of your income. On {usd(A.agi)} of income, the first {usd(A.agi * 0.005)} of gifts earns nothing.
          </p>

          <p>
            <strong className="text-white">Medical costs.</strong> Only the part above 7.5% of income counts. With {usd(MED_AGI)} of income and {usd(MED_EXP)} of medical bills, the deductible amount is {usd(MED)}.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Example 1: Single Renter at {usd(A.agi)}</h2>

          <p>
            This filer pays {usd(A.saltPaid)} in state income tax and gives {usd(A.gifts)} to charity. State tax counts in full under the cap: {usd(A.salt)}. Charity counts as {usd(A.charity)} after the 0.5% floor. The itemized total is {usd(A.itemized)}.
          </p>

          <p>
            The standard deduction is {usd(STD.single)}. Standard wins by {usd(STD.single - A.itemized)}, and federal tax comes to {usd(A.tax)}. With no mortgage, this filer is unlikely to itemize at any normal income.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Example 2: Married Couple with a {usd(B.loan)} Mortgage</h2>

          <p>
            This couple earns {usd(B.agi)} and pays {usd(B.prop)} in property tax and {usd(B.stateInc)} in state income tax. They give {usd(B.gifts)} to charity. Their {usd(B.loan)} loan at {(B.rate * 100).toFixed(1)}% costs about {usd(B.interest)} in interest in year 1.
          </p>

          <p>
            Itemized total: {usd(B.interest)} interest, {usd(B.salt)} state and local taxes and {usd(B.charity)} charity, for {usd(B.itemized)}. The standard deduction is {usd(STD.mfj)}.
          </p>

          <p>
            Federal tax on the standard deduction is {usd(B.std.tax)}. With itemizing it is {usd(B.item.tax)}. <strong className="text-white">The couple saves {usd(B.saved)}</strong> by itemizing, even though they only beat the standard deduction by {usd(B.itemized - STD.mfj)}.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How Big a Mortgage Does It Take?</h2>

          <p>
            Mortgage interest is the item that most often tips a household over. This table holds the other deductions fixed and solves for the interest needed to reach the standard deduction. The loan size assumes roughly 6.5% interest.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Household</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">SALT + charity counted</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Interest needed</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Loan balance, about</th>
                </tr>
              </thead>
              <tbody>
                {BE.map((r, i) => (
                  <tr key={r.label} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-white">{r.label}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.known)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.need)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(r.loan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Interest is highest in the early years of a loan, so a balance below those figures can still win in year 1 and lose by year 10. Test your own numbers each year. The <Link href="/blog/renting-vs-buying-2026" className="text-[#e94560]">renting vs buying guide</Link> covers the rest of the ownership math.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Bunching: Itemize Every Other Year</h2>

          <p>
            If your deductions sit near the line, you can move them. Bunching means paying 2 years of charitable gifts in 1 year, then taking the standard deduction the next.
          </p>

          <p>
            Take a single filer with {usd(BUNCH.agi)} of income, {usd(BUNCH.other)} of state taxes and mortgage interest, and {usd(BUNCH.gifts)} in gifts every year. Giving evenly, the itemized total is {usd(BUNCH.yearly.deduction)} each year, only {usd(BUNCH.yearly.deduction - STD.single)} above the standard deduction. Two years of tax: {usd(BUNCH.base)}.
          </p>

          <p>
            Giving {usd(BUNCH.gifts * 2)} in year 1 and nothing in year 2 gives a year-1 deduction of {usd(BUNCH.heavy.deduction)}. Year 2 falls back to the {usd(STD.single)} standard deduction. Two years of tax: {usd(BUNCH.bunched)}. <strong className="text-white">The filer saves {usd(BUNCH.saved)}</strong> with the same total giving. A donor-advised fund lets you make the large gift in year 1 and spread the grants to charities over time.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">If You Are 65 or Older</h2>

          <p>
            Your standard deduction rises by {usd(AGED_EXTRA_UNMARRIED)} if you are unmarried, or {usd(AGED_EXTRA_MARRIED)} per spouse if you are married. A single filer 65 or older gets {usd(STD.single + AGED_EXTRA_UNMARRIED)}. A couple where both spouses qualify gets {usd(STD.mfj + 2 * AGED_EXTRA_MARRIED)}.
          </p>

          <p>
            A separate senior deduction of {usd(SENIOR_DEDUCTION)} per person runs from 2025 through 2028, and you get it whether you itemize or not. It phases out by 6 cents per dollar of income over {usd(SENIOR_PHASEOUT_START.single)} (single) or {usd(SENIOR_PHASEOUT_START.mfj)} (joint). A single filer at {usd(100000)} of income keeps {usd(seniorDeduction(1, 100000, "single"))} of it.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">New for Standard-Deduction Filers in 2026</h2>

          <p>
            You can now deduct up to {usd(CHARITY_NON_ITEMIZER.single)} of cash gifts ({usd(CHARITY_NON_ITEMIZER.mfj)} for joint filers) without itemizing. The gift has to go straight to a qualifying charity. Donor-advised funds and supporting organizations do not count.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Common Mistakes</h2>

          <p>
            <strong className="text-white">Itemizing because you own a home.</strong> A mortgage alone does not guarantee a win. Example 1 shows what happens without enough deductions, and the table above shows how much interest it takes.
          </p>

          <p>
            <strong className="text-white">Counting SALT without the cap.</strong> A household paying {usd(50000)} in state and local taxes deducts {usd(SALT_CAP_2026)} at most, and as little as {usd(SALT_FLOOR)} at high incomes.
          </p>

          <p>
            <strong className="text-white">Forgetting your state return.</strong> States set their own rules. Some require you to use the same method as your federal return. Check yours before you choose.
          </p>

          <p>
            <strong className="text-white">Ignoring the high-income limit.</strong> Above {usd(TOP_START)} of taxable income (single), where the 37% bracket starts, itemized deductions cut tax at 35%, not 37%.
          </p>

          <p>
            Pre-tax savings lower the income these deductions are measured against. See how an HSA changes the picture in <Link href="/blog/hsa-vs-401k" className="text-[#e94560]">HSA vs 401k</Link>.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Find your marginal rate after the deduction you choose:</p>
            <Link
              href="/finance/tax-bracket"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Tax Bracket Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute tax, legal or financial advice. Figures use 2026 federal rules (IRS Rev. Proc. 2025-32 for the standard deduction) and simplified examples that ignore credits, other income types and state tax. Your results depend on your full return. Consult a qualified tax professional.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Standard deduction or itemize in 2026? Itemize only when your deductions top ${usd(STD.single)} (single) or ${usd(STD.mfj)} (married). Worked examples: www.dayblip.com/blog/standard-deduction-vs-itemizing-2026`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
