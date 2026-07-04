import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Finance Calculators — Free Financial Planning Tools",
  description: "Free financial calculators for compound interest, mortgage payments, retirement savings, debt payoff and more. No signup required.",
  alternates: { canonical: "https://www.dayblip.com/finance" },
}

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
