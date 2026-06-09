import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paycheck Calculator 2026 — Net Pay After Taxes and Deductions | Dayblip",
  description: "Calculate your exact net paycheck for any pay period after federal tax state tax FICA and pre-tax deductions like 401k and health insurance. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/paycheck-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
