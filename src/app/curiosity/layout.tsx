import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Opportunity Cost Calculators — What Could Your Spending Be Worth?",
  description: "See what everyday spending could be worth if invested in the S&P 500. Subscriptions, coffee, lottery tickets and more. Educational only.",
  alternates: { canonical: "https://www.dayblip.com/curiosity" },
}

export default function CuriosityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
