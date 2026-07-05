import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much Does It Actually Cost to Raise a Child in 2026? | Dayblip",
  description: "The inflation-adjusted cost of raising a child from birth to 18 is approximately $310,000 for a middle-income family in 2026 per USDA data adjusted by BLS inflation. The full annual breakdown by category.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/cost-of-raising-a-child-2026",
  },
  openGraph: {
    title: "How Much Does It Actually Cost to Raise a Child in 2026?",
    description: "The inflation-adjusted USDA estimate is approximately $310,000 from birth to 18 for a middle-income family. Housing is 29%. Childcare can run $17,836/year.",
    url: "https://www.dayblip.com/blog/cost-of-raising-a-child-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
