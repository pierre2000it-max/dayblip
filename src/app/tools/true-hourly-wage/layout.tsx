import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "True Hourly Wage Calculator — What Does Your Job Really Pay? | Dayblip",
  description: "Calculate your real hourly wage after commute time, prep time and work costs. Most people earn 20-30% less than they think.",
  keywords: "true hourly wage calculator, real hourly rate calculator, what does my job actually pay",
  alternates: { canonical: "https://www.dayblip.com/tools/true-hourly-wage" },
  openGraph: {
    title: "True Hourly Wage Calculator — What Does Your Job Really Pay? | Dayblip",
    description: "Calculate your real hourly wage after commute time, prep time and work costs.",
    url: "https://www.dayblip.com/tools/true-hourly-wage",
    images: [{ url: "https://www.dayblip.com/api/og?title=True+Hourly+Wage+Calculator&emoji=%F0%9F%92%BC&subtitle=What+your+job+really+pays+after+all+costs+%E2%80%94+Free", width: 1200, height: 630, alt: "True Hourly Wage Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=True+Hourly+Wage+Calculator&emoji=%F0%9F%92%BC&subtitle=What+your+job+really+pays+after+all+costs+%E2%80%94+Free"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
