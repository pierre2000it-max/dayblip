import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/blog/RelatedTools"

// ── Data ─────────────────────────────────────────────────────────────────────

interface StateRow {
  state: string
  abbr: string
  takeHome: number
  effective: number   // effective total rate %
  noIncomeTax: boolean
  highlight?: "high" | "low"
}

// Gross $75,000 | Standard deduction $16,100 | Federal taxable income $58,900
// Federal income tax: 10% × $11,925 + 12% × $36,549 + 22% × $10,424 = $7,872
// FICA: 6.2% × $75,000 + 1.45% × $75,000 = $4,650 + $1,088 = $5,738
// Total federal deductions: $13,610
// After-federal base: $61,390
// Take-home = $75,000 − $7,872 − $5,738 − state income tax
// Sources: IRS Rev. Proc. 2025-28 (2026 brackets), SSA Fact Sheet 2026, state revenue depts.

const STATES: StateRow[] = [
  { state: "Wyoming",        abbr: "WY", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "South Dakota",   abbr: "SD", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "Alaska",         abbr: "AK", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "Nevada",         abbr: "NV", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "Florida",        abbr: "FL", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "Texas",          abbr: "TX", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "Washington",     abbr: "WA", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "Tennessee",      abbr: "TN", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "New Hampshire",  abbr: "NH", takeHome: 61390, effective: 18.1, noIncomeTax: true },
  { state: "North Dakota",   abbr: "ND", takeHome: 60925, effective: 18.8, noIncomeTax: false },
  { state: "Arizona",        abbr: "AZ", takeHome: 60568, effective: 19.2, noIncomeTax: false },
  { state: "Indiana",        abbr: "IN", takeHome: 60375, effective: 19.5, noIncomeTax: false },
  { state: "Pennsylvania",   abbr: "PA", takeHome: 60368, effective: 19.5, noIncomeTax: false },
  { state: "Michigan",       abbr: "MI", takeHome: 60175, effective: 19.8, noIncomeTax: false },
  { state: "Colorado",       abbr: "CO", takeHome: 59979, effective: 20.0, noIncomeTax: false },
  { state: "Ohio",           abbr: "OH", takeHome: 59937, effective: 20.1, noIncomeTax: false },
  { state: "Utah",           abbr: "UT", takeHome: 59728, effective: 20.4, noIncomeTax: false },
  { state: "Illinois",       abbr: "IL", takeHome: 59628, effective: 20.5, noIncomeTax: false },
  { state: "Louisiana",      abbr: "LA", takeHome: 59597, effective: 20.5, noIncomeTax: false },
  { state: "North Carolina", abbr: "NC", takeHome: 59530, effective: 20.6, noIncomeTax: false },
  { state: "Alabama",        abbr: "AL", takeHome: 59495, effective: 20.7, noIncomeTax: false },
  { state: "Kentucky",       abbr: "KY", takeHome: 59372, effective: 20.8, noIncomeTax: false },
  { state: "Mississippi",    abbr: "MS", takeHome: 59367, effective: 20.8, noIncomeTax: false },
  { state: "Missouri",       abbr: "MO", takeHome: 59234, effective: 21.0, noIncomeTax: false },
  { state: "Georgia",        abbr: "GA", takeHome: 59139, effective: 21.1, noIncomeTax: false },
  { state: "New Mexico",     abbr: "NM", takeHome: 59118, effective: 21.2, noIncomeTax: false },
  { state: "Iowa",           abbr: "IA", takeHome: 59041, effective: 21.3, noIncomeTax: false },
  { state: "West Virginia",  abbr: "WV", takeHome: 58992, effective: 21.3, noIncomeTax: false },
  { state: "Montana",        abbr: "MT", takeHome: 58919, effective: 21.4, noIncomeTax: false },
  { state: "Oklahoma",       abbr: "OK", takeHome: 58893, effective: 21.5, noIncomeTax: false },
  { state: "South Carolina", abbr: "SC", takeHome: 58834, effective: 21.6, noIncomeTax: false },
  { state: "Kansas",         abbr: "KS", takeHome: 58794, effective: 21.6, noIncomeTax: false },
  { state: "Nebraska",       abbr: "NE", takeHome: 58759, effective: 21.7, noIncomeTax: false },
  { state: "Arkansas",       abbr: "AR", takeHome: 58658, effective: 21.8, noIncomeTax: false },
  { state: "Delaware",       abbr: "DE", takeHome: 58656, effective: 21.8, noIncomeTax: false },
  { state: "Virginia",       abbr: "VA", takeHome: 58598, effective: 21.9, noIncomeTax: false },
  { state: "Idaho",          abbr: "ID", takeHome: 58548, effective: 21.9, noIncomeTax: false },
  { state: "Wisconsin",      abbr: "WI", takeHome: 58509, effective: 22.0, noIncomeTax: false },
  { state: "Rhode Island",   abbr: "RI", takeHome: 58419, effective: 22.1, noIncomeTax: false },
  { state: "Maine",          abbr: "ME", takeHome: 58358, effective: 22.2, noIncomeTax: false },
  { state: "Vermont",        abbr: "VT", takeHome: 58340, effective: 22.2, noIncomeTax: false },
  { state: "Maryland",       abbr: "MD", takeHome: 58288, effective: 22.3, noIncomeTax: false },
  { state: "New York",       abbr: "NY", takeHome: 58097, effective: 22.5, noIncomeTax: false },
  { state: "Connecticut",    abbr: "CT", takeHome: 58008, effective: 22.7, noIncomeTax: false },
  { state: "Massachusetts",  abbr: "MA", takeHome: 57959, effective: 22.7, noIncomeTax: false },
  { state: "Minnesota",      abbr: "MN", takeHome: 57858, effective: 22.9, noIncomeTax: false },
  { state: "New Jersey",     abbr: "NJ", takeHome: 57808, effective: 22.9, noIncomeTax: false },
  { state: "Oregon",         abbr: "OR", takeHome: 57291, effective: 23.6, noIncomeTax: false, highlight: "low" },
  { state: "California",     abbr: "CA", takeHome: 57104, effective: 23.9, noIncomeTax: false, highlight: "low" },
  { state: "Hawaii",         abbr: "HI", takeHome: 56972, effective: 24.0, noIncomeTax: false, highlight: "low" },
]

