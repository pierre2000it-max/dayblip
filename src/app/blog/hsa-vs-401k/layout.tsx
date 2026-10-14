import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HSA vs 401k in 2026: Which to Fund First?",
  description:
    "Fund the 401k match first, then the HSA. A payroll HSA also skips FICA tax. 2026 limits and worked examples at 3 salaries. Free take-home pay calculator.",
  alternates: { canonical: "https://www.dayblip.com/blog/hsa-vs-401k" },
  openGraph: {
    title: "HSA vs 401k in 2026: Which to Fund First?",
    description: "An HSA is the only account that skips income tax, FICA tax and withdrawal tax. Worked 2026 examples at 3 salaries and the order to fund each account.",
    url: "https://www.dayblip.com/blog/hsa-vs-401k",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
