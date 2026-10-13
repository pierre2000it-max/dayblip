import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Procrastination Cost Calculator — What Is Waiting Costing You?",
  description: "Calculate the real financial cost of procrastinating on your goals. See how much each month of delay is costing you. Free — no signup required.",
  keywords: "procrastination cost calculator, cost of waiting to invest, opportunity cost of procrastination",
  alternates: { canonical: "https://www.dayblip.com/tools/procrastination-cost" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
