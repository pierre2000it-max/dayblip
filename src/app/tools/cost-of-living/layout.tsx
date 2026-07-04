import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cost of Living Comparison Calculator 2024 — City vs City",
  description: "Compare cost of living between 50 US cities. See what salary you need in a new city to maintain your lifestyle. Housing, groceries, utilities, and more.",
  keywords: "cost of living calculator, cost of living comparison, salary comparison by city, city cost of living index",
  alternates: { canonical: "https://www.dayblip.com/tools/cost-of-living" },
  openGraph: {
    title: "Cost of Living Comparison Calculator 2024 — City vs City",
    description: "Compare cost of living between 50 US cities. See what salary you need in a new city to maintain your lifestyle.",
    url: "https://www.dayblip.com/tools/cost-of-living",
    images: [{ url: "https://www.dayblip.com/api/og?title=Cost+of+Living+Calculator&emoji=%F0%9F%8F%99%EF%B8%8F&subtitle=50+US+cities+%E2%80%94+salary+equivalent+%E2%80%94+Free&v=2", width: 1200, height: 630, alt: "Cost of Living Comparison Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=Cost+of+Living+Calculator&emoji=%F0%9F%8F%99%EF%B8%8F&subtitle=50+US+cities+%E2%80%94+salary+equivalent+%E2%80%94+Free&v=2"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
