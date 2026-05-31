import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Net Worth Calculator — Know Where You Stand | Dayblip",
  description: "Calculate your net worth by entering assets and liabilities. Compare to Federal Reserve age benchmarks. Free net worth calculator, no signup required.",
  alternates: { canonical: "https://www.dayblip.com/finance/net-worth" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
