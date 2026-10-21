import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What Is Net Worth and How to Calculate Yours",
  description:
    "Net worth is assets minus liabilities — but most people miscalculate it in ways that make them feel either richer or poorer than they actually are.",
  alternates: { canonical: "https://www.dayblip.com/blog/what-is-net-worth" },
  openGraph: {
    title: "What Is Net Worth and How to Calculate Yours",
    description: "Median US family net worth was $215,900 per the Federal Reserve's 2025 survey. Here is how to calculate yours correctly.",
    url: "https://www.dayblip.com/blog/what-is-net-worth",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
