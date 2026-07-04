import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Financial Cost of Smoking — The Number Most Smokers Have Never Calculated",
  description:
    "A pack-a-day smoking habit invested instead at 7% annual return grows to $640,000 over 40 years. Most smokers have never seen this number.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-cost-of-smoking" },
  openGraph: {
    title: "The Financial Cost of Smoking",
    description: "$9.50/day invested instead at 7% grows to $640,000 over 40 years.",
    url: "https://www.dayblip.com/blog/true-cost-of-smoking",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
