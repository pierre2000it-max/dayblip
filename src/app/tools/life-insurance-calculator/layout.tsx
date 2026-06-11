import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Life Insurance Calculator — How Much Life Insurance Do I Need? | Dayblip",
  description:
    "Calculate exactly how much life insurance coverage you need based on income dependents debts and future expenses. Free life insurance need calculator. No signup ever.",
  alternates: { canonical: "https://www.dayblip.com/tools/life-insurance-calculator" },
  openGraph: {
    title: "Life Insurance Calculator | Dayblip",
    description:
      "Calculate how much life insurance you need using the DIME method. Free. No signup.",
    url: "https://www.dayblip.com/tools/life-insurance-calculator",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
