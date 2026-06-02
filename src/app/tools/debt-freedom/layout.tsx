import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Debt Freedom Date Calculator — When Will I Be Debt Free? | Dayblip",
  description: "Find the exact date you will be completely debt free. Includes live countdown timer to your debt freedom date.",
  keywords: "debt freedom date, when will I be debt free, debt payoff countdown",
  alternates: { canonical: "https://www.dayblip.com/tools/debt-freedom" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
