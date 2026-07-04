import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What If I Had Invested Calculator — See What $10,000 Would Be Worth Today",
  description: "What if you had invested $1,000 in Apple in 2001? Calculate what any past investment would be worth today. Free investment calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/what-if-i-invested" },
  openGraph: {
    title: "What If I Had Invested Calculator",
    description: "See what any investment would be worth today based on historical returns.",
    url: "https://www.dayblip.com/finance/what-if-i-invested",
    images: [{ url: "https://www.dayblip.com/api/og/what-if?amount=10%2C000&asset=Apple&year=2000&value=3%2C847%2C000&v=2", width: 1200, height: 630, alt: "What If I Had Invested — Dayblip" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.dayblip.com/api/og/what-if?amount=10%2C000&asset=Apple&year=2000&value=3%2C847%2C000&v=2"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
