import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Budget Calculator — 50/30/20 Rule Budget Planner",
  description: "Build your monthly budget using the 50/30/20 rule. See exactly how to split income between needs, wants and savings. Free budget planner.",
  alternates: { canonical: "https://www.dayblip.com/finance/budget-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
