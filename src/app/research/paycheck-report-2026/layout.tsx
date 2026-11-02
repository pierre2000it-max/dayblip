import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "2026 American Paycheck Report: 50-State Take-Home Pay",
  description:
    "A $75,000 salary takes home $61,593 in Texas and $55,860 in Oregon. Full 50-state 2026 take-home pay breakdown using IRS and Tax Foundation data.",
  alternates: { canonical: "https://www.dayblip.com/research/paycheck-report-2026" },
  openGraph: {
    title: "2026 American Paycheck Report: 50-State Take-Home Pay",
    description:
      "A $75,000 salary takes home $61,593 in Texas and $55,860 in Oregon. Full 50-state 2026 take-home pay breakdown using IRS and Tax Foundation data.",
    type: "article",
    url: "https://www.dayblip.com/research/paycheck-report-2026",
    images: [{ url: "/api/og?title=2026+Paycheck+Report&emoji=💵&subtitle=%2475%2C000+salary+across+all+50+states", width: 1200, height: 630, alt: "2026 American Paycheck Report" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 American Paycheck Report: 50-State Take-Home Pay",
    description:
      "A $75,000 salary takes home $61,593 in Texas and $55,860 in Oregon. Full 50-state 2026 take-home pay breakdown using IRS and Tax Foundation data.",
  },
}

export default function PaycheckReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
