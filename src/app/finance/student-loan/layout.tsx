import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Loan Payoff Calculator — Save on Interest | Dayblip",
  description: "See how extra payments can save thousands on student loans. Calculate payoff date, total interest and months saved. Free student loan calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/student-loan" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
