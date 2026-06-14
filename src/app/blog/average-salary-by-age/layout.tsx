import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Average American Salary by Age: What BLS Data Actually Shows | Dayblip",
  description:
    "Median weekly earnings peak at $1,220 for workers 45–54. The gender pay gap of 16.3% reflects occupation mix alongside career interruptions. Full BLS breakdown. No signup.",
  alternates: { canonical: "https://www.dayblip.com/blog/average-salary-by-age" },
  openGraph: {
    title: "Average American Salary by Age: What the Data Actually Shows",
    description: "Bureau of Labor Statistics earnings data by age group, with a plain-English explanation of the gender pay gap and what actually drives it.",
    url: "https://www.dayblip.com/blog/average-salary-by-age",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
