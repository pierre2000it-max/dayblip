import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home Affordability Calculator — 28/36 Rule",
  description: "Calculate how much home you can afford using the 28/36 rule. Enter income, debts and down payment to find your max home price. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/real-estate/affordability" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
