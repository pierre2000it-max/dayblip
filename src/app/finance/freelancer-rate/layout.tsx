import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Freelancer Rate Calculator — What Should I Charge? | Dayblip",
  description: "Calculate your minimum freelance hourly rate based on income goals, expenses, taxes and benefits. Includes industry benchmarks. Free freelancer calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/freelancer-rate" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
