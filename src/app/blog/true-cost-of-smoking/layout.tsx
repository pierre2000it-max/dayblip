import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Financial Cost of Smoking Over a Lifetime",
  description:
    "A pack-a-day smoking habit invested instead at 7% annual return grows to $758,000 over 40 years. Most smokers have never seen this number.",
  alternates: { canonical: "https://www.dayblip.com/blog/true-cost-of-smoking" },
  openGraph: {
    title: "The Financial Cost of Smoking",
    description: "A pack a day at $9.50, invested instead at 7%, grows to $758,000 over 40 years.",
    url: "https://www.dayblip.com/blog/true-cost-of-smoking",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
