import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Overtime Pay Calculator: What Extra Hours Earn You",
  description: "Calculate gross overtime pay for any hourly rate and hours worked. See weekly monthly and annual overtime earnings. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/overtime-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
