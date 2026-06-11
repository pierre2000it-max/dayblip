import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paycheck Calculator 2026 — Net Pay After Taxes and Deductions | Dayblip",
  description: "Calculate your net paycheck after federal tax, state tax, FICA, and pre-tax deductions like 401k and health insurance. Free paycheck calculator — no signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/paycheck-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
