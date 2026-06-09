import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Macro Calculator — Daily Protein Carbs and Fat Targets | Dayblip",
  description: "Calculate your optimal daily macronutrient targets for weight loss muscle gain or maintenance. Based on your calories activity level and goal. Free. No signup.",
  alternates: { canonical: "https://www.dayblip.com/health/macro-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
