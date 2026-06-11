import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Financial Life Score — Rate Your Financial Health in 2 Minutes | Dayblip",
  description: "Get your personal Financial Life Score from 0 to 100. Answer 10 questions about savings debt retirement and income. See exactly where to improve. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/financial-life-score" },
  openGraph: {
    title: "Financial Life Score | Dayblip",
    description: "Get your personal Financial Life Score from 0 to 100 in 2 minutes.",
    url: "https://www.dayblip.com/tools/financial-life-score",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
