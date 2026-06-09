import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "No Tax on Overtime Calculator 2026 — How Much Do You Save? | Dayblip",
  description: "Calculate your federal tax savings on overtime pay under the 2026 One Big Beautiful Bill Act. Eligible hourly workers can deduct up to $12,500 in overtime premium pay. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/overtime-tax" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
