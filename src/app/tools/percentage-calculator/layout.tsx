import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Percentage Calculator — Calculate Any Percentage Instantly",
  description: "Calculate percentage of a number percentage change between two values and percentage difference. What is 15% of 85? What percent is 45 of 200? Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/percentage-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
