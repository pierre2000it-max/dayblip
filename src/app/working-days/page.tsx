import type { Metadata } from "next"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import ShareButtons from "@/components/ShareButtons"
import WorkingDaysTool from "./WorkingDaysTool"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"
import { weekdaysInYear, workingDaysInYear, workingDaysInMonth, federalHolidays } from "@/lib/workingDays"

const URL = "https://www.dayblip.com/working-days"
const TITLE = "Working Days in a Year: Count by Year and Month"
const WD26 = weekdaysInYear(2026)
const W26 = workingDaysInYear(2026)
const H26 = federalHolidays(2026).length
const DESCRIPTION = `Count working days in any year or month. 2026 has ${WD26} weekdays and ${W26} working days after ${H26} US federal holidays. Free, no signup required.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL },
  twitter: { card: "summary_large_image" },
}

const YEARS = [2025, 2026, 2027, 2028]
const th = { textAlign: "left" as const, padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560", whiteSpace: "nowrap" as const }
const td = { padding: "8px 12px", borderBottom: "1px solid #0f3460" }

const avgMonth = (W26 / 12).toFixed(1)
const FAQS = [
  {
    question: "How many working days are in a year?",
    answer: `A typical year has 260 or 261 weekdays. After the ${H26} US federal holidays, 2026 has ${W26} working days, which is ${W26 * 8} hours at 8 hours a day.`,
  },
  {
    question: "How many working days are in 2026?",
    answer: `${W26}. 2026 has ${WD26} weekdays and ${H26} federal holidays that fall on weekdays. July 4 is a Saturday in 2026, so the day off is Friday, July 3.`,
  },
  {
    question: "How many working days are in a month?",
    answer: `It ranges from 18 to 23 depending on the month and year. In 2026 the average is about ${avgMonth}. The monthly table above shows the exact count for each month of the year you choose.`,
  },
  {
    question: "How many business days are in a month?",
    answer: "Business days are the same as working days: Monday to Friday, minus holidays. Use the table above to see the count for any month from 2020 to 2035.",
  },
  {
    question: "Do working days include Saturdays?",
    answer: "No. This page counts Monday to Friday only. If your workplace opens on Saturdays, add the Saturdays in the period to the count.",
  },
  {
    question: "Which holidays does this page count?",
    answer: "The 11 US federal holidays. A holiday that falls on a Saturday moves to the Friday before, and one on a Sunday moves to the Monday after. Your employer may give different days off, so adjust for your own policy.",
  },
]

export default function WorkingDaysPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          webApplicationSchema("Working Days Calculator", DESCRIPTION, URL, "UtilitiesApplication", "2026-11-03"),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com/" },
            { name: "Working Days", url: URL },
          ]),
        ]}
      />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">🗓️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">How Many Working Days Are in a Year?</h1>
          <p className="text-lg text-[#a8a8b3]">Working days by year and by month, with US federal holidays</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Working Days" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#ffffff", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
              2026 has {W26} working days: {WD26} weekdays minus {H26} US federal holidays. That is {(W26 * 8).toLocaleString("en-US")} hours at 8 hours a day.
              Every year from 2020 to 2035 has between 249 and 251 working days once holidays come out.
            </p>
          </div>

          <WorkingDaysTool />

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Working days by year</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
                <thead><tr><th scope="col" style={th}>Year</th><th scope="col" style={th}>Weekdays</th><th scope="col" style={th}>Holidays</th><th scope="col" style={th}>Working days</th><th scope="col" style={th}>Working hours (8 a day)</th></tr></thead>
                <tbody>
                  {YEARS.map((y, i) => (
                    <tr key={y} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                      <td style={td}>{y}</td>
                      <td style={td}>{weekdaysInYear(y)}</td>
                      <td style={td}>{federalHolidays(y).length}</td>
                      <td style={td}>{workingDaysInYear(y)}</td>
                      <td style={td}>{(workingDaysInYear(y) * 8).toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.7 }}>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>How working days are counted</h2>
            <p style={{ margin: "0 0 16px" }}>
              A working day is a Monday to Friday that isn&apos;t a federal holiday. A 365-day year has 52 weeks and 1 extra day, so it
              holds 261 weekdays when that extra day is a weekday and 260 when it falls on a weekend. A leap year has 2 extra days.
              2028 starts on a Saturday, so it has 260 weekdays.
            </p>
            <p style={{ margin: "0 0 16px" }}>
              Federal holidays move the count. In 2027, January 1 2028 falls on a Saturday, so the day off is Friday, December 31 2027.
              That holiday counts in 2027, which is why 2027 has {workingDaysInYear(2027)} working days and not 250. In 2026, February and November
              have the fewest working days, {workingDaysInMonth(2026, 2)} each: Presidents&apos; Day takes 1 day from February, and Veterans Day and Thanksgiving take 2 from November.
            </p>
            <p style={{ margin: 0 }}>
              To count the working days between two specific dates, use the <a href="/days-between" style={{ color: "#e94560" }}>days between dates calculator</a>,
              which shows weekdays for any range.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 16px" }}>Frequently asked questions</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {FAQS.map(f => (
                <div key={f.question}>
                  <h3 style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600, margin: "0 0 6px" }}>{f.question}</h3>
                  <p style={{ color: "#a8a8b3", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <ShareButtons text={`2026 has ${W26} working days after US federal holidays. Count any year or month:`} url={URL} title="Working Days in a Year" />

          <div>
            <MethodologyNote text="Working days are Monday to Friday minus the 11 US federal holidays listed in 5 U.S.C. 6103. A holiday on a Saturday is observed the Friday before and one on a Sunday the Monday after, and it counts in the year of its observed date. Counts are computed from calendar rules, not typed in." />
            <LastUpdated date="November 2026" />
          </div>

          <RelatedTools
            tools={[
              { emoji: "📅", title: "Days Between Dates", desc: "Exact days and weekdays between any two dates", href: "/days-between" },
              { emoji: "⏱️", title: "Time Decimal Chart", desc: "Convert minutes to decimal hours for payroll", href: "/tools/time-decimal-chart" },
              { emoji: "💵", title: "Paycheck Calculator", desc: "Turn hours and pay into take-home pay", href: "/finance/paycheck-calculator" },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
