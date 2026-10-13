import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Self-Employment Tax 2026: What You Owe and What to Save",
  description:
    "Self-employment tax is 15.3% of 92.35% of net profit. See 2026 worked examples at 5 income levels and how much to set aside each quarter. Free calculator.",
  alternates: { canonical: "https://www.dayblip.com/blog/self-employment-tax-2026" },
  openGraph: {
    title: "Self-Employment Tax in 2026: What You Owe and How Much to Set Aside",
    description: "Self-employment tax is about 14.1% of net profit, on top of income tax. Worked 2026 examples from $30,000 to $200,000 and the quarterly payment dates.",
    url: "https://www.dayblip.com/blog/self-employment-tax-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
