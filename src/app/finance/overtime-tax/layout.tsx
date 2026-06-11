import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "No Tax on Overtime Calculator 2026 — How Much Do You Save? | Dayblip",
  description: "Calculate your 2026 overtime tax savings under the One Big Beautiful Bill Act. Free calculator for hourly workers. No signup ever.",
  alternates: { canonical: "https://www.dayblip.com/finance/overtime-tax" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
