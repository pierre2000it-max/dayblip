import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Is a High-Yield Savings Account (HYSA) and Should You Open One in 2026?",
  description:
    "The best HYSAs pay 3.80-4.50% APY in June 2026 vs 0.38% national average. On a $20,000 emergency fund that difference is $774 per year. Here is everything you need to know.",
  alternates: { canonical: "https://www.dayblip.com/blog/what-is-a-hysa" },
  openGraph: {
    title: "What Is a High-Yield Savings Account (HYSA) and Should You Open One?",
    description: "Best HYSAs pay 3.80-4.50% APY vs 0.38% national average. On $20,000 that is $774 more per year with identical risk.",
    url: "https://www.dayblip.com/blog/what-is-a-hysa",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
