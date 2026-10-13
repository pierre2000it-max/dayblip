import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Federal Tax Brackets 2026: Marginal vs Effective Rate",
  description:
    "Tax brackets tax each slice of income at its own rate. See the 2026 brackets, a $80,000 worked example and why a raise never cuts your pay. Free guide.",
  alternates: { canonical: "https://www.dayblip.com/blog/federal-tax-brackets-2026" },
  openGraph: {
    title: "How Federal Tax Brackets Work in 2026: Marginal vs Effective Rate",
    description: "Each slice of income is taxed at its own rate. The 2026 brackets for single and joint filers and a slice-by-slice $80,000 example.",
    url: "https://www.dayblip.com/blog/federal-tax-brackets-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
