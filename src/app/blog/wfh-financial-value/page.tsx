import Link from "next/link"
import RelatedTools from "@/components/blog/RelatedTools"
import ShareButtons from "@/components/ShareButtons"
import { articleSchema as buildArticleSchema } from "@/lib/schema"

// Every total on this page is computed from the assumptions below, so the
// tables cannot disagree with each other. Only two inputs come from a published
// source: the IRS 2026 business mileage rate (72.5 cents per mile, IRS Notice
// 2026-10) and the Census Bureau 2023 ACS mean commute of 26.8 minutes one way.
// Everything else is an assumption the reader can change in the WFH calculator.

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
const IRS_RATE = 0.725
const WORK_DAYS = 250
const ROUND_TRIP_MILES = 40
const COMMUTE_MIN_ONE_WAY = 26.8
const TRANSIT_PASS = 2100
const LUNCH_OFFICE = 13
const LUNCH_HOME = 5
const COFFEE_PER_DAY = 3
const CLOTHING = 1800
const DRY_CLEANING = 600
const PARKING = 1200
const HOME_COSTS = 900
const HOURLY = 36
const RETURN = 0.07

const carCommute = ROUND_TRIP_MILES * IRS_RATE * WORK_DAYS
const lunches = (LUNCH_OFFICE - LUNCH_HOME) * WORK_DAYS
const coffee = COFFEE_PER_DAY * WORK_DAYS
const carGross = carCommute + lunches + coffee + CLOTHING + DRY_CLEANING + PARKING
const carNet = carGross - HOME_COSTS
const transitGross = TRANSIT_PASS + lunches + coffee + CLOTHING + DRY_CLEANING
const transitNet = transitGross - HOME_COSTS
const hoursLost = Math.round((COMMUTE_MIN_ONE_WAY * 2 * WORK_DAYS) / 60)
const timeValue = hoursLost * HOURLY
const fv = (annual: number, years: number) => annual * ((Math.pow(1 + RETURN, years) - 1) / RETURN)
// Costs are assumed to scale with days in the office per week.
const byDays = (daysPerWeek: number) => (carGross / 5) * daysPerWeek

const PAGE_URL = "https://www.dayblip.com/blog/wfh-financial-value"
const TITLE = "The True Financial Value of Working From Home"

const schema = buildArticleSchema(
  TITLE,
  `On stated assumptions, a car commuter spends about ${usd(carNet)} a year on costs a fully remote worker avoids. A 3-day hybrid schedule costs about ${usd(byDays(3))}.`,
  PAGE_URL,
  "2026-06-13",
  "2026-10-21"
)

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much money do you save working from home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `On the assumptions in this article, a car commuter saves about ${usd(carNet)} a year: ${usd(carCommute)} in commute costs at the IRS 2026 rate of 72.5 cents per mile, ${usd(lunches + coffee)} in lunches and coffee, ${usd(CLOTHING + DRY_CLEANING)} in clothing and dry cleaning and ${usd(PARKING)} in parking, minus ${usd(HOME_COSTS)} in added home costs. A transit commuter saves about ${usd(transitNet)}.`,
      },
    },
    {
      "@type": "Question",
      name: "Is remote work worth a lower salary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `It can be. If a remote job pays ${usd(5000)} less but saves ${usd(carNet)} in work-related costs, the remote job is worth about ${usd(carNet - 5000)} more per year before taxes on the pay difference. Recompute with your own commute, parking and meal costs before you decide.`,
      },
    },
    {
      "@type": "Question",
      name: "What is the IRS mileage rate for 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The IRS business standard mileage rate for 2026 is 72.5 cents per mile. It is built to cover the fixed and variable costs of running a car, including fuel, depreciation, insurance and maintenance.",
      },
    },
  ],
}

