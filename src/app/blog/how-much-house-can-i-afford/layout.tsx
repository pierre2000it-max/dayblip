import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much House Can I Actually Afford? The Calculation Banks Use vs What You Should Use",
  description:
    "Banks will lend you up to 43% of gross income per standard DTI rules. Most financial planners recommend keeping housing at 28% or below. The real number that works for your budget is different from both.",
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
