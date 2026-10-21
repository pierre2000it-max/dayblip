import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much Does It Cost to Raise a Child in 2026?",
  description: "Raising a child from birth to 18 costs about $325,000 for a middle-income family in 2026, per USDA data adjusted for inflation. See the breakdown.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/cost-of-raising-a-child-2026",
  },
  openGraph: {
    title: "How Much Does It Actually Cost to Raise a Child in 2026?",
    description: "The inflation-adjusted USDA estimate is approximately $325,000 from birth to 18 for a middle-income family. Housing is 29% of the total.",
    url: "https://www.dayblip.com/blog/cost-of-raising-a-child-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
