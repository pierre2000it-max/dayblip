import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Why Starting to Invest Early Beats Saving More Later",
  description:
    "Saving $200 per month from 25 to 35 often outperforms $500 per month from 35 to 65. The math explains why time beats amount.",
  alternates: { canonical: "https://www.dayblip.com/blog/compound-interest-early-saver" },
  openGraph: {
    title: "Why Starting to Invest Early Beats Saving More Later",
    description: "$200/month from 25–35 often beats $500/month from 35–65. The math is counterintuitive.",
    url: "https://www.dayblip.com/blog/compound-interest-early-saver",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
