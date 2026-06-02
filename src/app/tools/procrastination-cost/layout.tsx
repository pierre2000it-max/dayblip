import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Procrastination Cost Calculator — What Is Waiting Costing You? | Dayblip",
  description: "Calculate the real financial cost of procrastinating your goals. See how much delay is costing you.",
  keywords: "procrastination cost calculator, cost of waiting to invest, opportunity cost of procrastination",
  alternates: { canonical: "https://www.dayblip.com/tools/procrastination-cost" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
