import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "State Tax Migration Calculator — How Much Would You Save? | Dayblip",
  description: "Calculate how much you would save in state income taxes by moving states. Compare all 50 US states.",
  keywords: "moving states tax savings, state income tax calculator, no income tax states calculator",
  alternates: { canonical: "https://www.dayblip.com/tools/tax-migration" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
