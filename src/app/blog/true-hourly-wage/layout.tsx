import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Your Salary Actually Pays Per Hour",
  description:
    "Your true hourly wage counts commute time and work costs. In our worked example, a $25.00 take-home rate falls to $21.87. Free, no signup.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-hourly-wage" },
  openGraph: {
    title: "What Your Salary Actually Pays Per Hour",
    description: "A $25.00 take-home rate falls to $21.87 after commute time and work costs. Here is how to calculate yours.",
    url: "https://www.dayblip.com/blog/true-hourly-wage",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
