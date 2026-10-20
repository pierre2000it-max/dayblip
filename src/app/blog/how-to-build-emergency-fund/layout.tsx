import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Build a 6-Month Emergency Fund: Step-by-Step Plan",
  description:
    "A 6-month emergency fund covers $25,000 to $30,000 for the average US household. Follow this step-by-step system to build one and where to keep it.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-to-build-emergency-fund" },
  openGraph: {
    title: "How to Build a 6-Month Emergency Fund — Step by Step",
    description: "The average American household needs $14,400-$28,800. Where to keep it in 2026, how much to save monthly, and the exact build plan.",
    url: "https://www.dayblip.com/blog/how-to-build-emergency-fund",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
