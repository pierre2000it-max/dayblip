import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The 4% Rule: The Math Behind Retirement Planning",
  description:
    "The research behind the 4% rule, what it actually says, where it has limits, and how to use it to calculate when you can stop working.",
  alternates: { canonical: "https://www.dayblip.com/blog/the-4-percent-rule" },
  openGraph: {
    title: "The 4% Rule: The Math Behind Retirement Planning",
    description: "One number derived from 75 years of market data says you need 25 times your annual expenses to retire. Here is what the research actually found.",
    url: "https://www.dayblip.com/blog/the-4-percent-rule",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
