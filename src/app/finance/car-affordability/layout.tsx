import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Car Affordability Calculator — How Much Car Can I Afford? | Dayblip",
  description: "Calculate how much car you can afford based on income and budget. Includes true cost of ownership with insurance, fuel and maintenance. Free tool.",
  alternates: { canonical: "https://www.dayblip.com/finance/car-affordability" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
