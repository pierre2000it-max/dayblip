import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much Does a Wedding Actually Cost in 2026? | Dayblip",
  description:
    "The average US wedding costs $34,200 in 2026 per The Knot Real Weddings Study of 10,474 couples. The median is closer to $20,000-$25,000. Here is the full breakdown by category and by region.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/how-much-does-a-wedding-cost",
  },
  openGraph: {
    title: "How Much Does a Wedding Actually Cost in 2026?",
    description:
      "Average $34,200 per The Knot 2026 (10,474 couples). Median $20,000-$25,000. The venue is the biggest cost driver. The full breakdown by category.",
    url: "https://www.dayblip.com/blog/how-much-does-a-wedding-cost",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
