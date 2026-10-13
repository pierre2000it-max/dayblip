import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Renting vs Buying a Home in 2026 — The Real Break-Even Math",
  description:
    "Buying a $350,000 home costs $2,800 to $3,200 a month in true total costs at current rates. Buying usually wins after 5 to 8 years. See the math.",
  alternates: { canonical: "https://www.dayblip.com/blog/renting-vs-buying-2026" },
  openGraph: {
    title: "Renting vs Buying a Home in 2026 — The Real Break-Even Math",
    description: "Buying a $350,000 home at 7% costs $2,800-3,200/month total. The break-even vs renting is 5-8 years in most US markets.",
    url: "https://www.dayblip.com/blog/renting-vs-buying-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
