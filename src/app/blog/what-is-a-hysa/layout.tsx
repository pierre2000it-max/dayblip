import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Is a High-Yield Savings Account (HYSA) in 2026?",
  description:
    "High-yield savings accounts pay far more than the 0.38% national average. On a $20,000 emergency fund that gap is hundreds of dollars a year.",
  alternates: { canonical: "https://www.dayblip.com/blog/what-is-a-hysa" },
  openGraph: {
    title: "What Is a High-Yield Savings Account (HYSA) and Should You Open One?",
    description: "Top HYSAs pay 4.25-4.35% APY vs 0.38% national average. On $20,000 that is about $774 more per year with identical risk.",
    url: "https://www.dayblip.com/blog/what-is-a-hysa",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
