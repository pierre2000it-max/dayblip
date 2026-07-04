import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Calculator — What Could You Achieve?",
  description: "Calculate what skills you could learn with your available daily time. Discover how small daily habits compound.",
  keywords: "learning calculator, what can I learn in a year, skills calculator, how long to learn",
  alternates: { canonical: "https://www.dayblip.com/tools/learning-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
