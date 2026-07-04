import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Savings Goal Calculator — How Long to Save?",
  description: "Calculate how long it takes to reach any savings goal. Enter emergency fund, down payment, vacation or custom target. Free savings calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/savings-goal" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
