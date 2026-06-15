import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "401(k) Calculator — Maximize Your Employer Match | Dayblip",
  description: "Calculate your 401k balance at retirement based on contributions, employer match, and investment returns. Uses 2026 IRS limits of $23,500. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/401k-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
