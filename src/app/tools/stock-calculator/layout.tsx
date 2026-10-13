import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historical Stock Calculator — What If You Had Invested?",
  description: "See what $1,000 in Apple, Amazon, Tesla, or the S&P 500 would be worth today. An educational investment calculator. Free — no signup required.",
  keywords: "what if I invested in Apple 2001, historical stock calculator, past investment calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/stock-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
