import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cost of Living Comparison Calculator | Dayblip",
  description: "Compare the cost of living between 30 US cities. Find what salary you need to maintain your lifestyle after moving. Free cost of living calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/cost-of-living" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
