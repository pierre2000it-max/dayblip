import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BMI Calculator — Body Mass Index | Dayblip",
  description: "Calculate your BMI in imperial or metric units. See your category, healthy weight range and visual scale. Screening tool only, not medical advice.",
  alternates: { canonical: "https://www.dayblip.com/health/bmi-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
