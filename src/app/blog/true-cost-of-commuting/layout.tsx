import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The True Cost of Your Commute in 2026: What AAA Data Shows | Dayblip",
  description:
    "AAA puts the average commute cost at $8,466 per year. Add lost time and the real cost exceeds $19,000. See your personal commute cost.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-cost-of-commuting" },
  openGraph: {
    title: "The True Cost of Your Commute: What AAA Data Says You Are Actually Spending",
    description: "AAA puts the average commute cost at $8,466/year. Adding lost time, the real annual cost of a 5-day commute is over $16,000. Here is the breakdown by schedule.",
    url: "https://www.dayblip.com/blog/true-cost-of-commuting",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
