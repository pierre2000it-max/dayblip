import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Percentage Calculator — Calculate Any Percentage Instantly",
  description: "Calculate a percentage of a number, percentage change, and percentage difference. What is 15% of 85? Free percentage calculator — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/tools/percentage-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
