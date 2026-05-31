import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Habit Cost Calculator — True Cost of Everyday Habits | Dayblip",
  description: "Calculate the shocking true cost of smoking, coffee, alcohol and other habits. See what investing instead could be worth. Educational calculator only.",
  alternates: { canonical: "https://www.dayblip.com/health/habit-cost" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
