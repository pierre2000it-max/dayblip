import Link from "next/link"
import ShareButtons from "@/components/ShareButtons"
import RelatedTools from "@/components/blog/RelatedTools"
import {
  BENCHMARK_SALARY, REPORT_YEAR, STANDARD_DED, TAXABLE_INCOME,
  FEDERAL_INCOME_TAX, SOCIAL_SECURITY_TAX, MEDICARE_TAX, FICA_TAX, FEDERAL_TOTAL, AFTER_FEDERAL,
  FEDERAL_BRACKET_ROWS, TOP_FEDERAL_RATE, INCOME_IN_TOP_FEDERAL_BRACKET,
  STATE_ROWS, NO_TAX_STATES, LOWEST, BOTTOM_FIVE, HIGHLIGHT_LOW, EXAMPLE_NO_TAX,
  ANNUAL_GAP, MONTHLY_GAP, LOWEST_EFFECTIVE, HIGHEST_EFFECTIVE, GAP_30_YEARS, CAREER_YEARS, GROWTH_RATE,
  MIDDLE_STATES, MIDDLE_MIN, MIDDLE_MAX, MIDDLE_BAND,
  stateFacts, stateRow, usd, pct, approxThousands, listNames, SS_RATE_LABEL, MEDICARE_RATE_LABEL,
} from "@/lib/paycheckReport"

// ── Data ─────────────────────────────────────────────────────────────────────
// Every figure on this page is computed from src/lib/paycheckReport.ts, which
// reads tax2026.ts and stateTax.ts. Nothing below is hand-typed.

const fmt = usd
const fedTaxFormula = FEDERAL_BRACKET_ROWS.map((r) => `${pct(r.rate)} × ${usd(r.income)}`).join(" + ")
const lowest2 = STATE_ROWS.slice(-2).reverse()
const lowFacts = stateFacts(LOWEST.code)
const second = BOTTOM_FIVE[1]
const third = BOTTOM_FIVE[2]
const ca = stateRow("CA")
const caFacts = stateFacts("CA")
const gapFV = approxThousands(GAP_30_YEARS)

