import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much Does a Wedding Actually Cost in 2026? | Dayblip",
  description:
    "The average US wedding costs $34,200 in 2026 per The Knot study of 10,474 couples. See costs by category and planning tips.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/how-much-does-a-wedding-cost",
  },
  openGraph: {
    title: "How Much Does a Wedding Actually Cost in 2026?",
    description:
      "Average $34,200 per The Knot 2026 (10,474 couples), about $292 per guest. The venue is the biggest cost driver. The full breakdown by category.",
    url: "https://www.dayblip.com/blog/how-much-does-a-wedding-cost",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
