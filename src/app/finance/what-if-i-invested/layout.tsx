import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What If I Had Invested Calculator — See What $10,000 Would Be Worth Today | Dayblip",
  description: "Calculate what any investment would be worth today. What if you had invested $10,000 in Apple in 2000? In Bitcoin in 2015? In the S&P 500 in 1990? Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/what-if-i-invested" },
  openGraph: {
    title: "What If I Had Invested Calculator | Dayblip",
    description: "See what any investment would be worth today based on historical returns.",
    url: "https://www.dayblip.com/finance/what-if-i-invested",
    images: [{ url: "/api/og/what-if?amount=10%2C000&asset=Apple&year=2000&value=3%2C847%2C000", width: 1200, height: 630, alt: "What If I Had Invested — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og/what-if?amount=10%2C000&asset=Apple&year=2000&value=3%2C847%2C000"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
