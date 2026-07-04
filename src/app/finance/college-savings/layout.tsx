import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "College Savings Calculator — 529 Plan Calculator",
  description: "Calculate how much to save for college with a 529 plan. Projects future tuition costs and shows monthly savings needed. Free college savings calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/college-savings" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
