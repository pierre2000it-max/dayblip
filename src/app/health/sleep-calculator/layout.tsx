import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sleep Calculator — Best Bedtime and Wake Up Times",
  description: "Calculate the best time to go to sleep or wake up based on 90-minute sleep cycles. Wake up refreshed every morning. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/health/sleep-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
