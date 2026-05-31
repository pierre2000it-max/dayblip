import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productivity Calculators — Work Hours, Meeting Cost & Salary | Dayblip",
  description: "Free productivity calculators: work hours calculator, meeting cost timer and salary converter. Calculate your real hourly rate and career earnings.",
  alternates: { canonical: "https://www.dayblip.com/productivity" },
}

export default function ProductivityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
