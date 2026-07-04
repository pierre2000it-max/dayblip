import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inflation Calculator — What Was Money Worth?",
  description: "Calculate the value of money across different years. Find out what $100 from 1990 is worth in today's dollars using historical CPI data. Free tool.",
  alternates: { canonical: "https://www.dayblip.com/finance/inflation" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
