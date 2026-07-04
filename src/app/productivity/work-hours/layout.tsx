import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Work Hours Calculator — Career Hours & Lifetime Earnings",
  description: "Calculate total hours worked in your career and projected lifetime earnings. See how much of your life you've spent working. Free work hours calculator.",
  alternates: { canonical: "https://www.dayblip.com/productivity/work-hours" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
