import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How Much to Save in Your 401(k): By Income Tier, 2026 | Dayblip",
  description:
    "The 2026 401(k) limit is $23,500. Maxing it for 30 years at 7% grows to $2.22M. But the right contribution rate depends on your income tier — here is the breakdown.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-much-to-save-in-401k" },
  openGraph: {
    title: "How Much to Save in Your 401(k): By Income Tier, 2026",
    description: "Maxing out at $23,500/year at 7% for 30 years = $2.22M. But what you should actually contribute varies by income. Always start with the full employer match.",
    url: "https://www.dayblip.com/blog/how-much-to-save-in-401k",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
