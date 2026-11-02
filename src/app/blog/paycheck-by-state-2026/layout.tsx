import type { Metadata } from "next"
import { BENCHMARK_SALARY, BLOG_META_DESCRIPTION, BLOG_OG_DESCRIPTION, REPORT_YEAR, usd } from "@/lib/paycheckReport"

export const metadata: Metadata = {
  title: `Your ${usd(BENCHMARK_SALARY)} Salary by State: ${REPORT_YEAR} Take-Home Data`,
  description: BLOG_META_DESCRIPTION,
  alternates: { canonical: "https://www.dayblip.com/blog/paycheck-by-state-2026" },
  openGraph: {
    title: `Your ${usd(BENCHMARK_SALARY)} Salary Is Worth Very Different Amounts by State`,
    description: BLOG_OG_DESCRIPTION,
    url: "https://www.dayblip.com/blog/paycheck-by-state-2026",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
