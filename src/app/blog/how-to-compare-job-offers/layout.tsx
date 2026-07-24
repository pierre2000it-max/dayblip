import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How to Compare Two Job Offers the Right Way in 2026 | Dayblip",
  description:
    "Comparing job offers by gross salary is the most common mistake in career decision-making. A $90,000 California in-office job can be worth less than an $82,000 remote Texas job after full calculation.",
  alternates: {
    canonical: "https://www.dayblip.com/blog/how-to-compare-job-offers",
  },
  openGraph: {
    title: "How to Compare Two Job Offers the Right Way in 2026",
    description:
      "A $90K CA in-office job vs $82K TX remote — the lower salary wins after state tax commute and benefits. The full 6-factor comparison framework.",
    url: "https://www.dayblip.com/blog/how-to-compare-job-offers",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
