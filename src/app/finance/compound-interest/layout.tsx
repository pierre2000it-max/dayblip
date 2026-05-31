import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compound Interest Calculator — Watch Your Money Grow | Dayblip",
  description: "Calculate how investments grow with compound interest. See year-by-year balance with monthly contributions. Includes Rule of 72. Free calculator, no signup.",
  alternates: { canonical: "https://www.dayblip.com/finance/compound-interest" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
