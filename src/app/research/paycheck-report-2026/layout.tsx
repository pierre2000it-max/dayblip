import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "2026 American Paycheck Report: 50-State Take-Home Pay Analysis | Dayblip",
  description:
    "How much of your paycheck do you actually keep? 2026 state-by-state take-home pay data for a $60,000 salary. Free, no signup.",
  alternates: { canonical: "https://www.dayblip.com/research/paycheck-report-2026" },
  openGraph: {
    title: "2026 American Paycheck Report: 50-State Take-Home Pay Analysis | Dayblip",
    description:
      "How much of your paycheck do you actually keep? 2026 state-by-state take-home pay data for a $60,000 salary. Free, no signup.",
    type: "article",
    url: "https://www.dayblip.com/research/paycheck-report-2026",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "2026 American Paycheck Report" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 American Paycheck Report: 50-State Take-Home Pay Analysis | Dayblip",
    description:
      "How much of your paycheck do you actually keep? 2026 state-by-state take-home pay data for a $60,000 salary. Free, no signup.",
  },
}

export default function PaycheckReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
