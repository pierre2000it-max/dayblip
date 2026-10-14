import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Capital Gains Tax in 2026: Rates, Thresholds, Examples",
  description:
    "Long-term gains are taxed at 0%, 15% or 20%, short-term gains at your income rate. 2026 thresholds and worked examples at 4 incomes. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/blog/capital-gains-tax-2026" },
  openGraph: {
    title: "Capital Gains Tax in 2026: Rates, Thresholds, Examples",
    description: "Hold an asset for more than 1 year and the tax rate can drop from 24% to 15%. The 2026 thresholds and worked examples at 4 incomes.",
    url: "https://www.dayblip.com/blog/capital-gains-tax-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
