import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The State of the American Paycheck 2026 | $75,000 Salary 50-State Breakdown",
  description:
    "A $75,000 salary takes home $61,390 in Texas and $56,972 in Hawaii. Full 50-state 2026 take-home pay breakdown using verified IRS and Tax Foundation data.",
  alternates: { canonical: "https://www.dayblip.com/research/paycheck-report-2026" },
  openGraph: {
    title: "The State of the American Paycheck 2026 | $75,000 Salary 50-State Breakdown",
    description:
      "A $75,000 salary takes home $61,390 in Texas and $56,972 in Hawaii. Full 50-state 2026 take-home pay breakdown using verified IRS and Tax Foundation data.",
    type: "article",
    url: "https://www.dayblip.com/research/paycheck-report-2026",
    images: [{ url: "/api/og?title=2026+Paycheck+Report&emoji=💵&subtitle=%2475%2C000+salary+across+all+50+states", width: 1200, height: 630, alt: "2026 American Paycheck Report" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The State of the American Paycheck 2026 | $75,000 Salary 50-State Breakdown",
    description:
      "A $75,000 salary takes home $61,390 in Texas and $56,972 in Hawaii. Full 50-state 2026 take-home pay breakdown using verified IRS and Tax Foundation data.",
  },
}

export default function PaycheckReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
