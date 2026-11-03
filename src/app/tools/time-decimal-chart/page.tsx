import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import LastUpdated from "@/components/LastUpdated"
import MethodologyNote from "@/components/MethodologyNote"
import ShareButtons from "@/components/ShareButtons"
import TimeDecimalTool from "./TimeDecimalTool"
import { webApplicationSchema, faqSchema, breadcrumbSchema } from "@/lib/schema"
import { minutesToDecimal, hoursMinutesToDecimal } from "@/lib/timeDecimal"

const URL = "https://www.dayblip.com/tools/time-decimal-chart"
const DESCRIPTION = "Convert minutes to decimal hours with a full 1 to 59 minute chart and a calculator. 15 minutes is 0.25 hours. Free, no signup required."

const th = { textAlign: "left" as const, padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560", whiteSpace: "nowrap" as const }
const td = { padding: "6px 12px", borderBottom: "1px solid #0f3460" }

// Four side-by-side blocks of 15 minutes keep the chart compact on desktop.
const BLOCKS = [1, 16, 31, 46].map(start => Array.from({ length: start === 46 ? 14 : 15 }, (_, i) => start + i))

const FAQS = [
  {
    question: "How do you convert minutes to decimal hours?",
    answer: "Divide the minutes by 60. 15 minutes is 15 / 60 = 0.25 hours, 30 minutes is 0.50 hours and 45 minutes is 0.75 hours. Round to 2 decimal places for payroll.",
  },
  {
    question: "What is 20 minutes as a decimal?",
    answer: "0.33 hours. 20 / 60 is 0.3333, which rounds to 0.33.",
  },
  {
    question: "How do you convert hours and minutes to decimal hours?",
    answer: `Keep the whole hours and convert only the minutes. 8 hours 20 minutes is 8 + 20 / 60 = ${hoursMinutesToDecimal(8, 20).toFixed(2)} hours. 7 hours 45 minutes is ${hoursMinutesToDecimal(7, 45).toFixed(2)} hours.`,
  },
  {
    question: "How do you convert decimal hours back to minutes?",
    answer: "Multiply the decimal part by 60. 8.33 hours is 8 hours plus 0.33 x 60 = 19.8, which rounds to 20 minutes, so 8 hours 20 minutes.",
  },
  {
    question: "Why do timesheets use decimal hours?",
    answer: "Pay is a rate per hour, so a decimal number multiplies directly. 8.25 hours at $20 an hour is $165. A time like 8:15 has to be converted first.",
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup
        schemas={[
          webApplicationSchema("Time Decimal Chart", DESCRIPTION, URL, "UtilitiesApplication", "2026-11-03"),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", url: "https://www.dayblip.com/" },
            { name: "Tools", url: "https://www.dayblip.com/tools" },
            { name: "Time Decimal Chart", url: URL },
          ]),
        ]}
      />

      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="mx-auto max-w-[800px]">
          <div className="mb-4 text-5xl">⏱️</div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">Time Decimal Chart</h1>
          <p className="text-lg text-[#a8a8b3]">Convert minutes to decimal hours for timesheets and payroll</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-14">
        <div className="mx-auto max-w-[900px] space-y-8">
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Time Decimal Chart" }]} />

          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ color: "#e94560", fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Quick Answer</div>
            <p style={{ color: "#ffffff", fontSize: "16px", lineHeight: 1.6, margin: 0 }}>
              Divide minutes by 60 to get decimal hours. 15 minutes is 0.25 hours, 30 minutes is 0.50 and 45 minutes is 0.75. So 8 hours
              20 minutes is {hoursMinutesToDecimal(8, 20).toFixed(2)} hours. The chart below covers every minute from 1 to 59.
            </p>
          </div>

          <TimeDecimalTool />

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Minutes to decimal hours chart</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {BLOCKS.map((rows, b) => (
                <table key={b} style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff", alignSelf: "start" }}>
                  <thead><tr><th scope="col" style={th}>Minutes</th><th scope="col" style={th}>Decimal</th></tr></thead>
                  <tbody>
                    {rows.map((m, i) => (
                      <tr key={m} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                        <td style={td}>{m}</td>
                        <td style={td}>{minutesToDecimal(m).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </section>

          <section style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.7 }}>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>When to use decimal hours</h2>
            <p style={{ margin: "0 0 16px" }}>
              Payroll systems multiply hours by a pay rate, so they need a decimal number. A shift from 8:00 to 4:25 with a 30 minute
              unpaid break is 7 hours 55 minutes, or {hoursMinutesToDecimal(7, 55).toFixed(2)} hours. At $22 an hour that is ${(hoursMinutesToDecimal(7, 55) * 22).toFixed(2)}.
            </p>
            <p style={{ margin: 0 }}>
              Some employers round to the nearest quarter hour (0.25). Check your own policy, because rounding rules vary and the
              chart above shows exact two-place values.
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

          <ShareButtons text="Minutes to decimal hours chart: 15 min = 0.25, 30 min = 0.50, 45 min = 0.75. Free converter:" url={URL} title="Time Decimal Chart" />

          <div>
            <MethodologyNote text="Decimal hours equal minutes divided by 60, rounded to 2 decimal places. Values are computed from that formula, not typed in. Employers may apply their own rounding rules to timesheets." />
            <LastUpdated date="November 2026" />
          </div>

          <RelatedTools
            tools={[
              { emoji: "🗓️", title: "Working Days in a Year", desc: "Working days by year and month", href: "/working-days" },
              { emoji: "💵", title: "Paycheck Calculator", desc: "Turn hours and pay into take-home pay", href: "/finance/paycheck-calculator" },
              { emoji: "📅", title: "Days Between Dates", desc: "Exact days between any two dates", href: "/days-between" },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