const relatedTools = [
  { title: "WFH Savings Calculator", href: "/tools/wfh-calculator", description: "Calculate the exact financial value of your remote work situation." },
  { title: "True Hourly Wage Calculator", href: "/tools/true-hourly-wage", description: "What your job really pays per hour after all work-related costs." },
  { title: "Job Offer Comparison", href: "/tools/job-offer-comparison", description: "Compare two job offers side by side including WFH value." },
  { title: "Take Home Pay Calculator", href: "/finance/take-home-pay", description: "Your exact net pay after all taxes and deductions." },
]

export default function WfhFinancialValuePage() {
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
          <span className="text-white">WFH Financial Value</span>
        </nav>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded px-2 py-1">Career</span>
          <span className="text-[#a8a8b3] text-sm">6 min read · Published June 2026 · Updated October 2026</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
          The True Financial Value of Working From Home: What the Numbers Show
        </h1>

        <p className="text-[#a8a8b3] text-lg leading-relaxed mb-8">
          The remote work conversation is usually about productivity and culture. The money side rarely gets worked out. Here is the math, with every assumption stated so you can swap in your own.
        </p>

        <section className="mb-10">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0] leading-relaxed">
              On the assumptions below, a car commuter spends about {usd(carNet)} a year on costs a fully remote worker avoids, and a transit commuter about {usd(transitNet)}. The biggest line is the drive: {ROUND_TRIP_MILES} miles a day at the IRS 2026 rate of 72.5 cents per mile is {usd(carCommute)}. Invested at 7% instead, {usd(carNet)} a year grows to about {usd(fv(carNet, 30))} over 30 years. A 3-day hybrid schedule costs about {usd(byDays(3))} a year, which is {usd(carGross - byDays(3))} less than 5 days in the office.
            </p>
          </div>
        </section>

        <div className="mb-8">
          <ShareButtons
            text={`Remote work can save a car commuter about ${usd(carNet)} a year vs fully in-office. A 3-day hybrid still costs about ${usd(byDays(3))}. Full breakdown with every assumption: www.dayblip.com/blog/wfh-financial-value`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

        <article className="space-y-5 text-[#c9d1d9] leading-relaxed">

          <h2 className="text-white text-xl font-bold mt-8 mb-3">How This Estimate Works</h2>

          <p>
            Only two inputs come from a published source. The IRS sets the 2026 business mileage rate at 72.5 cents per mile, a figure built to cover fuel, depreciation, insurance and maintenance. The Census Bureau&apos;s 2023 American Community Survey puts the average one-way commute at {COMMUTE_MIN_ONE_WAY} minutes.
          </p>

          <p>
            The rest are assumptions: {ROUND_TRIP_MILES} miles round trip, {WORK_DAYS} office days, a ${LUNCH_OFFICE} office lunch against a ${LUNCH_HOME} lunch at home, ${COFFEE_PER_DAY} a day on coffee, {usd(CLOTHING)} a year in work clothing, {usd(DRY_CLEANING)} in dry cleaning, {usd(PARKING)} in parking and {usd(HOME_COSTS)} in extra home costs for utilities and supplies. Your numbers will differ. That is why the totals below come with the inputs attached.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Commute: The Biggest Cost</h2>

          <p>
            {ROUND_TRIP_MILES} miles × 72.5 cents × {WORK_DAYS} work days = <strong className="text-white">{usd(carCommute)} per year</strong> in car costs. That is the IRS&apos;s own estimate of what driving costs, so it holds up better than a guess at your gas bill. A transit pass at about {usd(TRANSIT_PASS)} a year is cheaper but still {usd(TRANSIT_PASS / 12)} a month.
          </p>

          <p>
            Time is the second cost. At {COMMUTE_MIN_ONE_WAY} minutes each way, a full-time commuter spends about {hoursLost} hours a year in transit. At {usd(HOURLY)} an hour, roughly a {usd(75000)} salary, that is <strong className="text-white">{usd(timeValue)} in time value</strong>. We leave it out of the totals below, because it is not cash you can invest.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Work Meals and Coffee</h2>

          <p>
            A ${LUNCH_OFFICE} office lunch costs {usd(LUNCH_OFFICE * WORK_DAYS)} a year. The same meal at home at ${LUNCH_HOME} costs {usd(LUNCH_HOME * WORK_DAYS)}. The difference is <strong className="text-white">{usd(lunches)}</strong>.
          </p>

          <p>
            Coffee adds {usd(coffee)} at ${COFFEE_PER_DAY} a day of savings. Together that is {usd(lunches + coffee)} a year. Adjust both numbers for your own habits. A packed-lunch worker saves less and a daily restaurant lunch saves more.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Work Clothing and Dry Cleaning</h2>

          <p>
            Professional office clothing, shoes and upkeep cost more than casual clothes at home. This model uses {usd(CLOTHING)} a year in clothing savings and {usd(DRY_CLEANING)} in dry cleaning and alterations. These are the softest inputs on the page. If your office is casual, set them near zero.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Full Annual Value</h2>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Expense category</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Car commuter</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Transit commuter</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Commute costs", car: carCommute, transit: TRANSIT_PASS },
                  { label: "Work lunches", car: lunches, transit: lunches },
                  { label: "Coffee", car: coffee, transit: coffee },
                  { label: "Work clothing", car: CLOTHING, transit: CLOTHING },
                  { label: "Dry cleaning", car: DRY_CLEANING, transit: DRY_CLEANING },
                  { label: "Parking", car: PARKING, transit: 0 },
                ].map((row, i) => (
                  <tr key={row.label} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{row.label}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(row.car)}</td>
                    <td className="px-4 py-3 text-right text-[#F9A825]">{usd(row.transit)}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #e94560", background: "#1e2d4a" }}>
                  <td className="px-4 py-3 font-bold text-white">Gross savings</td>
                  <td className="px-4 py-3 text-right font-bold text-[#F9A825]">{usd(carGross)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#F9A825]">{usd(transitGross)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #1e2d4a", background: "#16213e" }}>
                  <td className="px-4 py-3 text-[#c9d1d9]">Added home costs (utilities, supplies)</td>
                  <td className="px-4 py-3 text-right text-[#FF6B6B]">−{usd(HOME_COSTS)}</td>
                  <td className="px-4 py-3 text-right text-[#FF6B6B]">−{usd(HOME_COSTS)}</td>
                </tr>
                <tr style={{ borderTop: "2px solid #e94560", background: "#1e2d4a" }}>
                  <td className="px-4 py-3 font-bold text-white">Net annual savings</td>
                  <td className="px-4 py-3 text-right font-bold text-[#e94560] text-base">{usd(carNet)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#e94560] text-base">{usd(transitNet)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">The Hybrid Math: 2 or 3 Days in the Office</h2>

          <p>
            Most workers choose a hybrid schedule, not fully remote. This table assumes your costs scale with days in the office. Home costs stay fixed in the real world, so a hybrid worker gets less of the saving than the day count suggests.
          </p>

          <div className="rounded-xl border border-[#0f3460] overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#1e2d4a" }}>
                  <th className="text-left px-4 py-3 text-white font-semibold">Schedule</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Work-related costs per year</th>
                  <th className="text-right px-4 py-3 text-white font-semibold">Less than 5 days</th>
                </tr>
              </thead>
              <tbody>
                {[5, 3, 2, 0].map((d, i) => (
                  <tr key={d} style={{ borderTop: "1px solid #1e2d4a", background: i % 2 === 0 ? "#16213e" : "#1a1a2e" }}>
                    <td className="px-4 py-3 text-[#c9d1d9]">{d === 5 ? "5 days (fully in-office)" : d === 0 ? "0 days (fully remote)" : `${d} days (hybrid)`}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#F9A825]">{usd(byDays(d))}</td>
                    <td className="px-4 py-3 text-right text-[#a8a8b3]">{usd(carGross - byDays(d))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Going from 5 days to 3 saves <strong className="text-white">{usd(carGross - byDays(3))}</strong> a year. Going from 3 days to fully remote saves another <strong className="text-white">{usd(byDays(3))}</strong>. A 3-day hybrid job that pays {usd(3000)} less than a fully remote offer still costs you about {usd(byDays(3) - 3000)} more per year once you count these expenses.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">See how your specific hybrid schedule compares financially:</p>
            <Link
              href="/tools/wfh-calculator"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              WFH Savings Calculator →
            </Link>
          </div>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">What the Saving Becomes When You Invest It</h2>

          <p>
            The {usd(carNet)} figure is a cash-flow number. This is what it grows to if you invest it each year at a 7% average return. The return is an assumption, not a promise.
          </p>

          <div className="bg-[#16213e] rounded-xl p-6 my-4 border border-[#2d3748] text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[#a8a8b3]">{usd(carNet)}/year invested at 7% after 10 years</span><span className="text-[#F9A825] font-semibold">{usd(fv(carNet, 10))}</span></div>
            <div className="flex justify-between"><span className="text-[#a8a8b3]">After 20 years</span><span className="text-[#F9A825] font-semibold">{usd(fv(carNet, 20))}</span></div>
            <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-white font-bold">After 30 years</span><span className="text-[#e94560] font-bold text-base">{usd(fv(carNet, 30))}</span></div>
          </div>

          <p>
            That only happens if the money is actually invested and the costs really do disappear. A remote worker may spend part of the saving on a home office, extra heating or cooling, and lunches that still cost something. Treat the 30-year figure as an upper bound.
          </p>

          <h2 className="text-white text-xl font-bold mt-8 mb-3">Using This to Compare Job Offers</h2>

          <p>
            A job that pays {usd(10000)} more but needs 5 days in the office leaves you about {usd(carNet - 10000)} a year behind a remote job at your current pay, after these costs. Add the {hoursLost} hours of commute time, and the remote job often comes out ahead. Run the comparison with your own commute and parking before you accept either one. The <Link href="/blog/how-to-compare-job-offers" className="text-[#e94560]">job offer comparison guide</Link> walks through the other factors, and the <Link href="/blog/true-cost-of-car-ownership" className="text-[#e94560]">car ownership guide</Link> shows what AAA counts in the full cost of a vehicle.
          </p>

          <div style={{ background: "#1e2d4a", borderRadius: "8px", padding: "20px", margin: "32px 0", textAlign: "center" }}>
            <p className="text-[#a8a8b3] mb-4 text-sm">Calculate the exact financial value of your remote work situation:</p>
            <Link
              href="/tools/wfh-calculator"
              style={{ display: "inline-block", color: "#e94560", fontWeight: 600, textDecoration: "none", fontSize: "16px", border: "1px solid #e94560", borderRadius: "6px", padding: "10px 24px" }}
            >
              WFH Savings Calculator →
            </Link>
          </div>

          <div style={{ background: "#16213e", borderLeft: "4px solid #a8a8b3", borderRadius: "8px", padding: "16px 20px", marginTop: "32px" }}>
            <p className="text-[#a8a8b3] text-sm leading-relaxed">
              <strong className="text-white">Disclaimer:</strong> This article is for educational purposes only and does not constitute financial advice. Dollar figures come from the stated assumptions, not from a survey of workers. The mileage rate is the IRS 2026 business standard rate and the commute time is from the Census Bureau&apos;s 2023 American Community Survey. Your own costs will differ.
            </p>
          </div>

        </article>

        <RelatedTools tools={relatedTools} />

        <div className="mt-8 pt-8 border-t border-[#2d3748]">
          <p className="text-white font-semibold mb-4">Share this article</p>
          <ShareButtons
            text={`Remote work can save a car commuter about ${usd(carNet)} a year vs fully in-office. A 3-day hybrid still costs about ${usd(byDays(3))}. Full breakdown with every assumption: www.dayblip.com/blog/wfh-financial-value`}
            url={PAGE_URL}
            title={TITLE}
          />
        </div>

      </div>
    </main>
  )
}
