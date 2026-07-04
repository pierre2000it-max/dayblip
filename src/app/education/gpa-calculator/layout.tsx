import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GPA Calculator — Calculate Your Grade Point Average Instantly",
  description: "Calculate your semester and cumulative GPA instantly. Supports weighted and unweighted grades. Free GPA calculator — no signup required.",
  alternates: { canonical: "https://www.dayblip.com/education/gpa-calculator" },
  openGraph: {
    title: "GPA Calculator — Calculate Your Grade Point Average",
    description: "Calculate your semester and cumulative GPA instantly. Weighted and unweighted GPA for high school and college.",
    url: "https://www.dayblip.com/education/gpa-calculator",
    images: [{ url: "https://www.dayblip.com/api/og?title=GPA+Calculator&emoji=%F0%9F%8E%93&subtitle=Semester+and+cumulative+GPA+instantly+%E2%80%94+Free&v=2", width: 1200, height: 630, alt: "GPA Calculator — Dayblip" }],
  },
  twitter: { card: "summary_large_image", images: ["https://www.dayblip.com/api/og?title=GPA+Calculator&emoji=%F0%9F%8E%93&subtitle=Semester+and+cumulative+GPA+instantly+%E2%80%94+Free&v=2"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
