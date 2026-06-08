import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alcohol Cost Calculator — Financial and Health Cost of Drinking | Dayblip",
  description:
    "Calculate the true financial cost of your drinking habits and what that money would be worth invested. Includes weekly monthly and lifetime cost.",
  alternates: { canonical: "https://www.dayblip.com/health/alcohol-cost" },
  openGraph: {
    title: "Alcohol Cost Calculator — Financial and Health Cost of Drinking",
    description: "Calculate the true financial cost of your drinking habits and what that money would be worth invested.",
    url: "https://www.dayblip.com/health/alcohol-cost",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
