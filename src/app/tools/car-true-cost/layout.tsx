import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "True Cost of Car Ownership Calculator | Dayblip",
  description: "Calculate the real total cost of owning a car including insurance, maintenance, fuel and depreciation.",
  keywords: "true cost of car ownership, total car cost calculator, real cost of owning a car",
  alternates: { canonical: "https://www.dayblip.com/tools/car-true-cost" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
