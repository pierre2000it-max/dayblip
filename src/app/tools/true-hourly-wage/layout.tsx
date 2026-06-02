import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "True Hourly Wage Calculator — What Does Your Job Really Pay? | Dayblip",
  description: "Calculate your real hourly wage after commute time, prep time and work costs. Most people earn 20-30% less than they think.",
  keywords: "true hourly wage calculator, real hourly rate calculator, what does my job actually pay",
  alternates: { canonical: "https://www.dayblip.com/tools/true-hourly-wage" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
