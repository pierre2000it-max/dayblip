import type { Metadata } from "next"
import { BENCHMARK_SALARY, REPORT_YEAR, REPORT_META_DESCRIPTION } from "@/lib/paycheckReport"

const title = `${REPORT_YEAR} American Paycheck Report: 50-State Take-Home Pay`
// Figures come from src/lib/paycheckReport.ts; paycheckReport.test.ts keeps the length at 120-155.
const description = REPORT_META_DESCRIPTION
const ogImage = `/api/og?title=${REPORT_YEAR}+Paycheck+Report&emoji=💵&subtitle=${encodeURIComponent("$" + BENCHMARK_SALARY.toLocaleString("en-US"))}+salary+across+all+50+states`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.dayblip.com/research/paycheck-report-2026" },
  openGraph: {
    title,
    description,
    type: "article",
    url: "https://www.dayblip.com/research/paycheck-report-2026",
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${REPORT_YEAR} American Paycheck Report` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function PaycheckReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
