import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Health Calculators — BMI, Life Expectancy & More",
  description: "Free health calculators including BMI calculator, life expectancy estimator and habit cost calculator. Educational purposes only.",
  alternates: { canonical: "https://www.dayblip.com/health" },
}

export default function HealthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
