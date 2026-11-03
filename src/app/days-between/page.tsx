import type { Metadata } from "next";
import DaysBetweenTool from "./DaysBetweenTool";
import { generateToolSchema, generateBreadcrumbSchema } from "@/lib/seo";
import RelatedTools from "@/components/RelatedTools";
import LastUpdated from "@/components/LastUpdated";
import MethodologyNote from "@/components/MethodologyNote";

const BASE  = "https://www.dayblip.com";
const URL   = "/days-between";
const TITLE = "Days Between Dates Calculator";
const DESC  = "Calculate the exact days, weeks and weekdays between any two dates. 100 days is 14 weeks and 2 days. Free, no signup required.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: ["days between dates", "days between two dates calculator", "how many days between dates"],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE, description: DESC, type: "website", url: URL,
    images: [{ url: "/api/og?title=Days+Between+Calculator&emoji=⏱&subtitle=Find+exact+days+between+two+dates", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const toolSchema = generateToolSchema(
  "Days Between Dates Calculator",
  DESC,
  `${BASE}${URL}`,
);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home",                        url: BASE },
  { name: "Days Between Dates",          url: `${BASE}${URL}` },
]);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthDays = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
const PERIODS = [7, 14, 30, 60, 90, 100, 180, 365, 366];
const th = { textAlign: "left" as const, padding: "10px 12px", background: "#0f3460", borderBottom: "2px solid #e94560", whiteSpace: "nowrap" as const };
const td = { padding: "8px 12px", borderBottom: "1px solid #0f3460" };

export default function DaysBetweenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <DaysBetweenTool />

      <section className="bg-[#1a1a2e] px-6 py-14">
        <div className="mx-auto max-w-[700px] space-y-8">
          <article style={{ color: "#a8a8b3", fontSize: "16px", lineHeight: 1.7 }}>
            <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" }}>How to count days between two dates</h2>
            <p style={{ margin: "0 0 16px" }}>
              Subtract the earlier date from the later one. The result excludes the end date: January 1 to January 2 is 1 day. To count
              both the start and the end date, add 1. To turn days into weeks, divide by 7 and keep the remainder as extra days. The
              calculator above does all three at once and also shows weekdays, weekend days, hours and minutes.
            </p>
            <p style={{ margin: 0 }}>
              To count only working days in a year or month, use the <a href="/working-days" style={{ color: "#e94560" }}>working days calculator</a>,
              which removes US federal holidays. To convert a time such as 8 hours 20 minutes into a decimal, use the{" "}
              <a href="/tools/time-decimal-chart" style={{ color: "#e94560" }}>time decimal chart</a>.
            </p>
          </article>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Common periods in weeks and months</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
                <thead><tr><th scope="col" style={th}>Days</th><th scope="col" style={th}>Weeks and days</th><th scope="col" style={th}>Approx. months</th></tr></thead>
                <tbody>
                  {PERIODS.map((d, i) => (
                    <tr key={d} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                      <td style={td}>{d}</td>
                      <td style={td}>{Math.floor(d / 7)} weeks{d % 7 ? ` and ${d % 7} day${d % 7 > 1 ? "s" : ""}` : ""}</td>
                      <td style={td}>{(d / 30.44).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Days in each month</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: "#ffffff" }}>
                <thead><tr><th scope="col" style={th}>Month</th><th scope="col" style={th}>Common year</th><th scope="col" style={th}>Leap year</th></tr></thead>
                <tbody>
                  {MONTHS.map((m, i) => (
                    <tr key={m} style={{ background: i % 2 ? "#1a1a2e" : "#1e2d4a" }}>
                      <td style={td}>{m}</td><td style={td}>{monthDays(2025, i)}</td><td style={td}>{monthDays(2024, i)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#0f3460", fontWeight: 700 }}>
                    <td style={td}>Total</td>
                    <td style={td}>{MONTHS.reduce((n, _, i) => n + monthDays(2025, i), 0)}</td>
                    <td style={td}>{MONTHS.reduce((n, _, i) => n + monthDays(2024, i), 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div>
            <MethodologyNote text="Days are counted as the later date minus the earlier date, excluding the end date. Weekdays are Monday to Friday. Approximate months divide days by 30.44, the average month length." />
            <LastUpdated date="November 2026" />
          </div>

          <RelatedTools
            tools={[
              { emoji: "🗓️", title: "Working Days in a Year", desc: "Working days by year and month", href: "/working-days" },
              { emoji: "🎂", title: "Age Calculator", desc: "Your exact age in years, months and days", href: "/age-calculator" },
              { emoji: "📆", title: "Date Calculator", desc: "Add or subtract days from any date", href: "/date-calculator" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
