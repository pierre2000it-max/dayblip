import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much House Can I Afford? Bank Math vs Smart Math",
  description:
    "Banks lend up to 43% of gross income. Planners say keep housing at 28% or less. Learn how to find the number that fits your own budget.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-much-house-can-i-afford" },
  openGraph: {
    title: "How Much House Can I Actually Afford? The Full Calculation",
    description: "Banks approve 28% of gross income. Planners recommend 25% of net. On a $75,000 salary those are very different numbers.",
    url: "https://www.dayblip.com/blog/how-much-house-can-i-afford",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
