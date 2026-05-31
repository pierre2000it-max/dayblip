import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historical Home Value Calculator — What Is My Home Worth? | Dayblip",
  description: "Estimate your home's current value based on when you bought it. See US median home price history from 1950 to today. Free home value calculator.",
  alternates: { canonical: "https://www.dayblip.com/real-estate/home-value" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
