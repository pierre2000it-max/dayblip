import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tip Calculator — Split Bills and Calculate Tips Instantly | Dayblip",
  description: "Calculate tip amount per person for any bill size and tip percentage. Split among any number of people. Includes no-tax-on-tips info for tipped workers in 2026. Free.",
  alternates: { canonical: "https://www.dayblip.com/tools/tip-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
