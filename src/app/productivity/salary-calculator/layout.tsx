import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Salary Calculator — Convert Between Pay Periods",
  description: "Convert salary between hourly, daily, weekly, monthly and annual. Includes federal after-tax estimate and raise calculator. Free salary converter.",
  alternates: { canonical: "https://www.dayblip.com/productivity/salary-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
