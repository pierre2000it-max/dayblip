import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much to Save in Your 401(k): By Income Tier, 2026",
  description:
    "Maxing your 401k at $24,500 per year at 7% for 30 years grows to $2.31M. Here is how much you should actually contribute and when.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-much-to-save-in-401k" },
  openGraph: {
    title: "How Much to Save in Your 401(k): By Income Tier, 2026",
    description: "Maxing out at $24,500/year at 7% for 30 years = $2.31M. But what you should contribute varies by income. Start with the full employer match.",
    url: "https://www.dayblip.com/blog/how-much-to-save-in-401k",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
