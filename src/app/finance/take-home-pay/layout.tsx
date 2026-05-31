import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Take Home Pay Calculator — Paycheck After Tax | Dayblip",
  description: "Calculate your actual take-home pay after federal tax, state tax, Social Security, Medicare and 401k deductions. All 50 states. Free paycheck calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/take-home-pay" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
