import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Break Even Calculator — When Will My Business Profit?",
  description: "Calculate your business break-even point. Find how many units you need to sell to cover fixed and variable costs. Free break-even analysis tool.",
  alternates: { canonical: "https://www.dayblip.com/finance/break-even" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
