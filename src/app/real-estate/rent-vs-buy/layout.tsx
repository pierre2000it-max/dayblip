import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator — Find Your Break-Even Point | Dayblip",
  description: "Find out if renting or buying is smarter for you. See total costs over any timeframe and your mortgage break-even year. Free rent vs buy calculator.",
  alternates: { canonical: "https://www.dayblip.com/real-estate/rent-vs-buy" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
