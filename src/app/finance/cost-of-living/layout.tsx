import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cost of Living Comparison — Compare Any Two US Cities",
  description: "Compare cost of living between any two US cities. See exactly how much more or less you need to earn to maintain the same lifestyle. Free. No signup ever.",
  alternates: { canonical: "https://www.dayblip.com/finance/cost-of-living" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
