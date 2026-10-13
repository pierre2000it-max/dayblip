import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Global Perspective Calculator — Where Do You Stand?",
  description: "See where you stand among the world's 8.2 billion people on income, education, and access. An eye-opening global perspective tool. Free.",
  keywords: "global income calculator, world income percentile, how rich am I compared to the world",
  alternates: { canonical: "https://www.dayblip.com/tools/privilege-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
