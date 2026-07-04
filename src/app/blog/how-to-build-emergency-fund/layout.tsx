import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Build a 6-Month Emergency Fund — A Step-by-Step Plan That Actually Works",
  description:
    "A 6-month emergency fund covers $25,000-30,000 for the average American household. Here is the exact step-by-step system to build one — including where to keep it and how fast you can realistically get there.",
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
