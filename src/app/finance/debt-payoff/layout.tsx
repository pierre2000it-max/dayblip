import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Debt Payoff Calculator — Avalanche vs Snowball",
  description: "Calculate your debt-free date using avalanche or snowball method. Enter up to 5 debts and see how extra payments save money. Free debt calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/debt-payoff" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
