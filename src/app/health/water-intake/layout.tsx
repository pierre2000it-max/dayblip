import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Water Intake Calculator — How Much Water Should You Drink Per Day? | Dayblip",
  description:
    "Calculate your recommended daily water intake based on your weight activity level and climate. The 8 glasses rule is not right for everyone.",
  alternates: { canonical: "https://www.dayblip.com/health/water-intake" },
  openGraph: {
    title: "Water Intake Calculator — How Much Water Should You Drink Per Day?",
    description: "Calculate your recommended daily water intake based on your weight activity level and climate.",
    url: "https://www.dayblip.com/health/water-intake",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
