import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GPA Calculator — Calculate Your Grade Point Average Instantly | Dayblip",
  description: "Calculate your semester and cumulative GPA instantly. Weighted and unweighted GPA for high school and college. Enter grades and credit hours. Free — no signup.",
  alternates: { canonical: "https://www.dayblip.com/education/gpa-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
