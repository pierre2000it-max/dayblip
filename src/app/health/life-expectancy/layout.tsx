import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Expectancy Calculator — Lifestyle Factors",
  description: "Estimate life expectancy based on lifestyle factors including smoking, exercise, diet and stress. Statistical estimate only. Not medical advice.",
  alternates: { canonical: "https://www.dayblip.com/health/life-expectancy" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
