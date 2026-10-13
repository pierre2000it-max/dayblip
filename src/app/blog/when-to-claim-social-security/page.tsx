import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema } from "@/lib/schema"
import { claimFactorAtAge, fraLabel } from "@/lib/socialSecurity"

// Every percentage and dollar figure is computed from src/lib/socialSecurity.ts,
// the same rules the Social Security Calculator uses (SSA full retirement age
// table, early reduction, 8% a year delayed credits).
// Example: born 1960 or later (full retirement age 67), $2,000 a month at 67.
// Break-even ignores cost-of-living adjustments, taxes and investment returns.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const pct = (n: number) => n.toFixed(n % 1 === 0 ? 0 : 1) + "%"

const BY = 1965
const FRA_BENEFIT = 2000
const AGES = [62, 63, 64, 65, 66, 67, 68, 69, 70]
const ROWS = AGES.map((age) => {
  const f = claimFactorAtAge(age, BY)
  return { age, f, monthly: FRA_BENEFIT * f }
})
const at = (age: number) => ROWS.find((r) => r.age === age)!
const m62 = at(62).monthly
const m67 = at(67).monthly
const m70 = at(70).monthly

// Break-even age: the age at which total benefits collected from the later
// claiming age catch up with total collected from the earlier one.
function breakEven(earlyAge: number, lateAge: number) {
  const e = at(earlyAge).monthly
  const l = at(lateAge).monthly
  const monthsFromEarly = (l * (lateAge - earlyAge) * 12) / (l - e)
  return earlyAge + monthsFromEarly / 12
}
const be62v67 = breakEven(62, 67)
const be67v70 = breakEven(67, 70)
const be62v70 = breakEven(62, 70)
const age = (n: number) => n.toFixed(1)

const FRA_TABLE = [1954, 1955, 1956, 1957, 1958, 1959, 1960].map((by) => ({
  label: by === 1954 ? "1943 to 1954" : by === 1960 ? "1960 and later" : String(by),
  fra: fraLabel(by),
  at62: (1 - claimFactorAtAge(62, by)) * 100,
}))

const PAGE_URL = "https://www.dayblip.com/blog/when-to-claim-social-security"
const TITLE = "When to Claim Social Security: Age 62, 67 or 70?"

const schema = articleSchema(
  TITLE,
  `For someone with a full retirement age of 67, claiming at 62 pays ${pct(at(62).f * 100)} of the full benefit and claiming at 70 pays ${pct(at(70).f * 100)}. The break-even between 62 and 70 is about age ${age(be62v70)}.`,
  PAGE_URL,
  "2026-10-13"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much is Social Security reduced if I claim at 62?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It depends on your birth year. For people born in 1960 or later, with a full retirement age of 67, claiming at 62 cuts the monthly benefit by ${pct((1 - at(62).f) * 100)}. For people born in 1954 or earlier, the cut is 25%. The reduction is permanent.`,
      },
    },
    {
      "@type": "Question",
      name: "How much more do I get by waiting until 70?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `For each year you delay past full retirement age, the benefit grows 8%, up to age 70. For someone with a full retirement age of 67, waiting until 70 pays ${pct(at(70).f * 100)} of the full benefit, or ${pct((at(70).f / at(62).f - 1) * 100)} more than claiming at 62. There is no credit for waiting past 70.`,
      },
    },
    {
      "@type": "Question",
      name: "What is the break-even age for Social Security?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The break-even age is when total benefits from claiming later catch up with claiming earlier. With a full retirement age of 67, claiming at 67 instead of 62 breaks even near age ${age(be62v67)}. Claiming at 70 instead of 67 breaks even near age ${age(be67v70)}. These ignore cost-of-living adjustments, taxes and investment returns.`,
      },
    },
  ],
}

const relatedTools = [
  { title: "Social Security Calculator", href: "/finance/social-security", description: "Enter your birth year and benefit to compare every claiming age." },
  { title: "Retirement Savings Calculator", href: "/finance/retirement-savings", description: "See how much you need besides Social Security." },
  { title: "Financial Independence Date", href: "/blog/financial-independence-date", description: "Find the year your savings can cover your spending." },
  { title: "The 4 Percent Rule", href: "/blog/what-is-the-4-percent-rule", description: "How much a portfolio can safely pay each year." },
]