const KEY_NUMBERS = [
  { value: usd(AFTER_FEDERAL),     label: "Best-case take-home",     sub: "No-income-tax states",  color: "#22c55e" },
  { value: usd(LOWEST.takeHome),   label: "Lowest take-home",        sub: LOWEST.name,             color: "#e94560" },
  { value: usd(ANNUAL_GAP),        label: "Annual gap",              sub: "Best vs. worst state",  color: "#f59e0b" },
  { value: usd(MONTHLY_GAP),       label: "Monthly gap",             sub: "Per month difference",  color: "#f59e0b" },
  { value: `${NO_TAX_STATES.length} states`, label: "No income tax", sub: "Zero state income tax", color: "#4FC3F7" },
  { value: `${HIGHEST_EFFECTIVE.toFixed(1)}%`, label: "Highest effective rate", sub: LOWEST.name, color: "#e94560" },
  { value: `${LOWEST_EFFECTIVE.toFixed(1)}%`,  label: "Lowest effective rate",  sub: "No-tax states", color: "#22c55e" },
  { value: usd(FEDERAL_TOTAL),     label: "Federal deductions",      sub: "Same in every state",   color: "#a8a8b3" },
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

// ── JSON-LD schemas ───────────────────────────────────────────────────────────

const newsArticleSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: `${REPORT_YEAR} American Paycheck Report: How Much of a ${usd(BENCHMARK_SALARY)} Salary Do You Actually Keep?`,
  description:
    `How much of a ${usd(BENCHMARK_SALARY)} salary do workers actually keep across all 50 US states in ${REPORT_YEAR}? Full breakdown using IRS brackets, FICA rates, and state income tax tables.`,
  url: "https://www.dayblip.com/research/paycheck-report-2026",
  datePublished: "2026-06-13",
  dateModified: "2026-06-13",
  author: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  publisher: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  image: "https://www.dayblip.com/api/og?title=2026+Paycheck+Report&emoji=💵&subtitle=%2475%2C000+salary+across+all+50+states",
  articleSection: "Personal Finance",
  keywords: `paycheck calculator, take-home pay, state income tax ${REPORT_YEAR}, net pay by state, $${BENCHMARK_SALARY} salary`,
}

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `${REPORT_YEAR} US State Take-Home Pay — ${usd(BENCHMARK_SALARY)} Benchmark Salary`,
  description:
    `Annual take-home pay and effective tax rate for a single filer earning ${usd(BENCHMARK_SALARY)} in all 50 US states, using ${REPORT_YEAR} IRS federal brackets, standard deduction of ${usd(STANDARD_DED)}, FICA rates, and each state's current income tax schedule.`,
  url: "https://www.dayblip.com/research/paycheck-report-2026",
  creator: { "@type": "Organization", name: "Dayblip", url: "https://www.dayblip.com" },
  datePublished: "2026-06-13",
  license: "https://creativecommons.org/licenses/by/4.0/",
  variableMeasured: ["Annual take-home pay", "Effective total tax rate"],
  spatialCoverage: { "@type": "Place", name: "United States" },
  temporalCoverage: String(REPORT_YEAR),
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
          <span className="text-[#a8a8b3] text-xs">Published June 2026 · Updated July 2026 with corrected 2026 IRS brackets per Rev. Proc. 2025-32</span>
        </div>

        {/* H1 */}
        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          {REPORT_YEAR} American Paycheck Report: How Much of a {usd(BENCHMARK_SALARY)} Salary Do You Actually Keep?
        </h1>

        {/* Subtitle */}
        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-4">
          A state-by-state analysis of annual take-home pay for a single filer earning {usd(BENCHMARK_SALARY)},
          using {REPORT_YEAR} IRS federal tax brackets, current FICA rates, and each state&apos;s income tax schedule.
        </p>

        <p className="text-[#a8a8b3] text-sm mb-10">
          By Dayblip Research · Sources: IRS Revenue Procedure 2025-32, SSA Fact Sheet 2026, state revenue departments
        </p>

        {/* Key finding box */}
        <div className="rounded-2xl border border-[#e94560]/30 bg-[#e94560]/5 p-6 mb-10">
          <div className="text-[#e94560] text-xs font-semibold uppercase tracking-wider mb-2">Key Finding</div>
          <p className="text-white text-lg font-medium leading-relaxed">
            A worker earning {usd(BENCHMARK_SALARY)} keeps <strong className="text-[#22c55e]">{usd(AFTER_FEDERAL)}</strong> annually in a no-income-tax
            state — but only <strong className="text-[#e94560]">{usd(LOWEST.takeHome)}</strong> in {LOWEST.name}.
            That&apos;s a <strong className="text-[#f59e0b]">{usd(ANNUAL_GAP)} annual gap</strong> on the same gross salary.
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
            We used a single benchmark — <strong className="text-white">{usd(BENCHMARK_SALARY)} gross annual salary, single filer,
            standard deduction, no dependents</strong> — and calculated the actual take-home pay for every US state
            using {REPORT_YEAR} tax schedules. The {usd(BENCHMARK_SALARY)} figure was chosen because it sits above the US median individual
            income and crosses into the {pct(TOP_FEDERAL_RATE)} federal bracket, making the state-level variation especially meaningful.
          </p>
          <p>
            Federal deductions are identical across all states ({usd(FEDERAL_INCOME_TAX)} federal income tax + {usd(FICA_TAX)} FICA = {usd(FEDERAL_TOTAL)} total).
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
            Gross {usd(BENCHMARK_SALARY)} · Standard deduction {usd(STANDARD_DED)} · Taxable income {usd(TAXABLE_INCOME)}
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
                  ...FEDERAL_BRACKET_ROWS.map((r) => ({
                    bracket: `${usd(r.lo === 0 ? 0 : r.lo + 1)} – ${usd(r.hi)}`,
                    rate: pct(r.rate),
                    income: usd(r.income),
                    tax: usd(r.tax),
                  })),
                  { bracket: "Social Security", rate: SS_RATE_LABEL,       income: `${usd(BENCHMARK_SALARY)} gross`, tax: usd(SOCIAL_SECURITY_TAX) },
                  { bracket: "Medicare",        rate: MEDICARE_RATE_LABEL, income: `${usd(BENCHMARK_SALARY)} gross`, tax: usd(MEDICARE_TAX) },
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
                  <td className="px-4 py-3 text-right font-bold text-[#e94560]">{usd(FEDERAL_TOTAL)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 50-state table */}
        <section className="mb-12">
          <h2 className="text-white text-xl font-bold mb-2">Take-Home Pay by State — All 50 States</h2>
          <p className="text-[#a8a8b3] text-sm mb-5">
            Sorted highest to lowest take-home pay. Gross salary: {usd(BENCHMARK_SALARY)} · Single filer · Standard deduction · {REPORT_YEAR} rates.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs text-[#a8a8b3]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(26,122,74,0.25)" }}></span>
              No state income tax
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "rgba(233,69,96,0.12)" }}></span>
              Highest-tax states ({lowest2.map((r) => r.code).join(", ")})
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
                {STATE_ROWS.map((s, i) => {
                  const isLow = HIGHLIGHT_LOW.has(s.code)
                  const rowBg = s.noIncomeTax
                    ? "rgba(26,122,74,0.15)"
                    : isLow
                    ? "rgba(233,69,96,0.10)"
                    : "transparent"
                  return (
                    <tr
                      key={s.code}
                      className="border-b border-[#1e2d4a] last:border-0"
                      style={{ background: rowBg }}
                    >
                      <td className="px-4 py-2.5 text-[#a8a8b3] text-xs">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-white font-medium">{s.name}</span>
                        {s.noIncomeTax && (
                          <span className="ml-2 text-[10px] text-[#22c55e] font-medium">NO TAX</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold" style={{
                        color: s.noIncomeTax ? "#22c55e" : isLow ? "#e94560" : "#ffffff"
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
                title: `${NO_TAX_STATES.length} states take nothing extra`,
                body: `${listNames(NO_TAX_STATES)} levy no state income tax. Workers in these states keep an identical ${usd(AFTER_FEDERAL)} from a ${usd(BENCHMARK_SALARY)} salary — the federal government takes ${usd(FEDERAL_TOTAL)} and the state takes nothing.`,
              },
              {
                n: "02",
                title: `The ${usd(ANNUAL_GAP)} gap compounds to ~${gapFV} over a ${CAREER_YEARS}-year career`,
                body: `${LOWEST.name === "Oregon" ? "An" : "A"} ${LOWEST.name} worker earning ${usd(BENCHMARK_SALARY)} takes home ${usd(ANNUAL_GAP)} less per year than an identical worker in ${EXAMPLE_NO_TAX.name} or Florida. That gap doesn't disappear — invested at a ${pct(GROWTH_RATE)} annual return for ${CAREER_YEARS} years, it compounds to approximately ${gapFV}. State tax choice is a long-term wealth decision.`,
              },
              {
                n: "03",
                title: `The ${pct(TOP_FEDERAL_RATE)} federal bracket kicks in at this salary level`,
                body: `At ${usd(BENCHMARK_SALARY)} gross with the ${REPORT_YEAR} standard deduction of ${usd(STANDARD_DED)}, only ${usd(INCOME_IN_TOP_FEDERAL_BRACKET)} of taxable income falls into the ${pct(TOP_FEDERAL_RATE)} federal bracket. The majority of the salary is still taxed at ${FEDERAL_BRACKET_ROWS.slice(0, -1).map((r) => pct(r.rate)).join(" and ")}. State income tax becomes disproportionately impactful here because the federal marginal rate is still moderate.`,
              },
              {
                n: "04",
                title: `${LOWEST.name} edges out ${second.name} as the highest-tax state at this income level`,
                body: `${LOWEST.name}'s ${pct(lowFacts.marginalRate, 2)} bracket starts at just ${usd(lowFacts.marginalStart)} of taxable income, and its standard deduction is only ${usd(lowFacts.deduction)}, so a ${usd(BENCHMARK_SALARY)} earner pays a ${LOWEST.effective.toFixed(1)}% total effective rate: the highest of any state. ${second.name} follows at ${second.effective.toFixed(1)}%, then ${third.name} at ${third.effective.toFixed(1)}%. California, despite its reputation, lands at ${ca.effective.toFixed(1)}% at this income level — roughly middle-of-the-pack — because its ${pct(caFacts.nextBracketRate ?? caFacts.topRate, 1)} rate only starts at ${usd(caFacts.nextBracketStart ?? caFacts.topStart)} of taxable income.`,
              },
              {
                n: "05",
                title: "Middle-of-the-pack states cluster tightly",
                body: `${MIDDLE_STATES.length} states fall within a roughly ${usd(Math.round(MIDDLE_BAND / 100) * 100)} band (${usd(MIDDLE_MIN)}–${usd(MIDDLE_MAX)} take-home). State income tax choice is most consequential at the extremes — the ${NO_TAX_STATES.length} no-tax states and the bottom 2 (${lowest2.map((r) => r.code).join(", ")}) drive the entire headline gap.`,
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
              All calculations use a <strong className="text-white">{usd(BENCHMARK_SALARY)} gross annual salary, single filing status,
              standard deduction, no dependents, no pre-tax deductions</strong> (such as 401(k) or HSA contributions).
              This represents the simplest possible tax situation to isolate the effect of geography.
            </p>
            <p>
              <strong className="text-white">Federal income tax</strong> uses {REPORT_YEAR} brackets per IRS Revenue Procedure 2025-32.
              Standard deduction: {usd(STANDARD_DED)} (single). Taxable income: {usd(TAXABLE_INCOME)}.
              Tax: {fedTaxFormula} = {usd(FEDERAL_INCOME_TAX)}.
            </p>
            <p>
              <strong className="text-white">FICA</strong>: Social Security {SS_RATE_LABEL} × {usd(BENCHMARK_SALARY)} = {usd(SOCIAL_SECURITY_TAX)}.
              Medicare {MEDICARE_RATE_LABEL} × {usd(BENCHMARK_SALARY)} = {usd(MEDICARE_TAX)}. Total FICA: {usd(FICA_TAX)}.
              Additional Medicare surtax (0.9%) does not apply below $200,000.
            </p>
            <p>
              <strong className="text-white">State income tax</strong> uses each state&apos;s {REPORT_YEAR} published rate schedules
              sourced from state revenue department websites and Tax Foundation data, in the same bracket tables that power
              the Dayblip paycheck calculator. Local income taxes (city, county) are not included. State standard deductions
              and personal exemptions are applied where available.
            </p>
            <p>
              Take-home pay = {usd(BENCHMARK_SALARY)} − {usd(FEDERAL_INCOME_TAX)} (federal income tax) − {usd(FICA_TAX)} (FICA) − state income tax.
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
            This report uses a {usd(BENCHMARK_SALARY)} benchmark. For your actual salary, filing status, and pre-tax
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
            <li>· IRS Revenue Procedure 2025-32 — 2026 federal income tax brackets and standard deduction</li>
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
            text={`How much of a ${usd(BENCHMARK_SALARY)} salary do you actually keep? It depends on which state you live in — full ${REPORT_YEAR} breakdown at dayblip.com/research/paycheck-report-2026`}
            url="https://www.dayblip.com/research/paycheck-report-2026"
            title={`${REPORT_YEAR} American Paycheck Report: ${usd(BENCHMARK_SALARY)} Salary 50-State Take-Home Pay`}
          />
        </div>

        {/* Related tools */}
        <RelatedTools tools={relatedTools} />

      </div>
    </main>
  )
}
