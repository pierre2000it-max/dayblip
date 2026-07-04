import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Insurance Needs Calculator",
  description: "Calculate how much life insurance coverage you need based on income, debts and dependents. Includes term vs whole vs universal comparison. Free tool.",
  alternates: { canonical: "https://www.dayblip.com/health/life-insurance" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