export default function WhenToClaimSocialSecurityPage() {
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
          <span className="text-white">When to Claim Social Security</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-blue-900/40 text-blue-300 rounded px-2 py-1">Retirement</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          Claiming age is one of the few retirement decisions you can&apos;t undo. At 70 the monthly check is {pct((at(70).f / at(62).f - 1) * 100)} larger than at 62. Here are the rules, the math and the trade-off.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              If your full retirement age is 67, claiming at 62 pays {pct(at(62).f * 100)} of your full benefit for life, and claiming at 70 pays {pct(at(70).f * 100)}. On a {usd(FRA_BENEFIT)} full benefit, that is {usd(m62)} a month at 62 versus {usd(m70)} at 70. Waiting costs you the early checks. It breaks even at about age {age(be62v70)}. Claim early if you need the income or expect a shorter life. Wait if you can afford to and expect to live past the break-even.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Claiming Social Security at 62 pays ${pct(at(62).f * 100)} of your full benefit. At 70 it pays ${pct(at(70).f * 100)}. The break-even is near age ${age(be62v70)}. The math: www.dayblip.com/blog/when-to-claim-social-security`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Your Full Retirement Age Sets the Baseline</h2>

          <p>
            Your full retirement age, or FRA, is the age at which you get 100% of the benefit you earned. It depends on your birth year. Claiming before it shrinks the check. Claiming after it grows the check, up to age 70.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Born</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Full retirement age</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Cut if you claim at 62</th>
                </tr>
              </thead>
              <tbody>
                {FRA_TABLE.map((r, i) => (
                  <tr key={r.label} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-white">{r.label}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{r.fra}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{r.at62.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How the Check Changes at Each Age</h2>

          <p>
            Two rules drive the numbers. Before FRA, the benefit drops 5/9 of 1% for each month early, for the first 36 months, then 5/12 of 1% for each month after that. After FRA, it rises 2/3 of 1% for each month you wait, which is 8% a year, until age 70. The table uses a full retirement age of 67 and a full benefit of {usd(FRA_BENEFIT)} a month.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Claim at</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Share of full benefit</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Monthly check</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Per year</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.age} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 font-semibold text-white">{r.age}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{pct(r.f * 100)}</td>
                    <td className="px-4 py-3 text-right text-[#e94560] font-bold">{usd(r.monthly)}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(r.monthly * 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            The gap between 62 and 70 is {usd(m70 - m62)} a month, or {usd((m70 - m62) * 12)} a year. Benefits also get cost-of-living increases, which apply to the larger starting amount, so the gap tends to widen over time.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Break-Even Math</h2>

          <p>
            Claiming later means skipping checks now in exchange for bigger checks later. The break-even age is where the total you have collected from the later claim catches up with the earlier claim. These figures ignore cost-of-living increases, taxes and any return you could earn by investing early checks.
          </p>

          <p>
            <strong className="text-white">62 versus 67:</strong> waiting 5 years costs {usd(m62 * 60)} in skipped checks. The larger {usd(m67)} check closes that gap at about age {age(be62v67)}.
          </p>

          <p>
            <strong className="text-white">67 versus 70:</strong> waiting 3 more years skips {usd(m67 * 36)}. The {usd(m70)} check catches up at about age {age(be67v70)}.
          </p>

          <p>
            <strong className="text-white">62 versus 70:</strong> the full 8-year wait breaks even at about age {age(be62v70)}.
          </p>

          <p>
            Past the break-even, waiting wins. Before it, claiming early wins. Nobody knows their own lifespan, so the decision is a bet on longevity.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What Break-Even Leaves Out</h2>

          <p>
            <strong className="text-white">Your health and family history.</strong> Poor health or a short family history favors claiming earlier. Good health favors waiting.
          </p>

          <p>
            <strong className="text-white">Your spouse.</strong> When one spouse dies, the survivor generally keeps the larger of the two benefits. If the higher earner delays, the surviving spouse gets that bigger check for as long as they live. That can matter more than the break-even age.
          </p>

          <p>
            <strong className="text-white">Whether you can afford to wait.</strong> Delaying only works if savings or work income cover the gap. Drawing down a portfolio to bridge to 70 changes your retirement math, so test it against the 4 percent rule before you commit.
          </p>

          <p>
            <strong className="text-white">Working while you claim.</strong> If you claim before FRA and keep working, an earnings limit can temporarily withhold part of your benefit. Check the current limit with the Social Security Administration before you file.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Enter your birth year and benefit to compare every claiming age side by side:</p>
            <Link
              href="/finance/social-security"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              Social Security Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute financial, tax or legal advice. Figures use Social Security Administration rules for people born 1960 or later and a simplified example. Your benefit depends on your earnings record, and your best claiming age depends on your health, spouse and other income. Check your own statement at ssa.gov or talk to a qualified professional.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Claiming Social Security at 62 pays ${pct(at(62).f * 100)} of your full benefit. At 70 it pays ${pct(at(70).f * 100)}. The break-even is near age ${age(be62v70)}. The math: www.dayblip.com/blog/when-to-claim-social-security`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
