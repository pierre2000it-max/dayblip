import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Calculate Your Financial Independence Date",
  description:
    "Your financial independence number is annual expenses divided by 0.04. The date you reach it is calculable today, and often earlier than expected.",
  alternates: { canonical: "https://www.dayblip.com/blog/financial-independence-date" },
  openGraph: {
    title: "How to Calculate Your Financial Independence Date",
    description: "FI number = annual expenses × 25. Your target date is calculable today.",
    url: "https://www.dayblip.com/blog/financial-independence-date",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
