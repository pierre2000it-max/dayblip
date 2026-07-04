import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profit Margin Calculator — Gross, Operating & Net Margin",
  description: "Calculate gross profit margin, operating margin and net profit margin. Compare to industry benchmarks. Free business profit margin calculator.",
  alternates: { canonical: "https://www.dayblip.com/finance/profit-margin" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