const KEY_NUMBERS = [
  { value: "$61,390", label: "Best-case take-home",     sub: "No-income-tax states",  color: "#22c55e" },
  { value: "$56,972", label: "Lowest take-home",        sub: "Hawaii",                color: "#e94560" },
  { value: "$4,418",  label: "Annual gap",              sub: "Best vs. worst state",  color: "#f59e0b" },
  { value: "$368",    label: "Monthly gap",             sub: "Per month difference",  color: "#f59e0b" },
  { value: "9 states",label: "No income tax",           sub: "Zero state income tax", color: "#4FC3F7" },
  { value: "24.0%",   label: "Highest effective rate",  sub: "Hawaii",                color: "#e94560" },
  { value: "18.1%",   label: "Lowest effective rate",   sub: "No-tax states",         color: "#22c55e" },
  { value: "$13,610", label: "Federal deductions",      sub: "Same in every state",   color: "#a8a8b3" },
]

const relatedTools = [
  {
    title: "Paycheck Calculator",
    href: "/finance/paycheck-calculator",
    description: "Calculate your exact take-home pay for any salary in any state.",
  },
  {
    title: "Tax Bracket Calculator",
    href: "/finance/tax-bracket",
    description: "See which federal and state brackets your income falls into.",
  },
  {
    title: "Overtime Tax Calculator",
    href: "/finance/overtime-tax",
    description: "How much of your overtime pay do you actually keep in 2026?",
  },
  {
    title: "Cost of Living Comparison",
    href: "/finance/cost-of-living",
    description: "Compare purchasing power across US cities and states.",
  },
]

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US")
}

