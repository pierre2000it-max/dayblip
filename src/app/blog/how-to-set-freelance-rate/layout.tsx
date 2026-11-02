import type { Metadata } from "next"
import { FREELANCE_META_DESCRIPTION } from "@/lib/examples/freelanceExample"

export const metadata: Metadata = {
  title: "How to Set Your Freelance Hourly Rate in 2026",
  description: FREELANCE_META_DESCRIPTION,
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
