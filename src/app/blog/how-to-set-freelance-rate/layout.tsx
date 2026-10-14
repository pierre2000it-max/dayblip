import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Set Your Freelance Hourly Rate in 2026",
  description:
    "To take home $75,000 billing 30 hours a week you need about $82 an hour, not $36. See the full cost breakdown and how billable hours change it. Free.",
  alternates: { canonical: "https://www.dayblip.com/blog/how-to-set-freelance-rate" },
  openGraph: {
    title: "How to Set Your Freelance Hourly Rate in 2026",
    description: "Salary divided by 2,080 hours underprices you. The full cost breakdown behind a freelance rate and how billable hours move it.",
    url: "https://www.dayblip.com/blog/how-to-set-freelance-rate",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
