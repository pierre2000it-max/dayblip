import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Social Security Calculator — Best Age to Claim",
  description: "Find the best age to claim Social Security benefits. Compare lifetime totals from age 62–70 and see your break-even analysis. Free SS calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/social-security" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