// ── JSON-LD schemas ───────────────────────────────────────────────────────────

const newsArticleSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: "2026 American Paycheck Report: How Much of a $75,000 Salary Do You Actually Keep?",
  description:
    "How much of a $75,000 salary do workers actually keep across all 50 US states in 2026? Full breakdown using IRS brackets, FICA rates, and state income tax tables.",
  url: "https://www.dayblip.com/research/paycheck-report-2026",
  datePublished: "2026-06-13",
  dateModified: "2026-06-13",
  author: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  image: "https://www.dayblip.com/og-default.svg",
  articleSection: "Personal Finance",
  keywords: "paycheck calculator, take-home pay, state income tax 2026, net pay by state, $75000 salary",
}

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "2026 US State Take-Home Pay — $75,000 Benchmark Salary",
  description:
    "Annual take-home pay and effective tax rate for a single filer earning $75,000 in all 50 US states, using 2026 IRS federal brackets, standard deduction of $16,100, FICA rates, and each state's current income tax schedule.",
  url: "https://www.dayblip.com/research/paycheck-report-2026",
  creator: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  datePublished: "2026-06-13",
  license: "https://creativecommons.org/licenses/by/4.0/",
  variableMeasured: ["Annual take-home pay", "Effective total tax rate"],
  spatialCoverage: { "@type": "Place", name: "United States" },
  temporalCoverage: "2026",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaycheckReport2026() {
  return (
    <main className="bg-[#1a1a2e] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <div className="mx-auto max-w-[800px] px-6 py-14">

        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#a8a8b3]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/research" className="hover:text-white transition-colors">Research</Link>
          <span>/</span>
          <span className="text-white">2026 Paycheck Report</span>
        </nav>

        {/* Report label */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="rounded-full border border-[#e94560]/40 bg-[#e94560]/10 px-3 py-1 text-xs font-medium text-[#e94560]">
            Paycheck
          </span>
          <span className="text-[#a8a8b3] text-xs">Published June 2026 · Updated with 2026 IRS brackets</span>
        </div>

        {/* H1 */}
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          2026 American Paycheck Report: How Much of a $75,000 Salary Do You Actually Keep?
        </h1>

        {/* Subtitle */}
        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-4">
          A state-by-state analysis of annual take-home pay for a single filer earning $75,000,
          using 2026 IRS federal tax brackets, current FICA rates, and each state&apos;s income tax schedule.
        </p>

        <p className="text-[#a8a8b3] text-sm mb-10">
          By Dayblip Research · Sources: IRS Revenue Procedure 2025-28, SSA Fact Sheet 2026, state revenue departments
        </p>

        {/* Key finding box */}
        <div className="rounded-2xl border border-[#e94560]/30 bg-[#e94560]/5 p-6 mb-10">
          <div className="text-[#e94560] text-xs font-semibold uppercase tracking-wider mb-2">Key Finding</div>
          <p className="text-white text-lg font-medium leading-relaxed">
            A worker earning $75,000 keeps <strong className="text-[#22c55e]">$61,390</strong> annually in a no-income-tax
            state — but only <strong className="text-[#e94560]">$56,972</strong> in Hawaii.
            That&apos;s a <strong className="text-[#f59e0b]">$4,418 annual gap</strong> on the same gross salary.
          </p>
        </div>

        {/* Intro */}
        <div className="space-y-4 text-[#a8a8b3] leading-relaxed mb-12">
          <p>
            Your gross salary is not your income. By the time federal taxes, Social Security, Medicare,
            and state income tax are deducted, the number on your offer letter can look very different
            from the number in your bank account.
          </p>
          <p>
            We used a single benchmark — <strong className="text-white">$75,000 gross annual salary, single filer,
            standard deduction, no dependents</strong> — and calculated the actual take-home pay for every US state
            using 2026 tax schedules. The $75,000 figure was chosen because it sits above the US median individual
            income and crosses into the 22% federal bracket, making the state-level variation especially meaningful.
          </p>
          <p>
            Federal deductions are identical across all states ($7,872 federal income tax + $5,738 FICA = $13,610 total).
            Every dollar of difference between states is driven entirely by state income tax.
          </p>
        </div>

        {/* Key numbers grid */}
        <section className="mb-12">
          <h2 className="text-white text-xl font-bold mb-5">Key Numbers at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {KEY_NUMBERS.map((k) => (
              <div key={k.label} className="rounded-xl bg-[#16213e] border border-[#1e2d4a] p-4">
                <div className="text-2xl font-bold mb-1" style={{ color: k.color }}>{k.value}</div>
                <div className="text-white text-sm font-semibold mb-0.5">{k.label}</div>
                <div className="text-[#a8a8b3] text-xs">{k.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Federal tax breakdown */}
        <section className="mb-12">
          <h2 className="text-white text-xl font-bold mb-2">Federal Tax Calculation (Same in Every State)</h2>
          <p className="text-[#a8a8b3] text-sm mb-5">
            Gross $75,000 · Standard deduction $16,100 · Taxable income $58,900
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#1e2d4a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a] bg-[#16213e]">
                  <th className="text-left px-4 py-3 text-[#a8a8b3] font-medium">Bracket</th>
                  <th className="text-left px-4 py-3 text-[#a8a8b3] font-medium">Rate</th>
                  <th className="text-left px-4 py-3 text-[#a8a8b3] font-medium">Income in bracket</th>
                  <th className="text-right px-4 py-3 text-[#a8a8b3] font-medium">Tax owed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bracket: "$0 – $11,925",       rate: "10%",   income: "$11,925",       tax: "$1,193" },
                  { bracket: "$11,926 – $48,475",  rate: "12%",   income: "$36,549",       tax: "$4,386" },
                  { bracket: "$48,476 – $58,900",  rate: "22%",   income: "$10,424",       tax: "$2,293" },
                  { bracket: "Social Security",    rate: "6.2%",  income: "$75,000 gross", tax: "$4,650" },
                  { bracket: "Medicare",           rate: "1.45%", income: "$75,000 gross", tax: "$1,088" },
                ].map((row) => (
                  <tr key={row.bracket} className="border-b border-[#1e2d4a] last:border-0 hover:bg-[#16213e]/50">
                    <td className="px-4 py-3 text-white">{row.bracket}</td>
                    <td className="px-4 py-3 text-[#4FC3F7]">{row.rate}</td>
                    <td className="px-4 py-3 text-[#a8a8b3]">{row.income}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{row.tax}</td>
                  </tr>
                ))}
                <tr className="bg-[#16213e]">
                  <td colSpan={3} className="px-4 py-3 text-white font-bold">Total federal deductions</td>
                  <td className="px-4 py-3 text-right font-bold text-[#e94560]">$13,610</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 50-state table */}
        <section className="mb-12">
          <h2 className="text-white text-xl font-bold mb-2">Take-Home Pay by State — All 50 States</h2>
          <p className="text-[#a8a8b3] text-sm mb-5">
            Sorted highest to lowest take-home pay. Gross salary: $75,000 · Single filer · Standard deduction · 2026 rates.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs text-[#a8a8b3]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(26,122,74,0.25)" }}></span>
              No state income tax
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(233,69,96,0.12)" }}></span>
              Highest-tax states (OR, CA, HI)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#1e2d4a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a] bg-[#16213e]">
                  <th className="text-left px-4 py-3 text-[#a8a8b3] font-medium w-8">#</th>
                  <th className="text-left px-4 py-3 text-[#a8a8b3] font-medium">State</th>
                  <th className="text-right px-4 py-3 text-[#a8a8b3] font-medium">Annual take-home</th>
                  <th className="text-right px-4 py-3 text-[#a8a8b3] font-medium hidden sm:table-cell">Monthly</th>
                  <th className="text-right px-4 py-3 text-[#a8a8b3] font-medium hidden sm:table-cell">Effective rate</th>
                </tr>
              </thead>
              <tbody>
                {STATES.map((s, i) => {
                  const rowBg = s.noIncomeTax
                    ? "rgba(26,122,74,0.15)"
                    : s.highlight === "low"
                    ? "rgba(233,69,96,0.10)"
                    : "transparent"
                  return (
                    <tr
                      key={s.abbr}
                      className="border-b border-[#1e2d4a] last:border-0"
                      style={{ background: rowBg }}
                    >
                      <td className="px-4 py-2.5 text-[#a8a8b3] text-xs">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-white font-medium">{s.state}</span>
                        {s.noIncomeTax && (
                          <span className="ml-2 text-[10px] text-[#22c55e] font-medium">NO TAX</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold" style={{
                        color: s.noIncomeTax ? "#22c55e" : s.highlight === "low" ? "#e94560" : "#ffffff"
                      }}>
                        {fmt(s.takeHome)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-[#a8a8b3] hidden sm:table-cell">
                        {fmt(Math.round(s.takeHome / 12))}
                      </td>
                      <td className="px-4 py-2.5 text-right text-[#a8a8b3] hidden sm:table-cell">
                        {s.effective.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notable findings */}
        <section className="mb-12">
          <h2 className="text-white text-xl font-bold mb-5">5 Notable Findings</h2>
          <div className="space-y-4">
            {[
              {
                n: "01",
                title: "Nine states take nothing extra",
                body: "Wyoming, South Dakota, Alaska, Nevada, Florida, Texas, Washington, Tennessee, and New Hampshire levy no state income tax. Workers in these states keep an identical $61,390 from a $75,000 salary — the federal government takes $13,610 and the state takes nothing.",
              },
              {
                n: "02",
                title: "The $4,418 gap compounds to ~$445,000 over a 30-year career",
                body: "A Hawaii worker earning $75,000 takes home $4,418 less per year than an identical worker in Texas or Florida. That gap doesn't disappear — invested at a 7% annual return for 30 years, it compounds to approximately $445,000. State tax choice is a long-term wealth decision.",
              },
              {
                n: "03",
                title: "The 22% federal bracket kicks in at this salary level",
                body: "At $75,000 gross with the 2026 standard deduction of $16,100, only $10,424 of taxable income falls into the 22% federal bracket. The majority of the salary is still taxed at 10% and 12%. State income tax becomes disproportionately impactful here because the federal marginal rate is still moderate.",
              },
              {
                n: "04",
                title: "Hawaii edges out California and Oregon as the highest-tax state at this income",
                body: "Hawaii's income tax structure — with a top bracket of 11% — results in a 24.0% total effective rate for a $75,000 earner, the highest of any state. Oregon (23.6%) and California (23.9%) follow closely. All three exceed the next tier by more than half a percentage point.",
              },
              {
                n: "05",
                title: "Middle-of-the-pack states cluster tightly",
                body: "Thirty-two states fall within a roughly $3,000 band ($57,800–$60,900 take-home). State income tax choice is most consequential at the extremes — the 9 no-tax states and the bottom 3 (OR, CA, HI) drive the entire headline gap.",
              },
            ].map((f) => (
              <div key={f.n} className="flex gap-4 rounded-xl bg-[#16213e] border border-[#1e2d4a] p-5">
                <span className="text-[#e94560] text-xl font-bold shrink-0 w-8">{f.n}</span>
                <div>
                  <div className="text-white font-semibold mb-1">{f.title}</div>
                  <p className="text-[#a8a8b3] text-sm leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-8">
          <h2 className="text-white text-xl font-bold mb-4">Methodology</h2>
          <div className="space-y-3 text-[#a8a8b3] text-sm leading-relaxed">
            <p>
              All calculations use a <strong className="text-white">$75,000 gross annual salary, single filing status,
              standard deduction, no dependents, no pre-tax deductions</strong> (such as 401(k) or HSA contributions).
              This represents the simplest possible tax situation to isolate the effect of geography.
            </p>
            <p>
              <strong className="text-white">Federal income tax</strong> uses 2026 brackets per IRS Revenue Procedure 2025-28.
              Standard deduction: $16,100 (single). Taxable income: $58,900.
              Tax: 10% × $11,925 + 12% × $36,549 + 22% × $10,424 = $7,872.
            </p>
            <p>
              <strong className="text-white">FICA</strong>: Social Security 6.2% × $75,000 = $4,650.
              Medicare 1.45% × $75,000 = $1,088. Total FICA: $5,738.
              Additional Medicare surtax (0.9%) does not apply below $200,000.
            </p>
            <p>
              <strong className="text-white">State income tax</strong> uses each state&apos;s 2026 published rate schedules
              sourced from state revenue department websites and Tax Foundation data. Local income taxes (city, county)
              are not included. State standard deductions are applied where available.
            </p>
            <p>
              Take-home pay = $75,000 − $7,872 (federal income tax) − $5,738 (FICA) − state income tax.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <div className="rounded-xl border border-[#1e2d4a] bg-[#16213e] p-5 mb-10">
          <div className="text-[#f59e0b] text-xs font-semibold uppercase tracking-wider mb-2">Limitations</div>
          <ul className="text-[#a8a8b3] text-sm space-y-1.5">
            <li>• Local income taxes (NYC, Philadelphia, etc.) are not included and can add 2–4% in some cities.</li>
            <li>• 401(k), HSA, or other pre-tax contributions would reduce taxable income and increase take-home pay.</li>
            <li>• Married filing jointly, head of household, and other filing statuses produce different results.</li>
            <li>• State figures assume no itemized deductions beyond the standard deduction.</li>
            <li>• Tax situations vary by individual. Consult a tax professional for advice specific to your situation.</li>
          </ul>
        </div>

        {/* Tool callout */}
        <div className="rounded-2xl border border-[#4FC3F7]/30 bg-[#4FC3F7]/5 p-6 mb-10">
          <div className="text-[#4FC3F7] text-sm font-semibold mb-2">Run Your Own Numbers →</div>
          <p className="text-[#a8a8b3] text-sm mb-4">
            This report uses a $75,000 benchmark. For your actual salary, filing status, and pre-tax
            deductions, use the free Dayblip Paycheck Calculator.
          </p>
          <Link
            href="/finance/paycheck-calculator"
            className="inline-block rounded-lg bg-[#4FC3F7] px-5 py-2.5 text-sm font-semibold text-[#0d1b2a] transition-opacity hover:opacity-90"
          >
            Open Paycheck Calculator →
          </Link>
        </div>

        {/* Citation box */}
        <div className="rounded-xl border border-[#1e2d4a] bg-[#16213e] p-5 mb-10">
          <div className="text-[#a8a8b3] text-xs font-semibold uppercase tracking-wider mb-3">Sources</div>
          <ul className="text-[#a8a8b3] text-xs space-y-1.5">
            <li>· IRS Revenue Procedure 2025-28 — 2026 federal income tax brackets and standard deduction</li>
            <li>· Social Security Administration Fact Sheet 2026 — FICA contribution and benefit base</li>
            <li>· Tax Foundation, State Individual Income Tax Rates and Brackets 2026</li>
            <li>· State revenue department publications for all 50 states (accessed June 2026)</li>
          </ul>
          <p className="text-[#a8a8b3] text-xs mt-3">
            To cite this report: Dayblip Research, &quot;2026 American Paycheck Report,&quot; June 2026,
            https://www.dayblip.com/research/paycheck-report-2026
          </p>
        </div>

        {/* Share */}
        <div className="mb-10">
          <ShareButtons
            text="How much of a $75,000 salary do you actually keep? It depends on which state you live in — full 2026 breakdown at dayblip.com/research/paycheck-report-2026"
            url="https://www.dayblip.com/research/paycheck-report-2026"
            title="2026 American Paycheck Report: $75,000 Salary 50-State Take-Home Pay | Dayblip"
          />
        </div>

        {/* Related tools */}
        <RelatedTools tools={relatedTools} />

      </div>
    </main>
  )
}
