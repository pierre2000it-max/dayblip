import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your $75,000 Salary Is Worth Very Different Amounts by State — 2026 Data",
  description:
    "A $75,000 salary takes home $61,390 in Texas and $56,972 in Hawaii. Full 50-state 2026 take-home breakdown with IRS and Tax Foundation sources. No signup.",
  alternates: { canonical: "https://www.dayblip.com/blog/paycheck-by-state-2026" },
  openGraph: {
    title: "Your $75,000 Salary Is Worth Very Different Amounts by State",
    description: "The same $75,000 salary takes home $4,418 more per year in Texas than Hawaii. Here is what state income tax actually costs you.",
    url: "https://www.dayblip.com/blog/paycheck-by-state-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
