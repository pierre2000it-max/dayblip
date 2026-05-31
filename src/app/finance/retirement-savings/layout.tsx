import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retirement Savings Calculator — Are You On Track? | Dayblip",
  description: "Find out if your retirement savings are on track. See projected balance vs amount needed using the 25x rule. Free retirement calculator, no signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/retirement-savings" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
