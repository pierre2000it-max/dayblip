import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tip Calculator — Split Bills and Calculate Tips Instantly",
  description: "Calculate tip amount and split the bill among any number of people. Includes 2026 no-tax-on-tips info for tipped workers. Free tip calculator — no signup.",
  alternates: { canonical: "https://www.dayblip.com/tools/tip-calculator" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
