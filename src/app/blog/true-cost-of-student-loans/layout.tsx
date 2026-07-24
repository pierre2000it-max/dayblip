import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Cost of Student Loans — What You Actually Pay Back | Dayblip",
  description:
    "A $30,000 student loan at 6.39% on the standard 10-year plan costs $10,800 in interest — you repay $40,800. Extended to 20 years you repay $53,280. The full breakdown by balance and repayment plan.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/true-cost-of-student-loans",
  },
  openGraph: {
    title: "The True Cost of Student Loans — What You Actually Pay Back",
    description:
      "A $30,000 loan at 6.39% costs $10,800 in interest on standard 10-year repayment. Extended to 20 years: $23,280 in interest. The full calculation.",
    url: "https://www.dayblip.com/blog/true-cost-of-student-loans",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
