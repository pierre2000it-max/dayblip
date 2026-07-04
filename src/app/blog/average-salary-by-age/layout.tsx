import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Average American Salary by Age: What BLS Data Actually Shows",
  description:
    "Median weekly earnings peak at $1,220 for workers aged 45–54. See how your salary compares to national averages by age and gender.",
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
