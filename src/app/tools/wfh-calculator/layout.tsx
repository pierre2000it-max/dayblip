import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Work From Home Savings Calculator — What Is Remote Work Worth? | Dayblip",
  description: "Calculate the true financial value of working from home vs the office. See how much remote work saves or costs you per year. Free WFH calculator.",
  keywords: ["work from home savings calculator", "remote work financial benefit", "WFH vs office cost", "how much does commuting cost me", "remote work salary equivalent"],
  alternates: { canonical: "https://www.dayblip.com/tools/wfh-calculator" },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
