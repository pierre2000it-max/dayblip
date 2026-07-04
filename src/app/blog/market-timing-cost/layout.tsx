import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Real Cost of Trying to Time the Stock Market",
  description:
    "Missing just 10 of the market's best days over 20 years can cut your returns by more than half. Those days almost always follow the worst days.",
  alternates: { canonical: "https://www.dayblip.com/blog/market-timing-cost" },
  openGraph: {
    title: "The Real Cost of Trying to Time the Stock Market",
    description: "Missing 10 best days over 20 years cuts a $65,000 portfolio to $29,000.",
    url: "https://www.dayblip.com/blog/market-timing-cost",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
